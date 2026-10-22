'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar, FilterField } from '@/components/layout/filter-bar'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { MensalidadeBadge } from '@/components/faturamento/situacao-badge'
import { GeracaoWizard } from '@/components/faturamento/geracao-wizard'
import { Receipt, ShieldAlert, Wallet, CheckCircle2 } from 'lucide-react'
import {
  listarCobrancas,
  baixarMensalidades,
  isentarMensalidades,
  cancelarMensalidades,
  type CobrancaItem,
} from '@/lib/actions/faturamento'
import { getTurmasAtivas } from '@/lib/actions/matriculas'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { useTabActive } from '@/lib/tab-params'
import { formatarMoeda, formatarCompetencia } from '@/lib/faturamento-calculo'
import { toast } from 'sonner'

const SITUACOES = [
  { value: 'todas', label: 'Todas' },
  { value: 'pagas', label: 'Pagas' },
  { value: 'em_aberto', label: 'Em aberto' },
  { value: 'vencidas', label: 'Vencidas' },
  { value: 'canceladas', label: 'Canceladas' },
  { value: 'isentas', label: 'Isentas' },
] as const

function dataBR(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function CobrancasClient() {
  const { user, schoolId, isSuperAdmin, allSchools, loading: authLoading, pessoaId } = useAuth()
  const { pode } = usePermissoes(schoolId)
  const router = useRouter()
  const tabActive = useTabActive()

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anos, setAnos] = useState<any[]>([])
  const [anoId, setAnoId] = useState('')
  const [turmas, setTurmas] = useState<any[]>([])
  const [turmaId, setTurmaId] = useState('__all__')
  const [busca, setBusca] = useState('')
  const [situacao, setSituacao] = useState<string>('todas')
  const [itens, setItens] = useState<CobrancaItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [baixaOpen, setBaixaOpen] = useState(false)
  const [pagoEm, setPagoEm] = useState('')
  const [forma, setForma] = useState('')
  const [obs, setObs] = useState('')
  const [motivoOpen, setMotivoOpen] = useState<'isentar' | 'cancelar' | null>(null)
  const [motivo, setMotivo] = useState('')
  const [wizardOpen, setWizardOpen] = useState(false)

  const effectiveSchoolId = selectedSchoolId || schoolId
  const podeEditar = pode.editar('faturamento.cobrancas')
  const podeGerar = pode.criar('faturamento.cobrancas')

  useEffect(() => { if (!authLoading && !user) router.push('/login') }, [user, authLoading, router])

  useEffect(() => {
    if (!effectiveSchoolId) { setLoading(false); return }
    getAnosLetivosAtivos(effectiveSchoolId).then(lista => {
      setAnos(lista)
      const ativo = lista.find((a: any) => a.status === 'ativo')
      setAnoId(ativo?.id || lista[0]?.id || '')
    }).catch(() => setAnos([]))
  }, [effectiveSchoolId])

  useEffect(() => {
    if (!effectiveSchoolId || !anoId) { setTurmas([]); return }
    getTurmasAtivas(effectiveSchoolId, anoId).then(setTurmas).catch(() => setTurmas([]))
  }, [effectiveSchoolId, anoId])

  const load = useCallback(async () => {
    if (!effectiveSchoolId || !anoId) { setLoading(false); return }
    setLoading(true)
    try {
      const r = await listarCobrancas(effectiveSchoolId, {
        anoLetivoId: anoId,
        turmaId: turmaId !== '__all__' ? turmaId : undefined,
        busca: busca.trim() || undefined,
        situacao: situacao as any,
        page,
      })
      setItens(r.itens)
      setTotal(r.total)
      setSelecionados(prev => prev.filter(id => r.itens.some(i => i.id === id)))
    } catch { toast.error('Erro ao carregar cobranças') }
    finally { setLoading(false) }
  }, [effectiveSchoolId, anoId, turmaId, busca, situacao, page])

  useEffect(() => { if (tabActive) load() }, [tabActive, load])
  useEffect(() => { setPage(1) }, [anoId, turmaId, busca, situacao])

  const toggleTodos = () => {
    const pendentes = itens.filter(i => i.situacao === 'pendente').map(i => i.id)
    setSelecionados(prev => (pendentes.every(id => prev.includes(id)) && pendentes.length > 0 ? [] : pendentes))
  }

  const handleBaixa = async () => {
    try {
      const r = await baixarMensalidades(selecionados, { pagoEm, forma, observacao: obs || undefined }, pessoaId || null)
      toast.success(`${r.baixadas} mensalidade(s) baixada(s)${r.ignoradas.length > 0 ? ` — ${r.ignoradas.length} ignorada(s) (já não pendentes)` : ''}`)
      setBaixaOpen(false)
      setSelecionados([])
      setPagoEm('')
      setForma('')
      setObs('')
      load()
    } catch (e: any) { toast.error(e.message || 'Erro ao registrar pagamento') }
  }

  const handleMotivo = async () => {
    try {
      if (motivoOpen === 'isentar') {
        const r = await isentarMensalidades(selecionados, motivo, pessoaId || null)
        toast.success(`${r.alteradas} mensalidade(s) isenta(s)`)
      } else {
        const r = await cancelarMensalidades(selecionados, motivo, pessoaId || null)
        toast.success(`${r.alteradas} mensalidade(s) cancelada(s)`)
      }
      setMotivoOpen(null)
      setMotivo('')
      setSelecionados([])
      load()
    } catch (e: any) { toast.error(e.message || 'Erro na operação') }
  }

  if (authLoading) {
    return <PageContainer><div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></PageContainer>
  }

  if (!pode.visualizar('faturamento.cobrancas')) {
    return <PageContainer><Card><EmptyState icon={ShieldAlert} title="Sem permissão" description="Você não tem acesso às Cobranças." /></Card></PageContainer>
  }

  const totalPages = Math.max(1, Math.ceil(total / 10))

  return (
    <PageContainer>
      <PageHeader
        icon={Receipt}
        title="Cobranças"
        description="Acompanhe as mensalidades geradas e registre pagamentos."
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar searchValue={busca} onSearchChange={setBusca} searchPlaceholder="Buscar por aluno ou responsável..." searchLabel="Buscar">
          {isSuperAdmin && (
            <FilterField label="Unidade Escolar">
              <Select value={selectedSchoolId || schoolId || ''} onValueChange={setSelectedSchoolId}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Escola" /></SelectTrigger>
                <SelectContent>
                  {allSchools.map(s => <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>)}
                </SelectContent>
              </Select>
            </FilterField>
          )}
          <FilterField label="Ano Letivo">
            <Select value={anoId} onValueChange={setAnoId}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Ano" /></SelectTrigger>
              <SelectContent>
                {anos.map(a => <SelectItem key={a.id} value={a.id}>{a.descricao || a.ano}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Turma">
            <Select value={turmaId} onValueChange={setTurmaId}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Turma" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas as turmas</SelectItem>
                {turmas.map(t => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Situação">
            <Select value={situacao} onValueChange={setSituacao}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Situação" /></SelectTrigger>
              <SelectContent>
                {SITUACOES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
        </FilterBar>
      </PageSection>

      <PageSection
        variant="flush"
        title={`${total} cobrança(s)`}
        actions={
          <div className="flex gap-2">
            {podeEditar && (
              <>
                <Button size="sm" disabled={selecionados.length === 0} onClick={() => setBaixaOpen(true)}><CheckCircle2 className="h-4 w-4" />Registrar pagamento{selecionados.length > 0 ? ` (${selecionados.length})` : ''}</Button>
                <Button size="sm" variant="outline" disabled={selecionados.length === 0} onClick={() => setMotivoOpen('isentar')}>Isentar</Button>
                <Button size="sm" variant="outline" disabled={selecionados.length === 0} onClick={() => setMotivoOpen('cancelar')}>Cancelar</Button>
              </>
            )}
            {podeGerar && <Button size="sm" variant="outline" onClick={() => setWizardOpen(true)}><Wallet className="h-4 w-4" />Gerar planos</Button>}
          </div>
        }
      >
        {loading ? (
          <Card><div className="p-6 space-y-3"><div className="h-10 bg-muted rounded-lg animate-pulse" /></div></Card>
        ) : itens.length === 0 ? (
          <Card><EmptyState icon={Receipt} title="Nenhuma cobrança" description="Ajuste os filtros ou gere os planos do ano letivo." /></Card>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-muted z-10 w-10">
                    {podeEditar && <Checkbox className="size-5 border-foreground/40" checked={itens.some(i => i.situacao === 'pendente') && itens.filter(i => i.situacao === 'pendente').every(i => selecionados.includes(i.id))} onCheckedChange={toggleTodos} aria-label="Selecionar pendentes" />}
                  </TableHead>
                  <TableHead className="sticky left-0 bg-muted z-10">Aluno</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="sticky left-0 bg-background z-10">
                      {podeEditar && i.situacao === 'pendente' && (
                        <Checkbox
                          className="size-5 border-foreground/40"
                          checked={selecionados.includes(i.id)}
                          onCheckedChange={v => setSelecionados(prev => v ? [...prev, i.id] : prev.filter(x => x !== i.id))}
                          aria-label={`Selecionar ${i.aluno_nome} ${i.competencia}`}
                        />
                      )}
                    </TableCell>
                    <TableCell className="sticky left-0 bg-background z-10 font-medium text-foreground">{i.aluno_nome}</TableCell>
                    <TableCell className="text-muted-foreground">{i.turma_nome}</TableCell>
                    <TableCell className="tabular-nums">{formatarCompetencia(i.competencia)}</TableCell>
                    <TableCell className="tabular-nums font-mono">{dataBR(i.vencimento)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatarMoeda(i.valor)}</TableCell>
                    <TableCell><MensalidadeBadge situacao={i.derivada} /></TableCell>
                    <TableCell className="text-muted-foreground text-[13px]">
                      {i.pago_em ? `${dataBR(i.pago_em)}${i.forma_baixa ? ` · ${i.forma_baixa}` : ''}` : i.responsavel_nome || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4">
              <Pagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={10} onPageChange={setPage} />
            </div>
          </div>
        )}
      </PageSection>

      <Dialog open={baixaOpen} onOpenChange={setBaixaOpen}>
        <DialogContent className="p-0 gap-0 flex flex-col max-h-[90vh] max-w-lg">
          <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
            <DialogTitle className="font-heading text-[20px] font-semibold">Registrar pagamento ({selecionados.length})</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[14px] font-medium">Data do pagamento *</Label>
                <Input type="date" value={pagoEm} onChange={e => setPagoEm(e.target.value)} aria-required="true" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px] font-medium">Forma de pagamento *</Label>
                <Input value={forma} onChange={e => setForma(e.target.value)} placeholder="Ex.: Pix, dinheiro, boleto" aria-required="true" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[14px] font-medium">Observação</Label>
              <Input value={obs} onChange={e => setObs(e.target.value)} placeholder="Opcional" />
            </div>
          </div>
          <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
            <Button variant="outline" onClick={() => setBaixaOpen(false)}>Cancelar</Button>
            <Button onClick={handleBaixa}>Confirmar baixa</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={motivoOpen !== null} onOpenChange={o => { if (!o) { setMotivoOpen(null); setMotivo('') } }}>
        <DialogContent className="p-0 gap-0 flex flex-col max-h-[90vh] max-w-lg">
          <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
            <DialogTitle className="font-heading text-[20px] font-semibold">
              {motivoOpen === 'isentar' ? `Isentar ${selecionados.length} mensalidade(s)?` : `Cancelar ${selecionados.length} mensalidade(s)?`}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <p className="text-[13px] text-muted-foreground">Somente mensalidades pendentes serão afetadas.</p>
            <div className="space-y-1.5">
              <Label className="text-[14px] font-medium">Motivo *</Label>
              <Input value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Motivo (obrigatório)" aria-required="true" />
            </div>
          </div>
          <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
            <Button variant="outline" onClick={() => { setMotivoOpen(null); setMotivo('') }}>Voltar</Button>
            <Button onClick={handleMotivo}>{motivoOpen === 'isentar' ? 'Isentar' : 'Cancelar'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {effectiveSchoolId && anoId && (
        <GeracaoWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          schoolId={effectiveSchoolId}
          anoLetivoId={anoId}
          pessoaId={pessoaId || null}
          onDone={load}
        />
      )}
    </PageContainer>
  )
}
