import type { SupportRequest, RequestStatus, VerificationStatus, PriorityLevel } from '@/lib/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RequestsState {
  // Store requests by ID for quick lookup
  requests: Record<string, SupportRequest>
  // Store list of IDs for dashboard
  listIds: string[]
  // Track loading state for async operations
  loading: Record<string, boolean> // key: requestId, value: loading state
  // Global loading state for list fetch
  listLoading: boolean
  // Track errors
  errors: Record<string, string | null> // key: requestId, value: error message
  // Track optimistic updates for rollback
  optimisticUpdates: Record<string, Partial<SupportRequest>> // key: requestId
}

const initialState: RequestsState = {
  requests: {},
  listIds: [],
  loading: {},
  listLoading: false,
  errors: {},
  optimisticUpdates: {},
}

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    // Set the list of requests
    setRequestsList: (state, action: PayloadAction<SupportRequest[]>) => {
      const requests = action.payload
      state.listIds = requests.map((r) => r.id)
      requests.forEach((r) => {
        state.requests[r.id] = r
      })
      state.listLoading = false
    },

    // Set list loading state
    setListLoading: (state, action: PayloadAction<boolean>) => {
      state.listLoading = action.payload
    },

    // Set or update a request
    setRequest: (state, action: PayloadAction<SupportRequest>) => {
      const request = action.payload
      state.requests[request.id] = request
      // Clear any optimistic updates once we have the real data
      delete state.optimisticUpdates[request.id]
    },

    // Update a specific field optimistically
    updateRequestFieldOptimistic: (
      state,
      action: PayloadAction<{
        requestId: string
        field: 'status' | 'verification_status' | 'priority'
        value: RequestStatus | VerificationStatus | PriorityLevel
      }>
    ) => {
      const { requestId, field, value } = action.payload
      
      // Store the optimistic update
      if (!state.optimisticUpdates[requestId]) {
        state.optimisticUpdates[requestId] = {}
      }
      // TypeScript workaround: assign to any field of the partial request
      ;(state.optimisticUpdates[requestId] as any)[field] = value
    },

    // Confirm an optimistic update (merge into actual request)
    confirmRequestUpdate: (
      state,
      action: PayloadAction<{ requestId: string; updates?: Partial<SupportRequest> }>
    ) => {
      const { requestId, updates } = action.payload
      
      if (state.requests[requestId]) {
        // Merge updates into the actual request
        state.requests[requestId] = {
          ...state.requests[requestId],
          ...(updates || {}),
          // Also merge optimistic updates if they exist (though updates payload should take precedence if provided)
          ...(state.optimisticUpdates[requestId] || {}),
        }
      }
      
      // Clear optimistic updates
      delete state.optimisticUpdates[requestId]
      
      // Clear loading and error state
      delete state.loading[requestId]
      delete state.errors[requestId]
    },

    // Rollback an optimistic update
    rollbackRequestUpdate: (state, action: PayloadAction<{ requestId: string; error: string }>) => {
      const { requestId, error } = action.payload
      
      // Clear optimistic updates
      delete state.optimisticUpdates[requestId]
      
      // Set error
      state.errors[requestId] = error
      
      // Clear loading
      delete state.loading[requestId]
    },

    // Set loading state
    setRequestLoading: (state, action: PayloadAction<{ requestId: string; loading: boolean }>) => {
      const { requestId, loading } = action.payload
      if (loading) {
        state.loading[requestId] = true
      } else {
        delete state.loading[requestId]
      }
    },

    // Clear error
    clearRequestError: (state, action: PayloadAction<{ requestId: string }>) => {
      const { requestId } = action.payload
      delete state.errors[requestId]
    },
  },
})

export const {
  setRequestsList,
  setListLoading,
  setRequest,
  updateRequestFieldOptimistic,
  confirmRequestUpdate,
  rollbackRequestUpdate,
  setRequestLoading,
  clearRequestError,
} = requestsSlice.actions

export default requestsSlice.reducer
