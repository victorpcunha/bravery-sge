'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/auth'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabaseClient()

    // Se o input tem 11 dígitos, busca por CPF
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
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
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