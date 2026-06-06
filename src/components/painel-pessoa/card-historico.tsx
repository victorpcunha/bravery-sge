'use client'

import { useState, useEffect } from 'react'
import { getHistoricoSistema, type HistoricoAno } from '@/lib/actions/painel-pessoa'
import { getConfigEscola } from '@/lib/actions/historico-manual'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, Loader2, Plus, GraduationCap } from 'lucide-react'
import ModalHistoricoManual from './modal-historico-manual'

type Props = {
  pessoaId: string
  schoolId: string
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
            <GraduationCap className="h-4 w-4 text-orange-500" />
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
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-1 pr-2">Ano</th>
                    <th className="text-left py-1 pr-2">Turma</th>
                    <th className="text-left py-1 pr-2">Etapa</th>
                    <th className="text-left py-1 pr-2">Freq.</th>
                    <th className="text-left py-1">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map(h => (
                    <tr key={`${h.ano_letivo_id}-${h.turma_nome}`} className="border-b last:border-0">
                      <td className="py-1.5 pr-2 font-medium">{h.ano}</td>
                      <td className="py-1.5 pr-2">{h.turma_nome}</td>
                      <td className="py-1.5 pr-2">{h.etapa_nome}</td>
                      <td className="py-1.5 pr-2">
                        {h.frequencia_percentual !== null ? `${h.frequencia_percentual}%` : '-'}
                      </td>
                      <td className="py-1.5">{h.situacao || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
