"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface ThemeSettings {
  primaryColor: string
  accentColor: string
  fontSize: "small" | "medium" | "large"
  darkMode: boolean
  sidebarCollapsed: boolean
}

interface ThemeContextType {
  theme: ThemeSettings
  updateTheme: (updates: Partial<ThemeSettings>) => void
  resetTheme: () => void
}

const defaultTheme: ThemeSettings = {
  primaryColor: "#1e40af",
  accentColor: "#92400e",
  fontSize: "medium",
  darkMode: true,
  sidebarCollapsed: false,
}

const STORAGE_KEY = 'jwrc-theme-settings'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setTheme({ ...defaultTheme, ...parsed })
      }
    } catch (e) {
      console.warn('Failed to load theme from localStorage', e)
    }
    setMounted(true)
  }, [])

  // Apply dark mode to HTML element
  useEffect(() => {
    if (!mounted) return
    const html = document.documentElement
    if (theme.darkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [theme.darkMode, mounted])

  // Apply font size to HTML element
  useEffect(() => {
    if (!mounted) return
    const html = document.documentElement
    html.classList.remove('font-size-small', 'font-size-medium', 'font-size-large')
    html.classList.add(`font-size-${theme.fontSize}`)
  }, [theme.fontSize, mounted])

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
    } catch (e) {
      console.warn('Failed to save theme to localStorage', e)
    }
  }, [theme, mounted])

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme((prev) => {
      const newTheme = { ...prev, ...updates }
      return newTheme
    })
  }

  const resetTheme = () => {
    setTheme(defaultTheme)
  }

  return <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
