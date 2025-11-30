"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/lib/store/hooks"
import { addCommentThunk } from "@/lib/store/thunks/timelineThunks"
import { addNotification } from "@/lib/store/slices/uiSlice"

interface AddCommentFormProps {
  requestId: string
  userEmail: string
  onCommentAdded?: () => void
}

export function AddCommentForm({ requestId, userEmail, onCommentAdded }: AddCommentFormProps) {
  const dispatch = useAppDispatch()
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitting(true)
    
    try {
      const result = await dispatch(addCommentThunk({ 
        requestId, 
        comment: comment.trim(), 
        userEmail 
      })).unwrap()

      setComment("")
      dispatch(addNotification({ type: 'success', message: 'Comment added successfully' }))
      onCommentAdded?.()
    } catch (error) {
      dispatch(addNotification({ type: 'error', message: `Failed to add comment: ${error}` }))
    } finally {
      setSubmitting(false)
    }
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
