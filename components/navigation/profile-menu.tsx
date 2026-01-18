"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { User, Settings, Moon, Sun, LogOut } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { useTheme } from "@/contexts/theme-context"

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useUser()
  const { theme, updateTheme } = useTheme()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen])

  if (!user) return null

  const initials = user.profileImage 
    ? null 
    : user.name 
      ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      : user.email.split('@')[0].slice(0, 2).toUpperCase()

  return (
    <div ref={menuRef} className="relative">
      {/* Profile Icon Button - appears on hover */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[color-mix(in_srgb,var(--primary)_80%,black_20%)] text-[var(--primary-foreground)] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 overflow-hidden"
        title={user.name || user.email}
      >
        {user.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <span className="text-sm font-bold">{initials}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-xl z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10">
            <p className="font-semibold text-[var(--foreground)]">{user.name || "User"}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Edit Profile */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>

            {/* Settings */}
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                updateTheme({ darkMode: !theme.darkMode })
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors text-left"
            >
              {theme.darkMode ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Admin Dashboard - only show if user is admin */}
            {user.role === 'admin' && (
              <>
                <div className="my-1 border-t border-[var(--border)]"></div>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--muted)] transition-colors font-medium"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </>
            )}

            {/* Logout */}
            <div className="my-1 border-t border-[var(--border)]"></div>
            <button
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
