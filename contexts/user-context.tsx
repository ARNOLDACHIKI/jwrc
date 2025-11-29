"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
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
  signup: (name: string, email: string, password: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: "1",
        name: "John Doe",
        email,
        role: "member",
        joinDate: new Date().toISOString(),
        isVolunteer: false,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser({
        id: Date.now().toString(),
        name,
        email,
        role: "member",
        joinDate: new Date().toISOString(),
        isVolunteer: false,
      })
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
