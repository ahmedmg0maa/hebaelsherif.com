import type { MetadataRoute } from "next"
import { books, courses, posts } from "@/lib/site-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hebaelsharif.com"
  const now = new Date()

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/courses",
    "/books",
    "/blog",
    "/booking",
    "/checkout",
    "/checkout/success",
    "/checkout/failed",
    "/contact",
    "/testimonials",
    "/media",
    "/privacy",
    "/terms",
    "/en",
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.75,
    })),
    ...courses.map((course) => ({
      url: `${baseUrl}/courses/${course.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...books.map((book) => ({
      url: `${baseUrl}/books/${book.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.78,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
