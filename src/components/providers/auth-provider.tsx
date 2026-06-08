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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [allSchools, setAllSchools] = useState<{ id: string; nome_escola: string }[]>([])

  useEffect(() => {
    const supabase = getSupabaseClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
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

    getUserAuthInfo(user.id, user.email || '').then((info) => {
      setIsSuperAdmin(info.isSuperAdmin)
      setAllSchools(info.allSchools)
      if (info.isSuperAdmin) {
        setSchoolId(null)
      } else if (info.schoolIds.length > 0) {
        setSchoolId(info.schoolIds[0])
      }
    }).catch((err) => {
      console.error('[AuthProvider] getUserAuthInfo failed:', err)
    })
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
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut, schoolId, isSuperAdmin, allSchools }}>
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