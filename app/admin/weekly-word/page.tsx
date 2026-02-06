'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, LogOut, Book } from 'lucide-react'
import { AdminNav } from '@/components/admin/admin-nav'

interface WeeklyWord {
  id: string
  title: string
  theme: string
  scripture: string | null
  content: string
  isActive: boolean
  weekStart: string
  createdAt: string
}

export default function AdminWeeklyWordPage() {
  const [words, setWords] = useState<WeeklyWord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [scripture, setScripture] = useState('')
  const [content, setContent] = useState('')
  const [weekStart, setWeekStart] = useState('')
  
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchWords()
    // Set default week start to current Monday
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    setWeekStart(monday.toISOString().split('T')[0])
  }, [])

  const fetchWords = async () => {
    try {
      const response = await fetch('/api/admin/weekly-word', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setWords(data)
      }
    } catch (error) {
      console.error('Error fetching weekly words:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/weekly-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          theme,
          scripture: scripture || null,
          content,
          weekStart
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Weekly word created successfully'
        })
        setTitle('')
        setTheme('')
        setScripture('')
        setContent('')
        const today = new Date()
        const monday = new Date(today)
        monday.setDate(today.getDate() - today.getDay() + 1)
        setWeekStart(monday.toISOString().split('T')[0])
        fetchWords()
      } else {
        throw new Error('Failed to create weekly word')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create weekly word',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleWordStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/weekly-word/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Weekly word ${!currentStatus ? 'activated' : 'deactivated'}`
        })
        fetchWords()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to update weekly word',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update weekly word',
        variant: 'destructive'
      })
    }
  }

  const deleteWord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this weekly word?')) return

    try {
      const response = await fetch(`/api/admin/weekly-word/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Weekly word deleted successfully'
        })
        fetchWords()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete weekly word',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete weekly word',
        variant: 'destructive'
      })
    }
  }

  return (
    <AdminNav onLogout={handleLogout}>
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Word & Theme</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Inspire your congregation throughout the week</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">{/* Create Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Weekly Word</CardTitle>
              <CardDescription>
                Set the word and theme that will guide the congregation this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weekStart">Week Starting</Label>
                  <Input
                    id="weekStart"
                    type="date"
                    value={weekStart}
                    onChange={(e) => setWeekStart(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Word of the Week</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Faith, Hope, Love, Grace"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Input
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., Trusting God in Uncertainty"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scripture">Scripture Reference (Optional)</Label>
                  <Input
                    id="scripture"
                    value={scripture}
                    onChange={(e) => setScripture(e.target.value)}
                    placeholder="e.g., Hebrews 11:1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Devotional Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write an inspiring message to guide believers through the week..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Weekly Word'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Words */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Previous Weekly Words</h2>
            {words.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No weekly words created yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              words.map((word) => (
                <Card key={word.id} className={word.isActive ? 'border-l-4 border-l-blue-500' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Book className="w-5 h-5 text-blue-600" />
                          <CardTitle className="text-xl">{word.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base font-semibold mb-2">
                          {word.theme}
                        </CardDescription>
                        {word.scripture && (
                          <p className="text-sm italic text-gray-600 dark:text-gray-400 mb-2">
                            {word.scripture}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {word.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Week of {new Date(word.weekStart).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium shrink-0 ml-2 ${
                        word.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {word.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWordStatus(word.id, word.isActive)}
                    >
                      {word.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteWord(word.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminNav>
  )
}
