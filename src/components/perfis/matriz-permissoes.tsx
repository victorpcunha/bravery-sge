'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/ui/empty-state'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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

type ItemPermissao = RecursoComPermissao & { rotulo: string }

const SEPARADOR_SUBGRUPO = ' — '

function dividirSubgrupo(recurso: RecursoComPermissao): { subgrupo: string | null; rotulo: string } {
  const idx = recurso.nome.indexOf(SEPARADOR_SUBGRUPO)
  if (idx === -1) return { subgrupo: null, rotulo: recurso.nome }
  return {
    subgrupo: recurso.nome.slice(0, idx),
    rotulo: recurso.nome.slice(idx + SEPARADOR_SUBGRUPO.length),
  }
}

function permissaoDe(recurso: RecursoComPermissao) {
  return recurso.permissao || { visualizar: false, criar: false, editar: false, excluir: false }
}

function TabelaPermissoes({ itens, onChange }: { itens: ItemPermissao[]; onChange: MatrizPermissoesProps['onChange'] }) {
  return (
    <>
      {/* Mobile: lista de cards */}
      <ul className="block md:hidden space-y-3">
        {itens.map(recurso => {
          const permissao = permissaoDe(recurso)
          return (
            <li
              key={recurso.id}
              className="rounded-lg border border-border bg-card p-4 shadow-xs"
            >
              <p className="text-[14px] font-semibold text-foreground mb-3">
                {recurso.rotulo}
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
              <TableHead className="sticky left-0 bg-muted text-foreground z-10">Recurso</TableHead>
              <TableHead className="text-center text-foreground w-24">Visualizar</TableHead>
              <TableHead className="text-center text-foreground w-24">Criar</TableHead>
              <TableHead className="text-center text-foreground w-24">Editar</TableHead>
              <TableHead className="text-center text-foreground w-24">Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.map(recurso => {
              const permissao = permissaoDe(recurso)
              return (
                <TableRow key={recurso.id}>
                  <TableCell className="font-medium sticky left-0 bg-background z-10">{recurso.rotulo}</TableCell>
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
    </>
  )
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
    <Accordion type="single" collapsible className="space-y-3">
      {Object.entries(grouped).map(([modulo, modRecursos]) => {
        const comAcesso = modRecursos.filter(r => permissaoDe(r).visualizar).length
        const subgrupos: { nome: string; itens: ItemPermissao[] }[] = []
        const diretos: ItemPermissao[] = []

        for (const recurso of modRecursos) {
          const { subgrupo, rotulo } = dividirSubgrupo(recurso)
          const item = { ...recurso, rotulo }
          if (!subgrupo) {
            diretos.push(item)
            continue
          }
          const grupo = subgrupos.find(g => g.nome === subgrupo)
          if (grupo) grupo.itens.push(item)
          else subgrupos.push({ nome: subgrupo, itens: [item] })
        }

        return (
          <AccordionItem
            key={modulo}
            value={modulo}
            className="rounded-lg border border-border bg-card px-4 shadow-xs"
          >
            <AccordionTrigger className="py-3 hover:no-underline">
              <span className="flex items-center gap-3 min-w-0">
                <span className="text-[15px] font-semibold text-foreground truncate">
                  {modulo}
                </span>
                <span className="text-[13px] text-muted-foreground tabular-nums shrink-0">
                  {comAcesso} de {modRecursos.length} com acesso
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-5">
                {diretos.length > 0 && (
                  <TabelaPermissoes itens={diretos} onChange={onChange} />
                )}
                {subgrupos.map(sub => (
                  <div key={sub.nome}>
                    <Label className="text-[13px] font-semibold mb-3 block uppercase tracking-wider text-muted-foreground">
                      {sub.nome}
                    </Label>
                    <TabelaPermissoes itens={sub.itens} onChange={onChange} />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
