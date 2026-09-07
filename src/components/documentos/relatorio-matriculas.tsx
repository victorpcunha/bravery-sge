'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowLeft,
  BarChart3,
  Download,
  FileSpreadsheet,
  Loader2,
  SearchX,
  Users,
} from 'lucide-react'
import {
  getDadosRelatorioMatriculas,
  listarTurmasRelatorioMatriculas,
  type DadosRelatorioMatriculas,
  type TurmaRelatorio,
} from '@/lib/actions/relatorio-matriculas'
import { getAnosLetivos, type AnoLetivo } from '@/lib/actions/calendarios'
import { SITUACOES_MATRICULA, labelSituacaoMatricula, variantSituacaoMatricula } from '@/lib/situacoes-matricula'
import { formatarData, nomeTitulo } from '@/lib/documentos-pdf'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
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
import { ClickablePill } from '@/components/ui/clickable-pill'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const TODAS_TURMAS = '__all__'
const ITENS_POR_PAGINA = 15
const SITUACOES = Object.keys(SITUACOES_MATRICULA)

type Props = {
  schoolId: string | null
  pessoaId: string | null
  onVoltar: () => void
}

export default function RelatorioMatriculas({ schoolId, pessoaId, onVoltar }: Props) {
  const [anos, setAnos] = useState<AnoLetivo[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [turmas, setTurmas] = useState<TurmaRelatorio[]>([])
  const [turmaId, setTurmaId] = useState(TODAS_TURMAS)
  const [situacoes, setSituacoes] = useState<string[]>([])

  const [dados, setDados] = useState<DadosRelatorioMatriculas | null>(null)
  const [loading, setLoading] = useState(false)
  const [pagina, setPagina] = useState(1)
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

  const buscar = useCallback(async () => {
    if (!schoolId || !anoLetivoId) return
    setLoading(true)
    try {
      const resultado = await getDadosRelatorioMatriculas(
        schoolId,
        {
          anoLetivoId,
          turmaId: turmaId === TODAS_TURMAS ? null : turmaId,
          situacoes,
        },
        pessoaId
      )
      setDados(resultado)
      setPagina(1)
    } catch (err) {
      setDados(null)
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar o relatório')
    } finally {
      setLoading(false)
    }
  }, [schoolId, anoLetivoId, turmaId, situacoes, pessoaId])

  // Busca automática ao trocar filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      buscar()
    }, 0)
    return () => clearTimeout(timer)
  }, [buscar])

  const handleTrocarAno = (value: string) => {
    setAnoLetivoId(value)
    setTurmaId(TODAS_TURMAS)
    setTurmas([])
    setDados(null)
  }

  const toggleSituacao = (situacao: string) => {
    setSituacoes(prev =>
      prev.includes(situacao) ? prev.filter(s => s !== situacao) : [...prev, situacao]
    )
  }

  const totalPaginas = dados ? Math.max(1, Math.ceil(dados.linhas.length / ITENS_POR_PAGINA)) : 1
  const linhasPagina = useMemo(() => {
    if (!dados) return []
    const inicio = (pagina - 1) * ITENS_POR_PAGINA
    return dados.linhas.slice(inicio, inicio + ITENS_POR_PAGINA)
  }, [dados, pagina])

  const mostraPorTurma = turmaId === TODAS_TURMAS
  const anoDescricao = anos.find(a => a.id === anoLetivoId)?.descricao || ''

  const nomeArquivoBase = useCallback(() => {
    const agora = new Date()
    const ts = `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}-${String(agora.getHours()).padStart(2, '0')}${String(agora.getMinutes()).padStart(2, '0')}`
    const ano = (anoDescricao || 'ano-letivo').replace(/\s+/g, '-').toLowerCase()
    return `relatorio-matriculas-${ano}-${ts}`
  }, [anoDescricao])

  const handleBaixarPdf = async () => {
    if (!dados) return
    setExportandoPdf(true)
    try {
      const [{ pdf }, modulo] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./relatorio-matriculas-pdf'),
      ])
      const blob = await pdf(<modulo.RelatorioMatriculasPdf documento={dados} />).toBlob()
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
      const situacoesLabel =
        dados.filtrosAplicados.situacoes.length > 0
          ? dados.filtrosAplicados.situacoes.map(s => labelSituacaoMatricula(s)).join(', ')
          : 'Todas as situações'

      const aoa: (string | number)[][] = [
        ['Relatório de Matrículas'],
        [`Ano Letivo: ${dados.filtrosAplicados.anoLetivoDescricao || anoDescricao}`],
        [`Turma: ${dados.filtrosAplicados.turmaNome || 'Todas as turmas'}`],
        [`Situação: ${situacoesLabel}`],
        [`Data de emissão: ${new Date().toLocaleDateString('pt-BR')}`],
        [],
        ['Resumo'],
        ['Total de alunos matriculados', dados.total],
      ]
      if (mostraPorTurma) {
        for (const t of dados.porTurma) aoa.push([t.turmaNome, t.quantidade])
      }
      for (const s of dados.porSituacao) {
        aoa.push([labelSituacaoMatricula(s.situacao), s.quantidade])
      }
      aoa.push([])
      aoa.push(['Aluno', 'Turma', 'Ano Letivo', 'Data da Matrícula', 'Situação'])
      for (const l of dados.linhas) {
        aoa.push([
          nomeTitulo(l.alunoNome),
          l.turmaNome,
          l.anoLetivoDescricao,
          formatarData(l.dataMatricula),
          labelSituacaoMatricula(l.situacao),
        ])
      }

      const ws = XLSX.utils.aoa_to_sheet(aoa)
      ws['!cols'] = [{ wch: 42 }, { wch: 24 }, { wch: 14 }, { wch: 16 }, { wch: 24 }]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Matrículas')
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
        description="Combine os filtros para gerar o Relatório de Matrículas."
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
            <Label className="mb-1.5 block text-[14px] font-medium text-foreground">Turma</Label>
            <Select
              value={turmaId}
              onValueChange={setTurmaId}
              disabled={!anoLetivoId || turmas.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={turmas.length === 0 ? 'Nenhuma turma neste ano letivo' : 'Todas as turmas'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODAS_TURMAS}>Todas as turmas</SelectItem>
                {turmas.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
            Situação da Matrícula
          </Label>
          <FilterBar>
            <div className="flex flex-wrap gap-2">
              {SITUACOES.map(s => (
                <ClickablePill
                  key={s}
                  label={labelSituacaoMatricula(s)}
                  active={situacoes.includes(s)}
                  onClick={() => toggleSituacao(s)}
                />
              ))}
            </div>
          </FilterBar>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {situacoes.length === 0
              ? 'Todas as situações serão consideradas.'
              : `${situacoes.length} situação(ões) selecionada(s).`}
          </p>
        </div>
      </PageSection>

      {loading && (
        <PageSection variant="default" title="Carregando...">
          <div className="space-y-3 animate-pulse">
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="h-32 w-full bg-muted rounded-lg" />
          </div>
        </PageSection>
      )}

      {!loading && dados && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} value={dados.total} label="Alunos matriculados" />
          </div>

          <PageSection
            variant="flush"
            title="Resultado"
            description={`${dados.total} matrícula(s) encontrada(s). Ordenado por turma e nome do aluno.`}
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={handleExportarExcel}
                  disabled={exportandoExcel || dados.linhas.length === 0}
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
                  disabled={exportandoPdf || dados.linhas.length === 0}
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
            {mostraPorTurma && dados.porTurma.length > 0 && (
              <div className="px-6 pt-4">
                <p className="text-[14px] font-semibold text-foreground mb-2">
                  Quantidade de alunos por turma
                </p>
                <ul className="space-y-1 mb-2">
                  {dados.porTurma.map(t => (
                    <li
                      key={t.turmaNome}
                      className="flex items-center justify-between gap-4 text-[14px] py-1 border-b border-border last:border-0"
                    >
                      <span className="text-muted-foreground">{t.turmaNome}</span>
                      <span className="font-medium text-foreground tabular-nums">{t.quantidade}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dados.porSituacao.length > 0 && (
              <div className="px-6 pt-4">
                <p className="text-[14px] font-semibold text-foreground mb-2">
                  Quantidade de alunos por situação
                </p>
                <ul className="space-y-1 mb-2">
                  {dados.porSituacao.map(s => (
                    <li
                      key={s.situacao}
                      className="flex items-center justify-between gap-4 text-[14px] py-1 border-b border-border last:border-0"
                    >
                      <StatusBadge status={variantSituacaoMatricula(s.situacao)}>
                        {labelSituacaoMatricula(s.situacao)}
                      </StatusBadge>
                      <span className="font-medium text-foreground tabular-nums">{s.quantidade}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dados.linhas.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={SearchX}
                  title="Nenhuma matrícula encontrada"
                  description="Nenhuma matrícula foi encontrada para os critérios informados. Ajuste os filtros e tente novamente."
                />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-muted z-10">Aluno</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead>Ano Letivo</TableHead>
                        <TableHead>Data da Matrícula</TableHead>
                        <TableHead>Situação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {linhasPagina.map((l, i) => (
                        <TableRow key={`${l.alunoNome}-${l.turmaNome}-${i}`}>
                          <TableCell className="sticky left-0 bg-background z-10 font-medium text-foreground">
                            {nomeTitulo(l.alunoNome)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{l.turmaNome}</TableCell>
                          <TableCell className="text-muted-foreground">{l.anoLetivoDescricao}</TableCell>
                          <TableCell className="text-muted-foreground tabular-nums">
                            {formatarData(l.dataMatricula)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={variantSituacaoMatricula(l.situacao)}>
                              {labelSituacaoMatricula(l.situacao)}
                            </StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="px-6 py-4">
                  <Pagination
                    currentPage={pagina}
                    totalPages={totalPaginas}
                    totalItems={dados.linhas.length}
                    itemsPerPage={ITENS_POR_PAGINA}
                    onPageChange={setPagina}
                  />
                </div>
              </>
            )}
          </PageSection>
        </>
      )}

      {!loading && !dados && anoLetivoId && (
        <EmptyState
          icon={BarChart3}
          title="Relatório de Matrículas"
          description="Os resultados serão exibidos aqui conforme os filtros selecionados."
        />
      )}

      {!loading && !anoLetivoId && (
        <EmptyState
          icon={BarChart3}
          title="Selecione o ano letivo"
          description="Escolha o ano letivo para gerar o Relatório de Matrículas."
        />
      )}
    </div>
  )
}
