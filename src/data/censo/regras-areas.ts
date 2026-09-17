// Tabela de Regras de Areas do Conhecimento - Censo Escolar 2026 (v4)
// Fonte: Tabela de Regras de Areas do Conhecimento 2026.xlsx (transcricao
// manual da listagem extraida em 2026-09-17; Etapa -> areas DESABILITADAS).
//
// Uso na validacao (20.c39-65.n2): area marcada (=1) nao pode constar da
// lista de desabilitadas da etapa. EI (1,2,3) desabilita tudo (sem areas).
// Codigo de area = numero INEP (1=Quimica ... 99=Outras).

export const AREA_KEY_POR_NUMERO: Record<number, string> = {
  1: 'area_quimica',
  2: 'area_fisica',
  3: 'area_matematica_turma',
  4: 'area_biologia',
  5: 'area_ciencias',
  6: 'area_portugues',
  7: 'area_ingles',
  8: 'area_espanhol',
  9: 'area_outra_estrangeira',
  10: 'area_arte',
  11: 'area_ed_fisica',
  12: 'area_historia',
  13: 'area_geografia',
  14: 'area_filosofia',
  16: 'area_informatica',
  17: 'area_profissionalizantes',
  23: 'area_libras',
  25: 'area_pedagogicas',
  26: 'area_ensino_religioso',
  27: 'area_lingua_indigena',
  28: 'area_estudos_sociais',
  29: 'area_sociologia',
  30: 'area_frances',
  31: 'area_portugues_sl',
  32: 'area_estagio',
  33: 'area_projeto_vida',
  99: 'area_outras',
}

const TODAS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 99]

/** etapa_codigo -> numeros INEP desabilitados */
export const AREAS_DESABILITADAS_POR_ETAPA: Record<number, number[]> = {
  1: TODAS,
  2: TODAS,
  3: TODAS,
  // EF anos iniciais 14-18: bloco compartilhado (linhas 24-61 da planilha)
  14: [2, 4, 17, 25, 29, 33, 32],
  15: [2, 4, 17, 25, 29, 33, 32],
  16: [2, 4, 17, 25, 29, 33, 32],
  17: [2, 4, 17, 25, 29, 33, 32],
  18: [2, 4, 17, 25, 29, 33, 32],
  // EF anos finais/multi 19-41: bloco compartilhado (linhas 62-83)
  19: [25, 28, 32, 33, 17],
  20: [25, 28, 32, 33, 17],
  21: [25, 28, 32, 33, 17],
  41: [25, 28, 32, 33, 17],
  23: [25],
  22: [32],
  56: [33],
  69: [1, 2, 4, 17, 25, 29, 33, 32],
  70: [17, 25, 28, 32, 33],
  72: [17, 25, 32, 33],
  73: [25, 33, 5],
  // EM 25 + EJA/FIC 74,67: blocos proprios/compartilhado
  25: [17, 25, 28, 32],
  71: [5, 17, 25, 28, 33, 32],
  74: [5, 25, 28, 33],
  67: [5, 25, 28, 33],
  35: [17, 28],
  // 36,37,38: sem regras (irrestrito). 39,40,64,68,75: bloco compartilhado
  39: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 23, 25, 26, 27, 28, 29, 30, 31, 33, 99],
  40: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 23, 25, 26, 27, 28, 29, 30, 31, 33, 99],
  64: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 23, 25, 26, 27, 28, 29, 30, 31, 33, 99],
  68: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 23, 25, 26, 27, 28, 29, 30, 31, 33, 99],
  75: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 23, 25, 26, 27, 28, 29, 30, 31, 33, 99],
}
