"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DISTRICTS, GRADES } from "@/lib/types"
import { submitRequest } from "@/app/actions/submit-request"
import { useLanguage } from "@/components/language-provider"
import { t, translations } from "@/lib/translations"

const FLOOD_IMPACT_IDS = [
  "lost_materials",
  "tuition_disrupted",
  "house_damage",
  "financial_difficulty",
  "device_issues",
] as const
const SUPPORT_IDS = [
  "past_papers",
  "online_classes",
  "mentoring",
  "exam_guidance",
  "stationery",
  "device_support",
] as const

export function RequestForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supportNeeded, setSupportNeeded] = useState<string[]>([])
  const [floodImpact, setFloodImpact] = useState<string[]>([])

  const handleSupportChange = (id: string, checked: boolean) => {
    setSupportNeeded((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)))
  }

  const handleImpactChange = (id: string, checked: boolean) => {
    setFloodImpact((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set("support_needed", JSON.stringify(supportNeeded))
    formData.set("flood_impact_types", JSON.stringify(floodImpact))

    try {
      const result = await submitRequest(formData)
      if (result.success && result.referenceCode) {
        router.push(`/request/success?ref=${result.referenceCode}`)
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("form.studentInfo", language)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("form.fullName", language)} *</Label>
            <Input id="name" name="name" required placeholder={t("form.fullNamePlaceholder", language)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="age">{t("form.age", language)} *</Label>
              <Select name="age" required>
                <SelectTrigger id="age">
                  <SelectValue placeholder={t("form.agePlaceholder", language)} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 35 }, (_, i) => i + 5).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="district">{t("form.district", language)} *</Label>
              <Select name="district" required>
                <SelectTrigger id="district">
                  <SelectValue placeholder={t("form.selectDistrict", language)} />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("form.phone", language)} *</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="07X XXX XXXX" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t("form.email", language)}</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("form.educationInfo", language)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="grade">{t("form.grade", language)} *</Label>
              <Select name="grade" required>
                <SelectTrigger id="grade">
                  <SelectValue placeholder={t("form.selectGrade", language)} />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exam_year">{t("form.examYear", language)} *</Label>
              <Input id="exam_year" name="exam_year" required placeholder={t("form.examYearPlaceholder", language)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subjects">{t("form.subjects", language)} *</Label>
            <Input id="subjects" name="subjects" required placeholder={t("form.subjectsPlaceholder", language)} />
          </div>
        </CardContent>
      </Card>

      {/* Flood Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("form.floodImpact", language)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>{t("form.typeOfLoss", language)} *</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {FLOOD_IMPACT_IDS.map((id) => (
                <div key={id} className="flex items-center gap-2">
                  <Checkbox
                    id={`impact-${id}`}
                    checked={floodImpact.includes(id)}
                    onCheckedChange={(checked) => handleImpactChange(id, checked as boolean)}
                  />
                  <Label htmlFor={`impact-${id}`} className="text-sm font-normal cursor-pointer">
                    {translations.impactOptions[id][language]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="flood_impact_details">{t("form.howAffected", language)}</Label>
            <Textarea
              id="flood_impact_details"
              name="flood_impact_details"
              rows={4}
              placeholder={t("form.howAffectedPlaceholder", language)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Support Needed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("form.supportNeeded", language)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>{t("form.whatSupport", language)} *</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {SUPPORT_IDS.map((id) => (
                <div key={id} className="flex items-center gap-2">
                  <Checkbox
                    id={`support-${id}`}
                    checked={supportNeeded.includes(id)}
                    onCheckedChange={(checked) => handleSupportChange(id, checked as boolean)}
                  />
                  <Label htmlFor={`support-${id}`} className="text-sm font-normal cursor-pointer">
                    {translations.supportOptions[id][language]}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Situations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("form.otherSituations", language)}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="other_situations"
            rows={4}
            placeholder={t("form.otherSituationsPlaceholder", language)}
          />
        </CardContent>
      </Card>

      {/* Verification Notice */}
      <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="p-4">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>{t("form.verificationNotice", language)}</strong> {t("form.verificationText", language)}
          </p>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("form.submitting", language) : t("form.submitRequest", language)}
      </Button>
    </form>
  )
}
