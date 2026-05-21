import { stats } from "@/lib/site-data"
import { EmotionalHero } from "@/components/premium/emotional-hero"

export function HeroSection() {
  return (
    <section dir="rtl">
      <EmotionalHero
        badge="منصة عربية راقية للنمو الشخصي"
        title="هذه ليست دورة سريعة... "
        highlight="هذه رحلة تعيدكِ إلى ذاتك بهدوء واتزان"
        description="من خلال جلسات الكوتشنج، الكورسات، والكتب العملية، ستجدين مساحة آمنة وعميقة لاتخاذ قرارات أوضح، وبناء حياة أكثر انسجامًا معك."
        primaryLabel="احجزي جلستك"
        primaryHref="/booking?service=coaching"
        secondaryLabel="ابدئي رحلتك"
        secondaryHref="/courses"
        tertiaryLabel="تصفحي الكورسات"
        tertiaryHref="/courses"
      />

      <div className="container-brand -mt-8 pb-6 sm:-mt-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="luxury-panel p-4 text-center reveal-on-scroll">
              <p className="text-[1.3rem] font-black tracking-tight text-primary">{item.value}</p>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
