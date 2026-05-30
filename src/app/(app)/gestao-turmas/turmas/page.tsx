'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Plus, Pencil, Trash2, GraduationCap, Search, ChevronLeft, X, UserPlus, AlertCircle, Clock, Calendar, BookOpen } from 'lucide-react'
import { getFirstSchool } from '@/lib/actions/schools'
import { getEtapasEnsino } from '@/lib/actions/etapas-ensino'
import {
  getTurmas, getTurma, createTurma, updateTurma, deleteTurma, toggleTurmaAtiva,
  addProfissionalTurma, updateProfissionalTurma, removeProfissionalTurma,
  getDisciplinasPorMatriz, getProfissionaisAtivos, getVinculosAtivosProfissional,
  getAnoLetivoAtivo, getAnosLetivosAdmin,
  type Turma, type Turno, type TurmaProfissional, type TurmaDisciplina, type TurmaMultietapa,
} from '@/lib/actions/turmas'
import { toast } from 'sonner'

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
  'A turma não está em local de funcionamento diferenciado',
  'Sala anexa',
  'Unidade de atendimento socioeducativo',
  'Unidade prisional',
]
const CICLOS_INICIO = ['1° Semestre', '2° Semestre']
const MODALIDADES = ['Ensino Regular', 'Educação especial - modalidade substitutiva', 'Educação de jovens e adultos', 'Educação profissional']
const TURNOS_OPCOES = ['Matutino', 'Vespertino', 'Integral', 'Noturno']
const TIPOS_TURMA = ['Curricular', 'Atendimento Educacional Especializado (AEE)', 'Atividade Complementar', 'Outro']
const ORGANIZACAO_CURRICULAR = ['Formação geral básica', 'Itinerário formativo de aprofundamento', 'Itinerário de formação técnica e profissional']
const AREAS_ITINERARIO = ['Linguagens e suas tecnologias', 'Ciências humanas e sociais aplicadas', 'Ciências da natureza e suas tecnologias', 'Matemática e suas tecnologias']
const FORMAS_ORGANIZACAO = ['Série/ano (séries anuais)', 'Ciclo(s)', 'Módulos', 'Períodos semestrais', 'Grupos não seriados com base na idade ou competência']
const TIPOS_CURSO = ['Curso Técnico', 'Qualificação profissional técnica']

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
}

