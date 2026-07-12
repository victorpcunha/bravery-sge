'use client'

import { cn } from '@/lib/utils'

export type PillOption = {
  value: string
  label: string
  disabled?: boolean
}

type PillToggleGroupProps = {
  options: PillOption[]
  multiple?: boolean
  value?: string
  onValueChange?: (value: string) => void
  selectedValues?: string[]
  onToggleValue?: (value: string) => void
  className?: string
  size?: 'sm' | 'md'
}

export function PillToggleGroup({
  options,
  multiple = false,
  value,
  onValueChange,
  selectedValues = [],
  onToggleValue,
  className,
  size = 'md',
}: PillToggleGroupProps) {
  const isActive = (opt: PillOption) => {
    if (multiple) return selectedValues.includes(opt.value)
    return value === opt.value
  }

  const handleClick = (opt: PillOption) => {
    if (opt.disabled) return
    if (multiple) {
      onToggleValue?.(opt.value)
    } else {
      onValueChange?.(opt.value)
    }
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map(opt => {
        const active = isActive(opt)
        return (
          <button
            key={opt.value}
            type="button"
            disabled={opt.disabled}
            onClick={() => handleClick(opt)}
            className={cn(
              'rounded-md border transition-[color,box-shadow] outline-none whitespace-nowrap font-medium',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-2 text-[13px]',
              active
                ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                : 'border-border bg-card text-foreground hover:border-primary/60 hover:bg-muted/50',
              opt.disabled && 'opacity-50 cursor-not-allowed line-through',
              !opt.disabled && 'cursor-pointer',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}