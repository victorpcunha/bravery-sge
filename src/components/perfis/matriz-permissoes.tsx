'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { RecursoComPermissao } from '@/lib/actions/perfis'

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
          <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
            {modulo}
          </h4>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground sticky left-0 bg-muted z-10">Recurso</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground w-24">Visualizar</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground w-24">Criar</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground w-24">Editar</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground w-24">Excluir</th>
                </tr>
              </thead>
              <tbody>
                {modRecursos.map(recurso => {
                  const permissao = recurso.permissao || { visualizar: false, criar: false, editar: false, excluir: false }

                  return (
                    <tr key={recurso.id} className="border-b border-border hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium sticky left-0 bg-background z-10">{recurso.nome}</td>
                      {(['visualizar', 'criar', 'editar', 'excluir'] as const).map(acao => (
                        <td key={acao} className="px-4 py-3 text-center">
                          <Checkbox
                            checked={permissao[acao]}
                            onCheckedChange={checked => onChange(recurso.id, acao, checked === true)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
