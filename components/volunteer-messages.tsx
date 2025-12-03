"use client"

import { useEffect, useState } from 'react'

export default function VolunteerMessages({ email }: { email: string }) {
  const [apps, setApps] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email) return
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/volunteers?email=${encodeURIComponent(email)}`)
        if (!mounted) return
        const data = await res.json()
        setApps(data?.applications || [])
      } catch (e) {
        console.error(e)
        setApps([])
      } finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [email])

  if (loading) return <div className="text-sm text-gray-500">Loading messages...</div>
  if (!apps || apps.length === 0) return <div className="text-sm text-gray-500">No messages.</div>

  return (
    <div className="space-y-3">
      {apps.map(a => (
        <div key={a.id} className="p-3 rounded border bg-gray-50 dark:bg-slate-900">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-medium">{a.roleTitle || a.roleId}</div>
              <div className="text-sm text-gray-500">Status: {a.status}</div>
            </div>
            <div className="text-sm text-gray-400">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</div>
          </div>
          {a.adminMessage && <div className="mt-2 text-sm text-gray-700">Message: {a.adminMessage}</div>}
        </div>
      ))}
    </div>
  )
}
