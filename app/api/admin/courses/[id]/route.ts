import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth"
import { deleteDocument, setDocument } from "@/lib/firebase/admin"

type RouteContext = { params: Promise<{ id: string }> }

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function asNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function asStatus(value: unknown): "active" | "draft" | "hidden" {
  const text = asText(value).toLowerCase()
  if (text === "draft" || text === "hidden") return text
  return "active"
}

async function isAdmin() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
  return isValidAdminSessionToken(token)
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "غير مصرح." }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ ok: false, message: "معرف غير صالح." }, { status: 400 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, message: "بيانات غير صالحة." }, { status: 400 })
  }

  const payload = {
    id,
    title: asText(body.title),
    slug: asText(body.slug) || id,
    description: asText(body.description),
    shortDescription: asText(body.shortDescription),
    price: asNumber(body.price),
    coverImageUrl: asText(body.coverImageUrl),
    status: asStatus(body.status),
    lessonsCount: asNumber(body.lessonsCount),
    duration: asText(body.duration),
    accessUrl: asText(body.accessUrl),
  }

  const result = await setDocument("courses", id, payload, true)
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: "تعذر تحديث الكورس." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "غير مصرح." }, { status: 401 })
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ ok: false, message: "معرف غير صالح." }, { status: 400 })
  }

  const result = await deleteDocument("courses", id)
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: "تعذر حذف الكورس." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
