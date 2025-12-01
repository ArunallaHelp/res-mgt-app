"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { t, translations } from "@/lib/translations"

export default function HomePage() {
  const { language } = useLanguage()

  const supportTypes = [
    translations.supportTypes.pastPapers,
    translations.supportTypes.onlineClasses,
    translations.supportTypes.mentoring,
    translations.supportTypes.examGuidance,
    translations.supportTypes.stationery,
    translations.supportTypes.deviceSupport,
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("header.title", language)}</h1>
            <p className="text-sm text-muted-foreground">{t("header.subtitle", language)}</p>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <section className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground text-balance">{t("landing.heroTitle", language)}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            {t("landing.heroDescription", language)}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/request">{t("landing.requestButton", language)}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <a href={process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_GROUP_URL} target="_blank" rel="noopener noreferrer">
                {t("landing.giveSupportButton", language)}
              </a>
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t("landing.noLoginRequired", language)}</p>
        </section>

        {/* Important Notice Banner */}
        <Card className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <h3 className="mb-2 font-semibold text-amber-800 dark:text-amber-200">
              {t("landing.importantNotice", language)}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">{t("landing.noticeText", language)}</p>
          </CardContent>
        </Card>

        {/* Community Groups */}
        <section className="mb-8">
          <h3 className="mb-4 text-xl font-semibold text-foreground">{t("community.title", language)}</h3>
          <p className="mb-6 text-muted-foreground">{t("community.description", language)}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <h4 className="font-semibold text-lg mb-2">{t("community.alGroup", language)}</h4>
                <Button asChild className="w-full mt-2" variant="outline">
                  <a href="https://www.pophop.chat/edusupal" target="_blank" rel="noopener noreferrer">
                    {t("community.joinButton", language)}
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <h4 className="font-semibold text-lg mb-2">{t("community.olGroup", language)}</h4>
                <Button asChild className="w-full mt-2" variant="outline">
                  <a href="https://www.pophop.chat/edusupol" target="_blank" rel="noopener noreferrer">
                    {t("community.joinButton", language)}
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/40 shadow-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <h4 className="font-semibold text-lg mb-2">{t("community.supportGroup", language)}</h4>
                <Button asChild className="w-full mt-2" variant="outline">
                  <a href={process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_GROUP_URL} target="_blank" rel="noopener noreferrer">
                    {t("community.joinButton", language)}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-8">
          <h3 className="mb-4 text-xl font-semibold text-foreground">{t("landing.supportAvailable", language)}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {supportTypes.map((item, index) => (
              <Card key={index} className="bg-secondary/10 border-secondary/20">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground">{item.title[language]}</h4>
                  <p className="text-sm text-muted-foreground">{item.description[language]}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-muted-foreground mb-3">{t("landing.readyToSubmit", language)}</p>
          <Button asChild variant="outline" size="lg" className="px-8 bg-transparent">
            <Link href="/request">{t("landing.requestButton", language)}</Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            {t("header.title", language)} - {t("header.subtitle", language)}
          </p>
          <p className="mt-1">{t("landing.footerText", language)}</p>
        </div>
      </footer>
    </div>
  )
}
