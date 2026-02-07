"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/navigation/sidebar"
import { HeaderWithSidebar } from "@/components/navigation/header-with-sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"
import { Heart, Users, DollarSign, Calendar, TrendingUp, Settings, Bell, BookOpen, Shield, Book, Sparkles, XCircle } from "lucide-react"
import Inbox from "@/components/inbox"

export default function Dashboard() {
  const { user } = useUser()
  const { toast } = useToast()
  const [showReminders, setShowReminders] = useState(true)
  const [activeReminder, setActiveReminder] = useState<{title: string, message: string} | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [latestPreview, setLatestPreview] = useState<string | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [weeklyProgramsCount, setWeeklyProgramsCount] = useState(0)
  const [weeklyPrograms, setWeeklyPrograms] = useState<Array<{id: string, name: string, day: string, time: string}>>([])
  const [weeklyWord, setWeeklyWord] = useState<{title: string, theme: string, scripture: string | null, content: string} | null>(null)
  const [poster, setPoster] = useState<{url: string | null, alt: string | null} | null>(null)
  const [posterEventInfo, setPosterEventInfo] = useState<{ title: string | null, date: string | null, time: string | null, location: string | null } | null>(null)
  const [posterContent, setPosterContent] = useState<{ description: string | null, agenda: string | null, details: string | null, speaker: string | null, theme: string | null } | null>(null)
  const [readActivities, setReadActivities] = useState<Set<string>>(new Set())
  const [myEventSignups, setMyEventSignups] = useState<Array<any>>([])
  const [withdrawingSignup, setWithdrawingSignup] = useState<string | null>(null)
  const inboxLastSeenKey = 'inboxLastSeenAt'
  const readActivitiesKey = 'readActivities'

  // Load read activities from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(readActivitiesKey)
      if (stored) {
        setReadActivities(new Set(JSON.parse(stored)))
      }
    } catch (e) {
      console.error('Failed to load read activities', e)
    }
  }, [])

  const markActivityAsRead = (activityId: string) => {
    setReadActivities(prev => {
      const updated = new Set([...prev, activityId])
      // Persist to localStorage
      try {
        localStorage.setItem(readActivitiesKey, JSON.stringify([...updated]))
      } catch (e) {
        console.error('Failed to save read activities', e)
      }
      return updated
    })
  }

  async function loadActiveReminder() {
    try {
      const response = await fetch('/api/reminders')
      if (response.ok) {
        const data = await response.json()
        setActiveReminder(data)
      }
    } catch (error) {
      console.error('Error fetching reminder:', error)
    }
  }

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

  async function loadWeeklyPrograms() {
    try {
      const response = await fetch('/api/weekly-programs')
      if (response.ok) {
        const programs = await response.json()
        setWeeklyPrograms(programs)
        setWeeklyProgramsCount(programs.length)
      }
    } catch (error) {
      console.error('Error fetching weekly programs:', error)
    }
  }

  async function loadWeeklyWord() {
    try {
      const response = await fetch('/api/weekly-word')
      if (response.ok) {
        const data = await response.json()
        setWeeklyWord(data)
      }
    } catch (error) {
      console.error('Error fetching weekly word:', error)
    }
  }


  async function loadPoster() {
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) return
      const data = await res.json()
      const p = data?.settings?.posterUrl ? { url: data.settings.posterUrl, alt: data.settings.posterAlt || null } : null
      setPoster(p)
      const posterInfo = {
        title: data?.settings?.posterEventTitle || null,
        date: data?.settings?.posterEventDate || null,
        time: data?.settings?.posterEventTime || null,
        location: data?.settings?.posterEventLocation || null,
      }
      setPosterEventInfo(posterInfo)
      
      const posterContentInfo = {
        description: data?.settings?.posterDescription || null,
        agenda: data?.settings?.posterAgenda || null,
        details: data?.settings?.posterDetails || null,
        speaker: data?.settings?.posterSpeaker || null,
        theme: data?.settings?.posterTheme || null,
      }
      setPosterContent(posterContentInfo)
    } catch (e) { console.error('Failed to load poster', e) }
  }

  async function loadMyEventSignups() {
    try {
      const email = user?.email
      if (!email) return

      // Fetch all user's signups
      const res = await fetch(`/api/events/signups?email=${encodeURIComponent(email)}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setMyEventSignups(data.signups || [])
      }
    } catch (e) {
      console.error('Failed to load my event signups', e)
    }
  }

  async function loadRecentActivity() {
    try {
      const email = user?.email
      if (!email) return

      const [announcementRes, eventRes, volunteerRes] = await Promise.all([
        fetch('/api/announcements', { credentials: 'include' }),
        fetch('/api/events?futureOnly=true&pageSize=100', { credentials: 'include' }),
        fetch(`/api/volunteers?email=${encodeURIComponent(email)}`),
      ])

      const [announcements, events, volunteers] = await Promise.all([
        announcementRes.json().catch(() => ({})),
        eventRes.json().catch(() => ({})),
        volunteerRes.json().catch(() => ({})),
      ])

      const activities: any[] = []

      // Add recent announcements
      const recentAnnouncements = (announcements?.announcements || []).slice(0, 2)
      recentAnnouncements.forEach((a: any) => {
        activities.push({
          id: `announcement-${a.id}`,
          type: 'announcement',
          title: a.title || 'New announcement posted',
          message: a.content || '',
          time: a.postedAt ? formatTime(new Date(a.postedAt)) : 'Recently',
          icon: Bell,
          actionLabel: 'View Announcement',
          actionLink: '/announcements'
        })
      })

      // Add volunteer applications
      const userVolunteers = (volunteers?.applications || []).slice(0, 1)
      userVolunteers.forEach((v: any) => {
        const status = v.status === 'approved' ? 'approved' : v.status === 'rejected' ? 'declined' : 'pending'
        activities.push({
          id: `volunteer-${v.id}`,
          type: 'volunteer',
          title: `Your volunteer application was ${status}`,
          message: v.adminMessage || '',
          time: v.respondedAt ? formatTime(new Date(v.respondedAt)) : formatTime(new Date(v.createdAt)),
          icon: Users,
          actionLabel: 'View Application',
          actionLink: '/volunteer'
        })
      })

      // Sort by most recent
      setRecentActivity(activities.slice(0, 4))
    } catch (e) {
      console.error('Failed to load recent activity', e)
    }
  }

  function formatTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  async function handleWithdrawFromEvent(signupId: string) {
    if (!confirm('Are you sure you want to withdraw from this event?')) return

    setWithdrawingSignup(signupId)
    try {
      const res = await fetch('/api/events/signups/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signupId })
      })

      if (res.ok) {
        toast({ title: 'Success', description: 'Successfully withdrawn from event' })
        // Refresh signups
        await loadMyEventSignups()
        await loadRecentActivity()
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to withdraw', variant: 'destructive' })
      }
    } catch (err) {
      console.error('Error withdrawing:', err)
      toast({ title: 'Error', description: 'Failed to withdraw from event', variant: 'destructive' })
    } finally {
      setWithdrawingSignup(null)
    }
  }

  useEffect(() => {
    if (!user) return
    // Load active reminder
    loadActiveReminder()
    loadWeeklyPrograms()
    loadWeeklyWord()
    loadPoster()
    loadMyEventSignups()
    // automatically mark messages read when dashboard loads
    ;(async () => {
      try {
        await fetch('/api/user/inbox', { method: 'PATCH', credentials: 'include' })
        // after marking read, refresh summary
        await loadInboxSummary()
        await loadRecentActivity()
      } catch (e) { console.error('Failed to mark inbox read on load', e) }
    })()
    const iv = setInterval(() => {
      loadInboxSummary()
      loadRecentActivity()
      loadWeeklyPrograms()
      loadWeeklyWord()
      loadPoster()
      loadMyEventSignups()
    }, 30000) // Refresh every 30 seconds
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
      <HeaderWithSidebar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto w-full lg:w-auto">
          <div className="p-4 sm:p-6 md:p-8 max-w-full">
            {/* Welcome Section */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-white mb-2">
                Welcome back, {(() => {
                  if (user.name && user.name.trim()) {
                    return user.name.split(' ')[0]
                  }
                  const emailUsername = (user.email || '').split('@')[0]
                  // Capitalize first letter
                  return emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1)
                })()}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Here's what's happening in your church community today</p>
            </div>

            {/* Church Reminders Alert */}
            {showReminders && activeReminder && (
              <Card className="mb-4 sm:mb-6 p-3 sm:p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                <div className="flex items-start sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-orange-900 dark:text-orange-400">{activeReminder.title}</h3>
                      <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 break-words">
                        {activeReminder.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReminders(false)}
                    className="text-orange-600 hover:text-orange-700 dark:text-orange-400 text-xl sm:text-2xl shrink-0 -mt-1"
                  >
                    ×
                  </button>
                </div>
              </Card>
            )}

            {/* Inbox Reminder Alert */}
            {unreadCount > 0 && (
              <Card className="mb-4 sm:mb-6 p-3 sm:p-4 border-l-4 border-blue-600 bg-blue-50 dark:bg-slate-800/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-300">You have {unreadCount} new message{unreadCount>1?'s':''}</h3>
                      {latestPreview && <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">{latestPreview}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        try { localStorage.setItem(inboxLastSeenKey, new Date().toISOString()); setUnreadCount(0) } catch(e){}
                      }}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex-1 sm:flex-initial"
                    >
                      Mark as read
                    </button>
                    <Link href="#inbox" onClick={() => { try { localStorage.setItem(inboxLastSeenKey, new Date().toISOString()); setUnreadCount(0) } catch(e){} }} className="text-xs sm:text-sm text-white bg-blue-600 px-3 py-1 rounded whitespace-nowrap">Open Inbox</Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Poster Display - Information Only, No Registration */}
            {poster && (
              <article className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-4 border-gray-300 dark:border-gray-600 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 shadow-[8px_8px_0_0_rgba(107,114,128,0.3)] dark:shadow-[8px_8px_0_0_rgba(75,85,99,0.3)] overflow-hidden rounded-lg">
                {/* Poster Image - Left Column */}
                <div className="flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[400px]">
                  <img 
                    src={poster.url || ''} 
                    alt={poster.alt || 'Event Poster'} 
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg"
                  />
                </div>

                {/* Event Details - Right Column */}
                <div className="flex flex-col justify-start space-y-6 overflow-hidden min-h-[300px] md:min-h-[400px]">
                  {posterEventInfo?.title && (
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight break-words">
                        {posterEventInfo.title}
                      </h2>
                    </div>
                  )}
                  
                  <div className="space-y-2.5 pt-2">
                    {posterEventInfo?.date && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <span className="font-semibold text-gray-900 dark:text-white break-words">{posterEventInfo.date}</span>
                      </div>
                    )}
                    
                    {posterEventInfo?.time && (
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 flex-shrink-0 text-lg text-blue-600 dark:text-blue-400">🕐</span>
                        <span className="font-semibold text-gray-900 dark:text-white break-words">{posterEventInfo.time}</span>
                      </div>
                    )}
                    
                    {posterEventInfo?.location && (
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 flex-shrink-0 text-lg text-blue-600 dark:text-blue-400">📍</span>
                        <span className="font-semibold text-gray-900 dark:text-white break-words">{posterEventInfo.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Event Content Details */}
                  {posterContent && (
                    <div className="space-y-5 pt-4 overflow-hidden">
                      {posterContent.theme && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Theme</h3>
                          <p className="text-sm text-gray-900 dark:text-white break-words leading-relaxed">{posterContent.theme}</p>
                        </div>
                      )}
                      
                      {posterContent.speaker && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Speaker</h3>
                          <p className="text-sm text-gray-900 dark:text-white break-words leading-relaxed">{posterContent.speaker}</p>
                        </div>
                      )}
                      
                      {posterContent.description && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                          <p className="text-sm text-gray-900 dark:text-white break-words leading-relaxed whitespace-normal">{posterContent.description}</p>
                        </div>
                      )}
                      
                      {posterContent.agenda && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Agenda</h3>
                          <p className="text-sm text-gray-900 dark:text-white break-words leading-relaxed whitespace-pre-wrap">{posterContent.agenda}</p>
                        </div>
                      )}
                      
                      {posterContent.details && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Details</h3>
                          <p className="text-sm text-gray-900 dark:text-white break-words leading-relaxed whitespace-pre-wrap">{posterContent.details}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )}

            {/* Weekly Word & Theme Card - Replaces Stats Section */}

            {weeklyWord ? (
              <article className="mb-6 flex max-w-full flex-col items-start justify-between border-4 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 dark:from-gray-300 dark:via-gray-200 dark:to-gray-300 p-[4px] shadow-[8px_8px_0_0_rgba(30,64,175,0.3)] dark:shadow-[8px_8px_0_0_rgba(229,231,235,0.4)] transition-all duration-500 ease-in-out hover:shadow-[12px_12px_0_0_rgba(30,64,175,0.4)] dark:hover:shadow-[12px_12px_0_0_rgba(229,231,235,0.5)]">
                <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 w-full h-full">
                  <div className="mb-2 flex items-center gap-x-2 text-xs">
                    <time className="border-2 border-blue-800 dark:border-gray-200 bg-blue-800 dark:bg-gray-200 px-3 py-1 font-bold text-white dark:text-gray-900 transition-all duration-500 ease-in-out transform hover:scale-110" dateTime={new Date().toISOString()}>
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                    <span className="border-2 border-blue-800 dark:border-gray-200 bg-blue-800 dark:bg-gray-200 px-3 py-1 font-bold text-white dark:text-gray-900 transition-all duration-500 ease-in-out">
                      Word of the Week
                    </span>
                  </div>
                  <div className="group relative w-full">
                    <h3 className="mt-3 text-2xl sm:text-3xl font-black uppercase leading-6 text-blue-800 dark:text-white transition-all duration-500 ease-in-out transform hover:scale-105 hover:text-blue-700 dark:hover:text-gray-50">
                      {weeklyWord.title}
                    </h3>
                    <h4 className="mt-3 text-xl sm:text-2xl font-bold text-blue-700 dark:text-gray-50">
                      {weeklyWord.theme}
                    </h4>
                    {weeklyWord.scripture && (
                      <div className="text-sm mt-3 flex items-center gap-2 border-l-4 border-blue-600 dark:border-gray-100 pl-4 font-semibold italic text-blue-700 dark:text-gray-50 transition-all duration-500 ease-in-out">
                        <Book className="w-4 h-4 flex-shrink-0" />
                        <span>{weeklyWord.scripture}</span>
                      </div>
                    )}
                    <p className="text-sm sm:text-base mt-5 border-l-4 border-blue-600 dark:border-gray-100 pl-4 leading-6 text-blue-800 dark:text-gray-50 transition-all duration-500 ease-in-out hover:border-blue-500 dark:hover:border-gray-50 hover:text-blue-700 dark:hover:text-white">
                      "{weeklyWord.content}"
                    </p>
                  </div>
                  <div className="relative mt-6 flex items-center gap-x-2">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-white text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <p className="font-semibold">Let this word guide you through the week</p>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <article className="mb-6 flex max-w-full flex-col items-center justify-center border-4 border-gray-300 dark:border-gray-600 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 shadow-[8px_8px_0_0_rgba(107,114,128,0.3)] dark:shadow-[8px_8px_0_0_rgba(75,85,99,0.3)]">
                <Book className="w-12 h-12 mb-3 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 font-semibold">No weekly word set yet</p>
              </article>
            )}

            {/* Three Column Grid - Quick Actions, Weekly Programs, My Registered Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* Quick Actions */}
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-white mb-4 sm:mb-6">Quick Actions</h2>
                <div className="space-y-2 sm:space-y-3">
                  {user?.role === 'admin' && (
                    <Link href="/admin/dashboard">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start text-sm sm:text-base">
                        <Shield className="w-4 h-4 mr-2" />
                        Switch to Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Link href="/give">
                    <Button className="w-full bg-green-600 hover:bg-green-700 justify-start text-sm sm:text-base">
                      <Heart className="w-4 h-4 mr-2" />
                      Make Donation
                    </Button>
                  </Link>
                  <Link href="/volunteer">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start text-sm sm:text-base">
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

              {/* Weekly Programs List */}
              <Card className="p-4 sm:p-6 transform transition-all duration-300 hover:shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-white mb-4">Weekly Programs</h2>
                {weeklyPrograms.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm sm:text-base">No programs scheduled</p>
                    <p className="text-xs sm:text-sm mt-2">Check back later for updates</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {weeklyPrograms.map((program) => (
                      <div
                        key={program.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-blue-500 text-white shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">{program.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{program.day} at {program.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* My Registered Events */}
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-white mb-4">My Registered Events</h2>
                {myEventSignups.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm sm:text-base font-medium">No registered events</p>
                    <p className="text-xs sm:text-sm mt-2">Register for events to see them here</p>
                    <Link href="/events" className="inline-block mt-4">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Browse Events</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myEventSignups.map((signup: any) => (
                      <div key={signup.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                              {signup.event?.title || 'Event'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {signup.event?.startsAt ? new Date(signup.event.startsAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                }) : 'TBA'}
                              </span>
                            </div>
                            {signup.checked_in && (
                              <div className="mt-2">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                                  ✓ Checked In
                                </span>
                              </div>
                            )}
                          </div>
                          {!signup.checked_in && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleWithdrawFromEvent(signup.id)}
                              disabled={withdrawingSignup === signup.id}
                              className="text-xs px-2 py-1 h-auto bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              {withdrawingSignup === signup.id ? 'Withdrawing...' : 'Withdraw'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Two Column Grid - Recent Activity and Inbox */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Activity */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-white mb-4 sm:mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <Card className="p-6 sm:p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No recent activity yet</p>
                      <p className="text-xs sm:text-sm mt-2 text-gray-400 dark:text-gray-500">Check back later for updates</p>
                    </Card>
                  ) : (
                    recentActivity.map((activity) => {
                      const isRead = readActivities.has(activity.id)
                      return (
                        <div
                          key={activity.id}
                          className="activity-card bg-gray-50 dark:bg-[#1e1e1e] rounded-xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl dark:shadow-[1em_1em_1em_rgba(0,0,0,0.2),-0.75em_-0.75em_1em_rgba(255,255,255,0.05)] border border-gray-200 dark:border-[#2a2a2a] hover:border-blue-300 dark:hover:border-[#3a8bff] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
                        >
                          <div className="p-4 sm:p-5 flex gap-3">
                            {/* Status Indicator */}
                            <div className="flex-shrink-0 pt-1">
                              <div className={isRead ? 'w-2.5 h-2.5 rounded-full bg-green-500' : 'w-2.5 h-2.5 rounded-full bg-red-500'}></div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col gap-3.5">
                                {/* Text Content */}
                                <div className="space-y-1">
                                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-[#e0e0e0]">
                                    {activity.title}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a0a0a0]">
                                    {activity.time}
                                  </p>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-row gap-4 items-center">
                                  <Link href={activity.actionLink}>
                                    <button className="text-sm sm:text-[15px] font-semibold text-blue-600 dark:text-[#3a8bff] hover:underline">
                                      {activity.actionLabel}
                                    </button>
                                  </Link>
                                  {!isRead && (
                                    <button
                                      onClick={() => markActivityAsRead(activity.id)}
                                      className="text-sm sm:text-[15px] font-normal text-gray-600 dark:text-[#b0b0b0] hover:underline"
                                    >
                                      Mark as read
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Inbox */}
              <Card className="p-4 sm:p-6" id="inbox">
                <Inbox email={user.email} limit={5} />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
