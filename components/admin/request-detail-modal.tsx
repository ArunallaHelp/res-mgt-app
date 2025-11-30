"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import type { SupportRequest, RequestStatus, VerificationStatus, PriorityLevel } from "@/lib/types"
import { SUPPORT_OPTIONS, FLOOD_IMPACT_OPTIONS } from "@/lib/types"

interface RequestDetailModalProps {
  request: SupportRequest
  onClose: () => void
  onUpdate: () => void
}

export function RequestDetailModal({ request, onClose, onUpdate }: RequestDetailModalProps) {
  const [status, setStatus] = useState<RequestStatus>(request.status)
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(request.verification_status)
  const [priority, setPriority] = useState<PriorityLevel>(request.priority)
  const [adminNotes, setAdminNotes] = useState(request.admin_notes || "")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("requests")
      .update({
        status,
        verification_status: verificationStatus,
        priority,
        admin_notes: adminNotes,
      })
      .eq("id", request.id)

    if (error) {
      console.error("Error updating request:", error)
      alert("Failed to update request")
    } else {
      onUpdate()
    }
    setSaving(false)
  }

  const getSupportLabel = (id: string) => {
    const option = SUPPORT_OPTIONS.find((o) => o.id === id)
    return option?.label || id
  }

  const getImpactLabel = (id: string) => {
    const option = FLOOD_IMPACT_OPTIONS.find((o) => o.id === id)
    return option?.label || id
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Request: {request.reference_code}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <section>
            <h3 className="font-semibold text-foreground mb-3 border-b pb-2">Student Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{request.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{request.age}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">District</p>
                <p className="font-medium">{request.district}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{request.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{request.email || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">{new Date(request.created_at).toLocaleString()}</p>
              </div>
            </div>
          </section>

          {/* Education Information */}
          <section>
            <h3 className="font-semibold text-foreground mb-3 border-b pb-2">Education Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Grade / Level</p>
                <p className="font-medium">{request.grade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exam Year</p>
                <p className="font-medium">{request.exam_year}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Subjects</p>
                <p className="font-medium">{request.subjects}</p>
              </div>
            </div>
          </section>

          {/* Flood Impact */}
          <section>
            <h3 className="font-semibold text-foreground mb-3 border-b pb-2">Flood Impact</h3>
            <p className="text-sm whitespace-pre-wrap">{request.flood_impact}</p>
          </section>

          {/* Support Needed */}
          <section>
            <h3 className="font-semibold text-foreground mb-3 border-b pb-2">Support Needed</h3>
            <div className="flex flex-wrap gap-2">
              {request.support_needed.map((item) => (
                <span key={item} className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                  {getSupportLabel(item)}
                </span>
              ))}
            </div>
          </section>

          {/* Admin Controls */}
          <section className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="font-semibold text-foreground mb-4">Admin Controls</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Verification Status</Label>
                <Select
                  value={verificationStatus}
                  onValueChange={(v) => setVerificationStatus(v as VerificationStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unverified">Unverified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Support Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as RequestStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as PriorityLevel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <Label>Admin Notes</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this request..."
                rows={3}
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
