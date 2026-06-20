'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Inbox } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import ConselhoClasseLinhaAluno from './conselho-classe-linha-aluno'
import type { AlunoDesempenho } from '@/lib/actions/conselho-classe'

type Props = {
  alunos: AlunoDesempenho[]
  loading: boolean
  error: string | null
  onSalvarNota: (alunoId: string, disciplinaId: string, field: 'nota_conselho' | 'parecer', value: string) => void
  readonly: boolean
}

export default function ConselhoClasseTabela({ alunos, loading, error, onSalvarNota, readonly }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Erro ao carregar"
        description={error}
      />
    )
  }

  if (alunos.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Nenhum aluno abaixo da média"
        description="Nenhum aluno abaixo da média no período selecionado"
      />
    )
  }

  return (
    <div className="space-y-2">
      {alunos.map(aluno => (
        <ConselhoClasseLinhaAluno
          key={aluno.aluno_id}
          aluno={aluno}
          onSalvarNota={onSalvarNota}
          readonly={readonly}
        />
      ))}
    </div>
  )
}
