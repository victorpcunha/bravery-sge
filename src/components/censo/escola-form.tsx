'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// ───────────────────── Zod Schema ─────────────────────

const checkboxValue = z.string().optional()

const digitString = (len: number, msg: string) =>
  z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), { message: msg })
    .refine((v) => !v || v.length === len, {
      message: `Deve ter exatamente ${len} dígitos`,
    })

const phoneRegex = /^\d{8,9}$/

const escolaFormSchema = z.object({
  // Tab 1: Identificação
  nome_escola: z.string().min(1, 'Nome da escola é obrigatório'),
  codigo_inep: digitString(8, 'Apenas dígitos'),
  situacao_funcionamento: z.string().min(1, 'Situação de funcionamento é obrigatória'),
  dependencia_administrativa: z.string().min(1, 'Dependência administrativa é obrigatória'),
  formato_organizacional: z.string().optional(),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  localizacao_diferenciada: z.string().min(1, 'Localização diferenciada é obrigatória'),
  data_inicio_ano: z.string().optional(),
  data_fim_ano: z.string().optional(),

  // Tab 2: Endereço e Contato
  cep: digitString(8, 'CEP deve ter 8 dígitos'),
  municipio: digitString(7, 'Código do município deve ter 7 dígitos'),
  distrito: digitString(2, 'Distrito deve ter 2 dígitos'),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  ddd: digitString(2, 'DDD deve ter 2 dígitos'),
  telefone_1: z
    .string()
    .optional()
    .refine((v) => !v || phoneRegex.test(v), { message: 'Telefone deve ter 8 ou 9 dígitos' }),
  telefone_2: z
    .string()
    .optional()
    .refine((v) => !v || phoneRegex.test(v), { message: 'Telefone deve ter 8 ou 9 dígitos' }),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  codigo_orgao_regional: z.string().optional(),

  // Tab 3: Administrativo
  orgao_secretaria_educacao: checkboxValue,
  orgao_seguranca: checkboxValue,
  orgao_saude: checkboxValue,
  orgao_outro: checkboxValue,
  mant_empresa: checkboxValue,
  mant_sindicatos: checkboxValue,
  mant_ong: checkboxValue,
  mant_sem_fins_lucrativos: checkboxValue,
  mant_sistema_s: checkboxValue,
  mant_oscip: checkboxValue,
  categoria_escola_privada: z.string().optional(),
  parceria_estadual: checkboxValue,
  parceria_municipal: checkboxValue,
  contr_est_permuta: checkboxValue,
  contr_est_contrato: checkboxValue,
  contr_est_convenio: checkboxValue,
  contr_est_termo_cooperacao: checkboxValue,
  contr_est_cessao: checkboxValue,
  contr_est_outro: checkboxValue,
  contr_mun_permuta: checkboxValue,
  contr_mun_contrato: checkboxValue,
  contr_mun_convenio: checkboxValue,
  contr_mun_termo_cooperacao: checkboxValue,
  contr_mun_cessao: checkboxValue,
  contr_mun_outro: checkboxValue,
  cnpj: digitString(14, 'CNPJ deve ter 14 dígitos'),
  cnpj_mantenedora: digitString(14, 'CNPJ da mantenedora deve ter 14 dígitos'),
  regulamentacao: z.string().optional(),
  esfera_regulamentacao: z.string().optional(),
  unidade_vinculada: z.string().optional(),
  codigo_escola_sede: digitString(8, 'Código da escola sede deve ter 8 dígitos'),
  codigo_ies: z
    .string()
    .optional()
    .refine((v) => !v || v.length <= 9, { message: 'Máximo 9 caracteres' }),

  // Tab 4: Local e Saneamento
  local_predio: checkboxValue,
  local_salas_outra: checkboxValue,
  local_galpao: checkboxValue,
  local_socioeducativa: checkboxValue,
  local_prisional: checkboxValue,
  local_outros: checkboxValue,
  forma_ocupacao: z.string().optional(),
  predio_compartilhado: checkboxValue,
  compartilha_codigo_1: z.string().optional(),
  compartilha_codigo_2: z.string().optional(),
  compartilha_codigo_3: z.string().optional(),
  compartilha_codigo_4: z.string().optional(),
  compartilha_codigo_5: z.string().optional(),
  compartilha_codigo_6: z.string().optional(),
  agua_potavel: checkboxValue,
  agua_rede_publica: checkboxValue,
  agua_poco_artesiano: checkboxValue,
  agua_cacimba: checkboxValue,
  agua_fonte_rio: checkboxValue,
  agua_inexistente: checkboxValue,
  energia_rede_publica: checkboxValue,
  energia_gerador: checkboxValue,
  energia_renovavel: checkboxValue,
  energia_inexistente: checkboxValue,
  esgoto_rede_publica: checkboxValue,
  esgoto_fossa: checkboxValue,
  esgoto_inexistente: checkboxValue,
  lixo_coleta: checkboxValue,
  lixo_queima: checkboxValue,
  lixo_enterra: checkboxValue,
  lixo_descarte: checkboxValue,
  lixo_outra_area: checkboxValue,
  lixo_separacao: checkboxValue,
  lixo_reaproveitamento: checkboxValue,
  lixo_reciclagem: checkboxValue,
  lixo_sem_tratamento: checkboxValue,

  // Tab 5: Dependências Físicas
  dep_almoxarifado: checkboxValue,
  dep_area_verde: checkboxValue,
  dep_auditorio: checkboxValue,
  dep_banheiro: checkboxValue,
  dep_banheiro_pcd: checkboxValue,
  dep_banheiro_infantil: checkboxValue,
  dep_banheiro_funcionarios: checkboxValue,
  dep_vestiario: checkboxValue,
  dep_biblioteca: checkboxValue,
  dep_cozinha: checkboxValue,
  dep_despensa: checkboxValue,
  dep_dormitorio_aluno: checkboxValue,
  dep_dormitorio_professor: checkboxValue,
  dep_lab_ciencias: checkboxValue,
  dep_lab_informatica: checkboxValue,
  dep_lab_robotica: checkboxValue,
  dep_lab_profissional: checkboxValue,
  dep_parque_infantil: checkboxValue,
  dep_patio_coberto: checkboxValue,
  dep_patio_descoberto: checkboxValue,
  dep_piscina: checkboxValue,
  dep_quadra_coberta: checkboxValue,
  dep_quadra_descoberta: checkboxValue,
  dep_refeitorio: checkboxValue,
  dep_sala_repouso: checkboxValue,
  dep_sala_artes: checkboxValue,
  dep_sala_musica: checkboxValue,
  dep_sala_danca: checkboxValue,
  dep_sala_multiuso: checkboxValue,
  dep_terreirao: checkboxValue,
  dep_viveiro: checkboxValue,
  dep_sala_diretoria: checkboxValue,
  dep_sala_leitura: checkboxValue,
  dep_sala_professores: checkboxValue,
  dep_sala_aee: checkboxValue,
  dep_sala_secretaria: checkboxValue,
  dep_oficinas: checkboxValue,
  dep_estudio: checkboxValue,
  dep_horta: checkboxValue,
  dep_nenhuma: checkboxValue,

  // Tab 6: Acessibilidade e Salas
  acess_corrimao: checkboxValue,
  acess_elevador: checkboxValue,
  acess_pisos_tateis: checkboxValue,
  acess_sinalizacao_visual: checkboxValue,
  acess_sinalizacao_tatil: checkboxValue,
  acess_sinalizacao_sonora: checkboxValue,
  acess_vao_livre: checkboxValue,
  acess_rampas: checkboxValue,
  acess_banheiros: checkboxValue,
  acess_nenhum: checkboxValue,
  qtd_salas_dentro: z.string().optional(),
  qtd_salas_fora: z.string().optional(),
  qtd_salas_climatizadas: z.string().optional(),
  qtd_salas_acessiveis: z.string().optional(),
  qtd_salas_leitura: z.string().optional(),

  // Tab 7: Equipamentos e Internet
  eq_antena_parabolica: checkboxValue,
  eq_computadores: checkboxValue,
  eq_copiadora: checkboxValue,
  eq_impressora: checkboxValue,
  eq_impressora_multifuncional: checkboxValue,
  eq_scanner: checkboxValue,
  eq_nenhum: checkboxValue,
  qtd_dvd: z.string().optional(),
  qtd_som: z.string().optional(),
  qtd_tv: z.string().optional(),
  qtd_lousa_digital: z.string().optional(),
  qtd_projetor: z.string().optional(),
  qtd_desktop_alunos: z.string().optional(),
  qtd_portateis_alunos: z.string().optional(),
  qtd_tablets_alunos: z.string().optional(),
  internet_administrativo: checkboxValue,
  internet_alunos: checkboxValue,
  internet_administrativo_alunos: checkboxValue,
  internet_comunidade: checkboxValue,
  internet_inexistente: checkboxValue,
  internet_equip_alunos: z.string().optional(),
  internet_banda_larga: checkboxValue,
  rede_local: z.string().optional(),

  // Tab 8: Profissionais e Materiais
  prof_agronomos: z.string().optional(),
  prof_pedagogos: z.string().optional(),
  prof_psicologos: z.string().optional(),
  prof_assistentes_sociais: z.string().optional(),
  prof_fonoaudiologos: z.string().optional(),
  prof_nutricionistas: z.string().optional(),
  prof_psicopedagogos: z.string().optional(),
  prof_bombeiros: z.string().optional(),
  prof_medicos: z.string().optional(),
  prof_enfermeiros: z.string().optional(),
  prof_tecnicos_enfermagem: z.string().optional(),
  prof_dentistas: z.string().optional(),
  prof_tecnicos_saude_bucal: z.string().optional(),
  prof_auxiliares_saude_bucal: z.string().optional(),
  prof_agentes_saude: z.string().optional(),
  prof_monitores: z.string().optional(),
  prof_assistentes_alfabetizacao: z.string().optional(),
  prof_tradutor_libras: z.string().optional(),
  prof_revisor_braille: z.string().optional(),
  prof_nenhum: checkboxValue,
  mat_acervo_multimidia: checkboxValue,
  mat_brinquedos: checkboxValue,
  mat_jogos_educativos: checkboxValue,
  mat_livros_didaticos: checkboxValue,
  mat_livros_literatura: checkboxValue,
  mat_mapas: checkboxValue,
  mat_materiais_cientificos: checkboxValue,
  mat_materiais_esportivos: checkboxValue,
  mat_materiais_artisticos: checkboxValue,
  mat_materiais_educacao_etnica: checkboxValue,
  mat_materiais_indigenas: checkboxValue,
  mat_materiais_quilombolas: checkboxValue,
  mat_materiais_campo: checkboxValue,
  mat_instrumentos_musicais: checkboxValue,
  mat_fantasias: checkboxValue,
  mat_acervo_braille: checkboxValue,
  mat_acervo_libras: checkboxValue,
  mat_acervo_audio: checkboxValue,
  mat_acervo_digital: checkboxValue,
  mat_nenhum: checkboxValue,

  // Tab 9: Gestão Escolar
  alimentacao_escolar: checkboxValue,
  lingua_ensino: z.string().optional(),
  codigo_lingua_indigena_1: z.string().optional(),
  codigo_lingua_indigena_2: z.string().optional(),
  codigo_lingua_indigena_3: z.string().optional(),
  exame_selecao: checkboxValue,
  cota_ppi: checkboxValue,
  cota_renda: checkboxValue,
  cota_publica: checkboxValue,
  cota_deficiencia: checkboxValue,
  cota_outros: checkboxValue,
  cota_nenhum: checkboxValue,
  site_blog: checkboxValue,
  compartilha_espacos: checkboxValue,
  usa_entorno: checkboxValue,
  org_associacao_pais: checkboxValue,
  org_gremio_estudantil: checkboxValue,
  org_conselho_escolar: checkboxValue,
  org_colegiado_escolar: checkboxValue,
  org_grafica_estudantil: checkboxValue,
  org_nenhum: checkboxValue,
  ppp_atualizado: z.string().optional(),
  educacao_ambiental: checkboxValue,
  amb_conteudo: checkboxValue,
  amb_projetos: checkboxValue,
  amb_comunidade: checkboxValue,
  amb_transversal: checkboxValue,
  amb_agenda21: checkboxValue,
  amb_nenhum: checkboxValue,
})

