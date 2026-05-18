import { NextRequest, NextResponse } from "next/server"
import {
  addDocument,
  getFirebaseAdminErrorMessage,
  isFirebaseConfigured,
  listBookingsForDate,
} from "@/lib/firebase/admin"
import {
  buildDailySlots,
  dateKey,
  getSessionPrice,
  hasBookingConflict,
  isClosedDay,
  isDateBeforeToday,
  normalizeDiscountCode,
  parseDateKey,
  validateBookingSlot,
  type SessionDuration,
} from "@/lib/booking-rules"

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function duration(value: unknown): SessionDuration {
  return Number(value) === 90 ? 90 : 60
}

function formatTime(value: Date) {
  const hours = value.getHours().toString().padStart(2, "0")
  const minutes = value.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

function firebaseConfigResponse() {
  return NextResponse.json(
    {
      ok: false,
      message: "تعذر تنفيذ الحجز الآن. إعدادات Firebase Admin غير مكتملة (FIREBASE_SERVICE_ACCOUNT_JSON).",
    },
    { status: 503 },
  )
}

export async function GET(request: NextRequest) {
  if (!isFirebaseConfigured()) {
    return firebaseConfigResponse()
  }

  const dateInput = text(request.nextUrl.searchParams.get("date"))
  const sessionDuration = duration(request.nextUrl.searchParams.get("duration"))
  const parsedDate = parseDateKey(dateInput)

  if (!parsedDate) {
    return NextResponse.json({ ok: false, message: "صيغة التاريخ غير صحيحة." }, { status: 400 })
  }
  if (isDateBeforeToday(parsedDate)) {
    return NextResponse.json({ ok: false, message: "لا يمكن اختيار تاريخ سابق." }, { status: 400 })
  }
  if (isClosedDay(parsedDate)) {
    return NextResponse.json({ ok: true, slots: [], message: "لا تتوفر حجوزات يوم الجمعة." })
  }

  const allSlots = buildDailySlots(parsedDate, sessionDuration)
  const existing = await listBookingsForDate(dateInput)
  const slots = allSlots.filter((slot) => !hasBookingConflict(new Date(slot.value), sessionDuration, existing))

  return NextResponse.json({
    ok: true,
    slots,
    allSlots: allSlots.length,
    availableSlots: slots.length,
  })
}

export async function POST(request: Request) {
  if (!isFirebaseConfigured()) {
    return firebaseConfigResponse()
  }

  try {
    const body = await request.json()
    const customerName = text(body.customerName || body.name)
    const phone = text(body.phone)
    const email = text(body.email)
    const message = text(body.message)
    const discountCode = normalizeDiscountCode(body.discountCode)
    const sessionDuration = duration(body.duration)
    const userId = text(body.userId)
    const startTimeInput = text(body.startTime)
    const dateInput = text(body.date)
    const timeInput = text(body.time)

    const slotInput = startTimeInput || (dateInput && timeInput ? `${dateInput}T${timeInput}` : "")
    if (!customerName || !phone || !email || !slotInput) {
      return NextResponse.json({ ok: false, message: "يرجى استكمال بيانات الحجز." }, { status: 400 })
    }

    const slot = validateBookingSlot(slotInput, sessionDuration)
    if (!slot.ok || !slot.date) {
      return NextResponse.json({ ok: false, message: slot.message }, { status: 400 })
    }

    if (isDateBeforeToday(slot.date)) {
      return NextResponse.json({ ok: false, message: "لا يمكن اختيار تاريخ سابق." }, { status: 400 })
    }
    if (isClosedDay(slot.date)) {
      return NextResponse.json({ ok: false, message: "لا تتوفر حجوزات يوم الجمعة." }, { status: 400 })
    }

    const bookingDate = dateKey(slot.date)
    const bookingTime = formatTime(slot.date)

    const existing = await listBookingsForDate(bookingDate)
    if (hasBookingConflict(slot.date, sessionDuration, existing)) {
      return NextResponse.json({ ok: false, message: "هذا الموعد غير متاح. يرجى اختيار موعد آخر." }, { status: 409 })
    }

    const price = getSessionPrice(sessionDuration, discountCode)
    const now = new Date().toISOString()

    const payload: Record<string, unknown> = {
      customerName,
      email,
      phone,
      duration: sessionDuration,
      date: bookingDate,
      time: bookingTime,
      amount: price.finalPrice,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      source: "website",
      startTime: slot.date.toISOString(),
    }

    if (userId) payload.userId = userId
    if (message) payload.message = message
    if (discountCode) payload.discountCode = discountCode

    const saved = await addDocument("bookings", payload)
    if (!saved.ok || !saved.id) {
      const message =
        getFirebaseAdminErrorMessage(saved.error) || "تعذر حفظ الحجز حاليًا. يرجى المحاولة مرة أخرى."
      return NextResponse.json({ ok: false, message }, { status: 503 })
    }

    return NextResponse.json({
      ok: true,
      bookingId: saved.id,
      price,
      status: "pending",
      message: "تم إرسال طلب الحجز بنجاح. سنراجع الموعد ونؤكد لكِ قريبًا.",
    })
  } catch {
    return NextResponse.json({ ok: false, message: "تعذر قراءة بيانات الحجز." }, { status: 400 })
  }
}
