"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send reset email")

      setSent(true)
      if (data.token) {
        setToken(data.token)
        console.log("Reset token (dev):", data.token)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <MainNav />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <Card className="w-full max-w-md p-8">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-2">Forgot Password</h1>
                <p className="text-gray-600 dark:text-gray-400">Enter your email and we'll send you a link to reset your password</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-2">Check Your Email</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">We've sent a password reset link to <span className="font-semibold">{email}</span></p>
                <p className="text-sm text-gray-500 dark:text-gray-500">The link expires in 1 hour. If you don't see the email, check your spam folder.</p>
              </div>

              {/* Show token in development mode */}
              {token && (
                <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Development Mode - Reset Token:</p>
                  <code className="block text-xs text-blue-600 dark:text-blue-400 font-mono break-all mb-3">{token}</code>
                  <Link 
                    href={`/reset-password?token=${token}`}
                    className="inline-block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline"
                  >
                    Click here to reset password
                  </Link>
                </div>
              )}

              {/* Back to Login */}
              <div className="text-center">
                <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
