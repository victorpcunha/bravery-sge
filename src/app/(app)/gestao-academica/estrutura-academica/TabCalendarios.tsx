'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePickerDual } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { Plus, Trash2, Calendar } from 'lucide-react'
import { 
  getAnosLetivos, 
  createAnoLetivo, 
  updateAnoLetivo, 
  deleteAnoLetivo, 
  encerrarAnoLetivo,
  getCalendarios,
  createCalendario,
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

const statusLabels = {
  ativo: 'Ativo',
  planejamento: 'Em Planejamento',
  encerramento: 'Encerrado'
}

const statusColors = {
  ativo: 'bg-green-100 text-green-700',
  planejamento: 'bg-amber-100 text-amber-700',
  encerramento: 'bg-gray-100 text-gray-700'
}

interface TabCalendariosProps {
  schoolId: string
}

function gerarDiasCalendario(inicio: string, termino: string) {
  const dias = []
  const current = new Date(inicio)
  const end = new Date(termino)
  
  while (current <= end) {
    dias.push({
      date: new Date(current),
      diaSemana: current.getDay()
    })
    current.setDate(current.getDate() + 1)
  }
  
  return dias
}

function getMesesDoPeriodo(inicio: string, termino: string): string[] {
  const meses: string[] = []
  const current = new Date(inicio)
  const end = new Date(termino)
  
  while (current <= end) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
    if (!meses.includes(key)) {
      meses.push(key)
    }
    current.setMonth(current.getMonth() + 1)
  }
  
  return meses
}

