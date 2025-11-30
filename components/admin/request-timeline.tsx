"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchTimelineThunk } from "@/lib/store/thunks/timelineThunks"
import type { TimelineEntry } from "@/lib/types"
import {
  formatTimelineEvent,
  getEventIcon,
  getEventColor,
  formatRelativeTime,
} from "@/lib/timeline-utils"
import {
  PlusCircle,
  ArrowRightCircle,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  FileText,
  Circle,
} from "lucide-react"

interface RequestTimelineProps {
  requestId: string
}

const iconMap = {
  "plus-circle": PlusCircle,
  "arrow-right-circle": ArrowRightCircle,
  "check-circle": CheckCircle,
  "alert-circle": AlertCircle,
  "message-circle": MessageCircle,
  "file-text": FileText,
  circle: Circle,
}

export function RequestTimeline({ requestId }: RequestTimelineProps) {
  const dispatch = useAppDispatch()
  
  // Get state from Redux
  const timeline = useAppSelector((state) => state.timeline?.entries?.[requestId] || [])
  const loading = useAppSelector((state) => state.timeline?.loading?.[requestId] || false)
  const refreshTrigger = useAppSelector((state) => state.timeline?.refreshTrigger?.[requestId])

  useEffect(() => {
    dispatch(fetchTimelineThunk(requestId))
  }, [dispatch, requestId, refreshTrigger])

  if (loading && timeline.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Loading timeline...</div>
      </div>
    )
  }

  if (timeline.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">No timeline entries yet</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {timeline.map((entry, index) => {
        const colors = getEventColor(entry.event_type)
        const iconName = getEventIcon(entry.event_type)
        const Icon = iconMap[iconName as keyof typeof iconMap] || Circle
        const isLast = index === timeline.length - 1

        return (
          <div key={entry.id} className="flex gap-3">
            {/* Timeline line and icon */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${colors.bg} ${colors.border}`}
              >
                <Icon className={`h-4 w-4 ${colors.text}`} />
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {formatTimelineEvent(entry.event_type, entry.event_data, entry.comment)}
                  </p>
                  {entry.comment && entry.event_type === "comment" && (
                    <div className="mt-2 rounded-lg bg-muted p-3">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{entry.comment}</p>
                    </div>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{entry.created_by}</span>
                    <span>•</span>
                    <span title={new Date(entry.created_at).toLocaleString()}>
                      {formatRelativeTime(entry.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
