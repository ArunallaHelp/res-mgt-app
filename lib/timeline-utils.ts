import type { TimelineEventType, TimelineEventData } from "./types"
import { formatDistanceToNow } from "date-fns"

/**
 * Format a timeline event for display
 */
export function formatTimelineEvent(
  eventType: TimelineEventType,
  eventData: TimelineEventData | null,
  comment: string | null
): string {
  switch (eventType) {
    case "created":
      return "Request submitted"
    case "status_change":
      return `Status changed from "${formatValue(eventData?.old_value)}" to "${formatValue(eventData?.new_value)}"`
    case "verification_change":
      return `Verification status changed from "${formatValue(eventData?.old_value)}" to "${formatValue(eventData?.new_value)}"`
    case "priority_change":
      return `Priority changed from "${formatValue(eventData?.old_value)}" to "${formatValue(eventData?.new_value)}"`
    case "comment":
      return comment || "Comment added"
    case "note":
      return comment || "Note added"
    default:
      return "Activity recorded"
  }
}

/**
 * Format a value for display (convert snake_case to Title Case)
 */
function formatValue(value?: string): string {
  if (!value) return "N/A"
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Get icon name for event type
 */
export function getEventIcon(eventType: TimelineEventType): string {
  switch (eventType) {
    case "created":
      return "plus-circle"
    case "status_change":
      return "arrow-right-circle"
    case "verification_change":
      return "check-circle"
    case "priority_change":
      return "alert-circle"
    case "comment":
      return "message-circle"
    case "note":
      return "file-text"
    default:
      return "circle"
  }
}

/**
 * Get color scheme for event type
 */
export function getEventColor(eventType: TimelineEventType): {
  bg: string
  text: string
  border: string
} {
  switch (eventType) {
    case "created":
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-300 dark:border-blue-700",
      }
    case "status_change":
      return {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-300 dark:border-purple-700",
      }
    case "verification_change":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-300 dark:border-green-700",
      }
    case "priority_change":
      return {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
        border: "border-orange-300 dark:border-orange-700",
      }
    case "comment":
    case "note":
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-300 dark:border-gray-700",
      }
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-300 dark:border-gray-700",
      }
  }
}

/**
 * Format timestamp as relative time
 */
export function formatRelativeTime(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch {
    return "Unknown time"
  }
}
