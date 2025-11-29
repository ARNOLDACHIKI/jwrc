"use client"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Sunday Worship Service",
    date: "Every Sunday",
    time: "10:00 AM - 11:30 AM",
    location: "Main Sanctuary",
    description: "Join us for inspiring worship and biblical teaching",
    attendees: 450,
    type: "Worship",
  },
  {
    id: 2,
    title: "Midweek Prayer Meeting",
    date: "Every Wednesday",
    time: "7:00 PM - 8:30 PM",
    location: "Prayer Room",
    description: "Come together to intercede and pray",
    attendees: 85,
    type: "Prayer",
  },
  {
    id: 3,
    title: "Youth Group Meeting",
    date: "Every Thursday",
    time: "6:00 PM - 8:00 PM",
    location: "Youth Center",
    description: "Games, activities, and biblical discussion for youth",
    attendees: 120,
    type: "Youth",
  },
  {
    id: 4,
    title: "Community Thanksgiving Dinner",
    date: "November 28, 2024",
    time: "5:00 PM - 8:00 PM",
    location: "Fellowship Hall",
    description: "Share a meal and fellowship with the community",
    attendees: 200,
    type: "Fellowship",
  },
  {
    id: 5,
    title: "Christmas Carol Night",
    date: "December 15, 2024",
    time: "6:00 PM - 8:00 PM",
    location: "Main Sanctuary",
    description: "Traditional Christmas carols and celebration",
    attendees: 300,
    type: "Celebration",
  },
  {
    id: 6,
    title: "New Year's Baptism Service",
    date: "January 5, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "Baptismal Pool",
    description: "Celebrate new beginnings with baptisms",
    attendees: 150,
    type: "Baptism",
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Calendar className="w-10 h-10" />
            Church Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Join us for worship, fellowship, and service</p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition flex flex-col">
              {/* Header */}
              <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600"></div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <span className="inline-block w-fit px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full mb-3">
                  {event.type}
                </span>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{event.title}</h3>

                <div className="space-y-3 mb-4 flex-1">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium text-gray-900 dark:text-white">{event.date}</p>
                      <p className="text-xs mt-1">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.location}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.attendees} interested</p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                  {event.description}
                </p>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
