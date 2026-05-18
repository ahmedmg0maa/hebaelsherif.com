import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { TrustSection } from "@/components/home/trust-section"
import { StartHereSection } from "@/components/home/start-here-section"
import { ServicesPreview } from "@/components/home/services-preview"
import { CoursesPreview } from "@/components/home/courses-preview"
import { BooksPreview } from "@/components/home/books-preview"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { FinalCtaSection } from "@/components/home/final-cta-section"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <StartHereSection />
        <ServicesPreview />
        <CoursesPreview />
        <BooksPreview />
        <TestimonialsSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}
