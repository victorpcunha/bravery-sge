'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'

export default function GestaoAcademicaPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      // Redireciona automaticamente para Estrutura Acadêmica
      router.push('/gestao-academica/estrutura-academica')
    }
  }, [user, loading, router])

  return null
}