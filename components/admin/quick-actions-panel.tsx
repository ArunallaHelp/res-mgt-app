"use client"

import { useState, useRef, useEffect } from "react"
import type { SupportRequest, RequestStatus, VerificationStatus, PriorityLevel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateRequestStatus, updateVerificationStatus, updatePriority } from "@/app/actions/request-actions"
import { CheckCircle, Clock, XCircle, AlertTriangle, TrendingUp } from "lucide-react"

interface QuickActionsPanelProps {
  request: SupportRequest
  userEmail: string
  onActionComplete: () => void
  onUpdate?: (field: 'status' | 'verification_status' | 'priority', value: string) => void
}

export function QuickActionsPanel({ request, userEmail, onActionComplete, onUpdate }: QuickActionsPanelProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  
  // Use refs to track the original values before optimistic update
  const originalStatusRef = useRef(request.status)
  const originalVerificationRef = useRef(request.verification_status)
  const originalPriorityRef = useRef(request.priority)
  
  // Update refs when request prop changes
  useEffect(() => {
    if (!updating) {
      originalStatusRef.current = request.status
      originalVerificationRef.current = request.verification_status
      originalPriorityRef.current = request.priority
    }
  }, [request.status, request.verification_status, request.priority, updating])

  const handleStatusChange = async (newStatus: RequestStatus) => {
    if (newStatus === request.status) return
    
    setUpdating("status")
    
    // Store the original value before optimistic update
    const originalStatus = request.status
    originalStatusRef.current = originalStatus
    
    // Optimistic update
    onUpdate?.('status', newStatus)
    
    const result = await updateRequestStatus(request.id, newStatus, userEmail)
    
    if (result.success) {
      onActionComplete()
    } else {
      alert("Failed to update status: " + (result.error || "Unknown error"))
      // Revert optimistic update on error using the stored original value
      onUpdate?.('status', originalStatus)
    }
    setUpdating(null)
  }

  const handleVerificationChange = async (newStatus: VerificationStatus) => {
    if (newStatus === request.verification_status) return
    
    setUpdating("verification")
    
    // Store the original value before optimistic update
    const originalVerification = request.verification_status
    originalVerificationRef.current = originalVerification
    
    // Optimistic update
    onUpdate?.('verification_status', newStatus)
    
    const result = await updateVerificationStatus(request.id, newStatus, userEmail)
    
    if (result.success) {
      onActionComplete()
    } else {
      alert("Failed to update verification: " + (result.error || "Unknown error"))
      // Revert optimistic update on error using the stored original value
      onUpdate?.('verification_status', originalVerification)
    }
    setUpdating(null)
  }

  const handlePriorityChange = async (newPriority: PriorityLevel) => {
    if (newPriority === request.priority) return
    
    setUpdating("priority")
    
    // Store the original value before optimistic update
    const originalPriority = request.priority
    originalPriorityRef.current = originalPriority
    
    // Optimistic update
    onUpdate?.('priority', newPriority)
    
    const result = await updatePriority(request.id, newPriority, userEmail)
    
    if (result.success) {
      onActionComplete()
    } else {
      alert("Failed to update priority: " + (result.error || "Unknown error"))
      // Revert optimistic update on error using the stored original value
      onUpdate?.('priority', originalPriority)
    }
    setUpdating(null)
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
              variant={request.status === "new" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange("new")}
              disabled={updating === "status" || request.status === "new"}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              New
            </Button>
            <Button
              variant={request.status === "in_progress" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange("in_progress")}
              disabled={updating === "status" || request.status === "in_progress"}
              className="flex items-center gap-1"
            >
              <AlertTriangle className="h-4 w-4" />
              In Progress
            </Button>
            <Button
              variant={request.status === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange("completed")}
              disabled={updating === "status" || request.status === "completed"}
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
              variant={request.verification_status === "unverified" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVerificationChange("unverified")}
              disabled={updating === "verification" || request.verification_status === "unverified"}
              className="flex items-center gap-1"
            >
              <XCircle className="h-4 w-4" />
              Unverified
            </Button>
            <Button
              variant={request.verification_status === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVerificationChange("pending")}
              disabled={updating === "verification" || request.verification_status === "pending"}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              Pending
            </Button>
            <Button
              variant={request.verification_status === "verified" ? "default" : "outline"}
              size="sm"
              onClick={() => handleVerificationChange("verified")}
              disabled={updating === "verification" || request.verification_status === "verified"}
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
              variant={request.priority === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePriorityChange("low")}
              disabled={updating === "priority" || request.priority === "low"}
              className="flex items-center gap-1"
            >
              Low
            </Button>
            <Button
              variant={request.priority === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePriorityChange("medium")}
              disabled={updating === "priority" || request.priority === "medium"}
              className="flex items-center gap-1"
            >
              Medium
            </Button>
            <Button
              variant={request.priority === "high" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePriorityChange("high")}
              disabled={updating === "priority" || request.priority === "high"}
              className="flex items-center gap-1"
            >
              High
            </Button>
          </div>
        </div>

        {updating && (
          <div className="text-sm text-muted-foreground text-center">
            Updating {updating}...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
