'use client'

import { Suspense, useState, useEffect } from 'react'
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
import { toast } from 'sonner'
import {
  Plus, Trash2, Save, Calendar, Clock, AlertCircle, Loader2, GraduationCap, Pencil, ChevronLeft,
} from 'lucide-react'
import {
  getQuadroAula, createQuadroAula, updateQuadroAula,
  gerarGradeHorarios, validarConflitosProfessor, validarSobreposicaoVigencia,
  getTurmasAtivas, getDisciplinasDaTurma, getProfessoresDaTurma,
  getAnosLetivosAtivos,
  type Intervalo, type SlotGerado,
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
          <Button variant="outline" size="sm" onClick={() => router.push('/gestao-turmas/quadro-aulas')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        }
      />

      <FormCard
        title="Identificação"
        description="Ano letivo, turma e vigência"
        className="mb-6"
      >
        {/* Grupo 1: Ano letivo, Turma, Data inicial, Data final */}
        <div className="space-y-1.5">
          <Label className="text-[14px] font-medium">Grupo 1 — Ano letivo, turma e vigência</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Ano Letivo</Label>
              <Input value={anoLetivoDesc} disabled className="border-border bg-muted" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Turma <span className="text-destructive">*</span></Label>
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
              <Label className="text-xs text-muted-foreground mb-1 block">Data Inicial <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={dataInicial}
                min={anoLetivoDataInicio}
                max={anoLetivoDataTermino}
                onChange={e => setDataInicial(e.target.value)}
                className="border-border"
              />
              {dataInicial && anoLetivoDataInicio && dataInicial < anoLetivoDataInicio && (
                <p className="text-[11px] text-destructive mt-0.5">Data anterior ao início do ano letivo</p>
              )}
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Data Final <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={dataFinal}
                min={anoLetivoDataInicio}
                max={anoLetivoDataTermino}
                onChange={e => setDataFinal(e.target.value)}
                className="border-border"
              />
              {dataFinal && anoLetivoDataTermino && dataFinal > anoLetivoDataTermino && (
                <p className="text-[11px] text-destructive mt-0.5">Data posterior ao término do ano letivo</p>
              )}
            </div>
          </div>
        </div>

        {/* Grupo 2: Tempo da aula */}
        <div className="space-y-1.5 pt-6">
          <Label className="text-[14px] font-medium">Grupo 2 — Tempo da aula</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={tempoAula}
              onChange={e => setTempoAula(e.target.value)}
              className="border-border w-28"
            />
            <span className="text-sm text-muted-foreground">minutos</span>
          </div>
        </div>

        {/* Grupo 3: Intervalos (com divisor) */}
        <div className="pt-6">
          <div className="border-t border-border pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[14px] font-medium">Grupo 3 — Intervalos</Label>
              {intervalos.length < 3 && (
                <Button variant="outline" size="sm" onClick={addIntervalo}
                  className="h-8 text-xs border-border">
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar intervalo
                </Button>
              )}
            </div>
            {intervalos.length === 0 ? (
              <p className="text-[15px] text-muted-foreground italic">Nenhum intervalo cadastrado</p>
            ) : (
              <div className="space-y-2">
                {intervalos.map((iv, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-6">{idx + 1}.</span>
                    <Input
                      type="time"
                      value={iv.hora_inicial}
                      onChange={e => updateIntervalo(idx, 'hora_inicial', e.target.value)}
                      className="border-border w-36"
                    />
                    <span className="text-muted-foreground">às</span>
                    <Input
                      type="time"
                      value={iv.hora_final}
                      onChange={e => updateIntervalo(idx, 'hora_final', e.target.value)}
                      className="border-border w-36"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => removeIntervalo(idx)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-muted z-10 w-24">Horário</TableHead>
                {diasPresentes.map(dia => (
                  <TableHead key={dia} className="text-center min-w-[180px]">
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
                            {hInicio} - {hFim}
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
                        {hInicio} - {hFim}
                      </TableCell>
                      {diasPresentes.map(dia => {
                        const key = getSlotKey(dia, hr)
                        const cell = gradeCells[key] || { disciplina_id: null, professor_id: null }
                        const temConflito = conflitos.has(key)
                        const isEditing = editingCell === key
                        const disciplinaNome = getDisciplinaName(cell.disciplina_id)
                        const professorNome = getProfessorName(cell.professor_id)

                        return (
                          <TableCell key={key} className={`p-2 ${temConflito ? 'bg-destructive/5' : ''}`}>
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
                                <p className="text-[11px] text-destructive leading-tight">
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

          {/* Dica */}
          <div className="mt-4 flex items-start gap-2 text-[13px] text-muted-foreground bg-muted/50 rounded-lg p-3">
            <span className="text-base">💡</span>
            <span>Clique em qualquer célula para alterar a disciplina ou professor.</span>
          </div>
        </FormCard>
      )}

      {/* Footer */}
      {gradeGerada && (
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button variant="ghost" size="lg"
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
