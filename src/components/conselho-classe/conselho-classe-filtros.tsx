'use client'

import { useState, useEffect } from 'react'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { listarTurmasConselho, listarDisciplinasConselho } from '@/lib/actions/conselho-classe'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter } from 'lucide-react'

type Turma = { id: string; nome: string; turnos: string[] }
type Disciplina = { matriz_disciplina_id: string; nome: string }

export type FiltrosConselho = {
  anoLetivoId: string
  turmaId: string
  periodo: string
  disciplinaId: string
}

type Props = {
  schoolId: string | null
  onFilter: (filtros: FiltrosConselho) => void
  temPeriodo?: boolean
}

export default function ConselhoClasseFiltros({ schoolId, onFilter, temPeriodo = true }: Props) {
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [disciplinaId, setDisciplinaId] = useState('__all__')
  const [loadingTurmas, setLoadingTurmas] = useState(false)
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(false)

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

  useEffect(() => {
    if (!turmaId) { setDisciplinas([]); return }
    setLoadingDisciplinas(true)
    listarDisciplinasConselho(turmaId)
      .then(setDisciplinas)
      .catch(() => {})
      .finally(() => setLoadingDisciplinas(false))
  }, [turmaId])

  function handleFilter() {
    if (!anoLetivoId || !turmaId) return
    if (temPeriodo && !periodo) return
    onFilter({ anoLetivoId, turmaId, periodo, disciplinaId: disciplinaId === '__all__' ? '' : disciplinaId })
  }

  return (
    <div className="flex flex-wrap items-end gap-3 mb-6">
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

      {temPeriodo && (
        <div className="w-36">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Período</label>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map(p => (
                <SelectItem key={p} value={String(p)}>{p}º Bimestre</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="w-52">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Disciplina</label>
        <Select value={disciplinaId} onValueChange={setDisciplinaId} disabled={!turmaId}>
          <SelectTrigger><SelectValue placeholder={loadingDisciplinas ? 'Carregando...' : 'Todas'} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas</SelectItem>
            {disciplinas.map(d => (
              <SelectItem key={d.matriz_disciplina_id} value={d.matriz_disciplina_id}>{d.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleFilter} disabled={!anoLetivoId || !turmaId || (temPeriodo && !periodo)}>
        <Filter className="h-4 w-4 mr-1" />
        Filtrar
      </Button>
    </div>
  )
}
