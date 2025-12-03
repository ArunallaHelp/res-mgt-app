import type React from "next"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { GoogleAnalytics } from "@/components/google-analytics"
import { LanguageProvider } from "@/components/language-provider"
import ReduxProvider from "@/components/providers/redux-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Arunalla - Flood Relief Education Support",
  description:
    "Education support for students affected by the 2025 Sri Lanka floods. Request help with books, tuition, mentoring, and exam preparation.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ReduxProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ReduxProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
