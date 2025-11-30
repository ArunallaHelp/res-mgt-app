import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ManagerDashboard as ManagerDashboardComponent } from '@/components/manager/manager-dashboard'

export default async function ManagerDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/manager/login')
  }

  return <ManagerDashboardComponent userEmail={user.email || ""} />
}
