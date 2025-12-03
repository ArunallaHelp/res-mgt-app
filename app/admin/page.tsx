import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import db from "@/lib/db"
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
  const managersList = await db.managers.findMany({
    where: { email: user.email },
    select: { id: true },
    take: 1,
  })
  const manager = managersList[0]

  if (manager) {
    redirect("/manager/dashboard")
  }

  let managers: any[] = []
  let groups: any[] = []

  try {
    const [managersResult, groupsResult] = await Promise.all([
      getAllManagers(),
      getManagerGroups()
    ])
    managers = managersResult
    groups = groupsResult
  } catch (error) {
    console.error("Failed to fetch admin data:", error)
    // We continue rendering with empty data to avoid crashing the page
  }

  return <AdminDashboard userEmail={user.email || ""} managers={managers || []} groups={groups || []} />
}
