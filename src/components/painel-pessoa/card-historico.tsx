'use client'

import { useState, useEffect } from 'react'
import { getHistoricoSistema, type HistoricoAno } from '@/lib/actions/painel-pessoa'
import { getConfigEscola } from '@/lib/actions/historico-manual'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GraduationCap, Loader2, Plus } from 'lucide-react'
import ModalHistoricoManual from './modal-historico-manual'

type Props = {
  pessoaId: string
  schoolId: string | null
  pessoaLogadaId: string | null
}

export default function CardHistorico({ pessoaId, schoolId, pessoaLogadaId }: Props) {
  const [historico, setHistorico] = useState<HistoricoAno[]>([])
  const [loading, setLoading] = useState(true)
  const [permiteManual, setPermiteManual] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const carregar = () => {
    setLoading(true)
    Promise.all([
      getHistoricoSistema(pessoaId, pessoaLogadaId),
      getConfigEscola(schoolId, pessoaLogadaId),
    ]).then(([hist, config]) => {
      setHistorico(hist)
      setPermiteManual(config.permite_historico_manual)
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => {
    if (pessoaId) carregar()
  }, [pessoaId, schoolId, pessoaLogadaId])

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4" />Histórico Escolar</CardTitle></CardHeader>
        <CardContent><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-warning" />
            Histórico Escolar
            {permiteManual && (
              <Button variant="outline" size="sm" className="ml-auto h-7 text-xs gap-1" onClick={() => setModalOpen(true)}>
                <Plus className="h-3 w-3" />
                Manual
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum registro de histórico escolar.</p>
          ) : (
            <ScrollArea className="max-h-56">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Ano</TableHead>
                    <TableHead className="text-xs">Turma</TableHead>
                    <TableHead className="text-xs">Etapa</TableHead>
                    <TableHead className="text-xs">Freq.</TableHead>
                    <TableHead className="text-xs">Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historico.map(h => (
                    <TableRow key={`${h.ano_letivo_id}-${h.turma_nome}`}>
                      <TableCell className="font-medium">{h.ano}</TableCell>
                      <TableCell>{h.turma_nome}</TableCell>
                      <TableCell>{h.etapa_nome}</TableCell>
                      <TableCell>
                        {h.frequencia_percentual !== null ? `${h.frequencia_percentual}%` : '-'}
                      </TableCell>
                      <TableCell>{h.situacao || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {permiteManual && (
        <ModalHistoricoManual
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={carregar}
          personId={pessoaId}
          schoolId={schoolId}
          pessoaLogadaId={pessoaLogadaId}
        />
      )}
    </>
  )
}