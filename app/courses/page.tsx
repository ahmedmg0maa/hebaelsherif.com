"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Clock, Filter, Star, Users } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { courses } from "@/lib/site-data"

const colorClass = {
  teal: "from-[color:rgba(47,97,115,0.92)] to-[color:rgba(47,97,115,0.72)]",
  gold: "from-[color:rgba(183,155,96,0.92)] to-[color:rgba(245,240,231,0.55)]",
  olive: "from-[color:rgba(107,114,78,0.92)] to-[color:rgba(183,155,96,0.72)]",
  burgundy: "from-[color:rgba(122,36,51,0.9)] to-[color:rgba(183,155,96,0.78)]",
}

export default function CoursesPage() {
  const categories = useMemo(() => ["الكل", ...new Set(courses.map((course) => course.category))], [])
  const [category, setCategory] = useState("الكل")
  const filtered = category === "الكل" ? courses : courses.filter((course) => course.category === category)

  return (
    <>
      <Header />
      <main dir="rtl">
        <section className="pt-20 section-padding soft-gradient sm:pt-24">
          <div className="container-brand text-center">
            <p className="eyebrow">الكورسات</p>
            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
              برامج رقمية تبني تحولًا حقيقيًا خطوة بخطوة.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              دروس قصيرة، تمارين عملية، وخرائط واضحة تساعدك على تحويل الوعي إلى ممارسة يومية مستقرة.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-brand">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <Filter className="h-4 w-4" /> تصفية حسب الموضوع
              </span>
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                    category === item
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="grid gap-7 lg:grid-cols-3">
              {filtered.map((course) => (
                <article
                  key={course.id}
                  className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`h-52 bg-gradient-to-br ${colorClass[course.color]} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                        {course.level}
                      </span>
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                    <h2 className="mt-12 text-3xl font-black leading-tight">{course.title}</h2>
                  </div>
                  <div className="p-6">
                    <p className="font-bold text-foreground">{course.subtitle}</p>
                    <p className="mt-3 leading-7 text-muted-foreground">{course.description}</p>
                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <span className="rounded-2xl bg-muted p-3">
                        <Clock className="mb-1 h-4 w-4 text-accent" />
                        {course.duration}
                      </span>
                      <span className="rounded-2xl bg-muted p-3">
                        <BookOpen className="mb-1 h-4 w-4 text-accent" />
                        {course.lessons} درس
                      </span>
                    </div>
                    <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                      {course.learn.slice(0, 3).map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <div>
                        {course.originalPrice && (
                          <p className="text-sm text-muted-foreground line-through latin">
                            {course.originalPrice.toLocaleString("en-US")} EGP
                          </p>
                        )}
                        <p className="text-2xl font-black text-primary latin">
                          {course.price.toLocaleString("en-US")} EGP
                        </p>
                      </div>
                      <Link href={`/courses/${course.id}`}>
                        <Button className="rounded-full">التفاصيل</Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container-brand">
            <div className="rounded-[2.5rem] border border-border bg-card p-8 text-center shadow-xl md:p-12">
              <Users className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-5 text-3xl font-black text-foreground sm:text-4xl">تحتاجين مسارًا مخصصًا؟</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-8 text-muted-foreground">
                يمكنك حجز جلسة تشخيصية قصيرة لتحديد الكورس الأنسب لمرحلتك الحالية.
              </p>
              <Link href="/booking" className="mt-7 inline-flex">
                <Button className="rounded-full bg-[var(--burgundy)] px-7 text-primary-foreground hover:bg-[var(--burgundy)]/90">
                  احجزي جلسة اختيار المسار
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
