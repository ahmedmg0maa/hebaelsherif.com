import { timingSafeEqual } from "node:crypto"

// Temporary guard for admin routes.
// Replace this with Firebase Auth roles when full auth rollout is ready.
export const ADMIN_SESSION_COOKIE = "heba_admin_session"

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)
  if (aBuffer.length !== bBuffer.length) return false
  return timingSafeEqual(aBuffer, bBuffer)
}

export function getConfiguredAdminPassword() {
  return (process.env.ADMIN_PASSWORD || "").trim()
}

export function hasConfiguredAdminPassword() {
  return Boolean(getConfiguredAdminPassword())
}

export function isValidAdminPassword(password: string) {
  const configured = getConfiguredAdminPassword()
  if (!configured) return false
  return safeEqual(configured, password.trim())
}

export function createAdminSessionToken() {
  return getConfiguredAdminPassword()
}

export function isValidAdminSessionToken(token?: string | null) {
  if (!token) return false
  const expected = createAdminSessionToken()
  if (!expected) return false
  return safeEqual(expected, token)
}
