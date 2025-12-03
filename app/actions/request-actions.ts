"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import type {
  RequestStatus,
  VerificationStatus,
  PriorityLevel,
} from "@/lib/types";
import {
  trackStatusChange,
  trackVerificationChange,
  trackPriorityChange,
} from "./timeline";

/**
 * Update request status and create timeline entry
 */
import { createClient } from "@/lib/supabase/server";

export async function updateRequestStatus(
  requestId: string,
  newStatus: RequestStatus,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    // Get current status
    const request = await db.requests.findUnique({
      where: { id: requestId },
      select: { status: true },
    });

    if (!request) {
      return { success: false, error: "Request not found" };
    }

    const oldStatus = request.status || "new";

    // Update status
    await db.requests.update({
      where: { id: requestId },
      data: { status: newStatus },
    });

    // Create timeline entry
    await trackStatusChange(requestId, oldStatus, newStatus, userEmail);

    revalidatePath(`/admin/requests/${requestId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Update verification status and create timeline entry
 */
export async function updateVerificationStatus(
  requestId: string,
  newStatus: VerificationStatus,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    // Get current verification status
    const request = await db.requests.findUnique({
      where: { id: requestId },
      select: { verification_status: true },
    });

    if (!request) {
      return { success: false, error: "Request not found" };
    }

    const oldStatus = request.verification_status || "unverified";

    // Update verification status
    await db.requests.update({
      where: { id: requestId },
      data: { verification_status: newStatus },
    });

    // Create timeline entry
    await trackVerificationChange(requestId, oldStatus, newStatus, userEmail);

    revalidatePath(`/admin/requests/${requestId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating verification:", error);
    return { success: false, error: "Failed to update verification status" };
  }
}

/**
 * Update priority and create timeline entry
 */
export async function updatePriority(
  requestId: string,
  newPriority: PriorityLevel,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    // Get current priority
    const request = await db.requests.findUnique({
      where: { id: requestId },
      select: { priority: true },
    });

    if (!request) {
      return { success: false, error: "Request not found" };
    }

    const oldPriority = request.priority || "medium";

    // Update priority
    await db.requests.update({
      where: { id: requestId },
      data: { priority: newPriority },
    });

    // Create timeline entry
    await trackPriorityChange(requestId, oldPriority, newPriority, userEmail);

    revalidatePath(`/admin/requests/${requestId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating priority:", error);
    return { success: false, error: "Failed to update priority" };
  }
}

/**
 * Fetch requests with filters
 */
export async function fetchRequests(filters: {
  district: string;
  status: string;
  verification: string;
  priority: string;
  search: string;
}): Promise<{ success: boolean; data?: any[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const where: any = {};

    // Apply filters
    if (filters.district !== "all") {
      where.district = filters.district;
    }
    if (filters.status !== "all") {
      where.status = filters.status as RequestStatus;
    }
    if (filters.verification !== "all") {
      where.verification_status = filters.verification as VerificationStatus;
    }
    if (filters.priority !== "all") {
      where.priority = filters.priority as PriorityLevel;
    }

    // Apply search
    if (filters.search) {
      const search = filters.search.trim();
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { reference_code: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const requests = await db.requests.findMany({
      where,
      orderBy: { created_at: "desc" },
    });

    // Transform data to match SupportRequest interface
    const formattedRequests = requests.map((req) => ({
      ...req,
      birth_year: req.birth_year ? parseInt(req.birth_year) : 0, // Handle type mismatch
    }));

    return { success: true, data: formattedRequests };
  } catch (error) {
    console.error("Error fetching requests:", error);
    return { success: false, error: "Failed to fetch requests" };
  }
}
