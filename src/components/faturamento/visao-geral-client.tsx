'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { StatCard } from '@/components/ui/stat-card'
import { LayoutDashboard, ShieldAlert, ArrowRight, Wallet } from 'lucide-react'
import { getVisaoGeral } from '@/lib/actions/faturamento'
import { getTurmasAtivas } from '@/lib/actions/matriculas'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { useTabActive } from '@/lib/tab-params'
import { formatarMoeda } from '@/lib/faturamento-calculo'
import { GeracaoWizard } from '@/components/faturamento/geracao-wizard'
import { toast } from 'sonner'

const ROTULO_PENDENCIA: Record<string, string> = {
  sem_plano: 'matrícula(s) sem plano de cobrança',
  vencidas: 'mensalidade(s) vencida(s)',
  sem_responsavel: 'plano(s) sem responsável financeiro',
  config_incompleta: 'ano sem configuração padrão',
}

export default function VisaoGeralClient() {
  const { user, schoolId, isSuperAdmin, allSchools, loading: authLoading, pessoaId } = useAuth()
  const { pode } = usePermissoes(schoolId)
  const router = useRouter()
  const tabActive = useTabActive()

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anos, setAnos] = useState<any[]>([])
  const [anoId, setAnoId] = useState('')
  const [turmas, setTurmas] = useState<any[]>([])
  const [turmaId, setTurmaId] = useState('__all__')
  const [dados, setDados] = useState<Awaited<ReturnType<typeof getVisaoGeral>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [wizardOpen, setWizardOpen] = useState(false)

  const effectiveSchoolId = selectedSchoolId || schoolId
  const podeGerar = pode.criar('faturamento.cobrancas')

  useEffect(() => { if (!authLoading && !user) router.push('/login') }, [user, authLoading, router])

  useEffect(() => {
    if (!effectiveSchoolId) { setLoading(false); return }
    getAnosLetivosAtivos(effectiveSchoolId).then(lista => {
      setAnos(lista)
      const ativo = lista.find((a: any) => a.status === 'ativo')
      setAnoId(ativo?.id || lista[0]?.id || '')
    }).catch(() => setAnos([]))
  }, [effectiveSchoolId])

  useEffect(() => {
    if (!effectiveSchoolId || !anoId) { setTurmas([]); return }
    getTurmasAtivas(effectiveSchoolId, anoId).then(setTurmas).catch(() => setTurmas([]))
  }, [effectiveSchoolId, anoId])

  const load = useCallback(async () => {
    if (!effectiveSchoolId || !anoId) { setLoading(false); return }
    setLoading(true)
    try {
      setDados(await getVisaoGeral(effectiveSchoolId, {
        anoLetivoId: anoId,
        turmaId: turmaId !== '__all__' ? turmaId : undefined,
      }))
    } catch { toast.error('Erro ao carregar visão geral') }
    finally { setLoading(false) }
  }, [effectiveSchoolId, anoId, turmaId])

  useEffect(() => { if (tabActive) load() }, [tabActive, load])

  if (authLoading) {
    return <PageContainer><div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></PageContainer>
  }

  if (!pode.visualizar('faturamento.visao-geral')) {
    return <PageContainer><Card><EmptyState icon={ShieldAlert} title="Sem permissão" description="Você não tem acesso à Visão Geral do Faturamento." /></Card></PageContainer>
  }

  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        icon={LayoutDashboard}
        title="Faturamento"
        description="Previsto, recebido, em aberto e vencido — e o que exige atenção."
        actions={podeGerar && effectiveSchoolId && anoId ? <Button onClick={() => setWizardOpen(true)}><Wallet className="h-4 w-4" />Gerar planos</Button> : undefined}
      />

      <PageSection variant="compact" title="Contexto" className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isSuperAdmin && (
            <div className="space-y-1.5">
              <Label className="text-[14px] font-medium">Unidade Escolar</Label>
              <Select value={selectedSchoolId || schoolId || ''} onValueChange={setSelectedSchoolId}>
                <SelectTrigger><SelectValue placeholder="Selecione a escola" /></SelectTrigger>
                <SelectContent>
                  {allSchools.map(s => <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-[14px] font-medium">Ano Letivo</Label>
            <Select value={anoId} onValueChange={setAnoId}>
              <SelectTrigger><SelectValue placeholder="Selecione o ano" /></SelectTrigger>
              <SelectContent>
                {anos.map(a => <SelectItem key={a.id} value={a.id}>{a.descricao || a.ano}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[14px] font-medium">Turma</Label>
            <Select value={turmaId} onValueChange={setTurmaId}>
              <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                {turmas.map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PageSection>

      {loading ? (
        <Card><div className="p-6 space-y-3"><div className="h-10 bg-muted rounded-lg animate-pulse" /></div></Card>
      ) : dados ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Wallet} label="Previsto" value={formatarMoeda(dados.previsto)} />
            <StatCard icon={Wallet} label="Recebido" value={formatarMoeda(dados.recebido)} variant="success" />
            <StatCard icon={Wallet} label="Em aberto" value={formatarMoeda(dados.emAberto)} variant="warning" />
            <StatCard icon={Wallet} label="Vencido" value={formatarMoeda(dados.vencido)} variant="destructive" />
          </div>

          <PageSection variant="default" title={`Pendências (${dados.pendencias.length})`}>
            {dados.pendencias.length === 0 ? (
              <EmptyState icon={LayoutDashboard} title="Nada pendente" description="Nenhuma pendência financeira no contexto selecionado." />
            ) : (
              <ul className="space-y-2">
                {dados.pendencias.map(p => (
                  <li key={p.tipo} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
                    <p className="flex-1 min-w-[200px] text-[15px]">
                      <strong className="tabular-nums">{p.tipo === 'config_incompleta' ? '' : `${p.quantidade} `}</strong>
                      {ROTULO_PENDENCIA[p.tipo] || p.tipo}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={p.href}>{p.acao}<ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </PageSection>
        </>
      ) : null}

      {effectiveSchoolId && anoId && (
        <GeracaoWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          schoolId={effectiveSchoolId}
          anoLetivoId={anoId}
          pessoaId={pessoaId || null}
          onDone={load}
        />
      )}
    </PageContainer>
  )
}
