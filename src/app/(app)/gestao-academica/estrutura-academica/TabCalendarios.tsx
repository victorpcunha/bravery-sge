'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePickerDual } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { toast } from 'sonner'
import { Plus, Trash2, Calendar, ShieldAlert, Pencil } from 'lucide-react'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  getAnosLetivos,
  createAnoLetivo,
  updateAnoLetivo,
  deleteAnoLetivo,
  encerrarAnoLetivo,
  getCalendarios,
  createCalendario,
  updateCalendario,
  deleteCalendario,
  getEventos,
  createEvento,
  updateEvento,
  deleteEvento,
  AnoLetivo,
  Calendario,
  EventoCalendario,
  getDiasLetivosPorMes
} from '@/lib/actions/calendarios'

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function gerarDiasCalendario(inicio: string, termino: string) {
  const dias = []
  const current = new Date(inicio)
  const end = new Date(termino)
  while (current <= end) {
    dias.push({ date: new Date(current), diaSemana: current.getDay() })
    current.setDate(current.getDate() + 1)
  }
  return dias
}

function formatarData(dataStr: string) {
  const [ano, mes, dia] = dataStr.split('T')[0].split('-')
  return new Date(Number(ano), Number(mes) - 1, Number(dia)).toLocaleDateString('pt-BR')
}

function contarDiasLetivosNoIntervalo(inicio: string, termino: string, eventos: EventoCalendario[]): number {
  let count = 0
  const current = new Date(inicio)
  const end = new Date(termino)
  while (current <= end) {
    const dw = current.getDay()
    const isWeekend = dw === 0 || dw === 6
    const dStr = current.toISOString().split('T')[0]
    const ev = eventos.find(e => {
      const ei = e.data_inicio.split('T')[0]
      const et = e.data_termino.split('T')[0]
      return dStr >= ei && dStr <= et
    })
    let isLetivo = !isWeekend
    if (ev) {
      if (ev.tipo === 'nao_letivo' || ev.tipo === 'recesso') isLetivo = false
      else if (ev.tipo === 'dia_letivo') isLetivo = true
    }
    if (isLetivo) count++
    current.setDate(current.getDate() + 1)
  }
  return count
}

interface TabCalendariosProps {
  schoolId: string | null
}

