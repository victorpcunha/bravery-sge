'use client'

import { type PlanoAula } from '@/lib/actions/plano-ensino'
import { StatusBadge } from '@/components/feedback/status-badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  GraduationCap,
  ListChecks,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type BnccItem = {
  tipo: string
  id: string
  codigo?: string
  nome?: string
  descricao?: string
}

const BNCC_TIPO_LABELS: Record<string, string> = {
  campo_experiencia: 'Campos de Experiência',
  objetivo: 'Objetivos de Aprendizagem',
  unidade_tematica: 'Unidades Temáticas',
  objeto_conhecimento: 'Objetos de Conhecimento',
  habilidade: 'Habilidades',
  area_conhecimento: 'Áreas de Conhecimento',
  competencia: 'Competências Específicas',
  habilidade_medio: 'Habilidades',
}

const BNCC_TIPO_ORDER = [
  'campo_experiencia',
  'objetivo',
  'unidade_tematica',
  'objeto_conhecimento',
  'habilidade',
  'area_conhecimento',
  'competencia',
  'habilidade_medio',
]

function agruparBnccPorTipo(bncc: BnccItem[] | undefined) {
  const grupos: { tipo: string; label: string; itens: BnccItem[] }[] = []
  for (const item of bncc || []) {
    const label = BNCC_TIPO_LABELS[item.tipo] || item.tipo || 'BNCC'
    let grupo = grupos.find(g => g.tipo === item.tipo)
    if (!grupo) {
      grupo = { tipo: item.tipo, label, itens: [] }
      grupos.push(grupo)
    }
    grupo.itens.push(item)
  }
  return grupos.sort((a, b) => BNCC_TIPO_ORDER.indexOf(a.tipo) - BNCC_TIPO_ORDER.indexOf(b.tipo))
}

function formatarPeriodos(periodos: number[] | undefined): string {
  if (!periodos || periodos.length === 0) return ''
  const itens = [...periodos].sort((a, b) => a - b).map(p => `${p}º`)
  if (itens.length === 1) return `${itens[0]} Período`
  const ultimo = itens.pop()
  return `${itens.join(', ')} e ${ultimo} Período`
}

function formatarDataBR(data: string | null | undefined): string {
  if (!data) return ''
  const d = new Date(data + 'T12:00:00')
  if (isNaN(d.getTime())) return data
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function CampoDetalhe({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="h-3.5 w-1 shrink-0 rounded-full bg-primary" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground">{label}</h3>
      </div>
      <div className="rounded-md border border-border bg-muted/30 px-3 py-2.5">{children}</div>
    </div>
  )
}

function GrupoDetalhe({ icon: Icon, titulo, children }: { icon: LucideIcon; titulo: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-foreground">{titulo}</h3>
      </div>
      <div className="space-y-4 px-4 py-4">{children}</div>
    </section>
  )
}

type PlanoAulaDetalheDialogProps = {
  plano: PlanoAula | null
  onOpenChange: (open: boolean) => void
  footerAction?: React.ReactNode
}

export function PlanoAulaDetalheDialog({
  plano,
  onOpenChange,
  footerAction,
}: PlanoAulaDetalheDialogProps) {
  const bnccGrupos = agruparBnccPorTipo((plano?.bncc_fields as BnccItem[] | undefined))

  return (
    <Dialog open={!!plano} onOpenChange={v => { if (!v) onOpenChange(false) }}>
      {plano && (
        <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 p-0">
          <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <DialogTitle className="text-[16px] font-semibold">Detalhes do Plano de Aula</DialogTitle>
            </div>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Revise as informações do plano antes de aplicar ao dia.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <GrupoDetalhe icon={BookOpen} titulo="Informações Principais">
                <CampoDetalhe label="Tema">
                  <p className="text-[16px] font-semibold text-foreground">{plano.tema}</p>
                </CampoDetalhe>

                {plano.periodos && plano.periodos.length > 0 && (
                  <CampoDetalhe label="Período">
                    <div className="flex flex-wrap gap-1.5">
                      {plano.periodos.map(per => (
                        <StatusBadge key={per} status="info">{per}º Período</StatusBadge>
                      ))}
                    </div>
                  </CampoDetalhe>
                )}

                {plano.conteudo && (
                  <CampoDetalhe label="Conteúdo">
                    <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                      {plano.conteudo}
                    </p>
                  </CampoDetalhe>
                )}

                {(plano.data_inicio || plano.data_fim) && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {plano.data_inicio && (
                      <CampoDetalhe label="Data início">
                        <p className="text-[14px] font-medium text-foreground tabular-nums">
                          {formatarDataBR(plano.data_inicio)}
                        </p>
                      </CampoDetalhe>
                    )}
                    {plano.data_fim && (
                      <CampoDetalhe label="Data fim">
                        <p className="text-[14px] font-medium text-foreground tabular-nums">
                          {formatarDataBR(plano.data_fim)}
                        </p>
                      </CampoDetalhe>
                    )}
                  </div>
                )}
              </GrupoDetalhe>

              {bnccGrupos.length > 0 && (
                <GrupoDetalhe icon={GraduationCap} titulo="Estrutura BNCC">
                  <div className="space-y-3">
                    {bnccGrupos.map(grupo => (
                      <div key={grupo.tipo}>
                        <p className="mb-1 text-[13px] font-medium text-foreground">{grupo.label}</p>
                        <ul className="space-y-1.5">
                          {grupo.itens.map((item, idx) => (
                            <li key={idx} className="rounded-md border border-border bg-muted/40 px-2.5 py-1.5">
                              <span className="font-mono text-[12px] font-semibold text-primary">
                                {item.codigo || item.nome || item.tipo}
                              </span>
                              {item.descricao && (
                                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{item.descricao}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </GrupoDetalhe>
              )}

              {(plano.recursos_didaticos || plano.metodologia || plano.avaliacao || plano.referencias) && (
                <GrupoDetalhe icon={ListChecks} titulo="Outras Informações">
                  {plano.recursos_didaticos && (
                    <CampoDetalhe label="Recursos Didáticos">
                      <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                        {plano.recursos_didaticos}
                      </p>
                    </CampoDetalhe>
                  )}
                  {plano.metodologia && (
                    <CampoDetalhe label="Metodologia">
                      <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                        {plano.metodologia}
                      </p>
                    </CampoDetalhe>
                  )}
                  {plano.avaliacao && (
                    <CampoDetalhe label="Avaliação">
                      <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                        {plano.avaliacao}
                      </p>
                    </CampoDetalhe>
                  )}
                  {plano.referencias && (
                    <CampoDetalhe label="Referências">
                      <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                        {plano.referencias}
                      </p>
                    </CampoDetalhe>
                  )}
                </GrupoDetalhe>
              )}
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t border-border bg-muted/30 px-6 py-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Sair
            </Button>
            {footerAction}
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
