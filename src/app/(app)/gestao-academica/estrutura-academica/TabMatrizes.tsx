'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Plus, BookOpen, Calendar, GraduationCap, ChevronRight, Clock, Users, Trash2, Pencil } from 'lucide-react'
import { getAnosLetivos, AnoLetivo } from '@/lib/actions/calendarios'
import { 
  getEtapasEnsino,
  getMatrizes,
  getDisciplinas,
  toggleMatrizAtiva,
  deleteMatriz,
  createMatriz,
  createPeriodos,
  getMetodosAvaliacao,
  getSubetapas,
  getPeriodos,
  getDisciplinasPorPeriodo,
  createDisciplinaMatriz,
  deleteDisciplinaMatriz,
  replicarDisciplinas,
  getHabilidadesBNCCSistema,
  addHabilidadeBNCC,
  removeHabilidadeBNCC,
  addHabilidadeManual,
  removeHabilidadeManual,
  EtapaEnsino,
  MatrizCurricular
} from '@/lib/actions/matrizes'

interface TabMatrizesProps {
  schoolId: string
}

const statusLabels = {
  ativo: 'Ativo',
  planejamento: 'Em Planejamento',
  encerramento: 'Encerrado'
}

const statusColors = {
  ativo: 'bg-green-100 text-green-700 border-green-200',
  planejamento: 'bg-amber-100 text-amber-700 border-amber-200',
  encerramento: 'bg-gray-100 text-gray-600 border-gray-200'
}

