"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminNav } from "@/components/admin/admin-nav"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, RotateCcw, Clock } from "lucide-react"
import { BulkActionsBar, BulkSelectHeader } from "@/components/ui/bulk-actions"

interface TrashItem {
  id: string
  type: 'volunteer' | 'suggestion' | 'ticket'
  name?: string
  email?: string
  message?: string
  roleTitle?: string
  ref?: string
  eventTitle?: string
  deletedAt: string
}

export default function AdminTrashPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<TrashItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filterType, setFilterType] = useState<'all' | 'volunteers' | 'suggestions' | 'tickets'>('all')

  useEffect(() => {
    loadTrash()
  }, [filterType])

  const loadTrash = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ type: filterType })
      const res = await fetch(`/api/admin/trash?${params}`, {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setItems(data.items || [])
        setSelectedIds(new Set())
      } else {
        toast({ title: 'Error', description: 'Failed to load trash items', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error loading trash:', error)
      toast({ title: 'Error', description: 'Failed to load trash items', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectItem = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedIds)
    if (selected) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(items.map(i => i.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleRestore = async (ids: string[]) => {
    if (!confirm(`Restore ${ids.length} item(s) from trash?`)) return
    
    try {
      const res = await fetch('/api/admin/trash', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, type: filterType })
      })
      
      if (res.ok) {
        setItems(prev => prev.filter(item => !ids.includes(item.id)))
        setSelectedIds(new Set())
        toast({ title: 'Restored', description: `${ids.length} item(s) restored` })
      } else {
        toast({ title: 'Error', description: 'Failed to restore items', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error restoring:', error)
      toast({ title: 'Error', description: 'Failed to restore items', variant: 'destructive' })
    }
  }

  const handlePermanentDelete = async (ids: string[]) => {
    if (!confirm(`Permanently delete ${ids.length} item(s)? This cannot be undone.`)) return
    
    try {
      const res = await fetch('/api/admin/trash', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, type: filterType })
      })
      
      if (res.ok) {
        setItems(prev => prev.filter(item => !ids.includes(item.id)))
        setSelectedIds(new Set())
        toast({ title: 'Deleted', description: `${ids.length} item(s) permanently deleted` })
      } else {
        toast({ title: 'Error', description: 'Failed to delete items', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error deleting:', error)
      toast({ title: 'Error', description: 'Failed to delete items', variant: 'destructive' })
    }
  }

  const allSelected = items.length > 0 && selectedIds.size === items.length
  const daysInTrash = (item: TrashItem) => {
    const deletedDate = new Date(item.deletedAt)
    const now = new Date()
    const days = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getDaysUntilPermanent = (days: number) => {
    const remaining = 7 - days
    return remaining > 0 ? remaining : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Trash</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Items are automatically deleted after 7 days. You can restore or permanently delete them before then.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {(['all', 'volunteers', 'suggestions', 'tickets'] as const).map(type => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              onClick={() => setFilterType(type)}
              className="capitalize"
            >
              {type === 'all' ? 'All Items' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <BulkActionsBar
            items={items}
            selectedIds={selectedIds}
            onDeleteSelected={(ids) => handlePermanentDelete(ids)}
            onRestoreSelected={(ids) => handleRestore(ids)}
            customActions={[
              {
                label: 'Restore',
                onClick: (ids) => handleRestore(ids),
                variant: 'secondary'
              }
            ]}
          />
        )}

        {/* Items List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">Loading trash items...</div>
          </div>
        ) : items.length === 0 ? (
          <Card className="bg-white dark:bg-slate-800 p-8 text-center">
            <Trash2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No items in trash</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center gap-3 border border-gray-200 dark:border-slate-700">
              <BulkSelectHeader
                allSelected={allSelected}
                selectedCount={selectedIds.size}
                totalCount={items.length}
                onSelectAll={handleSelectAll}
              />
            </div>

            {/* Items */}
            {items.map(item => {
              const days = daysInTrash(item)
              const daysRemaining = getDaysUntilPermanent(days)
              const isSelected = selectedIds.has(item.id)

              return (
                <Card
                  key={item.id}
                  className={`bg-white dark:bg-slate-800 p-4 flex items-center justify-between transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 capitalize">
                          {item.type}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Deleted {days} day{days !== 1 ? 's' : ''} ago
                        </span>
                      </div>

                      {item.type === 'volunteer' && (
                        <>
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.email} • {item.roleTitle}</p>
                        </>
                      )}

                      {item.type === 'suggestion' && (
                        <>
                          <p className="font-medium text-gray-900 dark:text-white">{item.name || item.email}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.message}</p>
                        </>
                      )}

                      {item.type === 'ticket' && (
                        <>
                          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.email} • {item.eventTitle}</p>
                        </>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Auto-delete on {new Date(new Date(item.deletedAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleRestore([item.id])}
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handlePermanentDelete([item.id])}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
