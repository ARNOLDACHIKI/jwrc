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
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-blue-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="[perspective:1200px]">
              <div className="relative h-11 w-11 rounded-full overflow-hidden shadow-lg shadow-blue-500/30 ring-1 ring-blue-200/60 dark:ring-blue-800/60 transform-gpu transition-transform duration-700 ease-out hover:[transform:rotateY(360deg)]">
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
              <span className="font-bold text-blue-900 dark:text-blue-400">JESUS WORSHIP</span>
              <span className="text-xs text-blue-600 dark:text-blue-300">AND RESTORATION</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
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
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    {user.name ? user.name.split(' ').map(n=>n[0]).slice(0,2).join('') : user.email.split('@')[0].slice(0,2)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name || user.email}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200">
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
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
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
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
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile auth actions */}
            {!user ? (
              <>
                <Link href="/login" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  Login
                </Link>
                <Link href="/signup" className="block px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md mt-2">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    logout()
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            )}

            <Link
              href="/admin/login"
              className="block px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50"
            >
              Admin Portal
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
