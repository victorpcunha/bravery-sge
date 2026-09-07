// Helper puro (sem 'use server'): mensagem de bloqueio para turmas cujo
// Método de Avaliação não é numérico. Fica fora dos arquivos de server
// actions porque 'use server' só permite exportar funções async.

export type MetodoBloqueioInfo = {
  nome: string | null
  tiposAvaliacao: Record<string, unknown> | null
}

export function montarMotivoBloqueio(
  metodo: MetodoBloqueioInfo,
  rotuloRelatorio = 'o Boletim Numérico'
): string {
  const t = metodo.tiposAvaliacao
  const partes: string[] = []
  if (t?.conceito === true || t?.conceito === 'true') partes.push('Conceito')
  if (t?.parecer === true || t?.parecer === 'true') partes.push('Parecer Descritivo')
  if (t?.nivel === true || t?.nivel === 'true') partes.push('Nível')
  const texto = partes.length > 0 ? partes.join(' e ') : metodo.nome || 'outro método'
  return `Esta turma utiliza avaliação por ${texto}; ${rotuloRelatorio} não está disponível para este Método de Avaliação.`
}
