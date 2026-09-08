'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Info } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { ModernTabs } from '@/components/ui/modern-tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePortal } from '@/components/portal/portal-provider'
import { getBoletimPortal, type BoletimPortal } from '@/lib/actions/portal'

function formatarNota(v: number | null) {
  return v === null ? '—' : v.toFixed(2).replace('.', ',')
}

function classeNota(v: number | null, minima: number) {
  if (v === null) return 'text-muted-foreground'
  return v >= minima ? 'text-success' : 'text-destructive'
}

export default function PortalBoletimPage() {
  const { sessao, aluno, escola } = usePortal()
  const [dados, setDados] = useState<BoletimPortal | null>(null)
  const [aba, setAba] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessao || !aluno) return
    setLoading(true)
    getBoletimPortal(sessao.responsavel.id, aluno.alunoId, aba ? Number(aba) : undefined, escola?.schoolId)
      .then(d => {
        setDados(d)
        if (!aba && d.periodos.length > 0) setAba(String(d.periodos[0].ordem))
      })
      .catch(() => setDados(null))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessao?.responsavel.id, aluno?.alunoId, aba])

  if (!aluno) return null

  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        title="Boletim"
        description={`${aluno.nome} · ${aluno.turmaNome}`}
        icon={BookOpen}
      />

      {loading && !dados ? (
        <div className="rounded-xl border border-border bg-card shadow-xs p-6 space-y-3">
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 bg-muted rounded-lg animate-pulse" />
        </div>
      ) : !dados || dados.bloqueado ? (
        <div className="rounded-xl border border-border bg-card shadow-xs">
          <EmptyState
            icon={BookOpen}
            title="Boletim indisponível"
            description={dados?.motivo || 'Não foi possível carregar o boletim.'}
          />
        </div>
      ) : (
        <>
          <p className="text-[14px] text-muted-foreground mb-4">
            Média mínima para aprovação: <span className="font-bold text-foreground tabular-nums">{dados.mediaMinima.toFixed(2).replace('.', ',')}</span>
            {dados.metodoNome ? ` · ${dados.metodoNome}` : ''}
          </p>
          <ModernTabs
            tabs={dados.periodos.map(p => ({ value: String(p.ordem), label: p.nome }))}
            defaultValue={aba}
            urlSync={false}
            onValueChange={setAba}
            scroll
          >
            {dados.periodos.map(p => (
              <PageSection key={p.ordem} title={p.nome} variant="flush">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="sticky left-0 bg-primary/10 z-10 text-[13px] font-semibold uppercase tracking-wider text-primary">Disciplina</TableHead>
                        {dados.avaliacoes.map(a => (
                          <TableHead key={a} className="bg-primary/10 text-center text-[13px] font-semibold uppercase tracking-wider text-primary">{a}</TableHead>
                        ))}
                        <TableHead className="bg-primary/10 text-center text-[13px] font-semibold uppercase tracking-wider text-primary">Média</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dados.linhas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={dados.avaliacoes.length + 2} className="text-center text-muted-foreground">
                            Nenhuma disciplina encontrada.
                          </TableCell>
                        </TableRow>
                      ) : (
                        dados.linhas.map((l, idx) => (
                          <TableRow key={l.disciplina} className={idx % 2 === 0 ? 'bg-card' : 'bg-primary/10 hover:bg-primary/10'}>
                            <TableCell className={`sticky left-0 z-10 font-medium text-foreground ${idx % 2 === 0 ? 'bg-card' : 'bg-primary/10'}`}>
                              {l.disciplina}
                            </TableCell>
                            {l.notas.map((n, i) => (
                              <TableCell key={i} className={`text-center font-semibold tabular-nums ${classeNota(n, dados.mediaMinima)}`}>
                                {formatarNota(n)}
                              </TableCell>
                            ))}
                              <TableCell className={`text-center font-bold tabular-nums ${classeNota(l.media, dados.mediaMinima)}`}>
                                <span className="inline-flex items-center justify-center gap-1.5">
                                  {formatarNota(l.media)}
                                  {l.temRecuperacao && l.media !== null && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="inline-flex cursor-help text-muted-foreground hover:text-foreground">
                                          <Info className="h-3.5 w-3.5" />
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Média calculada com nota de recuperação
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </span>
                              </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </PageSection>
            ))}
          </ModernTabs>
        </>
      )}
    </PageContainer>
  )
}
