// INEP Censo Escolar 2026 — Anexo 6: Formas de Organização do Ensino por Etapa
// Fonte: Portaria Inep nº 291/2025
//
// Códigos das formas de organização:
//   1 = Série/Ano
//   2 = Período/Semestre
//   3 = Ciclo(s)
//   4 = Grupo não-seriado
//   5 = Módulo
//   6 = Alternância regular

export interface EtapaFormaOrganizacao {
  etapa_codigo: number;
  etapa_nome: string;
  formas: number[];
}

export const ETAPAS_FORMAS_ORGANIZACAO: EtapaFormaOrganizacao[] = [
  // ---------------------------------------------------------------------------
  // Educação Infantil — nenhuma forma de organização
  // ---------------------------------------------------------------------------
  { etapa_codigo: 1, etapa_nome: "Creche (0 a 3 anos)", formas: [] },
  { etapa_codigo: 2, etapa_nome: "Pré-escola", formas: [] },
  { etapa_codigo: 3, etapa_nome: "Educação Infantil Unificada", formas: [] },

  // ---------------------------------------------------------------------------
  // Ensino Fundamental — Anos Iniciais (1º ao 5º)
  // ---------------------------------------------------------------------------
  { etapa_codigo: 14, etapa_nome: "1º Ano Ensino Fundamental", formas: [1, 3, 4, 5] },
  { etapa_codigo: 15, etapa_nome: "2º Ano Ensino Fundamental", formas: [1, 3, 4, 5] },
  { etapa_codigo: 16, etapa_nome: "3º Ano Ensino Fundamental", formas: [1, 3, 4, 5] },
  { etapa_codigo: 17, etapa_nome: "4º Ano Ensino Fundamental", formas: [1, 3, 4, 5] },
  { etapa_codigo: 18, etapa_nome: "5º Ano Ensino Fundamental", formas: [1, 3, 4, 5] },

  // ---------------------------------------------------------------------------
  // Ensino Fundamental — Anos Finais (6º ao 9º)
  // ---------------------------------------------------------------------------
  { etapa_codigo: 19, etapa_nome: "6º Ano Ensino Fundamental", formas: [1, 3, 4, 5, 6] },
  { etapa_codigo: 20, etapa_nome: "7º Ano Ensino Fundamental", formas: [1, 3, 4, 5, 6] },
  { etapa_codigo: 21, etapa_nome: "8º Ano Ensino Fundamental", formas: [1, 3, 4, 5, 6] },
  { etapa_codigo: 41, etapa_nome: "9º Ano Ensino Fundamental", formas: [1, 3, 4, 5, 6] },

  // ---------------------------------------------------------------------------
  // Multi e Correção de Fluxo
  // ---------------------------------------------------------------------------
  { etapa_codigo: 22, etapa_nome: "Multi", formas: [1, 3, 4, 5, 6] },
  { etapa_codigo: 23, etapa_nome: "Correção de Fluxo", formas: [1, 3, 4, 5, 6] },

  // ---------------------------------------------------------------------------
  // Multietapa
  // ---------------------------------------------------------------------------
  { etapa_codigo: 56, etapa_nome: "Multietapa", formas: [1, 3, 4, 5] },

  // ---------------------------------------------------------------------------
  // Ensino Médio
  // ---------------------------------------------------------------------------
  { etapa_codigo: 25, etapa_nome: "1ª Série Ensino Médio", formas: [1, 2, 3, 4, 5, 6] },
  { etapa_codigo: 26, etapa_nome: "2ª Série Ensino Médio", formas: [1, 2, 3, 4, 5, 6] },
  { etapa_codigo: 27, etapa_nome: "3ª Série Ensino Médio", formas: [1, 2, 3, 4, 5, 6] },
  { etapa_codigo: 28, etapa_nome: "4ª Série Ensino Médio", formas: [1, 2, 3, 4, 5, 6] },
  { etapa_codigo: 29, etapa_nome: "Ensino Médio Não Seriado", formas: [1, 2, 3, 4, 5, 6] },

  // ---------------------------------------------------------------------------
  // Ensino Médio — Normal/Magistério
  // ---------------------------------------------------------------------------
  { etapa_codigo: 35, etapa_nome: "Normal/Magistério 1ª Série", formas: [1, 2, 3, 4, 5, 6] },
  { etapa_codigo: 36, etapa_nome: "Normal/Magistério 2ª Série", formas: [1, 2, 3, 4, 5, 6] },
  { etapa_codigo: 37, etapa_nome: "Normal/Magistério 3ª Série", formas: [1, 2, 3, 4, 5, 6] },
  { etapa_codigo: 38, etapa_nome: "Normal/Magistério 4ª Série", formas: [1, 2, 3, 4, 5, 6] },

  // ---------------------------------------------------------------------------
  // Educação de Jovens e Adultos (EJA)
  // ---------------------------------------------------------------------------
  { etapa_codigo: 69, etapa_nome: "EJA Ensino Fundamental Anos Finais", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 70, etapa_nome: "EJA Ensino Fundamental Anos Iniciais", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 72, etapa_nome: "EJA Ensino Fundamental Multietapa", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 71, etapa_nome: "EJA Ensino Médio", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 74, etapa_nome: "Técnico Integrado EJA", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 73, etapa_nome: "FIC EJA Nível Fundamental", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 67, etapa_nome: "FIC EJA Nível Médio", formas: [1, 2, 4, 5, 6] },

  // ---------------------------------------------------------------------------
  // Curso Técnico e FIC
  // ---------------------------------------------------------------------------
  { etapa_codigo: 39, etapa_nome: "Técnico Concomitante", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 40, etapa_nome: "Técnico Subsequente", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 64, etapa_nome: "Técnico Integrado Ensino Médio", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 68, etapa_nome: "FIC Concomitante", formas: [1, 2, 4, 5, 6] },
  { etapa_codigo: 75, etapa_nome: "FIC Não Vinculada", formas: [1, 2, 4, 5, 6] },
];
