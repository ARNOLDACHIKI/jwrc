'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  LogOut, 
  LayoutDashboard, 
  Bell, 
  Calendar, 
  FileText, 
  BookOpen,
  QrCode,
  Menu,
  X,
  Ticket
} from 'lucide-react'

interface AdminNavProps {
  onLogout?: () => void
  children?: React.ReactNode
}

export function AdminNav({ onLogout, children }: AdminNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    if (onLogout) {
      onLogout()
    } else {
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
        router.push('/admin/login')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/reminders', label: 'Reminders', icon: Bell },
    { href: '/admin/weekly-word', label: 'Weekly Word', icon: BookOpen },
    { href: '/admin/tickets', label: 'Tickets', icon: Ticket },
    { href: '/admin/scan-ticket', label: 'Scan Tickets', icon: QrCode },
    { href: '/admin/poster', label: 'Poster', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow sticky top-0 z-40">
        <div className="px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex-shrink-0"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent text-xs sm:text-sm"
            >
              <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex h-[calc(100vh-70px)] overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-gray-900 text-white overflow-y-auto flex-shrink-0">
          <nav className="p-4 sm:p-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50 top-[70px]" 
            onClick={() => setSidebarOpen(false)}
            role="presentation"
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`lg:hidden fixed top-[70px] left-0 h-[calc(100vh-70px)] w-64 bg-gray-900 text-white overflow-y-auto z-50 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
