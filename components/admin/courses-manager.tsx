"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ProductCover } from "@/components/product-cover"
import { toast } from "@/hooks/use-toast"
import { toSlug } from "@/lib/course-journey"

type CourseStage = {
  id: string
  title: string
  description: string
  order: number
}

type CourseLesson = {
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
  stages?: CourseStage[]
  lessons?: CourseLesson[]
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
  stages: CourseStage[]
  lessons: CourseLesson[]
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
  stages: [],
  lessons: [],
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function toNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function isValidHttpsUrl(value: string) {
  const raw = text(value)
  if (!raw) return false
  try {
    const parsed = new URL(raw)
    return parsed.protocol === "https:"
  } catch {
    return false
  }
}

function statusLabel(status: "active" | "draft" | "hidden") {
  if (status === "active") return "نشط"
  if (status === "draft") return "مسودة"
  return "مخفي"
}

function normalizeStages(value: unknown) {
  if (!Array.isArray(value)) return []
  const stages = value
    .map((stage, index) => {
      if (!stage || typeof stage !== "object") return null
      const raw = stage as Record<string, unknown>
      return {
        id: text(raw.id) || `stage-${index + 1}`,
        title: text(raw.title),
        description: text(raw.description),
        order: toNumber(raw.order) || index + 1,
      }
    })
    .filter((stage): stage is CourseStage => Boolean(stage))
  return stages.sort((a, b) => a.order - b.order)
}

function normalizeLessons(value: unknown, courseId: string) {
  if (!Array.isArray(value)) return []
  const lessons: Array<CourseLesson | null> = value
    .map((lesson, index) => {
      if (!lesson || typeof lesson !== "object") return null
      const raw = lesson as Record<string, unknown>
      return {
        id: text(raw.id) || `${courseId || "course"}-lesson-${index + 1}`,
        courseId: text(raw.courseId) || courseId,
        stageId: text(raw.stageId) || undefined,
        title: text(raw.title),
        description: text(raw.description) || undefined,
        duration: text(raw.duration) || undefined,
        contentUrl: text(raw.contentUrl) || text(raw.videoUrl) || undefined,
        resourceUrl: text(raw.resourceUrl) || undefined,
        order: toNumber(raw.order) || index + 1,
        isPreview: raw.isPreview === true,
      }
    })
  const filtered = lessons.filter((lesson): lesson is CourseLesson => lesson !== null)
  return filtered.sort((a, b) => a.order - b.order)
}

function createStage(index: number): CourseStage {
  const order = index + 1
  return {
    id: `stage-${order}`,
    title: "",
    description: "",
    order,
  }
}

function createLesson(courseId: string, index: number): CourseLesson {
  const order = index + 1
  return {
    id: `${courseId || "course"}-lesson-${order}`,
    courseId,
    stageId: undefined,
    title: "",
    description: "",
    duration: "",
    contentUrl: "",
    resourceUrl: "",
    order,
    isPreview: false,
  }
}

function moveItem<T extends { order: number }>(items: T[], index: number, direction: "up" | "down") {
  const nextIndex = direction === "up" ? index - 1 : index + 1
  if (nextIndex < 0 || nextIndex >= items.length) return items
  const copy = [...items]
  const [moved] = copy.splice(index, 1)
  copy.splice(nextIndex, 0, moved)
  return copy.map((item, mappedIndex) => ({ ...item, order: mappedIndex + 1 }))
}

export function CoursesManager() {
  const router = useRouter()
  const [items, setItems] = useState<CourseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  const loadCourses = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/courses?limit=200", {
        cache: "no-store",
        credentials: "include",
      })
      if (response.status === 401) {
        router.replace("/admin/login")
        router.refresh()
        return
      }
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || "تعذر تحميل الكورسات.")
      setItems(Array.isArray(data.courses) ? data.courses : [])
    } catch (error) {
      setItems([])
      toast({
        title: "تعذر تحميل الكورسات",
        description: error instanceof Error ? error.message : "تعذر تحميل الكورسات.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void loadCourses()
  }, [loadCourses])

  async function submitForm(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)

    const safeId = toSlug(form.id || form.slug || form.title)
    const payload = {
      id: safeId,
      title: text(form.title),
      slug: toSlug(form.slug || form.id || form.title),
      shortDescription: text(form.shortDescription),
      description: text(form.description),
      price: Number(form.price || 0),
      lessonsCount: form.lessons.length || Number(form.lessonsCount || 0),
      duration: text(form.duration),
      coverImageUrl: text(form.coverImageUrl),
      accessUrl: text(form.accessUrl),
      status: form.status,
      stages: form.stages.map((stage, index) => ({
        ...stage,
        id: toSlug(stage.id || stage.title || `stage-${index + 1}`),
        title: text(stage.title),
        description: text(stage.description),
        order: index + 1,
      })),
      lessons: form.lessons.map((lesson, index) => ({
        ...lesson,
        id: toSlug(lesson.id || lesson.title || `${safeId}-lesson-${index + 1}`),
        courseId: safeId,
        stageId: text(lesson.stageId) || "",
        title: text(lesson.title),
        description: text(lesson.description),
        duration: text(lesson.duration),
        contentUrl: text(lesson.contentUrl || lesson.resourceUrl),
        resourceUrl: text(lesson.resourceUrl),
        order: index + 1,
        isPreview: lesson.isPreview === true,
      })),
    }

    if (!payload.title) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى إدخال عنوان الكورس.",
        variant: "destructive",
      })
      setSaving(false)
      return
    }

    if (payload.accessUrl && !isValidHttpsUrl(payload.accessUrl)) {
      toast({
        title: "رابط الكورس غير صالح",
        description: "رابط الدخول الرئيسي يجب أن يبدأ بـ https://",
        variant: "destructive",
      })
      setSaving(false)
      return
    }

    const invalidLesson = payload.lessons.find((lesson) => !lesson.title || !lesson.contentUrl || !isValidHttpsUrl(lesson.contentUrl))
    if (invalidLesson) {
      toast({
        title: "بيانات درس غير مكتملة",
        description: "تأكدي أن كل درس له عنوان ورابط صالح يبدأ بـ https://",
        variant: "destructive",
      })
      setSaving(false)
      return
    }

    const invalidResource = payload.lessons.find((lesson) => lesson.resourceUrl && !isValidHttpsUrl(lesson.resourceUrl))
    if (invalidResource) {
      toast({
        title: "رابط مورد غير صالح",
        description: "الرابط الإضافي للدرس يجب أن يبدأ بـ https://",
        variant: "destructive",
      })
      setSaving(false)
      return
    }

    try {
      const endpoint = isEditing ? `/api/admin/courses/${encodeURIComponent(editingId || "")}` : "/api/admin/courses"
      const method = isEditing ? "PATCH" : "POST"
      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || "تعذر حفظ بيانات الكورس.")

      toast({
        title: isEditing ? "تم تحديث الكورس" : "تمت إضافة الكورس",
        description: "تم حفظ البيانات بنجاح.",
      })

      setForm(initialForm)
      setEditingId(null)
      await loadCourses()
    } catch (error) {
      toast({
        title: "تعذر حفظ الكورس",
        description: error instanceof Error ? error.message : "تعذر حفظ بيانات الكورس.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  function startEdit(item: CourseRecord) {
    const itemId = text(item.id)
    setEditingId(itemId)
    setForm({
      id: itemId,
      title: item.title || "",
      slug: item.slug || itemId,
      shortDescription: item.shortDescription || "",
      description: item.description || "",
      price: String(item.price ?? ""),
      lessonsCount: String(item.lessonsCount ?? ""),
      duration: item.duration || "",
      coverImageUrl: item.coverImageUrl || "",
      accessUrl: item.accessUrl || "",
      status: item.status || "active",
      stages: normalizeStages(item.stages),
      lessons: normalizeLessons(item.lessons, itemId),
    })
  }

  async function changeStatus(id: string, status: "active" | "draft" | "hidden") {
    try {
      const response = await fetch(`/api/admin/courses/${encodeURIComponent(id)}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || "تعذر تحديث الحالة.")
      toast({ title: "تم تحديث الحالة" })
      await loadCourses()
    } catch (error) {
      toast({
        title: "تعذر تحديث الحالة",
        description: error instanceof Error ? error.message : "تعذر تحديث الحالة.",
        variant: "destructive",
      })
    }
  }

  async function removeCourse(id: string) {
    if (!globalThis.confirm("هل تريد حذف هذا الكورس؟")) return

    try {
      const response = await fetch(`/api/admin/courses/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || "تعذر حذف الكورس.")
      toast({ title: "تم حذف الكورس" })
      if (editingId === id) {
        setEditingId(null)
        setForm(initialForm)
      }
      await loadCourses()
    } catch (error) {
      toast({
        title: "تعذر حذف الكورس",
        description: error instanceof Error ? error.message : "تعذر حذف الكورس.",
        variant: "destructive",
      })
    }
  }

  function updateStage(index: number, patch: Partial<CourseStage>) {
    setForm((previous) => {
      const stages = [...previous.stages]
      stages[index] = { ...stages[index], ...patch }
      return { ...previous, stages }
    })
  }

  function deleteStage(index: number) {
    setForm((previous) => {
      const removed = previous.stages[index]
      const stages = previous.stages.filter((_, i) => i !== index).map((stage, mappedIndex) => ({ ...stage, order: mappedIndex + 1 }))
      const lessons = previous.lessons.map((lesson) => ({
        ...lesson,
        stageId: lesson.stageId === removed.id ? "" : lesson.stageId,
      }))
      return { ...previous, stages, lessons }
    })
  }

  function moveStage(index: number, direction: "up" | "down") {
    setForm((previous) => ({ ...previous, stages: moveItem(previous.stages, index, direction) }))
  }

  function addStage() {
    setForm((previous) => ({
      ...previous,
      stages: [...previous.stages, createStage(previous.stages.length)],
    }))
  }

  function updateLesson(index: number, patch: Partial<CourseLesson>) {
    setForm((previous) => {
      const lessons = [...previous.lessons]
      lessons[index] = { ...lessons[index], ...patch }
      return { ...previous, lessons }
    })
  }

  function deleteLesson(index: number) {
    setForm((previous) => ({
      ...previous,
      lessons: previous.lessons.filter((_, i) => i !== index).map((lesson, mappedIndex) => ({ ...lesson, order: mappedIndex + 1 })),
    }))
  }

  function moveLesson(index: number, direction: "up" | "down") {
    setForm((previous) => ({ ...previous, lessons: moveItem(previous.lessons, index, direction) }))
  }

  function addLesson() {
    const courseId = toSlug(form.id || form.slug || form.title || "course")
    setForm((previous) => ({
      ...previous,
      lessons: [...previous.lessons, createLesson(courseId, previous.lessons.length)],
    }))
  }

  return (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-black text-foreground">إدارة الكورسات</h1>
        <p className="mt-2 text-muted-foreground">إضافة وتعديل الكورسات كمراحل ودروس مع روابط Google Drive، وترتيب آمن قبل الحفظ.</p>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">{isEditing ? "تعديل كورس" : "إضافة كورس جديد"}</h2>
        <form className="mt-5 grid gap-5" onSubmit={submitForm}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course-id">المعرف</Label>
              <Input
                id="course-id"
                value={form.id}
                onChange={(event) => setForm((prev) => ({ ...prev, id: event.target.value }))}
                placeholder="course-id"
                disabled={isEditing}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-slug">Slug</Label>
              <Input
                id="course-slug"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                placeholder="course-id"
                className="w-full"
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
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-short">الوصف المختصر</Label>
            <Input
              id="course-short"
              value={form.shortDescription}
              onChange={(event) => setForm((prev) => ({ ...prev, shortDescription: event.target.value }))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-description">الوصف الكامل</Label>
            <Textarea
              id="course-description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="min-h-24 w-full"
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
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-lessons">عدد الدروس (تلقائي عند إضافة دروس)</Label>
              <Input
                id="course-lessons"
                type="number"
                min={0}
                value={form.lessons.length ? String(form.lessons.length) : form.lessonsCount}
                onChange={(event) => setForm((prev) => ({ ...prev, lessonsCount: event.target.value }))}
                className="w-full"
                disabled={form.lessons.length > 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-duration">المدة</Label>
              <Input
                id="course-duration"
                value={form.duration}
                onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
                placeholder="6 أسابيع"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-image">رابط صورة الغلاف</Label>
            <Input
              id="course-image"
              value={form.coverImageUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
              placeholder="https://drive.google.com/file/d/FILE_ID/view"
              className="w-full"
            />
            <div className="max-w-[220px]">
              <ProductCover title={form.title || "غلاف الكورس"} imageUrl={form.coverImageUrl} kind="course" className="aspect-[4/3]" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-access">رابط دخول الكورس (للتوافق الخلفي)</Label>
            <Input
              id="course-access"
              value={form.accessUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, accessUrl: event.target.value }))}
              placeholder="https://drive.google.com/drive/folders/FOLDER_ID"
              className="w-full"
            />
            <p className="text-xs leading-6 text-muted-foreground">إذا لم تضيفي دروسًا، سيظهر هذا الزر للمستخدم المدفوع: \"دخول الكورس\".</p>
          </div>

          <div className="space-y-2">
            <Label>الحالة</Label>
            <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as FormState["status"] }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="hidden">مخفي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <section className="rounded-2xl border border-border bg-background p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-foreground">مراحل الكورس</h3>
              <Button type="button" variant="outline" onClick={addStage} className="rounded-full bg-transparent">
                <Plus className="h-4 w-4" />
                إضافة مرحلة
              </Button>
            </div>

            {form.stages.length === 0 ? <p className="text-sm text-muted-foreground">لا توجد مراحل بعد. يمكنك إضافة مرحلة أو ترك الدروس بدون مراحل.</p> : null}

            <div className="space-y-3">
              {form.stages.map((stage, index) => (
                <article key={`stage-${index}`} className="rounded-xl border border-border bg-card p-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>معرف المرحلة</Label>
                      <Input
                        value={stage.id}
                        onChange={(event) => updateStage(index, { id: toSlug(event.target.value) })}
                        placeholder={`stage-${index + 1}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>عنوان المرحلة</Label>
                      <Input value={stage.title} onChange={(event) => updateStage(index, { title: event.target.value })} />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Label>وصف المرحلة</Label>
                    <Textarea value={stage.description} onChange={(event) => updateStage(index, { description: event.target.value })} className="min-h-20" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => moveStage(index, "up")} disabled={index === 0} className="rounded-full bg-transparent">
                      <ArrowUp className="h-4 w-4" />
                      أعلى
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => moveStage(index, "down")}
                      disabled={index === form.stages.length - 1}
                      className="rounded-full bg-transparent"
                    >
                      <ArrowDown className="h-4 w-4" />
                      أسفل
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => deleteStage(index)} className="rounded-full bg-transparent text-destructive">
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-foreground">دروس الكورس</h3>
              <Button type="button" variant="outline" onClick={addLesson} className="rounded-full bg-transparent">
                <Plus className="h-4 w-4" />
                إضافة درس
              </Button>
            </div>

            {form.lessons.length === 0 ? <p className="text-sm text-muted-foreground">لا توجد دروس بعد. أضيفي أول درس ثم اربطيه بمرحلة إن رغبتِ.</p> : null}

            <div className="space-y-3">
              {form.lessons.map((lesson, index) => (
                <article key={`lesson-${index}`} className="rounded-xl border border-border bg-card p-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>معرف الدرس</Label>
                      <Input
                        value={lesson.id}
                        onChange={(event) => updateLesson(index, { id: toSlug(event.target.value) })}
                        placeholder={`${toSlug(form.id || form.slug || "course") || "course"}-lesson-${index + 1}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>عنوان الدرس</Label>
                      <Input value={lesson.title} onChange={(event) => updateLesson(index, { title: event.target.value })} />
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>المرحلة (اختياري)</Label>
                      <Select value={lesson.stageId || "none"} onValueChange={(value) => updateLesson(index, { stageId: value === "none" ? "" : value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="بدون مرحلة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">بدون مرحلة</SelectItem>
                          {form.stages.map((stage) => (
                            <SelectItem key={stage.id} value={stage.id}>
                              {stage.title || stage.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>المدة</Label>
                      <Input value={lesson.duration || ""} onChange={(event) => updateLesson(index, { duration: event.target.value })} placeholder="25 دقيقة" />
                    </div>

                    <div className="space-y-2">
                      <Label>درس مجاني (Preview)</Label>
                      <Select value={lesson.isPreview ? "yes" : "no"} onValueChange={(value) => updateLesson(index, { isPreview: value === "yes" })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">لا</SelectItem>
                          <SelectItem value="yes">نعم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <Label>وصف الدرس</Label>
                    <Textarea value={lesson.description || ""} onChange={(event) => updateLesson(index, { description: event.target.value })} className="min-h-20" />
                  </div>

                  <div className="mt-3 space-y-2">
                    <Label>رابط محتوى الدرس (Google Drive)</Label>
                    <Input
                      value={lesson.contentUrl || ""}
                      onChange={(event) => updateLesson(index, { contentUrl: event.target.value })}
                      placeholder="https://drive.google.com/file/d/FILE_ID/view"
                    />
                  </div>

                  <div className="mt-3 space-y-2">
                    <Label>رابط مورد إضافي (اختياري)</Label>
                    <Input
                      value={lesson.resourceUrl || ""}
                      onChange={(event) => updateLesson(index, { resourceUrl: event.target.value })}
                      placeholder="https://drive.google.com/drive/folders/FOLDER_ID"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => moveLesson(index, "up")} disabled={index === 0} className="rounded-full bg-transparent">
                      <ArrowUp className="h-4 w-4" />
                      أعلى
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => moveLesson(index, "down")}
                      disabled={index === form.lessons.length - 1}
                      className="rounded-full bg-transparent"
                    >
                      <ArrowDown className="h-4 w-4" />
                      أسفل
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => deleteLesson(index)}
                      className="rounded-full bg-transparent text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
                    {lesson.contentUrl ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(lesson.contentUrl, "_blank", "noopener,noreferrer")}
                        className="rounded-full bg-transparent"
                      >
                        <ExternalLink className="h-4 w-4" />
                        معاينة الرابط
                      </Button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving} className="rounded-full">
              {saving ? "جارٍ الحفظ..." : isEditing ? "حفظ التعديلات" : "إضافة الكورس"}
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
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-black text-foreground">الكورسات الحالية</h2>
        {loading ? <p className="mt-4 text-muted-foreground">جارٍ التحميل...</p> : null}
        {!loading && items.length === 0 ? <p className="mt-4 text-muted-foreground">لا توجد كورسات بعد.</p> : null}

        <div className="mt-4 grid gap-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-3 max-w-[160px]">
                    <ProductCover title={item.title} imageUrl={item.coverImageUrl} kind="course" className="aspect-[4/3]" />
                  </div>
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground break-words">
                    {item.slug} · {toNumber(item.price).toLocaleString("ar-EG")} ج.م · {statusLabel(item.status)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Array.isArray(item.stages) ? item.stages.length : 0} مراحل · {Array.isArray(item.lessons) ? item.lessons.length : item.lessonsCount || 0} دروس
                  </p>
                  {item.accessUrl ? <p className="mt-1 max-w-full break-all text-[11px] leading-5 text-muted-foreground">{item.accessUrl}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" className="rounded-full" onClick={() => startEdit(item)}>
                    تعديل
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => changeStatus(item.id, "active")}>
                    تفعيل
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => changeStatus(item.id, "draft")}>
                    مسودة
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => changeStatus(item.id, "hidden")}>
                    إخفاء
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full bg-transparent text-destructive"
                    onClick={() => removeCourse(item.id)}
                  >
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
