"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/navigation/sidebar"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Heart, Users, DollarSign, Calendar, TrendingUp, Settings, Bell, BookOpen } from "lucide-react"
import Inbox from "@/components/inbox"

const statsCards = [
  { title: "Total Donations", value: "$2,450", change: "+12%", icon: DollarSign, color: "text-green-600" },
  { title: "Volunteer Hours", value: "180", change: "+8h", icon: Users, color: "text-blue-600" },
  { title: "Blog Articles", value: "24", change: "Last 3 mo", icon: BookOpen, color: "text-purple-600" },
  { title: "Upcoming Events", value: "5", change: "This month", icon: Calendar, color: "text-orange-600" },
]

const recentActivity = [
  { type: "donation", message: "You donated $50", time: "2 hours ago", icon: Heart },
  { type: "volunteer", message: "Volunteer event next Sunday", time: "5 hours ago", icon: Users },
  { type: "sermon", message: "New sermon posted", time: "Yesterday", icon: BookOpen },
  { type: "event", message: "Church picnic scheduled", time: "2 days ago", icon: Calendar },
]

export default function Dashboard() {
  const { user } = useUser()
  const [showReminders, setShowReminders] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [latestPreview, setLatestPreview] = useState<string | null>(null)
  const inboxLastSeenKey = 'inboxLastSeenAt'

  async function loadInboxSummary() {
    try {
      const email = user?.email
      if (!email) return
      // get server-side lastSeen and unread count
      const s = await fetch('/api/user/inbox', { credentials: 'include' })
      const summary = await s.json().catch(() => ({}))
      const serverLastSeen = summary?.lastSeen || null
      const serverUnread = summary?.unreadCount || 0
      setUnreadCount(serverUnread)

      // fetch items to show latest preview (use serverLastSeen to pick preview if available)
      const [sRes, vRes] = await Promise.all([
        fetch(`/api/suggestions?email=${encodeURIComponent(email)}`),
        fetch(`/api/volunteers?email=${encodeURIComponent(email)}`),
      ])
      const [sData, vData] = await Promise.all([sRes.json().catch(()=>({})), vRes.json().catch(()=>({}))])

      const suggestions = sData?.suggestions || []
      const volunteers = vData?.applications || []
      const all = [
        ...suggestions.map((s:any) => ({ when: s.respondedAt || s.createdAt, text: s.adminResponse ? `Response: ${s.adminResponse}` : s.message })),
        ...volunteers.map((v:any) => ({ when: v.respondedAt || v.createdAt, text: v.adminMessage || `Volunteer: ${v.status}` })),
      ].filter((x:any) => x.when)

      if (all.length > 0) {
        if (serverLastSeen) {
          const last = new Date(serverLastSeen)
          const unseen = all.filter((a:any)=> new Date(a.when) > last)
          if (unseen.length > 0) setLatestPreview(unseen.sort((a:any,b:any)=> new Date(b.when).getTime() - new Date(a.when).getTime())[0].text)
          else setLatestPreview(all.sort((a:any,b:any)=> new Date(b.when).getTime() - new Date(a.when).getTime())[0].text)
        } else {
          setLatestPreview(all.sort((a:any,b:any)=> new Date(b.when).getTime() - new Date(a.when).getTime())[0].text)
        }
      }
    } catch (e) { console.error('Failed to load inbox summary', e) }
  }

  useEffect(() => {
    if (!user) return
    // automatically mark messages read when dashboard loads
    ;(async () => {
      try {
        await fetch('/api/user/inbox', { method: 'PATCH', credentials: 'include' })
        // after marking read, refresh summary
        await loadInboxSummary()
      } catch (e) { console.error('Failed to mark inbox read on load', e) }
    })()
    const iv = setInterval(loadInboxSummary, 10000)
    return () => clearInterval(iv)
  }, [user])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access dashboard</h2>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-2">Welcome back, {user.name}!</h1>
              <p className="text-gray-600 dark:text-gray-400">Here's what's happening in your church community today</p>
            </div>

            {/* Church Reminders Alert */}
            {showReminders && (
              <Card className="mb-6 p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <div>
                      <h3 className="font-semibold text-orange-900 dark:text-orange-400">Upcoming Program Reminder</h3>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        Midweek Service - Wednesday 7:00 PM | Youth Group - Thursday 6:00 PM | Sunday Service - 10:00 AM
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReminders(false)}
                    className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
                  >
                    ×
                  </button>
                </div>
              </Card>
            )}

            {/* Inbox Reminder Alert */}
            {unreadCount > 0 && (
              <Card className="mb-6 p-4 border-l-4 border-blue-600 bg-blue-50 dark:bg-slate-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-300">You have {unreadCount} new message{unreadCount>1?'s':''}</h3>
                      {latestPreview && <p className="text-sm text-gray-700 dark:text-gray-300">{latestPreview}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        try { localStorage.setItem(inboxLastSeenKey, new Date().toISOString()); setUnreadCount(0) } catch(e){}
                      }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Mark as read
                    </button>
                    <Link href="#inbox" onClick={() => { try { localStorage.setItem(inboxLastSeenKey, new Date().toISOString()); setUnreadCount(0) } catch(e){} }} className="text-sm text-white bg-blue-600 px-3 py-1 rounded">Open Inbox</Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((card, idx) => {
                const Icon = card.icon
                return (
                  <Card key={idx} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                        <Icon className={`w-6 h-6 ${card.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                        {card.change}
                      </span>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
                    <p className="text-2xl font-bold text-blue-900 dark:text-white">{card.value}</p>
                  </Card>
                )
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 p-6">
                <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => {
                    const Icon = activity.icon
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{activity.message}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/donate">
                    <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
                      <Heart className="w-4 h-4 mr-2" />
                      Make Donation
                    </Button>
                  </Link>
                  <Link href="/volunteer">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Sign Up Volunteer
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      Customize Theme
                    </Button>
                  </Link>
                </div>
              </Card>
              <Card className="p-6 mt-6" id="inbox">
                <Inbox email={user.email} />
              </Card>
            </div>

            {/* Featured Sermons */}
            <Card className="mt-6 p-6">
              <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-6">Featured Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Faith & Trust", date: "Last Sunday", views: "1.2K" },
                  { title: "Building Community", date: "2 weeks ago", views: "985" },
                  { title: "Daily Blessings", date: "1 week ago", views: "742" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-blue-200 dark:border-blue-900 hover:shadow-lg transition"
                  >
                    <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-3"></div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.date} • {item.views} views
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
