import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCover } from "@/components/product-cover"
import { Button } from "@/components/ui/button"
import { getCatalogBookBySlug } from "@/lib/catalog"
import { ViewProductTrack } from "@/components/analytics/view-product-track"
import { PremiumBadge } from "@/components/premium/premium-badge"
import { PremiumCTA } from "@/components/premium/premium-cta"
import { SupportNotice } from "@/components/premium/support-notice"

type PageProps = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const book = await getCatalogBookBySlug(id)
  if (!book || book.status !== "active") return {}
  return {
    title: `${book.title} | كتب هبة الشريف`,
    description: book.description || book.shortDescription,
  }
}

export default async function BookDetailsPage({ params }: PageProps) {
  const { id } = await params
  const book = await getCatalogBookBySlug(id)
  if (!book || book.status !== "active") notFound()

  return (
    <>
      <Header />
      <main dir="rtl">
        <ViewProductTrack productId={book.id} productType="book" price={book.price} />
        <section className="pt-20 section-padding soft-gradient sm:pt-24">
          <div className="container-brand grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Link href="/books" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
                <ArrowRight className="h-4 w-4" />
                العودة إلى الكتب
              </Link>
              <div className="mt-8">
                <PremiumBadge tone="accent">كتاب رقمي علاجي</PremiumBadge>
              </div>
              <h1 className="mt-4 premium-heading-xl">{book.title}</h1>
              <p className="mt-5 text-xl font-bold leading-9 text-primary">{book.shortDescription || "كتاب يساعدك على ترتيب الداخل بهدوء."}</p>
              <p className="mt-6 max-w-3xl leading-8 text-muted-foreground">
                {book.description || "وصف الكتاب سيتحدث مباشرة عن الفائدة التي ستحصلين عليها في رحلتك اليومية."}
              </p>
            </div>

            <aside className="rounded-[2rem] border border-border bg-card p-5 shadow-xl">
              <ProductCover title={book.title} imageUrl={book.coverImageUrl} kind="book" className="aspect-[4/5]" />
              <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                <p className="text-sm text-muted-foreground">سعر الكتاب</p>
                <p className="mt-1 text-4xl font-black text-primary latin">{book.price.toLocaleString("ar-EG")} ج.م</p>
              </div>
              <Link href={`/checkout?type=book&id=${book.id}`} className="mt-5 block">
                <Button className="h-12 w-full rounded-full bg-[var(--burgundy)] text-primary-foreground hover:bg-[var(--burgundy)]/90 premium-cta-pulse">
                  <CreditCard className="h-5 w-5" />
                  اشتري الكتاب الآن
                </Button>
              </Link>
            </aside>
          </div>
        </section>

        <section className="pb-8">
          <div className="container-brand grid gap-5 lg:grid-cols-3">
            <article className="premium-card">
              <h2 className="premium-heading-md">وعد هذا الكتاب</h2>
              <p className="mt-3 leading-8 text-muted-foreground">
                محتوى عربي دافئ يساعدك على تهدئة الضجيج الداخلي وتحويل الفهم إلى خطوات عملية قابلة للتطبيق.
              </p>
            </article>
            <article className="premium-card">
              <h2 className="premium-heading-md">لمن هذا الكتاب؟</h2>
              <p className="mt-3 leading-8 text-muted-foreground">
                لمن تبحث عن نقطة بداية ناعمة وعميقة، وتفضّل مسارًا تدريجيًا واضحًا بدل النصائح المتفرقة.
              </p>
            </article>
            <article className="premium-card">
              <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-accent" />
                الوصول بعد الدفع
              </p>
              <p className="mt-3 leading-8 text-muted-foreground">
                بعد تأكيد الدفع، يظهر الكتاب داخل حسابك مع وصول محمي مخصص لاستخدامك الشخصي فقط.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-primary">
                <CheckCircle2 className="h-4 w-4" />
                تفعيل واضح من صفحة الحساب
              </p>
            </article>
          </div>

          <div className="container-brand mt-5 space-y-5">
            <PremiumCTA
              eyebrow="خطوة هادئة تبدأ الآن"
              title="ابدئي قراءة تغيّر إيقاع يومك"
              description="هذا الكتاب مصمم ليكون رفيقك اليومي بخطوات عملية، ونبرة داعمة، ومساحة آمنة للفهم."
              primaryLabel="شراء الكتاب"
              primaryHref={`/checkout?type=book&id=${book.id}`}
              secondaryLabel="العودة للكتب"
              secondaryHref="/books"
            />
            <SupportNotice />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
