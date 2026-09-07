'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { useTabStore, type TabEntry } from '@/components/tabs/tab-provider'
import {
  TabPortalContainerProvider,
} from '@/lib/tab-portal-context'
import { TabParamsProvider } from '@/lib/tab-params'

function EntryPane({ entry, active }: { entry: TabEntry; active: boolean }) {
  const containerRef = useRef<HTMLElement | null>(null)
  const { Component, params } = entry

  return (
    <div
      ref={(el) => {
        containerRef.current = el
      }}
      data-tab-entry
      className={cn(
        'absolute inset-0 overflow-y-auto overscroll-contain pt-6',
        !active && 'invisible pointer-events-none'
      )}
      aria-hidden={!active}
      inert={!active}
    >
      <TabPortalContainerProvider containerRef={containerRef}>
        <TabParamsProvider params={params} active={active}>
          <Component />
        </TabParamsProvider>
      </TabPortalContainerProvider>
    </div>
  )
}

export function TabWorkspace() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()
  const { tabs, activeModule, openOrFocus } = useTabStore()

  const didInit = useRef(false)
  const prevPathRef = useRef(pathname)
  const authHandledRef = useRef(false)

  // Ao montar: sem sessão vai para o login. Com sessão, mantém a rota atual
  // (a aba correspondente será aberta pelo efeito de sincronização abaixo).
  useEffect(() => {
    if (loading || authHandledRef.current) return
    if (!user) {
      authHandledRef.current = true
      router.replace('/login')
      return
    }
    authHandledRef.current = true
  }, [user, loading, router])

  // Sincroniza a URL atual com o sistema de abas.
  // Na montagem (ou após um reload direto em uma rota), abre a aba da rota
  // atual quando ela não for a inicial (Dashboard).
  useEffect(() => {
    if (!authHandledRef.current) return
    const search = window.location.search || ''
    if (!didInit.current) {
      didInit.current = true
      prevPathRef.current = window.location.pathname + search
      if (pathname !== '/') {
        openOrFocus(pathname, search)
      }
      return
    }
    const prev = prevPathRef.current
    const result = openOrFocus(pathname, search)
    if (result === 'blocked') {
      router.replace(prev)
      prevPathRef.current = prev
      return
    }
    prevPathRef.current = window.location.pathname + search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router])

  return (
    <div className="relative h-full min-h-0">
      {tabs.map((tab) => {
        const paneActive = tab.module === activeModule
        return (
          <div
            key={tab.module}
            role="tabpanel"
            className={cn('absolute inset-0', !paneActive && 'invisible pointer-events-none')}
            aria-hidden={!paneActive}
            inert={!paneActive}
          >
            {tab.entries.map((entry, i) => (
              <EntryPane
                key={entry.key}
                entry={entry}
                active={paneActive && i === tab.activeIndex}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}