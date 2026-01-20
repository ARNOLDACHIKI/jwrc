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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.95)_0%,rgba(20,33,61,0.94)_18%,rgba(25,45,80,0.92)_38%,rgba(30,55,100,0.92)_56%,rgba(45,75,130,0.94)_76%,rgba(55,90,150,0.96)_90%,rgba(60,100,160,0.97)_100%)]"
      />
      <div className="relative z-10">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Megaphone className="w-10 h-10" />
            Church Announcements
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Stay updated with the latest news and events</p>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p className="text-center text-gray-500">Loading announcements…</p>}
          {!loading && announcements.length === 0 && (
            <p className="text-center text-gray-500">No announcements yet.</p>
          )}

          {announcements.map((announcement) => {
            const Icon = announcement.category === 'Event' ? Calendar : announcement.category === 'Important' ? AlertCircle : Megaphone
            const mainColor = announcement.category === "Important" ? "#dc2626" : announcement.category === "Event" ? "#2563eb" : "#2563eb"

            return (
              <div key={announcement.id} className="perspective-1000" style={{ perspective: '1000px', padding: '20px' }}>
                <div className="event-card-3d border-3 border-[#d4c4b0] dark:border-blue-500 transform-style-preserve-3d transition-all duration-500 hover:rotate-3d shadow-[rgba(100,100,111,0.3)_0px_30px_30px_-10px] bg-[linear-gradient(135deg,#0000_18.75%,#f5ebe0_0_31.25%,#0000_0),repeating-linear-gradient(45deg,#f5ebe0_-6.25%_6.25%,#d4c4b0_0_18.75%)] dark:bg-[linear-gradient(135deg,#0000_18.75%,#334155_0_31.25%,#0000_0),repeating-linear-gradient(45deg,#334155_-6.25%_6.25%,#475569_0_18.75%)] bg-[length:60px_60px] bg-[position:0_0,0_0] bg-[#e8ddd0] dark:bg-[#1e293b] pt-[50px] hover:bg-[position:-100px_100px,-100px_100px]">
                  <div className="content-box bg-gradient-to-br from-[#f5ebe0] via-white to-[#f0e5d8] dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 p-[60px_25px_25px_25px] transform-style-preserve-3d transition-all duration-500">
                    <div className="flex gap-3 items-start mb-3">
                      <div className="shrink-0 transform-translate-z-50">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg" style={{ backgroundColor: mainColor }}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="card-title inline-block text-blue-900 dark:text-white text-xl font-black transition-all duration-500 transform-translate-z-50 hover:transform-translate-z-60">{announcement.title}</h3>
                      </div>
                    </div>
                    <p className="card-content mt-2 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all duration-500 transform-translate-z-30 hover:transform-translate-z-60">{announcement.content}</p>
                    <div className="mt-4 transform-translate-z-30">
                      <span className="inline-block px-2 py-1 text-[9px] font-black uppercase text-white rounded" style={{ backgroundColor: mainColor }}>
                        {announcement.category}
                      </span>
                    </div>
                  </div>
                  <div className="date-box absolute top-[30px] right-[30px] h-[60px] w-[60px] p-2 transform-translate-z-80 shadow-[rgba(100,100,111,0.2)_0px_17px_10px_-10px] border" style={{ backgroundColor: mainColor, borderColor: mainColor }}>
                    <span className="block text-center text-white text-[9px] font-bold">{new Date(announcement.postedAt || Date.now()).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    <span className="block text-center text-white text-xl font-black">{new Date(announcement.postedAt || Date.now()).getDate()}</span>
                  </div>
                </div>
                <style jsx>{`
                  .transform-style-preserve-3d { transform-style: preserve-3d; }
                  .hover\\:rotate-3d:hover { transform: rotate3d(0.5, 1, 0, 30deg); }
                  .transform-translate-z-30 { transform: translate3d(0px, 0px, 30px); }
                  .transform-translate-z-50 { transform: translate3d(0px, 0px, 50px); }
                  .transform-translate-z-60 { transform: translate3d(0px, 0px, 60px); }
                  .transform-translate-z-80 { transform: translate3d(0px, 0px, 80px); }
                  .hover\\:transform-translate-z-60:hover { transform: translate3d(0px, 0px, 60px); }
                `}</style>
              </div>
            )
          })}
        </div>
      </div>
      </div>
    </div>
  )
}
