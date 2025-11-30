"use client"
import { useEffect, useState } from "react"
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

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
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
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
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
              <Card key={announcement.id} className={`p-6 border-l-4 ${bgColor}`}>
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-opacity-10 bg-blue-600">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
  )
}
