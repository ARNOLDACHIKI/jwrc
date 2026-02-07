"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, RotateCcw } from "lucide-react"
import { useState } from "react"

export interface BulkItem {
  id: string
  name?: string
  [key: string]: any
}

interface BulkActionsProps<T extends BulkItem> {
  items: T[]
  onSelectAll?: (selected: boolean) => void
  onSelectItem?: (id: string, selected: boolean) => void
  onDeleteSelected?: (ids: string[]) => Promise<void>
  onRestoreSelected?: (ids: string[]) => Promise<void>
  selectedIds?: Set<string>
  isDeleting?: boolean
  showRestore?: boolean
  customActions?: {
    label: string
    onClick: (ids: string[]) => Promise<void>
    variant?: "default" | "destructive" | "secondary"
  }[]
}

export function BulkActionsBar<T extends BulkItem>({
  items,
  selectedIds = new Set(),
  onDeleteSelected,
  onRestoreSelected,
  isDeleting = false,
  showRestore = false,
  customActions = []
}: BulkActionsProps<T>) {
  const [isLoading, setIsLoading] = useState(false)
  const selectedCount = selectedIds.size
  const allSelected = items.length > 0 && selectedIds.size === items.length

  const handleDeleteAll = async () => {
    const ids = Array.from(selectedIds)
    if (!confirm(`Delete ${ids.length} item(s)?`)) return
    
    if (!onDeleteSelected) return
    
    setIsLoading(true)
    try {
      await onDeleteSelected(ids)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreAll = async () => {
    const ids = Array.from(selectedIds)
    if (!confirm(`Restore ${ids.length} item(s)?`)) return
    
    if (!onRestoreSelected) return
    
    setIsLoading(true)
    try {
      await onRestoreSelected(ids)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomAction = async (action: any) => {
    const ids = Array.from(selectedIds)
    setIsLoading(true)
    try {
      await action.onClick(ids)
    } finally {
      setIsLoading(false)
    }
  }

  if (selectedCount === 0) return null

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="text-sm font-medium text-blue-900 dark:text-blue-400">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </div>
      <div className="flex items-center gap-2">
        {customActions.map((action, idx) => (
          <Button
            key={idx}
            size="sm"
            variant={action.variant || "default"}
            onClick={() => handleCustomAction(action)}
            disabled={isLoading}
          >
            {action.label}
          </Button>
        ))}
        {onDeleteSelected && (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={isLoading || isDeleting}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete All
          </Button>
        )}
        {showRestore && onRestoreSelected && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRestoreAll}
            disabled={isLoading}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restore All
          </Button>
        )}
      </div>
    </div>
  )
}

interface BulkSelectHeaderProps {
  allSelected: boolean
  selectedCount: number
  totalCount: number
  onSelectAll: (selected: boolean) => void
  disabled?: boolean
}

export function BulkSelectHeader({
  allSelected,
  selectedCount,
  totalCount,
  onSelectAll,
  disabled = false
}: BulkSelectHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={allSelected}
        indeterminate={selectedCount > 0 && !allSelected}
        onCheckedChange={(checked) => onSelectAll(!!checked)}
        disabled={disabled}
      />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {selectedCount > 0 ? `${selectedCount}/${totalCount}` : `Select all (${totalCount})`}
      </span>
    </div>
  )
}

interface BulkSelectItemProps {
  id: string
  selected: boolean
  onSelect: (selected: boolean) => void
  disabled?: boolean
}

export function BulkSelectItem({
  id,
  selected,
  onSelect,
  disabled = false
}: BulkSelectItemProps) {
  return (
    <Checkbox
      checked={selected}
      onCheckedChange={(checked) => onSelect(!!checked)}
      disabled={disabled}
    />
  )
}
