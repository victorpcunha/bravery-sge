'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/ui/empty-state'
import type { RecursoComPermissao } from '@/lib/actions/perfis'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Shield } from 'lucide-react'

type Acao = 'visualizar' | 'criar' | 'editar' | 'excluir'

const ACOES: { key: Acao; label: string }[] = [
  { key: 'visualizar', label: 'Visualizar' },
  { key: 'criar', label: 'Criar' },
  { key: 'editar', label: 'Editar' },
  { key: 'excluir', label: 'Excluir' },
]

type MatrizPermissoesProps = {
  recursos: RecursoComPermissao[]
  onChange: (recursoId: string, acao: Acao, value: boolean) => void
}

export function MatrizPermissoes({ recursos, onChange }: MatrizPermissoesProps) {
  const grouped = recursos.reduce<Record<string, RecursoComPermissao[]>>((acc, r) => {
    if (!acc[r.modulo]) acc[r.modulo] = []
    acc[r.modulo].push(r)
    return acc
  }, {})

  if (recursos.length === 0) {
    return (
      <EmptyState
        icon={Shield}
        title="Nenhum recurso disponível"
        description="Os recursos do sistema ainda não foram cadastrados."
      />
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([modulo, modRecursos]) => (
        <div key={modulo}>
          <Label className="text-[13px] font-semibold mb-3 block uppercase tracking-wider text-muted-foreground">
            {modulo}
          </Label>

          {/* Mobile: lista de cards (PE-602) */}
          <ul className="block md:hidden space-y-3">
            {modRecursos.map(recurso => {
              const permissao = recurso.permissao || { visualizar: false, criar: false, editar: false, excluir: false }
              return (
                <li
                  key={recurso.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-xs"
                >
                  <p className="text-[14px] font-semibold text-foreground mb-3">
                    {recurso.nome}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {ACOES.map(acao => (
                      <label
                        key={acao.key}
                        className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-muted/50 min-h-[40px]"
                      >
                        <Checkbox
                          checked={permissao[acao.key]}
                          onCheckedChange={checked => onChange(recurso.id, acao.key, checked === true)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-[14px] text-foreground">{acao.label}</span>
                      </label>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Desktop: tabela */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="sticky left-0 bg-muted z-10">Recurso</TableHead>
                  <TableHead className="text-center w-24">Visualizar</TableHead>
                  <TableHead className="text-center w-24">Criar</TableHead>
                  <TableHead className="text-center w-24">Editar</TableHead>
                  <TableHead className="text-center w-24">Excluir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modRecursos.map(recurso => {
                  const permissao = recurso.permissao || { visualizar: false, criar: false, editar: false, excluir: false }
                  return (
                    <TableRow key={recurso.id}>
                      <TableCell className="font-medium sticky left-0 bg-background z-10">{recurso.nome}</TableCell>
                      {ACOES.map(acao => (
                        <TableCell key={acao.key} className="text-center">
                          <Checkbox
                            checked={permissao[acao.key]}
                            onCheckedChange={checked => onChange(recurso.id, acao.key, checked === true)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  )
}
