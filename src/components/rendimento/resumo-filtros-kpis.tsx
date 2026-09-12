'use client'

import { Gauge, TrendingUp, CalendarCheck, AlertTriangle } from 'lucide-react'
import { PageSection } from '@/components/layout/page-section'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { StatCard } from '@/components/ui/stat-card'
import type { PanoramaRendimento } from '@/lib/actions/rendimento'
import { fmtMedia, fmtPct, fmtInt } from './format'

export type AnoOpcao = { id: string; descricao: string; status: string | null }

type Props = {
  isSuperAdmin: boolean
  schools: { id: string; nome_escola: string }[]
  escolaId: string
  onEscolaChange: (v: string) => void
  anos: AnoOpcao[]
  anoId: string
  onAnoChange: (v: string) => void
  periodos: { ordem: number; nome: string }[]
  periodo: number | null
  onPeriodoChange: (v: number | null) => void
  panorama: PanoramaRendimento | null
  loading: boolean
}

export default function ResumoFiltrosKpis({
  isSuperAdmin, schools, escolaId, onEscolaChange,
  anos, anoId, onAnoChange, periodos, periodo, onPeriodoChange,
  panorama, loading,
}: Props) {
  const recorte = (periodo !== null && panorama?.recortes.find(r => r.periodoOrdem === periodo))
    || panorama?.recortes.find(r => r.periodoOrdem !== null)
  const kpis = recorte?.kpis || null
  const riscoQtd = kpis?.pctRisco !== null && kpis?.pctRisco !== undefined && kpis
    ? Math.round((kpis.pctRisco / 100) * kpis.totalAvaliados)
    : null

  return (
    <div className="space-y-4">
      <PageSection variant="compact" title="Filtros">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isSuperAdmin && (
            <div className="space-y-2">
              <Label>Unidade Escolar</Label>
              <Select value={escolaId} onValueChange={onEscolaChange}>
                <SelectTrigger><SelectValue placeholder="Selecione a unidade escolar" /></SelectTrigger>
                <SelectContent>
                  {schools.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Ano Letivo</Label>
            <Select value={anoId} onValueChange={onAnoChange}>
              <SelectTrigger><SelectValue placeholder="Selecione o ano letivo" /></SelectTrigger>
              <SelectContent>
                {anos.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Período de Análise</Label>
            <Select
              value={periodo === null ? '' : String(periodo)}
              onValueChange={(v) => onPeriodoChange(Number(v))}
            >
              <SelectTrigger><SelectValue placeholder="Selecione o período" /></SelectTrigger>
              <SelectContent>
                {periodos.map(p => (
                  <SelectItem key={p.ordem} value={String(p.ordem)}>{p.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[13px] text-muted-foreground">Aplica-se aos Indicadores Gerais.</p>
          </div>
        </div>
      </PageSection>

      {loading && !panorama ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-[16px] font-semibold text-foreground">Indicadores gerais</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-live="polite">
            <StatCard
              icon={Gauge}
              value={fmtMedia(kpis?.mediaGeral)}
              label={`Média geral · ${fmtInt(kpis?.totalAvaliados)} avaliados`}
            />
            <StatCard
              icon={TrendingUp}
              variant="success"
              value={fmtPct(kpis?.pctAcima)}
              label="Alunos acima da média"
            />
            <StatCard
              icon={CalendarCheck}
              value={fmtPct(kpis?.freqMedia)}
              label="Frequência média"
            />
            <StatCard
              icon={AlertTriangle}
              variant="destructive"
              value={fmtPct(kpis?.pctRisco)}
              label={`Alunos em risco · ${riscoQtd !== null ? `${fmtInt(riscoQtd)} de ${fmtInt(kpis?.totalAvaliados)}` : '—'}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}
