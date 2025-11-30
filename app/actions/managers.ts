"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateManagerTags(managerId: string, tags: string[]) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("managers")
    .update({ tags })
    .eq("id", managerId)

  if (error) throw new Error(error.message)
  
  revalidatePath("/admin")
}

export async function getAllManagers() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("managers")
        .select(`
            *,
            manager_group_members (
                group_id
            )
        `)
        .order("created_at", { ascending: false })
    
    if (error) throw new Error(error.message)
    
    return data.map((manager: any) => ({
        ...manager,
        group_ids: manager.manager_group_members.map((m: any) => m.group_id)
    }))
}
