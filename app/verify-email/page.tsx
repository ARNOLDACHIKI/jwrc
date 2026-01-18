"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, AlertCircle, Loader } from "lucide-react"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const [step, setStep] = useState<"input" | "verify">("input")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address")
      return
    }
    setStep("verify")
    setError("")
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode: code }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Verification failed")
        return
      }

      setSuccess(true)
      // Store token if provided
      if (data.token && typeof window !== "undefined") {
        sessionStorage.setItem("token", data.token)
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResending(true)
    setError("")
    setResendMessage("")

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to resend code")
        return
      }

      setResendMessage("Verification code resent! Check your email.")
      setTimeout(() => setResendMessage(""), 5000)
    } catch (err) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <MainNav />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <Card className="w-full max-w-md p-8">
          {success ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  Email Verified!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Your email has been successfully verified. You're all set to explore the church community!
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-2">
                  Verify Your Email
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {step === "input"
                    ? "Enter your email address to get started"
                    : "We've sent a verification code to your email"}
                </p>
              </div>

              <form
                onSubmit={step === "input" ? handleEmailSubmit : handleVerify}
                className="space-y-5"
              >
                {step === "input" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      Continue
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Email:</strong> {email}
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep("input")}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                      >
                        Change email
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Check your email for the 6-digit code
                      </p>
                    </div>

                    {resendMessage && (
                      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          {resendMessage}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading || code.length !== 6}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader className="w-4 h-4 animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resending}
                      variant="outline"
                      className="w-full"
                    >
                      {resending ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader className="w-4 h-4 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        "Resend Code"
                      )}
                    </Button>
                  </>
                )}

                {error && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        {error}
                      </p>
                      {error === "Invalid verification code" && (
                        <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                          Please check the code and try again
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Haven't registered yet?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
