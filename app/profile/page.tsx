"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/navigation/sidebar"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react"
import SuggestionsInbox from "@/components/suggestions-inbox"

export default function ProfilePage() {
  const { user, updateProfile } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Active member of Jesus Worship and Restoration Church",
  })

  const handleSave = async () => {
    await updateProfile({
      name: formData.name,
      email: formData.email,
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view profile</h2>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-900 dark:text-white">My Profile</h1>
            </div>

            {/* Profile Card */}
            <Card className="overflow-hidden mb-8">
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

              {/* Profile Content */}
              <div className="px-6 pb-6">
                {/* Avatar & Edit */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                  <div className="flex items-end gap-4">
                    <div className="w-32 h-32 rounded-lg border-4 border-white dark:border-slate-900 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">{user.name.charAt(0)}</span>
                    </div>
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400 capitalize">
                        {user.role} • Joined {new Date(user.joinDate).getFullYear()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                {/* Info Sections */}
                {!isEditing ? (
                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-600 dark:text-gray-400">{formData.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-600 dark:text-gray-400">{formData.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-600 dark:text-gray-400">{formData.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Volunteer Status */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
                      <p className="font-bold text-blue-900 dark:text-blue-400">
                        {user.isVolunteer ? "✓ Active Volunteer" : "Not a Volunteer"}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {user.isVolunteer
                          ? "Thank you for serving our community!"
                          : "Interested in volunteering? Sign up today!"}
                      </p>
                    </div>
                    {/* Volunteer Messages */}
                    <div className="mt-6 p-4 rounded-lg bg-white dark:bg-slate-800 border">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Inbox & Messages</h3>
                      <div>
                        {/* @ts-ignore - client component */}
                        <SuggestionsInbox email={user.email} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
