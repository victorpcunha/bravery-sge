// Censo Escolar — Situação do Aluno 2025 (v3)
// Fonte: layout_de_importacao_e_exportacao_2025_situacao_do_aluno.v3.xlsx
// Abas "89", "90", "91" — códigos do campo "Situação do aluno" e regras por etapa.

// -----------------------------------------------------------------------------
// Mapeamento situação interna (academico_matriculas.situacao) → código INEP 1-8
// -----------------------------------------------------------------------------
export const SITUACAO_FINAL_INEP: Record<string, string> = {
  Ativo: '8',                                 // Em andamento
  Reclassificado: '8',                        // Em andamento (decisão de produto)
  Remanejado: '8',                            // Em andamento (decisão de produto)
  Transferido: '1',
  Desistente: '2',                            // Deixou de frequentar
  'Óbito': '3',                               // Falecido
  Reprovado: '4',
  'Reprovado por frequência': '4',
  Aprovado: '5',
  'Aprovado por conselho de classe': '5',
  'Aprovado concluinte': '6',
  'Sem movimentação': '7',
}

export function codigoSituacaoFinal(situacao?: string | null): string | null {
  if (!situacao) return null
  return SITUACAO_FINAL_INEP[situacao] ?? null
}

// Situações de saída usadas nas regras de "admitido após" (E14/E15)
export const SITUACOES_SAIDA_ADMISSAO = ['Transferido', 'Desistente'] as const

// -----------------------------------------------------------------------------
// Etapas (códigos INEP) usadas nas regras do campo "Situação do aluno"
// -----------------------------------------------------------------------------

// Educação Infantil (1-Creche, 2-Pré-escola, 3-EI Unificada) — E18/E35
export const ETAPAS_EI = [1, 2, 3]

// Aprovado/Reprovado/Concluinte (4, 5, 6) proibidos quando etapa for 1 ou 2 — E36
export const ETAPAS_SEM_APROVACAO = [1, 2]

// "7 - Sem movimentação" permitido somente nas etapas 1 e 2 — E21/E39
export const ETAPAS_SEM_MOVIMENTACAO = [1, 2]

// "8 - Em andamento" permitido somente nas etapas de EJA/EM — E20/E38
export const ETAPAS_EM_ANDAMENTO = [39, 40, 67, 68, 69, 70, 71, 73, 74]

// "6 - Aprovado concluinte" somente nas etapas finais — E19/E37
export const ETAPAS_FINAIS_CONCLUINTE = [27, 28, 29, 37, 38, 39, 40, 41, 67, 68, 70, 71, 73, 74]

// -----------------------------------------------------------------------------
// Registro 91 — regras do campo "Código da etapa"
// -----------------------------------------------------------------------------

// Etapas de turma que exigem o preenchimento do campo "Código da etapa" — E22/E23
export const ETAPAS_TURMA_EXIGEM_ETAPA = [3, 22, 23, 56, 64, 72]

// Códigos de etapa permitidos por etapa da turma (E28–E32)
export const ETAPAS_ADMISSAO_POR_TURMA: Record<number, number[]> = {
  3: [1, 2],
  22: [14, 15, 16, 17, 18, 19, 20, 21, 41],
  23: [14, 15, 16, 17, 18, 19, 20, 21, 41],
  72: [69, 70],
  56: [1, 2, 14, 15, 16, 17, 18, 19, 20, 21, 41],
  64: [39, 40],
}

// Códigos de etapa permitidos por tipo de mediação didático-pedagógica (E26/E27)
export const ETAPAS_POR_MEDIACAO: Record<string, number[]> = {
  '2': [69, 70, 71],
  '3': [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 70, 71, 73, 74, 67],
}

// Função nome matching para identificar o gestor escolar (Registro 89)
export const FUNCAO_GESTOR_REGEX = /gestor|diretor|dirigente|coordenador/i