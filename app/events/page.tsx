"use client"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

type EventItem = {
  id: string
  title: string
  description?: string | null
  location?: string | null
  startsAt?: string | null
  endsAt?: string | null
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [total, setTotal] = useState(0)
  const [futureOnly, setFutureOnly] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const q = new URLSearchParams()
        q.set('page', String(page))
        q.set('pageSize', String(pageSize))
        if (futureOnly) q.set('futureOnly', 'true')
        const res = await fetch('/api/events?' + q.toString())
        const data = await res.json()
        if (!mounted) return
        setEvents(data?.events || [])
        setTotal(data?.total || 0)
      } catch (e) {
        console.error('Failed to load events', e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [page, pageSize, futureOnly])

  function formatDateRange(item: EventItem) {
    if (!item.startsAt) return { date: 'TBA', time: '' }
    const s = new Date(item.startsAt)
    const date = s.toLocaleDateString()
    const startTime = s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (item.endsAt) {
      const e = new Date(item.endsAt)
      const endTime = e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return { date, time: `${startTime} - ${endTime}` }
    }
    return { date, time: startTime }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)]"
      />
      <div className="relative z-10">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Calendar className="w-10 h-10" />
            Church Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Join us for worship, fellowship, and service</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between max-w-6xl mx-auto px-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" checked={futureOnly} onChange={(e) => { setFutureOnly(e.target.checked); setPage(1) }} />
              <span>Show future events only</span>
            </label>
            <label className="text-sm text-gray-700 dark:text-gray-300">Page size:
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }} className="ml-2 px-2 py-1 border rounded">
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </label>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {total > 0 && (
              <span>Showing {(page - 1) * pageSize + 1}–{Math.min(total, page * pageSize)} of {total}</span>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p className="text-center col-span-full">Loading events…</p>}
          {!loading && events.length === 0 && <p className="text-center col-span-full">No upcoming events</p>}
          {events.map((event) => {
            const { date, time } = formatDateRange(event)
            return (
              <Card key={event.id} className="group relative p-6 h-full overflow-hidden bg-gradient-to-br from-[#f5ebe0] via-white to-[#f0e5d8] hover:from-[#e8ddd0] hover:via-[#f5ebe0] hover:to-[#e0d5c8] transition-all duration-500 cursor-pointer border border-[var(--border)] shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <h3 className="text-xl font-bold text-blue-900 dark:text-white group-hover:text-blue-700">{event.title}</h3>
                  {event.description && <p className="text-gray-600 dark:text-gray-400 text-sm">{event.description}</p>}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{date}</span>
                    </div>
                    {time && (
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="w-4 h-4">🕐</span>
                        <span>{time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Prev</button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">Page {page}</span>
          <button disabled={page * pageSize >= total} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Next</button>
        </div>
      </div>
      </div>
    </div>
  )
}
