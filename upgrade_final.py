from pathlib import Path
import json, textwrap, os, zipfile, shutil
root=Path('/mnt/data/heba_final_work')

def w(path, content):
    p=root/path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(textwrap.dedent(content).lstrip(), encoding='utf-8')

# Shared data compatible with existing components
w('data/site.ts', r'''
import type { LucideIcon } from "lucide-react"
import { BookOpen, Brain, CalendarCheck, Compass, Crown, Feather, HeartHandshake, Leaf, MessageCircleHeart, PenLine, Sparkles, Target, UsersRound, Video, WalletCards } from "lucide-react"

export const brand = {
  arName: "هبة الشريف",
  enName: "Heba El Sharif",
  tagline: "نقطة وعي تعيدك إلى ذاتك",
  shortTagline: "رحلة وعي تعيدك إلى ذاتك",
  email: "hello@hebaelsharif.com",
  phone: "+20 100 000 0000",
  whatsapp: "https://wa.me/201000000000",
  location: "القاهرة، مصر — جلسات أونلاين حول العالم",
  logo: "/images/heba-logo.webp",
  banner: "/images/heba-banner.jpeg",
}

export const navItems = [
  { label: "الرئيسية", href: "/" },
  { label: "من هي هبة", href: "/about" },
  { label: "الخدمات", href: "/services" },
  { label: "الكورسات", href: "/courses" },
  { label: "الكتب", href: "/books" },
  { label: "المقالات", href: "/blog" },
  { label: "تواصل", href: "/contact" },
]

export const navItemsEn = [
  { label: "Home", href: "/en" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Courses", href: "/courses" },
  { label: "Books", href: "/books" },
  { label: "Contact", href: "/contact" },
]

export const stats = [
  { value: "1:1", label: "جلسات كوتشنج فردية" },
  { value: "5", label: "كورسات وعي عملية" },
  { value: "4", label: "كتب في رحلة الذات" },
]

export type Service = { id: string; title: string; eyebrow: string; description: string; outcome: string; duration: string; price: string; icon: LucideIcon; features: string[]; href: string; color: "teal" | "gold" | "olive" | "burgundy" }
export const services: Service[] = [
  { id: "coaching", title: "جلسات كوتشنج فردية 1:1", eyebrow: "مساحة آمنة وشخصية", description: "جلسات عميقة تساعدك على فهم ذاتك، قراءة أنماطك، التعامل مع مشاعرك، واتخاذ قرارات أكثر هدوءًا ووعيًا.", outcome: "وضوح داخلي، خطة عملية، وتواصل أعمق مع الذات.", duration: "60 أو 90 دقيقة", price: "1200 / 1500 ج.م", icon: MessageCircleHeart, features: ["اختيار مدة الجلسة", "كود خصم متاح", "منع تعارض المواعيد", "متابعة واضحة بعد الجلسة"], href: "/booking?service=coaching", color: "teal" },
  { id: "workshops", title: "ورش وعي تفاعلية", eyebrow: "تعلم وتجربة ومشاركة", description: "ورش جماعية حول الحدود، تقدير الذات، العلاقات، التحرر من الخوف، واختيار الطريق بوعي.", outcome: "تجربة جماعية دافئة مع أدوات قابلة للتطبيق فورًا.", duration: "3–6 ساعات", price: "حسب الورشة", icon: UsersRound, features: ["تمارين عملية", "مساحات مشاركة آمنة", "ملفات عمل", "مواعيد محددة"], href: "/contact", color: "gold" },
  { id: "courses", title: "كورسات مسجلة وبرامج ممتدة", eyebrow: "تعلم ذاتي بتوجيه واضح", description: "مسارات تعليمية منظمة تجمع بين الوعي، التمارين، التأملات، والواجبات العملية.", outcome: "رحلة منظمة يمكنك الرجوع إليها في أي وقت.", duration: "4–8 أسابيع", price: "تبدأ من 950 ج.م", icon: Video, features: ["فيديوهات مسجلة", "ملفات PDF", "تمارين تطبيق", "وصول دائم"], href: "/courses", color: "olive" },
  { id: "books", title: "كتب ودفاتر عمل", eyebrow: "كلمات تعيد ترتيب الداخل", description: "كتب وتأملات ودفاتر عمل تساعدك على فهم مشاعرك وتدوين رحلتك واكتشاف المعاني التي تتحرك بداخلك.", outcome: "قراءة ناعمة وممارسات يومية بسيطة.", duration: "تحميل فوري أو طلب", price: "حسب الكتاب", icon: Feather, features: ["نسخ رقمية", "تمارين كتابة", "اقتباسات وتأملات", "مناسبة للهدايا"], href: "/books", color: "burgundy" },
]

export type Course = { id: string; title: string; subtitle: string; description: string; level: string; duration: string; lessons: number; price: string; oldPrice?: string; badge: string; includes: string[]; modules: string[] }
export const courses: Course[] = [
  { id: "efham-nafsak", title: "افهم نفسك", subtitle: "برنامج تأسيسي لفهم الذات والأنماط", description: "رحلة عملية تساعدك على قراءة مشاعرك واحتياجاتك وحدودك، وفهم ما يتكرر في حياتك بدل مقاومته.", level: "مناسب للبداية", duration: "6 أسابيع", lessons: 30, price: "1,450 ج.م", oldPrice: "1,900 ج.م", badge: "الأفضل للبداية", includes: ["فيديوهات مسجلة", "Workbook", "تمارين أسبوعية", "وصول دائم"], modules: ["خريطة الذات", "لغة المشاعر", "الاحتياجات", "الحدود", "النمط المتكرر", "خطة الاتزان"] },
  { id: "ettekhaz-el-qarar", title: "اتخاذ القرار", subtitle: "من التشوش إلى اختيار واضح", description: "كورس عملي لفهم الخوف من الاختيار، فصل صوتك الداخلي عن توقعات الآخرين، وبناء قرار قابل للتنفيذ.", level: "كل المستويات", duration: "4 أسابيع", lessons: 18, price: "1,200 ج.م", badge: "عملي ومباشر", includes: ["نماذج قرار", "تمارين وضوح", "خطة تنفيذ", "ملفات PDF"], modules: ["مصادر التشوش", "قيمك الحقيقية", "تحليل الاختيارات", "الخوف والندم", "خطة القرار"] },
  { id: "the-money", title: "The Money", subtitle: "وعي المال والعلاقة مع الاستحقاق", description: "برنامج لفهم علاقتك بالمال، الاستحقاق، الخوف، والأنماط التي تتحكم في قراراتك المالية.", level: "متوسط", duration: "5 أسابيع", lessons: 22, price: "1,650 ج.م", badge: "جديد", includes: ["دروس وعي مالي", "تمارين كتابة", "خطة مالية ناعمة", "تطبيقات أسبوعية"], modules: ["قصة المال", "الاستحقاق", "الخوف من الطلب", "الحدود المالية", "خطة علاقة جديدة"] },
  { id: "enta-el-qaed", title: "انت القائد", subtitle: "قيادة الذات قبل قيادة الآخرين", description: "مسار يساعدك على تحمل مسؤولية قراراتك، تنظيم يومك، والتصرف من وعي بدل رد الفعل.", level: "متوسط", duration: "6 أسابيع", lessons: 26, price: "1,850 ج.م", badge: "للتحول العملي", includes: ["خطة أسبوعية", "تمارين قيادة", "دفتر متابعة", "وصول دائم"], modules: ["المسؤولية", "النية", "الانضباط الناعم", "الاختيار", "القيادة في العلاقات"] },
  { id: "naqesak-haga-course", title: "ناقصك حاجة", subtitle: "من الإحساس بالنقص إلى الاكتمال الداخلي", description: "كورس عميق عن الإحساس بالنقص، المقارنة، الاحتياج، وكيفية بناء علاقة أكثر حنانًا مع الذات.", level: "كل المستويات", duration: "5 أسابيع", lessons: 24, price: "1,500 ج.م", oldPrice: "2,100 ج.م", badge: "مرتبط بالكتاب", includes: ["فيديوهات", "تمارين انعكاس", "ملفات عمل", "خطة يومية"], modules: ["صوت النقص", "المقارنة", "الاحتياج", "الاكتمال", "اختيار الذات"] },
]

export type Book = { id: string; title: string; subtitle: string; description: string; type: string; price: string; pages: string; icon: LucideIcon }
export const books: Book[] = [
  { id: "bab-el-khorog", title: "كتاب باب الخروج", subtitle: "عن الخروج من الدوائر المغلقة", description: "كتاب يساعدك على رؤية الأبواب التي لا تنتبهين لها حين تطول الإقامة في علاقة أو فكرة أو خوف.", type: "كتاب رقمي / مطبوع", price: "حسب النسخة", pages: "قيد التحديث", icon: Compass },
  { id: "naqesak-haga-book", title: "كتاب ناقصك حاجة", subtitle: "عن الإحساس بالنقص والبحث عن الاكتمال", description: "رحلة قراءة عميقة في صوت النقص الداخلي، المقارنة، والاحتياج للحب والاعتراف.", type: "كتاب رقمي / مطبوع", price: "حسب النسخة", pages: "قيد التحديث", icon: HeartHandshake },
  { id: "el-haqiqa", title: "كتاب الحقيقة", subtitle: "نصوص وعي ومواجهة داخلية", description: "كتاب يفتح أسئلة صادقة عن الحقيقة التي نؤجلها، والوضوح الذي لا يأتي إلا بعد شجاعة النظر للداخل.", type: "كتاب رقمي / مطبوع", price: "حسب النسخة", pages: "قيد التحديث", icon: Sparkles },
  { id: "silent-collapse", title: "كتاب الانهيار الصامت", subtitle: "جاهز", description: "كتاب عن الانهيارات الهادئة التي لا يراها أحد، وكيف نلتقط إشارات الداخل قبل أن تنطفئ المساحة كلها.", type: "كتاب جاهز", price: "متاح قريبًا", pages: "قيد التحديث", icon: BookOpen },
]

export type BlogPost = { id: string; title: string; excerpt: string; category: string; readTime: string; date: string }
export const blogPosts: BlogPost[] = [
  { id: "why-self-awareness-hurts", title: "لماذا يؤلم الوعي أحيانًا؟", excerpt: "الوعي لا يؤلم لأنه سيئ، بل لأنه يفتح بابًا كان مغلقًا طويلًا.", category: "وعي", readTime: "5 دقائق", date: "2026-01-10" },
  { id: "decision-without-fear", title: "كيف تختارين بدون رعب؟", excerpt: "القرار لا يحتاج يقينًا كاملًا، لكنه يحتاج صدقًا مع النفس وخطة صغيرة قابلة للتنفيذ.", category: "قرارات", readTime: "6 دقائق", date: "2026-01-22" },
  { id: "quiet-collapse", title: "علامات الانهيار الصامت", excerpt: "حين تتراكم الأشياء الصغيرة، يبدأ الداخل في إرسال رسائل هادئة لا يجب تجاهلها.", category: "مشاعر", readTime: "7 دقائق", date: "2026-02-04" },
]

export const testimonials = [
  { name: "سارة", role: "جلسات 1:1", quote: "خرجت من الجلسة شايفة الصورة أوضح، والأهم إن عندي خطوات أقدر أبدأ بها فورًا." },
  { name: "مي", role: "كورس افهم نفسك", quote: "حسيت إن البرنامج بيرتب أفكاري واحدة واحدة بدون ضغط أو أحكام." },
  { name: "ندى", role: "كتاب ناقصك حاجة", quote: "الكتاب لمس إحساس كنت مش عارفة أسميه، وخلاني أكتب وأفهم نفسي بهدوء." },
]

export const faqs = [
  { question: "هل الجلسات أونلاين؟", answer: "نعم، الجلسات تتم أونلاين ويمكن تنسيق الطريقة المناسبة بعد الحجز." },
  { question: "ما مواعيد الحجز؟", answer: "الحجز متاح من 7 صباحًا حتى 8 مساءً، والجمعة إجازة." },
  { question: "هل يوجد كود خصم؟", answer: "نعم، يمكن تطبيق كود خصم للجلسات 1:1 ليصبح سعر الساعة 1000 ج.م وسعر الساعة ونصف 1300 ج.م." },
]
''')

