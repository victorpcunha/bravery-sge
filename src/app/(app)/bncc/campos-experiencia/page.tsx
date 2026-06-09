'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

type Campo = {
  id: string
  sigla: string
  nome: string
  descricao: string | null
  cor: string
}

export default function CamposExperienciaPage() {
  const [campos, setCampos] = useState<Campo[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState<Campo | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ sigla: '', nome: '', descricao: '', cor: '#1D3557' })

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase.from('bncc_campos_experiencia').select('*').order('sigla')
      setCampos(data || [])
    } catch { setCampos([]) }
    setLoading(false)
  }

  function openNew() {
    setEditando(null)
    setForm({ sigla: '', nome: '', descricao: '', cor: '#1D3557' })
    setShowModal(true)
  }

  function openEdit(campo: Campo) {
    setEditando(campo)
    setForm({ sigla: campo.sigla, nome: campo.nome, descricao: campo.descricao || '', cor: campo.cor })
    setShowModal(true)
  }

  async function save() {
    if (!form.nome.trim() || !form.sigla.trim()) {
      toast.error('Nome e sigla são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      const supabase = getSupabaseClient()
      if (editando) {
        const { error } = await supabase.from('bncc_campos_experiencia').update({
          sigla: form.sigla.toUpperCase(),
          nome: form.nome,
          descricao: form.descricao,
          cor: form.cor,
        }).eq('id', editando.id)
        if (error) throw error
        toast.success('Campo atualizado com sucesso.')
      } else {
        const { error } = await supabase.from('bncc_campos_experiencia').insert({
          sigla: form.sigla.toUpperCase(),
          nome: form.nome,
          descricao: form.descricao,
          cor: form.cor,
        })
        if (error) throw error
        toast.success('Campo cadastrado com sucesso.')
      }
      setShowModal(false)
      load()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar.')
    }
    setSaving(false)
  }

  async function excluir(campo: Campo) {
    if (!confirm(`Excluir "${campo.nome}"?`)) return
    try {
      const supabase = getSupabaseClient()
      await supabase.from('bncc_campos_experiencia').delete().eq('id', campo.id)
      toast.success('Campo excluído.')
      load()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir.')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campos de Experiência</h1>
            <p className="text-muted-foreground mt-1">Os cinco Campos de Experiência da BNCC do Ensino Infantil</p>
          </div>
          <Button className="bg-primary hover:bg-secondary" onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" /> Novo Campo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campos.map((campo, index) => (
            <Card key={campo.id} className="border-0 shadow-md card-glass hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${campo.cor}20` }}>
                      <BookOpen className="w-6 h-6" style={{ color: campo.cor }} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">{campo.nome}</CardTitle>
                      <Badge className="mt-1 text-xs" style={{ backgroundColor: `${campo.cor}20`, color: campo.cor }}>
                        {campo.sigla}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(campo)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => excluir(campo)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{campo.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">{editando ? 'Editar Campo' : 'Novo Campo de Experiência'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Sigla</label>
                <Input value={form.sigla} onChange={e => setForm({ ...form, sigla: e.target.value.toUpperCase().slice(0, 10) })}
                  placeholder="CG" className="bg-card/80 border-border" disabled={!!editando} />
              </div>
              <div className="col-span-3">
                <label className="text-sm font-medium mb-2 block text-foreground">Nome</label>
                <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}
                  placeholder="Nome do campo" className="bg-card/80 border-border" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Descrição</label>
              <textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })}
                className="w-full px-3 py-2 bg-card/80 border border-border rounded-lg focus:border-primary focus:ring-primary/20 outline-none min-h-[80px]"
                placeholder="Descrição do campo de experiência" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Cor</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.cor} onChange={e => setForm({ ...form, cor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                <span className="text-sm text-muted-foreground font-mono">{form.cor}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button className="bg-primary hover:bg-secondary" onClick={save} disabled={saving}>
              {saving ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
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
