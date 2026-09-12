'use client'

import { useState, useEffect } from 'react'
import { Users, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import type { PanoramaRendimento } from '@/lib/actions/rendimento'
import { fmtMedia, fmtPct, fmtInt } from './format'

type Props = {
  panorama: PanoramaRendimento | null
  loading: boolean
  escolaId: string
  anoId: string
  pessoaId: string | null
  onExpandTurma?: (turmaId: string, periodo: number | null) => void
}

const POR_PAGINA = 10

export default function AbaGeralTurmas({ panorama, loading, onExpandTurma }: Props) {
  const [pagina, setPagina] = useState(1)
  const [etapa, setEtapa] = useState('todas')
  const [periodo, setPeriodo] = useState<number | null>(null)
  const [disciplina, setDisciplina] = useState('todas')

  useEffect(() => {
    setEtapa('todas')
    setPeriodo(null)
    setDisciplina('todas')
    setPagina(1)
  }, [panorama])

  if (loading && !panorama) {
    return <div className="h-64 rounded-xl border border-border bg-card animate-pulse" />
  }
  const recorte = panorama?.recortes.find(r => r.periodoOrdem === periodo)
    || panorama?.recortes.find(r => r.periodoOrdem === null)
  if (!panorama || !recorte) {
    return (
      <EmptyState
        icon={Users}
        title="Sem turmas avaliadas"
        description="Não há turmas com avaliações lançadas no período selecionado."
      />
    )
  }

  const etapasOpcoes = [...new Set(recorte.porTurma.map(t => t.etapaNome))].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  const disciplinasOpcoes = [...new Map(
    recorte.porTurma.flatMap(t => t.porDisciplina).map(d => [d.disciplinaId, d.nome])
  ).entries()].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))

  type LinhaTurma = {
    turmaId: string; nome: string; etapaNome: string;
    alunos: number; media: number | null; pctAcima: number | null; frequencia: number | null;
  }
  const turmas: LinhaTurma[] = recorte.porTurma
    .filter(t => etapa === 'todas' || t.etapaNome === etapa)
    .map(t => {
      if (disciplina === 'todas') {
        return {
          turmaId: t.turmaId, nome: t.nome, etapaNome: t.etapaNome,
          alunos: t.alunos, media: t.media, pctAcima: t.pctAcima, frequencia: t.frequencia,
        }
      }
      const d = t.porDisciplina.find(x => x.disciplinaId === disciplina)
      if (!d) return null
      return {
        turmaId: t.turmaId, nome: t.nome, etapaNome: t.etapaNome,
        alunos: d.avaliados, media: d.media, pctAcima: d.pctAcima, frequencia: d.frequencia,
      }
    })
    .filter((t): t is LinhaTurma => t !== null)

  if (turmas.length === 0) {
    return (
      <div className="space-y-4">
        <FiltrosTurma />
        <EmptyState
          icon={Users}
          title="Sem turmas para os filtros"
          description="Nenhuma turma com avaliações na etapa, disciplina e período selecionados."
        />
      </div>
    )
  }

  function FiltrosTurma() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Etapa de Ensino</Label>
          <Select value={etapa} onValueChange={(v) => { setEtapa(v); setPagina(1) }}>
            <SelectTrigger><SelectValue placeholder="Todas as etapas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Etapas</SelectItem>
              {etapasOpcoes.map(n => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Período</Label>
          <Select
            value={periodo === null ? 'ano' : String(periodo)}
            onValueChange={(v) => { setPeriodo(v === 'ano' ? null : Number(v)); setDisciplina('todas'); setPagina(1) }}
          >
            <SelectTrigger><SelectValue placeholder="Período" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ano">Ano Letivo completo</SelectItem>
              {(panorama?.porPeriodo || []).map(p => (
                <SelectItem key={p.ordem} value={String(p.ordem)}>{p.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Disciplina</Label>
          <Select value={disciplina} onValueChange={(v) => { setDisciplina(v); setPagina(1) }}>
            <SelectTrigger><SelectValue placeholder="Todas as disciplinas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as disciplinas</SelectItem>
              {disciplinasOpcoes.map(([id, nome]) => (
                <SelectItem key={id} value={id}>{nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const totalPaginas = Math.max(1, Math.ceil(turmas.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = turmas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)

  return (
    <div className="space-y-4">
      <FiltrosTurma />
      {/* Mobile: cards */}
      <ul className="space-y-3 md:hidden">
        {visiveis.map(t => (
          <li key={t.turmaId} className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{t.nome}</p>
                <p className="text-[13px] text-muted-foreground">{t.etapaNome} · {fmtInt(t.alunos)} alunos</p>
              </div>
              {onExpandTurma && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="min-h-[44px] min-w-[44px]"
                  aria-label={`Detalhar turma ${t.nome}`}
                  onClick={() => onExpandTurma(t.turmaId, periodo)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[12px] text-muted-foreground">Média</p>
                <p className="font-semibold text-foreground tabular-nums">{fmtMedia(t.media)}</p>
              </div>
              <div>
                <p className="text-[12px] text-muted-foreground">Acima</p>
                <p className="font-semibold text-success tabular-nums">{fmtPct(t.pctAcima)}</p>
              </div>
              <div>
                <p className="text-[12px] text-muted-foreground">Frequência</p>
                <p className="font-semibold text-foreground tabular-nums">{fmtPct(t.frequencia)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: tabela */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-muted z-10">Turma</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead className="text-right">Alunos</TableHead>
              <TableHead className="text-right">Média</TableHead>
              <TableHead className="text-right">% Acima</TableHead>
              <TableHead className="text-right">Frequência</TableHead>
              {onExpandTurma && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiveis.map(t => (
              <TableRow key={t.turmaId}>
                <TableCell className="sticky left-0 bg-background z-10 font-medium text-foreground">{t.nome}</TableCell>
                <TableCell className="text-muted-foreground">{t.etapaNome}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{fmtInt(t.alunos)}</TableCell>
                <TableCell className="text-right font-medium text-foreground tabular-nums">{fmtMedia(t.media)}</TableCell>
                <TableCell className="text-right text-success tabular-nums">{fmtPct(t.pctAcima)}</TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{fmtPct(t.frequencia)}</TableCell>
                {onExpandTurma && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Detalhar turma ${t.nome}`}
                      onClick={() => onExpandTurma(t.turmaId, periodo)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={paginaAtual}
        totalPages={totalPaginas}
        totalItems={turmas.length}
        itemsPerPage={POR_PAGINA}
        onPageChange={setPagina}
      />
    </div>
  )
}