# lib/site-data compatible with existing pages/API, numeric prices
w('lib/site-data.ts', r'''
import type { LucideIcon } from "lucide-react"
import { BookOpen, Brain, CalendarHeart, Compass, Feather, HeartHandshake, Layers3, MessageCircleHeart, MoonStar, Sparkles, Target, Users } from "lucide-react"

export const brand = {
  name: "هبة الشريف",
  englishName: "Heba El Sharif",
  tagline: "نقطة وعي",
  promise: "رحلة وعي تعيدك إلى ذاتك",
  shortBio: "لايف كوتش معتمدة، مدربة وعي بالذات، كاتبة وروائية. ترافقك في رحلة فهم النفس بعمق، التحرر من الأنماط المتكررة، واختيار حياة أكثر اتزانًا وسلامًا.",
  whatsapp: "+201000000000",
  email: "hello@hebaelsharif.com",
  location: "القاهرة، مصر · جلسات أونلاين حول العالم",
}

export const navItems = [
  { name: "الرئيسية", href: "/" }, { name: "من هي هبة", href: "/about" }, { name: "الخدمات", href: "/services" }, { name: "الكورسات", href: "/courses" }, { name: "الكتب", href: "/books" }, { name: "المقالات", href: "/blog" }, { name: "تواصل", href: "/contact" },
]

export type Service = { id: string; title: string; kicker: string; description: string; duration: string; price: string; href: string; icon: LucideIcon; featured?: boolean; points: string[] }
export const services: Service[] = [
  { id: "coaching", title: "جلسات كوتشنج فردية 1:1", kicker: "مساحة شخصية عميقة", description: "جلسات خاصة لفهم المشاعر، تفكيك الأنماط المتكررة، وتحديد خطوات عملية تناسب واقعك وقيمك.", duration: "60 أو 90 دقيقة", price: "1200 ج.م / 1500 ج.م", href: "/booking?service=coaching", icon: MessageCircleHeart, featured: true, points: ["60 دقيقة: 1200 ج.م", "مع كود خصم: 1000 ج.م", "90 دقيقة: 1500 ج.م", "مع كود خصم: 1300 ج.م"] },
  { id: "workshops", title: "ورش وعي تفاعلية", kicker: "تعلم جماعي آمن", description: "ورش حية أونلاين أو حضورية حول العلاقات، الحدود، تقدير الذات، وفهم الاحتياجات النفسية.", duration: "من ساعتين إلى يوم كامل", price: "حسب موضوع الورشة", href: "/contact", icon: Users, points: ["تمارين عملية", "نقاشات موجّهة", "ملفات عمل"] },
  { id: "courses", title: "كورسات مسجلة وبرامج تحول", kicker: "تعلم وفق وتيرتك", description: "برامج تعليمية منظمة تساعدك على بناء وعي مستمر، مع تطبيقات وتمارين ومتابعة داخلية.", duration: "4 - 8 أسابيع", price: "من 1200 جنيه", href: "/courses", icon: Layers3, points: ["دروس قصيرة وعميقة", "تمارين Reflection", "وصول دائم للمحتوى"] },
  { id: "books", title: "كتب وأدلة عملية", kicker: "قراءة تعيد ترتيب الداخل", description: "كتب ودفاتر وعي مصممة لتكون رفيقًا في رحلة فهم الذات والعودة إلى الاتزان.", duration: "نسخ رقمية ومطبوعة", price: "حسب الإصدار", href: "/books", icon: BookOpen, points: ["أسلوب رقيق وعميق", "أسئلة وتمارين", "مناسبة كبداية للرحلة"] },
]

export type Course = { id: string; title: string; subtitle: string; description: string; level: string; duration: string; lessons: number; price: number; originalPrice?: number; category: string; color: "teal" | "gold" | "olive" | "burgundy"; outcomes: string[]; curriculum: { title: string; lessons: string[] }[] }
export const courses: Course[] = [
  { id: "efham-nafsak", title: "افهم نفسك", subtitle: "برنامج تأسيسي لفهم الذات والأنماط", description: "رحلة عملية تساعدك على قراءة مشاعرك واحتياجاتك وحدودك، وفهم ما يتكرر في حياتك بدل مقاومته.", level: "مناسب للبداية", duration: "6 أسابيع", lessons: 30, price: 1450, originalPrice: 1900, category: "وعي بالذات", color: "teal", outcomes: ["فهم أعمق لأنماطك", "وضوح في الاحتياجات والحدود", "خطة يومية للحفاظ على الاتزان"], curriculum: [{ title: "خريطة الذات", lessons: ["من أنا الآن؟", "الأدوار والهوية", "تمرين كتابة الوعي"] }, { title: "المشاعر والاحتياجات", lessons: ["لغة المشاعر", "الاحتياج خلف الانفعال", "تدريب التهدئة"] }] },
  { id: "ettekhaz-el-qarar", title: "اتخاذ القرار", subtitle: "من التشوش إلى اختيار واضح", description: "كورس عملي لفهم الخوف من الاختيار وبناء قرار قابل للتنفيذ.", level: "كل المستويات", duration: "4 أسابيع", lessons: 18, price: 1200, category: "قرارات", color: "gold", outcomes: ["تقليل التشوش", "اختيار مبني على القيم", "خطة تنفيذ القرار"], curriculum: [{ title: "وضوح القرار", lessons: ["مصادر التشوش", "قيمك الحقيقية", "تحليل الاختيارات"] }] },
  { id: "the-money", title: "The Money", subtitle: "وعي المال والعلاقة مع الاستحقاق", description: "برنامج لفهم علاقتك بالمال والاستحقاق والأنماط التي تؤثر على قراراتك المالية.", level: "متوسط", duration: "5 أسابيع", lessons: 22, price: 1650, category: "مال واستحقاق", color: "olive", outcomes: ["فهم قصة المال", "تحرير الخوف من الطلب", "علاقة أهدأ مع الاستحقاق"], curriculum: [{ title: "قصة المال", lessons: ["المعتقدات القديمة", "الاستحقاق", "الحدود المالية"] }] },
  { id: "enta-el-qaed", title: "انت القائد", subtitle: "قيادة الذات قبل قيادة الآخرين", description: "مسار يساعدك على تحمل مسؤولية قراراتك وتنظيم يومك والتصرف من وعي بدل رد الفعل.", level: "متوسط", duration: "6 أسابيع", lessons: 26, price: 1850, category: "قيادة الذات", color: "burgundy", outcomes: ["مسؤولية أوضح", "انضباط ناعم", "اختيارات أكثر نضجًا"], curriculum: [{ title: "قيادة الذات", lessons: ["المسؤولية", "النية", "الانضباط الناعم"] }] },
  { id: "naqesak-haga-course", title: "ناقصك حاجة", subtitle: "من الإحساس بالنقص إلى الاكتمال الداخلي", description: "كورس عميق عن الإحساس بالنقص والمقارنة وبناء علاقة أكثر حنانًا مع الذات.", level: "كل المستويات", duration: "5 أسابيع", lessons: 24, price: 1500, originalPrice: 2100, category: "وعي بالذات", color: "teal", outcomes: ["تمييز صوت النقص", "تقليل المقارنة", "بناء قبول داخلي"], curriculum: [{ title: "صوت النقص", lessons: ["المقارنة", "الاحتياج", "اختيار الذات"] }] },
]

export type Book = { id: string; title: string; subtitle: string; description: string; format: string; price: number; color: "teal" | "gold" | "olive" | "burgundy"; pages: number; status?: string }
export const books: Book[] = [
  { id: "bab-el-khorog", title: "كتاب باب الخروج", subtitle: "عن الخروج من الدوائر المغلقة", description: "كتاب يساعدك على رؤية الأبواب التي لا تنتبهين لها حين تطول الإقامة في علاقة أو فكرة أو خوف.", format: "رقمي / مطبوع", price: 390, color: "teal", pages: 160 },
  { id: "naqesak-haga-book", title: "كتاب ناقصك حاجة", subtitle: "عن الإحساس بالنقص والبحث عن الاكتمال", description: "رحلة قراءة عميقة في صوت النقص الداخلي، المقارنة، والاحتياج للحب والاعتراف.", format: "رقمي / مطبوع", price: 420, color: "burgundy", pages: 180 },
  { id: "el-haqiqa", title: "كتاب الحقيقة", subtitle: "نصوص وعي ومواجهة داخلية", description: "كتاب يفتح أسئلة صادقة عن الحقيقة التي نؤجلها والوضوح الذي يأتي بعد شجاعة النظر للداخل.", format: "رقمي / مطبوع", price: 390, color: "gold", pages: 150 },
  { id: "silent-collapse", title: "كتاب الانهيار الصامت", subtitle: "جاهز", description: "كتاب عن الانهيارات الهادئة التي لا يراها أحد، وكيف نلتقط إشارات الداخل قبل أن تنطفئ المساحة كلها.", format: "كتاب جاهز", price: 450, color: "olive", pages: 190, status: "جاهز" },
]

export const transformation = [
  { before: "تشتت داخلي", after: "وضوح واتصال بالذات", icon: Compass }, { before: "خوف من الاختيار", after: "قرار نابع من وعي", icon: Target }, { before: "استنزاف علاقات", after: "حدود صحية وحنان", icon: HeartHandshake }, { before: "ضجيج أفكار", after: "سلام عملي يومي", icon: MoonStar },
]
export const testimonials = [
  { name: "سارة", role: "جلسات 1:1", text: "خرجت من الجلسة شايفة الصورة أوضح، والأهم إن عندي خطوات أقدر أبدأ بها فورًا." }, { name: "مي", role: "كورس افهم نفسك", text: "حسيت إن البرنامج بيرتب أفكاري واحدة واحدة بدون ضغط أو أحكام." }, { name: "ندى", role: "كتاب ناقصك حاجة", text: "الكتاب لمس إحساس كنت مش عارفة أسميه." },
]
export const posts = [
  { id: "why-self-awareness-hurts", title: "لماذا يؤلم الوعي أحيانًا؟", excerpt: "الوعي يفتح بابًا كان مغلقًا طويلًا.", category: "وعي", readTime: "5 دقائق", date: "2026-01-10" }, { id: "decision-without-fear", title: "كيف تختارين بدون رعب؟", excerpt: "القرار لا يحتاج يقينًا كاملًا، لكنه يحتاج صدقًا وخطة صغيرة.", category: "قرارات", readTime: "6 دقائق", date: "2026-01-22" },
]
export const faqs = [
  { question: "متى أستطيع الحجز؟", answer: "الحجز متاح من 7 صباحًا حتى 8 مساءً، والجمعة إجازة." }, { question: "هل يوجد خصم للجلسات؟", answer: "نعم، مع كود الخصم تصبح الساعة 1000 ج.م والساعة ونصف 1300 ج.م." },
]
''')
