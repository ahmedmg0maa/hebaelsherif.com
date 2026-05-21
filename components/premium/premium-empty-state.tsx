import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function PremiumEmptyState({
  title,
  description,
  className,
  children,
}: {
  title: string
  description: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("rounded-[2rem] border border-border bg-card p-10 text-center shadow-sm", className)} dir="rtl">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-2xl font-black text-foreground">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-muted-foreground">{description}</p>
      {children ? <div className="mt-5 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </div>
  )
}
