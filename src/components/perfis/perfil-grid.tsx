'use client'

import { Button } from '@/components/ui/button'
import { Pencil, Trash2, GraduationCap, Shield } from 'lucide-react'
import type { Perfil } from '@/lib/actions/perfis'

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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 text-xs text-muted-foreground uppercase tracking-wider">
            <th className="text-left px-6 py-3 font-medium">Nome</th>
            <th className="text-left px-6 py-3 font-medium">Descrição</th>
            <th className="text-left px-6 py-3 font-medium">Tipo</th>
            <th className="text-left px-6 py-3 font-medium">Situação</th>
            <th className="text-left px-6 py-3 font-medium">Data Cadastro</th>
            {temAcoes && <th className="text-right px-6 py-3 font-medium">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {perfis.map(p => (
            <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
              <td className="px-6 py-4 text-sm font-medium">{p.nome}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                {p.descricao || '-'}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                  p.usa_vinculo_turma ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {p.usa_vinculo_turma ? <GraduationCap className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                  {p.usa_vinculo_turma ? 'Professor' : 'Administrativo'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  p.ativo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {p.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {new Date(p.created_at).toLocaleDateString('pt-BR')}
              </td>
              {temAcoes && (
                <td className="px-6 py-4 text-right">
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
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
