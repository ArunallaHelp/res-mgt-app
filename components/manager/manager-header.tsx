"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"

interface ManagerHeaderProps {
  userEmail: string
}

export function ManagerHeader({ userEmail }: ManagerHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isSettingsPage = pathname === "/manager/settings"

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Manager Dashboard</h1>
          <p className="text-sm text-muted-foreground">Arunalla</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{userEmail}</span>
          {isSettingsPage ? (
            <Button variant="outline" size="sm" onClick={() => router.push("/manager/dashboard")}>
              Back to Dashboard
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => router.push("/manager/settings")}>
              Settings
            </Button>
          )}
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
