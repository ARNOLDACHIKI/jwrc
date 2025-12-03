"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SuggestionsInbox({ email }: { email: string }) {
  const [items, setItems] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function fetchItems() {
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch(`/api/suggestions?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      setItems(data?.suggestions || [])
    } catch (e) {
      console.error('Failed to load suggestions for inbox', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    if (!email) return
    fetchItems()
    const iv = setInterval(() => { if (mounted) fetchItems() }, 10000)
    return () => { mounted = false; clearInterval(iv) }
  }, [email])

  if (!email) return <div className="text-sm text-gray-500">No email set</div>
  if (loading) return <div className="text-sm text-gray-500">Loading messages…</div>
  if (!items || items.length === 0) return <div className="text-sm text-gray-500">No messages yet.</div>

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end mb-2">
        <Button size="sm" onClick={() => fetchItems()}>Refresh</Button>
      </div>
      {items.map((s) => (
        <Card key={s.id} className="p-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-700">{s.type} • {new Date(s.createdAt).toLocaleString()}</div>
              <div className="mt-2 text-gray-900 dark:text-white">{s.message}</div>
              {s.adminResponse && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-slate-800 border rounded">
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Response</div>
                  <div className="text-sm text-gray-800 dark:text-gray-200 mt-1">{s.adminResponse}</div>
                  <div className="text-xs text-gray-500 mt-1">Responded: {s.respondedAt ? new Date(s.respondedAt).toLocaleString() : ''}</div>
                </div>
              )}
            </div>
            <div className="ml-4 flex flex-col items-end">
              <div className="text-xs text-gray-500">From: {s.name || s.email}</div>
              {!s.adminResponse && <div className="text-xs text-gray-400 mt-2">No response yet</div>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
