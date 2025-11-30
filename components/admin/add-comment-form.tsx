"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { addTimelineComment } from "@/app/actions/timeline"

interface AddCommentFormProps {
  requestId: string
  userEmail: string
  onCommentAdded: () => void
}

export function AddCommentForm({ requestId, userEmail, onCommentAdded }: AddCommentFormProps) {
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitting(true)
    const result = await addTimelineComment(requestId, comment.trim(), userEmail)

    if (result.success) {
      setComment("")
      onCommentAdded()
    } else {
      alert("Failed to add comment: " + (result.error || "Unknown error"))
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="comment">Add Comment</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment to the timeline..."
          rows={3}
          disabled={submitting}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{comment.length} characters</span>
          <Button type="submit" size="sm" disabled={!comment.trim() || submitting}>
            {submitting ? "Adding..." : "Add Comment"}
          </Button>
        </div>
      </div>
    </form>
  )
}
