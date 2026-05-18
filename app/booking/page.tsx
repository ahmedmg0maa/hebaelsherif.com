"use client"

import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CalendarDays, CheckCircle2, MessageCircle } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSessionPrice, SESSION_PRICES, type SessionDuration } from "@/lib/booking-rules"

type BookingPrice = {
  finalPrice: number
  originalPrice: number
  discountApplied: boolean
}

type BookingSuccess = {
  bookingId?: string
  price?: BookingPrice
}

type Slot = {
  label: string
  value: string
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const initialDuration = searchParams.get("duration") === "90" ? 90 : 60
  const [submitted, setSubmitted] = useState<BookingSuccess | null>(null)
  const [duration, setDuration] = useState<SessionDuration>(initialDuration)
  const [discountCode, setDiscountCode] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsMessage, setSlotsMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const price = useMemo(() => getSessionPrice(duration, discountCode), [duration, discountCode])
  const hasDiscountCode = discountCode.trim().length > 0
  const couponStateMessage = hasDiscountCode
    ? price.discountApplied
      ? "تم تطبيق الكود بنجاح"
      : "الكود غير صالح أو منتهي"
    : ""

  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate) {
        setSlots([])
        setSlotsMessage("")
        setSelectedSlot("")
        return
      }

      setSlotsLoading(true)
      setSlotsMessage("")
      setSelectedSlot("")

      try {
        const response = await fetch(`/api/booking?date=${encodeURIComponent(selectedDate)}&duration=${duration}`)
        const result = await response.json()
        if (!response.ok || !result.ok) throw new Error(result.message || "تعذر تحميل المواعيد.")

        const loadedSlots = Array.isArray(result.slots) ? result.slots : []
        setSlots(loadedSlots)
        if (loadedSlots.length === 0) setSlotsMessage("لا تتوفر مواعيد لهذا اليوم.")
      } catch {
        setSlots([])
        setSlotsMessage("تعذر تحميل المواعيد. يرجى اختيار يوم آخر.")
      } finally {
        setSlotsLoading(false)
      }
    }

    void fetchSlots()
  }, [selectedDate, duration])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!selectedSlot) {
      setIsSubmitting(false)
      setError("يرجى اختيار تاريخ ثم موعد متاح.")
      return
    }

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      startTime: selectedSlot,
      duration,
      discountCode,
      message: String(formData.get("message") ?? ""),
    }

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.message || "تعذر إرسال طلب الحجز.")
      setSubmitted({ bookingId: result.bookingId, price: result.price })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "حدث خطأ غير متوقع.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main dir="rtl">
        <section className="pt-20 section-padding soft-gradient sm:pt-24">
          <div className="container-brand grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="eyebrow">جلسة خاصة</p>
              <h1 className="mt-5 text-4xl font-black leading-tight text-foreground sm:text-5xl">
                احجزي جلستك الخاصة
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
                اختاري المدة والموعد المناسب، وسنساعدكِ على بدء جلسة واضحة وهادئة تناسب احتياجك.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-bold text-foreground">جلسة 60 دقيقة — 1200 ج.م</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-bold text-foreground">جلسة 90 دقيقة — 1500 ج.م</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2.2rem] border border-border bg-card p-6 shadow-xl md:p-8">
              {submitted ? (
                <div className="py-16 text-center">
                  <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
                  <h2 className="mt-6 text-3xl font-black">تم استلام طلب الحجز</h2>
                  <p className="mx-auto mt-4 max-w-md leading-8 text-muted-foreground">
                    رقم الحجز: <span className="latin font-bold text-primary">{submitted.bookingId}</span>. سنقوم بالتواصل
                    معكِ لتأكيد الموعد.
                  </p>
                  <Button className="mt-8 rounded-full" onClick={() => setSubmitted(null)}>
                    حجز موعد آخر
                  </Button>
                </div>
              ) : (
                <form className="grid gap-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <Input id="name" name="name" required className="h-12 rounded-2xl bg-secondary/55" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف / واتساب</Label>
                      <Input id="phone" name="phone" required className="h-12 rounded-2xl bg-secondary/55" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" name="email" type="email" required className="h-12 rounded-2xl bg-secondary/55" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>مدة الجلسة</Label>
                      <Select value={String(duration)} onValueChange={(value) => setDuration(Number(value) as SessionDuration)}>
                        <SelectTrigger className="h-12 rounded-2xl bg-secondary/55">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SESSION_PRICES).map(([key, item]) => (
                            <SelectItem key={key} value={key}>
                              {item.label} — {item.price} ج.م
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">اليوم</Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className="h-12 rounded-2xl bg-secondary/55"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slot">الوقت المتاح</Label>
                    <Select value={selectedSlot} onValueChange={setSelectedSlot} disabled={slotsLoading || slots.length === 0}>
                      <SelectTrigger id="slot" className="h-12 rounded-2xl bg-secondary/55">
                        <SelectValue placeholder={slotsLoading ? "جاري تحميل المواعيد..." : "اختاري موعدًا متاحًا"} />
                      </SelectTrigger>
                      <SelectContent>
                        {slots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {slotsMessage && <p className="text-sm text-muted-foreground">{slotsMessage}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountCode">الكود الخاص</Label>
                    <Input
                      id="discountCode"
                      value={discountCode}
                      onChange={(event) => setDiscountCode(event.target.value)}
                      placeholder="لديكِ كود خاص؟"
                      className="h-12 rounded-2xl bg-secondary/55 uppercase"
                    />
                    {couponStateMessage && (
                      <p
                        className={`text-sm font-bold ${
                          price.discountApplied ? "text-accent" : "text-destructive"
                        }`}
                      >
                        {couponStateMessage}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4">
                    <p className="text-sm font-bold text-foreground">ملخص الحجز</p>
                    <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                      <span>السعر الأساسي</span>
                      <span className="font-bold text-foreground">{price.originalPrice.toLocaleString("en-US")} ج.م</span>
                    </div>
                    {price.discountApplied && (
                      <div className="mt-2 flex items-center justify-between text-sm text-accent">
                        <span>السعر بعد الكود</span>
                        <span className="font-bold">{price.finalPrice.toLocaleString("en-US")} ج.م</span>
                      </div>
                    )}
                    <p className="mt-3 text-3xl font-black text-primary latin">
                      {price.finalPrice.toLocaleString("en-US")} EGP
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">ملاحظاتك قبل الجلسة</Label>
                    <Textarea id="message" name="message" className="min-h-28 rounded-2xl bg-secondary/55" />
                  </div>

                  <div className="rounded-2xl bg-secondary/50 p-4 text-sm leading-7 text-muted-foreground">
                    <CalendarDays className="mb-2 h-5 w-5 text-accent" />
                    بعد اختيار اليوم، ستظهر لكِ المواعيد المتاحة مباشرة.
                  </div>

                  {error && (
                    <p className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">
                      {error}
                    </p>
                  )}

                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="h-12 rounded-full bg-[var(--burgundy)] text-base text-primary-foreground hover:bg-[var(--burgundy)]/90"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {isSubmitting ? "جاري إرسال الطلب..." : "إرسال طلب الحجز"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
