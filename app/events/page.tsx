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
  const [futureOnly, setFutureOnly] = useState(true)

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
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
            const dt = formatDateRange(event)
            return (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition flex flex-col">
                <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600"></div>

                <div className="p-6 flex-1 flex flex-col">
                  <span className="inline-block w-fit px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full mb-3">Event</span>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{event.title}</h3>

                  <div className="space-y-3 mb-4 flex-1">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium text-gray-900 dark:text-white">{dt.date}</p>
                        <p className="text-xs mt-1">{dt.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.location || '—'}</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <a href={`/events/sign-up?eventId=${event.id}`} className="text-sm text-blue-600 hover:underline">I'm interested — sign up</a>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    {event.description || ''}
                  </p>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
        </div>

        {/* Pagination */}
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-center gap-4">
          <Button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
          <div className="text-sm text-gray-700 dark:text-gray-300">Page {page} / {Math.max(1, Math.ceil(total / pageSize))}</div>
          <Button disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
    </div>
  )
}
