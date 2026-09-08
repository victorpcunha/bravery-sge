'use client'

import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ComunicadoModal } from '@/components/portal/comunicado-modal'
import { usePortal } from '@/components/portal/portal-provider'
import { getComunicadosPortal, marcarComunicadoLido, type ComunicadoResumo } from '@/lib/actions/portal'

function formatarData(iso: string) {
  const [a, m, d] = iso.split('-')
  return d && m && a ? `${d}/${m}/${a}` : iso
}

export default function PortalComunicadosPage() {
  const { sessao, aluno, escola } = usePortal()
  const [lista, setLista] = useState<ComunicadoResumo[]>([])
  const [aberto, setAberto] = useState<ComunicadoResumo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessao || !aluno) return
    setLoading(true)
    getComunicadosPortal(sessao.responsavel.id, aluno.alunoId, escola?.schoolId)
      .then(setLista)
      .catch(() => setLista([]))
      .finally(() => setLoading(false))
  }, [sessao?.responsavel.id, aluno?.alunoId, escola?.schoolId])

  async function abrir(c: ComunicadoResumo) {
    setAberto(c)
    if (!c.lido && sessao && aluno) {
      try {
        await marcarComunicadoLido(sessao.responsavel.id, aluno.alunoId, c.id, escola?.schoolId)
        setLista(prev => prev.map(item => (item.id === c.id ? { ...item, lido: true } : item)))
      } catch { /* mantém sinalização; best-effort */ }
    }
  }

  if (!aluno) return null

  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        title="Comunicados"
        description={`${aluno.nome} · ${aluno.turmaNome}`}
        icon={Megaphone}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-xl border border-border bg-card shadow-xs p-4 space-y-3">
              <div className="h-5 bg-muted rounded-lg animate-pulse" />
              <div className="h-10 bg-muted rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      ) : lista.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-xs">
          <EmptyState
            icon={Megaphone}
            title="Nenhum comunicado"
            description="Não há comunicados da escola no momento."
          />
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lista.map(c => (
            <li key={c.id} className="rounded-xl border border-border bg-card shadow-xs p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[16px] font-semibold text-primary flex items-center gap-2 min-w-0">
                  <Megaphone className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate">{c.titulo}</span>
                </p>
                <StatusBadge status={c.lido ? 'muted' : 'primary'}>
                  {c.lido ? 'Lido' : 'Não lido'}
                </StatusBadge>
              </div>
              <p className="text-[13px] text-muted-foreground tabular-nums">{formatarData(c.data)}</p>
              <p className="text-[14px] text-muted-foreground line-clamp-2">{c.descricao}</p>
              <div className="mt-auto pt-2">
                <Button variant="outline" size="sm" onClick={() => abrir(c)}>
                  Ver Comunicado
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ComunicadoModal comunicado={aberto} open={!!aberto} onOpenChange={v => !v && setAberto(null)} />
    </PageContainer>
  )
}
