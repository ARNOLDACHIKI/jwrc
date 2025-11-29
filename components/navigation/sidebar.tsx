"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Home, Book, Users, DollarSign, Settings, MessageSquare, Calendar } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

const sidebarItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: Book },
  { label: "Announcements", href: "/announcements", icon: MessageSquare },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Volunteer", href: "/volunteer", icon: Users },
  { label: "Donate", href: "/donate", icon: DollarSign },
  { label: "Suggestions", href: "/suggestions", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { theme } = useTheme()

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"} bg-white dark:bg-slate-900 border-r border-blue-200 dark:border-blue-900 h-screen transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-200 dark:border-blue-900 flex items-center justify-between">
        {!collapsed && <span className="font-bold text-blue-900 dark:text-blue-400">Menu</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition"
        >
          <ChevronRight
            className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition ${collapsed ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-1"
              title={collapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-200 dark:border-blue-900 text-xs text-gray-500 dark:text-gray-400 text-center">
        {!collapsed && <p>Grace Community Church © 2025</p>}
      </div>
    </div>
  )
}
