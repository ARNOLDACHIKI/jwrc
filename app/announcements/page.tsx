"use client"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Megaphone, Calendar, AlertCircle, Info } from "lucide-react"

const announcements = [
  {
    id: 1,
    title: "Sunday Service Time Change",
    category: "Important",
    date: "Nov 5, 2024",
    content: "Starting next month, Sunday service will be at 10:00 AM instead of 9:30 AM.",
    icon: AlertCircle,
  },
  {
    id: 2,
    title: "Winter Youth Retreat",
    category: "Event",
    date: "Nov 3, 2024",
    content: "Youth group winter retreat scheduled for December 15-17 at the mountain cabin.",
    icon: Calendar,
  },
  {
    id: 3,
    title: "Community Food Drive",
    category: "Service",
    date: "Nov 1, 2024",
    content: "We're organizing a food drive for families in need. Donations welcome!",
    icon: Megaphone,
  },
  {
    id: 4,
    title: "New Small Group Starting",
    category: "Info",
    date: "Oct 30, 2024",
    content: "A new Bible study group meets Thursdays at 7 PM. All are welcome to join!",
    icon: Info,
  },
  {
    id: 5,
    title: "Building Maintenance Notice",
    category: "Important",
    date: "Oct 28, 2024",
    content: "Sanctuary will be closed for repairs next week. Services will be held in fellowship hall.",
    icon: AlertCircle,
  },
]

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Church Announcements</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Stay updated with the latest news and events</p>
        </div>

        {/* Announcements */}
        <div className="space-y-6">
          {announcements.map((announcement) => {
            const Icon = announcement.icon
            const bgColor =
              announcement.category === "Important"
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
                : announcement.category === "Event"
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900"
                  : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900"

            return (
              <Card key={announcement.id} className={`p-6 border-l-4 ${bgColor}`}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-opacity-10 bg-blue-600">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{announcement.title}</h3>
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                          {announcement.category}
                        </span>
                      </div>
                      <time className="text-sm text-gray-500 dark:text-gray-400">{announcement.date}</time>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">{announcement.content}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
