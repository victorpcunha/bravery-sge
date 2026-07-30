'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Badge } from '@/components/ui/badge'
import { PillToggleGroup } from '@/components/ui/pill-toggle'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronRight,
  AlertCircle, Layers, BookOpen, ListChecks, Import, X
} from 'lucide-react'
import {
  getIndicadores, createIndicador, updateIndicador, deleteIndicador,
  importarIndicadoresDaMatriz, salvarNiveisIndicador, getIndicadorNiveis, deleteIndicadorNivel,
  getCamposExperiencia, getPeriodosMatriz,
  getOpcoesRegistro, getDisciplinasMatriz,
  type FiltrosIndicadores,
} from '@/lib/actions/indicadores'
import { getEtapasEnsino, getSubetapas } from '@/lib/actions/etapas-ensino'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { getDisciplinas } from '@/lib/actions/matrizes'

function formatNome(nome: string) {
  if (!nome) return ''
  return nome
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function IndicadoresPage() {
  const router = useRouter()
  const { user, schoolId, isSuperAdmin, allSchools, loading: authLoading } = useAuth()

  // Filtros
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [etapas, setEtapas] = useState<any[]>([])
  const [subetapas, setSubetapas] = useState<any[]>([])
  const [camposExperiencia, setCamposExperiencia] = useState<string[]>([])
  const [disciplinasMatriz, setDisciplinasMatriz] = useState<any[]>([])
  const [disciplinasEscola, setDisciplinasEscola] = useState<any[]>([])

  const [filtroAno, setFiltroAno] = useState('')
  const [filtroEtapa, setFiltroEtapa] = useState('')
  const [filtroSubetapa, setFiltroSubetapa] = useState('')
  const [filtroCampo, setFiltroCampo] = useState('')
  const [filtroDisciplina, setFiltroDisciplina] = useState('')

  const [etapaAtual, setEtapaAtual] = useState<any>(null)
  const [isInfantil, setIsInfantil] = useState(false)

  // Indicadores
  const [indicadores, setIndicadores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [importando, setImportando] = useState(false)

  const effectiveSchoolId = selectedSchoolId || schoolId

  // Dialog criacao/edicao
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    descricao: '',
    periodo_ids: [] as string[],
  })

  // Estado do formulario de criacao
  const [formContexto, setFormContexto] = useState({
    ano_letivo_id: '',
    etapa_ensino_id: '',
    subetapa_ids: [] as string[],
    campo_experiencia: '',
    disciplina_id: '',
  })

  // Dados auxiliares do formulario
  const [formSubetapas, setFormSubetapas] = useState<any[]>([])
  const [formPeriodos, setFormPeriodos] = useState<any[]>([])
  const [formOpcoes, setFormOpcoes] = useState<any[]>([])
  const [formCampos, setFormCampos] = useState<string[]>([])
  const [formDisciplinas, setFormDisciplinas] = useState<any[]>([])
  const [formIsInfantil, setFormIsInfantil] = useState(false)

  // Niveis de Desenvolvimento no formulario
  const [formNiveisMetodo, setFormNiveisMetodo] = useState<string[]>([])
  const [formNiveisPersonalizados, setFormNiveisPersonalizados] = useState<{ id?: string; descricao: string; sigla: string }[]>([])
  const [novoNivelDescricao, setNovoNivelDescricao] = useState('')
  const [novoNivelSigla, setNovoNivelSigla] = useState('')

  // Arvore expansivel
  const [expandedGrupos, setExpandedGrupos] = useState<Record<string, boolean>>({})
  const [expandedSubgrupos, setExpandedSubgrupos] = useState<Record<string, boolean>>({})

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteConfirmDesc, setDeleteConfirmDesc] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    loadInitial()
  }, [user, effectiveSchoolId])

  const loadInitial = async () => {
    try {
      const [anos, etapasList, campos] = await Promise.all([
        getAnosLetivosAtivos(effectiveSchoolId!),
        getEtapasEnsino(effectiveSchoolId!, undefined, true),
        getCamposExperiencia(),
      ])
      setAnosLetivos(anos)
      setEtapas(etapasList)
      setCamposExperiencia(campos)

      // Carregar todas as disciplinas da escola para o filtro
      if (effectiveSchoolId) {
        getDisciplinas(effectiveSchoolId).then(setDisciplinasEscola).catch(() => {})
      }

      const ativo = anos.find((a: any) => a.status === 'ativo')
      // Não auto-selecionar - usuário escolhe manualmente
    } catch (e) {
      console.error('Erro init:', e)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  // Carregar indicadores quando filtros mudam
  useEffect(() => {
    if (!filtroAno || !filtroEtapa) return
    loadIndicadores()
  }, [effectiveSchoolId, filtroAno, filtroEtapa, filtroSubetapa, filtroCampo, filtroDisciplina])

  const loadIndicadores = async () => {
    setLoading(true)
    try {
      const filtros: FiltrosIndicadores = {}
      if (filtroAno) filtros.ano_letivo_id = filtroAno
      if (filtroEtapa) {
        // Encontrar todos os UUIDs para o mesmo etapa_codigo (evita duplicatas ano_letivo_id null vs 2026)
        const etapaSelecionada = etapas.find((e: any) => e.id === filtroEtapa)
        if (etapaSelecionada) {
          const todosIds = etapas.filter((e: any) => e.etapa_codigo === etapaSelecionada.etapa_codigo).map((e: any) => e.id)
          filtros.etapa_ensino_ids = todosIds
        }
      }
      if (filtroSubetapa) filtros.subetapa_id = filtroSubetapa
      if (filtroCampo) filtros.campo_experiencia = filtroCampo
      if (filtroDisciplina) filtros.disciplina_id = filtroDisciplina

      const data = await getIndicadores(null, filtros)
      setIndicadores(data)
    } catch (e) {
      console.error('Erro loadIndicadores:', e)
      toast.error('Erro ao carregar indicadores')
    } finally {
      setLoading(false)
    }
  }

  // Ao mudar etapa no filtro, carregar subetapas e determinar tipo
  const handleFiltroEtapaChange = async (val: string) => {
    setFiltroEtapa(val)
    setFiltroSubetapa('')
    setFiltroCampo('')
    setFiltroDisciplina('')
    setExpandedGrupos({})
    setExpandedSubgrupos({})

    const etapa = etapas.find(e => e.id === val)
    setEtapaAtual(etapa)
    const infantil = etapa?.etapa_tipo?.toLowerCase().includes('infantil') || false
    setIsInfantil(infantil)

    if (val) {
      const [subs, disciplinas] = await Promise.all([
        getSubetapas(val),
        infantil ? Promise.resolve([]) : getDisciplinasMatriz(effectiveSchoolId!, filtroAno, val),
      ])
      setSubetapas(subs)
      setDisciplinasMatriz(disciplinas)
    } else {
      setSubetapas([])
      setDisciplinasMatriz([])
    }
  }

  // Recarregar disciplinas quando o ano letivo mudar (se etapa ja estiver selecionada)
  useEffect(() => {
    if (!filtroAno || !filtroEtapa) return
    const etapa = etapas.find(e => e.id === filtroEtapa)
    const infantil = etapa?.etapa_tipo?.toLowerCase().includes('infantil') || false
    if (infantil) return
    getDisciplinasMatriz(effectiveSchoolId!, filtroAno, filtroEtapa)
      .then(setDisciplinasMatriz)
      .catch(() => setDisciplinasMatriz([]))
  }, [filtroAno, filtroEtapa])

  const resetFormNiveis = () => {
    setFormNiveisMetodo([])
    setFormNiveisPersonalizados([])
    setNovoNivelDescricao('')
    setNovoNivelSigla('')
  }

  const adicionarNivelPersonalizado = () => {
    const desc = novoNivelDescricao.trim()
    if (!desc) { toast.error('Digite uma descricao para o nivel'); return }
    if (formNiveisPersonalizados.some(n => n.descricao.toLowerCase() === desc.toLowerCase())) {
      toast.error('Ja existe um nivel com esta descricao'); return
    }
    setFormNiveisPersonalizados(prev => [...prev, { descricao: desc, sigla: novoNivelSigla.trim() }])
    setNovoNivelDescricao('')
    setNovoNivelSigla('')
  }

  const removerNivelPersonalizado = (index: number) => {
    const nivel = formNiveisPersonalizados[index]
    if (nivel.id) {
      deleteIndicadorNivel(nivel.id).catch(() => {})
    }
    setFormNiveisPersonalizados(prev => prev.filter((_, i) => i !== index))
  }

  // Abrir dialog de novo indicador
  const openNewDialog = async () => {
    setEditId(null)
    setFormData({ descricao: '', periodo_ids: [] })
    setFormContexto({
      ano_letivo_id: '',
      etapa_ensino_id: '',
      subetapa_ids: [],
      campo_experiencia: '',
      disciplina_id: '',
    })
    setFormPeriodos([])
    setFormOpcoes([])
    setFormSubetapas([])
    setFormCampos(camposExperiencia)
    setFormDisciplinas([])
    setFormIsInfantil(false)
    resetFormNiveis()

    const etapa = etapas.find(e => e.id === filtroEtapa)
    if (etapa) setFormIsInfantil(etapa.etapa_tipo?.toLowerCase().includes('infantil'))

    if (filtroEtapa) {
      const subs = await getSubetapas(filtroEtapa)
      setFormSubetapas(subs)
    }
    if (filtroAno && filtroEtapa) {
      const [periodos, opcoes, disciplinas] = await Promise.all([
        getPeriodosMatriz(effectiveSchoolId!, filtroAno, filtroEtapa),
        getOpcoesRegistro(effectiveSchoolId!, filtroAno, filtroEtapa),
        formIsInfantil ? Promise.resolve([]) : getDisciplinas(effectiveSchoolId!),
      ])
      setFormPeriodos(periodos)
      setFormOpcoes(opcoes)
      setFormDisciplinas(disciplinas)
    }
    setDialogOpen(true)
  }

  // Abrir dialog de edicao
  const openEditDialog = async (ind: any) => {
    setEditId(ind.id)
    setFormData({
      descricao: ind.descricao || '',
      periodo_ids: ind.periodos_ids || [],
    })
    setFormContexto({
      ano_letivo_id: ind.ano_letivo_id,
      etapa_ensino_id: ind.etapa_ensino_id,
      subetapa_ids: ind.subetapa_id ? [ind.subetapa_id] : [],
      campo_experiencia: ind.campo_experiencia || '',
      disciplina_id: ind.disciplina_id || '',
    })

    const infantil = ind.campo_experiencia ? true : false
    setFormIsInfantil(infantil)
    resetFormNiveis()

    if (ind.ano_letivo_id && ind.etapa_ensino_id) {
      const [periodos, opcoes, subs, niveis] = await Promise.all([
        getPeriodosMatriz(effectiveSchoolId!, ind.ano_letivo_id, ind.etapa_ensino_id),
        getOpcoesRegistro(effectiveSchoolId!, ind.ano_letivo_id, ind.etapa_ensino_id),
        getSubetapas(ind.etapa_ensino_id),
        getIndicadorNiveis(ind.id),
      ])
      setFormPeriodos(periodos)
      setFormOpcoes(opcoes)
      setFormSubetapas(subs)

      // Separar niveis em metodo e personalizados
      const metodoIds: string[] = []
      const personalizados: { id: string; descricao: string; sigla: string }[] = []
      for (const n of niveis) {
        if (n.origem === 'metodo' && n.metodo_nivel_id) {
          metodoIds.push(n.metodo_nivel_id)
        } else {
          personalizados.push({ id: n.id, descricao: n.descricao, sigla: n.sigla || '' })
        }
      }
      setFormNiveisMetodo(metodoIds)
      setFormNiveisPersonalizados(personalizados)

      // Carregar disciplinas para exibir valor salvo no Select
      if (!infantil) {
        getDisciplinas(effectiveSchoolId!).then(setFormDisciplinas).catch(() => {})
      }
    }

    setFormCampos(camposExperiencia)
    setDialogOpen(true)
  }

  // Salvar indicador
  const handleSave = async () => {
    if (!formData.descricao.trim()) { toast.error('Descricao obrigatoria'); return }

    try {
      if (editId) {
        await updateIndicador(editId, {
          descricao: formData.descricao,
          periodos_ids: formData.periodo_ids,
        })
        // Salvar niveis
        await salvarNiveisIndicador(editId, {
          metodo_nivel_ids: formNiveisMetodo,
          personalizados: formNiveisPersonalizados.filter(n => !n.id).map(n => ({ descricao: n.descricao, sigla: n.sigla || undefined })),
        })
        toast.success('Indicador atualizado')
      } else {
        const novo = await createIndicador({
          school_id: effectiveSchoolId!,
          ano_letivo_id: formContexto.ano_letivo_id,
          etapa_ensino_id: formContexto.etapa_ensino_id,
          subetapa_id: formContexto.subetapa_ids[0] || null,
          campo_experiencia: formIsInfantil ? formContexto.campo_experiencia || null : null,
          disciplina_id: !formIsInfantil ? formContexto.disciplina_id || null : null,
          descricao: formData.descricao,
          periodos_ids: formData.periodo_ids,
          origem: 'manual',
        })

        // Salvar niveis do novo indicador
        const personalizados = formNiveisPersonalizados.map(n => ({ descricao: n.descricao, sigla: n.sigla || undefined }))
        await salvarNiveisIndicador((novo as any).id, {
          metodo_nivel_ids: formNiveisMetodo,
          personalizados,
        })
        toast.success('Indicador criado')
      }
      setDialogOpen(false)
      loadIndicadores()
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar indicador')
    }
  }

  // Excluir
  const handleDeleteClick = (ind: any) => {
    if (ind.utilizado) {
      toast.error('Este indicador ja foi utilizado em avaliacoes e nao pode ser removido.')
      return
    }
    setDeleteConfirmId(ind.id)
    setDeleteConfirmDesc(ind.descricao)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmId) return
    try {
      await deleteIndicador(deleteConfirmId)
      toast.success('Indicador removido')
      setDeleteConfirmId(null)
      loadIndicadores()
    } catch (e: any) {
      toast.error(e.message || 'Erro ao remover indicador')
    }
  }

  // Toggle expansao
  const toggleGrupo = (key: string) => setExpandedGrupos(prev => ({ ...prev, [key]: !prev[key] }))
  const toggleSubgrupo = (key: string) => setExpandedSubgrupos(prev => ({ ...prev, [key]: !prev[key] }))

  // Agrupar indicadores
  const grupos = agruparIndicadores(indicadores, isInfantil)

  if (authLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
          title="Indicadores de Avaliacao"
          description="Defina os indicadores que os professores utilizarao para avaliar os alunos"
          icon={ListChecks}
      />

      {/* Filtros */}
      <PageSection variant="compact" title="Filtros" className="mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Escola (superadmin apenas) */}
          {isSuperAdmin && allSchools.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Escola</Label>
              <Select value={selectedSchoolId ?? ''} onValueChange={v => {
                setSelectedSchoolId(v || null)
                setFiltroAno('')
                setFiltroEtapa('')
                setFiltroSubetapa('')
                setFiltroCampo('')
                setFiltroDisciplina('')
                setEtapaAtual(null)
                setIsInfantil(false)
                setSubetapas([])
                setDisciplinasMatriz([])
                setIndicadores([])
                setExpandedGrupos({})
                setExpandedSubgrupos({})
              }}>
                <SelectTrigger className="w-auto min-w-[200px] h-9 border-border">
                  <SelectValue placeholder="Selecione uma Escola" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  {allSchools.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Ano Letivo */}
          <div className="w-48">
            <Label className="text-xs text-muted-foreground mb-1 block">Ano Letivo</Label>
            <Select value={filtroAno} onValueChange={v => { setFiltroAno(v); setFiltroEtapa(''); }}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione um ano letivo" />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map((a: any) => (
                  <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Etapa */}
          <div className="w-56">
            <Label className="text-xs text-muted-foreground mb-1 block">Etapa de Ensino</Label>
            <Select value={filtroEtapa} onValueChange={handleFiltroEtapaChange}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {etapas.filter((e: any, i: number, arr: any[]) => arr.findIndex((x: any) => x.etapa_codigo === e.etapa_codigo) === i).map((e: any) => (
                  <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subetapa */}
          {subetapas.length > 0 && (
            <div className="w-48">
              <Label className="text-xs text-muted-foreground mb-1 block">Subetapa</Label>
              <Select value={filtroSubetapa} onValueChange={v => setFiltroSubetapa(v === 'all' ? '' : v)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {subetapas.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Campo de Experiencia (Infantil) */}
          {isInfantil && camposExperiencia.length > 0 && (
            <div className="w-64">
              <Label className="text-xs text-muted-foreground mb-1 block">Campo de Experiencia</Label>
              <Select value={filtroCampo} onValueChange={v => { setFiltroCampo(v === 'all' ? '' : v); setFiltroDisciplina('') }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {camposExperiencia.map(c => (
                    <SelectItem key={c} value={c}>{formatNome(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Disciplina (demais etapas) */}
          {!isInfantil && disciplinasEscola.length > 0 && (
            <div className="w-56">
              <Label className="text-xs text-muted-foreground mb-1 block">Disciplina</Label>
              <Select value={filtroDisciplina} onValueChange={v => { setFiltroDisciplina(v === 'all' ? '' : v); setFiltroCampo('') }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {disciplinasEscola.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{formatNome(d.nome)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </PageSection>

      {/* Listagem hierarquica */}
      <PageSection
        variant="flush"
        title={`${indicadores.length} indicador${indicadores.length !== 1 ? 'es' : ''} encontrado${indicadores.length !== 1 ? 's' : ''}`}
        actions={
          <div className="flex items-center gap-2">
            {filtroAno && filtroEtapa && isInfantil && (
              <Button variant="outline" size="sm"
                onClick={async () => {
                  try {
                    setImportando(true)
                    const result = await importarIndicadoresDaMatriz(effectiveSchoolId!, filtroAno, filtroEtapa)
                    toast.success(`${result.total} indicadores importados`)
                    loadIndicadores()
                  } catch (e: any) {
                    toast.error(e.message || 'Erro ao importar')
                  } finally {
                    setImportando(false)
                  }
                }}
                disabled={importando || !filtroAno || !filtroEtapa}>
                <Import className="h-4 w-4 mr-1" />
                Importar da Matriz
              </Button>
            )}
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-1.5" />
              Novo Indicador
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Carregando...</p>
          </div>
        ) : !filtroAno || !filtroEtapa ? (
          <EmptyState
            icon={ListChecks}
            title="Selecione os filtros"
            description="Selecione o Ano Letivo e a Etapa de Ensino acima para visualizar os indicadores de avaliacao disponiveis."
          />
        ) : indicadores.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nenhum indicador encontrado"
            description={isInfantil ? 'Utilize "Importar da Matriz" para carregar os indicadores da BNCC ou clique em "Novo Indicador" para criar manualmente.' : 'Clique em "Novo Indicador" para criar indicadores de avaliacao personalizados para esta disciplina.'}
          />
        ) : (
          <div className="p-4 space-y-2">
            {grupos.map(grupo => (
              <div key={grupo.key} className="border border-border rounded-lg overflow-hidden">
                {/* Grupo (Campo/Disciplina) */}
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => toggleGrupo(grupo.key)}
                >
                  {expandedGrupos[grupo.key] ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{formatNome(grupo.nome)}</span>
                  <Badge variant="secondary" className="text-[11px] px-1.5 py-0">{grupo.indicadores.length + grupo.subgrupos.reduce((acc, s) => acc + s.indicadores.length, 0)}</Badge>
                </div>

                {expandedGrupos[grupo.key] && (
                  <div className="border-t border-border">
                    {grupo.subgrupos.length > 0 ? (
                      grupo.subgrupos.map(sub => (
                        <div key={sub.key}>
                          <div
                            className="flex items-center gap-2 px-6 py-1.5 bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleSubgrupo(sub.key)}
                          >
                            {expandedSubgrupos[sub.key] ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                            <span className="text-xs font-medium text-muted-foreground">{sub.nome}</span>
                            <Badge variant="outline" className="text-[10px] px-1 py-0">{sub.indicadores.length}</Badge>
                          </div>
                          {expandedSubgrupos[sub.key] && (
                            <div className="border-t border-border">
                              {sub.indicadores.map(ind => renderIndicador(ind))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      grupo.indicadores.map(ind => renderIndicador(ind))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </PageSection>

      {/* Dialog Novo/Editar Indicador */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>{editId ? 'Editar Indicador' : 'Novo Indicador'}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Contexto (bloqueado na edicao) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Ano Letivo</Label>
                <Select value={formContexto.ano_letivo_id}
                  onValueChange={v => setFormContexto(p => ({ ...p, ano_letivo_id: v }))}
                  disabled={!!editId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {anosLetivos.map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Etapa de Ensino</Label>
                <Select value={formContexto.etapa_ensino_id}
                  onValueChange={v => setFormContexto(p => ({ ...p, etapa_ensino_id: v }))}
                  disabled={!!editId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {etapas.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subetapas */}
            {formSubetapas.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Subetapas</Label>
                <div className="flex flex-wrap gap-2">
                  {formSubetapas.map((s: any) => (
                    <label key={s.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <Checkbox
                        checked={formContexto.subetapa_ids.includes(s.id)}
                        onCheckedChange={(checked) => {
                          setFormContexto(p => ({
                            ...p,
                            subetapa_ids: checked
                              ? [...p.subetapa_ids, s.id]
                              : p.subetapa_ids.filter(id => id !== s.id)
                          }))
                        }}
                      />
                      {s.nome}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Campo de Experiencia ou Disciplina */}
            {formIsInfantil ? (
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Campo de Experiencia</Label>
                <Select value={formContexto.campo_experiencia}
                  onValueChange={v => setFormContexto(p => ({ ...p, campo_experiencia: v }))}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {formCampos.map(c => (
                      <SelectItem key={c} value={c}>{formatNome(c)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Disciplina</Label>
                <Select value={formContexto.disciplina_id}
                  onValueChange={v => setFormContexto(p => ({ ...p, disciplina_id: v }))}
                  disabled={!!editId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {formDisciplinas.map((d: any) => (
                      <SelectItem key={d.id} value={d.id}>
                        {formatNome(d.nome)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Descricao */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Descricao do Indicador <span className="text-destructive">*</span></Label>
              <Textarea
                className="border-border min-h-[80px]"
                value={formData.descricao}
                onChange={e => setFormData(p => ({ ...p, descricao: e.target.value }))}
                placeholder="Descreva o criterio de avaliacao..."
              />
            </div>

            {/* Periodos */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Periodos</Label>
              {formPeriodos.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhum periodo disponivel</p>
              ) : (
                <div className="space-y-2">
                  <div className="rounded-md border border-primary/20 bg-primary/[0.04] px-3 py-2.5">
                    <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                      <Switch
                        checked={formData.periodo_ids.length === formPeriodos.length}
                        onCheckedChange={(checked) => {
                          setFormData(p => ({
                            ...p,
                            periodo_ids: checked ? formPeriodos.map(per => per.id) : []
                          }))
                        }}
                      />
                      <div>
                        <span className="text-[13px] font-semibold text-foreground">Todos os periodos</span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {formData.periodo_ids.length === formPeriodos.length
                            ? `${formPeriodos.length} periodo(s) selecionado(s)`
                            : `${formData.periodo_ids.length} de ${formPeriodos.length} periodo(s) selecionado(s)`}
                        </p>
                      </div>
                    </label>
                  </div>
                  <PillToggleGroup
                    multiple
                    selectedValues={formData.periodo_ids}
                    options={formPeriodos.map(p => ({ value: p.id, label: p.periodo_nome }))}
                    onToggleValue={(val) => {
                      setFormData(p => ({
                        ...p,
                        periodo_ids: p.periodo_ids.includes(val)
                          ? p.periodo_ids.filter(id => id !== val)
                          : [...p.periodo_ids, val]
                      }))
                    }}
                  />
                </div>
              )}
            </div>

            {/* Niveis de Desenvolvimento */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted/50 px-4 py-2.5 border-b border-border">
                <h3 className="text-[14px] font-semibold text-foreground">Niveis de Desenvolvimento</h3>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Selecione os niveis do metodo de avaliacao ou crie niveis personalizados
                </p>
              </div>
              <div className="p-4 space-y-4">

              {/* Niveis do Metodo */}
              {formOpcoes.length > 0 && (
                <div>
                  <p className="text-[12px] font-medium text-foreground mb-2">Niveis do Metodo de Avaliacao:</p>
                  <PillToggleGroup
                    multiple
                    selectedValues={formNiveisMetodo}
                    options={formOpcoes.map(op => ({ value: op.id, label: `${op.descricao}${op.sigla ? ` (${op.sigla})` : ''}` }))}
                    onToggleValue={(val) => {
                      setFormNiveisMetodo(prev =>
                        prev.includes(val) ? prev.filter(id => id !== val) : [...prev, val]
                      )
                    }}
                  />
                </div>
              )}

              {/* Niveis Personalizados */}
              <div>
                <p className="text-[12px] font-medium text-foreground mb-2">Niveis Personalizados:</p>

              <div className="border border-border rounded-md p-3 bg-muted/30">

                {formNiveisPersonalizados.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic mb-2">Nenhum nivel personalizado criado.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {formNiveisPersonalizados.map((n, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-md bg-card border border-border px-2 py-1 text-xs">
                        <span className="font-semibold text-primary">{n.sigla || '-'}</span>
                        <span className="text-muted-foreground">{n.descricao}</span>
                        <button
                          type="button"
                          className="ml-0.5 rounded-full hover:bg-muted p-0.5 cursor-pointer"
                          onClick={() => removerNivelPersonalizado(i)}
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Input
                    className="h-7 text-xs flex-1"
                    placeholder="Descricao do nivel..."
                    value={novoNivelDescricao}
                    onChange={e => setNovoNivelDescricao(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); adicionarNivelPersonalizado() } }}
                  />
                  <Input
                    className="h-7 text-xs w-16"
                    placeholder="Sigla"
                    value={novoNivelSigla}
                    onChange={e => setNovoNivelSigla(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); adicionarNivelPersonalizado() } }}
                  />
                  <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap px-2"
                    onClick={adicionarNivelPersonalizado}>
                    + Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-border px-6 py-4 gap-3">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>
              {editId ? 'Salvar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
        title="Remover Indicador"
        description={`Tem certeza que deseja remover o indicador?\n\n"${deleteConfirmDesc}"\n\nEsta acao nao pode ser desfeita automaticamente.`}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </PageContainer>
  )

  // Renderizar um indicador na listagem
  function renderIndicador(ind: any) {
    const origens = (ind.niveis_origens || []) as string[]
    const temMetodo = origens.includes('metodo')
    const temPersonalizado = origens.includes('personalizado')
    const codigoDisplay = ind.codigo ? `${ind.codigo} - ` : ''

    return (
      <div key={ind.id} className="flex items-start justify-between px-6 py-2.5 border-t border-border hover:bg-muted/50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">{codigoDisplay}{ind.descricao}</span>
            {temMetodo && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary font-medium">
                Nivel do Metodo de Avaliacao
              </Badge>
            )}
            {temPersonalizado && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-warning/30 text-warning font-medium">
                Nivel proprio
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
            {ind.periodos_ids && ind.periodos_ids.length > 0 && (
              <span>{ind.periodos_ids.length} periodo(s)</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {ind.utilizado ? (
            <span className="text-[11px] text-muted-foreground italic mr-1" title="Ja utilizado em avaliacoes">
              <AlertCircle className="h-3.5 w-3.5 inline mr-0.5" />
              Em uso
            </span>
          ) : null}
          <Button variant="ghost" size="icon" className="h-7 w-7"
            onClick={() => openEditDialog(ind)} title="Editar">
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7"
            onClick={() => handleDeleteClick(ind)} title="Remover"
            disabled={ind.utilizado}>
            <Trash2 className={`h-3.5 w-3.5 ${ind.utilizado ? 'text-muted-foreground' : 'text-destructive'}`} />
          </Button>
        </div>
      </div>
    )
  }
}

// Funcao de agrupamento
function agruparIndicadores(indicadores: any[], isInfantil: boolean) {
  const gruposMap = new Map<string, { nome: string; subgrupos: Map<string, { nome: string; indicadores: any[] }>; indicadores: any[] }>()

  for (const ind of indicadores) {
    const chaveGrupo = isInfantil ? (ind.campo_experiencia || 'Sem campo') : (ind.disciplina_id || 'sem_id')
    const nomeGrupo = isInfantil ? (ind.campo_experiencia || 'Sem campo') : (ind.disciplina?.nome || 'Sem disciplina')

    if (!gruposMap.has(chaveGrupo)) {
      gruposMap.set(chaveGrupo, {
        nome: nomeGrupo,
        subgrupos: new Map(),
        indicadores: [],
      })
    }

    const grupo = gruposMap.get(chaveGrupo)!

    if (ind.subetapa_id) {
      const subNome = ind.subetapa_nome || 'Subetapa'
      if (!grupo.subgrupos.has(ind.subetapa_id)) {
        grupo.subgrupos.set(ind.subetapa_id, { nome: subNome, indicadores: [] })
      }
      grupo.subgrupos.get(ind.subetapa_id)!.indicadores.push(ind)
    } else {
      grupo.indicadores.push(ind)
    }
  }

  return Array.from(gruposMap.entries()).map(([key, grupo]) => ({
    key,
    nome: grupo.nome,
    indicadores: grupo.indicadores,
    subgrupos: Array.from(grupo.subgrupos.entries()).map(([subKey, sub]) => ({
      key: `${key}_${subKey}`,
      nome: sub.nome,
      indicadores: sub.indicadores,
    })),
  }))
}
