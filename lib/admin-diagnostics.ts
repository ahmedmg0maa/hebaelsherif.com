import "server-only"
import {
  checkFirestoreReachable,
  getCollectionCount,
  getFirebaseAdminInitializationStatus,
} from "@/lib/firebase/admin"

type SafeEnvCheck = {
  key: string
  required: boolean
  present: boolean
}

type CollectionCheck = {
  ok: boolean
  count: number
  message: string
}

export type AdminDiagnosticsPayload = {
  generatedAt: string
  adminSessionValid: boolean
  deployment: {
    nodeEnv: string
    vercelEnv: string
    vercelRegion: string
    vercelUrl: string
  }
  firebaseAdmin: {
    configured: boolean
    initialized: boolean
    message: string
  }
  firestore: {
    reachable: boolean
    message: string
  }
  collections: {
    books: CollectionCheck
    courses: CollectionCheck
    orders: CollectionCheck
    bookings: CollectionCheck
  }
  env: {
    checks: SafeEnvCheck[]
    missingRequired: string[]
  }
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function getEnvChecks(): SafeEnvCheck[] {
  const required = [
    "ADMIN_PASSWORD",
    "ADMIN_SESSION_SECRET",
    "FIREBASE_SERVICE_ACCOUNT_JSON",
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ]

  const optional = ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", "VERCEL_ENV", "VERCEL_URL", "VERCEL_REGION"]

  return [
    ...required.map((key) => ({
      key,
      required: true,
      present: Boolean(text(process.env[key])),
    })),
    ...optional.map((key) => ({
      key,
      required: false,
      present: Boolean(text(process.env[key])),
    })),
  ]
}

function emptyCollectionCheck(message: string): CollectionCheck {
  return { ok: false, count: 0, message }
}

export async function buildAdminDiagnostics(adminSessionValid: boolean): Promise<AdminDiagnosticsPayload> {
  const generatedAt = new Date().toISOString()
  const envChecks = getEnvChecks()
  const missingRequired = envChecks.filter((item) => item.required && !item.present).map((item) => item.key)

  const firebaseAdmin = getFirebaseAdminInitializationStatus()
  const firestoreHealth = firebaseAdmin.initialized
    ? await checkFirestoreReachable()
    : {
        ok: false,
        message: firebaseAdmin.message,
      }

  const collections =
    firestoreHealth.ok
      ? {
          books: await getCollectionCount("books"),
          courses: await getCollectionCount("courses"),
          orders: await getCollectionCount("orders"),
          bookings: await getCollectionCount("bookings"),
        }
      : {
          books: emptyCollectionCheck("Skipped because Firestore is not reachable."),
          courses: emptyCollectionCheck("Skipped because Firestore is not reachable."),
          orders: emptyCollectionCheck("Skipped because Firestore is not reachable."),
          bookings: emptyCollectionCheck("Skipped because Firestore is not reachable."),
        }

  return {
    generatedAt,
    adminSessionValid,
    deployment: {
      nodeEnv: text(process.env.NODE_ENV) || "unknown",
      vercelEnv: text(process.env.VERCEL_ENV) || "unknown",
      vercelRegion: text(process.env.VERCEL_REGION) || "unknown",
      vercelUrl: text(process.env.VERCEL_URL) || "unknown",
    },
    firebaseAdmin,
    firestore: {
      reachable: firestoreHealth.ok,
      message: firestoreHealth.message,
    },
    collections,
    env: {
      checks: envChecks,
      missingRequired,
    },
  }
}
