'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { RecursoComPermissao } from '@/lib/actions/perfis'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type MatrizPermissoesProps = {
  recursos: RecursoComPermissao[]
  onChange: (recursoId: string, acao: 'visualizar' | 'criar' | 'editar' | 'excluir', value: boolean) => void
}

export function MatrizPermissoes({ recursos, onChange }: MatrizPermissoesProps) {
  const grouped = recursos.reduce<Record<string, RecursoComPermissao[]>>((acc, r) => {
    if (!acc[r.modulo]) acc[r.modulo] = []
    acc[r.modulo].push(r)
    return acc
  }, {})

  if (recursos.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">Nenhum recurso disponível.</div>
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([modulo, modRecursos]) => (
        <div key={modulo}>
          <Label className="text-sm font-semibold mb-3 block uppercase tracking-wider">
            {modulo}
          </Label>
          <div className="overflow-x-auto rounded-lg border border-border">
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
                      {(['visualizar', 'criar', 'editar', 'excluir'] as const).map(acao => (
                        <TableCell key={acao} className="text-center">
                          <Checkbox
                            checked={permissao[acao]}
                            onCheckedChange={checked => onChange(recurso.id, acao, checked === true)}
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