'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { Settings2, Plus, Pencil, Trash2, ShieldAlert, Wallet } from 'lucide-react'
import {
  getConfiguracoes,
  salvarConfiguracao,
  excluirConfiguracao,
  getEtapasEnsino,
  type ConfiguracaoRow,
} from '@/lib/actions/faturamento'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { useTabActive } from '@/lib/tab-params'
import {
  formatarMoeda,
  MESES_PT,
  somenteDigitos,
  formatarCentavosParaBRL,
  centavosDeValor,
} from '@/lib/faturamento-calculo'
import { gruposEtapas } from '@/app/(app)/gestao-academica/estrutura-academica/TabEtapas'
import { toast } from 'sonner'

const schema = z.object({
  titulo: z.string({ error: 'Informe o título' }).trim().min(1, 'Informe um título para identificar a configuração').max(120, 'Máximo de 120 caracteres'),
  valor_mensalidade: z.number({ error: 'Informe o valor' }).gt(0, 'Informe um valor maior que zero'),
  dia_vencimento: z.number({ error: 'Informe o dia' }).int().min(1, 'Dia mínimo: 1').max(31, 'Dia máximo: 31'),
  mes_inicial: z.number().int().min(1).max(12),
  mes_final: z.number().int().min(1).max(12),
}).refine(d => d.mes_final >= d.mes_inicial, { message: 'Mês final deve ser maior ou igual ao inicial', path: ['mes_final'] })

type FormValues = z.infer<typeof schema>

type EtapaRow = { id: string; etapa_codigo: number; etapa_nome: string }

