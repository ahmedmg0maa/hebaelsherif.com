import Link from "next/link"
import { listDocuments } from "@/lib/firebase/admin"
import { OrderStatusSelect } from "@/components/admin/order-status-select"

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
  if (status === "paid") return "مدفوع"
  if (status === "cancelled") return "ملغي"
  return "قيد المراجعة"
}

type PageProps = {
  searchParams: Promise<{ from?: string; to?: string; status?: string }>
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const { from = "", to = "", status = "all" } = await searchParams

  const orders = await listDocuments("orders", {
    orderByField: "createdAt",
    orderDirection: "desc",
    limit: 500,
  })

  const fromDate = from ? new Date(`${from}T00:00:00`) : null
  const toDate = to ? new Date(`${to}T23:59:59.999`) : null

  const filtered = orders.filter((order) => {
    const orderStatus = String(order.status || "pending").toLowerCase()
    if (status !== "all" && orderStatus !== status) return false

    const orderDate = parseDate(order.createdAt)
    if (!orderDate) return true
    if (fromDate && orderDate < fromDate) return false
    if (toDate && orderDate > toDate) return false
    return true
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-black text-foreground">الطلبات</h1>
        <p className="mt-2 text-muted-foreground">متابعة الطلبات وتحديث حالتها مع فلترة حسب التاريخ.</p>

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
              حالة الطلب
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm"
            >
              <option value="all">الكل</option>
              <option value="pending">قيد المراجعة</option>
              <option value="paid">مدفوع</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="h-10 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground">
              تطبيق
            </button>
            <Link
              href="/admin/orders"
              className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-bold text-muted-foreground transition hover:text-foreground"
            >
              إعادة ضبط
            </Link>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-border bg-card shadow-sm">
        <table className="w-full min-w-[1050px] text-right">
          <thead className="bg-muted/70 text-sm">
            <tr>
              <th className="px-4 py-3">رقم الطلب</th>
              <th className="px-4 py-3">المنتج</th>
              <th className="px-4 py-3">العميل</th>
              <th className="px-4 py-3">المبلغ</th>
              <th className="px-4 py-3">الدفع</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3">تعديل الحالة</th>
              <th className="px-4 py-3">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  لا توجد طلبات مطابقة للفلترة الحالية.
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const statusValue = String(order.status || "pending").toLowerCase()
                return (
                  <tr key={String(order.id)} className="border-t border-border text-sm">
                    <td className="px-4 py-3 font-bold text-foreground">{String(order.orderNumber || order.id || "-")}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p>{String(order.productTitle || "-")}</p>
                      <p className="text-xs">{String(order.productType || "-")}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p>{String(order.name || "-")}</p>
                      <p className="text-xs">{String(order.email || "-")}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground latin">{String(order.amount || "-")} EGP</td>
                    <td className="px-4 py-3 text-muted-foreground">{String(order.paymentMethod || "-")}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {mapStatus(statusValue)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect orderId={String(order.id)} initialStatus={statusValue} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTime(order.createdAt)}</td>
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
