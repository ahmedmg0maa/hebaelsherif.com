import { PremiumCTA } from "@/components/premium/premium-cta"

export function FinalCtaSection() {
  return (
    <section className="pb-20" dir="rtl">
      <div className="container-brand">
        <PremiumCTA
          eyebrow="خطوتك التالية"
          title="رحلتكِ لا تحتاج ضجيجًا... تحتاج بداية واضحة الآن."
          description="اختاري ما يناسبك اليوم: جلسة فردية، كورس عملي، أو كتاب يساعدك على فهم أعمق لنفسك. المهم أن تبدأي بخطوة حقيقية."
          primaryLabel="احجزي جلستك"
          primaryHref="/booking"
          secondaryLabel="اختاري المسار الأنسب"
          secondaryHref="/services"
        />
      </div>
    </section>
  )
}
