'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterBar } from '@/components/layout/filter-bar'

type PerfilFiltrosProps = {
  search: string
  onSearchChange: (v: string) => void
  situacao: string
  onSituacaoChange: (v: string) => void
}

export function PerfilFiltros({ search, onSearchChange, situacao, onSituacaoChange }: PerfilFiltrosProps) {
  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nome do perfil..."
    >
      <Select value={situacao} onValueChange={onSituacaoChange}>
        <SelectTrigger className="w-full sm:w-44 border-border">
          <SelectValue placeholder="Todas situações" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas situações</SelectItem>
          <SelectItem value="ativas">Ativas</SelectItem>
          <SelectItem value="inativas">Inativas</SelectItem>
        </SelectContent>
      </Select>
    </FilterBar>
  )
}