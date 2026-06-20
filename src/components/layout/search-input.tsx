'use client'

import { cn } from '@/lib/utils'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function SearchInput({ value, onChange, placeholder, className, debounceMs = 0 }: SearchInputProps) {
  return (
    <div className={cn('relative flex-1 min-w-[200px]', className)}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          if (debounceMs > 0) {
            const val = e.target.value
            const timer = setTimeout(() => onChange(val), debounceMs)
            return () => clearTimeout(timer)
          }
          onChange(e.target.value)
        }}
        placeholder={placeholder || 'Buscar...'}
        className="h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </div>
  )
}