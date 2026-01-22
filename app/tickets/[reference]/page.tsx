"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Calendar, MapPin, Mail, Phone, User, Clock } from "lucide-react"
import Link from "next/link"

interface TicketData {
  found: boolean
  signup?: {
    id: string
    name: string
    email: string
    phone?: string
    ref: string
    checkedIn: boolean
    checkedInAt?: string
    createdAt: string
  }
  event?: {
    id: string
    title: string
    description?: string
    startsAt: string
    endsAt?: string
    location?: string
  }
  error?: string
}

export default function TicketDetailsPage() {
  const params = useParams()
  const reference = params.reference as string
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const res = await fetch(`/api/tickets/${reference}`)
        const data = await res.json()

        if (res.ok && data.found) {
          setTicketData(data)
          setError("")
        } else {
          setError(data.error || "Ticket not found")
        }
      } catch (err) {
        console.error("Error fetching ticket:", err)
        setError("Failed to load ticket information")
      } finally {
        setLoading(false)
      }
    }

    if (reference) {
      fetchTicketData()
    }
  }, [reference])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainNav />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          <Card className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading ticket information...</p>
            </div>
          </Card>
        ) : error ? (
          <Card className="p-8 border-red-200 dark:border-red-900">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ticket Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <Link href="/events">
                <Button>View Events</Button>
              </Link>
            </div>
          </Card>
        ) : ticketData?.found ? (
          <div className="space-y-6">
            {/* Status Banner */}
            <Card className={`p-6 ${ticketData.signup?.checkedIn ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950' : 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950'}`}>
              <div className="flex items-center gap-3">
                {ticketData.signup?.checkedIn ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h2 className="text-xl font-bold text-green-900 dark:text-green-100">Checked In</h2>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {ticketData.signup.checkedInAt && `on ${formatDate(ticketData.signup.checkedInAt)}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">Valid Ticket</h2>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Not yet checked in</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Event Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Details
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{ticketData.event?.title}</h4>
                  {ticketData.event?.description && (
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{ticketData.event.description}</p>
                  )}
                </div>
                
                {ticketData.event?.startsAt && (
                  <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{formatDate(ticketData.event.startsAt)}</p>
                      {ticketData.event.endsAt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ends: {formatDate(ticketData.event.endsAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {ticketData.event?.location && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <span>{ticketData.event.location}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Attendee Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Attendee Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <User className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{ticketData.signup?.name}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span>{ticketData.signup?.email}</span>
                </div>
                
                {ticketData.signup?.phone && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone className="h-5 w-5 flex-shrink-0" />
                    <span>{ticketData.signup.phone}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reference: <span className="font-mono font-semibold text-gray-900 dark:text-white">{ticketData.signup?.ref}</span>
                  </p>
                  {ticketData.signup?.createdAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Registered: {formatDate(ticketData.signup.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/events" className="flex-1">
                <Button variant="outline" className="w-full">View All Events</Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
