import { NextResponse } from "next/server"
import { requireAdmin, unauthorizedAdminResponse } from "@/lib/admin-session"
import { getDocument, getFirebaseAdminErrorMessage, listDocuments, setDocument } from "@/lib/firebase/admin"
import { normalizeGoogleDriveCoverUrl, normalizeGoogleDriveResourceUrl } from "@/lib/google-drive"
import { trackServerEvent } from "@/lib/analytics"
import { toSlug } from "@/lib/course-journey"

export const runtime = "nodejs"

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

function asBoolean(value: unknown) {
  return value === true
}

function isValidHttpsUrl(value: string) {
  const raw = asText(value)
  if (!raw) return false
  try {
    const parsed = new URL(raw)
    return parsed.protocol === "https:"
  } catch {
    return false
  }
}

function normalizeStages(value: unknown) {
  if (!Array.isArray(value)) return undefined

  const stages = value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null
      const raw = item as Record<string, unknown>
      const stageId = toSlug(asText(raw.id) || `stage-${index + 1}`)
      const title = asText(raw.title)
      if (!stageId || !title) return null

      return {
        id: stageId,
        title,
        description: asText(raw.description),
        order: asNumber(raw.order) || index + 1,
      }
    })
    .filter(Boolean) as Array<{ id: string; title: string; description: string; order: number }>

  if (!stages.length) return []
  return stages.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.title.localeCompare(b.title, "ar")))
}

function normalizeLessons(value: unknown, courseId: string, stageIds: Set<string>) {
  if (!Array.isArray(value)) return { lessons: undefined as undefined | Array<Record<string, unknown>>, invalidUrl: false }

  let invalidUrl = false
  const lessons = value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null
      const raw = item as Record<string, unknown>
      const lessonId = toSlug(asText(raw.id) || `${courseId}-lesson-${index + 1}`)
      const title = asText(raw.title)
      const normalizedContentUrl = normalizeGoogleDriveResourceUrl(asText(raw.contentUrl || raw.videoUrl))
      const normalizedResourceUrl = normalizeGoogleDriveResourceUrl(asText(raw.resourceUrl))
      const stageId = toSlug(asText(raw.stageId))
      if (!lessonId || !title || !normalizedContentUrl) return null

      if (!isValidHttpsUrl(normalizedContentUrl)) {
        invalidUrl = true
        return null
      }
      if (normalizedResourceUrl && !isValidHttpsUrl(normalizedResourceUrl)) {
        invalidUrl = true
        return null
      }

      const canValidateStage = stageIds.size > 0
      return {
        id: lessonId,
        courseId,
        stageId: stageId && (!canValidateStage || stageIds.has(stageId)) ? stageId : "",
        title,
        description: asText(raw.description),
        contentUrl: normalizedContentUrl,
        resourceUrl: normalizedResourceUrl || "",
        duration: asText(raw.duration),
        order: asNumber(raw.order) || index + 1,
        isPreview: asBoolean(raw.isPreview),
      }
    })
    .filter(Boolean) as Array<{
    id: string
    courseId: string
    stageId: string
    title: string
    description: string
    contentUrl: string
    resourceUrl: string
    duration: string
    order: number
    isPreview: boolean
  }>

  const sorted = lessons.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.title.localeCompare(b.title, "ar")))
  return { lessons: sorted.length ? sorted : [], invalidUrl }
}

export async function GET(request: Request) {
  const admin = await requireAdmin()
  if (!admin.ok) {
    return unauthorizedAdminResponse(admin)
  }

  const url = new URL(request.url)
  const rawLimit = Number.parseInt(url.searchParams.get("limit") || "100", 10)
  const limit = Math.min(300, Math.max(20, Number.isFinite(rawLimit) ? rawLimit : 100))

  const courses = await listDocuments("courses", {
    orderByField: "createdAt",
    orderDirection: "desc",
    limit,
  })
  return NextResponse.json({ ok: true, courses })
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin.ok) {
    return unauthorizedAdminResponse(admin)
  }

  let body: Record<string, unknown> = {}
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, message: "بيانات غير صالحة." }, { status: 400 })
  }

  const title = asText(body.title)
  const slug = toSlug(asText(body.slug) || title)
  const id = toSlug(asText(body.id) || slug)
  if (!title || !id || !slug) {
    return NextResponse.json({ ok: false, message: "يرجى إدخال عنوان ومعرف صالح." }, { status: 400 })
  }

  const existing = await getDocument("courses", id)
  if (existing) {
    return NextResponse.json({ ok: false, message: "هذا المعرف مستخدم بالفعل." }, { status: 409 })
  }

  const normalizedStages = normalizeStages(body.stages)
  const stageIds = new Set((normalizedStages || []).map((stage) => stage.id))
  const normalizedLessonsResult = normalizeLessons(body.lessons, id, stageIds)
  if (normalizedLessonsResult.invalidUrl) {
    return NextResponse.json({ ok: false, message: "يوجد رابط درس غير صالح. يجب أن يبدأ الرابط بـ https://." }, { status: 400 })
  }

  const normalizedAccessUrl = normalizeGoogleDriveResourceUrl(asText(body.accessUrl))
  if (normalizedAccessUrl && !isValidHttpsUrl(normalizedAccessUrl)) {
    return NextResponse.json({ ok: false, message: "رابط دخول الكورس غير صالح. يجب أن يبدأ بـ https://." }, { status: 400 })
  }

  const now = new Date().toISOString()
  const payload = {
    id,
    title,
    slug,
    description: asText(body.description),
    shortDescription: asText(body.shortDescription),
    price: asNumber(body.price),
    coverImageUrl: normalizeGoogleDriveCoverUrl(asText(body.coverImageUrl)),
    status: asStatus(body.status),
    lessonsCount: asNumber(body.lessonsCount),
    duration: asText(body.duration),
    accessUrl: normalizedAccessUrl,
    createdAt: now,
    updatedAt: now,
    ...(normalizedStages ? { stages: normalizedStages } : {}),
    ...(normalizedLessonsResult.lessons ? { lessons: normalizedLessonsResult.lessons } : {}),
  }

  if (Array.isArray(payload.lessons) && payload.lessons.length > 0) {
    payload.lessonsCount = payload.lessons.length
  }

  const result = await setDocument("courses", id, payload, false)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: getFirebaseAdminErrorMessage(result.error) || "تعذر حفظ الكورس." },
      { status: 500 },
    )
  }

  void trackServerEvent("admin_action", {
    resource: "course",
    action: "create",
    courseId: id,
    status: payload.status,
  })

  return NextResponse.json({ ok: true, id })
}
