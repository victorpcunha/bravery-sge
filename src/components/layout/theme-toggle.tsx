'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button
        className={cn(
          "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full",
          "text-sidebar-foreground/60 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
          "transition-all duration-200"
        )}
        aria-label="Alternar tema"
      >
        <div className="p-1.5 rounded-md">
          <div className="h-4 w-4" />
        </div>
        <span>Tema</span>
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      className={cn(
        "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full",
        "text-sidebar-foreground/60 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
        "transition-all duration-200"
      )}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Modo claro' : 'Modo escuro'}
    >
      <div className="p-1.5 rounded-md bg-sidebar-accent/10">
        {isDark ? (
          <Sun className="h-4 w-4 text-sidebar-primary transition-transform duration-200" />
        ) : (
          <Moon className="h-4 w-4 text-sidebar-primary transition-transform duration-200" />
        )}
      </div>
      <span>{isDark ? 'Modo claro' : 'Modo escuro'}</span>
    </button>
  )
}