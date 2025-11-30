"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { SupportRequest } from "@/lib/types"
import { RequestDetailsPanel } from "./request-details-panel"
import { RequestTimeline } from "./request-timeline"
import { AddCommentForm } from "./add-comment-form"
import { QuickActionsPanel } from "./quick-actions-panel"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { ArrowLeft, FileText } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setRequest } from "@/lib/store/slices/requestsSlice"
import { setActiveRequest, setDrawerOpen } from "@/lib/store/slices/uiSlice"
import { triggerTimelineRefresh } from "@/lib/store/slices/timelineSlice"

interface RequestViewPageProps {
  request: SupportRequest
  userEmail: string
}

export function RequestViewPage({ request: initialRequest, userEmail }: RequestViewPageProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const request = useAppSelector((state) => state.requests?.requests?.[initialRequest.id]) || initialRequest
  
  const optimisticUpdates = useAppSelector(
    (state) => state.requests?.optimisticUpdates?.[initialRequest.id] || {}
  )
  const isDrawerOpen = useAppSelector((state) => state.ui?.isDrawerOpen || false)
  const refreshTrigger = useAppSelector(
    (state) => state.timeline?.refreshTrigger?.[initialRequest.id]
  )

  useEffect(() => {
    dispatch(setRequest(initialRequest))
    dispatch(setActiveRequest(initialRequest.id))

    return () => {
      dispatch(setActiveRequest(null))
    }
  }, [dispatch, initialRequest])

  const handleCommentAdded = () => {
    dispatch(triggerTimelineRefresh({ requestId: request.id }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Request Details</h1>
                <p className="text-sm text-muted-foreground">{request.reference_code}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden"
                onClick={() => dispatch(setDrawerOpen(true))}
              >
                View More
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Layout: Two columns */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Request Details */}
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <RequestDetailsPanel request={request} />
              </div>
            </div>

            {/* Right: Timeline */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActionsPanel 
                request={request} 
                userEmail={userEmail}
              />

              {/* Add Comment Form */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Add Comment</h3>
                <AddCommentForm
                  requestId={request.id}
                  userEmail={userEmail}
                  onCommentAdded={handleCommentAdded}
                />
              </div>

              {/* Timeline */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4 border-b pb-2">Activity Timeline</h3>
                <RequestTimeline key={refreshTrigger} requestId={request.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout: Timeline first, details in drawer */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
          {/* Quick Actions */}
          <QuickActionsPanel 
            request={request} 
            userEmail={userEmail}
          />
          
          {/* Add Comment Form */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground mb-4">Add Comment</h3>
            <AddCommentForm
              requestId={request.id}
              userEmail={userEmail}
              onCommentAdded={handleCommentAdded}
            />
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground mb-4 border-b pb-2">Activity Timeline</h3>
            <RequestTimeline key={refreshTrigger} requestId={request.id} />
          </div>
        </div>

        {/* Floating Action Button for Details */}
        <div className="fixed bottom-6 right-6 z-20">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={() => dispatch(setDrawerOpen(true))}
          >
            <FileText className="h-6 w-6" />
          </Button>
        </div>

        {/* Bottom Drawer for Details */}
        <Drawer open={isDrawerOpen} onOpenChange={(open) => dispatch(setDrawerOpen(open))}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>Request Details</DrawerTitle>
              <DrawerDescription>{request.reference_code}</DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto p-4">
              <RequestDetailsPanel request={request} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
