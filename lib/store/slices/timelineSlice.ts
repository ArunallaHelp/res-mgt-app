import type { TimelineEntry } from '@/lib/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TimelineState {
  // Store timeline entries by request ID
  entries: Record<string, TimelineEntry[]>
  // Track loading state
  loading: Record<string, boolean>
  // Track when to refresh
  refreshTrigger: Record<string, number>
}

const initialState: TimelineState = {
  entries: {},
  loading: {},
  refreshTrigger: {},
}

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    // Set timeline entries for a request
    setTimelineEntries: (
      state,
      action: PayloadAction<{ requestId: string; entries: TimelineEntry[] }>
    ) => {
      const { requestId, entries } = action.payload
      state.entries[requestId] = entries
      delete state.loading[requestId]
    },

    // Add a new timeline entry optimistically
    addTimelineEntry: (
      state,
      action: PayloadAction<{ requestId: string; entry: TimelineEntry }>
    ) => {
      const { requestId, entry } = action.payload
      
      if (!state.entries[requestId]) {
        state.entries[requestId] = []
      }
      
      // Add to the beginning (most recent first)
      state.entries[requestId].unshift(entry)
    },

    // Trigger a timeline refresh
    triggerTimelineRefresh: (state, action: PayloadAction<{ requestId: string }>) => {
      const { requestId } = action.payload
      state.refreshTrigger[requestId] = Date.now()
    },

    // Set loading state
    setTimelineLoading: (
      state,
      action: PayloadAction<{ requestId: string; loading: boolean }>
    ) => {
      const { requestId, loading } = action.payload
      if (loading) {
        state.loading[requestId] = true
      } else {
        delete state.loading[requestId]
      }
    },
  },
})

export const {
  setTimelineEntries,
  addTimelineEntry,
  triggerTimelineRefresh,
  setTimelineLoading,
} = timelineSlice.actions

export default timelineSlice.reducer
