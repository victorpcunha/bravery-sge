'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTabParams } from '@/lib/tab-params'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getDadosFechamentoTurma, fecharTurma, type DadosFechamentoTurma } from '@/lib/actions/fechamento-turma'
import { isSituacaoSaida, labelSituacaoMatricula, variantSituacaoMatricula } from '@/lib/situacoes-matricula'
import { FechamentoPieChart, type FechamentoPieDatum } from '@/components/fechamento/fechamento-pie-chart'
import { FechamentoTabela } from '@/components/fechamento/fechamento-tabela'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Users,
  UserCheck,
  UserX,
  Clock,
  UserMinus,
  Lock,
  ShieldAlert,
  AlertTriangle,
  ClipboardCheck,
} from 'lucide-react'
import { toast } from 'sonner'

const COLOR_POR_VARIANT: Record<string, string> = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  destructive: 'var(--destructive)',
  primary: 'var(--primary)',
  info: 'var(--primary)',
  muted: 'var(--muted)',
}

function KpiCard({
  icon: Icon,
  value,
  label,
  variant,
  detalhes,
}: {
  icon: any
  value: number | string
  label: string
  variant: 'primary' | 'success' | 'warning' | 'destructive' | 'muted'
  detalhes?: { texto: string; cor: 'success' | 'destructive' | 'warning' | 'muted' }[]
}) {
  const iconClass = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
    muted: 'bg-muted text-muted-foreground',
  }[variant]

  const detalheCor = {
    success: 'text-success',
    destructive: 'text-destructive',
    warning: 'text-warning',
    muted: 'text-muted-foreground',
  }

  return (
    <Card className="shadow-xs">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className={iconClass}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-[32px] font-bold leading-none tracking-tight text-foreground tabular-nums">{value}</p>
        <p className="mt-1.5 text-[14px] font-medium text-muted-foreground">{label}</p>
        {detalhes && detalhes.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-border pt-2">
            {detalhes.map(d => (
              <p key={d.texto} className="text-[12px] font-medium tabular-nums">
                <span className={detalheCor[d.cor]}>{d.texto}</span>
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function FechamentoTurmaPage() {
  const params = useTabParams()
  const router = useRouter()
  const turmaId = params.turmaId as string
  const { schoolId } = useAuth()
  const { loaded: permLoaded, pessoaId, pode } = usePermissoes(schoolId || '')

  const [dados, setDados] = useState<DadosFechamentoTurma | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fechando, setFechando] = useState(false)
  const [modalPendentesOpen, setModalPendentesOpen] = useState(false)
  const [modalConfirmarOpen, setModalConfirmarOpen] = useState(false)

  const podeFechar = pode.editar('gestao-pedagogica.fechamento.fechar')
  const acesso = pode.visualizar('gestao-pedagogica.fechamento.fechar') || pode.visualizar('gestao-pedagogica.fechamento.desfazer')

  const carregar = async () => {
    setLoading(true)
    setError(null)
    try {
      const d = await getDadosFechamentoTurma(turmaId, pessoaId)
      setDados(d)
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar dados do fechamento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!turmaId) return
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaId, pessoaId])

  const resumo = useMemo(() => {
    if (!dados) return null
    const alunos = dados.alunos
    const ativos = alunos.filter(a => a.situacao === 'Ativo')
    const pendentes = ativos.filter(a => a.pendente)
    const definidos = ativos.filter(a => !a.pendente && a.resultado)
    const outros = alunos.filter(a => isSituacaoSaida(a.situacao))
    const aprovadosDiretos = alunos.filter(a => ['Aprovado', 'Aprovado concluinte', 'Sem movimentação'].includes(a.resultado || ''))
    const aprovadosConselho = alunos.filter(a => a.resultado === 'Aprovado por conselho de classe')
    const reprovadosNota = alunos.filter(a => a.resultado === 'Reprovado')
    const reprovadosFreq = alunos.filter(a => a.resultado === 'Reprovado por frequência')
    const aprovados = aprovadosDiretos.length + aprovadosConselho.length
    const reprovados = reprovadosNota.length + reprovadosFreq.length
    return { alunos, ativos, pendentes, definidos, outros, aprovadosDiretos, aprovadosConselho, reprovadosNota, reprovadosFreq, aprovados, reprovados }
  }, [dados])

  const pieData = useMemo<FechamentoPieDatum[]>(() => {
    if (!dados) return []
    const grupos = new Map<string, { value: number; variant: string }>()
    for (const a of dados.alunos) {
      const pendente = a.situacao === 'Ativo' && a.pendente
      const situacaoExibida = pendente ? 'Pendente' : (a.resultado || a.situacao)
      const label = pendente ? 'Pendente' : labelSituacaoMatricula(situacaoExibida)
      const variant = pendente ? 'warning' : variantSituacaoMatricula(situacaoExibida)
      const atual = grupos.get(label) || { value: 0, variant }
      atual.value += 1
      grupos.set(label, atual)
    }
    return Array.from(grupos.entries()).map(([name, g]) => ({
      name,
      value: g.value,
      color: COLOR_POR_VARIANT[g.variant] || 'var(--muted)',
    }))
  }, [dados])

  const legenda = useMemo(() => pieData.filter(d => d.value > 0), [pieData])

  const handleClicarFechar = () => {
    if (!resumo) return
    if (resumo.pendentes.length > 0) {
      setModalPendentesOpen(true)
    } else {
      setModalConfirmarOpen(true)
    }
  }

  const handleConfirmarFechamento = async () => {
    setFechando(true)
    try {
      const res = await fecharTurma(turmaId, pessoaId)
      toast.success(`Turma fechada! ${res.total} aluno(s) com situação final definida.`)
      setModalConfirmarOpen(false)
      await carregar()
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao fechar a turma')
      setModalConfirmarOpen(false)
    } finally {
      setFechando(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState icon={AlertTriangle} title="Erro ao carregar" description={error} />
      </PageContainer>
    )
  }

  if (permLoaded && !acesso) {
    return (
      <PageContainer>
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Seu perfil não possui permissão para acessar o Fechamento de Turma."
        />
      </PageContainer>
    )
  }

  const fechada = dados?.turma.fechada === true
  const progresso = resumo && resumo.ativos.length > 0
    ? Math.round((resumo.definidos.length / resumo.ativos.length) * 100)
    : 0

  return (
    <PageContainer>
      <PageHeader
        title="Fechamento de Turma"
        description={dados?.turma.nome ? `Fechamento da turma ${dados.turma.nome}` : undefined}
        icon={ClipboardCheck}
        breadcrumbs={[
          { label: 'Diário de Classe', href: '/gestao-pedagogica/diario-classe' },
          { label: dados?.turma.nome || 'Turma', href: `/gestao-pedagogica/diario-classe/${turmaId}` },
          { label: 'Fechamento' },
        ]}
      />

      {fechada && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <Lock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <p className="text-[14px] text-muted-foreground">
            Esta turma está <strong className="text-foreground">fechada</strong> desde{' '}
            {dados?.turma.data_fechamento ? new Date(String(dados.turma.data_fechamento) + 'T00:00:00').toLocaleDateString('pt-BR') : ''}.
            As situações exibidas abaixo são definitivas. Para reabrir, utilize &quot;Desfazer Fechamento&quot; no Diário de Classe.
          </p>
        </div>
      )}

      {/* Identificação */}
      <PageSection title="Identificação" className="mb-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-[15px] font-semibold text-foreground">{dados?.turma.nome}</span>
          </div>
          <Badge variant="secondary">{dados?.turma.etapa_nome || 'Etapa'}</Badge>
          <span className="text-[14px] text-muted-foreground">Ano Letivo: {dados?.turma.ano_letivo_descricao}</span>
          <span className="text-[14px] text-muted-foreground">Método: {dados?.turma.metodo_nome || '—'}</span>
          {fechada && <Badge className="bg-muted text-muted-foreground border border-border">Fechada</Badge>}
        </div>
      </PageSection>

      {/* KPIs */}
      {resumo && (
        <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <KpiCard icon={Users} value={resumo.alunos.length} label="Total de Alunos" variant="primary" />
          <KpiCard
            icon={UserCheck}
            value={resumo.aprovados}
            label="Aprovados"
            variant="success"
            detalhes={[
              { texto: `${resumo.aprovadosDiretos.length} diretos`, cor: 'success' },
              { texto: `${resumo.aprovadosConselho.length} conselho`, cor: 'success' },
            ]}
          />
          <KpiCard
            icon={UserX}
            value={resumo.reprovados}
            label="Reprovados"
            variant="destructive"
            detalhes={[
              { texto: `${resumo.reprovadosNota.length} por nota`, cor: 'destructive' },
              { texto: `${resumo.reprovadosFreq.length} por frequência`, cor: 'destructive' },
            ]}
          />
          <KpiCard icon={Clock} value={resumo.pendentes.length} label="Pendentes" variant="warning" />
          <KpiCard icon={UserMinus} value={resumo.outros.length} label="Outros" variant="muted" />
        </div>
      )}

      {/* Gráfico */}
      <div className="mb-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-xs">
          <CardContent className="p-5">
            <p className="text-[16px] font-semibold text-foreground mb-1">Distribuição das Situações</p>
            <p className="text-[14px] text-muted-foreground mb-4">Totais por situação da turma</p>
            <FechamentoPieChart data={pieData} />
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardContent className="p-5">
            <p className="text-[16px] font-semibold text-foreground mb-1">Legenda</p>
            <p className="text-[14px] text-muted-foreground mb-4">Situações identificadas</p>
            {legenda.length === 0 ? (
              <p className="text-[14px] text-muted-foreground">Sem dados para exibir.</p>
            ) : (
              <ul className="space-y-2">
                {legenda.map(l => (
                  <li key={l.name} className="flex items-center gap-2 text-[14px]">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                    <span className="font-medium text-foreground">{l.name}</span>
                    <span className="text-muted-foreground tabular-nums ml-auto">{l.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fechamento da Turma */}
      <PageSection
        variant="compact"
        title="Fechamento da Turma"
        className="mb-5"
        actions={
          !fechada && podeFechar ? (
            <Button size="sm" onClick={handleClicarFechar}>
              <ClipboardCheck className="mr-1.5 h-4 w-4" />
              Fechar Turma
            </Button>
          ) : undefined
        }
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-[14px] text-muted-foreground">
              Situações definidas
              {resumo && resumo.ativos.length > 0 ? (
                <strong className="text-foreground tabular-nums"> {resumo.definidos.length}/{resumo.ativos.length}</strong>
              ) : (
                ' 0/0'
              )}
            </p>
            {resumo && resumo.pendentes.length > 0 && (
              <p className="text-[13px] text-amber-700 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                {resumo.pendentes.length} aluno(s) com avaliações pendentes impedem o fechamento.
              </p>
            )}
          </div>
          <Progress value={progresso} aria-label="Progresso do fechamento" />
          {!fechada && (
            <p className="text-[13px] text-muted-foreground">
              Após confirmar, a turma será fechada para o ano letivo vigente e não será mais possível registrar frequências ou corrigir notas.
            </p>
          )}
        </div>
      </PageSection>

      {/* Tabela */}
      {dados && (
        <PageSection title="Alunos" variant="flush">
          <FechamentoTabela
            alunos={dados.alunos}
            disciplinas={dados.disciplinas}
            quantidadePeriodos={dados.metodo.quantidade_periodos}
            mediaMinima={dados.metodo.media_minima}
            frecuenciaMinima={dados.metodo.frecuencia_minima}
          />
        </PageSection>
      )}

      {/* Modal: pendentes */}
      <Dialog open={modalPendentesOpen} onOpenChange={setModalPendentesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Pendências para o fechamento
            </DialogTitle>
            <DialogDescription>
              Não é possível fechar a turma enquanto houver alunos ativos com avaliações pendentes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-[14px]">
            <p className="text-foreground">
              Defina as notas, recuperações e frequências dos {resumo?.pendentes.length} aluno(s) abaixo antes de fechar:
            </p>
            <ul className="rounded-lg border border-border bg-warning/5 px-3 py-2 space-y-1 max-h-48 overflow-y-auto">
              {resumo?.pendentes.map(p => (
                <li key={p.matricula_id} className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">{p.nome_completo}</span>
                  <span className="text-[12px] text-warning font-medium shrink-0">Pendente</span>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalPendentesOpen(false)}>Entendi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: confirmar fechamento */}
      <Dialog open={modalConfirmarOpen} onOpenChange={setModalConfirmarOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Fechamento de Turma</DialogTitle>
            <DialogDescription>
              Ao confirmar, a turma será fechada para o ano letivo vigente. Após o fechamento, não será possível registrar
              frequências e/ou corrigir notas de avaliações. A ação fica registrada na auditoria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-success/5 p-3 text-center">
              <p className="text-[24px] font-bold text-success tabular-nums">{resumo?.aprovados ?? 0}</p>
              <p className="text-[12px] text-muted-foreground font-medium">Aprovados</p>
            </div>
            <div className="rounded-lg border border-border bg-destructive/5 p-3 text-center">
              <p className="text-[24px] font-bold text-destructive tabular-nums">{resumo?.reprovados ?? 0}</p>
              <p className="text-[12px] text-muted-foreground font-medium">Reprovados</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-center">
              <p className="text-[24px] font-bold text-muted-foreground tabular-nums">{resumo?.outros.length ?? 0}</p>
              <p className="text-[12px] text-muted-foreground font-medium">Outros</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalConfirmarOpen(false)}>Cancelar</Button>
            <Button onClick={handleConfirmarFechamento} disabled={fechando}>
              {fechando ? 'Fechando...' : 'Confirmar Fechamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}