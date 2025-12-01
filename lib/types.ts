export type RequestStatus = "new" | "in_progress" | "completed"
export type VerificationStatus = "unverified" | "pending" | "verified"
export type PriorityLevel = "low" | "medium" | "high"

export interface SupportRequest {
  id: string
  reference_code: string
  name: string
  birth_year: number
  district: string
  nearest_town?: string
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

export interface ManagerApplication {
  id: string
  // Personal Information
  full_name: string
  email: string
  phone: string
  district: string
  nearest_town: string
  
  // Professional Information
  job_role: string
  other_role?: string
  experience_years: string
  highest_qualification: string
  other_qualification?: string
  professional_skills: string[]
  other_skill?: string
  
  // Support Type
  support_types: string[]
  
  // Subjects & Levels
  grade_levels: string[]
  subjects: string
  other_subject?: string
  
  // Availability
  available_days: string[]
  available_time_slots: string[]
  
  // Teaching Mode
  teaching_mode: string
  
  // Support Method
  support_methods: string[]
  
  // Additional Information
  volunteering_experience?: string
  preferences_limitations?: string
  comments?: string
  
  verification_status: VerificationStatus
  created_at: string
  tags?: string[]
  group_ids?: string[]
}

export const CURRENT_ROLES = [
  "Student",
  "School Teacher",
  "Tuition Teacher",
  "University Lecturer",
  "University Student",
  "IT / STEM Professional",
  "Non-STEM Professional",
  "Retired Teacher",
  "Other"
]

export const EXPERIENCE_YEARS = [
  "0–1 years",
  "2–5 years",
  "6–10 years",
  "10+ years"
]

export const QUALIFICATIONS = [
  "O/L",
  "A/L",
  "Diploma",
  "Degree",
  "Postgraduate",
  "Other"
]

export const PROFESSIONAL_SKILLS = [
  "Teaching",
  "Mentoring / Counselling",
  "Content Creation",
  "Paper Marking",
  "Language Skills",
  "Technical Skills (IT / AI / Coding)",
  "Other"
]

export const SUPPORT_TYPES = [
  "Academic Teaching",
  "Non-teaching Support",
  "Community Support",
  "Resource/Material Support",
  "Administrative Support"
]

export const GRADE_LEVELS = [
  "Grade 6–9",
  "O/L",
  "A/L",
  "University / Professional"
]

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

export const TIME_SLOTS = [
  "Morning (8am – 12pm)",
  "Afternoon (12pm – 4pm)",
  "Evening (4pm – 8pm)",
  "Night (after 8pm)"
]

export const TEACHING_MODES = [
  "Online",
  "Physical",
  "Both",
  "Not Applicable"
]

export const SUPPORT_METHOD_CATEGORIES = {
  "Teaching Support": [
    "Conduct Classes"
  ],
  "Community & Group Support": [
    "Answer student questions in community groups",
    "Group moderator / community manager",
    "Motivation & student guidance",
    "Admin support (attendance, scheduling, coordination)"
  ],
  "Academic Assistance": [
    "Paper marking",
    "Reviewing student answers",
    "Explaining corrections",
    "Creating notes / slides / summaries / videos"
  ],
  "Resource Support": [
    "Providing digital materials",
    "Providing physical materials",
    "Tools, devices, internet, sponsorship support"
  ]
}

export interface ManagerGroup {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface ManagerGroupMember {
  group_id: string
  manager_id: string
  added_at: string
}
