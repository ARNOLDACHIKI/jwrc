"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { useUser } from "@/contexts/user-context"
import { CheckCircle, Copy, Calendar, Clock, MapPin, Info } from "lucide-react"
import QRCode from 'qrcode'

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
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  
  // Poster content state
  const [posterContent, setPosterContent] = useState<{ description: string | null, agenda: string | null, details: string | null, speaker: string | null, theme: string | null } | null>(null)

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

        // Load poster content
        try {
          const settingsRes = await fetch('/api/settings')
          const settingsData = await settingsRes.json()
          if (settingsData?.settings) {
            setPosterContent({
              description: settingsData.settings.posterDescription,
              agenda: settingsData.settings.posterAgenda,
              details: settingsData.settings.posterDetails,
              speaker: settingsData.settings.posterSpeaker,
              theme: settingsData.settings.posterTheme
            })
          }
        } catch (e) {
          console.error('Failed to load poster content', e)
        }
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

  // Generate QR code when signup completes
  useEffect(() => {
    if (signupResult) {
      // Create URL that links to ticket details page
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const ticketUrl = `${baseUrl}/tickets/${signupResult.ref}`
      
      QRCode.toDataURL(ticketUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl).catch(console.error)
    }
  }, [signupResult])

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
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.95)_0%,rgba(20,33,61,0.94)_18%,rgba(25,45,80,0.92)_38%,rgba(30,55,100,0.92)_56%,rgba(45,75,130,0.94)_76%,rgba(55,90,150,0.96)_90%,rgba(60,100,160,0.97)_100%)]"
      />
      <div className="relative z-10">
        <MainNav />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Card className="p-8 bg-gradient-to-br from-[#f5ebe0] via-white to-[#f0e5d8] dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-[var(--border)] dark:border-white/10 shadow-xl">
            <h2 className="text-3xl font-bold mb-8 text-blue-900 dark:text-white">Register for {event?.title || 'event'}</h2>
            
            {/* Event Information Card */}
            {event && (
              <Card className="p-6 mb-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 dark:text-amber-100 text-lg">Event Details</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 dark:bg-slate-800/30 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">Date</p>
                      <p className="text-gray-900 dark:text-white font-medium">{event?.startsAt ? new Date(event.startsAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBA'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">Time</p>
                      <p className="text-gray-900 dark:text-white font-medium">{event?.startsAt ? new Date(event.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'TBA'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wide">Location</p>
                      <p className="text-gray-900 dark:text-white font-medium">{event?.location || 'TBA'}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Poster Content Card */}
            {posterContent && (posterContent.theme || posterContent.speaker || posterContent.description || posterContent.agenda || posterContent.details) && (
              <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg mb-4">What to Expect</h3>
                
                {/* Theme */}
                {posterContent.theme && (
                  <div className="mb-4 pb-4 border-b-2 border-blue-200 dark:border-blue-800">
                    <h4 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                      {posterContent.theme}
                    </h4>
                  </div>
                )}

                {/* Speaker */}
                {posterContent.speaker && (
                  <div className="mb-4 p-3 rounded-lg bg-white/60 dark:bg-slate-800/30 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">👤 Speaker</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{posterContent.speaker}</p>
                  </div>
                )}

                {/* Description */}
                {posterContent.description && (
                  <div className="mb-4 p-3 rounded-lg bg-white/60 dark:bg-slate-800/30 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">📝 About</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {posterContent.description}
                    </p>
                  </div>
                )}

                {/* Agenda */}
                {posterContent.agenda && (
                  <div className="mb-4 p-3 rounded-lg bg-white/60 dark:bg-slate-800/30 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">📋 Agenda</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {posterContent.agenda}
                    </p>
                  </div>
                )}

                {/* Details */}
                {posterContent.details && (
                  <div className="p-3 rounded-lg bg-white/60 dark:bg-slate-800/30 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">✨ Details</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {posterContent.details}
                    </p>
                  </div>
                )}
              </Card>
            )}
            
            {!user && (
              <div className="mb-6 rounded-lg bg-white/70 dark:bg-slate-800/60 p-4 border border-white/30 dark:border-white/10">
                <p className="text-gray-700 dark:text-gray-300">You need to be logged in to register for this event.</p>
                <div className="mt-4 flex gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push(`/login?redirect=/events/sign-up?eventId=${encodeURIComponent(eventId)}`)}>Login to continue</Button>
                  <Button variant="outline" onClick={() => router.push('/signup')}>Create account</Button>
                </div>
              </div>
            )}
            
            {signupResult ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thanks {signupResult.name} — you're signed up!</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">We've recorded your interest for <strong>{event?.title}</strong> on {formatDateRange(event)}{event?.location ? ` at ${event.location}` : ''}.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-700 dark:text-gray-300">Reference:</div>
                  <div className="font-mono bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded text-gray-900 dark:text-white">{(signupResult.ref || '').slice(0,8)}</div>
                  <button onClick={() => copyRef((signupResult.ref || '').slice(0,8))} className="p-2 rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"><Copy className="w-4 h-4 text-gray-700 dark:text-gray-300" /></button>
                </div>

                {/* QR ticket */}
                {qrCodeUrl && (
                  <div className="mt-4 flex flex-col items-center gap-3">
                    <img src={qrCodeUrl} alt="Your ticket QR code" className="w-48 h-48 bg-white p-2 rounded shadow" />
                    <a href={qrCodeUrl} download={`ticket_${(signupResult.ref||'').slice(0,8)}.png`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Download ticket (PNG)</a>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scan this QR code to view your ticket details and attendee information.</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <Button onClick={() => router.push('/events')} className="bg-blue-600 hover:bg-blue-700">Back to Events</Button>
                  <Button variant="outline" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!user) { toast({ title: 'Login required', description: 'Please login to register.' }); return }
                const clientErrors: Record<string,string> = {}
                if (Object.keys(clientErrors).length) { setErrors(clientErrors); return }
                setLoading(true)
                try {
                  const res = await fetch('/api/events/signups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId }) })
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
                    <input className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={name} onChange={(e) => setName(e.target.value)} readOnly={!!user} />
                    {user && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-filled from your profile</p>}
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!!user} />
                    {user && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-filled from your profile</p>}
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone (optional)</label>
                    <input type="tel" className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={phone} onChange={(e) => setPhone(e.target.value)} readOnly={!!user} />
                    {user && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-filled from your profile</p>}
                  </div>
                  {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1" disabled={loading || !user}>{loading ? 'Submitting...' : 'Submit Registration'}</Button>
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
