import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getDocument, updateDocument } from "@/lib/firebase/admin"
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth"

type RouteContext = { params: Promise<{ id: string }> }

const allowedStatuses = new Set(["pending", "approved", "completed", "cancelled"])

async function ensureAdminSession() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
  return isValidAdminSessionToken(token)
}

export async function GET(_request: Request, context: RouteContext) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json({ ok: false, message: "غير مصرح." }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ ok: false, message: "معرف الحجز غير صالح." }, { status: 400 })
  }

  const booking = await getDocument("bookings", id)
  if (!booking) {
    return NextResponse.json({ ok: false, message: "الحجز غير موجود." }, { status: 404 })
  }

  return NextResponse.json({ ok: true, booking })
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json({ ok: false, message: "غير مصرح." }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ ok: false, message: "معرف الحجز غير صالح." }, { status: 400 })
  }

  let body: { status?: string } = {}
  try {
    body = (await request.json()) as { status?: string }
  } catch {
    return NextResponse.json({ ok: false, message: "تعذر قراءة الطلب." }, { status: 400 })
  }

  const status = String(body.status || "").toLowerCase()
  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ ok: false, message: "حالة الحجز غير صالحة." }, { status: 400 })
  }

  const result = await updateDocument("bookings", id, { status })
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: "تعذر تحديث حالة الحجز." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, status })
}
