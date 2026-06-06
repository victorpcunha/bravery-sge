'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Plus, BookOpen, Calendar, GraduationCap, Clock, Users, Trash2, Pencil, ChevronDown, ChevronRight, Copy, X } from 'lucide-react'
import { getAnosLetivos, AnoLetivo } from '@/lib/actions/calendarios'
import {
  getMatrizes, getDisciplinas, toggleMatrizAtiva, deleteMatriz, getMetodosAvaliacao,
  getPeriodos, getDisciplinasPorPeriodo, createDisciplinaMatriz, deleteDisciplinaMatriz,
  replicarDisciplinas, getHabilidadesBNCCSistema, addHabilidadeBNCC, addHabilidadeManual,
  MatrizCurricular, PeriodoMatriz,
} from '@/lib/actions/matrizes'
import { getEtapasEnsino, getSubetapas, type EtapaEnsino } from '@/lib/actions/etapas-ensino'
import { MatrizForm } from './MatrizForm'

interface Props { schoolId: string }

export function TabMatrizes({ schoolId }: Props) {
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([])
  const [etapas, setEtapas] = useState<EtapaEnsino[]>([])
  const [matrizes, setMatrizes] = useState<MatrizCurricular[]>([])
  const [loading, setLoading] = useState(true)
  const [anoSelecionado, setAnoSelecionado] = useState('')
  const [etapaSelecionada, setEtapaSelecionada] = useState('')
  const [anoEncerrado, setAnoEncerrado] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [matrizSelecionada, setMatrizSelecionada] = useState<MatrizCurricular | null>(null)
  const [periodos, setPeriodos] = useState<PeriodoMatriz[]>([])
  const [expandedPeriodos, setExpandedPeriodos] = useState<string[]>([])
  const [disciplinasPorPeriodo, setDisciplinasPorPeriodo] = useState<Record<string, any[]>>({})

  const [showDisciplinaModal, setShowDisciplinaModal] = useState(false)
  const [deleteMatrizId, setDeleteMatrizId] = useState<string | null>(null)
  const [showReplicarConfirm, setShowReplicarConfirm] = useState(false)
  const [removeDiscData, setRemoveDiscData] = useState<{ id: string; periodoId: string } | null>(null)
  const [periodoSelecionado, setPeriodoSelecionado] = useState<PeriodoMatriz | null>(null)
  const [disciplinas, setDisciplinas] = useState<any[]>([])
  const [habilidadesBNCC, setHabilidadesBNCC] = useState<any[]>([])
  const [habilidadesManuais, setHabilidadesManuais] = useState<any[]>([])
  const [discForm, setDiscForm] = useState({
    disciplinaId: '', desconsideraReprovacao: false,
    cargaHorariaRegularHoras: 0, cargaHorariaRegularMinutos: 0,
    cargaHorariaIntegralHoras: 0, cargaHorariaIntegralMinutos: 0,
    tipoDisciplina: 'base_comum', habilidadesBNCC: [] as string[],
    habilidadeManualCodigo: '', habilidadeManualDescricao: '',
  })

  const etapasAgrupadas = useMemo(() => {
    const grupos = [
      { titulo: 'Educação Infantil', tipos: ['infantil'] },
      { titulo: 'Ensino Fundamental - Anos Iniciais', tipos: ['fundamental_inicial'] },
      { titulo: 'Ensino Fundamental - Anos Finais', tipos: ['fundamental_finais'] },
      { titulo: 'Ensino Médio', tipos: ['medio'] },
      { titulo: 'Fundamental - Outros', tipos: ['fundamental_outros'] },
      { titulo: 'EJA', tipos: ['eja'] },
    ]
    return grupos.map(g => ({ titulo: g.titulo, etapas: etapas.filter(e => g.tipos.includes(e.etapa_tipo)) })).filter(g => g.etapas.length > 0)
  }, [etapas])

  useEffect(() => { loadInitialData() }, [schoolId])
  useEffect(() => { if (anoSelecionado) loadMatrizes() }, [anoSelecionado, etapaSelecionada])

  async function loadInitialData() {
    try {
      setLoading(true)
      const [anosData, etapasData] = await Promise.all([getAnosLetivos(schoolId), getEtapasEnsino(schoolId)])
      setAnosLetivos(anosData || [])
      setEtapas(etapasData || [])
      const anoAtivo = anosData?.find(a => a.status === 'ativo')
      if (anoAtivo) { setAnoSelecionado(anoAtivo.id); setAnoEncerrado(anoAtivo.status === 'encerrado') }
      else if (anosData?.length) { setAnoSelecionado(anosData[0].id); setAnoEncerrado(anosData[0].status === 'encerrado') }
    } catch { toast.error('Erro ao carregar dados') }
    finally { setLoading(false) }
  }

  async function loadMatrizes() {
    try {
      const data = await getMatrizes(schoolId, anoSelecionado || undefined, etapaSelecionada || undefined)
      setMatrizes(data || [])
    } catch { toast.error('Erro ao carregar matrizes') }
  }

  function handleAnoChange(value: string) {
    setAnoSelecionado(value)
    const ano = anosLetivos.find(a => a.id === value)
    setAnoEncerrado(ano?.status === 'encerrado')
    setEtapaSelecionada('')
  }

  function openCreateModal() { setEditId(null); setShowModal(true) }
  function openEditModal(id: string) { setEditId(id); setShowModal(true) }
  function closeModal() { setShowModal(false); setEditId(null) }
  function handleSaved() { closeModal(); loadMatrizes() }

  async function handleToggleAtiva(matrizId: string, ativa: boolean) {
    try { await toggleMatrizAtiva(matrizId, ativa); setMatrizes(prev => prev.map(m => m.id === matrizId ? { ...m, ativa } : m)); toast.success(ativa ? 'Matriz ativada' : 'Matriz desativada') }
    catch { toast.error('Erro ao atualizar matriz') }
  }

  async function handleDeleteMatriz() {
    if (!deleteMatrizId) return
    try { await deleteMatriz(deleteMatrizId); setMatrizes(prev => prev.filter(m => m.id !== deleteMatrizId)); toast.success('Matriz excluída') }
    catch { toast.error('Erro ao excluir matriz') }
    finally { setDeleteMatrizId(null) }
  }

  async function togglePeriodo(periodo: PeriodoMatriz) {
    const expanded = expandedPeriodos.includes(periodo.id)
    if (expanded) { setExpandedPeriodos(prev => prev.filter(id => id !== periodo.id)); return }
    setExpandedPeriodos(prev => [...prev, periodo.id])
    if (!disciplinasPorPeriodo[periodo.id]) {
      try { const data = await getDisciplinasPorPeriodo(periodo.id); setDisciplinasPorPeriodo(prev => ({ ...prev, [periodo.id]: data || [] })) }
      catch { toast.error('Erro ao carregar disciplinas') }
    }
  }

  function resetDiscForm() {
    setDiscForm({
      disciplinaId: '', desconsideraReprovacao: false,
      cargaHorariaRegularHoras: 0, cargaHorariaRegularMinutos: 0,
      cargaHorariaIntegralHoras: 0, cargaHorariaIntegralMinutos: 0,
      tipoDisciplina: 'base_comum', habilidadesBNCC: [],
      habilidadeManualCodigo: '', habilidadeManualDescricao: '',
    })
    setHabilidadesManuais([])
  }

  async function openDisciplinaModal(periodo: PeriodoMatriz) {
    try {
      const [disciplinasData, habilidadesData] = await Promise.all([
        getDisciplinas(schoolId),
        getHabilidadesBNCCSistema(matrizSelecionada?.academico_etapas_ensino?.etapa_tipo),
      ])
      setDisciplinas(disciplinasData || [])
      setHabilidadesBNCC(habilidadesData || [])
      resetDiscForm()
      setPeriodoSelecionado(periodo)
      setShowDisciplinaModal(true)
    } catch { toast.error('Erro ao carregar dados') }
  }

  async function handleSaveDisciplina(continuar = false) {
    if (!discForm.disciplinaId) { toast.error('Selecione uma disciplina'); return }
    if (!periodoSelecionado) return

    try {
      const temRegular = matrizSelecionada?.tipo_turma?.includes('regular')
      const temIntegral = matrizSelecionada?.tipo_turma?.includes('integral')
      const cargaRegular = discForm.cargaHorariaRegularHoras * 60 + discForm.cargaHorariaRegularMinutos
      const cargaIntegral = discForm.cargaHorariaIntegralHoras * 60 + discForm.cargaHorariaIntegralMinutos
      if (temRegular && !cargaRegular) { toast.error('Informe carga horária Regular'); return }
      if (temIntegral && !cargaIntegral) { toast.error('Informe carga horária Integral'); return }

      const nova = await createDisciplinaMatriz({
        periodo_id: periodoSelecionado.id, disciplina_id: discForm.disciplinaId,
        desconsidera_reprovacao: discForm.desconsideraReprovacao,
        carga_horaria_regular_minutos: temRegular ? cargaRegular : null,
        carga_horaria_integral_minutos: temIntegral ? cargaIntegral : null,
        tipo_disciplina: discForm.tipoDisciplina as 'base_comum' | 'parte_diversificada',
      })

      for (const codigo of discForm.habilidadesBNCC) await addHabilidadeBNCC(nova.id, codigo)
      for (const h of habilidadesManuais) await addHabilidadeManual(nova.id, h.codigo, h.descricao)

      if (continuar) {
        resetDiscForm()
        toast.success('Disciplina adicionada!')
      } else {
        setShowDisciplinaModal(false)
        toast.success('Disciplina adicionada com sucesso!')
      }

      const data = await getDisciplinasPorPeriodo(periodoSelecionado.id)
      setDisciplinasPorPeriodo(prev => ({ ...prev, [periodoSelecionado.id]: data || [] }))
    } catch { toast.error('Erro ao salvar disciplina') }
  }

  async function handleReplicarDisciplinas() {
    if (periodos.length <= 1) return
    try {
      const primeiro = periodos[0]
      await replicarDisciplinas(matrizSelecionada!.id, primeiro.id, periodos.slice(1).map(p => p.id))
      toast.success('Disciplinas replicadas!')
      for (const p of periodos) {
        const data = await getDisciplinasPorPeriodo(p.id)
        setDisciplinasPorPeriodo(prev => ({ ...prev, [p.id]: data || [] }))
      }
    } catch { toast.error('Erro ao replicar disciplinas') }
    finally { setShowReplicarConfirm(false) }
  }

  async function handleRemoveDisciplina() {
    if (!removeDiscData) return
    try {
      await deleteDisciplinaMatriz(removeDiscData.id)
      setDisciplinasPorPeriodo(prev => ({ ...prev, [removeDiscData.periodoId]: (prev[removeDiscData.periodoId] || []).filter(d => d.id !== removeDiscData.id) }))
      toast.success('Disciplina removida')
    } catch { toast.error('Erro ao remover disciplina') }
    finally { setRemoveDiscData(null) }
  }

  function toggleHabilidadeBNCC(codigo: string) {
    setDiscForm(prev => ({
      ...prev, habilidadesBNCC: prev.habilidadesBNCC.includes(codigo)
        ? prev.habilidadesBNCC.filter(c => c !== codigo) : [...prev.habilidadesBNCC, codigo]
    }))
  }

  function addNovaHabilidadeManual() {
    if (!discForm.habilidadeManualCodigo.trim() || !discForm.habilidadeManualDescricao.trim()) { toast.error('Informe código e descrição'); return }
    setHabilidadesManuais(prev => [...prev, { id: crypto.randomUUID(), codigo: discForm.habilidadeManualCodigo, descricao: discForm.habilidadeManualDescricao }])
    setDiscForm(prev => ({ ...prev, habilidadeManualCodigo: '', habilidadeManualDescricao: '' }))
  }

  function removeHabilidadeManualLocal(id: string) {
    setHabilidadesManuais(prev => prev.filter(h => h.id !== id))
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-md card-glass">
        <CardHeader className="pb-3"><CardTitle className="text-lg font-semibold text-foreground">Matrizes Curriculares</CardTitle></CardHeader>
        <CardContent><div className="flex items-center justify-center py-12 animate-pulse"><div className="h-8 w-8 bg-muted rounded-full mb-3"></div><div className="h-4 w-32 bg-muted rounded"></div></div></CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md card-glass">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Matrizes Curriculares</CardTitle>
          {!anoEncerrado && anoSelecionado && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-1" /> Nova Matriz
            </Button>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <div className="w-48">
            <Select value={anoSelecionado} onValueChange={handleAnoChange}>
              <SelectTrigger><Calendar className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Ano Letivo" /></SelectTrigger>
              <SelectContent>{anosLetivos.map(ano => (<SelectItem key={ano.id} value={ano.id}>{ano.descricao}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <div className="w-72">
            <Select value={etapaSelecionada} onValueChange={setEtapaSelecionada}>
              <SelectTrigger><GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Todas as Etapas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Etapas</SelectItem>
                {etapasAgrupadas.map(grupo => (
                  <SelectGroup key={grupo.titulo}>
                    <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-primary bg-muted">{grupo.titulo}</SelectLabel>
                    {grupo.etapas.map(etapa => (<SelectItem key={etapa.id} value={etapa.id} className="pl-4">{etapa.etapa_nome}</SelectItem>))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {!anoSelecionado ? (
          <EmptyState icon={<Calendar className="w-10 h-10 text-muted-foreground" />} title="Selecione um Ano Letivo" description="Escolha um ano letivo para visualizar as matrizes." />
        ) : matrizes.length === 0 ? (
          <EmptyState icon={<BookOpen className="w-10 h-10 text-muted-foreground" />} title="Nenhuma matriz encontrada" description={anoEncerrado ? 'Ano encerrado, apenas visualização.' : 'Clique em Nova Matriz para criar.'} />
        ) : (
          <div className="grid gap-3">
            {matrizes.map(matriz => (
              <MatrizCard key={matriz.id} matriz={matriz}
                onToggle={v => handleToggleAtiva(matriz.id, v)} onDelete={() => setDeleteMatrizId(matriz.id)}
                onEdit={() => openEditModal(matriz.id)} disabled={anoEncerrado} />
            ))}
          </div>
        )}

        {anoEncerrado && matrizes.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-sm text-amber-800">
            <div className="w-2 h-2 bg-amber-500 rounded-full" /> Ano letivo encerrado. Apenas visualização.
          </div>
        )}
      </CardContent>

      <Dialog open={showModal} onOpenChange={o => !o && closeModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editId ? 'Editar Matriz Curricular' : 'Nova Matriz Curricular'}</DialogTitle>
            <DialogDescription>Configure a identificação e períodos para esta matriz.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <MatrizForm key={editId || 'create'} schoolId={schoolId} matrizId={editId} onSaved={handleSaved} onCancel={() => setShowModal(false)} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showDisciplinaModal} onOpenChange={setShowDisciplinaModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Disciplina - {periodoSelecionado?.periodo_nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Disciplina</Label>
                <Select value={discForm.disciplinaId} onValueChange={v => setDiscForm(prev => ({ ...prev, disciplinaId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {disciplinas.map(d => (<SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Disciplina</Label>
                <Select value={discForm.tipoDisciplina} onValueChange={v => setDiscForm(prev => ({ ...prev, tipoDisciplina: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base_comum">Base Comum</SelectItem>
                    <SelectItem value="parte_diversificada">Parte Diversificada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox checked={discForm.desconsideraReprovacao} onCheckedChange={v => setDiscForm(prev => ({ ...prev, desconsideraReprovacao: !!v }))} />
              <Label className="text-sm cursor-pointer">Desconsiderar reprovação (nota e frequência)</Label>
            </div>

            {matrizSelecionada?.tipo_turma?.includes('regular') && (
              <div className="p-3 bg-slate-50/40 rounded-lg border border-slate-200">
                <Label className="text-sm font-medium mb-2 block">Carga Horária - Regular</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Horas</Label>
                    <Input type="number" min={0} value={discForm.cargaHorariaRegularHoras || ''} onChange={e => setDiscForm(prev => ({ ...prev, cargaHorariaRegularHoras: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Minutos</Label>
                    <Input type="number" min={0} max={59} value={discForm.cargaHorariaRegularMinutos || ''} onChange={e => setDiscForm(prev => ({ ...prev, cargaHorariaRegularMinutos: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Total min</Label>
                    <Input disabled value={discForm.cargaHorariaRegularHoras * 60 + discForm.cargaHorariaRegularMinutos} className="bg-slate-50" />
                  </div>
                </div>
              </div>
            )}

            {matrizSelecionada?.tipo_turma?.includes('integral') && (
              <div className="p-3 bg-slate-50/40 rounded-lg border border-slate-200">
                <Label className="text-sm font-medium mb-2 block">Carga Horária - Integral</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Horas</Label>
                    <Input type="number" min={0} value={discForm.cargaHorariaIntegralHoras || ''} onChange={e => setDiscForm(prev => ({ ...prev, cargaHorariaIntegralHoras: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Minutos</Label>
                    <Input type="number" min={0} max={59} value={discForm.cargaHorariaIntegralMinutos || ''} onChange={e => setDiscForm(prev => ({ ...prev, cargaHorariaIntegralMinutos: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Total min</Label>
                    <Input disabled value={discForm.cargaHorariaIntegralHoras * 60 + discForm.cargaHorariaIntegralMinutos} className="bg-slate-50" />
                  </div>
                </div>
              </div>
            )}

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50/60">
                <div className="flex-1 px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary">Habilidades BNCC ({discForm.habilidadesBNCC.length})</div>
                <div className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground">Outras ({habilidadesManuais.length})</div>
              </div>
              <div className="p-3 max-h-48 overflow-y-auto space-y-1">
                {habilidadesBNCC.slice(0, 30).map((h: any) => (
                  <label key={h.codigo_bncc || h.id} className="flex items-start gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                    <Checkbox checked={discForm.habilidadesBNCC.includes(h.codigo_bncc)} onCheckedChange={() => toggleHabilidadeBNCC(h.codigo_bncc)} className="mt-0.5" />
                    <div><span className="text-xs font-medium text-primary">{h.codigo_bncc}</span><p className="text-xs text-muted-foreground line-clamp-2">{h.descricao}</p></div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Adicionar Habilidade Manual</Label>
              <div className="flex gap-2">
                <Input placeholder="Código" value={discForm.habilidadeManualCodigo} onChange={e => setDiscForm(prev => ({ ...prev, habilidadeManualCodigo: e.target.value }))} className="w-24" />
                <Input placeholder="Descrição" value={discForm.habilidadeManualDescricao} onChange={e => setDiscForm(prev => ({ ...prev, habilidadeManualDescricao: e.target.value }))} />
                <Button variant="outline" onClick={addNovaHabilidadeManual}>Adicionar</Button>
              </div>
              {habilidadesManuais.length > 0 && (
                <div className="space-y-1 mt-2">
                  {habilidadesManuais.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-2 bg-slate-50/40 rounded border border-slate-200">
                      <div><span className="text-xs font-medium text-primary">{h.codigo}</span><span className="text-xs text-muted-foreground ml-2">{h.descricao}</span></div>
                      <button onClick={() => removeHabilidadeManualLocal(h.id)} className="text-xs text-destructive hover:underline">Remover</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowDisciplinaModal(false)} className="border-slate-300">Cancelar</Button>
            <Button variant="outline" onClick={() => handleSaveDisciplina(false)} className="border-slate-300">Adicionar Disciplina</Button>
            <Button onClick={() => handleSaveDisciplina(true)}>Adicionar e Continuar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmar exclusão de matriz */}
      <AlertDialog open={!!deleteMatrizId} onOpenChange={(o) => { if (!o) setDeleteMatrizId(null) }}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir matriz?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita. Todas as disciplinas e configurações vinculadas serão removidas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMatriz} className="bg-destructive hover:bg-destructive/90 shadow-sm">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmar replicação */}
      <AlertDialog open={showReplicarConfirm} onOpenChange={setShowReplicarConfirm}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Replicar disciplinas?</AlertDialogTitle>
            <AlertDialogDescription>Copiar todas as disciplinas do 1º período para os demais? As disciplinas existentes nos períodos destino serão substituídas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReplicarDisciplinas} className="bg-primary hover:bg-primary/90 shadow-sm">Replicar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmar remoção de disciplina */}
      <AlertDialog open={!!removeDiscData} onOpenChange={(o) => { if (!o) setRemoveDiscData(null) }}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover disciplina?</AlertDialogTitle>
            <AlertDialogDescription>As habilidades vinculadas a esta disciplina também serão removidas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveDisciplina} className="bg-destructive hover:bg-destructive/90 shadow-sm">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">{description}</p>
    </div>
  )
}

function MatrizCard({ matriz, onToggle, onDelete, onEdit, disabled }: {
  matriz: MatrizCurricular; onToggle: (v: boolean) => void; onDelete: () => void; onEdit: () => void; disabled: boolean
}) {
  const etapa = matriz.academico_etapas_ensino
  const metodo = matriz.academico_metodos_avaliacao
  const fmt = (d: string) => new Date(d).toLocaleDateString('pt-BR')

  return (
    <div className="p-4 rounded-xl border transition-all border-border bg-card hover:border-border">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-foreground truncate">{matriz.descricao}</h3>
            {!matriz.ativa && <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full shrink-0">Inativa</span>}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {etapa && <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" />{etapa.etapa_nome}</span>}
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{fmt(matriz.data_inicial)} - {fmt(matriz.data_final)}</span>
            {metodo && <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{metodo.nome}</span>}
            {matriz.turnos?.length > 0 && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{matriz.turnos.join(', ')}</span>}
            {matriz.tipo_turma?.length > 0 && <span className="flex items-center gap-1"><Users className="w-4 h-4" />{matriz.tipo_turma.join(', ')}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <div className="flex items-center gap-2 mr-2">
            <Switch checked={matriz.ativa} onCheckedChange={onToggle} disabled={disabled} />
            <span className="text-xs text-muted-foreground">{matriz.ativa ? 'Ativo' : 'Inativo'}</span>
          </div>
          {!disabled && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-muted" onClick={onEdit}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
