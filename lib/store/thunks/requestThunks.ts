import { createAsyncThunk } from "@reduxjs/toolkit";

import type {
  RequestStatus,
  VerificationStatus,
  PriorityLevel,
  SupportRequest,
} from "@/lib/types";
import {
  updateRequestStatus,
  updateVerificationStatus,
  updatePriority,
  fetchRequests,
} from "@/app/actions/request-actions";
import {
  updateRequestFieldOptimistic,
  confirmRequestUpdate,
  rollbackRequestUpdate,
  setRequestLoading,
  setRequestsList,
  setListLoading,
} from "../slices/requestsSlice";
import { triggerTimelineRefresh } from "../slices/timelineSlice";
import { addNotification } from "../slices/uiSlice";
import type { RootState } from "../index";

interface UpdateStatusParams {
  requestId: string;
  newStatus: RequestStatus;
  userEmail: string;
}

interface UpdateVerificationParams {
  requestId: string;
  newStatus: VerificationStatus;
  userEmail: string;
}

interface UpdatePriorityParams {
  requestId: string;
  newPriority: PriorityLevel;
  userEmail: string;
}

/**
 * Fetch requests with filters
 */
/**
 * Fetch requests with filters
 */
export const fetchRequestsThunk = createAsyncThunk(
  "requests/fetchList",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setListLoading(true));

      const state = getState() as RootState;
      const filters = state.ui.filters;

      const result = await fetchRequests({
        district: filters.district,
        status: filters.status,
        verification: filters.verification,
        priority: filters.priority,
        search: filters.search,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch requests");
      }

      const filteredData = result.data as SupportRequest[];
      dispatch(setRequestsList(filteredData));
      return filteredData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to fetch requests: ${errorMessage}`,
        })
      );
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setListLoading(false));
    }
  }
);

/**
 * Update request status with optimistic updates
 */
export const updateRequestStatusThunk = createAsyncThunk(
  "requests/updateStatus",
  async (params: UpdateStatusParams, { dispatch, rejectWithValue }) => {
    const { requestId, newStatus, userEmail } = params;

    try {
      // 1. Set loading state
      dispatch(setRequestLoading({ requestId, loading: true }));

      // 2. Optimistic update
      dispatch(
        updateRequestFieldOptimistic({
          requestId,
          field: "status",
          value: newStatus,
        })
      );

      // 3. Call server action
      const result = await updateRequestStatus(requestId, newStatus, userEmail);

      if (!result.success) {
        throw new Error(result.error || "Failed to update status");
      }

      // 4. Confirm the update
      dispatch(
        confirmRequestUpdate({ requestId, updates: { status: newStatus } })
      );

      // 5. Refresh timeline
      dispatch(triggerTimelineRefresh({ requestId }));

      // 6. Show success notification
      dispatch(
        addNotification({
          type: "success",
          message: "Status updated successfully",
        })
      );

      return { requestId, newStatus };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Rollback optimistic update
      dispatch(rollbackRequestUpdate({ requestId, error: errorMessage }));

      // Show error notification
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to update status: ${errorMessage}`,
        })
      );

      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update verification status with optimistic updates
 */
export const updateVerificationStatusThunk = createAsyncThunk(
  "requests/updateVerification",
  async (params: UpdateVerificationParams, { dispatch, rejectWithValue }) => {
    const { requestId, newStatus, userEmail } = params;

    try {
      // 1. Set loading state
      dispatch(setRequestLoading({ requestId, loading: true }));

      // 2. Optimistic update
      dispatch(
        updateRequestFieldOptimistic({
          requestId,
          field: "verification_status",
          value: newStatus,
        })
      );

      // 3. Call server action
      const result = await updateVerificationStatus(
        requestId,
        newStatus,
        userEmail
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to update verification status");
      }

      // 4. Confirm the update
      dispatch(
        confirmRequestUpdate({
          requestId,
          updates: { verification_status: newStatus },
        })
      );

      // 5. Refresh timeline
      dispatch(triggerTimelineRefresh({ requestId }));

      // 6. Show success notification
      dispatch(
        addNotification({
          type: "success",
          message: "Verification status updated successfully",
        })
      );

      return { requestId, newStatus };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Rollback optimistic update
      dispatch(rollbackRequestUpdate({ requestId, error: errorMessage }));

      // Show error notification
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to update verification: ${errorMessage}`,
        })
      );

      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update priority with optimistic updates
 */
export const updatePriorityThunk = createAsyncThunk(
  "requests/updatePriority",
  async (params: UpdatePriorityParams, { dispatch, rejectWithValue }) => {
    const { requestId, newPriority, userEmail } = params;

    try {
      // 1. Set loading state
      dispatch(setRequestLoading({ requestId, loading: true }));

      // 2. Optimistic update
      dispatch(
        updateRequestFieldOptimistic({
          requestId,
          field: "priority",
          value: newPriority,
        })
      );

      // 3. Call server action
      const result = await updatePriority(requestId, newPriority, userEmail);

      if (!result.success) {
        throw new Error(result.error || "Failed to update priority");
      }

      // 4. Confirm the update
      dispatch(
        confirmRequestUpdate({ requestId, updates: { priority: newPriority } })
      );

      // 5. Refresh timeline
      dispatch(triggerTimelineRefresh({ requestId }));

      // 6. Show success notification
      dispatch(
        addNotification({
          type: "success",
          message: "Priority updated successfully",
        })
      );

      return { requestId, newPriority };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Rollback optimistic update
      dispatch(rollbackRequestUpdate({ requestId, error: errorMessage }));

      // Show error notification
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to update priority: ${errorMessage}`,
        })
      );

      return rejectWithValue(errorMessage);
    }
  }
);
