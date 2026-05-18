import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, CheckCircle2, Clock, CreditCard, PlayCircle, Star, Users } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { courses, getCourseById } from "@/lib/site-data"

const colorClass = {
  teal: "from-[color:rgba(47,97,115,0.92)] to-[color:rgba(47,97,115,0.72)]",
  gold: "from-[color:rgba(183,155,96,0.92)] to-[color:rgba(245,240,231,0.55)]",
  olive: "from-[color:rgba(107,114,78,0.92)] to-[color:rgba(183,155,96,0.72)]",
  burgundy: "from-[color:rgba(122,36,51,0.9)] to-[color:rgba(183,155,96,0.78)]",
}

type PageProps = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return courses.map((course) => ({ id: course.id }))
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const course = getCourseById(id) ?? courses[0]
  return {
    title: course.title,
    description: course.description,
  }
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { id } = await params
  const course = getCourseById(id)

  if (!course) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hebaelsharif.com"
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "هبة الشريف",
      url: siteUrl,
    },
    inLanguage: "ar",
    offers: {
      "@type": "Offer",
      priceCurrency: "EGP",
      price: course.price,
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/checkout?type=course&id=${course.id}`,
    },
  }

  return (
    <>
      <Header />
      <main dir="rtl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
        <section className="pt-20 section-padding soft-gradient sm:pt-24">
          <div className="container-brand grid gap-10 lg:grid-cols-[1fr_0.42fr] lg:items-start">
            <div>
              <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
                <ArrowRight className="h-4 w-4" /> العودة للكورسات
              </Link>
              <p className="eyebrow mt-8">{course.category}</p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">{course.title}</h1>
              <p className="mt-4 text-2xl font-bold text-primary">{course.subtitle}</p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{course.description}</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2">
                  <Clock className="h-4 w-4 text-accent" />
                  {course.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2">
                  <PlayCircle className="h-4 w-4 text-accent" />
                  {course.lessons} درس
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2">
                  <Users className="h-4 w-4 text-accent" />
                  {course.level}
                </span>
              </div>
            </div>
          <aside className="rounded-[2rem] border border-border bg-card p-6 shadow-xl">
              <div className={`rounded-[1.5rem] bg-gradient-to-br ${colorClass[course.color]} p-6 text-white`}>
                <Star className="h-7 w-7 fill-current" />
                <p className="mt-10 text-3xl font-black">{course.title}</p>
              </div>
              <div className="mt-6">
                {course.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through latin">
                    {course.originalPrice.toLocaleString("en-US")} EGP
                  </p>
                )}
                <p className="text-4xl font-black text-primary latin">{course.price.toLocaleString("en-US")} EGP</p>
              </div>
              <Link href={`/checkout?type=course&id=${course.id}`} className="mt-6 block">
                <Button className="h-12 w-full rounded-full bg-[var(--burgundy)] text-primary-foreground hover:bg-[var(--burgundy)]/90">
                  <CreditCard className="h-5 w-5" />
                  اشترِ البرنامج الآن
                </Button>
              </Link>
              <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">
                بعد الشراء سيظهر الطلب في حسابك بحالة قيد المراجعة حتى تأكيد الدفع.
              </p>
            </aside>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-brand grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div>
              <p className="eyebrow">لمن هذا الكورس؟</p>
              <h2 className="mt-4 text-3xl font-black text-foreground sm:text-4xl">هذا المسار مناسب لك إذا كنت:</h2>
              <div className="mt-8 grid gap-4">
                {course.audience.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-accent" />
                    <p className="leading-7 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>

              <p className="eyebrow mt-10">ماذا ستتعلم؟</p>
              <h3 className="mt-3 text-2xl font-black text-foreground sm:text-3xl">نتائج واضحة قابلة للتطبيق</h3>
              <div className="mt-6 grid gap-4">
                {course.learn.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-primary" />
                    <p className="leading-7 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow">المحتوى</p>
              <h2 className="mt-4 text-3xl font-black text-foreground sm:text-4xl">منهج البرنامج</h2>
              <Accordion type="single" collapsible className="mt-8 rounded-[2rem] border border-border bg-card p-3">
                {course.curriculum.map((module, index) => (
                  <AccordionItem key={module.title} value={`module-${index}`}>
                    <AccordionTrigger className="px-4 text-right text-lg font-bold">{module.title}</AccordionTrigger>
                    <AccordionContent className="px-4">
                      <ul className="space-y-3 text-muted-foreground">
                        {module.lessons.map((lesson) => (
                          <li key={lesson}>- {lesson}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
