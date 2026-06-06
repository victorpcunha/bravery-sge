'use client'

import { useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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
      <tr className="border-b border-muted/50">
        <td className="py-2 px-3 text-sm">{disciplina.nome}</td>
        <td className="py-2 px-3 text-sm text-center">
          {disciplina.frequencia !== null ? `${disciplina.frequencia}%` : '-'}
        </td>
        <td className="py-2 px-3 text-sm text-center">
          {disciplina.total_faltas !== null ? disciplina.total_faltas : '-'}
        </td>
        <td className="py-2 px-3 text-sm text-center">
          {disciplina.media_final !== null ? disciplina.media_final.toFixed(2) : '-'}
        </td>
        <td className="py-2 px-3 text-sm text-center">
          {disciplina.media_periodo !== null ? disciplina.media_periodo.toFixed(2) : '-'}
        </td>
        <td className="py-2 px-3">
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
        </td>
      </tr>
      <tr className="border-b border-muted/50">
        <td colSpan={6} className="py-1 px-3">
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
        </td>
      </tr>
    </>
  )
}
