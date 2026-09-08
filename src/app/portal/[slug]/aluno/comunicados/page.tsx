'use client'

import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
              <p className="text-[16px] font-semibold text-foreground flex items-center gap-2">
                {!c.lido && <span className="h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Não lido" />}
                <span className="truncate">{c.titulo}</span>
              </p>
              <p className="text-[13px] text-muted-foreground tabular-nums">{formatarData(c.data)}</p>
              <div className="mt-auto pt-2">
                <Button variant="outline" size="sm" onClick={() => abrir(c)}>
                  Ver Comunicado
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!aberto} onOpenChange={v => !v && setAberto(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[20px]">{aberto?.titulo}</DialogTitle>
            <p className="text-[13px] text-muted-foreground tabular-nums">
              {aberto ? formatarData(aberto.data) : ''}
            </p>
          </DialogHeader>
          <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-line">{aberto?.descricao}</p>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
