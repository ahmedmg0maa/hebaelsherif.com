import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCover } from "@/components/product-cover"
import { listCatalogBooks } from "@/lib/catalog"

export async function BooksPreview() {
  const books = (await listCatalogBooks({ onlyActive: true })).slice(0, 4)

  if (books.length === 0) {
    return (
      <section className="section-padding bg-secondary/30" dir="rtl">
        <div className="container-brand">
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-primary/70" />
            <h2 className="mt-4 text-3xl font-black text-foreground">مكتبة هادئة قيد الإضافة</h2>
            <p className="mt-3 text-muted-foreground">ستجدين هنا قريبًا كتبًا مختارة بعناية تناسب رحلتك.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-secondary/30" dir="rtl">
      <div className="container-brand">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">الكتب</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-foreground sm:text-5xl">
              ابدئي من كتاب يفتح لك بابًا داخليًا أكثر هدوءًا
            </h2>
          </div>
          <Link href="/books">
            <Button variant="outline" className="rounded-full bg-transparent">
              تصفحي كل الكتب
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {books.map((book) => (
            <article key={book.id} className="hover-lift overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
              <ProductCover title={book.title} imageUrl={book.coverImageUrl} kind="book" className="aspect-[4/5] rounded-none" />
              <div className="p-5">
                <h3 className="text-xl font-black text-foreground">{book.title}</h3>
                <p className="mt-2 text-sm font-semibold text-accent">{book.shortDescription || "كتاب عملي هادئ."}</p>
                <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted-foreground">
                  {book.description || "ملخص يساعدك على البدء بخطوات واضحة."}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <p className="latin text-lg font-black text-primary">{book.price.toLocaleString("ar-EG")} ج.م</p>
                  <Link href={`/books/${book.slug || book.id}`} className="text-sm font-bold text-primary hover:text-accent">
                    اكتشفي الكتاب
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
