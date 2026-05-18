export type SessionDuration = 60 | 90

export const BOOKING_RULES = {
  workStartHour: 7,
  workEndHour: 20,
  closedDay: 5,
  bufferMinutes: 60,
  timezone: "Africa/Cairo",
  discountCodes: ["HEBA", "WA3Y", "AWARE"],
} as const

export const SESSION_PRICES: Record<SessionDuration, { label: string; price: number; discountedPrice: number }> = {
  60: { label: "60 دقيقة", price: 1200, discountedPrice: 1000 },
  90: { label: "90 دقيقة", price: 1500, discountedPrice: 1300 },
}

const DATE_TIME_LOCAL_REGEX = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/
const DATE_KEY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

export function normalizeDiscountCode(code?: string) {
  return String(code || "").trim().toUpperCase()
}

export function isValidDiscountCode(code?: string) {
  const normalized = normalizeDiscountCode(code)
  return Boolean(normalized && BOOKING_RULES.discountCodes.includes(normalized as never))
}

export function getSessionPrice(duration: SessionDuration, code?: string) {
  const item = SESSION_PRICES[duration]
  const discountApplied = isValidDiscountCode(code)
  return {
    duration,
    originalPrice: item.price,
    finalPrice: discountApplied ? item.discountedPrice : item.price,
    discountApplied,
  }
}

export function parseBookingDate(value: string) {
  const direct = new Date(value)
  if (!Number.isNaN(direct.getTime())) return direct

  const parts = DATE_TIME_LOCAL_REGEX.exec(value)
  if (!parts) return null

  const [, year, month, day, hour, minute] = parts
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), 0, 0)
  return Number.isNaN(date.getTime()) ? null : date
}

export function isClosedDay(date: Date) {
  return date.getDay() === BOOKING_RULES.closedDay
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayDateKey() {
  return dateKey(new Date())
}

export function parseDateKey(value: string) {
  const match = DATE_KEY_REGEX.exec(value)
  if (!match) return null

  const [, year, month, day] = match
  const y = Number(year)
  const m = Number(month)
  const d = Number(day)

  const date = new Date(y, m - 1, d, 0, 0, 0, 0)
  if (Number.isNaN(date.getTime())) return null
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}

export function isDateBeforeToday(date: Date) {
  return startOfDay(date).getTime() < startOfDay(new Date()).getTime()
}

export function validateBookingSlot(value: string, duration: SessionDuration) {
  const date = parseBookingDate(value)
  if (!date) {
    return { ok: false, message: "يرجى اختيار تاريخ ووقت صحيح." }
  }
  if (![60, 90].includes(duration)) {
    return { ok: false, message: "مدة الجلسة غير صحيحة." }
  }
  if (isDateBeforeToday(date)) {
    return { ok: false, message: "لا يمكن اختيار تاريخ سابق." }
  }
  if (isClosedDay(date)) {
    return { ok: false, message: "لا تتوفر حجوزات يوم الجمعة." }
  }

  const hour = date.getHours()
  const minute = date.getMinutes()
  const end = new Date(date.getTime() + duration * 60 * 1000)
  if (hour < BOOKING_RULES.workStartHour || hour >= BOOKING_RULES.workEndHour || minute !== 0) {
    return { ok: false, message: "هذا الموعد غير متاح. يرجى اختيار موعد آخر." }
  }
  if (end.getHours() > BOOKING_RULES.workEndHour || (end.getHours() === BOOKING_RULES.workEndHour && end.getMinutes() > 0)) {
    return { ok: false, message: "هذا الموعد غير متاح. يرجى اختيار موعد آخر." }
  }

  return { ok: true, date }
}

export type TimeSlot = {
  label: string
  value: string
}

export function buildDailySlots(date: Date, duration: SessionDuration) {
  const slots: TimeSlot[] = []
  if (isClosedDay(date) || isDateBeforeToday(date)) return slots

  for (let hour = BOOKING_RULES.workStartHour; hour < BOOKING_RULES.workEndHour; hour += 1) {
    const candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0, 0)
    const validation = validateBookingSlot(candidate.toISOString(), duration)
    if (!validation.ok || !validation.date) continue
    slots.push({
      label: `${pad(hour)}:00`,
      value: validation.date.toISOString(),
    })
  }

  return slots
}

export function hasBookingConflict(
  candidateStart: Date,
  duration: SessionDuration,
  existing: { startTime: string; duration: number; status?: string }[],
) {
  const bufferMs = BOOKING_RULES.bufferMinutes * 60 * 1000
  const candidateEnd = new Date(candidateStart.getTime() + duration * 60 * 1000)

  return existing.some((booking) => {
    if (["cancelled", "rejected"].includes(String(booking.status || "").toLowerCase())) return false
    const start = new Date(booking.startTime)
    if (Number.isNaN(start.getTime())) return false
    const end = new Date(start.getTime() + Number(booking.duration || 60) * 60 * 1000)
    return candidateStart.getTime() < end.getTime() + bufferMs && candidateEnd.getTime() + bufferMs > start.getTime()
  })
}
