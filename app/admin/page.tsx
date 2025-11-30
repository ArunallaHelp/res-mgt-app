import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Admin Dashboard - Flood Relief Education Support",
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

  return <AdminDashboard userEmail={user.email || ""} />
}
