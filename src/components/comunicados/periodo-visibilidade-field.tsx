'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TimePicker } from '@/components/ui/time-picker'
import { cn } from '@/lib/utils'

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

export function combinarDataHora(dataISO: string, hora: string): string {
  return `${dataISO}T${hora || '00:00'}:00`
}

type PeriodoDatasFieldProps = {
  dataInicio: string
  dataFim: string
  onDataInicio: (v: string) => void
  onDataFim: (v: string) => void
  disabled?: boolean
}

export function PeriodoDatasField({ dataInicio, dataFim, onDataInicio, onDataFim, disabled }: PeriodoDatasFieldProps) {
  const from = parseDataLocal(dataInicio)
  const to = parseDataLocal(dataFim)
  const rotulo = from && to
    ? `${format(from, 'dd/MM/yyyy')} — ${format(to, 'dd/MM/yyyy')}`
    : from
      ? `${format(from, 'dd/MM/yyyy')} — ...`
      : 'Selecionar período'

  return (
    <div className="space-y-1.5">
      <Label className="text-[14px] font-medium">
        Período de visualização <span className="text-destructive">*</span>
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal h-10',
              !(from && to) && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{rotulo}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={from ? { from, to } : undefined}
            onSelect={(range) => {
              onDataInicio(formatarISO(range?.from))
              onDataFim(formatarISO(range?.to))
            }}
            captionLayout="dropdown"
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
      <p className="text-[13px] text-muted-foreground">
        Tempo visível no Portal do Responsável
      </p>
    </div>
  )
}

type HoraFieldProps = {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

export function HoraField({ id, label, value, onChange, disabled }: HoraFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[14px] font-medium">
        {label} <span className="text-destructive">*</span>
      </Label>
      <TimePicker
        value={value}
        onChange={onChange}
        disabled={disabled}
        ariaLabel={label}
      />
    </div>
  )
}
