'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { listarTurmasConselho, listarDisciplinasConselho } from '@/lib/actions/conselho-classe'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterBar } from '@/components/layout/filter-bar'
import { PageSection } from '@/components/layout/page-section'

type Turma = { id: string; nome: string; turnos: string[] }
type Disciplina = { matriz_disciplina_id: string; nome: string }

export type FiltrosConselho = {
  schoolId: string | null
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
  const { isSuperAdmin, allSchools } = useAuth()
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [disciplinaId, setDisciplinaId] = useState('')
  const [loadingTurmas, setLoadingTurmas] = useState(false)
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(false)

  const effectiveSchoolId = isSuperAdmin ? selectedSchoolId : schoolId

  const onFilterRef = useRef(onFilter)
  useEffect(() => {
    onFilterRef.current = onFilter
  })

  useEffect(() => {
    setAnoLetivoId('')
    setTurmaId('')
    setPeriodo('')
    setDisciplinaId('')
    setTurmas([])
    setDisciplinas([])
    setAnosLetivos([])
    if (!effectiveSchoolId) return
    getAnosLetivosAtivos(effectiveSchoolId).then(setAnosLetivos).catch(() => {})
  }, [effectiveSchoolId])

  useEffect(() => {
    if (!anoLetivoId || !effectiveSchoolId) {
      setTurmas([])
      return
    }
    setLoadingTurmas(true)
    listarTurmasConselho(effectiveSchoolId, anoLetivoId)
      .then(setTurmas)
      .catch(() => {})
      .finally(() => setLoadingTurmas(false))
  }, [anoLetivoId, effectiveSchoolId])

  useEffect(() => {
    if (!turmaId) {
      setDisciplinas([])
      return
    }
    setLoadingDisciplinas(true)
    listarDisciplinasConselho(turmaId)
      .then(setDisciplinas)
      .catch(() => {})
      .finally(() => setLoadingDisciplinas(false))
  }, [turmaId])

  const handleAnoLetivo = useCallback((v: string) => {
    setAnoLetivoId(v)
    setTurmaId('')
    setPeriodo('')
    setDisciplinaId('')
  }, [])

  const handleTurma = useCallback((v: string) => {
    setTurmaId(v)
    setPeriodo('')
    setDisciplinaId('')
  }, [])

  useEffect(() => {
    if (!effectiveSchoolId || !anoLetivoId || !turmaId) return
    if (temPeriodo && !periodo) return
    onFilterRef.current({
      schoolId: effectiveSchoolId,
      anoLetivoId,
      turmaId,
      periodo,
      disciplinaId: disciplinaId === '__all__' ? '' : disciplinaId,
    })
  }, [effectiveSchoolId, anoLetivoId, turmaId, periodo, disciplinaId, temPeriodo])

  return (
    <PageSection variant="compact" title="Filtros" className="mb-6">
      <FilterBar>
        {isSuperAdmin && allSchools.length > 0 && (
          <Select
            value={selectedSchoolId ?? '__none__'}
            onValueChange={(v) => setSelectedSchoolId(v === '__none__' ? null : v)}
          >
            <SelectTrigger className="w-auto min-w-[200px] h-9">
              <SelectValue placeholder="Selecione uma escola" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__" disabled>Selecione uma escola</SelectItem>
              {allSchools.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={anoLetivoId} onValueChange={handleAnoLetivo}>
          <SelectTrigger className="w-auto min-w-[160px] h-9" disabled={!effectiveSchoolId}>
            <SelectValue placeholder="Ano letivo" />
          </SelectTrigger>
          <SelectContent>
            {anosLetivos.map((a: any) => (
              <SelectItem key={a.id} value={a.id}>{a.descricao || a.ano}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={turmaId} onValueChange={handleTurma}>
          <SelectTrigger className="w-auto min-w-[180px] h-9" disabled={!anoLetivoId}>
            <SelectValue placeholder={loadingTurmas ? 'Carregando...' : 'Turma'} />
          </SelectTrigger>
          <SelectContent>
            {turmas.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {temPeriodo && (
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-auto min-w-[150px] h-9" disabled={!turmaId}>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map(p => (
                <SelectItem key={p} value={String(p)}>{p}º Bimestre</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={disciplinaId} onValueChange={setDisciplinaId}>
          <SelectTrigger className="w-auto min-w-[190px] h-9" disabled={!turmaId}>
            <SelectValue placeholder={loadingDisciplinas ? 'Carregando...' : 'Selecione uma disciplina'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas</SelectItem>
            {disciplinas.map(d => (
              <SelectItem key={d.matriz_disciplina_id} value={d.matriz_disciplina_id}>{d.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>
    </PageSection>
  )
}
