"use server"

import { createClient } from "@/lib/supabase/server"

function generateReferenceCode(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `FLD-${year}-${random}`
}

export async function submitRequest(formData: FormData) {
  try {
    const supabase = await createClient()

    const name = formData.get("name") as string
    const age = Number.parseInt(formData.get("age") as string, 10)
    const district = formData.get("district") as string
    const phone = formData.get("phone") as string
    const email = (formData.get("email") as string) || null
    const grade = formData.get("grade") as string
    const exam_year = formData.get("exam_year") as string
    const subjects = formData.get("subjects") as string
    const flood_impact_details = formData.get("flood_impact_details") as string
    const flood_impact_types = JSON.parse(formData.get("flood_impact_types") as string) as string[]
    const support_needed = JSON.parse(formData.get("support_needed") as string) as string[]

    // Combine flood impact types and details
    const flood_impact = `Types: ${flood_impact_types.join(", ")}\n\nDetails: ${flood_impact_details}`

    // Generate unique reference code
    const reference_code = generateReferenceCode()

    const { error } = await supabase.from("requests").insert({
      reference_code,
      name,
      age,
      district,
      phone,
      email,
      grade,
      exam_year,
      subjects,
      flood_impact,
      support_needed,
      status: "new",
      verification_status: "unverified",
      priority: "medium",
    })

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, error: "Failed to submit request. Please try again." }
    }

    return { success: true, referenceCode: reference_code }
  } catch (error) {
    console.error("Submit error:", error)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
