import { CheckCircle2, ShieldCheck, Sparkles, Wallet } from "lucide-react"

const trustStatements = [
  {
    icon: ShieldCheck,
    title: "خصوصية واحترام",
    text: "بياناتك وحجوزاتك وطلباتك تُدار بشكل آمن داخل حسابك الشخصي.",
  },
  {
    icon: Wallet,
    title: "دفع واضح",
    text: "يتم توضيح حالة الطلب والتفعيل بخطوات مباشرة دون وعود غير حقيقية.",
  },
  {
    icon: CheckCircle2,
    title: "وصول منظم",
    text: "المحتوى المدفوع يظهر بعد التأكيد داخل حسابك مع تجربة استخدام واضحة.",
  },
  {
    icon: Sparkles,
    title: "تجربة عربية راقية",
    text: "تصميم هادئ، لغة دافئة، ومسار سهل على الجوال والكمبيوتر.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-secondary/35 text-foreground" dir="rtl">
      <div className="container-brand">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">الثقة</p>
          <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">كل خطوة في المنصة مصممة لتمنحك راحة ووضوحًا</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-muted-foreground">
            هذا القسم مخصص لرسائل الثقة الرسمية حتى إضافة تجارب موثقة من عميلات حقيقيات لاحقًا.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {trustStatements.map((item) => (
            <article key={item.title} className="rounded-[1.8rem] border border-border bg-card p-6 shadow-sm">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-black text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
