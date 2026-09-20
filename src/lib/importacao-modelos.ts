// Modelos e tipos compartilhados da Importação Inicial (spec 039).
// Módulo neutro (sem 'use server'): importável pelo cliente (upload/modelo)
// e pelas Server Actions de validação/persistência.

export type TipoImportacao = 'aluno' | 'profissional'

export type LinhaArquivo = {
  numeroLinha: number
  valores: string[]
}

export type ErroLinha = {
  linha: number
  campo: string
  mensagem: string
  orientacao: string
}

export type ResultadoLote = {
  totalRecebidas: number
  totalCriadas: number
  totalRejeitadas: number
  erros: ErroLinha[]
  criadosIds: string[]
}

export const CABECALHO_ALUNO = [
  'nome_completo',
  'cpf',
  'data_nascimento',
  'sexo',
  'matricula_certidao',
] as const

export const CABECALHO_PROFISSIONAL = [
  'nome_completo',
  'cpf',
  'data_nascimento',
  'sexo',
  'email',
] as const

export function cabecalhoEsperado(tipo: TipoImportacao): string[] {
  return [...(tipo === 'aluno' ? CABECALHO_ALUNO : CABECALHO_PROFISSIONAL)]
}

export const MAX_LINHAS_LOTE = 1000

export const RECURSO_IMPORTACAO = 'importacao-exportacao.importacao-inicial'
export const MODULO_IMPORTACAO = 'Importação e Exportação — Importação Inicial'

/** Rótulo amigável do tipo para mensagens e títulos. */
export function rotuloTipo(tipo: TipoImportacao): string {
  return tipo === 'aluno' ? 'Alunos' : 'Profissionais'
}

export function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : ''
}

export function erro(
  linha: number,
  campo: string,
  mensagem: string,
  orientacao: string,
): ErroLinha {
  return { linha, campo, mensagem, orientacao }
}

/**
 * Valida o cabeçalho recebido contra o modelo oficial (nomes, ordem e
 * quantidade exatas). Retorna erros de lote (linha 0) — nunca mapear
 * coluna errada silenciosamente. Pura: usada no cliente (gate) e no
 * servidor (defesa em profundidade).
 */
export function validarCabecalho(tipo: TipoImportacao, recebido: string[]): ErroLinha[] {
  const esperado = cabecalhoEsperado(tipo)
  const norm = recebido.map((c) => texto(c).toLowerCase())
  if (norm.length !== esperado.length || !esperado.every((c, i) => norm[i] === c)) {
    return [
      erro(
        0,
        'geral',
        'O cabeçalho do arquivo não confere com o modelo oficial.',
        `Baixe o modelo de ${tipo === 'aluno' ? 'Alunos' : 'Profissionais'} e use exatamente este cabeçalho, nesta ordem: ${esperado.join(';')}`,
      ),
    ]
  }
  return []
}
