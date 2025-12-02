"use server"

import db from "@/lib/db"
import { Prisma } from "@prisma/client"
import type { TimelineEntry, TimelineEventType, TimelineEventData } from "@/lib/types"

/**
 * Create a timeline entry for a request
 */
export async function createTimelineEntry(
  requestId: string,
  eventType: TimelineEventType,
  createdBy: string,
  eventData?: TimelineEventData,
  comment?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.request_timeline.create({
      data: {
        request_id: requestId,
        event_type: eventType,
        event_data: eventData || Prisma.JsonNull,
        comment: comment || null,
        created_by: createdBy,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error creating timeline entry:", error)
    return { success: false, error: "Failed to create timeline entry" }
  }
}

/**
 * Add a comment to a request timeline
 */
export async function addTimelineComment(
  requestId: string,
  comment: string,
  createdBy: string
): Promise<{ success: boolean; error?: string }> {
  return createTimelineEntry(requestId, "comment", createdBy, undefined, comment)
}

/**
 * Get all timeline entries for a request
 */
export async function getRequestTimeline(requestId: string): Promise<{
  success: boolean
  data?: TimelineEntry[]
  error?: string
}> {
  try {
    const data = await db.request_timeline.findMany({
      where: {
        request_id: requestId,
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return {
      success: true,
      data: data.map((entry) => ({
        ...entry,
        created_at: entry.created_at?.toISOString() ?? new Date().toISOString(),
        event_data: entry.event_data as TimelineEventData | null,
      })) as TimelineEntry[],
    }
  } catch (error) {
    console.error("Error fetching timeline:", error)
    return { success: false, error: "Failed to fetch timeline" }
  }
}

/**
 * Create timeline entry for status change
 */
export async function trackStatusChange(
  requestId: string,
  oldStatus: string,
  newStatus: string,
  createdBy: string
): Promise<{ success: boolean; error?: string }> {
  return createTimelineEntry(requestId, "status_change", createdBy, {
    field: "status",
    old_value: oldStatus,
    new_value: newStatus,
  })
}

/**
 * Create timeline entry for verification status change
 */
export async function trackVerificationChange(
  requestId: string,
  oldStatus: string,
  newStatus: string,
  createdBy: string
): Promise<{ success: boolean; error?: string }> {
  return createTimelineEntry(requestId, "verification_change", createdBy, {
    field: "verification_status",
    old_value: oldStatus,
    new_value: newStatus,
  })
}

/**
 * Create timeline entry for priority change
 */
export async function trackPriorityChange(
  requestId: string,
  oldPriority: string,
  newPriority: string,
  createdBy: string
): Promise<{ success: boolean; error?: string }> {
  return createTimelineEntry(requestId, "priority_change", createdBy, {
    field: "priority",
    old_value: oldPriority,
    new_value: newPriority,
  })
}
