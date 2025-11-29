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
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="bg-white dark:bg-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}
                      >
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
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.type === "donation" && `${activity.user} donated ${activity.amount}`}
                          {activity.type === "volunteer" && `${activity.user} signed up for ${activity.role}`}
                          {activity.type === "suggestion" && `${activity.user}: "${activity.text}"`}
                          {activity.type === "event" && `${activity.title} - ${activity.participants} participants`}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                      <Badge
                        className={`${activity.status === "completed" ? "bg-green-600" : activity.status === "pending" ? "bg-yellow-600" : activity.status === "live" ? "bg-blue-600" : "bg-gray-600"}`}
                      >
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
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Announcement Title"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                    />
                    <textarea
                      placeholder="Announcement Content"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                    />
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white">
                      <option>Category: Important</option>
                      <option>Category: Event</option>
                      <option>Category: Service</option>
                    </select>
                    <div className="flex gap-3">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Publish
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              <div className="space-y-3">
                {announcements.map((item) => (
                  <Card key={item.id} className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-600">{item.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sermon
                </Button>
              </div>

              <div className="space-y-3">
                {sermons.map((sermon) => (
                  <Card key={sermon.id} className="bg-white dark:bg-slate-800 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{sermon.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          By {sermon.speaker} • {sermon.date} • {sermon.views} views
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-transparent">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog Post
                </Button>
              </div>

              <div className="space-y-3">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="bg-white dark:bg-slate-800 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{blog.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          By {blog.author} • {blog.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={blog.published ? "bg-green-600" : "bg-yellow-600"}>
                          {blog.published ? "Published" : "Draft"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-transparent">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>

              <div className="space-y-3">
                {events.map((event) => (
                  <Card key={event.id} className="bg-white dark:bg-slate-800 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.date} • {event.attendees} attendees
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600">{event.status}</Badge>
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 bg-transparent">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "donations" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Donations Tracking</h2>
              <Card className="bg-white dark:bg-slate-800 p-6">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Donations</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">$45,230</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                    <p className="text-3xl font-bold text-green-600">$8,500</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Donors</p>
                    <p className="text-3xl font-bold text-blue-600">342</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Detailed donation records and analytics are available in the full report.
                </p>
              </Card>
            </div>
          )}

          {activeTab === "volunteers" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Volunteer Management</h2>
              <Card className="bg-white dark:bg-slate-800 p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Volunteers</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">128</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active This Week</p>
                    <p className="text-3xl font-bold text-green-600">45</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
                    <p className="text-3xl font-bold text-blue-600">2,340</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "trivia" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Bible Trivia</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
              <Card className="bg-white dark:bg-slate-800 p-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Create and manage Bible trivia questions and answers for the game.
                </p>
              </Card>
            </div>
          )}

          {activeTab === "suggestions" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Member Suggestions</h2>
              <Card className="bg-white dark:bg-slate-800 p-6">
                <p className="text-gray-600 dark:text-gray-400">
                  View and manage suggestions, complaints, and feedback from church members.
                </p>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h2>
              <Card className="bg-white dark:bg-slate-800 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Church Name</label>
                  <input
                    type="text"
                    defaultValue="Grace Community Church"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Email for Notifications
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@gracecommunity.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
