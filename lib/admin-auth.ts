import { timingSafeEqual } from "node:crypto"

export const ADMIN_SESSION_COOKIE = "admin-auth"
const ADMIN_SESSION_VALUE = "true"

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
  return ADMIN_SESSION_VALUE
}

export function isValidAdminSessionToken(token?: string | null) {
  if (!token) return false
  if (!hasConfiguredAdminPassword()) return false
  return safeEqual(ADMIN_SESSION_VALUE, token)
}
