import { createAsyncThunk } from '@reduxjs/toolkit'
import { getRequestTimeline } from '@/app/actions/timeline'
import { setTimelineEntries, setTimelineLoading } from '../slices/timelineSlice'

export const fetchTimelineThunk = createAsyncThunk(
  'timeline/fetch',
  async (requestId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setTimelineLoading({ requestId, loading: true }))
      
      const result = await getRequestTimeline(requestId)
      
      if (result.success && result.data) {
        dispatch(setTimelineEntries({ requestId, entries: result.data }))
        return { requestId, entries: result.data }
      } else {
        throw new Error(result.error || 'Failed to fetch timeline')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      // We could dispatch an error action here if we had one in the slice
      return rejectWithValue(errorMessage)
    } finally {
      dispatch(setTimelineLoading({ requestId, loading: false }))
    }
  }
)

export const addCommentThunk = createAsyncThunk(
  'timeline/addComment',
  async (
    { requestId, comment, userEmail }: { requestId: string; comment: string; userEmail: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { addTimelineComment } = await import('@/app/actions/timeline')
      const result = await addTimelineComment(requestId, comment, userEmail)

      if (result.success) {
        dispatch(fetchTimelineThunk(requestId))
        return { success: true }
      } else {
        throw new Error(result.error || 'Failed to add comment')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return rejectWithValue(errorMessage)
    }
  }
)
