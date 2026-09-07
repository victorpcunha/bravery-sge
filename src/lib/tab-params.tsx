'use client'

import { createContext, useContext } from 'react'
import { useParams } from 'next/navigation'

export type TabParams = Record<string, string>

type TabContextValue = {
  params: TabParams
  active: boolean
}

const TabContext = createContext<TabContextValue>({ params: {}, active: true })

export function TabParamsProvider({
  params,
  active = true,
  children,
}: {
  params: TabParams
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <TabContext.Provider value={{ params, active }}>
      {children}
    </TabContext.Provider>
  )
}

/**
 * Lê os parâmetros de rota da aba interna (quando a página é renderizada pelo
 * TabWorkspace). Fora das abas, cai de volta no `useParams()` do Next.
 */
export function useTabParams(): TabParams {
  const ctx = useContext(TabContext)
  const own = useParams() as TabParams
  if (Object.keys(ctx.params).length > 0) return ctx.params
  return own || {}
}

/**
 * Indica se a entrada (painel) da aba está ativa/visível. Fora do sistema de
 * abas, é sempre `true`. Permite que páginas com keep-alive refaçam buscas
 * quando voltam a ficar visíveis (ex.: voltar do cadastro para a listagem).
 */
export function useTabActive(): boolean {
  return useContext(TabContext).active
}