export interface ErroValidacao {
  registro: string           // "00" a "60"
  campo_inep: string         // Official INEP field name
  numero_campo: number       // Field number in INEP structure
  regra: string              // Rule description (INEP text)
  mensagem: string           // Formatted error message
  valor_atual: string | null // Current value causing error
  entidade_id: string        // Entity ID for redirect
  entidade_nome: string      // Entity name for display
  url_correcao: string       // Correction URL with params
  secao: string | null       // Target section/tab
  campo_destino: string | null // Target field for focus
}

export interface ResultadoValidacao {
  valido: boolean
  total_erros: number
  erros_por_registro: {
    registro00: ErroValidacao[]
    registro10: ErroValidacao[]
    registro20: ErroValidacao[]
    registro30: ErroValidacao[]
    registro40: ErroValidacao[]
    registro50: ErroValidacao[]
    registro60: ErroValidacao[]
  }
  erros_vinculos: ErroValidacao[]
}

export interface ResultadoExportacao {
  sucesso: boolean
  erros?: ErroValidacao[]
  arquivo?: {
    conteudo: string
    nome: string
    encoding: string
    tamanho_bytes: number
    total_linhas: number
    registros: RegistroCount
  }
}

export interface RegistroCount {
  escola: number
  registro00: number
  registro10: number
  registro20: number
  registro30: number
  registro40: number
  registro50: number
  registro60: number
}
