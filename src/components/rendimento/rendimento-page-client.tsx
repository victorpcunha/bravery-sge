'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getAnosLetivos } from '@/lib/actions/calendarios'
import {
  getPanoramaRendimento,
  type PanoramaRendimento, type ResumoSituacao,
} from '@/lib/actions/rendimento'
import { RENDIMENTO_RESOURCE } from '@/lib/actions/rendimento-calculo'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { ModernTabs } from '@/components/ui/modern-tabs'
import { EmptyState } from '@/components/ui/empty-state'
import { BarChart3, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import ResumoFiltrosKpis, { type AnoOpcao } from './resumo-filtros-kpis'
import AbaGeralPeriodo from './aba-geral-periodo'
import AbaGeralEtapas from './aba-geral-etapas'
import AbaGeralTurmas from './aba-geral-turmas'
import AbaSituacao from './aba-situacao'
import AbaSituacaoFinal from './aba-situacao-final'
import DetalheTurmaDialog from './detalhe-turma-dialog'

type Props = {
  schoolId: string | null
}

export default function RendimentoPageClient({ schoolId }: Props) {
  const { isSuperAdmin, allSchools, loading: authLoading, pessoaId: pessoaAuth } = useAuth()
  const { pode, loaded: permLoaded, pessoaId: pessoaPerm } = usePermissoes(schoolId || '')
  const pessoaId = pessoaPerm || pessoaAuth || null

  const [escolaId, setEscolaId] = useState('')
  const [anos, setAnos] = useState<AnoOpcao[]>([])
  const [anoId, setAnoId] = useState('')
  const [periodo, setPeriodo] = useState<number | null>(null)
  const [panorama, setPanorama] = useState<PanoramaRendimento | null>(null)
  const [loadingPanorama, setLoadingPanorama] = useState(false)
  const [aba, setAba] = useState('geral')
  const [subSit, setSubSit] = useState('situacao')
  const [resumoSituacao, setResumoSituacao] = useState<ResumoSituacao | null>(null)
  const [drillTurma, setDrillTurma] = useState<{ id: string; nome: string; periodo: number | null } | null>(null)

  const escolaOperacional = isSuperAdmin ? (escolaId || null) : schoolId

  // Superadmin com 1 escola: auto-seleciona (padrão Documentos)
  useEffect(() => {
    if (isSuperAdmin && allSchools.length === 1 && !escolaId) {
      setEscolaId(allSchools[0].id)
    }
  }, [isSuperAdmin, allSchools, escolaId])

  const carregarAnos = useCallback(async (esc: string) => {
    try {
      const lista = await getAnosLetivos(esc)
      const ops: AnoOpcao[] = (lista || []).map(a => ({
        id: a.id, descricao: a.descricao || '', status: a.status || null,
      }))
      setAnos(ops)
      const ativo = ops.find(a => a.status === 'ativo')
      setAnoId(ativo?.id || ops[0]?.id || '')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao carregar anos letivos')
      setAnos([])
      setAnoId('')
    }
  }, [])

  useEffect(() => {
    if (escolaOperacional) carregarAnos(escolaOperacional)
    else {
      setAnos([])
      setAnoId('')
    }
  }, [escolaOperacional, carregarAnos])

  const carregarPanorama = useCallback(async (esc: string, ano: string) => {
    setLoadingPanorama(true)
    try {
      const data = await getPanoramaRendimento({ schoolId: esc, anoLetivoId: ano }, pessoaId)
      setPanorama(data)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao carregar rendimento')
      setPanorama(null)
    } finally {
      setLoadingPanorama(false)
    }
  }, [pessoaId])

  useEffect(() => {
    if (escolaOperacional && anoId) carregarPanorama(escolaOperacional, anoId)
    else setPanorama(null)
  }, [escolaOperacional, anoId, carregarPanorama])

  // Período global padrão: primeiro período avaliativo (sem "Ano completo" no global)
  useEffect(() => {
    if (periodo === null && panorama && panorama.porPeriodo.length > 0) {
      setPeriodo(panorama.porPeriodo[0].ordem)
    }
  }, [panorama, periodo])

  // Troca de escola/ano reseta o resumo de situação (recarrega ao abrir a aba)
  useEffect(() => {
    setResumoSituacao(null)
    setPeriodo(null)
  }, [escolaOperacional, anoId])

  if (authLoading || !permLoaded) {
    return (
      <>
        <PageHeader title="Rendimento Escolar" description="Desempenho acadêmico e alunos que precisam de atenção" icon={BarChart3} />
        <PageSection variant="default" title="Carregando...">
          <div className="space-y-3 animate-pulse">
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="h-32 w-full bg-muted rounded-lg" />
          </div>
        </PageSection>
      </>
    )
  }

  if (!pode.visualizar(RENDIMENTO_RESOURCE)) {
    return (
      <>
        <PageHeader title="Rendimento Escolar" description="Desempenho acadêmico e alunos que precisam de atenção" icon={BarChart3} />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para visualizar o Rendimento Escolar."
        />
      </>
    )
  }

  const filtrosProntos = !!escolaOperacional && !!anoId
  const riscoQtd = resumoSituacao?.risco.quantidade || 0

  return (
    <>
      <PageHeader title="Rendimento Escolar" description="Desempenho acadêmico e alunos que precisam de atenção" icon={BarChart3} />
      <ResumoFiltrosKpis
        isSuperAdmin={isSuperAdmin}
        schools={allSchools}
        escolaId={escolaId}
        onEscolaChange={setEscolaId}
        anos={anos}
        anoId={anoId}
        onAnoChange={setAnoId}
        periodos={panorama?.porPeriodo || []}
        periodo={periodo}
        onPeriodoChange={setPeriodo}
        panorama={panorama}
        loading={loadingPanorama}
      />
      {!filtrosProntos ? (
        <EmptyState
          icon={BarChart3}
          title="Selecione os filtros"
          description={isSuperAdmin ? 'Escolha a unidade escolar e o ano letivo para ver o rendimento.' : 'Escolha o ano letivo para ver o rendimento.'}
        />
      ) : (
        <ModernTabs
          tabs={[
            { value: 'geral', label: 'Geral' },
            { value: 'situacao', label: 'Situação', badge: riscoQtd },
          ]}
          onValueChange={setAba}
        >
          <ModernTabs tabs={[
            { value: 'periodo', label: 'Período' },
            { value: 'etapa', label: 'Etapa de Ensino' },
            { value: 'turma', label: 'Turma' },
          ]} urlSync={false}>
            <AbaGeralPeriodo
              panorama={panorama}
              periodo={periodo}
              loading={loadingPanorama}
              escolaId={escolaOperacional || ''}
              anoId={anoId}
              pessoaId={pessoaId}
            />
            <AbaGeralEtapas panorama={panorama} periodoInicial={periodo} loading={loadingPanorama} />
            <AbaGeralTurmas
              panorama={panorama}
              loading={loadingPanorama}
              escolaId={escolaOperacional || ''}
              anoId={anoId}
              pessoaId={pessoaId}
              onExpandTurma={(turmaId, periodo) => {
                const t = panorama?.recortes
                  .flatMap(r => r.porTurma)
                  .find(x => x.turmaId === turmaId)
                setDrillTurma({ id: turmaId, nome: t?.nome || 'Turma', periodo })
              }}
            />
          </ModernTabs>
          <ModernTabs tabs={[
            { value: 'situacao', label: 'Situação por Período' },
            { value: 'final', label: 'Situação Final' },
          ]} urlSync={false} onValueChange={setSubSit}>
            <AbaSituacao
              ativo={aba === 'situacao'}
              escolaId={escolaOperacional || ''}
              anoId={anoId}
              pessoaId={pessoaId}
              onResumo={setResumoSituacao}
            />
            <AbaSituacaoFinal
              ativo={aba === 'situacao' && subSit === 'final'}
              escolaId={escolaOperacional || ''}
              anoId={anoId}
              pessoaId={pessoaId}
            />
          </ModernTabs>
        </ModernTabs>
      )}
      <DetalheTurmaDialog
        open={!!drillTurma}
        onOpenChange={(o) => { if (!o) setDrillTurma(null) }}
        escolaId={escolaOperacional || ''}
        anoId={anoId}
        turmaId={drillTurma?.id || ''}
        turmaNome={drillTurma?.nome || ''}
        periodo={drillTurma?.periodo ?? null}
        pessoaId={pessoaId}
      />
    </>
  )
}
