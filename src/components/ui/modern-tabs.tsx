'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export type ModernTabItem = {
  value: string
  label: string
  badge?: number
}

type ModernTabsProps = {
  tabs: ModernTabItem[]
  children: React.ReactNode
  className?: string
  scroll?: boolean
  defaultValue?: string
  urlSync?: boolean
  fullWidth?: boolean
}

export function ModernTabs({
  tabs,
  children,
  className,
  scroll = false,
  defaultValue,
  urlSync = true,
  fullWidth = false,
}: ModernTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const firstValue = tabs[0]?.value ?? ''
  const fallback = defaultValue ?? firstValue

  const isValid = (v: string | null): v is string => v !== null && tabs.some(t => t.value === v)

  const [activeTab, setActiveTab] = useState<string>(
    isValid(tabFromUrl) ? (tabFromUrl as string) : fallback
  )

  useEffect(() => {
    if (isValid(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl, activeTab])

  const handleChange = (value: string) => {
    setActiveTab(value)
    if (!urlSync) return
    const params = new URLSearchParams(searchParams.toString())
    if (value === firstValue) {
      params.delete('tab')
    } else {
      params.set('tab', value)
    }
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : '?', { scroll })
  }

  const childArray = Array.isArray(children) ? children : [children]

  return (
    <Tabs value={activeTab} onValueChange={handleChange} className={className}>
      <div className="relative -mx-4 sm:mx-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList
          variant="default"
          className={cn(
            'mx-4 mb-6 flex h-auto w-max min-h-[48px] gap-1 rounded-lg border border-border bg-card p-1 shadow-xs sm:mx-0',
            fullWidth ? 'sm:w-full' : 'sm:w-1/2'
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'group/tab h-10 min-h-[40px] flex-1 rounded-md px-4',
                'text-[14px] font-semibold text-foreground/80 transition-colors',
                'hover:bg-accent/10 hover:text-accent-foreground',
                'data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground',
                'data-active:[&_span.badge]:bg-primary-foreground/20 data-active:[&_span.badge]:text-primary-foreground'
              )}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="badge flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive/10 px-1.5 text-[11px] font-semibold text-destructive tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab, i) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-0 focus-visible:outline-none"
        >
          {childArray[i]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
