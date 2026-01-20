'use client'

import { useState, useEffect } from 'react'
import { MainNav } from '@/components/navigation/main-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface Reminder {
  id: string
  title: string
  message: string
  isActive: boolean
  template: string
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

export default function AdminRemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isActive, setIsActive] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchReminders()
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

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Reminders</h1>

        <div className="grid md:grid-cols-2 gap-8">
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
      </div>
    </div>
  )
}
