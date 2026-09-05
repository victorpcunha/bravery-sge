'use server'

// Guarda compartilhada: impede alterações quando a turma está fechada.
// Usa import dinâmico para evitar ciclos de importação entre as actions.

export async function garantirTurmaAberta(turmaId: string) {
  const fechada = await verificarTurmaFechadaPublica(turmaId)
  if (fechada) {
    throw new Error('A turma está fechada. Não é possível realizar alterações.')
  }
  return true
}

export async function verificarTurmaFechadaPublica(turmaId: string): Promise<boolean> {
  const { verificarTurmaFechada } = await import('./fechamento-turma')
  return verificarTurmaFechada(turmaId)
}