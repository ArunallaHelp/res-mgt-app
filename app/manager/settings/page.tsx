import { createClient } from "@/lib/supabase/server"
import db from "@/lib/db"
import { redirect } from "next/navigation"
import { ManagerSettingsForm } from "@/components/manager/manager-settings-form"
import type { ManagerApplication } from "@/lib/types"
import { ManagerHeader } from "@/components/manager/manager-header"

export default async function ManagerSettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect("/manager/login")
  }

  const managers = await db.managers.findMany({
    where: { email: user.email },
    take: 1,
  })
  const manager = managers[0]

  if (!manager) {
    // If manager record not found but user is logged in, maybe redirect to setup or show error
    // For now, let's assume if they are logged in they should have a record or we redirect to dashboard
    redirect("/manager/dashboard")
  }

  const formattedManager = {
    ...manager,
    created_at: manager.created_at?.toISOString() ?? new Date().toISOString(),
    otp_expires_at: manager.otp_expires_at?.toISOString() ?? null,
  }

  return (
    <div className="min-h-screen bg-background">
      <ManagerHeader userEmail={user.email} />
      <div className="container py-12">
        <ManagerSettingsForm initialData={formattedManager as ManagerApplication} />
      </div>
    </div>
  )
}
