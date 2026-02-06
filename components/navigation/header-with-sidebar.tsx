"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ProfileMenu } from "./profile-menu"
import { ModeToggle } from "./mode-toggle"
import { Menu } from "lucide-react"

export function HeaderWithSidebar() {
  const [logoSrc, setLogoSrc] = useState("/jwrc-logo.svg")

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/85 dark:bg-[var(--background)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu button for mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const event = new CustomEvent('toggle-mobile-sidebar')
                window.dispatchEvent(event)
              }}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center - Logo and Church Name */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
            <div className="[perspective:1200px]">
              <div className="relative h-11 w-11 rounded-full overflow-hidden shadow-lg shadow-[rgba(0,71,171,0.35)] ring-1 ring-[var(--border)] transform-gpu logo-spin hover:[transform:rotateY(360deg)]">
                <Image
                  src={logoSrc}
                  alt="Jesus Worship and Restoration Church logo"
                  fill
                  sizes="44px"
                  className="object-cover"
                  priority
                  onError={() => setLogoSrc("/jwrc-logo.svg")}
                />
              </div>
            </div>
            <span className="hidden sm:inline font-bold text-[var(--primary)] whitespace-nowrap text-xs">
              JESUS WORSHIP AND RESTORATION CHURCH
            </span>
          </Link>

          {/* Right side - Profile Menu */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
