'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { AlertCircle, Inbox } from 'lucide-react'
import { toast } from 'sonner'
import { alternarAprovacaoConselho } from '@/lib/actions/conselho-classe'
import type { AlunoReprovado } from '@/lib/actions/conselho-classe'

type Props = {
  alunos: AlunoReprovado[]
  loading: boolean
  error: string | null
  schoolId: string | null
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
      <EmptyState
        icon={AlertCircle}
        title="Erro ao carregar"
        description={error}
      />
    )
  }

  if (alunos.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Nenhum aluno reprovado"
        description="Nenhum aluno reprovado na turma selecionada"
      />
    )
  }

  return (
    <PageSection
      variant="flush"
      title={`${alunos.length} ${alunos.length === 1 ? 'aluno reprovado' : 'alunos reprovados'}`}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted text-xs text-muted-foreground hover:bg-muted">
              <TableHead className="py-3 px-4 text-left font-semibold">Nome Completo</TableHead>
              <TableHead className="py-3 px-4 text-center font-semibold">Situação da Matrícula</TableHead>
              <TableHead className="py-3 px-4 text-center font-semibold">Aprovado por Conselho</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunos.map(aluno => (
              <TableRow key={aluno.matricula_id}>
                <TableCell className="py-3 px-4 text-[15px] font-medium text-foreground">{aluno.nome}</TableCell>
                <TableCell className="py-3 px-4 text-center">
                  <StatusBadge status="destructive">{aluno.situacao}</StatusBadge>
                </TableCell>
                <TableCell className="py-3 px-4 text-center">
                  <Checkbox
                    checked={aluno.situacao === 'Aprovado por conselho de classe'}
                    disabled={toggling.has(aluno.matricula_id) || readonly}
                    onCheckedChange={() => handleToggle(aluno)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageSection>
  )
}
