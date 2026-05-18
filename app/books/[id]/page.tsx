import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, BookOpen, CheckCircle2, CreditCard, Sparkles } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { books, getBookById } from "@/lib/site-data"

type PageProps = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return books.map((book) => ({ id: book.id }))
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const book = getBookById(id)
  if (!book) return {}
  return {
    title: `${book.title} | كتب هبة الشريف`,
    description: book.description,
  }
}

export default async function BookDetailsPage({ params }: PageProps) {
  const { id } = await params
  const book = getBookById(id)
  if (!book) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hebaelsharif.com"
  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    inLanguage: "ar",
    author: {
      "@type": "Person",
      name: "هبة الشريف",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EGP",
      price: book.price,
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/checkout?type=book&id=${book.id}`,
    },
  }

  return (
    <>
      <Header />
      <main dir="rtl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />
        <section className="pt-20 section-padding soft-gradient sm:pt-24">
          <div className="container-brand grid gap-10 lg:grid-cols-[1fr_0.42fr] lg:items-start">
            <div>
              <Link href="/books" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
                <ArrowRight className="h-4 w-4" /> العودة للكتب
              </Link>
              <p className="eyebrow mt-8">كتاب</p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">{book.title}</h1>
              <p className="mt-4 text-2xl font-bold text-primary">{book.subtitle}</p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{book.description}</p>
            </div>

          <aside className="rounded-[2rem] border border-border bg-card p-6 shadow-xl">
              <div className="rounded-[1.5rem] bg-primary p-6 text-primary-foreground">
                <BookOpen className="h-7 w-7 text-accent" />
                <p className="mt-8 text-3xl font-black">{book.title}</p>
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">السعر</p>
                <p className="text-4xl font-black text-primary latin">{book.price.toLocaleString("en-US")} EGP</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {book.format} · {book.pages} صفحة {book.status ? `· ${book.status}` : ""}
              </p>
              <Link href={`/checkout?type=book&id=${book.id}`} className="mt-6 block">
                <Button className="h-12 w-full rounded-full bg-[var(--burgundy)] text-primary-foreground hover:bg-[var(--burgundy)]/90">
                  <CreditCard className="h-5 w-5" />
                  شراء الكتاب الآن
                </Button>
              </Link>
            </aside>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-brand grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">لمن هذا الكتاب؟</p>
              <h2 className="mt-4 text-3xl font-black text-foreground sm:text-4xl">هذا الكتاب مناسب لك إذا كنت:</h2>
              <div className="mt-8 grid gap-4">
                {book.audience.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                    <Sparkles className="mt-1 h-5 w-5 flex-none text-accent" />
                    <p className="leading-7 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow">ماذا ستتعلم؟</p>
              <h2 className="mt-4 text-3xl font-black text-foreground sm:text-4xl">نتائج عملية من القراءة</h2>
              <div className="mt-8 grid gap-4">
                {book.learn.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-primary" />
                    <p className="leading-7 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
