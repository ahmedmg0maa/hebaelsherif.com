import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  Brain,
  CalendarHeart,
  Compass,
  Feather,
  HeartHandshake,
  Layers3,
  MessageCircleHeart,
  MoonStar,
  Sparkles,
  Target,
  Users,
} from "lucide-react"

export const brand = {
  name: "هبة الشريف",
  englishName: "Heba El Sharif",
  tagline: "نقطة وعي",
  promise: "رحلة وعي تعيدك إلى ذاتك",
  shortBio:
    "لايف كوتش معتمدة، كاتبة ومدربة وعي بالذات. ترافقك في رحلة هادئة لفهم النفس، فك الأنماط المتكررة، واتخاذ قرارات أكثر اتزانًا.",
  whatsapp: "+201000000000",
  email: "hello@hebaelsharif.com",
  location: "القاهرة، مصر · جلسات أونلاين حول العالم",
}

export const navItems = [
  { name: "الرئيسية", href: "/" },
  { name: "من هي هبة", href: "/about" },
  { name: "الخدمات", href: "/services" },
  { name: "الكورسات", href: "/courses" },
  { name: "الكتب", href: "/books" },
  { name: "المقالات", href: "/blog" },
  { name: "تواصل", href: "/contact" },
]

export const stats = [
  { value: "1:1", label: "جلسات فردية عميقة" },
  { value: "5", label: "كورسات عملية" },
  { value: "4", label: "كتب في الوعي" },
  { value: "Premium", label: "تجربة شخصية راقية" },
]

export type Service = {
  id: string
  title: string
  kicker: string
  description: string
  duration: string
  price: string
  href: string
  icon: LucideIcon
  featured?: boolean
  points: string[]
}

export const services: Service[] = [
  {
    id: "coaching",
    title: "جلسات كوتشنج فردية 1:1",
    kicker: "مساحة شخصية عميقة",
    description:
      "جلسات خاصة لفهم المشاعر، تفكيك الأنماط المتكررة، وبناء خطوات عملية واضحة تناسب واقعك الحالي.",
    duration: "60 أو 90 دقيقة",
    price: "1200 / 1500 ج.م",
    href: "/booking?service=coaching",
    icon: MessageCircleHeart,
    featured: true,
    points: ["جلسة 60 دقيقة بسعر 1200 ج.م", "جلسة 90 دقيقة بسعر 1500 ج.م", "تأكيد الموعد يتم برسالة خاصة بعد الحجز"],
  },
  {
    id: "workshops",
    title: "ورش وعي تفاعلية",
    kicker: "تعلّم جماعي آمن",
    description: "ورش حية أونلاين أو حضوري حول العلاقات، الحدود، وتقدير الذات بأسلوب عملي وإنساني.",
    duration: "من ساعتين إلى يوم كامل",
    price: "حسب موضوع الورشة",
    href: "/contact",
    icon: Users,
    points: ["تمارين عملية", "نقاشات موجّهة", "ملفات عمل"],
  },
  {
    id: "courses",
    title: "كورسات وبرامج مسجلة",
    kicker: "تعلم وفق وتيرتك",
    description: "برامج تعليمية منظمة تجمع بين الوعي، التمارين، والتطبيق اليومي داخل مسار واضح.",
    duration: "4 - 8 أسابيع",
    price: "من 1200 جنيه",
    href: "/courses",
    icon: Layers3,
    points: ["دروس قصيرة وعميقة", "تمارين Reflection", "وصول دائم للمحتوى"],
  },
  {
    id: "books",
    title: "كتب وأدلة عملية",
    kicker: "قراءة تعيد ترتيب الداخل",
    description: "كتب تساعدك على فهم نفسك بعمق، واستعادة الهدوء الداخلي، وفتح أسئلة أهم في رحلتك.",
    duration: "نسخ رقمية ومطبوعة",
    price: "حسب الإصدار",
    href: "/books",
    icon: BookOpen,
    points: ["لغة رقيقة وعميقة", "أسئلة وتمارين", "مناسبة كبداية رحلة"],
  },
]

export type Course = {
  id: string
  title: string
  subtitle: string
  description: string
  level: string
  duration: string
  lessons: number
  price: number
  originalPrice?: number
  category: string
  color: "teal" | "gold" | "olive" | "burgundy"
  outcomes: string[]
  curriculum: { title: string; lessons: string[] }[]
  audience: string[]
  learn: string[]
}

