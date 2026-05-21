import { ShieldCheck } from "lucide-react"

export function ContentProtectionNotice({
  primary = "هذا المحتوى للاستخدام الشخصي فقط.",
  secondary = "قد تظهر علامة مائية لحماية حقوق المحتوى.",
}: {
  primary?: string
  secondary?: string
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-muted/40 px-4 py-3" dir="rtl">
      <p className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
        <ShieldCheck className="h-4 w-4 text-accent" />
        {primary}
      </p>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">{secondary}</p>
    </div>
  )
}
