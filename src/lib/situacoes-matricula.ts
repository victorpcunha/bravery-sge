// ============================================
// Catálogo de Situações do Aluno Matriculado
// Valores internos (DB) → rótulos de exibição
// (alinhados ao layout do Censo Escolar INEP)
// ============================================

export const SITUACOES_MATRICULA = {
  Ativo: 'Em andamento',
  Transferido: 'Transferido',
  Desistente: 'Deixou de frequentar',
  'Óbito': 'Óbito',
  Reclassificado: 'Reclassificado',
  Remanejado: 'Remanejado',
  Aprovado: 'Aprovado',
  'Aprovado por conselho de classe': 'Aprovado por Conselho',
  Reprovado: 'Reprovado',
  'Reprovado por frequência': 'Reprovado por frequência',
  'Aprovado concluinte': 'Aprovado concluinte',
  'Sem movimentação': 'Sem movimentação',
} as const

export type VariantSituacao = 'success' | 'warning' | 'destructive' | 'info' | 'primary' | 'muted'

export const SITUACAO_VARIANT: Record<string, VariantSituacao> = {
  Ativo: 'success',
  Transferido: 'warning',
  Desistente: 'destructive',
  'Óbito': 'destructive',
  Reclassificado: 'info',
  Remanejado: 'warning',
  Aprovado: 'success',
  'Aprovado por conselho de classe': 'success',
  Reprovado: 'destructive',
  'Reprovado por frequência': 'destructive',
  'Aprovado concluinte': 'success',
  'Sem movimentação': 'primary',
}

export function labelSituacaoMatricula(situacao?: string | null): string {
  if (!situacao) return '—'
  return SITUACOES_MATRICULA[situacao as keyof typeof SITUACOES_MATRICULA] || situacao
}

export function variantSituacaoMatricula(situacao?: string | null): VariantSituacao {
  if (!situacao) return 'muted'
  return SITUACAO_VARIANT[situacao] || 'muted'
}

// Situações aplicadas pelo processo de Fechamento de Turma (Situação Final)
export const SITUACOES_RESULTADO_FINAL = [
  'Aprovado',
  'Aprovado por conselho de classe',
  'Aprovado concluinte',
  'Reprovado',
  'Reprovado por frequência',
  'Sem movimentação',
] as const

// Situações que não pertencem mais à turma ativa (movimentações / óbito)
export const SITUACOES_SAIDA = [
  'Transferido',
  'Desistente',
  'Óbito',
  'Reclassificado',
  'Remanejado',
] as const

export function isSituacaoFinal(situacao?: string | null): boolean {
  if (!situacao) return false
  return (SITUACOES_RESULTADO_FINAL as readonly string[]).includes(situacao)
}

export function isSituacaoSaida(situacao?: string | null): boolean {
  if (!situacao) return false
  return (SITUACOES_SAIDA as readonly string[]).includes(situacao)
}

// Códigos INEP das etapas finais (geram "Aprovado concluinte")
export const ETAPAS_FINAIS_INEP = [18, 41, 27]