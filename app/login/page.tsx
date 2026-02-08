"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

const deepOceanGradient = "bg-[radial-gradient(circle_at_20%_20%,#2f65c6_0%,#214c8e_35%,#0f274f_75%,#081a3a_100%)]"
const sandCanvasGradient = "bg-[radial-gradient(circle_at_20%_20%,#f6ede1_0%,#e9dcc9_45%,#d6c4ad_85%,#c9b69c_100%)] dark:bg-[radial-gradient(circle_at_20%_20%,#1e293b_0%,#0f172a_45%,#020617_85%,#000000_100%)]"
const card3dBase = "group relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-[rgba(246,237,225,0.95)] via-[rgba(234,215,195,0.9)] to-[rgba(216,193,170,0.88)] dark:from-[rgba(43,74,133,0.7)] dark:via-[rgba(27,47,93,0.82)] dark:to-[rgba(14,27,52,0.9)] shadow-[0_35px_90px_-45px_rgba(15,23,42,0.65)] backdrop-blur-xl transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-4 hover:scale-[1.02] hover:rotate-[0.6deg] dark:border-white/10"
const cardHighlight = "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.32),transparent_50%)] before:opacity-70 before:transition-opacity before:duration-500 group-hover:before:opacity-100"
const cardGlow = "after:absolute after:-inset-10 after:bg-[radial-gradient(circle_at_30%_20%,rgba(47,101,198,0.25),transparent_55%)] after:opacity-0 after:transition-all after:duration-700 group-hover:after:opacity-100 group-hover:after:scale-110"
const cardContent = "relative z-10"

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Check if this tab already has a user logged in
      const tabSessionKey = 'jwrc-tab-user-session'
      let currentTabUser = null
      try {
        const stored = sessionStorage.getItem(tabSessionKey)
        if (stored) {
          currentTabUser = JSON.parse(stored)
        }
      } catch (e) {
        // ignore
      }

      // If this tab already has a different user, just proceed (each tab is independent)
      // No need to warn - each tab can have its own user
      
      await login(email, password)
      // Always redirect to normal dashboard after login
      router.push("/dashboard")
    } catch (err: any) {
      // prefer server-provided message when available
      const msg = err?.message || "Login failed"
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${sandCanvasGradient}`}>
      <MainNav />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <Card className={`w-full max-w-md p-8 ${card3dBase} ${cardHighlight} ${cardGlow}`}>
          <div className={cardContent}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0f2b52] dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-700 dark:text-gray-200">Sign in to your church account</p>
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

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-[#1f4f9c] hover:text-[#0f2b52] dark:text-blue-400 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2f65c6] hover:bg-[#214c8e] text-white font-medium py-2 rounded-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-700 dark:text-gray-200 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#1f4f9c] hover:text-[#0f2b52] dark:text-blue-400 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
