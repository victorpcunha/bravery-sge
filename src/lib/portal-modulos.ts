// Visibilidade dos módulos do Portal do Responsável por escola (spec 040).
// Módulo neutro (sem 'use server'): fonte canônica de chaves, rótulos e
// colunas. Turbopack exige que 'use server' exporte só async — por isso os
// helpers vivem aqui e as actions em portal-escola.ts / portal.ts consomem.

export const MODULOS_PORTAL = [
  { chave: 'boletim', rotulo: 'Boletim', coluna: 'portal_vis_boletim' },
  { chave: 'frequencia', rotulo: 'Frequência', coluna: 'portal_vis_frequencia' },
  { chave: 'horarios', rotulo: 'Horários', coluna: 'portal_vis_horarios' },
  { chave: 'ocorrencias', rotulo: 'Ocorrências', coluna: 'portal_vis_ocorrencias' },
  { chave: 'comunicados', rotulo: 'Comunicados', coluna: 'portal_vis_comunicados' },
  { chave: 'documentos', rotulo: 'Documentos', coluna: 'portal_vis_documentos' },
] as const

export type ModuloPortal = (typeof MODULOS_PORTAL)[number]['chave']

export type ModulosVisiveis = Record<ModuloPortal, boolean>

/** Default: tudo visível (comportamento atual; defesa contra migration não aplicada). */
export function todosVisiveis(): ModulosVisiveis {
  return {
    boletim: true,
    frequencia: true,
    horarios: true,
    ocorrencias: true,
    comunicados: true,
    documentos: true,
  }
}

/** Normaliza flags vindas do banco (NULL/ausente = visível). */
export function normalizarVisiveis(flags: Partial<Record<ModuloPortal, boolean | null>>): ModulosVisiveis {
  const base = todosVisiveis()
  for (const { chave } of MODULOS_PORTAL) {
    if (flags[chave] === false) base[chave] = false
  }
  return base
}
