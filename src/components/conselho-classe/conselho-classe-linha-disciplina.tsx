'use client'

import { useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TableRow, TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type Props = {
  disciplina: {
    disciplina_id: string
    nome: string
    frequencia: number | null
    total_faltas: number | null
    media_periodo: number | null
    media_minima: number | null
    nota_conselho: number | null
    parecer: string | null
  }
  onUpdate: (disciplinaId: string, field: 'nota_conselho' | 'parecer', value: string) => void
  readonly: boolean
}

export default function ConselhoClasseLinhaDisciplina({ disciplina, onUpdate, readonly }: Props) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<{ field: 'nota_conselho' | 'parecer'; value: string } | null>(null)

  const flush = useCallback(() => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    if (pendingRef.current) {
      onUpdate(disciplina.disciplina_id, pendingRef.current.field, pendingRef.current.value)
      pendingRef.current = null
    }
  }, [disciplina.disciplina_id, onUpdate])

  const handleChange = useCallback((field: 'nota_conselho' | 'parecer', value: string) => {
    pendingRef.current = { field, value }
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(flush, 800)
  }, [flush])

  return (
    <>
      <TableRow className="border-b border-border/60">
        <TableCell className="py-3 px-4 text-[15px] font-medium text-foreground">{disciplina.nome}</TableCell>
        <TableCell className="py-3 px-4 text-[15px] text-center tabular-nums">
          {disciplina.frequencia !== null ? `${disciplina.frequencia}%` : '-'}
        </TableCell>
        <TableCell className="py-3 px-4 text-[15px] text-center tabular-nums">
          {disciplina.total_faltas !== null ? disciplina.total_faltas : '-'}
        </TableCell>
        <TableCell className="py-3 px-4 text-center tabular-nums">
          <span
            className={cn(
              'text-[15px] tabular-nums',
              disciplina.media_periodo !== null && disciplina.media_minima !== null
                ? disciplina.media_periodo >= disciplina.media_minima
                  ? 'font-semibold text-success'
                  : 'font-semibold text-destructive'
                : 'text-foreground'
            )}
          >
            {disciplina.media_periodo !== null ? disciplina.media_periodo.toFixed(2) : '-'}
          </span>
        </TableCell>
        <TableCell className="py-3 px-4">
          <div className="flex justify-center">
            {readonly ? (
              <span className="text-[15px] tabular-nums">{disciplina.nota_conselho?.toFixed(2) ?? '-'}</span>
            ) : (
              <Input
                type="number"
                step="0.01"
                min="0"
                max="10"
                defaultValue={disciplina.nota_conselho ?? undefined}
                onChange={e => handleChange('nota_conselho', e.target.value)}
                onBlur={flush}
                className="w-20 h-8 text-[14px] text-center tabular-nums"
                placeholder="-"
              />
            )}
          </div>
        </TableCell>
      </TableRow>
      <TableRow className="bg-card/60">
        <TableCell colSpan={5} className="py-2.5 px-4">
          {readonly ? (
            <div className="text-[15px] text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Parecer</span>
              <p className="mt-1">{disciplina.parecer ?? '-'}</p>
            </div>
          ) : (
            <Textarea
              defaultValue={disciplina.parecer ?? ''}
              onChange={e => handleChange('parecer', e.target.value)}
              onBlur={flush}
              className="h-auto min-h-16 bg-card text-[15px] border-border"
              placeholder="Parecer do conselho..."
            />
          )}
        </TableCell>
      </TableRow>
    </>
  )
}
