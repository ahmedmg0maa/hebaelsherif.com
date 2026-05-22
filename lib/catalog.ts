import { getDocument, listDocuments, type AdminRecord } from "@/lib/firebase/admin"
import { getProductCoverImage } from "@/lib/images"
import {
  buildLearningOutcomes,
  estimateLessonsDurationText,
  parseCourseLessons,
  parseCourseStages,
  type CourseLesson,
  type CourseStage,
} from "@/lib/course-journey"

export type ProductStatus = "active" | "draft" | "hidden"

export type CourseProduct = {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  price: number
  coverImageUrl: string
  status: ProductStatus
  lessonsCount: number
  duration: string
  accessUrl?: string
  stages: CourseStage[]
  lessons: Array<Omit<CourseLesson, "contentUrl" | "resourceUrl">>
  estimatedDuration: string
  whatYouWillLearn: string[]
  createdAt?: string
  updatedAt?: string
}

export type BookProduct = {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  price: number
  coverImageUrl: string
  fileUrl?: string
  status: ProductStatus
  createdAt?: string
  updatedAt?: string
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function asNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function asStatus(value: unknown): ProductStatus {
  const text = asText(value).toLowerCase()
  if (text === "draft" || text === "hidden") return text
  if (text === "published" || text === "active") return "active"
  return "active"
}

function mapCourseRecord(record: AdminRecord): CourseProduct | null {
  const id = asText(record.id)
  const slug = asText(record.slug) || id
  const title = asText(record.title)
  if (!id || !slug || !title) return null

  const stages = parseCourseStages(record.stages)
  const rawLessons = parseCourseLessons(record.lessons, id)
  const publicLessons = rawLessons.map((lesson) => ({
    id: lesson.id,
    courseId: lesson.courseId,
    stageId: lesson.stageId,
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    order: lesson.order,
    isPreview: lesson.isPreview,
  }))
  const lessonsCount = asNumber(record.lessonsCount) || publicLessons.length
  const estimatedDuration = estimateLessonsDurationText(rawLessons)

  return {
    id,
    title,
    slug,
    description: asText(record.description),
    shortDescription: asText(record.shortDescription),
    price: asNumber(record.price),
    coverImageUrl: getProductCoverImage(record),
    status: asStatus(record.status),
    lessonsCount,
    duration: asText(record.duration),
    accessUrl: asText(record.accessUrl || record.fileUrl),
    stages,
    lessons: publicLessons,
    estimatedDuration,
    whatYouWillLearn: buildLearningOutcomes(stages, rawLessons),
    createdAt: asText(record.createdAt),
    updatedAt: asText(record.updatedAt),
  }
}

function mapBookRecord(record: AdminRecord): BookProduct | null {
  const id = asText(record.id)
  const slug = asText(record.slug) || id
  const title = asText(record.title)
  if (!id || !slug || !title) return null

  return {
    id,
    title,
    slug,
    description: asText(record.description),
    shortDescription: asText(record.shortDescription),
    price: asNumber(record.price),
    coverImageUrl: getProductCoverImage(record),
    fileUrl: asText(record.fileUrl || record.accessUrl),
    status: asStatus(record.status),
    createdAt: asText(record.createdAt),
    updatedAt: asText(record.updatedAt),
  }
}

export async function listCatalogCourses(options?: { onlyActive?: boolean }) {
  const records = await listDocuments("courses", {
    orderByField: "createdAt",
    orderDirection: "desc",
    limit: 1000,
  })
  const courses = records.map(mapCourseRecord).filter(Boolean) as CourseProduct[]
  if (options?.onlyActive) return courses.filter((item) => item.status === "active")
  return courses
}

export async function listCatalogBooks(options?: { onlyActive?: boolean }) {
  const records = await listDocuments("books", {
    orderByField: "createdAt",
    orderDirection: "desc",
    limit: 1000,
  })
  const books = records.map(mapBookRecord).filter(Boolean) as BookProduct[]
  if (options?.onlyActive) return books.filter((item) => item.status === "active")
  return books
}

async function getCourseFromFirestore(slugOrId: string) {
  const byId = await getDocument("courses", slugOrId)
  const byIdMapped = byId ? mapCourseRecord(byId) : null
  if (byIdMapped) return byIdMapped

  const bySlug = await listDocuments("courses", {
    whereClauses: [{ field: "slug", value: slugOrId }],
    limit: 1,
  })
  return bySlug.length ? mapCourseRecord(bySlug[0]) : null
}

async function getBookFromFirestore(slugOrId: string) {
  const byId = await getDocument("books", slugOrId)
  const byIdMapped = byId ? mapBookRecord(byId) : null
  if (byIdMapped) return byIdMapped

  const bySlug = await listDocuments("books", {
    whereClauses: [{ field: "slug", value: slugOrId }],
    limit: 1,
  })
  return bySlug.length ? mapBookRecord(bySlug[0]) : null
}

export async function getCatalogCourseBySlug(slugOrId: string) {
  const course = await getCourseFromFirestore(slugOrId)
  if (!course || course.status !== "active") return null
  return course
}

export async function getCatalogBookBySlug(slugOrId: string) {
  const book = await getBookFromFirestore(slugOrId)
  if (!book || book.status !== "active") return null
  return book
}
