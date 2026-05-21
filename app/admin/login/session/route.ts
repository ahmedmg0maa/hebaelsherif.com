import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  ADMIN_COOKIE_NAME,
  getAdminSessionConfig,
  getAdminSessionSetupErrors,
  verifyAdminSession,
} from "@/lib/admin-session"

export const runtime = "nodejs"

export async function GET() {
  try {
    const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
    const config = getAdminSessionConfig()
    const configured = config.adminPasswordConfigured && config.sessionSecretConfigured
    const sessionState = verifyAdminSession(token)
    const authenticated = sessionState.ok
    const reason = sessionState.reason
    const errors = configured ? [] : getAdminSessionSetupErrors()
    const message = configured ? undefined : errors[0]

    const response = NextResponse.json(
      {
        ok: true,
        configured,
        authenticated,
        reason,
        errors,
        message,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    )
    return response
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        authenticated: false,
        reason: "unknown_error",
        errors: ["Session check failed on the server."],
        message: error instanceof Error ? error.message : "Unknown session check error.",
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
