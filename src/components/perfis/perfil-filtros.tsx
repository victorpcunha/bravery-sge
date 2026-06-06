'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PerfilFiltrosProps = {
  search: string
  onSearchChange: (v: string) => void
  situacao: string
  onSituacaoChange: (v: string) => void
}

export function PerfilFiltros({ search, onSearchChange, situacao, onSituacaoChange }: PerfilFiltrosProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar por nome do perfil..."
          className="pl-10 border-border"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={() => onSearchChange('')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
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
    </div>
  )
}
