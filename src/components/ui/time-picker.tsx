'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const HORAS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTOS = Array.from({ length: 6 }, (_, i) => String(i * 10).padStart(2, '0'))

function parseValor(value: string): { hora: string; minuto: string } {
  const m = value.match(/^(\d{2}):(\d{2})/)
  if (!m) return { hora: '', minuto: '' }
  return { hora: m[1], minuto: m[2] }
}

type TimePickerProps = {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  placeholder?: string
  ariaLabel?: string
}

export function TimePicker({ value, onChange, disabled, placeholder = 'Selecionar', ariaLabel }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const horaRef = useRef<HTMLDivElement>(null)
  const minutoRef = useRef<HTMLDivElement>(null)
  const { hora, minuto } = parseValor(value)

  useEffect(() => {
    if (!open) return
    for (const ref of [horaRef, minutoRef]) {
      ref.current
        ?.querySelector('[data-selected="true"]')
        ?.scrollIntoView({ block: 'center' })
    }
  }, [open])

  const escolherHora = (h: string) => {
    onChange(`${h}:${minuto || '00'}`)
  }

  const escolherMinuto = (m: string) => {
    onChange(`${hora || '00'}:${m}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            'w-full h-10 justify-start text-left font-normal tabular-nums',
            !value && 'text-muted-foreground'
          )}
        >
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex gap-2">
          <div ref={horaRef} className="max-h-48 overflow-y-auto pr-1" role="listbox" aria-label="Hora">
            {HORAS.map(h => (
              <button
                key={h}
                type="button"
                role="option"
                aria-selected={h === hora}
                data-selected={h === hora}
                onClick={() => escolherHora(h)}
                className={cn(
                  'flex h-8 w-12 items-center justify-center rounded-md text-[13px] tabular-nums transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  h === hora
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-accent/10'
                )}
              >
                {h}
              </button>
            ))}
          </div>
          <div className="w-px bg-border" aria-hidden="true" />
          <div ref={minutoRef} className="max-h-48 overflow-y-auto pr-1" role="listbox" aria-label="Minuto">
            {MINUTOS.map(m => (
              <button
                key={m}
                type="button"
                role="option"
                aria-selected={m === minuto}
                data-selected={m === minuto}
                onClick={() => escolherMinuto(m)}
                className={cn(
                  'flex h-8 w-12 items-center justify-center rounded-md text-[13px] tabular-nums transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  m === minuto
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-accent/10'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
