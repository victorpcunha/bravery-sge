'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { FilterBar } from '@/components/layout/filter-bar'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Users, MoreHorizontal, Pencil, Trash2, Eye, Plus } from 'lucide-react'

type Pessoa = {
  id: string
  nome: string
  email: string
  tipo: string
  status: 'Ativo' | 'Inativo' | 'Pendente'
}

const pessoasMock: Pessoa[] = [
  { id: '1', nome: 'Ana Silva', email: 'ana@email.com', tipo: 'Docente', status: 'Ativo' },
  { id: '2', nome: 'Carlos Souza', email: 'carlos@email.com', tipo: 'Aluno', status: 'Ativo' },
  { id: '3', nome: 'Maria Oliveira', email: 'maria@email.com', tipo: 'Responsável', status: 'Pendente' },
  { id: '4', nome: 'Pedro Santos', email: 'pedro@email.com', tipo: 'Docente', status: 'Inativo' },
  { id: '5', nome: 'Juliana Costa', email: 'juliana@email.com', tipo: 'Aluno', status: 'Ativo' },
]

const statusMap: Record<string, 'success' | 'warning' | 'destructive' | 'muted'> = {
  Ativo: 'success',
  Inativo: 'destructive',
  Pendente: 'warning',
}

export function ListPage() {
  const [search, setSearch] = useState('')
  const [data] = useState(pessoasMock)

  const filtered = data.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageContainer>
      <PageHeader
        icon={Users}
        title="Pessoas"
        description="Exemplo de página de listagem usando Design System"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Pessoa
          </Button>
        }
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por nome ou email..."
        >
          <Button variant="outline" size="sm">Filtrar</Button>
        </FilterBar>
      </PageSection>

      <PageSection variant="flush" title="Resultados" description={`${filtered.length} registro(s) encontrado(s)`}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhuma pessoa encontrada"
            description="Tente ajustar os filtros de busca"
            action={<Button variant="outline">Limpar filtros</Button>}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((pessoa) => (
                <TableRow key={pessoa.id}>
                  <TableCell className="font-medium">{pessoa.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{pessoa.email}</TableCell>
                  <TableCell>{pessoa.tipo}</TableCell>
                  <TableCell>
                    <StatusBadge status={statusMap[pessoa.status]}>{pessoa.status}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Visualizar</DropdownMenuItem>
                        <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PageSection>
    </PageContainer>
  )
}