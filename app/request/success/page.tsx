"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/translations"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const referenceCode = searchParams.get("ref") || "Unknown"
  const { language } = useLanguage()

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
            <CardTitle className="text-2xl">{t("success.thankYou", language)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{t("success.received", language)}</p>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground mb-1">{t("success.referenceId", language)}</p>
              <p className="text-2xl font-mono font-bold text-foreground">{referenceCode}</p>
            </div>

            <div className="rounded-lg border border-border p-4 text-left">
              <h3 className="font-semibold text-foreground mb-2">{t("success.whatNext", language)}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>1. {t("success.step1", language)}</li>
                <li>2. {t("success.step2", language)}</li>
                <li>3. {t("success.step3", language)}</li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">{t("success.saveReference", language)}</p>

            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 text-left">
              <h3 className="font-semibold text-foreground mb-2">{t("success.verifyTitle", language)}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("success.verifyDescription", language)}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href={`/request/verify?ref=${referenceCode}`}>{t("success.verifyNow", language)}</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href="/">{t("success.skipVerify", language)}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
