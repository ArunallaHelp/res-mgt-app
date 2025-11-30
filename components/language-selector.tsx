"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import type { Language } from "@/lib/translations"

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "si", label: "සිං" },
  { code: "ta", label: "த" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-1">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className="px-2 py-1 text-xs h-7"
        >
          {lang.label}
        </Button>
      ))}
    </div>
  )
}
