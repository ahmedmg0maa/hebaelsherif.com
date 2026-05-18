"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FileText,
  Gift,
  HeartHandshake,
  LayoutDashboard,
  Lock,
  Mail,
  MessageCircleHeart,
  PlayCircle,
  ReceiptText,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  WalletCards,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const accountCourses = [
  {
    title: "رحلة العودة إلى الذات",
    progress: 42,
    nextLesson: "الأسبوع الثالث: الحدود الصحية",
    href: "/courses/efham-nafsak",
    status: "مفعّل",
  },
  {
    title: "اتزان المشاعر",
    progress: 18,
    nextLesson: "تمرين تهدئة الجهاز العصبي",
    href: "/courses/ettekhaz-el-qarar",
    status: "جديد",
  },
]

const accountSessions = [
  {
    title: "جلسة كوتشنج فردية",
    date: "الأحد 24 مايو",
    time: "7:00 مساءً",
    status: "بانتظار التأكيد",
  },
  {
    title: "متابعة بعد الجلسة",
    date: "الأربعاء 27 مايو",
    time: "رسالة متابعة",
    status: "مجدولة",
  },
]

const accountOrders = [
  {
    id: "HES-1027",
    item: "رحلة العودة إلى الذات",
    date: "14 مايو 2026",
    amount: "1,450 EGP",
    status: "مدفوع",
  },
  {
    id: "HES-1024",
    item: "هدوء من الداخل",
    date: "10 مايو 2026",
    amount: "320 EGP",
    status: "جاهز للتحميل",
  },
]

const profileInitial = {
  name: "سارة محمد",
  email: "sara@example.com",
  phone: "+20 100 000 0000",
  goal: "أريد فهم مشاعري وبناء حدود أوضح في العلاقات.",
}

function getInitialLoggedIn() {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem("heba-account-auth") === "true"
}

function getInitialProfile() {
  if (typeof window === "undefined") return profileInitial
  try {
    const saved = window.localStorage.getItem("heba-account-profile")
    return saved ? { ...profileInitial, ...JSON.parse(saved) } : profileInitial
  } catch {
    return profileInitial
  }
}

