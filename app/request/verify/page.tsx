"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/translations"
import { createClient } from "@/lib/supabase/client"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const referenceCode = searchParams.get("ref") || ""
  const { language } = useLanguage()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(t("verify.loginError", language))
      setLoading(false)
      return
    }

    // Redirect to verification details page
    router.push(`/request/verify/details?ref=${referenceCode}`)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError(t("verify.passwordMismatch", language))
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError(t("verify.passwordTooShort", language))
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/request/verify/details?ref=${referenceCode}`,
      },
    })

    if (error) {
      setError(t("verify.signupError", language))
      setLoading(false)
      return
    }

    setSuccess(t("verify.checkEmail", language))
    setLoading(false)
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
      <main className="mx-auto max-w-md px-4 py-8">
        {/* Reference Code Display */}
        {referenceCode && (
          <div className="mb-6 rounded-lg bg-muted p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t("success.referenceId", language)}</p>
            <p className="font-mono font-bold text-foreground">{referenceCode}</p>
          </div>
        )}

        <Card>
          <CardHeader className="text-center">
            <CardTitle>{t("verify.title", language)}</CardTitle>
            <CardDescription>{t("verify.description", language)}</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-muted-foreground">{success}</p>
                <Button variant="outline" asChild>
                  <Link href="/">{t("success.returnHome", language)}</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Toggle between Login and Sign Up */}
                <div className="flex mb-6 rounded-lg bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      isLogin
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("verify.login", language)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      !isLogin
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("verify.signup", language)}
                  </button>
                </div>

                <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("form.email", language).replace(" (optional)", "")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("verify.emailPlaceholder", language)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t("verify.password", language)}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("verify.passwordPlaceholder", language)}
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("verify.confirmPassword", language)}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("verify.confirmPasswordPlaceholder", language)}
                        required
                      />
                    </div>
                  )}

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                      ? t("verify.processing", language)
                      : isLogin
                        ? t("verify.loginButton", language)
                        : t("verify.signupButton", language)}
                  </Button>
                </form>

                {/* Skip option */}
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-3">{t("verify.skipText", language)}</p>
                  <Button variant="ghost" asChild>
                    <Link href="/">{t("verify.skipButton", language)}</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
