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
  
  // Poster event info (required before upload)
  const [posterEventTitle, setPosterEventTitle] = useState('')
  const [posterEventDate, setPosterEventDate] = useState('')
  const [posterEventTime, setPosterEventTime] = useState('')
  const [posterEventLocation, setPosterEventLocation] = useState('')

  // Poster content info (description, speaker, theme, etc.)
  const [posterDescription, setPosterDescription] = useState('')
  const [posterSpeaker, setPosterSpeaker] = useState('')
  const [posterTheme, setPosterTheme] = useState('')
  const [posterAgenda, setPosterAgenda] = useState('')
  const [posterDetails, setPosterDetails] = useState('')

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
        setPosterEventTitle(data?.settings?.posterEventTitle || '')
        setPosterEventDate(data?.settings?.posterEventDate || '')
        setPosterEventTime(data?.settings?.posterEventTime || '')
        setPosterEventLocation(data?.settings?.posterEventLocation || '')
        setPosterDescription(data?.settings?.posterDescription || '')
        setPosterSpeaker(data?.settings?.posterSpeaker || '')
        setPosterTheme(data?.settings?.posterTheme || '')
        setPosterAgenda(data?.settings?.posterAgenda || '')
        setPosterDetails(data?.settings?.posterDetails || '')
      } catch (e) {
        console.error('Failed to load poster', e)
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
          posterEventTitle,
          posterEventDate,
          posterEventTime,
          posterEventLocation,
          posterDescription: posterDescription || null,
          posterSpeaker: posterSpeaker || null,
          posterTheme: posterTheme || null,
          posterAgenda: posterAgenda || null,
          posterDetails: posterDetails || null
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
              posterEventLocation,
              posterDescription: posterDescription || null,
              posterSpeaker: posterSpeaker || null,
              posterTheme: posterTheme || null,
              posterAgenda: posterAgenda || null,
              posterDetails: posterDetails || null
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

        <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Manage Poster</h2>
            
            {/* Main Grid: Preview on Left, Form on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Poster Preview (Larger) */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Current Poster</h3>
                  {posterUrl ? (
                    <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-lg">
                      <img 
                        src={posterUrl} 
                        alt={posterAlt || 'Poster'} 
                        className="w-full h-auto object-contain" 
                      />
                    </div>
                  ) : (
                    <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No poster set yet</p>
                    </Card>
                  )}
                  {posterUrl && (
                    <Button 
                      onClick={removePoster}
                      disabled={loading}
                      variant="outline"
                      className="w-full mt-3 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Remove Poster
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column: Form Fields (2 columns) */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Step 1: Event Information */}
                <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                      <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 dark:text-amber-100 text-lg">Step 1: Event Information</h3>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Fill in all event details before uploading a poster</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Step 2: Poster Upload */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">Step 2: Upload Poster</h3>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Optimal Size: 1920x1080px (16:9 ratio) or 1200x630px</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Poster URL or File</label>
                      <Input 
                        id="poster-url-input" 
                        value={posterUrl} 
                        onChange={(e:any) => setPosterUrl(e.target.value)} 
                        placeholder="https://.../poster.jpg" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Paste an image URL or upload from device. Files stored in <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">/public/uploads</code></p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Choose File</label>
                      <input 
                        ref={inputRef} 
                        type="file" 
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleFile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white file:mr-3 file:px-3 file:py-2 file:bg-blue-600 file:hover:bg-blue-700 file:text-white file:border-0 file:rounded cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {uploading ? 'Uploading...' : 'Select an image file to upload'}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Step 3: Additional Settings */}
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 text-lg">Step 3: Additional Settings</h3>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Configure metadata and expiration</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Alt Text (Accessibility)</label>
                      <Input 
                        value={posterAlt} 
                        onChange={(e:any) => setPosterAlt(e.target.value)} 
                        placeholder="Short description of the poster" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Helps with accessibility and SEO</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Expiration (Optional)</label>
                      <input
                        type="datetime-local"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={posterExpiresAt ? new Date(posterExpiresAt).toISOString().slice(0,16) : ''}
                        onChange={(e) => setPosterExpiresAt(e.target.value ? new Date(e.target.value).toISOString() : null)}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Poster will be automatically removed after this date</p>
                    </div>
                  </div>
                </Card>

                {/* Step 4: Poster Content Details */}
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <Info className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-100 text-lg">Step 4: Poster Content</h3>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">Add details about what will happen (theme, speaker, description, agenda)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Theme</label>
                      <Input 
                        value={posterTheme} 
                        onChange={(e:any) => setPosterTheme(e.target.value)} 
                        placeholder="e.g., 'Living in Faith' or 'Prayer and Power'" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Main theme of the event</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Key Speaker</label>
                      <Input 
                        value={posterSpeaker} 
                        onChange={(e:any) => setPosterSpeaker(e.target.value)} 
                        placeholder="e.g., 'Pastor John Doe' or 'Rev. Sarah Smith'" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Name of the main speaker or preacher</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
                      <textarea 
                        value={posterDescription} 
                        onChange={(e) => setPosterDescription(e.target.value)} 
                        placeholder="Brief description of the event..." 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">About what the event is about</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Agenda</label>
                      <textarea 
                        value={posterAgenda} 
                        onChange={(e) => setPosterAgenda(e.target.value)} 
                        placeholder="e.g., '9:00 - Worship\n10:00 - Message\n11:00 - Fellowship'" 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Timeline of events and activities</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Additional Details</label>
                      <textarea 
                        value={posterDetails} 
                        onChange={(e) => setPosterDetails(e.target.value)} 
                        placeholder="Any other important information..." 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dress code, requirements, or other details</p>
                    </div>
                  </div>
                </Card>

                {/* Save Button */}
                <Button 
                  onClick={save}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold"
                >
                  {loading ? 'Saving...' : 'Save All Changes'}
                </Button>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Upload History</h2>
            {gallery.length === 0 ? (
              <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">No posters uploaded yet. Upload your first poster above!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {gallery.map(f => (
                  <div key={f.name} className="group border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all">
                    <div className="aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden">
                      <img src={f.url} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-2 space-y-2">
                      <Button 
                        size="sm" 
                        onClick={async () => {
                          setPosterUrl(f.url)
                          await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ posterUrl: f.url, posterAlt: f.name }) })
                          toast({ title: 'Set', description: 'Poster set from gallery.' })
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1"
                      >
                        Use
                      </Button>
                      <a href={f.url} target="_blank" rel="noreferrer" className="block text-center text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        View
                      </a>
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
