import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { JourneyCard } from "@/components/premium/journey-card"
import { PremiumBadge } from "@/components/premium/premium-badge"
import { PremiumEmptyState } from "@/components/premium/premium-empty-state"
import { PremiumSection } from "@/components/premium/premium-section"
import { listCatalogCourses } from "@/lib/catalog"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hebaelsharif.com"

type PageProps = {
  searchParams: Promise<{ category?: string }>
}

const categories = [
  { key: "all", label: "الكل" },
  { key: "self", label: "فهم الذات" },
  { key: "relationships", label: "العلاقات" },
  { key: "money", label: "المال" },
  { key: "leadership", label: "القيادة" },
] as const

type CategoryKey = (typeof categories)[number]["key"]

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function detectCategory(input: string): CategoryKey {
  const value = input.toLowerCase()
  if (/علاقة|الحدود|تواصل|زواج|شريك|أسرة/.test(value)) return "relationships"
  if (/مال|ثروة|دخل|استحقاق|رزق/.test(value)) return "money"
  if (/قيادة|فريق|إدارة|مسؤولية|قرار/.test(value)) return "leadership"
  return "self"
}

export const metadata: Metadata = {
  title: "الكورسات",
  description: "مسارات عربية عملية مصممة كرحلات تحول عاطفي وذهني بخطوات واضحة.",
  alternates: {
    canonical: "/courses",
  },
  openGraph: {
    title: "كورسات هبة الشريف",
    description: "رحلات تعلم عميقة تساعدك على بناء وعي متزن واستمرار تطبيقي في الحياة اليومية.",
    url: `${siteUrl}/courses`,
    images: ["/images/heba-banner.jpeg"],
  },
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const { category = "all" } = await searchParams
  const selectedCategory = categories.some((item) => item.key === category) ? (category as CategoryKey) : "all"
  const courses = await listCatalogCourses({ onlyActive: true })

  const normalized = courses.map((course) => {
    const source = `${text(course.title)} ${text(course.shortDescription)} ${text(course.description)}`
    return {
      ...course,
      category: detectCategory(source),
    }
  })

  const visible = selectedCategory === "all" ? normalized : normalized.filter((item) => item.category === selectedCategory)

  return (
    <>
      <Header />
      <main dir="rtl">
        <PremiumSection
          className="pt-20 soft-gradient sm:pt-24"
          eyebrow="الكورسات"
          title="كل كورس هنا رحلة تحول وليست منتجًا رقميًا عابرًا"
          description="اختاري المسار الأقرب لاحتياجك الآن، وابدئي بخطوات متدرجة تساعدك على الاستمرار بهدوء وثبات."
        >
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2">
            {categories.map((item) => {
              const active = item.key === selectedCategory
              return (
                <Link
                  key={item.key}
                  href={item.key === "all" ? "/courses" : `/courses?category=${item.key}`}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-bold transition",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/45",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </PremiumSection>

        <section className="section-padding" dir="rtl">
          <div className="container-brand">
            {visible.length === 0 ? (
              <PremiumEmptyState
                title="مسارات جديدة قيد الإعداد"
                description="نعمل على تجهيز رحلات جديدة بعمق أكبر. عودي قريبًا أو اختاري مسارًا آخر من الفلاتر."
              />
            ) : (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((course) => (
                  <JourneyCard
                    key={course.id}
                    kind="course"
                    title={course.title}
                    promise={course.shortDescription || "رحلة عملية تمنحك خطوات واضحة قابلة للتطبيق."}
                    description={course.description || "تفاصيل الرحلة ستظهر هنا مع توضيح القيمة العملية المتوقعة."}
                    href={`/courses/${course.slug || course.id}`}
                    ctaLabel="اكتشفي الرحلة"
                    price={course.price}
                    imageUrl={course.coverImageUrl}
                    duration={course.duration}
                    lessonsCount={course.lessonsCount}
                    badge={<PremiumBadge tone="default">رحلة تطوير عملية</PremiumBadge>}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
