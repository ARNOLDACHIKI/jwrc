"use client"

import { MainNav } from "@/components/navigation/main-nav"
import { Sidebar } from "@/components/navigation/sidebar"
import SuggestionsInbox from "@/components/suggestions-inbox"
import { useUser } from "@/contexts/user-context"

export default function MessagesPage() {
  const { user } = useUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <MainNav />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl font-semibold">Please log in to view your messages.</h2>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Messages</h1>
            <div className="bg-white dark:bg-slate-800 p-4 rounded border">
              {/* @ts-ignore client component */}
              <SuggestionsInbox email={user.email} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
