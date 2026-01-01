import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { AdminProvider } from "@/contexts/admin-context"
import { Toaster } from '@/components/ui/toaster'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jesus Worship and Restoration Church - Welcome",
  description: "Jesus Worship and Restoration Church - Your spiritual home for worship, growth, and service",
  generator: "v0.app",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased relative`}>
        <div className="site-watermark" />
        <UserProvider>
          <AdminProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AdminProvider>
          <Toaster />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
