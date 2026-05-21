import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "المقالات",
  description: "قسم المقالات سيتاح قريبًا بمحتوى عربي موثق.",
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main dir="rtl">
        <section className="pt-20 section-padding soft-gradient sm:pt-24">
          <div className="container-brand text-center">
            <p className="eyebrow">المقالات</p>
            <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-tight text-foreground sm:text-6xl">
              محتوى مقالات موثق قادم قريبًا
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-muted-foreground">
              نعمل على إعداد مقالات أصلية بجودة تحريرية عالية، وسيتم نشرها تدريجيًا بعد المراجعة.
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">تواصلي معنا</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
