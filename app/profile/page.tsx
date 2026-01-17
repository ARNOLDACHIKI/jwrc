"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/navigation/sidebar"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react"
import SuggestionsInbox from "@/components/suggestions-inbox"

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [volunteerApplications, setVolunteerApplications] = useState<any[]>([])
  const [volunteerLoading, setVolunteerLoading] = useState(false)
  const [bannerTransform, setBannerTransform] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("")
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
      })
      setImagePreview(user.profileImage || "")
    }
  }, [user])

  useEffect(() => {
    if (!user?.email) return
    let cancelled = false
    async function loadApplications() {
      setVolunteerLoading(true)
      try {
        const res = await fetch(`/api/volunteers?email=${encodeURIComponent(user.email)}`)
        const data = await res.json().catch(() => ({}))
        if (!cancelled) setVolunteerApplications(Array.isArray(data?.applications) ? data.applications : [])
      } catch (e) {
        if (!cancelled) setVolunteerApplications([])
      } finally {
        if (!cancelled) setVolunteerLoading(false)
      }
    }
    loadApplications()
    return () => {
      cancelled = true
    }
  }, [user?.email])

  const handleBannerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return
    const banner = e.currentTarget
    const rect = banner.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateY = ((x - centerX) / centerX) * 8
    const rotateX = ((centerY - y) / centerY) * 8
    setBannerTransform({ rotateX, rotateY })
  }

  const handleBannerMouseLeave = () => {
    setIsHovering(false)
    setBannerTransform({ rotateX: 0, rotateY: 0 })
  }

  const handleBannerMouseEnter = () => {
    setIsHovering(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSaveError("Image must be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setImagePreview(base64)
        setFormData({ ...formData, profileImage: base64 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError("")
    setSaveSuccess("")
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        profileImage: formData.profileImage,
      })
      setSaveSuccess("Profile updated")
      setIsEditing(false)
    } catch (e: any) {
      setSaveError(e?.message || "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteError("")
    
    // Validate confirmations
    if (deleteConfirmEmail !== user?.email) {
      setDeleteError(`Email does not match. Please type: ${user?.email}`)
      return
    }
    
    if (deleteConfirmPhrase !== "delete my account") {
      setDeleteError('Please type "delete my account" to confirm')
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete account")
      }
      
      // Clear local storage and redirect to home
      localStorage.removeItem("authToken")
      window.location.href = "/"
    } catch (e: any) {
      setDeleteError(e.message || "Failed to delete account")
      setIsDeleting(false)
    }
  }

  const joinedYear = user?.joinDate ? new Date(user.joinDate).getFullYear() : ""
  const latestApplication = volunteerApplications[0]
  const volunteerStatus = user?.isVolunteer ? "approved" : latestApplication?.status || "none"
  const volunteerSubtitle = (() => {
    if (volunteerStatus === "approved") return "Thank you for serving our community!"
    if (volunteerStatus === "pending") return "Your application is under review. We will notify you soon."
    if (volunteerStatus === "rejected") return latestApplication?.adminMessage || "We could not approve this application."
    return "Interested in volunteering? Sign up today!"
  })()

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-500">Loading your profile...</div>
      </div>
    )
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
              {/* Banner with 3D perspective */}
              <div style={{ perspective: "1000px" }}>
                <div 
                  onMouseMove={handleBannerMouseMove}
                  onMouseEnter={handleBannerMouseEnter}
                  onMouseLeave={handleBannerMouseLeave}
                  className="h-40 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 transition-transform duration-200"
                  style={{
                    transform: `perspective(1000px) rotateX(${bannerTransform.rotateX}deg) rotateY(${bannerTransform.rotateY}deg) translateZ(20px)`,
                    transformStyle: "preserve-3d" as any,
                  }}
                >
                  {/* Cyan wavy particle pattern */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 160">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Wavy line patterns */}
                  <path d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="2" fill="none" filter="url(#glow)"/>
                  <path d="M0,80 Q150,40 300,80 T600,80 T900,80 T1200,80" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="2" fill="none" filter="url(#glow)"/>
                  <path d="M0,100 Q150,60 300,100 T600,100 T900,100 T1200,100" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="2" fill="none" filter="url(#glow)"/>
                  
                  {/* Dot particles along waves */}
                  <circle cx="50" cy="55" r="2" fill="rgba(34, 211, 238, 0.6)" filter="url(#glow)"/>
                  <circle cx="120" cy="40" r="1.5" fill="rgba(34, 211, 238, 0.5)"/>
                  <circle cx="200" cy="50" r="2" fill="rgba(6, 182, 212, 0.6)" filter="url(#glow)"/>
                  <circle cx="280" cy="65" r="1.5" fill="rgba(34, 211, 238, 0.5)"/>
                  <circle cx="350" cy="55" r="2" fill="rgba(34, 211, 238, 0.6)" filter="url(#glow)"/>
                  <circle cx="450" cy="35" r="1.5" fill="rgba(6, 182, 212, 0.5)"/>
                  <circle cx="550" cy="60" r="2" fill="rgba(34, 211, 238, 0.6)" filter="url(#glow)"/>
                  <circle cx="650" cy="50" r="1.5" fill="rgba(34, 211, 238, 0.5)"/>
                  <circle cx="750" cy="65" r="2" fill="rgba(6, 182, 212, 0.6)" filter="url(#glow)"/>
                  <circle cx="850" cy="45" r="1.5" fill="rgba(34, 211, 238, 0.5)"/>
                  <circle cx="950" cy="58" r="2" fill="rgba(34, 211, 238, 0.6)" filter="url(#glow)"/>
                  <circle cx="1050" cy="48" r="1.5" fill="rgba(6, 182, 212, 0.5)"/>
                  <circle cx="1150" cy="62" r="2" fill="rgba(34, 211, 238, 0.6)" filter="url(#glow)"/>
                </svg>
                
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/80"></div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="px-6 pb-6">
                {/* Avatar & Edit */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                  <div className="flex items-end gap-4">
                      <div className="w-32 h-32 rounded-lg border-4 border-white dark:border-slate-900 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden relative">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-bold text-white">{user.name.charAt(0)}</span>
                        )}
                    </div>
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400 capitalize">
                        {user.role} • Joined {joinedYear || "-"}
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
                          <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-600 dark:text-gray-400">{user.phone || "Add your phone number"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-600 dark:text-gray-400">{user.location || "Add your city"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border">
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">Bio</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
                        {user.bio || "Share a short introduction about yourself."}
                      </p>
                    </div>

                    {/* Volunteer Status */}
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-blue-900 dark:text-blue-400">
                            {volunteerStatus === "approved"
                              ? "✓ Active Volunteer"
                              : volunteerStatus === "pending"
                                ? "Application Pending"
                                : volunteerStatus === "rejected"
                                  ? "Application Not Approved"
                                  : "Not a Volunteer"}
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">{volunteerSubtitle}</p>
                          {volunteerStatus !== "approved" && (
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                              {volunteerStatus === "pending" && latestApplication?.createdAt
                                ? `Submitted on ${new Date(latestApplication.createdAt).toLocaleDateString()}`
                                : volunteerStatus === "rejected" && latestApplication?.respondedAt
                                  ? `Reviewed on ${new Date(latestApplication.respondedAt).toLocaleDateString()}`
                                  : ""}
                            </p>
                          )}
                        </div>
                        <Link
                          href="/volunteer"
                          className="px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {volunteerStatus === "approved" ? "View roles" : "Sign up"}
                        </Link>
                      </div>
                      {volunteerLoading && (
                        <p className="text-xs text-blue-600 mt-2">Checking your volunteer status...</p>
                      )}
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
                    {/* Profile Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl font-bold text-white">{formData.name.charAt(0) || "?"}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG or GIF (max 5MB)</p>
                        </div>
                      </div>
                    </div>

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

                    {saveError && <p className="text-sm text-red-600">{saveError}</p>}
                    {saveSuccess && <p className="text-sm text-green-600">{saveSuccess}</p>}

                    <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>

                    {/* Delete Account Section */}
                    <div className="mt-8 pt-6 border-t border-red-200 dark:border-red-900">
                      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Once you delete your account, there is no going back. This action is permanent.
                      </p>
                      <Button
                        onClick={() => setShowDeleteDialog(true)}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Delete Account</h2>
              
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  This will permanently delete your account and related data like profile information, volunteer applications, event signups, and messages.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      To confirm, type your email: <span className="font-bold text-gray-900 dark:text-white">{user?.email}</span>
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmEmail}
                      onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                      placeholder={user?.email}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                      disabled={isDeleting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      To confirm, type: <span className="font-bold text-gray-900 dark:text-white">delete my account</span>
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmPhrase}
                      onChange={(e) => setDeleteConfirmPhrase(e.target.value)}
                      placeholder="delete my account"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                      disabled={isDeleting}
                    />
                  </div>
                </div>
                
                {deleteError && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      {deleteError}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setDeleteConfirmEmail("")
                    setDeleteConfirmPhrase("")
                    setDeleteError("")
                  }}
                  variant="outline"
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
