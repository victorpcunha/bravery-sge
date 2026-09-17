'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { labelSituacaoMatricula, variantSituacaoMatricula } from '@/lib/situacoes-matricula'
import type { AlunoElegivel } from '@/lib/actions/rematriculas'
import type { TurmaAtiva } from './origem-destino-card'
import { Trash2, Users } from 'lucide-react'

type Props = {
  alunos: AlunoElegivel[]
  turmasDestino: TurmaAtiva[]
  turmaPadraoId: string
  selecionados: string[]
  destinos: Record<string, string>
  removidos: string[]
  onToggle: (alunoId: string) => void
  onSelecionarTodos: () => void
  onLimparSelecao: () => void
  onDestinoChange: (alunoId: string, turmaId: string) => void
  onRemover: (alunoId: string) => void
}

export default function AlunosRematriculaList({
  alunos,
  turmasDestino,
  turmaPadraoId,
  selecionados,
  destinos,
  removidos,
  onToggle,
  onSelecionarTodos,
  onLimparSelecao,
  onDestinoChange,
  onRemover,
}: Props) {
  const visiveis = alunos.filter(a => !removidos.includes(a.alunoId))

  if (visiveis.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum aluno elegível"
        description="Não há alunos da turma de origem nesta situação ainda sem matrícula no novo ano. Revise os filtros de origem e destino."
      />
    )
  }

  const destinoDe = (alunoId: string) => destinos[alunoId] || turmaPadraoId

  const seletorTurma = (a: AlunoElegivel) => (
    <Select value={destinoDe(a.alunoId)} onValueChange={(v) => onDestinoChange(a.alunoId, v)}>
      <SelectTrigger className="h-9">
        <SelectValue placeholder="Turma de destino" />
      </SelectTrigger>
      <SelectContent>
        {turmasDestino.map(t => (
          <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onSelecionarTodos}>
          Selecionar Todos
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onLimparSelecao}>
          Limpar Seleção
        </Button>
        <span className="text-[13px] text-muted-foreground tabular-nums">
          {selecionados.length} de {visiveis.length} selecionados
        </span>
      </div>

      {/* Mobile: cards */}
      <ul className="block md:hidden space-y-3">
        {visiveis.map(a => (
          <li key={a.alunoId} className="rounded-lg border border-border bg-card p-3 space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selecionados.includes(a.alunoId)}
                onCheckedChange={() => onToggle(a.alunoId)}
                aria-label={`Selecionar ${a.nome}`}
                className="mt-1 min-h-[24px] min-w-[24px]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold truncate">{a.nome}</p>
                <p className="font-mono tabular-nums text-[13px] text-muted-foreground">{a.cpf}</p>
                <div className="mt-1">
                  <StatusBadge status={variantSituacaoMatricula(a.situacao)}>
                    {labelSituacaoMatricula(a.situacao)}
                  </StatusBadge>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemover(a.alunoId)}
                aria-label={`Remover ${a.nome} da lista`}
                className="min-h-[44px] min-w-[44px]"
              >
                <Trash2 className="text-destructive" />
              </Button>
            </div>
            {seletorTurma(a)}
          </li>
        ))}
      </ul>

      {/* Desktop: tabela */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <span className="sr-only">Selecionar</span>
              </TableHead>
              <TableHead>Aluno</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Turma de Destino</TableHead>
              <TableHead className="w-14 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiveis.map(a => (
              <TableRow key={a.alunoId}>
                <TableCell>
                  <Checkbox
                    checked={selecionados.includes(a.alunoId)}
                    onCheckedChange={() => onToggle(a.alunoId)}
                    aria-label={`Selecionar ${a.nome}`}
                  />
                </TableCell>
                <TableCell>
                  <p className="font-medium text-foreground">{a.nome}</p>
                  <p className="font-mono tabular-nums text-[13px] text-muted-foreground">{a.cpf}</p>
                </TableCell>
                <TableCell>
                  <StatusBadge status={variantSituacaoMatricula(a.situacao)}>
                    {labelSituacaoMatricula(a.situacao)}
                  </StatusBadge>
                </TableCell>
                <TableCell className="min-w-[220px]">{seletorTurma(a)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemover(a.alunoId)}
                    aria-label={`Remover ${a.nome} da lista`}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
