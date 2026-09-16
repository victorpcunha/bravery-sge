'use client'

import { Check, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusFreq = 'P' | 'F' | 'FJ'

export type AlunoPresencaRow = {
  id: string
  nome: string
  detalhe?: string
  status: StatusFreq | null
  disabled?: boolean
  disabledReason?: string
}

type Props = {
  alunos: AlunoPresencaRow[]
  onChange: (alunoId: string, status: StatusFreq | null) => void
  emptyMessage?: string
}

const OPCOES: { value: StatusFreq; label: string; icon: React.ReactNode; ativo: string; inativo: string }[] = [
  { value: 'P', label: 'Presente', icon: <Check className="h-4 w-4" />, ativo: 'bg-success text-white border-success', inativo: 'text-success border-success/40 hover:bg-success/10' },
  { value: 'F', label: 'Falta', icon: <X className="h-4 w-4" />, ativo: 'bg-destructive text-white border-destructive', inativo: 'text-destructive border-destructive/40 hover:bg-destructive/10' },
  { value: 'FJ', label: 'Justificada', icon: <AlertTriangle className="h-4 w-4" />, ativo: 'bg-warning text-white border-warning', inativo: 'text-warning border-warning/40 hover:bg-warning/10' },
]

export default function ListaPresencaMobile({ alunos, onChange, emptyMessage }: Props) {
  if (alunos.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage || 'Nenhum aluno encontrado.'}</p>
  }

  return (
    <ul className="space-y-2">
      {alunos.map(aluno => (
        <li
          key={aluno.id}
          className={cn(
            'rounded-lg border border-border bg-card p-3 shadow-xs',
            aluno.disabled && 'opacity-60'
          )}
          title={aluno.disabledReason}
        >
          <p className="text-[14px] font-semibold text-foreground leading-snug mb-2">{aluno.nome}</p>
          {aluno.detalhe && (
            <p className="text-[12px] text-muted-foreground -mt-1 mb-2">{aluno.detalhe}</p>
          )}
          <div className="flex gap-2">
            {OPCOES.map(op => {
              const ativo = aluno.status === op.value
              return (
                <button
                  key={op.value}
                  type="button"
                  disabled={aluno.disabled}
                  onClick={() => onChange(aluno.id, ativo ? null : op.value)}
                  aria-pressed={ativo}
                  aria-label={`${op.label} — ${aluno.nome}`}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-md border min-h-[44px] px-2 text-[13px] font-semibold transition-colors',
                    ativo ? op.ativo : cn('bg-transparent', op.inativo),
                    aluno.disabled && 'pointer-events-none opacity-50'
                  )}
                >
                  {op.icon}
                  {op.label}
                </button>
              )
            })}
          </div>
          {aluno.disabled && aluno.disabledReason && (
            <p className="text-[12px] text-muted-foreground mt-1.5">{aluno.disabledReason}</p>
          )}
        </li>
      ))}
    </ul>
  )
}
