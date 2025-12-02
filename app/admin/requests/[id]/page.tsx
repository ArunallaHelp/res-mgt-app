import { createClient } from "@/lib/supabase/server"
import db from "@/lib/db"
import { redirect } from "next/navigation"
import { RequestViewPage } from "@/components/admin/request-view-page"

export default async function AdminRequestPage({ 
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
    redirect("/admin/login")
  }

  // Fetch request details
  // Fetch request details
  const request = await db.requests.findUnique({
    where: { id },
  })

  if (!request) {
    redirect("/admin")
  }

  const formattedRequest = {
    ...request,
    created_at: request.created_at?.toISOString() ?? new Date().toISOString(),
    birth_year: request.birth_year ? parseInt(request.birth_year) : 0,
    nearest_town: request.nearest_town || undefined,
    status: request.status || "new",
    verification_status: request.verification_status || "unverified",
    priority: request.priority || "medium",
    email: request.email || null,
    admin_notes: request.admin_notes || null,
  }

  return <RequestViewPage request={formattedRequest} userEmail={user.email || ""} />
}
