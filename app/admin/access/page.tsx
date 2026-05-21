import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin-session"

export default async function AdminAccessLegacyRoute() {
  const admin = await requireAdmin()
  if (!admin.ok) {
    redirect("/admin/login")
  }

  redirect("/admin/access-logs")
}
