import { NextResponse } from "next/server"
import { addDocument } from "@/lib/firebase/admin"
import { getCatalogBookBySlug, getCatalogCourseBySlug } from "@/lib/catalog"

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
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
    const customerName = text(body.name)
    const email = text(body.email)
    const phone = text(body.phone)
    const paymentMethod = text(body.paymentMethod) || "manual"
    const userId = text(body.userId) || undefined

    if (!productId || !productType || !customerName || !email || !phone) {
      return NextResponse.json({ ok: false, message: "برجاء استكمال بيانات الطلب." }, { status: 400 })
    }

    let resolvedProduct:
      | { id: string; title: string; price: number; status: string; type: "course" | "book" }
      | null = null

    if (productType === "course") {
      const course = await getCatalogCourseBySlug(productId)
      if (course) {
        resolvedProduct = {
          id: course.id,
          title: course.title,
          price: course.price,
          status: course.status,
          type: "course",
        }
      }
    }

    if (productType === "book") {
      const book = await getCatalogBookBySlug(productId)
      if (book) {
        resolvedProduct = {
          id: book.id,
          title: book.title,
          price: book.price,
          status: book.status,
          type: "book",
        }
      }
    }

    if (!resolvedProduct || resolvedProduct.status !== "active" || resolvedProduct.price <= 0) {
      return NextResponse.json({ ok: false, message: "هذا المنتج غير متاح للشراء حاليًا." }, { status: 400 })
    }

    const orderNumber = makeOrderNumber()
    const saved = await addDocument("orders", {
      orderNumber,
      userId: userId || null,
      productId: resolvedProduct.id,
      productType: resolvedProduct.type,
      productTitle: resolvedProduct.title,
      amount: resolvedProduct.price,
      currency: "EGP",
      customerName,
      name: customerName,
      email,
      phone,
      paymentMethod,
      status: "pending",
    })

    if (!saved.ok || !saved.id) {
      return NextResponse.json(
        { ok: false, message: "تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى." },
        { status: 503 },
      )
    }

    return NextResponse.json({
      ok: true,
      orderId: saved.id,
      orderNumber,
      status: "pending",
      message: "تم إرسال الطلب بنجاح وهو قيد المراجعة.",
    })
  } catch {
    return NextResponse.json({ ok: false, message: "تعذر إنشاء طلب الشراء." }, { status: 400 })
  }
}
