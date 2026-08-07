'use client'

import { ModernTabs, type ModernTabItem } from '@/components/ui/modern-tabs'

export type TabValue = 'visao-geral' | 'academico' | 'frequencia' | 'alertas'

export type TabConfig = {
  value: TabValue
  label: string
  badge?: number
}

type DashboardTabsProps = {
  tabs: TabConfig[]
  children: React.ReactNode
  className?: string
  scroll?: boolean
}

export function DashboardTabs({ tabs, children, className, scroll = false }: DashboardTabsProps) {
  return (
    <ModernTabs tabs={tabs as ModernTabItem[]} className={className} scroll={scroll} fullWidth>
      {children}
    </ModernTabs>
  )
}
