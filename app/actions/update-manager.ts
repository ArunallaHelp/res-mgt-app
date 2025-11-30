"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateManagerProfile(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // Get current user to ensure they are updating their own profile
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return { success: false, error: "Unauthorized" }
    }

    // Personal Information
    const full_name = formData.get("full_name") as string
    const phone = formData.get("phone") as string
    const district = formData.get("district") as string
    const nearest_town = formData.get("nearest_town") as string

    // Professional Information
    const job_role = formData.get("job_role") as string
    const other_role = formData.get("other_role") as string
    const experience_years = formData.get("experience_years") as string
    const highest_qualification = formData.get("highest_qualification") as string
    const other_qualification = formData.get("other_qualification") as string
    const professional_skills = JSON.parse(formData.get("professional_skills") as string)
    const other_skill = formData.get("other_skill") as string

    // Support Type
    const support_types = JSON.parse(formData.get("support_types") as string)

    // Subjects & Levels
    const grade_levels = JSON.parse(formData.get("grade_levels") as string)
    const subjects = formData.get("subjects") as string
    const other_subject = formData.get("other_subject") as string

    // Availability
    const available_days = JSON.parse(formData.get("available_days") as string)
    const available_time_slots = JSON.parse(formData.get("available_time_slots") as string)

    // Teaching Mode
    const teaching_mode = formData.get("teaching_mode") as string
    const is_teacher = teaching_mode !== "Not Applicable"

    // Support Method
    const support_methods = JSON.parse(formData.get("support_methods") as string)

    // Additional Information
    const volunteering_experience = formData.get("volunteering_experience") as string
    const preferences_limitations = formData.get("preferences_limitations") as string
    const comments = formData.get("comments") as string

    const supabaseAdmin = createAdminClient()
    const { error } = await supabaseAdmin
      .from("managers")
      .update({
        full_name,
        // phone, // Phone cannot be changed
        district,
        nearest_town,
        job_role,
        other_role,
        experience_years,
        highest_qualification,
        other_qualification,
        professional_skills,
        other_skill,
        support_types,
        grade_levels,
        subjects,
        other_subject,
        available_days,
        available_time_slots,
        teaching_mode,
        is_teacher,
        support_methods,
        volunteering_experience,
        preferences_limitations,
        comments,
      })
      .eq("email", user.email)

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, error: "Failed to update profile. Please try again." }
    }

    revalidatePath("/manager/settings")
    return { success: true }
  } catch (error) {
    console.error("Update error:", error)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
