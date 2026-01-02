"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "member" | "leader" | "admin"
  profileImage?: string
  joinDate: string
  isVolunteer: boolean
}

export interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load user on mount if already logged in
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const me = await fetch('/api/auth/me', { credentials: 'include' })
        const data = await me.json()
        if (mounted && data?.user) {
          setUser({
            id: data.user.id,
            name: data.user.name || '',
            email: data.user.email,
            phone: data.user.phone || undefined,
            role: data.user.role,
            joinDate: new Date().toISOString(),
            isVolunteer: false,
          })
        }
      } catch (e) {
        // ignore errors
      }
    })()
    return () => { mounted = false }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Login failed')
      }

      // Fetch current user
      const me = await fetch('/api/auth/me')
      const data = await me.json()
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name || '',
          email: data.user.email,
          phone: data.user.phone || undefined,
          role: data.user.role,
          joinDate: new Date().toISOString(),
          isVolunteer: false,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // ignore
    }
    setUser(null)
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Signup failed')
      }

      // fetch current user from server to populate context
      const me = await fetch('/api/auth/me')
      const data = await me.json().catch(() => ({}))
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name || name || '',
          email: data.user.email,
          phone: data.user.phone || phone || undefined,
          role: data.user.role,
          joinDate: data.user.createdAt || new Date().toISOString(),
          isVolunteer: !!data.user.isVolunteer,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (user) {
        setUser({ ...user, ...updates })
      }
    },
    [user],
  )

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, signup, updateProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
