'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { getPortalSupabase } from '@/lib/portal-client'
import { getSessaoPortal, type AlunoVinculado, type SessaoPortal } from '@/lib/actions/portal'

export type EscolaPortalCtx = {
  schoolId: string
  slug: string
  nome: string
  branding: {
    nome: string
    logo: string | null
    imagemFundo: string | null
    textoLogin: string | null
  } | null
}

type PortalContextValue = {
  user: User | null
  escola: EscolaPortalCtx | null
  sessao: SessaoPortal | null
  alunos: AlunoVinculado[]
  aluno: AlunoVinculado | null
  loading: boolean
  selecionarAluno: (alunoId: string) => void
  refresh: () => Promise<void>
  sair: () => Promise<void>
}

const PortalContext = createContext<PortalContextValue | null>(null)

const STORAGE_ALUNO = 'portal.alunoId'

export function PortalProvider({
  children,
  escola = null,
}: {
  children: React.ReactNode
  escola?: EscolaPortalCtx | null
}) {
  const router = useRouter()
  const pathname = usePathname()
  const base = escola ? `/portal/${escola.slug}` : '/portal'
  const [user, setUser] = useState<User | null>(null)
  const [sessao, setSessao] = useState<SessaoPortal | null>(null)
  const [alunoId, setAlunoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // Evita refetch em cascata quando o browser dispara eventos de sessão
  // (ex.: voltar de outra aba): só atualiza se os dados mudaram de verdade.
  const sessaoChave = useRef<string>('')

  const carregar = useCallback(async (u: User | null) => {
    if (!u) {
      sessaoChave.current = ''
      setUser(null)
      setSessao(null)
      return
    }
    // Gate: só credencial do portal (R2/R8). Interna é recusada sem revelar motivo.
    if (u.user_metadata?.portal_only !== true) {
      await getPortalSupabase().auth.signOut()
      sessaoChave.current = ''
      setUser(null)
      setSessao(null)
      return
    }
    const personId = String(u.user_metadata?.person_id || '')
    if (!personId) {
      await getPortalSupabase().auth.signOut()
      sessaoChave.current = ''
      setUser(null)
      setSessao(null)
      return
    }
    try {
      const s = await getSessaoPortal(personId, escola?.schoolId)
      const chave = JSON.stringify(s)
      if (sessaoChave.current === chave) return
      sessaoChave.current = chave
      setUser(u)
      setSessao(s)
      // Auto-seleção: 1 vínculo entra direto (FR-008)
      const salvos = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_ALUNO) : null
      const valido = salvos && s.alunos.some(a => a.alunoId === salvos)
      if (s.alunos.length === 1) {
        setAlunoId(s.alunos[0].alunoId)
      } else if (valido) {
        setAlunoId(salvos)
      } else {
        setAlunoId(null)
      }
    } catch {
      await getPortalSupabase().auth.signOut()
      sessaoChave.current = ''
      setUser(null)
      setSessao(null)
    }
  }, [escola?.schoolId])

  useEffect(() => {
    const supabase = getPortalSupabase()
    setLoading(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      carregar(session?.user ?? null).finally(() => setLoading(false))
    }).catch(() => setLoading(false))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      carregar(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [carregar])

  // Guards de navegação (client-side, padrão do projeto — sem middleware)
  useEffect(() => {
    const loginPath = `${base}/login`
    const termoPath = `${base}/termo`
    const alunoPath = `${base}/aluno`
    const selecionarPath = `${base}/selecionar-aluno`
    if (loading || pathname === loginPath) return
    if (!user || !sessao) {
      router.replace(loginPath)
      return
    }
    if (sessao.termoPendente && pathname !== termoPath) {
      router.replace(termoPath)
      return
    }
    if (!sessao.termoPendente && pathname === termoPath) {
      router.replace(alunoPath)
      return
    }
    if (!sessao.termoPendente && sessao.alunos.length !== 1 && !alunoId && pathname !== selecionarPath) {
      router.replace(selecionarPath)
    }
  }, [loading, user, sessao, alunoId, pathname, router, base])

  const selecionarAluno = useCallback((id: string) => {
    setAlunoId(id)
    try {
      window.localStorage.setItem(STORAGE_ALUNO, id)
    } catch { /* noop */ }
  }, [])

  const refresh = useCallback(async () => {
    const { data: { session } } = await getPortalSupabase().auth.getSession()
    await carregar(session?.user ?? null)
  }, [carregar])

  const sair = useCallback(async () => {
    await getPortalSupabase().auth.signOut()
    try {
      window.localStorage.removeItem(STORAGE_ALUNO)
    } catch { /* noop */ }
    sessaoChave.current = ''
    setUser(null)
    setSessao(null)
    setAlunoId(null)
    router.replace(`${base}/login`)
  }, [router, base])

  const aluno = useMemo(
    () => sessao?.alunos.find(a => a.alunoId === alunoId) ?? null,
    [sessao, alunoId]
  )

  const value = useMemo(
    () => ({ user, escola, sessao, alunos: sessao?.alunos ?? [], aluno, loading, selecionarAluno, refresh, sair }),
    [user, escola, sessao, aluno, loading, selecionarAluno, refresh, sair]
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal() {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal deve ser usado dentro de PortalProvider')
  return ctx
}
