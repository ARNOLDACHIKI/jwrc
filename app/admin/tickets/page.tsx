"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchLoader } from "@/components/ui/search-loader"
import { TicketPrinter } from "@/components/ui/ticket-printer"
import { Search, ArrowLeft, Ticket, Calendar, MapPin, User, Mail, Phone } from "lucide-react"
import { AdminNav } from "@/components/admin/admin-nav"

interface Event {
  id: string
  title: string
  startsAt: string
  location: string
}

interface Signup {
  id: string
  eventId: string
  ref: string
  name: string
  email: string
  phone: string | null
  createdAt: string
  userImage: string | null
  eventTitle: string
  eventDate: string
  eventLocation: string
}

export default function AdminTicketsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Signup[]>([])
  const [showTicket, setShowTicket] = useState<Signup | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    setIsSearching(true)
    setHasSearched(true)
    setShowTicket(null)

    try {
      const params = new URLSearchParams({ q: searchQuery })
      if (selectedEvent) {
        params.append('eventId', selectedEvent)
      }

      const res = await fetch(`/api/admin/tickets/search?${params}`, {
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        setSearchResults(data.signups || [])
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminNav>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <Ticket className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Ticket Management
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Search for event attendees and manage their tickets
            </p>
          </div>

        {/* Search Section */}
        <Card className="p-6 mb-6">
          <form onSubmit={handleSearch}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Event (Optional)
                </label>
                <select
                  value={selectedEvent || ''}
                  onChange={(e) => setSelectedEvent(e.target.value || null)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">All Events</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {new Date(event.startsAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search by Name, Email, Phone, or Ticket Ref
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter search term..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isSearching}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Card>

        {/* Loading State */}
        {isSearching && (
          <Card className="p-6">
            <SearchLoader />
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              Searching for tickets...
            </p>
          </Card>
        )}

        {/* No Results */}
        {!isSearching && hasSearched && searchResults.length === 0 && !showTicket && (
          <Card className="p-12 text-center">
            <div className="mb-4">
              <Ticket className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Ticket Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No tickets found matching your search criteria.
              <br />
              Please try a different search term.
            </p>
          </Card>
        )}

        {/* Search Results */}
        {!isSearching && searchResults.length > 0 && !showTicket && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Found {searchResults.length} ticket{searchResults.length !== 1 ? 's' : ''}
            </h2>
            {searchResults.map((signup) => (
              <Card key={signup.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {signup.userImage && (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={signup.userImage}
                          alt={signup.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {signup.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        {signup.email}
                      </div>
                      {signup.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-4 w-4" />
                          {signup.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Ticket className="h-4 w-4" />
                        Ref: {signup.ref}
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 font-medium text-blue-900 dark:text-blue-100 mb-1">
                          <Calendar className="h-4 w-4" />
                          {signup.eventTitle}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          {formatDate(signup.eventDate)}
                        </div>
                        {signup.eventLocation && (
                          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 mt-1">
                            <MapPin className="h-4 w-4" />
                            {signup.eventLocation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setShowTicket(signup)}>
                    View Ticket
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Ticket Display */}
        {showTicket && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowTicket(null)
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
            <Card className="p-8">
              <TicketPrinter
                eventTitle={showTicket.eventTitle}
                eventDate={formatDate(showTicket.eventDate)}
                eventLocation={showTicket.eventLocation || 'TBA'}
                userName={showTicket.name}
                userEmail={showTicket.email}
                userPhone={showTicket.phone || ''}
                userImage={showTicket.userImage || undefined}
                ticketRef={showTicket.ref}
              />
            </Card>
          </div>
        )}
        </div>
      </div>
    </AdminNav>
  )
}
