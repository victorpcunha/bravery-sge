'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, FilterX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterBar } from '@/components/layout/filter-bar'
import { cn } from '@/lib/utils'

export type OpcaoFiltro = {
  id: string
  nome: string
}

type ComunicadoFiltrosProps = {
  anos: Array<{ id: string; descricao: string }>
  anoLetivoId: string
  onAnoChange: (id: string) => void
  dataEnvio: string
  dataFinal: string
  onDataEnvio: (v: string) => void
  onDataFinal: (v: string) => void
  etapas: OpcaoFiltro[]
  etapaId: string
  onEtapaChange: (v: string) => void
  turmas: OpcaoFiltro[]
  turmaId: string
  onTurmaChange: (v: string) => void
  temFiltros: boolean
  onLimpar: () => void
  desabilitado?: boolean
  mostrarEscola?: boolean
  escolas?: Array<{ id: string; nome: string }>
  escolaId?: string | null
  onEscolaChange?: (id: string | null) => void
}

function parseDataLocal(iso: string): Date | undefined {
  if (!iso) return undefined
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return undefined
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

function formatarISO(d: Date | undefined): string {
  if (!d) return ''
  return format(d, 'yyyy-MM-dd')
}

function FiltroData({
  label,
  valor,
  onChange,
  desabilitado,
}: {
  label: string
  valor: string
  onChange: (v: string) => void
  desabilitado?: boolean
}) {
  const selecionada = parseDataLocal(valor)
  return (
    <div className="space-y-1.5">
      <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={desabilitado}
            className={cn(
              'h-9 w-auto min-w-[170px] justify-start text-left font-normal',
              !selecionada && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {selecionada ? format(selecionada, 'dd/MM/yyyy') : 'Todas'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selecionada}
            onSelect={(d) => onChange(formatarISO(d))}
            captionLayout="dropdown"
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function ComunicadoFiltros({
  anos,
  anoLetivoId,
  onAnoChange,
  dataEnvio,
  dataFinal,
  onDataEnvio,
  onDataFinal,
  etapas,
  etapaId,
  onEtapaChange,
  turmas,
  turmaId,
  onTurmaChange,
  temFiltros,
  onLimpar,
  desabilitado,
  mostrarEscola,
  escolas,
  escolaId,
  onEscolaChange,
}: ComunicadoFiltrosProps) {
  return (
    <FilterBar>
      {mostrarEscola && escolas && onEscolaChange && (
        <div className="space-y-1.5">
          <p className="text-[12px] font-medium text-muted-foreground">Unidade Escolar</p>
          <Select
            value={escolaId ?? '__none__'}
            onValueChange={(v) => onEscolaChange(v === '__none__' ? null : v)}
          >
            <SelectTrigger className="w-auto min-w-[200px] h-9">
              <SelectValue placeholder="Selecione uma escola" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" disabled>Selecione uma escola</SelectItem>
              {escolas.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <p className="text-[12px] font-medium text-muted-foreground">Ano Letivo</p>
        <Select value={anoLetivoId} onValueChange={onAnoChange} disabled={desabilitado}>
          <SelectTrigger className="w-auto min-w-[160px] h-9">
            <SelectValue placeholder="Ano letivo" />
          </SelectTrigger>
          <SelectContent>
            {anos.map(a => (
              <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FiltroData label="Data de envio" valor={dataEnvio} onChange={onDataEnvio} desabilitado={desabilitado} />
      <FiltroData label="Data final" valor={dataFinal} onChange={onDataFinal} desabilitado={desabilitado} />

      <div className="space-y-1.5">
        <p className="text-[12px] font-medium text-muted-foreground">Etapa de Ensino</p>
        <Select value={etapaId} onValueChange={onEtapaChange} disabled={desabilitado}>
          <SelectTrigger className="w-auto min-w-[200px] h-9">
            <SelectValue placeholder="Todas as etapas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas as etapas</SelectItem>
            {etapas.map(e => (
              <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <p className="text-[12px] font-medium text-muted-foreground">Turma</p>
        <Select value={turmaId} onValueChange={onTurmaChange} disabled={desabilitado}>
          <SelectTrigger className="w-auto min-w-[180px] h-9">
            <SelectValue placeholder="Todas as turmas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas as turmas</SelectItem>
            {turmas.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {temFiltros && (
        <div className="space-y-1.5">
          <p className="text-[12px] font-medium text-transparent select-none" aria-hidden="true">·</p>
          <Button variant="outline" size="sm" onClick={onLimpar} className="h-9">
            <FilterX className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      )}
    </FilterBar>
  )
}
