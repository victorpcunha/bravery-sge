'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PillToggleGroup } from '@/components/ui/pill-toggle'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, UserPlus, Clock, Calendar, BookOpen, GraduationCap } from 'lucide-react'
import { getSubetapas, type Subetapa } from '@/lib/actions/etapas-ensino'
import { ETAPAS_ENSINO, ETAPAS_AGREGADAS } from '@/data/censo/etapas-ensino'
import {
  getTurma, createTurma, updateTurma,
  addProfissionalTurma, updateProfissionalTurma, removeProfissionalTurma,
  getDisciplinasPorMatriz, getProfissionaisAtivos, getVinculosAtivosProfissional,
  type Turno,
} from '@/lib/actions/turmas'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('T')[0].split('-')
  if (!y || !m || !day) return d
  return `${day}/${m}/${y}`
}

const DIAS_SEMANA = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado',
]

const TIPOS_MEDIACAO = ['Presencial', 'Semipresencial', 'Educação a Distância - EAD']
const TIPOS_ENSINO = ['Não informado', 'Remota', 'Híbrida']

const LOCAIS_FUNCIONAMENTO = [
  { value: 'A turma não está em local de funcionamento diferenciado', label: 'Não está em local diferenciado' },
  { value: 'Sala anexa', label: 'Sala anexa' },
  { value: 'Unidade de atendimento socioeducativo', label: 'Unidade socioeducativa' },
  { value: 'Unidade prisional', label: 'Unidade prisional' },
]

const CICLOS_INICIO = ['1° Semestre', '2° Semestre']
const MODALIDADES = ['Ensino Regular', 'Educação especial - modalidade substitutiva', 'Educação de jovens e adultos', 'Educação profissional']
const TURNOS_OPCOES = ['Matutino', 'Vespertino', 'Integral', 'Noturno']

const TIPOS_TURMA = [
  'Atendimento Educacional Especializado (AEE)',
  'Atividade Complementar',
  'Curricular',
  'Curricular com Atividade Complementar',
]

const ORGANIZACAO_CURRICULAR = ['Formação geral básica', 'Itinerário formativo de aprofundamento', 'Itinerário de formação técnica e profissional']
const AREAS_ITINERARIO = ['Linguagens e suas tecnologias', 'Ciências humanas e sociais aplicadas', 'Ciências da natureza e suas tecnologias', 'Matemática e suas tecnologias']
const FORMAS_ORGANIZACAO = [
  'Série/ano (séries anuais)',
  'Ciclo(s)',
  'Módulos',
  'Períodos semestrais',
  'Grupos não-seriados com base na idade ou competência (art. 23 da LDB)',
  'Alternância regular de períodos de estudos',
]
const TIPOS_CURSO = ['Curso Técnico', 'Qualificação profissional técnica']

const MULTIETA_CODES = [3, 22, 56, 72]
const EIXO_QUALIFICACAO_CODES = [67, 68, 73, 75]
const AGREGADA_INFANTIL = 301
const AGREGADA_MEDIO = 304
const AGREGADA_MEDIO_MAGISTERIO = 305

const FORMAS_POR_ETAPA: Record<string, Set<number>> = {
  'Série/ano (séries anuais)': new Set([14,15,16,17,18,19,20,21,41,22,23,56,25,26,27,28,29,35,36,37,38,64,69,70,72,71,74,73,67,39,40,68,75]),
  'Ciclo(s)': new Set([14,15,16,17,18,19,20,21,41,22,23,56,25,26,27,28,29,35,36,37,38]),
  'Módulos': new Set([14,15,16,17,18,19,20,21,41,22,23,56,25,26,27,28,29,35,36,37,38,64,69,70,72,71,74,73,67,39,40,68,75]),
  'Períodos semestrais': new Set([25,26,27,28,29,35,36,37,38,64,69,70,72,71,74,73,67,39,40,68,75]),
  'Grupos não-seriados com base na idade ou competência (art. 23 da LDB)': new Set([14,15,16,17,18,19,20,21,41,22,23,56,25,26,27,28,29,35,36,37,38,64,69,70,72,71,74,73,67,39,40,68,75]),
  'Alternância regular de períodos de estudos': new Set([19,20,21,41,22,23,25,26,27,28,29,35,36,37,38,64,69,70,72,71,74,73,67,39,40,68,75]),
}

