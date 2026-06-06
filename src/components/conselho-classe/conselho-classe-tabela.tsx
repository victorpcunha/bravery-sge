'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Inbox } from 'lucide-react'
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (alunos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Nenhum aluno abaixo da média no período selecionado</p>
      </div>
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
