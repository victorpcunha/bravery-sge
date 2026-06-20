// INEP Censo Escolar 2026 — Catálogo de Etapas de Ensino e Etapas Agregadas
// Fonte: Portaria Inep nº 291/2025 — Cadastro de Turmas (Educacenso)

export interface EtapaEnsino {
  codigo: number;
  nome: string;
  agregada: number; // código da etapa agregada correspondente
}

export interface EtapaAgregada {
  codigo: number;
  nome: string;
}

// -----------------------------------------------------------------------------
// Etapas de Ensino (nível detalhado) — 36 códigos
// -----------------------------------------------------------------------------

export const ETAPAS_ENSINO: EtapaEnsino[] = [
  // ----- Educação Infantil (agregada 301) -----
  { codigo: 1, nome: "Creche (0 a 3 anos)", agregada: 301 },
  { codigo: 2, nome: "Pré-escola", agregada: 301 },
  { codigo: 3, nome: "Educação Infantil Unificada", agregada: 301 },

  // ----- Ensino Fundamental — Anos Iniciais (agregada 302) -----
  { codigo: 14, nome: "1º Ano Ensino Fundamental", agregada: 302 },
  { codigo: 15, nome: "2º Ano Ensino Fundamental", agregada: 302 },
  { codigo: 16, nome: "3º Ano Ensino Fundamental", agregada: 302 },
  { codigo: 17, nome: "4º Ano Ensino Fundamental", agregada: 302 },
  { codigo: 18, nome: "5º Ano Ensino Fundamental", agregada: 302 },

  // ----- Ensino Fundamental — Anos Finais (agregada 302) -----
  { codigo: 19, nome: "6º Ano Ensino Fundamental", agregada: 302 },
  { codigo: 20, nome: "7º Ano Ensino Fundamental", agregada: 302 },
  { codigo: 21, nome: "8º Ano Ensino Fundamental", agregada: 302 },
  { codigo: 41, nome: "9º Ano Ensino Fundamental", agregada: 302 },

  // ----- Multi e Correção de Fluxo (agregada 303) -----
  { codigo: 22, nome: "Multi", agregada: 303 },
  { codigo: 23, nome: "Correção de Fluxo", agregada: 303 },
  { codigo: 56, nome: "Multietapa", agregada: 303 },

  // ----- Ensino Médio (agregada 304) -----
  { codigo: 25, nome: "1ª Série Ensino Médio", agregada: 304 },
  { codigo: 26, nome: "2ª Série Ensino Médio", agregada: 304 },
  { codigo: 27, nome: "3ª Série Ensino Médio", agregada: 304 },
  { codigo: 28, nome: "4ª Série Ensino Médio", agregada: 304 },
  { codigo: 29, nome: "Ensino Médio Não Seriado", agregada: 304 },
  { codigo: 64, nome: "Técnico Integrado Ensino Médio", agregada: 304 },

  // ----- Ensino Médio — Normal/Magistério (agregada 305) -----
  { codigo: 35, nome: "Normal/Magistério 1ª Série", agregada: 305 },
  { codigo: 36, nome: "Normal/Magistério 2ª Série", agregada: 305 },
  { codigo: 37, nome: "Normal/Magistério 3ª Série", agregada: 305 },
  { codigo: 38, nome: "Normal/Magistério 4ª Série", agregada: 305 },

  // ----- Educação de Jovens e Adultos — EJA (agregada 306) -----
  { codigo: 69, nome: "EJA Ensino Fundamental Anos Finais", agregada: 306 },
  { codigo: 70, nome: "EJA Ensino Fundamental Anos Iniciais", agregada: 306 },
  { codigo: 72, nome: "EJA Ensino Fundamental Multietapa", agregada: 306 },
  { codigo: 71, nome: "EJA Ensino Médio", agregada: 306 },
  { codigo: 74, nome: "Técnico Integrado EJA", agregada: 306 },
  { codigo: 73, nome: "FIC EJA Nível Fundamental", agregada: 306 },
  { codigo: 67, nome: "FIC EJA Nível Médio", agregada: 306 },

  // ----- Curso Técnico e Qualificação Profissional (agregada 308) -----
  { codigo: 39, nome: "Técnico Concomitante", agregada: 308 },
  { codigo: 40, nome: "Técnico Subsequente", agregada: 308 },
  { codigo: 68, nome: "FIC Concomitante", agregada: 308 },
  { codigo: 75, nome: "FIC Não Vinculada", agregada: 308 },
];

// -----------------------------------------------------------------------------
// Etapas Agregadas (nível macro) — 7 códigos
// -----------------------------------------------------------------------------

export const ETAPAS_AGREGADAS: EtapaAgregada[] = [
  { codigo: 301, nome: "Educação Infantil" },
  { codigo: 302, nome: "Ensino Fundamental" },
  { codigo: 303, nome: "Multi e correção de fluxo" },
  { codigo: 304, nome: "Ensino Médio" },
  { codigo: 305, nome: "Ensino Médio - Normal/Magistério" },
  { codigo: 306, nome: "Educação de Jovens e Adultos (EJA)" },
  { codigo: 308, nome: "Curso Técnico e Qualificação Profissional" },
];
