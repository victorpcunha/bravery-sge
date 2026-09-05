'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  ArrowLeft, Save, Pencil, Trash2, Plus, X,
  Bus, BookOpen, History, AlertCircle, DoorOpen, UserPlus
} from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { FormCard } from '@/components/layout/form-card'
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
  const { pode, pessoaId } = usePermissoes(schoolId || '')
  const podeMovimentar = pode.editar('gestao-academica.matriculas.movimentacoes')
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
    transporte_responsavel: '1',
    transporte_veiculo_rodoviario: '',
    transporte_veiculo_aquaviario: '',
    // INEP Registro 60
    turma_multi: '',
    carga_horaria_iftp: '',
    aee_funcao_cognitiva: false, aee_vida_autonoma: false, aee_enriquecimento: false,
    aee_informatica: false, aee_libras: false, aee_portugues_sl: false,
    aee_soroban: false, aee_braille: false, aee_orientacao: false,
    aee_caa: false, aee_recursos: false,
    veiculo_bicicleta: false, veiculo_microonibus: false, veiculo_onibus: false,
    veiculo_tracao: false, veiculo_vans: false, veiculo_outro: false,
    veiculo_aqua_5: false, veiculo_aqua_15: false, veiculo_aqua_35: false, veiculo_aqua_mais: false,
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

  const loadMatricula = async (schoolId: string | null, id: string, ativo: any) => {
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
        escolarizacao_externa: m.escolarizacao_externa || 'Não recebe escolarização fora da escola',
        observacoes: m.observacoes || '',
        transporte_responsavel: m.transporte_responsavel || '1',
        transporte_veiculo_rodoviario: m.transporte_veiculos?.rodoviario || '',
        transporte_veiculo_aquaviario: m.transporte_veiculos?.aquaviario || '',
        turma_multi: (m as any).turma_multi || '',
        carga_horaria_iftp: (m as any).carga_horaria_iftp || '',
        aee_funcao_cognitiva: !!(m as any).aee_funcao_cognitiva, aee_vida_autonoma: !!(m as any).aee_vida_autonoma,
        aee_enriquecimento: !!(m as any).aee_enriquecimento, aee_informatica: !!(m as any).aee_informatica,
        aee_libras: !!(m as any).aee_libras, aee_portugues_sl: !!(m as any).aee_portugues_sl,
        aee_soroban: !!(m as any).aee_soroban, aee_braille: !!(m as any).aee_braille,
        aee_orientacao: !!(m as any).aee_orientacao, aee_caa: !!(m as any).aee_caa,
        aee_recursos: !!(m as any).aee_recursos,
        veiculo_bicicleta: !!(m as any).veiculo_bicicleta, veiculo_microonibus: !!(m as any).veiculo_microonibus,
        veiculo_onibus: !!(m as any).veiculo_onibus, veiculo_tracao: !!(m as any).veiculo_tracao,
        veiculo_vans: !!(m as any).veiculo_vans, veiculo_outro: !!(m as any).veiculo_outro,
        veiculo_aqua_5: !!(m as any).veiculo_aqua_5, veiculo_aqua_15: !!(m as any).veiculo_aqua_15,
        veiculo_aqua_35: !!(m as any).veiculo_aqua_35, veiculo_aqua_mais: !!(m as any).veiculo_aqua_mais,
      })

      // Garante que o aluno vinculado apareça no Select mesmo se estiver inativo
      setAlunos(prev => {
        if (!m.aluno_id || prev.some(a => a.id === m.aluno_id)) return prev
        return [{
          id: m.aluno_id,
          nome_completo: m.aluno?.nome_completo || 'Aluno',
          cpf: m.aluno?.cpf || null,
          data_nascimento: null,
        }, ...prev]
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
      const disp = await adicionarDispensa(editId, novaDispensaDisciplina, novaDispensaMotivo, pessoaId)
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
      await removerDispensa(id, pessoaId)
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
      const newFields = {
        turma_multi: form.turma_multi || null,
        carga_horaria_iftp: form.carga_horaria_iftp ? parseInt(form.carga_horaria_iftp) : null,
        aee_funcao_cognitiva: form.aee_funcao_cognitiva, aee_vida_autonoma: form.aee_vida_autonoma,
        aee_enriquecimento: form.aee_enriquecimento, aee_informatica: form.aee_informatica,
        aee_libras: form.aee_libras, aee_portugues_sl: form.aee_portugues_sl,
        aee_soroban: form.aee_soroban, aee_braille: form.aee_braille,
        aee_orientacao: form.aee_orientacao, aee_caa: form.aee_caa, aee_recursos: form.aee_recursos,
        veiculo_bicicleta: form.veiculo_bicicleta, veiculo_microonibus: form.veiculo_microonibus,
        veiculo_onibus: form.veiculo_onibus, veiculo_tracao: form.veiculo_tracao,
        veiculo_vans: form.veiculo_vans, veiculo_outro: form.veiculo_outro,
        veiculo_aqua_5: form.veiculo_aqua_5, veiculo_aqua_15: form.veiculo_aqua_15,
        veiculo_aqua_35: form.veiculo_aqua_35, veiculo_aqua_mais: form.veiculo_aqua_mais,
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
          ...newFields,
        }, pessoaId)

        // Salvar movimentações
        if (movimentacoes.length > 0) {
          await salvarMovimentacoes(
            pessoaId || '',
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
          ...newFields,
        }, pessoaId)

        // Salvar dispensas (se houver)
        for (const d of dispensas) {
          if (d.id.startsWith('temp_')) {
            await adicionarDispensa((nova as any).id, d.disciplina_id, d.motivo, pessoaId)
          }
        }

        // Salvar movimentações (se houver)
        if (movimentacoes.length > 0) {
          await salvarMovimentacoes(
            pessoaId || '',
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
    return (
      <PageContainer>
        <div className="text-center text-muted-foreground py-8">Carregando...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        icon={isEditing ? Pencil : UserPlus}
        title={isEditing ? 'Editar Matrícula' : 'Nova Matrícula'}
        description={isEditing ? 'Edite os dados da matrícula do aluno' : 'Registre um novo aluno na turma'}
        actions={
          <Link href="/gestao-academica/matriculas">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        }
      />

      <div className="space-y-6 pb-20">
        {/* Dados da Matrícula */}
        <FormCard title="Dados da Matrícula">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Ano Letivo</Label>
              <Input value={anoLetivo?.descricao || '—'} disabled className="h-9 border-border bg-muted" />
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground mb-1 block">Aluno <span className="text-destructive">*</span></Label>
              <Select value={form.aluno_id} onValueChange={v => setForm(p => ({ ...p, aluno_id: v }))} disabled={isEditing}>
                <SelectTrigger className="h-9 border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.nome_completo} — CPF: {a.cpf || 'Não informado'}</SelectItem>
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
                disabled={!turmas.find((t: any) => t.id === form.turma_id)?.multietapa}>
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
                disabled={!turmas.find((t: any) => t.id === form.turma_id)?.multietapa || subetapasDisponiveis.length === 0}>
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
            <Textarea
              className="min-h-[60px] border-border"
              value={form.observacoes}
              onChange={e => setForm(p => ({ ...p, observacoes: e.target.value }))}
              placeholder="Informações adicionais sobre a matrícula..."
            />
          </div>
        </FormCard>

        {/* Transporte Escolar */}
        <FormCard title="Transporte Escolar" description="Configurações de transporte escolar do aluno">
          <div className="w-72">
            <Label className="text-xs text-muted-foreground mb-1 block">Poder público responsável</Label>
            <Select value={form.transporte_responsavel} onValueChange={v => setForm(p => ({ ...p, transporte_responsavel: v }))}>
              <SelectTrigger className="h-9 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Não utiliza</SelectItem>
                <SelectItem value="2">Municipal</SelectItem>
                <SelectItem value="3">Estadual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {['2', '3'].includes(form.transporte_responsavel) && (
            <div className="border border-border rounded-md p-3 bg-muted/30 space-y-3">
              <p className="text-xs font-medium text-foreground">Veículos utilizados no transporte escolar</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {[
                  ['veiculo_bicicleta', 'Bicicleta'], ['veiculo_microonibus', 'Microônibus'],
                  ['veiculo_onibus', 'Ônibus'], ['veiculo_tracao', 'Tração animal'],
                  ['veiculo_vans', 'Vans/Kombis'], ['veiculo_outro', 'Outro rodoviário'],
                  ['veiculo_aqua_5', 'Aquaviário até 5 alunos'], ['veiculo_aqua_15', 'Aquaviário 5-15 alunos'],
                  ['veiculo_aqua_35', 'Aquaviário 15-35 alunos'], ['veiculo_aqua_mais', 'Aquaviário acima de 35'],
                ].map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      checked={(form as any)[key] || false}
                      onCheckedChange={(v) => setForm(p => ({ ...p, [key]: !!v }))}
                      id={`v-${key}`}
                      className="data-[state=checked]:bg-primary border-border"
                    />
                    <Label htmlFor={`v-${key}`} className="text-xs cursor-pointer">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormCard>

        {/* AEE - apenas se turma for AEE */}
        {turmas.find((t: any) => t.id === form.turma_id)?.tipos_turma?.some((t: string) => t.toLowerCase().includes('aee')) && (
        <FormCard title="AEE — Atendimento Educacional Especializado" description="Campos do Censo INEP para Atendimento Educacional Especializado">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {[
              ['aee_funcao_cognitiva', 'Desenvolvimento de funções cognitivas'],
              ['aee_vida_autonoma', 'Desenvolvimento de vida autônoma'],
              ['aee_enriquecimento', 'Enriquecimento curricular'],
              ['aee_informatica', 'Ensino da informática acessível'],
              ['aee_libras', 'Ensino de Libras'],
              ['aee_portugues_sl', 'Ensino de Português como 2ª Língua'],
              ['aee_soroban', 'Ensino do Soroban'],
              ['aee_braille', 'Ensino do Sistema Braille'],
              ['aee_orientacao', 'Orientação e mobilidade'],
              ['aee_caa', 'Comunicação Alternativa (CAA)'],
              ['aee_recursos', 'Uso de recursos ópticos e não ópticos'],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  checked={(form as any)[key] || false}
                  onCheckedChange={(v) => setForm(p => ({ ...p, [key]: !!v }))}
                  id={`aee-${key}`}
                  className="data-[state=checked]:bg-primary border-border"
                />
                <Label htmlFor={`aee-${key}`} className="text-xs cursor-pointer">{label}</Label>
              </div>
            ))}
          </div>
        </FormCard>
        )}

        {/* INEP Registro 60 */}
        {/* Disciplinas */}
        <FormCard title="Dispensa de Disciplinas">
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
                <Input className="h-10 border-border text-xs" placeholder="Descreva o motivo..."
                  value={novaDispensaMotivo} onChange={e => setNovaDispensaMotivo(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" className="h-8 border-border text-xs"
                onClick={handleAdicionarDispensa}>
                <Plus className="h-3 w-3" />
                Adicionar
              </Button>
            </div>
          </div>
        </FormCard>

        {/* Movimentações (apenas edição) */}
        {isEditing && (
          <FormCard title="Movimentações">
            {/* Botões de movimentação (bloqueados após salvar mov) */}
            {podeMovimentar && (
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
            )}

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
                        {!movSalvas && podeMovimentar && (
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6"
                              onClick={() => {
                                if (mov.tipo === 'Transferencia') abrirModalTransferencia(mov)
                                else if (mov.tipo === 'Reclassificacao') abrirModalReclassificar(mov)
                                else if (mov.tipo === 'Remanejamento') abrirModalRemanejar(mov)
                                else if (mov.tipo === 'Desistencia') abrirModalDesistencia(mov)
                              }}>
                              <Pencil className="h-3 w-3" />
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
          </FormCard>
        )}
      </div>

      {/* Botão Salvar fixo */}
      <div className="fixed bottom-6 right-6 z-10">
        <Button onClick={handleSave} disabled={saving} size="lg" className="rounded-full shadow-lg">
          <Save className="h-4 w-4" />
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
              <Textarea className="min-h-[60px]"
                value={movForm.observacoes}
                onChange={e => setMovForm(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Observações sobre a transferência..." />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setModalTransferencia(false); resetMovForm() }}>Cancelar</Button>
            <Button onClick={confirmarTransferencia}>Confirmar</Button>
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
              <Textarea className="min-h-[60px]"
                value={movForm.observacoes}
                onChange={e => setMovForm(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Observações sobre a reclassificação..." />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setModalReclassificar(false); resetMovForm() }}>Cancelar</Button>
            <Button onClick={confirmarReclassificacao}>Confirmar</Button>
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
              <Textarea className="min-h-[60px]"
                value={movForm.observacoes}
                onChange={e => setMovForm(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Observações sobre o remanejamento..." />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setModalRemanejar(false); resetMovForm() }}>Cancelar</Button>
            <Button onClick={confirmarRemanejamento}>Confirmar</Button>
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
              <Textarea className="min-h-[60px]"
                value={movForm.observacoes}
                onChange={e => setMovForm(p => ({ ...p, observacoes: e.target.value }))}
                placeholder="Observações sobre a desistência..." />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setModalDesistencia(false); resetMovForm() }}>Cancelar</Button>
            <Button onClick={confirmarDesistencia}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
