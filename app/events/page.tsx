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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.95)_0%,rgba(20,33,61,0.94)_18%,rgba(25,45,80,0.92)_38%,rgba(30,55,100,0.92)_56%,rgba(45,75,130,0.94)_76%,rgba(55,90,150,0.96)_90%,rgba(60,100,160,0.97)_100%)]"
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
              <div key={event.id} className="perspective-1000" style={{ perspective: '1000px', padding: '20px' }}>
                <div className="event-card-3d border-3 border-[#d4c4b0] dark:border-blue-500 transform-style-preserve-3d transition-all duration-500 hover:rotate-3d shadow-[rgba(100,100,111,0.3)_0px_30px_30px_-10px] bg-[linear-gradient(135deg,#0000_18.75%,#f5ebe0_0_31.25%,#0000_0),repeating-linear-gradient(45deg,#f5ebe0_-6.25%_6.25%,#d4c4b0_0_18.75%)] dark:bg-[linear-gradient(135deg,#0000_18.75%,#334155_0_31.25%,#0000_0),repeating-linear-gradient(45deg,#334155_-6.25%_6.25%,#475569_0_18.75%)] bg-[length:60px_60px] bg-[position:0_0,0_0] bg-[#e8ddd0] dark:bg-[#1e293b] pt-[50px] hover:bg-[position:-100px_100px,-100px_100px]">
                  <div className="content-box bg-gradient-to-br from-[#f5ebe0] via-white to-[#f0e5d8] dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 p-[60px_25px_25px_25px] transform-style-preserve-3d transition-all duration-500">
                    <h3 className="card-title inline-block text-blue-900 dark:text-white text-xl font-black transition-all duration-500 transform-translate-z-50 hover:transform-translate-z-60">{event.title}</h3>
                    {event.description && <p className="card-content mt-2 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all duration-500 transform-translate-z-30 hover:transform-translate-z-60">{event.description}</p>}
                    <div className="space-y-2 text-xs mt-4 transform-translate-z-30">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
                        <Calendar className="w-3 h-3" />
                        <span>{date}</span>
                      </div>
                      {time && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
                          <span className="w-3 h-3">🕐</span>
                          <span>{time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => window.location.href = `/events/sign-up?eventId=${event.id}`}
                      className="see-more cursor-pointer mt-4 inline-block font-black text-[9px] uppercase text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3 py-2 transition-all duration-500 transform-translate-z-20 hover:transform-translate-z-60"
                    >
                      <Users className="w-3 h-3 inline mr-1" />
                      Sign Up
                      <ArrowRight className="w-3 h-3 inline ml-1" />
                    </Button>
                  </div>
                  <div className="date-box absolute top-[30px] right-[30px] h-[60px] w-[60px] bg-blue-600 dark:bg-blue-700 border border-blue-700 dark:border-blue-500 p-2 transform-translate-z-80 shadow-[rgba(100,100,111,0.2)_0px_17px_10px_-10px]">
                    <span className="block text-center text-white text-[9px] font-bold">{new Date(event.startsAt || Date.now()).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    <span className="block text-center text-white text-xl font-black">{new Date(event.startsAt || Date.now()).getDate()}</span>
                  </div>
                </div>
                <style jsx>{`
                  .transform-style-preserve-3d { transform-style: preserve-3d; }
                  .hover\\:rotate-3d:hover { transform: rotate3d(0.5, 1, 0, 30deg); }
                  .transform-translate-z-20 { transform: translate3d(0px, 0px, 20px); }
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
