import Link from "next/link"
import { ArrowRight, BookOpen, Layers3, MessageCircleHeart } from "lucide-react"
import { Button } from "@/components/ui/button"

const paths = [
  {
    title: "أحتاج جلسة كوتشنج",
    text: "جلسة فردية هادئة لفهم وضعك الحالي وبناء خطة عملية واضحة.",
    href: "/booking?service=coaching",
    icon: MessageCircleHeart,
    cta: "احجزي جلستك",
  },
  {
    title: "أريد كورسًا أبدأ به",
    text: "مسارات تعلم رقمية تساعدك على التحول خطوة بخطوة بإيقاع مرن.",
    href: "/courses",
    icon: Layers3,
    cta: "تصفحي الكورسات",
  },
  {
    title: "أريد كتابًا يساعدني",
    text: "كتب رقمية مختارة لتمنحك بداية عميقة وعملية في نفس الوقت.",
    href: "/books",
    icon: BookOpen,
    cta: "تصفحي الكتب",
  },
]

export function StartHereSection() {
  return (
    <section className="section-padding soft-gradient" dir="rtl">
      <div className="container-brand">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">ابدئي رحلتك</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-foreground sm:text-5xl">اختاري المسار الذي يناسب احتياجك الآن</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-muted-foreground">
            يمكنك البدء من أي نقطة، وسنحافظ على نفس الهدوء والوضوح في كل خطوة.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {paths.map((path) => (
            <article key={path.title} className="rounded-[1.9rem] border border-border bg-card p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <path.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-2xl font-black text-foreground">{path.title}</h3>
              <p className="mt-3 leading-8 text-muted-foreground">{path.text}</p>
              <Link href={path.href} className="mt-6 inline-flex">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {path.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
