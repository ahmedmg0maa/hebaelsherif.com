import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "تجارب العملاء",
  description: "هذا القسم جاهز لإضافة تجارب موثقة من عميلات حقيقيات.",
}

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <main dir="rtl">
        <section className="pt-20 section-padding soft-gradient sm:pt-24">
          <div className="container-brand text-center">
            <p className="eyebrow">تجارب العملاء</p>
            <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-tight text-foreground sm:text-6xl">
              مساحة مخصصة لتجارب موثقة فقط
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-muted-foreground">
              نعرض هنا قريبًا تجارب حقيقية بعد موافقة أصحابها، دون أي محتوى افتراضي أو غير موثق.
            </p>
            <div className="mt-8">
              <Link href="/booking">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">احجزي جلستك</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
