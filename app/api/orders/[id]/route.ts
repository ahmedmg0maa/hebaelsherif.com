import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getDocument, updateDocument } from "@/lib/firebase/admin"
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth"

type RouteContext = { params: Promise<{ id: string }> }

const allowedStatuses = new Set(["pending", "paid", "cancelled"])

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
    return NextResponse.json({ ok: false, message: "معرف الطلب غير صالح." }, { status: 400 })
  }

  const order = await getDocument("orders", id)
  if (!order) {
    return NextResponse.json({ ok: false, message: "الطلب غير موجود." }, { status: 404 })
  }

  return NextResponse.json({ ok: true, order })
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json({ ok: false, message: "غير مصرح." }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ ok: false, message: "معرف الطلب غير صالح." }, { status: 400 })
  }

  let body: { status?: string } = {}
  try {
    body = (await request.json()) as { status?: string }
  } catch {
    return NextResponse.json({ ok: false, message: "تعذر قراءة الطلب." }, { status: 400 })
  }

  const status = String(body.status || "").toLowerCase()
  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ ok: false, message: "حالة الطلب غير صالحة." }, { status: 400 })
  }

  const result = await updateDocument("orders", id, { status })
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: "تعذر تحديث حالة الطلب." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, status })
}
