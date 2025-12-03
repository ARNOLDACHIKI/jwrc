"use client"

import { useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Heart, ArrowRight, CheckCircle } from "lucide-react"

const volunteerRoles = [
  {
    id: 1,
    title: "Worship Leader",
    description: "Lead music and worship during services",
    commitment: "2 hours/week",
    volunteers: 12,
    color: "text-purple-600",
  },
  {
    id: 2,
    title: "Usher & Greeter",
    description: "Welcome members and guests at the door",
    commitment: "3 hours/week",
    volunteers: 24,
    color: "text-blue-600",
  },
  {
    id: 3,
    title: "Children's Ministry",
    description: "Help care for and teach our children",
    commitment: "2 hours/week",
    volunteers: 18,
    color: "text-pink-600",
  },
  {
    id: 4,
    title: "Community Outreach",
    description: "Serve those in need in our community",
    commitment: "4 hours/week",
    volunteers: 15,
    color: "text-green-600",
  },
]

export default function VolunteerPage() {
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<Record<string,string>>({})

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
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
                className={`p-6 cursor-pointer transition ${
                  selectedRole === role.id
                    ? "border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "hover:shadow-lg"
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
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-6">Sign Up</h2>

              {!submitted ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Role
                    </label>
                    <select
                      value={selectedRole || ""}
                      onChange={(e) => setSelectedRole(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
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
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Thank You!</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your volunteer application has been submitted. We'll be in touch soon!
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
