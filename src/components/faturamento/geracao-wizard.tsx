'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertTriangle, CheckCircle2, ListChecks } from 'lucide-react'
import {
  simularGeracao,
  gerarPlanosEmMassa,
  getEtapasEnsino,
} from '@/lib/actions/faturamento'
import { getTurmasAtivas } from '@/lib/actions/matriculas'
import type { ResumoGeracao, ResultadoLote } from '@/lib/faturamento-tipos'
import { formatarMoeda } from '@/lib/faturamento-calculo'
import { toast } from 'sonner'

type Etapa = 'abrangencia' | 'revisao' | 'resultado'

export function GeracaoWizard({
  open,
  onOpenChange,
  schoolId,
  anoLetivoId,
  pessoaId,
  onDone,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  schoolId: string
  anoLetivoId: string
  pessoaId: string | null
  onDone: () => void
}) {
  const [etapa, setEtapa] = useState<Etapa>('abrangencia')
  const [turmas, setTurmas] = useState<any[]>([])
  const [etapas, setEtapas] = useState<{ id: string; etapa_nome: string }[]>([])
  const [turmaId, setTurmaId] = useState('__all__')
  const [etapaId, setEtapaId] = useState('__all__')
  const [resumo, setResumo] = useState<ResumoGeracao | null>(null)
  const [substituir, setSubstituir] = useState(false)
  const [confirmSub, setConfirmSub] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoLote | null>(null)

  useEffect(() => {
    if (!open || !schoolId || !anoLetivoId) return
    setEtapa('abrangencia')
    setResumo(null)
    setResultado(null)
    setSubstituir(false)
    setConfirmSub(false)
    getTurmasAtivas(schoolId, anoLetivoId).then(setTurmas).catch(() => setTurmas([]))
    getEtapasEnsino(schoolId, anoLetivoId).then(setEtapas).catch(() => setEtapas([]))
  }, [open, schoolId, anoLetivoId])

  const abrangencia = {
    anoLetivoId,
    turmaId: turmaId !== '__all__' ? turmaId : undefined,
    etapaId: etapaId !== '__all__' ? etapaId : undefined,
  }

  const handleSimular = async () => {
    setProcessando(true)
    try {
      const r = await simularGeracao(schoolId, abrangencia)
      setResumo(r)
      setEtapa('revisao')
    } catch (e: any) { toast.error(e.message || 'Erro ao simular geração') }
    finally { setProcessando(false) }
  }

  const handleConfirmar = async () => {
    if (substituir && !confirmSub) {
      toast.error('Confirme explicitamente a substituição para continuar')
      return
    }
    setProcessando(true)
    try {
      const r = await gerarPlanosEmMassa(schoolId, abrangencia, { substituir }, pessoaId)
      setResultado(r)
      setEtapa('resultado')
      toast.success(`${r.criados.length} plano(s) gerado(s)`)
      onDone()
    } catch (e: any) { toast.error(e.message || 'Erro ao gerar planos') }
    finally { setProcessando(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 flex flex-col max-h-[90vh] max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle className="font-heading text-[20px] font-semibold">Gerar planos em massa</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {etapa === 'abrangencia' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[14px] font-medium">Turma (opcional)</Label>
                  <Select value={turmaId} onValueChange={setTurmaId}>
                    <SelectTrigger><SelectValue placeholder="Todas as turmas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">Todas as turmas</SelectItem>
                      {turmas.map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[14px] font-medium">Etapa (opcional)</Label>
                  <Select value={etapaId} onValueChange={setEtapaId}>
                    <SelectTrigger><SelectValue placeholder="Todas as etapas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">Todas as etapas</SelectItem>
                      {etapas.map(e => <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground">
                Serão consideradas as matrículas ativas da abrangência. O mês inicial de cada plano segue o mês de entrada do aluno.
              </p>
            </div>
          )}

          {etapa === 'revisao' && resumo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[13px] text-muted-foreground">Serão configuradas</p>
                  <p className="text-[28px] font-bold tabular-nums">{resumo.seguirãoPadrao}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[13px] text-muted-foreground">Já configuradas</p>
                  <p className="text-[28px] font-bold tabular-nums">{resumo.jaConfiguradas}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-[13px] text-muted-foreground">Mensalidades</p>
                  <p className="text-[28px] font-bold tabular-nums">{resumo.mensalidadesEstimadas}</p>
                </div>
              </div>
              {resumo.valorTotalPrevisto !== null && (
                <p className="text-[15px]">Valor total previsto: <strong className="tabular-nums">{formatarMoeda(resumo.valorTotalPrevisto)}</strong></p>
              )}
              {resumo.semResponsavel > 0 && (
                <p className="text-[13px] text-muted-foreground">{resumo.semResponsavel} matrícula(s) sem responsável vinculado — o plano será criado e a pendência aparecerá na Visão Geral.</p>
              )}
              {resumo.naoAfetadas > 0 && (
                <p className="text-[13px] text-muted-foreground">{resumo.naoAfetadas} matrícula(s) não serão afetadas (entrada após o mês final).</p>
              )}
              {resumo.inconsistentes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[14px] font-medium flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />{resumo.inconsistentes.length} inconsistência(s) — não serão geradas</p>
                  <ul className="text-[13px] text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
                    {resumo.inconsistentes.map(i => (
                      <li key={i.matriculaId}><strong className="text-foreground">{i.alunoNome}:</strong> {i.motivo} — {i.proximoPasso}</li>
                    ))}
                  </ul>
                </div>
              )}
              {resumo.jaConfiguradas > 0 && (
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <p className="text-[14px] font-medium">{resumo.jaConfiguradas} matrícula(s) já possuem plano.</p>
                  <label className="flex items-center gap-2 text-[14px]">
                    <Checkbox checked={substituir} onCheckedChange={v => { setSubstituir(v === true); setConfirmSub(false) }} />
                    Substituir configurações existentes
                  </label>
                  {substituir && (
                    <label className="flex items-center gap-2 text-[14px] text-destructive">
                      <Checkbox checked={confirmSub} onCheckedChange={v => setConfirmSub(v === true)} />
                      Confirmo que planos com mensalidades não pagas serão refeitos (pagas nunca são apagadas)
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          {etapa === 'resultado' && resultado && (
            <div className="space-y-3">
              <EmptyState
                icon={CheckCircle2}
                title={`${resultado.criados.length} plano(s) gerado(s)`}
                description={resultado.falhas.length > 0 || resultado.preservados > 0
                  ? `${resultado.preservados} preservado(s), ${resultado.falhas.length} falha(s).`
                  : 'Todos os planos da abrangência foram criados.'}
              />
              {resultado.falhas.length > 0 && (
                <ul className="text-[13px] text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
                  {resultado.falhas.map(f => (
                    <li key={f.id}><strong className="text-foreground">{f.nome}:</strong> {f.motivo}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
          {etapa === 'abrangencia' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button onClick={handleSimular} disabled={processando}><ListChecks className="h-4 w-4" />{processando ? 'Analisando...' : 'Revisar'}</Button>
            </>
          )}
          {etapa === 'revisao' && (
            <>
              <Button variant="outline" onClick={() => setEtapa('abrangencia')}>Voltar</Button>
              <Button onClick={handleConfirmar} disabled={processando || !resumo || resumo.seguirãoPadrao === 0}>{processando ? 'Gerando...' : 'Confirmar geração'}</Button>
            </>
          )}
          {etapa === 'resultado' && (
            <Button onClick={() => onOpenChange(false)}>Concluir</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