export function TabCalendarios({ schoolId }: TabCalendariosProps) {
  const { isSuperAdmin, allSchools } = useAuth()
  const { pode, loaded: permLoaded } = usePermissoes(schoolId)

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)

  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([])
  const [calendarios, setCalendarios] = useState<Calendario[]>([])
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [selectedAno, setSelectedAno] = useState<AnoLetivo | null>(null)
  const [selectedCalendario, setSelectedCalendario] = useState<Calendario | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  const [showAnoModal, setShowAnoModal] = useState(false)
  const [showCalendarioModal, setShowCalendarioModal] = useState(false)
  const [showEventoModal, setShowEventoModal] = useState(false)
  const [eventoDiaUnico, setEventoDiaUnico] = useState(false)
  const [diaLetivoPadrao, setDiaLetivoPadrao] = useState(false)
  const [anoToEncerrar, setAnoToEncerrar] = useState<string | null>(null)
  const [calendarioEditId, setCalendarioEditId] = useState<string | null>(null)
  const [eventoEditId, setEventoEditId] = useState<string | null>(null)
  const [showDayModal, setShowDayModal] = useState(false)
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null)
  const [selectedDayStr, setSelectedDayStr] = useState('')

  const [showExcluirEventoDialog, setShowExcluirEventoDialog] = useState(false)
  const [eventoParaExcluir, setEventoParaExcluir] = useState<EventoCalendario | null>(null)
  const [diaEspecificoExclusao, setDiaEspecificoExclusao] = useState<string | null>(null)
  const [showExcluirCalendarioDialog, setShowExcluirCalendarioDialog] = useState(false)
  const [calendarioParaExcluir, setCalendarioParaExcluir] = useState<Calendario | null>(null)
  const [showExcluirAnoDialog, setShowExcluirAnoDialog] = useState(false)
  const [anoParaExcluir, setAnoParaExcluir] = useState<AnoLetivo | null>(null)

  const [anoForm, setAnoForm] = useState({ descricao: '', data_inicio: '', data_termino: '', status: 'planejamento' as string })
  const [calendarioForm, setCalendarioForm] = useState({ descricao: '', data_inicio: '', data_termino: '', etapas: [] as string[] })
  const [eventoForm, setEventoForm] = useState({
    descricao: '',
    tipo: 'recesso' as 'dia_letivo' | 'recesso' | 'nao_letivo' | 'periodo_avaliativo',
    data_inicio: '',
    data_termino: '',
    recorrencia_tipo: 'nao_repete' as 'nao_repete' | 'todos_dias' | 'dias_semana',
    recorrencia_dias: [] as string[]
  })

  const effectiveSchoolId = selectedSchoolId || schoolId

  useEffect(() => {
    if (isSuperAdmin && allSchools.length > 0 && !selectedSchoolId) { setLoadingData(false); return }
    if (!effectiveSchoolId) { setLoadingData(false); return }
    loadData()
  }, [effectiveSchoolId, isSuperAdmin, allSchools, selectedSchoolId])

  async function loadData() {
    if (!effectiveSchoolId) return
    setLoadingData(true)
    try {
      const anos = await getAnosLetivos(effectiveSchoolId)
      setAnosLetivos(anos)
      if (anos.length > 0) {
        setSelectedAno(anos[0])
        const cals = await getCalendarios(anos[0].id)
        setCalendarios(cals)
        if (cals.length > 0) {
          setSelectedCalendario(cals[0])
          const evts = await getEventos(cals[0].id)
          setEventos(evts)
        } else {
          setSelectedCalendario(null)
          setEventos([])
        }
      } else {
        setSelectedAno(null)
        setCalendarios([])
        setSelectedCalendario(null)
        setEventos([])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoadingData(false)
    }
  }

  async function handleCreateAno() {
    if (!effectiveSchoolId) { toast.error('Escola não selecionada'); return }
    if (!anoForm.descricao.trim()) { toast.error('O campo Descrição é obrigatório.'); return }
    if (!anoForm.data_inicio) { toast.error('O campo Início é obrigatório.'); return }
    if (!anoForm.data_termino) { toast.error('O campo Término é obrigatório.'); return }
    if (new Date(anoForm.data_termino) < new Date(anoForm.data_inicio)) { toast.error('A data de término não pode ser anterior à data de início.'); return }

    const anoEmPlanejamento = anosLetivos.find(a => a.status === 'planejamento')
    if (anoEmPlanejamento) { toast.error('Já existe um ano letivo em planejamento. Finalize ou encerre o atual antes de criar outro.'); return }

    try {
      const novo = await createAnoLetivo({
        school_id: effectiveSchoolId,
        descricao: anoForm.descricao,
        data_inicio: anoForm.data_inicio,
        data_termino: anoForm.data_termino,
        status: 'planejamento'
      })
      setAnosLetivos([novo, ...anosLetivos])
      setSelectedAno(novo)
      setCalendarios([])
      setSelectedCalendario(null)
      setEventos([])
      setShowAnoModal(false)
      setAnoForm({ descricao: '', data_inicio: '', data_termino: '', status: 'planejamento' })
      toast.success('Ano letivo criado!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao criar ano letivo.')
    }
  }

  async function handleEncerrarAno(id: string) {
    setAnoToEncerrar(id)
  }

  async function confirmEncerrarAno() {
    if (!anoToEncerrar) return
    try {
      const atualizado = await encerrarAnoLetivo(anoToEncerrar)
      setAnosLetivos(anosLetivos.map(a => a.id === anoToEncerrar ? atualizado : a))
      if (selectedAno?.id === anoToEncerrar) setSelectedAno(atualizado)
      toast.success('Ano letivo encerrado!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao encerrar ano letivo.')
    } finally {
      setAnoToEncerrar(null)
    }
  }

  async function handleAtivarAno(id: string) {
    try {
      const atualizado = await updateAnoLetivo(id, { status: 'ativo' })
      setAnosLetivos(anosLetivos.map(a => a.id === id ? atualizado : a))
      if (selectedAno?.id === id) setSelectedAno(atualizado)
      toast.success('Ano letivo ativado!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao ativar ano letivo.')
    }
  }

  async function handleReativarAno(id: string) {
    try {
      const atualizado = await updateAnoLetivo(id, { status: 'planejamento' })
      setAnosLetivos(anosLetivos.map(a => a.id === id ? atualizado : a))
      if (selectedAno?.id === id) setSelectedAno(atualizado)
      toast.success('Ano letivo reativado!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao reativar ano letivo.')
    }
  }

  function handleSelectAno(anoId: string) {
    const ano = anosLetivos.find(a => a.id === anoId) || null
    setSelectedAno(ano)
    if (ano) {
      getCalendarios(ano.id).then(cals => {
        setCalendarios(cals)
        setSelectedCalendario(null)
        setEventos([])
      })
    }
  }

  async function handleCreateCalendario() {
    if (!selectedAno) return
    if (!calendarioForm.descricao.trim()) { toast.error('O campo Descrição é obrigatório.'); return }
    if (!calendarioForm.data_inicio) { toast.error('O campo Início é obrigatório.'); return }
    if (!calendarioForm.data_termino) { toast.error('O campo Término é obrigatório.'); return }
    if (new Date(calendarioForm.data_termino) < new Date(calendarioForm.data_inicio)) { toast.error('A data de término não pode ser anterior à data de início.'); return }

    try {
      const novo = await createCalendario({
        ano_letivo_id: selectedAno.id,
        descricao: calendarioForm.descricao,
        data_inicio: calendarioForm.data_inicio,
        data_termino: calendarioForm.data_termino,
        etapas: calendarioForm.etapas
      })
      setCalendarios([...calendarios, novo])
      setSelectedCalendario(novo)
      setEventos([])
      setShowCalendarioModal(false)
      setCalendarioEditId(null)
      setCalendarioForm({ descricao: '', data_inicio: '', data_termino: '', etapas: [] })
      toast.success('Calendário criado!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao criar calendário.')
    }
  }

  async function handleUpdateCalendario() {
    if (!calendarioEditId) return
    if (!calendarioForm.descricao.trim()) { toast.error('O campo Descrição é obrigatório.'); return }
    if (!calendarioForm.data_inicio) { toast.error('O campo Início é obrigatório.'); return }
    if (!calendarioForm.data_termino) { toast.error('O campo Término é obrigatório.'); return }
    if (new Date(calendarioForm.data_termino) < new Date(calendarioForm.data_inicio)) { toast.error('A data de término não pode ser anterior à data de início.'); return }

    try {
      const atualizado = await updateCalendario(calendarioEditId, {
        descricao: calendarioForm.descricao,
        data_inicio: calendarioForm.data_inicio,
        data_termino: calendarioForm.data_termino,
        etapas: calendarioForm.etapas
      })
      setCalendarios(calendarios.map(c => c.id === calendarioEditId ? atualizado : c))
      if (selectedCalendario?.id === calendarioEditId) setSelectedCalendario(atualizado)
      const evts = await getEventos(calendarioEditId)
      setEventos(evts)
      setShowCalendarioModal(false)
      setCalendarioEditId(null)
      setCalendarioForm({ descricao: '', data_inicio: '', data_termino: '', etapas: [] })
      toast.success('Calendário atualizado!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao atualizar calendário.')
    }
  }

  function handleSelectCalendario(cal: Calendario) {
    setSelectedCalendario(cal)
    getEventos(cal.id).then(setEventos)
  }

  function openCalendarioCreate() {
    setCalendarioEditId(null)
    setCalendarioForm({ descricao: '', data_inicio: '', data_termino: '', etapas: [] })
    setShowCalendarioModal(true)
  }

  function openCalendarioEdit(cal: Calendario, e: React.MouseEvent) {
    e.stopPropagation()
    setCalendarioEditId(cal.id)
    setCalendarioForm({ descricao: cal.descricao, data_inicio: cal.data_inicio.split('T')[0], data_termino: cal.data_termino.split('T')[0], etapas: cal.etapas || [] })
    setShowCalendarioModal(true)
  }

  function handleDeleteCalendarioClick(cal: Calendario, e: React.MouseEvent) {
    e.stopPropagation()
    setCalendarioParaExcluir(cal)
    setShowExcluirCalendarioDialog(true)
  }

  async function confirmDeleteCalendario() {
    if (!calendarioParaExcluir) return
    try {
      if (selectedCalendario?.id === calendarioParaExcluir.id) { setSelectedCalendario(null); setEventos([]) }
      await deleteCalendario(calendarioParaExcluir.id)
      if (selectedAno) {
        const cals = await getCalendarios(selectedAno.id)
        setCalendarios(cals)
      }
      setShowExcluirCalendarioDialog(false)
      setCalendarioParaExcluir(null)
      toast.success('Calendário excluído!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao excluir calendário.')
    }
  }

  function handleDeleteAnoClick(ano: AnoLetivo, e: React.MouseEvent) {
    e.stopPropagation()
    setAnoParaExcluir(ano)
    setShowExcluirAnoDialog(true)
  }

  async function confirmDeleteAno() {
    if (!anoParaExcluir) return
    try {
      if (selectedAno?.id === anoParaExcluir.id) { setSelectedAno(null); setCalendarios([]); setSelectedCalendario(null); setEventos([]) }
      await deleteAnoLetivo(anoParaExcluir.id)
      const anos = await getAnosLetivos(effectiveSchoolId)
      setAnosLetivos(anos)
      setShowExcluirAnoDialog(false)
      setAnoParaExcluir(null)
      toast.success('Ano letivo excluído!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao excluir ano letivo.')
    }
  }

  function handleDayClick(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    const dataCalendarioInicio = selectedCalendario?.data_inicio ? new Date(selectedCalendario.data_inicio.split('T')[0]) : null
    const dataCalendarioFim = selectedCalendario?.data_termino ? new Date(selectedCalendario.data_termino.split('T')[0]) : null

    if (!dataCalendarioInicio || !dataCalendarioFim || date < dataCalendarioInicio || date > dataCalendarioFim) {
      toast.error(`Este dia não faz parte do Calendário Letivo — ${selectedCalendario?.descricao || 'selecionado'}`)
      return
    }

    setSelectedDayDate(date)
    setSelectedDayStr(dateStr)
    setShowDayModal(true)
  }

  function getEventosDoDia(dateStr: string): EventoCalendario[] {
    return eventos.filter(e => {
      const inicio = e.data_inicio.split('T')[0]
      const termino = e.data_termino.split('T')[0]
      return dateStr >= inicio && dateStr <= termino && e.tipo !== 'nao_letivo'
    })
  }

  function temRecessoNoDia(dateStr: string): boolean {
    return eventos.some(e => {
      const inicio = e.data_inicio.split('T')[0]
      const termino = e.data_termino.split('T')[0]
      return dateStr >= inicio && dateStr <= termino && e.tipo === 'recesso'
    })
  }

  function isDiaLetivoBase(d: Date): boolean {
    const dataInicio = selectedCalendario?.data_inicio ? new Date(selectedCalendario.data_inicio.split('T')[0]) : null
    const dataFim = selectedCalendario?.data_termino ? new Date(selectedCalendario.data_termino.split('T')[0]) : null
    if (!dataInicio || !dataFim) return false
    if (d < dataInicio || d > dataFim) return false
    const dw = d.getDay()
    if (dw === 0 || dw === 6) return false
    return true
  }

  function temNaoLetivoNoDia(dateStr: string): boolean {
    return eventos.some(e => {
      const inicio = e.data_inicio.split('T')[0]
      const termino = e.data_termino.split('T')[0]
      return dateStr >= inicio && dateStr <= termino && e.tipo === 'nao_letivo'
    })
  }

  function openEventoEditFromDay(evento: EventoCalendario) {
    setShowDayModal(false)
    setEventoEditId(evento.id)
    setEventoForm({
      descricao: evento.descricao,
      tipo: evento.tipo,
      data_inicio: evento.data_inicio.split('T')[0],
      data_termino: evento.data_termino.split('T')[0],
      recorrencia_tipo: evento.recorrencia_tipo,
      recorrencia_dias: evento.recorrencia_dias
    })
    setEventoDiaUnico(false)
    setDiaLetivoPadrao(false)
    setShowEventoModal(true)
  }

  function openDeleteFromDay(evento: EventoCalendario) {
    const inicioD = evento.data_inicio.split('T')[0]
    const terminoD = evento.data_termino.split('T')[0]
    const isIntervalo = inicioD !== terminoD
    setEventoParaExcluir(evento)
    setDiaEspecificoExclusao(isIntervalo ? selectedDayStr : null)
    setShowDayModal(false)
    setShowExcluirEventoDialog(true)
  }

  function openNewEventoFromDay() {
    if (!selectedDayStr) return
    setShowDayModal(false)
    setEventoDiaUnico(true)
    setDiaLetivoPadrao(false)
    setEventoForm({ descricao: '', tipo: 'recesso', data_inicio: selectedDayStr, data_termino: selectedDayStr, recorrencia_tipo: 'nao_repete', recorrencia_dias: [] })
    setEventoEditId(null)
    setShowEventoModal(true)
  }

  async function handleExcluirEvento() {
    if (!eventoParaExcluir) return
    try {
      if (diaEspecificoExclusao && eventoParaExcluir) {
        const inicio = eventoParaExcluir.data_inicio.split('T')[0]
        const termino = eventoParaExcluir.data_termino.split('T')[0]
        if (inicio === termino) {
          await deleteEvento(eventoParaExcluir.id)
        } else {
          const diaExcluir = diaEspecificoExclusao
          if (diaExcluir === inicio) {
            const novoInicio = new Date(diaExcluir); novoInicio.setDate(novoInicio.getDate() + 1)
            await updateEvento(eventoParaExcluir.id, { data_inicio: novoInicio.toISOString().split('T')[0] })
          } else if (diaExcluir === termino) {
            const novoTermino = new Date(diaExcluir); novoTermino.setDate(novoTermino.getDate() - 1)
            await updateEvento(eventoParaExcluir.id, { data_termino: novoTermino.toISOString().split('T')[0] })
          } else {
            const novoTermino = new Date(diaExcluir); novoTermino.setDate(novoTermino.getDate() - 1)
            await updateEvento(eventoParaExcluir.id, { data_termino: novoTermino.toISOString().split('T')[0] })
            const novoInicio = new Date(diaExcluir); novoInicio.setDate(novoInicio.getDate() + 1)
            await createEvento({
              calendario_id: eventoParaExcluir.calendario_id, descricao: eventoParaExcluir.descricao,
              tipo: eventoParaExcluir.tipo, data_inicio: novoInicio.toISOString().split('T')[0], data_termino: termino,
              etapas: eventoParaExcluir.etapas, recorrencia_tipo: eventoParaExcluir.recorrencia_tipo, recorrencia_dias: eventoParaExcluir.recorrencia_dias
            })
          }
        }
      } else {
        await deleteEvento(eventoParaExcluir!.id)
      }
      const evts = await getEventos(selectedCalendario!.id)
      setEventos(evts)
      setShowExcluirEventoDialog(false)
      setEventoParaExcluir(null)
      setDiaEspecificoExclusao(null)
      toast.success('Evento excluído!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao excluir evento.')
    }
  }

  async function handleExcluirDiaLetivo() {
    if (!selectedCalendario || !eventoForm.data_inicio) return
    try {
      await createEvento({
        calendario_id: selectedCalendario.id, descricao: 'Dia não letivo', tipo: 'nao_letivo',
        data_inicio: eventoForm.data_inicio, data_termino: eventoForm.data_termino,
        etapas: [], recorrencia_tipo: 'nao_repete', recorrencia_dias: []
      })
      const evts = await getEventos(selectedCalendario.id)
      setEventos(evts)
      setShowEventoModal(false)
      setEventoForm({ descricao: '', tipo: 'recesso', data_inicio: '', data_termino: '', recorrencia_tipo: 'nao_repete', recorrencia_dias: [] })
      setDiaLetivoPadrao(false)
      toast.success('Dia letivo removido!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao excluir dia letivo.')
    }
  }

  async function handleCreateEvento() {
    if (!selectedCalendario) return
    if (!eventoForm.descricao.trim()) { toast.error('O campo Descrição é obrigatório.'); return }
    if (!eventoForm.data_inicio) { toast.error('O campo Início é obrigatório.'); return }
    if (!eventoForm.data_termino) { toast.error('O campo Término é obrigatório.'); return }
    if (new Date(eventoForm.data_termino) < new Date(eventoForm.data_inicio)) { toast.error('A data de término não pode ser anterior à data de início.'); return }

    try {
      await createEvento({
        calendario_id: selectedCalendario.id, descricao: eventoForm.descricao, tipo: eventoForm.tipo,
        data_inicio: eventoForm.data_inicio, data_termino: eventoForm.data_termino,
        etapas: [], recorrencia_tipo: eventoForm.recorrencia_tipo, recorrencia_dias: eventoForm.recorrencia_dias
      })
      const evts = await getEventos(selectedCalendario.id)
      setEventos(evts)
      setShowEventoModal(false)
      setEventoForm({ descricao: '', tipo: 'recesso', data_inicio: '', data_termino: '', recorrencia_tipo: 'nao_repete', recorrencia_dias: [] })
      setEventoDiaUnico(false)
      setDiaLetivoPadrao(false)
      toast.success('Evento criado!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao criar evento.')
    }
  }

  async function handleUpdateEvento() {
    if (!eventoEditId) return
    if (!eventoForm.descricao.trim()) { toast.error('O campo Descrição é obrigatório.'); return }
    if (!eventoForm.data_inicio) { toast.error('O campo Início é obrigatório.'); return }
    if (!eventoForm.data_termino) { toast.error('O campo Término é obrigatório.'); return }
    if (new Date(eventoForm.data_termino) < new Date(eventoForm.data_inicio)) { toast.error('A data de término não pode ser anterior à data de início.'); return }

    try {
      await updateEvento(eventoEditId, {
        descricao: eventoForm.descricao,
        tipo: eventoForm.tipo,
        data_inicio: eventoForm.data_inicio,
        data_termino: eventoForm.data_termino,
        recorrencia_tipo: eventoForm.recorrencia_tipo,
        recorrencia_dias: eventoForm.recorrencia_dias
      })
      if (selectedCalendario) {
        const evts = await getEventos(selectedCalendario.id)
        setEventos(evts)
      }
      setShowEventoModal(false)
      setEventoEditId(null)
      setEventoForm({ descricao: '', tipo: 'recesso', data_inicio: '', data_termino: '', recorrencia_tipo: 'nao_repete', recorrencia_dias: [] })
      setEventoDiaUnico(false)
      setDiaLetivoPadrao(false)
      toast.success('Evento atualizado!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao atualizar evento.')
    }
  }

  function renderCalendarGrid() {
    if (!selectedCalendario) return null

    const dias = gerarDiasCalendario(selectedCalendario.data_inicio, selectedCalendario.data_termino)
    const meses = getDiasLetivosPorMes(dias, eventos)
    const monthKeys = Object.keys(meses).sort()

    return (
      <div className="mt-4">
        <div className="mb-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-success rounded-sm" /><span className="text-muted-foreground">Dia Letivo</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-muted rounded-sm" /><span className="text-muted-foreground">Não Letivo</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-destructive rounded-sm" /><span className="text-muted-foreground">Recesso</span></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {monthKeys.map((monthKey) => {
            const [year, month] = monthKey.split('-').map(Number)
            const mesData = meses[monthKey]
            if (!mesData) return null

            const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
            const daysInMonth = new Date(year, month, 0).getDate()

            const daysArray = []
            for (let i = 0; i < firstDayOfMonth; i++) {
              daysArray.push(<div key={`empty-${i}`} className="h-7" />)
            }
            for (let i = 1; i <= daysInMonth; i++) {
              const dayData = mesData.dias.find(d => d.date.getDate() === i)
              const dayDate = new Date(year, month - 1, i)
              const tipo = dayData?.isRecesso ? 'recesso' : dayData?.isLetivo ? 'letivo' : 'nao_letivo'
              daysArray.push(
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDayClick(dayDate)}
                  className={`h-7 text-xs rounded-sm font-medium transition-colors cursor-pointer hover:opacity-80 ${
                    tipo === 'recesso' ? 'bg-destructive text-primary-foreground' :
                    tipo === 'letivo' ? 'bg-success text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  {i}
                </button>
              )
            }

            return (
              <Card key={monthKey} className="shadow-sm">
                <CardHeader className="pb-2 pt-3 px-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {monthNames[month - 1]}
                  </CardTitle>
                  <StatusBadge status="info">
                    {mesData.totalLetivos} dias letivos
                  </StatusBadge>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  <div className="grid grid-cols-7 gap-0.5 text-[10px] text-center text-muted-foreground mb-1">
                    <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                  </div>
                  <div className="grid grid-cols-7 gap-0.5">
                    {daysArray}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  function renderPeriodosKpis() {
    if (!selectedCalendario) return null
    const periodos = eventos.filter(e => e.tipo === 'periodo_avaliativo').sort((a, b) => a.data_inicio.localeCompare(b.data_inicio))
    if (periodos.length === 0) return null

    function openEditPeriodo(p: EventoCalendario) {
      setEventoEditId(p.id)
      setEventoForm({
        descricao: p.descricao,
        tipo: p.tipo,
        data_inicio: p.data_inicio.split('T')[0],
        data_termino: p.data_termino.split('T')[0],
        recorrencia_tipo: p.recorrencia_tipo,
        recorrencia_dias: p.recorrencia_dias
      })
      setEventoDiaUnico(false)
      setDiaLetivoPadrao(false)
      setShowEventoModal(true)
    }

    function deletePeriodo(p: EventoCalendario) {
      setEventoParaExcluir(p)
      setDiaEspecificoExclusao(null)
      setShowExcluirEventoDialog(true)
    }

    return (
      <div className="mt-6">
        <div className="text-[14px] font-medium text-foreground mb-3">Períodos Avaliativos</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {periodos.map((p, i) => {
            const diasLetivos = contarDiasLetivosNoIntervalo(p.data_inicio, p.data_termino, eventos)
            return (
              <Card key={p.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">{p.descricao || `Período ${i + 1}`}</div>
                      <div className="text-xl font-bold text-foreground">{diasLetivos}</div>
                      <div className="text-xs text-muted-foreground">dias letivos</div>
                      <div className="mt-2 text-[11px] text-muted-foreground">
                        {formatarData(p.data_inicio)} → {formatarData(p.data_termino)}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 ml-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditPeriodo(p)} title="Editar período">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => deletePeriodo(p)} title="Excluir período">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (loadingData || !permLoaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!pode.visualizar('gestao-academica.estrutura-academica.calendarios')) {
    return (
      <EmptyState icon={ShieldAlert} title="Sem permissão" description="Você não tem permissão para acessar Calendários." />
    )
  }

  return (
    <>
      {/* School Filter (superadmin) */}
      {isSuperAdmin && allSchools.length > 0 && (
        <div className="mb-6">
          <Label className="text-xs text-muted-foreground mb-1 block">Escola</Label>
          <Select value={selectedSchoolId ?? ''} onValueChange={(v) => { setSelectedSchoolId(v); setSelectedAno(null); setCalendarios([]); setSelectedCalendario(null); setEventos([]) }}>
            <SelectTrigger className="w-full max-w-md border-border">
              <SelectValue placeholder="Selecione uma Escola" />
            </SelectTrigger>
            <SelectContent>
              {allSchools.map((s: any) => (
                <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isSuperAdmin && !selectedSchoolId ? (
        <EmptyState icon={Calendar} title="Selecione uma Escola" description="Escolha uma escola para gerenciar os calendários." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Anos Letivos */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-[16px] font-semibold text-foreground">Anos Letivos</CardTitle>
              <Button size="lg" onClick={() => setShowAnoModal(true)}>
                <Plus className="h-4 w-4 mr-2" />Novo Ano Letivo
              </Button>
            </CardHeader>
            <CardContent>
              {anosLetivos.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Selecionar ano</Label>
                    <Select value={selectedAno?.id ?? ''} onValueChange={handleSelectAno}>
                      <SelectTrigger className="w-full border-border">
                        <SelectValue placeholder="Selecione um ano letivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {anosLetivos.map(ano => (
                          <SelectItem key={ano.id} value={ano.id}>
                            {ano.descricao} — {ano.status === 'ativo' ? 'Ativo' : ano.status === 'planejamento' ? 'Em Planejamento' : 'Encerrado'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedAno && (
                    <div className="p-4 rounded-lg border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{selectedAno.descricao}</span>
                        <StatusBadge status={selectedAno.status === 'ativo' ? 'success' : selectedAno.status === 'planejamento' ? 'warning' : 'muted'}>
                          {selectedAno.status === 'ativo' ? 'Ativo' : selectedAno.status === 'planejamento' ? 'Em Planejamento' : 'Encerrado'}
                        </StatusBadge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatarData(selectedAno.data_inicio)} — {formatarData(selectedAno.data_termino)}
                      </div>

                      <div className="flex gap-2 pt-1">
                        {(selectedAno.status === 'planejamento' || selectedAno.status === 'ativo') && (
                          <>
                            {selectedAno.status === 'planejamento' && (
                              <Button size="sm" className="flex-1" onClick={() => handleAtivarAno(selectedAno.id)}>Ativar</Button>
                            )}
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEncerrarAno(selectedAno.id)}>Encerrar</Button>
                          </>
                        )}
                        {selectedAno.status === 'encerrado' && (
                          <Button size="sm" className="flex-1" onClick={() => handleReativarAno(selectedAno.id)}>Reativar Ano</Button>
                        )}
                        <Button variant="ghost" size="icon-sm" onClick={(e) => handleDeleteAnoClick(selectedAno, e)} title="Excluir">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4 text-sm">Nenhum ano letivo cadastrado</p>
              )}
            </CardContent>
          </Card>

          {/* Card: Calendários */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-[16px] font-semibold text-foreground">Calendários</CardTitle>
              <Button size="lg" disabled={!selectedAno} onClick={openCalendarioCreate}>
                <Plus className="h-4 w-4 mr-2" />Novo Calendário
              </Button>
            </CardHeader>
            <CardContent>
              {selectedAno ? (
                calendarios.length > 0 ? (
                  <div className="space-y-2">
                    {calendarios.map(cal => (
                      <div
                        key={cal.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedCalendario?.id === cal.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                        onClick={() => handleSelectCalendario(cal)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{cal.descricao}</p>
                            <p className="text-xs text-muted-foreground">{formatarData(cal.data_inicio)} - {formatarData(cal.data_termino)}</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Button variant="ghost" size="icon-sm" onClick={(e) => openCalendarioEdit(cal, e)} title="Editar">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={(e) => handleDeleteCalendarioClick(cal, e)} title="Excluir">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4 text-sm">Nenhum calendário cadastrado</p>
                )
              ) : (
                <p className="text-muted-foreground text-center py-4 text-sm">Selecione um ano letivo primeiro</p>
              )}
            </CardContent>
          </Card>

          {/* Card: Visualização */}
          <Card className="shadow-sm md:col-span-2">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-[16px] font-semibold text-foreground">
                Visualização{selectedAno ? ` — ${selectedAno.descricao}` : ''}
              </CardTitle>
              <div className="flex items-center gap-3">
                {selectedCalendario && (
                  <StatusBadge status="info">
                    {(() => {
                      const dias = gerarDiasCalendario(selectedCalendario.data_inicio, selectedCalendario.data_termino)
                      const meses = getDiasLetivosPorMes(dias, eventos)
                      const total = Object.values(meses).reduce((sum, m) => sum + m.totalLetivos, 0)
                      return `${total} dias letivos`
                    })()}
                  </StatusBadge>
                )}
                <Button
                size="lg"
                disabled={!selectedCalendario}
                onClick={() => { setEventoDiaUnico(false); setDiaLetivoPadrao(false); setEventoEditId(null); setEventoForm({ descricao: '', tipo: 'recesso', data_inicio: '', data_termino: '', recorrencia_tipo: 'nao_repete', recorrencia_dias: [] }); setShowEventoModal(true) }}
              >
                <Plus className="h-4 w-4 mr-2" />Novo Evento
              </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedCalendario ? (
                <>
                  {renderCalendarGrid()}
                  {renderPeriodosKpis()}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Selecione um calendário para visualizar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: Ano Letivo */}
      <Dialog open={showAnoModal} onOpenChange={setShowAnoModal}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Novo Ano Letivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label className="text-foreground font-medium block mb-2">Descrição <span className="text-destructive">*</span></Label>
              <Input className="border-border" placeholder="Ex: 2026" value={anoForm.descricao} onChange={e => setAnoForm({ ...anoForm, descricao: e.target.value })} required />
            </div>
            <div>
              <Label className="text-foreground font-medium block mb-2">Situação <span className="text-destructive">*</span></Label>
              <Select value={anoForm.status || ""} onValueChange={(v) => setAnoForm({ ...anoForm, status: v })}>
                <SelectTrigger className="border-border w-full"><SelectValue placeholder="Selecione uma situação" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DatePickerDual
              labelInicio="Início" labelTermino="Término"
              valorInicio={anoForm.data_inicio} valorTermino={anoForm.data_termino}
              onChangeInicio={(v) => setAnoForm({ ...anoForm, data_inicio: v })}
              onChangeTermino={(v) => setAnoForm({ ...anoForm, data_termino: v })}
              required
            />
          </div>
          <DialogFooter className="shrink-0 border-t border-border px-6 py-3 gap-2 bg-muted/30">
            <Button variant="outline" onClick={() => setShowAnoModal(false)} className="min-h-[40px] sm:min-h-[44px]">Cancelar</Button>
            <Button onClick={handleCreateAno} className="min-h-[40px] sm:min-h-[44px]">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Calendário (criar/editar) */}
      <Dialog open={showCalendarioModal} onOpenChange={(open) => { setShowCalendarioModal(open); if (!open) setCalendarioEditId(null) }}>
        <DialogContent className="max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{calendarioEditId ? 'Editar Calendário' : 'Novo Calendário'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label className="text-foreground font-medium block mb-2">Descrição <span className="text-destructive">*</span></Label>
              <Input className="border-border" placeholder="Ex: Calendário Ensino Fundamental" value={calendarioForm.descricao} onChange={e => setCalendarioForm({ ...calendarioForm, descricao: e.target.value })} required />
            </div>
            <DatePickerDual
              labelInicio="Início" labelTermino="Término"
              valorInicio={calendarioForm.data_inicio} valorTermino={calendarioForm.data_termino}
              onChangeInicio={(v) => setCalendarioForm({ ...calendarioForm, data_inicio: v })}
              onChangeTermino={(v) => setCalendarioForm({ ...calendarioForm, data_termino: v })}
            />
          </div>
          <DialogFooter className="shrink-0 border-t border-border px-6 py-3 gap-2 bg-muted/30">
            <Button variant="outline" onClick={() => { setShowCalendarioModal(false); setCalendarioEditId(null) }} className="min-h-[40px] sm:min-h-[44px]">Cancelar</Button>
            <Button onClick={calendarioEditId ? handleUpdateCalendario : handleCreateCalendario} className="min-h-[40px] sm:min-h-[44px]">
              {calendarioEditId ? 'Salvar Alterações' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Evento */}
      <Dialog open={showEventoModal} onOpenChange={(open) => { setShowEventoModal(open); if (!open) { setEventoDiaUnico(false); setDiaLetivoPadrao(false); setEventoEditId(null) } }}>
        <DialogContent className="max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{diaLetivoPadrao ? 'Excluir Dia Letivo' : eventoEditId ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
          </DialogHeader>
          {diaLetivoPadrao ? (
            <div className="text-center py-4">
              <p className="text-[15px] text-foreground">
                Deseja excluir o dia letivo{' '}
                <strong>{eventoForm.data_inicio ? formatarData(eventoForm.data_inicio) : ''}</strong>?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Isso marcará o dia como <strong>não letivo</strong>.
              </p>
            </div>
          ) : (
          <div className="space-y-5">
            <div>
              <Label className="text-foreground font-medium block mb-2">Descrição <span className="text-destructive">*</span></Label>
              <Input className="border-border" placeholder="Ex: Feriado de Páscoa" value={eventoForm.descricao} onChange={e => setEventoForm({ ...eventoForm, descricao: e.target.value })} required />
            </div>
            <div>
              <Label className="text-foreground font-medium block mb-2">Tipo</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {[
                  { value: 'recesso', label: 'Recesso' },
                  { value: 'dia_letivo', label: 'Dia Letivo' },
                  { value: 'periodo_avaliativo', label: 'Período Avaliativo' },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      value={opt.value}
                      checked={eventoForm.tipo === opt.value}
                      onChange={() => setEventoForm({ ...eventoForm, tipo: opt.value as any })}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <DatePickerDual
              labelInicio="Início" labelTermino="Término"
              valorInicio={eventoForm.data_inicio} valorTermino={eventoForm.data_termino}
              onChangeInicio={(v) => setEventoForm({ ...eventoForm, data_inicio: v })}
              onChangeTermino={(v) => setEventoForm({ ...eventoForm, data_termino: v })}
              disabled={eventoDiaUnico}
            />
          </div>
          )}
          <DialogFooter className="shrink-0 border-t border-border px-6 py-3 gap-2 bg-muted/30">
            {diaLetivoPadrao ? (
              <>
                <Button variant="destructive" onClick={handleExcluirDiaLetivo} className="mr-auto">Sim, excluir dia letivo</Button>
                <Button variant="outline" onClick={() => { setShowEventoModal(false); setDiaLetivoPadrao(false) }} className="min-h-[40px] sm:min-h-[44px]">Cancelar</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => { setShowEventoModal(false); setEventoDiaUnico(false); setDiaLetivoPadrao(false); setEventoEditId(null) }} className="min-h-[40px] sm:min-h-[44px]">Cancelar</Button>
                <Button onClick={eventoEditId ? handleUpdateEvento : handleCreateEvento} className="min-h-[40px] sm:min-h-[44px]">
                  {eventoEditId ? 'Salvar Alterações' : 'Salvar'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Eventos do Dia */}
      <Dialog open={showDayModal} onOpenChange={setShowDayModal}>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedDayDate ? selectedDayDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(() => {
              const eventosDoDia = selectedDayStr ? getEventosDoDia(selectedDayStr) : []
              const diaLetivoBase = selectedDayDate && isDiaLetivoBase(selectedDayDate) && !temNaoLetivoNoDia(selectedDayStr) && !temRecessoNoDia(selectedDayStr)
              const totalItems = (diaLetivoBase ? 1 : 0) + eventosDoDia.length

              if (totalItems === 0) {
                return (
                  <div className="text-center py-6">
                    <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-1">Nenhum evento para este dia</p>
                    <p className="text-xs text-muted-foreground">Dia não letivo</p>
                  </div>
                )
              }

              return (
                <>
                  {diaLetivoBase && (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <StatusBadge status="success">Dia Letivo</StatusBadge>
                        <span className="text-sm text-muted-foreground">Padrão (sem eventos especiais)</span>
                      </div>
                      <Button variant="ghost" size="icon-sm"
                        onClick={() => {
                          setShowDayModal(false)
                          setEventoForm({ descricao: '', tipo: 'recesso', data_inicio: selectedDayStr, data_termino: selectedDayStr, recorrencia_tipo: 'nao_repete', recorrencia_dias: [] })
                          setDiaLetivoPadrao(true)
                          setEventoEditId(null)
                          setEventoDiaUnico(true)
                          setShowEventoModal(true)
                        }}
                        title="Excluir dia letivo">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                  {eventosDoDia.map(ev => {
                    const tipoLabel = ev.tipo === 'recesso' ? 'Recesso' : ev.tipo === 'dia_letivo' ? 'Dia Letivo' : ev.tipo === 'periodo_avaliativo' ? 'Período Avaliativo' : ev.tipo
                    const tipoColor = ev.tipo === 'recesso' ? 'destructive' : ev.tipo === 'periodo_avaliativo' ? 'info' : 'success'
                    const isIntervalo = ev.data_inicio.split('T')[0] !== ev.data_termino.split('T')[0]
                    return (
                      <div key={ev.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <StatusBadge status={tipoColor as any}>{tipoLabel}</StatusBadge>
                            <span className="font-medium text-foreground text-sm truncate">{ev.descricao}</span>
                          </div>
                          {isIntervalo && (
                            <p className="text-xs text-muted-foreground">
                              {formatarData(ev.data_inicio)} → {formatarData(ev.data_termino)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 ml-2 shrink-0">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEventoEditFromDay(ev)} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => openDeleteFromDay(ev)} title="Excluir">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </>
              )
            })()}
          </div>
          <DialogFooter className="mt-4 gap-3">
            <Button variant="ghost" onClick={() => setShowDayModal(false)}>Fechar</Button>
            <Button onClick={openNewEventoFromDay}>
              <Plus className="h-4 w-4 mr-1.5" />Novo Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={!!anoToEncerrar}
        onOpenChange={(open) => { if (!open) setAnoToEncerrar(null) }}
        title="Encerrar Ano Letivo?"
        description="Esta ação não pode ser desfeita. O ano letivo será encerrado e não poderá mais ser alterado."
        confirmLabel="Sim, Encerrar"
        variant="destructive"
        onConfirm={confirmEncerrarAno}
      />

      <ConfirmDialog
        open={showExcluirAnoDialog}
        onOpenChange={(open) => { if (!open) { setShowExcluirAnoDialog(false); setAnoParaExcluir(null) } }}
        title="Excluir Ano Letivo"
        description={`Tem certeza que deseja excluir "${anoParaExcluir?.descricao}"? Todos os calendários e eventos deste ano também serão excluídos.`}
        confirmLabel="Sim, Excluir"
        variant="destructive"
        onConfirm={confirmDeleteAno}
      />

      <ConfirmDialog
        open={showExcluirCalendarioDialog}
        onOpenChange={(open) => { if (!open) { setShowExcluirCalendarioDialog(false); setCalendarioParaExcluir(null) } }}
        title="Excluir Calendário"
        description={`Tem certeza que deseja excluir "${calendarioParaExcluir?.descricao}"? Todos os eventos deste calendário também serão excluídos.`}
        confirmLabel="Sim, Excluir"
        variant="destructive"
        onConfirm={confirmDeleteCalendario}
      />

      <ConfirmDialog
        open={showExcluirEventoDialog}
        onOpenChange={(open) => { if (!open) { setShowExcluirEventoDialog(false); setEventoParaExcluir(null); setDiaEspecificoExclusao(null) } }}
        title="Excluir Evento"
        description={
          diaEspecificoExclusao
            ? `O evento "${eventoParaExcluir?.descricao}" abrange o período de ${eventoParaExcluir ? formatarData(eventoParaExcluir.data_inicio) : ''} a ${eventoParaExcluir ? formatarData(eventoParaExcluir.data_termino) : ''}. Remover apenas o dia ${formatarData(diaEspecificoExclusao)}?`
            : `Tem certeza que deseja excluir o evento "${eventoParaExcluir?.descricao}"?`
        }
        confirmLabel="Sim, Excluir"
        variant="destructive"
        onConfirm={handleExcluirEvento}
      />
    </>
  )
}
