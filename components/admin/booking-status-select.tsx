"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const statuses = [
  { value: "pending", label: "قيد المراجعة" },
  { value: "confirmed", label: "مؤكد" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
] as const

export function BookingStatusSelect({
  bookingId,
  initialStatus,
}: {
  bookingId: string
  initialStatus: string
}) {
  const [status, setStatus] = useState(initialStatus || "pending")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function saveStatus() {
    setLoading(true)
    setMessage("")
    try {
      const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.message || "تعذر التحديث.")
      setMessage("تم الحفظ")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر التحديث")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="h-9 rounded-full border border-border bg-background px-3 text-xs"
      >
        {statuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <Button type="button" size="sm" className="h-9 rounded-full px-3" disabled={loading} onClick={saveStatus}>
        {loading ? "..." : "حفظ"}
      </Button>
      {message ? <span className="text-[11px] text-muted-foreground">{message}</span> : null}
    </div>
  )
}
