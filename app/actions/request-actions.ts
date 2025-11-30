"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { RequestStatus, VerificationStatus, PriorityLevel } from "@/lib/types"
import { trackStatusChange, trackVerificationChange, trackPriorityChange } from "./timeline"

/**
 * Update request status and create timeline entry
 */
export async function updateRequestStatus(
  requestId: string,
  newStatus: RequestStatus,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get current status
    const { data: request } = await supabase
      .from("requests")
      .select("status")
      .eq("id", requestId)
      .single()
    if (!request) {
      return { success: false, error: "Request not found" }
    }

    const oldStatus = request.status

    // Update status
    const { error } = await supabase
      .from("requests")
      .update({ status: newStatus })
      .eq("id", requestId)
    if (error) {
      return { success: false, error: error.message }
    }

    // Create timeline entry
    await trackStatusChange(requestId, oldStatus, newStatus, userEmail)

    revalidatePath(`/admin/requests/${requestId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating status:", error)
    return { success: false, error: "Failed to update status" }
  }
}

/**
 * Update verification status and create timeline entry
 */
export async function updateVerificationStatus(
  requestId: string,
  newStatus: VerificationStatus,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get current verification status
    const { data: request } = await supabase
      .from("requests")
      .select("verification_status")
      .eq("id", requestId)
      .single()

    if (!request) {
      return { success: false, error: "Request not found" }
    }

    const oldStatus = request.verification_status

    // Update verification status
    const { error } = await supabase
      .from("requests")
      .update({ verification_status: newStatus })
      .eq("id", requestId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Create timeline entry
    await trackVerificationChange(requestId, oldStatus, newStatus, userEmail)

    revalidatePath(`/admin/requests/${requestId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating verification:", error)
    return { success: false, error: "Failed to update verification status" }
  }
}

/**
 * Update priority and create timeline entry
 */
export async function updatePriority(
  requestId: string,
  newPriority: PriorityLevel,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get current priority
    const { data: request } = await supabase
      .from("requests")
      .select("priority")
      .eq("id", requestId)
      .single()

    if (!request) {
      return { success: false, error: "Request not found" }
    }

    const oldPriority = request.priority

    // Update priority
    const { error } = await supabase
      .from("requests")
      .update({ priority: newPriority })
      .eq("id", requestId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Create timeline entry
    await trackPriorityChange(requestId, oldPriority, newPriority, userEmail)

    revalidatePath(`/admin/requests/${requestId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating priority:", error)
    return { success: false, error: "Failed to update priority" }
  }
}