type EscolaFormValues = z.infer<typeof escolaFormSchema>

// ───────────────────── Props ─────────────────────

interface EscolaFormProps {
  defaultValues?: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  isSubmitting: boolean
  onCancel?: () => void
  submitLabel?: string
  title?: string
}

// ───────────────────── Helpers ─────────────────────

function CheckboxField({
  control,
  name,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  name: string
  label: string
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={field.value === '1'}
            onCheckedChange={(checked) => field.onChange(checked ? '1' : '0')}
          />
          <Label className="cursor-pointer text-sm font-normal">{label}</Label>
        </div>
      )}
    />
  )
}

function SelectField({
  control,
  name,
  label,
  placeholder,
  options,
  disabled,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  name: string
  label: string
  placeholder?: string
  options: { value: string; label: string }[]
  disabled?: boolean
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || 'Selecione...'} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.filter((opt) => opt.value !== '').map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function InputField({
  control,
  name,
  label,
  placeholder,
  type,
  maxLength,
  disabled,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  name: string
  label: string
  placeholder?: string
  type?: string
  maxLength?: number
  disabled?: boolean
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type || 'text'}
              maxLength={maxLength}
              disabled={disabled}
              {...field}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// ───────────────────── Component ─────────────────────

export function EscolaForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
  submitLabel = 'Salvar Escola',
  title = 'Nova Escola',
}: EscolaFormProps) {
  const form = useForm<EscolaFormValues>({
    resolver: zodResolver(escolaFormSchema),
    defaultValues: (defaultValues || {}) as EscolaFormValues,
  })

  const { control, handleSubmit } = form

  const situacaoFuncionamento = useWatch({ control, name: 'situacao_funcionamento' })
  const dependenciaAdministrativa = useWatch({ control, name: 'dependencia_administrativa' })
  const parceriaEstadual = useWatch({ control, name: 'parceria_estadual' })
  const parceriaMunicipal = useWatch({ control, name: 'parceria_municipal' })
  const localPredio = useWatch({ control, name: 'local_predio' })
  const predioCompartilhado = useWatch({ control, name: 'predio_compartilhado' })
  const exameSelecao = useWatch({ control, name: 'exame_selecao' })
  const educacaoAmbiental = useWatch({ control, name: 'educacao_ambiental' })
  const unidadeVinculada = useWatch({ control, name: 'unidade_vinculada' })
  const linguaEnsino = useWatch({ control, name: 'lingua_ensino' })
  const internetAlunos = useWatch({ control, name: 'internet_alunos' })
  const internetInexistente = useWatch({ control, name: 'internet_inexistente' })
  const regulamentacao = useWatch({ control, name: 'regulamentacao' })

  const submitHandler = (data: EscolaFormValues) => {
    return onSubmit(data as unknown as Record<string, unknown>)
  }

  // ──────── Common Select Options ────────

  const situacaoOptions = [
    { value: '1', label: 'Em atividade' },
    { value: '2', label: 'Paralisada' },
    { value: '3', label: 'Extinta' },
  ]

  const dependenciaOptions = [
    { value: '1', label: 'Federal' },
    { value: '2', label: 'Estadual' },
    { value: '3', label: 'Municipal' },
    { value: '4', label: 'Privada' },
  ]

  const localizacaoOptions = [
    { value: '1', label: 'Urbana' },
    { value: '2', label: 'Rural' },
  ]

  const localizacaoDiferenciadaOptions = [
    { value: '1', label: 'Área de assentamento' },
    { value: '2', label: 'Terra indígena' },
    { value: '3', label: 'Área remanescente de quilombos' },
    { value: '4', label: 'Unidade de uso sustentável' },
    { value: '5', label: 'Não está em área de localização diferenciada' },
  ]

  const formatoOrganizacionalOptions = [
    { value: '1', label: 'Série/Ano' },
    { value: '2', label: 'Períodos/Semestres' },
    { value: '3', label: 'Ciclos' },
    { value: '4', label: 'Grupos não-seriados' },
    { value: '5', label: 'Módulos' },
    { value: '6', label: 'Alternância Regular' },
  ]

  const categoriaPrivadaOptions = [
    { value: '1', label: 'Particular' },
    { value: '2', label: 'Comunitária' },
    { value: '3', label: 'Confessional' },
    { value: '4', label: 'Filantrópica' },
  ]

  const regulamentacaoOptions = [
    { value: '0', label: 'Não' },
    { value: '1', label: 'Sim - Conselho Estadual de Educação' },
    { value: '2', label: 'Sim - Conselho Municipal de Educação' },
  ]

  const esferaOptions = [
    { value: '1', label: 'Federal' },
    { value: '2', label: 'Estadual' },
    { value: '3', label: 'Municipal' },
    { value: '4', label: 'Distrital' },
    { value: '5', label: 'Conselho de Educação' },
  ]

  const unidadeVinculadaOptions = [
    { value: '0', label: 'Não vinculada' },
    { value: '1', label: 'Vinculada a escola sede' },
    { value: '2', label: 'Vinculada a IES' },
  ]

  const formaOcupacaoOptions = [
    { value: '1', label: 'Próprio' },
    { value: '2', label: 'Alugado' },
    { value: '3', label: 'Cedido' },
  ]

  const internetEquipOptions = [
    { value: '1', label: 'Sim — Computadores de mesa' },
    { value: '2', label: 'Sim — Dispositivos portáteis' },
    { value: '3', label: 'Sim — Ambos' },
  ]

  const redeLocalOptions = [
    { value: '0', label: 'Não há rede local' },
    { value: '1', label: 'Rede a cabo' },
    { value: '2', label: 'Rede sem fio (wireless)' },
    { value: '3', label: 'Rede a cabo e sem fio' },
  ]

  const linguaOptions = [
    { value: '1', label: 'Português' },
    { value: '2', label: 'Libras' },
    { value: '3', label: 'Indígena e Português' },
    { value: '4', label: 'Libras e Português' },
  ]

  const pppOptions = [
    { value: '0', label: 'Não' },
    { value: '1', label: 'Sim — atualizado nos últimos 5 anos' },
    { value: '2', label: 'Sim — atualizado há mais de 5 anos' },
  ]

  const showDatas = situacaoFuncionamento === '1'
  const mostraOrgaos = ['1', '2', '3'].includes(dependenciaAdministrativa)
  const mostraMantenedora = dependenciaAdministrativa === '4' && situacaoFuncionamento === '1'
  const mostraCategoriaPrivada = dependenciaAdministrativa === '4'
  const mostraEsfera = ['1', '2'].includes(regulamentacao || '')
  const mostraEscolaSede = unidadeVinculada === '1'
  const mostraIes = unidadeVinculada === '2'
  const mostraFormaOcupacao = localPredio === '1'
  const mostraCompartilhamento = localPredio === '1' && predioCompartilhado === '1'
  const mostraCotas = exameSelecao === '1'
  const mostraEducacaoAmbiental = educacaoAmbiental === '1'
  const mostraLinguaIndigena = ['1', '3'].includes(linguaEnsino || '')
  const mostraInternetEquipAlunos = internetAlunos === '1' && internetInexistente !== '1'
  const mostraBandaLarga = internetInexistente !== '1'

  // ──────── Checkbox field arrays ────────

  const orgaoChecks = [
    { name: 'orgao_secretaria_educacao', label: 'Órgão de educação' },
    { name: 'orgao_seguranca', label: 'Órgão de segurança pública' },
    { name: 'orgao_saude', label: 'Órgão de saúde' },
    { name: 'orgao_outro', label: 'Outro órgão' },
  ]

  const mantChecks = [
    { name: 'mant_empresa', label: 'Empresa ou grupo empresarial' },
    { name: 'mant_sindicatos', label: 'Sindicatos de trabalhadores ou patronais' },
    { name: 'mant_ong', label: 'Organização Não Governamental (ONG)' },
    { name: 'mant_sem_fins_lucrativos', label: 'Instituição sem fins lucrativos' },
    { name: 'mant_sistema_s', label: 'Sistema S (Sesi, Senai, Sesc, etc.)' },
    { name: 'mant_oscip', label: 'OSCIP — Organização da Sociedade Civil de Interesse Público' },
  ]

  const contrEstChecks = [
    { name: 'contr_est_permuta', label: 'Permuta' },
    { name: 'contr_est_contrato', label: 'Contrato' },
    { name: 'contr_est_convenio', label: 'Convênio' },
    { name: 'contr_est_termo_cooperacao', label: 'Termo de Cooperação Técnica' },
    { name: 'contr_est_cessao', label: 'Cessão' },
    { name: 'contr_est_outro', label: 'Outro' },
  ]

  const contrMunChecks = [
    { name: 'contr_mun_permuta', label: 'Permuta' },
    { name: 'contr_mun_contrato', label: 'Contrato' },
    { name: 'contr_mun_convenio', label: 'Convênio' },
    { name: 'contr_mun_termo_cooperacao', label: 'Termo de Cooperação Técnica' },
    { name: 'contr_mun_cessao', label: 'Cessão' },
    { name: 'contr_mun_outro', label: 'Outro' },
  ]

  const locaisFuncChecks = [
    { name: 'local_predio', label: 'Prédio escolar' },
    { name: 'local_salas_outra', label: 'Salas em outra escola' },
    { name: 'local_galpao', label: 'Galpão / rancho / paiol / barracão' },
    { name: 'local_socioeducativa', label: 'Unidade de atendimento socioeducativo' },
    { name: 'local_prisional', label: 'Unidade prisional' },
    { name: 'local_outros', label: 'Outros' },
  ]

  const aguaChecks = [
    { name: 'agua_rede_publica', label: 'Rede pública' },
    { name: 'agua_poco_artesiano', label: 'Poço artesiano' },
    { name: 'agua_cacimba', label: 'Cacimba / cisterna / poço' },
    { name: 'agua_fonte_rio', label: 'Fonte / rio / igarapé / riacho / córrego' },
    { name: 'agua_inexistente', label: 'Inexistente' },
  ]

  const energiaChecks = [
    { name: 'energia_rede_publica', label: 'Rede pública' },
    { name: 'energia_gerador', label: 'Gerador movido a combustível fóssil' },
    { name: 'energia_renovavel', label: 'Fontes de energia renováveis' },
    { name: 'energia_inexistente', label: 'Inexistente' },
  ]

  const esgotoChecks = [
    { name: 'esgoto_rede_publica', label: 'Rede pública' },
    { name: 'esgoto_fossa', label: 'Fossa séptica' },
    { name: 'esgoto_inexistente', label: 'Inexistente' },
  ]

  const lixoDestinoChecks = [
    { name: 'lixo_coleta', label: 'Coleta periódica' },
    { name: 'lixo_queima', label: 'Queima' },
    { name: 'lixo_enterra', label: 'Enterra' },
    { name: 'lixo_descarte', label: 'Descarte em outra área' },
    { name: 'lixo_outra_area', label: 'Leva a outra área' },
  ]

  const lixoTratamentoChecks = [
    { name: 'lixo_separacao', label: 'Separação do lixo' },
    { name: 'lixo_reaproveitamento', label: 'Reaproveitamento / reutilização' },
    { name: 'lixo_reciclagem', label: 'Reciclagem' },
    { name: 'lixo_sem_tratamento', label: 'Não faz tratamento' },
  ]

  const depChecks = [
    { name: 'dep_almoxarifado', label: 'Almoxarifado' },
    { name: 'dep_area_verde', label: 'Área verde' },
    { name: 'dep_auditorio', label: 'Auditório' },
    { name: 'dep_banheiro', label: 'Banheiro' },
    { name: 'dep_banheiro_pcd', label: 'Banheiro PcD' },
    { name: 'dep_banheiro_infantil', label: 'Banheiro infantil' },
    { name: 'dep_banheiro_funcionarios', label: 'Banheiro funcionários' },
    { name: 'dep_vestiario', label: 'Vestiário' },
    { name: 'dep_biblioteca', label: 'Biblioteca' },
    { name: 'dep_cozinha', label: 'Cozinha' },
    { name: 'dep_despensa', label: 'Despensa' },
    { name: 'dep_dormitorio_aluno', label: 'Dormitório aluno' },
    { name: 'dep_dormitorio_professor', label: 'Dormitório professor' },
    { name: 'dep_lab_ciencias', label: 'Laboratório de ciências' },
    { name: 'dep_lab_informatica', label: 'Laboratório de informática' },
    { name: 'dep_lab_robotica', label: 'Laboratório de robótica' },
    { name: 'dep_lab_profissional', label: 'Laboratório profissional' },
    { name: 'dep_parque_infantil', label: 'Parque infantil' },
    { name: 'dep_patio_coberto', label: 'Pátio coberto' },
    { name: 'dep_patio_descoberto', label: 'Pátio descoberto' },
    { name: 'dep_piscina', label: 'Piscina' },
    { name: 'dep_quadra_coberta', label: 'Quadra coberta' },
    { name: 'dep_quadra_descoberta', label: 'Quadra descoberta' },
    { name: 'dep_refeitorio', label: 'Refeitório' },
    { name: 'dep_sala_repouso', label: 'Sala de repouso' },
    { name: 'dep_sala_artes', label: 'Sala de artes' },
    { name: 'dep_sala_musica', label: 'Sala de música' },
    { name: 'dep_sala_danca', label: 'Sala de dança' },
    { name: 'dep_sala_multiuso', label: 'Sala multiuso' },
    { name: 'dep_terreirao', label: 'Terreirão' },
    { name: 'dep_viveiro', label: 'Viveiro / criação de animais' },
    { name: 'dep_sala_diretoria', label: 'Sala de diretoria' },
    { name: 'dep_sala_leitura', label: 'Sala de leitura' },
    { name: 'dep_sala_professores', label: 'Sala de professores' },
    { name: 'dep_sala_aee', label: 'Sala de AEE' },
    { name: 'dep_sala_secretaria', label: 'Sala de secretaria' },
    { name: 'dep_oficinas', label: 'Oficinas' },
    { name: 'dep_estudio', label: 'Estúdio de gravação' },
    { name: 'dep_horta', label: 'Horta' },
    { name: 'dep_nenhuma', label: 'Nenhuma das dependências' },
  ]

  const acessChecks = [
    { name: 'acess_corrimao', label: 'Corrimão e guarda-corpos' },
    { name: 'acess_elevador', label: 'Elevador' },
    { name: 'acess_pisos_tateis', label: 'Pisos táteis' },
    { name: 'acess_sinalizacao_visual', label: 'Sinalização visual' },
    { name: 'acess_sinalizacao_tatil', label: 'Sinalização tátil' },
    { name: 'acess_sinalizacao_sonora', label: 'Sinalização sonora' },
    { name: 'acess_vao_livre', label: 'Vão livre (portas ≥ 80 cm)' },
    { name: 'acess_rampas', label: 'Rampas' },
    { name: 'acess_banheiros', label: 'Banheiros acessíveis' },
    { name: 'acess_nenhum', label: 'Nenhum' },
  ]

  const eqChecks = [
    { name: 'eq_antena_parabolica', label: 'Antena parabólica' },
    { name: 'eq_computadores', label: 'Computadores' },
    { name: 'eq_copiadora', label: 'Copiadora' },
    { name: 'eq_impressora', label: 'Impressora' },
    { name: 'eq_impressora_multifuncional', label: 'Impressora multifuncional' },
    { name: 'eq_scanner', label: 'Scanner' },
    { name: 'eq_nenhum', label: 'Nenhum' },
  ]

  const internetChecks = [
    { name: 'internet_administrativo', label: 'Internet — uso administrativo' },
    { name: 'internet_alunos', label: 'Internet — uso dos alunos' },
    { name: 'internet_administrativo_alunos', label: 'Internet — uso administrativo e alunos' },
    { name: 'internet_comunidade', label: 'Internet — uso da comunidade' },
    { name: 'internet_inexistente', label: 'Não possui internet' },
  ]

  const profFields = [
    { name: 'prof_agronomos', label: 'Agrônomos' },
    { name: 'prof_pedagogos', label: 'Pedagogos' },
    { name: 'prof_psicologos', label: 'Psicólogos' },
    { name: 'prof_assistentes_sociais', label: 'Assistentes sociais' },
    { name: 'prof_fonoaudiologos', label: 'Fonoaudiólogos' },
    { name: 'prof_nutricionistas', label: 'Nutricionistas' },
    { name: 'prof_psicopedagogos', label: 'Psicopedagogos' },
    { name: 'prof_bombeiros', label: 'Bombeiros / brigadistas' },
    { name: 'prof_medicos', label: 'Médicos' },
    { name: 'prof_enfermeiros', label: 'Enfermeiros' },
    { name: 'prof_tecnicos_enfermagem', label: 'Técnicos de enfermagem' },
    { name: 'prof_dentistas', label: 'Dentistas' },
    { name: 'prof_tecnicos_saude_bucal', label: 'Técnicos de saúde bucal' },
    { name: 'prof_auxiliares_saude_bucal', label: 'Auxiliares de saúde bucal' },
    { name: 'prof_agentes_saude', label: 'Agentes comunitários de saúde' },
    { name: 'prof_monitores', label: 'Monitores' },
    { name: 'prof_assistentes_alfabetizacao', label: 'Assistentes de alfabetização' },
    { name: 'prof_tradutor_libras', label: 'Tradutores/intérpretes de Libras' },
    { name: 'prof_revisor_braille', label: 'Revisores Braille' },
  ]

  const matChecks = [
    { name: 'mat_acervo_multimidia', label: 'Acervo multimídia' },
    { name: 'mat_brinquedos', label: 'Brinquedos para educação infantil' },
    { name: 'mat_jogos_educativos', label: 'Jogos educativos' },
    { name: 'mat_livros_didaticos', label: 'Livros didáticos' },
    { name: 'mat_livros_literatura', label: 'Livros de literatura' },
    { name: 'mat_mapas', label: 'Mapas' },
    { name: 'mat_materiais_cientificos', label: 'Materiais científicos' },
    { name: 'mat_materiais_esportivos', label: 'Materiais esportivos' },
    { name: 'mat_materiais_artisticos', label: 'Materiais artísticos' },
    { name: 'mat_materiais_educacao_etnica', label: 'Materiais para educação étnico-racial' },
    { name: 'mat_materiais_indigenas', label: 'Materiais para educação indígena' },
    { name: 'mat_materiais_quilombolas', label: 'Materiais para educação quilombola' },
    { name: 'mat_materiais_campo', label: 'Materiais para educação do campo' },
    { name: 'mat_instrumentos_musicais', label: 'Instrumentos musicais' },
    { name: 'mat_fantasias', label: 'Fantasias' },
    { name: 'mat_acervo_braille', label: 'Acervo em Braille' },
    { name: 'mat_acervo_libras', label: 'Acervo em Libras' },
    { name: 'mat_acervo_audio', label: 'Acervo em áudio' },
    { name: 'mat_acervo_digital', label: 'Acervo digital' },
    { name: 'mat_nenhum', label: 'Nenhum' },
  ]

  const cotaChecks = [
    { name: 'cota_ppi', label: 'Pretos, pardos e indígenas (PPI)' },
    { name: 'cota_renda', label: 'Renda' },
    { name: 'cota_publica', label: 'Estudantes de escola pública' },
    { name: 'cota_deficiencia', label: 'Pessoas com deficiência' },
    { name: 'cota_outros', label: 'Outros' },
    { name: 'cota_nenhum', label: 'Nenhum' },
  ]

  const orgChecks = [
    { name: 'org_associacao_pais', label: 'Associação de pais' },
    { name: 'org_gremio_estudantil', label: 'Grêmio estudantil' },
    { name: 'org_conselho_escolar', label: 'Conselho escolar' },
    { name: 'org_colegiado_escolar', label: 'Colegiado escolar' },
    { name: 'org_grafica_estudantil', label: 'Grêmio estudantil' },
    { name: 'org_nenhum', label: 'Nenhum' },
  ]

  const ambChecks = [
    { name: 'amb_conteudo', label: 'Inserido nos conteúdos das disciplinas' },
    { name: 'amb_projetos', label: 'Projetos' },
    { name: 'amb_comunidade', label: 'Ações junto à comunidade' },
    { name: 'amb_transversal', label: 'Tema transversal' },
    { name: 'amb_agenda21', label: 'Agenda 21' },
    { name: 'amb_nenhum', label: 'Nenhuma' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {title && (
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      )}

      <Form {...form}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-6"
        >
          <Tabs defaultValue="identificacao" className="w-full">
            <TabsList className="mb-4 flex-wrap h-auto gap-1">
              <TabsTrigger value="identificacao">Identificação</TabsTrigger>
              <TabsTrigger value="endereco">Endereço e Contato</TabsTrigger>
              <TabsTrigger value="administrativo">Administrativo</TabsTrigger>
              <TabsTrigger value="local-saneamento">Local e Saneamento</TabsTrigger>
              <TabsTrigger value="dependencias">Dependências Físicas</TabsTrigger>
              <TabsTrigger value="acessibilidade">Acessibilidade e Salas</TabsTrigger>
              <TabsTrigger value="equipamentos">Equipamentos e Internet</TabsTrigger>
              <TabsTrigger value="profissionais">Profissionais e Materiais</TabsTrigger>
              <TabsTrigger value="gestao">Gestão Escolar</TabsTrigger>
            </TabsList>

            {/* ══════ Tab 1: Identificação ══════ */}
            <TabsContent value="identificacao">
              <Card>
                <CardHeader>
                  <CardTitle>Identificação da Escola (Registro 00)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <InputField
                    control={control}
                    name="nome_escola"
                    label="Nome da Escola *"
                    placeholder="Nome completo da escola"
                  />

                  <InputField
                    control={control}
                    name="codigo_inep"
                    label="Código INEP"
                    placeholder="8 dígitos"
                    maxLength={8}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      control={control}
                      name="situacao_funcionamento"
                      label="Situação de Funcionamento *"
                      options={situacaoOptions}
                    />
                    <SelectField
                      control={control}
                      name="dependencia_administrativa"
                      label="Dependência Administrativa *"
                      options={dependenciaOptions}
                    />
                  </div>

                  <SelectField
                    control={control}
                    name="formato_organizacional"
                    label="Formato Organizacional"
                    options={formatoOrganizacionalOptions}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      control={control}
                      name="localizacao"
                      label="Localização *"
                      options={localizacaoOptions}
                    />
                    <SelectField
                      control={control}
                      name="localizacao_diferenciada"
                      label="Localização Diferenciada *"
                      options={localizacaoDiferenciadaOptions}
                    />
                  </div>

                  {showDatas && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        control={control}
                        name="data_inicio_ano"
                        label="Data de Início do Ano Letivo"
                        type="date"
                      />
                      <InputField
                        control={control}
                        name="data_fim_ano"
                        label="Data de Fim do Ano Letivo"
                        type="date"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══════ Tab 2: Endereço e Contato ══════ */}
            <TabsContent value="endereco">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço e Contato (Registro 00)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      control={control}
                      name="cep"
                      label="CEP"
                      placeholder="8 dígitos"
                      maxLength={8}
                    />
                    <InputField
                      control={control}
                      name="municipio"
                      label="Código do Município"
                      placeholder="7 dígitos"
                      maxLength={7}
                    />
                    <InputField
                      control={control}
                      name="distrito"
                      label="Distrito"
                      placeholder="2 dígitos"
                      maxLength={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      control={control}
                      name="endereco"
                      label="Endereço / Logradouro"
                      placeholder="Rua, Avenida, etc."
                    />
                    <InputField
                      control={control}
                      name="numero"
                      label="Número"
                      placeholder="Nº"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      control={control}
                      name="complemento"
                      label="Complemento"
                      placeholder="Apto, Bloco, etc."
                    />
                    <InputField
                      control={control}
                      name="bairro"
                      label="Bairro"
                      placeholder="Bairro"
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      control={control}
                      name="ddd"
                      label="DDD"
                      placeholder="2 dígitos"
                      maxLength={2}
                    />
                    <InputField
                      control={control}
                      name="telefone_1"
                      label="Telefone 1"
                      placeholder="8 ou 9 dígitos"
                      maxLength={9}
                    />
                    <InputField
                      control={control}
                      name="telefone_2"
                      label="Telefone 2"
                      placeholder="8 ou 9 dígitos"
                      maxLength={9}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      control={control}
                      name="email"
                      label="E-mail"
                      placeholder="email@exemplo.com"
                      type="email"
                    />
                    <InputField
                      control={control}
                      name="codigo_orgao_regional"
                      label="Código do Órgão Regional de Ensino"
                      placeholder="Código do órgão regional"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══════ Tab 3: Administrativo ══════ */}
            <TabsContent value="administrativo">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Administrativos (Registro 00)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {/* Órgãos vinculados — apenas dependência 1,2,3 */}
                  {mostraOrgaos && (
                    <div className="border border-border rounded-lg p-4 bg-muted/30">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Órgãos aos quais a escola está vinculada
                      </h4>
                      <div className="flex flex-col gap-2">
                        {orgaoChecks.map((c) => (
                          <CheckboxField
                            key={c.name}
                            control={control}
                            name={c.name}
                            label={c.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mantenedora — apenas privada + ativa */}
                  {mostraMantenedora && (
                    <div className="border border-border rounded-lg p-4 bg-muted/30">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Mantenedora da Escola Privada
                      </h4>
                      <div className="flex flex-col gap-2">
                        {mantChecks.map((c) => (
                          <CheckboxField
                            key={c.name}
                            control={control}
                            name={c.name}
                            label={c.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categoria escola privada */}
                  {mostraCategoriaPrivada && (
                    <SelectField
                      control={control}
                      name="categoria_escola_privada"
                      label="Categoria da Escola Privada"
                      options={categoriaPrivadaOptions}
                    />
                  )}

                  <Separator />

                  {/* Parcerias */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Parcerias / Convênios
                    </h4>
                    <div className="flex flex-col gap-2">
                      <CheckboxField
                        control={control}
                        name="parceria_estadual"
                        label="Parceria com o governo estadual"
                      />
                      {parceriaEstadual === '1' && (
                        <div className="ml-6 flex flex-col gap-2 border-l-2 border-border pl-4">
                          <p className="text-xs text-muted-foreground mb-1">Formas de contratação — estadual:</p>
                          {contrEstChecks.map((c) => (
                            <CheckboxField
                              key={c.name}
                              control={control}
                              name={c.name}
                              label={c.label}
                            />
                          ))}
                        </div>
                      )}
                      <CheckboxField
                        control={control}
                        name="parceria_municipal"
                        label="Parceria com o governo municipal"
                      />
                      {parceriaMunicipal === '1' && (
                        <div className="ml-6 flex flex-col gap-2 border-l-2 border-border pl-4">
                          <p className="text-xs text-muted-foreground mb-1">Formas de contratação — municipal:</p>
                          {contrMunChecks.map((c) => (
                            <CheckboxField
                              key={c.name}
                              control={control}
                              name={c.name}
                              label={c.label}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* CNPJs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      control={control}
                      name="cnpj"
                      label="CNPJ da Escola"
                      placeholder="14 dígitos"
                      maxLength={14}
                    />
                    <InputField
                      control={control}
                      name="cnpj_mantenedora"
                      label="CNPJ da Mantenedora"
                      placeholder="14 dígitos"
                      maxLength={14}
                    />
                  </div>

                  <Separator />

                  {/* Regulamentação */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      control={control}
                      name="regulamentacao"
                      label="Regulamentação / Autorização de Funcionamento"
                      options={regulamentacaoOptions}
                    />
                    {mostraEsfera && (
                      <SelectField
                        control={control}
                        name="esfera_regulamentacao"
                        label="Esfera da Regulamentação"
                        options={esferaOptions}
                      />
                    )}
                  </div>

                  <Separator />

                  {/* Unidade Vinculada */}
                  <SelectField
                    control={control}
                    name="unidade_vinculada"
                    label="Unidade Vinculada"
                    options={unidadeVinculadaOptions}
                  />
                  {mostraEscolaSede && (
                    <InputField
                      control={control}
                      name="codigo_escola_sede"
                      label="Código INEP da Escola Sede"
                      placeholder="8 dígitos"
                      maxLength={8}
                    />
                  )}
                  {mostraIes && (
                    <InputField
                      control={control}
                      name="codigo_ies"
                      label="Código da IES"
                      placeholder="Máximo 9 caracteres"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══════ Tab 4: Local e Saneamento ══════ */}
            <TabsContent value="local-saneamento">
              <Card>
                <CardHeader>
                  <CardTitle>Local de Funcionamento e Saneamento (Registro 10)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {/* Locais de funcionamento */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Locais de funcionamento da escola
                    </h4>
                    <div className="flex flex-col gap-2">
                      {locaisFuncChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Forma de ocupação do prédio */}
                  {mostraFormaOcupacao && (
                    <>
                      <SelectField
                        control={control}
                        name="forma_ocupacao"
                        label="Forma de Ocupação do Prédio"
                        options={formaOcupacaoOptions}
                      />
                      <CheckboxField
                        control={control}
                        name="predio_compartilhado"
                        label="Prédio compartilhado com outra escola"
                      />
                    </>
                  )}

                  {/* Códigos de compartilhamento */}
                  {mostraCompartilhamento && (
                    <div className="border border-border rounded-lg p-4 bg-muted/30">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Códigos INEP das Escolas que Compartilham o Prédio
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <InputField
                            key={n}
                            control={control}
                            name={`compartilha_codigo_${n}`}
                            label={`Código ${n}`}
                            placeholder="8 dígitos"
                            maxLength={8}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Água */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckboxField
                        control={control}
                        name="agua_potavel"
                        label="Água potável"
                      />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Abastecimento de Água
                    </h4>
                    <div className="flex flex-col gap-2">
                      {aguaChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Energia */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Abastecimento de Energia Elétrica
                    </h4>
                    <div className="flex flex-col gap-2">
                      {energiaChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Esgoto */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Esgotamento Sanitário
                    </h4>
                    <div className="flex flex-col gap-2">
                      {esgotoChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Lixo — Destinação */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Destinação do Lixo
                    </h4>
                    <div className="flex flex-col gap-2">
                      {lixoDestinoChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Lixo — Tratamento */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Tratamento do Lixo / Resíduos
                    </h4>
                    <div className="flex flex-col gap-2">
                      {lixoTratamentoChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══════ Tab 5: Dependências Físicas ══════ */}
            <TabsContent value="dependencias">
              <Card>
                <CardHeader>
                  <CardTitle>Dependências Físicas (Registro 10)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                    {depChecks.map((c) => (
                      <CheckboxField
                        key={c.name}
                        control={control}
                        name={c.name}
                        label={c.label}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══════ Tab 6: Acessibilidade e Salas ══════ */}
            <TabsContent value="acessibilidade">
              <Card>
                <CardHeader>
                  <CardTitle>Acessibilidade e Salas (Registro 10)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {/* Acessibilidade */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Recursos de Acessibilidade
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {acessChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Salas */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Quantidade de Salas de Aula
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField
                        control={control}
                        name="qtd_salas_dentro"
                        label="Salas dentro do prédio"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_salas_fora"
                        label="Salas fora do prédio"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_salas_climatizadas"
                        label="Salas climatizadas"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_salas_acessiveis"
                        label="Salas acessíveis"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_salas_leitura"
                        label="Salas de leitura"
                        type="number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══════ Tab 7: Equipamentos e Internet ══════ */}
            <TabsContent value="equipamentos">
              <Card>
                <CardHeader>
                  <CardTitle>Equipamentos e Internet (Registro 10)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {/* Equipamentos */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Equipamentos Administrativos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {eqChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quantidades de equipamentos */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Quantidade de Equipamentos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <InputField
                        control={control}
                        name="qtd_dvd"
                        label="DVD / Blu-ray"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_som"
                        label="Aparelhos de som"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_tv"
                        label="TVs / Videoconferência"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_lousa_digital"
                        label="Lousas digitais"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_projetor"
                        label="Projetores"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_desktop_alunos"
                        label="Desktops para alunos"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_portateis_alunos"
                        label="Portáteis para alunos"
                        type="number"
                      />
                      <InputField
                        control={control}
                        name="qtd_tablets_alunos"
                        label="Tablets para alunos"
                        type="number"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Internet */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Acesso à Internet
                    </h4>
                    <div className="flex flex-col gap-2">
                      {internetChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {mostraInternetEquipAlunos && (
                    <SelectField
                      control={control}
                      name="internet_equip_alunos"
                      label="Equipamentos com internet para alunos"
                      options={internetEquipOptions}
                    />
                  )}

                  {mostraBandaLarga && (
                    <CheckboxField
                      control={control}
                      name="internet_banda_larga"
                      label="Internet banda larga"
                    />
                  )}

                  <Separator />

                  <SelectField
                    control={control}
                    name="rede_local"
                    label="Rede Local de Comunicação"
                    options={redeLocalOptions}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══════ Tab 8: Profissionais e Materiais ══════ */}
            <TabsContent value="profissionais">
              <Card>
                <CardHeader>
                  <CardTitle>Profissionais e Materiais Pedagógicos (Registro 10)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {/* Profissionais */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Profissionais por Função (quantidade)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profFields.map((p) => (
                        <InputField
                          key={p.name}
                          control={control}
                          name={p.name}
                          label={p.label}
                          type="number"
                        />
                      ))}
                    </div>
                    <div className="mt-4">
                      <CheckboxField
                        control={control}
                        name="prof_nenhum"
                        label="Nenhum profissional nas funções listadas"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Materiais pedagógicos */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Materiais Pedagógicos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {matChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══════ Tab 9: Gestão Escolar ══════ */}
            <TabsContent value="gestao">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão Escolar (Registro 10)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <CheckboxField
                    control={control}
                    name="alimentacao_escolar"
                    label="Alimentação escolar para os alunos"
                  />

                  <Separator />

                  {/* Língua de ensino */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <SelectField
                      control={control}
                      name="lingua_ensino"
                      label="Língua de Ensino"
                      options={linguaOptions}
                    />
                    {mostraLinguaIndigena && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                          control={control}
                          name="codigo_lingua_indigena_1"
                          label="Código Língua Indígena 1"
                          placeholder="Código INEP"
                        />
                        <InputField
                          control={control}
                          name="codigo_lingua_indigena_2"
                          label="Código Língua Indígena 2"
                          placeholder="Código INEP"
                        />
                        <InputField
                          control={control}
                          name="codigo_lingua_indigena_3"
                          label="Código Língua Indígena 3"
                          placeholder="Código INEP"
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Exame de seleção + cotas */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <CheckboxField
                      control={control}
                      name="exame_selecao"
                      label="Realiza exame de seleção para ingresso"
                    />
                    {mostraCotas && (
                      <div className="ml-6 mt-3 flex flex-col gap-2 border-l-2 border-border pl-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Reserva de vagas por sistema de cotas:
                        </p>
                        {cotaChecks.map((c) => (
                          <CheckboxField
                            key={c.name}
                            control={control}
                            name={c.name}
                            label={c.label}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Site, compartilha espaços, usa entorno */}
                  <div className="flex flex-col gap-2">
                    <CheckboxField
                      control={control}
                      name="site_blog"
                      label="Possui site / blog / página na internet"
                    />
                    <CheckboxField
                      control={control}
                      name="compartilha_espacos"
                      label="Compartilha espaços com a comunidade"
                    />
                    <CheckboxField
                      control={control}
                      name="usa_entorno"
                      label="Usa espaços do entorno para atividades escolares"
                    />
                  </div>

                  <Separator />

                  {/* Órgãos colegiados */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Órgãos Colegiados
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {orgChecks.map((c) => (
                        <CheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <SelectField
                    control={control}
                    name="ppp_atualizado"
                    label="Projeto Político-Pedagógico (PPP)"
                    options={pppOptions}
                  />

                  <Separator />

                  {/* Educação ambiental */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <CheckboxField
                      control={control}
                      name="educacao_ambiental"
                      label="Educação ambiental"
                    />
                    {mostraEducacaoAmbiental && (
                      <div className="ml-6 mt-3 flex flex-col gap-2 border-l-2 border-border pl-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Formas de educação ambiental:
                        </p>
                        {ambChecks.map((c) => (
                          <CheckboxField
                            key={c.name}
                            control={control}
                            name={c.name}
                            label={c.label}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* ──────── Bottom Buttons ──────── */}
          <Separator />
          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                  Salvando...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export type { EscolaFormValues, EscolaFormProps }
export { escolaFormSchema }