export const courses: Course[] = [
  {
    id: "efham-nafsak",
    title: "افهم نفسك",
    subtitle: "برنامج تأسيسي لفهم الذات والأنماط",
    description: "رحلة عملية تساعدك على قراءة مشاعرك واحتياجاتك وحدودك، وفهم ما يتكرر في حياتك.",
    level: "مناسب للبداية",
    duration: "6 أسابيع",
    lessons: 30,
    price: 1450,
    originalPrice: 1900,
    category: "وعي بالذات",
    color: "teal",
    outcomes: ["فهم أعمق لأنماطك", "وضوح في الاحتياجات والحدود", "خطة يومية للاتزان"],
    curriculum: [
      { title: "خريطة الذات", lessons: ["من أنا الآن؟", "الأدوار والهوية", "تمرين كتابة الوعي"] },
      { title: "المشاعر والاحتياجات", lessons: ["لغة المشاعر", "الاحتياج خلف الانفعال", "تدريب التهدئة"] },
    ],
    audience: ["من يشعر بالتشتت الداخلي", "من يريد بداية منظمة في رحلة الوعي", "من يكرر نفس النمط في العلاقات"],
    learn: ["كيف تسمي مشاعرك بدقة", "كيف تضع حدودًا صحية", "كيف تبني عادة وعي يومية قابلة للاستمرار"],
  },
  {
    id: "ettekhaz-el-qarar",
    title: "اتخاذ القرار",
    subtitle: "من التشوش إلى اختيار واضح",
    description: "كورس عملي لفهم الخوف من الاختيار وبناء قرار قابل للتنفيذ بدون استنزاف.",
    level: "كل المستويات",
    duration: "4 أسابيع",
    lessons: 18,
    price: 1200,
    category: "قرارات",
    color: "gold",
    outcomes: ["تقليل التشوش", "اختيار مبني على القيم", "خطة تنفيذ القرار"],
    curriculum: [{ title: "وضوح القرار", lessons: ["مصادر التشوش", "قيمك الحقيقية", "تحليل الاختيارات"] }],
    audience: ["من لديه قرار مؤجل", "من يخاف من الندم", "من يريد حسمًا هادئًا"],
    learn: ["فلترة الضوضاء الخارجية", "مقارنة الخيارات بوعي", "تثبيت قرار عملي قابل للتنفيذ"],
  },
  {
    id: "the-money",
    title: "The Money",
    subtitle: "وعي المال والعلاقة مع الاستحقاق",
    description: "برنامج لفهم علاقتك بالمال والاستحقاق والأنماط التي تؤثر على قراراتك المالية.",
    level: "متوسط",
    duration: "5 أسابيع",
    lessons: 22,
    price: 1650,
    category: "مال واستحقاق",
    color: "olive",
    outcomes: ["فهم قصة المال", "تحرير الخوف من الطلب", "علاقة أهدأ مع الاستحقاق"],
    curriculum: [{ title: "قصة المال", lessons: ["المعتقدات القديمة", "الاستحقاق", "الحدود المالية"] }],
    audience: ["من يربط القيمة الشخصية بالدخل", "من يشعر بالذنب عند الصرف", "من يخاف من طلب المقابل"],
    learn: ["فك معتقدات المال القديمة", "بناء حدود مالية صحية", "التصرف بثقة في قرارات الإنفاق والادخار"],
  },
  {
    id: "enta-el-qaed",
    title: "انت القائد",
    subtitle: "قيادة الذات قبل قيادة الآخرين",
    description: "مسار يساعدك على تحمل مسؤولية قراراتك وتنظيم يومك والتصرف من وعي بدل رد الفعل.",
    level: "متوسط",
    duration: "6 أسابيع",
    lessons: 26,
    price: 1850,
    category: "قيادة الذات",
    color: "burgundy",
    outcomes: ["مسؤولية أوضح", "انضباط ناعم", "اختيارات أكثر نضجًا"],
    curriculum: [{ title: "قيادة الذات", lessons: ["المسؤولية", "النية", "الانضباط الناعم"] }],
    audience: ["من يريد الاتزان بين الطموح والهدوء", "من يتأثر سريعًا بضغط اليوم", "من يريد قيادة نفسه بوضوح"],
    learn: ["تحويل النية إلى فعل", "إدارة الطاقة اليومية", "القيادة الهادئة في العلاقات والعمل"],
  },
  {
    id: "naqesak-haga-course",
    title: "ناقصك حاجة",
    subtitle: "من الإحساس بالنقص إلى الاكتمال الداخلي",
    description: "كورس عميق عن صوت النقص والمقارنة وبناء علاقة أكثر حنانًا مع الذات.",
    level: "كل المستويات",
    duration: "5 أسابيع",
    lessons: 24,
    price: 1500,
    originalPrice: 2100,
    category: "وعي بالذات",
    color: "teal",
    outcomes: ["تمييز صوت النقص", "تقليل المقارنة", "بناء قبول داخلي"],
    curriculum: [{ title: "صوت النقص", lessons: ["المقارنة", "الاحتياج", "اختيار الذات"] }],
    audience: ["من يشعر دائمًا أنه متأخر", "من يقارن نفسه بالآخرين", "من يحتاج مساحة ترميم داخلي"],
    learn: ["تفكيك المقارنة المؤذية", "بناء قبول داخلي واقعي", "استعادة شعور الاكتفاء تدريجيًا"],
  },
]

