'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { listarTurmasConselho } from '@/lib/actions/conselho-classe'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterBar } from '@/components/layout/filter-bar'
import { PageSection } from '@/components/layout/page-section'

type Turma = { id: string; nome: string; turnos: string[] }

export type FiltrosAprovacao = {
  schoolId: string | null
  anoLetivoId: string
  turmaId: string
}

type Props = {
  schoolId: string | null
  onFilter: (filtros: FiltrosAprovacao) => void
}

export default function AprovacaoConselhoFiltros({ schoolId, onFilter }: Props) {
  const { isSuperAdmin, allSchools } = useAuth()
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [loadingTurmas, setLoadingTurmas] = useState(false)

  const effectiveSchoolId = isSuperAdmin ? selectedSchoolId : schoolId

  const onFilterRef = useRef(onFilter)
  useEffect(() => {
    onFilterRef.current = onFilter
  })

  useEffect(() => {
    setAnoLetivoId('')
    setTurmaId('')
    setTurmas([])
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

  const handleAnoLetivo = useCallback((v: string) => {
    setAnoLetivoId(v)
    setTurmaId('')
  }, [])

  useEffect(() => {
    if (!effectiveSchoolId || !anoLetivoId || !turmaId) return
    onFilterRef.current({ schoolId: effectiveSchoolId, anoLetivoId, turmaId })
  }, [effectiveSchoolId, anoLetivoId, turmaId])

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

        <Select value={turmaId} onValueChange={setTurmaId}>
          <SelectTrigger className="w-auto min-w-[180px] h-9" disabled={!anoLetivoId}>
            <SelectValue placeholder={loadingTurmas ? 'Carregando...' : 'Turma'} />
          </SelectTrigger>
          <SelectContent>
            {turmas.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBar>
    </PageSection>
  )
}
