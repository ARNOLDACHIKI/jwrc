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
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const [adminEmail, setAdminEmail] = useState("")
  const [adminName, setAdminName] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddForm, setShowAddForm] = useState(false)
  const router = useRouter()

  // Announcements state and form fields
  const [announcementsState, setAnnouncementsState] = useState<any[]>([])
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  
  // Events state and form fields
  const [eventsState, setEventsState] = useState<any[]>([])
  const [signupsByEvent, setSignupsByEvent] = useState<Record<string, any[]>>({})
  const [showingSignupsFor, setShowingSignupsFor] = useState<string | null>(null)
  const [showSignupsModal, setShowSignupsModal] = useState(false)
  const [showAddEventForm, setShowAddEventForm] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDescription, setNewEventDescription] = useState("")
  const [newEventLocation, setNewEventLocation] = useState("")
  const [newEventStartsAt, setNewEventStartsAt] = useState("")
  const [newEventEndsAt, setNewEventEndsAt] = useState("")
  const [newEventErrors, setNewEventErrors] = useState<Record<string, string>>({})
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)

  useEffect(() => {
    // Verify server session
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        const data = await res.json()
        if (!data?.user || data.user.role !== 'admin') {
          router.push('/admin/login')
          return
        }
        setAdminEmail(data.user.email)
        setAdminName(data.user.name || '')
      } catch (e) {
        router.push('/admin/login')
      }
    })()
  }, [router])

  useEffect(() => {
    // fetch announcements when announcements tab is active
    if (activeTab !== 'announcements') return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/announcements', { credentials: 'include' })
        const data = await res.json()
        if (!mounted) return
        setAnnouncementsState(data?.announcements || [])
      } catch (e) {
        console.error('Failed to load announcements', e)
      }
    })()
    return () => { mounted = false }
  }, [activeTab])

  useEffect(() => {
    // fetch events when events tab is active
    if (activeTab !== 'events') return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/events?pageSize=100', { credentials: 'include' })
        const data = await res.json()
        if (!mounted) return
        setEventsState(data?.events || [])
      } catch (e) {
        console.error('Failed to load events', e)
      }
    })()
    return () => { mounted = false }
  }, [activeTab])

  // Volunteers state
  const [volunteerApps, setVolunteerApps] = useState<any[]>([])

  useEffect(() => {
    if (activeTab !== 'volunteers') return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/volunteers', { credentials: 'include' })
        const data = await res.json()
        if (!mounted) return
        setVolunteerApps(data?.applications || [])
      } catch (e) {
        console.error('Failed to load volunteer applications', e)
      }
    })()
    return () => { mounted = false }
  }, [activeTab])

  // Suggestions state
  const [suggestionsState, setSuggestionsState] = useState<any[]>([])
  const [lastSeen, setLastSeen] = useState<string | null>(null)
  const [unseenCount, setUnseenCount] = useState(0)
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null)
  const [replyTargetEmail, setReplyTargetEmail] = useState<string | null>(null)
  const [replyTargetName, setReplyTargetName] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)
  const { toast } = useToast()
  useEffect(() => {
    if (activeTab !== 'suggestions') return
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/suggestions', { credentials: 'include' })
        const data = await res.json()
        if (!mounted) return
        setSuggestionsState(data?.suggestions || [])
      } catch (e) {
        console.error('Failed to load suggestions', e)
      }
    }
    load()
    const iv = setInterval(() => { if (mounted) load() }, 8000)
    return () => { mounted = false; clearInterval(iv) }
  }, [activeTab])

  // load lastSeen from localStorage and compute unseen counts periodically
  useEffect(() => {
    let mounted = true
    try {
      const v = typeof window !== 'undefined' ? localStorage.getItem('adminSuggestionsLastSeen') : null
      if (v) setLastSeen(v)
    } catch (e) {
      // ignore
    }

    async function poll() {
      try {
        const res = await fetch('/api/suggestions', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        const rows: any[] = data?.suggestions || []
        // compute unseen relative to lastSeen
        if (rows.length > 0) {
          const last = lastSeen ? new Date(lastSeen) : null
          const count = last ? rows.filter(r => new Date(r.createdAt) > last).length : rows.length
          setUnseenCount(count)
        } else {
          setUnseenCount(0)
        }
      } catch (e) {
        // ignore
      }
    }

    // initial poll and interval
    poll()
    const iv = setInterval(poll, 10000)
    return () => { mounted = false; clearInterval(iv) }
  }, [lastSeen])

  // when admin opens suggestions tab, mark as seen
  useEffect(() => {
    if (activeTab === 'suggestions') {
      const now = new Date().toISOString()
      try {
        localStorage.setItem('adminSuggestionsLastSeen', now)
      } catch (e) {}
      setLastSeen(now)
      setUnseenCount(0)
    }
  }, [activeTab])

  async function handleDeleteAnnouncement(id: string) {
    if (!confirm('Delete this announcement?')) return
    try {
      const res = await fetch('/api/announcements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        const data = await res.json()
        setAnnouncementsState((prev) => prev.filter((a) => a.id !== id))
      } else {
        const err = await res.json()
        console.error('Failed to delete announcement', err)
        alert('Failed to delete announcement: ' + (err?.error || res.status))
      }
    } catch (err) {
      console.error(err)
      alert('Failed to delete announcement')
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm('Delete this event?')) return
    try {
      const res = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setEventsState((prev) => prev.filter((a) => a.id !== id))
        loadStats() // Reload stats after deleting event
      } else {
        const err = await res.json()
        console.error('Failed to delete event', err)
        alert('Failed to delete event: ' + (err?.error || res.status))
      }
    } catch (err) {
      console.error(err)
      alert('Failed to delete event')
    }
  }

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => router.push('/admin/login'))
  }

  const handleRefreshSession = async () => {
    try {
      const res = await fetch('/api/auth/refresh', { 
        method: 'POST',
        credentials: 'include'
      })
      const data = await res.json()
      if (res.ok) {
        alert('Session refreshed successfully! Your admin permissions are now active.')
        window.location.reload()
      } else {
        alert('Failed to refresh session: ' + (data?.error || 'Unknown error'))
      }
    } catch (err) {
      console.error(err)
      alert('Failed to refresh session')
    }
  }

  // Admin Stats (real data from database)
  const [statsData, setStatsData] = useState({
    volunteerCount: 0,
    eventCount: 0,
  })

  const loadStats = async () => {
    try {
      const [volunteerRes, eventRes] = await Promise.all([
        fetch('/api/volunteers', { credentials: 'include' }),
        fetch('/api/events?pageSize=100', { credentials: 'include' }),
      ])
      const [volunteerData, eventData] = await Promise.all([
        volunteerRes.json().catch(() => ({})),
        eventRes.json().catch(() => ({})),
      ])
      
      const approvedVolunteers = (volunteerData?.applications || []).filter((v: any) => v.status === 'approved').length
      // Get today's start (midnight)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const upcomingEvents = (eventData?.events || []).filter((e: any) => new Date(e.startsAt) >= today).length
      
      setStatsData({
        volunteerCount: approvedVolunteers || 0,
        eventCount: upcomingEvents || 0,
      })
    } catch (err) {
      console.error('Failed to load stats', err)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const stats = [
    { label: "Active Volunteers", value: statsData.volunteerCount.toString(), change: "Approved", icon: Users, color: "blue" },
    { label: "Upcoming Events", value: statsData.eventCount.toString(), change: "This month", icon: Calendar, color: "orange" },
  ]

  // Recent Activities (real data from database)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    async function loadActivities() {
      try {
        const [announcementRes, volunteerRes, suggestionRes, eventRes] = await Promise.all([
          fetch('/api/announcements', { credentials: 'include' }),
          fetch('/api/volunteers', { credentials: 'include' }),
          fetch('/api/suggestions', { credentials: 'include' }),
          fetch('/api/events?pageSize=100', { credentials: 'include' }),
        ])
        const [announcements, volunteers, suggestions, events] = await Promise.all([
          announcementRes.json().catch(() => ({})),
          volunteerRes.json().catch(() => ({})),
          suggestionRes.json().catch(() => ({})),
          eventRes.json().catch(() => ({})),
        ])

        const activities = [
          ...(announcements?.announcements || []).slice(0, 2).map((a: any) => ({
            id: a.id,
            type: 'announcement',
            user: a.author || 'Admin',
            text: a.title,
            time: a.postedAt ? new Date(a.postedAt).toLocaleDateString() : 'Recent',
            status: 'posted',
          })),
          ...(volunteers?.applications || []).slice(0, 2).map((v: any) => ({
            id: v.id,
            type: 'volunteer',
            user: v.name || 'Volunteer',
            role: v.roleTitle || v.status,
            time: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'Recent',
            status: v.status || 'pending',
          })),
          ...(suggestions?.suggestions || []).slice(0, 2).map((s: any) => ({
            id: s.id,
            type: 'suggestion',
            user: s.name || 'User',
            text: s.message,
            time: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent',
            status: s.status || 'new',
          })),
          ...(events?.events || []).slice(0, 2).map((e: any) => ({
            id: e.id,
            type: 'event',
            title: e.title,
            participants: 'TBD',
            time: e.startsAt ? new Date(e.startsAt).toLocaleDateString() : 'Recent',
            status: 'upcoming',
          })),
        ].sort(() => Math.random() - 0.5).slice(0, 4)
        setRecentActivities(activities)
      } catch (err) {
        console.error('Failed to load activities', err)
      }
    }
    loadActivities()
  }, [])

  // Commented out: Mock sermon and blog data
  // const sermons = [
  //   { id: 1, title: "Faith in Uncertain Times", speaker: "Pastor David", date: "2024-01-14", views: 342 },
  //   { id: 2, title: "Love Thy Neighbor", speaker: "Pastor Mary", date: "2024-01-07", views: 218 },
  // ]

  // const blogs = [
  //   { id: 1, title: "The Power of Prayer", author: "John Smith", date: "2024-01-10", published: true },
  //   { id: 2, title: "Building Community", author: "Sarah Jones", date: "2024-01-12", published: true },
  // ]

  // const events = [
  //   { id: 1, title: "Sunday Worship Service", date: "2024-01-21", attendees: 250, status: "scheduled" },
  //   { id: 2, title: "Bible Study Group", date: "2024-01-18", attendees: 45, status: "scheduled" },
  // ]

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
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefreshSession}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-transparent"
            >
              <Activity className="w-4 h-4 mr-2" />
              Refresh Session
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
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
              { label: "Events", icon: Calendar, id: "events" },
              { label: "Volunteers", icon: Users, id: "volunteers" },
              { label: "Suggestions", icon: MessageSquare, id: "suggestions" },
              { label: "Reminders", icon: Bell, id: "reminders", isLink: true, href: "/admin/reminders" },
              { label: "Settings", icon: Settings, id: "settings" },
            ].map((item) => (
              item.isLink ? (
                <a
                  key={item.id}
                  href={item.href}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-gray-800"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === item.id ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.id === 'suggestions' && unseenCount > 0 && (
                      <span className="text-xs bg-red-600 text-white rounded-full px-2 py-0.5">{unseenCount}</span>
                    )}
                  </span>
                </button>
              )
            ))}
          </nav>
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="bg-white dark:bg-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                      <TrendingUp className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                    <h3 className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    <p className={`text-xs text-${stat.color}-600 mt-2`}>{stat.change}</p>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card className="bg-white dark:bg-slate-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.type === "volunteer" && `${activity.user} signed up for ${activity.role}`}
                          {activity.type === "suggestion" && `${activity.user}: "${activity.text}"`}
                          {activity.type === "event" && `${activity.title} coming up`}
                          {activity.type === "announcement" && `Announcement: ${activity.text}`}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                      <Badge className={`${activity.status === "completed" || activity.status === "posted" ? "bg-green-600" : activity.status === "pending" ? "bg-yellow-600" : activity.status === "upcoming" ? "bg-blue-600" : "bg-gray-600"}`}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "announcements" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Announcements</h2>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Announcement
                </Button>
              </div>

              {showAddForm && (
                <Card className="bg-white dark:bg-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Announcement</h3>
                  <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault()
                      try {
                        const res = await fetch('/api/announcements', {
                          method: 'POST',
                          credentials: 'include',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ title: newTitle, content: newContent }),
                        })
                        if (res.ok) {
                          const data = await (await fetch('/api/announcements')).json()
                          setAnnouncementsState(data?.announcements || [])
                          setShowAddForm(false)
                          setNewTitle("")
                          setNewContent("")
                        } else {
                          const err = await res.json().catch(() => ({}))
                          console.error('Failed to publish announcement', err)
                          alert('Failed to publish announcement: ' + (err?.error || res.status))
                        }
                      } catch (err) {
                        console.error(err)
                        alert('Failed to publish announcement')
                      }
                    }}
                  >
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Announcement Title"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                    />
                    <textarea
                      placeholder="Announcement Content"
                      rows={4}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                    />
                    <div className="flex gap-3">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Publish</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </Card>
              )}

              <div className="space-y-3">
                {announcementsState.map((item) => (
                  <Card key={item.id} className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.postedAt ? new Date(item.postedAt).toLocaleDateString() : ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-600">active</Badge>
                      <Button size="sm" variant="outline"><Edit2 className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-transparent" onClick={() => handleDeleteAnnouncement(item.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Events</h2>
                <Button onClick={() => setShowAddEventForm(!showAddEventForm)} className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Add Event</Button>
              </div>

              {showAddEventForm && (
                <Card className="bg-white dark:bg-slate-800 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Event</h3>
                  <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault()
                      // client-side validation
                      const clientErrors: Record<string, string> = {}
                      if (!newEventTitle || newEventTitle.trim().length === 0) clientErrors.title = 'Title is required'
                      if (!newEventStartsAt) clientErrors.startsAt = 'Start date/time is required'
                      else if (isNaN(Date.parse(newEventStartsAt))) clientErrors.startsAt = 'Start date/time is invalid'
                      if (newEventEndsAt && isNaN(Date.parse(newEventEndsAt))) clientErrors.endsAt = 'End date/time is invalid'
                      if (newEventStartsAt && newEventEndsAt && !clientErrors.startsAt && !clientErrors.endsAt) {
                        const s = Date.parse(newEventStartsAt)
                        const e2 = Date.parse(newEventEndsAt)
                        if (!isNaN(s) && !isNaN(e2) && e2 < s) clientErrors.endsAt = 'End must be after start'
                      }
                      if (Object.keys(clientErrors).length > 0) {
                        setNewEventErrors(clientErrors)
                        return
                      }

                      setIsCreatingEvent(true)
                      setNewEventErrors({})
                      try {
                        const res = await fetch('/api/events', {
                          method: 'POST',
                          credentials: 'include',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ title: newEventTitle, description: newEventDescription, location: newEventLocation, startsAt: newEventStartsAt, endsAt: newEventEndsAt }),
                        })
                        if (res.ok) {
                          const data = await (await fetch('/api/events?pageSize=100')).json()
                          setEventsState(data?.events || [])
                          loadStats() // Reload stats after creating event
                          setShowAddEventForm(false)
                          setNewEventTitle("")
                          setNewEventDescription("")
                          setNewEventLocation("")
                          setNewEventStartsAt("")
                          setNewEventEndsAt("")
                          toast({ title: 'Success', description: 'Event created successfully!' })
                        } else {
                          const err = await res.json().catch(() => ({}))
                          console.error('Failed to create event', err)
                          if (err?.errors) {
                            setNewEventErrors(err.errors)
                          } else {
                            alert('Failed to create event: ' + (err?.error || res.status))
                          }
                        }
                      } catch (err) {
                        console.error(err)
                        alert('Failed to create event')
                      } finally {
                        setIsCreatingEvent(false)
                      }
                    }}
                  >
                    <input type="text" value={newEventTitle} onChange={(e) => { setNewEventTitle(e.target.value); setNewEventErrors(prev => { const c = { ...prev }; delete c.title; return c }) }} placeholder="Event Title" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" />
                    {newEventErrors.title && <p className="text-sm text-red-600 mt-1">{newEventErrors.title}</p>}
                    <input type="datetime-local" value={newEventStartsAt} onChange={(e) => { setNewEventStartsAt(e.target.value); setNewEventErrors(prev => { const c = { ...prev }; delete c.startsAt; return c }) }} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" />
                    {newEventErrors.startsAt && <p className="text-sm text-red-600 mt-1">{newEventErrors.startsAt}</p>}
                    <input type="datetime-local" value={newEventEndsAt} onChange={(e) => { setNewEventEndsAt(e.target.value); setNewEventErrors(prev => { const c = { ...prev }; delete c.endsAt; return c }) }} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" />
                    {newEventErrors.endsAt && <p className="text-sm text-red-600 mt-1">{newEventErrors.endsAt}</p>}
                    <input type="text" value={newEventLocation} onChange={(e) => setNewEventLocation(e.target.value)} placeholder="Location" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" />
                    <textarea value={newEventDescription} onChange={(e) => setNewEventDescription(e.target.value)} placeholder="Description" rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white" />
                    <div className="flex gap-3">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddEventForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </Card>
              )}

              <div className="space-y-3">
                {eventsState.map((event) => (
                  <Card key={event.id} className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.startsAt ? new Date(event.startsAt).toLocaleString() : ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button size="sm" variant="outline" onClick={async () => {
                        try {
                          const res = await fetch(`/api/events/signups?eventId=${event.id}`, { credentials: 'include' })
                          if (res.ok) {
                            const data = await res.json()
                            setSignupsByEvent(prev => ({ ...prev, [event.id]: data?.signups || [] }))
                            setShowingSignupsFor(event.id)
                            setShowSignupsModal(true)
                          } else {
                            const err = await res.json().catch(() => ({}))
                            alert('Failed to load signups: ' + (err?.error || res.status))
                          }
                        } catch (err) {
                          console.error(err)
                          alert('Failed to load signups')
                        }
                      }}><Eye className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline"><Edit2 className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-transparent" onClick={() => handleDeleteEvent(event.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </Card>
                ))}
              </div>
              {showSignupsModal && showingSignupsFor && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-slate-800 w-[min(900px,95%)] max-h-[80vh] overflow-auto p-6 rounded shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Signups for {eventsState.find(e => e.id === showingSignupsFor)?.title || ''}</h3>
                      <div className="flex items-center gap-2">
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={async () => {
                            if (!confirm(`Send reminder emails to all ${(signupsByEvent[showingSignupsFor] || []).length} signup(s)?`)) return
                            try {
                              const res = await fetch('/api/events/signups/send-reminder', {
                                method: 'POST',
                                credentials: 'include',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ eventId: showingSignupsFor })
                              })
                              const data = await res.json()
                              if (res.ok) {
                                alert(data.message || `Sent ${data.sent} reminder(s) successfully`)
                              } else {
                                alert('Failed to send reminders: ' + (data?.error || res.status))
                              }
                            } catch (err) {
                              console.error(err)
                              alert('Failed to send reminders')
                            }
                          }}
                        >
                          Send Reminders to All
                        </Button>
                        <Button variant="outline" onClick={() => {
                          const rows = signupsByEvent[showingSignupsFor] || []
                          const csv = [ ['Name','Email','Phone','Created At'], ...rows.map((r:any)=>[
                            r.name,
                            r.email,
                            r.phone||'',
                            r.createdAt ? new Date(r.createdAt).toISOString() : ''
                          ]) ]
                            .map(r => r.map((c:any)=>`"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n')
                          const blob = new Blob([csv], { type: 'text/csv' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `signups_${showingSignupsFor}.csv`
                          document.body.appendChild(a)
                          a.click()
                          a.remove()
                          URL.revokeObjectURL(url)
                        }}>Export CSV</Button>
                        <Button variant="outline" onClick={() => { setShowSignupsModal(false); setShowingSignupsFor(null) }}>Close</Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(signupsByEvent[showingSignupsFor] || []).map((s) => (
                        <Card key={s.id} className="p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{s.name} <span className="text-sm text-gray-500">{s.email}</span></p>
                            <p className="text-sm text-gray-500">{s.phone || ''}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-400 mr-4">{s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</div>
                            <Button size="sm" variant="destructive" onClick={async () => {
                              if (!confirm('Remove this signup?')) return
                              try {
                                const res = await fetch('/api/events/signups', { method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id }) })
                                if (res.ok) {
                                  setSignupsByEvent(prev => ({ ...prev, [showingSignupsFor]: (prev[showingSignupsFor] || []).filter(x => x.id !== s.id) }))
                                } else {
                                  const err = await res.json().catch(()=>({}))
                                  alert('Failed to remove signup: ' + (err?.error || res.status))
                                }
                              } catch (err) { console.error(err); alert('Failed to remove signup') }
                            }}>Remove</Button>
                          </div>
                        </Card>
                      ))}
                      {((signupsByEvent[showingSignupsFor] || []).length === 0) && <p className="text-sm text-gray-500">No signups yet.</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "volunteers" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Volunteer Applications</h2>
              </div>

              <div className="space-y-3">
                {volunteerApps.map((app) => (
                  <Card key={app.id} className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{app.email} • {app.roleTitle || app.roleId}</p>
                      <p className="text-sm text-gray-500">Status: {app.status}</p>
                      {app.adminMessage && <p className="text-sm text-gray-500">Message: {app.adminMessage}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-green-600" onClick={async () => {
                        const msg = prompt('Optional message to the applicant (approval note)')
                        try {
                          const res = await fetch('/api/volunteers', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: app.id, action: 'approve', message: msg }) })
                          if (res.ok) {
                            setVolunteerApps((prev) => prev.map(p => p.id === app.id ? { ...p, status: 'approved', adminMessage: msg } : p))
                          } else {
                            const err = await res.json().catch(()=>({}))
                            alert('Failed to approve: ' + (err?.error || res.status))
                          }
                        } catch (e) { console.error(e); alert('Failed to approve') }
                      }}>Approve</Button>
                      <Button size="sm" className="bg-red-600" onClick={async () => {
                        const msg = prompt('Message to applicant (reason for rejection)')
                        if (msg === null) return
                        try {
                          const res = await fetch('/api/volunteers', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: app.id, action: 'reject', message: msg }) })
                          if (res.ok) {
                            setVolunteerApps((prev) => prev.map(p => p.id === app.id ? { ...p, status: 'rejected', adminMessage: msg } : p))
                          } else {
                            const err = await res.json().catch(()=>({}))
                            alert('Failed to reject: ' + (err?.error || res.status))
                          }
                        } catch (e) { console.error(e); alert('Failed to reject') }
                      }}>Reject</Button>
                    </div>
                  </Card>
                ))}
                {volunteerApps.length === 0 && <p className="text-sm text-gray-500">No volunteer applications yet.</p>}
              </div>
            </div>
          )}

          {activeTab === "suggestions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Suggestions</h2>
                <div className="flex items-center gap-3">
                  {unseenCount > 0 && <span className="text-sm text-white bg-red-600 rounded-full px-2 py-0.5">{unseenCount} new</span>}
                  <Button size="sm" onClick={async () => {
                    try {
                      const res = await fetch('/api/suggestions', { credentials: 'include' })
                      if (res.ok) {
                        const data = await res.json()
                        setSuggestionsState(data?.suggestions || [])
                        const now = new Date().toISOString()
                        try { localStorage.setItem('adminSuggestionsLastSeen', now) } catch (e) {}
                        setLastSeen(now)
                        setUnseenCount(0)
                      } else {
                        const err = await res.json().catch(()=>({}))
                        alert('Failed to refresh suggestions: ' + (err?.error || res.status))
                      }
                    } catch (e) { console.error(e); alert('Failed to refresh suggestions') }
                  }}>Refresh</Button>
                </div>
              </div>
              <div className="space-y-3">
                {suggestionsState.map((s) => (
                  <Card key={s.id} className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{s.type} from {s.name || s.email}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{s.message}</p>
                      {s.adminResponse && (
                        <p className="text-sm text-gray-500">Response: {s.adminResponse} {s.responderName ? <span className="text-xs text-gray-400">(by {s.responderName})</span> : null}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => {
                        setReplyTargetId(s.id)
                        setReplyTargetEmail(s.email || null)
                        setReplyTargetName(s.name || null)
                        setReplyText(s.adminResponse || '')
                        setReplyModalOpen(true)
                      }}>Respond</Button>
                    </div>
                  </Card>
                ))}
                {suggestionsState.length === 0 && <p className="text-sm text-gray-500">No suggestions yet.</p>}
              </div>
            </div>
          )}

          {/* Reply Modal */}
          <Dialog open={replyModalOpen} onOpenChange={(open) => { if (!open) { setReplyTargetId(null); setReplyText('') } setReplyModalOpen(open) }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Respond to Suggestion</DialogTitle>
              </DialogHeader>
                <div className="mt-2 space-y-3">
                <div>
                  <Textarea className="w-full min-h-[200px]" value={replyText} onChange={(e) => { setReplyText((e.target as HTMLTextAreaElement).value); if (replyError) setReplyError(null) }} placeholder="Write your response to the suggestion here" />
                </div>
                {replyError && <p className="text-sm text-red-600 mt-2">{replyError}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setReplyModalOpen(false); setReplyError(null) }}>Cancel</Button>
                <Button disabled={isReplying || replyText.trim().length === 0} onClick={async () => {
                  if (!replyTargetId) return
                  if (replyText.trim().length === 0) { setReplyError('Response cannot be empty'); return }
                  setIsReplying(true)
                  setReplyError(null)
                  try {
                      const res = await fetch('/api/suggestions', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: replyTargetId, response: replyText, responderName: adminName }) })
                    if (res.ok) {
                        setSuggestionsState(prev => prev.map(x => x.id === replyTargetId ? { ...x, adminResponse: replyText, respondedAt: new Date().toISOString(), responderName: adminName || 'You' } : x))
                      setReplyModalOpen(false)
                      setReplyTargetId(null)
                      setReplyTargetEmail(null)
                      setReplyTargetName(null)
                      setReplyText('')
                      toast({ title: 'Response sent', description: 'Your reply was delivered to the user.' })
                    } else {
                      const err = await res.json().catch(() => ({}))
                      const msg = err?.error || `Status ${res.status}`
                      setReplyError('Failed to send response: ' + msg)
                    }
                  } catch (e) {
                    console.error(e)
                    setReplyError('Network or server error')
                  } finally {
                    setIsReplying(false)
                  }
                }}>{isReplying ? 'Sending...' : 'Send Response'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <ChurchSettings adminName={adminName} toast={toast} />
          )}

        </main>
      </div>
    </div>
  )
}

function ChurchSettings({ adminName, toast }: { adminName: string, toast: any }) {
  const [activeMembers, setActiveMembers] = useState('')
  const [ministryPartnerships, setMinistryPartnerships] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', { credentials: 'include' })
      const data = await res.json()
      if (data?.settings) {
        setActiveMembers(String(data.settings.activeMembers || ''))
        setMinistryPartnerships(String(data.settings.ministryPartnerships || ''))
      }
    } catch (e) {
      console.error('Failed to load settings', e)
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeMembers: Number(activeMembers) || 0,
          ministryPartnerships: Number(ministryPartnerships) || 0,
        }),
      })

      if (res.ok) {
        toast({ title: 'Settings saved', description: 'Church statistics have been updated.' })
      } else {
        toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' })
      }
    } catch (e) {
      console.error('Failed to save settings', e)
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Church Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage church statistics displayed on the About page</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Active Members
            </label>
            <input
              type="number"
              value={activeMembers}
              onChange={(e) => setActiveMembers(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="2000"
              min="0"
            />
            <p className="text-sm text-gray-500 mt-1">Number of active church members</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ministry Partnerships
            </label>
            <input
              type="number"
              value={ministryPartnerships}
              onChange={(e) => setMinistryPartnerships(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="50"
              min="0"
            />
            <p className="text-sm text-gray-500 mt-1">Number of ministry partnerships</p>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Note:</strong> Years Serving is automatically calculated from Feb 7, 2020 (founding date).
                Weekly Programs count is automatically calculated from scheduled events in the next 7 days.
              </p>
            </div>
            <Button onClick={saveSettings} disabled={saving} className="w-full sm:w-auto">
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
