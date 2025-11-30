import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  timestamp: number
}

interface RequestFilters {
  district: string
  status: string
  verification: string
  priority: string
  search: string
}

interface UiState {
  // Currently active request ID
  activeRequestId: string | null
  // Mobile drawer state
  isDrawerOpen: boolean
  // Notifications
  notifications: Notification[]
  // Dashboard filters
  filters: RequestFilters
}

const initialState: UiState = {
  activeRequestId: null,
  isDrawerOpen: false,
  notifications: [],
  filters: {
    district: 'all',
    status: 'all',
    verification: 'all',
    priority: 'all',
    search: '',
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Set the active request
    setActiveRequest: (state, action: PayloadAction<string | null>) => {
      state.activeRequestId = action.payload
    },

    // Toggle drawer
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload
    },

    // Update filters
    setFilters: (state, action: PayloadAction<Partial<RequestFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters
    },

    // Add a notification
    addNotification: (
      state,
      action: PayloadAction<{ type: 'success' | 'error' | 'info'; message: string }>
    ) => {
      const notification: Notification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        type: action.payload.type,
        message: action.payload.message,
        timestamp: Date.now(),
      }
      state.notifications.push(notification)
    },

    // Remove a notification
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  setActiveRequest,
  setDrawerOpen,
  setFilters,
  resetFilters,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions

export default uiSlice.reducer