export type Book = {
  id: string
  title: string
  subtitle: string
  description: string
  format: string
  price: number
  color: "teal" | "gold" | "olive" | "burgundy"
  pages: number
  status?: string
  audience: string[]
  learn: string[]
}

export const books: Book[] = [
  {
    id: "bab-el-khorog",
    title: "باب الخروج",
    subtitle: "عن الخروج من الدوائر المغلقة",
    description: "كتاب يساعدك على رؤية الأبواب التي لا تنتبه لها حين تطول الإقامة في الخوف أو التكرار.",
    format: "رقمي / مطبوع",
    price: 390,
    color: "teal",
    pages: 160,
    audience: ["من يشعر أنه عالق", "من يكرر نفس الأخطاء", "من يحتاج بداية شجاعة"],
    learn: ["كيف تتعرف على الدائرة المغلقة", "كيف ترى خيارات جديدة", "كيف تبدأ أول خطوة خروج"],
  },
  {
    id: "naqesak-haga-book",
    title: "ناقصك حاجة",
    subtitle: "عن الإحساس بالنقص والبحث عن الاكتمال",
    description: "رحلة قراءة عميقة في صوت النقص الداخلي، المقارنة، والاحتياج للحب والاعتراف.",
    format: "رقمي / مطبوع",
    price: 420,
    color: "burgundy",
    pages: 180,
    audience: ["من يجلد نفسه كثيرًا", "من يقارن باستمرار", "من يحتاج احتواءً داخليًا"],
    learn: ["تمييز صوت النقص", "فهم الاحتياج بصدق", "بناء علاقة أهدأ مع الذات"],
  },
  {
    id: "el-haqiqa",
    title: "الحقيقة",
    subtitle: "نصوص وعي ومواجهة داخلية",
    description: "كتاب يفتح أسئلة صادقة عن الحقيقة التي نؤجلها والوضوح الذي يأتي بعد شجاعة النظر للداخل.",
    format: "رقمي / مطبوع",
    price: 390,
    color: "gold",
    pages: 150,
    audience: ["من يبحث عن صدق أكبر مع نفسه", "من يحتاج مساحة تأمل", "من يريد رؤية أوضح"],
    learn: ["كيفية طرح الأسئلة الصحيحة", "التمييز بين الصوت الحقيقي والخوف", "تدريبات مواجهة داخلية ناعمة"],
  },
  {
    id: "silent-collapse",
    title: "الانهيار الصامت",
    subtitle: "جاهز",
    description: "كتاب عن الانهيارات الهادئة التي لا يراها أحد، وكيف نلتقط إشارات الداخل قبل الاحتراق.",
    format: "كتاب جاهز",
    price: 450,
    color: "olive",
    pages: 190,
    status: "جاهز",
    audience: ["من يظهر القوة بينما ينهار داخليًا", "من يعاني من صمت المشاعر", "من يريد إنقاذًا مبكرًا"],
    learn: ["رصد الإنهاك الصامت", "فهم إشارات الجسد والمشاعر", "خطة رجوع تدريجية للاتزان"],
  },
]

export const transformation = [
  { before: "تشتت داخلي", after: "وضوح واتصال بالذات", icon: Compass },
  { before: "خوف من الاختيار", after: "قرار نابع من وعي", icon: Target },
  { before: "استنزاف علاقات", after: "حدود صحية وحنان", icon: HeartHandshake },
  { before: "ضجيج أفكار", after: "سلام عملي يومي", icon: MoonStar },
]

