"use client"

import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/translations"
import { RequestForm } from "@/components/request-form"

export default function RequestPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("form.pageTitle", language)}</h1>
            <p className="text-sm text-muted-foreground">{t("form.pageSubtitle", language)}</p>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <RequestForm />
      </main>
    </div>
  )
}
