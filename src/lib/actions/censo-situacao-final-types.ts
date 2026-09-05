import type { ErroValidacao } from './censo-types'

export interface ResultadoValidacaoSituacaoFinal {
  valido: boolean
  total_erros: number
  erros_por_registro: {
    registro89: ErroValidacao[]
    registro90: ErroValidacao[]
    registro91: ErroValidacao[]
  }
  resumo?: {
    total_matriculas_90: number
    total_admitidos_apos_91: number
    total_sem_inep: number
  }
}

export interface RegistroCountSituacaoFinal {
  escola: number
  registro89: number
  registro90: number
  registro91: number
}

export interface ResultadoExportacaoSituacaoFinal {
  sucesso: boolean
  erros?: ErroValidacao[]
  arquivo?: {
    conteudo: string
    nome: string
    encoding: string
    tamanho_bytes: number
    total_linhas: number
    registros: RegistroCountSituacaoFinal
  }
}