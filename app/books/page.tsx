import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, Download, ShoppingBag, Sparkles } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { books } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "الكتب",
  description: "كتب هبة الشريف في الوعي، العلاقات، وفهم الذات بعمق عملي.",
}

const colorClass = {
  teal: "bg-[color:rgba(47,97,115,0.92)]",
  gold: "bg-[color:rgba(183,155,96,0.92)]",
  olive: "bg-[color:rgba(107,114,78,0.92)]",
  burgundy: "bg-[color:rgba(122,36,51,0.92)]",
}

export default function BooksPage() {
  return (
    <>
      <Header />
      <main dir="rtl">
        <section className="pt-20 section-padding soft-gradient sm:pt-24">
          <div className="container-brand text-center">
            <p className="eyebrow">الكتب</p>
            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
              كتب ودفاتر وعي تصبح رفيقك في الأيام الثقيلة والهادئة.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              محتوى مكتوب بلغة رقيقة وعملية، يجمع بين النصوص العميقة والأسئلة التي تساعدك على فهم ما يحدث بداخلك.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-brand grid gap-7 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book.id}
                className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`${colorClass[book.color]} relative flex h-72 items-center justify-center overflow-hidden p-8 text-white`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.24),transparent_30rem)]" />
                  <div className="relative w-52 rounded-[1.5rem] border border-white/30 bg-white/12 p-6 text-center shadow-lg">
                    <BookOpen className="mx-auto h-10 w-10" />
                    <h2 className="mt-6 text-3xl font-black leading-tight">{book.title}</h2>
                    <p className="mt-3 text-sm text-white/75">{book.subtitle}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-bold text-foreground">{book.subtitle}</p>
                  <p className="mt-3 leading-7 text-muted-foreground">{book.description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <span className="rounded-2xl bg-muted p-3">
                      <Download className="mb-1 h-4 w-4 text-accent" />
                      {book.format}
                    </span>
                    <span className="rounded-2xl bg-muted p-3">
                      <Sparkles className="mb-1 h-4 w-4 text-accent" />
                      {book.pages} صفحة
                    </span>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <p className="text-2xl font-black text-primary latin">{book.price.toLocaleString("en-US")} EGP</p>
                    <Link href={`/books/${book.id}`}>
                      <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <ShoppingBag className="h-4 w-4" />
                        التفاصيل
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
