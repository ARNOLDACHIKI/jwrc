'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, LogOut } from 'lucide-react'

interface Reminder {
  id: string
  title: string
  message: string
  isActive: boolean
  template: string
  createdAt: string
}

interface WeeklyProgram {
  id: string
  name: string
  day: string
  time: string
  isActive: boolean
  createdAt: string
}

const TEMPLATES = [
  {
    id: 'midweek',
    name: 'Midweek Service',
    title: 'Upcoming Program Reminder',
    message: 'Midweek Service - Wednesday 7:00 PM'
  },
  {
    id: 'youth',
    name: 'Youth Group',
    title: 'Upcoming Program Reminder',
    message: 'Youth Group - Thursday 6:00 PM'
  },
  {
    id: 'sunday',
    name: 'Sunday Service',
    title: 'Upcoming Program Reminder',
    message: 'Sunday Service - 10:00 AM'
  },
  {
    id: 'combined',
    name: 'Combined Programs',
    title: 'Upcoming Program Reminder',
    message: 'Midweek Service - Wednesday 7:00 PM | Youth Group - Thursday 6:00 PM | Sunday Service - 10:00 AM'
  }
]

const PROGRAM_TEMPLATES = [
  {
    id: 'sunday',
    name: 'Sunday Service',
    day: 'Sunday',
    time: '10:00 AM'
  },
  {
    id: 'midweek',
    name: 'Midweek Service',
    day: 'Wednesday',
    time: '7:00 PM'
  },
  {
    id: 'youth',
    name: 'Youth Group',
    day: 'Thursday',
    time: '6:00 PM'
  },
  {
    id: 'prayer',
    name: 'Prayer Meeting',
    day: 'Friday',
    time: '6:00 PM'
  },
  {
    id: 'bible-study',
    name: 'Bible Study',
    day: 'Tuesday',
    time: '7:00 PM'
  }
]

