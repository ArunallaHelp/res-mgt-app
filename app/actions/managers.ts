"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function updateManagerTags(managerId: string, tags: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await db.managers.update({
    where: { id: managerId },
    data: { tags },
  });

  revalidatePath("/admin");
}

export async function getAllManagers() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const data = await db.managers.findMany({
    include: {
      manager_group_members: {
        select: {
          group_id: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return data.map((manager) => ({
    ...manager,
    created_at: manager.created_at?.toISOString() ?? new Date().toISOString(),
    verification_status: manager.verification_status || "unverified",
    otp_expires_at: manager.otp_expires_at?.toISOString() ?? null,
    other_role: manager.other_role || undefined,
    other_qualification: manager.other_qualification || undefined,
    other_skill: manager.other_skill || undefined,
    other_subject: manager.other_subject || undefined,
    volunteering_experience: manager.volunteering_experience || undefined,
    preferences_limitations: manager.preferences_limitations || undefined,
    comments: manager.comments || undefined,
    group_ids: manager.manager_group_members.map((m) => m.group_id),
  }));
}
