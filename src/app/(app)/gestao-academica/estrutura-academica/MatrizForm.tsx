'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DatePickerDual } from '@/components/ui/date-picker'
import { PillToggleGroup } from '@/components/ui/pill-toggle'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ShieldAlert, Info, ChevronDown, ChevronRight, Search, X } from 'lucide-react'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getEtapasEnsino } from '@/lib/actions/etapas-ensino'
import {
  getMatriz, createMatriz, updateMatriz,
  getPeriodos, createPeriodos, getDisciplinasPorPeriodo,
  createDisciplinaMatriz, updateDisciplinaMatriz, deleteDisciplinaMatriz,
  replicarDisciplinas, substituirHabilidades,
  getHabilidadesBNCCPorDisciplinaEtapa,
  getMetodosAvaliacao, getDisciplinas as getDisciplinasSistema,
  type DisciplinaMatriz,
} from '@/lib/actions/matrizes'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('T')[0].split('-')
  if (!y || !m || !day) return d
  return `${day}/${m}/${y}`
}

const TURNOS = ['Matutino', 'Vespertino', 'Integral', 'Noturno']
const TIPOS_TURMA_OPTS = ['Regular', 'Integral']
const gruposEtapaLabels: Record<string, string> = {
  infantil: 'Educação Infantil',
  fundamental_inicial: 'Ensino Fundamental - Anos Iniciais',
  fundamental_final: 'Ensino Fundamental - Anos Finais',
  medio: 'Ensino Médio',
  fundamental_outros: 'Fundamental - Outros',
  eja: 'EJA',
}

type FormData = {
  descricao: string
  ano_letivo_id: string
  etapa_ensino_id: string
  subetapa_id: string
  metodo_avaliacao_id: string
  data_inicio: string
  data_final: string
  turnos: string[]
  tipo_turma: string[]
  carga_regular_aulas_dia: number
  carga_regular_aulas_semana: number
  carga_regular_duracao: number
  carga_integral_aulas_dia: number
  carga_integral_aulas_semana: number
  carga_integral_duracao: number
}

const defaultForm: FormData = {
  descricao: '', ano_letivo_id: '', etapa_ensino_id: '', subetapa_id: '', metodo_avaliacao_id: '',
  data_inicio: '', data_final: '',
  turnos: [], tipo_turma: [],
  carga_regular_aulas_dia: 0, carga_regular_aulas_semana: 0, carga_regular_duracao: 50,
  carga_integral_aulas_dia: 0, carga_integral_aulas_semana: 0, carga_integral_duracao: 50,
}

function LabelWithTooltip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className="flex items-center gap-1">
      <Label className="text-foreground font-medium">{label}</Label>
      <Tooltip>
        <TooltipTrigger asChild><Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </div>
  )
}

interface MatrizFormProps {
  schoolId: string | null
  matrizId: string | null
  onSaved: () => void
  onCancel: () => void
}

