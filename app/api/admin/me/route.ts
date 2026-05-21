import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, getAdminSessionConfig, getAdminSessionSetupErrors, verifyAdminSession } from "@/lib/admin-session"

export const runtime = "nodejs"

function debugMeLog(payload: { cookieExists: boolean; verified: boolean; reason: string }) {
  if (process.env.NODE_ENV !== "development") return
  console.info("[admin-me]", payload)
}

export async function GET() {
  try {
    const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
    const config = getAdminSessionConfig()
    const configured = config.adminPasswordConfigured && config.sessionSecretConfigured
    const state = verifyAdminSession(token)
    const authenticated = state.ok
    const reason = state.reason
    debugMeLog({
      cookieExists: Boolean(token),
      verified: authenticated,
      reason,
    })

    const payload: {
      authenticated: boolean
      cookieExists: boolean
      cookieName: string
      configured: boolean
      errors?: string[]
      reason?: string
    } = {
      authenticated,
      cookieExists: Boolean(token),
      cookieName: ADMIN_COOKIE_NAME,
      configured,
    }

    if (!authenticated) {
      payload.reason = reason
      payload.errors = configured ? [] : getAdminSessionSetupErrors()
    }

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        cookieExists: false,
        cookieName: ADMIN_COOKIE_NAME,
        configured: false,
        reason: "unknown_error",
        errors: [error instanceof Error ? error.message : "Unknown /api/admin/me failure."],
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    )
  }
}
