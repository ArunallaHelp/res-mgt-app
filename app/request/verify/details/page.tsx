"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/translations"
import { createClient } from "@/lib/supabase/client"

export default function VerifyDetailsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const referenceCode = searchParams.get("ref") || ""
  const { language } = useLanguage()

  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Verification details
  const [nicNumber, setNicNumber] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [parentName, setParentName] = useState("")
  const [parentPhone, setParentPhone] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")

  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/request/verify?ref=${referenceCode}`)
        return
      }
      setUser({ email: user.email || "" })
      setLoading(false)
    }
    checkUser()
  }, [referenceCode, router, supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    // Update the request with verification details
    const { error: updateError } = await supabase
      .from("requests")
      .update({
        verification_status: "pending",
        admin_notes: `Verification submitted:\nNIC: ${nicNumber}\nSchool: ${schoolName}\nParent: ${parentName} (${parentPhone})\nAdditional: ${additionalInfo}`,
      })
      .eq("reference_code", referenceCode)

    if (updateError) {
      setError(t("verify.submitError", language))
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("header.title", language)}</h1>
            <p className="text-sm text-muted-foreground">{t("header.subtitle", language)}</p>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Reference Code Display */}
        {referenceCode && (
          <div className="mb-6 rounded-lg bg-muted p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t("success.referenceId", language)}</p>
            <p className="font-mono font-bold text-foreground">{referenceCode}</p>
          </div>
        )}

        {success ? (
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle>{t("verify.successTitle", language)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{t("verify.successMessage", language)}</p>
              <Button asChild>
                <Link href="/">{t("success.returnHome", language)}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("verify.detailsTitle", language)}</CardTitle>
              <CardDescription>
                {t("verify.detailsDescription", language)}
                {user && (
                  <span className="block mt-1 text-foreground">
                    {t("verify.loggedInAs", language)}: {user.email}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* NIC Number */}
                <div className="space-y-2">
                  <Label htmlFor="nicNumber">{t("verify.nicNumber", language)}</Label>
                  <Input
                    id="nicNumber"
                    value={nicNumber}
                    onChange={(e) => setNicNumber(e.target.value)}
                    placeholder={t("verify.nicPlaceholder", language)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{t("verify.nicHelp", language)}</p>
                </div>

                {/* School Name */}
                <div className="space-y-2">
                  <Label htmlFor="schoolName">{t("verify.schoolName", language)}</Label>
                  <Input
                    id="schoolName"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder={t("verify.schoolPlaceholder", language)}
                    required
                  />
                </div>

                {/* Parent/Guardian Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">{t("verify.parentName", language)}</Label>
                    <Input
                      id="parentName"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder={t("verify.parentNamePlaceholder", language)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">{t("verify.parentPhone", language)}</Label>
                    <Input
                      id="parentPhone"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder={t("verify.parentPhonePlaceholder", language)}
                      required
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">{t("verify.additionalInfo", language)}</Label>
                  <Textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder={t("verify.additionalPlaceholder", language)}
                    rows={3}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? t("verify.submitting", language) : t("verify.submitVerification", language)}
                  </Button>
                  <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                    <Link href="/">{t("verify.skipButton", language)}</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
