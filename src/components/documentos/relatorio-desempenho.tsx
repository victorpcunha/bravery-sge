'use client'

import { useCallback, useEffect, useMemo, useState, Fragment } from 'react'
import { toast } from 'sonner'
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Loader2,
  SearchX,
  ShieldAlert,
  Users,
} from 'lucide-react'
import {
  getContextoTurmaDesempenho,
  getDadosRelatorioDesempenho,
  type ContextoTurmaDesempenho,
  type DadosRelatorioDesempenho,
} from '@/lib/actions/relatorio-desempenho'
import {
  listarTurmasRelatorioMatriculas,
  type TurmaRelatorio,
} from '@/lib/actions/relatorio-matriculas'
import { getAnosLetivos, type AnoLetivo } from '@/lib/actions/calendarios'
import { formatarData, nomeTitulo } from '@/lib/documentos-pdf'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { StatCard } from '@/components/ui/stat-card'
import { Pagination } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const TODAS_DISCIPLINAS = '__all__'
const ITENS_POR_PAGINA = 15

type Props = {
  schoolId: string | null
  pessoaId: string | null
  onVoltar: () => void
}

function textoSituacao(situacao: 'acima' | 'abaixo'): string {
  return situacao === 'acima' ? 'Acima da Média Mínima' : 'Abaixo da Média Mínima'
}

function rotuloPeriodo(nome: string, inicio: string | null, termino: string | null): string {
  if (inicio || termino) {
    return `${nome} (${formatarData(inicio)} a ${formatarData(termino)})`
  }
  return nome
}

