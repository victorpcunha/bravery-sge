import { MUNICIPIOS_CEARA } from '@/data/censo/municipios-ceara'

export type ConfigDocumentosForm = {
  nome_escola_doc: string
  cnpj_doc: string
  logradouro_doc: string
  numero_doc: string
  bairro_doc: string
  municipio_doc: string
  cep_doc: string
  telefone_doc: string
  email_doc: string
  nome_fantasia: string
  site: string
  mantenedora: string
  cabecalho: string
  rodape: string
  responsavel_nome: string
  responsavel_cargo: string
  logo: string
}

export function configDocumentosVazia(): ConfigDocumentosForm {
  return {
    nome_escola_doc: '',
    cnpj_doc: '',
    logradouro_doc: '',
    numero_doc: '',
    bairro_doc: '',
    municipio_doc: '',
    cep_doc: '',
    telefone_doc: '',
    email_doc: '',
    nome_fantasia: '',
    site: '',
    mantenedora: '',
    cabecalho: '',
    rodape: '',
    responsavel_nome: '',
    responsavel_cargo: '',
    logo: '',
  }
}

function str(v: unknown): string {
  return typeof v === 'string' && v.trim() !== '' ? v : ''
}

function strDigitos(v: unknown): string {
  return typeof v === 'string' ? v.replace(/\D/g, '') : ''
}

function formatarTelefone(ddd: string, numero: string): string {
  if (!numero) return ddd ? `(${ddd})` : ''
  const parte = numero.length === 9
    ? `${numero.slice(0, 5)}-${numero.slice(5)}`
    : numero.length === 8
      ? `${numero.slice(0, 4)}-${numero.slice(4)}`
      : numero
  return ddd ? `(${ddd}) ${parte}` : parte
}

function formatarTelefones(ddd: string, num1: string, num2: string): string {
  const t1 = formatarTelefone(ddd, num1)
  const t2 = formatarTelefone(ddd, num2)
  if (t1 && t2) return `${t1} · ${t2}`
  return t1 || t2
}

/**
 * "Replica automaticamente" os campos do cadastro da Unidade Escolar para as
 * Configurações de Documentos (copias independentes; edita-las nao altera o censo).
 */
export function seedDocumentosFromSchool(school: {
  nome_escola?: string | null
  cnpj?: string | null
  endereco?: string | null
  numero?: string | null
  bairro?: string | null
  municipio?: string | null
  cep?: string | null
  ddd?: string | null
  telefone_1?: string | null
  telefone_2?: string | null
  email?: string | null
}): ConfigDocumentosForm {
  return {
    nome_escola_doc: str(school.nome_escola),
    cnpj_doc: strDigitos(school.cnpj),
    logradouro_doc: str(school.endereco),
    numero_doc: str(school.numero),
    bairro_doc: str(school.bairro),
    municipio_doc: strDigitos(school.municipio),
    cep_doc: strDigitos(school.cep),
    telefone_doc: formatarTelefones(str(school.ddd), str(school.telefone_1), str(school.telefone_2)),
    email_doc: str(school.email),
    nome_fantasia: '',
    site: '',
    mantenedora: '',
    cabecalho: '',
    rodape: '',
    responsavel_nome: '',
    responsavel_cargo: '',
    logo: '',
  }
}

export function nomeMunicipioCeara(codigo: string): string {
  if (!codigo) return ''
  const m = MUNICIPIOS_CEARA.find((m) => m.codigo === codigo)
  return m?.nome || ''
}