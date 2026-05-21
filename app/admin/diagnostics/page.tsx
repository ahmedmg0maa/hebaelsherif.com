import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { DiagnosticsPanel } from "@/components/admin/diagnostics-panel"
import { buildAdminDiagnostics } from "@/lib/admin-diagnostics"
import { requireAdmin } from "@/lib/admin-session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function AdminDiagnosticsPage() {
  const admin = await requireAdmin()
  if (!admin.ok) {
    redirect("/admin/login")
  }

  const diagnostics = await buildAdminDiagnostics(true)

  return (
    <AdminShell>
      <DiagnosticsPanel initialDiagnostics={diagnostics} />
    </AdminShell>
  )
}
