'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DatePicker } from '@/components/ui/date-picker'
import { Combobox } from '@/components/ui/combobox'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { Textarea } from '@/components/ui/textarea'
import { FormCard } from '@/components/layout/form-card'
import { paises } from '@/data/paises'
import { municipios } from '@/data/municipios'
import { povosIndigenas } from '@/data/povos-indigenas'
import { cursosSuperiores } from '@/data/cursos-superiores'
import { iesList } from '@/data/ies'
import { areasConhecimento } from '@/data/areas-conhecimento'
import { areasPosGraduacao } from '@/data/areas-pos-graduacao'
import { Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/auth-provider'
import { createPerson, updatePerson, Person, getVinculosResponsavel, vincularResponsavel, desvincularResponsavel, buscarAlunos, criarAuthUser, salvarSaudeEstudante } from '@/lib/actions/people'
import { getVinculosProfissionais, createVinculoProfissional, updateVinculoProfissional, deleteVinculoProfissional, type VinculoProfissionalWithFuncao } from '@/lib/actions/vinculos-profissionais'
import { getFuncoes, type FuncaoProfissional } from '@/lib/actions/funcoes-profissionais'
import { listarPerfis, type Perfil } from '@/lib/actions/perfis'

const DEFICIENCIA_CAMPOS = [
  { key: 'cegueira', label: 'Cegueira' },
  { key: 'baixa_visao', label: 'Baixa Visão' },
  { key: 'visao_monocular', label: 'Visão Monocular' },
  { key: 'surdez', label: 'Surdez' },
  { key: 'deficiencia_auditiva', label: 'Deficiência Auditiva' },
  { key: 'surdocegueira', label: 'Surdocegueira' },
  { key: 'deficiencia_fisica', label: 'Deficiência Física' },
  { key: 'deficiencia_intelectual', label: 'Deficiência Intelectual' },
  { key: 'deficiencia_multipla', label: 'Deficiência Múltipla' },
  { key: 'tea', label: 'Transtorno do Espectro Autista' },
  { key: 'altas_habilidades', label: 'Altas Habilidades/Superdotação' },
]

const TRANSTORNO_CAMPOS = [
  { key: 'discalculia', label: 'Discalculia ou outro transtorno da matemática e raciocínio lógico' },
  { key: 'disgrafia', label: 'Disgrafia, Disortografia ou outro transtorno da escrita e ortografia' },
  { key: 'dislalia', label: 'Dislalia ou outro transtorno da linguagem e comunicação' },
  { key: 'dislexia', label: 'Dislexia' },
  { key: 'tdah', label: 'Transtorno do Déficit de Atenção com Hiperatividade (TDAH)' },
  { key: 'tpac', label: 'Transtorno do Processamento Auditivo Central (TPAC)' },
]

const RECURSO_CAMPOS = [
  { key: 'auxilio_ledor', label: 'Auxílio Ledor' },
  { key: 'auxilio_transcricao', label: 'Auxílio Transcrição' },
  { key: 'guia_interprete', label: 'Guia-Intérprete' },
  { key: 'tradutor_libras', label: 'Tradutor-Intérprete de Libras' },
  { key: 'leitura_labial', label: 'Leitura Labial' },
  { key: 'prova_ampliada', label: 'Prova Ampliada (Fonte 18)' },
  { key: 'prova_superampliada', label: 'Prova Superampliada (Fonte 24)' },
  { key: 'cd_audio', label: 'CD com Áudio' },
  { key: 'prova_libras', label: 'Prova LP 2ª Língua para Surdos' },
  { key: 'prova_video_libras', label: 'Prova em Vídeo em Libras' },
  { key: 'material_braille', label: 'Material Didático em Braille' },
  { key: 'prova_braille', label: 'Prova em Braille' },
  { key: 'tempo_adicional', label: 'Tempo Adicional' },
  { key: 'nenhum_recurso', label: 'Nenhum' },
]

// Mapeamento Deficiência x Recurso (Tabela Auxiliar INEP 2025)
// Campos 18-25 (deficiências base para Deficiência Múltipla)
const DEFICIENCIA_BASE = ['cegueira', 'baixa_visao', 'visao_monocular', 'surdez', 'deficiencia_auditiva', 'surdocegueira', 'deficiencia_fisica', 'deficiencia_intelectual']

// Pares incompatíveis de deficiência (regra INEP)
const INCOMPATIVEIS: Record<string, string[]> = {
  surdocegueira: ['cegueira', 'baixa_visao', 'visao_monocular', 'surdez', 'deficiencia_auditiva'],
  cegueira: ['surdocegueira', 'baixa_visao', 'surdez', 'visao_monocular'],
  baixa_visao: ['surdocegueira', 'cegueira', 'visao_monocular'],
  visao_monocular: ['surdocegueira', 'cegueira', 'baixa_visao'],
  surdez: ['surdocegueira', 'cegueira', 'deficiencia_auditiva'],
  deficiencia_auditiva: ['surdocegueira', 'surdez'],
}

const DEFICIENCIA_RECURSOS: Record<string, string[]> = {
  cegueira: ['auxilio_ledor', 'auxilio_transcricao', 'cd_audio', 'material_braille', 'prova_braille', 'tempo_adicional'],
  baixa_visao: ['auxilio_ledor', 'auxilio_transcricao', 'cd_audio', 'nenhum_recurso', 'prova_ampliada', 'prova_superampliada', 'tempo_adicional'],
  visao_monocular: ['auxilio_ledor', 'auxilio_transcricao', 'cd_audio', 'nenhum_recurso', 'prova_ampliada', 'prova_superampliada', 'tempo_adicional'],
  surdez: ['leitura_labial', 'nenhum_recurso', 'prova_libras', 'prova_video_libras', 'tempo_adicional', 'tradutor_libras'],
  deficiencia_auditiva: ['leitura_labial', 'nenhum_recurso', 'prova_libras', 'prova_video_libras', 'tempo_adicional', 'tradutor_libras'],
  surdocegueira: ['auxilio_ledor', 'auxilio_transcricao', 'cd_audio', 'guia_interprete', 'leitura_labial', 'material_braille', 'prova_braille', 'prova_ampliada', 'prova_libras', 'prova_video_libras', 'prova_superampliada', 'tempo_adicional', 'tradutor_libras'],
  deficiencia_fisica: ['auxilio_ledor', 'auxilio_transcricao', 'cd_audio', 'nenhum_recurso', 'tempo_adicional'],
  deficiencia_intelectual: ['auxilio_ledor', 'auxilio_transcricao', 'cd_audio', 'nenhum_recurso', 'tempo_adicional'],
  deficiencia_multipla: ['auxilio_ledor', 'auxilio_transcricao', 'cd_audio', 'nenhum_recurso', 'tempo_adicional'],
  tea: ['auxilio_ledor', 'auxilio_transcricao', 'cd_audio', 'nenhum_recurso', 'tempo_adicional'],
  altas_habilidades: [],
}

const FORMACAO_CAMPOS = [
  { key: 'form_creche', label: 'Creche (0-3 anos)' },
  { key: 'form_pre_escola', label: 'Pré-escola (4-5 anos)' },
  { key: 'form_alfabetizacao', label: 'Alfabetização' },
  { key: 'form_anos_iniciais', label: 'Anos Iniciais EF' },
  { key: 'form_anos_finais', label: 'Anos Finais EF' },
  { key: 'form_medio', label: 'Ensino Médio' },
  { key: 'form_eja', label: 'EJA' },
  { key: 'form_especial', label: 'Educação Especial' },
  { key: 'form_indigena', label: 'Educação Indígena' },
  { key: 'form_campo', label: 'Educação do Campo' },
  { key: 'form_ambiental', label: 'Educação Ambiental' },
  { key: 'form_direitos', label: 'Educação em Direitos Humanos' },
  { key: 'form_bilingue', label: 'Educação Bilíngue de Surdos' },
  { key: 'form_tic', label: 'Educação e TIC' },
  { key: 'form_integral', label: 'Educação Integral' },
  { key: 'form_genero', label: 'Gênero e Diversidade Sexual' },
  { key: 'form_direitos_crianca', label: 'Direitos de Criança e Adolescente' },
  { key: 'form_etnico_raciais', label: 'Relações Étnico-Raciais' },
  { key: 'form_gestao_escolar', label: 'Gestão Escolar' },
  { key: 'form_outros', label: 'Outros' },
]

const TIPOS_VINCULO = [
  { value: '1', label: 'Pai' },
  { value: '2', label: 'Mãe' },
  { value: '3', label: 'Responsável Legal' },
  { value: '4', label: 'Tutor' },
  { value: '5', label: 'Outro' },
]

function formatCPF(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

const PAIS_OPTIONS = paises
  .filter(p => [32, 68, 76, 170, 328, 254, 600, 604, 740, 858, 862].includes(p.codigo))
  .map(p => ({ value: String(p.codigo), label: p.nome, searchLabel: p.nome }))
const MUNICIPIO_OPTIONS = municipios.map(m => ({ value: String(m.codigo), label: `${m.nome} - ${m.nomeUF}`, searchLabel: `${m.nome} ${m.nomeUF}` }))
const POVO_OPTIONS = povosIndigenas.map(p => ({ value: String(p.codigo), label: `${p.codigo} - ${p.nome}`, searchLabel: `${p.nome} ${p.codigo}` }))
const CURSO_OPTIONS = cursosSuperiores.map(c => ({ value: c.codigo, label: `${c.codigo} - ${c.nome}`, searchLabel: `${c.nome} ${c.codigo}` }))
const IES_OPTIONS = iesList.map(i => ({ value: String(i.codigo), label: `${i.codigo} - ${i.nome}`, searchLabel: `${i.nome}` }))
const AREA_CONHECIMENTO_OPTIONS = areasConhecimento.filter(a => typeof a.codigo === 'number').map(a => ({ value: String(a.codigo), label: `${a.codigo} - ${a.nome}`, searchLabel: `${a.nome}` }))
const AREA_POS_OPTIONS = areasPosGraduacao.map(a => ({ value: String(a.codigo), label: `${a.codigo} - ${a.nome}`, searchLabel: `${a.nome}` }))

interface Props {
  schoolId: string | null
  person?: Person | null
  onSaved: () => void
  onCancel: () => void
}

type FormData = Record<string, any>

const defaultForm: FormData = {
  perfil: [] as string[],
  codigo_pessoa: null,
  inep_id: '',
  cpf: '',
  nome_completo: '',
  data_nascimento: '',
  filiacao_declarada: '',
  filiacao_1: '',
  filiacao_2: '',
  sexo: '',
  cor_raca: '',
  povo_indigena: '',
  nacionalidade: '',
  pais_nacionalidade: '',
  municipio_nascimento: '',
  certidao_nascimento: '',
  email: '',
  telefone_celular: '',
  telefone_fixo: '',
  whatsapp: '',
  telefone_secundario: '',
  email_responsavel: '',
  // Deficiência
  deficiencia: false,
  cegueira: false, baixa_visao: false, visao_monocular: false,
  surdez: false, deficiencia_auditiva: false, surdocegueira: false,
  deficiencia_fisica: false, deficiencia_intelectual: false, deficiencia_multipla: false,
  tea: false, altas_habilidades: false,
  // Transtornos
  transtorno_aprendizagem: false,
  discalculia: false, disgrafia: false, dislalia: false,
  dislexia: false, tdah: false, tpac: false,
  // Recursos SAEB
  auxilio_ledor: false, auxilio_transcricao: false, guia_interprete: false,
  tradutor_libras: false, leitura_labial: false, prova_ampliada: false,
  prova_superampliada: false, cd_audio: false, prova_libras: false,
  prova_video_libras: false, material_braille: false, prova_braille: false,
  tempo_adicional: false, nenhum_recurso: false,
  // Condições de Saúde
  medicamentos: '',
  // Endereço
  pais_residencia: '76', cep: '',
  municipio_residencia: '', zona_residencia: '', localizacao_diferenciada: '',
  bairro: '', logradouro: '', numero: '', complemento: '', referencia: '',
  // Escolaridade
  escolaridade: '', tipo_ensino_medio: '',
  curso_superior_1: '', ano_conclusao_1: 0, ies_1: '',
  curso_superior_2: '', ano_conclusao_2: 0, ies_2: '',
  curso_superior_3: '', ano_conclusao_3: 0, ies_3: '',
  curso_situacao_1: '', curso_situacao_2: '', curso_situacao_3: '',
  curso_carga_horaria_1: '', curso_carga_horaria_2: '', curso_carga_horaria_3: '',
  curso_data_termino_1: '', curso_data_termino_2: '', curso_data_termino_3: '',
  curso_data_inicio_1: '', curso_data_inicio_2: '', curso_data_inicio_3: '',
  // Pós
  pos_tipo_1: '', pos_area_1: '', pos_ano_1: 0,
  pos_tipo_2: '', pos_area_2: '', pos_ano_2: 0,
  pos_tipo_3: '', pos_area_3: '', pos_ano_3: 0,
  pos_tipo_4: '', pos_area_4: '', pos_ano_4: 0,
  pos_tipo_5: '', pos_area_5: '', pos_ano_5: 0,
  pos_tipo_6: '', pos_area_6: '', pos_ano_6: 0,
  sem_pos: false,
  // Formação Continuada
  form_creche: false, form_pre_escola: false, form_alfabetizacao: false,
  form_anos_iniciais: false, form_anos_finais: false, form_medio: false,
  form_eja: false, form_especial: false, form_indigena: false,
  form_campo: false, form_ambiental: false, form_direitos: false,
  form_bilingue: false, form_tic: false, form_integral: false,
  form_genero: false, form_direitos_crianca: false, form_etnico_raciais: false,
  form_gestao_escolar: false, form_outros: false, sem_formacao: false,
  recebeu_formacao: false,
  // Vinculos responsável
  vinculos: [] as any[],
  alunosBusca: [] as { id: string; nome_completo: string }[],
  perfil_id: null,
  perfis_acesso: [] as string[],
  permitir_acesso: false,
  senha: '',
  confirmacao_senha: '',
}

export function PessoaForm({ schoolId: propSchoolId, person, onSaved, onCancel }: Props) {
  const { isSuperAdmin, allSchools } = useAuth()
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(allSchools[0]?.id || '')
  const schoolId = (!propSchoolId && isSuperAdmin) ? selectedSchoolId : propSchoolId
  const [form, setForm] = useState<FormData>({ ...defaultForm })
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('identificacao')
  const [alunosSearch, setAlunosSearch] = useState('')
  const [alunosOptions, setAlunosOptions] = useState<{ id: string; nome_completo: string }[]>([])
  const [cursoCount, setCursoCount] = useState(1)
  const [posCount, setPosCount] = useState(1)
  const [vinculosProfissionais, setVinculosProfissionais] = useState<VinculoProfissionalWithFuncao[]>([])
  const [funcoesOptions, setFuncoesOptions] = useState<FuncaoProfissional[]>([])
  const [perfisAcesso, setPerfisAcesso] = useState<Perfil[]>([])

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }))

  // Carregar funções disponíveis
  useEffect(() => {
    getFuncoes(schoolId).then(setFuncoesOptions).catch(() => {})
    listarPerfis(schoolId, { ativo: true }).then(setPerfisAcesso).catch(() => {})
  }, [schoolId])

  useEffect(() => {
    if (person) {
      const data: FormData = { ...defaultForm }
      for (const key of Object.keys(defaultForm)) {
        if (key in person) data[key] = (person as any)[key] ?? defaultForm[key]
      }
      data.data_nascimento = person.data_nascimento?.split('T')[0] || ''
      data.perfil = person.perfil || []
      data.auxilio_transcricao = (person as any).auxilio_transcricao ?? false
      data.vinculos = []
      if (person.codigo_pessoa) data.codigo_pessoa = person.codigo_pessoa
      setForm(data)

      // Carregar vínculos profissionais na edição
      if (person.perfil?.includes('profissional') || person.perfil?.includes('gestor')) {
        getVinculosProfissionais(person.id).then(setVinculosProfissionais).catch(() => {})
      }

      // Calcular quantos cursos superiores estão preenchidos
      let count = 1
      for (let i = 2; i <= 3; i++) {
        if (data[`curso_superior_${i}`]) count = i
      }
      setCursoCount(count)

      // Calcular quantas pós-graduações estão preenchidas
      let posCountVal = 1
      for (let i = 2; i <= 6; i++) {
        if (data[`pos_tipo_${i}`]) posCountVal = i
      }
      setPosCount(posCountVal)

      if (person.perfil?.includes('responsavel')) {
        getVinculosResponsavel(person.id).then((vinculos: any[]) => {
          setForm(prev => ({ ...prev, vinculos: vinculos || [] }))
        }).catch(() => {})
      }

      // Carregar informações de saúde
      if (schoolId) {
        import('@/lib/actions/people').then(({ buscarSaudeEstudante }) => {
          buscarSaudeEstudante(person.id, schoolId).then(saude => {
            if (saude?.medicamentos) setForm(prev => ({ ...prev, medicamentos: saude.medicamentos }))
          }).catch(() => {})
        })
      }
    }
  }, [person])

  // Auto-select Brasil quando nacionalidade for Brasileira
  useEffect(() => {
    if (form.nacionalidade === '1' && form.pais_nacionalidade !== '76') {
      set('pais_nacionalidade', '76')
    }
    if (!form.nacionalidade || form.nacionalidade === '') {
      set('pais_nacionalidade', '')
    }
  }, [form.nacionalidade])

  const buscarAlunosHandler = async (search: string) => {
    setAlunosSearch(search)
    if (search.length < 2) { setAlunosOptions([]); return }
    try {
      const data = await buscarAlunos(schoolId, search)
      setAlunosOptions(data || [])
    } catch { setAlunosOptions([]) }
  }

  const adicionarVinculo = (alunoId: string) => {
    if (form.vinculos.some((v: any) => v.aluno_id === alunoId)) return
    const aluno = alunosOptions.find(a => a.id === alunoId)
    if (!aluno) return
    setForm(prev => ({
      ...prev,
      vinculos: [...prev.vinculos, { aluno_id: alunoId, aluno_nome: aluno.nome_completo, tipo_vinculo: '3', principal: false, autorizado_retirar: true, autorizado_boleto: true, receber_comunicados: true, _new: true }],
    }))
    setAlunosSearch('')
    setAlunosOptions([])
  }

  const removerVinculo = (idx: number) => {
    setForm(prev => ({ ...prev, vinculos: prev.vinculos.filter((_: any, i: number) => i !== idx) }))
  }

  const updateVinculo = (idx: number, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      vinculos: prev.vinculos.map((v: any, i: number) => i === idx ? { ...v, [field]: value } : v),
    }))
  }

  // Vínculo Profissional
  const adicionarVinculoProfissional = () => {
    setVinculosProfissionais(prev => [...prev, {
      id: '',
      person_id: '',
      school_id: schoolId,
      regime_contratacao: null,
      funcao_id: null,
      situacao: null,
      data_inicio: null,
      carga_horaria: null,
      observacoes: null,
      data_inicio_afastamento: null,
      data_termino_afastamento: null,
      data_termino: null,
      created_at: '',
      updated_at: '',
      funcao: null,
      _new: true,
    } as any])
  }

  const removerVinculoProfissional = (idx: number) => {
    setVinculosProfissionais(prev => prev.filter((_, i) => i !== idx))
  }

  const updateVinculoProfissionalState = (idx: number, field: string, value: any) => {
    setVinculosProfissionais(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v))
  }

  const handleSave = async () => {
    if (!form.nome_completo.trim()) { toast.error('Nome completo é obrigatório'); return }
    if (!form.perfil || form.perfil.length === 0) { toast.error('Selecione pelo menos um perfil'); return }
    if (isAluno && !form.cpf && !form.certidao_nascimento?.trim()) { toast.error('Informe CPF ou Matrícula da Certidão de Nascimento'); return }
    if (apenasResponsavel && !form.cpf) { toast.error('CPF é obrigatório para Responsável'); return }
    if (form.inep_id?.trim() && schoolId) {
      try {
        const { getPessoaPorInep } = await import('@/lib/actions/people')
        const duplicado = await getPessoaPorInep(form.inep_id.trim(), schoolId)
        if (duplicado && duplicado.id !== person?.id) {
          toast.error('Já existe uma pessoa cadastrada com esta Identificação INEP')
          return
        }
      } catch { /* ignora erro de rede */ }
    }
    // Campos obrigatórios da Identificação
    if (isAluno || isProfissionalOuGestor) {
      if (!form.data_nascimento) { toast.error('Data de nascimento é obrigatória'); return }
      if (!form.sexo) { toast.error('Sexo é obrigatório'); return }
      if (!form.cor_raca) { toast.error('Cor/Raça é obrigatória'); return }
      if (!form.nacionalidade) { toast.error('Nacionalidade é obrigatória'); return }
      if (!form.pais_nacionalidade) { toast.error('País de nacionalidade é obrigatório'); return }
      if (form.nacionalidade === '1' && !form.municipio_nascimento) { toast.error('Município de nascimento é obrigatório'); return }
      if (form.filiacao_declarada === '1' && !form.filiacao_1) { toast.error('Filiação 1 (mãe) é obrigatória'); return }
      if (form.filiacao_declarada === '1' && !form.filiacao_2) { toast.error('Filiação 2 (pai) é obrigatória'); return }
    }
    if (isAluno && !form.whatsapp) { toast.error('Telefone principal (WhatsApp) é obrigatório'); return }
    if (isProfissionalOuGestor && !form.email?.trim()) { toast.error('E-mail é obrigatório para Profissional/Gestor'); return }
    if (isAluno || isProfissionalOuGestor) {
      if (!form.pais_residencia) { toast.error('País de residência é obrigatório'); return }
      if (form.pais_residencia === '76') {
        if (!form.cep) { toast.error('CEP é obrigatório para residentes no Brasil'); return }
        if (!form.municipio_residencia) { toast.error('Município de residência é obrigatório para residentes no Brasil'); return }
        if (!form.logradouro) { toast.error('Logradouro é obrigatório'); return }
        if (!form.numero) { toast.error('Número é obrigatório'); return }
        if (!form.bairro) { toast.error('Bairro é obrigatório'); return }
      }
      if (!form.zona_residencia) { toast.error('Zona de residência é obrigatória'); return }
      if (!form.localizacao_diferenciada) { toast.error('Localização diferenciada é obrigatória'); return }
    }
    if (isProfissionalOuGestor) {
      if (!form.escolaridade) { toast.error('Escolaridade é obrigatória para Profissional/Gestor'); return }
      if (form.escolaridade === '6') {
        const temPos = [1, 2, 3, 4, 5, 6].some(i => form[`pos_tipo_${i}`])
        if (!form.sem_pos && !temPos) { toast.error('Informe a Pós-Graduação ou marque "Não tem pós-graduação"'); return }
      }
      const temFormacao = FORMACAO_CAMPOS.some(c => form[c.key])
      if (!form.sem_formacao && !temFormacao) { toast.error('Informe a Formação Continuada ou marque "Nenhuma"'); return }
    }
    if (isProfissionalOuGestor) {
      if ((form.escolaridade === '6' || form.escolaridade === '7') && !form.tipo_ensino_medio) {
        toast.error('Tipo de Ensino Médio Cursado é obrigatório'); return
      }
      if (form.escolaridade === '6') {
        for (let i = 1; i <= cursoCount; i++) {
          if (!form[`curso_superior_${i}`]) continue
          const situacao = form[`curso_situacao_${i}`]
          if (!situacao) { toast.error(`Situação do Curso Superior ${i} é obrigatória`); return }
          if (situacao === 'concluido' && !form[`curso_data_termino_${i}`]) { toast.error(`Data de Término do Curso Superior ${i} é obrigatória`); return }
          if (situacao === 'cursando' && !form[`curso_data_inicio_${i}`]) { toast.error(`Data de Início do Curso Superior ${i} é obrigatória`); return }
        }
      }
      // Pós-Graduação
      if (form.escolaridade === '6' && !form.sem_pos) {
        for (let i = 1; i <= posCount; i++) {
          if (!form[`pos_tipo_${i}`]) { toast.error(`Tipo da Pós-Graduação ${i} é obrigatório`); return }
          if (!form[`pos_ano_${i}`]) { toast.error(`Ano de Conclusão da Pós-Graduação ${i} é obrigatório`); return }
          if (!form[`pos_area_${i}`]) { toast.error(`Área da Pós-Graduação ${i} é obrigatória`); return }
        }
      }
    }
    if (form.deficiencia) {
      const algumaDef = DEFICIENCIA_CAMPOS.some(c => form[c.key])
      if (!algumaDef) { toast.error('Selecione ao menos um tipo de deficiência, TEA ou Altas Habilidades'); return }
    }

    if (form.permitir_acesso) {
      if (!form.email?.trim()) { toast.error('Informe o nome de acesso (e-mail)'); return }
      if (!form.senha || form.senha.length < 10) { toast.error('Senha deve ter no mínimo 10 caracteres'); return }
      if (!/[A-Z]/.test(form.senha)) { toast.error('Senha deve conter pelo menos uma letra maiúscula'); return }
      if (!/[a-z]/.test(form.senha)) { toast.error('Senha deve conter pelo menos uma letra minúscula'); return }
      if (!/[0-9]/.test(form.senha)) { toast.error('Senha deve conter pelo menos um número'); return }
      if (!/[^A-Za-z0-9]/.test(form.senha)) { toast.error('Senha deve conter pelo menos um caractere especial'); return }
      if (form.senha !== form.confirmacao_senha) { toast.error('Senhas não conferem'); return }
    }

    if (!schoolId) { toast.error('Escola não selecionada'); return }

    // Vínculos Profissionais
    if (isProfissionalOuGestor && vinculosProfissionais.length > 0) {
      for (let i = 0; i < vinculosProfissionais.length; i++) {
        const v = vinculosProfissionais[i]
        const idx = i + 1
        if (!v.regime_contratacao) { toast.error(`Regime de Contratação do Vínculo ${idx} é obrigatório`); return }
        if (!v.funcao_id) { toast.error(`Função do Vínculo ${idx} é obrigatória`); return }
        if (!v.situacao) { toast.error(`Situação do Vínculo ${idx} é obrigatória`); return }
        if (!v.data_inicio) { toast.error(`Data de Início do Vínculo ${idx} é obrigatória`); return }
        if (!v.carga_horaria) { toast.error(`Carga Horária do Vínculo ${idx} é obrigatória`); return }
        if (v.situacao === '2' && !v.data_inicio_afastamento) { toast.error(`Data de Início do Afastamento do Vínculo ${idx} é obrigatória`); return }
        if (v.situacao === '3' && !v.data_termino) { toast.error(`Data de Término do Vínculo ${idx} é obrigatória`); return }
      }
    }

    setSaving(true)
    try {
      const payload: any = { ...form, school_id: schoolId }

      for (const key of Object.keys(payload)) {
        if (typeof payload[key] === 'boolean') continue
        if (payload[key] === '') payload[key] = null
      }

      delete payload.vinculos
      delete payload.alunosBusca
      delete payload.permitir_acesso
      delete payload.senha
      delete payload.confirmacao_senha
      delete payload.email_responsavel
      delete payload.perfis_acesso
      for (let i = 1; i <= 3; i++) {
        delete payload[`area_pedagogica_${i}`]
      }

      const healthMedicamentos = payload.medicamentos
      delete payload.medicamentos

      let personId: string | undefined

      if (person) {
        await updatePerson(person.id, payload)
        personId = person.id
        // Salvar vínculos profissionais (edição)
        for (const v of vinculosProfissionais) {
          if (v.id) {
            await updateVinculoProfissional(v.id, {
              regime_contratacao: v.regime_contratacao,
              funcao_id: v.funcao_id,
              situacao: v.situacao,
              data_inicio: v.data_inicio,
              carga_horaria: v.carga_horaria,
              observacoes: v.observacoes,
              data_inicio_afastamento: v.data_inicio_afastamento,
              data_termino_afastamento: v.data_termino_afastamento,
              data_termino: v.data_termino,
            })
          } else {
            await createVinculoProfissional({
              person_id: person.id,
              school_id: schoolId,
              regime_contratacao: v.regime_contratacao,
              funcao_id: v.funcao_id,
              situacao: v.situacao,
              data_inicio: v.data_inicio,
              carga_horaria: v.carga_horaria,
              observacoes: v.observacoes,
              data_inicio_afastamento: v.data_inicio_afastamento,
              data_termino_afastamento: v.data_termino_afastamento,
              data_termino: v.data_termino,
            })
          }
        }
      } else {
        const created = await createPerson(payload)
        personId = created.id
        for (const v of form.vinculos) {
          if (v._new && created) {
            await vincularResponsavel(created.id, v.aluno_id, v)
          }
        }
        // Salvar vínculos profissionais (criação)
        for (const v of vinculosProfissionais) {
          await createVinculoProfissional({
            person_id: created.id,
            school_id: schoolId,
            regime_contratacao: v.regime_contratacao,
            funcao_id: v.funcao_id,
            situacao: v.situacao,
            data_inicio: v.data_inicio,
            carga_horaria: v.carga_horaria,
            observacoes: v.observacoes,
            data_inicio_afastamento: v.data_inicio_afastamento,
            data_termino_afastamento: v.data_termino_afastamento,
            data_termino: v.data_termino,
          })
        }
      }

      if (form.permitir_acesso && form.senha && personId) {
        await criarAuthUser({
          email: form.email,
          password: form.senha,
          personId,
          schoolId,
        })
      }

      // Salvar informações de saúde
      if (personId && healthMedicamentos) {
        await salvarSaudeEstudante(personId, schoolId, {
          medicamentos: healthMedicamentos,
        })
      }

      toast.success(person ? 'Usuário atualizado!' : 'Usuário criado!')
      onSaved()
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + (err?.message || err?.details || 'erro desconhecido'))
    } finally {
      setSaving(false)
    }
  }

  const perfis = [
    { value: 'aluno', label: 'Aluno' },
    { value: 'profissional', label: 'Profissional' },
    { value: 'gestor', label: 'Gestor' },
    { value: 'responsavel', label: 'Responsável' },
  ]

  const perfisAtivos = (form.perfil as string[]) || []
  const isAluno = perfisAtivos.includes('aluno')
  const isProfissionalOuGestor = perfisAtivos.includes('profissional') || perfisAtivos.includes('gestor')
  const isResponsavel = perfisAtivos.includes('responsavel')
  const apenasResponsavel = isResponsavel && !isAluno && !isProfissionalOuGestor
  const hasDeficiencia = form.deficiencia
  const hasTranstorno = form.transtorno_aprendizagem

  // Recursos permitidos baseados nas deficiências/transtornos selecionados
  const recursosDisponiveis = useMemo(() => {
    let keys = new Set<string>()
    for (const d of DEFICIENCIA_CAMPOS) {
      if (form[d.key]) {
        for (const r of (DEFICIENCIA_RECURSOS[d.key] || [])) keys.add(r)
      }
    }
    // Se tem só transtorno (sem deficiência), libera todos os recursos
    if (keys.size === 0 && form.transtorno_aprendizagem) {
      return RECURSO_CAMPOS
    }
    return RECURSO_CAMPOS.filter(c => keys.has(c.key))
  }, [form.cegueira, form.baixa_visao, form.visao_monocular, form.surdez, form.deficiencia_auditiva, form.surdocegueira, form.deficiencia_fisica, form.deficiencia_intelectual, form.deficiencia_multipla, form.tea, form.altas_habilidades, form.transtorno_aprendizagem])

  // Limpar recursos não disponíveis quando muda deficiência
  useEffect(() => {
    const chavesDisponiveis = new Set(recursosDisponiveis.map(c => c.key))
    for (const c of RECURSO_CAMPOS) {
      if (form[c.key] && !chavesDisponiveis.has(c.key) && c.key !== 'nenhum_recurso') {
        set(c.key, false)
      }
    }
  }, [recursosDisponiveis])

  const nenhumRecurso = () => {
    const next = !form.nenhum_recurso
    set('nenhum_recurso', next)
    if (next) for (const c of RECURSO_CAMPOS.filter(c => c.key !== 'nenhum_recurso')) set(c.key, false)
  }

  const toggleRecurso = (key: string) => {
    if (key === 'nenhum_recurso') { nenhumRecurso(); return }
    if (form[key]) { set(key, false); return }
    // Prova superampliada não pode estar junto com Prova Ampliada
    if (key === 'prova_superampliada' && form.prova_ampliada) set('prova_ampliada', false)
    if (key === 'prova_ampliada' && form.prova_superampliada) set('prova_superampliada', false)
    set(key, true)
    if (form.nenhum_recurso) set('nenhum_recurso', false)
  }

  const nenhumaFormacao = () => {
    const next = !form.sem_formacao
    set('sem_formacao', next)
    if (next) for (const c of FORMACAO_CAMPOS) set(c.key, false)
  }

  const marcaFormacao = (key: string) => {
    const next = !form[key]
    set(key, next)
    if (next) set('sem_formacao', false)
  }

  const toggleDeficiencia = (key: string) => {
    if (isDeficienciaDisabled(key)) return
    const checked = form[key]
    if (checked) {
      // Desmarcando um campo
      set(key, false)
      // Se desmarcou uma base e agora só tem 0 ou 1, limpa deficiência múltipla
      if (DEFICIENCIA_BASE.includes(key)) {
        const active = DEFICIENCIA_BASE.filter(k => k !== key && form[k])
        if (active.length < 2) set('deficiencia_multipla', false)
      }
    } else {
      // Marcando um campo
      // Incompatibilidades: se marcou um que é incompatível com já marcados, desmarca os incompatíveis
      const incompativeisAtivos = (INCOMPATIVEIS[key] || []).filter(k => form[k])
      for (const k of incompativeisAtivos) set(k, false)
      set(key, true)
      // deficiência múltipla precisa de 2+ bases
      if (key === 'deficiencia_multipla') {
        const active = DEFICIENCIA_BASE.filter(k => form[k])
        if (active.length < 2) {
          set('deficiencia_multipla', false)
          toast.error('Deficiência Múltipla requer pelo menos 2 deficiências (campos 18 a 25)')
          return
        }
      }
      // Se não era múltipla e virou 2+, marca múltipla automaticamente
      if (key !== 'deficiencia_multipla') {
        const active = DEFICIENCIA_BASE.filter(k => form[k] || k === key).length
        if (active >= 2 && !form.deficiencia_multipla) set('deficiencia_multipla', true)
      }
    }
  }

  const isDeficienciaDisabled = (key: string) => {
    if (key === 'deficiencia_multipla') {
      return DEFICIENCIA_BASE.filter(k => form[k]).length >= 2
    }
    if (form[key]) return false
    return (INCOMPATIVEIS[key] || []).some(k => form[k])
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 [&_[data-slot='input']]:border-border [&_[data-slot='input']]:focus-visible:border-primary [&_[data-slot='input']]:focus-visible:ring-2 [&_[data-slot='input']]:focus-visible:ring-primary/20 [&_[data-slot='checkbox']]:border-border [&_[data-slot='checkbox']]:data-[state=checked]:bg-primary">
      {isSuperAdmin && !propSchoolId && (
        <div className="px-6 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <Label className="font-medium shrink-0">Escola:</Label>
            <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Selecione a escola" />
              </SelectTrigger>
              <SelectContent>
                {allSchools.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
        <div className="px-6 pt-4 shrink-0">
          <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex h-auto min-h-[48px] w-max sm:w-full gap-1 rounded-lg border border-border bg-card p-1 shadow-xs">
              <TabsTrigger
                value="identificacao"
                className="h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground"
              >
                Identificação
              </TabsTrigger>
              {isAluno && (
                <TabsTrigger
                  value="acessibilidade"
                  className="h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground"
                >
                  Condições de Saúde
                </TabsTrigger>
              )}
              {!isResponsavel && (
                <TabsTrigger
                  value="endereco"
                  className="h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground"
                >
                  Endereço
                </TabsTrigger>
              )}
              {isProfissionalOuGestor && (
                <TabsTrigger
                  value="escolaridade"
                  className="h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground"
                >
                  Escolaridade
                </TabsTrigger>
              )}
              {isProfissionalOuGestor && (
                <TabsTrigger
                  value="posgraduacao"
                  className="h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground"
                >
                  Pós-Graduação
                </TabsTrigger>
              )}
              {isProfissionalOuGestor && (
                <TabsTrigger
                  value="formacao"
                  className="h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground"
                >
                  Formações
                </TabsTrigger>
              )}
              {isProfissionalOuGestor && (
                <TabsTrigger
                  value="vinculo"
                  className="h-10 min-h-[40px] flex-1 whitespace-normal leading-tight rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground"
                >
                  Vínculo Profissional
                </TabsTrigger>
              )}
              {isResponsavel && (
                <TabsTrigger
                  value="contato"
                  className="h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground"
                >
                  Contato/Vínculos
                </TabsTrigger>
              )}
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* ===== ABA IDENTIFICAÇÃO ===== */}
        <TabsContent value="identificacao" className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <Label>Tipo de Pessoa *</Label>
                <p className="text-[13px] text-muted-foreground">A pessoa pode ter múltiplos tipos (ex: Profissional e Responsável)</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {perfis.map(p => {
                    const isChecked = (form.perfil as string[]).includes(p.value)
                    return (
                      <ClickablePill
                        key={p.value}
                        label={p.label}
                        active={isChecked}
                        onClick={() => {
                          const current = form.perfil as string[]
                          if (isChecked) {
                            set('perfil', current.filter((x: string) => x !== p.value))
                          } else {
                            set('perfil', [...current, p.value])
                          }
                        }}
                      />
                    )
                  })}
                </div>
              </div>
              <div>
                <Label>Código da Pessoa</Label>
                <div className="w-[100px] pt-1">
                  <Input value={form.codigo_pessoa ?? ''} placeholder={person ? '' : 'Auto'} disabled className="bg-muted text-muted-foreground cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nome Completo *</Label>
            <Input
              value={form.nome_completo}
              onChange={(e) => set('nome_completo', e.target.value)}
              placeholder="Nome completo"
              aria-required="true"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CPF {isResponsavel && '*'}</Label>
              <Input
                value={formatCPF(form.cpf || '')}
                onChange={(e) => set('cpf', e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="000.000.000-00"
                maxLength={14}
                inputMode="numeric"
                aria-required={isResponsavel ? 'true' : undefined}
              />
            </div>
            {!apenasResponsavel && (
              <div className="space-y-2">
                <Label>Identificação INEP</Label>
                <Input value={form.inep_id || ''} onChange={(e) => set('inep_id', e.target.value)} placeholder="Código INEP (12 dígitos)" maxLength={12} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Nascimento *</Label>
              <DatePicker
                value={form.data_nascimento || ''}
                onChange={(v) => set('data_nascimento', v)}
                placeholder="dd/mm/aaaa"
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <Label>Sexo *</Label>
              <Select value={form.sexo} onValueChange={(v) => set('sexo', v)}>
                <SelectTrigger aria-required="true"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Masculino</SelectItem>
                  <SelectItem value="2">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!apenasResponsavel && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor/Raça *</Label>
                  <Select value={form.cor_raca} onValueChange={(v) => set('cor_raca', v)}>
                    <SelectTrigger aria-required="true"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Não Declarada</SelectItem>
                      <SelectItem value="1">Branca</SelectItem>
                      <SelectItem value="2">Preta</SelectItem>
                      <SelectItem value="3">Parda</SelectItem>
                      <SelectItem value="4">Amarela</SelectItem>
                      <SelectItem value="5">Indígena</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.cor_raca === '5' && !isProfissionalOuGestor && (
                    <div className="mt-2">
                      <Combobox label="Povo Indígena" options={POVO_OPTIONS} value={form.povo_indigena} onChange={(v) => set('povo_indigena', v)} searchThreshold={2} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Nacionalidade *</Label>
                  <Select value={form.nacionalidade} onValueChange={(v) => set('nacionalidade', v)}>
                    <SelectTrigger aria-required="true"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Brasileira</SelectItem>
                      <SelectItem value="2">Brasileira - Nascido no Exterior</SelectItem>
                      <SelectItem value="3">Estrangeira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {form.nacionalidade && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Combobox
                      label="País de Nacionalidade *"
                      options={PAIS_OPTIONS}
                      value={form.pais_nacionalidade || ''}
                      onChange={(v) => set('pais_nacionalidade', v)}
                      placeholder="Selecione o país"
                      disabled={form.nacionalidade === '1'}
                    />
                  </div>
                  {form.nacionalidade === '1' && (
                    <div className="space-y-2">
                      <Combobox
                        label="Município de Nascimento *"
                        options={MUNICIPIO_OPTIONS}
                        value={form.municipio_nascimento || ''}
                        onChange={(v) => set('municipio_nascimento', v)}
                        placeholder="Digite para buscar..."
                        searchThreshold={2}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!isResponsavel && (
            <div className="space-y-2">
              <Label>Filiação</Label>
              <Select value={form.filiacao_declarada} onValueChange={(v) => set('filiacao_declarada', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Não declarado/Ignorado</SelectItem>
                  <SelectItem value="1">Filiação 1 e/ou Filiação 2</SelectItem>
                </SelectContent>
              </Select>
              {form.filiacao_declarada === '1' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label>Filiação 1 (mãe) *</Label>
                    <Input value={form.filiacao_1} onChange={(e) => set('filiacao_1', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Filiação 2 (pai) *</Label>
                    <Input value={form.filiacao_2} onChange={(e) => set('filiacao_2', e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          )}

          {isAluno && (
            <div className="space-y-4 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone principal (WhatsApp) *</Label>
                  <Input
                    value={form.whatsapp || ''}
                    onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="(00) 00000-0000"
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone secundário</Label>
                  <Input
                    value={form.telefone_secundario || ''}
                    onChange={(e) => set('telefone_secundario', e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="(00) 00000-0000"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-mail do responsável</Label>
                <Input
                  type="email"
                  value={form.email_responsavel || ''}
                  onChange={(e) => set('email_responsavel', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          )}

          {!isAluno && !apenasResponsavel && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone principal (WhatsApp)</Label>
                  <Input
                    value={form.whatsapp || ''}
                    onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="(00) 00000-0000"
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone secundário</Label>
                  <Input
                    value={form.telefone_secundario || ''}
                    onChange={(e) => set('telefone_secundario', e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="(00) 00000-0000"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  aria-required="true"
                />
              </div>
            </>
          )}

          {!isAluno && !apenasResponsavel && (
            <>
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="permitir-acesso"
                    checked={form.permitir_acesso}
                    onCheckedChange={(v) => set('permitir_acesso', v === true)}
                  />
                  <Label htmlFor="permitir-acesso" className="font-medium cursor-pointer">Permitir acesso ao sistema</Label>
                </div>
                <p className="text-[13px] text-muted-foreground ml-6">Cria um usuário para login no sistema</p>
              </div>

              {form.permitir_acesso && (
                <div className="ml-6 space-y-4">
                  <p className="text-[15px] text-muted-foreground">O acesso ao sistema é feito com o e-mail cadastrado ou com o CPF.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Senha</Label>
                      <Input type="password" value={form.senha} onChange={(e) => set('senha', e.target.value)} placeholder="Digite a senha" />
                      <p className="text-[13px] text-muted-foreground mt-1">Mínimo 10 caracteres: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Confirmação de senha</Label>
                      <Input type="password" value={form.confirmacao_senha} onChange={(e) => set('confirmacao_senha', e.target.value)} placeholder="Repita a senha" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Perfil de acesso</Label>
                    <p className="text-[13px] text-muted-foreground">Define as permissões do usuário no sistema</p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      {perfisAcesso.map(p => {
                        const checked = form.perfis_acesso && (form.perfis_acesso as string[]).includes(p.id)
                        return (
                          <div key={p.id} className="flex items-center gap-2 cursor-pointer" onClick={() => {
                            const current = (form.perfis_acesso as string[]) || []
                            if (checked) {
                              set('perfis_acesso', current.filter(x => x !== p.id))
                            } else {
                              set('perfis_acesso', [...current, p.id])
                            }
                          }}>
                            <Checkbox checked={checked || false} className="pointer-events-none" />
                            <span className="text-sm">{p.nome}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {isAluno && (
            <div className="space-y-2">
              <Label>
                Matrícula da Certidão de Nascimento
                {!form.cpf && <span className="text-destructive"> *</span>}
              </Label>
              <Input value={form.certidao_nascimento} onChange={(e) => set('certidao_nascimento', e.target.value)} placeholder="30 + 2 caracteres" maxLength={32} />
              {!form.cpf && <p role="alert" className="text-[13px] text-destructive">Obrigatório quando não informado CPF.</p>}
            </div>
          )}
        </TabsContent>

        {/* ===== ABA ACESSIBILIDADE / SAEB ===== */}
        {isAluno && (
          <TabsContent value="acessibilidade" className="space-y-5 ">
            <div className="space-y-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                const next = !form.deficiencia
                set('deficiencia', next)
                if (!next) for (const c of DEFICIENCIA_CAMPOS) set(c.key, false)
              }}>
                <Checkbox checked={form.deficiencia} className="pointer-events-none" />
                <Label className="cursor-pointer">Possui Deficiência, TEA ou Altas Habilidades</Label>
              </div>

              {hasDeficiencia && (
                <FormCard title="Tipos de Deficiência / TEA / AH">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DEFICIENCIA_CAMPOS.map(c => {
                      const disabled = isDeficienciaDisabled(c.key)
                      return (
                        <div key={c.key} className={`flex items-center gap-2 ${disabled ? 'opacity-50' : 'cursor-pointer'}`} onClick={() => toggleDeficiencia(c.key)}>
                          <Checkbox checked={form[c.key]} disabled={disabled} className="pointer-events-none" />
                          <span className="text-sm">{c.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </FormCard>
              )}

              <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                const next = !form.transtorno_aprendizagem
                set('transtorno_aprendizagem', next)
                if (!next) for (const c of TRANSTORNO_CAMPOS) set(c.key, false)
              }}>
                <Checkbox checked={form.transtorno_aprendizagem} className="pointer-events-none" />
                <Label className="cursor-pointer">Possui Transtornos que impactam a aprendizagem</Label>
              </div>

              {hasTranstorno && (
                <FormCard title="Tipos de Transtorno">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TRANSTORNO_CAMPOS.map(c => (
                      <div key={c.key} className="flex items-center gap-2 cursor-pointer" onClick={() => set(c.key, !form[c.key])}>
                        <Checkbox checked={form[c.key]} className="pointer-events-none" />
                        <span className="text-sm">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </FormCard>
              )}

              {(hasDeficiencia || hasTranstorno) && recursosDisponiveis.length > 0 && (
                <FormCard title="Recursos de Acessibilidade" description="Recursos disponíveis conforme a(s) deficiência(s) selecionada(s) (Tabela INEP 2025)">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recursosDisponiveis.map(c => (
                      <div key={c.key} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleRecurso(c.key)}>
                        <Checkbox checked={form[c.key]} className="pointer-events-none" />
                        <span className="text-sm">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </FormCard>
              )}
            </div>

            {/* Outras informações de saúde */}
            <div className="space-y-2">
              <Label>Outras informações de saúde</Label>
              <Textarea
                value={form.medicamentos || ''}
                onChange={(e) => set('medicamentos', e.target.value)}
                rows={2}
                className="border-border"
                placeholder="Medicamentos de uso contínuo, alergias, condições relevantes para o ambiente escolar"
              />
            </div>
          </TabsContent>
        )}

        {/* ===== ABA ENDEREÇO ===== */}
        {!isResponsavel && (
          <TabsContent value="endereco" className="space-y-5 ">
            <div className="space-y-2">
              <Combobox
                label="País de Residência *"
                options={PAIS_OPTIONS}
                value={form.pais_residencia || ''}
                onChange={(v) => set('pais_residencia', v)}
                placeholder="Selecione o país"
              />
            </div>
            {form.pais_residencia === '76' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CEP *</Label>
                    <Input value={form.cep} onChange={(e) => set('cep', e.target.value)} placeholder="00000-000" maxLength={8} />
                  </div>
                  <div className="space-y-2">
                    <Combobox
                      label="Município de Residência *"
                      options={MUNICIPIO_OPTIONS}
                      value={form.municipio_residencia || ''}
                      onChange={(v) => set('municipio_residencia', v)}
                      placeholder="Digite para buscar..."
                      searchThreshold={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logradouro *</Label>
                    <Input value={form.logradouro} onChange={(e) => set('logradouro', e.target.value)} placeholder="Rua, Avenida..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Número *</Label>
                    <Input value={form.numero} onChange={(e) => set('numero', e.target.value)} placeholder="Nº" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bairro *</Label>
                    <Input value={form.bairro} onChange={(e) => set('bairro', e.target.value)} placeholder="Bairro" />
                  </div>
                  <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input value={form.complemento} onChange={(e) => set('complemento', e.target.value)} placeholder="Apto, Bloco..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ponto de Referência</Label>
                  <Input value={form.referencia} onChange={(e) => set('referencia', e.target.value)} placeholder="Próximo a..." />
                </div>

                {!isResponsavel && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Zona de Residência *</Label>
                      <Select value={form.zona_residencia} onValueChange={(v) => set('zona_residencia', v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Urbana</SelectItem>
                          <SelectItem value="2">Rural</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Localização Diferenciada *</Label>
                      <Select value={form.localizacao_diferenciada} onValueChange={(v) => set('localizacao_diferenciada', v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Área de Assentamento</SelectItem>
                          <SelectItem value="2">Terra Indígena</SelectItem>
                          <SelectItem value="3">Comunidade Quilombola</SelectItem>
                          <SelectItem value="7">Não está em área diferenciada</SelectItem>
                          <SelectItem value="8">Comunidades Tradicionais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        )}

        {/* ===== ABA ESCOLARIDADE ===== */}
        {isProfissionalOuGestor && (
          <TabsContent value="escolaridade" className="space-y-5 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Maior Nível de Escolaridade Concluído *</Label>
                <Select value={form.escolaridade} onValueChange={(v) => set('escolaridade', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Não concluiu o Ensino Fundamental</SelectItem>
                    <SelectItem value="2">Ensino Fundamental</SelectItem>
                    <SelectItem value="7">Ensino Médio</SelectItem>
                    <SelectItem value="6">Educação Superior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(form.escolaridade === '6' || form.escolaridade === '7') && (
                <div className="space-y-2">
                  <Label>Tipo de Ensino Médio Cursado *</Label>
                  <Select value={form.tipo_ensino_medio} onValueChange={(v) => set('tipo_ensino_medio', v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Formação Geral</SelectItem>
                      <SelectItem value="2">Modalidade Normal (Magistério)</SelectItem>
                      <SelectItem value="3">Curso Técnico</SelectItem>
                      <SelectItem value="4">Magistério Indígena</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {form.escolaridade === '6' && (
              <>
                {Array.from({ length: cursoCount }, (_, i) => i + 1).map(i => (
                  <Card key={i}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-[16px] font-semibold">Curso Superior {i}</Label>
                        {i > 1 && (
                          <Button type="button" variant="ghost" size="icon-sm" onClick={() => {
                            for (const key of [`curso_superior_${i}`, `ano_conclusao_${i}`, `ies_${i}`]) set(key, '')
                            setCursoCount(i - 1)
                          }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2"><Label>Curso</Label><Combobox options={CURSO_OPTIONS} value={form[`curso_superior_${i}`]} onChange={(v) => set(`curso_superior_${i}`, v)} searchThreshold={2} /></div>
                      <div className="space-y-2"><Label>Instituição de Ensino Superior</Label><Combobox options={IES_OPTIONS} value={form[`ies_${i}`]} onChange={(v) => set(`ies_${i}`, v)} searchThreshold={2} /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Situação *</Label>
                          <Select value={form[`curso_situacao_${i}`]} onValueChange={(v) => set(`curso_situacao_${i}`, v)}>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="concluido">Concluído</SelectItem>
                              <SelectItem value="cursando">Cursando</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {form[`curso_situacao_${i}`] === 'concluido' && (
                          <div className="space-y-2">
                            <Label>Data de Término *</Label>
                            <Input type="date" value={form[`curso_data_termino_${i}`] || ''} onChange={(e) => set(`curso_data_termino_${i}`, e.target.value)} />
                          </div>
                        )}
                        {form[`curso_situacao_${i}`] === 'cursando' && (
                          <div className="space-y-2">
                            <Label>Data de Início *</Label>
                            <Input type="date" value={form[`curso_data_inicio_${i}`] || ''} onChange={(e) => set(`curso_data_inicio_${i}`, e.target.value)} />
                          </div>
                        )}
                        {form[`curso_situacao_${i}`] === 'concluido' && (
                          <div className="space-y-2">
                            <Label>Carga Horária</Label>
                            <Input type="text" placeholder="HHHH:MM" pattern="\d{4}:\d{2}" value={form[`curso_carga_horaria_${i}`] || ''} onChange={(e) => set(`curso_carga_horaria_${i}`, e.target.value)} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {cursoCount < 3 && (
                  <Button variant="outline" size="sm" onClick={() => setCursoCount(c => c + 1)}>
                    <Plus className="mr-2 h-4 w-4" /> Adicionar curso superior
                  </Button>
                )}
              </>

            )}
          </TabsContent>
        )}

        {/* ===== ABA PÓS-GRADUAÇÃO ===== */}
        {isProfissionalOuGestor && (
          <TabsContent value="posgraduacao" className="space-y-5 ">
            {form.escolaridade === '6' ? (
              <>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                  const next = !form.sem_pos
                  set('sem_pos', next)
                  if (next) for (let i = 1; i <= 6; i++) { set(`pos_tipo_${i}`, ''); set(`pos_area_${i}`, ''); set(`pos_ano_${i}`, 0) }
                }}>
                  <Checkbox checked={form.sem_pos} className="pointer-events-none" />
                  <Label className="cursor-pointer">Não tem pós-graduação concluída</Label>
                </div>

                {!form.sem_pos && Array.from({ length: posCount }, (_, i) => i + 1).map(i => (
                  <Card key={i}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-[16px] font-semibold">Pós-Graduação {i}</Label>
                        {i > 1 && (
                          <Button type="button" variant="ghost" size="icon-sm" onClick={() => {
                            for (const key of [`pos_tipo_${i}`, `pos_area_${i}`, `pos_ano_${i}`]) set(key, '')
                            setPosCount(i - 1)
                          }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Select value={form[`pos_tipo_${i}`]} onValueChange={(v) => set(`pos_tipo_${i}`, v)}>
                            <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Especialização</SelectItem>
                              <SelectItem value="2">Mestrado</SelectItem>
                              <SelectItem value="3">Doutorado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label>Ano Conclusão</Label><Input type="number" value={form[`pos_ano_${i}`] || ''} onChange={(e) => set(`pos_ano_${i}`, parseInt(e.target.value) || 0)} /></div>
                      </div>
                      <div className="space-y-2">
                        <Label>Área</Label>
                        <Select value={form[`pos_area_${i}`]} onValueChange={(v) => set(`pos_area_${i}`, v)}>
                          <SelectTrigger><SelectValue placeholder="Selecione a área" /></SelectTrigger>
                          <SelectContent>
                            {AREA_POS_OPTIONS.map(a => (
                              <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!form.sem_pos && posCount < 6 && (
                  <Button variant="outline" size="sm" onClick={() => setPosCount(c => c + 1)}>
                    <Plus className="mr-2 h-4 w-4" /> Adicionar pós-graduação
                  </Button>
                )}
              </>
            ) : (
              <p className="text-[15px] text-muted-foreground">Disponível apenas para nível superior concluído.</p>
            )}
          </TabsContent>
        )}

        {/* ===== ABA FORMAÇÕES ===== */}
        {isProfissionalOuGestor && (
          <TabsContent value="formacao" className="space-y-5">

            <FormCard title="Formação Continuada" description="Cursos de formação continuada com mínimo de 80h">
              <div className="flex items-center gap-2 pb-3 cursor-pointer" onClick={nenhumaFormacao}>
                <Checkbox checked={form.sem_formacao} className="pointer-events-none" />
                <Label className="cursor-pointer">Nenhum</Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FORMACAO_CAMPOS.map(c => (
                  <div key={c.key} className="flex items-center gap-2 cursor-pointer" onClick={() => marcaFormacao(c.key)}>
                    <Checkbox checked={form[c.key]} className="pointer-events-none" />
                    <span className="text-sm">{c.label}</span>
                  </div>
                ))}
              </div>
            </FormCard>

            {form.escolaridade === '6' && (
              <FormCard title="Formação Pedagógica" description="Censo 2026 — Campos 67 a 69">
                <div className="space-y-4">
                  {(() => {
                    const grupos = [
                      { nome: 'Linguagens', codigos: [6, 7, 8, 30, 9, 27, 23, 31, 10, 11] },
                      { nome: 'Matemática', codigos: [3] },
                      { nome: 'Ciências da Natureza', codigos: [1, 2, 4, 5] },
                      { nome: 'Ciências Humanas e Sociais', codigos: [12, 13, 14, 28, 29] },
                      { nome: 'Outras áreas', codigos: [16, 17, 25, 26, 32, 33, 99] },
                    ]
                    return [1, 2, 3].map(i => {
                      const visible = i === 1 || (i === 2 && form.area_pedagogica_1) || (i === 3 && form.area_pedagogica_2)
                      if (!visible) return null
                      return (
                        <div key={i} className="space-y-2">
                          <Label>Área do Conhecimento {i}</Label>
                          <div className="flex items-center gap-2">
                            <Select value={form[`area_pedagogica_${i}`] || ''} onValueChange={(v) => set(`area_pedagogica_${i}`, v)}>
                              <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                              <SelectContent>
                                {grupos.map(g => (
                                  <SelectGroup key={g.nome}>
                                    <SelectLabel>{g.nome}</SelectLabel>
                                    {AREA_CONHECIMENTO_OPTIONS
                                      .filter(a => g.codigos.includes(Number(a.value)) && a.value !== '32' && a.value !== '99')
                                      .map(a => (
                                        <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                                      ))}
                                  </SelectGroup>
                                ))}
                              </SelectContent>
                            </Select>
                            {form[`area_pedagogica_${i}`] && (
                              <Button variant="ghost" size="icon-xs" onClick={() => set(`area_pedagogica_${i}`, '')}>
                                <X className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </FormCard>
            )}
          </TabsContent>
        )}

        {/* ===== ABA VÍNCULO PROFISSIONAL ===== */}
        {isProfissionalOuGestor && (
          <TabsContent value="vinculo" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[16px] font-semibold">Vínculos Profissionais</Label>
              <Button variant="outline" size="sm" onClick={adicionarVinculoProfissional} className="border-border">
                <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar Vínculo
              </Button>
            </div>

            {vinculosProfissionais.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Nenhum vínculo cadastrado. Clique em "Adicionar Vínculo" para começar.
              </p>
            )}

            {vinculosProfissionais.map((v, idx) => (
              <div key={idx} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Vínculo {idx + 1}</span>
                    <Button variant="ghost" size="icon-sm" onClick={() => removerVinculoProfissional(idx)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Regime de Contratação *</Label>
                      <Select value={v.regime_contratacao || ''} onValueChange={(val) => updateVinculoProfissionalState(idx, 'regime_contratacao', val)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Concursado/efetivo/estável</SelectItem>
                          <SelectItem value="2">Contrato temporário</SelectItem>
                          <SelectItem value="3">Contrato terceirizado</SelectItem>
                          <SelectItem value="4">Contrato CLT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Função *</Label>
                      <Select value={v.funcao_id || ''} onValueChange={(val) => updateVinculoProfissionalState(idx, 'funcao_id', val)}>
                        <SelectTrigger><SelectValue placeholder="Selecione a função" /></SelectTrigger>
                        <SelectContent>
                          {funcoesOptions.map(f => (
                            <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Situação *</Label>
                      <Select value={v.situacao || ''} onValueChange={(val) => {
                        updateVinculoProfissionalState(idx, 'situacao', val)
                        if (val !== '2') { updateVinculoProfissionalState(idx, 'data_inicio_afastamento', null); updateVinculoProfissionalState(idx, 'data_termino_afastamento', null) }
                        if (val !== '3') updateVinculoProfissionalState(idx, 'data_termino', null)
                      }}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Ativo</SelectItem>
                          <SelectItem value="2">Afastado</SelectItem>
                          <SelectItem value="3">Encerrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Início *</Label>
                      <Input type="date" value={v.data_inicio || ''} onChange={(e) => updateVinculoProfissionalState(idx, 'data_inicio', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Carga Horária Semanal *</Label>
                      <Input type="number" value={v.carga_horaria || ''} onChange={(e) => updateVinculoProfissionalState(idx, 'carga_horaria', e.target.value ? Number(e.target.value) : null)} min={0} max={60} />
                    </div>
                  </div>

                  {v.situacao === '2' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data de Início do Afastamento *</Label>
                        <Input type="date" value={v.data_inicio_afastamento || ''} onChange={(e) => updateVinculoProfissionalState(idx, 'data_inicio_afastamento', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Data de Término do Afastamento</Label>
                        <Input type="date" value={v.data_termino_afastamento || ''} onChange={(e) => updateVinculoProfissionalState(idx, 'data_termino_afastamento', e.target.value)} />
                      </div>
                    </div>
                  )}

                  {v.situacao === '3' && (
                    <div className="space-y-2">
                      <Label>Data de Término *</Label>
                      <Input type="date" value={v.data_termino || ''} onChange={(e) => updateVinculoProfissionalState(idx, 'data_termino', e.target.value)} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      className="border-border min-h-[60px]"
                      value={v.observacoes || ''}
                      onChange={(e) => updateVinculoProfissionalState(idx, 'observacoes', e.target.value)}
                      placeholder="Observações sobre este vínculo..."
                    />
                  </div>
                </div>
            ))}
          </TabsContent>
        )}

        {/* ===== ABA CONTATO / VÍNCULOS (RESPONSÁVEL) ===== */}
        {isResponsavel && (
          <TabsContent value="contato" className="space-y-5 ">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@exemplo.com" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefone Celular *</Label>
                <Input value={form.telefone_celular} onChange={(e) => set('telefone_celular', e.target.value)} placeholder="(00) 00000-0000" maxLength={11} />
              </div>
              <div className="space-y-2">
                <Label>Telefone Fixo</Label>
                <Input value={form.telefone_fixo} onChange={(e) => set('telefone_fixo', e.target.value)} placeholder="(00) 0000-0000" maxLength={10} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="(00) 00000-0000" maxLength={11} />
            </div>

            <FormCard title="Vínculo com Alunos">
              <div className="space-y-2">
                <Label>Buscar Aluno</Label>
                <Input
                  placeholder="Digite o nome do aluno (mín. 2 caracteres)"
                  value={alunosSearch}
                  onChange={(e) => buscarAlunosHandler(e.target.value)}
                />
                {alunosOptions.length > 0 && (
                  <div className="border border-border rounded-lg max-h-40 overflow-y-auto">
                    {alunosOptions.map(a => (
                      <Button key={a.id} variant="ghost" className="w-full justify-start px-3 py-2 text-sm h-auto font-normal" onClick={() => adicionarVinculo(a.id)}>
                        {a.nome_completo}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {form.vinculos.length > 0 && (
                <div className="space-y-2">
                  {form.vinculos.map((v: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                      <div className="flex-1 space-y-2">
                        <span className="text-sm font-medium">{v.aluno_nome}</span>
                        <div className="flex flex-wrap gap-2">
                          <Select value={v.tipo_vinculo} onValueChange={(val) => updateVinculo(idx, 'tipo_vinculo', val)}>
                            <SelectTrigger className="w-36 h-7 text-[13px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {TIPOS_VINCULO.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-[13px] cursor-pointer" onClick={() => updateVinculo(idx, 'principal', !v.principal)}>
                                  <Checkbox checked={v.principal} className="size-3 pointer-events-none" />
                                  Principal
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-56">
                                <p>Responsável principal do aluno</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-[13px] cursor-pointer" onClick={() => updateVinculo(idx, 'autorizado_retirar', !v.autorizado_retirar)}>
                                  <Checkbox checked={v.autorizado_retirar} className="size-3 pointer-events-none" />
                                  Retirar
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-56">
                                <p>Autorizado a retirar o aluno da escola</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-[13px] cursor-pointer" onClick={() => updateVinculo(idx, 'receber_comunicados', !v.receber_comunicados)}>
                                  <Checkbox checked={v.receber_comunicados} className="size-3 pointer-events-none" />
                                  Comunicados
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-56">
                                <p>Recebe comunicados escolares sobre o aluno</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <Button type="button" variant="link" onClick={() => removerVinculo(idx)} className="text-destructive text-[13px] ml-2 h-auto p-0">
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </FormCard>
          </TabsContent>
        )}
        </div>
      </Tabs>

      <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
        <Button variant="outline" onClick={onCancel} className="min-h-[40px] sm:min-h-[44px]">Cancelar</Button>
        <Button onClick={handleSave} disabled={saving} className="min-h-[40px] sm:min-h-[44px]">
          {saving ? 'Salvando...' : person ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </div>
  )
}

