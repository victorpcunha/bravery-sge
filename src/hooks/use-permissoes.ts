'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { getPessoaPorEmail } from '@/lib/actions/people'
import { getPermissoesPorPessoa, type PermissoesPorRecurso } from '@/lib/actions/perfis'

type PermissoesState = {
  loaded: boolean
  pessoaId: string | null
  permissoes: PermissoesPorRecurso
  error: string | null
}

export function usePermissoes(schoolId: string) {
  const { user } = useAuth()
  const [state, setState] = useState<PermissoesState>({
    loaded: false,
    pessoaId: null,
    permissoes: {},
    error: null,
  })

  useEffect(() => {
    if (!user || !schoolId) return

    const email = user.email
    if (!email) {
      setState({ loaded: true, pessoaId: null, permissoes: {}, error: 'Usuário sem email' })
      return
    }

    getPessoaPorEmail(email, schoolId)
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
  }, [user, schoolId])

  const isSetup = state.loaded && !state.pessoaId && !state.error

  const podeAcao = (recursoCodigo: string, acao: 'visualizar' | 'criar' | 'editar' | 'excluir') => {
    if (isSetup) return true
    return state.permissoes[recursoCodigo]?.[acao] === true
  }

  const pode = {
    visualizar: (cod: string) => podeAcao(cod, 'visualizar'),
    criar: (cod: string) => podeAcao(cod, 'criar'),
    editar: (cod: string) => podeAcao(cod, 'editar'),
    excluir: (cod: string) => podeAcao(cod, 'excluir'),
  }

  return {
    ...state,
    isSetup,
    pode,
  }
}