export default function ConfiguracaoClient() {
  const { user, schoolId, isSuperAdmin, allSchools, loading: authLoading, pessoaId } = useAuth()
  const { pode } = usePermissoes(schoolId)
  const router = useRouter()
  const tabActive = useTabActive()

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anos, setAnos] = useState<any[]>([])
  const [anoId, setAnoId] = useState('')
  const [etapas, setEtapas] = useState<EtapaRow[]>([])
  const [configs, setConfigs] = useState<ConfiguracaoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [etapasSel, setEtapasSel] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { titulo: '', valor_mensalidade: 0, dia_vencimento: 10, mes_inicial: 1, mes_final: 12 },
  })
  const mesInicialWatch = watch('mes_inicial')
  const mesFinalWatch = watch('mes_final')

  const effectiveSchoolId = selectedSchoolId || schoolId
  const podeEditar = pode.criar('faturamento.configuracao') || pode.editar('faturamento.configuracao')

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
    if (!effectiveSchoolId || !anoId) { setEtapas([]); return }
    getEtapasEnsino(effectiveSchoolId, anoId).then(setEtapas).catch(() => setEtapas([]))
  }, [effectiveSchoolId, anoId])

  const load = useCallback(async () => {
    if (!effectiveSchoolId || !anoId) { setLoading(false); return }
    setLoading(true)
    try {
      setConfigs(await getConfiguracoes(effectiveSchoolId, anoId))
    } catch { toast.error('Erro ao carregar configurações') }
    finally { setLoading(false) }
  }, [effectiveSchoolId, anoId])

  useEffect(() => { if (tabActive) load() }, [tabActive, load])

  const porCodigo = new Map<number, EtapaRow>()
  for (const e of etapas) {
    if (!porCodigo.has(e.etapa_codigo)) porCodigo.set(e.etapa_codigo, e)
  }

  const nomeEtapas = (ids: string[] | null) => {
    if (!ids || ids.length === 0) return 'Todas as etapas (padrão geral)'
    const oficial = (id: string) => {
      const row = etapas.find(e => e.id === id)
      if (!row) return null
      const item = gruposEtapas.flatMap(g => g.etapas).find(x => x.codigo === row.etapa_codigo)
      return item?.nome || row.etapa_nome
    }
    return ids.map(id => oficial(id) || 'Etapa').join(', ')
  }

  const openNovo = () => {
    setEditingId(null)
    setEtapasSel([])
    reset({ titulo: '', valor_mensalidade: 0, dia_vencimento: 10, mes_inicial: 1, mes_final: 12 })
    setModalOpen(true)
  }

  const startEdit = (c: ConfiguracaoRow) => {
    setEditingId(c.id)
    setEtapasSel(c.etapa_ids || [])
    reset({ titulo: c.titulo || '', valor_mensalidade: Number(c.valor_mensalidade), dia_vencimento: c.dia_vencimento, mes_inicial: c.mes_inicial, mes_final: c.mes_final })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setEtapasSel([])
  }

  const onSubmit = async (values: FormValues) => {
    if (!effectiveSchoolId || !anoId) return
    setSaving(true)
    try {
      await salvarConfiguracao(effectiveSchoolId, {
        id: editingId || undefined,
        ano_letivo_id: anoId,
        etapa_ids: etapasSel.length > 0 ? etapasSel : null,
        ...values,
      }, pessoaId || null)
      toast.success(editingId ? 'Configuração atualizada' : 'Configuração salva')
      closeModal()
      load()
    } catch (e: any) { toast.error(e.message || 'Erro ao salvar configuração') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget || !effectiveSchoolId) return
    try {
      await excluirConfiguracao(deleteTarget, effectiveSchoolId, pessoaId || null)
      toast.success('Configuração excluída')
      setDeleteTarget(null)
      load()
    } catch (e: any) { toast.error(e.message || 'Erro ao excluir') }
  }

  if (authLoading) {
    return <PageContainer><div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></PageContainer>
  }

  if (!pode.visualizar('faturamento.configuracao')) {
    return <PageContainer><Card><EmptyState icon={ShieldAlert} title="Sem permissão" description="Você não tem acesso à Configuração de Faturamento." /></Card></PageContainer>
  }

  return (
    <PageContainer>
      <PageHeader
        icon={Settings2}
        title="Configuração de Faturamento"
        description="Defina o padrão de cobrança por ano letivo. Salvar não altera planos já gerados."
      />

      <PageSection variant="compact" title="Contexto" className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isSuperAdmin && (
            <div className="space-y-1.5">
              <Label className="text-[14px] font-medium">Unidade Escolar</Label>
              <Select value={selectedSchoolId || schoolId || ''} onValueChange={setSelectedSchoolId}>
                <SelectTrigger><SelectValue placeholder="Selecione a escola" /></SelectTrigger>
                <SelectContent>
                  {allSchools.map(s => <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-[14px] font-medium">Ano Letivo</Label>
            <Select value={anoId} onValueChange={setAnoId}>
              <SelectTrigger><SelectValue placeholder="Selecione o ano" /></SelectTrigger>
              <SelectContent>
                {anos.map(a => <SelectItem key={a.id} value={a.id}>{a.descricao || a.ano}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PageSection>

      <PageSection
        variant="flush"
        title={`${configs.length} configuração(ões)`}
        actions={podeEditar ? <Button size="sm" onClick={openNovo}><Plus className="h-4 w-4" />Nova Configuração</Button> : undefined}
      >
        {loading ? (
          <Card><div className="p-6 space-y-3"><div className="h-10 bg-muted rounded-lg animate-pulse" /></div></Card>
        ) : configs.length === 0 ? (
          <Card><EmptyState icon={Wallet} title="Nenhuma configuração" description="Cadastre o padrão de cobrança para gerar os planos em massa." action={podeEditar ? <Button onClick={openNovo}><Plus className="h-4 w-4" />Nova Configuração</Button> : undefined} /></Card>
        ) : (
          <div className="space-y-3 p-4">
            {configs.map(c => (
              <Card key={c.id}>
                <CardContent className="p-4 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-[16px] font-semibold">{c.titulo || 'Configuração'}</p>
                    <p className="text-[15px]">{formatarMoeda(Number(c.valor_mensalidade))} <span className="text-muted-foreground font-normal">· venc. dia {c.dia_vencimento}</span></p>
                    <p className="text-[13px] text-muted-foreground">{MESES_PT[c.mes_inicial - 1]} – {MESES_PT[c.mes_final - 1]} · {nomeEtapas(c.etapa_ids)}</p>
                  </div>
                  {!c.etapa_ids && <StatusBadge status="primary">Padrão geral</StatusBadge>}
                  {podeEditar && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => startEdit(c)} aria-label="Editar"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(c.id)} aria-label="Excluir"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageSection>

      <Dialog open={modalOpen} onOpenChange={o => { if (!o) closeModal() }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle className="font-display text-[20px] font-semibold">{editingId ? 'Editar Configuração' : 'Nova Configuração'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Ajuste o padrão de cobrança.' : 'Defina o padrão de cobrança do ano letivo.'} A alteração não modifica planos já gerados.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-0 flex-1">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="titulo" className="text-[14px] font-medium">Título *</Label>
                <Input
                  id="titulo"
                  type="text"
                  maxLength={120}
                  placeholder="Ex.: 2026 - Infantil e Anos Iniciais"
                  aria-required="true"
                  {...register('titulo')}
                />
                {errors.titulo && <p role="alert" className="text-[13px] text-destructive">{errors.titulo.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="valor" className="text-[14px] font-medium">Valor da mensalidade (R$) *</Label>
                  <Controller
                    name="valor_mensalidade"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="valor"
                        type="text"
                        inputMode="numeric"
                        placeholder="0,00"
                        aria-required="true"
                        value={formatarCentavosParaBRL(centavosDeValor(field.value || 0))}
                        onChange={e => field.onChange(Number(somenteDigitos(e.target.value)) / 100)}
                      />
                    )}
                  />
                  {errors.valor_mensalidade && <p role="alert" className="text-[13px] text-destructive">{errors.valor_mensalidade.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dia" className="text-[14px] font-medium">Dia de vencimento *</Label>
                  <Input
                    id="dia"
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="10"
                    aria-required="true"
                    {...register('dia_vencimento', {
                      setValueAs: v => (v === '' || v == null ? NaN : Number(String(v).replace(/\D/g, ''))),
                    })}
                  />
                  {errors.dia_vencimento && <p role="alert" className="text-[13px] text-destructive">{errors.dia_vencimento.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[14px] font-medium">Mês inicial *</Label>
                  <Select value={String(mesInicialWatch)} onValueChange={v => setValue('mes_inicial', Number(v), { shouldValidate: true })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MESES_PT.map((n, i) => <SelectItem key={n} value={String(i + 1)}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[14px] font-medium">Mês final *</Label>
                  <Select value={String(mesFinalWatch)} onValueChange={v => setValue('mes_final', Number(v), { shouldValidate: true })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MESES_PT.map((n, i) => <SelectItem key={n} value={String(i + 1)}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[14px] font-medium">Etapas de ensino (vazio = padrão geral)</Label>
                {etapas.length === 0 ? (
                  <p className="text-[13px] text-muted-foreground">Nenhuma etapa ativa neste ano letivo. Configure as etapas em Estrutura Acadêmica.</p>
                ) : (
                  gruposEtapas.map(grupo => {
                    const itens = grupo.etapas.filter(e => porCodigo.has(e.codigo))
                    if (itens.length === 0) return null
                    return (
                      <div key={grupo.titulo} className="space-y-1.5">
                        <p className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">{grupo.titulo}</p>
                        <div className="flex flex-wrap gap-2">
                          {itens.map(item => {
                            const row = porCodigo.get(item.codigo)!
                            return (
                              <ClickablePill
                                key={row.id}
                                label={item.nome}
                                active={etapasSel.includes(row.id)}
                                onClick={() => setEtapasSel(prev => prev.includes(row.id) ? prev.filter(x => x !== row.id) : [...prev, row.id])}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              {errors.mes_final && <p role="alert" className="text-[13px] text-destructive">{errors.mes_final.message}</p>}
            </div>
            <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
              <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={o => !o && setDeleteTarget(null)}
        title="Excluir configuração?"
        description="Planos já gerados a partir dela serão mantidos (viram exceção). Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </PageContainer>
  )
}
