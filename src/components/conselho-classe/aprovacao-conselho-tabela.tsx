'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Inbox } from 'lucide-react'
import { toast } from 'sonner'
import { alternarAprovacaoConselho } from '@/lib/actions/conselho-classe'
import type { AlunoReprovado } from '@/lib/actions/conselho-classe'

type Props = {
  alunos: AlunoReprovado[]
  loading: boolean
  error: string | null
  schoolId: string
  pessoaId: string | null
  readonly: boolean
  onToggle: () => void
}

export default function AprovacaoConselhoTabela({ alunos, loading, error, schoolId, pessoaId, readonly, onToggle }: Props) {
  const [toggling, setToggling] = useState<Set<string>>(new Set())

  async function handleToggle(aluno: AlunoReprovado) {
    if (readonly) {
      toast.error('Sem permissão para editar')
      return
    }

    const novoStatus = aluno.situacao !== 'Aprovado por conselho de classe'
    setToggling(prev => new Set(prev).add(aluno.matricula_id))

    const result = await alternarAprovacaoConselho(schoolId, aluno.matricula_id, novoStatus, pessoaId)

    setToggling(prev => {
      const next = new Set(prev)
      next.delete(aluno.matricula_id)
      return next
    })

    if (result.success) {
      toast.success(novoStatus ? 'Aluno aprovado por conselho' : 'Aprovação revertida')
      onToggle()
    } else {
      toast.error(result.error || 'Erro ao alternar aprovação')
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (alunos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">Nenhum aluno reprovado na turma selecionada</p>
      </div>
    )
  }

  return (
    <div className="border border-muted rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/30 text-xs text-muted-foreground">
            <th className="py-3 px-4 text-left font-medium">Nome Completo</th>
            <th className="py-3 px-4 text-center font-medium">Situação da Matrícula</th>
            <th className="py-3 px-4 text-center font-medium">Aprovado por Conselho</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map(aluno => (
            <tr key={aluno.matricula_id} className="border-b border-muted/50 last:border-b-0">
              <td className="py-3 px-4 text-sm">{aluno.nome}</td>
              <td className="py-3 px-4 text-sm text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {aluno.situacao}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <Checkbox
                  checked={aluno.situacao === 'Aprovado por conselho de classe'}
                  disabled={toggling.has(aluno.matricula_id) || readonly}
                  onCheckedChange={() => handleToggle(aluno)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
