'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  ArrowLeft, Save, Pencil, Trash2, Plus, X,
  Bus, BookOpen, History, AlertCircle, DoorOpen
} from 'lucide-react'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import {
  getMatricula, createMatricula, updateMatricula,
  getMovimentacoes, salvarMovimentacoes,
  getDispensas, adicionarDispensa, removerDispensa,
  getAlunos, getTurmasAtivas, getEtapasDaTurma, getSubetapasDaEtapa,
  getDisciplinasDaTurma, getAnoLetivoAtivo,
  type Movimentacao, type Dispensa,
} from '@/lib/actions/matriculas'

function formatData(data: string) {
  if (!data) return ''
  const d = new Date(data + 'T00:00:00')
  return d.toLocaleDateString('pt-BR')
}

function toDateInput(data: string) {
  if (!data) return ''
  return data.substring(0, 10)
}

const veiculosRodoviarios = ['Bicicleta', 'Microônibus', 'Ônibus', 'Tração animal', 'Vans/Kombis', 'Outro']
const veiculosAquaviarios = ['Capacidade de até 5 alunos', 'Capacidade entre 5 a 15 alunos', 'Capacidade entre 15 a 35 alunos', 'Capacidade acima de 35 alunos']

const motivosDesistencia = [
  'Ingresso no trabalho', 'Falta de recursos', 'Condições de saúde',
  'Insatisfação pessoal', 'Distância da Unidade Escolar', 'Mudança de Endereço',
  'Não está frequentando', 'Sem informação',
]

