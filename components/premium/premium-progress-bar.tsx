"use client"

import { Progress } from "@/components/ui/progress"

export function PremiumProgressBar({
  value,
  label,
  subtitle,
}: {
  value: number
  label?: string
  subtitle?: string
}) {
  const normalized = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="font-bold text-foreground">{label || "تقدم الرحلة"}</span>
        <span className="font-black text-primary">{normalized}%</span>
      </div>
      {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      <Progress value={normalized} className="mt-3 h-2 rounded-full progress-glow" />
    </div>
  )
}
