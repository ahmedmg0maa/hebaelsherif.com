import { cn } from "@/lib/utils"

export function PremiumSection({
  eyebrow,
  title,
  description,
  children,
  className,
  contentClassName,
  align = "center",
}: {
  eyebrow?: string
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  align?: "center" | "start"
}) {
  return (
    <section className={cn("section-padding", className)} dir="rtl">
      <div className={cn("container-brand", contentClassName)}>
        {eyebrow || title || description ? (
          <div className={cn("mx-auto max-w-4xl", align === "center" ? "text-center" : "text-right")}>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h2 className="mt-4 text-balance text-4xl font-black leading-tight text-foreground sm:text-5xl">{title}</h2> : null}
            {description ? <p className="mt-5 text-pretty text-base leading-8 text-muted-foreground sm:text-lg">{description}</p> : null}
          </div>
        ) : null}
        {children ? <div className={cn(eyebrow || title || description ? "mt-10" : "")}>{children}</div> : null}
      </div>
    </section>
  )
}
