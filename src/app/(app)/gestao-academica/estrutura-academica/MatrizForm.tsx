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
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Plus, BookOpen, Trash2, Pencil, Calendar, GraduationCap, Clock, Users, ChevronDown, ChevronRight, Copy } from 'lucide-react'
import { DatePickerDual } from '@/components/ui/date-picker'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'
import { getAnosLetivos, AnoLetivo } from '@/lib/actions/calendarios'
import {
  getMetodosAvaliacao, createMatriz, updateMatriz,
  getMatriz, getPeriodos, getDisciplinasPorPeriodo, createDisciplinaMatriz, deleteDisciplinaMatriz,
  addHabilidadeBNCC, addHabilidadeManual, getDisciplinas,
  getHabilidadesBNCCPorDisciplinaEtapa,
  getHabilidadesBNCC, getHabilidadesManuais,
  removeHabilidadeBNCC, removeHabilidadeManual,
  createPeriodos, replicarDisciplinas, updateDisciplinaMatriz, substituirHabilidades,
  MetodoAvaliacao, PeriodoMatriz, MatrizCurricular,
} from '@/lib/actions/matrizes'
import { getEtapasEnsino, getSubetapas, type EtapaEnsino } from '@/lib/actions/etapas-ensino'

function LabelWithTooltip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <Label className="flex items-center gap-1.5">
      {label}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors shrink-0" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Label>
  )
}

interface Props {
  schoolId: string | null
  matrizId?: string | null
  onSaved: () => void
  onCancel: () => void
}

type FormData = {
  descricao: string
  anoLetivoId: string
  etapaId: string
  subetapaId: string
  metodoId: string
  dataInicial: string
  dataFinal: string
  turnos: string[]
  tipoTurma: string[]
  aulasDiariasRegular: number
  aulasSemanaisRegular: number
  duracaoAulaRegular: number
  aulasDiariasIntegral: number
  aulasSemanaisIntegral: number
  duracaoAulaIntegral: number
}

const defaultForm: FormData = {
  descricao: '',
  anoLetivoId: '',
  etapaId: '',
  subetapaId: '',
  metodoId: '',
  dataInicial: '',
  dataFinal: '',
  turnos: [],
  tipoTurma: [],
  aulasDiariasRegular: 0,
  aulasSemanaisRegular: 0,
  duracaoAulaRegular: 0,
  aulasDiariasIntegral: 0,
  aulasSemanaisIntegral: 0,
  duracaoAulaIntegral: 0,
}

const TURNOS = ['matutino', 'vespertino', 'noturno'] as const
const TIPOS_TURMA = ['regular', 'integral'] as const

