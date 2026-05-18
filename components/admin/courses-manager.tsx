"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CourseRecord = {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  price: number
  coverImageUrl: string
  status: "active" | "draft" | "hidden"
  lessonsCount: number
  duration: string
  accessUrl?: string
  createdAt?: string
}

type FormState = {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  price: string
  lessonsCount: string
  duration: string
  coverImageUrl: string
  accessUrl: string
  status: "active" | "draft" | "hidden"
}

const initialForm: FormState = {
  id: "",
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  lessonsCount: "",
  duration: "",
  coverImageUrl: "",
  accessUrl: "",
  status: "active",
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function CoursesManager() {
  const [items, setItems] = useState<CourseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  async function loadCourses() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/admin/courses", { cache: "no-store" })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || "تعذر تحميل الكورسات.")
      setItems(Array.isArray(data.courses) ? data.courses : [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "تعذر تحميل الكورسات.")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCourses()
  }, [])

  async function submitForm(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError("")
    setMessage("")

    const payload = {
      id: toSlug(form.id || form.slug || form.title),
      title: form.title.trim(),
      slug: toSlug(form.slug || form.id || form.title),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      price: Number(form.price || 0),
      lessonsCount: Number(form.lessonsCount || 0),
      duration: form.duration.trim(),
      coverImageUrl: form.coverImageUrl.trim(),
      accessUrl: form.accessUrl.trim(),
      status: form.status,
    }

    try {
      const endpoint = isEditing ? `/api/admin/courses/${encodeURIComponent(editingId || "")}` : "/api/admin/courses"
      const method = isEditing ? "PATCH" : "POST"
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || "تعذر حفظ البيانات.")
      setMessage(isEditing ? "تم تحديث الكورس." : "تم إضافة الكورس.")
      setForm(initialForm)
      setEditingId(null)
      await loadCourses()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "تعذر حفظ البيانات.")
    } finally {
      setSaving(false)
    }
  }

  function startEdit(item: CourseRecord) {
    setEditingId(item.id)
    setForm({
      id: item.id,
      title: item.title || "",
      slug: item.slug || item.id,
      shortDescription: item.shortDescription || "",
      description: item.description || "",
      price: String(item.price ?? ""),
      lessonsCount: String(item.lessonsCount ?? ""),
      duration: item.duration || "",
      coverImageUrl: item.coverImageUrl || "",
      accessUrl: item.accessUrl || "",
      status: item.status || "active",
    })
    setMessage("")
    setError("")
  }

  async function changeStatus(id: string, status: "active" | "draft" | "hidden") {
    setError("")
    setMessage("")
    try {
      const response = await fetch(`/api/admin/courses/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || "تعذر تحديث الحالة.")
      setMessage("تم تحديث الحالة.")
      await loadCourses()
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "تعذر تحديث الحالة.")
    }
  }

  async function removeCourse(id: string) {
    if (!globalThis.confirm("هل تريد حذف هذا الكورس؟")) return
    setError("")
    setMessage("")
    try {
      const response = await fetch(`/api/admin/courses/${encodeURIComponent(id)}`, { method: "DELETE" })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || "تعذر حذف الكورس.")
      setMessage("تم حذف الكورس.")
      if (editingId === id) {
        setEditingId(null)
        setForm(initialForm)
      }
      await loadCourses()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "تعذر حذف الكورس.")
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-black text-foreground">إدارة الكورسات</h1>
        <p className="mt-2 text-muted-foreground">إضافة وتعديل وإخفاء الكورسات من Firebase.</p>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">{isEditing ? "تعديل كورس" : "إضافة كورس جديد"}</h2>
        <form className="mt-5 grid gap-4" onSubmit={submitForm}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course-id">المعرف</Label>
              <Input
                id="course-id"
                value={form.id}
                onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
                placeholder="efham-nafsak"
                disabled={isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-slug">Slug</Label>
              <Input
                id="course-slug"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                placeholder="efham-nafsak"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-title">العنوان</Label>
            <Input
              id="course-title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-short">الوصف المختصر</Label>
            <Input
              id="course-short"
              value={form.shortDescription}
              onChange={(event) => setForm((prev) => ({ ...prev, shortDescription: event.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-description">الوصف الكامل</Label>
            <Textarea
              id="course-description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="min-h-24"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="course-price">السعر</Label>
              <Input
                id="course-price"
                type="number"
                min={0}
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-lessons">عدد الدروس</Label>
              <Input
                id="course-lessons"
                type="number"
                min={0}
                value={form.lessonsCount}
                onChange={(event) => setForm((prev) => ({ ...prev, lessonsCount: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-duration">المدة</Label>
              <Input
                id="course-duration"
                value={form.duration}
                onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
                placeholder="6 أسابيع"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course-image">رابط الغلاف</Label>
              <Input
                id="course-image"
                value={form.coverImageUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-access">رابط الدخول</Label>
              <Input
                id="course-access"
                value={form.accessUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, accessUrl: event.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>الحالة</Label>
            <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as FormState["status"] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="draft">draft</SelectItem>
                <SelectItem value="hidden">hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving} className="rounded-full">
              {saving ? "جاري الحفظ..." : isEditing ? "حفظ التعديلات" : "إضافة الكورس"}
            </Button>
            {isEditing ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full bg-transparent"
                onClick={() => {
                  setEditingId(null)
                  setForm(initialForm)
                }}
              >
                إلغاء التعديل
              </Button>
            ) : null}
          </div>
        </form>

        {error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm font-bold text-destructive">{error}</p> : null}
        {message ? <p className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3 text-sm font-bold">{message}</p> : null}
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">الكورسات الحالية</h2>
        {loading ? <p className="mt-4 text-muted-foreground">جاري التحميل...</p> : null}
        {!loading && items.length === 0 ? <p className="mt-4 text-muted-foreground">لا توجد كورسات بعد.</p> : null}

        <div className="mt-4 grid gap-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.slug} · {item.price?.toLocaleString("en-US")} EGP · {item.status}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.duration} · {item.lessonsCount} درس</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" className="rounded-full" onClick={() => startEdit(item)}>
                    تعديل
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => changeStatus(item.id, "active")}>
                    تفعيل
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => changeStatus(item.id, "draft")}>
                    Draft
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => changeStatus(item.id, "hidden")}>
                    إخفاء
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-full bg-transparent text-destructive" onClick={() => removeCourse(item.id)}>
                    حذف
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
