"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, LogOut, User, Settings } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useUser()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Bible Reading", href: "/bible-reading" },
    { label: "Sermons", href: "/sermons" },
    { label: "Announcements", href: "/announcements" },
    { label: "Blog", href: "/blog" },
    { label: "Events", href: "/events" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Donate", href: "/donate" },
    { label: "Trivia", href: "/trivia" },
    { label: "Suggestions", href: "/suggestions" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-blue-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">GC</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-blue-900 dark:text-blue-400">Grace</span>
              <span className="text-xs text-blue-600 dark:text-blue-300">Community</span>
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
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/admin/login" className="hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200 text-purple-600 hover:text-purple-700 bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                </Link>
                <Link href="/dashboard" className="hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:text-blue-700 bg-transparent"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:text-red-700 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
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
