'use client'

import { Button } from '@/components/ui/button'
import { Pencil, Trash2, GraduationCap, Shield } from 'lucide-react'
import type { Perfil } from '@/lib/actions/perfis'
import { StatusBadge } from '@/components/feedback/status-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type PerfilGridProps = {
  perfis: Perfil[]
  loading: boolean
  onEdit: (perfil: Perfil) => void
  onDelete: (id: string) => void
  podeEditar?: boolean
  podeExcluir?: boolean
}

export function PerfilGrid({ perfis, loading, onEdit, onDelete, podeEditar = true, podeExcluir = true }: PerfilGridProps) {
  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Carregando...</div>
  }

  if (perfis.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Nenhum perfil encontrado. Clique em "Novo Perfil" para cadastrar.
      </div>
    )
  }

  const temAcoes = podeEditar || podeExcluir

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Situação</TableHead>
          <TableHead>Data Cadastro</TableHead>
          {temAcoes && <TableHead className="text-right">Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {perfis.map(p => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.nome}</TableCell>
            <TableCell className="text-muted-foreground max-w-xs truncate">
              {p.descricao || '-'}
            </TableCell>
            <TableCell>
              <StatusBadge status={p.usa_vinculo_turma ? 'info' : 'primary'}>
                {p.usa_vinculo_turma ? <GraduationCap className="mr-1 h-3 w-3" /> : <Shield className="mr-1 h-3 w-3" />}
                {p.usa_vinculo_turma ? 'Professor' : 'Administrativo'}
              </StatusBadge>
            </TableCell>
            <TableCell>
              <StatusBadge status={p.ativo ? 'success' : 'muted'}>
                {p.ativo ? 'Ativo' : 'Inativo'}
              </StatusBadge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(p.created_at).toLocaleDateString('pt-BR')}
            </TableCell>
            {temAcoes && (
              <TableCell className="text-right">
                {podeEditar && (
                  <Button variant="ghost" size="icon-sm" onClick={() => onEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {podeExcluir && (
                  <Button variant="ghost" size="icon-sm" onClick={() => onDelete(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}