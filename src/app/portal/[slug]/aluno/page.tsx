'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, CalendarCheck, CalendarX, Star } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePortal } from '@/components/portal/portal-provider'
import { InicioCards } from '@/components/portal/inicio-cards'
import { getInicioPortal, getMediasInicio, type InicioPortal, type MediasInicio } from '@/lib/actions/portal'

function formatarMedia(v: number | null) {
  return v === null ? '—' : v.toFixed(2).replace('.', ',')
}

export default function PortalInicioPage() {
  const router = useRouter()
  const { sessao, aluno, escola } = usePortal()
  const base = escola ? `/portal/${escola.slug}` : '/portal'
  const [dados, setDados] = useState<InicioPortal | null>(null)
  const [periodoKpi, setPeriodoKpi] = useState<string>('')
  const [periodoCard, setPeriodoCard] = useState<string>('')
  const [cardMedias, setCardMedias] = useState<MediasInicio | null>(null)
  const [loading, setLoading] = useState(true)

  const respId = sessao?.responsavel.id
  const alunoId = aluno?.alunoId
  const schoolId = escola?.schoolId

  // Carga completa: 1x por aluno (KPIs + 1º período)
  useEffect(() => {
    if (!respId || !alunoId) return
    setLoading(true)
    setCardMedias(null)
    getInicioPortal(respId, alunoId, undefined, schoolId)
      .then(d => {
        setDados(d)
        if (d.periodos.length > 0) {
          setPeriodoKpi(p => p || String(d.periodos[0].ordem))
          setPeriodoCard(p => p || String(d.periodos[0].ordem))
        }
      })
      .catch(() => setDados(null))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respId, alunoId])

  // Troca leve do KPI (só médias, sem refetch de frequência/ocorrências/comunicados)
  const trocarPeriodoKpi = useCallback((ordem: string) => {
    setPeriodoKpi(ordem)
    if (!respId || !alunoId || !dados) return
    getMediasInicio(respId, alunoId, Number(ordem), schoolId)
      .then(m => setDados(d => (d ? { ...d, mediaGeral: { periodo: m.periodoNome, valor: m.mediaGeral } } : d)))
      .catch(() => {})
  }, [respId, alunoId, schoolId, dados])

  // Troca leve do card (filtro próprio, independente do KPI)
  const trocarPeriodoCard = useCallback((ordem: string) => {
    setPeriodoCard(ordem)
    if (!respId || !alunoId) return
    getMediasInicio(respId, alunoId, Number(ordem), schoolId)
      .then(setCardMedias)
      .catch(() => setCardMedias(null))
  }, [respId, alunoId, schoolId])

  if (!aluno || !sessao) return null

  if (loading && !dados) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-border bg-card shadow-xs p-6 space-y-3">
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
        </div>
      </PageContainer>
    )
  }

  if (!dados) return null

  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        title={`Olá, ${aluno.nome.split(' ')[0]}`}
        description={`${aluno.turmaNome} · Acompanhe frequência, notas e avisos`}
        icon={CalendarCheck}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={CalendarCheck}
          label="Presença Geral"
          value={dados.presencaGeral === null ? '—' : `${dados.presencaGeral}%`}
          variant={dados.presencaGeral === null ? 'default' : dados.presencaGeral >= 75 ? 'success' : 'destructive'}
        />
        <div className="rounded-xl border border-border bg-card shadow-xs p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Star className="h-5 w-5" />
            </div>
            {dados.periodos.length > 0 && (
              <Select value={periodoKpi} onValueChange={trocarPeriodoKpi}>
                <SelectTrigger className="w-[130px] h-8 text-[13px]" aria-label="Selecionar período da média geral">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dados.periodos.map(p => (
                    <SelectItem key={p.ordem} value={String(p.ordem)}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="mt-3">
            <p className="font-bold leading-none text-foreground tracking-tight tabular-nums text-[36px]">
              {dados.turmaNumerica ? formatarMedia(dados.mediaGeral.valor) : '—'}
            </p>
            <p className="font-medium text-muted-foreground text-[14px] mt-1.5">
              Média geral · {dados.mediaGeral.periodo}
            </p>
          </div>
        </div>
        <StatCard
          icon={CalendarX}
          label="Total de faltas"
          value={dados.totalFaltas}
          variant={dados.totalFaltas > 0 ? 'warning' : 'success'}
        />
        <StatCard
          icon={Bell}
          label="Total de ocorrências"
          value={dados.totalOcorrencias}
          variant={dados.totalOcorrencias > 0 ? 'warning' : 'success'}
        />
      </div>

      <InicioCards
        dados={dados}
        responsavelId={sessao.responsavel.id}
        alunoId={aluno.alunoId}
        schoolId={escola?.schoolId}
        periodoCard={periodoCard}
        onPeriodoCardChange={trocarPeriodoCard}
        cardMedias={cardMedias}
        onVerComunicados={() => router.push(`${base}/aluno/comunicados`)}
        onVerBoletim={() => router.push(`${base}/aluno/boletim`)}
        onVerOcorrencias={() => router.push(`${base}/aluno/ocorrencias`)}
      />
    </PageContainer>
  )
}
