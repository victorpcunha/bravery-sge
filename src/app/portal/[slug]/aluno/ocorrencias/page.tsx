'use client'

import { useEffect, useState } from 'react'
import { Bell, ThumbsDown, ThumbsUp } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ModernTabs } from '@/components/ui/modern-tabs'
import { usePortal } from '@/components/portal/portal-provider'
import { getOcorrenciasPortal, type OcorrenciaResumo } from '@/lib/actions/portal'

type Filtro = 'todas' | 'positiva' | 'negativa'

function formatarData(iso: string) {
  const [a, m, d] = iso.split('-')
  return d && m && a ? `${d}/${m}/${a}` : iso
}

export default function PortalOcorrenciasPage() {
  const { sessao, aluno, escola } = usePortal()
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [lista, setLista] = useState<OcorrenciaResumo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessao || !aluno) return
    setLoading(true)
    getOcorrenciasPortal(sessao.responsavel.id, aluno.alunoId, filtro, escola?.schoolId)
      .then(setLista)
      .catch(() => setLista([]))
      .finally(() => setLoading(false))
  }, [sessao?.responsavel.id, aluno?.alunoId, filtro, escola?.schoolId])

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
              <ul className="space-y-3">
                {lista.map(o => (
                  <li key={o.id} className="rounded-xl border border-border bg-card shadow-xs p-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="flex items-center gap-2 min-w-0">
                        {o.natureza === 'positiva' ? (
                          <ThumbsUp className="h-4 w-4 text-success shrink-0" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 text-destructive shrink-0" />
                        )}
                        <span className="text-[16px] font-semibold text-foreground truncate">{o.titulo}</span>
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={o.natureza === 'positiva' ? 'success' : 'destructive'}>
                          {o.natureza === 'positiva' ? 'Positiva' : 'Negativa'}
                        </StatusBadge>
                        <span className="text-[13px] text-muted-foreground tabular-nums">{formatarData(o.data)}</span>
                      </span>
                    </div>
                    <p className="text-[15px] text-muted-foreground mt-2">{o.descricao}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ModernTabs>
    </PageContainer>
  )
}
