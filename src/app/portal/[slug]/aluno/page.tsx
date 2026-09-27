'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, ArrowLeftRight, CalendarCheck, CalendarDays, CalendarX, FolderOpen, GraduationCap, Megaphone, Star } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/stat-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePortal } from '@/components/portal/portal-provider'
import { InicioCards } from '@/components/portal/inicio-cards'
import { TrocarAlunoModal } from '@/components/portal/trocar-aluno-modal'
import { getInicioPortal, getMediasInicio, type InicioPortal, type MediasInicio } from '@/lib/actions/portal'

function formatarMedia(v: number | null) {
  return v === null ? '—' : v.toFixed(2).replace('.', ',')
}

export default function PortalInicioPage() {
  const router = useRouter()
  const { sessao, aluno, alunos, escola } = usePortal()
  const base = escola ? `/portal/${escola.slug}` : '/portal'
  const [dados, setDados] = useState<InicioPortal | null>(null)
  const [periodoKpi, setPeriodoKpi] = useState<string>('')
  const [periodoCard, setPeriodoCard] = useState<string>('')
  const [cardMedias, setCardMedias] = useState<MediasInicio | null>(null)
  const [loading, setLoading] = useState(true)
  const [trocarOpen, setTrocarOpen] = useState(false)

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

  const nomeResponsavel = sessao.responsavel.nome.split(' ')[0] || sessao.responsavel.nome
  const vis = escola?.modulosVisiveis
  const acessosRapidos = [
    { href: `${base}/aluno/boletim`, label: 'Boletim', Icon: Star, modulo: 'boletim' as const },
    { href: `${base}/aluno/frequencia`, label: 'Frequência', Icon: CalendarDays, modulo: 'frequencia' as const },
    { href: `${base}/aluno/horarios`, label: 'Horários', Icon: GraduationCap, modulo: 'horarios' as const },
    { href: `${base}/aluno/ocorrencias`, label: 'Ocorrências', Icon: Bell, modulo: 'ocorrencias' as const },
    { href: `${base}/aluno/comunicados`, label: 'Comunicados', Icon: Megaphone, modulo: 'comunicados' as const },
    { href: `${base}/aluno/documentos`, label: 'Documentos', Icon: FolderOpen, modulo: 'documentos' as const },
  ].filter(a => vis?.[a.modulo] !== false)
  const algumModuloVisivel = acessosRapidos.length > 0

  return (
    <PageContainer maxWidth="dashboard">
      <section aria-label="Boas-vindas" className="rounded-xl bg-sidebar border border-sidebar-border shadow-xs p-6 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[28px] font-bold leading-tight text-sidebar-foreground">
              Olá, {nomeResponsavel}
            </h1>
            <p className="text-[15px] text-sidebar-foreground/70 mt-1">
              Você está acompanhando o(a) aluno(a){' '}
              <span className="font-semibold text-sidebar-foreground">{aluno.nome}</span>
              , da turma{' '}
              <span className="inline-flex items-center rounded-sm bg-sidebar-accent px-1.5 py-0.5 font-semibold text-sidebar-foreground">
                {aluno.turmaNome}
              </span>
              .
            </p>
          </div>
          {alunos.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTrocarOpen(true)}
              aria-label="Trocar de aluno"
              className="shrink-0 border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:border-sidebar-primary"
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Trocar de aluno</span>
            </Button>
          )}
        </div>

        <nav aria-label="Acesso rápido" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-5">
          {acessosRapidos.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-center gap-2 rounded-md px-3 py-2.5 min-h-[44px] text-[14px] font-medium bg-sidebar-accent/60 border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:border-sidebar-primary transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>
        {!algumModuloVisivel && (
          <p className="text-[14px] text-sidebar-foreground/70 mt-4">
            A escola optou por não exibir os módulos do portal. Procure a secretaria para mais informações.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {vis?.frequencia !== false && (
        <StatCard
          icon={CalendarCheck}
          label="Presença Geral"
          value={dados.presencaGeral === null ? '—' : `${dados.presencaGeral}%`}
          variant={dados.presencaGeral === null ? 'default' : dados.presencaGeral >= 75 ? 'success' : 'destructive'}
        />
        )}
        {vis?.boletim !== false && (
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
        )}
        {vis?.frequencia !== false && (
        <StatCard
          icon={CalendarX}
          label="Total de faltas"
          value={dados.totalFaltas}
          variant={dados.totalFaltas > 0 ? 'warning' : 'success'}
        />
        )}
        {vis?.ocorrencias !== false && (
        <StatCard
          icon={Bell}
          label="Total de ocorrências"
          value={dados.totalOcorrencias}
          variant={dados.totalOcorrencias > 0 ? 'warning' : 'success'}
        />
        )}
      </div>

      <InicioCards
        dados={dados}
        responsavelId={sessao.responsavel.id}
        alunoId={aluno.alunoId}
        schoolId={escola?.schoolId}
        modulosVisiveis={escola?.modulosVisiveis}
        periodoCard={periodoCard}
        onPeriodoCardChange={trocarPeriodoCard}
        cardMedias={cardMedias}
        onVerComunicados={() => router.push(`${base}/aluno/comunicados`)}
        onVerBoletim={() => router.push(`${base}/aluno/boletim`)}
        onVerOcorrencias={() => router.push(`${base}/aluno/ocorrencias`)}
      />
      <TrocarAlunoModal open={trocarOpen} onOpenChange={setTrocarOpen} />
    </PageContainer>
  )
}
