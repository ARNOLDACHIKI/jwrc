"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Calendar, MapPin, Mail, Phone, User, Clock, Users } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useUser } from "@/contexts/user-context"

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

interface Attendee {
  id: string
  name: string
  createdAt: string
  image?: string | null
}

export default function TicketDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const reference = params.reference as string
  const { user } = useUser()
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [attendeesLoading, setAttendeesLoading] = useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const [attendeesVisible, setAttendeesVisible] = useState(false)
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawn, setWithdrawn] = useState(false)

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

  const fetchAttendees = async () => {
    if (!ticketData?.event?.id) return

    setAttendeesLoading(true)
    try {
      const res = await fetch(`/api/events/${ticketData.event.id}/attendees`)
      const data = await res.json()

      if (res.ok) {
        setAttendees(data.attendees || [])
        setAttendeesVisible(true)
      } else if (data.requiresRegistration) {
        // User is not registered for this event
        setShowRegisterDialog(true)
      } else if (data.requiresAuth) {
        // User is not logged in
        router.push(`/login?redirect=/tickets/${reference}`)
      } else {
        console.error("Failed to load attendees:", data.error)
      }
    } catch (err) {
      console.error("Error fetching attendees:", err)
    } finally {
      setAttendeesLoading(false)
    }
  }

  const handleViewAttendees = () => {
    if (!user) {
      router.push(`/login?redirect=/tickets/${reference}`)
      return
    }
    fetchAttendees()
  }

  const handleWithdraw = async () => {
    if (!ticketData?.signup?.id) return

    setWithdrawing(true)
    try {
      const res = await fetch('/api/events/signups/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signupId: ticketData.signup.id })
      })

      if (res.ok) {
        setWithdrawn(true)
        setShowWithdrawDialog(false)
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to withdraw from event')
      }
    } catch (err) {
      console.error('Error withdrawing:', err)
      alert('Failed to withdraw from event')
    } finally {
      setWithdrawing(false)
    }
  }

  const isMyTicket = user && ticketData?.signup?.email === user.email

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
            {/* Withdrawn State */}
            {withdrawn && (
              <Card className="p-6 border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950">
                <div className="text-center">
                  <XCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">Registration Withdrawn</h2>
                  <p className="text-yellow-700 dark:text-yellow-300 mb-6">You have successfully withdrawn from this event.</p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/events">
                      <Button className="bg-blue-600 hover:bg-blue-700">View Other Events</Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline">Go to Dashboard</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Status Banner */}
            {!withdrawn && (
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

            {/* Attendees List */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Who's Attending
                </h3>
              </div>

              {!attendeesVisible ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    The full guest list is only accessible to registered guests.
                  </p>
                  <Button 
                    onClick={handleViewAttendees}
                    disabled={attendeesLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {attendeesLoading ? 'Loading...' : 'View Guest List'}
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {attendees.length} {attendees.length === 1 ? 'person' : 'people'} registered
                  </p>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {attendees.map((attendee) => (
                      <div 
                        key={attendee.id} 
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {attendee.image ? (
                            <img 
                              src={attendee.image} 
                              alt={attendee.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                              {attendee.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {attendee.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Register to View Dialog */}
            <AlertDialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Register to View Guest List</AlertDialogTitle>
                  <AlertDialogDescription>
                    The full guest list is only accessible to registered guests.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={() => setShowRegisterDialog(false)}>
                    Got It
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Withdraw Confirmation Dialog */}
            <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Withdraw from Event?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to withdraw your registration for <strong>{ticketData.event?.title}</strong>? This action cannot be undone. You will need to register again if you change your mind.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowWithdrawDialog(false)}
                    disabled={withdrawing}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {withdrawing ? 'Withdrawing...' : 'Yes, Withdraw'}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Link href="/events" className="flex-1">
                  <Button variant="outline" className="w-full">View All Events</Button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              </div>
              
              {/* Withdraw Button - Only show to the ticket owner and if not checked in */}
              {isMyTicket && !ticketData.signup?.checkedIn && (
                <Button 
                  variant="destructive" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => setShowWithdrawDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Not Attending - Withdraw Registration
                </Button>
              )}
            </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
