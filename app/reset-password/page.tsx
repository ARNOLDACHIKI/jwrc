'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { validatePassword } from '@/lib/password-validator'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)

  const passwordValidation = validatePassword(password)

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordValidation.isValid) {
      setError(passwordValidation.message || 'Password does not meet requirements')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 3000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been reset successfully. Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                required
                disabled={loading || !token}
                className="w-full"
              />
              
              {/* Password Requirements Indicator */}
              {showPasswordRequirements && password && (
                <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Password must contain:</p>
                  <div className="space-y-1">
                    {passwordValidation.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${
                          req.met 
                            ? "text-green-700 dark:text-green-400 font-medium" 
                            : "text-gray-600 dark:text-gray-400"
                        }`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {passwordValidation.isValid ? "Strong" : passwordValidation.requirements.filter(r => r.met).length >= 3 ? "Medium" : "Weak"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !token}
                className="w-full"
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <Link href="/login">
              <Button variant="ghost" className="w-full" type="button">
                Back to Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
