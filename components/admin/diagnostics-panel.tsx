"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type SafeEnvCheck = {
  key: string
  required: boolean
  present: boolean
}

type CollectionCheck = {
  ok: boolean
  count: number
  message: string
}

type AdminDiagnosticsPayload = {
  generatedAt: string
  adminSessionValid: boolean
  deployment: {
    nodeEnv: string
    vercelEnv: string
    vercelRegion: string
    vercelUrl: string
  }
  firebaseAdmin: {
    configured: boolean
    initialized: boolean
    message: string
  }
  firestore: {
    reachable: boolean
    message: string
  }
  collections: {
    books: CollectionCheck
    courses: CollectionCheck
    orders: CollectionCheck
    bookings: CollectionCheck
  }
  env: {
    checks: SafeEnvCheck[]
    missingRequired: string[]
  }
}

type ActionKey = "create_test_book" | "create_test_course" | "delete_test_data"

function statusBadge(ok: boolean) {
  return ok
    ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800"
    : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800"
}

export function DiagnosticsPanel({ initialDiagnostics }: { initialDiagnostics: AdminDiagnosticsPayload }) {
  const [diagnostics, setDiagnostics] = useState(initialDiagnostics)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<ActionKey | "">("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function refreshDiagnostics() {
    setLoading(true)
    setError("")
    setMessage("")
    try {
      const response = await fetch("/api/admin/diagnostics", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })
      const result = (await response.json()) as { ok: boolean; diagnostics?: AdminDiagnosticsPayload; message?: string }
      if (!response.ok || !result.ok || !result.diagnostics) {
        throw new Error(result.message || "تعذر تحديث بيانات التشخيص.")
      }
      setDiagnostics(result.diagnostics)
      setMessage("تم تحديث التشخيص بنجاح.")
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "تعذر تحديث بيانات التشخيص.")
    } finally {
      setLoading(false)
    }
  }

  async function runAction(action: ActionKey) {
    setActionLoading(action)
    setError("")
    setMessage("")
    try {
      const response = await fetch("/api/admin/diagnostics", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const result = (await response.json()) as { ok: boolean; message?: string }
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "فشل تنفيذ إجراء الاختبار.")
      }
      setMessage(result.message || "تم تنفيذ الإجراء بنجاح.")
      await refreshDiagnostics()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "فشل تنفيذ إجراء الاختبار.")
    } finally {
      setActionLoading("")
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-foreground">تشخيص البيئة والتشغيل</h1>
            <p className="mt-2 text-sm text-muted-foreground">معلومات آمنة للتحقق من جاهزية الإنتاج دون إظهار أي أسرار.</p>
            <p className="mt-1 text-xs text-muted-foreground">آخر تحديث: {new Date(diagnostics.generatedAt).toLocaleString("ar-EG")}</p>
          </div>
          <Button onClick={() => void refreshDiagnostics()} disabled={loading} className="rounded-full">
            {loading ? "جارٍ التحديث..." : "تحديث التشخيص"}
          </Button>
        </div>

        {message ? <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">{message}</p> : null}
        {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{error}</p> : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">جلسة الأدمن</p>
          <p className={statusBadge(diagnostics.adminSessionValid)}>{diagnostics.adminSessionValid ? "صالحة" : "غير صالحة"}</p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Firebase Admin</p>
          <p className={statusBadge(diagnostics.firebaseAdmin.initialized)}>{diagnostics.firebaseAdmin.initialized ? "مهيأ" : "غير مهيأ"}</p>
          <p className="mt-2 text-xs text-muted-foreground">{diagnostics.firebaseAdmin.message}</p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Firestore</p>
          <p className={statusBadge(diagnostics.firestore.reachable)}>{diagnostics.firestore.reachable ? "متاح" : "غير متاح"}</p>
          <p className="mt-2 text-xs text-muted-foreground">{diagnostics.firestore.message}</p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">بيئة النشر</p>
          <p className="mt-2 text-sm font-bold text-foreground">{diagnostics.deployment.vercelEnv}</p>
          <p className="mt-1 text-xs text-muted-foreground">NODE_ENV: {diagnostics.deployment.nodeEnv}</p>
          <p className="mt-1 break-all text-xs text-muted-foreground">URL: {diagnostics.deployment.vercelUrl}</p>
        </article>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">عدّادات البيانات</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">الكتب</p>
            <p className="mt-1 text-2xl font-black text-foreground latin">{diagnostics.collections.books.count}</p>
            <p className="mt-1 text-xs text-muted-foreground">{diagnostics.collections.books.message}</p>
          </article>
          <article className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">الكورسات</p>
            <p className="mt-1 text-2xl font-black text-foreground latin">{diagnostics.collections.courses.count}</p>
            <p className="mt-1 text-xs text-muted-foreground">{diagnostics.collections.courses.message}</p>
          </article>
          <article className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">الطلبات</p>
            <p className="mt-1 text-2xl font-black text-foreground latin">{diagnostics.collections.orders.count}</p>
            <p className="mt-1 text-xs text-muted-foreground">{diagnostics.collections.orders.message}</p>
          </article>
          <article className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">الحجوزات</p>
            <p className="mt-1 text-2xl font-black text-foreground latin">{diagnostics.collections.bookings.count}</p>
            <p className="mt-1 text-xs text-muted-foreground">{diagnostics.collections.bookings.message}</p>
          </article>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">فحص المتغيرات (آمن)</h2>
        {diagnostics.env.missingRequired.length > 0 ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
            متغيرات مطلوبة مفقودة: {diagnostics.env.missingRequired.join("، ")}
          </p>
        ) : (
          <p className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">
            جميع المتغيرات المطلوبة موجودة.
          </p>
        )}
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {diagnostics.env.checks.map((item) => (
            <div key={item.key} className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <span className="font-bold text-foreground">{item.key}</span>
              <span className="mr-2 text-muted-foreground">{item.present ? "موجود" : "مفقود"}</span>
              <span className="mr-2 text-xs text-muted-foreground">{item.required ? "(مطلوب)" : "(اختياري)"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">قائمة smoke test اليدوية</h2>
        <div className="mt-4 grid gap-3">
          <article className="rounded-xl border border-border bg-background p-4">
            <p className="font-bold text-foreground">اختبار إضافة كتاب</p>
            <p className="mt-1 text-sm text-muted-foreground">أضيفي كتابًا نشطًا من لوحة الكتب ثم تأكدي من ظهوره في /books وصفحة التفاصيل.</p>
          </article>
          <article className="rounded-xl border border-border bg-background p-4">
            <p className="font-bold text-foreground">اختبار إضافة كورس</p>
            <p className="mt-1 text-sm text-muted-foreground">أضيفي كورسًا نشطًا ثم تأكدي من ظهوره في /courses وصفحة التفاصيل.</p>
          </article>
          <article className="rounded-xl border border-border bg-background p-4">
            <p className="font-bold text-foreground">اختبار الحجز</p>
            <p className="mt-1 text-sm text-muted-foreground">أنشئي حجزًا من الواجهة، ثم راجعيه من /admin/bookings وحدثي الحالة.</p>
          </article>
          <article className="rounded-xl border border-border bg-background p-4">
            <p className="font-bold text-foreground">اختبار الطلب والدفع</p>
            <p className="mt-1 text-sm text-muted-foreground">أنشئي طلب شراء من checkout ثم حدّثي حالته إلى paid من /admin/orders.</p>
          </article>
          <article className="rounded-xl border border-border bg-background p-4">
            <p className="font-bold text-foreground">اختبار المحتوى المحمي</p>
            <p className="mt-1 text-sm text-muted-foreground">بعد تحويل الحالة إلى paid، تأكدي من ظهور المنتج في الحساب وفتح الصفحة المحمية فقط للمستخدم المدفوع.</p>
          </article>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">أدوات اختبار آمنة (اختيارية)</h2>
        <p className="mt-2 text-sm text-muted-foreground">لن يتم إنشاء أي بيانات اختبار إلا بعد الضغط على أحد الأزرار التالية.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => void runAction("create_test_book")} disabled={Boolean(actionLoading)} className="rounded-full">
            {actionLoading === "create_test_book" ? "جارٍ الإنشاء..." : "إنشاء Test Book"}
          </Button>
          <Button onClick={() => void runAction("create_test_course")} disabled={Boolean(actionLoading)} className="rounded-full" variant="outline">
            {actionLoading === "create_test_course" ? "جارٍ الإنشاء..." : "إنشاء Test Course"}
          </Button>
          <Button onClick={() => void runAction("delete_test_data")} disabled={Boolean(actionLoading)} className="rounded-full" variant="outline">
            {actionLoading === "delete_test_data" ? "جارٍ الحذف..." : "حذف بيانات [TEST]"}
          </Button>
        </div>
      </section>
    </div>
  )
}
