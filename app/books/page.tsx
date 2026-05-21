import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { JourneyCard } from "@/components/premium/journey-card"
import { PremiumBadge } from "@/components/premium/premium-badge"
import { PremiumEmptyState } from "@/components/premium/premium-empty-state"
import { PremiumSection } from "@/components/premium/premium-section"
import { listCatalogBooks } from "@/lib/catalog"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "الكتب",
  description: "كتب عربية عاطفية وعملية ترافقك من الحيرة إلى الوضوح بهدوء وثقة.",
  alternates: {
    canonical: "/books",
  },
  openGraph: {
    title: "كتب هبة الشريف",
    description: "مكتبة رقمية تساعدك على الفهم العميق، واتخاذ خطوات أوضح في رحلتك.",
    url: "/books",
    images: ["/images/heba-banner.jpeg"],
  },
}

export default async function BooksPage() {
  const books = await listCatalogBooks({ onlyActive: true })

  return (
    <>
      <Header />
      <main dir="rtl">
        <PremiumSection
          className="pt-20 soft-gradient sm:pt-24"
          eyebrow="الكتب"
          title="كتب ترافقك من التشتت إلى المعنى بخطاب عاطفي هادئ"
          description="هذه الكتب ليست معلومات متفرقة، بل أدلة عملية تعينك على فهم أعمق لنفسك، واستمرار يومي أكثر اتزانًا."
        />

        <section className="section-padding">
          <div className="container-brand">
            {books.length === 0 ? (
              <PremiumEmptyState
                title="مكتبة جديدة قيد الإضافة"
                description="نعمل على إضافة عناوين جديدة في أقرب وقت. عودي قريبًا وستجدين إصدارات تناسب احتياجك."
              />
            ) : (
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {books.map((book) => (
                  <JourneyCard
                    key={book.id}
                    kind="book"
                    title={book.title}
                    promise={book.shortDescription || "كتاب عملي يرافقك بنبرة هادئة وعميقة."}
                    description={book.description || "ملخص واضح يساعدك على تطبيق الفكرة خطوة بخطوة."}
                    href={`/books/${book.slug || book.id}`}
                    ctaLabel="اكتشفي الكتاب"
                    price={book.price}
                    imageUrl={book.coverImageUrl}
                    badge={<PremiumBadge tone="accent">دليل قراءة علاجي</PremiumBadge>}
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
