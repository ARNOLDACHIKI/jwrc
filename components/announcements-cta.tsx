"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AnnouncementsCTA() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data?.user) {
          router.push('/announcements')
          return
        }
      }
      // Not authenticated -> send to login with next
      router.push('/login?next=/announcements')
    } catch (err) {
      router.push('/login?next=/announcements')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="lg" onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
      {loading ? 'Please wait...' : (
        <>
          View Latest Announcements
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  )
}
