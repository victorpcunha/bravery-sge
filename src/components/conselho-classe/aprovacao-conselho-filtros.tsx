'use client'

import { useState, useEffect } from 'react'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { listarTurmasConselho } from '@/lib/actions/conselho-classe'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterBar } from '@/components/layout/filter-bar'
import { Filter } from 'lucide-react'

type Turma = { id: string; nome: string; turnos: string[] }

export type FiltrosAprovacao = {
  anoLetivoId: string
  turmaId: string
}

type Props = {
  schoolId: string | null
  onFilter: (filtros: FiltrosAprovacao) => void
}

export default function AprovacaoConselhoFiltros({ schoolId, onFilter }: Props) {
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [loadingTurmas, setLoadingTurmas] = useState(false)

  useEffect(() => {
    getAnosLetivosAtivos(schoolId).then(setAnosLetivos).catch(() => {})
  }, [schoolId])

  useEffect(() => {
    if (!anoLetivoId) { setTurmas([]); return }
    setLoadingTurmas(true)
    listarTurmasConselho(schoolId, anoLetivoId)
      .then(setTurmas)
      .catch(() => {})
      .finally(() => setLoadingTurmas(false))
  }, [anoLetivoId, schoolId])

  function handleFilter() {
    if (!anoLetivoId || !turmaId) return
    onFilter({ anoLetivoId, turmaId })
  }

  return (
    <FilterBar className="mb-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Ano Letivo</label>
          <Select value={anoLetivoId} onValueChange={setAnoLetivoId}>
            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {anosLetivos.map((a: any) => (
                <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-52">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Turma</label>
          <Select value={turmaId} onValueChange={setTurmaId} disabled={!anoLetivoId}>
            <SelectTrigger><SelectValue placeholder={loadingTurmas ? 'Carregando...' : 'Selecione...'} /></SelectTrigger>
            <SelectContent>
              {turmas.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleFilter} disabled={!anoLetivoId || !turmaId}>
          <Filter className="h-4 w-4 mr-1" />
          Filtrar
        </Button>
      </div>
    </FilterBar>
  )
}
