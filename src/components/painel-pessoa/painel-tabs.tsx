'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export type PainelTabValue = 'visao-geral' | 'desempenho' | 'academico' | 'historico'

const VALID_TABS: PainelTabValue[] = ['visao-geral', 'desempenho', 'academico', 'historico']

function isValidTab(v: string | null): v is PainelTabValue {
  return v !== null && (VALID_TABS as string[]).includes(v)
}

const TABS: { value: PainelTabValue; label: string; disabledWhenNoTurma: boolean }[] = [
  { value: 'visao-geral', label: 'Visão Geral', disabledWhenNoTurma: false },
  { value: 'desempenho', label: 'Desempenho', disabledWhenNoTurma: true },
  { value: 'academico', label: 'Acadêmico', disabledWhenNoTurma: true },
  { value: 'historico', label: 'Histórico', disabledWhenNoTurma: false },
]

type PainelTabsProps = {
  hasTurma: boolean
  children: React.ReactNode
}

export function PainelTabs({ hasTurma, children }: PainelTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<PainelTabValue>(
    isValidTab(tabFromUrl) ? tabFromUrl : 'visao-geral'
  )

  const handleChange = (value: string) => {
    if (!isValidTab(value)) return
    setActiveTab(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'visao-geral') {
      params.delete('tab')
    } else {
      params.set('tab', value)
    }
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : '?', { scroll: false })
  }

  const childArray = Array.isArray(children) ? children : [children]

  return (
    <Tabs value={activeTab} onValueChange={handleChange}>
      <div className="relative -mx-4 sm:mx-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsList className="mx-4 mb-6 flex h-auto min-h-[48px] w-max gap-1 rounded-lg border border-border bg-card p-1 shadow-xs sm:mx-0 sm:w-full">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabledWhenNoTurma && !hasTurma}
              className={cn(
                'h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-foreground/80'
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {TABS.map((tab, i) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-0 focus-visible:outline-none">
          {childArray[i]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