export default function AdminRemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [weeklyPrograms, setWeeklyPrograms] = useState<WeeklyProgram[]>([])
  const [showWeeklyPrograms, setShowWeeklyPrograms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isActive, setIsActive] = useState(true)
  
  // Weekly program form states
  const [selectedProgramTemplate, setSelectedProgramTemplate] = useState<string>('custom')
  const [programName, setProgramName] = useState('')
  const [programDay, setProgramDay] = useState('')
  const [programTime, setProgramTime] = useState('')
  
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    fetchReminders()
    fetchWeeklyPrograms()
  }, [])

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/admin/reminders')
      if (response.ok) {
        const data = await response.json()
        setReminders(data)
      }
    } catch (error) {
      console.error('Error fetching reminders:', error)
    }
  }

  const fetchWeeklyPrograms = async () => {
    try {
      const response = await fetch('/api/admin/weekly-programs')
      if (response.ok) {
        const data = await response.json()
        setWeeklyPrograms(data)
      }
    } catch (error) {
      console.error('Error fetching weekly programs:', error)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    if (templateId !== 'custom') {
      const template = TEMPLATES.find(t => t.id === templateId)
      if (template) {
        setTitle(template.title)
        setMessage(template.message)
      }
    } else {
      setTitle('')
      setMessage('')
    }
  }

  const handleProgramTemplateSelect = (templateId: string) => {
    setSelectedProgramTemplate(templateId)
    if (templateId !== 'custom') {
      const template = PROGRAM_TEMPLATES.find(t => t.id === templateId)
      if (template) {
        setProgramName(template.name)
        setProgramDay(template.day)
        setProgramTime(template.time)
      }
    } else {
      setProgramName('')
      setProgramDay('')
      setProgramTime('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          message,
          template: selectedTemplate,
          isActive
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Reminder created successfully'
        })
        setTitle('')
        setMessage('')
        setSelectedTemplate('custom')
        setIsActive(true)
        fetchReminders()
      } else {
        throw new Error('Failed to create reminder')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create reminder',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReminderStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/reminders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Reminder ${!currentStatus ? 'activated' : 'deactivated'}`
        })
        fetchReminders()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reminder',
        variant: 'destructive'
      })
    }
  }

  const deleteReminder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return

    try {
      const response = await fetch(`/api/admin/reminders/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Reminder deleted successfully'
        })
        fetchReminders()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete reminder',
        variant: 'destructive'
      })
    }
  }

  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/weekly-programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: programName,
          day: programDay,
          time: programTime
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Weekly program created successfully'
        })
        setProgramName('')
        setProgramDay('')
        setProgramTime('')
        setSelectedProgramTemplate('custom')
        fetchWeeklyPrograms()
      } else {
        throw new Error('Failed to create program')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create weekly program',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleProgramStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/weekly-programs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Program ${!currentStatus ? 'activated' : 'deactivated'}`
        })
        fetchWeeklyPrograms()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update program',
        variant: 'destructive'
      })
    }
  }

  const deleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return

    try {
      const response = await fetch(`/api/admin/weekly-programs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Program deleted successfully'
        })
        fetchWeeklyPrograms()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete program',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-slate-800 shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Reminders & Programs</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showWeeklyPrograms ? 'default' : 'outline'}
              onClick={() => setShowWeeklyPrograms(!showWeeklyPrograms)}
            >
              {showWeeklyPrograms ? 'Show Reminders' : 'Weekly Programmes'}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">{!showWeeklyPrograms ? (
          <div className="grid md:grid-cols-2 gap-8">{/* Existing reminders UI */}
          {/* Create Reminder Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Reminder</CardTitle>
              <CardDescription>
                Select a template or create a custom reminder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Template</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATES.map((template) => (
                      <Button
                        key={template.id}
                        type="button"
                        variant={selectedTemplate === template.id ? 'default' : 'outline'}
                        onClick={() => handleTemplateSelect(template.id)}
                        className="w-full"
                      >
                        {template.name}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant={selectedTemplate === 'custom' ? 'default' : 'outline'}
                      onClick={() => handleTemplateSelect('custom')}
                      className="col-span-2"
                    >
                      Custom Reminder
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter reminder title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter reminder message"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="active">Active (Display on website)</Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Reminder'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Reminders */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Existing Reminders</h2>
            {reminders.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No reminders created yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              reminders.map((reminder) => (
                <Card key={reminder.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{reminder.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {reminder.message}
                        </CardDescription>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        reminder.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {reminder.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReminderStatus(reminder.id, reminder.isActive)}
                    >
                      {reminder.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Create Weekly Program Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Weekly Program</CardTitle>
                <CardDescription>
                  Select a template or create a custom program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProgramSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Template</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PROGRAM_TEMPLATES.map((template) => (
                        <Button
                          key={template.id}
                          type="button"
                          variant={selectedProgramTemplate === template.id ? 'default' : 'outline'}
                          onClick={() => handleProgramTemplateSelect(template.id)}
                          className="w-full"
                        >
                          {template.name}
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant={selectedProgramTemplate === 'custom' ? 'default' : 'outline'}
                        onClick={() => handleProgramTemplateSelect('custom')}
                        className="col-span-2"
                      >
                        Custom Program
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="programName">Program Name</Label>
                    <Input
                      id="programName"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      placeholder="e.g., Sunday Service, Youth Group"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="programDay">Day</Label>
                    <select
                      id="programDay"
                      value={programDay}
                      onChange={(e) => setProgramDay(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md"
                      required
                    >
                      <option value="">Select a day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="programTime">Time</Label>
                    <Input
                      id="programTime"
                      value={programTime}
                      onChange={(e) => setProgramTime(e.target.value)}
                      placeholder="e.g., 10:00 AM, 6:00 PM"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Program'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Programs */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Weekly Programs</h2>
              {weeklyPrograms.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No weekly programs added yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                weeklyPrograms.map((program) => (
                  <Card key={program.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{program.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {program.day} at {program.time}
                          </CardDescription>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          program.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {program.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleProgramStatus(program.id, program.isActive)}
                      >
                        {program.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProgram(program.id)}
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
