import { NextResponse } from "next/server"
import { deleteDocument, getFirebaseAdminErrorMessage, setDocument } from "@/lib/firebase/admin"
import { requireAdmin, unauthorizedAdminResponse } from "@/lib/admin-session"
import { normalizeGoogleDriveCoverUrl, normalizeGoogleDriveResourceUrl } from "@/lib/google-drive"
import { trackServerEvent } from "@/lib/analytics"
import { toSlug } from "@/lib/course-journey"

type RouteContext = { params: Promise<{ id: string }> }

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

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdmin()
  if (!admin.ok) {
    return unauthorizedAdminResponse(admin)
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

  const payload: Record<string, unknown> = {}
  if ("title" in body) payload.title = asText(body.title)
  if ("slug" in body) payload.slug = asText(body.slug) || id
  if ("description" in body) payload.description = asText(body.description)
  if ("shortDescription" in body) payload.shortDescription = asText(body.shortDescription)
  if ("price" in body) payload.price = asNumber(body.price)
  if ("coverImageUrl" in body) payload.coverImageUrl = normalizeGoogleDriveCoverUrl(asText(body.coverImageUrl))
  if ("status" in body) payload.status = asStatus(body.status)
  if ("lessonsCount" in body) payload.lessonsCount = asNumber(body.lessonsCount)
  if ("duration" in body) payload.duration = asText(body.duration)
  if ("stages" in body) payload.stages = normalizeStages(body.stages) || []
  const stageIds = new Set((Array.isArray(payload.stages) ? payload.stages : []).map((stage) => String((stage as { id?: unknown }).id || "")))
  if ("accessUrl" in body) {
    const normalizedAccessUrl = normalizeGoogleDriveResourceUrl(asText(body.accessUrl))
    if (normalizedAccessUrl && !isValidHttpsUrl(normalizedAccessUrl)) {
      return NextResponse.json({ ok: false, message: "رابط دخول الكورس غير صالح. يجب أن يبدأ بـ https://." }, { status: 400 })
    }
    payload.accessUrl = normalizedAccessUrl
  }
  if ("lessons" in body) {
    const normalizedLessons = normalizeLessons(body.lessons, id, stageIds)
    if (normalizedLessons.invalidUrl) {
      return NextResponse.json({ ok: false, message: "يوجد رابط درس غير صالح. يجب أن يبدأ الرابط بـ https://." }, { status: 400 })
    }
    payload.lessons = normalizedLessons.lessons || []
  }

  if (Array.isArray(payload.lessons) && payload.lessons.length > 0 && !("lessonsCount" in payload)) {
    payload.lessonsCount = payload.lessons.length
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ ok: false, message: "لا توجد بيانات للتحديث." }, { status: 400 })
  }

  const result = await setDocument("courses", id, payload, true)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: getFirebaseAdminErrorMessage(result.error) || "تعذر تحديث الكورس." },
      { status: 500 },
    )
  }

  void trackServerEvent("admin_action", {
    resource: "course",
    action: "update",
    courseId: id,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdmin()
  if (!admin.ok) {
    return unauthorizedAdminResponse(admin)
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ ok: false, message: "معرف غير صالح." }, { status: 400 })
  }

  const result = await deleteDocument("courses", id)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: getFirebaseAdminErrorMessage(result.error) || "تعذر حذف الكورس." },
      { status: 500 },
    )
  }

  void trackServerEvent("admin_action", {
    resource: "course",
    action: "delete",
    courseId: id,
  })

  return NextResponse.json({ ok: true })
}
