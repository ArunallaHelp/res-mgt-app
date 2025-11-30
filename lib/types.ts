export type RequestStatus = "new" | "in_progress" | "completed"
export type VerificationStatus = "unverified" | "pending" | "verified"
export type PriorityLevel = "low" | "medium" | "high"

export interface SupportRequest {
  id: string
  reference_code: string
  name: string
  age: number
  district: string
  phone: string
  email: string | null
  grade: string
  exam_year: string
  subjects: string
  flood_impact: string
  support_needed: string[]
  status: RequestStatus
  verification_status: VerificationStatus
  priority: PriorityLevel
  admin_notes: string | null
  created_at: string
}

export type TimelineEventType = 
  | "status_change" 
  | "verification_change" 
  | "priority_change" 
  | "comment" 
  | "note" 
  | "created"

export interface TimelineEventData {
  old_value?: string
  new_value?: string
  field?: string
  [key: string]: any
}

export interface TimelineEntry {
  id: string
  request_id: string
  event_type: TimelineEventType
  event_data: TimelineEventData | null
  comment: string | null
  created_by: string
  created_at: string
}


export const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Vavuniya",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
]

export const GRADES = [
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "O/L (Ordinary Level)",
  "A/L - Science",
  "A/L - Commerce",
  "A/L - Arts",
  "A/L - Technology",
  "University",
  "Other",
]

export const SUPPORT_OPTIONS = [
  { id: "past_papers", label: "Past papers / Books" },
  { id: "online_classes", label: "Online classes" },
  { id: "mentoring", label: "Mentoring" },
  { id: "exam_guidance", label: "Exam guidance" },
  { id: "stationery", label: "Stationery" },
  { id: "device_support", label: "Device / Data support" },
]

export const FLOOD_IMPACT_OPTIONS = [
  { id: "lost_materials", label: "Lost books/materials" },
  { id: "tuition_disrupted", label: "Tuition disrupted" },
  { id: "house_damage", label: "House damage" },
  { id: "financial_difficulty", label: "Financial difficulty" },
  { id: "device_issues", label: "Device or connectivity issues" },
]
