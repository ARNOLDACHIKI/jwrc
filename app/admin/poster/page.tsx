"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { X, Info, Users, BarChart3, MessageSquare, Calendar, Bell, Settings, LogOut, Activity, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminPosterPage() {
  const router = useRouter()
  const [posterUrl, setPosterUrl] = useState('')
  const [posterAlt, setPosterAlt] = useState('')
  const [posterExpiresAt, setPosterExpiresAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [gallery, setGallery] = useState<Array<any>>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [adminEmail, setAdminEmail] = useState('')

  // Event and attendees state
  const [upcomingEvent, setUpcomingEvent] = useState<any | null>(null)
  const [eventAttendees, setEventAttendees] = useState<Array<any>>([])
  const [showAttendees, setShowAttendees] = useState(true)
  
  // Poster event info (required before upload)
  const [posterEventTitle, setPosterEventTitle] = useState('')
  const [posterEventDate, setPosterEventDate] = useState('')
  const [posterEventTime, setPosterEventTime] = useState('')
  const [posterEventLocation, setPosterEventLocation] = useState('')

  // Verify admin access
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        const data = await res.json()
        if (!data?.user || data.user.role !== 'admin') {
          router.push('/admin/login')
          return
        }
        setAdminEmail(data.user.email)
      } catch (e) {
        router.push('/admin/login')
      }
    })()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      router.push('/admin/login')
    } catch (e) {
      console.error('Logout failed', e)
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/settings')
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        setPosterUrl(data?.settings?.posterUrl || '')
        setPosterAlt(data?.settings?.posterAlt || '')
        setPosterExpiresAt(data?.settings?.posterExpiresAt || null)
        setShowAttendees(data?.settings?.showEventAttendees !== false)
        setPosterEventTitle(data?.settings?.posterEventTitle || '')
        setPosterEventDate(data?.settings?.posterEventDate || '')
        setPosterEventTime(data?.settings?.posterEventTime || '')
        setPosterEventLocation(data?.settings?.posterEventLocation || '')
      } catch (e) {
        console.error('Failed to load poster', e)
      }
      
      // Load upcoming events
      try {
        const eventsRes = await fetch('/api/events?futureOnly=true')
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          const events = eventsData.events || []
          if (events.length > 0) {
            const event = events.sort((a: any, b: any) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0]
            setUpcomingEvent(event)
            
            // Load attendees for this event
            try {
              const attendeesRes = await fetch(`/api/events/${event.id}/signups`)
              if (attendeesRes.ok) {
                const attendeesData = await attendeesRes.json()
                setEventAttendees(attendeesData.signups || [])
              }
            } catch (e) {
              console.error('Failed to load attendees', e)
            }
          }
        }
      } catch (e) {
        console.error('Failed to load events', e)
      }
    })()
    loadGallery()
    return () => { mounted = false }
  }, [])

  async function save() {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          posterUrl: posterUrl || null, 
          posterAlt: posterAlt || null, 
          posterExpiresAt: posterExpiresAt || null,
          showEventAttendees: showAttendees,
          posterEventTitle,
          posterEventDate,
          posterEventTime,
          posterEventLocation
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: 'Saved', description: 'Poster settings updated.' })
      } else {
        console.error('Failed to save', data)
        toast({ title: 'Error', description: 'Failed to save poster settings.' })
      }
    } catch (e) {
      console.error(e)
      toast({ title: 'Error', description: 'Failed to save poster settings.' })
    } finally {
      setLoading(false)
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate event info is filled before allowing upload
    if (!posterEventTitle || !posterEventDate || !posterEventTime || !posterEventLocation) {
      toast({ 
        title: 'Event Info Required', 
        description: 'Please fill in all event information before uploading a poster.',
        variant: 'destructive'
      })
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const dataUrl = reader.result as string
        
        // Upload the image directly
        const res = await fetch('/api/admin/poster/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl, filename: file.name })
        })

        let data: any = null
        try { data = await res.json() } catch (jsonErr) { console.error('Failed to parse upload response', jsonErr) }

        if (!res.ok) {
          console.error('Upload endpoint returned error', res.status, data)
          toast({ title: 'Error', description: `Upload failed (${res.status}).` })
          setUploading(false)
          if (inputRef.current) inputRef.current.value = ''
          return
        }

        if (!data || !data.url) {
          console.error('Upload succeeded but no url returned', data)
          toast({ title: 'Error', description: 'Upload succeeded but no URL returned.' })
          setUploading(false)
          if (inputRef.current) inputRef.current.value = ''
          return
        }

        // success
        setPosterUrl(data.url)
        
        // attempt to save settings
        try {
          const saveRes = await fetch('/api/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              posterUrl: data.url, 
              posterAlt, 
              posterExpiresAt: posterExpiresAt || null,
              posterEventTitle,
              posterEventDate,
              posterEventTime,
              posterEventLocation
            })
          })
          if (!saveRes.ok) {
            const saveBody = await saveRes.text().catch(()=>null)
            console.error('Failed to save poster settings', saveRes.status, saveBody)
            toast({ title: 'Uploaded', description: 'Uploaded but failed to save poster settings.' })
          } else {
            toast({ title: 'Uploaded', description: 'Poster uploaded and saved successfully!' })
          }
        } catch (saveErr) {
          console.error('Error saving poster settings', saveErr)
          toast({ title: 'Uploaded', description: 'Uploaded but failed to save poster settings.' })
        }

        // refresh gallery
        loadGallery()
        if (inputRef.current) inputRef.current.value = ''
        setUploading(false)
      }
      reader.onerror = (ev) => {
        console.error('FileReader error', ev)
        toast({ title: 'Error', description: 'Failed to read file.' })
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ''
      }
    } catch (err) {
      console.error('Upload handler error', err)
      const errorMessage = err instanceof Error ? err.message : 'Upload failed.'
      toast({ title: 'Error', description: errorMessage })
      setUploading(false)
    }
  }

  async function loadGallery() {
    try {
      const res = await fetch('/api/admin/poster/list')
      if (!res.ok) return
      const data = await res.json()
      setGallery(data.files || [])
    } catch (e) {
      console.error('Failed to load gallery', e)
    }
  }

  async function removePoster() {
    setLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posterUrl: null, posterAlt: null, posterExpiresAt: null }),
      })
      if (res.ok) {
        setPosterUrl('')
        setPosterAlt('')
        setPosterExpiresAt(null)
        toast({ title: 'Removed', description: 'Poster cleared.' })
      } else {
        toast({ title: 'Error', description: 'Failed to remove poster.' })
      }
    } catch (e) {
      console.error('Failed to remove poster', e)
      toast({ title: 'Error', description: 'Failed to remove poster.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Poster Admin</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-70px)]">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-0"} bg-gray-900 text-white overflow-y-auto transition-all duration-300 hidden lg:block`}
        >
          <nav className="p-6 space-y-2">
            {[
              { label: "Overview", icon: BarChart3, href: "/admin/dashboard" },
              { label: "Announcements", icon: MessageSquare, href: "/admin/dashboard?tab=announcements" },
              { label: "Events", icon: Calendar, href: "/admin/events" },
              { label: "Volunteers", icon: Users, href: "/admin/dashboard?tab=volunteers" },
              { label: "Suggestions", icon: MessageSquare, href: "/admin/dashboard?tab=suggestions" },
              { label: "Reminders", icon: Bell, href: "/admin/reminders" },
              { label: "Settings", icon: Settings, href: "/admin/dashboard?tab=settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-gray-800"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* Poster Size Info Card */}
          <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Recommended Poster Dimensions</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Optimal Size:</strong> 1920x1080px (16:9 ratio) or 1200x630px for better web performance
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  The cropper uses a 16:9 aspect ratio to ensure your poster displays perfectly on the dashboard without cutting off important details. 
                  You can zoom and rotate the image to frame your content optimally.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Event Information Card */}
        <Card className="p-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <div className="flex gap-2 items-center mb-4">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">Event Information</h3>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-300 mb-4">
            Fill in all event details before uploading a poster. This ensures the signup form displays correct information.
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Event Title</label>
              <Input 
                value={posterEventTitle} 
                onChange={(e:any) => setPosterEventTitle(e.target.value)} 
                placeholder="Sunday Service" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Event Date</label>
              <Input 
                value={posterEventDate} 
                onChange={(e:any) => setPosterEventDate(e.target.value)} 
                placeholder="Mon, Feb 2" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Event Time</label>
              <Input 
                value={posterEventTime} 
                onChange={(e:any) => setPosterEventTime(e.target.value)} 
                placeholder="9:00 AM" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Event Location</label>
              <Input 
                value={posterEventLocation} 
                onChange={(e:any) => setPosterEventLocation(e.target.value)} 
                placeholder="JWRC Main Hall, Juja" 
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Poster Image</label>
          <Input id="poster-url-input" value={posterUrl} onChange={(e:any) => setPosterUrl(e.target.value)} placeholder="https://.../poster.jpg" />
          <p className="text-xs text-gray-500 mt-2">You can paste an image URL or upload a file from your device. Uploaded files are stored in <code>/public/uploads</code>.</p>
          <div className="mt-3">
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} />
            <p className="text-xs text-gray-500 mt-2">Select an image file from your device. It will be uploaded to <code>/public/uploads</code>.</p>
          </div>
        </Card>

        <Card className="p-6 mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Alt text</label>
          <Input value={posterAlt} onChange={(e:any) => setPosterAlt(e.target.value)} placeholder="Short description for accessibility" />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Expiration (optional)</label>
            <input
              type="datetime-local"
              className="w-full rounded border px-3 py-2 bg-[var(--card)]"
              value={posterExpiresAt ? new Date(posterExpiresAt).toISOString().slice(0,16) : ''}
              onChange={(e) => setPosterExpiresAt(e.target.value ? new Date(e.target.value).toISOString() : null)}
            />
            <p className="text-xs text-gray-500 mt-2">Set a date/time after which the poster will be removed automatically.</p>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAttendees}
                onChange={(e) => setShowAttendees(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Allow attendees to see who else signed up</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">When enabled, users who signed up can see the list of other attendees</p>
          </div>
        </Card>
      </div>

        <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Poster Preview & Event Attendees</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Poster Preview */}
              <div className="lg:col-span-2">
                {posterUrl ? (
                  <div className="border rounded overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    <img 
                      src={posterUrl} 
                      alt={posterAlt || 'Poster'} 
                      className="w-full h-auto max-h-[400px] object-contain" 
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No poster set.</p>
                )}
              </div>

              {/* Event Attendees Card */}
              {upcomingEvent && (
                <Card className="flex flex-col bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-2 border-green-200 dark:border-green-800 shadow-lg">
                  <div className="p-4 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                          Attendees ({eventAttendees.length})
                        </h3>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="mb-3 pb-3 border-b border-green-100 dark:border-green-900/30">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Event: <span className="text-green-600 dark:text-green-400">{upcomingEvent.title}</span>
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(upcomingEvent.startsAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Attendees List */}
                    <div className="flex-1 overflow-y-auto space-y-2">
                      {eventAttendees.length > 0 ? (
                        eventAttendees.map((attendee: any, idx: number) => (
                          <div key={attendee.id || idx} className="p-2 bg-white/60 dark:bg-slate-700/50 rounded border border-green-100 dark:border-green-900/30">
                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {attendee.name || 'Unknown'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
                          <p className="text-xs text-center">No one has signed up yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Uploaded Posters</h2>
            {gallery.length === 0 ? (
              <p className="text-sm text-gray-500">No uploaded posters yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {gallery.map(f => (
                  <div key={f.name} className="border rounded overflow-hidden p-1 bg-white/5">
                    <img src={f.url} alt={f.name} className="w-full h-28 object-cover" />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={async () => {
                        setPosterUrl(f.url)
                        await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ posterUrl: f.url, posterAlt: f.name }) })
                        toast({ title: 'Set', description: 'Poster set from gallery.' })
                      }}>Use</Button>
                      <a href={f.url} target="_blank" rel="noreferrer" className="text-sm text-blue-500">Open</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
