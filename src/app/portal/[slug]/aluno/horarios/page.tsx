'use client'

import { useEffect, useMemo, useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { ModernTabs } from '@/components/ui/modern-tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePortal } from '@/components/portal/portal-provider'
import { getHorariosPortal, type HorarioPortal } from '@/lib/actions/portal'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

function CelulaAula({ aula }: { aula: HorarioPortal | undefined }) {
  if (!aula) return <span className="text-muted-foreground">—</span>
  if (aula.intervalo) {
    return <span className="text-[14px] text-muted-foreground">Intervalo</span>
  }
  return (
    <div className="text-left">
      <p className="text-[14px] font-semibold text-foreground">{aula.disciplina}</p>
      {aula.professor && (
        <p className="text-[13px] text-muted-foreground">{aula.professor}</p>
      )}
    </div>
  )
}

function ListaDia({ aulas }: { aulas: HorarioPortal[] }) {
  return (
    <ul className="space-y-3">
      {aulas.map((h, i) => (
        <li key={i} className="rounded-xl border border-border bg-card shadow-xs p-4">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-primary tabular-nums">
            {h.inicio} – {h.fim}
          </p>
          <div className="mt-1">
            <CelulaAula aula={h} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function PortalHorariosPage() {
  const { sessao, aluno, escola } = usePortal()
  const [turma, setTurma] = useState('')
  const [horarios, setHorarios] = useState<HorarioPortal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessao || !aluno) return
    setLoading(true)
    getHorariosPortal(sessao.responsavel.id, aluno.alunoId, escola?.schoolId)
      .then(d => {
        setTurma(d.turma)
        setHorarios(d.horarios)
      })
      .catch(() => setHorarios([]))
      .finally(() => setLoading(false))
  }, [sessao?.responsavel.id, aluno?.alunoId, escola?.schoolId])

  const dias = useMemo(
    () => [...new Set(horarios.map(h => h.dia_semana))].sort((a, b) => a - b),
    [horarios]
  )
  const faixas = useMemo(() => {
    const mapa = new Map<string, { inicio: string; fim: string }>()
    for (const h of horarios) {
      const chave = `${h.inicio}-${h.fim}`
      if (!mapa.has(chave)) mapa.set(chave, { inicio: h.inicio, fim: h.fim })
    }
    return [...mapa.values()].sort((a, b) =>
      a.inicio.localeCompare(b.inicio) || a.fim.localeCompare(b.fim)
    )
  }, [horarios])

  const porDia = useMemo(() => {
    const mapa = new Map<number, HorarioPortal[]>()
    for (const dia of dias) {
      mapa.set(
        dia,
        horarios
          .filter(h => h.dia_semana === dia)
          .sort((a, b) => a.inicio.localeCompare(b.inicio) || a.fim.localeCompare(b.fim))
      )
    }
    return mapa
  }, [horarios, dias])

  const aulaEm = (dia: number, inicio: string, fim: string) =>
    horarios.find(h => h.dia_semana === dia && h.inicio === inicio && h.fim === fim)

  if (!aluno) return null

  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        title="Horários"
        description={`${aluno.nome} · Turma ${turma}`}
        icon={GraduationCap}
      />

      {loading ? (
        <div className="rounded-xl border border-border bg-card shadow-xs p-6 space-y-3">
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
        </div>
      ) : horarios.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-xs">
          <EmptyState
            icon={GraduationCap}
            title="Sem quadro de aulas"
            description="A turma ainda não possui quadro de aulas cadastrado."
          />
        </div>
      ) : (
        <>
          {/* Desktop: grid único (horário × dias) */}
          <PageSection title="Quadro de aulas" variant="flush" className="hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="sticky left-0 bg-primary/10 z-10 text-[13px] font-semibold uppercase tracking-wider text-primary">Horário</TableHead>
                    {dias.map(dia => (
                      <TableHead key={dia} className="bg-primary/10 text-center text-[13px] font-semibold uppercase tracking-wider text-primary">
                        {DIAS[dia] ?? `Dia ${dia}`}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faixas.map((f, idx) => (
                    <TableRow key={`${f.inicio}-${f.fim}`} className={idx % 2 === 0 ? 'bg-card' : 'bg-primary/10 hover:bg-primary/10'}>
                      <TableCell className={`sticky left-0 z-10 font-mono text-[13px] tabular-nums text-muted-foreground whitespace-nowrap ${idx % 2 === 0 ? 'bg-card' : 'bg-primary/10'}`}>
                        {f.inicio} – {f.fim}
                      </TableCell>
                      {dias.map(dia => (
                        <TableCell key={dia} className="min-w-[160px]">
                          <CelulaAula aula={aulaEm(dia, f.inicio, f.fim)} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PageSection>

          {/* Mobile: uma aba por dia */}
          <div className="md:hidden">
            <ModernTabs
              tabs={dias.map(dia => ({ value: String(dia), label: DIAS[dia] ?? `Dia ${dia}` }))}
              defaultValue={dias.length > 0 ? String(dias[0]) : ''}
              urlSync={false}
              scroll
            >
              {dias.map(dia => (
                <ListaDia key={dia} aulas={porDia.get(dia) || []} />
              ))}
            </ModernTabs>
          </div>
        </>
      )}
    </PageContainer>
  )
}
