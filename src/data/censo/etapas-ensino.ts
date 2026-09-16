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
  { codigo: 1, nome: "Educação infantil - creche (0 a 3 anos)", agregada: 301 },
  { codigo: 2, nome: "Educação infantil - pré-escola (4 e 5 anos)", agregada: 301 },
  { codigo: 3, nome: "Educação infantil - unificada (0 a 5 anos)", agregada: 301 },

  // ----- Ensino Fundamental — Anos Iniciais (agregada 302) -----
  { codigo: 14, nome: "Ensino fundamental de 9 anos - 1º Ano", agregada: 302 },
  { codigo: 15, nome: "Ensino fundamental de 9 anos - 2º Ano", agregada: 302 },
  { codigo: 16, nome: "Ensino fundamental de 9 anos - 3º Ano", agregada: 302 },
  { codigo: 17, nome: "Ensino fundamental de 9 anos - 4º Ano", agregada: 302 },
  { codigo: 18, nome: "Ensino fundamental de 9 anos - 5º Ano", agregada: 302 },

  // ----- Ensino Fundamental — Anos Finais (agregada 302) -----
  { codigo: 19, nome: "Ensino fundamental de 9 anos - 6º Ano", agregada: 302 },
  { codigo: 20, nome: "Ensino fundamental de 9 anos - 7º Ano", agregada: 302 },
  { codigo: 21, nome: "Ensino fundamental de 9 anos - 8º Ano", agregada: 302 },
  { codigo: 41, nome: "Ensino fundamental de 9 anos - 9º Ano", agregada: 302 },

  // ----- Multi e Correção de Fluxo (agregada 303) -----
  { codigo: 22, nome: "Ensino fundamental de 9 anos - multi", agregada: 303 },
  { codigo: 23, nome: "Ensino fundamental de 9 anos - correção de fluxo", agregada: 303 },
  { codigo: 56, nome: "Educação infantil e ensino fundamental - multietapa", agregada: 303 },

  // ----- Ensino Médio (agregada 304) -----
  { codigo: 25, nome: "Ensino médio - 1ª Série", agregada: 304 },
  { codigo: 26, nome: "Ensino médio - 2ª Série", agregada: 304 },
  { codigo: 27, nome: "Ensino médio - 3ª Série", agregada: 304 },
  { codigo: 28, nome: "Ensino médio - 4ª Série", agregada: 304 },
  { codigo: 29, nome: "Ensino médio - não seriada", agregada: 304 },

  // ----- Ensino Médio — Normal/Magistério (agregada 305) -----
  { codigo: 35, nome: "Ensino médio - normal/magistério - 1ª Série", agregada: 305 },
  { codigo: 36, nome: "Ensino médio - normal/magistério - 2ª Série", agregada: 305 },
  { codigo: 37, nome: "Ensino médio - normal/magistério - 3ª Série", agregada: 305 },
  { codigo: 38, nome: "Ensino médio - normal/magistério - 4ª Série", agregada: 305 },

  // ----- Educação de Jovens e Adultos — EJA (agregada 306) -----
  { codigo: 69, nome: "EJA - Ensino fundamental - anos iniciais (1º segmento)", agregada: 306 },
  { codigo: 70, nome: "EJA - Ensino fundamental - anos finais (2º segmento)", agregada: 306 },
  { codigo: 72, nome: "EJA - Ensino fundamental - anos iniciais e anos finais (EJA Multietapas)", agregada: 306 },
  { codigo: 71, nome: "EJA - Ensino médio (3º segmento)", agregada: 306 },
  { codigo: 74, nome: "Curso técnico integrado na modalidade EJA", agregada: 306 },
  { codigo: 73, nome: "Curso FIC integrado na modalidade EJA - nível fundamental", agregada: 306 },
  { codigo: 67, nome: "Curso FIC integrado na modalidade EJA - nível médio", agregada: 306 },

  // ----- Curso Técnico e Qualificação Profissional (agregada 308) -----
  { codigo: 39, nome: "Curso técnico - concomitante", agregada: 308 },
  { codigo: 40, nome: "Curso técnico - subsequente", agregada: 308 },
  { codigo: 64, nome: "Curso técnico misto", agregada: 308 },
  { codigo: 68, nome: "Qualificação profissional (Curso FIC) - concomitante", agregada: 308 },
  { codigo: 75, nome: "Qualificação profissional (Curso FIC) - não vinculada", agregada: 308 },
];

// NOTA (verificação 2026-09-15): as colunas auxiliares "Filtro" da planilha citam
// códigos 30–34 ("Curso técnico integrado ... 1ª–4ª Série + não seriada") e linhas
// "Escolarização" (39, 40, 64 + FIC 68). Esses códigos NÃO constam na tabela principal
// de Etapas (colunas Código/Nome) e as etapas 39/40/64/68 já estão cobertas via
// Curricular/308 na matriz Tipo x Etapa — por isso ficam FORA deste catálogo.

// -----------------------------------------------------------------------------
// Etapas Agregadas (nível macro) — 7 códigos
// -----------------------------------------------------------------------------

export const ETAPAS_AGREGADAS: EtapaAgregada[] = [
  { codigo: 301, nome: "Educação Infantil" },
  { codigo: 302, nome: "Ensino Fundamental" },
  { codigo: 303, nome: "Multi e correção de fluxo" },
  { codigo: 304, nome: "Ensino Médio" },
  { codigo: 305, nome: "Ensino Médio - Normal/Magistério" },
  { codigo: 306, nome: "Educação de Jovens e Adultos (EJA)" },  { codigo: 308, nome: "Curso Técnico e Qualificação Profissional" },
];
