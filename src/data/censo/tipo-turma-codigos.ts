// INEP Censo Escolar 2026 — Mapa canônico rótulo ↔ código
// O modal de Turmas grava rótulos (`tipos_turma`, `forma_organizacao`) enquanto o
// motor do Censo opera com códigos INEP. Este mapa centraliza a conversão
// (validação + exportação) SEM migração de dados legados.

export const TIPO_TURMA_ROTULO_PARA_CODIGO: Record<string, string> = {
  'Atividade Complementar': '4',
  'Atendimento Educacional Especializado (AEE)': '5',
  'Curricular': '6',
  'Curricular com Atividade Complementar': '9',
};

export const TIPO_TURMA_CODIGO_PARA_ROTULO: Record<string, string> = Object.fromEntries(
  Object.entries(TIPO_TURMA_ROTULO_PARA_CODIGO).map(([rotulo, codigo]) => [codigo, rotulo]),
);

export function codigoTipoTurma(tiposTurma: string[] | string | null | undefined): string {
  const lista = Array.isArray(tiposTurma) ? tiposTurma : tiposTurma ? [tiposTurma] : [];
  return TIPO_TURMA_ROTULO_PARA_CODIGO[lista[0]] || String(lista[0] || '');
}

// Anexo 6 — Formas de Organização (códigos):
//   1 = Série/Ano · 2 = Período/Semestre · 3 = Ciclo(s) · 4 = Grupo não-seriado
//   5 = Módulo · 6 = Alternância regular
export const FORMA_ORGANIZACAO_ROTULO_PARA_CODIGO: Record<string, string> = {
  'Série/ano (séries anuais)': '1',
  'Ciclo(s)': '3',
  'Módulos': '5',
  'Períodos semestrais': '2',
  'Grupos não-seriados com base na idade ou competência (art. 23 da LDB)': '4',
  'Alternância regular de períodos de estudos': '6',
};

export function codigoFormaOrganizacao(rotulo: string | null | undefined): string {
  if (!rotulo) return '';
  return FORMA_ORGANIZACAO_ROTULO_PARA_CODIGO[rotulo] || rotulo;
}
