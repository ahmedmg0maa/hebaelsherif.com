import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PremiumCTA({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}) {
  return (
    <section className="rounded-[2.5rem] border border-border bg-card p-8 shadow-xl md:p-12" dir="rtl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-4xl font-black leading-tight text-foreground sm:text-5xl">{title}</h2>
      <p className="mt-5 max-w-3xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href={primaryHref}>
          <Button className="h-12 rounded-full bg-[var(--burgundy)] px-7 text-primary-foreground hover:bg-[var(--burgundy)]/90">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link href={secondaryHref}>
            <Button variant="outline" className="h-12 rounded-full bg-transparent px-7">
              {secondaryLabel}
            </Button>
          </Link>
        ) : null}
      </div>
    </section>
  )
}
