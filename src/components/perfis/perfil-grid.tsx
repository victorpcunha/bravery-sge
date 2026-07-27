'use client'

import { Button } from '@/components/ui/button'
import { Pencil, Trash2, GraduationCap, Shield, Calendar } from 'lucide-react'
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

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

export function PerfilGrid({ perfis, onEdit, onDelete, podeEditar = true, podeExcluir = true }: PerfilGridProps) {
  const temAcoes = podeEditar || podeExcluir

  return (
    <>
      {/* Mobile: lista de cards (PE-602) */}
      <ul className="block md:hidden space-y-3 p-4">
        {perfis.map(p => (
          <li
            key={p.id}
            className="rounded-lg border border-border bg-card p-4 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-foreground truncate">
                  {p.nome}
                </p>
                {p.descricao && (
                  <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2">
                    {p.descricao}
                  </p>
                )}
              </div>
              <StatusBadge
                status={p.ativo ? 'success' : 'muted'}
                className="shrink-0"
              >
                {p.ativo ? 'Ativo' : 'Inativo'}
              </StatusBadge>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <StatusBadge status={p.usa_vinculo_turma ? 'info' : 'primary'}>
                {p.usa_vinculo_turma ? (
                  <GraduationCap className="mr-1 h-3 w-3" />
                ) : (
                  <Shield className="mr-1 h-3 w-3" />
                )}
                {p.usa_vinculo_turma ? 'Professor' : 'Administrativo'}
              </StatusBadge>
              <span className="inline-flex items-center gap-1 text-[13px] text-muted-foreground">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {formatDate(p.created_at)}
              </span>
            </div>
            {temAcoes && (
              <div className="flex gap-2 pt-3 border-t border-border">
                {podeEditar && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(p)}
                    className="flex-1 min-h-[44px]"
                  >
                    <Pencil className="mr-1.5 h-4 w-4" />
                    Editar
                  </Button>
                )}
                {podeExcluir && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(p.id)}
                    className="flex-1 min-h-[44px] text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Excluir
                  </Button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Desktop: tabela */}
      <div className="hidden md:block">
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
                  {formatDate(p.created_at)}
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
      </div>
    </>
  )
}
