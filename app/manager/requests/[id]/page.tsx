import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RequestViewPage } from "@/components/admin/request-view-page"

export default async function ManagerRequestPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const supabase = await createClient()
  const { id } = await params

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/manager/login")
  }

  // Fetch request details
  const { data: request, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !request) {
    redirect("/manager/dashboard")
  }

  return <RequestViewPage request={request} userEmail={user.email || ""} backLink="/manager/dashboard" />
}
