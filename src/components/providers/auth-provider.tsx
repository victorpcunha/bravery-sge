'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/auth'
import { getUserAuthInfo } from '@/lib/actions/schools'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  schoolId: string | null
  isSuperAdmin: boolean
  allSchools: { id: string; nome_escola: string }[]
  nomeCompleto: string
  iniciais: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function formatarNome(user: User): string {
  const emailName = user.email?.split('@')[0] || ''
  return emailName
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ')
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [allSchools, setAllSchools] = useState<{ id: string; nome_escola: string }[]>([])
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [iniciais, setIniciais] = useState('')

  useEffect(() => {
    const supabase = getSupabaseClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setSchoolId(null)
      setIsSuperAdmin(false)
      setAllSchools([])
      return
    }

    let tentativa = 0
    const carregarInfo = () => {
      getUserAuthInfo(user.id, user.email || '').then((info) => {
        setIsSuperAdmin(info.isSuperAdmin)
        setAllSchools(info.allSchools)
        if (info.isSuperAdmin) {
          setSchoolId(null)
        } else if (info.schoolIds.length > 0) {
          setSchoolId(info.schoolIds[0])
        }
      }).catch((err) => {
        // Fetch de server action pode falhar transitoriamente durante HMR/recompile do dev server
        if (tentativa === 0) {
          tentativa++
          setTimeout(carregarInfo, 800)
        } else {
          console.error('[AuthProvider] getUserAuthInfo failed:', err)
        }
      })
    }
    carregarInfo()

    ;(async () => {
      const supabase = getSupabaseClient()
      try {
        const { data } = await supabase.from('people').select('nome_completo').eq('email', user.email?.toLowerCase().trim()).maybeSingle()
        const nome = data?.nome_completo || formatarNome(user)
        setNomeCompleto(nome)
        setIniciais(getInitials(nome))
      } catch {
        const nome = formatarNome(user)
        setNomeCompleto(nome)
        setIniciais(getInitials(nome))
      }
    })()
  }, [user])

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabaseClient()

    let emailFinal = email
    if (/^\d{11}$/.test(email.replace(/\D/g, ''))) {
      const cpf = email.replace(/\D/g, '')
      const { getPessoaPorCpf } = await import('@/lib/actions/people')
      const pessoa = await getPessoaPorCpf(cpf)
      if (pessoa?.email) {
        emailFinal = pessoa.email
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailFinal,
      password,
    })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    setSchoolId(null)
    setIsSuperAdmin(false)
    setAllSchools([])
    setNomeCompleto('')
    setIniciais('')
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, schoolId, isSuperAdmin, allSchools, nomeCompleto, iniciais }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}