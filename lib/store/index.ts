import { configureStore } from '@reduxjs/toolkit'
import requestsReducer from './slices/requestsSlice'
import timelineReducer from './slices/timelineSlice'
import uiReducer from './slices/uiSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      requests: requestsReducer,
      timeline: timelineReducer,
      ui: uiReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
