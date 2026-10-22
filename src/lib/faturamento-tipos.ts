// Tipos compartilhados do módulo Gestão de Faturamento (spec 043).
// Módulo neutro: sem 'use server' (apenas tipos).

export type SituacaoMensalidade = 'pendente' | 'pago' | 'cancelado' | 'isento'

export type SituacaoMensalidadeDerivada = SituacaoMensalidade | 'vencida'

export type SituacaoMatriculaFat = 'em_dia' | 'pendente' | 'vencida' | 'sem_plano'

export type SituacaoPlano = 'ativo' | 'encerrado'

export type FiltroSituacaoCobranca =
  | 'todas'
  | 'pagas'
  | 'em_aberto'
  | 'vencidas'
  | 'canceladas'
  | 'isentas'

export type TipoPendencia =
  | 'sem_plano'
  | 'vencidas'
  | 'sem_responsavel'
  | 'config_incompleta'

export interface Configuracao {
  id: string
  school_id: string
  ano_letivo_id: string
  titulo: string | null
  etapa_ids: string[] | null
  valor_mensalidade: number
  dia_vencimento: number
  mes_inicial: number
  mes_final: number
  ativo: boolean
}

export interface ConfigInput {
  ano_letivo_id: string
  titulo: string
  etapa_ids?: string[] | null
  valor_mensalidade: number
  dia_vencimento: number
  mes_inicial: number
  mes_final: number
}

export interface Abrangencia {
  anoLetivoId: string
  turmaId?: string
  etapaId?: string
  matriculaIds?: string[]
}

export interface InconsistenciaGeracao {
  matriculaId: string
  alunoNome: string
  motivo: string
  proximoPasso: string
}

export interface ResumoGeracao {
  totalMatriculas: number
  seguirãoPadrao: number
  jaConfiguradas: number
  inconsistentes: InconsistenciaGeracao[]
  naoAfetadas: number
  semResponsavel: number
  mensalidadesEstimadas: number
  valorTotalPrevisto: number | null
}

export interface FalhaLote {
  id: string
  nome: string
  motivo: string
  proximoPasso: string
}

export interface ResultadoLote {
  criados: string[]
  falhas: FalhaLote[]
  preservados: number
}

export interface BaixaInput {
  pagoEm: string
  forma: string
  observacao?: string
}

export interface PendenciaGeral {
  tipo: TipoPendencia
  quantidade: number
  acao: string
  href: string
}

export interface VisaoGeral {
  previsto: number
  recebido: number
  emAberto: number
  vencido: number
  pendencias: PendenciaGeral[]
}
