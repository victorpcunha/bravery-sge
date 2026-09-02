'use client'

import { useForm, useWatch } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Plus, Trash2, Users, Eye } from 'lucide-react'

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
import { Combobox } from '@/components/ui/combobox'
import { ClickablePill } from '@/components/ui/clickable-pill'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { PROFISSOES_CENSO } from '@/data/funcoes-censo'
import { getProfissionaisCenso, type ProfissionalCenso } from '@/lib/actions/censo-profissionais'
import { useRouter, useSearchParams } from 'next/navigation'
import { MUNICIPIOS_CEARA } from '@/data/censo/municipios-ceara'
import { ORGAOS_REGIONAIS_CEARA } from '@/data/censo/orgaos-regionais-ceara'

// ───────────────────── Zod Schema ─────────────────────

const checkboxValue = z.string().optional()

function formatCpf(cpf: string | null | undefined) {
  if (!cpf) return '—'
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11) return cpf
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function formatDataNascimento(data: string | null | undefined) {
  if (!data) return '—'
  const date = new Date(data)
  if (isNaN(date.getTime())) return data
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${date.getFullYear()}`
}

const digitString = (len: number, msg: string) =>
  z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), { message: msg })
    .refine((v) => !v || v.length === len, {
      message: `Deve ter exatamente ${len} dígitos`,
    })

const phoneRegex = /^\d{8,9}$/

function isValidCNPJ(cnpj: string): boolean {
  if (!/^\d{14}$/.test(cnpj)) return false
  if (/^(\d)\1{13}$/.test(cnpj)) return false

  const calc = (digits: number[], pesos: number[]): number => {
    let sum = 0
    for (let i = 0; i < pesos.length; i++) {
      sum += digits[i] * pesos[i]
    }
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const d = cnpj.split('').map(Number)
  return (
    calc(d, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === d[12] &&
    calc(d, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === d[13]
  )
}

const escolaFormSchema = z.object({
  // Tab 1: Identificação
  nome_escola: z.string().min(1, 'Nome da escola é obrigatório'),
  codigo_inep: digitString(8, 'Apenas dígitos'),
  situacao_funcionamento: z.string().min(1, 'Situação de funcionamento é obrigatória'),
  dependencia_administrativa: z.string().min(1, 'Dependência administrativa é obrigatória'),
  formato_organizacional: z.string().optional(),
  localizacao: z.string().min(1, 'Localização é obrigatória'),
  localizacao_diferenciada: z.string().min(1, 'Localização diferenciada é obrigatória'),

  // Tab 2: Endereço
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
  contr_est_colaboracao: checkboxValue,
  contr_est_fomento: checkboxValue,
  contr_est_cooperacao: checkboxValue,
  contr_est_prestacao: checkboxValue,
  contr_est_coop_tecnica: checkboxValue,
  contr_est_consorcio: checkboxValue,
  contr_mun_colaboracao: checkboxValue,
  contr_mun_fomento: checkboxValue,
  contr_mun_cooperacao: checkboxValue,
  contr_mun_prestacao: checkboxValue,
  contr_mun_coop_tecnica: checkboxValue,
  contr_mun_consorcio: checkboxValue,
  cnpj: digitString(14, 'CNPJ deve ter 14 dígitos'),
  cnpj_mantenedora: z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), { message: 'CNPJ da mantenedora deve conter apenas dígitos' })
    .refine((v) => !v || isValidCNPJ(v), { message: 'CNPJ da mantenedora inválido' }),
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
  agua_fonte: checkboxValue,
  agua_carro_pipa: checkboxValue,
  agua_inexistente: checkboxValue,
  energia_rede_publica: checkboxValue,
  energia_gerador: checkboxValue,
  energia_renovavel: checkboxValue,
  energia_inexistente: checkboxValue,
  esgoto_rede_publica: checkboxValue,
  esgoto_fossa_septica: checkboxValue,
  esgoto_fossa_rudimentar: checkboxValue,
  esgoto_inexistente: checkboxValue,
  lixo_coleta: checkboxValue,
  lixo_queima: checkboxValue,
  lixo_enterra: checkboxValue,
  lixo_destinacao_licenciada: checkboxValue,
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
  acess_portas_80cm: checkboxValue,
  acess_rampas: checkboxValue,
  acess_sinalizacao_luminosa: checkboxValue,
  acess_sinalizacao_sonora: checkboxValue,
  acess_sinalizacao_tatil: checkboxValue,
  acess_sinalizacao_visual: checkboxValue,
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
  internet_ensino: checkboxValue,
  internet_alunos: checkboxValue,
  internet_comunidade: checkboxValue,
  internet_inexistente: checkboxValue,
  internet_equip_alunos: z.string().optional(),
  internet_banda_larga: checkboxValue,
  rede_local: z.string().optional(),

  // Tab 8: Profissionais e Materiais
  prof_agronomos: z.string().optional(),
  prof_assistente_social: z.string().optional(),
  prof_aux_admin: z.string().optional(),
  prof_aux_servicos: z.string().optional(),
  prof_bibliotecario: z.string().optional(),
  prof_bombeiro: z.string().optional(),
  prof_coordenador: z.string().optional(),
  prof_fonoaudiologo: z.string().optional(),
  prof_nutricionista: z.string().optional(),
  prof_psicologo: z.string().optional(),
  prof_cozinheiro: z.string().optional(),
  prof_supervisao: z.string().optional(),
  prof_secretario: z.string().optional(),
  prof_seguranca: z.string().optional(),
  prof_tecnicos: z.string().optional(),
  prof_vice_diretor: z.string().optional(),
  prof_orientador_comun: z.string().optional(),
  prof_tradutor_libras: z.string().optional(),
  prof_revisor_braille: z.string().optional(),
  prof_nenhum: checkboxValue,
  mat_acervo_multimidia: checkboxValue,
  mat_brinquedos_infantil: checkboxValue,
  mat_cientificos: checkboxValue,
  mat_amplificacao_som: checkboxValue,
  mat_audiovisuais: checkboxValue,
  mat_horta: checkboxValue,
  mat_instrumentos_musicais: checkboxValue,
  mat_jogos_educativos: checkboxValue,
  mat_kits_robotica: checkboxValue,
  mat_atividades_culturais: checkboxValue,
  mat_educacao_emocional: checkboxValue,
  mat_educacao_profissional: checkboxValue,
  mat_pratica_desportiva: checkboxValue,
  mat_bilingue_surdos: checkboxValue,
  mat_educacao_indigena: checkboxValue,
  mat_etnico_raciais: checkboxValue,
  mat_educacao_campo: checkboxValue,
  mat_educacao_quilombola: checkboxValue,
  mat_educacao_especial: checkboxValue,
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
  cota_escola_publica: checkboxValue,
  cota_pcd: checkboxValue,
  cota_outros: checkboxValue,
  cota_nenhum: checkboxValue,
  site_blog: checkboxValue,
  compartilha_espacos: checkboxValue,
  usa_entorno: checkboxValue,
  org_associacao_pais: checkboxValue,
  org_associacao_mestres: checkboxValue,
  org_conselho_escolar: checkboxValue,
  org_gremio: checkboxValue,
  org_outros: checkboxValue,
  org_nenhum: checkboxValue,
  ppp_atualizado: z.string().optional(),
  educacao_ambiental: checkboxValue,
  amb_conteudo: checkboxValue,
  amb_componente: checkboxValue,
  amb_eixo: checkboxValue,
  amb_eventos: checkboxValue,
  amb_transversal: checkboxValue,
  amb_nenhum: checkboxValue,
}).superRefine((values, ctx) => {
  const precisaCnpjMant =
    values.situacao_funcionamento === '1' &&
    values.dependencia_administrativa === '4' &&
    values.mant_sem_fins_lucrativos === '1' &&
    values.regulamentacao === '1'

  if (precisaCnpjMant && !values.cnpj_mantenedora) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['cnpj_mantenedora'],
      message: 'CNPJ da mantenedora é obrigatório neste caso.',
    })
  }

  const aguaCamposAntecedentes = [
    'agua_rede_publica',
    'agua_poco_artesiano',
    'agua_cacimba',
    'agua_fonte',
    'agua_carro_pipa',
  ] as const

  if (values.agua_inexistente === '1' && aguaCamposAntecedentes.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['agua_inexistente'],
      message: '"Não há abastecimento de água" não pode ser marcado junto com outro tipo de abastecimento.',
    })
  }

  const esgotoCamposAntecedentes = [
    'esgoto_rede_publica',
    'esgoto_fossa_septica',
    'esgoto_fossa_rudimentar',
  ] as const

  if (values.esgoto_inexistente === '1' && esgotoCamposAntecedentes.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['esgoto_inexistente'],
      message: '"Não há esgotamento sanitário" não pode ser marcado junto com outro tipo de esgotamento.',
    })
  }

  if (values.esgoto_fossa_rudimentar === '1' && values.esgoto_fossa_septica === '1') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['esgoto_fossa_rudimentar'],
      message: '"Fossa rudimentar/comum" não pode ser marcada quando "Fossa séptica" está marcada.',
    })
  }

  const depCamposAntecedentes = [
    'dep_almoxarifado', 'dep_area_verde', 'dep_auditorio', 'dep_banheiro',
    'dep_banheiro_pcd', 'dep_banheiro_infantil', 'dep_banheiro_funcionarios', 'dep_vestiario',
    'dep_biblioteca', 'dep_cozinha', 'dep_despensa', 'dep_dormitorio_aluno',
    'dep_dormitorio_professor', 'dep_lab_ciencias', 'dep_lab_informatica', 'dep_lab_robotica',
    'dep_lab_profissional', 'dep_parque_infantil', 'dep_patio_coberto', 'dep_patio_descoberto',
    'dep_piscina', 'dep_quadra_coberta', 'dep_quadra_descoberta', 'dep_refeitorio',
    'dep_sala_repouso', 'dep_sala_artes', 'dep_sala_musica', 'dep_sala_danca',
    'dep_sala_multiuso', 'dep_terreirao', 'dep_viveiro', 'dep_sala_diretoria',
    'dep_sala_leitura', 'dep_sala_professores', 'dep_sala_aee', 'dep_sala_secretaria',
    'dep_oficinas', 'dep_estudio', 'dep_horta',
  ] as const

  const depBanheirosDetalhados = [
    'dep_banheiro_pcd',
    'dep_banheiro_infantil',
    'dep_banheiro_funcionarios',
    'dep_vestiario',
  ] as const

  if (values.dep_nenhuma === '1' && depCamposAntecedentes.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dep_nenhuma'],
      message: '"Nenhuma das dependências relacionadas" não pode ser marcado junto com outras dependências.',
    })
  }

  if (values.dep_banheiro !== '1' && depBanheirosDetalhados.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dep_banheiro'],
      message: 'O campo "Banheiro" deve ser marcado quando um banheiro acessível, de educação infantil, exclusivo para funcionários ou vestiário com chuveiro estiver marcado.',
    })
  }

  const acessCamposAntecedentes = [
    'acess_corrimao', 'acess_elevador', 'acess_pisos_tateis', 'acess_portas_80cm',
    'acess_rampas', 'acess_sinalizacao_luminosa', 'acess_sinalizacao_sonora',
    'acess_sinalizacao_tatil', 'acess_sinalizacao_visual',
  ] as const

  if (values.acess_nenhum === '1' && acessCamposAntecedentes.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['acess_nenhum'],
      message: '"Nenhum dos recursos de acessibilidade listados" não pode ser marcado junto com outros recursos.',
    })
  }

  const salasDentro = Number(values.qtd_salas_dentro) || 0
  const salasFora = Number(values.qtd_salas_fora) || 0
  const totalSalas = salasDentro + salasFora
  const predioMarcado = values.local_predio === '1'

  if (!predioMarcado && salasDentro > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['qtd_salas_dentro'],
      message: 'Deve ser nulo quando o prédio escolar não estiver marcado.',
    })
  }

  if (!predioMarcado && salasFora < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['qtd_salas_fora'],
      message: 'Obrigatório quando o prédio escolar não estiver marcado.',
    })
  }

  const salasDetalhe = [
    { campo: 'qtd_salas_climatizadas', num: Number(values.qtd_salas_climatizadas) || 0 },
    { campo: 'qtd_salas_acessiveis', num: Number(values.qtd_salas_acessiveis) || 0 },
    { campo: 'qtd_salas_leitura', num: Number(values.qtd_salas_leitura) || 0 },
  ] as const

  for (const s of salasDetalhe) {
    if (totalSalas > 0) {
      if (s.num < 1 || s.num > 9999) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [s.campo],
          message: 'Deve ser um número de 1 a 9999 quando houver salas dentro ou fora do prédio.',
        })
      }
      if (s.num > totalSalas) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [s.campo],
          message: `Não pode ser maior que a soma de salas dentro e fora do prédio (${totalSalas}).`,
        })
      }
    } else if (s.num > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [s.campo],
        message: 'Deve ser nulo quando não houver salas dentro ou fora do prédio.',
      })
    }
  }

  const eqCamposAntecedentes = [
    'eq_antena_parabolica', 'eq_computadores', 'eq_copiadora', 'eq_impressora',
    'eq_impressora_multifuncional', 'eq_scanner',
  ] as const

  if (values.eq_nenhum === '1' && eqCamposAntecedentes.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['eq_nenhum'],
      message: '"Nenhum dos equipamentos listados" não pode ser marcado junto com outros equipamentos.',
    })
  }

  const qtdEquipamentos = [
    'qtd_dvd', 'qtd_som', 'qtd_tv', 'qtd_lousa_digital',
    'qtd_projetor', 'qtd_desktop_alunos', 'qtd_portateis_alunos', 'qtd_tablets_alunos',
  ] as const

  for (const c of qtdEquipamentos) {
    const v = Number(values[c]) || 0
    if (v > 0 && (v < 1 || v > 9999)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [c],
        message: 'Deve ser nulo ou número de 1 a 9999.',
      })
    }
  }

  const internetAntecedentes = [
    'internet_administrativo', 'internet_ensino', 'internet_alunos', 'internet_comunidade',
  ] as const

  if (values.internet_inexistente === '1' && internetAntecedentes.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['internet_inexistente'],
      message: '"Não possui acesso à internet" não pode ser marcado junto com outros usos da internet.',
    })
  }

  const iea = values.internet_equip_alunos
  if (iea && !['1', '2', '3'].includes(iea)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['internet_equip_alunos'],
      message: 'Deve ser 1, 2 ou 3.',
    })
  }

  if (
    (iea === '1' || iea === '3') &&
    !(Number(values.qtd_desktop_alunos) || 0) &&
    !(Number(values.qtd_portateis_alunos) || 0) &&
    !(Number(values.qtd_tablets_alunos) || 0)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['internet_equip_alunos'],
      message: 'Não pode ser 1 ou 3 quando não houver quantidade de computadores de mesa, portáteis ou tablets para alunos.',
    })
  }

  if (values.internet_banda_larga === '1' && values.internet_inexistente === '1') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['internet_banda_larga'],
      message: 'Não pode ser marcado quando "Não possui acesso à internet" estiver marcado.',
    })
  }

  const rl = values.rede_local
  if (rl && !['0', '1', '2', '3'].includes(rl)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['rede_local'],
      message: 'Deve ser 0, 1, 2 ou 3.',
    })
  }

  const le = values.lingua_ensino
  if (le && !['0', '1', '2', '3'].includes(le)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['lingua_ensino'],
      message: 'Deve ser 0, 1, 2 ou 3.',
    })
  }

  const cotasAntecedentes = [
    'cota_ppi', 'cota_renda', 'cota_escola_publica', 'cota_pcd', 'cota_outros',
  ] as const

  if (values.cota_nenhum === '1' && cotasAntecedentes.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['cota_nenhum'],
      message: '"Sem reservas de vagas (ampla concorrência)" não pode ser marcado junto com outra modalidade de cota.',
    })
  }

  const orgAntecedentes = [
    'org_associacao_pais', 'org_associacao_mestres', 'org_conselho_escolar', 'org_gremio', 'org_outros',
  ] as const

  if (values.org_nenhum === '1' && orgAntecedentes.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['org_nenhum'],
      message: '"Não há órgãos colegiados em funcionamento" não pode ser marcado junto com outro órgão colegiado.',
    })
  }

  const ambAntecedentes = [
    'amb_conteudo', 'amb_componente', 'amb_eixo', 'amb_eventos', 'amb_transversal',
  ] as const

  if (values.amb_nenhum === '1' && ambAntecedentes.some((c) => values[c] === '1')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['amb_nenhum'],
      message: '"Nenhuma das opções listadas" não pode ser marcado junto com outra forma de educação ambiental.',
    })
  }
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
  readOnly?: boolean
  schoolId?: string | null
}

// ───────────────────── Helpers ─────────────────────

function CheckboxField({
  control,
  name,
  label,
  disabled,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  name: string
  label: string
  disabled?: boolean
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
            disabled={disabled}
          />
          <Label className={`cursor-pointer text-sm font-normal ${disabled ? 'text-muted-foreground' : ''}`}>
            {label}
          </Label>
        </div>
      )}
    />
  )
}

function PillCheckboxField({
  control,
  name,
  label,
  disabled,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  name: string
  label: string
  disabled?: boolean
  className?: string
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <ClickablePill
          label={label}
          active={field.value === '1'}
          disabled={disabled}
          onClick={() => field.onChange(field.value === '1' ? '0' : '1')}
          className={className}
        />
      )}
    />
  )
}

function PillRadioField({
  control,
  name,
  options,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  name: string
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const ativo = field.value === o.value
            return (
              <ClickablePill
                key={o.value}
                label={o.label}
                active={ativo}
                onClick={() => field.onChange(ativo ? '' : o.value)}
                className={className}
              />
            )
          })}
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
  options?: { value: string; label: string }[]
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
            <Select
              value={field.value || ''}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function QtdEquipField({
  control,
  name,
  label,
  value,
  onChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  name: string
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const ativo = !!value && Number(value) > 0
  return (
    <div className="flex items-stretch gap-3">
      <ClickablePill
        label={label}
        active={ativo}
        onClick={() => onChange(ativo ? '' : '1')}
        className="w-1/2 flex-none justify-center text-center whitespace-normal h-auto min-h-full"
      />
      <div className="w-28 shrink-0">
        <InputField
          control={control}
          name={name}
          label="Quantidade"
          type="number"
          digitsOnly
          disabled={!ativo}
        />
      </div>
    </div>
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
  digitsOnly,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
  name: string
  label: string
  placeholder?: string
  type?: string
  maxLength?: number
  disabled?: boolean
  digitsOnly?: boolean
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
              inputMode={digitsOnly ? 'numeric' : undefined}
              {...field}
              value={field.value || ''}
              onChange={
                digitsOnly
                  ? (e) => field.onChange(e.target.value.replace(/[^0-9]/g, ''))
                  : field.onChange
              }
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
  readOnly = false,
  schoolId = null,
}: EscolaFormProps) {
  const form = useForm<EscolaFormValues>({
    resolver: zodResolver(escolaFormSchema),
    defaultValues: (defaultValues || {}) as EscolaFormValues,
  })

  const { control, handleSubmit } = form

  const [qtdCodigosCompartilhados, setQtdCodigosCompartilhados] = useState(() => {
    const chaves = [
      'compartilha_codigo_1',
      'compartilha_codigo_2',
      'compartilha_codigo_3',
      'compartilha_codigo_4',
      'compartilha_codigo_5',
      'compartilha_codigo_6',
    ] as const
    const preenchidos = chaves.filter((c) => form.getValues(c)).length
    return preenchidos > 0 ? preenchidos : 1
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>('identificacao')
  const [campoDestaque, setCampoDestaque] = useState<string | null>(null)
  const [contagensProf, setContagensProf] = useState<Record<string, number>>({})
  const [profsCenso, setProfsCenso] = useState<ProfissionalCenso[]>([])
  const [carregandoProfs, setCarregandoProfs] = useState(false)
  const [modalFuncao, setModalFuncao] = useState<{ codigo: string; label: string } | null>(null)

  useEffect(() => {
    if (!schoolId || readOnly) return
    let ativo = true
    setCarregandoProfs(true)
    getProfissionaisCenso(schoolId)
      .then(({ resumo, profissionais }) => {
        if (!ativo) return
        const mapa: Record<string, number> = {}
        for (const r of resumo) mapa[r.tipo_censo] = r.total
        setContagensProf(mapa)
        setProfsCenso(profissionais)
        const totalGeral = Object.values(mapa).reduce((a, b) => a + b, 0)
        if (totalGeral === 0) {
          form.setValue('prof_nenhum', '1')
        } else {
          form.setValue('prof_nenhum', '0')
        }
      })
      .catch(() => {
        if (!ativo) return
        setContagensProf({})
      })
      .finally(() => {
        if (ativo) setCarregandoProfs(false)
      })
    return () => {
      ativo = false
    }
  }, [schoolId, readOnly, form])

  useEffect(() => {
    const TAB_VALIDAS = [
      'identificacao', 'endereco', 'administrativo', 'local-saneamento',
      'dependencias', 'acessibilidade', 'equipamentos', 'profissionais', 'gestao',
    ]
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && TAB_VALIDAS.includes(tabFromUrl)) setActiveTab(tabFromUrl)
    const fieldFromUrl = searchParams.get('field')
    if (fieldFromUrl) setCampoDestaque(fieldFromUrl)
  }, [searchParams])

  useEffect(() => {
    if (!campoDestaque || !defaultValues) return
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-field="${campoDestaque}"]`)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-primary', 'rounded-md')
      const limpar = () => {
        el.classList.remove('ring-2', 'ring-primary', 'rounded-md')
        el.removeEventListener('animationend', limpar)
      }
      setTimeout(limpar, 4000)
      el.addEventListener('animationend', limpar)
    }, 350)
    return () => clearTimeout(timer)
  }, [campoDestaque, defaultValues, activeTab])

  const situacaoFuncionamento = useWatch({ control, name: 'situacao_funcionamento' })
  const dependenciaAdministrativa = useWatch({ control, name: 'dependencia_administrativa' })
  const parceriaEstadual = useWatch({ control, name: 'parceria_estadual' })
  const parceriaMunicipal = useWatch({ control, name: 'parceria_municipal' })
  const localPredio = useWatch({ control, name: 'local_predio' })
  const predioCompartilhado = useWatch({ control, name: 'predio_compartilhado' })
  const aguaInexistente = useWatch({ control, name: 'agua_inexistente' })
  const aguaDemais = useWatch({
    control,
    name: ['agua_rede_publica', 'agua_poco_artesiano', 'agua_cacimba', 'agua_fonte', 'agua_carro_pipa'],
  })
  const energiaInexistente = useWatch({ control, name: 'energia_inexistente' })
  const energiaDemais = useWatch({
    control,
    name: ['energia_rede_publica', 'energia_gerador', 'energia_renovavel'],
  })
  const esgotoInexistente = useWatch({ control, name: 'esgoto_inexistente' })
  const esgotoDemais = useWatch({
    control,
    name: ['esgoto_rede_publica', 'esgoto_fossa_septica', 'esgoto_fossa_rudimentar'],
  })
  const esgotoFossaSeptica = useWatch({ control, name: 'esgoto_fossa_septica' })
  const depNenhuma = useWatch({ control, name: 'dep_nenhuma' })
  const acessNenhum = useWatch({ control, name: 'acess_nenhum' })
  const eqNenhum = useWatch({ control, name: 'eq_nenhum' })
  const matNenhum = useWatch({ control, name: 'mat_nenhum' })
  const qtdEquipValues = useWatch({
    control,
    name: [
      'qtd_dvd', 'qtd_som', 'qtd_tv', 'qtd_lousa_digital',
      'qtd_projetor', 'qtd_desktop_alunos', 'qtd_portateis_alunos', 'qtd_tablets_alunos',
    ],
  })
  const temEquipEscola =
    (Number(qtdEquipValues[5]) || 0) > 0 ||
    (Number(qtdEquipValues[6]) || 0) > 0 ||
    (Number(qtdEquipValues[7]) || 0) > 0
  const eqDemais = useWatch({
    control,
    name: [
      'eq_antena_parabolica', 'eq_computadores', 'eq_copiadora', 'eq_impressora',
      'eq_impressora_multifuncional', 'eq_scanner',
    ],
  })
  const acessDemais = useWatch({
    control,
    name: [
      'acess_corrimao', 'acess_elevador', 'acess_pisos_tateis', 'acess_portas_80cm',
      'acess_rampas', 'acess_sinalizacao_luminosa', 'acess_sinalizacao_sonora',
      'acess_sinalizacao_tatil', 'acess_sinalizacao_visual',
    ],
  })
  const depDemais = useWatch({
    control,
    name: [
      'dep_almoxarifado', 'dep_area_verde', 'dep_auditorio', 'dep_banheiro',
      'dep_banheiro_pcd', 'dep_banheiro_infantil', 'dep_banheiro_funcionarios', 'dep_vestiario',
      'dep_biblioteca', 'dep_cozinha', 'dep_despensa', 'dep_dormitorio_aluno',
      'dep_dormitorio_professor', 'dep_lab_ciencias', 'dep_lab_informatica', 'dep_lab_robotica',
      'dep_lab_profissional', 'dep_parque_infantil', 'dep_patio_coberto', 'dep_patio_descoberto',
      'dep_piscina', 'dep_quadra_coberta', 'dep_quadra_descoberta', 'dep_refeitorio',
      'dep_sala_repouso', 'dep_sala_artes', 'dep_sala_musica', 'dep_sala_danca',
      'dep_sala_multiuso', 'dep_terreirao', 'dep_viveiro', 'dep_sala_diretoria',
      'dep_sala_leitura', 'dep_sala_professores', 'dep_sala_aee', 'dep_sala_secretaria',
      'dep_oficinas', 'dep_estudio', 'dep_horta',
    ],
  })
  const depBanheiroDetalhado = useWatch({
    control,
    name: ['dep_banheiro_pcd', 'dep_banheiro_infantil', 'dep_banheiro_funcionarios', 'dep_vestiario'],
  })
  const exameSelecao = useWatch({ control, name: 'exame_selecao' })
  const educacaoAmbiental = useWatch({ control, name: 'educacao_ambiental' })
  const unidadeVinculada = useWatch({ control, name: 'unidade_vinculada' })
  const linguaEnsino = useWatch({ control, name: 'lingua_ensino' })
  const internetAlunos = useWatch({ control, name: 'internet_alunos' })
  const internetInexistente = useWatch({ control, name: 'internet_inexistente' })
  const internetDemais = useWatch({
    control,
    name: ['internet_administrativo', 'internet_ensino', 'internet_alunos', 'internet_comunidade'],
  })
  const regulamentacao = useWatch({ control, name: 'regulamentacao' })
  const mantSemFinsLucrativos = useWatch({ control, name: 'mant_sem_fins_lucrativos' })
  const municipioWatch = useWatch({ control, name: 'municipio' })
  const distritoWatch = useWatch({ control, name: 'distrito' })

  const municipiosOptions = MUNICIPIOS_CEARA.map(m => ({
    value: m.codigo,
    label: `${m.nome} / ${m.uf}`,
  }))

  const orgaosOptions = ORGAOS_REGIONAIS_CEARA.map(o => ({
    value: o.codigo,
    label: `${o.nome} (${o.codigo})`,
  }))

  const municipioSelecionado = MUNICIPIOS_CEARA.find(m => m.codigo === municipioWatch)
  const distritosOptions = (municipioSelecionado?.distritos ?? []).map(d => ({
    value: d.importCodigo,
    label: d.nome,
  }))

  useEffect(() => {
    if (!municipioSelecionado) {
      if (distritoWatch) form.setValue('distrito', '')
      return
    }
    const distritoValido = municipioSelecionado.distritos.some(d => d.importCodigo === distritoWatch)
    if (!distritoValido) {
      const sede =
        municipioSelecionado.distritos.find(d => d.nome === municipioSelecionado.nome) ||
        municipioSelecionado.distritos[0]
      if (sede) form.setValue('distrito', sede.importCodigo)
    }
    if (municipioSelecionado.ddd) {
      form.setValue('ddd', municipioSelecionado.ddd)
    }
  }, [municipioWatch, municipioSelecionado, distritoWatch, form])

  const submitHandler = (data: EscolaFormValues) => {
    for (const p of PROFISSOES_CENSO) {
      const total = contagensProf[p.codigo] || 0
      form.setValue(p.field as keyof EscolaFormValues, total > 0 ? String(total) : '')
    }
    const totalGeral = Object.values(contagensProf).reduce((a, b) => a + b, 0)
    form.setValue('prof_nenhum', totalGeral === 0 ? '1' : '0')
    const novosDados = form.getValues()
    return onSubmit(novosDados as unknown as Record<string, unknown>)
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
    { value: '1', label: 'Sim' },
    { value: '2', label: 'Em tramitação' },
  ]

  const esferaOptions = [
    { value: '1', label: 'Federal' },
    { value: '2', label: 'Estadual' },
    { value: '3', label: 'Municipal' },
    { value: '4', label: 'Estadual e Municipal' },
    { value: '5', label: 'Federal e Estadual' },
  ]

  const unidadeVinculadaOptions = [
    { value: '0', label: 'Sem vínculo com outra instituição' },
    { value: '1', label: 'Unidade vinculada a escola de educação básica' },
    { value: '2', label: 'Unidade ofertante de educação superior' },
  ]

  const formaOcupacaoOptions = [
    { value: '1', label: 'Próprio' },
    { value: '2', label: 'Alugado' },
    { value: '3', label: 'Cedido' },
  ]

  const internetEquipOptions = [
    { value: '1', label: 'Computadores de mesa, portáteis e tablets da escola (laboratório de informática, biblioteca, salas de aula, etc.)' },
    { value: '2', label: 'Dispositivos pessoais (computadores portáteis, celulares, tablets, etc.)' },
    { value: '3', label: 'Computadores de mesa, portáteis e tablets da escola (no laboratório de informática, biblioteca, sala de aula, etc.) e Dispositivos pessoais (computadores portáteis, celulares, tablets, etc.)' },
  ]

  const redeLocalOptions = [
    { value: '0', label: 'Não há rede local interligando computadores' },
    { value: '1', label: 'A cabo' },
    { value: '2', label: 'Wireless' },
    { value: '3', label: 'A cabo e Wireless' },
  ]

  const linguaOptions = [
    { value: '0', label: 'Não oferece educação indígena' },
    { value: '1', label: 'Língua indígena' },
    { value: '2', label: 'Língua portuguesa' },
    { value: '3', label: 'Língua indígena e língua portuguesa' },
  ]

  const pppOptions = [
    { value: '0', label: 'Não' },
    { value: '1', label: 'Sim' },
    { value: '2', label: 'A escola não possui PPP / proposta pedagógica' },
  ]

  const mostraOrgaos = ['1', '2', '3'].includes(dependenciaAdministrativa)
  const mostraMantenedora = dependenciaAdministrativa === '4' && situacaoFuncionamento === '1'
  const mostraCategoriaPrivada = dependenciaAdministrativa === '4'
  const mostraEsfera = ['1', '2'].includes(regulamentacao || '')
  const mostraEscolaSede = unidadeVinculada === '1'
  const mostraIes = unidadeVinculada === '2'
  const mostraUnidadeVinculada = situacaoFuncionamento === '1'
  const mostraCnpjMantenedora = situacaoFuncionamento === '1' && dependenciaAdministrativa === '4'
  const cnpjMantenedoraObrigatorio = mantSemFinsLucrativos === '1' && regulamentacao === '1'

  useEffect(() => {
    if (!mostraCnpjMantenedora && form.getValues('cnpj_mantenedora')) {
      form.setValue('cnpj_mantenedora', '')
    }
  }, [mostraCnpjMantenedora, form])

  useEffect(() => {
    if (!mostraUnidadeVinculada) {
      if (form.getValues('unidade_vinculada')) form.setValue('unidade_vinculada', '')
      if (form.getValues('codigo_escola_sede')) form.setValue('codigo_escola_sede', '')
      if (form.getValues('codigo_ies')) form.setValue('codigo_ies', '')
    }
  }, [mostraUnidadeVinculada, form])

  useEffect(() => {
    if (predioCompartilhado !== '1') {
      let limpo = false
      const chaves = [
        'compartilha_codigo_1',
        'compartilha_codigo_2',
        'compartilha_codigo_3',
        'compartilha_codigo_4',
        'compartilha_codigo_5',
        'compartilha_codigo_6',
      ] as const
      for (const c of chaves) {
        if (form.getValues(c)) {
          form.setValue(c, '')
          limpo = true
        }
      }
      if (limpo) setQtdCodigosCompartilhados(1)
    }
  }, [predioCompartilhado, form])

  useEffect(() => {
    if (aguaInexistente === '1') {
      const outros = ['agua_rede_publica', 'agua_poco_artesiano', 'agua_cacimba', 'agua_fonte', 'agua_carro_pipa'] as const
      for (const c of outros) {
        if (form.getValues(c) === '1') form.setValue(c, '0')
      }
    }
  }, [aguaInexistente, form])

  useEffect(() => {
    if (energiaInexistente === '1') {
      const outros = ['energia_rede_publica', 'energia_gerador', 'energia_renovavel'] as const
      for (const c of outros) {
        if (form.getValues(c) === '1') form.setValue(c, '0')
      }
    }
  }, [energiaInexistente, form])

  useEffect(() => {
    if (esgotoInexistente === '1') {
      const outros = ['esgoto_rede_publica', 'esgoto_fossa_septica', 'esgoto_fossa_rudimentar'] as const
      for (const c of outros) {
        if (form.getValues(c) === '1') form.setValue(c, '0')
      }
    }
  }, [esgotoInexistente, form])

  useEffect(() => {
    if (esgotoFossaSeptica === '1' && form.getValues('esgoto_fossa_rudimentar') === '1') {
      form.setValue('esgoto_fossa_rudimentar', '0')
    }
  }, [esgotoFossaSeptica, form])

  useEffect(() => {
    if (depNenhuma === '1') {
      const outros = [
        'dep_almoxarifado', 'dep_area_verde', 'dep_auditorio', 'dep_banheiro',
        'dep_banheiro_pcd', 'dep_banheiro_infantil', 'dep_banheiro_funcionarios', 'dep_vestiario',
        'dep_biblioteca', 'dep_cozinha', 'dep_despensa', 'dep_dormitorio_aluno',
        'dep_dormitorio_professor', 'dep_lab_ciencias', 'dep_lab_informatica', 'dep_lab_robotica',
        'dep_lab_profissional', 'dep_parque_infantil', 'dep_patio_coberto', 'dep_patio_descoberto',
        'dep_piscina', 'dep_quadra_coberta', 'dep_quadra_descoberta', 'dep_refeitorio',
        'dep_sala_repouso', 'dep_sala_artes', 'dep_sala_musica', 'dep_sala_danca',
        'dep_sala_multiuso', 'dep_terreirao', 'dep_viveiro', 'dep_sala_diretoria',
        'dep_sala_leitura', 'dep_sala_professores', 'dep_sala_aee', 'dep_sala_secretaria',
        'dep_oficinas', 'dep_estudio', 'dep_horta',
      ] as const
      for (const c of outros) {
        if (form.getValues(c) === '1') form.setValue(c, '0')
      }
    }
  }, [depNenhuma, form])

  useEffect(() => {
    if (depNenhuma !== '1' && depBanheiroDetalhado.some((v) => v === '1') && form.getValues('dep_banheiro') !== '1') {
      form.setValue('dep_banheiro', '1')
    }
  }, [depBanheiroDetalhado, depNenhuma, form])

  useEffect(() => {
    if (acessNenhum === '1') {
      const outros = [
        'acess_corrimao', 'acess_elevador', 'acess_pisos_tateis', 'acess_portas_80cm',
        'acess_rampas', 'acess_sinalizacao_luminosa', 'acess_sinalizacao_sonora',
        'acess_sinalizacao_tatil', 'acess_sinalizacao_visual',
      ] as const
      for (const c of outros) {
        if (form.getValues(c) === '1') form.setValue(c, '0')
      }
    }
  }, [acessNenhum, form])

  useEffect(() => {
    if (eqNenhum === '1') {
      const outros = [
        'eq_antena_parabolica', 'eq_computadores', 'eq_copiadora', 'eq_impressora',
        'eq_impressora_multifuncional', 'eq_scanner',
      ] as const
      for (const c of outros) {
        if (form.getValues(c) === '1') form.setValue(c, '0')
      }
    }
  }, [eqNenhum, form])

  useEffect(() => {
    if (matNenhum === '1') {
      const outros = [
        'mat_acervo_multimidia', 'mat_brinquedos_infantil', 'mat_cientificos', 'mat_amplificacao_som',
        'mat_audiovisuais', 'mat_horta', 'mat_instrumentos_musicais', 'mat_jogos_educativos',
        'mat_kits_robotica', 'mat_atividades_culturais', 'mat_educacao_emocional',
        'mat_educacao_profissional', 'mat_pratica_desportiva', 'mat_bilingue_surdos',
        'mat_educacao_indigena', 'mat_etnico_raciais', 'mat_educacao_campo',
        'mat_educacao_quilombola', 'mat_educacao_especial',
      ] as const
      for (const c of outros) {
        if (form.getValues(c) === '1') form.setValue(c, '0')
      }
    }
  }, [matNenhum, form])

  useEffect(() => {
    if (internetInexistente === '1') {
      const outros = [
        'internet_administrativo', 'internet_ensino', 'internet_alunos', 'internet_comunidade',
      ] as const
      for (const c of outros) {
        if (form.getValues(c) === '1') form.setValue(c, '0')
      }
    }
  }, [internetInexistente, form])

  useEffect(() => {
    if (internetAlunos === '1' && !temEquipEscola && ['1', '3'].includes(form.getValues('internet_equip_alunos') || '')) {
      form.setValue('internet_equip_alunos', '')
    }
  }, [internetAlunos, temEquipEscola, form])

  const mostraFormaOcupacao = localPredio === '1'
  const mostraCompartilhamento = localPredio === '1' && predioCompartilhado === '1'
  const mostraCotas = exameSelecao === '1'
  const mostraEducacaoAmbiental = educacaoAmbiental === '1'
  const mostraLinguaIndigena = ['1', '3'].includes(linguaEnsino || '')
  const mostraInternetEquipAlunos = internetAlunos === '1' && internetInexistente !== '1'
  const mostraBandaLarga = internetInexistente !== '1'

  const internetEquipOptionsFiltradas = internetEquipOptions.filter(
    (o) => temEquipEscola || o.value === '2',
  )

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
    { name: 'contr_est_colaboracao', label: 'Termo de colaboração (Lei nº 13.019/2014)' },
    { name: 'contr_est_fomento', label: 'Termo de fomento (Lei nº 13.019/2014)' },
    { name: 'contr_est_cooperacao', label: 'Acordo de cooperação (Lei nº 13.019/2014)' },
    { name: 'contr_est_prestacao', label: 'Contrato de prestação de serviço' },
    { name: 'contr_est_coop_tecnica', label: 'Termo de cooperação técnica e financeira' },
    { name: 'contr_est_consorcio', label: 'Contrato de consórcio público/Convênio de cooperação' },
  ]

  const contrMunChecks = [
    { name: 'contr_mun_colaboracao', label: 'Termo de colaboração (Lei nº 13.019/2014)' },
    { name: 'contr_mun_fomento', label: 'Termo de fomento (Lei nº 13.019/2014)' },
    { name: 'contr_mun_cooperacao', label: 'Acordo de cooperação (Lei nº 13.019/2014)' },
    { name: 'contr_mun_prestacao', label: 'Contrato de prestação de serviço' },
    { name: 'contr_mun_coop_tecnica', label: 'Termo de cooperação técnica e financeira' },
    { name: 'contr_mun_consorcio', label: 'Contrato de consórcio público/Convênio de cooperação' },
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
    { name: 'agua_fonte', label: 'Fonte / rio / igarapé / riacho / córrego' },
    { name: 'agua_carro_pipa', label: 'Carro-pipa' },
    { name: 'agua_inexistente', label: 'Não há abastecimento de água' },
  ]

  const energiaChecks = [
    { name: 'energia_rede_publica', label: 'Rede pública' },
    { name: 'energia_gerador', label: 'Gerador movido a combustível fóssil' },
    { name: 'energia_renovavel', label: 'Fontes de energia renováveis ou alternativas' },
    { name: 'energia_inexistente', label: 'Não há energia elétrica' },
  ]

  const esgotoChecks = [
    { name: 'esgoto_rede_publica', label: 'Rede pública' },
    { name: 'esgoto_fossa_septica', label: 'Fossa séptica' },
    { name: 'esgoto_fossa_rudimentar', label: 'Fossa rudimentar/comum' },
    { name: 'esgoto_inexistente', label: 'Não há esgotamento sanitário' },
  ]

  const lixoDestinoChecks = [
    { name: 'lixo_coleta', label: 'Serviço de coleta' },
    { name: 'lixo_queima', label: 'Queima' },
    { name: 'lixo_enterra', label: 'Enterra' },
    { name: 'lixo_destinacao_licenciada', label: 'Leva a uma destinação final licenciada pelo poder público' },
    { name: 'lixo_outra_area', label: 'Descarta em outra área' },
  ]

  const lixoTratamentoChecks = [
    { name: 'lixo_separacao', label: 'Separação do lixo/resíduos' },
    { name: 'lixo_reaproveitamento', label: 'Reaproveitamento/reutilização' },
    { name: 'lixo_reciclagem', label: 'Reciclagem' },
    { name: 'lixo_sem_tratamento', label: 'Não faz tratamento' },
  ]

  const depChecks = [
    { name: 'dep_almoxarifado', label: 'Almoxarifado' },
    { name: 'dep_area_verde', label: 'Área de vegetação ou gramado' },
    { name: 'dep_auditorio', label: 'Auditório' },
    { name: 'dep_banheiro', label: 'Banheiro' },
    { name: 'dep_banheiro_pcd', label: 'Banheiro acessível adequado ao uso de pessoas com deficiência ou mobilidade reduzida' },
    { name: 'dep_banheiro_infantil', label: 'Banheiro adequado à educação infantil' },
    { name: 'dep_banheiro_funcionarios', label: 'Banheiro exclusivo para os funcionários' },
    { name: 'dep_vestiario', label: 'Banheiro ou vestiário com chuveiro' },
    { name: 'dep_biblioteca', label: 'Biblioteca' },
    { name: 'dep_cozinha', label: 'Cozinha' },
    { name: 'dep_despensa', label: 'Despensa' },
    { name: 'dep_dormitorio_aluno', label: 'Dormitório de aluno(a)' },
    { name: 'dep_dormitorio_professor', label: 'Dormitório de professor(a)' },
    { name: 'dep_lab_ciencias', label: 'Laboratório de ciências' },
    { name: 'dep_lab_informatica', label: 'Laboratório de informática' },
    { name: 'dep_lab_robotica', label: 'Laboratório de robótica' },
    { name: 'dep_lab_profissional', label: 'Laboratório específico para a educação profissional' },
    { name: 'dep_parque_infantil', label: 'Parque infantil' },
    { name: 'dep_patio_coberto', label: 'Pátio coberto' },
    { name: 'dep_patio_descoberto', label: 'Pátio descoberto' },
    { name: 'dep_piscina', label: 'Piscina' },
    { name: 'dep_quadra_coberta', label: 'Quadra de esportes coberta' },
    { name: 'dep_quadra_descoberta', label: 'Quadra de esportes descoberta' },
    { name: 'dep_refeitorio', label: 'Refeitório' },
    { name: 'dep_sala_repouso', label: 'Sala de repouso para aluno(a)' },
    { name: 'dep_sala_artes', label: 'Sala/ateliê de artes' },
    { name: 'dep_sala_musica', label: 'Sala de música/coral' },
    { name: 'dep_sala_danca', label: 'Sala/estúdio de dança' },
    { name: 'dep_sala_multiuso', label: 'Sala multiuso (música, dança e artes)' },
    { name: 'dep_terreirao', label: 'Terreirão (área para prática desportiva e recreação sem cobertura, sem piso e sem edificações)' },
    { name: 'dep_viveiro', label: 'Viveiro/criação de animais' },
    { name: 'dep_sala_diretoria', label: 'Sala de diretoria' },
    { name: 'dep_sala_leitura', label: 'Sala de leitura' },
    { name: 'dep_sala_professores', label: 'Sala de professores' },
    { name: 'dep_sala_aee', label: 'Sala de recursos multifuncionais para atendimento educacional especializado (AEE)' },
    { name: 'dep_sala_secretaria', label: 'Sala de secretaria' },
    { name: 'dep_oficinas', label: 'Salas de oficinas da educação profissional' },
    { name: 'dep_estudio', label: 'Estúdio de gravação e edição' },
    { name: 'dep_horta', label: 'Área de horta, plantio e/ou produção agrícola' },
    { name: 'dep_nenhuma', label: 'Nenhuma das dependências relacionadas' },
  ]

  const acessChecks = [
    { name: 'acess_corrimao', label: 'Corrimão e guarda-corpos' },
    { name: 'acess_elevador', label: 'Elevador' },
    { name: 'acess_pisos_tateis', label: 'Pisos táteis' },
    { name: 'acess_portas_80cm', label: 'Portas com vão livre de no mínimo 80 cm' },
    { name: 'acess_rampas', label: 'Rampas' },
    { name: 'acess_sinalizacao_luminosa', label: 'Sinalização/alarme luminoso' },
    { name: 'acess_sinalizacao_sonora', label: 'Sinalização sonora' },
    { name: 'acess_sinalizacao_tatil', label: 'Sinalização tátil' },
    { name: 'acess_sinalizacao_visual', label: 'Sinalização visual (piso/paredes)' },
    { name: 'acess_nenhum', label: 'Nenhum dos recursos de acessibilidade listados' },
  ]

  const eqChecks = [
    { name: 'eq_antena_parabolica', label: 'Antena parabólica' },
    { name: 'eq_computadores', label: 'Computadores' },
    { name: 'eq_copiadora', label: 'Copiadora' },
    { name: 'eq_impressora', label: 'Impressora' },
    { name: 'eq_impressora_multifuncional', label: 'Impressora Multifuncional' },
    { name: 'eq_scanner', label: 'Scanner' },
    { name: 'eq_nenhum', label: 'Nenhum dos equipamentos listados' },
  ]

  const qtdEquipChecks = [
    { name: 'qtd_dvd', label: 'Aparelho de DVD/Blu-ray' },
    { name: 'qtd_som', label: 'Aparelho de som' },
    { name: 'qtd_tv', label: 'Aparelho de Televisão' },
    { name: 'qtd_lousa_digital', label: 'Lousa digital' },
    { name: 'qtd_projetor', label: 'Projetor Multimídia (Data show)' },
    { name: 'qtd_desktop_alunos', label: 'Computadores de mesa (desktop) em uso pelos alunos' },
    { name: 'qtd_portateis_alunos', label: 'Computadores portáteis em uso pelos alunos' },
    { name: 'qtd_tablets_alunos', label: 'Tablets em uso pelos alunos' },
  ] as const

  const internetChecks = [
    { name: 'internet_administrativo', label: 'Para uso administrativo' },
    { name: 'internet_ensino', label: 'Para uso no processo de ensino e aprendizagem' },
    { name: 'internet_alunos', label: 'Para uso dos aluno(a)s' },
    { name: 'internet_comunidade', label: 'Para uso da comunidade' },
    { name: 'internet_inexistente', label: 'Não possui acesso à internet' },
  ]

  const matChecks = [
    { name: 'mat_acervo_multimidia', label: 'Acervo multimídia' },
    { name: 'mat_brinquedos_infantil', label: 'Brinquedos para educação infantil' },
    { name: 'mat_cientificos', label: 'Conjunto de materiais científicos' },
    { name: 'mat_amplificacao_som', label: 'Equipamento para amplificação e difusão de som/áudio' },
    { name: 'mat_audiovisuais', label: 'Equipamentos audiovisuais para produção estudantil' },
    { name: 'mat_horta', label: 'Equipamentos e instrumentos para atividades em área de horta, plantio e/ou produção agrícola' },
    { name: 'mat_instrumentos_musicais', label: 'Instrumentos musicais para conjunto, banda/fanfarra e/ou aulas de música' },
    { name: 'mat_jogos_educativos', label: 'Jogos educativos' },
    { name: 'mat_kits_robotica', label: 'Kits de robótica' },
    { name: 'mat_atividades_culturais', label: 'Materiais para atividades culturais e artísticas' },
    { name: 'mat_educacao_emocional', label: 'Materiais para a educação emocional e mediação de conflitos' },
    { name: 'mat_educacao_profissional', label: 'Materiais para educação profissional' },
    { name: 'mat_pratica_desportiva', label: 'Materiais para prática desportiva e recreação' },
    { name: 'mat_bilingue_surdos', label: 'Materiais pedagógicos para a educação bilíngue de surdos' },
    { name: 'mat_educacao_indigena', label: 'Materiais pedagógicos para a educação escolar indígena' },
    { name: 'mat_etnico_raciais', label: 'Materiais pedagógicos para a educação das relações étnicos raciais' },
    { name: 'mat_educacao_campo', label: 'Materiais pedagógicos para a educação do campo' },
    { name: 'mat_educacao_quilombola', label: 'Materiais pedagógicos para a educação escolar quilombola' },
    { name: 'mat_educacao_especial', label: 'Materiais pedagógicos para a educação especial' },
    { name: 'mat_nenhum', label: 'Nenhum dos instrumentos listados' },
  ]

  const cotaChecks = [
    { name: 'cota_ppi', label: 'Autodeclarado preto, pardo ou indígena (PPI)' },
    { name: 'cota_renda', label: 'Condição de renda' },
    { name: 'cota_escola_publica', label: 'Oriundo de escola pública' },
    { name: 'cota_pcd', label: 'Pessoa com deficiência (PCD)' },
    { name: 'cota_outros', label: 'Outros grupos que não os listados' },
    { name: 'cota_nenhum', label: 'Sem reservas de vagas para sistema de cotas (ampla concorrência)' },
  ]

  const orgChecks = [
    { name: 'org_associacao_pais', label: 'Associação de Pais' },
    { name: 'org_associacao_mestres', label: 'Associação de pais e mestres' },
    { name: 'org_conselho_escolar', label: 'Conselho escolar' },
    { name: 'org_gremio', label: 'Grêmio estudantil' },
    { name: 'org_outros', label: 'Outros' },
    { name: 'org_nenhum', label: 'Não há órgãos colegiados em funcionamento' },
  ]

  const ambChecks = [
    { name: 'amb_conteudo', label: 'Como conteúdo dos componentes/campos de experiências presentes no currículo' },
    { name: 'amb_componente', label: 'Como um componente curricular especial, específico, flexível ou eletivo' },
    { name: 'amb_eixo', label: 'Como um eixo estruturante do currículo' },
    { name: 'amb_eventos', label: 'Em eventos' },
    { name: 'amb_transversal', label: 'Em projetos transversais ou interdisciplinares' },
    { name: 'amb_nenhum', label: 'Nenhuma das opções listadas' },
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex h-auto min-h-[54px] w-full flex-nowrap items-stretch justify-start gap-1 overflow-x-auto overflow-y-hidden rounded-lg bg-muted/60 px-1 pt-1 pb-[10px] [&_[data-slot='tabs-trigger']]:min-w-max">
              <TabsTrigger
                value="identificacao"
                className="h-10 min-h-[40px] rounded-md px-3 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground sm:px-4"
              >
                Identificação
              </TabsTrigger>
                <TabsTrigger
                  value="endereco"
                  className="h-10 min-h-[40px] rounded-md px-3 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground sm:px-4"
                >
                  Endereço
                </TabsTrigger>
                <TabsTrigger
                  value="administrativo"
                  className="h-10 min-h-[40px] rounded-md px-3 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground sm:px-4"
                >
                  Administrativo
                </TabsTrigger>
                <TabsTrigger
                  value="local-saneamento"
                  className="h-10 min-h-[40px] rounded-md px-3 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground sm:px-4"
                >
                  Local e Saneamento
                </TabsTrigger>
                <TabsTrigger
                  value="dependencias"
                  className="h-10 min-h-[40px] rounded-md px-3 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground sm:px-4"
                >
                  Dependências Físicas
                </TabsTrigger>
                <TabsTrigger
                  value="acessibilidade"
                  className="h-10 min-h-[40px] rounded-md px-3 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground sm:px-4"
                >
                  Acessibilidade e Salas
                </TabsTrigger>
                <TabsTrigger
                  value="equipamentos"
                  className="h-10 min-h-[40px] rounded-md px-3 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground sm:px-4"
                >
                  Equipamentos e Internet
                </TabsTrigger>
                <TabsTrigger
                  value="profissionais"
                  className="h-10 min-h-[40px] rounded-md px-3 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground sm:px-4"
                >
                  Profissionais e Materiais
                </TabsTrigger>
                <TabsTrigger
                  value="gestao"
                  className="h-10 min-h-[40px] rounded-md px-3 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 hover:text-accent-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm data-active:hover:bg-primary data-active:hover:text-primary-foreground sm:px-4"
                >
                  Gestão Escolar
                </TabsTrigger>
              </TabsList>
              <fieldset disabled={readOnly} className="contents">

            {/* ══════ Tab 1: Identificação ══════ */}
            <TabsContent value="identificacao">
              <Card>
                <CardHeader>
                  <CardTitle>Identificação da Escola (Registro 00)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <InputField
                        control={control}
                        name="nome_escola"
                        label="Nome da Escola *"
                        placeholder="Nome completo da escola"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <InputField
                        control={control}
                        name="codigo_inep"
                        label="Código INEP"
                        placeholder="8 dígitos"
                        maxLength={8}
                        digitsOnly
                      />
                    </div>
                    <div className="md:col-span-1">
                      <SelectField
                        control={control}
                        name="situacao_funcionamento"
                        label="Situação de Funcionamento *"
                        options={situacaoOptions}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <InputField
                          control={control}
                          name="email"
                          label="E-mail"
                          placeholder="email@exemplo.com"
                          type="email"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <SelectField
                          control={control}
                          name="formato_organizacional"
                          label="Formato Organizacional"
                          options={formatoOrganizacionalOptions}
                        />
                      </div>
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      control={control}
                      name="ddd"
                      label="DDD"
                      placeholder="2 dígitos"
                      maxLength={2}
                      digitsOnly
                    />
                    <InputField
                      control={control}
                      name="telefone_1"
                      label="Telefone 1"
                      placeholder="8 ou 9 dígitos"
                      maxLength={9}
                      digitsOnly
                    />
                    <InputField
                      control={control}
                      name="telefone_2"
                      label="Telefone 2"
                      placeholder="8 ou 9 dígitos"
                      maxLength={9}
                      digitsOnly
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ══════ Tab 2: Endereço ══════ */}
            <TabsContent value="endereco">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço (Registro 00)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      control={control}
                      name="cep"
                      label="CEP"
                      placeholder="8 dígitos"
                      maxLength={8}
                      digitsOnly
                    />
                    <FormField
                      control={control}
                      name="municipio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Município</FormLabel>
                          <FormControl>
                            <Combobox
                              options={municipiosOptions}
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Selecione o município"
                              searchPlaceholder="Buscar município..."
                              emptyMessage="Nenhum município encontrado."
                              disabled={readOnly}
                              maxOptions={200}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="distrito"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distrito</FormLabel>
                          <FormControl>
                            <Combobox
                              options={distritosOptions}
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder={
                                municipioSelecionado
                                  ? 'Selecione o distrito'
                                  : 'Selecione o município primeiro'
                              }
                              searchPlaceholder="Buscar distrito..."
                              emptyMessage="Nenhum distrito encontrado."
                              disabled={readOnly || !municipioSelecionado}
                              maxOptions={200}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <InputField
                      control={control}
                      name="bairro"
                      label="Bairro"
                      placeholder="Bairro"
                    />
                    <InputField
                      control={control}
                      name="endereco"
                      label="Logradouro"
                      placeholder="Rua, Avenida, etc."
                    />
                    <InputField
                      control={control}
                      name="numero"
                      label="Número"
                      placeholder="Nº"
                    />
                    <InputField
                      control={control}
                      name="complemento"
                      label="Complemento"
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <FormField
                      control={control}
                      name="codigo_orgao_regional"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Órgão Regional de Ensino</FormLabel>
                          <FormControl>
                            <Combobox
                              options={orgaosOptions}
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Selecione o órgão regional"
                              searchPlaceholder="Buscar órgão regional..."
                              emptyMessage="Nenhum órgão regional encontrado."
                              disabled={readOnly}
                              maxOptions={100}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
                      <div className="flex flex-wrap gap-2">
                        {orgaoChecks.map((c) => (
                          <PillCheckboxField
                            key={c.name}
                            control={control}
                            name={c.name}
                            label={c.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <SelectField
                        control={control}
                        name="dependencia_administrativa"
                        label="Dependência Administrativa *"
                        options={dependenciaOptions}
                      />
                    </div>
                    {mostraCategoriaPrivada && (
                      <div className="md:col-span-1">
                        <SelectField
                          control={control}
                          name="categoria_escola_privada"
                          label="Categoria da Escola Privada"
                          options={categoriaPrivadaOptions}
                        />
                      </div>
                    )}
                  </div>

                  {/* Mantenedora — apenas privada + ativa */}
                  {mostraMantenedora && (
                    <div className="border border-border rounded-lg p-4 bg-muted/30">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Mantenedora da Escola Privada
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mantChecks.map((c) => (
                          <PillCheckboxField
                            key={c.name}
                            control={control}
                            name={c.name}
                            label={c.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Parcerias */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Parcerias / Convênios
                    </h4>
                    <div className="flex flex-col gap-3">
                      <PillCheckboxField
                        control={control}
                        name="parceria_estadual"
                        label="Parceria com o governo estadual"
                      />
                      {parceriaEstadual === '1' && (
                        <div className="ml-6 flex flex-wrap gap-2 border-l-2 border-border pl-4">
                          {contrEstChecks.map((c) => (
                            <PillCheckboxField
                              key={c.name}
                              control={control}
                              name={c.name}
                              label={c.label}
                            />
                          ))}
                        </div>
                      )}
                      <PillCheckboxField
                        control={control}
                        name="parceria_municipal"
                        label="Parceria com o governo municipal"
                      />
                      {parceriaMunicipal === '1' && (
                        <div className="ml-6 flex flex-wrap gap-2 border-l-2 border-border pl-4">
                          {contrMunChecks.map((c) => (
                            <PillCheckboxField
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
                      digitsOnly
                    />
                    {mostraCnpjMantenedora && (
                      <InputField
                        control={control}
                        name="cnpj_mantenedora"
                        label={
                          cnpjMantenedoraObrigatorio
                            ? 'CNPJ da Mantenedora *'
                            : 'CNPJ da Mantenedora'
                        }
                        placeholder="14 dígitos"
                        maxLength={14}
                        digitsOnly
                      />
                    )}
                  </div>

                  <Separator />

                  {/* Regulamentação + Esfera */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                      <SelectField
                        control={control}
                        name="regulamentacao"
                        label="Regulamentação / Autorização no conselho ou órgão municipal, estadual ou federal de educação"
                        options={regulamentacaoOptions}
                      />
                    </div>
                    {mostraEsfera && (
                      <div className="md:col-span-1">
                        <SelectField
                          control={control}
                          name="esfera_regulamentacao"
                          label="Esfera administrativa do conselho ou órgão responsável pela regulamentação/autorização"
                          options={esferaOptions}
                        />
                      </div>
                    )}
                  </div>

                  {/* Unidade Vinculada + subcampos */}
                  {mostraUnidadeVinculada && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-1">
                        <SelectField
                          control={control}
                          name="unidade_vinculada"
                          label="Unidade vinculada à escola de educação básica ou unidade ofertante de educação superior"
                          options={unidadeVinculadaOptions}
                        />
                      </div>
                      {mostraEscolaSede && (
                        <div className="md:col-span-1">
                          <InputField
                            control={control}
                            name="codigo_escola_sede"
                            label="Código da Escola Sede"
                            placeholder="8 dígitos"
                            maxLength={8}
                            digitsOnly
                          />
                        </div>
                      )}
                      {mostraIes && (
                        <div className="md:col-span-1">
                          <InputField
                            control={control}
                            name="codigo_ies"
                            label="Código da IES"
                            placeholder="Máximo 9 caracteres"
                            digitsOnly
                          />
                        </div>
                      )}
                    </div>
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
                    <div className="flex flex-wrap gap-2">
                      {locaisFuncChecks.map((c) => (
                        <PillCheckboxField
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1">
                        <SelectField
                          control={control}
                          name="forma_ocupacao"
                          label="Forma de Ocupação do Prédio"
                          options={formaOcupacaoOptions}
                        />
                      </div>
                      <div className="md:col-span-1 md:mt-[22px]">
                        <PillCheckboxField
                          control={control}
                          name="predio_compartilhado"
                          label="Prédio compartilhado com outra escola"
                        />
                      </div>
                    </div>
                  )}

                  {/* Códigos de compartilhamento */}
                  {mostraCompartilhamento && (
                    <div className="border border-border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-foreground">
                          Códigos INEP das Escolas que Compartilham o Prédio
                        </h4>
                        {qtdCodigosCompartilhados < 6 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setQtdCodigosCompartilhados((q) => Math.min(6, q + 1))
                            }
                          >
                            <Plus className="h-4 w-4" />
                            Adicionar
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6]
                          .slice(0, qtdCodigosCompartilhados)
                          .map((n) => (
                            <div key={n} className="flex items-end gap-2">
                              <div className="flex-1">
                                <InputField
                                  control={control}
                                  name={`compartilha_codigo_${n}`}
                                  label={`Código ${n}`}
                                  placeholder="8 dígitos"
                                  maxLength={8}
                                  digitsOnly
                                />
                              </div>
                              {n === qtdCodigosCompartilhados && n > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-destructive mb-0.5"
                                  title={`Remover Código ${n}`}
                                  aria-label={`Remover Código ${n}`}
                                  onClick={() => {
                                    const chave = (
                                      ['compartilha_codigo_1', 'compartilha_codigo_2', 'compartilha_codigo_3', 'compartilha_codigo_4', 'compartilha_codigo_5', 'compartilha_codigo_6'] as const
                                    )[n - 1]
                                    form.setValue(chave, '')
                                    setQtdCodigosCompartilhados(n - 1)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Fornece água potável (campo 17 — acima do card) */}
                  <div className="flex flex-wrap gap-2">
                    <PillCheckboxField
                      control={control}
                      name="agua_potavel"
                      label="Fornece água potável para o consumo humano"
                    />
                  </div>

                  {/* Água */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Abastecimento de Água
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aguaChecks.map((c) => (
                        <PillCheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                          disabled={c.name === 'agua_inexistente'
                            ? aguaDemais.some((v) => v === '1')
                            : aguaInexistente === '1'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Energia */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Abastecimento de Energia Elétrica
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {energiaChecks.map((c) => (
                        <PillCheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                          disabled={c.name === 'energia_inexistente'
                            ? energiaDemais.some((v) => v === '1')
                            : energiaInexistente === '1'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Esgoto */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Esgotamento Sanitário
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {esgotoChecks.map((c) => (
                        <PillCheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                          disabled={c.name === 'esgoto_inexistente'
                            ? esgotoDemais.some((v) => v === '1')
                            : esgotoInexistente === '1' ||
                              (c.name === 'esgoto_fossa_rudimentar' && esgotoFossaSeptica === '1')}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Lixo — Destinação */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Destinação do Lixo
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {lixoDestinoChecks.map((c) => (
                        <PillCheckboxField
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
                    <div className="flex flex-wrap gap-2">
                      {lixoTratamentoChecks.map((c) => (
                        <PillCheckboxField
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {depChecks.map((c) => (
                      <PillCheckboxField
                        key={c.name}
                        control={control}
                        name={c.name}
                        label={c.label}
                        className="w-full h-full justify-center text-center whitespace-normal"
                        disabled={c.name === 'dep_nenhuma'
                          ? depDemais.some((v) => v === '1')
                          : depNenhuma === '1'}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {acessChecks.map((c) => (
                        <PillCheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                          className="w-full h-full justify-center text-center whitespace-normal"
                          disabled={c.name === 'acess_nenhum'
                            ? acessDemais.some((v) => v === '1')
                            : acessNenhum === '1'}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        control={control}
                        name="qtd_salas_dentro"
                        label="Salas de aula utilizadas dentro do prédio escolar"
                        type="number"
                        digitsOnly
                      />
                      <InputField
                        control={control}
                        name="qtd_salas_fora"
                        label="Salas de aula utilizadas fora do prédio escolar"
                        type="number"
                        digitsOnly
                      />
                      <InputField
                        control={control}
                        name="qtd_salas_climatizadas"
                        label="Salas de aula climatizadas (com ar-condicionado, aquecedor ou climatizador)"
                        type="number"
                        digitsOnly
                      />
                      <InputField
                        control={control}
                        name="qtd_salas_acessiveis"
                        label="Salas de aula com acessibilidade para pessoas com deficiência ou mobilidade reduzida"
                        type="number"
                        digitsOnly
                      />
                      <InputField
                        control={control}
                        name="qtd_salas_leitura"
                        label="Salas de aula com Cantinho da Leitura para a Educação Infantil e o Ensino fundamental (Anos iniciais)"
                        type="number"
                        digitsOnly
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {eqChecks.map((c) => (
                        <PillCheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                          className="w-full h-full justify-center text-center whitespace-normal"
                          disabled={c.name === 'eq_nenhum'
                            ? eqDemais.some((v) => v === '1')
                            : eqNenhum === '1'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quantidades de equipamentos */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Quantidade de Equipamentos
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {qtdEquipChecks.map((c, i) => (
                        <QtdEquipField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                          value={qtdEquipValues[i] || ''}
                          onChange={(v) => form.setValue(c.name, v)}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Internet */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Acesso à Internet
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {internetChecks.map((c) => (
                        <PillCheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                          disabled={c.name === 'internet_inexistente'
                            ? internetDemais.some((v) => v === '1')
                            : internetInexistente === '1'}
                        />
                      ))}
                    </div>
                  </div>

                  {mostraInternetEquipAlunos && (
                    <div className="border border-border rounded-lg p-4 bg-muted/30">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Equipamentos que os alunos usam para acessar a internet da escola
                      </h4>
                      <PillRadioField
                        control={control}
                        name="internet_equip_alunos"
                        options={internetEquipOptionsFiltradas}
                        className="whitespace-normal"
                      />
                    </div>
                  )}

                  {mostraBandaLarga && (
                    <div className="border border-border rounded-lg p-4 bg-muted/30">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Internet banda larga
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <PillCheckboxField
                          control={control}
                          name="internet_banda_larga"
                          label="Internet banda larga"
                        />
                      </div>
                    </div>
                  )}

                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Rede local de interligação de computadores
                    </h4>
                    <PillRadioField
                      control={control}
                      name="rede_local"
                      options={redeLocalOptions}
                      className="whitespace-normal"
                    />
                  </div>
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
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      Profissionais por Função
                    </h4>
                    <p className="text-[13px] text-muted-foreground mb-4">
                      Quantidades calculadas automaticamente a partir dos vínculos profissionais ativos (Usuários).
                    </p>

                    {carregandoProfs ? (
                      <div className="space-y-3">
                        <div className="h-10 bg-muted rounded-lg animate-pulse" />
                        <div className="h-10 bg-muted rounded-lg animate-pulse" />
                        <div className="h-10 bg-muted rounded-lg animate-pulse" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {PROFISSOES_CENSO.map((p) => {
                          const total = contagensProf[p.codigo] || 0
                          return (
                            <div
                              key={p.field}
                              className="border border-border rounded-lg bg-card p-4 flex flex-col justify-between min-h-[150px]"
                            >
                              <p className="text-[13px] font-medium text-foreground leading-snug">
                                {p.label}
                              </p>
                              <div className="mt-3 flex items-end justify-between gap-2">
                                <span className="text-[36px] font-bold leading-none tabular-nums text-primary">
                                  {total}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-9"
                                  disabled={total === 0}
                                  onClick={() => setModalFuncao({ codigo: p.codigo, label: p.label })}
                                >
                                  Ver profissionais
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="mt-4">
                      {form.watch('prof_nenhum') === '1' ? (
                        <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-warning inline-block" />
                          Não há funcionários para as funções listadas
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-success inline-block" />
                          Há funcionários para as funções listadas
                        </span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Materiais pedagógicos */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Materiais Pedagógicos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {matChecks.map((c) => (
                        <PillCheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                          className="w-full h-full justify-center text-center whitespace-normal"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Dialog open={!!modalFuncao} onOpenChange={(open) => { if (!open) setModalFuncao(null) }}>
                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 gap-0">
                  <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-border">
                    <DialogTitle>Profissionais — {modalFuncao?.label}</DialogTitle>
                    <DialogDescription>
                      {contagensProf[modalFuncao?.codigo || ''] || 0} profissional(is) com esta função e vínculo ativo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {modalFuncao && (() => {
                      const lista = profsCenso.filter((p) => p.tipo_censo === modalFuncao.codigo)
                      if (lista.length === 0) {
                        return (
                          <EmptyState
                            icon={Users}
                            title="Nenhum profissional"
                            description="Não há profissionais com esta função e vínculo ativo."
                          />
                        )
                      }
                      return (
                        <ul className="space-y-2">
                          {lista.map((p) => (
                            <li
                              key={p.id}
                              className="border border-border rounded-lg bg-muted/20 p-3 flex flex-wrap items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="text-[15px] font-semibold text-foreground truncate">
                                  {p.nome_completo}
                                </p>
                                <p className="text-[13px] text-muted-foreground mt-1 tabular-nums">
                                  CPF: {formatCpf(p.cpf)} · Nascimento: {formatDataNascimento(p.data_nascimento)}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 shrink-0"
                                onClick={() => {
                                  sessionStorage.setItem('usuarios_search', p.nome_completo.split(' ')[0])
                                  router.push('/gestao-usuarios/usuarios')
                                }}
                              >
                                <Eye className="mr-1.5 h-4 w-4" />
                                Ver cadastro
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )
                    })()}
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* ══════ Tab 9: Gestão Escolar ══════ */}
            <TabsContent value="gestao">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão Escolar (Registro 10)</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <PillCheckboxField
                    control={control}
                    name="alimentacao_escolar"
                    label="Alimentação escolar para os alunos"
                  />

                  <Separator />

                  {/* Língua de ensino */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <div className="max-w-md">
                      <SelectField
                        control={control}
                        name="lingua_ensino"
                        label="Língua em que o ensino é ministrado"
                        options={linguaOptions}
                      />
                    </div>
                    {mostraLinguaIndigena && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                          control={control}
                          name="codigo_lingua_indigena_1"
                          label="Código Língua Indígena 1"
                          placeholder="Código INEP"
                          digitsOnly
                        />
                        <InputField
                          control={control}
                          name="codigo_lingua_indigena_2"
                          label="Código Língua Indígena 2"
                          placeholder="Código INEP"
                          digitsOnly
                        />
                        <InputField
                          control={control}
                          name="codigo_lingua_indigena_3"
                          label="Código Língua Indígena 3"
                          placeholder="Código INEP"
                          digitsOnly
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Exame de seleção + cotas */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <PillCheckboxField
                      control={control}
                      name="exame_selecao"
                      label="A escola faz exame de seleção para ingresso de seus alunos"
                    />
                    {mostraCotas && (
                      <div className="mt-3">
                        <p className="text-[13px] text-muted-foreground mb-2">
                          Reserva de vagas por sistema de cotas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {cotaChecks.map((c) => (
                            <PillCheckboxField
                              key={c.name}
                              control={control}
                              name={c.name}
                              label={c.label}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Site, compartilha espaços, usa entorno */}
                  <div className="flex flex-wrap gap-2">
                    <PillCheckboxField
                      control={control}
                      name="site_blog"
                      label="Possui site / blog / página na internet"
                    />
                    <PillCheckboxField
                      control={control}
                      name="compartilha_espacos"
                      label="Compartilha espaços com a comunidade"
                    />
                    <PillCheckboxField
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
                    <div className="flex flex-wrap gap-2">
                      {orgChecks.map((c) => (
                        <PillCheckboxField
                          key={c.name}
                          control={control}
                          name={c.name}
                          label={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="max-w-md">
                    <SelectField
                      control={control}
                      name="ppp_atualizado"
                      label="Projeto Político-Pedagógico (PPP)"
                      options={pppOptions}
                    />
                  </div>

                  <Separator />

                  {/* Educação ambiental */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <PillCheckboxField
                      control={control}
                      name="educacao_ambiental"
                      label="A escola desenvolve ações na área de educação ambiental"
                    />
                    {mostraEducacaoAmbiental && (
                      <div className="mt-3">
                        <p className="text-[13px] text-muted-foreground mb-2">
                          Formas de educação ambiental:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ambChecks.map((c) => (
                            <PillCheckboxField
                              key={c.name}
                              control={control}
                              name={c.name}
                              label={c.label}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            </fieldset>
          </Tabs>

          {/* ──────── Bottom Buttons ──────── */}
          <div className="sticky bottom-0 z-10 flex justify-end gap-3 border-t border-border bg-background/95 px-1 py-4 backdrop-blur">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="h-11"
              >
                {readOnly ? 'Voltar' : 'Cancelar'}
              </Button>
            )}
            {!readOnly && (
              <Button type="submit" disabled={isSubmitting} className="min-h-[44px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                    Salvando...
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

export type { EscolaFormValues, EscolaFormProps }
export { escolaFormSchema }
