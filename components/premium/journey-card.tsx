import Link from "next/link"
import { ArrowRight, BookOpen, Clock } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ProductCover } from "@/components/product-cover"
import { PremiumBadge } from "@/components/premium/premium-badge"

export function JourneyCard({
  title,
  promise,
  description,
  href,
  ctaLabel,
  price,
  imageUrl,
  kind,
  duration,
  lessonsCount,
  badge = "رحلة تطوير عملية",
}: {
  title: string
  promise: string
  description: string
  href: string
  ctaLabel: string
  price: number
  imageUrl?: string
  kind: "book" | "course"
  duration?: string
  lessonsCount?: number
  badge?: ReactNode
}) {
  const badgeNode = badge ?? <PremiumBadge>رحلة تطوير عملية</PremiumBadge>
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl" dir="rtl">
      <ProductCover title={title} imageUrl={imageUrl} kind={kind} className={kind === "book" ? "aspect-[4/5] rounded-none" : "aspect-[4/3] rounded-none"} />
      <div className="p-6">
        {badgeNode}
        <h3 className="mt-4 text-2xl font-black leading-tight text-foreground">{title}</h3>
        <p className="mt-2 text-sm font-bold text-primary">{promise}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-8 text-muted-foreground">{description}</p>

        {kind === "course" ? (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
              <Clock className="h-3.5 w-3.5" />
              {duration || "إيقاع مرن"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
              <BookOpen className="h-3.5 w-3.5" />
              {lessonsCount ? `${lessonsCount} دروس` : "خطة تعلم تدريجية"}
            </span>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-2xl font-black text-primary latin">{price.toLocaleString("ar-EG")} ج.م</p>
          <Link href={href}>
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
