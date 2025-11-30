"use client"

import type { SupportRequest, RequestStatus, VerificationStatus, PriorityLevel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, XCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import {
  updateRequestStatusThunk,
  updateVerificationStatusThunk,
  updatePriorityThunk,
} from "@/lib/store/thunks/requestThunks"

interface QuickActionsPanelProps {
  request: SupportRequest
  userEmail: string
}

export function QuickActionsPanel({ request, userEmail }: QuickActionsPanelProps) {
  const dispatch = useAppDispatch()
  
  // Get the optimistic updates and loading state from Redux
  const optimisticUpdates = useAppSelector(
    (state) => state.requests.optimisticUpdates[request.id] || {}
  )
  const isLoading = useAppSelector((state) => state.requests.loading[request.id] || false)

  // Merge the request with optimistic updates
  const displayRequest = { ...request, ...optimisticUpdates }

  const handleStatusChange = async (newStatus: RequestStatus) => {
    if (newStatus === displayRequest.status) return
    
    dispatch(
      updateRequestStatusThunk({
        requestId: request.id,
        newStatus,
        userEmail,
      })
    )
  }

  const handleVerificationChange = async (newStatus: VerificationStatus) => {
    if (newStatus === displayRequest.verification_status) return
    
    dispatch(
      updateVerificationStatusThunk({
        requestId: request.id,
        newStatus,
        userEmail,
      })
    )
  }

  const handlePriorityChange = async (newPriority: PriorityLevel) => {
    if (newPriority === displayRequest.priority) return
    
    dispatch(
      updatePriorityThunk({
        requestId: request.id,
        newPriority,
        userEmail,
      })
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Actions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={displayRequest.status === "new" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange("new")}
              disabled={isLoading || displayRequest.status === "new"}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              New
            </Button>
            <Button
              variant={displayRequest.status === "in_progress" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange("in_progress")}
              disabled={isLoading || displayRequest.status === "in_progress"}
              className="flex items-center gap-1"
            >
              <AlertTriangle className="h-4 w-4" />
              In Progress
            </Button>
            <Button
              variant={displayRequest.status === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange("completed")}
              disabled={isLoading || displayRequest.status === "completed"}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Completed
            </Button>
          </div>
        </div>

        {/* Verification Actions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Verification</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={displayRequest.verification_status === "unverified" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVerificationChange("unverified")}
              disabled={isLoading || displayRequest.verification_status === "unverified"}
              className="flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" />
              Unverified
            </Button>
            <Button
              variant={displayRequest.verification_status === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVerificationChange("pending")}
              disabled={isLoading || displayRequest.verification_status === "pending"}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              Pending
            </Button>
            <Button
              variant={displayRequest.verification_status === "verified" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVerificationChange("verified")}
              disabled={isLoading || displayRequest.verification_status === "verified"}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Verified
            </Button>
          </div>
        </div>

        {/* Priority Actions */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Priority</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={displayRequest.priority === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePriorityChange("low")}
              disabled={isLoading || displayRequest.priority === "low"}
              className="flex items-center gap-1"
            >
              Low
            </Button>
            <Button
              variant={displayRequest.priority === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePriorityChange("medium")}
              disabled={isLoading || displayRequest.priority === "medium"}
              className="flex items-center gap-1"
            >
              Medium
            </Button>
            <Button
              variant={displayRequest.priority === "high" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePriorityChange("high")}
              disabled={isLoading || displayRequest.priority === "high"}
              className="flex items-center gap-1"
            >
              High
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="text-sm text-muted-foreground text-center">
            Updating...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
