'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type FiltroPeriodo = 'hoje' | 'semana' | 'mes'

type Props = {
  mes: string
  onMesChange: (mes: string) => void
  filtro: FiltroPeriodo
  onFiltroChange: (filtro: FiltroPeriodo) => void
}

const meses = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

const filtros: { value: FiltroPeriodo; label: string }[] = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
]

export function AgendaFiltros({ mes, onMesChange, filtro, onFiltroChange }: Props) {
  return (
    <div className="space-y-3">
      <Select value={mes} onValueChange={onMesChange}>
        <SelectTrigger aria-label="Selecione um mês">
          <SelectValue placeholder="Selecione um mês" />
        </SelectTrigger>
        <SelectContent>
          {meses.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {mes && (
        <div className="flex gap-1 rounded-md bg-card border border-border shadow-xs p-1">
          {filtros.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onFiltroChange(f.value)}
              className={cn(
                'flex-1 rounded-sm px-3 py-1.5 text-[13px] font-medium transition-colors',
                filtro === f.value
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-foreground/80 hover:bg-accent/10'
              )}
              aria-pressed={filtro === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
