'use client'

import { createContext, useContext, type MutableRefObject } from 'react'

/**
 * Guarda o elemento DOM da entrada (entry) ativa de uma aba. Os componentes
 * shadcn (Dialog, Popover, Select, ...) usam o context para montar seus
 * overlays DENTRO da entrada, para que fiquem ocultos junto com a aba quando
 * o usuário troca de aba (a entrada inativa é `visibility:hidden`).
 */
export type TabPortalContainerRef = MutableRefObject<HTMLElement | null>

export const TabPortalContainerContext =
  createContext<TabPortalContainerRef | null>(null)

export function TabPortalContainerProvider({
  containerRef,
  children,
}: {
  containerRef: TabPortalContainerRef
  children: React.ReactNode
}) {
  return (
    <TabPortalContainerContext.Provider value={containerRef}>
      {children}
    </TabPortalContainerContext.Provider>
  )
}

/** Retorna o elemento onde os portais devem ser montados (null = document.body). */
export function useTabPortalContainer(): HTMLElement | null {
  return useContext(TabPortalContainerContext)?.current ?? null
}