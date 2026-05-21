import Link from "next/link"
import { ArrowRight, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCover } from "@/components/product-cover"
import { listCatalogCourses } from "@/lib/catalog"

export async function CoursesPreview() {
  const courses = (await listCatalogCourses({ onlyActive: true })).slice(0, 3)

  return (
    <section className="section-padding" dir="rtl">
      <div className="container-brand">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">الكورسات</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-foreground sm:text-5xl">
              اختاري المسار الذي يحول الوعي إلى تطبيق يومي
            </h2>
          </div>
          <Link href="/courses">
            <Button variant="outline" className="rounded-full bg-transparent">
              تصفحي الكورسات
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-border bg-card p-8 text-center text-muted-foreground">
            لا توجد كورسات نشطة الآن.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {courses.map((course) => (
              <article key={course.id} className="hover-lift overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
                <ProductCover title={course.title} imageUrl={course.coverImageUrl} kind="course" className="aspect-[4/3] rounded-none" />
                <div className="p-6">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">رحلة تحول</span>
                  <h3 className="mt-4 text-2xl font-black leading-tight text-foreground">{course.title}</h3>
                  <p className="mt-3 font-semibold text-primary">{course.shortDescription || "ابدئي الرحلة بإيقاع هادئ."}</p>
                  <p className="mt-3 line-clamp-3 leading-7 text-muted-foreground">
                    {course.description || "كورس عملي يقدّم خطوات واضحة للتطبيق اليومي."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                      <Clock className="h-4 w-4" />
                      {course.duration || "مرن"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                      <BookOpen className="h-4 w-4" />
                      {course.lessonsCount ? `${course.lessonsCount} درس` : "عدد الدروس حسب التحديث"}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">السعر</p>
                      <p className="text-2xl font-black text-primary latin">{course.price.toLocaleString("ar-EG")} ج.م</p>
                    </div>
                    <Link href={`/courses/${course.slug || course.id}`}>
                      <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">ابدئي الرحلة</Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
