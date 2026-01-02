"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { useUser } from "@/contexts/user-context"
import { CheckCircle, Copy } from "lucide-react"

export default function EventSignUpPage() {
  const router = useRouter()
  const { toast } = useToast() // Move hook to top before any conditional returns
  const { user } = useUser()
  const [eventId, setEventId] = useState('')
  const [event, setEvent] = useState<any | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(false)
  const [signupResult, setSignupResult] = useState<any | null>(null)

  // Auto-fill form fields when user is logged in
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name)
      if (user.email) setEmail(user.email)
      if (user.phone) setPhone(user.phone)
    }
  }, [user])

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

  function formatDateRange(e: any) {
    if (!e?.startsAt) return 'TBA'
    const s = new Date(e.startsAt)
    const date = s.toLocaleDateString()
    const time = s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return `${date} • ${time}`
  }

  const copyRef = async (ref: string) => {
    try {
      await navigator.clipboard.writeText(ref)
      toast({ title: 'Reference copied', description: ref })
    } catch (e) {
      console.error(e)
      toast({ title: 'Copy failed' })
    }
  }

  if (!eventId) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)]"
        />
        <div className="relative z-10">
          <MainNav />
          <div className="max-w-2xl mx-auto px-4 py-12">
            <Card className="p-8 text-center">
              <p className="text-lg text-gray-600">Missing event ID</p>
              <Button onClick={() => router.push('/events')} className="mt-4 bg-blue-600">Back to Events</Button>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)]"
      />
      <div className="relative z-10">
        <MainNav />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="p-8 bg-gradient-to-br from-[#f5ebe0] via-white to-[#f0e5d8] border border-[var(--border)] shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Sign up: {event?.title || 'Loading...'}</h2>
            {signupResult ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Thanks {signupResult.name} — you're signed up!</h3>
                    <p className="text-sm text-gray-600">We've recorded your interest for <strong>{event?.title}</strong> on {formatDateRange(event)}{event?.location ? ` at ${event.location}` : ''}.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-700">Reference:</div>
                  <div className="font-mono bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded">{(signupResult.ref || '').slice(0,8)}</div>
                  <button onClick={() => copyRef((signupResult.ref || '').slice(0,8))} className="p-2 rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"><Copy className="w-4 h-4" /></button>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={() => router.push('/events')} className="bg-blue-600 hover:bg-blue-700">Back to Events</Button>
                  <Button variant="outline" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                    <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1" disabled={loading}>{loading ? 'Submitting...' : 'Submit Registration'}</Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/events')}>Cancel</Button>
                  </div>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
