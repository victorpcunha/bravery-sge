'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import ConselhoClasseLinhaDisciplina from './conselho-classe-linha-disciplina'
import type { DisciplinaDesempenho } from '@/lib/actions/conselho-classe'

type Props = {
  aluno: {
    aluno_id: string
    nome: string
    disciplinas: DisciplinaDesempenho[]
  }
  onSalvarNota: (alunoId: string, disciplinaId: string, field: 'nota_conselho' | 'parecer', value: string) => void
  readonly: boolean
}

export default function ConselhoClasseLinhaAluno({ aluno, onSalvarNota, readonly }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-muted rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <span className="font-medium text-sm flex-1">{aluno.nome}</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {aluno.disciplinas.length} {aluno.disciplinas.length === 1 ? 'disciplina' : 'disciplinas'}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-muted">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 text-xs text-muted-foreground">
                <th className="py-2 px-3 text-left font-medium">Disciplina</th>
                <th className="py-2 px-3 text-center font-medium">Frequência</th>
                <th className="py-2 px-3 text-center font-medium">Faltas</th>
                <th className="py-2 px-3 text-center font-medium">Média Final</th>
                <th className="py-2 px-3 text-center font-medium">Média Período</th>
                <th className="py-2 px-3 text-center font-medium">Nota Conselho</th>
              </tr>
            </thead>
            <tbody>
              {aluno.disciplinas.map(disc => (
                <ConselhoClasseLinhaDisciplina
                  key={disc.disciplina_id}
                  disciplina={disc}
                  onUpdate={(disciplinaId, field, value) =>
                    onSalvarNota(aluno.aluno_id, disciplinaId, field, value)
                  }
                  readonly={readonly}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
