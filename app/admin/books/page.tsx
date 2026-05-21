import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { BooksManager } from "@/components/admin/books-manager"
import { requireAdmin } from "@/lib/admin-session"

export default async function AdminBooksPage() {
  const admin = await requireAdmin()
  if (!admin.ok) {
    redirect("/admin/login")
  }

  return (
    <AdminShell>
      <BooksManager />
    </AdminShell>
  )
}
