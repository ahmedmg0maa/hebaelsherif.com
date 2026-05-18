import { getApps, initializeApp, type FirebaseApp } from "firebase/app"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit as limitQuery,
  orderBy,
  query,
  setDoc,
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

export function isFirebaseConfigured() {
  const config = firebaseConfig()
  return Boolean(config.apiKey && config.projectId && config.appId)
}

function getFirebaseApp() {
  if (!isFirebaseConfigured()) return null
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

export async function addDocument(collectionName: string, data: StoreDocument) {
  const db = getDb()
  if (!db) {
    return { ok: false, id: "", error: "FIREBASE_NOT_CONFIGURED" }
  }

  const record = {
    ...data,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : nowISO(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : nowISO(),
  }

  try {
    const ref = await addDoc(collection(db, collectionName), record)
    return { ok: true, id: ref.id, record: { id: ref.id, ...record } as AdminRecord }
  } catch {
    return { ok: false, id: "", error: "WRITE_FAILED" }
  }
}

export async function listDocuments(collectionName: string, options?: ListOptions): Promise<AdminRecord[]> {
  const db = getDb()
  if (!db) return []

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
    return []
  }
}

export async function getDocument(collectionName: string, id: string): Promise<AdminRecord | null> {
  const db = getDb()
  if (!db) return null

  try {
    const ref = doc(db, collectionName, id)
    const snapshot = await getDoc(ref)
    if (!snapshot.exists()) return null
    return { id: snapshot.id, ...(toSerializable(snapshot.data()) as StoreDocument) }
  } catch {
    return null
  }
}

export async function updateDocument(collectionName: string, id: string, data: StoreDocument) {
  const db = getDb()
  if (!db) return { ok: false, error: "FIREBASE_NOT_CONFIGURED" }

  const payload = { ...data, updatedAt: nowISO() }
  try {
    await updateDoc(doc(db, collectionName, id), payload)
    return { ok: true }
  } catch {
    return { ok: false, error: "UPDATE_FAILED" }
  }
}

export async function setDocument(collectionName: string, id: string, data: StoreDocument, merge = true) {
  const db = getDb()
  if (!db) return { ok: false, error: "FIREBASE_NOT_CONFIGURED" }

  const payload = {
    ...data,
    updatedAt: nowISO(),
  }

  if (!merge) {
    const createdAt =
      typeof data.createdAt === "string" && data.createdAt.trim().length > 0 ? data.createdAt : nowISO()
    Object.assign(payload, { createdAt })
  }

  try {
    await setDoc(doc(db, collectionName, id), payload, { merge })
    return { ok: true }
  } catch {
    return { ok: false, error: "SET_FAILED" }
  }
}

export async function deleteDocument(collectionName: string, id: string) {
  const db = getDb()
  if (!db) return { ok: false, error: "FIREBASE_NOT_CONFIGURED" }

  try {
    await deleteDoc(doc(db, collectionName, id))
    return { ok: true }
  } catch {
    return { ok: false, error: "DELETE_FAILED" }
  }
}

export async function listBookingsForDate(dateISOOrKey: string) {
  const key = dateISOOrKey.slice(0, 10)
  const records = await listDocuments("bookings", {
    whereClauses: [{ field: "startDate", value: key }],
    limit: 400,
  })

  return records
    .map((item) => ({
      startTime: String(item.startTime || ""),
      duration: Number(item.duration || 60),
      status: item.status ? String(item.status) : undefined,
      startDate: String(item.startDate || dateKey(new Date(String(item.startTime || "")))),
    }))
    .filter((item) => item.startTime)
}
