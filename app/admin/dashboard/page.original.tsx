"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Users,
  DollarSign,
  FileText,
  Calendar,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Activity,
  BookOpen,
  MessageSquare,
  Settings,
  Menu,
  X,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const [adminEmail, setAdminEmail] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddForm, setShowAddForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verify server session
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (!data?.user || data.user.role !== 'admin') {
          router.push('/admin/login')
          return
        }
        setAdminEmail(data.user.email)
      } catch (e) {
        router.push('/admin/login')
      }
    })()
  }, [router])

  // Announcements state and form fields
  const [announcementsState, setAnnouncementsState] = useState<any[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newCategory, setNewCategory] = useState("Important")

  useEffect(() => {
    // fetch announcements when announcements tab is active
    if (activeTab !== 'announcements') return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/announcements')
        const data = await res.json()
        if (!mounted) return
        setAnnouncementsState(data?.announcements || [])
      } catch (e) {
        console.error('Failed to load announcements', e)
      }
    })()
    return () => { mounted = false }
  }, [activeTab])

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => router.push('/admin/login'))
  }

  // Admin Stats
  const stats = [
    { label: "Total Donations", value: "$45,230", change: "+12.5%", icon: DollarSign, color: "green" },
    { label: "Active Volunteers", value: "128", change: "+8 this month", icon: Users, color: "blue" },
    { label: "Blog Posts", value: "24", change: "+3 new", icon: FileText, color: "purple" },
    { label: "Upcoming Events", value: "12", change: "6 this week", icon: Calendar, color: "orange" },
  ]

  // Recent Activities
  const activities = [
    { id: 1, type: "donation", user: "John Doe", amount: "$500", time: "2 hours ago", status: "completed" },
    { id: 2, type: "volunteer", user: "Sarah Smith", role: "Youth Program", time: "4 hours ago", status: "pending" },
    {
      id: 3,
      type: "suggestion",
      user: "Mike Johnson",
      text: "More youth activities",
      time: "1 day ago",
      status: "read",
    },
    { id: 4, type: "event", title: "Bible Study Group", participants: 45, time: "2 days ago", status: "live" },
  ]

  // Management Items
  const announcements = [
    { id: 1, title: "Sunday Service Time Change", date: "2024-01-15", status: "active" },
    { id: 2, title: "Upcoming Youth Camp", date: "2024-01-16", status: "active" },
  ]

  const sermons = [
    { id: 1, title: "Faith in Uncertain Times", speaker: "Pastor David", date: "2024-01-14", views: 342 },
    { id: 2, title: "Love Thy Neighbor", speaker: "Pastor Mary", date: "2024-01-07", views: 218 },
  ]

  const blogs = [
    { id: 1, title: "The Power of Prayer", author: "John Smith", date: "2024-01-10", published: true },
    { id: 2, title: "Building Community", author: "Sarah Jones", date: "2024-01-12", published: true },
  ]

  const events = [
    { id: 1, title: "Sunday Worship Service", date: "2024-01-21", attendees: 250, status: "scheduled" },
    { id: 2, title: "Bible Study Group", date: "2024-01-18", attendees: 45, status: "scheduled" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{adminEmail}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-70px)]">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-0"} bg-gray-900 text-white overflow-y-auto transition-all duration-300 hidden lg:block`}
        >
          <nav className="p-6 space-y-2">
            {[
              { label: "Overview", icon: BarChart3, id: "overview" },
              { label: "Announcements", icon: MessageSquare, id: "announcements" },
              { label: "Sermons", icon: BookOpen, id: "sermons" },
              { label: "Blog Posts", icon: FileText, id: "blog" },
              { label: "Events", icon: Calendar, id: "events" },
              { label: "Donations", icon: DollarSign, id: "donations" },
              { label: "Volunteers", icon: Users, id: "volunteers" },
              { label: "Trivia Management", icon: BarChart3, id: "trivia" },
              { label: "Suggestions", icon: MessageSquare, id: "suggestions" },
              { label: "Settings", icon: Settings, id: "settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* ...rest of original content omitted for brevity in backup... */}
          <div className="p-6">
            <h2>Original dashboard backup</h2>
            <p>Full content saved elsewhere.</p>
          </div>
        </main>
      </div>
    </div>
  )
}
