'use client'

import { createContext, useContext } from 'react'
import { useParams } from 'next/navigation'

export type TabParams = Record<string, string>

const TabParamsContext = createContext<TabParams>({})

export function TabParamsProvider({
  params,
  children,
}: {
  params: TabParams
  children: React.ReactNode
}) {
  return (
    <TabParamsContext.Provider value={params}>
      {children}
    </TabParamsContext.Provider>
  )
}

/**
 * Lê os parâmetros de rota da aba interna (quando a página é renderizada pelo
 * TabWorkspace). Fora das abas, cai de volta no `useParams()` do Next.
 */
export function useTabParams(): TabParams {
  const ctx = useContext(TabParamsContext)
  const own = useParams() as TabParams
  if (Object.keys(ctx).length > 0) return ctx
  return own || {}
}