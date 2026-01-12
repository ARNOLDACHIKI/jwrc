import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, style, ...props }: React.ComponentProps<'textarea'>) {
  // ensure textarea uses normal horizontal writing mode and no transforms
  const mergedStyle = { writingMode: 'horizontal-tb' as const, transform: 'none', ...(style || {}) }

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y',
        className,
      )}
      style={mergedStyle}
      {...props}
    />
  )
}

export { Textarea }
