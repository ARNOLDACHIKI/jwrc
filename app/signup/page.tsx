"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { User, Mail, Lock, Eye, EyeOff, Phone, CheckCircle2, XCircle } from "lucide-react"
import { validatePassword } from "@/lib/password-validator"
import { generateSecurePassword } from "@/lib/password-generator"

const deepOceanGradient = "bg-[radial-gradient(circle_at_20%_20%,#2f65c6_0%,#214c8e_35%,#0f274f_75%,#081a3a_100%)]"
const sandCanvasGradient = "bg-[radial-gradient(circle_at_20%_20%,#f6ede1_0%,#e9dcc9_45%,#d6c4ad_85%,#c9b69c_100%)] dark:bg-[radial-gradient(circle_at_20%_20%,#1e293b_0%,#0f172a_45%,#020617_85%,#000000_100%)]"
const card3dBase = "group relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-[rgba(246,237,225,0.95)] via-[rgba(234,215,195,0.9)] to-[rgba(216,193,170,0.88)] dark:from-[rgba(43,74,133,0.7)] dark:via-[rgba(27,47,93,0.82)] dark:to-[rgba(14,27,52,0.9)] shadow-[0_35px_90px_-45px_rgba(15,23,42,0.65)] backdrop-blur-xl transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-4 hover:scale-[1.02] hover:rotate-[0.6deg] dark:border-white/10"
const cardHighlight = "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.32),transparent_50%)] before:opacity-70 before:transition-opacity before:duration-500 group-hover:before:opacity-100"
const cardGlow = "after:absolute after:-inset-10 after:bg-[radial-gradient(circle_at_30%_20%,rgba(47,101,198,0.25),transparent_55%)] after:opacity-0 after:transition-all after:duration-700 group-hover:after:opacity-100 group-hover:after:scale-110"
const cardContent = "relative z-10"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+254")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [logoSrc, setLogoSrc] = useState("/jwrc-logo.svg")

  const passwordValidation = validatePassword(password)

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword(14)
    setPassword(newPassword)
    setConfirmPassword(newPassword)
    setShowPasswordRequirements(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!passwordValidation.isValid) {
      setError(passwordValidation.message || "Password does not meet requirements")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setLoading(true)
    try {
      const fullPhone = phone ? countryCode + phone : ""
      await signup(name, email, password, fullPhone)
      // Redirect to email verification page
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      // Display specific error message from the server
      const errorMessage = err?.message || "Sign up failed. Please try again."
      setError(errorMessage)
      console.error("Signup error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${sandCanvasGradient}`}>
      {/* Logo and Church Name Header */}
      <div className="py-8">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="[perspective:1200px]">
            <div className="relative h-16 w-16 rounded-full overflow-hidden shadow-lg shadow-[rgba(0,71,171,0.35)] ring-2 ring-blue-600 dark:ring-blue-400 transform-gpu logo-spin hover:[transform:rotateY(360deg)]">
              <Image
                src={logoSrc}
                alt="Jesus Worship and Restoration Church logo"
                fill
                sizes="64px"
                className="object-cover"
                priority
                onError={() => setLogoSrc("/jwrc-logo.svg")}
              />
            </div>
          </div>
          <span className="font-bold text-lg text-[#0f2b52] dark:text-blue-300 text-center">
            JESUS WORSHIP AND RESTORATION CHURCH
          </span>
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 pb-8">
        <Card className={`w-full max-w-md p-8 ${card3dBase} ${cardHighlight} ${cardGlow}`}>
          <div className={cardContent}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0f2b52] dark:text-white mb-2">Join Our Community</h1>
            <p className="text-gray-700 dark:text-gray-200">Create your church account today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2f65c6]"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2f65c6]"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative w-32">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2f65c6]"
                  >
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+255">🇹🇿 +255</option>
                    <option value="+256">🇺🇬 +256</option>
                    <option value="+27">🇿🇦 +27</option>
                  </select>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="712345678"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2f65c6]"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-xs text-[#1f4f9c] dark:text-blue-400 hover:underline font-medium"
                >
                  Generate Password
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordRequirements(true)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2f65c6]"
                  required
                />
              </div>
              
              {/* Password Requirements Indicator */}
              {showPasswordRequirements && password && (
                <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Password must contain:</p>
                  <div className="space-y-1">
                    {passwordValidation.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${
                          req.met 
                            ? "text-green-700 dark:text-green-400 font-medium" 
                            : "text-gray-700 dark:text-gray-200"
                        }`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordValidation.isValid 
                              ? "bg-green-600" 
                              : passwordValidation.requirements.filter(r => r.met).length >= 3
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${(passwordValidation.requirements.filter(r => r.met).length / passwordValidation.requirements.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        {passwordValidation.isValid ? "Strong" : passwordValidation.requirements.filter(r => r.met).length >= 3 ? "Medium" : "Weak"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2f65c6]"
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

            {/* Terms Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">
                I agree to the{" "}
                <Link href="/terms" className="text-[#1f4f9c] hover:underline dark:text-blue-400">
                  terms and conditions
                </Link>
              </span>
            </label>

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
              className="w-full bg-[#2f65c6] hover:bg-[#214c8e] text-white font-medium py-2 rounded-lg"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-700 dark:text-gray-200 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#1f4f9c] hover:text-[#0f2b52] dark:text-blue-400 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