export default function MatriculaCadastroContent({ searchParams }: { searchParams: { id?: string } }) {
  const router = useRouter()
  const editId = searchParams?.id
  const { user, schoolId, loading: authLoading } = useAuth()
  const isEditing = !!editId

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Dados auxiliares
  const [anoLetivo, setAnoLetivo] = useState<any>(null)
  const [alunos, setAlunos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<any[]>([])
  const [etapasDisponiveis, setEtapasDisponiveis] = useState<any[]>([])
  const [subetapasDisponiveis, setSubetapasDisponiveis] = useState<any[]>([])
  const [disciplinasTurma, setDisciplinasTurma] = useState<any[]>([])

  // Form principal
  const [form, setForm] = useState({
    aluno_id: '',
    data_matricula: '',
    turma_id: '',
    etapa_ensino_id: '',
    subetapa_id: '',
    forma_ingresso: 'Normal',
    escolarizacao_externa: 'Não recebe escolarização fora da escola',
    observacoes: '',
    transporte_responsavel: 'Não utiliza',
    transporte_veiculo_rodoviario: '',
    transporte_veiculo_aquaviario: '',
  })

  // Dispensas
  const [dispensas, setDispensas] = useState<Dispensa[]>([])
  const [novaDispensaDisciplina, setNovaDispensaDisciplina] = useState('')
  const [novaDispensaMotivo, setNovaDispensaMotivo] = useState('')

  // Movimentações (estado pendente)
  const [movimentacoes, setMovimentacoes] = useState<any[]>([])
  const [movSalvas, setMovSalvas] = useState(false)

  // Modais de movimentação
  const [modalTransferencia, setModalTransferencia] = useState(false)
  const [modalReclassificar, setModalReclassificar] = useState(false)
  const [modalRemanejar, setModalRemanejar] = useState(false)
  const [modalDesistencia, setModalDesistencia] = useState(false)
  const [editMovId, setEditMovId] = useState<string | null>(null)

  // Form de movimentação
  const [movForm, setMovForm] = useState({
    data_movimentacao: '',
    nova_etapa_id: '',
    nova_turma_id: '',
    turma_destino_id: '',
    motivo_desistencia: '',
    observacoes: '',
  })

  // Etapas/turmas para reclassificação
  const [etapasPosteriores, setEtapasPosteriores] = useState<any[]>([])
  const [turmasPorEtapa, setTurmasPorEtapa] = useState<any[]>([])

  // Turmas para remanejamento (mesma etapa)
  const [turmasRemanejamento, setTurmasRemanejamento] = useState<any[]>([])

  // Matrícula carregada (edição)
  const [matricula, setMatricula] = useState<any>(null)

  const resetMovForm = () => {
    setMovForm({ data_movimentacao: '', nova_etapa_id: '', nova_turma_id: '', turma_destino_id: '', motivo_desistencia: '', observacoes: '' })
    setEditMovId(null)
  }

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    loadInitial()
  }, [user])

  const loadInitial = async () => {
    try {
      const [ativo, alunosList] = await Promise.all([
        getAnoLetivoAtivo(schoolId!),
        getAlunos(schoolId!),
      ])
      setAnoLetivo(ativo)
      setAlunos(alunosList)

      if (ativo) {
        const turmasDoAno = await getTurmasAtivas(schoolId!, ativo.id)
        setTurmas(turmasDoAno)
        setForm(p => ({ ...p, data_matricula: new Date().toISOString().substring(0, 10) }))
      }

      if (isEditing && editId) {
        await loadMatricula(schoolId!, editId, ativo)
      }
    } catch (e: any) {
      console.error('Erro init:', e)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const loadMatricula = async (schoolId: string, id: string, ativo: any) => {
    try {
      const m = await getMatricula(id)
      setMatricula(m)
      setForm({
        aluno_id: m.aluno_id,
        data_matricula: toDateInput(m.data_matricula),
        turma_id: m.turma_id,
        etapa_ensino_id: m.etapa_ensino_id,
        subetapa_id: m.subetapa_id || '',
        forma_ingresso: m.forma_ingresso,
        escolarizacao_externa: m.escolarizacao_externa,
        observacoes: m.observacoes || '',
        transporte_responsavel: m.transporte_responsavel || 'Não utiliza',
        transporte_veiculo_rodoviario: m.transporte_veiculos?.rodoviario || '',
        transporte_veiculo_aquaviario: m.transporte_veiculos?.aquaviario || '',
      })

      const [movs, disps, etapas] = await Promise.all([
        getMovimentacoes(id),
        getDispensas(id),
        getEtapasDaTurma(m.turma_id),
      ])
      setMovimentacoes(movs)
      setMovSalvas(movs.length > 0)
      setDispensas(disps)
      setEtapasDisponiveis(etapas)

      if (m.subetapa_id) {
        const subs = await getSubetapasDaEtapa(m.etapa_ensino_id)
        setSubetapasDisponiveis(subs)
      }

      if (m.turma_id) {
        const discs = await getDisciplinasDaTurma(m.turma_id)
        setDisciplinasTurma(discs)
      }
    } catch (e) {
      console.error('Erro ao carregar matrícula:', e)
      toast.error('Erro ao carregar dados da matrícula')
    }
  }

  const handleTurmaChange = async (turmaId: string) => {
    setForm(p => ({ ...p, turma_id: turmaId, etapa_ensino_id: '', subetapa_id: '' }))
    setEtapasDisponiveis([])
    setSubetapasDisponiveis([])

    if (!turmaId) return

    const [etapas, discs] = await Promise.all([
      getEtapasDaTurma(turmaId),
      getDisciplinasDaTurma(turmaId),
    ])
    setEtapasDisponiveis(etapas)
    setDisciplinasTurma(discs)

    // Auto-select etapa if single
    if (etapas.length === 1) {
      setForm(p => ({ ...p, etapa_ensino_id: etapas[0].id }))
      const subs = await getSubetapasDaEtapa(etapas[0].id)
      setSubetapasDisponiveis(subs)
    }
  }

  const handleEtapaChange = async (etapaId: string) => {
    setForm(p => ({ ...p, etapa_ensino_id: etapaId, subetapa_id: '' }))
    setSubetapasDisponiveis([])

    if (!etapaId) return
    const subs = await getSubetapasDaEtapa(etapaId)
    setSubetapasDisponiveis(subs)
  }

  // Adicionar/remover dispensa (apenas visual, persistido ao salvar)
  const handleAdicionarDispensa = async () => {
    if (!novaDispensaDisciplina || !novaDispensaMotivo.trim()) {
      toast.error('Selecione a disciplina e informe o motivo')
      return
    }
    if (!editId) {
      // Em criação, manter em estado local
      setDispensas(prev => [...prev, {
        id: `temp_${Date.now()}`,
        matricula_id: '',
        disciplina_id: novaDispensaDisciplina,
        motivo: novaDispensaMotivo,
        ativo: true,
        created_at: '',
        disciplina: { nome: disciplinasTurma.find(d => d.disciplina_id === novaDispensaDisciplina)?.nome || '' },
      } as any])
      setNovaDispensaDisciplina('')
      setNovaDispensaMotivo('')
      return
    }
    try {
      const disp = await adicionarDispensa(editId, novaDispensaDisciplina, novaDispensaMotivo)
      setDispensas(prev => [...prev, { ...disp, disciplina: { nome: disciplinasTurma.find(d => d.disciplina_id === novaDispensaDisciplina)?.nome || '' } }])
      setNovaDispensaDisciplina('')
      setNovaDispensaMotivo('')
      toast.success('Dispensa adicionada')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao adicionar dispensa')
    }
  }

  const handleRemoverDispensa = async (id: string) => {
    if (id.startsWith('temp_')) {
      setDispensas(prev => prev.filter(d => d.id !== id))
      return
    }
    try {
      await removerDispensa(id)
      setDispensas(prev => prev.filter(d => d.id !== id))
      toast.success('Dispensa removida')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao remover dispensa')
    }
  }

  // Modais de movimentação
  const abrirModalTransferencia = (mov?: any) => {
    if (mov) { setEditMovId(mov.id); setMovForm({ ...movForm, data_movimentacao: toDateInput(mov.data_movimentacao), observacoes: mov.observacoes || '' }) }
    else resetMovForm()
    setModalTransferencia(true)
  }

  const confirmarTransferencia = () => {
    if (!movForm.data_movimentacao) { toast.error('Data de transferência obrigatória'); return }
    const mov = {
      id: editMovId || undefined,
      tipo: 'Transferencia' as const,
      data_movimentacao: movForm.data_movimentacao,
      profissional_id: user?.id || '',
      observacoes: movForm.observacoes || null,
      dados_complementares: {},
    }
    if (editMovId) {
      setMovimentacoes(prev => prev.map(m => m.id === editMovId ? { ...m, ...mov, data_registro: m.data_registro } : m))
    } else {
      setMovimentacoes(prev => [...prev, { ...mov, id: `temp_${Date.now()}`, data_registro: new Date().toISOString(), profissional: { nome: user?.user_metadata?.nome || '—' } }])
    }
    setModalTransferencia(false)
    resetMovForm()
  }

  const abrirModalReclassificar = async (mov?: any) => {
    if (!matricula) return
    resetMovForm()
    if (mov) {
      setEditMovId(mov.id)
      setMovForm({
        data_movimentacao: toDateInput(mov.data_movimentacao),
        nova_etapa_id: mov.dados_complementares?.nova_etapa_id || '',
        nova_turma_id: mov.dados_complementares?.nova_turma_id || '',
        turma_destino_id: '',
        motivo_desistencia: '',
        observacoes: mov.observacoes || '',
      })
    }
    // Carregar etapas posteriores
    const { getEtapasEnsino } = await import('@/lib/actions/etapas-ensino')
    const todas = await getEtapasEnsino(schoolId!)
    const etapaAtualIdx = todas.findIndex((e: any) => e.id === form.etapa_ensino_id)
    if (etapaAtualIdx >= 0) {
      setEtapasPosteriores(todas.slice(etapaAtualIdx + 1))
    } else {
      setEtapasPosteriores(todas)
    }
    setTurmasPorEtapa([])
    setModalReclassificar(true)
  }

  const handleEtapaReclassificacaoChange = async (etapaId: string) => {
    setMovForm(p => ({ ...p, nova_etapa_id: etapaId, nova_turma_id: '' }))
    if (!etapaId || !anoLetivo) { setTurmasPorEtapa([]); return }
    const turmas = await getTurmasAtivas(schoolId!, anoLetivo.id)
    setTurmasPorEtapa(turmas.filter((t: any) => {
      if (t.multietapa) return t.etapas_ensino_ids?.includes(etapaId)
      return t.etapas_ensino_ids?.[0] === etapaId
    }))
  }

  const confirmarReclassificacao = () => {
    if (!movForm.data_movimentacao) { toast.error('Data de reclassificação obrigatória'); return }
    if (!movForm.nova_etapa_id) { toast.error('Selecione a nova etapa'); return }
    if (!movForm.nova_turma_id) { toast.error('Selecione a nova turma'); return }
    const mov = {
      id: editMovId || undefined,
      tipo: 'Reclassificacao' as const,
      data_movimentacao: movForm.data_movimentacao,
      profissional_id: user?.id || '',
      observacoes: movForm.observacoes || null,
      dados_complementares: { nova_etapa_id: movForm.nova_etapa_id, nova_turma_id: movForm.nova_turma_id },
    }
    if (editMovId) {
      setMovimentacoes(prev => prev.map(m => m.id === editMovId ? { ...m, ...mov, data_registro: m.data_registro } : m))
    } else {
      setMovimentacoes(prev => [...prev, { ...mov, id: `temp_${Date.now()}`, data_registro: new Date().toISOString(), profissional: { nome: user?.user_metadata?.nome || '—' } }])
    }
    setModalReclassificar(false)
    resetMovForm()
  }

  const abrirModalRemanejar = async (mov?: any) => {
    if (!matricula) return
    resetMovForm()
    if (mov) {
      setEditMovId(mov.id)
      setMovForm({
        data_movimentacao: toDateInput(mov.data_movimentacao),
        turma_destino_id: mov.dados_complementares?.turma_destino_id || '',
        nova_etapa_id: '', nova_turma_id: '', motivo_desistencia: '',
        observacoes: mov.observacoes || '',
      })
    }
    // Carregar turmas da mesma etapa (exceto atual)
    const { getTurmasAtivas } = await import('@/lib/actions/matriculas')
    const todas = await getTurmasAtivas(schoolId!, anoLetivo?.id || '')
    setTurmasRemanejamento(todas.filter((t: any) => {
      if (t.id === form.turma_id) return false
      if (t.multietapa) return t.etapas_ensino_ids?.includes(form.etapa_ensino_id)
      return t.etapas_ensino_ids?.[0] === form.etapa_ensino_id
    }))
    setModalRemanejar(true)
  }

  const confirmarRemanejamento = () => {
    if (!movForm.data_movimentacao) { toast.error('Data de remanejamento obrigatória'); return }
    if (!movForm.turma_destino_id) { toast.error('Selecione a turma de destino'); return }
    const mov = {
      id: editMovId || undefined,
      tipo: 'Remanejamento' as const,
      data_movimentacao: movForm.data_movimentacao,
      profissional_id: user?.id || '',
      observacoes: movForm.observacoes || null,
      dados_complementares: { turma_destino_id: movForm.turma_destino_id },
    }
    if (editMovId) {
      setMovimentacoes(prev => prev.map(m => m.id === editMovId ? { ...m, ...mov, data_registro: m.data_registro } : m))
    } else {
      setMovimentacoes(prev => [...prev, { ...mov, id: `temp_${Date.now()}`, data_registro: new Date().toISOString(), profissional: { nome: user?.user_metadata?.nome || '—' } }])
    }
    setModalRemanejar(false)
    resetMovForm()
  }

  const abrirModalDesistencia = (mov?: any) => {
    if (mov) { setEditMovId(mov.id); setMovForm({ ...movForm, data_movimentacao: toDateInput(mov.data_movimentacao), motivo_desistencia: mov.dados_complementares?.motivo_desistencia || '', observacoes: mov.observacoes || '' }) }
    else resetMovForm()
    setModalDesistencia(true)
  }

  const confirmarDesistencia = () => {
    if (!movForm.data_movimentacao) { toast.error('Data de desistência obrigatória'); return }
    if (!movForm.motivo_desistencia) { toast.error('Selecione o motivo'); return }
    const mov = {
      id: editMovId || undefined,
      tipo: 'Desistencia' as const,
      data_movimentacao: movForm.data_movimentacao,
      profissional_id: user?.id || '',
      observacoes: movForm.observacoes || null,
      dados_complementares: { motivo_desistencia: movForm.motivo_desistencia },
    }
    if (editMovId) {
      setMovimentacoes(prev => prev.map(m => m.id === editMovId ? { ...m, ...mov, data_registro: m.data_registro } : m))
    } else {
      setMovimentacoes(prev => [...prev, { ...mov, id: `temp_${Date.now()}`, data_registro: new Date().toISOString(), profissional: { nome: user?.user_metadata?.nome || '—' } }])
    }
    setModalDesistencia(false)
    resetMovForm()
  }

  const removerMovimentacao = (id: string) => {
    setMovimentacoes(prev => prev.filter(m => m.id !== id))
  }

  // Salvar
  const handleSave = async () => {
    if (!form.aluno_id) { toast.error('Selecione o aluno'); return }
    if (!form.data_matricula) { toast.error('Informe a data de matrícula'); return }
    if (!form.turma_id) { toast.error('Selecione a turma'); return }
    if (!form.etapa_ensino_id) { toast.error('Selecione a etapa de ensino'); return }

    setSaving(true)
    try {
      const transporte = {
        rodoviario: form.transporte_veiculo_rodoviario || null,
        aquaviario: form.transporte_veiculo_aquaviario || null,
      }

      if (isEditing && editId) {
        await updateMatricula(editId, {
          turma_id: form.turma_id,
          etapa_ensino_id: form.etapa_ensino_id,
          subetapa_id: form.subetapa_id || null,
          forma_ingresso: form.forma_ingresso,
          escolarizacao_externa: form.escolarizacao_externa,
          observacoes: form.observacoes || null,
          transporte_responsavel: form.transporte_responsavel,
          transporte_veiculos: transporte,
        })

        // Salvar movimentações
        if (movimentacoes.length > 0) {
          await salvarMovimentacoes(
            editId,
            movimentacoes.map(m => ({
              id: m.id?.startsWith('temp_') ? undefined : m.id,
              tipo: m.tipo,
              data_movimentacao: m.data_movimentacao,
              profissional_id: m.profissional_id,
              observacoes: m.observacoes,
              dados_complementares: m.dados_complementares,
            }))
          )
        }

        toast.success('Matrícula atualizada')
      } else {
        const nova = await createMatricula({
          school_id: schoolId!,
          aluno_id: form.aluno_id,
          ano_letivo_id: anoLetivo?.id || '',
          turma_id: form.turma_id,
          etapa_ensino_id: form.etapa_ensino_id,
          subetapa_id: form.subetapa_id || null,
          data_matricula: form.data_matricula,
          forma_ingresso: form.forma_ingresso,
          escolarizacao_externa: form.escolarizacao_externa,
          observacoes: form.observacoes || null,
          transporte_responsavel: form.transporte_responsavel,
          transporte_veiculos: transporte,
        })

        // Salvar dispensas (se houver)
        for (const d of dispensas) {
          if (d.id.startsWith('temp_')) {
            await adicionarDispensa((nova as any).id, d.disciplina_id, d.motivo)
          }
        }

        // Salvar movimentações (se houver)
        if (movimentacoes.length > 0) {
          await salvarMovimentacoes(
            (nova as any).id,
            movimentacoes.map(m => ({
              tipo: m.tipo,
              data_movimentacao: m.data_movimentacao,
              profissional_id: m.profissional_id,
              observacoes: m.observacoes,
              dados_complementares: m.dados_complementares,
            }))
          )
        }

        toast.success('Matrícula criada com sucesso')
      }

      router.push('/gestao-academica/matriculas')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar matrícula')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return <div className="md:pl-64 container mx-auto py-8 px-4"><div className="text-center text-muted-foreground">Carregando...</div></div>
  }

  return (
    <div className="md:pl-64 container mx-auto py-8 px-4 relative min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/gestao-academica/matriculas">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {isEditing ? 'Editar Matrícula' : 'Nova Matrícula'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEditing ? 'Edite os dados da matrícula do aluno' : 'Registre um novo aluno na turma'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 pb-20">
        {/* Card Principal */}
        <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <CardHeader className="bg-muted/40 border-b border-border py-3">
            <CardTitle className="text-sm font-medium text-foreground">Dados da Matrícula</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Ano Letivo</Label>
                <Input value={anoLetivo?.descricao || '—'} disabled className="h-9 border-border bg-muted" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Aluno <span className="text-destructive">*</span></Label>
                <Select value={form.aluno_id} onValueChange={v => setForm(p => ({ ...p, aluno_id: v }))} disabled={isEditing}>
                  <SelectTrigger className="h-9 border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos.map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>{a.nome_completo} {a.cpf ? `(${a.cpf})` : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Data de Matrícula <span className="text-destructive">*</span></Label>
                <Input type="date" value={form.data_matricula}
                  onChange={e => setForm(p => ({ ...p, data_matricula: e.target.value }))}
                  className="h-9 border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Código INEP</Label>
                <Input value={matricula?.codigo_inep || ''} disabled className="h-9 border-border bg-muted" placeholder="Atribuído pelo Censo" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Turma <span className="text-destructive">*</span></Label>
                <Select value={form.turma_id} onValueChange={handleTurmaChange}>
                  <SelectTrigger className="h-9 border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {turmas.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Etapa de Ensino <span className="text-destructive">*</span></Label>
                <Select value={form.etapa_ensino_id} onValueChange={handleEtapaChange}
                  disabled={etapasDisponiveis.length === 1}>
                  <SelectTrigger className="h-9 border-border">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {etapasDisponiveis.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Subetapa</Label>
                <Select value={form.subetapa_id} onValueChange={v => setForm(p => ({ ...p, subetapa_id: v }))}
                  disabled={subetapasDisponiveis.length === 0}>
                  <SelectTrigger className="h-9 border-border">
                    <SelectValue placeholder={subetapasDisponiveis.length === 0 ? 'Não aplicável' : 'Selecione'} />
                  </SelectTrigger>
                  <SelectContent>
                    {subetapasDisponiveis.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Forma de Ingresso <span className="text-destructive">*</span></Label>
                <Select value={form.forma_ingresso} onValueChange={v => setForm(p => ({ ...p, forma_ingresso: v }))}>
                  <SelectTrigger className="h-9 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Normal', 'Lista de espera', 'Mandado Judicial', 'Reclassificação', 'Transferido de outra rede de ensino'].map(op => (
                      <SelectItem key={op} value={op}>{op}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Escolarização em outro espaço</Label>
                <Select value={form.escolarizacao_externa} onValueChange={v => setForm(p => ({ ...p, escolarizacao_externa: v }))}>
                  <SelectTrigger className="h-9 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Não recebe escolarização fora da escola', 'Em domicílio', 'Em hospital'].map(op => (
                      <SelectItem key={op} value={op}>{op}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
              <textarea
                className="w-full min-h-[60px] border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.observacoes}
                onChange={e => setForm(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Informações adicionais sobre a matrícula..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Card Transporte Escolar */}
        <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <CardHeader className="bg-muted/40 border-b border-border py-3">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <Bus className="h-4 w-4 text-muted-foreground" />
              Transporte Escolar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="w-72">
              <Label className="text-xs text-muted-foreground mb-1 block">Poder público responsável</Label>
              <Select value={form.transporte_responsavel} onValueChange={v => setForm(p => ({ ...p, transporte_responsavel: v, transporte_veiculo_rodoviario: '', transporte_veiculo_aquaviario: '' }))}>
                <SelectTrigger className="h-9 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Não utiliza', 'Municipal', 'Estadual'].map(op => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {['Municipal', 'Estadual'].includes(form.transporte_responsavel) && (
              <div className="border border-border rounded-md p-3 bg-muted/30 space-y-3">
                <p className="text-xs font-medium text-foreground">Tipo de veículo utilizado no transporte escolar público</p>

                <div>
                  <Label className="text-[11px] text-muted-foreground mb-1 block">Parte Rodoviária</Label>
                  <Select value={form.transporte_veiculo_rodoviario} onValueChange={v => setForm(p => ({ ...p, transporte_veiculo_rodoviario: v }))}>
                    <SelectTrigger className="h-8 border-border">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {veiculosRodoviarios.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[11px] text-muted-foreground mb-1 block">Parte Aquaviária</Label>
                  <Select value={form.transporte_veiculo_aquaviario} onValueChange={v => setForm(p => ({ ...p, transporte_veiculo_aquaviario: v }))}>
                    <SelectTrigger className="h-8 border-border">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {veiculosAquaviarios.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Disciplinas */}
        <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <CardHeader className="bg-muted/40 border-b border-border py-3">
            <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Disciplinas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {disciplinasTurma.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Selecione uma turma para visualizar as disciplinas</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {disciplinasTurma.map((d: any) => (
                  <Badge key={d.disciplina_id} variant="outline" className="text-xs border-border">
                    {d.nome}
                  </Badge>
                ))}
              </div>
            )}

            <Separator />

            {/* Dispensa de Disciplinas */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Dispensa de Disciplinas</Label>

              {dispensas.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {dispensas.map(d => (
                    <div key={d.id} className="flex items-center justify-between bg-warning/5 border border-warning/20 rounded px-2.5 py-1.5">
                      <div>
                        <span className="text-xs font-medium text-warning">{d.disciplina?.nome || '—'}</span>
                        <p className="text-[11px] text-warning">{d.motivo}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleRemoverDispensa(d.id)}>
                        <X className="h-3 w-3 text-warning" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="text-[11px] text-muted-foreground mb-0.5 block">Disciplina</Label>
                  <Select value={novaDispensaDisciplina} onValueChange={setNovaDispensaDisciplina}>
                    <SelectTrigger className="h-8 border-border text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinasTurma.map((d: any) => (
                        <SelectItem key={d.disciplina_id} value={d.disciplina_id}>{d.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-[2]">
                  <Label className="text-[11px] text-muted-foreground mb-0.5 block">Motivo</Label>
                  <Input className="h-8 border-border text-xs" placeholder="Descreva o motivo..."
                    value={novaDispensaMotivo} onChange={e => setNovaDispensaMotivo(e.target.value)} />
                </div>
                <Button variant="outline" size="sm" className="h-8 border-border text-xs"
                  onClick={handleAdicionarDispensa}>
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Movimentações (apenas edição) */}
        {isEditing && (
          <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <CardHeader className="bg-muted/40 border-b border-border py-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                Movimentações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Botões de movimentação (bloqueados após salvar mov) */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="border-border text-xs"
                  onClick={() => abrirModalTransferencia()} disabled={movSalvas}>
                  Transferir
                </Button>
                <Button variant="outline" size="sm" className="border-border text-xs"
                  onClick={() => abrirModalReclassificar()} disabled={movSalvas}>
                  Reclassificar
                </Button>
                <Button variant="outline" size="sm" className="border-border text-xs"
                  onClick={() => abrirModalRemanejar()} disabled={movSalvas}>
                  Remanejar
                </Button>
                <Button variant="outline" size="sm" className="border-border text-xs"
                  onClick={() => abrirModalDesistencia()} disabled={movSalvas}>
                  Desistir
                </Button>
              </div>

              {/* Histórico de movimentações */}
              {movimentacoes.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Histórico de Movimentações</Label>
                  <div className="space-y-2">
                    {movimentacoes.map((mov: any) => (
                      <div key={mov.id} className="border border-border rounded-md p-2.5 bg-card">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {mov.tipo}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{formatData(mov.data_movimentacao)}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              {mov.profissional?.nome_completo || '—'} • {mov.data_registro ? formatData(mov.data_registro) : ''}
                            </p>
                            {mov.observacoes && (
                              <p className="text-[11px] text-muted-foreground mt-0.5 italic">{mov.observacoes}</p>
                            )}
                          </div>
                          {!movSalvas && (
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6"
                                onClick={() => {
                                  if (mov.tipo === 'Transferencia') abrirModalTransferencia(mov)
                                  else if (mov.tipo === 'Reclassificacao') abrirModalReclassificar(mov)
                                  else if (mov.tipo === 'Remanejamento') abrirModalRemanejar(mov)
                                  else if (mov.tipo === 'Desistencia') abrirModalDesistencia(mov)
                                }}>
                                <Pencil className="h-3 w-3 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6"
                                onClick={() => removerMovimentacao(mov.id)}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Botão Salvar fixo */}
      <div className="fixed bottom-6 right-6 z-10">
        <Button onClick={handleSave} disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full px-6">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      {/* Modal Transferência */}
      <Dialog open={modalTransferencia} onOpenChange={setModalTransferencia}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{editMovId ? 'Editar Transferência' : 'Transferir Aluno'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Data de Transferência <span className="text-destructive">*</span></Label>
              <Input type="date" className="h-9 border-border" value={movForm.data_movimentacao}
                onChange={e => setMovForm(p => ({ ...p, data_movimentacao: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
              <textarea className="w-full min-h-[60px] border border-border rounded-md px-3 py-2 text-sm"
                value={movForm.observacoes}
                onChange={e => setMovForm(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Observações sobre a transferência..." />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setModalTransferencia(false); resetMovForm() }} className="border-border">Cancelar</Button>
            <Button onClick={confirmarTransferencia} className="bg-primary hover:bg-primary/90 text-white">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Reclassificação */}
      <Dialog open={modalReclassificar} onOpenChange={setModalReclassificar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{editMovId ? 'Editar Reclassificação' : 'Reclassificar Aluno'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Data de Reclassificação <span className="text-destructive">*</span></Label>
              <Input type="date" className="h-9 border-border" value={movForm.data_movimentacao}
                onChange={e => setMovForm(p => ({ ...p, data_movimentacao: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nova Etapa de Ensino <span className="text-destructive">*</span></Label>
              <Select value={movForm.nova_etapa_id} onValueChange={handleEtapaReclassificacaoChange}>
                <SelectTrigger className="h-9 border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {etapasPosteriores.map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Nova Turma <span className="text-destructive">*</span></Label>
              <Select value={movForm.nova_turma_id} onValueChange={v => setMovForm(p => ({ ...p, nova_turma_id: v }))}>
                <SelectTrigger className="h-9 border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {turmasPorEtapa.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
              <textarea className="w-full min-h-[60px] border border-border rounded-md px-3 py-2 text-sm"
                value={movForm.observacoes}
                onChange={e => setMovForm(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Observações sobre a reclassificação..." />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setModalReclassificar(false); resetMovForm() }} className="border-border">Cancelar</Button>
            <Button onClick={confirmarReclassificacao} className="bg-primary hover:bg-primary/90 text-white">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Remanejamento */}
      <Dialog open={modalRemanejar} onOpenChange={setModalRemanejar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{editMovId ? 'Editar Remanejamento' : 'Remanejar Aluno'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Data de Remanejamento <span className="text-destructive">*</span></Label>
              <Input type="date" className="h-9 border-border" value={movForm.data_movimentacao}
                onChange={e => setMovForm(p => ({ ...p, data_movimentacao: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Turma de Destino <span className="text-destructive">*</span></Label>
              <Select value={movForm.turma_destino_id} onValueChange={v => setMovForm(p => ({ ...p, turma_destino_id: v }))}>
                <SelectTrigger className="h-9 border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {turmasRemanejamento.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
              <textarea className="w-full min-h-[60px] border border-border rounded-md px-3 py-2 text-sm"
                value={movForm.observacoes}
                onChange={e => setMovForm(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Observações sobre o remanejamento..." />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setModalRemanejar(false); resetMovForm() }} className="border-border">Cancelar</Button>
            <Button onClick={confirmarRemanejamento} className="bg-primary hover:bg-primary/90 text-white">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Desistência */}
      <Dialog open={modalDesistencia} onOpenChange={setModalDesistencia}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{editMovId ? 'Editar Desistência' : 'Registrar Desistência'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Data de Desistência <span className="text-destructive">*</span></Label>
              <Input type="date" className="h-9 border-border" value={movForm.data_movimentacao}
                onChange={e => setMovForm(p => ({ ...p, data_movimentacao: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Motivo <span className="text-destructive">*</span></Label>
              <Select value={movForm.motivo_desistencia} onValueChange={v => setMovForm(p => ({ ...p, motivo_desistencia: v }))}>
                <SelectTrigger className="h-9 border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {motivosDesistencia.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Observações</Label>
              <textarea className="w-full min-h-[60px] border border-border rounded-md px-3 py-2 text-sm"
                value={movForm.observacoes}
                onChange={e => setMovForm(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Observações sobre a desistência..." />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setModalDesistencia(false); resetMovForm() }} className="border-border">Cancelar</Button>
            <Button onClick={confirmarDesistencia} className="bg-primary hover:bg-primary/90 text-white">Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
