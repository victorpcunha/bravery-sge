'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className="border border-border rounded-lg overflow-hidden">
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
        <span className="font-medium text-sm flex-1">{aluno.nome}</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {aluno.disciplinas.length} {aluno.disciplinas.length === 1 ? 'disciplina' : 'disciplinas'}
        </span>
      </Button>

      {expanded && (
        <div className="border-t border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 text-xs text-muted-foreground hover:bg-muted/30">
                <TableHead className="py-2 px-3 text-left font-medium">Disciplina</TableHead>
                <TableHead className="py-2 px-3 text-center font-medium">Frequência</TableHead>
                <TableHead className="py-2 px-3 text-center font-medium">Faltas</TableHead>
                <TableHead className="py-2 px-3 text-center font-medium">Média Final</TableHead>
                <TableHead className="py-2 px-3 text-center font-medium">Média Período</TableHead>
                <TableHead className="py-2 px-3 text-center font-medium">Nota Conselho</TableHead>
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
