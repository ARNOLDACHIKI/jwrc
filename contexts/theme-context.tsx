"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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
  darkMode: false,
  sidebarCollapsed: false,
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme((prev) => ({ ...prev, ...updates }))
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
