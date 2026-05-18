import Link from "next/link"
import { listDocuments } from "@/lib/firebase/admin"
import { BookingStatusSelect } from "@/components/admin/booking-status-select"

function parseDate(value: unknown) {
  const date = new Date(String(value || ""))
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDateTime(value: unknown) {
  const date = parseDate(value)
  if (!date) return "-"
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(date)
}

function mapStatus(status: string) {
  if (status === "confirmed") return "مؤكد"
  if (status === "completed") return "مكتمل"
  if (status === "cancelled") return "ملغي"
  return "قيد المراجعة"
}

type PageProps = {
  searchParams: Promise<{ from?: string; to?: string; status?: string }>
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const { from = "", to = "", status = "all" } = await searchParams
  const bookings = await listDocuments("bookings", {
    orderByField: "createdAt",
    orderDirection: "desc",
    limit: 500,
  })

  const fromDate = from ? new Date(`${from}T00:00:00`) : null
  const toDate = to ? new Date(`${to}T23:59:59.999`) : null

  const filtered = bookings.filter((booking) => {
    const bookingStatus = String(booking.status || "pending").toLowerCase()
    if (status !== "all" && bookingStatus !== status) return false

    const bookingDate = parseDate(booking.startTime) || parseDate(booking.createdAt)
    if (!bookingDate) return true
    if (fromDate && bookingDate < fromDate) return false
    if (toDate && bookingDate > toDate) return false
    return true
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-black text-foreground">الحجوزات</h1>
        <p className="mt-2 text-muted-foreground">عرض المواعيد المتاحة، حالة كل حجز، وإدارة المتابعة اليومية.</p>

        <form className="mt-5 grid gap-3 rounded-2xl bg-background p-4 md:grid-cols-4">
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
          <div className="space-y-1">
            <label htmlFor="status" className="text-xs font-bold text-muted-foreground">
              حالة الحجز
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm"
            >
              <option value="all">الكل</option>
              <option value="pending">قيد المراجعة</option>
              <option value="confirmed">مؤكد</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="h-10 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground">
              تطبيق
            </button>
            <Link
              href="/admin/bookings"
              className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-bold text-muted-foreground transition hover:text-foreground"
            >
              إعادة ضبط
            </Link>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-border bg-card shadow-sm">
        <table className="w-full min-w-[980px] text-right">
          <thead className="bg-muted/70 text-sm">
            <tr>
              <th className="px-4 py-3">العميل</th>
              <th className="px-4 py-3">الموعد</th>
              <th className="px-4 py-3">المدة</th>
              <th className="px-4 py-3">السعر</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3">تعديل الحالة</th>
              <th className="px-4 py-3">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  لا توجد حجوزات مطابقة للفلترة الحالية.
                </td>
              </tr>
            ) : (
              filtered.map((booking) => {
                const statusValue = String(booking.status || "pending").toLowerCase()
                return (
                  <tr key={String(booking.id)} className="border-t border-border text-sm">
                    <td className="px-4 py-3">
                      <p className="font-bold text-foreground">{String(booking.name || "-")}</p>
                      <p className="text-xs text-muted-foreground">{String(booking.phone || "-")}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTime(booking.startTime)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{String(booking.duration || "-")} دقيقة</td>
                    <td className="px-4 py-3 text-muted-foreground latin">{String(booking.finalPrice || "-")} EGP</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {mapStatus(statusValue)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusSelect bookingId={String(booking.id)} initialStatus={statusValue} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTime(booking.createdAt)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
