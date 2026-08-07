'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table'
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
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <Button
        variant="ghost"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left rounded-none h-auto"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <span className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-medium text-[15px] truncate">{aluno.nome}</span>
          <StatusBadge status="warning" className="shrink-0">
            {aluno.disciplinas.length} {aluno.disciplinas.length === 1 ? 'disciplina' : 'disciplinas'}
          </StatusBadge>
        </span>
      </Button>

      {expanded && (
        <div className="border-t border-border bg-muted/30">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted text-xs text-muted-foreground hover:bg-muted">
                <TableHead className="py-2.5 px-4 text-left font-semibold">Disciplina</TableHead>
                <TableHead className="py-2.5 px-4 text-center font-semibold">Frequência</TableHead>
                <TableHead className="py-2.5 px-4 text-center font-semibold">Faltas</TableHead>
                <TableHead className="py-2.5 px-4 text-center font-semibold">Média Período</TableHead>
                <TableHead className="py-2.5 px-4 text-center font-semibold">Nota Conselho</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
