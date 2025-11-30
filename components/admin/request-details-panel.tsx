"use client"

import type { SupportRequest } from "@/lib/types"
import { SUPPORT_OPTIONS, FLOOD_IMPACT_OPTIONS } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface RequestDetailsPanelProps {
  request: SupportRequest
}

export function RequestDetailsPanel({ request }: RequestDetailsPanelProps) {
  const getSupportLabel = (id: string) => {
    const option = SUPPORT_OPTIONS.find((o) => o.id === id)
    return option?.label || id
  }

  const getImpactLabel = (id: string) => {
    const option = FLOOD_IMPACT_OPTIONS.find((o) => o.id === id)
    return option?.label || id
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">{request.reference_code}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Submitted {new Date(request.created_at).toLocaleString()}
        </p>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={request.status === "new" ? "default" : request.status === "in_progress" ? "secondary" : "outline"}>
          {request.status.replace("_", " ").toUpperCase()}
        </Badge>
        <Badge variant="outline">{request.verification_status.toUpperCase()}</Badge>
        <Badge variant="outline">{request.priority.toUpperCase()} Priority</Badge>
      </div>

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
          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{request.email || "Not provided"}</p>
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

      {/* Admin Notes */}
      {request.admin_notes && (
        <section>
          <h3 className="font-semibold text-foreground mb-3 border-b pb-2">Admin Notes</h3>
          <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">{request.admin_notes}</p>
        </section>
      )}
    </div>
  )
}
