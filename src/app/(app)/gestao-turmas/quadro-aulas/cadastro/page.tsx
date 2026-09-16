'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { FormCard } from '@/components/layout/form-card'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { StatusBadge } from '@/components/feedback/status-badge'
import { toast } from 'sonner'
import {
  Plus, Trash2, Save, Clock, AlertCircle, Loader2, GraduationCap, Pencil, ChevronLeft,
} from 'lucide-react'
import {
  getQuadroAula, createQuadroAula, updateQuadroAula, deleteQuadroAula,
  gerarGradeHorarios, validarConflitosProfessor, validarSobreposicaoVigencia,
  getTurmasAtivas, getDisciplinasDaTurma, getProfessoresDaTurma,
  getAnosLetivosAtivos, getDiasExtrasDoCalendario, getExtrasDoQuadro,
  saveExtrasDoQuadro, removerDataExtra,
  type Intervalo, type SlotGerado, type AulaExtra,
} from '@/lib/actions/quadro-aulas'

const DIAS_NOME: Record<number, string> = {
  0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta',
  4: 'Quinta', 5: 'Sexta', 6: 'Sábado',
}

function formatNomeDisciplina(nome: string): string {
  if (!nome) return ''
  return nome
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getDisciplinaDisplay(d: any): string {
  const nomeAbr = d.academico_matriz_disciplinas?.academico_disciplinas?.nome_abreviado
  const nome = d.academico_matriz_disciplinas?.academico_disciplinas?.nome
  return formatNomeDisciplina(nomeAbr || nome || 'Sem nome')
}

function getDisciplinaFullName(d: any): string {
  const nome = d.academico_matriz_disciplinas?.academico_disciplinas?.nome
  return formatNomeDisciplina(nome || 'Sem nome')
}

export default function CadastroQuadroAulaPage() {
  return (
    <Suspense fallback={<PageContainer><div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></PageContainer>}>
      <CadastroForm />
    </Suspense>
  )
}

function CadastroForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const { user, loading: authLoading, schoolId } = useAuth()
  const { pessoaId } = usePermissoes(schoolId)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [anoLetivoDesc, setAnoLetivoDesc] = useState('')
  const [anoLetivoDataInicio, setAnoLetivoDataInicio] = useState('')
  const [anoLetivoDataTermino, setAnoLetivoDataTermino] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [tempoAula, setTempoAula] = useState('50')
  const [intervalos, setIntervalos] = useState<Intervalo[]>([])

  const [gradeGerada, setGradeGerada] = useState(false)
  const [slots, setSlots] = useState<SlotGerado[]>([])
  const [gradeCells, setGradeCells] = useState<Record<string, { disciplina_id: string | null; professor_id: string | null }>>({})
  const [conflitos, setConflitos] = useState<Set<string>>(new Set())
  const [mensagensConflito, setMensagensConflito] = useState<Record<string, string>>({})

  const [editingCell, setEditingCell] = useState<string | null>(null)

  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmasAtivas, setTurmasAtivas] = useState<any[]>([])
  const [disciplinasTurma, setDisciplinasTurma] = useState<any[]>([])
  const [profissionaisTurma, setProfissionaisTurma] = useState<any[]>([])
  const [turmaDados, setTurmaDados] = useState<any>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // SPEC 030 — Aulas Extras (dias letivos extras do Calendário da Etapa)
  const [extrasState, setExtrasState] = useState<Record<string, { id?: string; intervalos: Intervalo[]; aulas: AulaExtra[]; foraDoCalendario?: boolean }>>({})
  const [extrasCarregando, setExtrasCarregando] = useState(false)
  const [addingAulaData, setAddingAulaData] = useState<string | null>(null)
  const [extraForm, setExtraForm] = useState({ inicio: '', fim: '', disciplina: '', professor: '' })
  const extrasPersistedDone = useRef(false)

  const formatDataExtra = (iso: string) => {
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  const diaSemanaDe = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d, 12, 0, 0).getDay()
  }

  const loadExtrasCalendario = async (tId: string, ini: string, fim: string) => {
    if (!tId || !ini || !fim || fim < ini) return
    setExtrasCarregando(true)
    try {
      const buscarPersistidos = editId && !extrasPersistedDone.current
      const [calDates, persisted] = await Promise.all([
        getDiasExtrasDoCalendario(tId, ini, fim),
        buscarPersistidos ? getExtrasDoQuadro(editId as string) : Promise.resolve([]),
      ])
      if (buscarPersistidos) extrasPersistedDone.current = true
      const calSet = new Set(calDates)
      setExtrasState(prev => {
        const next = { ...prev }
        for (const d of calDates) {
          if (!next[d]) next[d] = { intervalos: [], aulas: [] }
          else next[d] = { ...next[d], foraDoCalendario: false }
        }
        for (const p of persisted || []) {
          if (!next[p.data_aula]) {
            next[p.data_aula] = { id: p.id, intervalos: p.intervalos, aulas: p.aulas }
          } else if (!next[p.data_aula].id) {
            next[p.data_aula] = { ...next[p.data_aula], id: p.id }
          }
        }
        for (const d of Object.keys(next)) {
          next[d] = { ...next[d], foraDoCalendario: !!next[d].id && !calSet.has(d) }
        }
        return next
      })
    } catch {
      // Calendário/extras indisponíveis: card segue vazio sem bloquear a grade
    } finally {
      setExtrasCarregando(false)
    }
  }

  useEffect(() => {
    if (!turmaId || !dataInicial || !dataFinal) return
    loadExtrasCalendario(turmaId, dataInicial, dataFinal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaId, dataInicial, dataFinal])

  const profsParaDisciplinaExtra = (disciplinaId: string) =>
    profissionaisTurma.filter(p =>
      p.ativo && Array.isArray(p.disciplinas_ids) && p.disciplinas_ids.includes(disciplinaId)
    )

  const handleExtraDisciplinaChange = (val: string) => {
    const profs = val ? profsParaDisciplinaExtra(val) : []
    setExtraForm(f => ({
      ...f,
      disciplina: val,
      professor: profs.length === 1 ? profs[0].person_id : '',
    }))
  }

  const handleAddAulaExtra = (dataAula: string) => {
    if (!extraForm.inicio || !extraForm.fim) { toast.error('Informe início e término da aula'); return }
    if (extraForm.fim <= extraForm.inicio) { toast.error('Término deve ser maior que o início'); return }
    if (!extraForm.disciplina) { toast.error('Selecione a disciplina'); return }
    setExtrasState(prev => ({
      ...prev,
      [dataAula]: {
        ...prev[dataAula],
        aulas: [...(prev[dataAula]?.aulas || []), {
          horario_inicial: extraForm.inicio,
          horario_final: extraForm.fim,
          disciplina_id: extraForm.disciplina,
          professor_id: extraForm.professor || null,
        }],
      },
    }))
    setExtraForm({ inicio: '', fim: '', disciplina: '', professor: '' })
    setAddingAulaData(null)
  }

  const handleRemoveAulaExtra = (dataAula: string, idx: number) => {
    setExtrasState(prev => ({
      ...prev,
      [dataAula]: { ...prev[dataAula], aulas: prev[dataAula].aulas.filter((_, i) => i !== idx) },
    }))
  }

  const handleRemoverDataExtra = async (dataAula: string) => {
    const entry = extrasState[dataAula]
    if (entry?.id) {
      try {
        await removerDataExtra(entry.id, pessoaId)
        toast.success('Data extra removida')
      } catch (e: any) {
        toast.error(e?.message || 'Erro ao remover data extra')
        return
      }
    }
    setExtrasState(prev => {
      const next = { ...prev }
      delete next[dataAula]
      return next
    })
  }

  const addIntervaloExtra = (dataAula: string) => {
    const entry = extrasState[dataAula]
    if (!entry || entry.intervalos.length >= 3) return
    setExtrasState(prev => ({
      ...prev,
      [dataAula]: { ...prev[dataAula], intervalos: [...prev[dataAula].intervalos, { hora_inicial: '', hora_final: '' }] },
    }))
  }

  const updateIntervaloExtra = (dataAula: string, idx: number, field: 'hora_inicial' | 'hora_final', val: string) => {
    setExtrasState(prev => ({
      ...prev,
      [dataAula]: {
        ...prev[dataAula],
        intervalos: prev[dataAula].intervalos.map((iv, i) => i === idx ? { ...iv, [field]: val } : iv),
      },
    }))
  }

  const removeIntervaloExtra = (dataAula: string, idx: number) => {
    setExtrasState(prev => ({
      ...prev,
      [dataAula]: { ...prev[dataAula], intervalos: prev[dataAula].intervalos.filter((_, i) => i !== idx) },
    }))
  }

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    init()
  }, [user, schoolId])

  const init = async () => {
    try {
      const [anos, turmas] = await Promise.all([
        getAnosLetivosAtivos(schoolId),
        getTurmasAtivas(schoolId),
      ])
      setAnosLetivos(anos)
      setTurmasAtivas(turmas)

      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo) {
        setAnoLetivoId(ativo.id)
        setAnoLetivoDesc(ativo.descricao)
        setAnoLetivoDataInicio(ativo.data_inicio)
        setAnoLetivoDataTermino(ativo.data_termino)
      }

      if (editId) {
        const data = await getQuadroAula(editId)
        const q = data.quadro
        if (!q) {
          setLoading(false)
          toast.error('Quadro de aulas não encontrado')
          return
        }
        setAnoLetivoId(q.ano_letivo_id)
        setAnoLetivoDesc(q.academico_anos_letivos?.descricao || '')
        if (q.academico_anos_letivos) {
          setAnoLetivoDataInicio(q.academico_anos_letivos.data_inicio)
          setAnoLetivoDataTermino(q.academico_anos_letivos.data_termino)
        }
        setTurmaId(q.turma_id)
        setDataInicial(q.data_inicial?.split('T')[0] || '')
        setDataFinal(q.data_final?.split('T')[0] || '')
        setTempoAula(String(q.tempo_aula_minutos))
        setIntervalos(q.intervalos || [])
        setTurmaDados(q.turma)

        if (q.turma_id) {
          await loadDisciplinasProfessores(q.turma_id)
        }

        if (data.horarios && data.horarios.length > 0) {
          const loadedSlots: SlotGerado[] = data.horarios.map((h: any) => ({
            dia_semana: h.dia_semana,
            horario_inicial: h.horario_inicial,
            horario_final: h.horario_final,
          }))
          setSlots(loadedSlots)
          setGradeGerada(true)

          const cells: Record<string, { disciplina_id: string | null; professor_id: string | null }> = {}
          for (const h of data.horarios) {
            const key = `${h.dia_semana}_${h.horario_inicial}`
            cells[key] = {
              disciplina_id: h.disciplina_id || null,
              professor_id: h.professor_id || null,
            }
          }
          setGradeCells(cells)
        }
      }
    } catch (e) {
      console.error('Erro init cadastro:', e)
      toast.error(`Erro ao carregar dados: ${e instanceof Error ? e.message : 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  const loadDisciplinasProfessores = async (tId: string) => {
    try {
      const [discs, profs] = await Promise.all([
        getDisciplinasDaTurma(tId),
        getProfessoresDaTurma(tId),
      ])
      setDisciplinasTurma(discs)
      setProfissionaisTurma(profs)
    } catch {
      toast.error('Erro ao carregar disciplinas/professores')
    }
  }

  const handleTurmaChange = async (val: string) => {
    setTurmaId(val)
    setGradeGerada(false)
    setSlots([])
    setGradeCells({})
    setConflitos(new Set())
    setMensagensConflito({})
    setEditingCell(null)
    // SPEC 030: troca de turma reinicia as extras (novo calendário/etapa)
    setExtrasState({})
    extrasPersistedDone.current = false
    setAddingAulaData(null)

    const turma = turmasAtivas.find(t => t.id === val)
    setTurmaDados(turma || null)
    if (turma) {
      await loadDisciplinasProfessores(val)
    } else {
      setDisciplinasTurma([])
      setProfissionaisTurma([])
    }
  }

  const addIntervalo = () => {
    if (intervalos.length >= 3) return
    setIntervalos([...intervalos, { hora_inicial: '', hora_final: '' }])
  }

  const updateIntervalo = (idx: number, field: 'hora_inicial' | 'hora_final', val: string) => {
    const newInt = [...intervalos]
    newInt[idx] = { ...newInt[idx], [field]: val }
    setIntervalos(newInt)
  }

  const removeIntervalo = (idx: number) => {
    setIntervalos(intervalos.filter((_, i) => i !== idx))
  }

  const validarIntervalos = (): string | null => {
    for (let i = 0; i < intervalos.length; i++) {
      const iv = intervalos[i]
      if (!iv.hora_inicial || !iv.hora_final) return 'Preencha todos os horários dos intervalos'
      if (iv.hora_final <= iv.hora_inicial) return `Intervalo ${i + 1}: horário final deve ser maior que inicial`

      for (let j = i + 1; j < intervalos.length; j++) {
        const other = intervalos[j]
        if (iv.hora_inicial < other.hora_final && iv.hora_final > other.hora_inicial) {
          return 'Existem intervalos sobrepostos'
        }
      }
    }
    return null
  }

  const handleGerarGrade = async () => {
    if (!turmaId) { toast.error('Selecione uma turma'); return }
    if (!dataInicial) { toast.error('Informe a data inicial'); return }
    if (!dataFinal) { toast.error('Informe a data final'); return }
    if (!tempoAula || parseInt(tempoAula) < 1) { toast.error('Tempo de aula inválido'); return }

    const err = validarIntervalos()
    if (err) { toast.error(err); return }

    if (!turmaDados) return

    try {
      const generated = await gerarGradeHorarios(
        turmaDados.turnos || [{ turno: 'Matutino', horario_inicial: '07:30', horario_final: '11:30' }],
        turmaDados.dias_funcionamento || [],
        parseInt(tempoAula),
        intervalos
      )

      if (generated.length === 0) {
        toast.error('Não foi possível gerar horários. Verifique a configuração da turma.')
        return
      }

      setSlots(generated)

      const cells: Record<string, { disciplina_id: string | null; professor_id: string | null }> = {}
      for (const slot of generated) {
        const key = `${slot.dia_semana}_${slot.horario_inicial}`
        cells[key] = { disciplina_id: null, professor_id: null }
      }

      if (editId) {
        const data = await getQuadroAula(editId)
        if (data.horarios) {
          for (const h of data.horarios) {
            const key = `${h.dia_semana}_${h.horario_inicial}`
            if (cells[key] !== undefined) {
              cells[key] = {
                disciplina_id: h.disciplina_id || null,
                professor_id: h.professor_id || null,
              }
            }
          }
        }
      }

      setGradeCells(cells)
      setGradeGerada(true)
      setConflitos(new Set())
      setMensagensConflito({})
      setEditingCell(null)
      toast.success(`Grade gerada com ${generated.length} horários`)
    } catch {
      toast.error('Erro ao gerar grade')
    }
  }

  const handleCellChange = (diaSemana: number, horarioInicial: string, field: 'disciplina_id' | 'professor_id', value: string | null) => {
    const key = `${diaSemana}_${horarioInicial}`
    const current = gradeCells[key] || { disciplina_id: null, professor_id: null }
    const updated = { ...current, [field]: value }
    let autoSelectedProfessor: string | null = null

    if (field === 'disciplina_id' && value) {
      updated.professor_id = null
      const profs = profissionaisTurma.filter(p =>
        p.ativo && Array.isArray(p.disciplinas_ids) && p.disciplinas_ids.includes(value)
      )
      if (profs.length === 1) {
        updated.professor_id = profs[0].person_id
        autoSelectedProfessor = profs[0].person_id
      }
    }

    setGradeCells(prev => ({ ...prev, [key]: updated }))

    const professorToCheck = field === 'professor_id' ? value : autoSelectedProfessor
    if (professorToCheck) {
      checkConflito(diaSemana, horarioInicial, professorToCheck, key)
    }
  }

  const checkConflito = async (diaSemana: number, horarioInicial: string, professorId: string, key: string) => {
    const slot = slots.find(s => s.dia_semana === diaSemana && s.horario_inicial === horarioInicial)
    if (!slot) return

    try {
      const conflitosEncontrados = await validarConflitosProfessor(
        professorId, diaSemana, slot.horario_inicial, slot.horario_final,
        editId || undefined,
        // SPEC 030 FR-011: só conflita com quadros de vigência sobreposta
        dataInicial && dataFinal ? { dataInicial, dataFinal } : undefined
      )

      setConflitos(prev => {
        const next = new Set(prev)
        if (conflitosEncontrados.length > 0) {
          next.add(key)
        } else {
          next.delete(key)
        }
        return next
      })

      if (conflitosEncontrados.length > 0) {
        const c = conflitosEncontrados[0]
        // SPEC 030 FR-010: HH:MM sem segundos
        const hi = (c.horario_inicial || '').slice(0, 5)
        const hf = (c.horario_final || '').slice(0, 5)
        setMensagensConflito(prev => ({
          ...prev,
          [key]: `Professor ${c.professor_nome} já possui aula na ${DIAS_NOME[c.dia_semana] || '?'} das ${hi} às ${hf} na turma ${c.turma_nome}`
        }))
      } else {
        setMensagensConflito(prev => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      }
    } catch {
    }
  }

  const handleSaveCell = () => {
    setEditingCell(null)
  }

  const diasPresentes = [...new Set(slots.map(s => s.dia_semana))].sort()

  const getSlotKey = (dia: number, horarioRange: string) => {
    const [hi] = horarioRange.split('-')
    return `${dia}_${hi}`
  }

  const getDisciplinaName = (disciplinaId: string | null) => {
    if (!disciplinaId) return null
    const d = disciplinasTurma.find((d: any) => d.matriz_disciplina_id === disciplinaId)
    return d ? getDisciplinaDisplay(d) : null
  }

  const getProfessorName = (professorId: string | null) => {
    if (!professorId) return null
    const p = profissionaisTurma.find((p: any) => p.person_id === professorId)
    if (!p) return null
    return p.people?.nome_completo || 'Sem nome'
  }

  const handleSalvar = async () => {
    if (!turmaId) { toast.error('Selecione uma turma'); return }
    if (!dataInicial || !dataFinal) { toast.error('Preencha as datas de vigência'); return }
    if (!tempoAula || parseInt(tempoAula) < 1) { toast.error('Tempo de aula inválido'); return }
    if (dataFinal < dataInicial) { toast.error('Data final não pode ser menor que inicial'); return }
    if (anoLetivoDataInicio && dataInicial < anoLetivoDataInicio) { toast.error('Data inicial anterior ao início do ano letivo'); return }
    if (anoLetivoDataTermino && dataFinal > anoLetivoDataTermino) { toast.error('Data final posterior ao término do ano letivo'); return }

    const err = validarIntervalos()
    if (err) { toast.error(err); return }

    if (!gradeGerada) { toast.error('Gere o quadro de aulas antes de salvar'); return }

    for (const [key, cell] of Object.entries(gradeCells)) {
      if (!cell.disciplina_id) {
        toast.error('Todas as células devem ter uma disciplina atribuída')
        return
      }
    }

    if (conflitos.size > 0) {
      toast.error('Existem conflitos de horário de professor. Resolva antes de salvar.')
      return
    }

    try {
      const sobrepoe = await validarSobreposicaoVigencia(turmaId, dataInicial, dataFinal, editId || undefined)
      if (sobrepoe) {
        toast.error('Já existe quadro ativo para esta turma no período informado')
        return
      }
    } catch {
      toast.error('Erro ao validar vigência')
      return
    }

    setSaving(true)
    try {
      const horarios = slots.map(slot => ({
        dia_semana: slot.dia_semana,
        horario_inicial: slot.horario_inicial,
        horario_final: slot.horario_final,
        disciplina_id: gradeCells[getSlotKey(slot.dia_semana, `${slot.horario_inicial}-${slot.horario_final}`)]?.disciplina_id || null,
        professor_id: gradeCells[getSlotKey(slot.dia_semana, `${slot.horario_inicial}-${slot.horario_final}`)]?.professor_id || null,
      }))

      if (editId) {
        await updateQuadroAula(editId, {
          data_inicial: dataInicial,
          data_final: dataFinal,
          tempo_aula_minutos: parseInt(tempoAula),
          intervalos,
          horarios,
        }, pessoaId)
        toast.success('Quadro de aulas atualizado')
      } else {
        if (!schoolId) { toast.error('Escola não identificada'); setSaving(false); return }
        const novo = await createQuadroAula({
          school_id: schoolId,
          ano_letivo_id: anoLetivoId,
          turma_id: turmaId,
          data_inicial: dataInicial,
          data_final: dataFinal,
          tempo_aula_minutos: parseInt(tempoAula),
          intervalos,
          horarios,
        }, pessoaId)
        toast.success('Quadro de aulas criado')
        // SPEC 030: extras do modo criação são salvas no quadro recém-criado
        const extrasPayloadCriacao = Object.entries(extrasState)
          .filter(([, e]) => e.aulas.length > 0 || e.intervalos.length > 0)
          .map(([data_aula, e]) => ({ data_aula, intervalos: e.intervalos, aulas: e.aulas }))
        if (novo?.id && extrasPayloadCriacao.length > 0) {
          await saveExtrasDoQuadro(novo.id, extrasPayloadCriacao, pessoaId)
        }
        router.push('/gestao-turmas/quadro-aulas')
        return
      }

      // SPEC 030: persiste aulas extras junto com a grade (modo edição)
      const extrasPayload = Object.entries(extrasState)
        .filter(([, e]) => e.aulas.length > 0 || e.intervalos.length > 0 || e.id)
        .map(([data_aula, e]) => ({ data_aula, intervalos: e.intervalos, aulas: e.aulas }))
      if (extrasPayload.length > 0) {
        await saveExtrasDoQuadro(editId, extrasPayload, pessoaId)
      }
      router.push('/gestao-turmas/quadro-aulas')
    } catch {
      toast.error('Erro ao salvar quadro de aulas')
    } finally {
      setSaving(false)
    }
  }

  const handleExcluir = async () => {
    if (!editId) return
    try {
      await deleteQuadroAula(editId, pessoaId)
      toast.success('Quadro excluído')
      router.push('/gestao-turmas/quadro-aulas')
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao excluir quadro')
    } finally {
      setConfirmDelete(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        icon={GraduationCap}
        title={editId ? 'Editar Quadro de Aulas' : 'Novo Quadro de Aulas'}
        description={editId ? 'Altere as informações do quadro' : 'Preencha os dados para gerar a grade horária'}
        actions={
          <div className="flex items-center gap-2">
            {editId && (
              <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => router.push('/gestao-turmas/quadro-aulas')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        }
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(false)}
        title="Excluir quadro de aulas"
        description="Excluir este quadro de aulas permanentemente? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleExcluir}
      />

      <FormCard
        title="Identificação"
        description="Ano letivo, turma, vigência e tempo de aula"
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label className="text-[14px] font-medium mb-1 block">Ano Letivo</Label>
            <Input value={anoLetivoDesc} disabled className="border-border bg-muted" />
          </div>
          <div>
            <Label className="text-[14px] font-medium mb-1 block">Turma <span className="text-destructive">*</span></Label>
            <Select value={turmaId} onValueChange={handleTurmaChange} disabled={!!editId}>
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmasAtivas.map((t: any) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.codigo_inep ? `${t.codigo_inep} - ` : ''}{t.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[14px] font-medium mb-1 block">Data Inicial <span className="text-destructive">*</span></Label>
            <DatePicker
              value={dataInicial}
              onChange={setDataInicial}
              minDate={anoLetivoDataInicio || undefined}
              maxDate={anoLetivoDataTermino || undefined}
            />
            {dataInicial && anoLetivoDataInicio && dataInicial < anoLetivoDataInicio && (
              <p className="text-[11px] text-destructive mt-0.5">Data anterior ao início do ano letivo</p>
            )}
          </div>
          <div>
            <Label className="text-[14px] font-medium mb-1 block">Data Final <span className="text-destructive">*</span></Label>
            <DatePicker
              value={dataFinal}
              onChange={setDataFinal}
              minDate={dataInicial || anoLetivoDataInicio || undefined}
              maxDate={anoLetivoDataTermino || undefined}
            />
            {dataFinal && anoLetivoDataTermino && dataFinal > anoLetivoDataTermino && (
              <p className="text-[11px] text-destructive mt-0.5">Data posterior ao término do ano letivo</p>
            )}
          </div>
          <div>
            <Label className="text-[14px] font-medium mb-1 block">Tempo de Aula <span className="text-destructive">*</span></Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                value={tempoAula}
                onChange={e => setTempoAula(e.target.value)}
                className="border-border"
              />
              <span className="text-[14px] text-muted-foreground whitespace-nowrap">min</span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="rounded-lg border border-border p-4 space-y-3">
            <Label className="text-[14px] font-medium">Intervalos</Label>
            {intervalos.length === 0 ? (
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={addIntervalo}
                  className="h-8 text-xs border-border">
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar intervalo
                </Button>
                <p className="text-[15px] text-muted-foreground italic">Nenhum intervalo cadastrado</p>
              </div>
            ) : (
              <div className="space-y-2">
                {intervalos.map((iv, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">{idx + 1}.</span>
                    <div className="w-36">
                      <TimePicker value={iv.hora_inicial}
                        onChange={v => updateIntervalo(idx, 'hora_inicial', v)}
                        ariaLabel="Início do intervalo" placeholder="--:--" />
                    </div>
                    <span className="text-muted-foreground">às</span>
                    <div className="w-36">
                      <TimePicker value={iv.hora_final}
                        onChange={v => updateIntervalo(idx, 'hora_final', v)}
                        ariaLabel="Término do intervalo" placeholder="--:--" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => removeIntervalo(idx)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {intervalos.length < 3 && (
                  <Button variant="outline" size="sm" onClick={addIntervalo}
                    className="h-8 text-xs border-border">
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar intervalo
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botão Gerar */}
        <div className="pt-6">
          <Button
            onClick={handleGerarGrade}
            disabled={!turmaId}
            size="lg"
            className="text-[15px] px-8 py-6"
          >
            <Clock className="h-5 w-5 mr-2" />
            Gerar Quadro de Aulas
          </Button>
          {!turmaId && (
            <p className="text-xs text-muted-foreground mt-2">Selecione uma turma primeiro</p>
          )}
        </div>
      </FormCard>

      {/* Quadro de Aulas */}
      {gradeGerada && slots.length > 0 && (
        <FormCard
          title={`Quadro de Aulas (${slots.length} horários gerados)`}
          className="mb-6"
        >
          <div className="overflow-x-auto max-w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="sticky left-0 bg-muted z-10 w-24 text-foreground font-semibold uppercase text-[13px] tracking-wider">Horário</TableHead>
                {diasPresentes.map(dia => (
                  <TableHead key={dia} className="text-center min-w-[180px] text-foreground font-semibold uppercase text-[13px] tracking-wider">
                    {DIAS_NOME[dia] || `Dia ${dia}`}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const slotRanges = new Set(slots.map(s => `${s.horario_inicial}-${s.horario_final}`))
                const intervalRanges = new Set(
                  intervalos
                    .filter(iv => iv.hora_inicial && iv.hora_final)
                    .map(iv => `${iv.hora_inicial}-${iv.hora_final}`)
                )
                const allRanges = [...new Set([...slotRanges, ...intervalRanges])].sort()
                return allRanges.map(hr => {
                  const [hInicio, hFim] = hr.split('-')
                  const isIntervalo = intervalRanges.has(hr)

                  if (isIntervalo) {
                    return (
                      <TableRow key={hr}>
                        <TableCell className="sticky left-0 bg-muted/40 z-10 py-3">
                          <div className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {hInicio.slice(0, 5)} - {hFim.slice(0, 5)}
                          </div>
                        </TableCell>
                        {diasPresentes.map(dia => (
                          <TableCell key={`${dia}_${hr}`} className="py-1 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-px bg-border" />
                              <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap uppercase tracking-wider">
                                Intervalo
                              </span>
                              <div className="flex-1 h-px bg-border" />
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  }

                  return (
                    <TableRow key={hr}>
                      <TableCell className="sticky left-0 bg-card z-10 font-medium text-xs whitespace-nowrap py-4">
                        {hInicio.slice(0, 5)} - {hFim.slice(0, 5)}
                      </TableCell>
                      {diasPresentes.map(dia => {
                        const key = getSlotKey(dia, hr)
                        const cell = gradeCells[key] || { disciplina_id: null, professor_id: null }
                        const temConflito = conflitos.has(key)
                        const isEditing = editingCell === key
                        const disciplinaNome = getDisciplinaName(cell.disciplina_id)
                        const professorNome = getProfessorName(cell.professor_id)

                        return (
                          <TableCell key={key} className={`p-2 border-l border-border first:border-l-0 ${temConflito ? 'bg-destructive/5' : ''}`}>
                            {isEditing ? (
                              <div className="space-y-1.5">
                                <Select
                                  value={cell.disciplina_id || ''}
                                  onValueChange={v => handleCellChange(dia, hInicio, 'disciplina_id', v || null)}
                                >
                                  <SelectTrigger className="h-8 text-xs border-border">
                                    <SelectValue placeholder="Disciplina" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {disciplinasTurma.map((d: any) => (
                                      <SelectItem key={d.matriz_disciplina_id} value={d.matriz_disciplina_id}
                                        title={getDisciplinaFullName(d)}>
                                        {getDisciplinaDisplay(d)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={cell.professor_id || ''}
                                  onValueChange={v => handleCellChange(dia, hInicio, 'professor_id', v || null)}
                                  disabled={!cell.disciplina_id}
                                >
                                  <SelectTrigger className="h-8 text-xs border-border">
                                    <SelectValue placeholder={cell.disciplina_id ? 'Professor' : '—'} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {cell.disciplina_id ? (
                                      profissionaisTurma
                                        .filter(p =>
                                          p.ativo &&
                                          Array.isArray(p.disciplinas_ids) &&
                                          p.disciplinas_ids.includes(cell.disciplina_id)
                                        )
                                        .map((p: any) => (
                                          <SelectItem key={p.person_id} value={p.person_id}>
                                            {p.people?.codigo_pessoa ? `${p.people.codigo_pessoa} - ` : ''}{p.people?.nome_completo || 'Sem nome'}
                                          </SelectItem>
                                        ))
                                    ) : (
                                      <SelectItem value="_none" disabled>Selecione a disciplina primeiro</SelectItem>
                                    )}
                                    {cell.disciplina_id && profissionaisTurma.filter(p =>
                                      p.ativo &&
                                      Array.isArray(p.disciplinas_ids) &&
                                      p.disciplinas_ids.includes(cell.disciplina_id)
                                    ).length === 0 && (
                                      <SelectItem value="_none" disabled>Nenhum professor disponível</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs w-full mt-1"
                                  onClick={handleSaveCell}
                                >
                                  Concluído
                                </Button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditingCell(key)}
                                className="w-full text-left rounded-md border border-border p-3 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                              >
                                {disciplinaNome ? (
                                  <>
                                    <div className="text-[13px] font-semibold text-foreground leading-tight">
                                      {disciplinaNome}
                                    </div>
                                    <div className="text-[12px] text-muted-foreground mt-0.5 leading-tight">
                                      {professorNome || 'Sem professor'}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span className="text-[12px]">Clique para atribuir</span>
                                  </div>
                                )}
                              </button>
                            )}

                            {temConflito && mensagensConflito[key] && (
                              <div className="flex items-start gap-1 mt-1.5">
                                <AlertCircle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />
                                <p className="text-[11px] text-destructive leading-tight break-words whitespace-normal max-w-[220px]">
                                  {mensagensConflito[key]}
                                </p>
                              </div>
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })
              })()}
            </TableBody>
          </Table>
          </div>

          {/* Dica */}
          <div className="mt-4 flex items-start gap-2 text-[13px] text-muted-foreground bg-muted/50 rounded-lg p-3">
            <span className="text-base">💡</span>
            <span>Clique em qualquer célula para alterar a disciplina ou professor.</span>
          </div>
        </FormCard>
      )}

      {/* SPEC 030 — Aulas Extras: dias letivos fora da grade semanal (ex: sábados letivos) */}
      {turmaId && dataInicial && dataFinal && dataFinal >= dataInicial && (() => {
        const datasExtras = Object.keys(extrasState).sort()
        return (
          <FormCard
            title={`Aulas Extras${datasExtras.length > 0 ? ` (${datasExtras.length} dia(s))` : ''}`}
            description="Dias letivos extras do calendário da etapa (ex: sábados letivos)"
            className="mb-6"
          >
            {extrasCarregando ? (
              <div className="flex items-center gap-2 py-4 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[14px]">Buscando dias letivos extras no calendário...</span>
              </div>
            ) : datasExtras.length === 0 ? (
              <p className="text-[15px] text-muted-foreground italic py-2">
                Nenhum dia letivo extra no calendário da etapa para este período.
              </p>
            ) : (
              <div className="space-y-4">
                {datasExtras.map(dataAula => {
                  const entry = extrasState[dataAula]
                  const dow = diaSemanaDe(dataAula)
                  return (
                    <div key={dataAula} className="rounded-lg border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[15px] font-semibold text-foreground">
                            {formatDataExtra(dataAula)} — {DIAS_NOME[dow] || `Dia ${dow}`}
                          </span>
                          {entry.foraDoCalendario && (
                            <StatusBadge status="warning">Removida do calendário</StatusBadge>
                          )}
                        </div>
                        <Button variant="ghost" size="icon-sm"
                          onClick={() => handleRemoverDataExtra(dataAula)}
                          title="Remover data e aulas associadas">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {entry.aulas.length > 0 && (
                        <div className="space-y-2">
                          {entry.aulas.map((a, idx) => (
                            <div key={idx} className="flex items-center gap-3 flex-wrap rounded-md bg-muted/40 px-3 py-2">
                              <span className="text-[13px] font-medium text-foreground font-mono whitespace-nowrap">
                                {(a.horario_inicial || '').slice(0, 5)} - {(a.horario_final || '').slice(0, 5)}
                              </span>
                              <span className="text-[13px] font-semibold text-foreground">
                                {getDisciplinaName(a.disciplina_id) || '—'}
                              </span>
                              <span className="text-[13px] text-muted-foreground">
                                {getProfessorName(a.professor_id) || 'Sem professor'}
                              </span>
                              <Button variant="ghost" size="icon-sm" className="ml-auto"
                                onClick={() => handleRemoveAulaExtra(dataAula, idx)}
                                title="Excluir aula">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {addingAulaData === dataAula ? (
                        <div className="rounded-md border border-border p-3 space-y-3">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                              <Label className="text-[13px] font-medium mb-1 block">Hora de Início <span className="text-destructive">*</span></Label>
                              <TimePicker value={extraForm.inicio}
                                onChange={v => setExtraForm(f => ({ ...f, inicio: v }))}
                                ariaLabel="Hora de início" placeholder="--:--" />
                            </div>
                            <div>
                              <Label className="text-[13px] font-medium mb-1 block">Hora de Término <span className="text-destructive">*</span></Label>
                              <TimePicker value={extraForm.fim}
                                onChange={v => setExtraForm(f => ({ ...f, fim: v }))}
                                ariaLabel="Hora de término" placeholder="--:--" />
                            </div>
                            <div>
                              <Label className="text-[13px] font-medium mb-1 block">Disciplina <span className="text-destructive">*</span></Label>
                              <Select value={extraForm.disciplina} onValueChange={handleExtraDisciplinaChange}>
                                <SelectTrigger className="border-border">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {disciplinasTurma.map((d: any) => (
                                    <SelectItem key={d.matriz_disciplina_id} value={d.matriz_disciplina_id}
                                      title={getDisciplinaFullName(d)}>
                                      {getDisciplinaDisplay(d)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-[13px] font-medium mb-1 block">Professor</Label>
                              <Select value={extraForm.professor}
                                onValueChange={v => setExtraForm(f => ({ ...f, professor: v }))}
                                disabled={!extraForm.disciplina}>
                                <SelectTrigger className="border-border">
                                  <SelectValue placeholder={extraForm.disciplina ? 'Selecione' : 'Disciplina primeiro'} />
                                </SelectTrigger>
                                <SelectContent>
                                  {extraForm.disciplina && profsParaDisciplinaExtra(extraForm.disciplina).map((p: any) => (
                                    <SelectItem key={p.person_id} value={p.person_id}>
                                      {p.people?.codigo_pessoa ? `${p.people.codigo_pessoa} - ` : ''}{p.people?.nome_completo || 'Sem nome'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setAddingAulaData(null); setExtraForm({ inicio: '', fim: '', disciplina: '', professor: '' }) }}>
                              Cancelar
                            </Button>
                            <Button size="sm" onClick={() => handleAddAulaExtra(dataAula)}>
                              <Plus className="h-3 w-3 mr-1" /> Adicionar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => { setAddingAulaData(dataAula); setExtraForm({ inicio: '', fim: '', disciplina: '', professor: '' }) }}
                          className="h-8 text-xs border-border">
                          <Plus className="h-3 w-3 mr-1" />
                          Adicionar Aula
                        </Button>
                      )}

                      <div className="space-y-2 pt-1">
                        <Label className="text-[13px] font-medium">Intervalos</Label>
                        {entry.intervalos.map((iv, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-36">
                              <TimePicker value={iv.hora_inicial}
                                onChange={v => updateIntervaloExtra(dataAula, idx, 'hora_inicial', v)}
                                ariaLabel="Início do intervalo" placeholder="--:--" />
                            </div>
                            <span className="text-muted-foreground">às</span>
                            <div className="w-36">
                              <TimePicker value={iv.hora_final}
                                onChange={v => updateIntervaloExtra(dataAula, idx, 'hora_final', v)}
                                ariaLabel="Término do intervalo" placeholder="--:--" />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8"
                              onClick={() => removeIntervaloExtra(dataAula, idx)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        {entry.intervalos.length < 3 && (
                          <Button variant="outline" size="sm" onClick={() => addIntervaloExtra(dataAula)}
                            className="h-8 text-xs border-border">
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar intervalo
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </FormCard>
        )
      })()}

      {/* Footer */}
      {gradeGerada && (
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" size="lg" className="min-h-[40px] sm:min-h-[44px]"
            onClick={() => router.push('/gestao-turmas/quadro-aulas')}>
            Cancelar
          </Button>
          <Button
            size="lg"
            onClick={handleSalvar}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            {editId ? 'Salvar Alterações' : 'Salvar Quadro de Aulas'}
          </Button>
        </div>
      )}
    </PageContainer>
  )
}
