export type CourseStage = {
  id: string
  title: string
  description: string
  order: number
}

export type CourseLesson = {
  id: string
  courseId: string
  stageId?: string
  title: string
  description?: string
  duration?: string
  contentUrl?: string
  resourceUrl?: string
  order: number
  isPreview?: boolean
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function numberValue(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function booleanValue(value: unknown) {
  return value === true
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function parseCourseStages(value: unknown): CourseStage[] {
  if (!Array.isArray(value)) return []

  const stages = value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null
      const raw = item as Record<string, unknown>
      const id = toSlug(text(raw.id) || `stage-${index + 1}`)
      const title = text(raw.title)
      if (!id || !title) return null
      return {
        id,
        title,
        description: text(raw.description),
        order: numberValue(raw.order) || index + 1,
      }
    })
    .filter(Boolean) as CourseStage[]

  return stages.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.title.localeCompare(b.title, "ar")))
}

export function parseCourseLessons(value: unknown, courseId: string): CourseLesson[] {
  if (!Array.isArray(value)) return []

  const lessons = value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null
      const raw = item as Record<string, unknown>
      const id = toSlug(text(raw.id) || `${courseId}-lesson-${index + 1}`)
      const title = text(raw.title)
      if (!id || !title) return null
      return {
        id,
        courseId,
        stageId: text(raw.stageId) || undefined,
        title,
        description: text(raw.description) || undefined,
        duration: text(raw.duration) || undefined,
        contentUrl: text(raw.contentUrl || raw.videoUrl) || undefined,
        resourceUrl: text(raw.resourceUrl) || undefined,
        order: numberValue(raw.order) || index + 1,
        isPreview: booleanValue(raw.isPreview),
      }
    })
    .filter(Boolean) as CourseLesson[]

  return lessons.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.title.localeCompare(b.title, "ar")))
}

export function countLessonsByStage(lessons: CourseLesson[], stageId: string) {
  const normalized = text(stageId)
  if (!normalized) return 0
  return lessons.filter((lesson) => text(lesson.stageId) === normalized).length
}

function parseDurationToMinutes(value: string) {
  const raw = text(value).toLowerCase()
  if (!raw) return 0

  const hhmm = /^(\d{1,2}):(\d{2})$/.exec(raw)
  if (hhmm) {
    const hours = Number(hhmm[1])
    const minutes = Number(hhmm[2])
    if (Number.isFinite(hours) && Number.isFinite(minutes)) return Math.max(0, hours * 60 + minutes)
  }

  const matches = [...raw.matchAll(/(\d+)\s*(hour|hours|hr|hrs|h|ساعة|ساعات|دقيقة|دقائق|min|mins|minute|minutes|m)\b/g)]
  if (matches.length) {
    return matches.reduce((total, match) => {
      const amount = Number(match[1] || 0)
      const unit = (match[2] || "").toLowerCase()
      if (!Number.isFinite(amount) || amount <= 0) return total
      if (unit.startsWith("h") || unit.includes("hour") || unit.includes("ساعة")) return total + amount * 60
      return total + amount
    }, 0)
  }

  const justNumber = Number(raw)
  if (Number.isFinite(justNumber) && justNumber > 0) return justNumber
  return 0
}

export function estimateLessonsDurationText(lessons: CourseLesson[]) {
  const totalMinutes = lessons.reduce((total, lesson) => total + parseDurationToMinutes(lesson.duration || ""), 0)
  if (totalMinutes <= 0) return ""

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0 && minutes > 0) return `${hours} ساعة و${minutes} دقيقة تقريبًا`
  if (hours > 0) return `${hours} ساعة تقريبًا`
  return `${minutes} دقيقة تقريبًا`
}

export function buildLearningOutcomes(stages: CourseStage[], lessons: CourseLesson[]) {
  const fromStages = stages.map((stage) => stage.title).filter(Boolean)
  if (fromStages.length) return fromStages.slice(0, 4)

  return lessons.map((lesson) => lesson.title).filter(Boolean).slice(0, 4)
}
