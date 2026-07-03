'use client'

import { cn } from '@/lib/utils'

type FilterBarProps = {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  children?: React.ReactNode
  className?: string
}

export function FilterBar({ searchValue, onSearchChange, searchPlaceholder, children, className }: FilterBarProps) {
  return (
    <div className={cn('flex items-center gap-4 flex-wrap', className)}>
      {searchValue !== undefined && onSearchChange && (
        <div className="relative flex-1 min-w-[200px]">
          {/* SearchInput is inlined here for simplicity; import SearchInput separately for standalone use */}
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
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder || 'Buscar...'}
            className="h-9 w-full rounded-md border border-border bg-transparent pl-10 pr-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      )}
      {children}
    </div>
  )
}