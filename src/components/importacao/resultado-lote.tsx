'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { StatusBadge } from '@/components/feedback/status-badge'
import { CheckCircle2 } from 'lucide-react'
import type { ResultadoLote } from '@/lib/importacao-modelos'

type ResultadoLoteProps = {
  resultado: ResultadoLote
  modo: 'validacao' | 'conclusao'
}

const ITENS_POR_PAGINA = 10

export function ResultadoLote({ resultado, modo }: ResultadoLoteProps) {
  const [pagina, setPagina] = useState(1)
  const totalPaginas = Math.max(1, Math.ceil(resultado.erros.length / ITENS_POR_PAGINA))
  const errosPagina = resultado.erros.slice((pagina - 1) * ITENS_POR_PAGINA, pagina * ITENS_POR_PAGINA)
  const validas = resultado.totalRecebidas - resultado.erros.length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-[13px] text-muted-foreground">Linhas recebidas</p>
          <p className="text-[36px] font-bold leading-none tabular-nums mt-1">{resultado.totalRecebidas}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[13px] text-muted-foreground">{modo === 'validacao' ? 'Linhas válidas' : 'Criadas'}</p>
          <p className="text-[36px] font-bold leading-none tabular-nums mt-1">
            {modo === 'validacao' ? validas : resultado.totalCriadas}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[13px] text-muted-foreground">Rejeitadas</p>
          <p className="text-[36px] font-bold leading-none tabular-nums mt-1">{resultado.erros.length}</p>
        </Card>
      </div>

      {resultado.erros.length === 0 ? (
        <Card>
          <EmptyState
            icon={CheckCircle2}
            title={modo === 'validacao' ? 'Tudo certo para importar' : 'Importação concluída sem rejeições'}
            description={
              modo === 'validacao'
                ? 'Todas as linhas passaram na validação. Confira o resumo e confirme a importação.'
                : 'Todos os registros foram criados na unidade selecionada.'
            }
          />
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2 flex-wrap">
            <StatusBadge status="destructive">{resultado.erros.length} {resultado.erros.length === 1 ? 'erro encontrado' : 'erros encontrados'}</StatusBadge>
            <p className="text-[13px] text-muted-foreground">
              {modo === 'validacao'
                ? 'Corrija no arquivo e valide novamente, ou confirme para importar só as linhas válidas.'
                : 'As linhas válidas foram criadas; corrija as rejeitadas e reenvie só elas.'}
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-muted z-10 w-20">Linha</TableHead>
                  <TableHead>Campo</TableHead>
                  <TableHead>Problema</TableHead>
                  <TableHead>Como corrigir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errosPagina.map((e, idx) => (
                  <TableRow key={`${e.linha}-${e.campo}-${idx}`}>
                    <TableCell className="sticky left-0 bg-background z-10 font-mono tabular-nums">{e.linha}</TableCell>
                    <TableCell className="font-medium text-foreground">{e.campo}</TableCell>
                    <TableCell className="text-muted-foreground">{e.mensagem}</TableCell>
                    <TableCell className="text-muted-foreground">{e.orientacao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="px-4 py-3 border-t border-border">
            <Pagination
              currentPage={pagina}
              totalPages={totalPaginas}
              totalItems={resultado.erros.length}
              itemsPerPage={ITENS_POR_PAGINA}
              onPageChange={setPagina}
            />
          </div>
        </Card>
      )}
    </div>
  )
}
