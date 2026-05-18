import { NextRequest, NextResponse } from "next/server"
import { addDocument, listBookingsForDate } from "@/lib/firebase/admin"
import {
  buildDailySlots,
  dateKey,
  getSessionPrice,
  hasBookingConflict,
  isClosedDay,
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

export async function GET(request: NextRequest) {
  const dateInput = text(request.nextUrl.searchParams.get("date"))
  const sessionDuration = duration(request.nextUrl.searchParams.get("duration"))
  const parsedDate = parseDateKey(dateInput)

  if (!parsedDate) {
    return NextResponse.json({ ok: false, message: "صيغة التاريخ غير صحيحة." }, { status: 400 })
  }

  if (isClosedDay(parsedDate)) {
    return NextResponse.json({
      ok: true,
      slots: [],
      message: "لا تتوفر مواعيد في هذا اليوم.",
    })
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
  try {
    const body = await request.json()
    const name = text(body.name)
    const phone = text(body.phone)
    const email = text(body.email)
    const message = text(body.message)
    const startTime = text(body.startTime)
    const discountCode = normalizeDiscountCode(body.discountCode)
    const sessionDuration = duration(body.duration)

    if (!name || !phone || !email || !startTime) {
      return NextResponse.json(
        { ok: false, message: "برجاء إدخال الاسم والهاتف والبريد والموعد." },
        { status: 400 },
      )
    }

    const slot = validateBookingSlot(startTime, sessionDuration)
    if (!slot.ok || !slot.date) {
      return NextResponse.json({ ok: false, message: slot.message }, { status: 400 })
    }

    const existing = await listBookingsForDate(dateKey(slot.date))
    if (hasBookingConflict(slot.date, sessionDuration, existing)) {
      return NextResponse.json(
        {
          ok: false,
          message: "هذا الموعد غير متاح، يرجى اختيار موعد آخر.",
        },
        { status: 409 },
      )
    }

    const price = getSessionPrice(sessionDuration, discountCode)
    const saved = await addDocument("bookings", {
      name,
      phone,
      email,
      message,
      service: "coaching",
      startTime: slot.date.toISOString(),
      startDate: dateKey(slot.date),
      duration: sessionDuration,
      discountCode: discountCode || null,
      originalPrice: price.originalPrice,
      finalPrice: price.finalPrice,
      discountApplied: price.discountApplied,
      status: "pending",
    })

    return NextResponse.json({
      ok: true,
      bookingId: saved.id,
      price,
      message: "تم استلام طلب الحجز بنجاح.",
    })
  } catch {
    return NextResponse.json({ ok: false, message: "تعذر قراءة بيانات الحجز." }, { status: 400 })
  }
}
