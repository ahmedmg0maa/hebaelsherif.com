import "server-only"
import { redirect } from "next/navigation"
import {
  ADMIN_COOKIE_NAME,
  createAdminSession,
  getConfiguredAdminPassword as getConfiguredAdminPasswordFromSession,
  isAdminPasswordConfigured,
  requireAdmin,
  verifyAdminPassword,
  verifyAdminSession,
} from "@/lib/admin-session"

export const ADMIN_SESSION_COOKIE = ADMIN_COOKIE_NAME

type RequireAdminPageOptions = {
  redirectTo?: string
  debugLabel?: string
}

export async function requireAdminPage(options: RequireAdminPageOptions = {}) {
  const { redirectTo = "/admin/login", debugLabel } = options
  const admin = await requireAdmin()
  if (!admin.ok) {
    if (process.env.NODE_ENV === "development" && debugLabel) {
      console.info("[admin-page-auth]", { page: debugLabel, ok: false, reason: admin.reason })
    }
    redirect(redirectTo)
  }

  if (process.env.NODE_ENV === "development" && debugLabel) {
    console.info("[admin-page-auth]", { page: debugLabel, ok: true, reason: admin.reason })
  }

  return admin
}

export function getConfiguredAdminPassword() {
  return getConfiguredAdminPasswordFromSession()
}

export function hasConfiguredAdminPassword() {
  return isAdminPasswordConfigured()
}

export function isValidAdminPassword(password: string) {
  return verifyAdminPassword(password)
}

export function createAdminSessionToken() {
  const session = createAdminSession()
  return session.ok ? session.token : ""
}

export function isValidAdminSessionToken(token?: string | null) {
  return verifyAdminSession(token).ok
}
