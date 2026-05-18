import { NextResponse } from "next/server"
import { listCatalogBooks, listCatalogCourses } from "@/lib/catalog"

export async function GET() {
  const [courses, books] = await Promise.all([
    listCatalogCourses({ onlyActive: true, allowFallback: true }),
    listCatalogBooks({ onlyActive: true, allowFallback: true }),
  ])

  return NextResponse.json({
    ok: true,
    courses,
    books,
  })
}
