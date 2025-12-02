import { createClient } from '@/lib/supabase/server'
import db from "@/lib/db"
import { redirect } from 'next/navigation'
import { ManagerDashboard as ManagerDashboardComponent } from '@/components/manager/manager-dashboard'

export default async function ManagerDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/manager/login')
  }

  // Check if user is a manager
  const managers = await db.managers.findMany({
    where: { email: user.email },
    select: { id: true },
    take: 1,
  })
  const manager = managers[0]

  if (!manager) {
    redirect("/admin")
  }

  return <ManagerDashboardComponent userEmail={user.email || ""} />
}
