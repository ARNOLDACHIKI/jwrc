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
        const res = await fetch('/api/events', { credentials: 'include' })
        const data = await res.json()
        if (!mounted) return
        setEventsState(data?.events || [])
      } catch (e) {
        console.error('Failed to load events', e)
      }
    })()
    return () => { mounted = false }
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

  // Admin Stats (static placeholders)
  const stats = [
    { label: "Total Donations", value: "$45,230", change: "+12.5%", icon: DollarSign, color: "green" },
    { label: "Active Volunteers", value: "128", change: "+8 this month", icon: Users, color: "blue" },
    { label: "Blog Posts", value: "24", change: "+3 new", icon: FileText, color: "purple" },
    { label: "Upcoming Events", value: "12", change: "6 this week", icon: Calendar, color: "orange" },
  ]

  // Recent Activities (static placeholders)
  const activities = [
    { id: 1, type: "donation", user: "John Doe", amount: "$500", time: "2 hours ago", status: "completed" },
    { id: 2, type: "volunteer", user: "Sarah Smith", role: "Youth Program", time: "4 hours ago", status: "pending" },
    { id: 3, type: "suggestion", user: "Mike Johnson", text: "More youth activities", time: "1 day ago", status: "read" },
    { id: 4, type: "event", title: "Bible Study Group", participants: 45, time: "2 days ago", status: "live" },
  ]

  // Simple management placeholders
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
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.type === "donation" && `${activity.user} donated ${activity.amount}`}
                          {activity.type === "volunteer" && `${activity.user} signed up for ${activity.role}`}
                          {activity.type === "suggestion" && `${activity.user}: "${activity.text}"`}
                          {activity.type === "event" && `${activity.title} - ${activity.participants} participants`}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                      <Badge className={`${activity.status === "completed" ? "bg-green-600" : activity.status === "pending" ? "bg-yellow-600" : activity.status === "live" ? "bg-blue-600" : "bg-gray-600"}`}>
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
                          // refresh list
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

          {activeTab === "sermons" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Sermons</h2>
                <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Add Sermon</Button>
              </div>

              <div className="space-y-3">
                {sermons.map((sermon) => (
                  <Card key={sermon.id} className="bg-white dark:bg-slate-800 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{sermon.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">By {sermon.speaker} • {sermon.date} • {sermon.views} views</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1" />View</Button>
                        <Button size="sm" variant="outline"><Edit2 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-transparent"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "blog" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Blog Posts</h2>
                <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Add Blog Post</Button>
              </div>

              <div className="space-y-3">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="bg-white dark:bg-slate-800 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{blog.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">By {blog.author} • {blog.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={blog.published ? "bg-green-600" : "bg-yellow-600"}>{blog.published ? "Published" : "Draft"}</Badge>
                        <Button size="sm" variant="outline"><Edit2 className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-transparent"><Trash2 className="w-4 h-4" /></Button>
                      </div>
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
                          const data = await (await fetch('/api/events')).json()
                          setEventsState(data?.events || [])
                          setShowAddEventForm(false)
                          setNewEventTitle("")
                          setNewEventDescription("")
                          setNewEventLocation("")
                          setNewEventStartsAt("")
                          setNewEventEndsAt("")
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
                        <Button variant="outline" onClick={() => {
                          const rows = signupsByEvent[showingSignupsFor] || []
                          const csv = [ ['Name','Email','Phone','Created At'], ...rows.map((r:any)=>[r.name, r.email, r.phone||'', r.createdAt]) ]
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

        </main>
      </div>
    </div>
  )
}
