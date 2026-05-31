'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Plus, Trash2, ArrowLeft, Save, Calendar, Clock, AlertCircle, Loader2
} from 'lucide-react'
import { getFirstSchool } from '@/lib/actions/schools'
import {
  getQuadroAula, createQuadroAula, updateQuadroAula,
  gerarGradeHorarios, validarConflitosProfessor, validarSobreposicaoVigencia,
  getTurmasAtivas, getDisciplinasDaTurma, getProfessoresDaTurma,
  getAnosLetivosAtivos,
  type Intervalo, type SlotGerado,
} from '@/lib/actions/quadro-aulas'

// ----- helpers -----
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
    <Suspense fallback={<div className="md:pl-64 container mx-auto py-8 px-4"><div className="text-center text-slate-400 py-8">Carregando...</div></div>}>
      <CadastroForm />
    </Suspense>
  )
}

function CadastroForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const [schoolId, setSchoolId] = useState('')
  const { user, loading: authLoading } = useAuth()
  const { pessoaId } = usePermissoes(schoolId)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Card Identificação
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [anoLetivoDesc, setAnoLetivoDesc] = useState('')
  const [anoLetivoDataInicio, setAnoLetivoDataInicio] = useState('')
  const [anoLetivoDataTermino, setAnoLetivoDataTermino] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [tempoAula, setTempoAula] = useState('50')
  const [intervalos, setIntervalos] = useState<Intervalo[]>([])

  // Grade
  const [gradeGerada, setGradeGerada] = useState(false)
  const [slots, setSlots] = useState<SlotGerado[]>([])
  const [gradeCells, setGradeCells] = useState<Record<string, { disciplina_id: string | null; professor_id: string | null }>>({})
  const [conflitos, setConflitos] = useState<Set<string>>(new Set())
  const [mensagensConflito, setMensagensConflito] = useState<Record<string, string>>({})

  // Dados auxiliares
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmasAtivas, setTurmasAtivas] = useState<any[]>([])
  const [disciplinasTurma, setDisciplinasTurma] = useState<any[]>([])
  const [profissionaisTurma, setProfissionaisTurma] = useState<any[]>([])

  // Turma selecionada (dados)
  const [turmaDados, setTurmaDados] = useState<any>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    init()
  }, [user])

  const init = async () => {
    try {
      const s = await getFirstSchool()
      setSchoolId(s.id)
      const [anos, turmas] = await Promise.all([
        getAnosLetivosAtivos(s.id),
        getTurmasAtivas(s.id),
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

    const turma = turmasAtivas.find(t => t.id === val)
    setTurmaDados(turma || null)
    if (turma) {
      await loadDisciplinasProfessores(val)
    } else {
      setDisciplinasTurma([])
      setProfissionaisTurma([])
    }
  }

  // Intervalos
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

  // Geração da grade
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

      // Se editando, tentar re-aplicar valores existentes
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
      toast.success(`Grade gerada com ${generated.length} horários`)
    } catch {
      toast.error('Erro ao gerar grade')
    }
  }

  // Atualizar célula
  const handleCellChange = (diaSemana: number, horarioInicial: string, field: 'disciplina_id' | 'professor_id', value: string | null) => {
    const key = `${diaSemana}_${horarioInicial}`
    const updated = { ...gradeCells[key] || { disciplina_id: null, professor_id: null }, [field]: value }
    let autoSelectedProfessor: string | null = null

    if (field === 'disciplina_id') {
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
        editId || undefined
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
        setMensagensConflito(prev => ({
          ...prev,
          [key]: `Professor ${c.professor_nome} já possui aula na ${DIAS_NOME[c.dia_semana] || '?'} das ${c.horario_inicial} às ${c.horario_final} na turma ${c.turma_nome}`
        }))
      } else {
        setMensagensConflito(prev => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      }
    } catch {
      // ignorar erro de validação
    }
  }

  // Agrupar slots para grade
  const uniqueHorarios = [...new Set(slots.map(s => `${s.horario_inicial}-${s.horario_final}`))].sort()
  const diasPresentes = [...new Set(slots.map(s => s.dia_semana))].sort()

  const getSlotKey = (dia: number, horarioRange: string) => {
    const [hi] = horarioRange.split('-')
    return `${dia}_${hi}`
  }

  // Salvar
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

    // Validar células sem disciplina
    for (const [key, cell] of Object.entries(gradeCells)) {
      if (!cell.disciplina_id) {
        toast.error('Todas as células devem ter uma disciplina atribuída')
        return
      }
    }

    // Validar conflitos
    if (conflitos.size > 0) {
      toast.error('Existem conflitos de horário de professor. Resolva antes de salvar.')
      return
    }

    // Validar sobreposição de vigência
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
        await createQuadroAula({
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
      }
      router.push('/gestao-turmas/quadro-aulas')
    } catch {
      toast.error('Erro ao salvar quadro de aulas')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="md:pl-64 container mx-auto py-8 px-4">
        <div className="text-center text-slate-400 py-8">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="md:pl-64 container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" className="h-9 w-9"
          onClick={() => router.push('/gestao-turmas/quadro-aulas')}>
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            {editId ? 'Editar Quadro de Aulas' : 'Novo Quadro de Aulas'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {editId ? 'Altere as informações do quadro' : 'Preencha os dados para gerar a grade horária'}
          </p>
        </div>
      </div>

      {/* Card Identificação */}
      <Card className="border-[#cbd5e1] shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-6">
        <CardHeader className="bg-slate-50/40 border-b border-slate-200">
          <CardTitle className="text-base font-medium text-slate-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Identificação
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ano Letivo */}
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Ano Letivo</Label>
              <Input value={anoLetivoDesc} disabled className="border-slate-300 bg-slate-50" />
            </div>

            {/* Turma */}
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Turma <span className="text-red-400">*</span></Label>
              <Select value={turmaId} onValueChange={handleTurmaChange} disabled={!!editId}>
                <SelectTrigger className="border-slate-300">
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

            {/* Data Inicial */}
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Data Inicial <span className="text-red-400">*</span></Label>
              <Input
                type="date"
                value={dataInicial}
                min={anoLetivoDataInicio}
                max={anoLetivoDataTermino}
                onChange={e => setDataInicial(e.target.value)}
                className="border-slate-300"
              />
              {dataInicial && anoLetivoDataInicio && dataInicial < anoLetivoDataInicio && (
                <p className="text-[11px] text-red-500 mt-0.5">Data anterior ao início do ano letivo</p>
              )}
            </div>

            {/* Data Final */}
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Data Final <span className="text-red-400">*</span></Label>
              <Input
                type="date"
                value={dataFinal}
                min={anoLetivoDataInicio}
                max={anoLetivoDataTermino}
                onChange={e => setDataFinal(e.target.value)}
                className="border-slate-300"
              />
              {dataFinal && anoLetivoDataTermino && dataFinal > anoLetivoDataTermino && (
                <p className="text-[11px] text-red-500 mt-0.5">Data posterior ao término do ano letivo</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Tempo de Aula */}
            <div>
              <Label className="text-xs text-slate-500 mb-1 block">Tempo de Aula (minutos) <span className="text-red-400">*</span></Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={tempoAula}
                  onChange={e => setTempoAula(e.target.value)}
                  className="border-slate-300 w-32"
                />
                <span className="text-sm text-slate-500">minutos</span>
              </div>
            </div>
          </div>

          {/* Intervalos */}
          <Separator className="my-4" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs text-slate-500">Intervalos</Label>
              {intervalos.length < 3 && (
                <Button variant="outline" size="sm" onClick={addIntervalo}
                  className="h-8 text-xs border-slate-300">
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar outro intervalo
                </Button>
              )}
            </div>
            {intervalos.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Nenhum intervalo cadastrado</p>
            ) : (
              <div className="space-y-2">
                {intervalos.map((iv, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-6">{idx + 1}.</span>
                    <Input
                      type="time"
                      value={iv.hora_inicial}
                      onChange={e => updateIntervalo(idx, 'hora_inicial', e.target.value)}
                      className="border-slate-300 w-36"
                    />
                    <span className="text-slate-400">às</span>
                    <Input
                      type="time"
                      value={iv.hora_final}
                      onChange={e => updateIntervalo(idx, 'hora_final', e.target.value)}
                      className="border-slate-300 w-36"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => removeIntervalo(idx)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botão Gerar */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <Button
              className="bg-[#1D3557] hover:bg-[#2d4a6f] text-white"
              onClick={handleGerarGrade}
              disabled={!turmaId}
            >
              <Clock className="h-4 w-4 mr-1.5" />
              Gerar Quadro de Aulas
            </Button>
            {!turmaId && (
              <p className="text-xs text-slate-400 mt-1.5">Selecione uma turma primeiro</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card Quadro de Aulas */}
      {gradeGerada && slots.length > 0 && (
        <Card className="border-[#cbd5e1] shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-6">
          <CardHeader className="bg-slate-50/40 border-b border-slate-200">
            <CardTitle className="text-base font-medium text-slate-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Quadro de Aulas
              <span className="text-xs font-normal text-slate-400 ml-1">
                ({slots.length} horários gerados)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="sticky left-0 bg-slate-50/80 border-b border-slate-200 px-3 py-2.5 text-left text-xs font-medium text-slate-500 w-28">
                    Horário
                  </th>
                  {diasPresentes.map(dia => (
                    <th key={dia} className="border-b border-slate-200 px-3 py-2.5 text-center text-xs font-medium text-slate-500 min-w-[160px]">
                      {DIAS_NOME[dia] || `Dia ${dia}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uniqueHorarios.map(hr => {
                  const [hInicio, hFim] = hr.split('-')
                  return (
                    <tr key={hr} className="border-b border-slate-100 last:border-0">
                      <td className="sticky left-0 bg-white border-r border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 whitespace-nowrap">
                        {hInicio} - {hFim}
                      </td>
                      {diasPresentes.map(dia => {
                        const key = getSlotKey(dia, hr)
                        const cell = gradeCells[key] || { disciplina_id: null, professor_id: null }
                        const temConflito = conflitos.has(key)

                        return (
                          <td key={key} className={`px-1.5 py-1 border-r border-slate-100 last:border-r-0 ${temConflito ? 'bg-red-50' : ''}`}>
                            <div className="space-y-1 min-w-[140px]">
                              {/* Disciplina select */}
                              <Select
                                value={cell.disciplina_id || ''}
                                onValueChange={v => handleCellChange(dia, hInicio, 'disciplina_id', v || null)}
                              >
                                <SelectTrigger className={`h-7 text-[11px] border-slate-300 ${!cell.disciplina_id ? 'text-slate-400' : ''}`}>
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

                              {/* Professor select (sempre visível) */}
                              <Select
                                value={cell.professor_id || ''}
                                onValueChange={v => handleCellChange(dia, hInicio, 'professor_id', v || null)}
                                disabled={!cell.disciplina_id}
                              >
                                <SelectTrigger className={`h-7 text-[11px] border-slate-300 ${!cell.professor_id ? 'text-slate-400' : ''}`}>
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

                              {temConflito && mensagensConflito[key] && (
                                <div className="flex items-start gap-1 mt-1">
                                  <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                                  <p className="text-[11px] text-red-600 leading-tight">
                                    {mensagensConflito[key]}
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      {gradeGerada && (
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" className="border-slate-300"
            onClick={() => router.push('/gestao-turmas/quadro-aulas')}>
            Cancelar
          </Button>
          <Button
            className="bg-[#1D3557] hover:bg-[#2d4a6f] text-white"
            onClick={handleSalvar}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1.5" />
            )}
            Salvar
          </Button>
        </div>
      )}
    </div>
  )
}
