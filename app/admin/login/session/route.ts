import { NextResponse } from "next/server"
import { clearAdminSessionCookie, requireAdmin, shouldClearAdminSessionCookie } from "@/lib/admin-session"
import { validateAdminEnv } from "@/lib/env-validation"

export const runtime = "nodejs"

export async function GET() {
  try {
    const admin = await requireAdmin()
    const env = validateAdminEnv()
    const configured = env.session.adminPasswordConfigured && env.session.sessionSecretConfigured
    const message = !configured || env.errors.length > 0 ? env.errors[0] || "Admin environment is not configured." : undefined

    const response = NextResponse.json(
      {
        ok: true,
        configured,
        authenticated: admin.ok,
        reason: admin.reason,
        env: {
          session: env.session,
          firebaseServiceAccount: env.firebaseServiceAccount,
          firebasePublic: env.firebasePublic,
        },
        errors: env.errors,
        message,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    )
    if (!admin.ok && shouldClearAdminSessionCookie(admin.reason)) {
      clearAdminSessionCookie(response)
    }
    return response
  } catch (error) {
    const response = NextResponse.json(
      {
        ok: false,
        configured: false,
        authenticated: false,
        reason: "unknown_error",
        errors: ["تعذر التحقق من إعدادات الجلسة. راجعي سجلات الخادم على Vercel."],
        message: error instanceof Error ? error.message : "Unknown session check error.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    )
    clearAdminSessionCookie(response)
    return response
  }
}
