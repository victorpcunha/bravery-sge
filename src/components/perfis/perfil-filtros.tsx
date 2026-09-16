'use client'

import { Label } from '@/components/ui/label'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { FilterBar } from '@/components/layout/filter-bar'

const SITUACAO_OPCOES = [
  { value: 'todas', label: 'Todos' },
  { value: 'ativas', label: 'Ativos' },
  { value: 'inativas', label: 'Inativos' },
] as const

type PerfilFiltrosProps = {
  search: string
  onSearchChange: (v: string) => void
  situacao: string
  onSituacaoChange: (v: string) => void
  escolaFiltro?: React.ReactNode
}

export function PerfilFiltros({ search, onSearchChange, situacao, onSituacaoChange, escolaFiltro }: PerfilFiltrosProps) {
  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nome do perfil..."
    >
      {escolaFiltro}
      <div className="flex flex-col gap-1.5">
        <Label className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Situação</Label>
        <div className="flex gap-2 flex-wrap">
          {SITUACAO_OPCOES.map(s => (
            <ClickablePill
              key={s.value}
              label={s.label}
              active={situacao === s.value}
              onClick={() => onSituacaoChange(s.value)}
            />
          ))}
        </div>
      </div>
    </FilterBar>
  )
}