export default function TurmasPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [schoolId, setSchoolId] = useState('')
  const [anoLetivo, setAnoLetivo] = useState<{ id: string; descricao: string } | null>(null)
  const [turmas, setTurmas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [etapas, setEtapas] = useState<any[]>([])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>({
    nome: '', tipo_mediacao: 'Presencial', tipo_ensino: null, capacidade_alunos: 0,
    local_funcionamento: null, ciclo_inicio: null, educacao_bilingue_surdos: false,
    formacao_alternancia: false, modalidade: '', etapa_ensino_id: '', multietapa: false,
    turnos: [], dias_funcionamento: [], tipos_turma: [], organizacao_curricular: [],
    areas_itinerario: [], tipo_curso: null, curso_tecnico_id: null, forma_organizacao: null,
  })

  const [selectedDisciplinas, setSelectedDisciplinas] = useState<string[]>([])
  const [multietapaEtapas, setMultietapaEtapas] = useState<string[]>([])
  const [profissionais, setProfissionais] = useState<any[]>([])

  const [disciplinasDisponiveis, setDisciplinasDisponiveis] = useState<any[]>([])
  const [allEtapas, setAllEtapas] = useState<any[]>([])

  const [profModalOpen, setProfModalOpen] = useState(false)
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState<any[]>([])
  const [profFormPersonId, setProfFormPersonId] = useState('')
  const [profFormVinculoId, setProfFormVinculoId] = useState('')
  const [profFormDataInicio, setProfFormDataInicio] = useState('')
  const [profFormDisciplinas, setProfFormDisciplinas] = useState<string[]>([])
  const [profEditId, setProfEditId] = useState<string | null>(null)
  const [profVinculosDisponiveis, setProfVinculosDisponiveis] = useState<any[]>([])
  const [profVinculoDataInicio, setProfVinculoDataInicio] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    getFirstSchool().then(async s => {
      setSchoolId(s.id)
      const [ano, e] = await Promise.all([
        getAnoLetivoAtivo(s.id),
        getEtapasEnsino(s.id),
      ])
      if (ano) setAnoLetivo(ano)
      setEtapas(e)
      setAllEtapas(e)
    }).catch(() => {})
  }, [user])

  useEffect(() => {
    if (!schoolId) return
    loadTurmas()
  }, [schoolId])

  const loadTurmas = async () => {
    setLoading(true)
    try {
      const data = await getTurmas(schoolId, search || undefined)
      setTurmas(data)
    } catch { toast.error('Erro ao carregar turmas') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (!schoolId) return
    const timer = setTimeout(() => loadTurmas(), 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleOpenNew = () => {
    setEditId(null)
    setForm({
      nome: '', tipo_mediacao: 'Presencial', tipo_ensino: null, capacidade_alunos: 0,
      local_funcionamento: null, ciclo_inicio: null, educacao_bilingue_surdos: false,
      formacao_alternancia: false, modalidade: '', etapa_ensino_id: '', multietapa: false,
      turnos: [], dias_funcionamento: [], tipos_turma: [], organizacao_curricular: [],
      areas_itinerario: [], tipo_curso: null, curso_tecnico_id: null, forma_organizacao: null,
    })
    setSelectedDisciplinas([])
    setMultietapaEtapas([])
    setProfissionais([])
    setDisciplinasDisponiveis([])
    setDialogOpen(true)
  }

  const handleOpenEdit = async (id: string) => {
    setEditId(id)
    try {
      const result = await getTurma(id)
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
      })
      setSelectedDisciplinas(result.disciplinas.map((d: any) => d.matriz_disciplina_id))
      setMultietapaEtapas(result.multietapa.map((m: any) => m.etapa_ensino_id))
      setProfissionais(result.profissionais || [])
      // Load disciplinas from matriz if etapa is set
      if (t.etapa_ensino_id && anoLetivo) {
        try {
          const discs = await getDisciplinasPorMatriz(t.etapa_ensino_id, schoolId, anoLetivo.id)
          setDisciplinasDisponiveis(discs)
        } catch { setDisciplinasDisponiveis([]) }
      }
      setDialogOpen(true)
    } catch { toast.error('Erro ao carregar turma') }
  }

  const handleSave = async () => {
    if (!form.nome.trim()) { toast.error('Nome da turma é obrigatório'); return }
    if (!form.modalidade) { toast.error('Modalidade é obrigatória'); return }
    if (!form.etapa_ensino_id) { toast.error('Etapa de ensino é obrigatória'); return }
    if (form.capacidade_alunos <= 0) { toast.error('Capacidade deve ser positiva'); return }
    if (form.dias_funcionamento.length === 0) { toast.error('Selecione ao menos um dia de funcionamento'); return }
    if (form.tipos_turma.length === 0) { toast.error('Selecione ao menos um tipo de turma'); return }

    if (form.tipos_turma.includes('Curricular') && selectedDisciplinas.length === 0) {
      toast.error('Turma curricular deve ter ao menos uma disciplina'); return
    }
    if (form.organizacao_curricular.includes('Itinerário de formação técnica e profissional') && !form.tipo_curso) {
      toast.error('Selecione o tipo de curso para formação técnica'); return
    }

    try {
      if (editId) {
        await updateTurma(editId, {
          ...form,
          disciplinas: form.tipos_turma.includes('Curricular') ? selectedDisciplinas : [],
          multietapa_etapas: form.multietapa ? multietapaEtapas : [],
        })
        toast.success('Turma atualizada!')
      } else {
        if (!anoLetivo) { toast.error('Ano letivo ativo não encontrado'); return }
        const novaTurma = await createTurma({
          school_id: schoolId,
          ano_letivo_id: anoLetivo.id,
          ...form,
          disciplinas: form.tipos_turma.includes('Curricular') ? selectedDisciplinas : [],
          multietapa_etapas: form.multietapa ? multietapaEtapas : [],
        })
        // Persistir profissionais adicionados durante a criação
        for (const p of profissionais) {
          if (!p.id.startsWith('temp_')) continue
          await addProfissionalTurma({
            turma_id: novaTurma.id,
            person_id: p.person_id,
            vinculo_profissional_id: p.vinculo_profissional_id,
            data_inicio: p.data_inicio,
            disciplinas_ids: p.disciplinas_ids,
          })
        }
        toast.success('Turma criada!')
      }
      setDialogOpen(false)
      loadTurmas()
    } catch (err: any) {
      toast.error('Erro: ' + (err?.message || 'desconhecido'))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta turma permanentemente?')) return
    try {
      await deleteTurma(id)
      toast.success('Turma excluída')
      loadTurmas()
    } catch { toast.error('Erro ao excluir') }
  }

  const handleToggleAtiva = async (id: string, ativo: boolean) => {
    try {
      await toggleTurmaAtiva(id, ativo)
      toast.success(ativo ? 'Turma ativada' : 'Turma inativada')
      loadTurmas()
    } catch { toast.error('Erro ao alterar status') }
  }

  // Helpers
  const updateForm = (key: keyof FormData, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  const handleAddTurno = () => {
    const newTurno: Turno = { turno: '', horario_inicial: '', horario_final: '' }
    updateForm('turnos', [...form.turnos, newTurno])
  }

  const handleRemoveTurno = (idx: number) => {
    updateForm('turnos', form.turnos.filter((_, i) => i !== idx))
  }

  const handleUpdateTurno = (idx: number, key: keyof Turno, value: string) => {
    const newTurnos = [...form.turnos]
    newTurnos[idx] = { ...newTurnos[idx], [key]: value }
    updateForm('turnos', newTurnos)
  }

  const handleToggleTipoTurma = (tipo: string) => {
    let novos = [...form.tipos_turma]
    if (tipo === 'Curricular' && !novos.includes('Curricular')) {
      novos = novos.filter(t => t !== 'Atendimento Educacional Especializado (AEE)')
    }
    if (novos.includes(tipo)) {
      novos = novos.filter(t => t !== tipo)
    } else {
      novos.push(tipo)
    }
    updateForm('tipos_turma', novos)
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

  const handleToggleMultietapaEtapa = (etapaId: string) => {
    setMultietapaEtapas(prev =>
      prev.includes(etapaId) ? prev.filter(e => e !== etapaId) : [...prev, etapaId]
    )
  }

  // Quando etapa de ensino muda, recarregar disciplinas
  useEffect(() => {
    if (!form.etapa_ensino_id || !schoolId || !anoLetivo) {
      setDisciplinasDisponiveis([])
      return
    }
    getDisciplinasPorMatriz(form.etapa_ensino_id, schoolId, anoLetivo.id)
      .then(setDisciplinasDisponiveis)
      .catch(() => setDisciplinasDisponiveis([]))
  }, [form.etapa_ensino_id, schoolId, anoLetivo])

  // Carregar profissionais disponíveis ao abrir modal (filtrar já adicionados)
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
    // Carregar dados do profissional e vínculos para exibição bloqueada
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
        })
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
        })
        const result = await getTurma(editId)
        setProfissionais(result.profissionais)
      } else {
        // Criação: armazena localmente para salvar junto com a turma
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
      await removeProfissionalTurma(id)
      toast.success('Profissional removido')
      if (editId) {
        const result = await getTurma(editId)
        setProfissionais(result.profissionais)
      } else {
        setProfissionais(prev => prev.filter(p => p.id !== id))
      }
    } catch { toast.error('Erro ao remover') }
  }

  const showOrganizacaoCurricular = form.tipos_turma.includes('Curricular')
  const showAreasItinerario = showOrganizacaoCurricular && form.organizacao_curricular.includes('Itinerário formativo de aprofundamento')
  const showFormacaoTecnica = showOrganizacaoCurricular && form.organizacao_curricular.includes('Itinerário de formação técnica e profissional')
  const showDisciplinas = form.tipos_turma.includes('Curricular')
  const showMultietapaConfig = form.multietapa

  // Filtrar etapas multietapa baseado na etapa principal
  const getEtapasMultietapa = () => {
    const etapaPrincipal = allEtapas.find(e => e.id === form.etapa_ensino_id)
    if (!etapaPrincipal) return []
    const nome = etapaPrincipal.etapa_nome || ''
    if (nome.includes('Unificada') || nome.includes('0 a 5')) {
      return allEtapas.filter(e =>
        e.etapa_nome.includes('Creche') || e.etapa_nome.includes('Pré-escola') ||
        e.id === form.etapa_ensino_id
      )
    }
    if (nome.includes('MULTI') || nome.includes('Fundamental')) {
      return allEtapas.filter(e => e.etapa_tipo === 'fundamental_inicial' || e.etapa_tipo === 'fundamental_final')
    }
    return allEtapas
  }

  if (authLoading || !schoolId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-foreground">Turmas</h1>
            <p className="text-muted-foreground mt-1">
              Cadastro de turmas conforme Registro 20 do Censo Escolar
            </p>
          </div>
          <Button onClick={handleOpenNew} className="bg-primary hover:bg-primary/90 animate-fade-in-up">
            <Plus className="mr-2 h-4 w-4" /> Nova Turma
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10 border-slate-300"
            placeholder="Buscar turma por nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Listing */}
        <Card className="border-[#cbd5e1] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Turmas cadastradas ({turmas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Carregando...</div>
            ) : turmas.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                Nenhuma turma encontrada. Clique em "Nova Turma".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="text-left px-6 py-3 font-medium">Nome</th>
                      <th className="text-left px-6 py-3 font-medium">Modalidade</th>
                      <th className="text-left px-6 py-3 font-medium">Etapa</th>
                      <th className="text-left px-6 py-3 font-medium">Turnos</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                      <th className="text-right px-6 py-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turmas.map(t => (
                      <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{t.nome}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{t.modalidade}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {t.academico_etapas_ensino?.etapa_nome || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {t.turnos?.map((tn: any) => tn.turno).join(', ') || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleAtiva(t.id, !t.ativo)}
                            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                              t.ativo
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {t.ativo ? 'Ativa' : 'Inativa'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon-sm" onClick={() => handleOpenEdit(t.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(t.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Turma Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Editar Turma' : 'Nova Turma'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Ano Letivo (locked) */}
            <div className="space-y-1.5">
              <Label>Ano Letivo</Label>
              <Input
                value={anoLetivo?.descricao || 'Nenhum ano letivo ativo encontrado'}
                disabled
                className="border-slate-300 bg-slate-50"
              />
              <p className="text-xs text-muted-foreground">Ano letivo ativo — campo bloqueado</p>
            </div>

            {/* Card: Identificação */}
            <div className="border border-[#cbd5e1] rounded-lg p-5 bg-slate-50/40 space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Identificação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome da Turma *</Label>
                  <Input
                    className="border-slate-300"
                    value={form.nome}
                    onChange={e => updateForm('nome', e.target.value)}
                    placeholder="Ex: 1º Ano A"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Código INEP</Label>
                  <Input
                    className="border-slate-300 bg-slate-50"
                    value=""
                    disabled
                    placeholder="Preenchido após sincronização"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo de Mediação *</Label>
                  <Select value={form.tipo_mediacao} onValueChange={v => updateForm('tipo_mediacao', v)}>
                    <SelectTrigger className="border-slate-300"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIPOS_MEDIACAO.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {form.tipo_mediacao !== 'Semipresencial' && form.tipo_mediacao !== 'Educação a Distância - EAD' && (
                  <div className="space-y-1.5">
                    <Label>Tipo de Ensino</Label>
                    <Select value={form.tipo_ensino || ''} onValueChange={v => updateForm('tipo_ensino', v || null)}>
                      <SelectTrigger className="border-slate-300"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {TIPOS_ENSINO.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>Capacidade de Alunos *</Label>
                  <Input
                    className="border-slate-300"
                    type="number"
                    min={1}
                    value={form.capacidade_alunos}
                    onChange={e => updateForm('capacidade_alunos', parseInt(e.target.value) || 0)}
                  />
                </div>
                {form.tipo_mediacao !== 'Educação a Distância - EAD' && (
                  <div className="space-y-1.5">
                    <Label>Local de Funcionamento Diferenciado</Label>
                    <Select value={form.local_funcionamento || ''} onValueChange={v => updateForm('local_funcionamento', v || null)}>
                      <SelectTrigger className="border-slate-300"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {LOCAIS_FUNCIONAMENTO.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>Ciclo de Início</Label>
                  <Select value={form.ciclo_inicio || ''} onValueChange={v => updateForm('ciclo_inicio', v || null)}>
                    <SelectTrigger className="border-slate-300"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {CICLOS_INICIO.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Checkboxes especiais */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2"
                  onClick={() => updateForm('educacao_bilingue_surdos', !form.educacao_bilingue_surdos)}>
                  <Checkbox checked={form.educacao_bilingue_surdos}
                    className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none" />
                  <Label className="cursor-pointer text-sm">Educação Bilíngue de Surdos</Label>
                </div>
                <div className="flex items-center gap-2"
                  onClick={() => updateForm('formacao_alternancia', !form.formacao_alternancia)}>
                  <Checkbox checked={form.formacao_alternancia}
                    className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none" />
                  <Label className="cursor-pointer text-sm">Formação por Alternância</Label>
                </div>
              </div>

              {/* Modalidade e Etapa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Modalidade *</Label>
                  <Select value={form.modalidade} onValueChange={v => updateForm('modalidade', v)}>
                    <SelectTrigger className="border-slate-300"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {MODALIDADES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Etapa de Ensino *</Label>
                  <Select value={form.etapa_ensino_id} onValueChange={v => updateForm('etapa_ensino_id', v)}>
                    <SelectTrigger className="border-slate-300"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {etapas.map(e => <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Multietapa */}
              <div className="flex items-center gap-2"
                onClick={() => updateForm('multietapa', !form.multietapa)}>
                <Checkbox checked={form.multietapa}
                  className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none" />
                <Label className="cursor-pointer text-sm font-medium">Multietapa</Label>
              </div>
            </div>

            {/* Subcard: Turnos */}
            <div className="border border-[#cbd5e1] rounded-lg p-5 bg-slate-50/40 space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Turnos da Turma
              </h3>
              {form.turnos.map((turno, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-3 items-end">
                  <div className="space-y-1.5">
                    <Label>Turno *</Label>
                    <Select value={turno.turno} onValueChange={v => handleUpdateTurno(idx, 'turno', v)}>
                      <SelectTrigger className="border-slate-300"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {TURNOS_OPCOES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Horário Inicial *</Label>
                    <Input
                      className="border-slate-300"
                      type="time"
                      value={turno.horario_inicial}
                      onChange={e => handleUpdateTurno(idx, 'horario_inicial', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Horário Final *</Label>
                    <Input
                      className="border-slate-300"
                      type="time"
                      value={turno.horario_final}
                      onChange={e => handleUpdateTurno(idx, 'horario_final', e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveTurno(idx)} className="text-destructive">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddTurno}>
                <Plus className="mr-1 h-3 w-3" /> Adicionar Turno
              </Button>
            </div>

            {/* Subcard: Dias de Funcionamento */}
            <div className="border border-[#cbd5e1] rounded-lg p-5 bg-slate-50/40 space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Dias de Funcionamento *
              </h3>
              <div className="flex flex-wrap gap-4">
                {DIAS_SEMANA.map(dia => (
                  <div key={dia} className="flex items-center gap-2"
                    onClick={() => handleToggleDia(dia)}>
                    <Checkbox checked={form.dias_funcionamento.includes(dia)}
                      className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none" />
                    <Label className="cursor-pointer text-sm">{dia}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Subcard: Tipo da Turma */}
            <div className="border border-[#cbd5e1] rounded-lg p-5 bg-slate-50/40 space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Tipo da Turma *
              </h3>
              <div className="flex flex-wrap gap-4">
                {TIPOS_TURMA.map(tipo => {
                  const isAEEAndCurricular = tipo === 'Atendimento Educacional Especializado (AEE)' && form.tipos_turma.includes('Curricular')
                  return (
                    <div key={tipo} className="flex items-center gap-2"
                      onClick={() => !isAEEAndCurricular && handleToggleTipoTurma(tipo)}>
                      <Checkbox
                        checked={form.tipos_turma.includes(tipo)}
                        disabled={isAEEAndCurricular}
                        className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none"
                      />
                      <Label className={`cursor-pointer text-sm ${isAEEAndCurricular ? 'text-muted-foreground/50 line-through' : ''}`}>
                        {tipo}
                      </Label>
                    </div>
                  )
                })}
              </div>
              {form.tipos_turma.includes('Curricular') && form.tipos_turma.includes('Atendimento Educacional Especializado (AEE)') && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  AEE foi desmarcado automaticamente (incompatível com Curricular)
                </p>
              )}
            </div>

            {/* Organização Curricular (conditional) */}
            {showOrganizacaoCurricular && (
              <div className="border border-[#cbd5e1] rounded-lg p-5 bg-slate-50/40 space-y-3">
                <h3 className="font-semibold text-base">Organização Curricular da Turma</h3>
                <div className="flex flex-wrap gap-4">
                  {ORGANIZACAO_CURRICULAR.map(item => (
                    <div key={item} className="flex items-center gap-2"
                      onClick={() => handleToggleOrgCurricular(item)}>
                      <Checkbox checked={form.organizacao_curricular.includes(item)}
                        className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none" />
                      <Label className="cursor-pointer text-sm">{item}</Label>
                    </div>
                  ))}
                </div>

                {/* Áreas do Itinerário Formativo (conditional) */}
                {showAreasItinerario && (
                  <div className="border border-slate-200 rounded-lg p-4 mt-4 bg-white space-y-3">
                    <h4 className="font-semibold text-sm">Áreas do Itinerário Formativo</h4>
                    <div className="flex flex-wrap gap-4">
                      {AREAS_ITINERARIO.map(area => (
                        <div key={area} className="flex items-center gap-2"
                          onClick={() => handleToggleAreaItinerario(area)}>
                          <Checkbox checked={form.areas_itinerario.includes(area)}
                            className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none" />
                          <Label className="cursor-pointer text-sm">{area}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formação Técnica (conditional) */}
                {showFormacaoTecnica && (
                  <div className="border border-slate-200 rounded-lg p-4 mt-4 bg-white space-y-3">
                    <h4 className="font-semibold text-sm">Itinerário de Formação Técnica e Profissional</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Tipo de Curso *</Label>
                        <Select value={form.tipo_curso || ''} onValueChange={v => updateForm('tipo_curso', v || null)}>
                          <SelectTrigger className="border-slate-300"><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            {TIPOS_CURSO.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Código do Curso Técnico</Label>
                        <Input
                          className="border-slate-300"
                          value={form.curso_tecnico_id || ''}
                          onChange={e => updateForm('curso_tecnico_id', e.target.value || null)}
                          placeholder="Informe o código"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Formas de Organização */}
            <div className="border border-[#cbd5e1] rounded-lg p-5 bg-slate-50/40 space-y-3">
              <h3 className="font-semibold text-base">Formas de Organização da Turma</h3>
              <RadioGroup
                value={form.forma_organizacao || ''}
                onValueChange={v => updateForm('forma_organizacao', v)}
              >
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {FORMAS_ORGANIZACAO.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <RadioGroupItem value={f} id={`forma-${f}`} className="border-slate-400" />
                      <Label htmlFor={`forma-${f}`} className="cursor-pointer text-sm">{f}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Multietapa Config (conditional) */}
            {showMultietapaConfig && (
              <div className="border border-[#cbd5e1] rounded-lg p-5 bg-slate-50/40 space-y-3">
                <h3 className="font-semibold text-base">Etapas de Ensino da Turma Multietapa</h3>
                <p className="text-xs text-muted-foreground">
                  Selecione as etapas específicas para esta turma multietapa.
                </p>
                <div className="flex flex-wrap gap-4">
                  {getEtapasMultietapa().map(e => (
                    <div key={e.id} className="flex items-center gap-2"
                      onClick={() => handleToggleMultietapaEtapa(e.id)}>
                      <Checkbox checked={multietapaEtapas.includes(e.id)}
                        className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none" />
                      <Label className="cursor-pointer text-sm">{e.etapa_nome}</Label>
                    </div>
                  ))}
                </div>
                {getEtapasMultietapa().length === 0 && (
                  <p className="text-xs text-muted-foreground">Nenhuma etapa compatível encontrada.</p>
                )}
              </div>
            )}

            {/* Card: Disciplinas (conditional) */}
            {showDisciplinas && (
              <div className="border border-[#cbd5e1] rounded-lg p-5 bg-slate-50/40 space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Disciplinas
                </h3>
                {disciplinasDisponiveis.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma disciplina encontrada na matriz curricular para a etapa selecionada.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {disciplinasDisponiveis.map(d => (
                      <div key={d.id} className="flex items-center gap-2"
                        onClick={() => handleToggleDisciplina(d.id)}>
                        <Checkbox checked={selectedDisciplinas.includes(d.id)}
                          className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none" />
                        <Label className="cursor-pointer text-sm">
                          {d.academico_disciplinas?.nome || 'Disciplina'}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Card: Profissionais */}
            <div className="border border-[#cbd5e1] rounded-lg p-5 bg-slate-50/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  Profissionais
                </h3>
                <Button variant="outline" size="sm" onClick={handleOpenProfModal}>
                  <Plus className="mr-1 h-3 w-3" /> Adicionar Profissionais
                </Button>
              </div>
              {profissionais.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum profissional vinculado.</p>
              ) : (
                <div className="space-y-2">
                  {profissionais.map(p => (
                    <div key={p.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium">{p.people?.nome_completo || 'Profissional'}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${p.ativo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {p.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                        {p.data_inicio && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            Início: {formatDate(p.data_inicio)}
                          </span>
                        )}
                        {Array.isArray(p.disciplinas_ids) && p.disciplinas_ids.length > 0 && (
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            {p.disciplinas_ids.map((dId: string) => {
                              const disc = disciplinasDisponiveis.find(d => d.id === dId)
                              return disc ? (
                                <span key={dId} className="text-xs text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                                  {disc.academico_disciplinas?.nome || 'Disciplina'}
                                </span>
                              ) : null
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleEditProfissional(p)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleRemoveProfissional(p.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editId ? 'Atualizar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profissional Form Dialog */}
      <Dialog open={profModalOpen} onOpenChange={setProfModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{profEditId ? 'Editar Profissional' : 'Adicionar Profissional'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Profissional *</Label>
              <Select
                value={profFormPersonId}
                onValueChange={handleProfPersonChange}
                disabled={!!profEditId}
              >
                <SelectTrigger className="border-slate-300"><SelectValue placeholder="Selecione o profissional" /></SelectTrigger>
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
                <SelectTrigger className="border-slate-300"><SelectValue placeholder={profVinculosDisponiveis.length > 0 ? "Vínculo carregado" : "Primeiro selecione o profissional"} /></SelectTrigger>
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
                className="border-slate-300"
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

            <div className="space-y-1.5">
              <Label>Disciplinas do Profissional</Label>
              {selectedDisciplinas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma disciplina selecionada na turma.</p>
              ) : (
                <div className="flex flex-wrap gap-x-6 gap-y-2 max-h-40 overflow-y-auto">
                  {disciplinasDisponiveis
                    .filter(d => selectedDisciplinas.includes(d.id))
                    .map(d => (
                      <div key={d.id} className="flex items-center gap-2"
                        onClick={() => {
                          setProfFormDisciplinas(prev =>
                            prev.includes(d.id)
                              ? prev.filter(id => id !== d.id)
                              : [...prev, d.id]
                          )
                        }}>
                        <Checkbox checked={profFormDisciplinas.includes(d.id)}
                          className="data-[state=checked]:bg-primary border-slate-400 pointer-events-none" />
                        <Label className="cursor-pointer text-sm">
                          {d.academico_disciplinas?.nome || 'Disciplina'}
                        </Label>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProfissional}>
              {profEditId ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
