"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { ManagerGroup } from "@/lib/types"

export async function createManagerGroup(name: string, description?: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("manager_groups")
    .insert({ name, description })
    .select()
    .single()

  if (error) throw new Error(error.message)
  
  revalidatePath("/admin")
  return data as ManagerGroup
}

export async function deleteManagerGroup(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("manager_groups")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
  
  revalidatePath("/admin")
}

export async function addManagerToGroup(groupId: string, managerId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("manager_group_members")
    .insert({ group_id: groupId, manager_id: managerId })

  if (error) throw new Error(error.message)
  
  revalidatePath("/admin")
  revalidatePath(`/admin/managers/groups/${groupId}`)
}

export async function removeManagerFromGroup(groupId: string, managerId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("manager_group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("manager_id", managerId)

  if (error) throw new Error(error.message)
  
  revalidatePath("/admin")
  revalidatePath(`/admin/managers/groups/${groupId}`)
}

export async function getManagerGroups() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("manager_groups")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  
  return data as ManagerGroup[]
}

export async function getManagerGroup(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("manager_groups")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  
  return data as ManagerGroup
}

export async function getGroupMembers(groupId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("manager_group_members")
    .select(`
      manager_id,
      added_at,
      manager:managers(*)
    `)
    .eq("group_id", groupId)

  if (error) throw new Error(error.message)
  
  return data
}