export default function RelatorioDesempenho({ schoolId, pessoaId, onVoltar }: Props) {
  const [anos, setAnos] = useState<AnoLetivo[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [turmas, setTurmas] = useState<TurmaRelatorio[]>([])
  const [turmaId, setTurmaId] = useState('')
  const [contexto, setContexto] = useState<ContextoTurmaDesempenho | null>(null)
  const [carregandoContexto, setCarregandoContexto] = useState(false)
  const [disciplinaId, setDisciplinaId] = useState(TODAS_DISCIPLINAS)
  const [periodoOrdem, setPeriodoOrdem] = useState<number | null>(null)

  const [dados, setDados] = useState<DadosRelatorioDesempenho | null>(null)
  const [loading, setLoading] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set())
  const [exportandoPdf, setExportandoPdf] = useState(false)
  const [exportandoExcel, setExportandoExcel] = useState(false)

  // Anos letivos + padrão ativo
  useEffect(() => {
    if (!schoolId) return
    getAnosLetivos(schoolId)
      .then(lista => {
        setAnos(lista)
        const ativo = lista.find(a => a.status === 'ativo')
        setAnoLetivoId(ativo?.id || lista[0]?.id || '')
      })
      .catch(err => toast.error(err?.message || 'Erro ao carregar anos letivos'))
  }, [schoolId])

  // Turmas do ano selecionado
  useEffect(() => {
    if (!schoolId || !anoLetivoId) return
    let cancelado = false
    listarTurmasRelatorioMatriculas(schoolId, anoLetivoId, pessoaId)
      .then(data => {
        if (!cancelado) setTurmas(data)
      })
      .catch(err => {
        if (!cancelado) {
          setTurmas([])
          toast.error(err?.message || 'Erro ao carregar turmas')
        }
      })
    return () => {
      cancelado = true
    }
  }, [schoolId, anoLetivoId, pessoaId])

  const handleTrocarAno = (value: string) => {
    setAnoLetivoId(value)
    setTurmaId('')
    setTurmas([])
    setContexto(null)
    setDisciplinaId(TODAS_DISCIPLINAS)
    setPeriodoOrdem(null)
    setDados(null)
  }

  const handleTrocarTurma = (value: string) => {
    setTurmaId(value)
    setDisciplinaId(TODAS_DISCIPLINAS)
    setPeriodoOrdem(null)
    setDados(null)
    setContexto(null)
    if (!value) return
    setCarregandoContexto(true)
    getContextoTurmaDesempenho(value, anoLetivoId, pessoaId)
      .then(ctx => {
        setContexto(ctx)
      })
      .catch(err => {
        setContexto(null)
        toast.error(err instanceof Error ? err.message : 'Erro ao carregar dados da turma')
      })
      .finally(() => {
        setCarregandoContexto(false)
      })
  }

  const buscar = useCallback(async () => {
    if (!schoolId || !anoLetivoId || !turmaId || !periodoOrdem) return
    setLoading(true)
    try {
      const resultado = await getDadosRelatorioDesempenho(
        schoolId,
        {
          anoLetivoId,
          turmaId,
          matrizDisciplinaId: disciplinaId === TODAS_DISCIPLINAS ? null : disciplinaId,
          periodoOrdem,
        },
        pessoaId
      )
      setDados(resultado)
      setPagina(1)
      setExpandidos(new Set())
    } catch (err) {
      setDados(null)
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar o relatório')
    } finally {
      setLoading(false)
    }
  }, [schoolId, anoLetivoId, turmaId, disciplinaId, periodoOrdem, pessoaId])

  // Busca automática ao completar os filtros obrigatórios
  useEffect(() => {
    if (!turmaId || !periodoOrdem || contexto?.bloqueado) return
    const timer = setTimeout(() => {
      buscar()
    }, 0)
    return () => clearTimeout(timer)
  }, [buscar, turmaId, periodoOrdem, contexto?.bloqueado])

  const totalPaginas = dados ? Math.max(1, Math.ceil(dados.alunos.length / ITENS_POR_PAGINA)) : 1
  const alunosPagina = useMemo(() => {
    if (!dados) return []
    const inicio = (pagina - 1) * ITENS_POR_PAGINA
    return dados.alunos.slice(inicio, inicio + ITENS_POR_PAGINA)
  }, [dados, pagina])

  const toggleExpandido = (alunoId: string) => {
    setExpandidos(prev => {
      const proximo = new Set(prev)
      if (proximo.has(alunoId)) {
        proximo.delete(alunoId)
      } else {
        proximo.add(alunoId)
      }
      return proximo
    })
  }

  const anoDescricao = anos.find(a => a.id === anoLetivoId)?.descricao || ''
  const turmaNome = turmas.find(t => t.id === turmaId)?.nome || ''
  const acima = dados?.porSituacao.find(s => s.situacao === 'acima')?.quantidade ?? 0

  const nomeArquivoBase = useCallback(() => {
    const agora = new Date()
    const ts = `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}-${String(agora.getHours()).padStart(2, '0')}${String(agora.getMinutes()).padStart(2, '0')}`
    const turma = (turmaNome || 'turma').replace(/\s+/g, '-').toLowerCase()
    return `relatorio-desempenho-${turma}-${ts}`
  }, [turmaNome])

  const handleBaixarPdf = async () => {
    if (!dados) return
    setExportandoPdf(true)
    try {
      const [{ pdf }, modulo] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./relatorio-desempenho-pdf'),
      ])
      const blob = await pdf(<modulo.RelatorioDesempenhoPdf documento={dados} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${nomeArquivoBase()}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar o PDF')
    } finally {
      setExportandoPdf(false)
    }
  }

  const handleExportarExcel = async () => {
    if (!dados) return
    setExportandoExcel(true)
    try {
      const XLSX = await import('xlsx')
      const f = dados.filtrosAplicados

      const aoa: (string | number)[][] = [
        ['Relatório de Desempenho'],
        [`Ano Letivo: ${f.anoLetivoDescricao || anoDescricao}`],
        [`Turma: ${f.turmaNome}`],
        [`Disciplina: ${f.disciplinaNome || 'Todas as disciplinas'}`],
        [`Período de Avaliação: ${f.periodoNome}`],
        [`Média Mínima: ${f.mediaMinima}`],
        [`Data de emissão: ${new Date().toLocaleDateString('pt-BR')}`],
        [],
        ['Resumo'],
        ['Total de alunos avaliados', dados.totalAlunos],
        ['Média geral dos resultados', dados.mediaGeral ?? '—'],
        ['Alunos abaixo da média mínima', dados.abaixoMinima],
        ['Alunos acima da média mínima', acima],
        [],
        ['Aluno', 'Disciplina', 'Média', 'Situação'],
      ]
      for (const a of dados.alunos) {
        aoa.push([nomeTitulo(a.alunoNome), '', a.mediaGeral, textoSituacao(a.abaixoMinima ? 'abaixo' : 'acima')])
        for (const d of a.disciplinas) {
          aoa.push(['', d.disciplinaNome, d.media, textoSituacao(d.situacao)])
        }
      }

      const ws = XLSX.utils.aoa_to_sheet(aoa)
      ws['!cols'] = [{ wch: 42 }, { wch: 28 }, { wch: 10 }, { wch: 26 }]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Desempenho')
      XLSX.writeFile(wb, `${nomeArquivoBase()}.xlsx`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao exportar o Excel')
    } finally {
      setExportandoExcel(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={onVoltar} className="gap-2 min-h-[40px] -ml-2">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar
        </Button>
      </div>

      <PageSection
        variant="compact"
        title="Filtros"
        description="Combine os filtros para gerar o Relatório de Desempenho."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
              Ano Letivo <span className="text-destructive">*</span>
            </Label>
            <Select value={anoLetivoId} onValueChange={handleTrocarAno}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano letivo" />
              </SelectTrigger>
              <SelectContent>
                {anos.map(a => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
              Turma <span className="text-destructive">*</span>
            </Label>
            <Select
              value={turmaId}
              onValueChange={handleTrocarTurma}
              disabled={!anoLetivoId || turmas.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={turmas.length === 0 ? 'Nenhuma turma neste ano letivo' : 'Selecione a turma'} />
              </SelectTrigger>
              <SelectContent>
                {turmas.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-[14px] font-medium text-foreground">Disciplina</Label>
            <Select
              value={disciplinaId}
              onValueChange={setDisciplinaId}
              disabled={!contexto || contexto.bloqueado || contexto.disciplinas.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as disciplinas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODAS_DISCIPLINAS}>Todas as disciplinas</SelectItem>
                {(contexto?.disciplinas || []).map(d => (
                  <SelectItem key={d.matrizDisciplinaId} value={d.matrizDisciplinaId}>
                    {d.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Quando não selecionada, o relatório apresenta todas as disciplinas da turma.
            </p>
          </div>
          <div>
            <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
              Período de Avaliação <span className="text-destructive">*</span>
            </Label>
            <Select
              value={periodoOrdem !== null ? String(periodoOrdem) : ''}
              onValueChange={v => setPeriodoOrdem(Number(v))}
              disabled={!contexto || contexto.bloqueado || contexto.periodos.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                {(contexto?.periodos || []).map(p => (
                  <SelectItem key={p.ordem} value={String(p.ordem)}>
                    {rotuloPeriodo(p.nome, p.data_inicio, p.data_termino)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Períodos configurados no Método de Avaliação da turma.
            </p>
          </div>
        </div>
      </PageSection>

      {carregandoContexto && (
        <PageSection variant="default" title="Carregando...">
          <div className="space-y-3 animate-pulse">
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="h-32 w-full bg-muted rounded-lg" />
          </div>
        </PageSection>
      )}

      {!carregandoContexto && contexto?.bloqueado && (
        <EmptyState
          icon={ShieldAlert}
          title="Relatório indisponível para esta turma"
          description={contexto.motivo || 'Esta turma não utiliza Método de Avaliação numérico.'}
        />
      )}

      {!carregandoContexto && !contexto?.bloqueado && loading && (
        <PageSection variant="default" title="Carregando...">
          <div className="space-y-3 animate-pulse">
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="h-32 w-full bg-muted rounded-lg" />
          </div>
        </PageSection>
      )}

      {!carregandoContexto && !contexto?.bloqueado && !loading && dados && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} value={dados.totalAlunos} label="Alunos avaliados" />
            <StatCard
              icon={BarChart3}
              value={dados.mediaGeral !== null ? dados.mediaGeral : '—'}
              label="Média geral dos resultados"
            />
            <StatCard icon={ShieldAlert} value={dados.abaixoMinima} label="Abaixo da média mínima" />
            <StatCard icon={Users} value={acima} label="Acima da média mínima" />
          </div>

          <PageSection
            variant="flush"
            title="Resultado"
            description={`${dados.totalAlunos} aluno(s) avaliado(s). Expanda um aluno para ver o desempenho por disciplina. A coluna Situação indica o desempenho pontual no período — não é um veredito de aprovação.`}
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={handleExportarExcel}
                  disabled={exportandoExcel || dados.alunos.length === 0}
                  className="gap-2 min-h-[40px]"
                >
                  {exportandoExcel ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4" />
                  )}
                  Exportar Excel
                </Button>
                <Button
                  onClick={handleBaixarPdf}
                  disabled={exportandoPdf || dados.alunos.length === 0}
                  className="gap-2 min-h-[40px]"
                >
                  {exportandoPdf ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Baixar PDF
                </Button>
              </div>
            }
          >
            {dados.alunos.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={SearchX}
                  title="Nenhum resultado encontrado"
                  description="Nenhum resultado foi encontrado para os critérios informados. Ajuste os filtros e tente novamente."
                />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10" />
                        <TableHead className="sticky left-0 bg-muted z-10">Aluno / Disciplina</TableHead>
                        <TableHead>Média</TableHead>
                        <TableHead>Situação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alunosPagina.map(a => {
                        const expandido = expandidos.has(a.alunoId)
                        return (
                          <Fragment key={a.alunoId}>
                            <TableRow
                              className={a.abaixoMinima ? 'bg-destructive/5' : undefined}
                            >
                              <TableCell>
                                <button
                                  type="button"
                                  onClick={() => toggleExpandido(a.alunoId)}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                  aria-expanded={expandido}
                                  aria-label={expandido ? `Recolher ${a.alunoNome}` : `Expandir ${a.alunoNome}`}
                                >
                                  {expandido ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                              </TableCell>
                              <TableCell className="sticky left-0 bg-background z-10 font-medium text-foreground">
                                <button type="button" onClick={() => toggleExpandido(a.alunoId)} className="text-left">
                                  {nomeTitulo(a.alunoNome)}
                                </button>
                              </TableCell>
                              <TableCell className="text-foreground font-medium tabular-nums">
                                {a.mediaGeral}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={a.abaixoMinima ? 'destructive' : 'success'}>
                                  {textoSituacao(a.abaixoMinima ? 'abaixo' : 'acima')}
                                </StatusBadge>
                              </TableCell>
                            </TableRow>
                            {expandido &&
                              a.disciplinas.map((d, i) => {
                                const abaixo = d.situacao === 'abaixo'
                                return (
                                  <TableRow
                                    key={`${a.alunoId}-${d.disciplinaNome}-${i}`}
                                    className={abaixo ? 'bg-destructive/5' : 'bg-muted/20'}
                                  >
                                    <TableCell />
                                    <TableCell className="sticky left-0 bg-background z-10 text-muted-foreground">
                                      <span className="pl-6">{d.disciplinaNome}</span>
                                    </TableCell>
                                    <TableCell className="text-foreground tabular-nums">
                                      {d.media}
                                    </TableCell>
                                    <TableCell>
                                      <StatusBadge status={abaixo ? 'destructive' : 'success'}>
                                        {textoSituacao(d.situacao)}
                                      </StatusBadge>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                          </Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="px-6 py-4">
                  <Pagination
                    currentPage={pagina}
                    totalPages={totalPaginas}
                    totalItems={dados.alunos.length}
                    itemsPerPage={ITENS_POR_PAGINA}
                    onPageChange={setPagina}
                  />
                </div>
              </>
            )}
          </PageSection>
        </>
      )}

      {!carregandoContexto && !contexto?.bloqueado && !loading && !dados && turmaId && !periodoOrdem && (
        <EmptyState
          icon={BarChart3}
          title="Selecione o período de avaliação"
          description="Escolha o período de avaliação para gerar o Relatório de Desempenho."
        />
      )}

      {!carregandoContexto && !loading && !turmaId && anoLetivoId && (
        <EmptyState
          icon={BarChart3}
          title="Relatório de Desempenho"
          description="Selecione a turma para gerar o Relatório de Desempenho."
        />
      )}

      {!loading && !anoLetivoId && (
        <EmptyState
          icon={BarChart3}
          title="Selecione o ano letivo"
          description="Escolha o ano letivo para gerar o Relatório de Desempenho."
        />
      )}
    </div>
  )
}
