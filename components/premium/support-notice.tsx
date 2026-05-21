import Link from "next/link"
import { Headphones, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SupportNotice({
  title = "فريق الدعم معك في كل خطوة",
  description = "إذا احتجت أي مساعدة في التفعيل أو الوصول، تواصلي معنا وسنساعدك بسرعة ووضوح.",
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  return (
    <section className={cn("rounded-[1.8rem] border border-border bg-card p-6 shadow-sm", className)} dir="rtl">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Headphones className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-xl font-black text-foreground">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
          <div className="mt-4">
            <Link href="/contact">
              <Button size="sm" className="rounded-full bg-[var(--burgundy)] text-primary-foreground hover:bg-[var(--burgundy)]/90">
                <MessageCircle className="h-4 w-4" />
                تواصلي مع الدعم
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
