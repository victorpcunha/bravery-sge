'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { StatCard } from '@/components/ui/stat-card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ModernTabs } from '@/components/ui/modern-tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CalendarCheck, CalendarX, AlertTriangle } from 'lucide-react'
import { usePortal } from '@/components/portal/portal-provider'
import { getFrequenciaPortal, type FrequenciaPortal } from '@/lib/actions/portal'

function TabelaDisciplinas({ dados }: { dados: FrequenciaPortal }) {
  if (dados.porDisciplina.length === 0) {
    return <p className="text-[14px] text-muted-foreground">Nenhuma aula registrada.</p>
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-muted z-10">Disciplina</TableHead>
            <TableHead className="text-center">Total de Aulas</TableHead>
            <TableHead className="text-center">Faltas</TableHead>
            <TableHead>Presença</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.porDisciplina.map(r => (
            <TableRow key={r.disciplina}>
              <TableCell className="sticky left-0 bg-background z-10 font-medium text-foreground">{r.disciplina}</TableCell>
              <TableCell className="text-center tabular-nums">{r.aulas}</TableCell>
              <TableCell className="text-center tabular-nums">{r.faltas}</TableCell>
              <TableCell className="min-w-[160px]">
                <div className="flex items-center gap-2">
                  <Progress value={r.percentual ?? 0} className="flex-1" />
                  <span className="text-[13px] tabular-nums text-muted-foreground w-12 text-right">
                    {r.percentual === null ? '—' : `${r.percentual}%`}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function PortalFrequenciaPage() {
  const { sessao, aluno, escola } = usePortal()
  const [geral, setGeral] = useState<FrequenciaPortal | null>(null)
  const [bimestre, setBimestre] = useState<FrequenciaPortal | null>(null)
  const [abaBimestre, setAbaBimestre] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessao || !aluno) return
    setLoading(true)
    getFrequenciaPortal(sessao.responsavel.id, aluno.alunoId, undefined, escola?.schoolId)
      .then(d => {
        setGeral(d)
        if (!abaBimestre && d.periodos.length > 0) setAbaBimestre(String(d.periodos[0].ordem))
      })
      .catch(() => setGeral(null))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessao?.responsavel.id, aluno?.alunoId])

  useEffect(() => {
    if (!sessao || !aluno || !abaBimestre) return
    getFrequenciaPortal(sessao.responsavel.id, aluno.alunoId, Number(abaBimestre), escola?.schoolId)
      .then(setBimestre)
      .catch(() => setBimestre(null))
  }, [sessao?.responsavel.id, aluno?.alunoId, abaBimestre, escola?.schoolId])

  if (!aluno) return null

  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        title="Frequência"
        description={`${aluno.nome} · ${aluno.turmaNome}`}
        icon={CalendarDays}
      />

      {loading && !geral ? (
        <div className="rounded-xl border border-border bg-card shadow-xs p-6 space-y-3">
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
        </div>
      ) : !geral ? (
        <p className="text-[14px] text-muted-foreground">Não foi possível carregar a frequência.</p>
      ) : (
        <ModernTabs
          tabs={[
            { value: 'geral', label: 'Geral' },
            { value: 'disciplinas', label: 'Por Disciplina' },
            { value: 'bimestre', label: 'Por Bimestre' },
          ]}
          defaultValue="geral"
          urlSync={false}
          scroll
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={CalendarCheck}
                label="Percentual de Presença"
                value={geral.geral.percentual === null ? '—' : `${geral.geral.percentual}%`}
                variant={geral.geral.percentual === null ? 'default' : geral.geral.percentual >= geral.frequenciaMinima ? 'success' : 'destructive'}
              />
              <StatCard icon={CalendarDays} label="Total de aulas registradas" value={geral.geral.aulas} />
              <StatCard
                icon={CalendarX}
                label="Total de faltas registradas"
                value={geral.geral.faltas}
                variant={geral.geral.faltas > 0 ? 'warning' : 'success'}
              />
              <StatCard
                icon={AlertTriangle}
                label={`Limite de faltas (mín. ${geral.frequenciaMinima}%)`}
                value={geral.limiteFaltas}
                variant={geral.geral.faltas > geral.limiteFaltas ? 'destructive' : 'default'}
              />
            </div>

            <PageSection
              title="Por Disciplina Geral"
              description={geral.criterio === 'por_dia' ? 'Turma com frequência por dia — valores totais.' : undefined}
              variant="flush"
            >
              <TabelaDisciplinas dados={geral} />
            </PageSection>

            <PageSection
              title="Por Disciplina no Bimestre"
              variant="flush"
              actions={
                <Select value={abaBimestre} onValueChange={setAbaBimestre}>
                  <SelectTrigger className="w-[160px]" aria-label="Selecionar bimestre">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {geral.periodos.map(p => (
                      <SelectItem key={p.ordem} value={String(p.ordem)}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            >
              {!bimestre ? (
                <p className="text-[14px] text-muted-foreground p-4">Carregando...</p>
              ) : (
                <TabelaDisciplinas dados={bimestre} />
              )}
            </PageSection>
        </ModernTabs>
      )}
    </PageContainer>
  )
}
