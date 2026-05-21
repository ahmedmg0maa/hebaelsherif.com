import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmotionalHero({
  badge,
  title,
  highlight,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  tertiaryLabel,
  tertiaryHref,
}: {
  badge: string
  title: string
  highlight: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  tertiaryLabel?: string
  tertiaryHref?: string
}) {
  return (
    <section className="relative overflow-hidden luxury-gradient pt-14 sm:pt-20 lg:pt-24" dir="rtl">
      <div className="container-brand relative grid min-h-[72vh] items-center gap-10 py-10 lg:py-14">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-card/85 px-4 py-2 text-xs font-bold text-accent shadow-sm backdrop-blur">
            <Sparkles className="size-4" />
            {badge}
          </div>
          <h1 className="text-balance text-4xl font-black leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
            <span className="mt-3 block text-primary">{highlight}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:justify-center">
            <Link href={primaryHref} className="sm:inline-flex">
              <Button className="touch-target h-12 w-full rounded-full bg-[var(--burgundy)] px-7 text-primary-foreground hover:bg-[var(--burgundy)]/92 sm:w-auto">
                {primaryLabel}
                <ArrowLeft className="size-4" />
              </Button>
            </Link>

            {secondaryLabel && secondaryHref ? (
              <Link href={secondaryHref} className="sm:inline-flex">
                <Button variant="outline" className="touch-target h-12 w-full rounded-full border border-border bg-card/82 px-7 sm:w-auto">
                  {secondaryLabel}
                </Button>
              </Link>
            ) : null}

            {tertiaryLabel && tertiaryHref ? (
              <Link href={tertiaryHref} className="sm:inline-flex">
                <Button variant="ghost" className="touch-target h-12 w-full rounded-full border border-transparent bg-secondary/50 px-7 sm:w-auto">
                  {tertiaryLabel}
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
