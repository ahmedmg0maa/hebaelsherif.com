import { books as fallbackBooks, courses as fallbackCourses } from "@/lib/site-data"
import { getDocument, listDocuments, type AdminRecord } from "@/lib/firebase/admin"

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
  return "active"
}

function mapCourseRecord(record: AdminRecord): CourseProduct | null {
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
    coverImageUrl: asText(record.coverImageUrl),
    status: asStatus(record.status),
    lessonsCount: asNumber(record.lessonsCount),
    duration: asText(record.duration),
    accessUrl: asText(record.accessUrl),
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
    coverImageUrl: asText(record.coverImageUrl),
    fileUrl: asText(record.fileUrl),
    status: asStatus(record.status),
    createdAt: asText(record.createdAt),
    updatedAt: asText(record.updatedAt),
  }
}

function fallbackCourseCatalog(): CourseProduct[] {
  return fallbackCourses.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.id,
    description: item.description,
    shortDescription: item.subtitle,
    price: item.price,
    coverImageUrl: "",
    status: "active",
    lessonsCount: item.lessons,
    duration: item.duration,
    accessUrl: "",
    createdAt: "",
    updatedAt: "",
  }))
}

function fallbackBookCatalog(): BookProduct[] {
  return fallbackBooks.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.id,
    description: item.description,
    shortDescription: item.subtitle,
    price: item.price,
    coverImageUrl: "",
    fileUrl: "",
    status: "active",
    createdAt: "",
    updatedAt: "",
  }))
}

export async function listCatalogCourses(options?: { onlyActive?: boolean; allowFallback?: boolean }) {
  const records = await listDocuments("courses", {
    orderByField: "createdAt",
    orderDirection: "desc",
    limit: 1000,
  })
  const mapped = records.map(mapCourseRecord).filter(Boolean) as CourseProduct[]

  const base = records.length === 0 && options?.allowFallback !== false ? fallbackCourseCatalog() : mapped
  if (options?.onlyActive) return base.filter((item) => item.status === "active")
  return base
}

export async function listCatalogBooks(options?: { onlyActive?: boolean; allowFallback?: boolean }) {
  const records = await listDocuments("books", {
    orderByField: "createdAt",
    orderDirection: "desc",
    limit: 1000,
  })
  const mapped = records.map(mapBookRecord).filter(Boolean) as BookProduct[]

  const base = records.length === 0 && options?.allowFallback !== false ? fallbackBookCatalog() : mapped
  if (options?.onlyActive) return base.filter((item) => item.status === "active")
  return base
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
  const product = await getCourseFromFirestore(slugOrId)
  if (product) return product
  const hasAnyCourses = (await listDocuments("courses", { limit: 1 })).length > 0
  if (hasAnyCourses) return null
  return fallbackCourseCatalog().find((item) => item.id === slugOrId || item.slug === slugOrId) || null
}

export async function getCatalogBookBySlug(slugOrId: string) {
  const product = await getBookFromFirestore(slugOrId)
  if (product) return product
  const hasAnyBooks = (await listDocuments("books", { limit: 1 })).length > 0
  if (hasAnyBooks) return null
  return fallbackBookCatalog().find((item) => item.id === slugOrId || item.slug === slugOrId) || null
}
