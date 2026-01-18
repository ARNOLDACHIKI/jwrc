"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface AdminStats {
  totalDonations: number
  totalVolunteers: number
  totalBlogPosts: number
  totalEvents: number
  monthlyDonations: number
}

export interface AdminContextType {
  stats: AdminStats
  activities: Array<{
    id: string
    type: "donation" | "volunteer" | "suggestion" | "event"
    description: string
    timestamp: string
    user: string
  }>
  isAdmin: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [stats] = useState<AdminStats>({
    totalDonations: 45000,
    totalVolunteers: 128,
    totalBlogPosts: 24,
    totalEvents: 12,
    monthlyDonations: 8500,
  })

  const [activities] = useState([
    {
      id: "1",
      type: "giving" as const,
      description: "John Doe gave $500",
      timestamp: "2 hours ago",
      user: "John Doe",
    },
    {
      id: "2",
      type: "volunteer" as const,
      description: "Sarah Smith signed up for Youth Program",
      timestamp: "4 hours ago",
      user: "Sarah Smith",
    },
    {
      id: "3",
      type: "suggestion" as const,
      description: "New suggestion: More youth activities",
      timestamp: "1 day ago",
      user: "Mike Johnson",
    },
    {
      id: "4",
      type: "event" as const,
      description: "Event created: Bible Study Group",
      timestamp: "2 days ago",
      user: "Admin",
    },
  ])

  return <AdminContext.Provider value={{ stats, activities, isAdmin: true }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
