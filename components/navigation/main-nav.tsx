"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, LogOut, User, Settings } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useUser()
  const [unread, setUnread] = useState(0)
  const [logoSrc, setLogoSrc] = useState("/jwrc-logo.png")

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/user/inbox', { credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        if (!mounted) return
        setUnread(data?.unreadCount || 0)
      } catch (e) { /* ignore */ }
    }
    load()
    const iv = setInterval(load, 10000)
    return () => { mounted = false; clearInterval(iv) }
  }, [user])

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Announcements", href: "/announcements" },
    { label: "Events", href: "/events" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Suggestions", href: "/suggestions" },
    { label: "Give", href: "/give" },
  ]

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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-md transition"
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  {item.href === '/suggestions' && unread > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-red-600 text-white rounded-full">{unread}</span>
                  )}
                </span>
              </Link>
            ))}
            {/* Auth area for desktop */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center text-sm font-semibold overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name.split(' ').map(n=>n[0]).slice(0,2).join('') : user.email.split('@')[0].slice(0,2)
                    )}
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">{user.name || user.email}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-md shadow-lg z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)]">
                      Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--muted)] font-medium">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--secondary)] hover:bg-[var(--muted)]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {!user ? (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-[var(--secondary)] hover:bg-[color-mix(in_srgb,var(--secondary)_90%,black_10%)] text-[var(--secondary-foreground)]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <></>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile auth actions */}
            {!user ? (
              <>
                <Link href="/login" className="block px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md">
                  Login
                </Link>
                <Link href="/signup" className="block px-3 py-2 text-sm font-medium text-[var(--secondary-foreground)] bg-[var(--secondary)] rounded-md mt-2">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="block px-3 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--muted)] rounded-md">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false)
                    logout()
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-[var(--secondary)] hover:bg-[var(--muted)] rounded-md"
                >
                  Logout
                </button>
              </>
            )}

            <Link
              href="/admin/login"
              className="block px-3 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--muted)]"
            >
              Admin Portal
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
