import { getApps, initializeApp } from "firebase/app"
import { getAnalytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCgoOTQHBaNTzsdN2e2dhYX-3rQZPsRsJQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hebaelsherif-3c8ce.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hebaelsherif-3c8ce",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hebaelsherif-3c8ce.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "445958123582",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:445958123582:web:f3ca734b4b45731761216f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YXG7W4P06T",
}

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export async function initFirebaseAnalytics() {
  if (typeof window === "undefined") return null
  const supported = await isSupported().catch(() => false)
  return supported ? getAnalytics(firebaseApp) : null
}