type FormData = {
  nome: string
  tipo_mediacao: string
  tipo_ensino: string | null
  capacidade_alunos: number
  local_funcionamento: string | null
  ciclo_inicio: string | null
  educacao_bilingue_surdos: boolean
  formacao_alternancia: boolean
  modalidade: string
  etapa_ensino_id: string
  multietapa: boolean
  turnos: Turno[]
  dias_funcionamento: string[]
  tipos_turma: string[]
  organizacao_curricular: string[]
  areas_itinerario: string[]
  tipo_curso: string | null
  curso_tecnico_id: string | null
  forma_organizacao: string | null
  etapa_agregada: string | null
  etapa_codigo: string | null
  turma_especial: boolean
  eixo_qualificacao: string | null
  multietapa_subetapas_ids: string[]
}

const emptyForm: FormData = {
  nome: '', tipo_mediacao: 'Presencial', tipo_ensino: 'Não informado', capacidade_alunos: 0,
  local_funcionamento: 'A turma não está em local de funcionamento diferenciado', ciclo_inicio: null, educacao_bilingue_surdos: false,
  formacao_alternancia: false, modalidade: '', etapa_ensino_id: '', multietapa: false,
  turnos: [], dias_funcionamento: [], tipos_turma: [], organizacao_curricular: [],
  areas_itinerario: [], tipo_curso: null, curso_tecnico_id: null, forma_organizacao: null,
  etapa_agregada: null, etapa_codigo: null, turma_especial: false, eixo_qualificacao: null,
  multietapa_subetapas_ids: [],
}

type TurmaFormProps = {
  schoolId: string | null
  anoLetivo: { id: string; descricao: string } | null
  etapas: any[]
  editId: string | null
  pessoaId?: string | null
  onSaved: () => void
  onCancel: () => void
}

