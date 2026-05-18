import { NextResponse } from "next/server"
import { addDocument } from "@/lib/firebase/admin"

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function amount(value: unknown) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function makeOrderNumber() {
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `HB-${new Date().getFullYear()}-${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const productId = text(body.productId)
    const productType = text(body.productType)
    const productTitle = text(body.productTitle)
    const name = text(body.name)
    const email = text(body.email)
    const phone = text(body.phone)
    const paymentMethod = text(body.paymentMethod) || "manual"
    const total = amount(body.amount)

    if (!productId || !productType || !productTitle || !total || !name || !email || !phone) {
      return NextResponse.json({ ok: false, message: "برجاء استكمال بيانات الطلب." }, { status: 400 })
    }

    const orderNumber = makeOrderNumber()
    const saved = await addDocument("orders", {
      orderNumber,
      productId,
      productType,
      productTitle,
      amount: total,
      currency: "EGP",
      name,
      email,
      phone,
      paymentMethod,
      status: "pending", // pending | paid | cancelled
    })

    return NextResponse.json({
      ok: true,
      orderId: saved.id,
      orderNumber,
      status: "pending",
      message: "تم إنشاء الطلب بنجاح.",
    })
  } catch {
    return NextResponse.json({ ok: false, message: "تعذر إنشاء طلب الشراء." }, { status: 400 })
  }
}
