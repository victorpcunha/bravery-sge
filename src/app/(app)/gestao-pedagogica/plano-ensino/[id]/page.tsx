'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTabParams } from '@/lib/tab-params'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  listarPlanoAulaComQuadro,
  excluirPlanoAula,
  listarPeriodosPlanoEnsino,
  buscarBNCCBase,
  listarPlanosEnsino,
  type PlanoAulaQuadro,
} from '@/lib/actions/plano-ensino'
import { PlanoAulaForm } from '@/components/plano-ensino/plano-aula-form'
import { PlanoAulaDetalheDialog } from '@/components/plano-ensino/plano-aula-detalhe-dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft, Plus, Pencil, Trash2, Eye, BookOpen, GraduationCap,
  Clock, Hourglass, Layers,
} from 'lucide-react'
import { toast } from 'sonner'

function formatarPeriodos(periodos?: number[]) {
  if (!periodos?.length) return '—'
  const sorted = [...periodos].sort((a, b) => a - b)
  if (sorted.length === 1) return `${sorted[0]}º Período`
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const isSequencia = sorted.length === last - first + 1
  if (isSequencia) return `${first}º ao ${last}º Período`
  return sorted.map(p => `${p}º`).join(' e ')
}

function formatarMinutos(minutos: number) {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h${String(m).padStart(2, '0')}`
}

function formatarDataCurta(iso?: string | null) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return '—'
  return `${d}/${m}`
}

function truncarTexto(texto: string, max: number) {
  if (texto.length <= max) return texto
  return `${texto.slice(0, max).trimEnd()}...`
}

const TIPOS_HABILIDADE = ['habilidade', 'habilidade_medio', 'objetivo']

function contarHabilidades(fields?: any[]) {
  return (fields || []).filter(f => TIPOS_HABILIDADE.includes(f.tipo)).length
}

function InfoChip({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-[13px] font-medium text-foreground">
      <Icon className="h-3.5 w-3.5 text-primary/70" />
      {children}
    </span>
  )
}

export default function PlanoEnsinoDetailPage() {
  const params = useTabParams()
  const router = useRouter()
  const planoId = params.id as string
  const { schoolId } = useAuth()
  const [pessoaId, setPessoaId] = useState<string | null>(null)
  const [plano, setPlano] = useState<any>(null)
  const [periodos, setPeriodos] = useState<number[]>([])
  const [periodoAtivo, setPeriodoAtivo] = useState(1)
  const [aulas, setAulas] = useState<PlanoAulaQuadro[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAula, setEditingAula] = useState<PlanoAulaQuadro | null>(null)
  const [aulaDetalhe, setAulaDetalhe] = useState<PlanoAulaQuadro | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PlanoAulaQuadro | null>(null)

  // BNCC state
  const [bnccData, setBnccData] = useState<any>(null)
  const [bnccLoading, setBnccLoading] = useState(false)

  const { loaded: permLoaded, pessoaId: pid } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  const carregarPlano = useCallback(async () => {
    if (!planoId) return
    setLoading(true)
    try {
      const planos = await listarPlanosEnsino(schoolId, pessoaId)
      const encontrado = planos.find(p => p.id === planoId)
      if (encontrado) {
        setPlano(encontrado)
        const { periodos } = await listarPeriodosPlanoEnsino(encontrado.turma_id)
        setPeriodos(periodos)
        setPeriodoAtivo(periodos[0] || 1)
      }
    } catch {
      toast.error('Erro ao carregar plano')
    } finally {
      setLoading(false)
    }
  }, [schoolId, pessoaId, planoId])

  useEffect(() => {
    if (permLoaded) carregarPlano()
  }, [carregarPlano, permLoaded])

  const carregarAulas = useCallback(async () => {
    if (!planoId || !plano) return
    try {
      const data = await listarPlanoAulaComQuadro(
        planoId,
        plano.turma_id,
        (plano.disciplinas || []).map((d: any) => d.matriz_disciplina_id),
        periodoAtivo,
        pessoaId
      )
      setAulas(data)
    } catch {
      toast.error('Erro ao carregar planos de aula')
    }
  }, [planoId, plano, periodoAtivo, pessoaId])

  useEffect(() => {
    if (planoId) carregarAulas()
  }, [carregarAulas])

  useEffect(() => {
    if (!plano?.etapa_tipo) return
    setBnccLoading(true)
    const disc = plano.disciplinas?.[0]?.nome || undefined
    buscarBNCCBase(plano.etapa_tipo, disc)
      .then(setBnccData)
      .catch(() => toast.error('Erro ao carregar dados BNCC'))
      .finally(() => setBnccLoading(false))
  }, [plano?.etapa_tipo, plano?.id])

  const handleExcluir = async () => {
    if (!deleteTarget) return
    try {
      await excluirPlanoAula(deleteTarget.id, pessoaId)
      setAulas(prev => prev.filter(a => a.id !== deleteTarget.id))
      setDeleteTarget(null)
      toast.success('Plano de aula excluído')
    } catch {
      toast.error('Erro ao excluir')
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-12 w-full rounded-lg mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </PageContainer>
    )
  }

  if (!plano) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Plano não encontrado.</p>
      </PageContainer>
    )
  }

  const tituloPlano = plano.is_interdisciplinar
    ? `Plano de Ensino - Interdisciplinar - ${plano.turma_nome}`
    : `Plano de Ensino - ${plano.disciplinas?.[0]?.nome || 'Sem disciplina'} - ${plano.turma_nome}`

  const anoEscolar = plano.etapa_nome?.match(/(\d+)º/)?.[1]

  const abrirCriacao = () => {
    setEditingAula(null)
    setShowForm(true)
  }

  const abrirEdicao = (aula: PlanoAulaQuadro) => {
    setAulaDetalhe(null)
    setEditingAula(aula)
    setShowForm(true)
  }

  const cancelarForm = () => {
    setEditingAula(null)
    setShowForm(false)
  }

  const aoSalvar = () => {
    setShowForm(false)
    setEditingAula(null)
    carregarAulas()
  }

  return (
    <PageContainer>
      <PageHeader
        title={tituloPlano}
        description={plano.etapa_nome}
        icon={GraduationCap}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => (showForm ? cancelarForm() : router.push('/gestao-pedagogica/plano-ensino'))}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            {showForm ? 'Cancelar' : 'Voltar'}
          </Button>
        }
      />

      {showForm ? (
        <PlanoAulaForm
          planoId={plano.id}
          turmaId={plano.turma_id}
          disciplinas={plano.disciplinas || []}
          periodos={periodos}
          periodoInicial={periodoAtivo}
          etapaTipo={plano.etapa_tipo || ''}
          anoEscolar={anoEscolar}
          bnccData={bnccData}
          bnccLoading={bnccLoading}
          editingAula={editingAula}
          pessoaId={pessoaId}
          onCancel={cancelarForm}
          onSaved={aoSalvar}
        />
      ) : (
        <Tabs
          value={String(periodoAtivo)}
          onValueChange={v => {
            setPeriodoAtivo(Number(v))
            setShowForm(false)
            setEditingAula(null)
          }}
        >
          <div className="relative -mx-4 sm:mx-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList className="mx-4 mb-6 flex h-auto w-max min-h-[48px] gap-1 rounded-lg border border-border bg-card p-1 shadow-xs sm:mx-0 sm:w-1/2">
              {periodos.map(p => (
                <TabsTrigger
                  key={p}
                  value={String(p)}
                  className="h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm"
                >
                  {p}º Período
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {periodos.map(p => (
            <TabsContent key={p} value={String(p)}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-foreground">Planos de Aula — {p}º Período</h3>
                <Button onClick={abrirCriacao}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Criar Plano de Aula
                </Button>
              </div>

              {aulas.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Nenhum Plano de Aula cadastrado.</p>
                </div>
              )}

              {aulas.length > 0 && (
                <div className="space-y-3">
                  {aulas.map(aula => {
                    const qtdHabilidades = contarHabilidades(aula.bncc_fields)
                    return (
                      <Card key={aula.id} className="border-border overflow-hidden">
                        <CardContent className="p-0 flex">
                          <div className="shrink-0 w-20 sm:w-28 bg-primary/5 border-r border-border flex flex-col items-center justify-center py-4 px-1 text-center">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Início</span>
                            <span className="text-[15px] sm:text-[16px] font-bold text-primary tabular-nums mt-0.5">
                              {formatarDataCurta(aula.data_inicio)}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-3">Fim</span>
                            <span className="text-[15px] sm:text-[16px] font-bold text-primary tabular-nums mt-0.5">
                              {formatarDataCurta(aula.data_fim)}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0 p-4">
                            <h4 className="text-[16px] font-semibold text-foreground">{aula.tema}</h4>

                            <div className="mt-2.5 flex flex-wrap gap-2">
                              <InfoChip icon={Layers}>{formatarPeriodos(aula.periodos)}</InfoChip>
                              <InfoChip icon={Clock}>
                                {aula.aulas_quadro == null ? '—' : `${aula.aulas_quadro} aula${aula.aulas_quadro === 1 ? '' : 's'}`}
                              </InfoChip>
                              <InfoChip icon={Hourglass}>
                                {aula.horas_quadro == null ? '—' : formatarMinutos(aula.horas_quadro)}
                              </InfoChip>
                              <InfoChip icon={BookOpen}>
                                {qtdHabilidades} habilidade{qtdHabilidades === 1 ? '' : 's'} BNCC
                              </InfoChip>
                            </div>

                            {aula.conteudo && (
                              <p className="mt-2.5 text-[14px] text-muted-foreground whitespace-pre-wrap">
                                {truncarTexto(aula.conteudo, 100)}
                              </p>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <Button variant="outline" size="sm" className="h-9" onClick={() => setAulaDetalhe(aula)}>
                                <Eye className="h-3.5 w-3.5 mr-1.5" />
                                Visualizar plano de aula
                              </Button>
                              <Button variant="ghost" size="sm" className="h-9" onClick={() => abrirEdicao(aula)}>
                                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                Editar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 text-destructive hover:text-destructive"
                                onClick={() => setDeleteTarget(aula)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                Excluir plano de aula
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <PlanoAulaDetalheDialog
        plano={aulaDetalhe}
        onOpenChange={open => { if (!open) setAulaDetalhe(null) }}
        footerAction={
          aulaDetalhe && (
            <Button onClick={() => abrirEdicao(aulaDetalhe)}>
              <Pencil className="h-4 w-4 mr-1.5" />
              Editar plano de aula
            </Button>
          )
        }
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="Excluir plano de aula"
        description={deleteTarget ? `Tem certeza que deseja excluir o plano "${deleteTarget.tema}"? Esta ação não pode ser desfeita.` : undefined}
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleExcluir}
      />
    </PageContainer>
  )
}