export function TurmaForm({ schoolId, anoLetivo, etapas, editId, pessoaId, onSaved, onCancel }: TurmaFormProps) {
  const [form, setForm] = useState<FormData>(emptyForm)
  const [selectedDisciplinas, setSelectedDisciplinas] = useState<string[]>([])
  const [multietapaEtapas, setMultietapaEtapas] = useState<string[]>([])
  const [profissionais, setProfissionais] = useState<any[]>([])
  const [disciplinasDisponiveis, setDisciplinasDisponiveis] = useState<any[]>([])
  const [subetapasDisponiveis, setSubetapasDisponiveis] = useState<Subetapa[]>([])

  const [profModalOpen, setProfModalOpen] = useState(false)
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState<any[]>([])
  const [profFormPersonId, setProfFormPersonId] = useState('')
  const [profFormVinculoId, setProfFormVinculoId] = useState('')
  const [profFormDataInicio, setProfFormDataInicio] = useState('')
  const [profFormDisciplinas, setProfFormDisciplinas] = useState<string[]>([])
  const [profEditId, setProfEditId] = useState<string | null>(null)
  const [profVinculosDisponiveis, setProfVinculosDisponiveis] = useState<any[]>([])
  const [profVinculoDataInicio, setProfVinculoDataInicio] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editId) {
    if (!schoolId && !editId) { toast.error('Selecione uma escola primeiro'); return }

    setLoading(true)
      getTurma(editId).then(result => {
        const t = result.turma
        setForm({
          nome: t.nome || '', tipo_mediacao: t.tipo_mediacao || 'Presencial', tipo_ensino: t.tipo_ensino || null,
          capacidade_alunos: t.capacidade_alunos || 0, local_funcionamento: t.local_funcionamento || null,
          ciclo_inicio: t.ciclo_inicio || null, educacao_bilingue_surdos: t.educacao_bilingue_surdos || false,
          formacao_alternancia: t.formacao_alternancia || false, modalidade: t.modalidade || '',
          etapa_ensino_id: t.etapa_ensino_id || '', multietapa: t.multietapa || false,
          turnos: t.turnos || [], dias_funcionamento: t.dias_funcionamento || [],
          tipos_turma: t.tipos_turma || [], organizacao_curricular: t.organizacao_curricular || [],
          areas_itinerario: t.areas_itinerario || [], tipo_curso: t.tipo_curso || null,
          curso_tecnico_id: t.curso_tecnico_id || null, forma_organizacao: t.forma_organizacao || null,
          etapa_agregada: (t as any).etapa_agregada || null,
          etapa_codigo: (t as any).etapa_codigo || null,
          turma_especial: (t as any).turma_especial === '1' || (t as any).turma_especial === true,
          eixo_qualificacao: (t as any).eixo_qualificacao || null,
          multietapa_subetapas_ids: (t as any).multietapa_subetapas_ids || [],
        })
        setSelectedDisciplinas(result.disciplinas.map((d: any) => d.matriz_disciplina_id))
        setMultietapaEtapas(result.multietapa.map((m: any) => m.etapa_ensino_id))
        setProfissionais(result.profissionais || [])
      }).catch(() => toast.error('Erro ao carregar turma'))
        .finally(() => setLoading(false))
    } else {
      setForm(emptyForm)
      setSelectedDisciplinas([])
      setMultietapaEtapas([])
      setProfissionais([])
      setDisciplinasDisponiveis([])
      setSubetapasDisponiveis([])
    }
  }, [editId])

  const updateForm = (key: keyof FormData, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const handleTurnoSelect = (turno: string) => {
    const existente = form.turnos[0]
    updateForm('turnos', [{ turno, horario_inicial: existente?.horario_inicial || '', horario_final: existente?.horario_final || '' }])
  }

  const handleTipoTurmaSelect = (tipo: string) => {
    updateForm('tipos_turma', [tipo])
  }

  const handleToggleDia = (dia: string) => {
    const novos = form.dias_funcionamento.includes(dia)
      ? form.dias_funcionamento.filter(d => d !== dia)
      : [...form.dias_funcionamento, dia]
    updateForm('dias_funcionamento', novos)
  }

  const handleToggleOrgCurricular = (item: string) => {
    const novos = form.organizacao_curricular.includes(item)
      ? form.organizacao_curricular.filter(i => i !== item)
      : [...form.organizacao_curricular, item]
    updateForm('organizacao_curricular', novos)
  }

  const handleToggleAreaItinerario = (area: string) => {
    const novos = form.areas_itinerario.includes(area)
      ? form.areas_itinerario.filter(a => a !== area)
      : [...form.areas_itinerario, area]
    updateForm('areas_itinerario', novos)
  }

  const handleToggleDisciplina = (matrizDisciplinaId: string) => {
    setSelectedDisciplinas(prev =>
      prev.includes(matrizDisciplinaId)
        ? prev.filter(id => id !== matrizDisciplinaId)
        : [...prev, matrizDisciplinaId]
    )
  }

  const handleToggleSubetapa = (subetapaId: string) => {
    setForm(prev => ({
      ...prev,
      multietapa_subetapas_ids: prev.multietapa_subetapas_ids.includes(subetapaId)
        ? prev.multietapa_subetapas_ids.filter(id => id !== subetapaId)
        : [...prev.multietapa_subetapas_ids, subetapaId],
    }))
  }

  const etapaSelecionada = etapas.find(e => e.id === form.etapa_ensino_id)
  const etapaCodigoNum = etapaSelecionada?.etapa_codigo ? parseInt(etapaSelecionada.etapa_codigo) : null

  const handleEtapaAgregadaChange = (agregadaCodigo: string) => {
    updateForm('etapa_agregada', agregadaCodigo)
    updateForm('etapa_ensino_id', '')
    setSubetapasDisponiveis([])
  }

  const handleEtapaEnsinoChange = (etapaId: string) => {
    const etapa = etapas.find(e => e.id === etapaId)
    const cod = etapa?.etapa_codigo ? parseInt(etapa.etapa_codigo) : null
    const agregada = cod ? ETAPAS_ENSINO.find(e => e.codigo === cod)?.agregada : null
    updateForm('etapa_ensino_id', etapaId)
    if (agregada) {
      updateForm('etapa_agregada', String(agregada))
    }
    updateForm('etapa_codigo', cod ? String(cod) : null)

    if (cod && MULTIETA_CODES.includes(cod)) {
      getSubetapas(etapaId).then(setSubetapasDisponiveis).catch(() => setSubetapasDisponiveis([]))
    } else {
      setSubetapasDisponiveis([])
      setForm(prev => ({ ...prev, multietapa_subetapas_ids: [] }))
    }
  }

  useEffect(() => {
    if (!form.etapa_ensino_id || !anoLetivo) {
      setDisciplinasDisponiveis([])
      return
    }
    getDisciplinasPorMatriz(form.etapa_ensino_id, schoolId, anoLetivo.id)
      .then(setDisciplinasDisponiveis)
      .catch(() => setDisciplinasDisponiveis([]))
  }, [form.etapa_ensino_id, schoolId, anoLetivo])

  const etapasFiltradas = (etapas ?? []).filter(e => {
    if (form.multietapa) {
      const cod = parseInt(e.etapa_codigo)
      return !isNaN(cod) && MULTIETA_CODES.includes(cod)
    }
    if (!form.etapa_agregada) return true
    const cod = parseInt(e.etapa_codigo)
    if (isNaN(cod)) return true
    const agregada = ETAPAS_ENSINO.find(et => et.codigo === cod)?.agregada
    return agregada === parseInt(form.etapa_agregada)
  })

  const etapaAgregadaNum = etapaCodigoNum ? ETAPAS_ENSINO.find(e => e.codigo === etapaCodigoNum)?.agregada : null
  const isInfantil = etapaAgregadaNum === AGREGADA_INFANTIL
  const isMedio = etapaAgregadaNum === AGREGADA_MEDIO || etapaAgregadaNum === AGREGADA_MEDIO_MAGISTERIO

  const isCurricular = form.tipos_turma.includes('Curricular') || form.tipos_turma.includes('Curricular com Atividade Complementar')

  const showOrganizacaoCurricular = isMedio && isCurricular
  const showAreasItinerario = showOrganizacaoCurricular && form.organizacao_curricular.includes('Itinerário formativo de aprofundamento')
  const showFormacaoTecnica = showOrganizacaoCurricular && form.organizacao_curricular.includes('Itinerário de formação técnica e profissional')
  const showDisciplinas = !isInfantil && isCurricular
  const showFormasOrganizacao = !!form.etapa_ensino_id && etapaCodigoNum != null && !isInfantil
  const showMultietapaSubetapas = form.multietapa && form.etapa_ensino_id && etapaCodigoNum != null && MULTIETA_CODES.includes(etapaCodigoNum)
  const showEixoQualificacao = etapaCodigoNum != null && EIXO_QUALIFICACAO_CODES.includes(etapaCodigoNum)

  const formasDisponiveis = etapaCodigoNum
    ? FORMAS_ORGANIZACAO.filter(f => FORMAS_POR_ETAPA[f]?.has(etapaCodigoNum))
    : []

  const handleSave = async () => {
    if (!form.nome.trim()) { toast.error('Nome da turma é obrigatório'); return }
    if (!form.modalidade) { toast.error('Modalidade é obrigatória'); return }
    if (!form.etapa_ensino_id) { toast.error('Etapa de ensino é obrigatória'); return }
    if (form.capacidade_alunos <= 0) { toast.error('Capacidade deve ser positiva'); return }
    if (form.dias_funcionamento.length === 0) { toast.error('Selecione ao menos um dia de funcionamento'); return }
    if (form.tipos_turma.length === 0) { toast.error('Selecione ao menos um tipo de turma'); return }
    if (form.turnos.length === 0 || !form.turnos[0]?.turno) { toast.error('Selecione o turno da turma'); return }
    if (showDisciplinas && selectedDisciplinas.length === 0) {
      toast.error('Turma curricular deve ter ao menos uma disciplina'); return
    }
    if (showFormacaoTecnica && !form.tipo_curso) {
      toast.error('Selecione o tipo de curso para formação técnica'); return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        turma_especial: form.turma_especial ? '1' : '0',
        disciplinas: showDisciplinas ? selectedDisciplinas : [],
        multietapa_etapas: form.multietapa ? multietapaEtapas : [],
      }

      if (editId) {
        await updateTurma(editId, payload, pessoaId)
        toast.success('Turma atualizada!')
      } else {
        if (!anoLetivo) { toast.error('Ano letivo ativo não encontrado'); return }
        const novaTurma = await createTurma({
          school_id: schoolId!,
          ano_letivo_id: anoLetivo.id,
          ...payload,
        }, pessoaId)
        for (const p of profissionais) {
          if (!p.id.startsWith('temp_')) continue
          await addProfissionalTurma({
            turma_id: novaTurma.id,
            person_id: p.person_id,
            vinculo_profissional_id: p.vinculo_profissional_id,
            data_inicio: p.data_inicio,
            disciplinas_ids: p.disciplinas_ids,
          }, pessoaId)
        }
        toast.success('Turma criada!')
      }
      onSaved()
    } catch (err: any) {
      toast.error('Erro: ' + (err?.message || 'desconhecido'))
    } finally {
      setLoading(false)
    }
  }

  const handleOpenProfModal = async () => {
    setProfEditId(null)
    setProfFormPersonId('')
    setProfFormVinculoId('')
    setProfFormDataInicio('')
    setProfFormDisciplinas([])
    setProfVinculosDisponiveis([])
    try {
      const profs = await getProfissionaisAtivos(schoolId)
      const jaAdicionados = new Set(profissionais.map(p => p.person_id))
      const disponiveis = profs.filter(p => !jaAdicionados.has(p.id))
      if (disponiveis.length === 0) toast.error('Nenhum profissional disponível.')
      setProfissionaisDisponiveis(disponiveis)
    } catch {
      toast.error('Erro ao carregar profissionais')
      setProfissionaisDisponiveis([])
    }
    setProfModalOpen(true)
  }

  const handleEditProfissional = async (prof: any) => {
    setProfEditId(prof.id)
    setProfFormPersonId(prof.person_id)
    setProfFormVinculoId(prof.vinculo_profissional_id || '')
    setProfFormDataInicio(prof.data_inicio || '')
    setProfFormDisciplinas(prof.disciplinas_ids || [])
    try {
      const todos = await getProfissionaisAtivos(schoolId)
      const pessoa = todos.find(p => p.id === prof.person_id)
      setProfissionaisDisponiveis(pessoa ? [pessoa] : [])
      const vinculos = await getVinculosAtivosProfissional(prof.person_id)
      setProfVinculosDisponiveis(vinculos)
    } catch {
      setProfissionaisDisponiveis([])
      setProfVinculosDisponiveis([])
    }
    setProfModalOpen(true)
  }

  const handleProfPersonChange = async (personId: string) => {
    setProfFormPersonId(personId)
    setProfFormVinculoId('')
    setProfVinculoDataInicio('')
    try {
      const vinculos = await getVinculosAtivosProfissional(personId)
      setProfVinculosDisponiveis(vinculos)
      if (vinculos.length === 1) {
        setProfFormVinculoId(vinculos[0].id)
        if (vinculos[0].data_inicio) setProfVinculoDataInicio(vinculos[0].data_inicio)
      }
    } catch { setProfVinculosDisponiveis([]) }
  }

  const handleSaveProfissional = async () => {
    if (!profFormPersonId) { toast.error('Selecione um profissional'); return }
    if (!profFormDataInicio) { toast.error('Data de início é obrigatória'); return }

    try {
      if (profEditId) {
        await updateProfissionalTurma(profEditId, {
          vinculo_profissional_id: profFormVinculoId || null,
          data_inicio: profFormDataInicio,
          disciplinas_ids: profFormDisciplinas,
        }, pessoaId)
        if (editId) {
          const result = await getTurma(editId)
          setProfissionais(result.profissionais)
        }
      } else if (editId) {
        await addProfissionalTurma({
          turma_id: editId,
          person_id: profFormPersonId,
          vinculo_profissional_id: profFormVinculoId || null,
          data_inicio: profFormDataInicio,
          disciplinas_ids: profFormDisciplinas,
        }, pessoaId)
        const result = await getTurma(editId)
        setProfissionais(result.profissionais)
      } else {
        const novoProf = {
          id: `temp_${Date.now()}`,
          turma_id: '',
          person_id: profFormPersonId,
          vinculo_profissional_id: profFormVinculoId || null,
          data_inicio: profFormDataInicio,
          data_encerramento: null,
          ativo: true,
          disciplinas_ids: profFormDisciplinas,
          person_nome: profissionaisDisponiveis.find(p => p.id === profFormPersonId)?.nome_completo || 'Profissional',
        }
        setProfissionais(prev => [...prev, novoProf])
      }
      toast.success('Profissional vinculado!')
      setProfModalOpen(false)
    } catch (err: any) {
      toast.error('Erro: ' + (err?.message || 'desconhecido'))
    }
  }

  const handleRemoveProfissional = async (id: string) => {
    if (!confirm('Remover este profissional da turma?')) return
    try {
      await removeProfissionalTurma(id, pessoaId)
      toast.success('Profissional removido')
      if (editId) {
        const result = await getTurma(editId)
        setProfissionais(result.profissionais)
      } else {
        setProfissionais(prev => prev.filter(p => p.id !== id))
      }
    } catch { toast.error('Erro ao remover') }
  }

  if (loading && editId) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Ano Letivo (locked) — 33% width */}
        <div className="space-y-1.5 md:w-1/3">
          <Label>Ano Letivo</Label>
          <Input
            value={anoLetivo?.descricao || 'Nenhum ano letivo ativo encontrado'}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">Ano letivo ativo — campo bloqueado</p>
        </div>

        {/* Card: Identificação */}
        <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-4">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Identificação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nome da Turma *</Label>
              <Input
                value={form.nome}
                onChange={e => updateForm('nome', e.target.value)}
                placeholder="Ex: 1º Ano A"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Código INEP</Label>
              <Input
                value=""
                disabled
                className="bg-muted"
                placeholder="Preenchido após sincronização"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo de Mediação *</Label>
              <Select value={form.tipo_mediacao} onValueChange={v => updateForm('tipo_mediacao', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_MEDIACAO.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {form.tipo_mediacao !== 'Semipresencial' && form.tipo_mediacao !== 'Educação a Distância - EAD' && (
              <div className="space-y-1.5">
                <Label>Tipo de Ensino</Label>
                <Select value={form.tipo_ensino || ''} onValueChange={v => updateForm('tipo_ensino', v || null)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_ENSINO.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Capacidade + Local Funcionamento + Ciclo de Início — 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Capacidade de Alunos *</Label>
              <Input
                type="number"
                min={1}
                value={form.capacidade_alunos}
                onChange={e => updateForm('capacidade_alunos', parseInt(e.target.value) || 0)}
              />
            </div>
            {form.tipo_mediacao !== 'Educação a Distância - EAD' && (
              <div className="space-y-1.5">
                <Label>Local de Funcionamento</Label>
                <Select value={form.local_funcionamento || ''} onValueChange={v => updateForm('local_funcionamento', v || null)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LOCAIS_FUNCIONAMENTO.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Ciclo de Início</Label>
              <Select value={form.ciclo_inicio || ''} onValueChange={v => updateForm('ciclo_inicio', v || null)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {CICLOS_INICIO.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bilíngue + Alternância + Turma Especial — 3 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => updateForm('educacao_bilingue_surdos', !form.educacao_bilingue_surdos)}
              className={cn(
                'rounded-md border px-3.5 py-2 text-[13px] font-medium transition cursor-pointer h-10 w-full',
                form.educacao_bilingue_surdos
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-foreground hover:border-primary/60'
              )}
            >
              Bilíngue de Surdos
            </button>
            <button
              type="button"
              onClick={() => updateForm('formacao_alternancia', !form.formacao_alternancia)}
              className={cn(
                'rounded-md border px-3.5 py-2 text-[13px] font-medium transition cursor-pointer h-10 w-full',
                form.formacao_alternancia
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-foreground hover:border-primary/60'
              )}
            >
              Formação por Alternância
            </button>
            <button
              type="button"
              onClick={() => updateForm('turma_especial', !form.turma_especial)}
              className={cn(
                'rounded-md border px-3.5 py-2 text-[13px] font-medium transition cursor-pointer h-10 w-full',
                form.turma_especial
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-foreground hover:border-primary/60'
              )}
            >
              Turma de Educação Especial
            </button>
          </div>
        </div>

        {/* Card: Turno da Turma */}
        <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-4">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Turno da Turma *
          </h3>
          <PillToggleGroup
            options={TURNOS_OPCOES.map(t => ({ value: t, label: t }))}
            value={form.turnos[0]?.turno || ''}
            onValueChange={handleTurnoSelect}
          />
          {form.turnos.length > 0 && form.turnos[0]?.turno && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Horário Inicial *</Label>
                <Input
                  type="time"
                  value={form.turnos[0]?.horario_inicial || ''}
                  onChange={e => {
                    const newTurnos = [{ ...form.turnos[0], horario_inicial: e.target.value }]
                    updateForm('turnos', newTurnos)
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Horário Final *</Label>
                <Input
                  type="time"
                  value={form.turnos[0]?.horario_final || ''}
                  onChange={e => {
                    const newTurnos = [{ ...form.turnos[0], horario_final: e.target.value }]
                    updateForm('turnos', newTurnos)
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card: Dias de Funcionamento */}
        <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-3">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Dias de Funcionamento *
          </h3>
          <PillToggleGroup
            options={DIAS_SEMANA.map(d => ({ value: d, label: d.replace('-feira', '') }))}
            selectedValues={form.dias_funcionamento}
            onToggleValue={handleToggleDia}
            multiple
          />
        </div>

        {/* Card: Tipo da Turma */}
        <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-3">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Tipo da Turma *
          </h3>
          <PillToggleGroup
            options={TIPOS_TURMA.map(tipo => ({
              value: tipo,
              label: tipo.includes('(') ? tipo.match(/\(([^)]+)\)/)?.[1] || tipo : tipo,
            }))}
            value={form.tipos_turma[0] || ''}
            onValueChange={handleTipoTurmaSelect}
          />
        </div>

        {/* Organização Curricular (conditional) */}
        {showOrganizacaoCurricular && (
          <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-3">
            <h3 className="font-semibold text-base">Organização Curricular da Turma</h3>
            <PillToggleGroup
              options={ORGANIZACAO_CURRICULAR.map(item => ({ value: item, label: item }))}
              selectedValues={form.organizacao_curricular}
              onToggleValue={handleToggleOrgCurricular}
              multiple
            />

            {showAreasItinerario && (
              <div className="border border-border rounded-lg p-4 mt-4 bg-card space-y-3">
                <h4 className="font-semibold text-sm">Áreas do Itinerário Formativo</h4>
                <PillToggleGroup
                  options={AREAS_ITINERARIO.map(area => ({ value: area, label: area }))}
                  selectedValues={form.areas_itinerario}
                  onToggleValue={handleToggleAreaItinerario}
                  multiple
                  size="sm"
                />
              </div>
            )}

            {showFormacaoTecnica && (
              <div className="border border-border rounded-lg p-4 mt-4 bg-card space-y-3">
                <h4 className="font-semibold text-sm">Itinerário de Formação Técnica e Profissional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Tipo de Curso *</Label>
                    <Select value={form.tipo_curso || ''} onValueChange={v => updateForm('tipo_curso', v || null)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {TIPOS_CURSO.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Código do Curso Técnico</Label>
                    <Input
                      value={form.curso_tecnico_id || ''}
                      onChange={e => updateForm('curso_tecnico_id', e.target.value || null)}
                      placeholder="Informe o código"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Eixo de Qualificação Profissional — conditional */}
            {showEixoQualificacao && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <Label>Eixo de Qualificação Profissional</Label>
                  <Input
                    value={form.eixo_qualificacao || ''}
                    onChange={e => updateForm('eixo_qualificacao', e.target.value || null)}
                    placeholder="Código INEP"
                    className="h-9"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Card: Configurações */}
        <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-4">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Configurações
          </h3>

          {/* Modalidade + Multietapa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Modalidade *</Label>
              <Select value={form.modalidade} onValueChange={v => updateForm('modalidade', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {MODALIDADES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <button
              type="button"
              onClick={() => {
                const newVal = !form.multietapa
                updateForm('multietapa', newVal)
                if (!newVal) {
                  updateForm('etapa_ensino_id', '')
                  setSubetapasDisponiveis([])
                  updateForm('multietapa_subetapas_ids', [])
                } else {
                  updateForm('etapa_ensino_id', '')
                }
              }}
              className={cn(
                'rounded-md border px-3.5 py-2 text-[13px] font-medium transition cursor-pointer h-10 w-full',
                form.multietapa
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-foreground hover:border-primary/60'
              )}
            >
              Multietapa
            </button>
          </div>

          {/* Etapa Agregada + Etapa de Ensino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Etapa Agregada *</Label>
              <Select
                value={form.etapa_agregada || ''}
                onValueChange={handleEtapaAgregadaChange}
                disabled={form.multietapa || !form.modalidade}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {ETAPAS_AGREGADAS.map(a => <SelectItem key={a.codigo} value={String(a.codigo)}>{a.nome}</SelectItem>)}
                </SelectContent>
              </Select>
              {!form.modalidade && !form.multietapa && (
                <p className="text-xs text-muted-foreground">Selecione a modalidade antes</p>
              )}
              {form.multietapa && (
                <p className="text-xs text-muted-foreground">Determinada automaticamente pela etapa multietapa selecionada</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Etapa de Ensino *</Label>
              <Select
                value={form.etapa_ensino_id}
                onValueChange={handleEtapaEnsinoChange}
                disabled={!form.etapa_agregada && !form.multietapa}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {etapasFiltradas.map(e => <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>)}
                </SelectContent>
              </Select>
              {!form.etapa_agregada && !form.multietapa && (
                <p className="text-xs text-muted-foreground">Selecione a etapa agregada antes</p>
              )}
            </div>
          </div>
        </div>

        {/* Formas de Organização */}
        {showFormasOrganizacao && formasDisponiveis.length > 0 && (
          <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-3">
            <h3 className="font-semibold text-base">Formas de Organização da Turma</h3>
            <PillToggleGroup
              options={formasDisponiveis.map(f => ({ value: f, label: f }))}
              value={form.forma_organizacao || ''}
              onValueChange={v => updateForm('forma_organizacao', v)}
            />
          </div>
        )}

        {/* Multietapa Subetapas (conditional) */}
        {showMultietapaSubetapas && (
          <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-3">
            <h3 className="font-semibold text-base">Etapas de Ensino da Turma Multietapa</h3>
            <p className="text-xs text-muted-foreground">
              Selecione as subetapas configuradas para esta etapa.
            </p>
            {subetapasDisponiveis.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma subetapa configurada para esta etapa na Estrutura Acadêmica.</p>
            ) : (
              <PillToggleGroup
                options={subetapasDisponiveis.map(s => ({ value: s.id, label: s.nome }))}
                selectedValues={form.multietapa_subetapas_ids}
                onToggleValue={handleToggleSubetapa}
                multiple
              />
            )}
          </div>
        )}

        {/* Card: Disciplinas (conditional) */}
        {showDisciplinas && (
          <div className="border border-border rounded-lg p-5 bg-muted/40 space-y-3">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Disciplinas
            </h3>
            {disciplinasDisponiveis.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma disciplina encontrada na matriz curricular para a etapa selecionada.
              </p>
            ) : (
              <PillToggleGroup
                options={disciplinasDisponiveis.map(d => ({ value: d.id, label: d.academico_disciplinas?.nome || 'Disciplina' }))}
                selectedValues={selectedDisciplinas}
                onToggleValue={handleToggleDisciplina}
                multiple
                size="sm"
              />
            )}
          </div>
        )}

        {/* Card: Profissionais */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Profissionais
            </h3>
            <Button variant="outline" size="sm" onClick={handleOpenProfModal} className="border-border">
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          </div>
          {profissionais.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UserPlus className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-[14px] text-muted-foreground">Nenhum profissional vinculado a esta turma.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {profissionais.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30 gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-medium text-foreground">{p.people?.nome_completo || p.person_nome || 'Profissional'}</span>
                      <span className={cn(
                        'text-[11px] font-medium px-2 py-0.5 rounded-sm',
                        p.ativo ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      )}>
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    {p.data_inicio && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Início: {formatDate(p.data_inicio)}
                      </p>
                    )}
                    {Array.isArray(p.disciplinas_ids) && p.disciplinas_ids.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {p.disciplinas_ids.map((dId: string) => {
                          const disc = disciplinasDisponiveis.find(d => d.id === dId)
                          return disc ? (
                            <span key={dId} className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                              {disc.academico_disciplinas?.nome || 'Disciplina'}
                            </span>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEditProfissional(p)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleRemoveProfissional(p.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer fixo */}
      <div className="shrink-0 border-t border-border px-6 py-4 flex justify-end gap-3 bg-card">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave} disabled={loading}>
          {editId ? 'Atualizar' : 'Criar'}
        </Button>
      </div>

      {/* Profissional Form Dialog */}
      <Dialog open={profModalOpen} onOpenChange={setProfModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>{profEditId ? 'Editar Profissional' : 'Adicionar Profissional'}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="space-y-1.5">
              <Label>Profissional *</Label>
              <Select
                value={profFormPersonId}
                onValueChange={handleProfPersonChange}
                disabled={!!profEditId}
              >
                <SelectTrigger><SelectValue placeholder="Selecione o profissional" /></SelectTrigger>
                <SelectContent>
                  {profissionaisDisponiveis.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.codigo_pessoa ? `${p.codigo_pessoa} - ${p.nome_completo}` : p.nome_completo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Vínculo Profissional</Label>
              <Select
                value={profFormVinculoId}
                onValueChange={v => {
                  setProfFormVinculoId(v)
                  const vinculo = profVinculosDisponiveis.find(vi => vi.id === v)
                  if (vinculo?.data_inicio) setProfVinculoDataInicio(vinculo.data_inicio)
                  else setProfVinculoDataInicio('')
                }}
                disabled={profVinculosDisponiveis.length <= 1 && profVinculosDisponiveis.length > 0}
              >
                <SelectTrigger><SelectValue placeholder={profVinculosDisponiveis.length > 0 ? "Vínculo carregado" : "Primeiro selecione o profissional"} /></SelectTrigger>
                <SelectContent>
                  {profVinculosDisponiveis.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.funcao?.nome || 'Vínculo'} — {formatDate(v.data_inicio) || 'sem data'} — {v.carga_horaria || '0'}h/sem
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {profVinculosDisponiveis.length === 1 && (
                <p className="text-xs text-muted-foreground">Vínculo único — selecionado automaticamente.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Data de Início *</Label>
              <Input
                type="date"
                value={profFormDataInicio}
                min={profVinculoDataInicio || undefined}
                onChange={e => setProfFormDataInicio(e.target.value)}
              />
              {profVinculoDataInicio && (
                <p className="text-xs text-muted-foreground">
                  Data mínima: {formatDate(profVinculoDataInicio)} (início do vínculo profissional)
                </p>
              )}
            </div>

            {!isInfantil && (
            <div className="space-y-2">
              <Label>Disciplinas do Profissional</Label>
              {selectedDisciplinas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma disciplina selecionada na turma.</p>
              ) : (
                <PillToggleGroup
                  options={disciplinasDisponiveis
                    .filter(d => selectedDisciplinas.includes(d.id))
                    .map(d => ({ value: d.id, label: d.academico_disciplinas?.nome || 'Disciplina' }))}
                  selectedValues={profFormDisciplinas}
                  onToggleValue={(val) => {
                    setProfFormDisciplinas(prev =>
                      prev.includes(val)
                        ? prev.filter(id => id !== val)
                        : [...prev, val]
                    )
                  }}
                  multiple
                  size="sm"
                  className="max-h-40 overflow-y-auto"
                />
              )}
            </div>
            )}
          </div>
          <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
            <Button variant="ghost" onClick={() => setProfModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProfissional}>
              {profEditId ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}