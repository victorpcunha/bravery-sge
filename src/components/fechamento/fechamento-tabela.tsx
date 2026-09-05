'use client'

import { useMemo, useState, type ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SearchInput } from '@/components/layout/search-input'
import { EmptyState } from '@/components/ui/empty-state'
import { labelSituacaoMatricula, variantSituacaoMatricula } from '@/lib/situacoes-matricula'
import type { AlunoFechamento, DisciplinaFechamento, DisciplinaAlunoFechamento } from '@/lib/actions/fechamento-turma'
import { ChevronDown, ChevronRight, AlertTriangle, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FechamentoTabela({
  alunos,
  disciplinas,
  quantidadePeriodos,
  mediaMinima,
  frecuenciaMinima,
}: {
  alunos: AlunoFechamento[]
  disciplinas: DisciplinaFechamento[]
  quantidadePeriodos: number
  mediaMinima: number
  frecuenciaMinima: number
}) {
  const [busca, setBusca] = useState('')
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set())

  const filtrados = useMemo(() => {
    if (!busca.trim()) return alunos
    const termo = busca.toLowerCase()
    return alunos.filter(a => a.nome_completo.toLowerCase().includes(termo))
  }, [alunos, busca])

  const toggle = (matriculaId: string) => {
    setExpandidos(prev => {
      const next = new Set(prev)
      if (next.has(matriculaId)) next.delete(matriculaId)
      else next.add(matriculaId)
      return next
    })
  }

  const corNota = (v: number | null): string => {
    if (v === null) return 'text-amber-600'
    return v >= mediaMinima ? 'text-success' : 'text-destructive'
  }

  const celulaMedia = (v: number | null) => (
    <span className={cn('text-[13px] font-semibold tabular-nums', corNota(v))}>
      {v !== null ? v.toFixed(2) : '—'}
    </span>
  )

  if (alunos.length === 0) {
    return (
      <EmptyState icon={Users} title="Nenhum aluno matriculado" description="Esta turma não possui matrículas ativas." />
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchInput value={busca} onChange={setBusca} placeholder="Buscar aluno por nome ou nº..." debounceMs={150} />
        </div>
        <p className="text-[13px] text-muted-foreground">
          {filtrados.length} de {alunos.length} aluno(s)
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead className="w-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Nº</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Aluno</TableHead>
              {disciplinas.map(d => (
                <TableHead key={d.matriz_disciplina_id} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground min-w-[92px]">
                  {d.nome}
                </TableHead>
              ))}
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Média Anual</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Média Final</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Frequência</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Resultado Final</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6 + disciplinas.length} className="text-center py-10 text-muted-foreground">
                  Nenhum aluno encontrado com o filtro aplicado.
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map(aluno => {
                const expandido = expandidos.has(aluno.matricula_id)
                const pendente = aluno.situacao === 'Ativo' && aluno.pendente
                return (
                  <ExpansaoAluno
                    key={aluno.matricula_id}
                    aluno={aluno}
                    disciplinas={disciplinas}
                    quantidadePeriodos={quantidadePeriodos}
                    mediaMinima={mediaMinima}
                    frecuenciaMinima={frecuenciaMinima}
                    celulaMedia={celulaMedia}
                    expandido={expandido}
                    onToggle={() => toggle(aluno.matricula_id)}
                  />
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ExpansaoAluno({
  aluno,
  disciplinas,
  quantidadePeriodos,
  mediaMinima,
  frecuenciaMinima,
  celulaMedia,
  expandido,
  onToggle,
}: {
  aluno: AlunoFechamento
  disciplinas: DisciplinaFechamento[]
  quantidadePeriodos: number
  mediaMinima: number
  frecuenciaMinima: number
  celulaMedia: (v: number | null) => ReactNode
  expandido: boolean
  onToggle: () => void
}) {
  const resultadoPendente = aluno.situacao === 'Ativo' && aluno.pendente
  const freq = aluno.frequencia_percentual

  const resultadoLabel = resultadoPendente
    ? 'Pendente'
    : labelSituacaoMatricula(aluno.resultado)
  const resultadoVariant = resultadoPendente
    ? 'warning'
    : variantSituacaoMatricula(aluno.resultado)

  return (
    <>
      <TableRow className={cn('transition-colors', expandido && 'bg-primary/[0.04]')}>
        <TableCell>
          <button type="button" onClick={onToggle} className="text-muted-foreground hover:text-foreground transition-colors" aria-expanded={expandido}>
            {expandido ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </TableCell>
        <TableCell className="text-[13px] text-muted-foreground tabular-nums">
          {aluno.numero_chamada ?? '—'}
        </TableCell>
        <TableCell className="min-w-[200px]">
          <div className="flex items-center gap-2">
            {resultadoPendente && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-60">
                  <p>Aluno com avaliações pendentes. Defina as notas/recuperações para o sistema determinar a aprovação.</p>
                </TooltipContent>
              </Tooltip>
            )}
            <button type="button" onClick={onToggle} className="text-left">
              <span className="text-[14px] font-semibold text-foreground hover:underline">{aluno.nome_completo}</span>
            </button>
          </div>
        </TableCell>
        {disciplinas.map(d => {
          const disc = aluno.disciplinas.find(x => x.matriz_disciplina_id === d.matriz_disciplina_id)
          return <TableCell key={d.matriz_disciplina_id}>{celulaMedia(disc?.media_final ?? null)}</TableCell>
        })}
        <TableCell>{celulaMedia(aluno.media_anual)}</TableCell>
        <TableCell>
          <span className={cn('text-[13px] font-bold tabular-nums', aluno.media_final !== null ? (aluno.media_final >= mediaMinima ? 'text-success' : 'text-destructive') : 'text-muted-foreground')}>
            {aluno.media_final !== null ? aluno.media_final.toFixed(2) : '—'}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1.5">
            <span className={cn('text-[13px] font-semibold tabular-nums', freq !== null ? (freq >= frecuenciaMinima ? 'text-success' : 'text-destructive') : 'text-muted-foreground')}>
              {freq !== null ? `${freq}%` : '—'}
            </span>
            {freq !== null && freq < frecuenciaMinima && aluno.situacao === 'Ativo' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex text-destructive"><AlertTriangle className="h-3.5 w-3.5" /></span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Frequência abaixo da mínima ({frecuenciaMinima}%). Pode configurar reprovação por frequência.</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TableCell>
        <TableCell>
          <StatusBadge status={resultadoVariant}>{resultadoLabel}</StatusBadge>
        </TableCell>
      </TableRow>

      {expandido && (
        <TableRow>
          <TableCell colSpan={7 + disciplinas.length} className="border-t-0 bg-muted/20 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {disciplinas.map(d => {
                const disc = aluno.disciplinas.find(x => x.matriz_disciplina_id === d.matriz_disciplina_id)
                return <CardDisciplina key={d.matriz_disciplina_id} disciplina={disc} nome={d.nome} quantidadePeriodos={quantidadePeriodos} mediaMinima={mediaMinima} />
              })}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

function CardDisciplina({
  disciplina,
  nome,
  quantidadePeriodos,
  mediaMinima,
}: {
  disciplina?: DisciplinaAlunoFechamento
  nome: string
  quantidadePeriodos: number
  mediaMinima: number
}) {
  const periodos = Array.from({ length: Math.max(quantidadePeriodos, (disciplina?.medias_periodo?.length || 0)) }, (_, i) => i + 1)

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xs">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[13px] font-semibold leading-tight text-foreground min-w-0 truncate">{nome}</p>
        <span className={cn('text-[16px] font-bold tabular-nums shrink-0', disciplina?.media_final !== null ? (disciplina && disciplina.media_final !== null && disciplina.media_final >= mediaMinima ? 'text-success' : 'text-destructive') : 'text-muted-foreground')}>
          {disciplina?.media_final !== null && disciplina?.media_final !== undefined ? disciplina.media_final.toFixed(2) : '—'}
        </span>
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.max(periodos.length, 1)}, minmax(0, 1fr))` }}>
        {periodos.map(p => {
          const nota = disciplina?.medias_periodo?.[p - 1] ?? null
          const pendente = nota === null
          return (
            <div
              key={p}
              className={cn(
                'rounded-md border px-1 py-1.5 text-center',
                pendente
                  ? 'border-amber-400/40 bg-amber-50 text-amber-700'
                  : 'border-border bg-muted/40'
              )}
            >
              <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">Bim {p}</p>
              <div className="flex items-center justify-center gap-1">
                {pendente && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex"><AlertTriangle className="h-3 w-3 text-amber-600" /></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Nota pendente neste bimestre</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <span className={cn('text-[13px] font-bold tabular-nums', pendente ? 'text-amber-700' : corCelulaNota(nota, mediaMinima))}>
                  {nota !== null ? nota.toFixed(2) : '—'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function corCelulaNota(v: number, mediaMinima: number): string {
  return v >= mediaMinima ? 'text-success' : 'text-destructive'
}