export function MatrizForm({ schoolId, matrizId, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<FormData>({ ...defaultForm })
  const [saving, setSaving] = useState(false)
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([])
  const [etapas, setEtapas] = useState<EtapaEnsino[]>([])
  const [metodos, setMetodos] = useState<MetodoAvaliacao[]>([])
  const [subetapas, setSubetapas] = useState<{ id: string; nome: string }[]>([])
  const [createdMatrizId, setCreatedMatrizId] = useState<string | null>(null)
  const [periodos, setPeriodos] = useState<PeriodoMatriz[]>([])
  const [disciplinasPorPeriodo, setDisciplinasPorPeriodo] = useState<Record<string, any[]>>({})
  const [expandedPeriodoId, setExpandedPeriodoId] = useState<string | null>(null)

  /* disciplina modal state */
  const [showDiscModal, setShowDiscModal] = useState(false)
  const [periodoSelecionado, setPeriodoSelecionado] = useState<PeriodoMatriz | null>(null)
  const [disciplinasDisponiveis, setDisciplinasDisponiveis] = useState<any[]>([])
  const [habilidadesBNCC, setHabilidadesBNCC] = useState<any[]>([])
  const [habilidadesManuais, setHabilidadesManuais] = useState<{ id: string; codigo: string; descricao: string }[]>([])
  const [continuarAposAdicionar, setContinuarAposAdicionar] = useState(false)
  const [savingDisc, setSavingDisc] = useState(false)
  const [replicarLoading, setReplicarLoading] = useState(false)
  const [showReplicarConfirm, setShowReplicarConfirm] = useState(false)
  const [editandoDiscId, setEditandoDiscId] = useState<string | null>(null)
  const [abaHabilidades, setAbaHabilidades] = useState<'bncc' | 'outras'>('bncc')
  const [discForm, setDiscForm] = useState({
    disciplinaId: '',
    habilidadesBNCC: [] as string[],
    habilidadeManualCodigo: '',
    habilidadeManualDescricao: '',
    tipoDisciplina: 'base_comum',
    desconsideraReprovacao: false,
    cargaRegular: false,
    cargaIntegral: false,
    cargaRegularMinutos: 0,
    cargaIntegralMinutos: 0,
  })

  /* Carregar dados existentes para edição */
  useEffect(() => {
    if (matrizId && etapas.length > 0) {
      ;(async () => {
        try {
          const data = await getMatriz(matrizId)
          if (!data) return

          const etapa = etapas.find(e => e.id === data.etapa_ensino_id)
          let subetapasData: { id: string; nome: string }[] = []
          if (etapa) {
            subetapasData = await getSubetapas(etapa.id)
            setSubetapas(subetapasData)
          }

          setForm({
            descricao: data.descricao || '',
            anoLetivoId: data.ano_letivo_id || '',
            etapaId: data.etapa_ensino_id || '',
            subetapaId: data.subetapa_id || '',
            metodoId: data.metodo_avaliacao_id || '',
            dataInicial: data.data_inicial?.split('T')[0] || '',
            dataFinal: data.data_final?.split('T')[0] || '',
            turnos: data.turnos || [],
            tipoTurma: data.tipo_turma || [],
            aulasDiariasRegular: data.aulas_diarias_regular || 0,
            aulasSemanaisRegular: data.aulas_semanais_regular || 0,
            duracaoAulaRegular: data.duracao_aula_regular || 0,
            aulasDiariasIntegral: data.aulas_diarias_integral || 0,
            aulasSemanaisIntegral: data.aulas_semanais_integral || 0,
            duracaoAulaIntegral: data.duracao_aula_integral || 0,
          })

          // Load existing periods
          const periodosData = await getPeriodos(matrizId)
          setPeriodos(periodosData || [])
        } catch {
          toast.error('Erro ao carregar dados da matriz')
        }
      })()
    }
  }, [matrizId, etapas])

  const aulasAnuais = (diarias: number, semanais: number) =>
    diarias > 0 && semanais > 0 ? semanais * 40 : 0

  const set = (field: keyof FormData, value: any) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleArray = (field: 'turnos' | 'tipoTurma', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value],
    }))
  }

  useEffect(() => {
    Promise.all([getEtapasEnsino(schoolId), getMetodosAvaliacao(schoolId), getAnosLetivos(schoolId)])
      .then(([etapasData, metodosData, anosData]) => {
        setEtapas(etapasData || [])
        setMetodos(metodosData || [])
        setAnosLetivos(anosData || [])
      })
      .catch(() => toast.error('Erro ao carregar dados'))
  }, [schoolId])

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

  const handleEtapaChange = (value: string) => {
    setForm(prev => ({ ...prev, etapaId: value, subetapaId: '' }))
    if (value) {
      getSubetapas(value).then(data => setSubetapas(data || [])).catch(() => {})
    } else {
      setSubetapas([])
    }
  }

  const handleSave = async () => {
    if (!schoolId) { toast.error('Escola não selecionada'); return }
    if (!form.descricao.trim()) { toast.error('Descrição é obrigatória'); return }
    if (!form.anoLetivoId) { toast.error('Ano letivo é obrigatório'); return }
    if (!form.metodoId) { toast.error('Método de avaliação é obrigatório'); return }
    if (!form.dataInicial || !form.dataFinal) { toast.error('Datas inicial e final são obrigatórias'); return }
    if (form.turnos.length === 0) { toast.error('Selecione pelo menos um turno'); return }
    if (form.tipoTurma.length === 0) { toast.error('Selecione pelo menos um tipo de turma'); return }

    const temRegular = form.tipoTurma.includes('regular')
    const temIntegral = form.tipoTurma.includes('integral')

    if (temRegular && (!form.aulasDiariasRegular || !form.aulasSemanaisRegular || !form.duracaoAulaRegular)) {
      toast.error('Preencha os campos de aulas para turno Regular'); return
    }
    if (temIntegral && (!form.aulasDiariasIntegral || !form.aulasSemanaisIntegral || !form.duracaoAulaIntegral)) {
      toast.error('Preencha os campos de aulas para turno Integral'); return
    }

    try {
      setSaving(true)
      const payload = {
        school_id: schoolId,
        ano_letivo_id: form.anoLetivoId,
        etapa_ensino_id: form.etapaId,
        subetapa_id: form.subetapaId || null,
        metodo_avaliacao_id: form.metodoId,
        descricao: form.descricao,
        data_inicial: form.dataInicial,
        data_final: form.dataFinal,
        turnos: form.turnos,
        tipo_turma: form.tipoTurma,
        aulas_diarias_regular: temRegular ? form.aulasDiariasRegular : null,
        aulas_semanais_regular: temRegular ? form.aulasSemanaisRegular : null,
        aulas_anuais_regular: temRegular ? aulasAnuais(form.aulasDiariasRegular, form.aulasSemanaisRegular) : null,
        duracao_aula_regular: temRegular ? form.duracaoAulaRegular : null,
        aulas_diarias_integral: temIntegral ? form.aulasDiariasIntegral : null,
        aulas_semanais_integral: temIntegral ? form.aulasSemanaisIntegral : null,
        aulas_anuais_integral: temIntegral ? aulasAnuais(form.aulasDiariasIntegral, form.aulasSemanaisIntegral) : null,
        duracao_aula_integral: temIntegral ? form.duracaoAulaIntegral : null,
      }

      if (matrizId) {
        await updateMatriz(matrizId, payload)
        toast.success('Matriz atualizada!')
        onSaved()
      } else {
        const novaMatriz = await createMatriz({ ...payload, ativa: true })

        const metodo = metodos.find(m => m.id === form.metodoId)
        if (metodo && novaMatriz) {
          const qtd = metodo.quantidade_periodos_numerico || metodo.quantidade_periodos_conceito || metodo.quantidade_periodos_parecer || metodo.quantidade_periodos_nivel || 4
          const nomes = Array.from({ length: qtd }, (_, i) => `${i + 1}º Bimestre`)
          await createPeriodos(novaMatriz.id, qtd, nomes)

          const periodosData = await getPeriodos(novaMatriz.id)
          setPeriodos(periodosData || [])
          setCreatedMatrizId(novaMatriz.id)
          toast.success('Matriz criada! Agora você pode adicionar disciplinas aos períodos.')
        }
      }
    } catch (err) {
      console.error('Erro ao criar/atualizar matriz:', err)
      toast.error('Erro ao salvar matriz')
    } finally {
      setSaving(false)
    }
  }

  /* --- Periodos helpers --- */
  const loadDisciplinasPeriodo = async (periodoId: string) => {
    const data = await getDisciplinasPorPeriodo(periodoId)
    setDisciplinasPorPeriodo(prev => ({ ...prev, [periodoId]: data || [] }))
  }

  const toggleExpandPeriodo = async (periodoId: string) => {
    if (expandedPeriodoId === periodoId) {
      setExpandedPeriodoId(null)
    } else {
      setExpandedPeriodoId(periodoId)
      if (!disciplinasPorPeriodo[periodoId]) {
        await loadDisciplinasPeriodo(periodoId)
      }
    }
  }

  const openDisciplinaModal = async (periodo: PeriodoMatriz, disc?: any) => {
    try {
      const disciplinasData = await getDisciplinas(schoolId)
      setDisciplinasDisponiveis(disciplinasData || [])
      resetDiscForm()
      setPeriodoSelecionado(periodo)
      setHabilidadesBNCC([])
      setEditandoDiscId(null)

      if (disc) {
        setEditandoDiscId(disc.id)
        setDiscForm(prev => ({
          ...prev,
          disciplinaId: disc.disciplina_id,
          tipoDisciplina: disc.tipo_disciplina || 'base_comum',
          desconsideraReprovacao: disc.desconsidera_reprovacao || false,
          cargaRegular: !!disc.carga_horaria_regular_minutos,
          cargaIntegral: !!disc.carga_horaria_integral_minutos,
          cargaRegularMinutos: disc.carga_horaria_regular_minutos || 0,
          cargaIntegralMinutos: disc.carga_horaria_integral_minutos || 0,
        }))

        // Carregar habilidades existentes
        const [bnccs, manuais] = await Promise.all([
          getHabilidadesBNCC(disc.id),
          getHabilidadesManuais(disc.id),
        ])
        setDiscForm(prev => ({
          ...prev,
          habilidadesBNCC: bnccs?.map((h: any) => h.habilidade_codigo) || [],
        }))
        setHabilidadesManuais(manuais?.map((h: any) => ({ id: h.id, codigo: h.codigo, descricao: h.descricao })) || [])

        // Carregar habilidades BNCC disponíveis para exibição
        await carregarHabilidades(disc.disciplina_id)
      }

      setShowDiscModal(true)
    } catch (err: any) {
      console.error('Erro carregar dados disc modal:', err?.message || err?.description || err)
      toast.error('Erro ao carregar dados')
    }
  }

  const carregarHabilidades = async (disciplinaId: string) => {
    if (!disciplinaId) { setHabilidadesBNCC([]); return }

    const disciplina = disciplinasDisponiveis.find(d => d.id === disciplinaId)
    if (!disciplina) return

    const etapaSelecionada = etapas.find(e => e.id === form.etapaId)
    if (!etapaSelecionada) return

    const etapaEnsino = etapaSelecionada.etapa_tipo === 'fundamental_inicial' ? 'anos_iniciais'
      : etapaSelecionada.etapa_tipo === 'fundamental_finais' ? 'anos_finais'
      : null
    if (!etapaEnsino) return

    // Tenta extrair ano da subetapa; se não houver, usa o nome da ETAPA
    const subetapa = subetapas.find(s => s.id === form.subetapaId)
    const nomeAno = subetapa?.nome || etapaSelecionada.etapa_nome || ''

    try {
      const data = await getHabilidadesBNCCPorDisciplinaEtapa(disciplina.nome, etapaEnsino)

      if (!nomeAno) {
        setHabilidadesBNCC(data || [])
        return
      }

      const ordinalMatch = nomeAno.match(/(\d+)[º°o]/i)
      const apenasDigitos = nomeAno.match(/(\d+)/)
      const anoFilter = ordinalMatch
        ? ordinalMatch[1] + 'º'
        : apenasDigitos
          ? apenasDigitos[1] + 'º'
          : null

      if (!anoFilter) {
        setHabilidadesBNCC(data || [])
        return
      }

      const filtradas = (data || []).filter((h: any) => {
        if (!h.anos) return false
        const anosArr = Array.isArray(h.anos) ? h.anos : [h.anos]
        return anosArr.some((a: string) => {
          const normalizado = String(a).replace('°', 'º').trim()
          return normalizado === anoFilter || normalizado.startsWith(anoFilter)
        })
      })

      setHabilidadesBNCC(filtradas.length > 0 ? filtradas : (data || []))
    } catch { toast.error('Erro ao carregar habilidades') }
  }

  const resetDiscForm = () => {
    setDiscForm({
      disciplinaId: '',
      habilidadesBNCC: [],
      habilidadeManualCodigo: '',
      habilidadeManualDescricao: '',
      tipoDisciplina: 'base_comum',
      desconsideraReprovacao: false,
      cargaRegular: false,
      cargaIntegral: false,
      cargaRegularMinutos: 0,
      cargaIntegralMinutos: 0,
    })
    setHabilidadesManuais([])
    setEditandoDiscId(null)
  }

  const handleAddDisciplina = async (continuar: boolean) => {
    if (!periodoSelecionado) return
    if (!discForm.disciplinaId) { toast.error('Selecione uma disciplina'); return }
    if (savingDisc) return
    setContinuarAposAdicionar(continuar)
    setSavingDisc(true)

    try {
      let discId: string

      if (editandoDiscId) {
        // Edição: atualizar registro existente
        await updateDisciplinaMatriz(editandoDiscId, {
          disciplina_id: discForm.disciplinaId,
          desconsidera_reprovacao: discForm.desconsideraReprovacao,
          tipo_disciplina: discForm.tipoDisciplina as 'base_comum' | 'parte_diversificada',
          carga_horaria_regular_minutos: discForm.cargaRegular ? discForm.cargaRegularMinutos : null,
          carga_horaria_integral_minutos: discForm.cargaIntegral ? discForm.cargaIntegralMinutos : null,
        })
        discId = editandoDiscId
        await substituirHabilidades(discId, discForm.habilidadesBNCC, habilidadesManuais.map(h => ({ codigo: h.codigo, descricao: h.descricao })))
      } else {
        const nova = await createDisciplinaMatriz({
          periodo_id: periodoSelecionado.id,
          disciplina_id: discForm.disciplinaId,
          desconsidera_reprovacao: discForm.desconsideraReprovacao,
          tipo_disciplina: discForm.tipoDisciplina as 'base_comum' | 'parte_diversificada',
          carga_horaria_regular_minutos: discForm.cargaRegular ? discForm.cargaRegularMinutos : null,
          carga_horaria_integral_minutos: discForm.cargaIntegral ? discForm.cargaIntegralMinutos : null,
        })
        discId = nova.id
      }

      await Promise.all([
        ...discForm.habilidadesBNCC.map(codigo => addHabilidadeBNCC(discId, codigo)),
        ...habilidadesManuais.map(h => addHabilidadeManual(discId, h.codigo, h.descricao)),
      ])

      await loadDisciplinasPeriodo(periodoSelecionado.id)

      if (continuar) {
        resetDiscForm()
        setEditandoDiscId(null)
        toast.success(editandoDiscId ? 'Disciplina atualizada!' : 'Disciplina adicionada!')
      } else {
        setShowDiscModal(false)
        toast.success(editandoDiscId ? 'Disciplina atualizada com sucesso!' : 'Disciplina adicionada com sucesso!')
      }
    } catch {
      toast.error('Erro ao salvar disciplina')
    } finally {
      setSavingDisc(false)
    }
  }

  const handleDeleteDisciplina = async (disciplinaId: string, periodoId: string) => {
    try {
      await deleteDisciplinaMatriz(disciplinaId)
      await loadDisciplinasPeriodo(periodoId)
      toast.success('Disciplina removida')
    } catch { toast.error('Erro ao remover disciplina') }
  }

  const handleReplicarDisciplinas = async () => {
    if (periodos.length <= 1) return
    if (replicarLoading) return
    const matrizIdAtual = matrizId || createdMatrizId
    if (!matrizIdAtual) return
    setReplicarLoading(true)
    try {
      const primeiro = periodos[0]
      await replicarDisciplinas(matrizIdAtual, primeiro.id, periodos.slice(1).map(p => p.id))
      toast.success('Disciplinas replicadas!')
      for (const p of periodos) {
        await loadDisciplinasPeriodo(p.id)
      }
    } catch {
      toast.error('Erro ao replicar disciplinas')
    } finally {
      setReplicarLoading(false)
    }
  }

  /* --- Handlers for disc modal --- */
  const addNovaHabilidadeManual = () => {
    if (!discForm.habilidadeManualCodigo.trim() || !discForm.habilidadeManualDescricao.trim()) { toast.error('Informe código e descrição'); return }
    setHabilidadesManuais(prev => [...prev, { id: crypto.randomUUID(), codigo: discForm.habilidadeManualCodigo, descricao: discForm.habilidadeManualDescricao }])
    setDiscForm(prev => ({ ...prev, habilidadeManualCodigo: '', habilidadeManualDescricao: '' }))
  }

  const removeHabilidadeManualLocal = (id: string) => {
    setHabilidadesManuais(prev => prev.filter(h => h.id !== id))
  }

  /* --- Render --- */
  return (
    <div className="space-y-6 [&_[data-slot='input']]:border-border [&_[data-slot='input']]:focus-visible:border-primary [&_[data-slot='input']]:focus-visible:ring-2 [&_[data-slot='input']]:focus-visible:ring-primary/20 [&_[data-slot='checkbox']]:border-border [&_[data-slot='checkbox']]:data-[state=checked]:border-primary">
      {/* Identificação */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-base font-semibold text-foreground">Identificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pb-6 pt-0">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" value={form.descricao} onChange={(e) => set('descricao', e.target.value)} placeholder="Ex: Matriz Curricular 2026 - Fundamental I" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <LabelWithTooltip label="Ano Letivo" tooltip="Selecione o ano letivo ao qual esta matriz pertence." />
              <Select value={form.anoLetivoId} onValueChange={(v) => set('anoLetivoId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  {anosLetivos.map(ano => (
                    <SelectItem key={ano.id} value={ano.id}>{ano.descricao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <LabelWithTooltip label="Etapa de Ensino" tooltip="Selecione a etapa de ensino à qual esta matriz pertence." />
              <Select value={form.etapaId} onValueChange={handleEtapaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  {etapasAgrupadas.map(grupo => (
                    <SelectGroup key={grupo.titulo}>
                      <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-primary bg-muted">{grupo.titulo}</SelectLabel>
                      {grupo.etapas.map(etapa => (
                        <SelectItem key={etapa.id} value={etapa.id} className="pl-4">{etapa.etapa_nome}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <LabelWithTooltip label="Subetapa" tooltip="Subdivisão opcional da etapa de ensino (ex: 1º ano, 2º ano)." />
              <Select value={form.subetapaId} onValueChange={(v) => set('subetapaId', v === 'none' ? '' : v)} disabled={!form.etapaId || subetapas.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Nenhuma" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  <SelectItem key="none" value="none">Nenhuma</SelectItem>
                  {subetapas.map(sub => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <LabelWithTooltip label="Método de Avaliação" tooltip="Método que define como os alunos serão avaliados nesta matriz." />
              <Select value={form.metodoId} onValueChange={(v) => set('metodoId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  {metodos.map(metodo => (
                    <SelectItem key={metodo.id} value={metodo.id}>
                      <span>{metodo.nome}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <DatePickerDual
                labelInicio="Data Inicial"
                labelTermino="Data Final"
                valorInicio={form.dataInicial}
                valorTermino={form.dataFinal}
                onChangeInicio={(v) => set('dataInicial', v)}
                onChangeTermino={(v) => set('dataFinal', v)}
                required
              />
            </div>
          </div>

          <Separator className="bg-muted" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Turnos</Label>
              <div className="flex flex-wrap gap-3 pt-1">
                {TURNOS.map(turno => (
                  <label key={turno} className="flex items-center gap-1.5 cursor-pointer">
                    <Checkbox checked={form.turnos.includes(turno)} onCheckedChange={() => toggleArray('turnos', turno)} />
                    <span className="text-sm capitalize">{turno}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Turma</Label>
              <div className="flex flex-wrap gap-3 pt-1">
                {TIPOS_TURMA.map(tipo => (
                  <label key={tipo} className="flex items-center gap-1.5 cursor-pointer">
                    <Checkbox checked={form.tipoTurma.includes(tipo)} onCheckedChange={() => toggleArray('tipoTurma', tipo)} />
                    <span className="text-sm capitalize">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aulas */}
      {form.tipoTurma.includes('regular') && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold text-foreground">Configuração - Turno Regular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-6 pb-6 pt-0">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aulas_diarias_reg">Aulas Diárias</Label>
                <Input id="aulas_diarias_reg" type="number" min={0} value={form.aulasDiariasRegular || ''} onChange={(e) => set('aulasDiariasRegular', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aulas_semanais_reg">Aulas Semanais</Label>
                <Input id="aulas_semanais_reg" type="number" min={0} value={form.aulasSemanaisRegular || ''} onChange={(e) => set('aulasSemanaisRegular', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracao_aula_reg">Duração (min)</Label>
                <Input id="duracao_aula_reg" type="number" min={0} value={form.duracaoAulaRegular || ''} onChange={(e) => set('duracaoAulaRegular', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="space-y-2 w-40">
              <Label>Aulas Anuais (estimado)</Label>
              <Input type="number" disabled value={aulasAnuais(form.aulasDiariasRegular, form.aulasSemanaisRegular)} className="bg-muted" />
            </div>
          </CardContent>
        </Card>
      )}

      {form.tipoTurma.includes('integral') && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold text-foreground">Configuração - Turno Integral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-6 pb-6 pt-0">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aulas_diarias_int">Aulas Diárias</Label>
                <Input id="aulas_diarias_int" type="number" min={0} value={form.aulasDiariasIntegral || ''} onChange={(e) => set('aulasDiariasIntegral', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aulas_semanais_int">Aulas Semanais</Label>
                <Input id="aulas_semanais_int" type="number" min={0} value={form.aulasSemanaisIntegral || ''} onChange={(e) => set('aulasSemanaisIntegral', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracao_aula_int">Duração (min)</Label>
                <Input id="duracao_aula_int" type="number" min={0} value={form.duracaoAulaIntegral || ''} onChange={(e) => set('duracaoAulaIntegral', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="space-y-2 w-40">
              <Label>Aulas Anuais (estimado)</Label>
              <Input type="number" disabled value={aulasAnuais(form.aulasDiariasIntegral, form.aulasSemanaisIntegral)} className="bg-muted" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Períodos */}
      {periodos.length > 0 && (
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground">Períodos</CardTitle>
              {periodos.length > 1 && (
              <Button variant="outline" size="sm" onClick={() => setShowReplicarConfirm(true)} disabled={replicarLoading} className="border-border">
                <Copy className="w-4 h-4 mr-1" /> {replicarLoading ? 'Replicando...' : 'Replicar para demais períodos'}
              </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-4">
            {periodos.map((periodo, idx) => {
              const isOpen = expandedPeriodoId === periodo.id
              const disciplinas = disciplinasPorPeriodo[periodo.id]
              return (
                <div key={periodo.id} className="border border-border rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-muted/40 cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => toggleExpandPeriodo(periodo.id)}
                  >
                    <div className="flex items-center gap-2">
                      {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                      <span className="font-medium text-sm">{periodo.periodo_nome}</span>
                      {disciplinas && <span className="text-xs text-muted-foreground">({disciplinas.length} disciplinas)</span>}
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={(e) => { e.stopPropagation(); openDisciplinaModal(periodo) }}>
                      <Plus className="w-3 h-3" />
                      Adicionar Disciplinas
                    </Button>
                  </div>

                  {isOpen && (
                    <div className="border-t border-border px-4 py-3 space-y-2">
                      {!disciplinas || disciplinas.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Nenhuma disciplina neste período.</p>
                      ) : (
                        disciplinas.map((disc: any) => (
                          <div key={disc.id} className="flex items-center justify-between p-2 bg-card rounded border border-border">
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="w-4 h-4 text-primary/60" />
                              <span>{disc.academico_disciplinas?.nome || disc.disciplina_id}</span>
                              {disc.carga_horaria_regular_minutos && <span className="text-xs text-muted-foreground">Regular: {disc.carga_horaria_regular_minutos}min</span>}
                              {disc.carga_horaria_integral_minutos && <span className="text-xs text-muted-foreground">Integral: {disc.carga_horaria_integral_minutos}min</span>}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); openDisciplinaModal(periodo, disc) }} className="text-muted-foreground hover:text-primary">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteDisciplina(disc.id, periodo.id)} className="text-destructive hover:text-destructive/80">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-card py-4 px-2 -mx-4 -mb-4 border-t border-border shadow-sm">
        <Button variant="outline" onClick={onCancel} className="border-border hover:bg-muted">Cancelar</Button>
        {periodos.length === 0 ? (
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 min-w-[180px] shadow-sm shadow-primary/20">
            {saving ? 'Salvando...' : 'Criar e Configurar Períodos'}
          </Button>
        ) : (
          <Button onClick={onSaved} className="bg-primary hover:bg-primary/90 min-w-[140px] shadow-sm shadow-primary/20">
            Concluir
          </Button>
        )}
      </div>

      {/* Modal de Disciplina */}
      <Dialog open={showDiscModal} onOpenChange={(open) => { if (!open) setShowDiscModal(false) }}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>{editandoDiscId ? 'Editar' : 'Adicionar'} Disciplina - {periodoSelecionado?.periodo_nome}</DialogTitle>
            <DialogDescription>{editandoDiscId ? 'Edite as habilidades e configurações da disciplina.' : 'Selecione uma disciplina e vincule habilidades BNCC ou crie habilidades manuais.'}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            <div className="space-y-2">
              <Label>Disciplina</Label>
              <Select value={discForm.disciplinaId} onValueChange={(v) => { setDiscForm(prev => ({ ...prev, disciplinaId: v, habilidadesBNCC: [] })); carregarHabilidades(v) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  {disciplinasDisponiveis.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="tipoDisciplina" value="base_comum" checked={discForm.tipoDisciplina === 'base_comum'} onChange={() => setDiscForm(prev => ({ ...prev, tipoDisciplina: 'base_comum' }))} />
                  <span className="text-sm">Base Comum</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="tipoDisciplina" value="parte_diversificada" checked={discForm.tipoDisciplina === 'parte_diversificada'} onChange={() => setDiscForm(prev => ({ ...prev, tipoDisciplina: 'parte_diversificada' }))} />
                  <span className="text-sm">Parte Diversificada</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="desconsidera_reprovacao" checked={discForm.desconsideraReprovacao} onCheckedChange={(v) => setDiscForm(prev => ({ ...prev, desconsideraReprovacao: v === true }))} />
              <Label htmlFor="desconsidera_reprovacao" className="text-sm">Desconsiderar para reprovação</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={discForm.cargaRegular} onCheckedChange={(v) => setDiscForm(prev => ({ ...prev, cargaRegular: v === true }))} className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <span className="text-sm font-medium">Carga Horária Regular</span>
                </label>
                {discForm.cargaRegular && (
                  <Input type="number" min={0} value={discForm.cargaRegularMinutos ? Math.round(discForm.cargaRegularMinutos / 60) : ''} onChange={(e) => setDiscForm(prev => ({ ...prev, cargaRegularMinutos: (parseInt(e.target.value) || 0) * 60 }))} placeholder="Horas" className="w-32" />
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={discForm.cargaIntegral} onCheckedChange={(v) => setDiscForm(prev => ({ ...prev, cargaIntegral: v === true }))} className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <span className="text-sm font-medium">Carga Horária Integral</span>
                </label>
                {discForm.cargaIntegral && (
                  <Input type="number" min={0} value={discForm.cargaIntegralMinutos ? Math.round(discForm.cargaIntegralMinutos / 60) : ''} onChange={(e) => setDiscForm(prev => ({ ...prev, cargaIntegralMinutos: (parseInt(e.target.value) || 0) * 60 }))} placeholder="Horas" className="w-32" />
                )}
              </div>
            </div>

            {discForm.tipoDisciplina === 'base_comum' && (
              <div className="space-y-0">
                <div className="flex border-b border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAbaHabilidades('bncc')}
                    className={`relative ${abaHabilidades === 'bncc' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Habilidades BNCC
                    {abaHabilidades === 'bncc' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAbaHabilidades('outras')}
                    className={`relative ${abaHabilidades === 'outras' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Outras Habilidades
                    {abaHabilidades === 'outras' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                  </Button>
                </div>

                {abaHabilidades === 'bncc' ? (
                  habilidadesBNCC.length > 0 ? (
                    <div className="space-y-3 pt-3">
                      <div className="flex items-center justify-between">
                        <Label>Habilidades BNCC</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="link"
                            size="xs"
                            onClick={() => setDiscForm(prev => ({ ...prev, habilidadesBNCC: habilidadesBNCC.map((h: any) => h.codigo_bncc) }))}
                            className="text-xs"
                          >
                            Selecionar Todos
                          </Button>
                          <Button
                            variant="link"
                            size="xs"
                            onClick={() => setDiscForm(prev => ({ ...prev, habilidadesBNCC: [] }))}
                            className="text-xs text-muted-foreground"
                          >
                            Limpar
                          </Button>
                        </div>
                      </div>
                      {(() => {
                        const grupos: Record<string, Record<string, any[]>> = {}
                        for (const h of habilidadesBNCC) {
                          const tema = h.objeto_conhecimento?.unidade_tematica?.unidade_tematica || 'Geral'
                          const objeto = h.objeto_conhecimento?.objeto_conhecimento || 'Geral'
                          if (!grupos[tema]) grupos[tema] = {}
                          if (!grupos[tema][objeto]) grupos[tema][objeto] = []
                          grupos[tema][objeto].push(h)
                        }
                        return Object.entries(grupos).map(([tema, objetos]) => (
                          <div key={tema} className="border border-border rounded-lg overflow-hidden">
                            <div className="bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
                              {tema}
                            </div>
                            <div className="p-2 space-y-2">
                              {Object.entries(objetos).map(([objetoNome, habs]) => (
                                <div key={objetoNome} className="border border-border rounded-md overflow-hidden">
                                  <div className="bg-card/80 px-2 py-1.5 text-[11px] font-medium text-muted-foreground border-b border-border">
                                    {objetoNome}
                                  </div>
                                  <div className="p-1.5 space-y-0.5">
                                    {habs.map((h: any) => (
                                      <label key={h.id} className="flex items-start gap-2 cursor-pointer py-1 px-1.5 rounded hover:bg-muted transition-colors">
                                        <Checkbox
                                          checked={discForm.habilidadesBNCC.includes(h.codigo_bncc)}
                                          onCheckedChange={() =>
                                            setDiscForm(prev => ({
                                              ...prev,
                                              habilidadesBNCC: prev.habilidadesBNCC.includes(h.codigo_bncc)
                                                ? prev.habilidadesBNCC.filter((c: string) => c !== h.codigo_bncc)
                                                : [...prev.habilidadesBNCC, h.codigo_bncc],
                                            }))
                                          }
                                          className="size-4 mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <span className="text-xs font-medium text-primary">{h.codigo_bncc}</span>
                                          <span className="text-xs text-muted-foreground ml-1">{h.descricao}</span>
                                        </div>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  ) : discForm.disciplinaId ? (
                    <div className="space-y-2 pt-3">
                      <Label>Habilidades BNCC</Label>
                      <p className="text-xs text-muted-foreground">Nenhuma habilidade encontrada para esta disciplina e etapa.</p>
                    </div>
                  ) : null
                ) : (
                  <div className="space-y-2 pt-3">
                    <Label>Outras Habilidades</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Código" value={discForm.habilidadeManualCodigo} onChange={e => setDiscForm(prev => ({ ...prev, habilidadeManualCodigo: e.target.value }))} className="w-24" />
                      <Input placeholder="Descrição" value={discForm.habilidadeManualDescricao} onChange={e => setDiscForm(prev => ({ ...prev, habilidadeManualDescricao: e.target.value }))} />
                      <Button variant="outline" onClick={addNovaHabilidadeManual}>Adicionar</Button>
                    </div>
                    {habilidadesManuais.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {habilidadesManuais.map(h => (
                          <div key={h.id} className="flex items-center justify-between p-2 bg-muted/40 rounded border border-border">
                            <div><span className="text-xs font-medium text-primary">{h.codigo}</span><span className="text-xs text-muted-foreground ml-2">{h.descricao}</span></div>
                            <Button variant="link" size="xs" onClick={() => removeHabilidadeManualLocal(h.id)} className="text-xs text-destructive">Remover</Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {discForm.tipoDisciplina === 'parte_diversificada' && (
              <div className="space-y-2">
                <Label>Outras Habilidades</Label>
                <div className="flex gap-2">
                  <Input placeholder="Código" value={discForm.habilidadeManualCodigo} onChange={e => setDiscForm(prev => ({ ...prev, habilidadeManualCodigo: e.target.value }))} className="w-24" />
                  <Input placeholder="Descrição" value={discForm.habilidadeManualDescricao} onChange={e => setDiscForm(prev => ({ ...prev, habilidadeManualDescricao: e.target.value }))} />
                  <Button variant="outline" onClick={addNovaHabilidadeManual}>Adicionar</Button>
                </div>
                {habilidadesManuais.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {habilidadesManuais.map(h => (
                      <div key={h.id} className="flex items-center justify-between p-2 bg-muted/40 rounded border border-border">
                        <div><span className="text-xs font-medium text-primary">{h.codigo}</span><span className="text-xs text-muted-foreground ml-2">{h.descricao}</span></div>
                        <Button variant="link" size="xs" onClick={() => removeHabilidadeManualLocal(h.id)} className="text-xs text-destructive">Remover</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 px-6 pb-6 pt-4 border-t border-border gap-2">
            <Button variant="outline" onClick={() => setShowDiscModal(false)} disabled={savingDisc} className="border-border">Cancelar</Button>
            <Button onClick={() => handleAddDisciplina(true)} disabled={savingDisc} variant="secondary" className="shadow-sm">
              {savingDisc ? 'Salvando...' : editandoDiscId ? 'Salvar e Continuar' : 'Adicionar e Continuar'}
            </Button>
            <Button onClick={() => handleAddDisciplina(false)} disabled={savingDisc} className="bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20">
              {savingDisc ? 'Salvando...' : editandoDiscId ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmar replicação */}
      <AlertDialog open={showReplicarConfirm} onOpenChange={setShowReplicarConfirm}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Replicar disciplinas?</AlertDialogTitle>
            <AlertDialogDescription>
              Copiar todas as disciplinas do 1º período para os demais? As disciplinas existentes nos períodos destino serão substituídas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReplicarDisciplinas} className="bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20">
              Replicar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
