"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Megaphone, Calendar, AlertCircle, Info } from "lucide-react"

type Announcement = {
  id: number
  title: string
  content: string
  category: string
  postedAt?: string
  author?: string
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Check authentication first; unauthenticated users are redirected to login
        const auth = await fetch('/api/auth/me', { credentials: 'include' })
        if (!auth.ok) {
          router.push('/login?next=/announcements')
          return
        }
        const authData = await auth.json().catch(() => ({}))
        if (!authData?.user) {
          router.push('/login?next=/announcements')
          return
        }

        // Authenticated: load announcements
        const res = await fetch('/api/announcements')
        const data = await res.json()
        if (!mounted) return
        setAnnouncements(data?.announcements || [])
      } catch (e) {
        console.error('Failed to load announcements', e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [router])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)]"
      />
      <div className="relative z-10">
      <MainNav />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Church Announcements</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Stay updated with the latest news and events</p>
        </div>

        {/* Announcements */}
        <div className="space-y-6">
          {loading && <p className="text-center text-gray-500">Loading announcements…</p>}
          {!loading && announcements.length === 0 && (
            <p className="text-center text-gray-500">No announcements yet.</p>
          )}

          {announcements.map((announcement) => {
            const Icon = announcement.category === 'Event' ? Calendar : announcement.category === 'Important' ? AlertCircle : Megaphone
            const date = announcement.postedAt ? new Date(announcement.postedAt).toLocaleDateString() : ''
            const bgColor =
              announcement.category === "Important"
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
                : announcement.category === "Event"
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900"
                  : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900"

            return (
              <Card key={announcement.id} className={`group relative p-6 border-l-4 overflow-hidden transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl ${bgColor}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative z-10 flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-opacity-10 bg-blue-600 group-hover:shadow-lg transition-shadow duration-300">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{announcement.title}</h3>
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                          {announcement.category}
                        </span>
                      </div>
                      <time className="text-sm text-gray-500 dark:text-gray-400">{date}</time>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">{announcement.content}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
      </div>
    </div>
  )
}
