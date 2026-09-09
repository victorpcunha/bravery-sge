'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, FilterX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterBar } from '@/components/layout/filter-bar'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { cn } from '@/lib/utils'
import { ProfissionaisSelectField } from './profissionais-select-field'
import { AlunosSelectField } from './alunos-select-field'
import type { TipoOcorrencia } from '@/lib/actions/ocorrencias'

export type TipoFiltro = 'todas' | TipoOcorrencia

type OcorrenciaFiltrosProps = {
  dataInicial: string
  dataFinal: string
  onDataInicial: (v: string) => void
  onDataFinal: (v: string) => void
  profissionalIds: string[]
  onProfissionaisChange: (ids: string[]) => void
  alunoIds: string[]
  onAlunosChange: (ids: string[]) => void
  tipo: TipoFiltro
  onTipoChange: (t: TipoFiltro) => void
  temFiltros: boolean
  onLimpar: () => void
  schoolId: string | null
  pessoaId?: string | null
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
  placeholder,
}: {
  label: string
  valor: string
  onChange: (v: string) => void
  desabilitado?: boolean
  placeholder: string
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
            {selecionada ? format(selecionada, 'dd/MM/yyyy') : placeholder}
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

const TIPOS: Array<{ valor: TipoFiltro; label: string }> = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'positiva', label: 'Positivas' },
  { valor: 'negativa', label: 'Negativas' },
]

export function OcorrenciaFiltros({
  dataInicial,
  dataFinal,
  onDataInicial,
  onDataFinal,
  profissionalIds,
  onProfissionaisChange,
  alunoIds,
  onAlunosChange,
  tipo,
  onTipoChange,
  temFiltros,
  onLimpar,
  schoolId,
  pessoaId,
  mostrarEscola,
  escolas,
  escolaId,
  onEscolaChange,
}: OcorrenciaFiltrosProps) {
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

      <FiltroData label="Data inicial" valor={dataInicial} onChange={onDataInicial} placeholder="Todas" />
      <FiltroData label="Data final" valor={dataFinal} onChange={onDataFinal} placeholder="Todas" />

      <div className="space-y-1.5 min-w-[220px]">
        <ProfissionaisSelectField
          label="Profissional"
          labelClassName="text-[12px] text-muted-foreground"
          schoolId={schoolId}
          values={profissionalIds}
          onChange={onProfissionaisChange}
          pessoaId={pessoaId}
          multiple={false}
        />
      </div>

      <div className="space-y-1.5 min-w-[220px]">
        <AlunosSelectField
          label="Aluno"
          labelClassName="text-[12px] text-muted-foreground"
          schoolId={schoolId}
          values={alunoIds}
          onChange={onAlunosChange}
          multiple={false}
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-[12px] font-medium text-muted-foreground">Tipo de ocorrência</p>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map(t => (
            <ClickablePill
              key={t.valor}
              label={t.label}
              active={tipo === t.valor}
              onClick={() => onTipoChange(t.valor)}
            />
          ))}
        </div>
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
