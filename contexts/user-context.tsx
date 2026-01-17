"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "member" | "leader" | "admin"
  profileImage?: string
  joinDate: string
  phone?: string
  location?: string
  bio?: string
  isVolunteer: boolean
}

export interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {}
  const token = sessionStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function buildUser(payload: any): User {
  return {
    id: payload.id,
    name: payload.name || payload.email || "",
    email: payload.email,
    role: (payload.role as User["role"]) || "member",
    profileImage: payload.profileImage || "",
    joinDate: payload.createdAt || payload.joinDate || new Date().toISOString(),
    phone: payload.phone || "",
    location: payload.location || "",
    bio: payload.bio || "",
    isVolunteer: !!payload.isVolunteer,
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/me", { headers: getAuthHeaders(), credentials: "include" })
      const data = await res.json().catch(() => ({}))
      if (data?.user) {
        setUser(buildUser(data.user))
      } else {
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.error || "Login failed")
        }

        const data = await res.json().catch(() => ({}))
        if (typeof window !== "undefined" && data?.token) sessionStorage.setItem("token", data.token)

        await refreshUser()
      } finally {
        setIsLoading(false)
      }
    },
    [refreshUser],
  )

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") sessionStorage.removeItem("token")
    setUser(null)
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          const errorMessage = err?.error || "Signup failed"
          console.error("Signup failed:", errorMessage, "Status:", res.status)
          throw new Error(errorMessage)
        }

        const data = await res.json().catch(() => ({}))
        // Note: No token returned until email is verified
        // User will be redirected to verify-email page
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        credentials: "include",
        body: JSON.stringify(updates),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || "Failed to update profile")
      }

      const data = await res.json().catch(() => ({}))
      if (typeof window !== "undefined" && data?.token) sessionStorage.setItem("token", data.token)
      if (data?.user) setUser(buildUser(data.user))
    },
    [],
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
