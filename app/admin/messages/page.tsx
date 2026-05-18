import Link from "next/link"
import { listDocuments } from "@/lib/firebase/admin"

function parseDate(value: unknown) {
  const date = new Date(String(value || ""))
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDateTime(value: unknown) {
  const date = parseDate(value)
  if (!date) return "-"
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

type PageProps = {
  searchParams: Promise<{ from?: string; to?: string }>
}

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  const { from = "", to = "" } = await searchParams

  const messages = await listDocuments("messages", {
    orderByField: "createdAt",
    orderDirection: "desc",
    limit: 500,
  })

  const fromDate = from ? new Date(`${from}T00:00:00`) : null
  const toDate = to ? new Date(`${to}T23:59:59.999`) : null

  const filtered = messages.filter((message) => {
    const messageDate = parseDate(message.createdAt)
    if (!messageDate) return true
    if (fromDate && messageDate < fromDate) return false
    if (toDate && messageDate > toDate) return false
    return true
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-black text-foreground">الرسائل</h1>
        <p className="mt-2 text-muted-foreground">رسائل التواصل الواردة من الزوار مع فلترة بالتاريخ.</p>

        <form className="mt-5 grid gap-3 rounded-2xl bg-background p-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="from" className="text-xs font-bold text-muted-foreground">
              من تاريخ
            </label>
            <input
              id="from"
              name="from"
              type="date"
              defaultValue={from}
              className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="to" className="text-xs font-bold text-muted-foreground">
              إلى تاريخ
            </label>
            <input
              id="to"
              name="to"
              type="date"
              defaultValue={to}
              className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="h-10 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground">
              تطبيق
            </button>
            <Link
              href="/admin/messages"
              className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-bold text-muted-foreground transition hover:text-foreground"
            >
              إعادة ضبط
            </Link>
          </div>
        </form>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-muted-foreground">
            لا توجد رسائل مطابقة للفلترة الحالية.
          </div>
        ) : (
          filtered.map((item) => (
            <article key={String(item.id)} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-foreground">{String(item.subject || "رسالة جديدة")}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    من: {String(item.name || "-")} · {String(item.email || "-")}
                  </p>
                  {item.phone ? <p className="text-sm text-muted-foreground">هاتف: {String(item.phone)}</p> : null}
                </div>
                <span className="text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</span>
              </div>
              <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">{String(item.message || "-")}</p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
