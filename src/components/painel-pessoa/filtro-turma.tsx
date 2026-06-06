'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type TurmaResumida } from '@/lib/actions/painel-pessoa'

type Props = {
  turmas: TurmaResumida[]
  selectedId: string
  onSelect: (turmaId: string) => void
  loading?: boolean
}

export default function FiltroTurma({ turmas, selectedId, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="min-w-[220px]">
        <label className="text-xs text-muted-foreground font-medium mb-1 block">Turma</label>
        <div className="h-9 rounded-lg border border-border bg-muted animate-pulse" />
      </div>
    )
  }

  if (turmas.length === 0) return null

  return (
    <div className="min-w-[220px]">
      <label className="text-xs text-muted-foreground font-medium mb-1 block">Turma</label>
      <Select value={selectedId} onValueChange={onSelect} disabled={turmas.length <= 1}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma turma" />
        </SelectTrigger>
        <SelectContent>
          {turmas.map(t => (
            <SelectItem key={t.id} value={t.id}>
              {t.nome} — {t.etapa_nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {turmas.length === 1 && (
        <p className="text-xs text-muted-foreground mt-1">Matrícula única — turma fixa</p>
      )}
    </div>
  )
}
