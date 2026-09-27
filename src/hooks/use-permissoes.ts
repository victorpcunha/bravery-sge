'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { getPessoaPorEmail } from '@/lib/actions/people'
import { getPermissoesPorPessoa, type PermissoesPorRecurso } from '@/lib/actions/perfis'

type PermissoesState = {
  loaded: boolean
  pessoaId: string | null
  permissoes: PermissoesPorRecurso
  error: string | null
}

export function usePermissoes(schoolId: string | null) {
  const { user, isSuperAdmin, pessoaId: pessoaIdAuth } = useAuth()
  // Deps estáveis: o objeto `user` ganha nova identidade a cada evento de sessão
  // (ex.: TOKEN_REFRESHED ao voltar à guia) mesmo sem troca de usuário.
  const userId = user?.id
  const userEmail = user?.email
  const [state, setState] = useState<PermissoesState>({
    loaded: false,
    pessoaId: null,
    permissoes: {},
    error: null,
  })

  useEffect(() => {
    if (!userId) return

    if (!schoolId && !isSuperAdmin) {
      setState({ loaded: true, pessoaId: null, permissoes: {}, error: 'Usuário sem escola vinculada' })
      return
    }

    if (!schoolId && isSuperAdmin) {
      setState({ loaded: true, pessoaId: pessoaIdAuth || null, permissoes: {}, error: null })
      return
    }

    const email = userEmail
    if (!email) {
      setState({ loaded: true, pessoaId: null, permissoes: {}, error: 'Usuário sem email' })
      return
    }

    getPessoaPorEmail(email, schoolId!)
      .then(pessoa => {
        if (pessoa?.perfil_id) {
          return getPermissoesPorPessoa(pessoa.id).then(permissoes => {
            setState({ loaded: true, pessoaId: pessoa.id, permissoes, error: null })
          })
        }
        setState({ loaded: true, pessoaId: pessoa?.id || null, permissoes: {}, error: null })
      })
      .catch(err => {
        setState({ loaded: true, pessoaId: null, permissoes: {}, error: err.message })
      })
  }, [userId, userEmail, schoolId, isSuperAdmin])

  const isSetup = state.loaded && !state.pessoaId && !state.error && !isSuperAdmin

  const pode = useMemo(() => {
    const podeAcao = (recursoCodigo: string, acao: 'visualizar' | 'criar' | 'editar' | 'excluir') => {
      if (isSuperAdmin) return true
      if (isSetup) return true
      return state.permissoes[recursoCodigo]?.[acao] === true
    }
    return {
      visualizar: (cod: string) => podeAcao(cod, 'visualizar'),
      criar: (cod: string) => podeAcao(cod, 'criar'),
      editar: (cod: string) => podeAcao(cod, 'editar'),
      excluir: (cod: string) => podeAcao(cod, 'excluir'),
    }
  }, [isSuperAdmin, isSetup, state])

  return {
    ...state,
    isSetup,
    pode,
  }
}
