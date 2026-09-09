'use client'

import { useEffect, useState } from 'react'
import { Bell, ThumbsDown, ThumbsUp } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ModernTabs } from '@/components/ui/modern-tabs'
import { Button } from '@/components/ui/button'
import { OcorrenciaModal } from '@/components/portal/ocorrencia-modal'
import { usePortal } from '@/components/portal/portal-provider'
import { getOcorrenciasPortal, marcarOcorrenciaLida, type OcorrenciaResumo } from '@/lib/actions/portal'

type Filtro = 'todas' | 'positiva' | 'negativa'

function formatarData(iso: string) {
  const [a, m, d] = iso.split('-')
  return d && m && a ? `${d}/${m}/${a}` : iso
}

export default function PortalOcorrenciasPage() {
  const { sessao, aluno, escola } = usePortal()
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [lista, setLista] = useState<OcorrenciaResumo[]>([])
  const [aberta, setAberta] = useState<OcorrenciaResumo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessao || !aluno) return
    setLoading(true)
    getOcorrenciasPortal(sessao.responsavel.id, aluno.alunoId, filtro, escola?.schoolId)
      .then(setLista)
      .catch(() => setLista([]))
      .finally(() => setLoading(false))
  }, [sessao?.responsavel.id, aluno?.alunoId, filtro, escola?.schoolId])

  async function abrir(o: OcorrenciaResumo) {
    setAberta(o)
    if (!o.lido && sessao && aluno) {
      try {
        await marcarOcorrenciaLida(sessao.responsavel.id, aluno.alunoId, o.id, escola?.schoolId)
        setLista(prev => prev.map(item => (item.id === o.id ? { ...item, lido: true } : item)))
      } catch { /* mantém sinalização; best-effort */ }
    }
  }

  if (!aluno) return null

  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        title="Ocorrências"
        description={`${aluno.nome} · ${aluno.turmaNome}`}
        icon={Bell}
      />

      <ModernTabs
        tabs={[
          { value: 'todas', label: 'Todas' },
          { value: 'positiva', label: 'Positivas' },
          { value: 'negativa', label: 'Negativas' },
        ]}
        defaultValue={filtro}
        urlSync={false}
        onValueChange={v => setFiltro(v as Filtro)}
        scroll
      >
        {[0, 1, 2].map(i => (
          <div key={i}>
            {loading ? (
              <div className="rounded-xl border border-border bg-card shadow-xs p-6 space-y-3">
                <div className="h-16 bg-muted rounded-lg animate-pulse" />
                <div className="h-16 bg-muted rounded-lg animate-pulse" />
              </div>
            ) : lista.length === 0 ? (
              <div className="rounded-xl border border-border bg-card shadow-xs">
                <EmptyState
                  icon={Bell}
                  title="Nenhuma ocorrência"
                  description="Não há ocorrências registradas para este filtro."
                />
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lista.map(o => (
                  <li key={o.id} className="rounded-xl border border-border bg-card shadow-xs p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[16px] font-semibold text-primary flex items-center gap-2 min-w-0">
                        {o.natureza === 'positiva' ? (
                          <ThumbsUp className="h-4 w-4 text-success shrink-0" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 text-destructive shrink-0" />
                        )}
                        <span className="truncate">{o.titulo}</span>
                      </p>
                      <StatusBadge status={o.lido ? 'muted' : 'primary'}>
                        {o.lido ? 'Lido' : 'Não lido'}
                      </StatusBadge>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={o.natureza === 'positiva' ? 'success' : 'destructive'}>
                        {o.natureza === 'positiva' ? 'Positiva' : 'Negativa'}
                      </StatusBadge>
                      <span className="text-[13px] text-muted-foreground tabular-nums">{formatarData(o.data)}</span>
                    </div>
                    <p className="text-[14px] text-muted-foreground line-clamp-2">{o.descricao}</p>
                    <div className="mt-auto pt-2">
                      <Button variant="outline" size="sm" onClick={() => abrir(o)}>
                        Ver Ocorrência
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ModernTabs>

      <OcorrenciaModal ocorrencia={aberta} open={!!aberta} onOpenChange={v => !v && setAberta(null)} />
    </PageContainer>
  )
}
