import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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

  const supabaseAdmin = createAdminClient()
  const { data: manager, error } = await supabaseAdmin
    .from("managers")
    .select("*")
    .eq("email", user.email)
    .single()

  if (error || !manager) {
    // If manager record not found but user is logged in, maybe redirect to setup or show error
    // For now, let's assume if they are logged in they should have a record or we redirect to dashboard
    redirect("/manager/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <ManagerHeader userEmail={user.email} />
      <div className="container py-12">
        <ManagerSettingsForm initialData={manager as ManagerApplication} />
      </div>
    </div>
  )
}
