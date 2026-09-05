'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MODULES } from '@/lib/tab-routes'
import { useTabStore } from '@/components/tabs/tab-provider'

export function TabBar() {
  const router = useRouter()
  const { tabs, activeModule, activateTab, closeTab } = useTabStore()

  const handleActivate = (module: string) => {
    const path = activateTab(module as never)
    if (path) router.replace(path)
  }

  const handleClose = (module: string) => {
    const path = closeTab(module as never)
    if (path) router.replace(path)
  }

  return (
    <nav
      role="tablist"
      aria-label="Abas internas"
      className="sticky top-12 z-30 flex h-9 shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-card px-2 shadow-xs"
    >
      {tabs.map((tab) => {
        const meta = MODULES[tab.module]
        const Icon = meta?.icon
        const isActive = tab.module === activeModule
        return (
          <div
            key={tab.module}
            role="presentation"
            className={cn(
              'group flex h-7 items-center rounded-md transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleActivate(tab.module)}
              className="flex h-7 items-center gap-1.5 pl-2.5 pr-1 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
            >
              {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
              <span className="max-w-[140px] truncate">{meta?.title ?? tab.module}</span>
            </button>
            <button
              type="button"
              aria-label={`Fechar aba ${meta?.title ?? tab.module}`}
              onClick={() => handleClose(tab.module)}
              className="mr-1 flex h-5 w-5 items-center justify-center rounded-sm text-current opacity-60 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 hover:opacity-100 group-hover:opacity-90"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )
      })}
    </nav>
  )
}