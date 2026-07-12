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
  const { user, schoolId, loading: authLoading } = useAuth()

  // Filtros
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [etapas, setEtapas] = useState<any[]>([])
  const [subetapas, setSubetapas] = useState<any[]>([])
  const [camposExperiencia, setCamposExperiencia] = useState<string[]>([])
  const [disciplinasMatriz, setDisciplinasMatriz] = useState<any[]>([])

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
  const [importando, setImportando] = useState(false)

  // Dialog criação/edição
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    descricao: '',
    periodo_ids: [] as string[],
  })

  // Estado do formulário de criação
  const [formContexto, setFormContexto] = useState({
    ano_letivo_id: '',
    etapa_ensino_id: '',
    subetapa_ids: [] as string[],
    campo_experiencia: '',
    disciplina_id: '',
  })

  // Dados auxiliares do formulário
  const [formSubetapas, setFormSubetapas] = useState<any[]>([])
  const [formPeriodos, setFormPeriodos] = useState<any[]>([])
  const [formOpcoes, setFormOpcoes] = useState<any[]>([])
  const [formCampos, setFormCampos] = useState<string[]>([])
  const [formDisciplinas, setFormDisciplinas] = useState<any[]>([])
  const [formIsInfantil, setFormIsInfantil] = useState(false)

  // Níveis de Desenvolvimento no formulário
  const [formNiveisMetodo, setFormNiveisMetodo] = useState<string[]>([])
  const [formNiveisPersonalizados, setFormNiveisPersonalizados] = useState<{ id?: string; descricao: string; sigla: string }[]>([])
  const [novoNivelDescricao, setNovoNivelDescricao] = useState('')
  const [novoNivelSigla, setNovoNivelSigla] = useState('')

  // Árvore expansível
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
  }, [user])

  const loadInitial = async () => {
    try {
      const [anos, etapasList, campos] = await Promise.all([
        getAnosLetivosAtivos(schoolId!),
        getEtapasEnsino(schoolId!),
        getCamposExperiencia(),
      ])
      setAnosLetivos(anos)
      setEtapas(etapasList)
      setCamposExperiencia(campos)

      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo) setFiltroAno(ativo.id)
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
  }, [schoolId, filtroAno, filtroEtapa, filtroSubetapa, filtroCampo, filtroDisciplina])

  const loadIndicadores = async () => {
    setLoading(true)
    try {
      const filtros: FiltrosIndicadores = {
        ano_letivo_id: filtroAno,
        etapa_ensino_id: filtroEtapa,
      }
      if (filtroSubetapa) filtros.subetapa_id = filtroSubetapa
      if (filtroCampo) filtros.campo_experiencia = filtroCampo
      if (filtroDisciplina) filtros.disciplina_id = filtroDisciplina

      const data = await getIndicadores(schoolId!, filtros)
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
        infantil ? Promise.resolve([]) : getDisciplinasMatriz(schoolId!, filtroAno, val),
      ])
      setSubetapas(subs)
      setDisciplinasMatriz(disciplinas)
    } else {
      setSubetapas([])
      setDisciplinasMatriz([])
    }
  }

  const resetFormNiveis = () => {
    setFormNiveisMetodo([])
    setFormNiveisPersonalizados([])
    setNovoNivelDescricao('')
    setNovoNivelSigla('')
  }

  const adicionarNivelPersonalizado = () => {
    const desc = novoNivelDescricao.trim()
    if (!desc) { toast.error('Digite uma descrição para o nível'); return }
    if (formNiveisPersonalizados.some(n => n.descricao.toLowerCase() === desc.toLowerCase())) {
      toast.error('Já existe um nível com esta descrição'); return
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
      ano_letivo_id: filtroAno,
      etapa_ensino_id: filtroEtapa,
      subetapa_ids: [],
      campo_experiencia: '',
      disciplina_id: '',
    })
    setFormPeriodos([])
    setFormOpcoes([])
    setFormSubetapas([])
    setFormCampos(camposExperiencia)
    setFormDisciplinas([])
    setFormIsInfantil(isInfantil)
    resetFormNiveis()

    const etapa = etapas.find(e => e.id === filtroEtapa)
    if (etapa) setFormIsInfantil(etapa.etapa_tipo?.toLowerCase().includes('infantil'))

    if (filtroEtapa) {
      const subs = await getSubetapas(filtroEtapa)
      setFormSubetapas(subs)
    }
    if (filtroAno && filtroEtapa) {
      const [periodos, opcoes, disciplinas] = await Promise.all([
        getPeriodosMatriz(schoolId, filtroAno, filtroEtapa),
        getOpcoesRegistro(schoolId, filtroAno, filtroEtapa),
        isInfantil ? Promise.resolve([]) : getDisciplinasMatriz(schoolId, filtroAno, filtroEtapa),
      ])
      setFormPeriodos(periodos)
      setFormOpcoes(opcoes)
      setFormDisciplinas(disciplinas)
    }
    setDialogOpen(true)
  }

  // Abrir dialog de edição
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
        getPeriodosMatriz(schoolId, ind.ano_letivo_id, ind.etapa_ensino_id),
        getOpcoesRegistro(schoolId, ind.ano_letivo_id, ind.etapa_ensino_id),
        getSubetapas(ind.etapa_ensino_id),
        getIndicadorNiveis(ind.id),
      ])
      setFormPeriodos(periodos)
      setFormOpcoes(opcoes)
      setFormSubetapas(subs)

      // Separar níveis em método e personalizados
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
    }

    setFormCampos(camposExperiencia)
    setDialogOpen(true)
  }

  // Salvar indicador
  const handleSave = async () => {
    if (!formData.descricao.trim()) { toast.error('Descrição obrigatória'); return }

    try {
      if (editId) {
        await updateIndicador(editId, {
          descricao: formData.descricao,
          periodos_ids: formData.periodo_ids,
        })
        // Salvar níveis
        await salvarNiveisIndicador(editId, {
          metodo_nivel_ids: formNiveisMetodo,
          personalizados: formNiveisPersonalizados.filter(n => !n.id).map(n => ({ descricao: n.descricao, sigla: n.sigla || undefined })),
        })
        toast.success('Indicador atualizado')
      } else {
        const novo = await createIndicador({
          school_id: schoolId!,
          ano_letivo_id: formContexto.ano_letivo_id,
          etapa_ensino_id: formContexto.etapa_ensino_id,
          subetapa_id: formContexto.subetapa_ids[0] || null,
          campo_experiencia: formIsInfantil ? formContexto.campo_experiencia || null : null,
          disciplina_id: !formIsInfantil ? formContexto.disciplina_id || null : null,
          descricao: formData.descricao,
          periodos_ids: formData.periodo_ids,
          origem: 'manual',
        })

        // Salvar níveis do novo indicador
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
      toast.error('Este indicador já foi utilizado em avaliações e não pode ser removido.')
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

  // Toggle expansão
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
          title="Indicadores de Avaliação"
          description="Defina os indicadores que os professores utilizarão para avaliar os alunos"
          icon={ListChecks}
        actions={
          <div className="flex items-center gap-2">
            {filtroAno && filtroEtapa && isInfantil && (
              <Button variant="outline" size="sm"
                onClick={async () => {
                  try {
                    setImportando(true)
                    const result = await importarIndicadoresDaMatriz(schoolId, filtroAno, filtroEtapa)
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
            <Button
              onClick={openNewDialog}
              disabled={!filtroAno || !filtroEtapa}>
              <Plus className="h-4 w-4 mr-1.5" />
              Novo Indicador
            </Button>
          </div>
        }
      />

      {/* Filtros */}
      <PageSection variant="compact" title="Filtros" className="mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Ano Letivo */}
          <div className="w-48">
            <Label className="text-xs text-muted-foreground mb-1 block">Ano Letivo</Label>
            <Select value={filtroAno} onValueChange={v => { setFiltroAno(v); setFiltroEtapa(''); }}>
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

          {/* Etapa */}
          <div className="w-56">
            <Label className="text-xs text-muted-foreground mb-1 block">Etapa de Ensino</Label>
            <Select value={filtroEtapa} onValueChange={handleFiltroEtapaChange}>
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

          {/* Campo de Experiência (Infantil) */}
          {isInfantil && camposExperiencia.length > 0 && (
            <div className="w-64">
              <Label className="text-xs text-muted-foreground mb-1 block">Campo de Experiência</Label>
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
          {!isInfantil && disciplinasMatriz.length > 0 && (
            <div className="w-56">
              <Label className="text-xs text-muted-foreground mb-1 block">Disciplina</Label>
              <Select value={filtroDisciplina} onValueChange={v => { setFiltroDisciplina(v === 'all' ? '' : v); setFiltroCampo('') }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {disciplinasMatriz.map((d: any) => (
                    <SelectItem key={d.disciplina_id} value={d.disciplina_id}>
                      {formatNome(d.academico_disciplinas?.nome || 'Sem nome')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </PageSection>

      {/* Listagem hierárquica */}
      <PageSection
        variant="flush"
        title={`${indicadores.length} indicador${indicadores.length !== 1 ? 'es' : ''} encontrado${indicadores.length !== 1 ? 's' : ''}`}
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
            description="Selecione o Ano Letivo e a Etapa de Ensino acima para visualizar os indicadores de avaliação disponíveis."
          />
        ) : indicadores.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nenhum indicador encontrado"
            description={isInfantil ? 'Utilize "Importar da Matriz" para carregar os indicadores da BNCC ou clique em "Novo Indicador" para criar manualmente.' : 'Clique em "Novo Indicador" para criar indicadores de avaliação personalizados para esta disciplina.'}
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">{editId ? 'Editar Indicador' : 'Novo Indicador'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Contexto (bloqueado na edição) */}
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
                        disabled={!!editId}
                      />
                      {s.nome}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Campo de Experiência ou Disciplina */}
            {formIsInfantil ? (
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Campo de Experiência</Label>
                <Select value={formContexto.campo_experiencia}
                  onValueChange={v => setFormContexto(p => ({ ...p, campo_experiencia: v }))}
                  disabled={!!editId}>
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
                      <SelectItem key={d.disciplina_id} value={d.disciplina_id}>
                        {formatNome(d.academico_disciplinas?.nome || 'Sem nome')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Descrição */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Descrição do Indicador <span className="text-destructive">*</span></Label>
              <Textarea
                className="min-h-[80px]"
                value={formData.descricao}
                onChange={e => setFormData(p => ({ ...p, descricao: e.target.value }))}
                placeholder="Descreva o critério de avaliação..."
              />
            </div>

            {/* Períodos */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Períodos</Label>
              {formPeriodos.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhum período disponível</p>
              ) : (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <Checkbox
                      checked={formData.periodo_ids.length === formPeriodos.length}
                      onCheckedChange={(checked) => {
                        setFormData(p => ({
                          ...p,
                          periodo_ids: checked ? formPeriodos.map(per => per.id) : []
                        }))
                      }}
                    />
                    <span className="font-medium">Todos os períodos</span>
                  </label>
                  {formPeriodos.map((per: any) => (
                    <label key={per.id} className="flex items-center gap-1.5 text-xs cursor-pointer ml-4">
                      <Checkbox
                        checked={formData.periodo_ids.includes(per.id)}
                        onCheckedChange={(checked) => {
                          setFormData(p => ({
                            ...p,
                            periodo_ids: checked
                              ? [...p.periodo_ids, per.id]
                              : p.periodo_ids.filter(id => id !== per.id)
                          }))
                        }}
                      />
                      {per.periodo_nome}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Níveis de Desenvolvimento */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Níveis de Desenvolvimento
                <span className="text-muted-foreground font-normal ml-1">
                  (selecione os níveis do método ou crie níveis personalizados)
                </span>
              </Label>

              {/* Níveis do Método */}
              {formOpcoes.length > 0 && (
                <div className="mb-3">
                  <p className="text-[11px] text-muted-foreground mb-1.5">Níveis do Método de Avaliação:</p>
                  <div className="space-y-1.5">
                    {formOpcoes.map((op: any) => (
                      <label key={op.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <Checkbox
                          checked={formNiveisMetodo.includes(op.id)}
                          onCheckedChange={(checked) => {
                            setFormNiveisMetodo(prev =>
                              checked ? [...prev, op.id] : prev.filter(id => id !== op.id)
                            )
                          }}
                        />
                        {op.descricao} {op.sigla ? `(${op.sigla})` : ''}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Níveis Personalizados */}
              <div className="border border-border rounded-md p-3 bg-muted/30">
                <p className="text-[11px] text-muted-foreground mb-2">Níveis Personalizados:</p>

                {formNiveisPersonalizados.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic mb-2">Nenhum nível personalizado criado.</p>
                ) : (
                  <div className="space-y-1.5 mb-3">
                    {formNiveisPersonalizados.map((n, i) => (
                      <div key={i} className="flex items-center justify-between bg-card border border-border rounded px-2 py-1.5">
                        <span className="text-xs text-foreground">
                          {n.descricao} {n.sigla ? <span className="text-muted-foreground">({n.sigla})</span> : ''}
                        </span>
                        <Button variant="ghost" size="icon" className="h-5 w-5"
                          onClick={() => removerNivelPersonalizado(i)}>
                          <X className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Input
                    className="h-8 text-xs flex-1"
                    placeholder="Descrição do nível..."
                    value={novoNivelDescricao}
                    onChange={e => setNovoNivelDescricao(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); adicionarNivelPersonalizado() } }}
                  />
                  <Input
                    className="h-8 text-xs w-20"
                    placeholder="Sigla"
                    value={novoNivelSigla}
                    onChange={e => setNovoNivelSigla(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); adicionarNivelPersonalizado() } }}
                  />
                  <Button variant="outline" size="sm" className="h-8 text-xs whitespace-nowrap"
                    onClick={adicionarNivelPersonalizado}>
                    + Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
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
        description={`Tem certeza que deseja remover o indicador?\n\n"${deleteConfirmDesc}"\n\nEsta ação não pode ser desfeita automaticamente.`}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </PageContainer>
  )

  // Renderizar um indicador na listagem
  function renderIndicador(ind: any) {
    const origemLabel = ind.origem === 'matriz' ? 'Matriz' : 'Manual'
    const codigoDisplay = ind.codigo ? `${ind.codigo} - ` : ''

    return (
      <div key={ind.id} className="flex items-start justify-between px-6 py-2.5 border-t border-border hover:bg-muted/50 transition-colors group">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">{codigoDisplay}{ind.descricao}</span>
            <Badge variant="outline" className="text-[10px] px-1 py-0">{origemLabel}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
            {ind.periodos_ids && ind.periodos_ids.length > 0 && (
              <span>{ind.periodos_ids.length} período(s)</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {ind.utilizado ? (
            <span className="text-[11px] text-muted-foreground italic mr-1" title="Já utilizado em avaliações">
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

// Função de agrupamento
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
