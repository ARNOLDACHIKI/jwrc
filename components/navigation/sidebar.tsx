"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Home, Book, Users, DollarSign, Settings, MessageSquare, Calendar, LayoutDashboard, Image } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useUser } from "@/contexts/user-context"

const sidebarItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "About", href: "/about", icon: Book },
  { label: "Announcements", href: "/announcements", icon: MessageSquare },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Volunteer", href: "/volunteer", icon: Users },
  { label: "Suggestions", href: "/suggestions", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme } = useTheme()
  const { user } = useUser()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const email = user?.email
        if (!email) { setUnreadCount(0); return }
        const [sRes, vRes] = await Promise.all([
          fetch(`/api/suggestions?email=${encodeURIComponent(email)}`),
          fetch(`/api/volunteers?email=${encodeURIComponent(email)}`),
        ])
        const [sData, vData] = await Promise.all([sRes.json().catch(()=>({})), vRes.json().catch(()=>({}))])
        const suggestions = sData?.suggestions || []
        const volunteers = vData?.applications || []
        const all = [
          ...suggestions.map((s:any) => ({ when: s.respondedAt || s.createdAt })),
          ...volunteers.map((v:any) => ({ when: v.respondedAt || v.createdAt })),
        ].filter((x:any) => x.when)
        const lastSeen = (() => { try { return localStorage.getItem('inboxLastSeenAt') } catch(e){return null} })()
        const lastSeenDate = lastSeen ? new Date(lastSeen) : null
        const newItems = lastSeenDate ? all.filter((a:any)=> new Date(a.when) > lastSeenDate) : all
        if (mounted) setUnreadCount(newItems.length)
      } catch (e) { console.error('Failed to load sidebar inbox summary', e) }
    }
    load()
    const iv = setInterval(load, 10000)
    return () => { mounted = false; clearInterval(iv) }
  }, [user])

  // Handle mobile menu toggle
  useEffect(() => {
    const handleToggle = () => setMobileOpen(prev => !prev)
    window.addEventListener('toggle-mobile-sidebar', handleToggle)
    return () => window.removeEventListener('toggle-mobile-sidebar', handleToggle)
  }, [])

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-white dark:bg-slate-900 border-r border-blue-200 dark:border-blue-900 h-screen transition-all duration-300 flex flex-col
        fixed lg:sticky top-0 z-50 lg:z-auto
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
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
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition mb-1"
              title={collapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {!collapsed && item.href === '/suggestions' && unreadCount > 0 && (
                <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white">{unreadCount}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-200 dark:border-blue-900 text-xs text-gray-500 dark:text-gray-400 text-center">
        {!collapsed && <p>Jesus Worship and Restoration Church © 2025</p>}
      </div>
    </div>
    </>
  )
}
