'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
  ano: number
  mes: number
  onChange: (ano: number, mes: number) => void
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function SeletorMes({ ano, mes, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={String(mes)} onValueChange={(v) => onChange(ano, Number(v))}>
        <SelectTrigger className="w-auto min-w-[150px] h-9" aria-label="Selecionar mês">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MESES.map((label, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
