"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ProfileMenu } from "./profile-menu"

export function HeaderWithSidebar() {
  const [logoSrc, setLogoSrc] = useState("/jwrc-logo.png")

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-gradient-to-r from-[#f5ebe0] via-[#efe3d6] to-[#e4d5c5] backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-[#f5ebe0] supports-[backdrop-filter]:via-[#efe3d6] supports-[backdrop-filter]:to-[#e4d5c5] shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="[perspective:1200px]">
              <div className="relative h-11 w-11 rounded-full overflow-hidden shadow-lg shadow-[rgba(0,71,171,0.35)] ring-1 ring-[var(--border)] transform-gpu logo-spin hover:[transform:rotateY(360deg)]">
                <Image
                  src={logoSrc}
                  alt="Jesus Worship and Restoration Centre logo"
                  fill
                  sizes="44px"
                  className="object-cover"
                  priority
                  onError={() => setLogoSrc("/jwrc-logo.svg")}
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-[var(--primary)]">JESUS WORSHIP</span>
              <span className="text-xs text-[var(--accent)]">AND RESTORATION</span>
            </div>
          </Link>

          {/* Profile Menu - Only visible when user is logged in */}
          <div className="flex items-center gap-2">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
