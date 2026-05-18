import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  hasConfiguredAdminPassword,
  isValidAdminPassword,
} from "@/lib/admin-auth"

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function POST(request: Request) {
  if (!hasConfiguredAdminPassword()) {
    return NextResponse.json(
      { ok: false, message: "الإعداد غير مكتمل. يرجى ضبط ADMIN_PASSWORD في ملف البيئة." },
      { status: 503 },
    )
  }

  let body: { password?: string } = {}
  try {
    body = (await request.json()) as { password?: string }
  } catch {
    return NextResponse.json({ ok: false, message: "تعذر قراءة بيانات الدخول." }, { status: 400 })
  }

  const password = text(body.password)
  if (!password || !isValidAdminPassword(password)) {
    return NextResponse.json({ ok: false, message: "كلمة المرور غير صحيحة." }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  })

  return NextResponse.json({ ok: true })
}
