"use client"

import type React from "react"

import { useState } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, CheckCircle } from "lucide-react"

export default function SuggestionsPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string,string> | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "suggestion",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    ;(async () => {
      setLoading(true)
      setErrors(null)
      try {
        const res = await fetch('/api/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          setSubmitted(true)
          setFormData({ name: '', email: '', type: 'suggestion', message: '' })
          setTimeout(() => setSubmitted(false), 3000)
        } else if (res.status === 400) {
          const data = await res.json().catch(() => ({}))
          setErrors(data?.errors || { form: data?.error || 'Validation error' })
        } else {
          const data = await res.json().catch(() => ({}))
          setErrors({ form: data?.error || `Server returned ${res.status}` })
        }
      } catch (err) {
        console.error('Failed to submit suggestion', err)
        setErrors({ form: 'Network or server error' })
      } finally {
        setLoading(false)
      }
    })()
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(229,236,249,0.94)_0%,rgba(236,233,224,0.92)_18%,rgba(218,206,190,0.88)_38%,rgba(185,151,118,0.82)_56%,rgba(116,142,186,0.88)_76%,rgba(68,98,139,0.92)_90%,rgba(45,68,99,0.95)_100%)]"
      />
      <div className="relative z-10">
      <MainNav />

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <MessageSquare className="w-10 h-10" />
            Suggestion Box
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We value your feedback and suggestions to help improve our church
          </p>
        </div>

        <Card className="group relative p-8 overflow-hidden bg-gradient-to-br from-[#f5ebe0] via-white to-[#f0e5d8] border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative z-10">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors?.form && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{errors.form}</div>
              )}
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type of Feedback
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                >
                  <option value="suggestion">Suggestion</option>
                  <option value="complaint">Complaint</option>
                  <option value="praise">Praise</option>
                  <option value="question">Question</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your thoughts..."
                  rows={6}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2">
                <Mail className="w-4 h-4 mr-2" />
                {loading ? 'Sending…' : 'Submit Feedback'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your feedback has been received. We appreciate you taking the time to help us improve.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting...</p>
            </div>
          )}
          </div>
        </Card>
      </div>
      </div>
    </div>
  )
}