export const startHereSteps = [
  { title: "قيّمي احتياجك الحالي", text: "هل تحتاجين جلسة فردية؟ كورس منظم؟ أم كتاب كبداية خفيفة؟", href: "/services" },
  { title: "ابدئي بخطوة واحدة", text: "اختيار واحد واضح اليوم أفضل من تأجيل كبير بلا حركة.", href: "/booking" },
  { title: "ثبتي الإيقاع", text: "التحول الهادئ يأتي من خطوات صغيرة تتكرر بوعي.", href: "/courses" },
]

export const testimonials = [
  {
    name: "إحدى العميلات",
    role: "جلسات 1:1",
    text: "خرجت من الجلسة شايفة الصورة أوضح، والأهم إن عندي خطوات أقدر أبدأ بها فورًا.",
  },
  {
    name: "عميلة",
    role: "كورس افهم نفسك",
    text: "حسيت إن البرنامج بيرتب أفكاري واحدة واحدة بدون ضغط أو أحكام.",
  },
  {
    name: "قارئة",
    role: "كتاب ناقصك حاجة",
    text: "الكتاب لمس إحساس كنت مش عارفة أسميه، وساعدني أتكلم مع نفسي بهدوء.",
  },
]

export const posts = [
  {
    id: "why-self-awareness-hurts",
    title: "لماذا يؤلم الوعي أحيانًا؟",
    excerpt: "الوعي يفتح بابًا كان مغلقًا طويلًا، لكنه الباب الذي يقودك أخيرًا إلى نفسك.",
    category: "وعي",
    readTime: "5 دقائق",
    date: "2026-01-10",
  },
  {
    id: "decision-without-fear",
    title: "كيف تختارين بدون رعب؟",
    excerpt: "القرار لا يحتاج يقينًا كاملًا، لكنه يحتاج صدقًا وخطة صغيرة قابلة للتنفيذ.",
    category: "قرارات",
    readTime: "6 دقائق",
    date: "2026-01-22",
  },
  {
    id: "quiet-collapse",
    title: "علامات الانهيار الصامت",
    excerpt: "حين تتراكم الأشياء الصغيرة يبدأ الداخل بإرسال رسائل هادئة لا يجب تجاهلها.",
    category: "مشاعر",
    readTime: "7 دقائق",
    date: "2026-02-04",
  },
]

type FaqItem = {
  q: string
  a: string
  question: string
  answer: string
}

const faqSeed = [
  { question: "كيف أبدأ الحجز؟", answer: "اختاري مدة الجلسة واليوم المناسب لكِ، وستظهر لكِ المواعيد المتاحة مباشرة." },
  { question: "هل يمكن استخدام كود خاص؟", answer: "نعم، يمكنكِ إدخال الكود الخاص أثناء الحجز وسيتم تطبيقه تلقائيًا عند صحته." },
  { question: "كيف أتأكد من تفاصيل الموعد؟", answer: "بعد إرسال الطلب ستصلك رسالة تأكيد بكل التفاصيل." },
]

export const faqs: FaqItem[] = faqSeed.map((item) => ({
  ...item,
  q: item.question,
  a: item.answer,
}))

export const values = [
  {
    icon: Brain,
    title: "وضوح",
    description: "نبحث عن الجذر لا عن المسكنات المؤقتة، لتظهر الصورة كما هي.",
  },
  {
    icon: HeartHandshake,
    title: "احتواء",
    description: "مساحة بلا أحكام، تسمح بالصوت الداخلي أن يظهر بأمان.",
  },
  {
    icon: CalendarHeart,
    title: "استمرارية",
    description: "خطوات صغيرة قابلة للتطبيق تحافظ على أثر الرحلة بعد الجلسة.",
  },
  {
    icon: Sparkles,
    title: "رقي",
    description: "تجربة عربية هادئة بعناية بصرية ومحتوى عميق.",
  },
]

export const mediaItems = [
  { type: "بودكاست", title: "كيف نسمع أنفسنا بوضوح؟", outlet: "وعي بودكاست" },
  { type: "ندوة", title: "الحدود الصحية في العلاقات", outlet: "مجتمع نقطة وعي" },
  { type: "مقال", title: "الانهيار الصامت في حياة المرأة", outlet: "منصة عربية نفسية" },
]

export function getCourseById(id: string) {
  return courses.find((item) => item.id === id)
}

export function getBookById(id: string) {
  return books.find((item) => item.id === id)
}
