// INEP Censo Escolar 2026 — Anexo 3: Idades Permitidas por Etapa
// Fonte: Portaria Inep nº 291/2025 e atualizações da Nota Técnica Censo Escolar 2026

export interface IdadeLimite {
  min: number;
  max: number;
}

export interface IdadeProfissionais {
  gestor: IdadeLimite;
  profissional: IdadeLimite;
}

export interface IdadeAluno {
  etapa_codigo: number;
  etapa_nome: string;
  idade_min: number;
  idade_max: number;
}

export interface IdadeCaracteristica {
  caracteristica: string;
  idade_min: number;
  idade_max: number;
}

export interface IdadesPermitidas {
  profissionais: IdadeProfissionais;
  alunos: IdadeAluno[];
  caracteristicas: IdadeCaracteristica[];
}

export const IDADES_PERMITIDAS: IdadesPermitidas = {
  profissionais: {
    gestor: { min: 18, max: 95 },
    profissional: { min: 14, max: 95 },
  },

  alunos: [
    { etapa_codigo: 1, etapa_nome: "Creche (0 a 3 anos)", idade_min: 0, idade_max: 6 },
    { etapa_codigo: 2, etapa_nome: "Pré-escola", idade_min: 3, idade_max: 9 },
    { etapa_codigo: 3, etapa_nome: "Educação Infantil Unificada", idade_min: 0, idade_max: 9 },
    { etapa_codigo: 14, etapa_nome: "1º Ano Ensino Fundamental", idade_min: 4, idade_max: 50 },
    { etapa_codigo: 15, etapa_nome: "2º Ano Ensino Fundamental", idade_min: 5, idade_max: 50 },
    { etapa_codigo: 16, etapa_nome: "3º Ano Ensino Fundamental", idade_min: 5, idade_max: 50 },
    { etapa_codigo: 17, etapa_nome: "4º Ano Ensino Fundamental", idade_min: 6, idade_max: 50 },
    { etapa_codigo: 18, etapa_nome: "5º Ano Ensino Fundamental", idade_min: 7, idade_max: 50 },
    { etapa_codigo: 19, etapa_nome: "6º Ano Ensino Fundamental", idade_min: 8, idade_max: 50 },
    { etapa_codigo: 20, etapa_nome: "7º Ano Ensino Fundamental", idade_min: 9, idade_max: 50 },
    { etapa_codigo: 21, etapa_nome: "8º Ano Ensino Fundamental", idade_min: 10, idade_max: 50 },
    { etapa_codigo: 41, etapa_nome: "9º Ano Ensino Fundamental", idade_min: 12, idade_max: 50 },
    { etapa_codigo: 22, etapa_nome: "Multi", idade_min: 6, idade_max: 50 },
    { etapa_codigo: 23, etapa_nome: "Correção de Fluxo", idade_min: 6, idade_max: 50 },
    { etapa_codigo: 56, etapa_nome: "Multietapa", idade_min: 4, idade_max: 50 },
    { etapa_codigo: 25, etapa_nome: "1ª Série Ensino Médio", idade_min: 12, idade_max: 58 },
    { etapa_codigo: 26, etapa_nome: "2ª Série Ensino Médio", idade_min: 12, idade_max: 58 },
    { etapa_codigo: 27, etapa_nome: "3ª Série Ensino Médio", idade_min: 12, idade_max: 58 },
    { etapa_codigo: 28, etapa_nome: "4ª Série Ensino Médio", idade_min: 12, idade_max: 58 },
    { etapa_codigo: 29, etapa_nome: "Ensino Médio Não Seriado", idade_min: 12, idade_max: 58 },
    { etapa_codigo: 35, etapa_nome: "Normal/Magistério 1ª Série", idade_min: 12, idade_max: 58 },
    { etapa_codigo: 36, etapa_nome: "Normal/Magistério 2ª Série", idade_min: 12, idade_max: 58 },
    { etapa_codigo: 37, etapa_nome: "Normal/Magistério 3ª Série", idade_min: 12, idade_max: 58 },
    { etapa_codigo: 38, etapa_nome: "Normal/Magistério 4ª Série", idade_min: 12, idade_max: 58 },
    { etapa_codigo: 69, etapa_nome: "EJA Ensino Fundamental Anos Finais", idade_min: 12, idade_max: 93 },
    { etapa_codigo: 70, etapa_nome: "EJA Ensino Fundamental Anos Iniciais", idade_min: 12, idade_max: 93 },
    { etapa_codigo: 72, etapa_nome: "EJA Ensino Fundamental Multietapa", idade_min: 12, idade_max: 93 },
    { etapa_codigo: 71, etapa_nome: "EJA Ensino Médio", idade_min: 15, idade_max: 93 },
    { etapa_codigo: 74, etapa_nome: "Técnico Integrado EJA", idade_min: 15, idade_max: 94 },
    { etapa_codigo: 67, etapa_nome: "FIC EJA Nível Médio", idade_min: 15, idade_max: 94 },
    { etapa_codigo: 73, etapa_nome: "FIC EJA Nível Fundamental", idade_min: 12, idade_max: 94 },
    { etapa_codigo: 39, etapa_nome: "Técnico Concomitante", idade_min: 13, idade_max: 58 },
    { etapa_codigo: 40, etapa_nome: "Técnico Subsequente", idade_min: 13, idade_max: 75 },
    { etapa_codigo: 64, etapa_nome: "Técnico Integrado Ensino Médio", idade_min: 13, idade_max: 58 },
    { etapa_codigo: 68, etapa_nome: "FIC Concomitante", idade_min: 12, idade_max: 94 },
    { etapa_codigo: 75, etapa_nome: "FIC Não Vinculada", idade_min: 12, idade_max: 94 },
  ],

  caracteristicas: [
    { caracteristica: "Itinerário formativo sem FGB", idade_min: 12, idade_max: 94 },
    { caracteristica: "Unidade socioeducativa", idade_min: 12, idade_max: 94 },
    { caracteristica: "Unidade prisional", idade_min: 18, idade_max: 94 },
  ],
};
