import { NextResponse } from "next/server"

type Action = { label: string; href: string; tone?: "primary" | "secondary" | "soft" }

function clean(value: unknown, max = 300) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function containsAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word))
}

function actionsFor(text: string): Action[] {
  if (containsAny(text, ["حجز", "جلسة", "موعد"])) {
    return [
      { label: "احجزي جلستك الخاصة", href: "/booking", tone: "primary" },
      { label: "الأسعار", href: "/booking", tone: "soft" },
    ]
  }

  if (containsAny(text, ["كتاب", "كتب"])) {
    return [
      { label: "كل الكتب", href: "/books", tone: "primary" },
      { label: "باب الخروج", href: "/books/bab-el-khorog", tone: "secondary" },
    ]
  }

  if (containsAny(text, ["كورس", "برنامج", "تعلم"])) {
    return [
      { label: "كل الكورسات", href: "/courses", tone: "primary" },
      { label: "افهم نفسك", href: "/courses/efham-nafsak", tone: "secondary" },
    ]
  }

  return [
    { label: "ابدئي من هنا", href: "/services", tone: "primary" },
    { label: "احجزي جلسة", href: "/booking", tone: "secondary" },
  ]
}

function replyFor(text: string) {
  if (containsAny(text, ["حجز", "جلسة", "موعد"])) {
    return "اختاري المدة والموعد المناسبين، وستظهر لكِ المواعيد المتاحة مباشرة داخل صفحة الحجز."
  }
  if (containsAny(text, ["كتاب", "كتب"])) {
    return "تصفحي قسم الكتب واختاري الإصدار الأقرب لمرحلتك الحالية."
  }
  if (containsAny(text, ["كورس", "برنامج", "تعلم"])) {
    return "اختاري الكورس الأنسب لاحتياجك، ويمكنكِ مقارنة كل البرامج قبل القرار."
  }
  if (containsAny(text, ["سعر", "تكلفة"])) {
    return "أسعار الجلسات: 60 دقيقة — 1200 ج.م، و90 دقيقة — 1500 ج.م."
  }
  return "اختاري المسار الأقرب لاحتياجك، وسنرشدكِ مباشرة للصفحة الأنسب."
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string }
    const text = clean(body.text)
    if (!text) {
      return NextResponse.json({ ok: false, message: "يرجى اختيار مسار للمتابعة." }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      reply: replyFor(text),
      suggestedActions: actionsFor(text),
    })
  } catch {
    return NextResponse.json({ ok: false, message: "تعذر تشغيل المساعد حاليًا." }, { status: 500 })
  }
}
