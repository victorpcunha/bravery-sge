'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Plus, Search, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

const etapas = [
  { value: 'creche', label: 'Creche (0-3 anos)' },
  { value: 'pre-escola', label: 'Pré-escola (4-5 anos)' }
]

const faixas: Record<string, string[]> = {
  creche: ['Bebês (zero a 1 ano e 6 meses)', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)'],
  'pre-escola': ['Crianças pequenas (4 anos a 5 anos e 11 meses)'],
}

export default function ObjetivosPage() {
  const [etapa, setEtapa] = useState('creche')
  const [campoExperiencia, setCampoExperiencia] = useState('all')
  const [faixaEtariaFilter, setFaixaEtariaFilter] = useState('all')
  const [camposList, setCamposList] = useState<string[]>([])
  const [objetivos, setObjetivos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedCampo, setExpandedCampo] = useState<string | null>(null)
  const [form, setForm] = useState({ codigo_bncc: '', descricao: '', campo_experiencia: '', faixa_etaria: '', etapa_obj: 'creche' })

  useEffect(() => { loadCampos() }, [])
  useEffect(() => { setFaixaEtariaFilter('all') }, [etapa])
  useEffect(() => { loadObjectives() }, [etapa, campoExperiencia, faixaEtariaFilter])

  async function loadCampos() {
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase.from('bncc_campos_experiencia').select('nome').order('sigla')
      if (data) setCamposList(data.map((c: any) => c.nome))
    } catch { setCamposList([]) }
  }

  async function loadObjectives() {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      let query = supabase.from('bncc_objetivos').select('*').eq('tipo_ensino', 'infantil').eq('etapa', etapa)
      const { data, error } = await query
      if (error || !data) setObjetivos([])
      else setObjetivos(data)
    } catch { setObjetivos([]) }
    setLoading(false)
  }

  function openNew() {
    setEditando(null)
    setForm({ codigo_bncc: '', descricao: '', campo_experiencia: camposList[0] || '', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', etapa_obj: 'creche' })
    setShowModal(true)
  }

  function openEdit(obj: any) {
    setEditando(obj)
    setForm({ codigo_bncc: obj.codigo_bncc, descricao: obj.descricao, campo_experiencia: obj.campo_experiencia, faixa_etaria: obj.faixa_etaria, etapa_obj: obj.etapa })
    setShowModal(true)
  }

  async function save(keepOpen = false) {
    if (!form.codigo_bncc.trim() || !form.descricao.trim()) {
      toast.error('Código e descrição são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      const supabase = getSupabaseClient()
      const payload = {
        tipo_ensino: 'infantil',
        etapa: form.etapa_obj,
        faixa_etaria: form.faixa_etaria,
        campo_experiencia: form.campo_experiencia,
        codigo_bncc: form.codigo_bncc.toUpperCase(),
        descricao: form.descricao,
      }
      if (editando) {
        const { error } = await supabase.from('bncc_objetivos').update(payload).eq('id', editando.id)
        if (error) throw error
        toast.success('Objetivo atualizado.')
        setShowModal(false)
      } else {
        const { error } = await supabase.from('bncc_objetivos').insert(payload)
        if (error) throw error
        toast.success('Objetivo cadastrado.')
        if (keepOpen) {
          setForm({ codigo_bncc: '', descricao: '', campo_experiencia: camposList[0] || '', faixa_etaria: form.faixa_etaria, etapa_obj: form.etapa_obj })
        } else {
          setShowModal(false)
        }
      }
      loadObjectives()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar.')
    }
    setSaving(false)
  }

  async function excluir(obj: any) {
    if (!confirm(`Excluir "${obj.codigo_bncc}"?`)) return
    try {
      const supabase = getSupabaseClient()
      await supabase.from('bncc_objetivos').delete().eq('id', obj.id)
      toast.success('Objetivo excluído.')
      loadObjectives()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir.')
    }
  }

  const filtered = objetivos.filter(obj => {
    const mCampo = campoExperiencia === 'all' || obj.campo_experiencia === campoExperiencia
    const mFaixa = faixaEtariaFilter === 'all' || obj.faixa_etaria === faixaEtariaFilter
    const mSearch = searchTerm === '' || obj.codigo_bncc.toLowerCase().includes(searchTerm.toLowerCase()) || obj.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    return mCampo && mFaixa && mSearch
  })

  const grouped = filtered.reduce((acc: any, obj: any) => {
    if (!acc[obj.campo_experiencia]) acc[obj.campo_experiencia] = []
    acc[obj.campo_experiencia].push(obj)
    return acc
  }, {})

  return (
    <div className="container mx-auto py-8 px-4 md:pl-64">
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Objetivos de Aprendizagem e Desenvolvimento</h1>
            <p className="text-muted-foreground mt-1">Habilidades e competências do Ensino Infantil conforme BNCC</p>
          </div>
          <Button className="bg-primary hover:bg-secondary" onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" /> Novo Objetivo
          </Button>
        </div>
      </div>

      <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Etapa de Ensino</label>
              <Select value={etapa} onValueChange={setEtapa}>
                <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  {etapas.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0">
              <label className="text-sm font-medium mb-2 block text-foreground">Faixa Etária</label>
              <Select value={faixaEtariaFilter} onValueChange={setFaixaEtariaFilter}>
                <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  <SelectValue placeholder="Selecione" className="overflow-hidden text-ellipsis" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  <SelectItem value="all">Todas as Faixas</SelectItem>
                  {(faixas[etapa] || []).map(f => <SelectItem key={f} value={f} className="whitespace-normal">{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Campo de Experiência</label>
              <Select value={campoExperiencia} onValueChange={setCampoExperiencia}>
                <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  <SelectItem value="all">Todos os Campos</SelectItem>
                  {camposList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <label className="text-sm font-medium mb-2 block text-foreground">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Buscar por código ou descrição..." value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card/80 border border-border rounded-lg focus:border-primary focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-6">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-lg px-4 py-2">{filtered.length} Objetivos cadastrados</Badge>
        {campoExperiencia === 'all' && (
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 text-lg px-4 py-2">{Object.keys(grouped).length} Campos de Experiência</Badge>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum objetivo encontrado</h3>
            <p className="text-muted-foreground text-center">Não há objetivos de aprendizagem cadastrados para os filtros selecionados.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([campo, objs]: [string, any], idx) => {
            const isExp = expandedCampo === campo
            return (
              <Card key={campo} className="border-0 shadow-md card-glass overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <CardHeader className="cursor-pointer hover:bg-muted/30 transition-all duration-200" onClick={() => setExpandedCampo(isExp ? null : campo)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">{campo}</CardTitle>
                        <p className="text-sm text-muted-foreground">{(objs as any[]).length} objetivo(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-secondary/10 text-secondary border-0">{(objs as any[]).length}</Badge>
                      {isExp ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </div>
                </CardHeader>
                {isExp && (
                  <CardContent className="pt-0 space-y-3">
                    {(objs as any[]).map(obj => (
                      <div key={obj.id} className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-muted/50 transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <Badge className="shrink-0 font-mono text-xs bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0">
                              {obj.codigo_bncc}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-sm text-foreground leading-relaxed">{obj.descricao}</p>
                              <p className="text-xs text-muted-foreground mt-2">{obj.faixa_etaria}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(obj)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => excluir(obj)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editando ? 'Editar Objetivo' : 'Novo Objetivo de Aprendizagem'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Código BNCC</label>
              <Input value={form.codigo_bncc} onChange={e => setForm({ ...form, codigo_bncc: e.target.value.toUpperCase().slice(0, 20) })}
                placeholder="Ex: EI01CG01" className="bg-card/80 border-border font-mono" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Descrição</label>
              <textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })}
                className="w-full px-3 py-2 bg-card/80 border border-border rounded-lg focus:border-primary focus:ring-primary/20 outline-none min-h-[100px]"
                placeholder="Descrição do objetivo" />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Etapa de Ensino</label>
                <Select value={form.etapa_obj} onValueChange={v => setForm({ ...form, etapa_obj: v, faixa_etaria: (faixas[v] || [])[0] || '' })}>
                  <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    {etapas.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Campo de Experiência</label>
                <Select value={form.campo_experiencia} onValueChange={v => setForm({ ...form, campo_experiencia: v })}>
                  <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    {camposList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Faixa Etária</label>
                <Select value={form.faixa_etaria} onValueChange={v => setForm({ ...form, faixa_etaria: v })}>
                  <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    {(faixas[form.etapa_obj] || []).map(f => <SelectItem key={f} value={f} className="text-sm whitespace-normal">{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            {!editando && (
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={() => save(true)} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar e Registrar Outro'}
              </Button>
            )}
            <Button className="bg-primary hover:bg-secondary" onClick={() => save(false)} disabled={saving}>
              {saving ? 'Salvando...' : editando ? 'Atualizar' : 'Salvar e Fechar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8 p-5 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm animate-fade-in-up delay-300">
        <p className="text-sm text-muted-foreground">Fonte: Base Nacional Comum Curricular (BNCC) - 2018</p>
      </div>
    </div>
  )
}
