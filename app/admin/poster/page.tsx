"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { X, Info, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminNav } from '@/components/admin/admin-nav'

// Helper function to prevent excessive character repetition
function sanitizeInput(value: string): string {
  // Remove any sequence of the same character repeated more than 5 times
  return value.replace(/(.)\1{5,}/g, (match) => match[0].repeat(5))
}

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
    <AdminNav onLogout={handleLogout}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Poster Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Upload and manage event posters</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Poster Preview (Left Column) */}
          <div>
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

          {/* Right Column: Form Fields */}
          <div className="space-y-4">
                
                {/* Step 1: Poster Upload */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">Step 1: Upload Poster</h3>
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
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 text-lg">Step 2: Additional Settings</h3>
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
                      <h3 className="font-semibold text-green-900 dark:text-green-100 text-lg">Step 3: Poster Content</h3>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">Add details about what will happen (theme, speaker, description, agenda)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Theme</label>
                      <Input 
                        value={posterTheme} 
                        onChange={(e:any) => setPosterTheme(sanitizeInput(e.target.value))} 
                        placeholder="e.g., 'Living in Faith' or 'Prayer and Power'" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Main theme of the event</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Speaker</label>
                      <Input 
                        value={posterSpeaker} 
                        onChange={(e:any) => setPosterSpeaker(sanitizeInput(e.target.value))} 
                        placeholder="e.g., 'Pastor John Doe'" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Name of the main speaker or preacher</p>
                    </div>
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
                        onChange={(e) => setPosterDescription(sanitizeInput(e.target.value))} 
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
                        onChange={(e) => setPosterAgenda(sanitizeInput(e.target.value))} 
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
                        onChange={(e) => setPosterDetails(sanitizeInput(e.target.value))} 
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
      </div>
    </AdminNav>
  )
}