export function TabCalendarios({ schoolId }: TabCalendariosProps) {
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([])
  const [calendarios, setCalendarios] = useState<Calendario[]>([])
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [selectedAno, setSelectedAno] = useState<AnoLetivo | null>(null)
  const [selectedCalendario, setSelectedCalendario] = useState<Calendario | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  
  // Modals
  const [showAnoModal, setShowAnoModal] = useState(false)
  const [showCalendarioModal, setShowCalendarioModal] = useState(false)
  const [showEventoModal, setShowEventoModal] = useState(false)
  const [anoToEncerrar, setAnoToEncerrar] = useState<string | null>(null)
  const [eventoDiaUnico, setEventoDiaUnico] = useState(false)
  const [showExcluirEventoDialog, setShowExcluirEventoDialog] = useState(false)
  const [eventoParaExcluir, setEventoParaExcluir] = useState<EventoCalendario | null>(null)
  const [diaEspecificoExclusao, setDiaEspecificoExclusao] = useState<string | null>(null)
  const [diaLetivoPadrao, setDiaLetivoPadrao] = useState(false)
  const [showExcluirCalendarioDialog, setShowExcluirCalendarioDialog] = useState(false)
  const [calendarioParaExcluir, setCalendarioParaExcluir] = useState<Calendario | null>(null)
  const [showExcluirAnoDialog, setShowExcluirAnoDialog] = useState(false)
  const [anoParaExcluir, setAnoParaExcluir] = useState<AnoLetivo | null>(null)
  
  // Form data
  const [anoForm, setAnoForm] = useState({ descricao: '', data_inicio: '', data_termino: '', status: 'planejamento' as string })
  const [calendarioForm, setCalendarioForm] = useState({ descricao: '', data_inicio: '', data_termino: '', etapas: [] as string[] })
  const [eventoForm, setEventoForm] = useState({ 
    descricao: '', 
    tipo: 'recesso' as 'dia_letivo' | 'recesso' | 'nao_letivo',
    data_inicio: '', 
    data_termino: '',
    recorrencia_tipo: 'nao_repete' as 'nao_repete' | 'todos_dias' | 'dias_semana',
    recorrencia_dias: [] as string[]
  })

  // Carregar dados
  useState(() => {
    loadData()
  })

  async function loadData() {
    setLoadingData(true)
    try {
      const anos = await getAnosLetivos(schoolId)
      setAnosLetivos(anos)
      
      if (anos.length > 0) {
        setSelectedAno(anos[0])
        const cals = await getCalendarios(anos[0].id)
        setCalendarios(cals)
        
        if (cals.length > 0) {
          setSelectedCalendario(cals[0])
          const evts = await getEventos(cals[0].id)
          setEventos(evts)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoadingData(false)
    }
  }

  // Funções de Ano Letivo
  async function handleCreateAno() {
    if (!anoForm.descricao.trim()) {
      toast.error('O campo Descrição é obrigatório.')
      return
    }
    if (!anoForm.data_inicio) {
      toast.error('O campo Início é obrigatório.')
      return
    }
    if (!anoForm.data_termino) {
      toast.error('O campo Término é obrigatório.')
      return
    }
    
    if (new Date(anoForm.data_termino) < new Date(anoForm.data_inicio)) {
      toast.error('A data de término não pode ser anterior à data de início.')
      return
    }
    
    // Verificar se já existe ano letivo em planejamento
    const anoEmPlanejamento = anosLetivos.find(a => a.status === 'planejamento')
    if (anoEmPlanejamento) {
      toast.error('Já existe um ano letivo em planejamento. Finalize ou encerre o atual antes de criar outro.')
      return
    }
    
    try {
      const novo = await createAnoLetivo({
        school_id: schoolId,
        descricao: anoForm.descricao,
        data_inicio: anoForm.data_inicio,
        data_termino: anoForm.data_termino,
        status: 'planejamento'
      })
      setAnosLetivos([novo, ...anosLetivos])
      setSelectedAno(novo)
      setCalendarios([])
      setShowAnoModal(false)
      setAnoForm({ descricao: '', data_inicio: '', data_termino: '', status: 'planejamento' })
      toast.success('Ano letivo criado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao criar ano letivo:', error?.message || error)
      toast.error(error?.message || 'Erro ao criar ano letivo. Verifique se os dados estão corretos.')
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
      if (selectedAno?.id === anoToEncerrar) {
        setSelectedAno(atualizado)
      }
      toast.success('Ano letivo encerrado com sucesso!')
      setAnoToEncerrar(null)
    } catch (error: any) {
      console.error('Erro ao encerrar ano letivo:', error)
      toast.error(error?.message || 'Erro ao encerrar ano letivo.')
      setAnoToEncerrar(null)
    }
  }

  async function handleAtivarAno(id: string) {
    try {
      const atualizado = await updateAnoLetivo(id, { status: 'ativo' })
      setAnosLetivos(anosLetivos.map(a => a.id === id ? atualizado : a))
      if (selectedAno?.id === id) {
        setSelectedAno(atualizado)
      }
      toast.success('Ano letivo ativado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao ativar ano letivo:', error)
      toast.error(error?.message || 'Erro ao ativar ano letivo.')
    }
  }

  async function handleReativarAno(id: string) {
    try {
      const atualizado = await updateAnoLetivo(id, { status: 'planejamento' })
      setAnosLetivos(anosLetivos.map(a => a.id === id ? atualizado : a))
      if (selectedAno?.id === id) {
        setSelectedAno(atualizado)
      }
      toast.success('Ano letivo reativado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao reativar ano letivo:', error)
      toast.error(error?.message || 'Erro ao reativar ano letivo.')
    }
  }

  function handleSelectAno(ano: AnoLetivo) {
    setSelectedAno(ano)
    getCalendarios(ano.id).then(cals => {
      setCalendarios(cals)
      setSelectedCalendario(null)
      setEventos([])
    })
  }

  // Funções de Calendário
  async function handleCreateCalendario() {
    if (!selectedAno) return
    
    if (!calendarioForm.descricao.trim()) {
      toast.error('O campo Descrição é obrigatório.')
      return
    }
    if (!calendarioForm.data_inicio) {
      toast.error('O campo Início é obrigatório.')
      return
    }
    if (!calendarioForm.data_termino) {
      toast.error('O campo Término é obrigatório.')
      return
    }
    
    if (new Date(calendarioForm.data_termino) < new Date(calendarioForm.data_inicio)) {
      toast.error('A data de término não pode ser anterior à data de início.')
      return
    }
    
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
      setCalendarioForm({ descricao: '', data_inicio: '', data_termino: '', etapas: [] })
      toast.success('Calendário criado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao criar calendário:', error?.message || error)
      toast.error(error?.message || 'Erro ao criar calendário. Verifique se os dados estão corretos.')
    }
  }

  // Função para formatar data corretamente (evita problemas de timezone)
  function formatarData(dataStr: string) {
    const [ano, mes, dia] = dataStr.split('T')[0].split('-')
    return new Date(Number(ano), Number(mes) - 1, Number(dia)).toLocaleDateString('pt-BR')
  }

  async function handleSelectCalendario(cal: Calendario) {
    setSelectedCalendario(cal)
    const evts = await getEventos(cal.id)
    setEventos(evts)
  }

  function handleDeleteCalendarioClick(cal: Calendario, e: React.MouseEvent) {
    e.stopPropagation()
    setCalendarioParaExcluir(cal)
    setShowExcluirCalendarioDialog(true)
  }

  async function confirmDeleteCalendario() {
    if (!calendarioParaExcluir) return
    
    try {
      // Se o calendário sendo excluído é o selecionado, limpar seleção
      if (selectedCalendario?.id === calendarioParaExcluir.id) {
        setSelectedCalendario(null)
        setEventos([])
      }
      
      await deleteCalendario(calendarioParaExcluir.id)
      const anoId = selectedAno?.id
      if (anoId) {
        const cals = await getCalendarios(anoId)
        setCalendarios(cals)
      }
      setShowExcluirCalendarioDialog(false)
      setCalendarioParaExcluir(null)
      toast.success('Calendário excluído com sucesso!')
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
      // Se o ano sendo excluído é o selecionado, limpar seleção
      if (selectedAno?.id === anoParaExcluir.id) {
        setSelectedAno(null)
        setCalendarios([])
        setSelectedCalendario(null)
        setEventos([])
      }
      
      await deleteAnoLetivo(anoParaExcluir.id)
      const anos = await getAnosLetivos(schoolId)
      setAnosLetivos(anos)
      setShowExcluirAnoDialog(false)
      setAnoParaExcluir(null)
      toast.success('Ano letivo excluído com sucesso!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao excluir ano letivo.')
    }
  }

  // Funções de Evento
  function handleDayClick(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
    // Verificar se já existe evento neste dia (dia_letivo, recesso ou nao_letivo)
    const eventoExistente = eventos.find(e => {
      const inicio = e.data_inicio.split('T')[0]
      const termino = e.data_termino.split('T')[0]
      return dateStr >= inicio && dateStr <= termino
    })
    
    // Verificar se é um dia letivo padrão (dentro do intervalo do calendário, não sáb/dom)
    const diaSemana = date.getDay()
    const dataCalendarioInicio = selectedCalendario?.data_inicio ? new Date(selectedCalendario.data_inicio) : null
    const dataCalendarioFim = selectedCalendario?.data_termino ? new Date(selectedCalendario.data_termino) : null
    
    const isDiaLetivoPadrao = dataCalendarioInicio && dataCalendarioFim && 
      date >= dataCalendarioInicio && 
      date <= dataCalendarioFim &&
      diaSemana !== 0 && diaSemana !== 6
    
    // Se tem evento (excluindo nao_letivo), abrir dialog de exclusão
    if (eventoExistente && eventoExistente.tipo !== 'nao_letivo') {
      // Verificar se é um evento de intervalo (mais de um dia)
      const inicio = eventoExistente.data_inicio.split('T')[0]
      const termino = eventoExistente.data_termino.split('T')[0]
      const isIntervalo = inicio !== termino
      
      setEventoParaExcluir(eventoExistente)
      setDiaEspecificoExclusao(isIntervalo ? dateStr : null)
      setShowExcluirEventoDialog(true)
      return
    }
    
    // Se tem evento nao_letivo, permitir sobrescrever (criar novo evento)
    // Sempre abrir modal para criar novo evento, passando info se é dia letivo padrão
    setEventoDiaUnico(true)
    setDiaLetivoPadrao(!!isDiaLetivoPadrao)
    setEventoForm({
      ...eventoForm,
      data_inicio: dateStr,
      data_termino: dateStr
    })
    setShowEventoModal(true)
  }
  
  async function handleExcluirEvento() {
    if (!eventoParaExcluir) return
    
    try {
      // Se tem dia específico para excluir e o evento é um intervalo
      if (diaEspecificoExclusao && eventoParaExcluir) {
        const inicio = eventoParaExcluir.data_inicio.split('T')[0]
        const termino = eventoParaExcluir.data_termino.split('T')[0]
        
        // Se o evento é só um dia, excluir o evento inteiro
        if (inicio === termino) {
          await deleteEvento(eventoParaExcluir.id)
        } else {
          // Se é um intervalo, criar dois eventos para cobrir as partes antes e depois do dia específico
          const diaExcluir = diaEspecificoExclusao
          
          // Se o dia específico é o primeiro dia, ajustar início para o dia seguinte
          if (diaExcluir === inicio) {
            const novoInicio = new Date(diaExcluir)
            novoInicio.setDate(novoInicio.getDate() + 1)
            const novoInicioStr = novoInicio.toISOString().split('T')[0]
            await updateEvento(eventoParaExcluir.id, { data_inicio: novoInicioStr })
          }
          // Se o dia específico é o último dia, ajustar término para o dia anterior
          else if (diaExcluir === termino) {
            const novoTermino = new Date(diaExcluir)
            novoTermino.setDate(novoTermino.getDate() - 1)
            const novoTerminoStr = novoTermino.toISOString().split('T')[0]
            await updateEvento(eventoParaExcluir.id, { data_termino: novoTerminoStr })
          }
          // Se o dia específico está no meio, criar um novo evento para depois do dia
          else {
            const novoTermino = new Date(diaExcluir)
            novoTermino.setDate(novoTermino.getDate() - 1)
            const novoTerminoStr = novoTermino.toISOString().split('T')[0]
            await updateEvento(eventoParaExcluir.id, { data_termino: novoTerminoStr })
            
            const novoInicio = new Date(diaExcluir)
            novoInicio.setDate(novoInicio.getDate() + 1)
            const novoInicioStr = novoInicio.toISOString().split('T')[0]
            
            await createEvento({
              calendario_id: eventoParaExcluir.calendario_id,
              descricao: eventoParaExcluir.descricao,
              tipo: eventoParaExcluir.tipo,
              data_inicio: novoInicioStr,
              data_termino: termino,
              etapas: eventoParaExcluir.etapas,
              recorrencia_tipo: eventoParaExcluir.recorrencia_tipo,
              recorrencia_dias: eventoParaExcluir.recorrencia_dias
            })
          }
        }
      } else {
        // Exclusão normal do evento inteiro
        await deleteEvento(eventoParaExcluir!.id)
      }
      
      const evts = await getEventos(selectedCalendario!.id)
      setEventos(evts)
      setShowExcluirEventoDialog(false)
      setEventoParaExcluir(null)
      setDiaEspecificoExclusao(null)
      toast.success('Evento excluído com sucesso!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao excluir evento.')
    }
  }
  
  async function handleExcluirDiaLetivo() {
    if (!selectedCalendario || !eventoForm.data_inicio) return
    
    try {
      await createEvento({
        calendario_id: selectedCalendario.id,
        descricao: 'Dia não letivo',
        tipo: 'nao_letivo',
        data_inicio: eventoForm.data_inicio,
        data_termino: eventoForm.data_termino,
        etapas: [],
        recorrencia_tipo: 'nao_repete',
        recorrencia_dias: []
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
    
    if (!eventoForm.descricao.trim()) {
      toast.error('O campo Descrição é obrigatório.')
      return
    }
    if (!eventoForm.data_inicio) {
      toast.error('O campo Início é obrigatório.')
      return
    }
    if (!eventoForm.data_termino) {
      toast.error('O campo Término é obrigatório.')
      return
    }
    
    if (new Date(eventoForm.data_termino) < new Date(eventoForm.data_inicio)) {
      toast.error('A data de término não pode ser anterior à data de início.')
      return
    }
    
    try {
      await createEvento({
        calendario_id: selectedCalendario.id,
        descricao: eventoForm.descricao,
        tipo: eventoForm.tipo,
        data_inicio: eventoForm.data_inicio,
        data_termino: eventoForm.data_termino,
        etapas: [],
        recorrencia_tipo: eventoForm.recorrencia_tipo,
        recorrencia_dias: eventoForm.recorrencia_dias
      })
      
      const evts = await getEventos(selectedCalendario.id)
      setEventos(evts)
      
      setShowEventoModal(false)
      setEventoForm({ descricao: '', tipo: 'recesso', data_inicio: '', data_termino: '', recorrencia_tipo: 'nao_repete', recorrencia_dias: [] })
      setEventoDiaUnico(false)
      toast.success('Evento criado com sucesso!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao criar evento. Verifique se os dados estão corretos.')
    }
  }

  // Renderização do calendário
  function renderCalendarGrid() {
    if (!selectedCalendario) return null
    
    const dias = gerarDiasCalendario(selectedCalendario.data_inicio, selectedCalendario.data_termino)
    const meses = getDiasLetivosPorMes(dias, eventos)
    const monthKeys = Object.keys(meses).sort()
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    
    return (
      <div className="mt-4">
        <div className="mb-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success rounded"></div>
            <span className="text-muted-foreground">Dia Letivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-muted-foreground">Não Letivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-destructive rounded"></div>
            <span className="text-muted-foreground">Recesso</span>
          </div>
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
              daysArray.push(<div key={`empty-${i}`} className="h-7"></div>)
            }
            for (let i = 1; i <= daysInMonth; i++) {
              const dayData = mesData.dias.find(d => d.date.getDate() === i)
              const dayDate = new Date(year, month - 1, i)
              daysArray.push(
                <button
                  key={i} 
                  type="button"
                  onClick={() => handleDayClick(dayDate)}
                  className={`h-7 flex items-center justify-center text-xs rounded transition-all duration-150 cursor-pointer ${
                    dayData?.isRecesso 
                      ? 'bg-destructive text-white hover:opacity-80' 
                      : dayData?.isLetivo 
                        ? 'bg-success text-white hover:opacity-80' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              )
            }
            
            return (
              <div key={monthKey} className="border border-border rounded-lg p-3">
                <div className="text-sm font-semibold text-primary mb-2 text-center">
                  {monthNames[month - 1]} {year}
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-[10px] text-center text-muted-foreground mb-1">
                  <div>D</div>
                  <div>S</div>
                  <div>T</div>
                  <div>Q</div>
                  <div>Q</div>
                  <div>S</div>
                  <div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {daysArray}
                </div>
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  {mesData.totalLetivos} dias letivos
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Anos Letivos */}
        <Card className="border-0 shadow-md card-glass">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Anos Letivos
            </CardTitle>
            <Button 
              size="sm" 
              variant="accent"
              className="cursor-pointer gap-2"
              onClick={() => setShowAnoModal(true)}
            >
              <Plus className="w-4 h-4" />
              Novo Ano Letivo
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {anosLetivos.map(ano => (
                <div 
                  key={ano.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAno?.id === ano.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/30'
                  }`}
                  onClick={() => handleSelectAno(ano)}
                >
                  <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{ano.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatarData(ano.data_inicio)} - {formatarData(ano.data_termino)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${statusColors[ano.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                          {statusLabels[ano.status as keyof typeof statusLabels] || ano.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => handleDeleteAnoClick(ano, e)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Excluir ano letivo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  {ano.status === 'planejamento' && (
                    <div className="mt-2 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAtivarAno(ano.id)
                        }}
                      >
                        Ativar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEncerrarAno(ano.id)
                        }}
                      >
                        Encerrar
                      </Button>
                    </div>
                  )}
                  {ano.status === 'encerrado' && (
                    <Button 
                      size="sm" 
                      variant="default"
                      className="mt-2 w-full text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReativarAno(ano.id)
                      }}
                    >
                      Reativar Ano
                    </Button>
                  )}
                </div>
              ))}
              
              {anosLetivos.length === 0 && (
                <p className="text-muted-foreground text-center py-4 text-sm">
                  Nenhum ano letivo cadastrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Calendários */}
        <Card className="border-0 shadow-md card-glass">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Calendários
            </CardTitle>
            <Button 
              size="sm" 
              variant="accent"
              className="cursor-pointer gap-2"
              disabled={!selectedAno}
              onClick={() => setShowCalendarioModal(true)}
            >
              <Plus className="w-4 h-4" />
              Novo Calendário
            </Button>
          </CardHeader>
          <CardContent>
            {selectedAno ? (
              <div className="space-y-2">
                {calendarios.map(cal => (
                  <div 
                    key={cal.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCalendario?.id === cal.id 
                      ? 'border-info bg-info/5' 
                      : 'border-border hover:border-info/30'
                    }`}
                    onClick={() => handleSelectCalendario(cal)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{cal.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatarData(cal.data_inicio)} - {formatarData(cal.data_termino)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => handleDeleteCalendarioClick(cal, e)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Excluir calendário"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {calendarios.length === 0 && (
                  <p className="text-muted-foreground text-center py-4 text-sm">
                    Nenhum calendário cadastrado
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4 text-sm">
                Selecione um ano letivo primeiro
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card: Visualização */}
        <Card className="border-0 shadow-md card-glass md:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Visualização
            </CardTitle>
            <Button 
              size="sm" 
              variant="accent"
              className="cursor-pointer gap-2"
              disabled={!selectedCalendario}
              onClick={() => {
                setEventoDiaUnico(false)
                setShowEventoModal(true)
              }}
            >
              <Plus className="w-4 h-4" />
              Novo Evento
            </Button>
          </CardHeader>
          <CardContent>
            {selectedCalendario ? (
              renderCalendarGrid()
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Selecione um calendário para visualizar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal: Novo Ano Letivo */}
      <Dialog open={showAnoModal} onOpenChange={setShowAnoModal}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Novo Ano Letivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label className="text-foreground font-medium block mb-2">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input 
                className="border-2 border-border focus:border-primary focus:ring-primary/20 bg-input"
                placeholder="Ex: 2026" 
                value={anoForm.descricao}
                onChange={e => setAnoForm({...anoForm, descricao: e.target.value})}
                required
              />
            </div>
            <div>
              <Label className="text-foreground font-medium block mb-2">
                Situação <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={anoForm.status || ""}
                onValueChange={(v) => setAnoForm({...anoForm, status: v})}
              >
                <SelectTrigger className="border-2 border-border focus:border-primary hover:border-primary/30 bg-input w-full">
                  <SelectValue placeholder="Selecione uma situação" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-2 border-border">
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="encerramento">Encerramento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DatePickerDual
              labelInicio="Início"
              labelTermino="Término"
              valorInicio={anoForm.data_inicio}
              valorTermino={anoForm.data_termino}
              onChangeInicio={(v) => setAnoForm({...anoForm, data_inicio: v})}
              onChangeTermino={(v) => setAnoForm({...anoForm, data_termino: v})}
              required
            />
          </div>
          <DialogFooter className="mt-6 gap-3">
            <Button variant="outline" onClick={() => setShowAnoModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateAno}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Novo Calendário */}
      <Dialog open={showCalendarioModal} onOpenChange={setShowCalendarioModal}>
        <DialogContent className="max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Novo Calendário</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label className="text-foreground font-medium block mb-2">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input 
                className="border-2 border-border focus:border-info focus:ring-info/20 bg-input"
                placeholder="Ex: Calendário Ensino Fundamental" 
                value={calendarioForm.descricao}
                onChange={e => setCalendarioForm({...calendarioForm, descricao: e.target.value})}
                required
              />
            </div>
            <DatePickerDual
              labelInicio="Início"
              labelTermino="Término"
              valorInicio={calendarioForm.data_inicio}
              valorTermino={calendarioForm.data_termino}
              onChangeInicio={(v) => setCalendarioForm({...calendarioForm, data_inicio: v})}
              onChangeTermino={(v) => setCalendarioForm({...calendarioForm, data_termino: v})}
            />
          </div>
          <DialogFooter className="mt-6 gap-3">
            <Button variant="outline" onClick={() => setShowCalendarioModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateCalendario}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Novo Evento */}
      <Dialog open={showEventoModal} onOpenChange={(open) => {
        setShowEventoModal(open)
        if (!open) {
          setEventoDiaUnico(false)
          setDiaLetivoPadrao(false)
        }
      }}>
        <DialogContent className="max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label className="text-foreground font-medium block mb-2">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input 
                className="border-2 border-border focus:border-ring focus:ring-ring/20 bg-input"
                placeholder="Ex: Feriado de Páscoa" 
                value={eventoForm.descricao}
                onChange={e => setEventoForm({...eventoForm, descricao: e.target.value})}
                required
              />
            </div>
            <div>
              <Label className="text-foreground font-medium block mb-2">Tipo</Label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="tipo"
                    value="recesso"
                    checked={eventoForm.tipo === 'recesso'}
                    onChange={() => setEventoForm({...eventoForm, tipo: 'recesso'})}
                    className="w-4 h-4 text-ring"
                  />
                  <span className="text-sm text-foreground">Recesso</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="tipo"
                    value="dia_letivo"
                    checked={eventoForm.tipo === 'dia_letivo'}
                    onChange={() => setEventoForm({...eventoForm, tipo: 'dia_letivo'})}
                    className="w-4 h-4 text-ring"
                  />
                  <span className="text-sm text-foreground/80">Dia Letivo</span>
                </label>
              </div>
            </div>
            <DatePickerDual
              labelInicio="Início"
              labelTermino="Término"
              valorInicio={eventoForm.data_inicio}
              valorTermino={eventoForm.data_termino}
              onChangeInicio={(v) => setEventoForm({...eventoForm, data_inicio: v})}
              onChangeTermino={(v) => setEventoForm({...eventoForm, data_termino: v})}
              disabled={eventoDiaUnico}
            />
          </div>
          <DialogFooter className="mt-6 gap-3">
            {diaLetivoPadrao && (
              <Button variant="destructive" onClick={handleExcluirDiaLetivo} className="mr-auto">
                Excluir dia letivo
              </Button>
            )}
            <Button variant="outline" onClick={() => {
                setShowEventoModal(false)
                setEventoDiaUnico(false)
                setDiaLetivoPadrao(false)
              }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateEvento}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog de Confirmação para Encerrar Ano */}
      <AlertDialog open={!!anoToEncerrar} onOpenChange={() => setAnoToEncerrar(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Encerrar Ano Letivo?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta ação não pode ser desfeita. O ano letivo será encerrado e não poderá mais ser alterado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-3">
            <AlertDialogCancel onClick={() => setAnoToEncerrar(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmEncerrarAno}>
              Sim, Encerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog: Excluir Evento */}
      <AlertDialog open={showExcluirEventoDialog} onOpenChange={setShowExcluirEventoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Evento</AlertDialogTitle>
            <AlertDialogDescription>
              {diaEspecificoExclusao ? (
                <>
                  O evento "{eventoParaExcluir?.descricao}" abrange o período de {eventoParaExcluir ? formatarData(eventoParaExcluir.data_inicio) : ''} a {eventoParaExcluir ? formatarData(eventoParaExcluir.data_termino) : ''}.
                  <br />
                  Tem certeza que deseja remover apenas o dia {formatarData(diaEspecificoExclusao)}?
                  <br />
                  {eventoParaExcluir?.tipo === 'dia_letivo' && <span className="text-amber-600">Esse dia deixará de ser letivo.</span>}
                  {eventoParaExcluir?.tipo === 'recesso' && <span className="text-amber-600">Esse dia deixará de ser recesso.</span>}
                </>
              ) : (
                <>
                  Tem certeza que deseja excluir o evento "{eventoParaExcluir?.descricao}" do dia {eventoParaExcluir ? formatarData(eventoParaExcluir.data_inicio) : ''}?
                  <br />
                  {eventoParaExcluir?.tipo === 'dia_letivo' && <span className="text-amber-600">Isso fará com que o dia deixe de ser letivo.</span>}
                  {eventoParaExcluir?.tipo === 'recesso' && <span className="text-amber-600">Isso fará com que o dia deixe de ser recesso.</span>}
                  {eventoParaExcluir?.tipo === 'nao_letivo' && <span className="text-amber-600">Isso tornará o dia letivo novamente.</span>}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-3">
            <AlertDialogCancel onClick={() => {
                setShowExcluirEventoDialog(false)
                setEventoParaExcluir(null)
                setDiaEspecificoExclusao(null)
              }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleExcluirEvento}>
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog: Excluir Calendário */}
      <AlertDialog open={showExcluirCalendarioDialog} onOpenChange={setShowExcluirCalendarioDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Calendário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o calendário "{calendarioParaExcluir?.descricao}"?
              <br />
              <span className="text-amber-600">Todos os eventos deste calendário também serão excluídos.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-3">
            <AlertDialogCancel onClick={() => {
                setShowExcluirCalendarioDialog(false)
                setCalendarioParaExcluir(null)
              }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDeleteCalendario}>
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog: Excluir Ano Letivo */}
      <AlertDialog open={showExcluirAnoDialog} onOpenChange={setShowExcluirAnoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ano Letivo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o ano letivo "{anoParaExcluir?.descricao}"?
              <br />
              <span className="text-amber-600">Todos os calendários e eventos deste ano também serão excluídos.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-3">
            <AlertDialogCancel onClick={() => {
                setShowExcluirAnoDialog(false)
                setAnoParaExcluir(null)
              }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDeleteAno}>
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}