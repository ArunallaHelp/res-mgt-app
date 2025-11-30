"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  DISTRICTS, 
  CURRENT_ROLES,
  EXPERIENCE_YEARS,
  QUALIFICATIONS,
  PROFESSIONAL_SKILLS,
  SUPPORT_TYPES,
  GRADE_LEVELS,
  DAYS_OF_WEEK,
  TIME_SLOTS,
  TEACHING_MODES,
  SUPPORT_METHOD_CATEGORIES
} from "@/lib/types"
import { submitManagerApplication } from "@/app/actions/submit-manager"
import { Loader2 } from "lucide-react"

export function ManagerRegistrationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // State for conditional "Other" fields
  const [jobRole, setJobRole] = useState<string>("")
  const [highestQualification, setHighestQualification] = useState<string>("")
  
  // Multi-select states
  const [professionalSkills, setProfessionalSkills] = useState<string[]>([])
  const [supportTypes, setSupportTypes] = useState<string[]>([])
  const [gradeLevels, setGradeLevels] = useState<string[]>([])
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [supportMethods, setSupportMethods] = useState<string[]>([])

  const handleMultiSelect = (
    value: string, 
    current: string[], 
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (current.includes(value)) {
      setter(current.filter(item => item !== value))
    } else {
      setter([...current, value])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set("professional_skills", JSON.stringify(professionalSkills))
    formData.set("support_types", JSON.stringify(supportTypes))
    formData.set("grade_levels", JSON.stringify(gradeLevels))
    formData.set("available_days", JSON.stringify(availableDays))
    formData.set("available_time_slots", JSON.stringify(availableTimeSlots))
    formData.set("support_methods", JSON.stringify(supportMethods))

    try {
      const result = await submitManagerApplication(formData)
      if (result.success) {
        setSuccess(true)
        window.scrollTo(0, 0)
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto mt-8 border-green-500/50 bg-green-50 dark:bg-green-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">Application Submitted!</h2>
          <p className="text-green-600 dark:text-green-400">
            Thank you for volunteering to support our students. We will review your application and contact you soon.
          </p>
          <Button onClick={() => router.push("/")} variant="outline" className="mt-4">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold">Volunteer Manager Registration</h1>
        <p className="text-muted-foreground">Join us in supporting students affected by the floods</p>
      </div>

      {/* 1. Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>1. Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input id="full_name" name="full_name" required placeholder="Enter your full name" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" required placeholder="your@email.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Mobile / WhatsApp Number *</Label>
              <Input id="phone" name="phone" required placeholder="07X XXX XXXX" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="district">District *</Label>
              <Select name="district" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nearest_town">Nearest Town *</Label>
              <Input id="nearest_town" name="nearest_town" required placeholder="Enter nearest town" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>2. Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="job_role">Current Role *</Label>
              <Select name="job_role" required onValueChange={setJobRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENT_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {jobRole === "Other" && (
                <Input name="other_role" placeholder="Specify your role" className="mt-2" required />
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experience_years">Years of Experience *</Label>
              <Select name="experience_years" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="highest_qualification">Highest Qualification *</Label>
            <Select name="highest_qualification" required onValueChange={setHighestQualification}>
              <SelectTrigger>
                <SelectValue placeholder="Select qualification" />
              </SelectTrigger>
              <SelectContent>
                {QUALIFICATIONS.map((q) => (
                  <SelectItem key={q} value={q}>{q}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {highestQualification === "Other" && (
              <Input name="other_qualification" placeholder="Specify qualification" className="mt-2" required />
            )}
          </div>

          <div className="space-y-3">
            <Label>Professional Skills (Select all that apply) *</Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {PROFESSIONAL_SKILLS.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`skill-${skill}`}
                    checked={professionalSkills.includes(skill)}
                    onCheckedChange={() => handleMultiSelect(skill, professionalSkills, setProfessionalSkills)}
                  />
                  <Label htmlFor={`skill-${skill}`} className="font-normal">{skill}</Label>
                </div>
              ))}
            </div>
            {professionalSkills.includes("Other") && (
              <Input name="other_skill" placeholder="Specify other skills" className="mt-2" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Support Type */}
      <Card>
        <CardHeader>
          <CardTitle>3. Support Type</CardTitle>
          <CardDescription>What kind of help can you offer?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-2">
            {SUPPORT_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type}`}
                  checked={supportTypes.includes(type)}
                  onCheckedChange={() => handleMultiSelect(type, supportTypes, setSupportTypes)}
                />
                <Label htmlFor={`type-${type}`} className="font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Subjects & Levels */}
      <Card>
        <CardHeader>
          <CardTitle>4. Subjects & Levels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Grade Levels *</Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {GRADE_LEVELS.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`level-${level}`}
                    checked={gradeLevels.includes(level)}
                    onCheckedChange={() => handleMultiSelect(level, gradeLevels, setGradeLevels)}
                  />
                  <Label htmlFor={`level-${level}`} className="font-normal">{level}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects *</Label>
            <Input id="subjects" name="subjects" required placeholder="e.g. Maths, Science, English, Commerce, ICT (Separate by commas)" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="other_subject">Other Subject (Optional)</Label>
            <Input id="other_subject" name="other_subject" placeholder="Any other subjects..." />
          </div>
        </CardContent>
      </Card>

      {/* 5. Availability */}
      <Card>
        <CardHeader>
          <CardTitle>5. Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Preferred Days *</Label>
            <div className="flex flex-wrap gap-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day}`}
                    checked={availableDays.includes(day)}
                    onCheckedChange={() => handleMultiSelect(day, availableDays, setAvailableDays)}
                  />
                  <Label htmlFor={`day-${day}`} className="font-normal">{day}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Preferred Time Slots *</Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {TIME_SLOTS.map((slot) => (
                <div key={slot} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`slot-${slot}`}
                    checked={availableTimeSlots.includes(slot)}
                    onCheckedChange={() => handleMultiSelect(slot, availableTimeSlots, setAvailableTimeSlots)}
                  />
                  <Label htmlFor={`slot-${slot}`} className="font-normal">{slot}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Teaching Mode */}
      <Card>
        <CardHeader>
          <CardTitle>6. Teaching Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup name="teaching_mode" required className="flex flex-col space-y-1">
            {TEACHING_MODES.map((mode) => (
              <div key={mode} className="flex items-center space-x-2">
                <RadioGroupItem value={mode} id={`mode-${mode}`} />
                <Label htmlFor={`mode-${mode}`} className="font-normal">{mode}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* 7. Support Method */}
      <Card>
        <CardHeader>
          <CardTitle>7. Support Method</CardTitle>
          <CardDescription>Select all specific ways you can contribute</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(SUPPORT_METHOD_CATEGORIES).map(([category, methods]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">{category}</h3>
              <div className="grid sm:grid-cols-2 gap-2 pl-2 border-l-2 border-muted">
                {methods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`method-${method}`}
                      checked={supportMethods.includes(method)}
                      onCheckedChange={() => handleMultiSelect(method, supportMethods, setSupportMethods)}
                    />
                    <Label htmlFor={`method-${method}`} className="font-normal">{method}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 8. Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>8. Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="volunteering_experience">Past volunteering experience (Optional)</Label>
            <Textarea id="volunteering_experience" name="volunteering_experience" placeholder="Describe any past experience..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferences_limitations">Any preferences or limitations</Label>
            <Textarea id="preferences_limitations" name="preferences_limitations" placeholder="e.g. Can only teach in Sinhala medium..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments / Special Notes</Label>
            <Textarea id="comments" name="comments" placeholder="Any other details..." />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  )
}
