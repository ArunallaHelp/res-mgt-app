import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getManagerGroup, getGroupMembers } from "@/app/actions/manager-groups"
import { getAllManagers } from "@/app/actions/managers"
import { GroupMembersManager } from "@/components/admin/group-members-manager"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function GroupDetailsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/admin/login")
  }

  const [group, members, allManagers] = await Promise.all([
    getManagerGroup(id),
    getGroupMembers(id),
    getAllManagers()
  ])

  if (!group) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-4">
                <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">
            <GroupMembersManager 
                group={group} 
                members={members || []} 
                allManagers={allManagers || []} 
            />
        </main>
    </div>
  )
}
