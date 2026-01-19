"use client"

import { useEffect, useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Users, Heart, ArrowRight, CheckCircle } from "lucide-react"

const baseVolunteerRoles = [
  {
    id: 1,
    title: "Worship Leader",
    description: "Lead music and worship during services",
    commitment: "2 hours/week",
    volunteers: 0,
    color: "text-purple-600",
  },
  {
    id: 2,
    title: "Usher & Greeter",
    description: "Welcome members and guests at the door",
    commitment: "3 hours/week",
    volunteers: 0,
    color: "text-blue-600",
  },
  {
    id: 3,
    title: "Children's Ministry",
    description: "Help care for and teach our children",
    commitment: "2 hours/week",
    volunteers: 0,
    color: "text-pink-600",
  },
  {
    id: 4,
    title: "Community Outreach",
    description: "Serve those in need in our community",
    commitment: "4 hours/week",
    volunteers: 0,
    color: "text-green-600",
  },
]

export default function VolunteerPage() {
  const { user } = useUser()
  const [volunteerRoles, setVolunteerRoles] = useState(baseVolunteerRoles)
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<Record<string,string>>({})

  // Auto-fill form fields when user is logged in
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name)
      if (user.email) setEmail(user.email)
      if (user.phone) setPhone(user.phone)
    }
  }, [user])

  useEffect(() => {
    let cancelled = false
    async function loadRoleSummary() {
      try {
        const res = await fetch('/api/volunteers?summary=roles')
        if (!res.ok) return
        const data = await res.json().catch(() => ({}))
        const summaries = Array.isArray(data?.roles) ? data.roles : []

        if (cancelled) return
        setVolunteerRoles((prev) =>
          prev.map((role) => {
            const match = summaries.find((s: any) => {
              const roleIdMatch = s?.roleId && Number(s.roleId) === role.id
              const titleMatch = s?.roleTitle && String(s.roleTitle).toLowerCase() === role.title.toLowerCase()
              return roleIdMatch || titleMatch
            })

            const volunteers =
              typeof match?.approved === 'number'
                ? match.approved
                : typeof match?.total === 'number'
                  ? match.total
                  : role.volunteers || 0

            return { ...role, volunteers }
          })
        )
      } catch (e) {
        console.error('Failed to load volunteer summary', e)
      }
    }

    loadRoleSummary()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSignUp = async () => {
    const clientErrors: Record<string,string> = {}
    if (!name) clientErrors.name = 'Name is required'
    if (!email) clientErrors.email = 'Email is required'
    if (!selectedRole) clientErrors.role = 'Please select a role'
    if (Object.keys(clientErrors).length) { setErrors(clientErrors); return }

    try {
      const role = volunteerRoles.find(r => r.id === selectedRole)
      const res = await fetch('/api/volunteers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, phone, roleId: selectedRole, roleTitle: role?.title }) })
      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
        setName('')
        setEmail('')
        setPhone('')
        setSelectedRole(null)
        setErrors({})
      } else {
        const data = await res.json().catch(() => ({}))
        setErrors(data?.errors || { form: data?.error || 'Failed to submit' })
      }
    } catch (e) {
      console.error(e)
      setErrors({ form: 'Failed to submit' })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.95)_0%,rgba(20,33,61,0.94)_18%,rgba(25,45,80,0.92)_38%,rgba(30,55,100,0.92)_56%,rgba(45,75,130,0.94)_76%,rgba(55,90,150,0.96)_90%,rgba(60,100,160,0.97)_100%)]"
      />
      <div className="relative z-10">
      <MainNav />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Volunteer Opportunities</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Make a difference in our church and community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Volunteer Roles */}
          <div className="lg:col-span-2 space-y-6">
            {volunteerRoles.map((role) => (
              <Card
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`group relative p-6 cursor-pointer transition-all duration-500 overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 ${
                  selectedRole === role.id
                    ? "border-2 border-blue-600 bg-gradient-to-br from-blue-50 via-white to-blue-40 dark:from-blue-900/30 dark:via-slate-800 dark:to-blue-900/20 dark:border-blue-500"
                    : "bg-gradient-to-br from-[#f5ebe0] via-white to-[#f0e5d8] hover:from-[#e8ddd0] hover:via-[#f5ebe0] hover:to-[#e0d5c8] dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 dark:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{role.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{role.description}</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{role.commitment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{role.volunteers} volunteers</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                </div>
              </Card>
            ))}
          </div>

          {/* Signup Form */}
          <div>
            <Card className="p-6 sticky top-20 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-800 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 border border-slate-700 dark:border-slate-700">
              <h2 className="text-xl font-bold text-white dark:text-white mb-6">Sign Up</h2>

              {!submitted ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-600 dark:border-slate-600 bg-slate-700 dark:bg-slate-700 text-white dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-600 dark:border-slate-600 bg-slate-700 dark:bg-slate-700 text-white dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-600 dark:border-slate-600 bg-slate-700 dark:bg-slate-700 text-white dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                      Select Role
                    </label>
                    <select
                      value={selectedRole || ""}
                      onChange={(e) => setSelectedRole(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-slate-600 dark:border-slate-600 bg-slate-700 dark:bg-slate-700 text-white dark:text-white"
                    >
                      <option value="">Choose a role...</option>
                      {volunteerRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                    {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
                  </div>

                  <Button
                    onClick={handleSignUp}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Thank You for Your Application!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    We have received your volunteer application for <strong>{volunteerRoles.find(r => r.id === selectedRole)?.title || 'the selected position'}</strong>.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Our team will review your application and get back to you soon. A confirmation email has been sent to your inbox.
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs italic mt-4">
                    "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms." - 1 Peter 4:10
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
