import { NextRequest, NextResponse } from "next/server"
import { buildAdminDiagnostics } from "@/lib/admin-diagnostics"
import { requireAdmin, unauthorizedAdminResponse } from "@/lib/admin-session"
import { deleteDocument, listDocuments, setDocument } from "@/lib/firebase/admin"

export const runtime = "nodejs"

type DiagnosticsAction = "create_test_book" | "create_test_course" | "delete_test_data"

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function nowIso() {
  return new Date().toISOString()
}

function buildTestId(prefix: "book" | "course") {
  return `test-${prefix}-${Date.now()}`
}

async function createTestBook() {
  const id = buildTestId("book")
  const now = nowIso()
  const payload = {
    id,
    title: `[TEST] كتاب تجريبي ${id}`,
    slug: id,
    shortDescription: "سجل اختبار تشخيصي",
    description: "تم إنشاؤه من صفحة التشخيص لغرض QA فقط.",
    price: 1,
    status: "active",
    coverImageUrl: "",
    fileUrl: "",
    createdAt: now,
    updatedAt: now,
  }
  const write = await setDocument("books", id, payload, false)
  return {
    ok: write.ok,
    message: write.ok ? "تم إنشاء كتاب اختبار بنجاح." : write.message || "تعذر إنشاء كتاب الاختبار.",
  }
}

async function createTestCourse() {
  const id = buildTestId("course")
  const now = nowIso()
  const payload = {
    id,
    title: `[TEST] كورس تجريبي ${id}`,
    slug: id,
    shortDescription: "سجل اختبار تشخيصي",
    description: "تم إنشاؤه من صفحة التشخيص لغرض QA فقط.",
    price: 1,
    status: "active",
    lessonsCount: 0,
    duration: "مرن",
    coverImageUrl: "",
    accessUrl: "",
    createdAt: now,
    updatedAt: now,
  }
  const write = await setDocument("courses", id, payload, false)
  return {
    ok: write.ok,
    message: write.ok ? "تم إنشاء كورس اختبار بنجاح." : write.message || "تعذر إنشاء كورس الاختبار.",
  }
}

async function deleteTestRecordsFromCollection(collectionName: "books" | "courses") {
  const records = await listDocuments(collectionName, { orderByField: "createdAt", orderDirection: "desc", limit: 1000 })
  const testRecords = records.filter((item) => text(item.title).startsWith("[TEST]"))
  let deleted = 0

  for (const item of testRecords) {
    const result = await deleteDocument(collectionName, item.id)
    if (result.ok) deleted += 1
  }

  return {
    scanned: records.length,
    matched: testRecords.length,
    deleted,
  }
}

async function deleteTestData() {
  const books = await deleteTestRecordsFromCollection("books")
  const courses = await deleteTestRecordsFromCollection("courses")
  return {
    ok: true,
    message: "تم حذف سجلات [TEST] من الكتب والكورسات.",
    stats: { books, courses },
  }
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) {
    return unauthorizedAdminResponse(admin, "غير مصرح")
  }

  const diagnostics = await buildAdminDiagnostics(true)
  return NextResponse.json({
    ok: true,
    diagnostics,
  })
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin.ok) {
    return unauthorizedAdminResponse(admin, "غير مصرح")
  }

  let body: { action?: DiagnosticsAction } = {}
  try {
    body = (await request.json()) as { action?: DiagnosticsAction }
  } catch {
    return NextResponse.json({ ok: false, message: "تعذر قراءة طلب التشخيص." }, { status: 400 })
  }

  const action = body.action
  if (!action) {
    return NextResponse.json({ ok: false, message: "الإجراء مطلوب." }, { status: 400 })
  }

  if (action === "create_test_book") {
    const result = await createTestBook()
    return NextResponse.json(result, { status: result.ok ? 200 : 500 })
  }

  if (action === "create_test_course") {
    const result = await createTestCourse()
    return NextResponse.json(result, { status: result.ok ? 200 : 500 })
  }

  if (action === "delete_test_data") {
    const result = await deleteTestData()
    return NextResponse.json(result, { status: 200 })
  }

  return NextResponse.json({ ok: false, message: "إجراء غير معروف." }, { status: 400 })
}