export function MatrizForm({ schoolId, matrizId, onSaved, onCancel }: MatrizFormProps) {
  const { pode, loaded: permLoaded } = usePermissoes(schoolId)
  const [form, setForm] = useState<FormData>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [etapas, setEtapas] = useState<any[]>([])
  const [metodos, setMetodos] = useState<any[]>([])
  const [subetapas, setSubetapas] = useState<any[]>([])
  const [periodos, setPeriodos] = useState<any[]>([])
  const [disciplinasPorPeriodo, setDisciplinasPorPeriodo] = useState<Record<string, any[]>>({})
  const [periodosExpandidos, setPeriodosExpandidos] = useState<Set<string>>(new Set())
  const [showDiscModal, setShowDiscModal] = useState(false)
  const [discPeriodoId, setDiscPeriodoId] = useState('')
  const [discEditId, setDiscEditId] = useState<string | null>(null)
  const [savingDisc, setSavingDisc] = useState(false)
  const [discForm, setDiscForm] = useState({
    disciplina_id: '',
    tipo_disciplina: 'base_comum' as string,
    desconsidera_reprovacao: false,
    carga_horaria_regular: 0,
    carga_horaria_integral: 0,
    carga_horaria_regular_habilitada: false,
    carga_horaria_integral_habilitada: false,
  })
  const [bnccHabilidades, setBnccHabilidades] = useState<any[]>([])
  const [selectedBncc, setSelectedBncc] = useState<Set<string>>(new Set())
  const [bnccSearch, setBnccSearch] = useState('')
  const [outrasHabilidades, setOutrasHabilidades] = useState<{ codigo: string; descricao: string }[]>([])
  const [novaOutraCodigo, setNovaOutraCodigo] = useState('')
  const [novaOutraDescricao, setNovaOutraDescricao] = useState('')
  const [disciplinasSistema, setDisciplinasSistema] = useState<any[]>([])

  const [showReplicarDialog, setShowReplicarDialog] = useState(false)
  const [replicarOrigemId, setReplicarOrigemId] = useState('')
  const [replicarOrigemNome, setReplicarOrigemNome] = useState('')
  const [deleteDiscTarget, setDeleteDiscTarget] = useState<any>(null)

  useEffect(() => { loadInitial() }, [schoolId])
  useEffect(() => { if (matrizId) loadMatriz() }, [matrizId])

  // Recarregar BNCC quando a disciplina selecionada mudar no modal
  const etapaTipoAtual = etapas.find((e: any) => e.id === form.etapa_ensino_id)?.etapa_tipo || ''
  const anoEscolarMatriz = etapas.find((e: any) => e.id === form.etapa_ensino_id)?.etapa_nome?.match(/(\d+)º/)?.[1]
  useEffect(() => {
    if (!showDiscModal) return
    if (!discForm.disciplina_id) { setBnccHabilidades([]); return }
    const nomeDisc = disciplinasSistema.find((d: any) => d.id === discForm.disciplina_id)?.nome || ''
    getHabilidadesBNCCPorDisciplinaEtapa(nomeDisc, etapaTipoAtual)
      .then(hab => {
        // Filtrar pelo ano escolar no cliente (contorna bug do contains JSONB)
        if (anoEscolarMatriz) {
          const ano = `${anoEscolarMatriz}º`
          setBnccHabilidades(hab.filter((h: any) => {
            const anos = Array.isArray(h.anos) ? h.anos : (h.anos ? JSON.parse(h.anos) : [])
            return anos.includes(ano) || anos.includes(`${anoEscolarMatriz}º`)
          }))
        } else {
          setBnccHabilidades(hab)
        }
      })
      .catch(() => setBnccHabilidades([]))
  }, [discForm.disciplina_id, showDiscModal])

  async function loadInitial() {
    if (!schoolId) return
    try {
      const [anos, etaps, mets, discs] = await Promise.all([
        getAnosLetivosAtivos(schoolId),
        getEtapasEnsino(schoolId),
        getMetodosAvaliacao(schoolId),
        getDisciplinasSistema(schoolId),
      ])
      setAnosLetivos(anos)
      setEtapas(etaps)
      setMetodos(mets)
      setDisciplinasSistema(discs)
      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo && !matrizId) setForm(f => ({ ...f, ano_letivo_id: ativo.id }))
    } catch (e) { console.error(e) }
  }

  async function loadMatriz() {
    if (!matrizId) return
    try {
      const m = await getMatriz(matrizId)
      if (!m) { toast.error('Matriz não encontrada'); return }
      setForm({
        descricao: m.descricao || '',
        ano_letivo_id: m.ano_letivo_id || '',
        etapa_ensino_id: m.etapa_ensino_id || '',
        subetapa_id: m.subetapa_id || '',
        metodo_avaliacao_id: m.metodo_avaliacao_id || '',
        data_inicio: m.data_inicial?.split('T')[0] || '',
        data_final: m.data_final?.split('T')[0] || '',
        turnos: m.turnos || [],
        tipo_turma: m.tipo_turma || [],
        carga_regular_aulas_dia: m.aulas_diarias_regular || 0,
        carga_regular_aulas_semana: m.aulas_semanais_regular || 0,
        carga_regular_duracao: m.duracao_aula_regular || 50,
        carga_integral_aulas_dia: m.aulas_diarias_integral || 0,
        carga_integral_aulas_semana: m.aulas_semanais_integral || 0,
        carga_integral_duracao: m.duracao_aula_integral || 50,
      })
      const per = await getPeriodos(matrizId)
      setPeriodos(per)
      const map: Record<string, any[]> = {}
      for (const p of per) {
        map[p.id] = await getDisciplinasPorPeriodo(p.id)
      }
      setDisciplinasPorPeriodo(map)
    } catch (e) { console.error(e) }
  }

  const etapasAgrupadas = (() => {
    const g: Record<string, any[]> = {}
    for (const e of etapas) { if (!g[e.etapa_tipo]) g[e.etapa_tipo] = []; g[e.etapa_tipo].push(e) }
    return g
  })()

  const regularAnual = form.carga_regular_aulas_semana * 40
  const integralAnual = form.carga_integral_aulas_semana * 40

  async function handleSave() {
    if (!form.descricao.trim()) { toast.error('Descrição é obrigatória'); return }
    if (!form.ano_letivo_id) { toast.error('Ano letivo é obrigatório'); return }
    if (!form.etapa_ensino_id) { toast.error('Etapa é obrigatória'); return }
    if (!form.data_inicio || !form.data_final) { toast.error('Datas são obrigatórias'); return }
    setSaving(true)
    try {
      const payload = {
        school_id: schoolId!,
        descricao: form.descricao,
        ano_letivo_id: form.ano_letivo_id,
        etapa_ensino_id: form.etapa_ensino_id,
        subetapa_id: form.subetapa_id || null,
        metodo_avaliacao_id: form.metodo_avaliacao_id || null,
        data_inicial: form.data_inicio,
        data_final: form.data_final,
        turnos: form.turnos,
        tipo_turma: form.tipo_turma,
        aulas_diarias_regular: form.carga_regular_aulas_dia,
        aulas_semanais_regular: form.carga_regular_aulas_semana,
        duracao_aula_regular: form.carga_regular_duracao,
        aulas_diarias_integral: form.carga_integral_aulas_dia,
        aulas_semanais_integral: form.carga_integral_aulas_semana,
        duracao_aula_integral: form.carga_integral_duracao,
      }
      if (matrizId) {
        await updateMatriz(matrizId, payload as any)
        toast.success('Matriz atualizada!')
      } else {
        const nova = await createMatriz(payload as any) as any
        const qtdPeriodos = form.tipo_turma.includes('Regular') ? 4 : form.tipo_turma.includes('Integral') ? 2 : 4
        await createPeriodos(nova.id, qtdPeriodos, Array.from({ length: qtdPeriodos }, (_, i) => `${i + 1}º Período`))
        toast.success('Matriz criada!')
      }
      onSaved()
    } catch (e: any) { toast.error(e?.message || 'Erro ao salvar') }
    finally { setSaving(false) }
  }

  async function toggleExpandPeriodo(pid: string) {
    const ns = new Set(periodosExpandidos)
    if (ns.has(pid)) { ns.delete(pid); setPeriodosExpandidos(ns); return }
    ns.add(pid); setPeriodosExpandidos(new Set(ns))
    const discs = await getDisciplinasPorPeriodo(pid)
    setDisciplinasPorPeriodo(prev => ({ ...prev, [pid]: discs }))
  }

  function openDiscModal(periodoId: string, editDisc?: any) {
    setDiscPeriodoId(periodoId)
    if (editDisc) {
      setDiscEditId(editDisc.id)
      setDiscForm({
        disciplina_id: editDisc.disciplina_id || '',
        tipo_disciplina: editDisc.tipo_disciplina || 'base_comum',
        desconsidera_reprovacao: editDisc.desconsidera_reprovacao || false,
        carga_horaria_regular: editDisc.carga_horaria_regular_minutos || 0,
        carga_horaria_integral: editDisc.carga_horaria_integral_minutos || 0,
        carga_horaria_regular_habilitada: !!editDisc.carga_horaria_regular_minutos,
        carga_horaria_integral_habilitada: !!editDisc.carga_horaria_integral_minutos,
      })
      setSelectedBncc(new Set(editDisc.bncc_habilidades?.map((h: any) => h.codigo_bncc || h.habilidade_codigo) || []))
      setOutrasHabilidades(editDisc.habilidades_manuais?.map((h: any) => ({ codigo: h.codigo, descricao: h.descricao })) || [])
    } else {
      setDiscEditId(null)
      setDiscForm({
        disciplina_id: '', tipo_disciplina: 'base_comum', desconsidera_reprovacao: false,
        carga_horaria_regular: 0, carga_horaria_integral: 0,
        carga_horaria_regular_habilitada: false, carga_horaria_integral_habilitada: false,
      })
      setSelectedBncc(new Set())
      setOutrasHabilidades([])
    }
    setBnccSearch('')
    setShowDiscModal(true)
  }

  async function handleStepChange(v: string) {
    setForm({ ...form, etapa_ensino_id: v, subetapa_id: '' })
    // Carregar subetapas
    if (!v) { setSubetapas([]); setBnccHabilidades([]); return }
    try {
      const { getSubetapas } = await import('@/lib/actions/etapas-ensino')
      const subs = await getSubetapas(v)
      setSubetapas(subs)
    } catch { setSubetapas([]) }
  }

  function toggleBncc(codigo: string) {
    const ns = new Set(selectedBncc)
    ns.has(codigo) ? ns.delete(codigo) : ns.add(codigo)
    setSelectedBncc(new Set(ns))
  }

  function selectAllBncc() {
    setSelectedBncc(new Set(bnccHabilidades.map((h: any) => h.codigo_bncc || h.codigo)))
  }

  function clearAllBncc() {
    setSelectedBncc(new Set())
  }

  function addOutraHabilidade() {
    if (!novaOutraCodigo.trim() || !novaOutraDescricao.trim()) return
    setOutrasHabilidades([...outrasHabilidades, { codigo: novaOutraCodigo.trim(), descricao: novaOutraDescricao.trim() }])
    setNovaOutraCodigo('')
    setNovaOutraDescricao('')
  }

  async function handleSaveDisciplina() {
    if (!discForm.disciplina_id) { toast.error('Selecione uma disciplina'); return }
    setSavingDisc(true)
    try {
      const payload = {
        periodo_id: discPeriodoId,
        disciplina_id: discForm.disciplina_id,
        tipo_disciplina: discForm.tipo_disciplina,
        desconsidera_reprovacao: discForm.desconsidera_reprovacao,
        carga_horaria_regular_minutos: discForm.carga_horaria_regular_habilitada ? discForm.carga_horaria_regular : 0,
        carga_horaria_integral_minutos: discForm.carga_horaria_integral_habilitada ? discForm.carga_horaria_integral : 0,
      }
      let discId: string
      if (discEditId) {
        await updateDisciplinaMatriz(discEditId, payload as any)
        discId = discEditId
      } else {
        const created = await createDisciplinaMatriz(payload as any) as any
        discId = created.id
      }
      const bnccArr = Array.from(selectedBncc)
      await substituirHabilidades(discId, bnccArr, outrasHabilidades.map(h => ({ codigo: h.codigo, descricao: h.descricao })))
      const discs = await getDisciplinasPorPeriodo(discPeriodoId)
      setDisciplinasPorPeriodo(prev => ({ ...prev, [discPeriodoId]: discs }))
      setShowDiscModal(false)
      toast.success(discEditId ? 'Disciplina atualizada!' : 'Disciplina adicionada!')
    } catch (e: any) { toast.error(e?.message || 'Erro') }
    finally { setSavingDisc(false) }
  }

  async function handleDeleteDisc() {
    if (!deleteDiscTarget) return
    try {
      await deleteDisciplinaMatriz(deleteDiscTarget.id)
      const discs = await getDisciplinasPorPeriodo(deleteDiscTarget.periodo_id)
      setDisciplinasPorPeriodo(prev => ({ ...prev, [deleteDiscTarget.periodo_id]: discs }))
      setDeleteDiscTarget(null)
      toast.success('Disciplina removida')
    } catch (e: any) { toast.error(e?.message || 'Erro') }
  }

  async function handleReplicar() {
    if (!replicarOrigemId) return
    const destinoIds = periodos.filter(p => p.id !== replicarOrigemId).map(p => p.id)
    if (destinoIds.length === 0) { toast.error('Não há outros períodos para replicar'); return }
    try {
      await replicarDisciplinas(matrizId!, replicarOrigemId, destinoIds)
      const map: Record<string, any[]> = {}
      for (const pid of [replicarOrigemId, ...destinoIds]) {
        map[pid] = await getDisciplinasPorPeriodo(pid)
      }
      setDisciplinasPorPeriodo(prev => ({ ...prev, ...map }))
      setShowReplicarDialog(false)
      toast.success('Disciplinas replicadas!')
    } catch (e: any) { toast.error(e?.message || 'Erro') }
  }

  // BNCC data organized by Unidade Tematica -> Objeto Conhecimento -> Habilidade
  const bnccAgrupado = (() => {
    const map: Record<string, Record<string, any[]>> = {}
    for (const h of bnccHabilidades) {
      // Normalizar: fundamental tem dados aninhados, infantil/medio tem flat
      const ut = typeof h.unidade_tematica === 'string'
        ? h.unidade_tematica
        : h.objeto_conhecimento?.unidade_tematica?.unidade_tematica || 'Outros'
      const oc = typeof h.objeto_conhecimento === 'string'
        ? h.objeto_conhecimento
        : h.objeto_conhecimento?.objeto_conhecimento || 'Outros'
      if (!map[ut]) map[ut] = {}
      if (!map[ut][oc]) map[ut][oc] = []
      map[ut][oc].push(h)
    }
    return map
  })()

  const filteredBnccSearch = bnccSearch ? bnccHabilidades.filter((h: any) =>
    (h.codigo_bncc || h.codigo || '').toLowerCase().includes(bnccSearch.toLowerCase()) ||
    (h.descricao || '').toLowerCase().includes(bnccSearch.toLowerCase())
  ) : null

  if (!permLoaded) return <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
  if (!pode.visualizar('gestao-academica.estrutura-academica.matrizes')) return <EmptyState icon={ShieldAlert} title="Sem permissão" description="Você não tem permissão para acessar Matrizes." />

  return (
    <div className="space-y-6">
      {/* Card: Identificação */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-[16px] font-semibold">Identificação</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-foreground font-medium block mb-1.5">Descrição <span className="text-destructive">*</span></Label>
            <Input className="border-border" placeholder="Ex: Matriz Ensino Fundamental 2026" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground font-medium block mb-1.5">Ano Letivo <span className="text-destructive">*</span></Label>
              <Select value={form.ano_letivo_id} onValueChange={v => setForm({ ...form, ano_letivo_id: v })}>
                <SelectTrigger className="border-border [&_svg]:!rotate-0"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{anosLetivos.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground font-medium block mb-1.5">Etapa de Ensino <span className="text-destructive">*</span></Label>
              <Select value={form.etapa_ensino_id} onValueChange={handleStepChange}>
                <SelectTrigger className="border-border [&_svg]:!rotate-0"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(etapasAgrupadas).map(([tipo, lista]) => (
                    <div key={tipo}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{gruposEtapaLabels[tipo] || tipo}</div>
                      {lista.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>)}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground font-medium block mb-1.5">Método de Avaliação</Label>
              <Select value={form.metodo_avaliacao_id} onValueChange={v => setForm({ ...form, metodo_avaliacao_id: v })}>
                <SelectTrigger className="border-border [&_svg]:!rotate-0"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{metodos.map((m: any) => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground font-medium block mb-1.5">Subetapa</Label>
              <Select value={form.subetapa_id} onValueChange={v => setForm({ ...form, subetapa_id: v })} disabled={subetapas.length === 0}>
                <SelectTrigger className="border-border [&_svg]:!rotate-0"><SelectValue placeholder={subetapas.length === 0 ? 'Sem subetapas' : 'Selecione'} /></SelectTrigger>
                <SelectContent>{subetapas.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DatePickerDual
            labelInicio="Data Inicial" labelTermino="Data Final"
            valorInicio={form.data_inicio} valorTermino={form.data_final}
            onChangeInicio={v => setForm({ ...form, data_inicio: v })}
            onChangeTermino={v => setForm({ ...form, data_final: v })}
          />

          {/* Turnos e Tipo de Turma como Pills */}
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-foreground font-medium block mb-1.5">Turnos</Label>
              <PillToggleGroup
                options={TURNOS.map(t => ({ value: t, label: t }))}
                selectedValues={form.turnos}
                onToggleValue={(v) => setForm({ ...form, turnos: form.turnos.includes(v) ? form.turnos.filter(x => x !== v) : [...form.turnos, v] })}
                multiple
              />
            </div>
            <div>
              <Label className="text-foreground font-medium block mb-1.5">Tipo de Turma</Label>
              <PillToggleGroup
                options={TIPOS_TURMA_OPTS.map(t => ({ value: t, label: t }))}
                selectedValues={form.tipo_turma}
                onToggleValue={(v) => setForm({ ...form, tipo_turma: form.tipo_turma.includes(v) ? form.tipo_turma.filter(x => x !== v) : [...form.tipo_turma, v] })}
                multiple
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Configuração de Carga Horária (unificado) */}
      {form.tipo_turma.length > 0 && (
        <Card className="shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-[16px] font-semibold">Configuração de Carga Horária</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subcard: Regular */}
            <div className="rounded-lg border border-border p-4">
              <div className="text-[15px] font-semibold text-foreground mb-3">Turno Regular</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground block mb-1">Aulas/Dia</Label>
                  <Input type="number" className="border-border" value={form.carga_regular_aulas_dia || ''} onChange={e => setForm({ ...form, carga_regular_aulas_dia: Number(e.target.value) })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground block mb-1">Aulas/Semana</Label>
                  <Input type="number" className="border-border" value={form.carga_regular_aulas_semana || ''} onChange={e => setForm({ ...form, carga_regular_aulas_semana: Number(e.target.value) })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground block mb-1">Duração (min)</Label>
                  <Input type="number" className="border-border" value={form.carga_regular_duracao || ''} onChange={e => setForm({ ...form, carga_regular_duracao: Number(e.target.value) })} />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Aulas Anuais (Estimado): <strong className="text-foreground">{regularAnual}</strong></div>
            </div>

            {/* Subcard: Integral */}
            <div className="rounded-lg border border-border p-4">
              <div className="text-[15px] font-semibold text-foreground mb-3">Turno Integral</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground block mb-1">Aulas/Dia</Label>
                  <Input type="number" className="border-border" value={form.carga_integral_aulas_dia || ''} onChange={e => setForm({ ...form, carga_integral_aulas_dia: Number(e.target.value) })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground block mb-1">Aulas/Semana</Label>
                  <Input type="number" className="border-border" value={form.carga_integral_aulas_semana || ''} onChange={e => setForm({ ...form, carga_integral_aulas_semana: Number(e.target.value) })} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground block mb-1">Duração (min)</Label>
                  <Input type="number" className="border-border" value={form.carga_integral_duracao || ''} onChange={e => setForm({ ...form, carga_integral_duracao: Number(e.target.value) })} />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Aulas Anuais (Estimado): <strong className="text-foreground">{integralAnual}</strong></div>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Card: Períodos */}
      {matrizId && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-[16px] font-semibold">Períodos</CardTitle></CardHeader>
          <CardContent>
            {periodos.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum período configurado. Salve a matriz primeiro.</p>
            ) : (
              <div className="space-y-3">
                {periodos.map((p, idx) => {
                  const isExpanded = periodosExpandidos.has(p.id)
                  const discs = disciplinasPorPeriodo[p.id] || []
                  return (
                    <div key={p.id} className="rounded-lg border border-border overflow-hidden">
                      <div onClick={() => toggleExpandPeriodo(p.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left cursor-pointer">
                        {isExpanded ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                        <span className="text-[15px] font-semibold text-foreground flex-1">{p.nome || `${idx + 1}º Período`}</span>
                        {discs.length > 0 && <StatusBadge status="info">{discs.length} disciplina{discs.length > 1 ? 's' : ''}</StatusBadge>}
                        {/* Replicar button only in 1st period */}
                        {idx === 0 && periodos.length > 1 && (
                          <Button variant="outline" size="xs" onClick={(e) => { e.stopPropagation(); setReplicarOrigemId(p.id); setReplicarOrigemNome(p.nome || `${idx + 1}º Período`); setShowReplicarDialog(true) }}>
                            Replicar para demais
                          </Button>
                        )}
                      </div>
                      {isExpanded && (
                        <div className="border-t border-border px-4 py-3 bg-muted/20 space-y-2">
                          {discs.map((d: any) => (
                            <div key={d.id} className="flex items-center justify-between p-2 rounded border border-border bg-card">
                              <div className="flex-1">
                                <span className="text-sm font-medium text-foreground">{d.academico_disciplinas?.nome || d.disciplina_id}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-muted-foreground">{d.tipo_disciplina === 'base_comum' ? 'Base Comum' : 'Parte Diversificada'}</span>
                                  {d.desconsidera_reprovacao && <span className="text-xs text-warning">Não reprova</span>}
                                  {d.carga_horaria_regular > 0 && <span className="text-xs text-muted-foreground">Reg: {d.carga_horaria_regular}h</span>}
                                  {d.carga_horaria_integral > 0 && <span className="text-xs text-muted-foreground">Int: {d.carga_horaria_integral}h</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 ml-2">
                                <Button variant="ghost" size="icon-sm" onClick={() => openDiscModal(p.id, d)} title="Editar"><Pencil className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteDiscTarget({ ...d, periodo_id: p.id })} title="Excluir"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </div>
                            </div>
                          ))}
                          <Button size="lg" className="w-full mt-2" onClick={() => openDiscModal(p.id)}>
                            <Plus className="h-4 w-4 mr-2" />Adicionar Disciplina
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
        <Button variant="outline" onClick={onCancel} className="min-h-[40px] sm:min-h-[44px]">Cancelar</Button>
        <Button onClick={handleSave} disabled={saving} className="min-h-[40px] sm:min-h-[44px]">{matrizId ? 'Salvar Alterações' : 'Criar Matriz'}</Button>
      </div>

      {/* Modal: Disciplina */}
      <Dialog open={showDiscModal} onOpenChange={setShowDiscModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>{discEditId ? 'Editar Disciplina' : 'Adicionar Disciplina'}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {/* Disciplina + Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground font-medium block mb-1.5">Disciplina <span className="text-destructive">*</span></Label>
                <Select value={discForm.disciplina_id} onValueChange={v => setDiscForm({ ...discForm, disciplina_id: v })}>
                  <SelectTrigger className="border-border [&_svg]:!rotate-0">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinasSistema.map((d: any) => (
                      <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-foreground font-medium block mb-1.5">Tipo</Label>
                <PillToggleGroup
                  options={[
                    { value: 'base_comum', label: 'Base Comum' },
                    { value: 'parte_diversificada', label: 'Parte Diversificada' },
                  ]}
                  value={discForm.tipo_disciplina}
                  onValueChange={(v) => setDiscForm({ ...discForm, tipo_disciplina: v })}
                />
              </div>
            </div>

            {/* Desconsidera reprovação - Toggle card-row */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
              <div>
                <span className="text-[14px] font-medium text-foreground">Desconsiderar para reprovação</span>
                <p className="text-xs text-muted-foreground mt-0.5">Aluno não será reprovado por esta disciplina</p>
              </div>
              <Switch checked={discForm.desconsidera_reprovacao} onCheckedChange={v => setDiscForm({ ...discForm, desconsidera_reprovacao: v })} className="data-[state=unchecked]:bg-muted-foreground/25" />
            </div>

            {/* Carga Horária - cards with checkbox + hours inline */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium block">Carga Horária</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Regular */}
                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Switch checked={discForm.carga_horaria_regular_habilitada} onCheckedChange={v => setDiscForm({ ...discForm, carga_horaria_regular_habilitada: v, carga_horaria_regular: v ? discForm.carga_horaria_regular : 0 })} />
                    <span className="text-sm text-foreground flex-1">Regular</span>
                    <Input
                      className="border-border w-24"
                      value={discForm.carga_horaria_regular || ''}
                      disabled={!discForm.carga_horaria_regular_habilitada}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '')
                        setDiscForm({ ...discForm, carga_horaria_regular: digits ? parseInt(digits, 10) : 0 })
                      }}
                    />
                    <span className="text-xs text-muted-foreground">horas</span>
                  </div>
                </div>
                {/* Integral */}
                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Switch checked={discForm.carga_horaria_integral_habilitada} onCheckedChange={v => setDiscForm({ ...discForm, carga_horaria_integral_habilitada: v, carga_horaria_integral: v ? discForm.carga_horaria_integral : 0 })} />
                    <span className="text-sm text-foreground flex-1">Integral</span>
                    <Input
                      className="border-border w-24"
                      value={discForm.carga_horaria_integral || ''}
                      disabled={!discForm.carga_horaria_integral_habilitada}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '')
                        setDiscForm({ ...discForm, carga_horaria_integral: digits ? parseInt(digits, 10) : 0 })
                      }}
                    />
                    <span className="text-xs text-muted-foreground">horas</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* BNCC Habilidades */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-foreground font-medium">Habilidades BNCC</Label>
                <div className="flex items-center gap-2">
                  <Input className="border-border h-8 w-48 text-xs" placeholder="Buscar..." value={bnccSearch} onChange={e => setBnccSearch(e.target.value)} />
                  <Button variant="outline" size="xs" onClick={selectAllBncc}>Selecionar todos</Button>
                  <Button variant="outline" size="xs" onClick={clearAllBncc}>Limpar</Button>
                </div>
              </div>
              {bnccHabilidades.length === 0 ? (
                <p className="text-sm text-muted-foreground">{discForm.disciplina_id ? 'Nenhuma habilidade BNCC encontrada para esta disciplina.' : 'Selecione uma disciplina primeiro.'}</p>
              ) : filteredBnccSearch ? (
                <div className="space-y-1 border border-border rounded-lg p-3">
                  {filteredBnccSearch.map((h: any) => (
                    <label key={h.codigo_bncc || h.codigo} className="flex items-start gap-3 py-1.5 cursor-pointer hover:bg-muted/30 px-2 rounded">
                      <Checkbox checked={selectedBncc.has(h.codigo_bncc || h.codigo)} onCheckedChange={() => toggleBncc(h.codigo_bncc || h.codigo)} className="mt-0.5" />
                      <div className="flex-1">
                        <StatusBadge status="info">{h.codigo_bncc || h.codigo}</StatusBadge>
                        <p className="text-[13px] text-foreground mt-0.5">{h.descricao}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(bnccAgrupado).map(([ut, objetos]) => (
                    <div key={ut}>
                      <div className="text-[14px] font-semibold text-foreground border-b border-border pb-1.5 mb-2">{ut}</div>
                      <div className="space-y-2 ml-2">
                        {Object.entries(objetos).map(([oc, habs]) => (
                          <div key={oc}>
                            <div className="text-xs font-medium text-muted-foreground mb-1">{oc}</div>
                            <div className="space-y-0.5 ml-2">
                              {habs.map((h: any) => (
                                <label key={h.codigo_bncc || h.codigo} className="flex items-start gap-3 py-1 cursor-pointer hover:bg-muted/30 px-1.5 rounded">
                                  <Checkbox checked={selectedBncc.has(h.codigo_bncc || h.codigo)} onCheckedChange={() => toggleBncc(h.codigo_bncc || h.codigo)} className="mt-0.5" />
                                  <div className="flex-1">
                                    <StatusBadge status="info">{h.codigo_bncc || h.codigo}</StatusBadge>
                                    <p className="text-[13px] text-foreground mt-0.5">{h.descricao}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Outras Habilidades */}
            <div>
              <Label className="text-foreground font-medium block mb-3">Outras Habilidades</Label>
              <div className="flex items-end gap-2 mb-3">
                <div className="w-24">
                  <Label className="text-xs text-muted-foreground block mb-0.5">Código</Label>
                  <Input className="border-border h-8 text-xs" placeholder="Ex: 123" value={novaOutraCodigo} onChange={e => setNovaOutraCodigo(e.target.value)} />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground block mb-0.5">Descrição</Label>
                  <Input className="border-border h-8 text-xs" placeholder="Descrição da habilidade" value={novaOutraDescricao} onChange={e => setNovaOutraDescricao(e.target.value)} />
                </div>
                <Button size="sm" onClick={addOutraHabilidade}><Plus className="h-4 w-4" /></Button>
              </div>
              {outrasHabilidades.length > 0 && (
                <div className="space-y-1">
                  {outrasHabilidades.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/30">
                      <div className="flex items-center gap-2">
                        <StatusBadge status="info">{h.codigo}</StatusBadge>
                        <span className="text-[13px] text-foreground">{h.descricao}</span>
                      </div>
                      <Button variant="ghost" size="icon-sm" onClick={() => setOutrasHabilidades(outrasHabilidades.filter((_, j) => j !== i))}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-border px-6 py-3 gap-2 bg-muted/30">
            <Button variant="outline" onClick={() => setShowDiscModal(false)} className="min-h-[40px] sm:min-h-[44px]">Cancelar</Button>
            <Button onClick={handleSaveDisciplina} disabled={savingDisc} className="min-h-[40px] sm:min-h-[44px]">{discEditId ? 'Salvar' : 'Adicionar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteDiscTarget}
        onOpenChange={(open) => { if (!open) setDeleteDiscTarget(null) }}
        title="Remover Disciplina"
        description={`Tem certeza que deseja remover "${deleteDiscTarget?.academico_disciplinas?.nome}"?`}
        confirmLabel="Sim, Remover"
        variant="destructive"
        onConfirm={handleDeleteDisc}
      />

      <ConfirmDialog
        open={showReplicarDialog}
        onOpenChange={setShowReplicarDialog}
        title="Replicar Disciplinas"
        description={`As disciplinas do período "${replicarOrigemNome}" serão copiadas para todos os outros períodos. Continuar?`}
        confirmLabel="Sim, Replicar"
        variant="warning"
        onConfirm={handleReplicar}
      />
    </div>
  )
}
