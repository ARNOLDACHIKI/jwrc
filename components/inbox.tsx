"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type InboxItem = {
  id: string
  type: 'suggestion' | 'volunteer' | 'announcement'
  title: string
  body: string
  when: string
}

export default function Inbox({ email, limit = 5 }: { email?: string | null, limit?: number }) {
  const [items, setItems] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)

  async function fetchAll() {
    if (!email) return
    setLoading(true)
    try {
      // fetch suggestions for user
      const [sRes, vRes, aRes] = await Promise.all([
        fetch(`/api/suggestions?email=${encodeURIComponent(email)}`),
        fetch(`/api/volunteers?email=${encodeURIComponent(email)}`),
        fetch(`/api/announcements`),
      ])

      const [sData, vData, aData] = await Promise.all([sRes.json().catch(()=>({})), vRes.json().catch(()=>({})), aRes.json().catch(()=>({}))])

      const sItems: InboxItem[] = (sData?.suggestions || []).map((s: any) => ({
        id: `s-${s.id}`,
        type: 'suggestion',
        title: `${s.type} • ${s.name || s.email}`,
        body: s.adminResponse ? `Response: ${s.adminResponse}` : s.message || '',
        when: s.respondedAt || s.createdAt || '',
      }))

      const vItems: InboxItem[] = (vData?.applications || []).map((v: any) => ({
        id: `v-${v.id}`,
        type: 'volunteer',
        title: `Volunteer • ${v.roleTitle || v.roleId || ''}`,
        body: v.adminMessage || `Status: ${v.status || ''}`,
        when: v.respondedAt || v.createdAt || '',
      }))

      const aItems: InboxItem[] = (aData?.announcements || []).map((a: any) => ({
        id: `a-${a.id}`,
        type: 'announcement',
        title: a.title || 'Announcement',
        body: a.content || '',
        when: a.postedAt || a.createdAt || '',
      }))

      const all = [...sItems, ...vItems, ...aItems]
      all.sort((a,b) => (new Date(b.when).getTime() || 0) - (new Date(a.when).getTime() || 0))
      setItems(all)
    } catch (e) {
      console.error('Failed to load inbox', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    if (!email) return
    fetchAll()
    const iv = setInterval(() => { if (mounted) fetchAll() }, 10000)
    return () => { mounted = false; clearInterval(iv) }
  }, [email])

  if (!email) return <div className="text-sm text-gray-500 dark:text-gray-400">No email configured</div>

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

  const total = items.length
  const perPage = Math.max(1, limit || 5)
  const pages = Math.max(1, Math.ceil(total / perPage))
  const startIndex = total === 0 ? 0 : page * perPage + 1
  const endIndex = Math.min(total, (page + 1) * perPage)

  // Reset page when items change (e.g., on refresh) to avoid empty pages
  useEffect(() => {
    setPage(0)
  }, [items])

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-white">Inbox</h3>
        <Button size="sm" onClick={() => fetchAll()} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      {items.length === 0 && (
        <div className="p-6 sm:p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No messages yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {items.slice(page * perPage, (page + 1) * perPage).map((it) => (
          <div
            key={it.id}
            className="bg-gray-50 dark:bg-[#1e1e1e] rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl dark:shadow-[1em_1em_1em_rgba(0,0,0,0.2),-0.75em_-0.75em_1em_rgba(255,255,255,0.05)] border border-gray-200 dark:border-[#2a2a2a] hover:border-blue-300 dark:hover:border-[#3a8bff] hover:bg-gray-100 dark:hover:bg-[#2a2a2a]"
          >
            <div className="p-4 sm:p-5 flex gap-3">
              {/* Status Indicator */}
              <div className="flex-shrink-0 pt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-500"></div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-3.5">
                  {/* Text Content */}
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-[#e0e0e0]">
                      {it.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#b0b0b0] line-clamp-2">
                      {it.body}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a0a0a0]">
                      {it.when ? formatTime(new Date(it.when)) : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">Showing {startIndex}–{endIndex} of {total} messages.</p>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page <= 0} className="px-3">
              Previous
            </Button>
            <Button size="sm" onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page >= pages - 1} className="px-3">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
