import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, BookOpen, Clock, CreditCard, ShieldCheck, Users } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCover } from "@/components/product-cover"
import { Button } from "@/components/ui/button"
import { getCatalogCourseBySlug } from "@/lib/catalog"
import { ViewProductTrack } from "@/components/analytics/view-product-track"
import { CourseStageCard } from "@/components/premium/course-stage-card"
import { PremiumBadge } from "@/components/premium/premium-badge"
import { PremiumCTA } from "@/components/premium/premium-cta"
import { SupportNotice } from "@/components/premium/support-notice"

type PageProps = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const course = await getCatalogCourseBySlug(id)
  if (!course || course.status !== "active") return {}
  return {
    title: `${course.title} | كورسات هبة الشريف`,
    description: course.description || course.shortDescription,
  }
}

function buildStageCards(courseTitle: string, lessonsCount: number) {
  if (!lessonsCount) {
    return [
      {
        stage: "المرحلة الأولى",
        title: "فهم الذات بوضوح",
        description: `تبدأين رحلة ${courseTitle} بتفكيك الأنماط الحالية وتحديد نقطة الانطلاق الفعلية.`,
      },
      {
        stage: "المرحلة الثانية",
        title: "تحويل الفهم إلى ممارسة",
        description: "تنتقلين من الفهم النظري إلى خطوات يومية عملية قابلة للاستمرار في الواقع.",
      },
      {
        stage: "المرحلة الثالثة",
        title: "تثبيت التغيير بهدوء",
        description: "تختمين الرحلة بخطة واضحة تساعدك على الحفاظ على الأثر بعد انتهاء المحتوى.",
      },
    ]
  }

  const firstStageCount = Math.max(1, Math.floor(lessonsCount * 0.34))
  const secondStageCount = Math.max(1, Math.floor(lessonsCount * 0.33))
  const thirdStageCount = Math.max(1, lessonsCount - firstStageCount - secondStageCount)

  return [
    {
      stage: "المرحلة الأولى",
      title: `الوعي والتهيئة (${firstStageCount} درس)`,
      description: "فهم السياق الداخلي وتحديد التحديات الحالية بصورة أكثر اتزانًا.",
    },
    {
      stage: "المرحلة الثانية",
      title: `الممارسة والتحول (${secondStageCount} درس)`,
      description: "تطبيق منهج الرحلة على مواقف الحياة اليومية وبناء عادات داعمة.",
    },
    {
      stage: "المرحلة الثالثة",
      title: `الاستمرار والتثبيت (${thirdStageCount} درس)`,
      description: "ترسيخ النتائج بخطة متابعة ذاتية تحافظ على الاستمرارية.",
    },
  ]
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { id } = await params
  const course = await getCatalogCourseBySlug(id)
  if (!course || course.status !== "active") notFound()

  const lessonsCount = course.lessonsCount || 0
  const stages = buildStageCards(course.title, lessonsCount)

  return (
    <>
      <Header />
      <main dir="rtl">
        <ViewProductTrack productId={course.id} productType="course" price={course.price} />
        <section className="pt-20 section-padding soft-gradient sm:pt-24">
          <div className="container-brand grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
                <ArrowRight className="h-4 w-4" />
                العودة إلى الكورسات
              </Link>
              <div className="mt-8">
                <PremiumBadge>رحلة تعلم رقمية</PremiumBadge>
              </div>
              <h1 className="mt-4 premium-heading-xl">{course.title}</h1>
              <p className="mt-5 text-xl font-bold leading-9 text-primary">
                {course.shortDescription || "ابدئي رحلة تحول عملية بإيقاع يناسبك."}
              </p>
              <p className="mt-6 max-w-3xl leading-8 text-muted-foreground">{course.description || "وصف الكورس يظهر هنا بشكل تفصيلي."}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2">
                  <Clock className="h-4 w-4 text-accent" />
                  {course.duration || "مدة مرنة"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  {lessonsCount ? `${lessonsCount} درس` : "خطة تعلم متدرجة"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2">
                  <Users className="h-4 w-4 text-accent" />
                  مناسب للبدء والاستمرار
                </span>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-border bg-card p-5 shadow-xl">
              <ProductCover title={course.title} imageUrl={course.coverImageUrl} kind="course" className="aspect-[4/3]" />
              <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">سعر الرحلة</p>
                <p className="mt-1 text-4xl font-black text-primary latin">{course.price.toLocaleString("ar-EG")} ج.م</p>
              </div>
              <Link href={`/checkout?type=course&id=${course.id}`} className="mt-5 block">
                <Button className="h-12 w-full rounded-full bg-[var(--burgundy)] text-primary-foreground hover:bg-[var(--burgundy)]/90 premium-cta-pulse">
                  <CreditCard className="h-5 w-5" />
                  ابدئي الرحلة الآن
                </Button>
              </Link>
            </aside>
          </div>
        </section>

        <section className="pb-8">
          <div className="container-brand space-y-5">
            <article className="premium-card">
              <h2 className="premium-heading-md">بعد هذه الرحلة ستتمكنين من...</h2>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
                <li>تحديد أولوياتك النفسية والسلوكية بوضوح.</li>
                <li>تطبيق خطوات عملية تحوّل الفهم إلى نتائج يومية ملموسة.</li>
                <li>بناء نظام شخصي للاستمرار بدل الحماس المؤقت.</li>
              </ul>
            </article>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {stages.map((stage, index) => (
                <CourseStageCard key={stage.stage} stage={stage.stage} title={stage.title} description={stage.description} active={index === 0} />
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article className="premium-card">
                <h2 className="premium-heading-md">لمن صُمم هذا الكورس؟</h2>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
                  <li>لمن تبحث عن مسار واضح بدل التشتت.</li>
                  <li>لمن تريد التوازن بين الفهم العاطفي والتطبيق العملي.</li>
                  <li>لمن تحتاج رحلة تعلم عربية راقية وسهلة المتابعة.</li>
                </ul>
              </article>
              <article className="premium-card">
                <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  الثقة والدعم
                </p>
                <p className="mt-3 leading-8 text-muted-foreground">
                  بعد تأكيد الدفع، يتم تفعيل الوصول داخل حسابك مباشرة. ويمكنك المتابعة من الجوال أو الكمبيوتر في أي وقت.
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">في حال احتجت مساعدة، فريق الدعم متاح لك بخطوات واضحة وسريعة.</p>
              </article>
            </div>

            <PremiumCTA
              eyebrow="خطوة البدء"
              title="ابدئي رحلتك من اليوم"
              description="كل يوم انتظار يعني استمرار نفس النمط. ابدئي بخطوة صغيرة الآن، وسنرافقك في كل مرحلة."
              primaryLabel="شراء الكورس"
              primaryHref={`/checkout?type=course&id=${course.id}`}
              secondaryLabel="العودة للكورسات"
              secondaryHref="/courses"
            />

            <SupportNotice />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
