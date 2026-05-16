'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Plus, ClipboardList, Pencil, Trash2, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getFirstSchool } from '@/lib/actions/schools'

interface MetodoAvaliacao {
  id: string
  school_id: string
  nome: string
  descricao: string | null
  criterio_frequencia: 'por_dia' | 'por_aula'
  frecuencia_minima: number
  tipos_avaliacao: string[]
  quantidade_periodos_numerico: number | null
  quantidade_periodos_parecer: number | null
  quantidade_periodos_conceito: number | null
  quantidade_periodos_nivel: number | null
  ativo: boolean
  created_at: string
}

interface Disciplina {
  id: string
  school_id: string
  nome: string
  descricao: string | null
  componente: string
  tipo_ensino: string
  created_at: string
}

export default function MetodosAvaliacaoPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [schoolId, setSchoolId] = useState<string>('')
  const [loadingPage, setLoadingPage] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editando, setEditando] = useState<MetodoAvaliacao | null>(null)
  const [metodoCriado, setMetodoCriado] = useState<MetodoAvaliacao | null>(null)
  const [showPeriodos, setShowPeriodos] = useState(false)
  const [showDisciplinasModal, setShowDisciplinasModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<{tipo: string, numero: number} | null>(null)
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [periodoDisciplinas, setPeriodoDisciplinas] = useState<Record<string, Disciplina[]>>({})
  const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(new Set())
  const [metodos, setMetodos] = useState<MetodoAvaliacao[]>([])
  
  // Conceitos
  const [conceitos, setConceitos] = useState<Array<{descricao: string, sigla: string, cor_fundo: string, cor_letra: string}>>([])
  const [conceitosFinais, setConceitosFinais] = useState<Array<{descricao: string, sigla: string, cor_fundo: string, cor_letra: string}>>([])
  const [utilizaConceitoFinal, setUtilizaConceitoFinal] = useState(false)
  const [showConceitoModal, setShowConceitoModal] = useState(false)
  const [editandoConceito, setEditandoConceito] = useState<{index: number, isFinal: boolean} | null>(null)
  const [editandoConceitoFinal, setEditandoConceitoFinal] = useState(false)
  const [novoConceito, setNovoConceito] = useState({descricao: '', sigla: '', cor_fundo: '#E2E8F0', cor_letra: '#1E293B'})
  
  // Níveis de Desenvolvimento
  const [niveis, setNiveis] = useState<Array<{nome: string, descricao: string, cor_fundo: string, cor_letra: string, ordem: number}>>([])
  const [showNivelModal, setShowNivelModal] = useState(false)
  const [editandoNivel, setEditandoNivel] = useState<number | null>(null)
  const [novoNivel, setNovoNivel] = useState({nome: '', descricao: '', cor_fundo: '#E2E8F0', cor_letra: '#1E293B', ordem: 0})

  const [formData, setFormData] = useState<{
    descricao: string
    criterio_frequencia: 'por_dia' | 'por_aula'
    frecuencia_minima: number
    tipos_avaliacao: string[]
    quantidade_periodos_numerico: number | null
    quantidade_periodos_parecer: number | null
    quantidade_periodos_conceito: number | null
    quantidade_periodos_nivel: number | null
    // Configurações Numéricas
    forma_registro: 'inteiro' | 'decimal'
    permite_recuperacoes: string[]
    tipo_media_periodo: 'ponderada' | 'somatoria'
    tipo_resultado_final: 'media_periodos' | 'somatoria'
    media_maxima_periodo: number
    permite_conselho_componente: boolean
    media_minima_conselho: boolean
    usa_media_5_conceito: boolean
    recuperacao_substitutiva: boolean
    recuperacao_periodo_substitutiva: boolean
    avaliacao_reclassificacao: boolean
    // Aprovação Direta
    aprovacao_automatica: boolean
    media_minima_aprovacao: number
    pesos_periodos: number[]
    // Aprovação por Recuperação
    media_minima_recuperacao: number
    media_ponderada_recuperacao: boolean
    peso_media_anual: number
    peso_recuperacao_final: number
  }>({
    nome: '',
    descricao: '',
    criterio_frequencia: 'por_dia',
    frecuencia_minima: 75.0,
    tipos_avaliacao: [],
    quantidade_periodos_numerico: 4,
    quantidade_periodos_parecer: null,
    quantidade_periodos_conceito: null,
    quantidade_periodos_nivel: null,
    // Configurações Numéricas
    forma_registro: 'decimal',
    permite_recuperacoes: [],
    tipo_media_periodo: 'ponderada',
    tipo_resultado_final: 'media_periodos',
    media_maxima_periodo: 10.0,
    permite_conselho_componente: false,
    media_minima_conselho: false,
    usa_media_5_conceito: false,
    recuperacao_substitutiva: false,
    recuperacao_periodo_substitutiva: false,
    avaliacao_reclassificacao: false,
    // Aprovação Direta
    aprovacao_automatica: false,
    media_minima_aprovacao: 6.0,
    pesos_periodos: [],
    // Aprovação por Recuperação
    media_minima_recuperacao: 6.0,
    media_ponderada_recuperacao: true,
    peso_media_anual: 1,
    peso_recuperacao_final: 1,
    // Parecer Descritivo
    registro_geral: false,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const loadSchool = async () => {
        try {
          const school = await getFirstSchool()
          setSchoolId(school.id)
        } catch (error) {
          console.error('Erro ao carregar escola:', error)
        }
      }
      loadSchool()
    }
  }, [user])

  useEffect(() => {
    if (schoolId) {
      loadMetodos()
      loadDisciplinas()
    }
  }, [schoolId])

  async function loadMetodos() {
    try {
      setLoadingPage(true)
      const { data, error } = await supabase
        .from('academico_metodos_avaliacao')
        .select('*')
        .eq('school_id', schoolId)
        .order('nome')

      if (error) throw error
      setMetodos(data || [])
    } catch (error) {
      console.error('Erro ao carregar métodos:', error)
      toast.error('Erro ao carregar métodos')
    } finally {
      setLoadingPage(false)
    }
  }

  async function loadDisciplinas() {
    try {
      const { data, error } = await supabase
        .from('academico_disciplinas')
        .select('*')
        .eq('school_id', schoolId)
        .order('nome')

      if (error) throw error
      setDisciplinas(data || [])
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error)
      toast.error('Erro ao carregar disciplinas')
    }
  }

  function openCreateModal() {
    setEditando(null)
    setFormData({
      descricao: '',
      criterio_frequencia: 'por_dia',
      frecuencia_minima: 75.0,
      tipos_avaliacao: [],
      quantidade_periodos_numerico: 4,
      quantidade_periodos_parecer: null,
      quantidade_periodos_conceito: null,
      quantidade_periodos_nivel: null,
      // Configurações Numéricas
      forma_registro: 'decimal',
      permite_recuperacoes: [],
      tipo_media_periodo: 'ponderada',
      tipo_resultado_final: 'media_periodos',
      media_maxima_periodo: 10.0,
      permite_conselho_componente: false,
      media_minima_conselho: false,
      usa_media_5_conceito: false,
      recuperacao_substitutiva: false,
      recuperacao_periodo_substitutiva: false,
      avaliacao_reclassificacao: false,
      // Aprovação Direta
      aprovacao_automatica: false,
      media_minima_aprovacao: 6.0,
      pesos_periodos: [],
      // Aprovação por Recuperação
      media_minima_recuperacao: 6.0,
      media_ponderada_recuperacao: true,
      peso_media_anual: 1,
      peso_recuperacao_final: 1,
      // Parecer Descritivo
      registro_geral: false,
    })
    setShowModal(true)
  }

  function openEditModal(metodo: MetodoAvaliacao) {
    setEditando(metodo)
    setFormData({
      descricao: metodo.nome || metodo.descricao || '',
      criterio_frequencia: metodo.criterio_frequencia,
      frecuencia_minima: metodo.frecuencia_minima,
      tipos_avaliacao: metodo.tipos_avaliacao || [],
      quantidade_periodos_numerico: metodo.quantidade_periodos_numerico || 4,
      quantidade_periodos_parecer: metodo.quantidade_periodos_parecer,
      quantidade_periodos_conceito: metodo.quantidade_periodos_conceito,
      quantidade_periodos_nivel: metodo.quantidade_periodos_nivel,
      // Configurações Numéricas - defaults since not in current interface
      forma_registro: 'decimal',
      permite_recuperacoes: [],
      tipo_media_periodo: 'ponderada',
      tipo_resultado_final: 'media_periodos',
      media_maxima_periodo: 10.0,
      permite_conselho_componente: false,
      media_minima_conselho: false,
      usa_media_5_conceito: false,
      recuperacao_substitutiva: false,
      recuperacao_periodo_substitutiva: false,
      avaliacao_reclassificacao: false,
      // Aprovação Direta
      aprovacao_automatica: false,
      media_minima_aprovacao: 6.0,
      pesos_periodos: [],
      // Aprovação por Recuperação
      media_minima_recuperacao: 6.0,
      media_ponderada_recuperacao: true,
      peso_media_anual: 1,
      peso_recuperacao_final: 1,
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditando(null)
    setMetodoCriado(null)
    setShowPeriodos(false)
    setPeriodoDisciplinas({})
    setExpandedPeriods(new Set())
  }

  async function handleSave() {
    if (!formData.descricao.trim()) {
      toast.error('Descrição é obrigatória')
      return
    }

    if (formData.tipos_avaliacao.length === 0) {
      toast.error('Selecione pelo menos um tipo de avaliação')
      return
    }

    try {
      setSaving(true)

      if (editando) {
        const { error } = await supabase
          .from('academico_metodos_avaliacao')
          .update({
            nome: formData.descricao,
            descricao: formData.descricao || null,
            criterio_frequencia: formData.criterio_frequencia,
            frecuencia_minima: formData.frecuencia_minima,
            tipos_avaliacao: formData.tipos_avaliacao,
            quantidade_periodos_numerico: formData.tipos_avaliacao.includes('numerico') ? formData.quantidade_periodos_numerico : null,
            quantidade_periodos_parecer: formData.tipos_avaliacao.includes('parecer') ? formData.quantidade_periodos_parecer : null,
            quantidade_periodos_conceito: formData.tipos_avaliacao.includes('conceito') ? formData.quantidade_periodos_conceito : null,
            quantidade_periodos_nivel: formData.tipos_avaliacao.includes('nivel') ? formData.quantidade_periodos_nivel : null,
          })
          .eq('id', editando.id)

        if (error) throw error

        // Salvar configuração de parecer descritivo
        if (formData.tipos_avaliacao.includes('parecer')) {
          const { error: errorParecer } = await supabase
            .from('academico_metodos_parecer')
            .upsert({
              metodo_id: editando.id,
              registro_geral: formData.registro_geral,
            }, { onConflict: 'metodo_id' })
          
          if (errorParecer) {
            console.error('Erro ao salvar parecer:', errorParecer)
          }
        }

        toast.success('Método atualizado!')
        closeModal()
        loadMetodos()
      } else {
        const { data, error } = await supabase
          .from('academico_metodos_avaliacao')
          .insert({
            school_id: schoolId,
            nome: formData.descricao,
            descricao: formData.descricao || null,
            criterio_frequencia: formData.criterio_frequencia,
            frecuencia_minima: formData.frecuencia_minima,
            tipos_avaliacao: formData.tipos_avaliacao,
            quantidade_periodos_numerico: formData.tipos_avaliacao.includes('numerico') ? formData.quantidade_periodos_numerico : null,
            quantidade_periodos_parecer: formData.tipos_avaliacao.includes('parecer') ? formData.quantidade_periodos_parecer : null,
            quantidade_periodos_conceito: formData.tipos_avaliacao.includes('conceito') ? formData.quantidade_periodos_conceito : null,
            quantidade_periodos_nivel: formData.tipos_avaliacao.includes('nivel') ? formData.quantidade_periodos_nivel : null,
          })
          .select()
          .single()

        if (error) throw error
        const metodoSalvo = data

        // Salvar configuração de parecer descritivo
        if (formData.tipos_avaliacao.includes('parecer')) {
          const { error: errorParecer } = await supabase
            .from('academico_metodos_parecer')
            .insert({
              metodo_id: metodoSalvo.id,
              registro_geral: formData.registro_geral,
            })
          
          if (errorParecer) {
            console.error('Erro ao salvar parecer:', errorParecer)
          }
        }

        setMetodoCriado(metodoSalvo as MetodoAvaliacao)
        setShowPeriodos(true)
        toast.success('Método criado! Configure os períodos abaixo.')
      }

      // Não fechar modal nem recarregar lista ainda
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar método')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleAtivo(metodo: MetodoAvaliacao) {
    try {
      const { error } = await supabase
        .from('academico_metodos_avaliacao')
        .update({ ativo: !metodo.ativo })
        .eq('id', metodo.id)

      if (error) throw error

      setMetodos(prev => prev.map(m =>
        m.id === metodo.id ? { ...m, ativo: !m.ativo } : m
      ))

      toast.success(metodo.ativo ? 'Método desativado' : 'Método ativado')
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast.error('Erro ao atualizar método')
    }
  }

  async function handleDelete(metodo: MetodoAvaliacao) {
    if (!confirm('Tem certeza que deseja excluir este método?')) return

    try {
      const { error } = await supabase
        .from('academico_metodos_avaliacao')
        .delete()
        .eq('id', metodo.id)

      if (error) throw error

      setMetodos(prev => prev.filter(m => m.id !== metodo.id))
      toast.success('Método excluído')
    } catch (error) {
      console.error('Erro ao excluir:', error)
      toast.error('Erro ao excluir método')
    }
  }

  function toggleTipoAvaliacao(tipo: string) {
    setFormData(prev => {
      const tiposAtuais = prev.tipos_avaliacao
      const novosTipos = tiposAtuais.includes(tipo)
        ? tiposAtuais.filter(t => t !== tipo)
        : [...tiposAtuais, tipo]

      const resetPeriodos = tiposAtuais.includes(tipo) ? { [getPeriodoField(tipo)]: null } : {}

      return {
        ...prev,
        tipos_avaliacao: novosTipos,
        ...resetPeriodos
      }
    })
  }

  function getPeriodoField(tipo: string): string {
    switch (tipo) {
      case 'numerico': return 'quantidade_periodos_numerico'
      case 'parecer': return 'quantidade_periodos_parecer'
      case 'conceito': return 'quantidade_periodos_conceito'
      case 'nivel': return 'quantidade_periodos_nivel'
      default: return ''
    }
  }

  function replicarDisciplinas() {
    if (!metodoCriado) return

    const periodos = gerarPeriodos(metodoCriado)
    if (periodos.length < 2) return

    const primeiroPeriodo = periodos[0]
    const primeiroKey = `${primeiroPeriodo.tipo}-${primeiroPeriodo.numero}`
    const disciplinasPrimeiro = periodoDisciplinas[primeiroKey] || []

    const novasDisciplinas: Record<string, any[]> = { ...periodoDisciplinas }

    periodos.slice(1).forEach(periodo => {
      const key = `${periodo.tipo}-${periodo.numero}`
      novasDisciplinas[key] = [...disciplinasPrimeiro]
    })

    setPeriodoDisciplinas(novasDisciplinas)
    toast.success('Disciplinas replicadas para todos os períodos')
  }

  // Gerar períodos baseados nos tipos selecionados
  function gerarPeriodos(metodo: MetodoAvaliacao) {
    const periodos: Array<{tipo: string, numero: number, nome: string, quantidade: number}> = []

    metodo.tipos_avaliacao?.forEach(tipo => {
      const quantidade = metodo[getPeriodoField(tipo) as keyof MetodoAvaliacao] as number
      if (quantidade) {
        for (let i = 1; i <= quantidade; i++) {
          periodos.push({
            tipo,
            numero: i,
            nome: `${i}º ${tipo === 'numerico' ? 'Bimestre' : tipo === 'parecer' ? 'Semestre' : 'Período'}`,
            quantidade
          })
        }
      }
    })

    // Remover duplicatas e ordenar
    const uniquePeriodos = periodos.filter((periodo, index, self) =>
      index === self.findIndex(p => p.numero === periodo.numero && p.tipo === periodo.tipo)
    )

    return uniquePeriodos.sort((a, b) => a.numero - b.numero)
  }

  const getTipoLabel = (tipos: string[]) => {
    const labels = tipos.map(tipo => {
      switch (tipo) {
        case 'numerico': return 'Numérico'
        case 'parecer': return 'Parecer'
        case 'conceito': return 'Conceito'
        case 'nivel': return 'Nível'
        default: return tipo
      }
    })
    return labels.join(', ')
  }

  if (loading || !schoolId) {
    return (
      <>
        <Sidebar />
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] md:pl-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3557] mx-auto mb-4"></div>
            <p className="text-[#64748b]">Carregando...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/gestao-academica/estrutura-academica')}
            className="mb-4 text-[#64748b] hover:text-[#1D3557] hover:bg-[#f1f5f9] p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Gestão Acadêmica
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0f172a]">Métodos de Avaliação</h1>
              <p className="text-[#64748b] mt-1">
                Configure os critérios de avaliação para as matrizes curriculares
              </p>
            </div>
            <Button
              size="sm"
              className="bg-[#1D3557] hover:bg-[#16304a] text-white"
              onClick={openCreateModal}
            >
              <Plus className="w-4 h-4 mr-1" />
              Novo Método
            </Button>
          </div>
        </div>

        {loadingPage ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-[#e2e8f0] rounded-full mb-3"></div>
              <div className="h-4 w-32 bg-[#e2e8f0] rounded"></div>
            </div>
          </div>
        ) : metodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border border-[#e2e8f0]">
            <div className="w-20 h-20 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mb-4">
              <ClipboardList className="w-10 h-10 text-[#94a3b8]" />
            </div>
            <h3 className="text-base font-medium text-[#1e293b] mb-1">
              Nenhum método encontrado
            </h3>
            <p className="text-sm text-[#64748b] text-center max-w-xs">
              Clique em "Novo Método" para criar o primeiro método de avaliação.
            </p>
          </div>
        ) : (
          <div className="border border-[#e2e8f0] rounded-lg overflow-hidden bg-white">
            <table className="w-full">
              <thead className="bg-[#f1f5f9]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#1D3557] uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#1D3557] uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#1D3557] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#1D3557] uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {metodos.map(metodo => (
                  <tr key={metodo.id} className="hover:bg-[#f8fafc]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0f172a]">{metodo.nome}</div>
                      {metodo.descricao && (
                        <div className="text-xs text-[#64748b] mt-0.5">{metodo.descricao}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#334155]">
                        {getTipoLabel(metodo.tipos_avaliacao || [])}
                      </span>
                      <div className="text-xs text-[#94a3b8]">
                        {metodo.tipos_avaliacao?.length || 0} tipos
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={metodo.ativo}
                          onCheckedChange={() => handleToggleAtivo(metodo)}
                          className="data-[state=checked]:bg-[#1D3557] data-[state=unchecked]:bg-[#cbd5e1]"
                        />
                        <span className={`text-xs font-medium ${metodo.ativo ? 'text-green-600' : 'text-gray-500'}`}>
                          {metodo.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#64748b] hover:text-[#1D3557] hover:bg-[#f1f5f9]"
                          onClick={() => openEditModal(metodo)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#64748b] hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(metodo)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#0f172a]">
              {editando ? 'Editar Método' : 'Novo Método de Avaliação'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-[#334155] font-medium block mb-2">
                Descrição
              </Label>
              <Input
                placeholder="Ex: Bimestral, Trimestral, Anual..."
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Critério de Frequência <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.criterio_frequencia}
                  onValueChange={(value: 'por_dia' | 'por_aula') => setFormData(prev => ({ ...prev, criterio_frequencia: value }))}
                >
                  <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    <SelectItem value="por_dia">Por Dia Letivo</SelectItem>
                    <SelectItem value="por_aula">Por Aula Dada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Frequência Mínima (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.frecuencia_minima}
                  onChange={(e) => setFormData(prev => ({ ...prev, frecuencia_minima: parseFloat(e.target.value) || 0 }))}
                  className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                />
              </div>
            </div>

            <div>
              <Label className="text-[#334155] font-medium block mb-3">
                Tipos de Avaliação <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'numerico', label: 'Numérico', desc: 'Notas numéricas (0-10)' },
                  { id: 'parecer', label: 'Parecer Descritivo', desc: 'Avaliação por texto' },
                  { id: 'conceito', label: 'Conceito', desc: 'Avaliação por conceitos (A, B, C...)' },
                  { id: 'nivel', label: 'Nível de Desenvolvimento', desc: 'Avaliação por níveis' }
                ].map(tipo => (
                  <div 
                    key={tipo.id} 
                    className={`relative flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      formData.tipos_avaliacao.includes(tipo.id) 
                        ? 'border-[#1D3557] bg-[#1D3557]/5' 
                        : 'border-[#cbd5e1] hover:border-[#457B9D]'
                    }`}
                    onClick={() => toggleTipoAvaliacao(tipo.id)}
                  >
                    <Checkbox
                      checked={formData.tipos_avaliacao.includes(tipo.id)}
                      onCheckedChange={() => toggleTipoAvaliacao(tipo.id)}
                      className="mt-0.5 border-2 border-[#94a3b8] data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                    />
                    <div className="flex-1">
                      <Label className="text-sm text-[#334155] font-medium cursor-pointer">{tipo.label}</Label>
                      <p className="text-xs text-[#64748b]">{tipo.desc}</p>
                    </div>
                    {formData.tipos_avaliacao.includes(tipo.id) && (
                      <div className="w-20">
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          placeholder="Períodos"
                          value={(formData[getPeriodoField(tipo.id) as keyof typeof formData] as number | null) || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            [getPeriodoField(tipo.id)]: parseInt(e.target.value) || null
                          }))}
                          className="border-2 border-[#cbd5e1] focus:border-[#1D3557] text-xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Configuração de Avaliações Numéricas */}
            {formData.tipos_avaliacao.includes('numerico') && (
              <div className="space-y-6 border-t border-[#e2e8f0] pt-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#1D3557] mb-4">
                    Configuração de Avaliações Numéricas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#334155] font-medium block mb-2">
                        Forma de Registro
                      </Label>
                      <Select
                        value={formData.forma_registro}
                        onValueChange={(value: 'inteiro' | 'decimal') => setFormData(prev => ({ ...prev, forma_registro: value }))}
                      >
                        <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={5}>
                          <SelectItem value="inteiro">Inteiro</SelectItem>
                          <SelectItem value="decimal">Decimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#334155] font-medium block mb-3">
                        Permite Recuperação
                      </Label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { id: 'avaliacao', label: 'Por Avaliação' },
                          { id: 'periodo', label: 'Por Período' },
                          { id: 'final', label: 'Final' }
                        ].map(opcao => (
                          <div 
                            key={opcao.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.permite_recuperacoes?.includes(opcao.id)
                                ? 'border-[#1D3557] bg-[#1D3557]/5'
                                : 'border-[#cbd5e1] hover:border-[#457B9D]'
                            }`}
                            onClick={() => {
                              const novas = formData.permite_recuperacoes?.includes(opcao.id)
                                ? formData.permite_recuperacoes.filter(r => r !== opcao.id)
                                : [...(formData.permite_recuperacoes || []), opcao.id]
                              setFormData(prev => ({ ...prev, permite_recuperacoes: novas }))
                            }}
                          >
                            <Checkbox
                              checked={formData.permite_recuperacoes?.includes(opcao.id)}
                              onCheckedChange={() => {}}
                              className="border-2 border-[#94a3b8] data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                            />
                            <Label className="text-sm text-[#334155] cursor-pointer">{opcao.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#334155] font-medium block mb-2">
                        Tipo de Média do Período
                      </Label>
                      <Select
                        value={formData.tipo_media_periodo}
                        onValueChange={(value: 'ponderada' | 'somatoria') => setFormData(prev => ({ ...prev, tipo_media_periodo: value }))}
                      >
                        <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={5}>
                          <SelectItem value="ponderada">Ponderada</SelectItem>
                          <SelectItem value="somatoria">Somatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#334155] font-medium block mb-2">
                        Tipo de Resultado Final
                      </Label>
                      <Select
                        value={formData.tipo_resultado_final}
                        onValueChange={(value: 'media_periodos' | 'somatoria') => setFormData(prev => ({ ...prev, tipo_resultado_final: value }))}
                      >
                        <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={5}>
                          <SelectItem value="media_periodos">Média dos Períodos</SelectItem>
                          <SelectItem value="somatoria">Somatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#334155] font-medium block mb-2">
                        Média Máxima no Período
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="20"
                        value={formData.media_maxima_periodo}
                        onChange={(e) => setFormData(prev => ({ ...prev, media_maxima_periodo: parseFloat(e.target.value) || 0 }))}
                        className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label className="text-[#334155] font-medium block mb-3">
                      Configurações Adicionais
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { key: 'permite_conselho_componente', label: 'Permite Conselho de Classe por Componente' },
                        { key: 'media_minima_conselho', label: 'Atribui média mínima para aprovados em Conselho' },
                        { key: 'usa_media_5_conceito', label: 'Utiliza média 5º conceito' },
                        { key: 'recuperacao_substitutiva', label: 'A recuperação é substitutiva', disabled: !formData.permite_recuperacoes.includes('avaliacao') },
                        { key: 'recuperacao_periodo_substitutiva', label: 'A recuperação por período é substitutiva', disabled: !formData.permite_recuperacoes.includes('periodo') },
                        { key: 'avaliacao_reclassificacao', label: 'Realiza avaliação de reclassificação' }
                      ].map(config => (
                        <div key={config.key} className="flex items-center gap-2">
                          <Checkbox
                            checked={formData[config.key as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [config.key]: checked === true }))}
                            disabled={config.disabled}
                            className="border-2 border-[#94a3b8] data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                          />
                          <Label className="text-sm text-[#334155]">{config.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subcard: Aprovação Direta */}
                <div className="border border-[#e2e8f0] rounded-lg p-4">
                  <h4 className="text-md font-semibold text-[#1D3557] mb-4">
                    Aprovação Direta
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.aprovacao_automatica}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, aprovacao_automatica: checked === true }))}
                          className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                        />
                      <Label className="text-sm text-[#334155]">Aprovação Automática</Label>
                    </div>

                    {!formData.aprovacao_automatica && (
                      <>
                        <div>
                          <Label className="text-[#334155] font-medium block mb-2">
                            Média Mínima
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            value={formData.media_minima_aprovacao}
                            onChange={(e) => setFormData(prev => ({ ...prev, media_minima_aprovacao: parseFloat(e.target.value) || 0 }))}
                            className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                          />
                        </div>

                        <div>
                          <Label className="text-[#334155] font-medium block mb-2">
                            Pesos por Período
                          </Label>
                          <div className="text-xs text-[#64748b] mb-2">
                            Configure o peso de cada período ({formData.quantidade_periodos_numerico} períodos)
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {Array.from({length: formData.quantidade_periodos_numerico || 4}, (_, i) => (
                              <div key={i}>
                                <Input
                                  type="number"
                                  min="1"
                                  value={formData.pesos_periodos[i] || 1}
                                  onChange={(e) => {
                                    const novosPesos = [...formData.pesos_periodos]
                                    novosPesos[i] = parseFloat(e.target.value) || 1
                                    setFormData(prev => ({ ...prev, pesos_periodos: novosPesos }))
                                  }}
                                  className="border-2 border-[#cbd5e1] focus:border-[#1D3557] text-center"
                                  placeholder={`P${i+1}`}
                                />
                                <span className="text-xs text-[#64748b] block text-center mt-1">P{i+1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Subcard: Aprovação por Recuperação */}
                {formData.permite_recuperacoes?.includes('final') && (
                  <div className="border border-[#e2e8f0] rounded-lg p-4">
                    <h4 className="text-md font-semibold text-[#1D3557] mb-4">
                      Aprovação por Recuperação
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-[#334155] font-medium block mb-2">
                          Média Mínima após Recuperação
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="20"
                          value={formData.media_minima_recuperacao}
                          onChange={(e) => setFormData(prev => ({ ...prev, media_minima_recuperacao: parseFloat(e.target.value) || 0 }))}
                          className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.media_ponderada_recuperacao}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, media_ponderada_recuperacao: checked === true }))}
                          className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                        />
                        <Label className="text-sm text-[#334155]">Média Ponderada</Label>
                      </div>

                      {formData.media_ponderada_recuperacao && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[#334155] font-medium block mb-2">
                              Peso Média Anual
                            </Label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              value={formData.peso_media_anual}
                              onChange={(e) => setFormData(prev => ({ ...prev, peso_media_anual: parseFloat(e.target.value) || 0 }))}
                              className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                            />
                          </div>

                          <div>
                            <Label className="text-[#334155] font-medium block mb-2">
                              Peso Recuperação Final
                            </Label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              value={formData.peso_recuperacao_final}
                              onChange={(e) => setFormData(prev => ({ ...prev, peso_recuperacao_final: parseFloat(e.target.value) || 0 }))}
                              className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Subcard: Configuração de Arredondamento */}
                <div className="border border-[#e2e8f0] rounded-lg p-4">
                  <h4 className="text-md font-semibold text-[#1D3557] mb-4">
                    Configuração de Arredondamento
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#334155] font-medium block mb-2">
                        Tipo de Arredondamento
                      </Label>
                      <Select value="meio_ponto" onValueChange={() => {}}>
                        <SelectTrigger className="border-2 border-[#cbd5e1] focus:border-[#1D3557]">
                          <SelectValue placeholder="Meio Ponto" />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={5}>
                          <SelectItem value="meio_ponto">Meio Ponto</SelectItem>
                          <SelectItem value="decimal">Decimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#334155] font-medium block mb-2">
                          Intervalo Inicial
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="3"
                          className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                        />
                      </div>

                      <div>
                        <Label className="text-[#334155] font-medium block mb-2">
                          Intervalo Final
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="7"
                          className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#334155] font-medium block mb-2">
                        Aplicar Arredondamento em
                      </Label>
                      <div className="space-y-2">
                        {[
                          { key: 'media_periodo', label: 'Média do Período' },
                          { key: 'media_anual', label: 'Média Anual' },
                          { key: 'media_final', label: 'Média Final' }
                        ].map(option => (
                          <div key={option.key} className="flex items-center gap-2">
                            <Checkbox
                              checked={true}
                              onCheckedChange={() => {}}
                              className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                            />
                            <Label className="text-sm text-[#334155]">{option.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card: Configuração de Pareceres Descritivos */}
            {formData.tipos_avaliacao.includes('parecer') && (
              <div className="space-y-6 border-t border-[#e2e8f0] pt-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#1D3557] mb-4">
                    Configuração de Pareceres Descritivos
                  </h3>

                  <div className="flex items-center gap-3 p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                    <Checkbox
                      checked={formData.registro_geral}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, registro_geral: checked === true }))}
                      className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                    />
                    <div>
                      <Label className="text-sm text-[#334155] font-medium">Registro de Parecer Geral</Label>
                      <p className="text-xs text-[#64748b]">
                        Se marcado, permite registrar um único parecer para todas as disciplinas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Card: Configuração de Conceitos */}
            {formData.tipos_avaliacao.includes('conceito') && (
              <div className="space-y-6 border-t border-[#e2e8f0] pt-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#1D3557] mb-4">
                    Configuração de Conceitos
                  </h3>

                  {/* Lista de Conceitos */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-[#334155] font-medium">Conceitos</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white"
                        onClick={() => {
                          setEditandoConceito(null)
                          setNovoConceito({descricao: '', sigla: '', cor_fundo: '#E2E8F0', cor_letra: '#1E293B'})
                          setShowConceitoModal(true)
                        }}
                        disabled={conceitos.length >= 6}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        + Novo Conceito
                      </Button>
                    </div>

                    {conceitos.length === 0 ? (
                      <div className="text-sm text-[#64748b] italic p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                        Nenhum conceito adicionado. Clique em "Adicionar Conceito" para criar (máx 6).
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {conceitos.map((conceito, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                            <div className="flex items-center gap-3">
                              <div 
                                className="px-3 py-1 rounded text-xs font-medium"
                                style={{backgroundColor: conceito.cor_fundo, color: conceito.cor_letra}}
                              >
                                {conceito.sigla}
                              </div>
                              <span className="text-sm text-[#334155]">{conceito.descricao}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7 text-[#64748b] hover:text-[#1D3557]"
                                onClick={() => {
                                  setEditandoConceito({index, isFinal: false})
                                  setNovoConceito(conceito)
                                  setShowConceitoModal(true)
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7 text-[#64748b] hover:text-red-600"
                                onClick={() => {
                                  setConceitos(prev => prev.filter((_, i) => i !== index))
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-[#64748b]">
                      Máximo de 6 conceitos permitidos (RN02)
                    </p>
                  </div>

                  {/* Conceito Final */}
                  <div className="border border-[#e2e8f0] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Checkbox
                        checked={utilizaConceitoFinal}
                        onCheckedChange={(checked) => {
                          setUtilizaConceitoFinal(checked === true)
                          if (!checked) setConceitosFinais([])
                        }}
                        className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                      />
                      <Label className="text-sm text-[#334155] font-medium">Utiliza Conceito Final</Label>
                    </div>

                    {utilizaConceitoFinal && (
                      <div className="space-y-3 pl-8">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-[#64748b]">Conceitos Finais</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white"
                            onClick={() => {
                              setEditandoConceito(null)
                              setEditandoConceitoFinal(true)
                              setNovoConceito({descricao: '', sigla: '', cor_fundo: '#15803d', cor_letra: '#FFFFFF'})
                              setShowConceitoModal(true)
                            }}
                            disabled={conceitosFinais.length >= 6}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            + Novo
                          </Button>
                        </div>

                        {conceitosFinais.length === 0 ? (
                          <div className="text-xs text-[#64748b] italic p-3 bg-[#f8fafc] rounded">
                            Nenhum conceito final adicionado.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {conceitosFinais.map((conceito, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="px-2 py-0.5 rounded text-xs font-medium"
                                    style={{backgroundColor: conceito.cor_fundo, color: conceito.cor_letra}}
                                  >
                                    {conceito.sigla}
                                  </div>
                                  <span className="text-xs text-[#334155]">{conceito.descricao}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="h-6 w-6 text-[#64748b] hover:text-[#1D3557]"
                                    onClick={() => {
                                      setEditandoConceito({index, isFinal: true})
                                      setEditandoConceitoFinal(true)
                                      setNovoConceito(conceito)
                                      setShowConceitoModal(true)
                                    }}
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="h-6 w-6 text-[#64748b] hover:text-red-600"
                                    onClick={() => {
                                      setConceitosFinais(prev => prev.filter((_, i) => i !== index))
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-[#64748b]">
                          Máximo de 6 conceitos finais permitidos
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Card: Configuração de Níveis de Desenvolvimento */}
            {formData.tipos_avaliacao.includes('nivel') && (
              <div className="space-y-6 border-t border-[#e2e8f0] pt-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#1D3557] mb-4">
                    Configuração de Níveis de Desenvolvimento
                  </h3>

                  <div className="flex items-center gap-3 p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] mb-4">
                    <Checkbox
                      checked={formData.usa_media_5_conceito}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, usa_media_5_conceito: checked === true }))}
                      className="data-[state=checked]:bg-[#1D3557] data-[state=checked]:border-[#1D3557]"
                    />
                    <div>
                      <Label className="text-sm text-[#334155] font-medium">Usa média 5.0 para conceito</Label>
                      <p className="text-xs text-[#64748b]">
                        Considera média mínima 5.0 para aprovação (seguindo RN02)
                      </p>
                    </div>
                  </div>

                  {/* Lista de Níveis */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-[#334155] font-medium">Níveis de Desenvolvimento</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white"
                        onClick={() => {
                          setEditandoNivel(null)
                          setNovoNivel({nome: '', descricao: '', cor_fundo: '#E2E8F0', cor_letra: '#1E293B', ordem: niveis.length + 1})
                          setShowNivelModal(true)
                        }}
                        disabled={niveis.length >= 6}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        + Novo Nível de Desenvolvimento
                      </Button>
                    </div>

                    {niveis.length === 0 ? (
                      <div className="text-sm text-[#64748b] italic p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                        Nenhum nível adicionado. Clique em "+ Novo Nível de Desenvolvimento" para criar (máx 6).
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {niveis.map((nivel, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                            <div className="flex items-center gap-3">
                              <div 
                                className="px-3 py-1 rounded text-xs font-medium"
                                style={{backgroundColor: nivel.cor_fundo, color: nivel.cor_letra}}
                              >
                                {nivel.ordem}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-[#334155]">{nivel.nome}</span>
                                <p className="text-xs text-[#64748b]">{nivel.descricao}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7 text-[#64748b] hover:text-[#1D3557]"
                                onClick={() => {
                                  setEditandoNivel(index)
                                  setNovoNivel(nivel)
                                  setShowNivelModal(true)
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="h-7 w-7 text-[#64748b] hover:text-red-600"
                                onClick={() => {
                                  const novosNiveis = niveis.filter((_, i) => i !== index).map((n, i) => ({...n, ordem: i + 1}))
                                  setNiveis(novosNiveis)
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-[#64748b]">
                      Máximo de 5 níveis permitidos. A ordem determina a progression (1 = menor, 5 = maior).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seção de Períodos - PARTE 3 */}
          {showPeriodos && metodoCriado && (
            <div className="space-y-4 border-t border-[#e2e8f0] pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1D3557] border-b border-[#e2e8f0] pb-2">
                  Configuração de Períodos
                </h3>
                {gerarPeriodos(metodoCriado).length > 1 && (
                  <Button variant="outline" size="sm" className="text-xs" onClick={replicarDisciplinas}>
                    Replicar para os demais períodos
                  </Button>
                )}
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {gerarPeriodos(metodoCriado).map((periodo) => {
                  const periodoKey = `${periodo.tipo}-${periodo.numero}`
                  const isExpanded = expandedPeriods.has(periodoKey)
                  const selectedDisciplinas = periodoDisciplinas[periodoKey] || []

                  return (
                    <div key={periodoKey} className="border border-[#e2e8f0] rounded-lg hover:border-[#1D3557] transition-colors">
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => {
                          setExpandedPeriods(prev => {
                            const newSet = new Set(prev)
                            if (newSet.has(periodoKey)) {
                              newSet.delete(periodoKey)
                            } else {
                              newSet.add(periodoKey)
                            }
                            return newSet
                          })
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-[#64748b]" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-[#64748b]" />
                            )}
                            <span className="text-sm font-medium text-[#0f172a]">{periodo.nome}</span>
                            <span className="text-xs text-[#64748b] capitalize">({periodo.tipo})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#64748b]">
                              {selectedDisciplinas.length} disciplinas
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedPeriod({tipo: periodo.tipo, numero: periodo.numero})
                                setShowDisciplinasModal(true)
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Adicionar Disciplinas
                            </Button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-[#e2e8f0] pt-3">
                          {selectedDisciplinas.length === 0 ? (
                            <div className="text-xs text-[#64748b] italic">
                              Nenhuma disciplina adicionada
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {selectedDisciplinas.map(disciplina => (
                                <div key={disciplina.id} className="flex items-center justify-between bg-[#f8fafc] p-2 rounded">
                                  <span className="text-xs text-[#0f172a]">{disciplina.nome}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-[#64748b] hover:text-red-600"
                                    onClick={() => {
                                      setPeriodoDisciplinas(prev => ({
                                        ...prev,
                                        [periodoKey]: prev[periodoKey].filter(d => d.id !== disciplina.id)
                                      }))
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="text-xs text-[#64748b] bg-[#f8fafc] p-3 rounded-lg">
                💡 Configure as disciplinas para cada período. Use "Replicar para os demais períodos" para copiar a configuração do 1º período para todos os outros.
              </div>
            </div>
          )}

          {!showPeriodos ? (
            <DialogFooter className="gap-3">
              <Button variant="outline" onClick={closeModal} className="border-2 border-[#e2e8f0]">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-[#1D3557] hover:bg-[#16304a] text-white">
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter className="gap-3">
              <Button variant="outline" onClick={() => setShowPeriodos(false)} className="border-2 border-[#e2e8f0]">
                Voltar
              </Button>
              <Button onClick={closeModal} className="bg-[#1D3557] hover:bg-[#16304a] text-white">
                Finalizar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDisciplinasModal} onOpenChange={(open) => !open && setShowDisciplinasModal(false)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#0f172a]">
              Adicionar Disciplinas - {selectedPeriod ? `${selectedPeriod.numero}º ${selectedPeriod.tipo === 'numerico' ? 'Bimestre' : selectedPeriod.tipo === 'parecer' ? 'Semestre' : 'Período'}` : ''}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Tabs defaultValue="selecionar" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="selecionar">Selecionar Disciplinas</TabsTrigger>
                <TabsTrigger value="habilidades">Configurar Habilidades</TabsTrigger>
              </TabsList>

              <TabsContent value="selecionar" className="space-y-4">
                <div className="border border-[#e2e8f0] rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {disciplinas.map(disciplina => {
                      const periodoKey = selectedPeriod ? `${selectedPeriod.tipo}-${selectedPeriod.numero}` : ''
                      const isSelected = periodoDisciplinas[periodoKey]?.some(d => d.id === disciplina.id) || false

                      return (
                        <div key={disciplina.id} className="flex items-center gap-3 p-2 rounded hover:bg-[#f8fafc]">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              setPeriodoDisciplinas(prev => {
                                const key = periodoKey
                                const current = prev[key] || []
                                if (checked) {
                                  return { ...prev, [key]: [...current, disciplina] }
                                } else {
                                  return { ...prev, [key]: current.filter(d => d.id !== disciplina.id) }
                                }
                              })
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-[#0f172a]">{disciplina.nome}</div>
                            {disciplina.descricao && (
                              <div className="text-xs text-[#64748b]">{disciplina.descricao}</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="habilidades" className="space-y-4">
                <div className="border border-[#e2e8f0] rounded-lg p-4">
                  {(() => {
                    const periodoKey = selectedPeriod ? `${selectedPeriod.tipo}-${selectedPeriod.numero}` : ''
                    const selectedDisciplinas = periodoDisciplinas[periodoKey] || []

                    if (selectedDisciplinas.length === 0) {
                      return (
                        <div className="text-center py-8 text-[#64748b]">
                          Selecione disciplinas primeiro na aba &quot;Selecionar Disciplinas&quot;
                        </div>
                      )
                    }

                    return (
                      <Tabs defaultValue={selectedDisciplinas[0]?.id} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                          {selectedDisciplinas.map(disciplina => (
                            <TabsTrigger key={disciplina.id} value={disciplina.id} className="text-xs">
                              {disciplina.nome}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {selectedDisciplinas.map(disciplina => (
                          <TabsContent key={disciplina.id} value={disciplina.id} className="space-y-4">
                            <div className="font-medium text-[#0f172a]">{disciplina.nome}</div>
                            <div className="text-xs text-[#64748b] bg-[#f8fafc] p-3 rounded">
                              Aqui serão listadas as habilidades BNCC para esta disciplina. Em desenvolvimento.
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    )
                  })()}
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-xs text-[#64748b] bg-[#f8fafc] p-3 rounded-lg">
              💡 Selecione as disciplinas na primeira aba, depois configure as habilidades específicas na segunda aba.
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowDisciplinasModal(false)} className="border-2 border-[#e2e8f0]">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setShowDisciplinasModal(false)
                toast.success('Disciplinas adicionadas ao período')
              }}
              className="bg-[#1D3557] hover:bg-[#16304a] text-white"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Conceito */}
      <Dialog open={showConceitoModal} onOpenChange={(open) => !open && setShowConceitoModal(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#0f172a]">
              {editandoConceito !== null ? 'Editar Conceito' : 'Novo Conceito'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-[#334155] font-medium block mb-2">
                Descrição do Conceito
              </Label>
              <Input
                placeholder="Ex: Satisfatório, Ótimo, Regular..."
                value={novoConceito.descricao}
                onChange={(e) => setNovoConceito(prev => ({ ...prev, descricao: e.target.value }))}
                className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
              />
            </div>

            <div>
              <Label className="text-[#334155] font-medium block mb-2">
                Sigla do Conceito <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ex: O, B, R, MB (máx 4 caracteres)"
                value={novoConceito.sigla}
                maxLength={4}
                onChange={(e) => setNovoConceito(prev => ({ ...prev, sigla: e.target.value.toUpperCase() }))}
                className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
              />
              <p className="text-xs text-[#64748b] mt-1">{novoConceito.sigla.length}/4 caracteres</p>
            </div>

            <div>
              <Label className="text-[#334155] font-medium block mb-3">
                Cor do Conceito (WCAG AA/AAA)
              </Label>
              <p className="text-xs text-[#64748b] mb-2">Selecione uma combinação de cores com contraste aprovado</p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Cores de Fundo */}
                <div>
                  <Label className="text-xs text-[#64748b] block mb-2">Cor de Fundo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { cor: '#166534', nome: 'Verde Escuro' },
                      { cor: '#15803d', nome: 'Verde' },
                      { cor: '#1D4ED8', nome: 'Azul' },
                      { cor: '#1E40AF', nome: 'Azul Escuro' },
                      { cor: '#7C3AED', nome: 'Roxo' },
                      { cor: '#BE185D', nome: 'Rosa' },
                      { cor: '#C2410C', nome: 'Laranja' },
                      { cor: '#92400E', nome: 'Ambar' },
                      { cor: '#E2E8F0', nome: 'Cinza' },
                    ].map(cor => (
                      <button
                        key={cor.cor}
                        type="button"
                        onClick={() => setNovoConceito(prev => ({ ...prev, cor_fundo: cor.cor, cor_letra: '#FFFFFF' }))}
                        className={`h-8 rounded border-2 transition-all ${
                          novoConceito.cor_fundo === cor.cor 
                            ? 'border-[#1D3557] ring-2 ring-[#1D3557]/30' 
                            : 'border-[#cbd5e1]'
                        }`}
                        style={{ backgroundColor: cor.cor }}
                        title={cor.nome}
                      />
                    ))}
                  </div>
                </div>

                {/* Cores de Letra */}
                <div>
                  <Label className="text-xs text-[#64748b] block mb-2">Cor da Letra</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { cor: '#FFFFFF', nome: 'Branco' },
                      { cor: '#000000', nome: 'Preto' },
                      { cor: '#FEF3C7', nome: 'Amarelo Claro' },
                      { cor: '#DCFCE7', nome: 'Verde Claro' },
                      { cor: '#DBEAFE', nome: 'Azul Claro' },
                      { cor: '#F3E8FF', nome: 'Roxo Claro' },
                    ].map(cor => (
                      <button
                        key={cor.cor}
                        type="button"
                        onClick={() => setNovoConceito(prev => ({ ...prev, cor_letra: cor.cor }))}
                        className={`h-8 rounded border-2 transition-all flex items-center justify-center text-xs font-bold ${
                          novoConceito.cor_letra === cor.cor 
                            ? 'border-[#1D3557] ring-2 ring-[#1D3557]/30' 
                            : 'border-[#cbd5e1]'
                        }`}
                        style={{ backgroundColor: cor.cor, color: cor.cor === '#FFFFFF' || cor.cor === '#FEF3C7' || cor.cor === '#DCFCE7' || cor.cor === '#DBEAFE' || cor.cor === '#F3E8FF' ? '#000' : '#FFF' }}
                        title={cor.nome}
                      >
                        Aa
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4 p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                <Label className="text-xs text-[#64748b] block mb-2">Preview</Label>
                <div className="flex items-center gap-3">
                  <div 
                    className="px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
                    style={{ backgroundColor: novoConceito.cor_fundo, color: novoConceito.cor_letra }}
                  >
                    {novoConceito.sigla || 'A'}
                  </div>
                  <span className="text-sm text-[#334155]">{novoConceito.descricao || 'Descrição...'}</span>
                </div>
                <p className="text-xs text-[#64748b] mt-2">
                  Contraste: {novoConceito.cor_fundo === '#E2E8F0' ? 'Baixo' : 'Alto (WCAG AA/AAA)'}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowConceitoModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (!novoConceito.sigla.trim()) {
                  toast.error('Sigla é obrigatória')
                  return
                }
                if (!novoConceito.descricao.trim()) {
                  toast.error('Descrição é obrigatória')
                  return
                }

                if (editandoConceito) {
                  if (editandoConceito.isFinal) {
                    const novos = [...conceitosFinais]
                    novos[editandoConceito.index] = novoConceito
                    setConceitosFinais(novos)
                  } else {
                    const novos = [...conceitos]
                    novos[editandoConceito.index] = novoConceito
                    setConceitos(novos)
                  }
                } else if (editandoConceitoFinal) {
                  setConceitosFinais(prev => [...prev, novoConceito])
                } else {
                  setConceitos(prev => [...prev, novoConceito])
                }
                setEditandoConceitoFinal(false)
                setShowConceitoModal(false)
              }}
              className="bg-[#1D3557] hover:bg-[#163454]"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Nível de Desenvolvimento */}
      <Dialog open={showNivelModal} onOpenChange={(open) => !open && setShowNivelModal(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#0f172a]">
              {editandoNivel !== null ? 'Editar Nível de Desenvolvimento' : 'Novo Nível de Desenvolvimento'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-[#334155] font-medium block mb-2">
                Descrição do Nível
              </Label>
              <Input
                placeholder="Ex: Em Desenvolvimento, Satisfatório, Ótimo..."
                value={novoNivel.nome}
                onChange={(e) => setNovoNivel(prev => ({ ...prev, nome: e.target.value }))}
                className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
              />
            </div>

            <div>
              <Label className="text-[#334155] font-medium block mb-2">
                Sigla do Nível <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ex: ED, SF, OT (máx 4 caracteres)"
                value={novoNivel.descricao}
                maxLength={4}
                onChange={(e) => setNovoNivel(prev => ({ ...prev, descricao: e.target.value.toUpperCase() }))}
                className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
              />
              <p className="text-xs text-[#64748b] mt-1">{novoNivel.descricao.length}/4 caracteres</p>
            </div>

            <div>
              <Label className="text-[#334155] font-medium block mb-3">
                Cor do Nível (WCAG AA/AAA)
              </Label>
              <p className="text-xs text-[#64748b] mb-2">Selecione uma combinação de cores com contraste aprovado</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-[#64748b] block mb-2">Cor de Fundo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { cor: '#166534', nome: 'Verde Escuro' },
                      { cor: '#15803d', nome: 'Verde' },
                      { cor: '#1D4ED8', nome: 'Azul' },
                      { cor: '#1E40AF', nome: 'Azul Escuro' },
                      { cor: '#7C3AED', nome: 'Roxo' },
                      { cor: '#BE185D', nome: 'Rosa' },
                      { cor: '#C2410C', nome: 'Laranja' },
                      { cor: '#92400E', nome: 'Ambar' },
                      { cor: '#E2E8F0', nome: 'Cinza' },
                    ].map(cor => (
                      <button
                        key={cor.cor}
                        type="button"
                        onClick={() => setNovoNivel(prev => ({ ...prev, cor_fundo: cor.cor, cor_letra: '#FFFFFF' }))}
                        className={`h-8 rounded border-2 transition-all ${
                          novoNivel.cor_fundo === cor.cor 
                            ? 'border-[#1D3557] ring-2 ring-[#1D3557]/30' 
                            : 'border-[#cbd5e1]'
                        }`}
                        style={{ backgroundColor: cor.cor }}
                        title={cor.nome}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-[#64748b] block mb-2">Cor da Letra</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { cor: '#FFFFFF', nome: 'Branco' },
                      { cor: '#000000', nome: 'Preto' },
                      { cor: '#FEF3C7', nome: 'Amarelo Claro' },
                      { cor: '#DCFCE7', nome: 'Verde Claro' },
                      { cor: '#DBEAFE', nome: 'Azul Claro' },
                      { cor: '#F3E8FF', nome: 'Roxo Claro' },
                    ].map(cor => (
                      <button
                        key={cor.cor}
                        type="button"
                        onClick={() => setNovoNivel(prev => ({ ...prev, cor_letra: cor.cor }))}
                        className={`h-8 rounded border-2 transition-all flex items-center justify-center text-xs font-bold ${
                          novoNivel.cor_letra === cor.cor 
                            ? 'border-[#1D3557] ring-2 ring-[#1D3557]/30' 
                            : 'border-[#cbd5e1]'
                        }`}
                        style={{ backgroundColor: cor.cor, color: cor.cor === '#FFFFFF' || cor.cor === '#FEF3C7' || cor.cor === '#DCFCE7' || cor.cor === '#DBEAFE' || cor.cor === '#F3E8FF' ? '#000' : '#FFF' }}
                        title={cor.nome}
                      >
                        Aa
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                <Label className="text-xs text-[#64748b] block mb-2">Preview</Label>
                <div className="flex items-center gap-3">
                  <div 
                    className="px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
                    style={{ backgroundColor: novoNivel.cor_fundo, color: novoNivel.cor_letra }}
                  >
                    {novoNivel.descricao || 'ED'}
                  </div>
                  <span className="text-sm text-[#334155]">{novoNivel.nome || 'Descrição...'}</span>
                </div>
                <p className="text-xs text-[#64748b] mt-2">
                  Ordem: {novoNivel.ordem}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowNivelModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (!novoNivel.descricao.trim()) {
                  toast.error('Sigla é obrigatória')
                  return
                }
                if (!novoNivel.nome.trim()) {
                  toast.error('Descrição é obrigatória')
                  return
                }

                if (editandoNivel !== null) {
                  const novos = [...niveis]
                  novos[editandoNivel] = novoNivel
                  setNiveis(novos)
                } else {
                  setNiveis(prev => [...prev, novoNivel])
                }
                setShowNivelModal(false)
              }}
              className="bg-[#1D3557] hover:bg-[#163454]"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}