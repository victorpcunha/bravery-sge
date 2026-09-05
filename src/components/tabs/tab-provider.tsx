'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from 'react'
import { toast } from 'sonner'
import {
  HOME_MODULE,
  MAX_TABS,
  MODULES,
  resolveTabRoute,
  TAB_MODULES,
  type TabModuleId,
} from '@/lib/tab-routes'
import type { TabParams } from '@/lib/tab-params'

export type TabEntry = {
  key: string
  pathname: string
  search: string
  params: TabParams
  Component: ComponentType
}

export type TabData = {
  module: TabModuleId
  entries: TabEntry[]
  activeIndex: number
}

type OpenResult = 'ok' | 'blocked' | 'ignored'

type TabContextValue = {
  tabs: TabData[]
  activeModule: TabModuleId
  activeTab: TabData
  openOrFocus: (pathname: string, search?: string) => OpenResult
  closeTab: (module: TabModuleId) => string | null
  activateTab: (module: TabModuleId) => string | null
}

const TabContext = createContext<TabContextValue | undefined>(undefined)

/** Caminho completo de uma entrada (pathname + query), usado para manter a URL sincronizada. */
export function entryPath(entry: TabEntry): string {
  return entry.search ? `${entry.pathname}${entry.search}` : entry.pathname
}

function createDashboardTab(): TabData {
  const resolved = resolveTabRoute('/')
  if (!resolved) {
    throw new Error('Rota do Dashboard não registrada')
  }
  return {
    module: HOME_MODULE,
    entries: [
      {
        key: '/',
        pathname: '/',
        search: '',
        params: {},
        Component: resolved.Component,
      },
    ],
    activeIndex: 0,
  }
}

function makeEntry(
  pathname: string,
  search: string,
  resolved: { params: TabParams; Component: ComponentType }
): TabEntry {
  return {
    key: `${pathname}${search}`,
    pathname,
    search,
    params: resolved.params,
    Component: resolved.Component,
  }
}

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<TabData[]>(() => [createDashboardTab()])
  const [activeModule, setActiveModule] = useState<TabModuleId>(HOME_MODULE)

  const tabsRef = useRef<TabData[]>(tabs)
  useEffect(() => {
    tabsRef.current = tabs
  }, [tabs])

  const openOrFocus = useCallback(
    (pathname: string, search = ''): OpenResult => {
      const resolved = resolveTabRoute(pathname)
      if (!resolved) return 'ignored'

      const currentTabs = tabsRef.current
      const existing = currentTabs.find((t) => t.module === resolved.module)

      if (!existing) {
        if (currentTabs.length >= MAX_TABS) {
          toast.error(
            `Limite de ${MAX_TABS} abas atingido. Feche uma aba para abrir outra.`
          )
          return 'blocked'
        }
        setTabs((prev) => [
          ...prev,
          {
            module: resolved.module,
            entries: [makeEntry(pathname, search, resolved)],
            activeIndex: 0,
          },
        ])
        setActiveModule(resolved.module)
        return 'ok'
      }

      const key = `${pathname}${search}`
      const idx = existing.entries.findIndex((e) => e.key === key)
      if (idx >= 0) {
        setTabs((prev) =>
          prev.map((t) =>
            t.module === resolved.module ? { ...t, activeIndex: idx } : t
          )
        )
      } else {
        setTabs((prev) =>
          prev.map((t) =>
            t.module === resolved.module
              ? {
                  ...t,
                  entries: [...t.entries, makeEntry(pathname, search, resolved)],
                  activeIndex: t.entries.length,
                }
              : t
          )
        )
      }
      setActiveModule(existing.module)
      return 'ok'
    },
    []
  )

  const closeTab = useCallback((module: TabModuleId): string | null => {
    const currentTabs = tabsRef.current
    const idx = currentTabs.findIndex((t) => t.module === module)
    if (idx < 0) return null

    const remaining = currentTabs.filter((t) => t.module !== module)

    if (remaining.length === 0) {
      const dashboard = createDashboardTab()
      setTabs([dashboard])
      setActiveModule(HOME_MODULE)
      return '/'
    }

    const nextActive = remaining[Math.min(idx, remaining.length - 1)]
    setTabs(remaining)
    setActiveModule(nextActive.module)
    return entryPath(nextActive.entries[nextActive.activeIndex])
  }, [])

  const activateTab = useCallback((module: TabModuleId): string | null => {
    const tab = tabsRef.current.find((t) => t.module === module)
    if (!tab) return null
    setActiveModule(module)
    return entryPath(tab.entries[tab.activeIndex])
  }, [])

  const value = useMemo<TabContextValue>(() => {
    const activeTab =
      tabs.find((t) => t.module === activeModule) ?? tabs[0]
    return { tabs, activeModule, activeTab, openOrFocus, closeTab, activateTab }
  }, [tabs, activeModule, openOrFocus, closeTab, activateTab])

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>
}

export function useTabStore(): TabContextValue {
  const ctx = useContext(TabContext)
  if (!ctx) {
    throw new Error('useTabStore must be used within a TabProvider')
  }
  return ctx
}

export { TAB_MODULES, MODULES }