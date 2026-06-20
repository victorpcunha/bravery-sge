'use client'

import { useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TableRow, TableCell } from '@/components/ui/table'

type Props = {
  disciplina: {
    disciplina_id: string
    nome: string
    frequencia: number | null
    total_faltas: number | null
    media_final: number | null
    media_periodo: number | null
    nota_conselho: number | null
    parecer: string | null
  }
  onUpdate: (disciplinaId: string, field: 'nota_conselho' | 'parecer', value: string) => void
  readonly: boolean
}

export default function ConselhoClasseLinhaDisciplina({ disciplina, onUpdate, readonly }: Props) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined as unknown as ReturnType<typeof setTimeout>)

  const handleChange = useCallback((field: 'nota_conselho' | 'parecer', value: string) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onUpdate(disciplina.disciplina_id, field, value)
    }, 1500)
  }, [disciplina.disciplina_id, onUpdate])

  return (
    <>
      <TableRow>
        <TableCell className="py-2 px-3 text-sm">{disciplina.nome}</TableCell>
        <TableCell className="py-2 px-3 text-sm text-center">
          {disciplina.frequencia !== null ? `${disciplina.frequencia}%` : '-'}
        </TableCell>
        <TableCell className="py-2 px-3 text-sm text-center">
          {disciplina.total_faltas !== null ? disciplina.total_faltas : '-'}
        </TableCell>
        <TableCell className="py-2 px-3 text-sm text-center">
          {disciplina.media_final !== null ? disciplina.media_final.toFixed(2) : '-'}
        </TableCell>
        <TableCell className="py-2 px-3 text-sm text-center">
          {disciplina.media_periodo !== null ? disciplina.media_periodo.toFixed(2) : '-'}
        </TableCell>
        <TableCell className="py-2 px-3">
          {readonly ? (
            <span className="text-sm">{disciplina.nota_conselho?.toFixed(2) ?? '-'}</span>
          ) : (
            <Input
              type="number"
              step="0.01"
              min="0"
              max="10"
              defaultValue={disciplina.nota_conselho ?? undefined}
              onChange={e => handleChange('nota_conselho', e.target.value)}
              className="w-20 h-8 text-sm"
              placeholder="-"
            />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className="py-1 px-3">
          {readonly ? (
            <span className="text-sm">{disciplina.parecer ?? '-'}</span>
          ) : (
            <Textarea
              defaultValue={disciplina.parecer ?? ''}
              onChange={e => handleChange('parecer', e.target.value)}
              className="h-10 text-sm"
              placeholder="Parecer..."
            />
          )}
        </TableCell>
      </TableRow>
    </>
  )
}
