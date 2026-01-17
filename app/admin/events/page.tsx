"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Mail, CheckCircle, Clock, Users, Calendar } from "lucide-react"

interface EventSignup {
  id: string
  event_id: string
  name: string
  email: string
  phone?: string
  ref: string
  ticket_sent: boolean
  checked_in: boolean
  checked_in_at?: string
  created_at: string
}

interface Event {
  id: string
  title: string
  startsAt: string
  location?: string
}

export default function AdminEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [signups, setSignups] = useState<EventSignup[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      fetchSignups(selectedEvent)
    }
  }, [selectedEvent])

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events")
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const fetchSignups = async (eventId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/events/signups?eventId=${eventId}`)
      if (res.ok) {
        const data = await res.json()
        setSignups(data.signups || [])
      }
    } catch (error) {
      console.error("Error fetching signups:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendTicket = async (signupId: string, email: string) => {
    setSending(signupId)
    setMessage("")
    
    try {
      const res = await fetch("/api/events/send-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupId }),
      })

      if (res.ok) {
        setMessage(`✅ Ticket sent successfully to ${email}`)
        // Refresh signups to update ticket_sent status
        if (selectedEvent) {
          await fetchSignups(selectedEvent)
        }
      } else {
        const data = await res.json()
        setMessage(`❌ Error: ${data.error || "Failed to send ticket"}`)
      }
    } catch (error) {
      setMessage(`❌ Error sending ticket`)
      console.error("Error:", error)
    } finally {
      setSending(null)
    }
  }

  const sendAllTickets = async () => {
    if (!selectedEvent || signups.length === 0) return
    
    setMessage("📤 Sending tickets to all attendees...")
    let successCount = 0
    let failCount = 0

    for (const signup of signups) {
      if (!signup.ticket_sent) {
        try {
          const res = await fetch("/api/events/send-ticket", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ signupId: signup.id }),
          })
          
          if (res.ok) {
            successCount++
          } else {
            failCount++
          }
          
          // Small delay to avoid overwhelming email server
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          failCount++
        }
      }
    }

    setMessage(`✅ Sent ${successCount} tickets. ${failCount > 0 ? `Failed: ${failCount}` : ''}`)
    if (selectedEvent) {
      await fetchSignups(selectedEvent)
    }
  }

  const selectedEventData = events.find(e => e.id === selectedEvent)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Event Ticket Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Send QR code tickets to event registrants
          </p>
        </div>

        {/* Event Selector */}
        <Card className="p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Event
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          >
            <option value="">Choose an event...</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} - {new Date(event.startsAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </Card>

        {/* Event Stats */}
        {selectedEventData && signups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Registrations</p>
                  <p className="text-2xl font-bold">{signups.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tickets Sent</p>
                  <p className="text-2xl font-bold">
                    {signups.filter(s => s.ticket_sent).length}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold">
                    {signups.filter(s => !s.ticket_sent).length}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Checked In</p>
                  <p className="text-2xl font-bold">
                    {signups.filter(s => s.checked_in).length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.startsWith('✅') 
              ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : message.startsWith('❌')
              ? 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
          }`}>
            {message}
          </div>
        )}

        {/* Signups List */}
        {selectedEvent && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Registered Attendees
              </h2>
              <Button
                onClick={sendAllTickets}
                disabled={loading || signups.filter(s => !s.ticket_sent).length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send All Pending Tickets
              </Button>
            </div>

            {loading ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</p>
            ) : signups.length === 0 ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">
                No registrations yet for this event
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Name
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Email
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Ref
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {signups.map((signup) => (
                      <tr
                        key={signup.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800"
                      >
                        <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                          {signup.name}
                        </td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                          {signup.email}
                        </td>
                        <td className="p-3 text-sm font-mono text-gray-600 dark:text-gray-400">
                          {signup.ref}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1">
                            {signup.ticket_sent && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                                <CheckCircle className="w-3 h-3" />
                                Ticket Sent
                              </span>
                            )}
                            {signup.checked_in && (
                              <span className="inline-flex items-center gap-1 text-xs text-purple-700 dark:text-purple-400">
                                <CheckCircle className="w-3 h-3" />
                                Checked In
                              </span>
                            )}
                            {!signup.ticket_sent && !signup.checked_in && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            onClick={() => sendTicket(signup.id, signup.email)}
                            disabled={sending === signup.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          >
                            {sending === signup.id ? (
                              "Sending..."
                            ) : signup.ticket_sent ? (
                              <>
                                <QrCode className="w-3 h-3 mr-1" />
                                Resend
                              </>
                            ) : (
                              <>
                                <QrCode className="w-3 h-3 mr-1" />
                                Send Ticket
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
