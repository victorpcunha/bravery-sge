'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/feedback/status-badge'
import { MensalidadeBadge } from '@/components/faturamento/situacao-badge'
import {
  getPlanoPorMatricula,
  criarPlanoIndividual,
  atualizarPlano,
  baixarMensalidades,
  getResponsaveisDaMatricula,
  type PlanoDetalhado,
} from '@/lib/actions/faturamento'
import {
  derivarSituacaoMensalidade,
  formatarCompetencia,
  formatarMoeda,
  hojeISO,
  MESES_PT,
} from '@/lib/faturamento-calculo'
import { toast } from 'sonner'

function dataBR(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function PlanoDialog({
  open,
  onOpenChange,
  schoolId,
  matriculaId,
  alunoNome,
  pessoaId,
  onDone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  schoolId: string
  matriculaId: string
  alunoNome: string
  pessoaId: string | null
  onDone: () => void
}) {
  const [plano, setPlano] = useState<PlanoDetalhado | null>(null)
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState('')
  const [dia, setDia] = useState('10')
  const [mesIni, setMesIni] = useState('1')
  const [mesFim, setMesFim] = useState('12')
  const [respId, setRespId] = useState('__none__')
  const [responsaveis, setResponsaveis] = useState<{ id: string; nome_completo: string; principal: boolean }[]>([])
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const p = await getPlanoPorMatricula(matriculaId)
      setPlano(p)
      if (p) {
        setValor(String(p.valor_mensalidade))
        setDia(String(p.dia_vencimento))
        setMesIni(String(p.mes_inicial))
        setMesFim(String(p.mes_final))
        setRespId(p.responsavel_id || '__none__')
      }
      setResponsaveis(await getResponsaveisDaMatricula(matriculaId))
    } catch { toast.error('Erro ao carregar plano') }
    finally { setLoading(false); setEditando(false) }
  }

  useEffect(() => {
    if (open && matriculaId) {
      setPlano(null)
      setEditando(false)
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, matriculaId])

  const handleSalvar = async () => {
    setSaving(true)
    try {
      const payload = {
        valor_mensalidade: Number(valor),
        dia_vencimento: Number(dia),
        mes_inicial: Number(mesIni),
        mes_final: Number(mesFim),
        responsavel_id: respId !== '__none__' ? respId : null,
      }
      if (plano) {
        await atualizarPlano(plano.id, payload, pessoaId)
        toast.success('Plano atualizado')
      } else {
        await criarPlanoIndividual(schoolId, { matricula_id: matriculaId, ...payload }, pessoaId)
        toast.success('Plano criado')
      }
      onDone()
      load()
    } catch (e: any) { toast.error(e.message || 'Erro ao salvar plano') }
    finally { setSaving(false) }
  }

  const handleBaixar = async (id: string) => {
    try {
      const r = await baixarMensalidades([id], {
        pagoEm: hojeISO(),
        forma: 'Manual',
        observacao: 'Baixa individual pelo plano',
      }, pessoaId)
      if (r.baixadas > 0) { toast.success('Mensalidade baixada'); onDone(); load() }
      else toast.error(r.ignoradas[0]?.motivo || 'Não foi possível baixar')
    } catch (e: any) { toast.error(e.message || 'Erro ao baixar') }
  }

  const hoje = hojeISO()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 flex flex-col max-h-[90vh] max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle className="font-heading text-[20px] font-semibold">Plano de cobrança — {plano?.aluno_nome || alunoNome}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading ? (
            <div className="h-10 bg-muted rounded-lg animate-pulse" />
          ) : (
            <>
              {!plano && !editando && (
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <p className="text-[15px]">Esta matrícula ainda não possui plano de cobrança.</p>
                  <Button size="sm" onClick={() => setEditando(true)}>Criar plano</Button>
                </div>
              )}

              {(plano || editando) && (
                <div className="rounded-lg border border-border p-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {plano && !plano.config_origem_id && (
                      <StatusBadge status="warning">Exceção em relação ao padrão</StatusBadge>
                    )}
                    {plano?.situacao === 'encerrado' && (
                      <StatusBadge status="muted">Plano encerrado</StatusBadge>
                    )}
                    {!plano?.responsavel_id && plano && (
                      <StatusBadge status="destructive">Sem responsável financeiro</StatusBadge>
                    )}
                  </div>

                  {!editando && plano ? (
                    <div className="flex flex-wrap items-end gap-4">
                      <div className="flex-1 min-w-[200px] text-[15px] space-y-1">
                        <p><strong className="tabular-nums">{formatarMoeda(plano.valor_mensalidade)}</strong> · venc. dia {plano.dia_vencimento}</p>
                        <p className="text-muted-foreground text-[13px]">
                          {MESES_PT[plano.mes_inicial - 1]}–{MESES_PT[plano.mes_final - 1]} · {plano.qtd_mensalidades} mensalidade(s) · {plano.turma_nome}
                        </p>
                        <p className="text-muted-foreground text-[13px]">Responsável: {plano.responsavel_nome || '—'}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setEditando(true)}>Ajustar</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[14px] font-medium">Valor (R$) *</Label>
                        <Input type="number" step="0.01" min="0" value={valor} onChange={e => setValor(e.target.value)} aria-required="true" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[14px] font-medium">Vencimento *</Label>
                        <Input type="number" min="1" max="31" value={dia} onChange={e => setDia(e.target.value)} aria-required="true" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[14px] font-medium">Responsável</Label>
                        <Select value={respId} onValueChange={setRespId}>
                          <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">Sem responsável</SelectItem>
                            {responsaveis.map(r => <SelectItem key={r.id} value={r.id}>{r.nome_completo}{r.principal ? ' (principal)' : ''}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[14px] font-medium">Mês inicial</Label>
                        <Select value={mesIni} onValueChange={setMesIni}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {MESES_PT.map((n, i) => <SelectItem key={n} value={String(i + 1)}>{n}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[14px] font-medium">Mês final</Label>
                        <Select value={mesFim} onValueChange={setMesFim}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {MESES_PT.map((n, i) => <SelectItem key={n} value={String(i + 1)}>{n}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end gap-2">
                        <Button onClick={handleSalvar} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
                        {plano && <Button variant="outline" onClick={() => setEditando(false)}>Voltar</Button>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {plano && plano.mensalidades.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Competência</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Situação</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plano.mensalidades.map(m => {
                        const derivada = derivarSituacaoMensalidade(m.situacao, m.vencimento, hoje)
                        return (
                          <TableRow key={m.id}>
                            <TableCell className="tabular-nums">{formatarCompetencia(m.competencia)}</TableCell>
                            <TableCell className="tabular-nums font-mono">{dataBR(m.vencimento)}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatarMoeda(m.valor)}</TableCell>
                            <TableCell><MensalidadeBadge situacao={derivada} /></TableCell>
                            <TableCell className="text-right">
                              {m.situacao === 'pendente' ? (
                                <Button size="sm" variant="outline" onClick={() => handleBaixar(m.id)}>Baixar</Button>
                              ) : (
                                <span className="text-[13px] text-muted-foreground">
                                  {m.pago_em ? `${dataBR(m.pago_em)}${m.forma_baixa ? ` · ${m.forma_baixa}` : ''}` : '—'}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </div>
        <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
