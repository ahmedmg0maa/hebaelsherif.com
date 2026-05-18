import { getApps, initializeApp, type FirebaseApp } from "firebase/app"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit as limitQuery,
  orderBy,
  query,
  updateDoc,
  where,
  type Firestore,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore"
import { dateKey } from "@/lib/booking-rules"

type StoreDocument = Record<string, unknown>
export type AdminRecord = { id: string } & StoreDocument

type WhereClause = {
  field: string
  op?: WhereFilterOp
  value: unknown
}

type ListOptions = {
  limit?: number
  orderByField?: string
  orderDirection?: "asc" | "desc"
  whereClauses?: WhereClause[]
}

const memoryStore: Record<string, AdminRecord[]> = {}

let cachedApp: FirebaseApp | null = null
let cachedDb: Firestore | null = null

function firebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
}

function canInitFirebase() {
  const config = firebaseConfig()
  return Boolean(config.apiKey && config.projectId && config.appId)
}

function getFirebaseApp() {
  if (!canInitFirebase()) return null
  if (cachedApp) return cachedApp
  cachedApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig())
  return cachedApp
}

function getDb() {
  if (cachedDb) return cachedDb
  const app = getFirebaseApp()
  if (!app) return null
  cachedDb = getFirestore(app)
  return cachedDb
}

function nowISO() {
  return new Date().toISOString()
}

function makeId(collectionName: string) {
  return `${collectionName.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(16).slice(2, 8)}`
}

function toSerializable(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (Array.isArray(value)) return value.map((item) => toSerializable(item))
  if (typeof value !== "object") return value

  const maybeTimestamp = value as { toDate?: () => Date }
  if (typeof maybeTimestamp.toDate === "function") {
    return maybeTimestamp.toDate().toISOString()
  }

  const entries = Object.entries(value as Record<string, unknown>)
  return Object.fromEntries(entries.map(([key, nested]) => [key, toSerializable(nested)]))
}

function remember(collectionName: string, record: AdminRecord) {
  memoryStore[collectionName] ||= []
  memoryStore[collectionName].push(record)
}

export async function addDocument(collectionName: string, data: StoreDocument) {
  const record = {
    ...data,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : nowISO(),
  }

  const db = getDb()
  if (!db) {
    const id = makeId(collectionName)
    const memoryRecord = { id, ...record } as AdminRecord
    remember(collectionName, memoryRecord)
    return { id, memoryMode: true, record: memoryRecord }
  }

  try {
    const ref = await addDoc(collection(db, collectionName), record)
    return { id: ref.id, memoryMode: false, record: { id: ref.id, ...record } as AdminRecord }
  } catch {
    const id = makeId(collectionName)
    const memoryRecord = { id, ...record } as AdminRecord
    remember(collectionName, memoryRecord)
    return { id, memoryMode: true, record: memoryRecord }
  }
}

export async function listDocuments(collectionName: string, options?: ListOptions): Promise<AdminRecord[]> {
  const db = getDb()
  if (!db) {
    const list = memoryStore[collectionName] || []
    return list.slice(0, options?.limit ?? list.length) as AdminRecord[]
  }

  try {
    const constraints: QueryConstraint[] = []
    for (const clause of options?.whereClauses || []) {
      constraints.push(where(clause.field, clause.op || "==", clause.value))
    }
    if (options?.orderByField) {
      constraints.push(orderBy(options.orderByField, options.orderDirection || "desc"))
    }
    if (typeof options?.limit === "number") {
      constraints.push(limitQuery(options.limit))
    }
    const q = constraints.length
      ? query(collection(db, collectionName), ...constraints)
      : query(collection(db, collectionName))

    const snapshot = await getDocs(q)
    return snapshot.docs.map((item) => ({
      id: item.id,
      ...(toSerializable(item.data()) as StoreDocument),
    })) as AdminRecord[]
  } catch {
    const list = memoryStore[collectionName] || []
    return list.slice(0, options?.limit ?? list.length) as AdminRecord[]
  }
}

export async function getDocument(collectionName: string, id: string): Promise<AdminRecord | null> {
  const db = getDb()
  if (!db) {
    return (memoryStore[collectionName] || []).find((item) => String(item.id) === id) || null
  }

  try {
    const ref = doc(db, collectionName, id)
    const snapshot = await getDoc(ref)
    if (!snapshot.exists()) return null
    return { id: snapshot.id, ...(toSerializable(snapshot.data()) as StoreDocument) }
  } catch {
    return (memoryStore[collectionName] || []).find((item) => String(item.id) === id) || null
  }
}

export async function updateDocument(collectionName: string, id: string, data: StoreDocument) {
  const db = getDb()
  const payload = { ...data, updatedAt: nowISO() }

  if (!db) {
    const list = memoryStore[collectionName] || []
    const index = list.findIndex((item) => String(item.id) === id)
    if (index === -1) return { ok: false, memoryMode: true }
    list[index] = { ...list[index], ...payload }
    return { ok: true, memoryMode: true }
  }

  try {
    await updateDoc(doc(db, collectionName, id), payload)
    return { ok: true, memoryMode: false }
  } catch {
    return { ok: false, memoryMode: true }
  }
}

export async function listBookingsForDate(dateISOOrKey: string) {
  const key = dateISOOrKey.slice(0, 10)
  const records = await listDocuments("bookings", {
    whereClauses: [{ field: "startDate", value: key }],
    limit: 250,
  })

  if (records.length > 0) {
    return records
      .map((item) => ({
        startTime: String(item.startTime || ""),
        duration: Number(item.duration || 60),
        status: item.status ? String(item.status) : undefined,
      }))
      .filter((item) => item.startTime)
  }

  const memoryMatches = (memoryStore.bookings || []).filter(
    (item) =>
      String(item.startDate || "") === key ||
      String(item.startTime || "").slice(0, 10) === key ||
      (item.startTime instanceof Date && dateKey(item.startTime) === key),
  )
  return memoryMatches
    .map((item) => ({
      startTime: String(item.startTime || ""),
      duration: Number(item.duration || 60),
      status: item.status ? String(item.status) : undefined,
    }))
    .filter((item) => item.startTime)
}
