import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { CoursesManager } from "@/components/admin/courses-manager"
import { requireAdmin } from "@/lib/admin-session"

export default async function AdminCoursesPage() {
  const admin = await requireAdmin()
  if (!admin.ok) {
    redirect("/admin/login")
  }

  return (
    <AdminShell>
      <CoursesManager />
    </AdminShell>
  )
}
