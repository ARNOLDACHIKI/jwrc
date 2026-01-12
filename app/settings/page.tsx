"use client"

import { useState } from "react"
import { Sidebar } from "@/components/navigation/sidebar"
import { MainNav } from "@/components/navigation/main-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { Moon, Sun, Type, RotateCcw } from "lucide-react"

const fontSizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
]

export default function SettingsPage() {
  const { theme, updateTheme, resetTheme } = useTheme()
  const [saved, setSaved] = useState(false)

  const handleThemeUpdate = (updates: any) => {
    updateTheme(updates)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <MainNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-2">Website Customization</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Personalize your experience with custom themes and settings
              </p>
            </div>

            {/* Display Settings */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Type className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-900 dark:text-white">Display Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Font Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {fontSizes.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => handleThemeUpdate({ fontSize: size.value })}
                        className={`p-3 rounded-lg border-2 transition ${
                          theme.fontSize === size.value
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <span
                          className={`text-${size.value === "small" ? "sm" : size.value === "large" ? "lg" : "base"} font-medium`}
                        >
                          {size.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dark Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Theme Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleThemeUpdate({ darkMode: false })}
                      className={`p-4 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                        !theme.darkMode
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      Light
                    </button>
                    <button
                      onClick={() => handleThemeUpdate({ darkMode: true })}
                      className={`p-4 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                        theme.darkMode
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Reset to Default</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Restore the original theme settings</p>
                </div>
                <Button
                  onClick={() => {
                    resetTheme()
                    setSaved(true)
                    setTimeout(() => setSaved(false), 2000)
                  }}
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>

            {/* Save Feedback */}
            {saved && (
              <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
                <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                  ✓ Settings updated successfully!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
