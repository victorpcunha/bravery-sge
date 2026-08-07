'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

type ClickablePillProps = {
  label: React.ReactNode
  active: boolean
  onClick: () => void
  disabled?: boolean
  title?: string
  className?: string
}

export function ClickablePill({ label, active, onClick, disabled, title, className }: ClickablePillProps) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3.5 h-9 min-h-[36px] text-[14px] font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        active
          ? 'bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary hover:text-primary-foreground'
          : 'bg-muted/40 text-foreground border-border hover:bg-accent/10 hover:text-accent-foreground',
        className
      )}
    >
      {active && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      {label}
    </button>
  )
}
