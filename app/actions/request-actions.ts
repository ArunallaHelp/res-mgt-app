"use server"

import db from "@/lib/db"
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
    // Get current status
    const request = await db.requests.findUnique({
      where: { id: requestId },
      select: { status: true },
    })
    
    if (!request) {
      return { success: false, error: "Request not found" }
    }

    const oldStatus = request.status || "new"

    // Update status
    await db.requests.update({
      where: { id: requestId },
      data: { status: newStatus },
    })

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
    // Get current verification status
    const request = await db.requests.findUnique({
      where: { id: requestId },
      select: { verification_status: true },
    })

    if (!request) {
      return { success: false, error: "Request not found" }
    }

    const oldStatus = request.verification_status || "unverified"

    // Update verification status
    await db.requests.update({
      where: { id: requestId },
      data: { verification_status: newStatus },
    })

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
    // Get current priority
    const request = await db.requests.findUnique({
      where: { id: requestId },
      select: { priority: true },
    })

    if (!request) {
      return { success: false, error: "Request not found" }
    }

    const oldPriority = request.priority || "medium"

    // Update priority
    await db.requests.update({
      where: { id: requestId },
      data: { priority: newPriority },
    })

    // Create timeline entry
    await trackPriorityChange(requestId, oldPriority, newPriority, userEmail)

    revalidatePath(`/admin/requests/${requestId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating priority:", error)
    return { success: false, error: "Failed to update priority" }
  }
}
