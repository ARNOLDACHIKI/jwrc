"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type InboxItem = {
  id: string
  type: 'suggestion' | 'volunteer' | 'announcement'
  title: string
  body: string
  when: string
}

export default function Inbox({ email }: { email?: string | null }) {
  const [items, setItems] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(false)

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

  if (!email) return <div className="text-sm text-gray-500">No email configured</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Inbox</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => fetchAll()} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</Button>
        </div>
      </div>

      {items.length === 0 && <div className="text-sm text-gray-500">No messages yet.</div>}

      <div className="space-y-3">
        {items.map((it) => (
          <Card key={it.id} className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-700 font-semibold">{it.title}</div>
                <div className="text-sm text-gray-600 mt-1">{it.body}</div>
                <div className="text-xs text-gray-400 mt-2">{it.when ? new Date(it.when).toLocaleString() : ''}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
