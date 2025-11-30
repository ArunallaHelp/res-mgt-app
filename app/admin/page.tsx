import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAllManagers } from "@/app/actions/managers"
import { getManagerGroups } from "@/app/actions/manager-groups"

export const metadata = {
  title: "Admin Dashboard - Arunalla",
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/admin/login")
  }

  // Check if user is a manager
  const { data: manager } = await supabase
    .from("managers")
    .select("id")
    .eq("email", user.email)
    .single()

  if (manager) {
    redirect("/manager/dashboard")
  }

  const [managers, groups] = await Promise.all([
    getAllManagers(),
    getManagerGroups()
  ])

  return <AdminDashboard userEmail={user.email || ""} managers={managers || []} groups={groups || []} />
}
