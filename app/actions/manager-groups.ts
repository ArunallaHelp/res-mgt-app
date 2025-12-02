"use server"

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { ManagerGroup } from "@/lib/types"

export async function createManagerGroup(name: string, description?: string) {
  const data = await db.manager_groups.create({
    data: {
      name,
      description,
    },
  })
  
  revalidatePath("/admin")
  return {
    ...data,
    created_at: data.created_at?.toISOString() ?? new Date().toISOString(),
    updated_at: data.updated_at?.toISOString() ?? new Date().toISOString(),
  } as ManagerGroup
}

export async function deleteManagerGroup(id: string) {
  await db.manager_groups.delete({
    where: {
      id,
    },
  })
  
  revalidatePath("/admin")
}

export async function addManagerToGroup(groupId: string, managerId: string) {
  await db.manager_group_members.create({
    data: {
      group_id: groupId,
      manager_id: managerId,
    },
  })
  
  revalidatePath("/admin")
  revalidatePath(`/admin/managers/groups/${groupId}`)
}

export async function removeManagerFromGroup(groupId: string, managerId: string) {
  await db.manager_group_members.delete({
    where: {
      group_id_manager_id: {
        group_id: groupId,
        manager_id: managerId,
      },
    },
  })
  
  revalidatePath("/admin")
  revalidatePath(`/admin/managers/groups/${groupId}`)
}

export async function getManagerGroups() {
  const data = await db.manager_groups.findMany({
    orderBy: {
      created_at: "desc",
    },
  })
  
  return data.map((group) => ({
    ...group,
    created_at: group.created_at?.toISOString() ?? new Date().toISOString(),
    updated_at: group.updated_at?.toISOString() ?? new Date().toISOString(),
  })) as ManagerGroup[]
}

export async function getManagerGroup(id: string) {
  const data = await db.manager_groups.findUnique({
    where: {
      id,
    },
  })
  
  if (!data) return null

  return {
    ...data,
    created_at: data.created_at?.toISOString() ?? new Date().toISOString(),
    updated_at: data.updated_at?.toISOString() ?? new Date().toISOString(),
  } as ManagerGroup
}

export async function getGroupMembers(groupId: string) {
  const data = await db.manager_group_members.findMany({
    where: {
      group_id: groupId,
    },
    include: {
      managers: true,
    },
  })
  
  return data.map((item) => ({
    ...item,
    added_at: item.added_at?.toISOString() ?? new Date().toISOString(),
    manager: {
      ...item.managers,
      created_at: item.managers.created_at?.toISOString() ?? new Date().toISOString(),
      // managers table doesn't have updated_at in the schema I saw? 
      // Let me check schema again. 
      // managers model: created_at DateTime? ... no updated_at.
      // But ManagerApplication type has created_at.
      // Wait, getGroupMembers returns `manager:managers(*)` in Supabase.
      // The type of `manager` property in the return value isn't explicitly defined in the function signature, it just returns `data`.
      // So I should just convert dates for the manager object too if I want to be safe, or just let it be if the consumer handles it.
      // Given I'm converting others, I should convert here too.
    },
  }))
}