export default function AccountPage() {
  const [loggedIn, setLoggedIn] = useState(getInitialLoggedIn)
  const [showPassword, setShowPassword] = useState(false)
  const [profile, setProfile] = useState(getInitialProfile)
  const [success, setSuccess] = useState("")
  const [preferences, setPreferences] = useState({ email: true, whatsapp: true, reminders: true })

  const totalProgress = useMemo(
    () => Math.round(accountCourses.reduce((sum, course) => sum + course.progress, 0) / accountCourses.length),
    [],
  )

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    window.localStorage.setItem("heba-account-auth", "true")
    setLoggedIn(true)
    setSuccess("تم تسجيل الدخول بنجاح.")
  }

  function logout() {
    window.localStorage.removeItem("heba-account-auth")
    setLoggedIn(false)
    setSuccess("")
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    window.localStorage.setItem("heba-account-profile", JSON.stringify(profile))
    setSuccess("تم حفظ بيانات الحساب بنجاح.")
  }

  if (!loggedIn) {
    return (
      <>
        <Header />
        <main className="pt-20 section-padding soft-gradient sm:pt-24" dir="rtl">
          <div className="container-brand grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <section className="mx-auto max-w-xl text-center lg:text-right">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-primary/10 text-primary lg:mx-0">
                <User className="h-8 w-8" />
              </div>
              <p className="eyebrow">حساب هبة الشريف</p>
              <h1 className="mt-5 text-5xl font-black leading-tight text-foreground sm:text-6xl">
                كل رحلتك في مساحة واحدة.
              </h1>
              <p className="mt-6 text-lg leading-9 text-muted-foreground">
                ادخلي لمتابعة الكورسات، الجلسات، الطلبات، الفواتير، التحميلات، وتفضيلات التواصل من مساحة واحدة.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: BookOpen, title: "الكورسات" },
                  { icon: CalendarDays, title: "الجلسات" },
                  { icon: ReceiptText, title: "الفواتير" },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur">
                    <item.icon className="mx-auto h-7 w-7 text-accent lg:mx-0" />
                    <p className="mt-3 font-bold text-foreground">{item.title}</p>
                  </div>
                ))}
              </div>
            </section>

        <section className="mx-auto w-full max-w-md rounded-[2.25rem] border border-border bg-card/90 p-6 shadow-xl backdrop-blur-md">
              <Tabs defaultValue="login">
                <TabsList className="mb-6 grid w-full grid-cols-2 rounded-full bg-muted p-1">
                  <TabsTrigger value="login" className="rounded-full">دخول</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-full">تسجيل جديد</TabsTrigger>
                </TabsList>

                {[
                  { value: "login", title: "مرحبًا بعودتك", button: "دخول للحساب" },
                  { value: "register", title: "أنشئي حسابك", button: "إنشاء حساب جديد" },
                ].map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    <form className="space-y-4" onSubmit={login}>
                      <div className="mb-5 text-center">
                        <h2 className="text-2xl font-black text-foreground">{tab.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">أدخلي بياناتك لإدارة رحلتك التعليمية وحجوزاتك بكل سهولة.</p>
                      </div>

                      {tab.value === "register" && (
                        <div className="space-y-2">
                          <Label htmlFor="name">الاسم</Label>
                          <Input id="name" required className="h-12 rounded-2xl bg-background" placeholder="اكتبي اسمك" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor={`${tab.value}-email`}>البريد الإلكتروني</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input id={`${tab.value}-email`} type="email" required className="h-12 rounded-2xl bg-background pr-10" placeholder="name@email.com" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${tab.value}-password`}>كلمة المرور</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                          <Input id={`${tab.value}-password`} type={showPassword ? "text" : "password"} required className="h-12 rounded-2xl bg-background px-10" placeholder="••••••••" />
                          <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="إظهار كلمة المرور">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <Button type="submit" className="h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {tab.button}
                      </Button>
                    </form>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-6 rounded-3xl border border-accent/25 bg-accent/10 p-4 text-sm leading-7 text-muted-foreground">
                <ShieldCheck className="mb-2 h-5 w-5 text-accent" />
                يتم التعامل مع بيانات الحساب بحماية عالية لضمان الخصوصية والأمان.
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-20 section-padding sm:pt-24" dir="rtl">
        <div className="container-brand">
      <section className="relative overflow-hidden rounded-[2.75rem] border border-border bg-card p-6 shadow-[0_16px_45px_rgba(23,50,60,0.1)] sm:p-8">
        <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-accent/10 blur-lg" />
        <div className="absolute -bottom-16 right-20 h-44 w-44 rounded-full bg-primary/7 blur-lg" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow">لوحة الحساب</p>
                <h1 className="mt-4 text-4xl font-black text-foreground sm:text-5xl">مرحبًا، {profile.name}</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                  تابعي رحلتك، دروسك، مواعيدك، طلباتك، وأي ملفات رقمية من مكان واحد.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/booking">
                  <Button className="rounded-full bg-[var(--burgundy)] text-primary-foreground hover:bg-[var(--burgundy)]/90">
                    حجز جلسة جديدة
                  </Button>
                </Link>
                <Button variant="outline" className="rounded-full bg-transparent" onClick={logout}>تسجيل خروج</Button>
              </div>
            </div>
          </section>

          {success && (
            <div className="mt-6 flex items-center gap-3 rounded-3xl border border-accent/30 bg-accent/10 p-4 text-sm font-bold text-foreground">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              {success}
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: BookOpen, label: "كورسات مفعلة", value: accountCourses.length, note: "برنامجين قيد المتابعة" },
              { icon: CalendarDays, label: "مواعيد قادمة", value: accountSessions.length, note: "جلسة ومتابعة" },
              { icon: WalletCards, label: "طلبات", value: accountOrders.length, note: "مدفوعات وتحميلات" },
              { icon: Award, label: "نسبة الإنجاز", value: `${totalProgress}%`, note: "متوسط تقدم البرامج" },
            ].map((item) => (
              <div key={item.label} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-3xl font-black text-foreground latin">{item.value}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="overview" className="mt-10">
            <TabsList className="mb-8 flex h-auto flex-wrap justify-start gap-2 rounded-[2rem] bg-muted p-2">
              {[
                { value: "overview", label: "نظرة عامة", icon: LayoutDashboard },
                { value: "learning", label: "كورساتي", icon: PlayCircle },
                { value: "sessions", label: "جلساتي", icon: MessageCircleHeart },
                { value: "orders", label: "طلباتي", icon: ReceiptText },
                { value: "profile", label: "الإعدادات", icon: Settings },
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="rounded-full px-4 py-2">
                  <tab.icon className="ml-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="eyebrow">الخطوة التالية</p>
                      <h2 className="mt-3 text-3xl font-black text-foreground">اكملي درس الحدود الصحية</h2>
                    </div>
                    <Sparkles className="h-9 w-9 text-accent" />
                  </div>
                  <p className="mt-4 leading-8 text-muted-foreground">
                    بناءً على مسارك الحالي، الدرس التالي يساعدك على فهم أين ينتهي دورك وأين يبدأ دور الآخر.
                  </p>
                  <div className="mt-6 rounded-3xl bg-muted p-5">
                    <div className="mb-3 flex items-center justify-between text-sm font-bold">
                      <span>تقدم البرنامج</span>
                      <span className="latin text-primary">42%</span>
                    </div>
                    <Progress value={42} className="h-3" />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/courses/efham-nafsak"><Button className="rounded-full bg-primary text-primary-foreground">استكمال التعلم</Button></Link>
                    <Link href="/contact"><Button variant="outline" className="rounded-full bg-transparent">طلب مساعدة</Button></Link>
                  </div>
                </div>

                <div className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm">
                  <p className="eyebrow">تذكير لطيف</p>
                  <h2 className="mt-3 text-3xl font-black text-foreground">سجلي شعورك اليوم</h2>
                  <p className="mt-4 leading-8 text-muted-foreground">
                    دقيقة واحدة من الكتابة قد توضح لكِ ما يحتاج انتباهك اليوم.
                  </p>
                  <textarea className="mt-5 min-h-32 w-full rounded-3xl border border-border bg-background p-4 text-sm outline-none focus:border-accent" placeholder="ما الشعور الأكثر حضورًا الآن؟" />
                  <Button className="mt-4 w-full rounded-full bg-[var(--olive)] text-white hover:bg-[var(--olive)]/90">حفظ ملاحظة اليوم</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="learning">
              <div className="grid gap-6 lg:grid-cols-2">
                {accountCourses.map((course) => (
                  <article key={course.title} className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <PlayCircle className="h-7 w-7" />
                      </div>
                      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">{course.status}</span>
                    </div>
                    <h2 className="mt-5 text-2xl font-black text-foreground">{course.title}</h2>
                    <p className="mt-3 leading-7 text-muted-foreground">التالي: {course.nextLesson}</p>
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-sm font-bold"><span>التقدم</span><span className="latin text-primary">{course.progress}%</span></div>
                      <Progress value={course.progress} className="h-3" />
                    </div>
                    <Link href={course.href} className="mt-6 inline-flex">
                      <Button className="rounded-full bg-primary text-primary-foreground">فتح البرنامج</Button>
                    </Link>
                  </article>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sessions">
              <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <div className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-3xl font-black text-foreground">مواعيدي القادمة</h2>
                  <div className="mt-6 grid gap-4">
                    {accountSessions.map((session) => (
                      <div key={`${session.title}-${session.date}`} className="flex flex-col gap-4 rounded-3xl border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-black text-foreground">{session.title}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{session.date} · {session.time}</p>
                        </div>
                        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{session.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm">
                  <HeartHandshake className="h-10 w-10 text-accent" />
                  <h3 className="mt-5 text-2xl font-black text-foreground">قبل الجلسة</h3>
                  <ul className="mt-4 grid gap-3 text-sm leading-7 text-muted-foreground">
                    <li>اكتبي 3 نقاط تريدين فهمها.</li>
                    <li>اختاري مكانًا هادئًا وسماعات مناسبة.</li>
                    <li>حضري دفترًا لالتقاط الأسئلة المهمة.</li>
                  </ul>
                  <Link href="/booking" className="mt-6 inline-flex w-full">
                    <Button className="w-full rounded-full bg-[var(--burgundy)] text-primary-foreground hover:bg-[var(--burgundy)]/90">حجز موعد آخر</Button>
                  </Link>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="eyebrow">الطلبات والفواتير</p>
                    <h2 className="mt-3 text-3xl font-black text-foreground">كل مشترياتك في مكان واحد</h2>
                  </div>
                  <Link href="/courses"><Button variant="outline" className="rounded-full bg-transparent">تصفح البرامج</Button></Link>
                </div>
                <div className="mt-6 grid gap-4">
                  {accountOrders.map((order) => (
                    <div key={order.id} className="grid gap-4 rounded-3xl border border-border bg-background p-5 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                      <div>
                        <p className="font-black text-foreground">{order.item}</p>
                        <p className="mt-2 text-sm text-muted-foreground">#{order.id} · {order.date}</p>
                      </div>
                      <p className="font-black text-primary latin">{order.amount}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">{order.status}</span>
                        <Button variant="outline" size="sm" className="rounded-full bg-transparent"><Download className="h-4 w-4" /> تحميل</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <form onSubmit={saveProfile} className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-3xl font-black text-foreground">بياناتي</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">الاسم</Label>
                      <Input id="profile-name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className="h-12 rounded-2xl bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">البريد</Label>
                      <Input id="profile-email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} className="h-12 rounded-2xl bg-background" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="profile-phone">رقم الهاتف</Label>
                      <Input id="profile-phone" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} className="h-12 rounded-2xl bg-background" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="profile-goal">هدفي الحالي</Label>
                      <textarea id="profile-goal" value={profile.goal} onChange={(event) => setProfile({ ...profile, goal: event.target.value })} className="min-h-28 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-accent" />
                    </div>
                  </div>
                  <Button type="submit" className="mt-6 rounded-full bg-primary text-primary-foreground">حفظ البيانات</Button>
                </form>

                <div className="rounded-[2.25rem] border border-border bg-card p-6 shadow-sm">
                  <h2 className="text-3xl font-black text-foreground">تفضيلات التواصل</h2>
                  <div className="mt-6 grid gap-3">
                    {[
                      { key: "email", label: "رسائل البريد", icon: Mail },
                      { key: "whatsapp", label: "واتساب", icon: MessageCircleHeart },
                      { key: "reminders", label: "تذكير الجلسات", icon: Bell },
                    ].map((item) => {
                      const key = item.key as keyof typeof preferences
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, [key]: !preferences[key] })}
                          className="flex items-center justify-between rounded-3xl border border-border bg-background p-4 text-right transition hover:border-accent"
                        >
                          <span className="flex items-center gap-3 font-bold text-foreground"><item.icon className="h-5 w-5 text-accent" />{item.label}</span>
                          <span className={cn("rounded-full px-3 py-1 text-xs font-bold", preferences[key] ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{preferences[key] ? "مفعّل" : "متوقف"}</span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-6 grid gap-3">
                    {[
                      { icon: FileText, label: "سياسة الخصوصية", href: "/privacy" },
                      { icon: Gift, label: "العروض القادمة", href: "/courses" },
                      { icon: CreditCard, label: "طرق الدفع", href: "/checkout" },
                    ].map((item) => (
                      <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-2xl bg-muted p-3 font-bold text-foreground transition hover:text-primary">
                        <item.icon className="h-5 w-5 text-accent" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  )
}