export function TabMatrizes({ schoolId }: TabMatrizesProps) {
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([])
  const [etapas, setEtapas] = useState<EtapaEnsino[]>([])
  const [matrizes, setMatrizes] = useState<MatrizCurricular[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMatrizes, setLoadingMatrizes] = useState(false)
  
  const [anoSelecionado, setAnoSelecionado] = useState<string>('')
  const [etapaSelecionada, setEtapaSelecionada] = useState<string>('')
  const [anoEncerrado, setAnoEncerrado] = useState(false)

  // Modal de criação
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [metodos, setMetodos] = useState<any[]>([])
  const [subetapas, setSubetapas] = useState<any[]>([])

  // Períodos e disciplinas
  const [matrizSelecionada, setMatrizSelecionada] = useState<any>(null)
  const [periodos, setPeriodos] = useState<any[]>([])
  const [loadingPeriodos, setLoadingPeriodos] = useState(false)
  const [expandedPeriodos, setExpandedPeriodos] = useState<string[]>([])
  const [disciplinasPorPeriodo, setDisciplinasPorPeriodo] = useState<Record<string, any[]>>({})

  // Modal de disciplina
  const [showDisciplinaModal, setShowDisciplinaModal] = useState(false)
  const [periodoSelecionado, setPeriodoSelecionado] = useState<any>(null)
  const [disciplinas, setDisciplinas] = useState<any[]>([])
  const [habilidadesBNCC, setHabilidadesBNCC] = useState<any[]>([])
  const [habilidadesManuais, setHabilidadesManuais] = useState<any[]>([])
  const [disciplinaForm, setDisciplinaForm] = useState({
    disciplinaId: '',
    desconsideraReprovacao: false,
    cargaHorariaRegularHoras: 0,
    cargaHorariaRegularMinutos: 0,
    cargaHorariaIntegralHoras: 0,
    cargaHorariaIntegralMinutos: 0,
    tipoDisciplina: 'base_comum',
    habilidadesBNCC: [] as string[],
    habilidadeManualCodigo: '',
    habilidadeManualDescricao: '',
  })
  
  // Formulário
  const [formData, setFormData] = useState({
    descricao: '',
    etapaId: '',
    subetapaId: '',
    metodoId: '',
    dataInicial: '',
    dataFinal: '',
    turnos: [] as string[],
    tipoTurma: [] as string[],
    aulasDiariasRegular: 0,
    aulasSemanaisRegular: 0,
    aulasAnuaisRegular: 0,
    duracaoAulaRegular: 0,
    aulasDiariasIntegral: 0,
    aulasSemanaisIntegral: 0,
    aulasAnuaisIntegral: 0,
    duracaoAulaIntegral: 0,
  })

  // Agrupar etapas por tipo (igual ao TabEtapas)
  const etapasAgrupadas = useMemo(() => {
    const grupos = [
      { titulo: 'Educação Infantil', tipos: ['infantil'] },
      { titulo: 'Ensino Fundamental - Anos Iniciais', tipos: ['fundamental_inicial'] },
      { titulo: 'Ensino Fundamental - Anos Finais', tipos: ['fundamental_final'] },
      { titulo: 'Ensino Médio', tipos: ['medio'] },
      { titulo: 'Fundamental - Outros', tipos: ['fundamental_outros'] },
      { titulo: 'EJA', tipos: ['eja'] },
    ]

    return grupos
      .map(grupo => ({
        titulo: grupo.titulo,
        etapas: etapas.filter(e => grupo.tipos.includes(e.etapa_tipo))
      }))
      .filter(g => g.etapas.length > 0)
  }, [etapas])

  useEffect(() => {
    loadInitialData()
  }, [schoolId])

  useEffect(() => {
    if (anoSelecionado) {
      loadMatrizes()
    }
  }, [anoSelecionado, etapaSelecionada])

  async function loadInitialData() {
    try {
      setLoading(true)
      
      const [anosData, etapasData] = await Promise.all([
        getAnosLetivos(schoolId),
        getEtapasEnsino(schoolId)
      ])
      
      setAnosLetivos(anosData || [])
      setEtapas(etapasData || [])

      // Selecionar o ano ativo por padrão
      const anoAtivo = anosData?.find(a => a.status === 'ativo')
      if (anoAtivo) {
        setAnoSelecionado(anoAtivo.id)
        setAnoEncerrado(anoAtivo.status === 'encerrado')
      } else if (anosData && anosData.length > 0) {
        setAnoSelecionado(anosData[0].id)
        setAnoEncerrado(anosData[0].status === 'encerrado')
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  async function loadMatrizes() {
    try {
      setLoadingMatrizes(true)
      const data = await getMatrizes(
        schoolId, 
        anoSelecionado || undefined, 
        etapaSelecionada || undefined
      )
      setMatrizes(data || [])
    } catch (error) {
      console.error('Erro ao carregar matrizes:', error)
      toast.error('Erro ao carregar matrizes')
    } finally {
      setLoadingMatrizes(false)
    }
  }

  function handleAnoChange(value: string) {
    setAnoSelecionado(value)
    const ano = anosLetivos.find(a => a.id === value)
    setAnoEncerrado(ano?.status === 'encerrado')
    setEtapaSelecionada('')
  }

  async function handleToggleAtiva(matrizId: string, ativa: boolean) {
    try {
      await toggleMatrizAtiva(matrizId, ativa)
      setMatrizes(prev => prev.map(m => 
        m.id === matrizId ? { ...m, ativa } : m
      ))
      toast.success(ativa ? 'Matriz ativada' : 'Matriz desativada')
    } catch (error) {
      console.error('Erro ao atualizar matriz:', error)
      toast.error('Erro ao atualizar matriz')
    }
  }

  async function handleDeleteMatriz(matrizId: string) {
    if (!confirm('Tem certeza que deseja excluir esta matriz?')) return
    
    try {
      await deleteMatriz(matrizId)
      setMatrizes(prev => prev.filter(m => m.id !== matrizId))
      toast.success('Matriz excluída')
    } catch (error) {
      console.error('Erro ao excluir matriz:', error)
      toast.error('Erro ao excluir matriz')
    }
  }

  async function openCreateModal() {
    try {
      // Carregar métodos de avaliação
      const metodosData = await getMetodosAvaliacao(schoolId)
      setMetodos(metodosData || [])
      
      // Se houver etapa selecionada, carregar subetapas
      if (etapaSelecionada && etapaSelecionada !== 'all') {
        const subetapasData = await getSubetapas(etapaSelecionada)
        setSubetapas(subetapasData || [])
      } else {
        setSubetapas([])
      }
      
      // Resetar formulário
      setFormData({
        descricao: '',
        etapaId: etapaSelecionada || '',
        subetapaId: '',
        metodoId: '',
        dataInicial: '',
        dataFinal: '',
        turnos: [],
        tipoTurma: [],
        aulasDiariasRegular: 0,
        aulasSemanaisRegular: 0,
        aulasAnuaisRegular: 0,
        duracaoAulaRegular: 0,
        aulasDiariasIntegral: 0,
        aulasSemanaisIntegral: 0,
        aulasAnuaisIntegral: 0,
        duracaoAulaIntegral: 0,
      })
      
      setShowModal(true)
    } catch (error) {
      console.error('Erro ao abrir modal:', error)
      toast.error('Erro ao carregar dados')
    }
  }

  function closeModal() {
    setShowModal(false)
    setFormData({
      descricao: '',
      etapaId: '',
      subetapaId: '',
      metodoId: '',
      dataInicial: '',
      dataFinal: '',
      turnos: [],
      tipoTurma: [],
      aulasDiariasRegular: 0,
      aulasSemanaisRegular: 0,
      aulasAnuaisRegular: 0,
      duracaoAulaRegular: 0,
      aulasDiariasIntegral: 0,
      aulasSemanaisIntegral: 0,
      aulasAnuaisIntegral: 0,
      duracaoAulaIntegral: 0,
    })
  }

  async function handleSaveMatriz() {
    // Validações
    if (!formData.descricao.trim()) {
      toast.error('Descrição é obrigatória')
      return
    }
    if (!formData.metodoId) {
      toast.error('Método de avaliação é obrigatório')
      return
    }
    if (!formData.dataInicial || !formData.dataFinal) {
      toast.error('Datas inicial e final são obrigatórias')
      return
    }
    if (formData.turnos.length === 0) {
      toast.error('Selecione pelo menos um turno')
      return
    }
    if (formData.tipoTurma.length === 0) {
      toast.error('Selecione pelo menos um tipo de turma')
      return
    }

    // Valida campos condicionais
    const temRegular = formData.tipoTurma.includes('regular')
    const temIntegral = formData.tipoTurma.includes('integral')
    
    if (temRegular && (!formData.aulasDiariasRegular || !formData.aulasSemanaisRegular || !formData.duracaoAulaRegular)) {
      toast.error('Preencha os campos de aulas para turno Regular')
      return
    }
    if (temIntegral && (!formData.aulasDiariasIntegral || !formData.aulasSemanaisIntegral || !formData.duracaoAulaIntegral)) {
      toast.error('Preencha os campos de aulas para turno Integral')
      return
    }

    try {
      setSaving(true)
      
      // Buscar informações da etapa
      const etapaInfo = etapas.find(e => e.id === formData.etapaId)
      
      // Calcular aulas anuais
      const aulasAnuaisRegular = temRegular 
        ? formData.aulasSemanaisRegular * (formData.aulasDiariasRegular > 0 ? 40 : 1)
        : 0
      const aulasAnuaisIntegral = temIntegral
        ? formData.aulasSemanaisIntegral * (formData.aulasDiariasIntegral > 0 ? 40 : 1)
        : 0

      await createMatriz({
        school_id: schoolId,
        ano_letivo_id: anoSelecionado,
        etapa_ensino_id: formData.etapaId,
        subetapa_id: formData.subetapaId && formData.subetapaId !== 'none' ? formData.subetapaId : null,
        metodo_avaliacao_id: formData.metodoId,
        descricao: formData.descricao,
        data_inicial: formData.dataInicial,
        data_final: formData.dataFinal,
        turnos: formData.turnos,
        tipo_turma: formData.tipoTurma,
        aulas_diarias_regular: temRegular ? formData.aulasDiariasRegular : null,
        aulas_semanais_regular: temRegular ? formData.aulasSemanaisRegular : null,
        aulas_anuais_regular: temRegular ? aulasAnuaisRegular : null,
        duracao_aula_regular: temRegular ? formData.duracaoAulaRegular : null,
        aulas_diarias_integral: temIntegral ? formData.aulasDiariasIntegral : null,
        aulas_semanais_integral: temIntegral ? formData.aulasSemanaisIntegral : null,
        aulas_anuais_integral: temIntegral ? aulasAnuaisIntegral : null,
        duracao_aula_integral: temIntegral ? formData.duracaoAulaIntegral : null,
        ativa: true,
      })

      const novaMatrizData = await createMatriz({
        school_id: schoolId,
        ano_letivo_id: anoSelecionado,
        etapa_ensino_id: formData.etapaId,
        subetapa_id: formData.subetapaId && formData.subetapaId !== 'none' ? formData.subetapaId : null,
        metodo_avaliacao_id: formData.metodoId,
        descricao: formData.descricao,
        data_inicial: formData.dataInicial,
        data_final: formData.dataFinal,
        turnos: formData.turnos,
        tipo_turma: formData.tipoTurma,
        aulas_diarias_regular: temRegular ? formData.aulasDiariasRegular : null,
        aulas_semanais_regular: temRegular ? formData.aulasSemanaisRegular : null,
        aulas_anuais_regular: temRegular ? aulasAnuaisRegular : null,
        duracao_aula_regular: temRegular ? formData.duracaoAulaRegular : null,
        aulas_diarias_integral: temIntegral ? formData.aulasDiariasIntegral : null,
        aulas_semanais_integral: temIntegral ? formData.aulasSemanaisIntegral : null,
        aulas_anuais_integral: temIntegral ? aulasAnuaisIntegral : null,
        duracao_aula_integral: temIntegral ? formData.duracaoAulaIntegral : null,
        ativa: true,
      })
      
      // Criar períodos automaticamente baseado no método de avaliação
      const metodo = metodos.find(m => m.id === formData.metodoId)
      if (metodo && novaMatrizData) {
        const quantidadePeriodos = metodo.quantidade_periodos
        const nomesPeriodos = gerarNomesPeriodos(quantidadePeriodos)
        await createPeriodos(novaMatrizData.id, quantidadePeriodos, nomesPeriodos)
      }
      
      toast.success('Matriz criada com sucesso!')
      closeModal()
      loadMatrizes()
    } catch (error) {
      console.error('Erro ao criar matriz:', error)
      toast.error('Erro ao criar matriz')
    } finally {
      setSaving(false)
    }
  }

  function gerarNomesPeriodos(quantidade: number): string[] {
    const nomes: string[] = []
    for (let i = 1; i <= quantidade; i++) {
      nomes.push(`${i}º Bimestre`)
    }
    return nomes
  }

  function toggleTurno(turno: string) {
    setFormData(prev => ({
      ...prev,
      turnos: prev.turnos.includes(turno)
        ? prev.turnos.filter(t => t !== turno)
        : [...prev.turnos, turno]
    }))
  }

  function toggleTipoTurma(tipo: string) {
    setFormData(prev => ({
      ...prev,
      tipoTurma: prev.tipoTurma.includes(tipo)
        ? prev.tipoTurma.filter(t => t !== tipo)
        : [...prev.tipoTurma, tipo]
    }))
  }

  // ============================================
  // Funções de Períodos e Disciplinas
  // ============================================

  async function loadPeriodos(matriz: any) {
    try {
      setLoadingPeriodos(true)
      const data = await getPeriodos(matriz.id)
      setPeriodos(data || [])
      setExpandedPeriodos([])
      setDisciplinasPorPeriodo({})
    } catch (error) {
      console.error('Erro ao carregar períodos:', error)
    } finally {
      setLoadingPeriodos(false)
    }
  }

  async function openMatrizDetails(matriz: any) {
    setMatrizSelecionada(matriz)
    await loadPeriodos(matriz)
  }

  function closeMatrizDetails() {
    setMatrizSelecionada(null)
    setPeriodos([])
    setDisciplinasPorPeriodo({})
    setExpandedPeriodos([])
  }

  async function togglePeriodo(periodo: any) {
    const isExpanded = expandedPeriodos.includes(periodo.id)
    
    if (isExpanded) {
      setExpandedPeriodos(prev => prev.filter(id => id !== periodo.id))
    } else {
      setExpandedPeriodos(prev => [...prev, periodo.id])
      
      // Carregar disciplinas do período se ainda não foram carregadas
      if (!disciplinasPorPeriodo[periodo.id]) {
        try {
          const data = await getDisciplinasPorPeriodo(periodo.id)
          setDisciplinasPorPeriodo(prev => ({
            ...prev,
            [periodo.id]: data || []
          }))
        } catch (error) {
          console.error('Erro ao carregar disciplinas:', error)
        }
      }
    }
  }

  async function openDisciplinaModal(periodo: any) {
    try {
      // Carregar disciplinas disponíveis
      const disciplinasData = await getDisciplinas(schoolId)
      setDisciplinas(disciplinasData || [])
      
      // Resetar formulário
      setDisciplinaForm({
        disciplinaId: '',
        desconsideraReprovacao: false,
        cargaHorariaRegularHoras: 0,
        cargaHorariaRegularMinutos: 0,
        cargaHorariaIntegralHoras: 0,
        cargaHorariaIntegralMinutos: 0,
        tipoDisciplina: 'base_comum',
        habilidadesBNCC: [],
        habilidadeManualCodigo: '',
        habilidadeManualDescricao: '',
      })
      
      setHabilidadesManuais([])
      
      // Carregar habilidades BNCC disponíveis
      const etapaInfo = matrizSelecionada.academico_etapas_ensino
      const tipoEnsino = etapaInfo?.etapa_tipo
      const habilidadesData = await getHabilidadesBNCCSistema(tipoEnsino)
      setHabilidadesBNCC(habilidadesData || [])
      
      setPeriodoSelecionado(periodo)
      setShowDisciplinaModal(true)
    } catch (error) {
      console.error('Erro ao abrir modal de disciplina:', error)
      toast.error('Erro ao carregar dados')
    }
  }

  async function saveDisciplina() {
    if (!disciplinaForm.disciplinaId) {
      toast.error('Selecione uma disciplina')
      return
    }

    if (!periodoSelecionado) return

    try {
      const temRegular = matrizSelecionada.tipo_turma?.includes('regular')
      const temIntegral = matrizSelecionada.tipo_turma?.includes('integral')
      
      const cargaRegularMinutos = (disciplinaForm.cargaHorariaRegularHoras * 60) + disciplinaForm.cargaHorariaRegularMinutos
      const cargaIntegralMinutos = (disciplinaForm.cargaHorariaIntegralHoras * 60) + disciplinaForm.cargaHorariaIntegralMinutos

      // Validar carga horária
      if (temRegular && cargaRegularMinutos === 0) {
        toast.error('Informe a carga horária para turno Regular')
        return
      }
      if (temIntegral && cargaIntegralMinutos === 0) {
        toast.error('Informe a carga horária para turno Integral')
        return
      }

      const novaDisciplina = await createDisciplinaMatriz({
        periodo_id: periodoSelecionado.id,
        disciplina_id: disciplinaForm.disciplinaId,
        desconsidera_reprovacao: disciplinaForm.desconsideraReprovacao,
        carga_horaria_regular_minutos: temRegular ? cargaRegularMinutos : null,
        carga_horaria_integral_minutos: temIntegral ? cargaIntegralMinutos : null,
        tipo_disciplina: disciplinaForm.tipoDisciplina as 'base_comum' | 'parte_diversificada',
      })

      // Adicionar habilidades BNCC selecionadas
      for (const codigo of disciplinaForm.habilidadesBNCC) {
        await addHabilidadeBNCC(novaDisciplina.id, codigo)
      }

      toast.success('Disciplina adicionada com sucesso!')
      setShowDisciplinaModal(false)
      
      // Recarregar disciplinas do período
      const data = await getDisciplinasPorPeriodo(periodoSelecionado.id)
      setDisciplinasPorPeriodo(prev => ({
        ...prev,
        [periodoSelecionado.id]: data || []
      }))
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error)
      toast.error('Erro ao salvar disciplina')
    }
  }

  async function handleReplicarDisciplinas() {
    if (periodos.length <= 1) return
    if (!confirm('Isso irá copiar todas as disciplinas do 1º período para os demais períodos. Continuar?')) return

    try {
      const primeiroPeriodo = periodos[0]
      const demaisPeriodos = periodos.slice(1).map(p => p.id)
      
      await replicarDisciplinas(matrizSelecionada.id, primeiroPeriodo.id, demaisPeriodos)
      
      toast.success('Disciplinas replicadas para todos os períodos!')
      
      // Recarregar disciplinas de todos os períodos
      for (const periodo of periodos) {
        const data = await getDisciplinasPorPeriodo(periodo.id)
        setDisciplinasPorPeriodo(prev => ({
          ...prev,
          [periodo.id]: data || []
        }))
      }
    } catch (error) {
      console.error('Erro ao replicar disciplinas:', error)
      toast.error('Erro ao replicar disciplinas')
    }
  }

  async function handleRemoveDisciplina(disciplinaId: string, periodoId: string) {
    if (!confirm('Remover esta disciplina?')) return

    try {
      await deleteDisciplinaMatriz(disciplinaId)
      
      // Atualizar lista local
      setDisciplinasPorPeriodo(prev => ({
        ...prev,
        [periodoId]: (prev[periodoId] || []).filter(d => d.id !== disciplinaId)
      }))
      
      toast.success('Disciplina removida')
    } catch (error) {
      console.error('Erro ao remover disciplina:', error)
      toast.error('Erro ao remover disciplina')
    }
  }

  function addHabilidadeManual() {
    if (!disciplinaForm.habilidadeManualCodigo.trim() || !disciplinaForm.habilidadeManualDescricao.trim()) {
      toast.error('Informe código e descrição')
      return
    }
    
    setHabilidadesManuais(prev => [
      ...prev,
      { id: crypto.randomUUID(), codigo: disciplinaForm.habilidadeManualCodigo, descricao: disciplinaForm.habilidadeManualDescricao }
    ])
    
    setDisciplinaForm(prev => ({
      ...prev,
      habilidadeManualCodigo: '',
      habilidadeManualDescricao: ''
    }))
  }

  function removeHabilidadeManual(id: string) {
    setHabilidadesManuais(prev => prev.filter(h => h.id !== id))
  }

  function toggleHabilidadeBNCC(codigo: string) {
    setDisciplinaForm(prev => ({
      ...prev,
      habilidadesBNCC: prev.habilidadesBNCC.includes(codigo)
        ? prev.habilidadesBNCC.filter(c => c !== codigo)
        : [...prev.habilidadesBNCC, codigo]
    }))
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-md card-glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[#0f172a]">
            Matrizes Curriculares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-[#e2e8f0] rounded-full mb-3"></div>
              <div className="h-4 w-32 bg-[#e2e8f0] rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md card-glass">
      <CardHeader className="pb-3 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#0f172a]">
            Matrizes Curriculares
          </CardTitle>
          {!anoEncerrado && anoSelecionado && (
            <Button 
              size="sm"
              className="bg-[#1D3557] hover:bg-[#16304a] text-white"
              onClick={openCreateModal}
            >
              <Plus className="w-4 h-4 mr-1" />
              Nova Matriz
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mt-4">
          <div className="w-48">
            <Select value={anoSelecionado} onValueChange={handleAnoChange}>
              <SelectTrigger className="border-2 border-[#e2e8f0] focus:border-[#1D3557] [&_svg:not([class*='rotate'])]:rotate-0">
                <Calendar className="w-4 h-4 mr-2 text-[#64748b]" />
                <SelectValue placeholder="Ano Letivo" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={5}>
                {anosLetivos.map(ano => (
                  <SelectItem key={ano.id} value={ano.id}>
                    {ano.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-72">
            <Select value={etapaSelecionada} onValueChange={setEtapaSelecionada}>
              <SelectTrigger className="border-2 border-[#e2e8f0] focus:border-[#1D3557] [&_svg:not([class*='rotate'])]:rotate-0">
                <GraduationCap className="w-4 h-4 mr-2 text-[#64748b]" />
                <SelectValue placeholder="Todas as Etapas" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={5} className="max-h-80">
                <SelectItem value="all">Todas as Etapas</SelectItem>
                {etapasAgrupadas.map(grupo => (
                  <SelectGroup key={grupo.titulo}>
                    <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-[#1D3557] bg-[#f1f5f9]">
                      {grupo.titulo}
                    </SelectLabel>
                    {grupo.etapas.map(etapa => (
                      <SelectItem key={etapa.id} value={etapa.id} className="pl-4">
                        {etapa.etapa_nome}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {!anoSelecionado ? (
          <EmptyState 
            icon={<Calendar className="w-10 h-10 text-[#94a3b8]" />}
            title="Selecione um Ano Letivo"
            description="Escolha um ano letivo para visualizar as matrizes curriculares."
          />
        ) : loadingMatrizes ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-[#e2e8f0] rounded-full mb-3"></div>
              <div className="h-4 w-32 bg-[#e2e8f0] rounded"></div>
            </div>
          </div>
        ) : matrizes.length === 0 ? (
          <EmptyState 
            icon={<BookOpen className="w-10 h-10 text-[#94a3b8]" />}
            title="Nenhuma matriz encontrada"
            description={anoEncerrado 
              ? "Este ano letivo está encerrado e não pode ser alterado."
              : "Clique em 'Nova Matriz' para criar a primeira matriz curricular."}
          />
        ) : (
          <div className="grid gap-3">
            {matrizes.map(matriz => (
              <MatrizCard 
                key={matriz.id} 
                matriz={matriz} 
                onToggle={(ativa) => handleToggleAtiva(matriz.id, ativa)}
                onDelete={() => handleDeleteMatriz(matriz.id)}
                disabled={anoEncerrado}
              />
            ))}
          </div>
        )}

        {anoEncerrado && matrizes.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-amber-800">
              Este ano letivo está encerrado. As matrizes são apenas para visualização.
            </span>
          </div>
        )}
      </CardContent>

      {/* Modal de Criação de Matriz */}
      <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#0f172a]">
              Nova Matriz Curricular
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Card Identificação */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1D3557] border-b border-[#e2e8f0] pb-2">
                Identificação
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-[#334155] font-medium block mb-2">
                    Descrição <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Ex: Matriz Curricular 2026 - Fundamental I"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                  />
                </div>

                <div>
                  <Label className="text-[#334155] font-medium block mb-2">
                    Etapa de Ensino
                  </Label>
                  <Select 
                    value={formData.etapaId} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, etapaId: value, subetapaId: '' }))
                      // Carregar subetapas quando mudar a etapa
                      getSubetapas(value).then(data => setSubetapas(data || []))
                    }}
                  >
                    <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                      <SelectValue placeholder="Selecione a etapa" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={5}>
                      {etapasAgrupadas.map(grupo => (
                        <SelectGroup key={grupo.titulo}>
                          <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-[#1D3557] bg-[#f1f5f9]">
                            {grupo.titulo}
                          </SelectLabel>
                          {grupo.etapas.map(etapa => (
                            <SelectItem key={etapa.id} value={etapa.id} className="pl-4">
                              {etapa.etapa_nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[#334155] font-medium block mb-2">
                    Subetapa
                  </Label>
                  <Select 
                    value={formData.subetapaId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subetapaId: value === 'none' ? '' : value }))}
                    disabled={!formData.etapaId || subetapas.length === 0}
                  >
                    <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                      <SelectValue placeholder="Selecione (opcional)" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={5}>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {subetapas.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[#334155] font-medium block mb-2">
                    Método de Avaliação <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.metodoId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, metodoId: value }))}
                  >
                    <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={5}>
                      {metodos.map(metodo => (
                        <SelectItem key={metodo.id} value={metodo.id}>
                          {metodo.nome} ({metodo.quantidade_periodos} períodos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Data Inicial <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.dataInicial}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataInicial: e.target.value }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Data Final <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.dataFinal}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataFinal: e.target.value }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                </div>
              </div>

              {/* Turnos */}
              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Turnos <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4">
                  {['matutino', 'vespertino', 'noturno'].map(turno => (
                    <label key={turno} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.turnos.includes(turno)}
                        onCheckedChange={() => toggleTurno(turno)}
                        className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                      />
                      <span className="text-sm text-[#334155] capitalize">{turno}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo de Turma */}
              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Tipo de Turma <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.tipoTurma.includes('regular')}
                      onCheckedChange={() => toggleTipoTurma('regular')}
                      className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                    />
                    <span className="text-sm text-[#334155]">Regular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.tipoTurma.includes('integral')}
                      onCheckedChange={() => toggleTipoTurma('integral')}
                      className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                    />
                    <span className="text-sm text-[#334155]">Integral</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Campos Condicionais - Regular */}
            {formData.tipoTurma.includes('regular') && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#1D3557] border-b border-[#e2e8f0] pb-2">
                  Configuração - Turno Regular
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Aulas Diárias <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.aulasDiariasRegular || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, aulasDiariasRegular: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Aulas Semanais <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.aulasSemanaisRegular || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, aulasSemanaisRegular: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Aulas Anuais
                    </Label>
                    <Input
                      type="number"
                      disabled
                      value={formData.aulasSemanaisRegular && formData.aulasDiariasRegular 
                        ? formData.aulasSemanaisRegular * 40 
                        : 0}
                      className="border-2 border-[#e2e8f0] bg-[#f1f5f9]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Duração (min) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.duracaoAulaRegular || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, duracaoAulaRegular: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Campos Condicionais - Integral */}
            {formData.tipoTurma.includes('integral') && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#1D3557] border-b border-[#e2e8f0] pb-2">
                  Configuração - Turno Integral
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Aulas Diárias <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.aulasDiariasIntegral || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, aulasDiariasIntegral: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Aulas Semanais <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.aulasSemanaisIntegral || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, aulasSemanaisIntegral: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Aulas Anuais
                    </Label>
                    <Input
                      type="number"
                      disabled
                      value={formData.aulasSemanaisIntegral && formData.aulasDiariasIntegral 
                        ? formData.aulasSemanaisIntegral * 40 
                        : 0}
                      className="border-2 border-[#e2e8f0] bg-[#f1f5f9]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#334155] font-medium block mb-2">
                      Duração (min) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.duracaoAulaIntegral || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, duracaoAulaIntegral: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={closeModal}
              className="border-2 border-[#e2e8f0]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveMatriz}
              disabled={saving}
              className="bg-[#1D3557] hover:bg-[#16304a] text-white"
            >
              {saving ? 'Salvando...' : 'Salvar Matriz'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Disciplina */}
      <Dialog open={showDisciplinaModal} onOpenChange={setShowDisciplinaModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#0f172a]">
              Adicionar Disciplina - {periodoSelecionado?.periodo_nome}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Disciplina <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={disciplinaForm.disciplinaId} 
                  onValueChange={(value) => setDisciplinaForm(prev => ({ ...prev, disciplinaId: value }))}
                >
                  <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    {disciplinas.map(d => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Tipo de Disciplina
                </Label>
                <Select 
                  value={disciplinaForm.tipoDisciplina} 
                  onValueChange={(value) => setDisciplinaForm(prev => ({ ...prev, tipoDisciplina: value }))}
                >
                  <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    <SelectItem value="base_comum">Base Comum</SelectItem>
                    <SelectItem value="parte_diversificada">Parte Diversificada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={disciplinaForm.desconsideraReprovacao}
                onCheckedChange={(checked) => setDisciplinaForm(prev => ({ ...prev, desconsideraReprovacao: checked as boolean }))}
                className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
              />
              <Label className="text-sm text-[#334155]">Desconsiderar reprovação (nota e frequência)</Label>
            </div>

            {/* Carga Horária Regular */}
            {matrizSelecionada?.tipo_turma?.includes('regular') && (
              <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                <Label className="text-[#334155] font-medium block mb-2">Carga Horária - Regular</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-[#64748b]">Horas</Label>
                    <Input
                      type="number"
                      min="0"
                      value={disciplinaForm.cargaHorariaRegularHoras || ''}
                      onChange={(e) => setDisciplinaForm(prev => ({ ...prev, cargaHorariaRegularHoras: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#64748b]">Minutos</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={disciplinaForm.cargaHorariaRegularMinutos || ''}
                      onChange={(e) => setDisciplinaForm(prev => ({ ...prev, cargaHorariaRegularMinutos: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#64748b]">Total minutos</Label>
                    <Input
                      disabled
                      value={(disciplinaForm.cargaHorariaRegularHoras * 60) + disciplinaForm.cargaHorariaRegularMinutos}
                      className="border-2 border-[#e2e8f0] bg-[#f1f5f9]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Carga Horária Integral */}
            {matrizSelecionada?.tipo_turma?.includes('integral') && (
              <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                <Label className="text-[#334155] font-medium block mb-2">Carga Horária - Integral</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-[#64748b]">Horas</Label>
                    <Input
                      type="number"
                      min="0"
                      value={disciplinaForm.cargaHorariaIntegralHoras || ''}
                      onChange={(e) => setDisciplinaForm(prev => ({ ...prev, cargaHorariaIntegralHoras: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#64748b]">Minutos</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={disciplinaForm.cargaHorariaIntegralMinutos || ''}
                      onChange={(e) => setDisciplinaForm(prev => ({ ...prev, cargaHorariaIntegralMinutos: parseInt(e.target.value) || 0 }))}
                      className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#64748b]">Total minutos</Label>
                    <Input
                      disabled
                      value={(disciplinaForm.cargaHorariaIntegralHoras * 60) + disciplinaForm.cargaHorariaIntegralMinutos}
                      className="border-2 border-[#e2e8f0] bg-[#f1f5f9]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tabs de Habilidades */}
            <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
              <div className="flex border-b border-[#e2e8f0]">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 text-sm font-medium text-[#1D3557] bg-[#f1f5f9] border-b-2 border-[#1D3557]"
                >
                  Habilidades BNCC ({disciplinaForm.habilidadesBNCC.length})
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 text-sm font-medium text-[#64748b] hover:text-[#1D3557]"
                >
                  Outras ({habilidadesManuais.length})
                </button>
              </div>
              
              <div className="p-3 max-h-48 overflow-y-auto">
                <div className="space-y-1">
                  {habilidadesBNCC.slice(0, 20).map(h => (
                    <label key={h.codigo_bncc} className="flex items-start gap-2 cursor-pointer hover:bg-[#f1f5f9] p-1 rounded">
                      <Checkbox
                        checked={disciplinaForm.habilidadesBNCC.includes(h.codigo_bncc)}
                        onCheckedChange={() => toggleHabilidadeBNCC(h.codigo_bncc)}
                        className="mt-0.5 data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                      />
                      <div>
                        <span className="text-xs font-medium text-[#1D3557]">{h.codigo_bncc}</span>
                        <p className="text-xs text-[#64748b] line-clamp-2">{h.descricao}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Habilidades Manuais */}
            <div className="space-y-2">
              <Label className="text-[#334155] font-medium">Adicionar Habilidade Manual</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Código"
                  value={disciplinaForm.habilidadeManualCodigo}
                  onChange={(e) => setDisciplinaForm(prev => ({ ...prev, habilidadeManualCodigo: e.target.value }))}
                  className="border-2 border-[#cbd5e1] focus:border-[#1D3557] w-24"
                />
                <Input
                  placeholder="Descrição"
                  value={disciplinaForm.habilidadeManualDescricao}
                  onChange={(e) => setDisciplinaForm(prev => ({ ...prev, habilidadeManualDescricao: e.target.value }))}
                  className="flex-1 border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                />
                <Button type="button" onClick={addHabilidadeManual} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              
              {habilidadesManuais.length > 0 && (
                <div className="space-y-1 mt-2">
                  {habilidadesManuais.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
                      <div>
                        <span className="text-xs font-medium text-[#1D3557]">{h.codigo}</span>
                        <span className="text-xs text-[#64748b] ml-2">{h.descricao}</span>
                      </div>
                      <button type="button" onClick={() => removeHabilidadeManual(h.id)} className="text-red-500 text-xs hover:underline">
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowDisciplinaModal(false)} className="border-2 border-[#e2e8f0]">
              Cancelar
            </Button>
            <Button onClick={saveDisciplina} className="bg-[#1D3557] hover:bg-[#16304a] text-white">
              Adicionar Disciplina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-medium text-[#1e293b] mb-1">{title}</h3>
      <p className="text-sm text-[#64748b] text-center max-w-xs">{description}</p>
    </div>
  )
}

function MatrizCard({ 
  matriz, 
  onToggle, 
  onDelete,
  disabled 
}: { 
  matriz: any
  onToggle: (ativa: boolean) => void
  onDelete: () => void
  disabled: boolean
}) {
  const etapa = matriz.academico_etapas_ensino
  const metodo = matriz.academico_metodos_avaliacao

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="p-4 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#cbd5e1] transition-all group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-[#0f172a]">{matriz.descricao}</h3>
            {!matriz.ativa && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                Inativa
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#64748b]">
            <div className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              <span>{etapa?.etapa_nome || 'Etapa não informada'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(matriz.data_inicial)} - {formatDate(matriz.data_final)}</span>
            </div>

            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{metodo?.nome || 'Método não informado'}</span>
            </div>

            {matriz.turnos && matriz.turnos.length > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="capitalize">{matriz.turnos.join(', ')}</span>
              </div>
            )}

            {matriz.tipo_turma && matriz.tipo_turma.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="capitalize">{matriz.tipo_turma.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <div className="flex items-center gap-2 mr-2" title={matriz.ativa ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={matriz.ativa}
              onCheckedChange={onToggle}
              disabled={disabled}
              className="data-[state=checked]:bg-[#1D3557] data-[state=unchecked]:bg-[#cbd5e1]"
            />
            <span className="text-xs text-[#64748b]">
              {matriz.ativa ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          {!disabled && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-[#64748b] hover:text-[#1D3557] hover:bg-[#f1f5f9]"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-[#64748b] hover:text-red-600 hover:bg-red-50"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TabMatrizes
