import { cn } from "@/lib/utils"

export function PremiumBadge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode
  className?: string
  tone?: "default" | "soft" | "accent"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide",
        tone === "default" && "bg-primary/10 text-primary",
        tone === "soft" && "bg-secondary text-secondary-foreground",
        tone === "accent" && "bg-accent/15 text-foreground",
        className,
      )}
    >
      {children}
    </span>
  )
}
