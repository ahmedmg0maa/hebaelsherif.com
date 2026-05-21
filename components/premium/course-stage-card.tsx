import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export function CourseStageCard({
  stage,
  title,
  description,
  completed = false,
  active = false,
}: {
  stage: string
  title: string
  description: string
  completed?: boolean
  active?: boolean
}) {
  return (
    <article
      className={cn(
        "rounded-2xl border bg-card p-5 transition duration-300",
        active ? "border-primary shadow-md" : "border-border",
      )}
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-accent">{stage}</p>
          <h3 className="mt-2 text-lg font-black text-foreground">{title}</h3>
        </div>
        {completed ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
    </article>
  )
}
