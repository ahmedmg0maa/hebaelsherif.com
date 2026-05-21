import Link from "next/link"
import { ArrowRight, CalendarClock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const sessionTypes = [
  {
    title: "جلسة كوتشنج 60 دقيقة",
    price: "1200 ج.م",
    note: "مناسبة لتشخيص واضح وخطوة عملية مباشرة.",
  },
  {
    title: "جلسة كوتشنج 90 دقيقة",
    price: "1500 ج.م",
    note: "مناسبة للمناقشات الأعمق وخطة أكثر تفصيلًا.",
  },
]

export function ServicesPreview() {
  return (
    <section className="section-padding bg-secondary/36" dir="rtl" id="services-preview">
      <div className="container-brand">
        <div className="rounded-[2.3rem] border border-border bg-card p-7 shadow-sm md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="eyebrow">جلسات الكوتشنج</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-foreground sm:text-5xl">موعد هادئ ومهني يضعك على المسار الصحيح</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                الجلسات تتم بحجز مسبق، مع تحقق كامل من المواعيد وتأكيد واضح داخل حسابك.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "لا يتم قبول مواعيد سابقة أو خارج أوقات العمل.",
                  "المواعيد المتاحة تُظهر تلقائيًا حسب اليوم والمدة.",
                  "حالة الحجز تبدأ قيد المراجعة حتى التأكيد.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground/85">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/booking" className="mt-7 inline-flex">
                <Button className="rounded-full bg-[var(--burgundy)] text-primary-foreground hover:bg-[var(--burgundy)]/90">
                  احجزي جلستك
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {sessionTypes.map((session) => (
                <article key={session.title} className="rounded-[1.6rem] border border-border bg-background p-5">
                  <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    {session.title}
                  </p>
                  <p className="mt-3 text-3xl font-black text-primary latin">{session.price}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{session.note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
