"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, Copy } from "lucide-react"

export default function EventSignUpPage() {
  const router = useRouter()
  const [eventId, setEventId] = useState('')

  const [event, setEvent] = useState<any | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(false)
  const [signupResult, setSignupResult] = useState<any | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const sp = new URLSearchParams(window.location.search)
        setEventId(sp.get('eventId') || '')
      } catch (e) {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    if (!eventId) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/events?page=1&pageSize=50`)
        const data = await res.json()
        if (!mounted) return
        const found = data?.events?.find((e:any) => e.id === eventId)
        setEvent(found || null)
      } catch (e) {
        console.error(e)
      }
    })()
    return () => { mounted = false }
  }, [eventId])

  if (!eventId) return <div className="p-8">Missing event id</div>

  function formatDateRange(e: any) {
    if (!e?.startsAt) return 'TBA'
    const s = new Date(e.startsAt)
    const date = s.toLocaleDateString()
    const time = s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return `${date} • ${time}`
  }

  const { toast } = useToast()
  const copyRef = async (ref: string) => {
    try {
      await navigator.clipboard.writeText(ref)
      toast({ title: 'Reference copied', description: ref })
    } catch (e) {
      console.error(e)
      toast({ title: 'Copy failed' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-2">Sign up: {event?.title || eventId}</h2>
          {signupResult ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold">Thanks {signupResult.name} — you're signed up!</h3>
                  <p className="text-sm text-gray-600">We've recorded your interest for <strong>{event?.title}</strong> on {formatDateRange(event)}{event?.location ? ` at ${event.location}` : ''}.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">Reference:</div>
                <div className="font-mono bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded">{(signupResult.ref || '').slice(0,8)}</div>
                <button onClick={() => copyRef((signupResult.ref || '').slice(0,8))} className="p-2 rounded bg-gray-100 dark:bg-slate-800"><Copy className="w-4 h-4" /></button>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => router.push('/events')} className="bg-blue-600">Back to events</Button>
                <Button variant="outline" onClick={() => router.push(`/events`)}>View event</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault()
              const clientErrors: Record<string,string> = {}
              if (!name) clientErrors.name = 'Name required'
              if (!email) clientErrors.email = 'Email required'
              if (Object.keys(clientErrors).length) { setErrors(clientErrors); return }
              setLoading(true)
              try {
                const res = await fetch('/api/events/signups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId, name, email, phone }) })
                if (res.ok) {
                  const data = await res.json()
                  setSignupResult(data.signup)
                } else {
                  const data = await res.json().catch(() => ({}))
                  setErrors(data?.errors || { form: data?.error || 'Failed' })
                }
              } catch (err) {
                setErrors({ form: 'Failed to submit' })
              } finally { setLoading(false) }
            }}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm">Name</label>
                  <input className="w-full px-3 py-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm">Email</label>
                  <input className="w-full px-3 py-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm">Phone (optional)</label>
                  <input className="w-full px-3 py-2 border rounded" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600" disabled={loading}>{loading ? 'Submitting...' : 'Submit interest'}</Button>
                  <Button variant="outline" onClick={() => router.push('/events')}>Cancel</Button>
                </div>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
