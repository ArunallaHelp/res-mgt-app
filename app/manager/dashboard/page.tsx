import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ManagerDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/manager/login')
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  )
}
