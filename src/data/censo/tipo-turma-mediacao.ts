// Anexo 7 — Tipo de Turma × Tipo de Mediação Didático-Pedagógica × Etapas Habilitadas (v4 2026)

export interface CompatibilidadeMediaçãoTurmaEtapa {
  tipo_mediacao: string       // '1' = Presencial, '2' = Semipresencial, '3' = EAD
  tipo_turma: string          // '4' = Atividade complementar, '5' = AEE, '6' = Curricular, '9' = Curricular + Complementar
  etapa_agregada: string      // Código da etapa agregada ou '-'
  etapas_ensino: number[]     // Códigos de etapas de ensino habilitadas (vazio = todas da agregada)
  descricao: string
}

export const COMPATIBILIDADE_MEDIACAO_TURMA_ETAPA: CompatibilidadeMediaçãoTurmaEtapa[] = [
  // Presencial — Atividade complementar: qualquer etapa (sem restrição)
  { tipo_mediacao: '1', tipo_turma: '4', etapa_agregada: '-', etapas_ensino: [], descricao: 'Presencial / Atividade complementar / Qualquer' },
  // Presencial — AEE: qualquer etapa (sem restrição)
  { tipo_mediacao: '1', tipo_turma: '5', etapa_agregada: '-', etapas_ensino: [], descricao: 'Presencial / AEE / Qualquer' },
  // Presencial — Curricular
  { tipo_mediacao: '1', tipo_turma: '6', etapa_agregada: '301', etapas_ensino: [1, 2, 3], descricao: 'Presencial / Curricular / Educação Infantil' },
  { tipo_mediacao: '1', tipo_turma: '6', etapa_agregada: '302', etapas_ensino: [14, 15, 16, 17, 18, 19, 20, 21, 41], descricao: 'Presencial / Curricular / Ensino Fundamental 9 anos' },
  { tipo_mediacao: '1', tipo_turma: '6', etapa_agregada: '303', etapas_ensino: [22, 23, 56], descricao: 'Presencial / Curricular / Multi e correção de fluxo' },
  { tipo_mediacao: '1', tipo_turma: '6', etapa_agregada: '304', etapas_ensino: [25, 26, 27, 28, 29], descricao: 'Presencial / Curricular / Ensino Médio' },
  { tipo_mediacao: '1', tipo_turma: '6', etapa_agregada: '305', etapas_ensino: [35, 36, 37, 38], descricao: 'Presencial / Curricular / Normal/Magistério' },
  { tipo_mediacao: '1', tipo_turma: '6', etapa_agregada: '306', etapas_ensino: [69, 70, 72, 71, 74, 73, 67], descricao: 'Presencial / Curricular / EJA' },
  { tipo_mediacao: '1', tipo_turma: '6', etapa_agregada: '308', etapas_ensino: [39, 40, 64, 68, 75], descricao: 'Presencial / Curricular / Técnico e FIC' },
  // Presencial — Curricular + Atividade complementar
  { tipo_mediacao: '1', tipo_turma: '9', etapa_agregada: '302', etapas_ensino: [14, 15, 16, 17, 18, 19, 20, 21, 41], descricao: 'Presencial / Curricular+Complementar / EF 9 anos' },
  { tipo_mediacao: '1', tipo_turma: '9', etapa_agregada: '303', etapas_ensino: [22, 23], descricao: 'Presencial / Curricular+Complementar / Multi e correção' },
  { tipo_mediacao: '1', tipo_turma: '9', etapa_agregada: '304', etapas_ensino: [25, 26, 27, 28, 29], descricao: 'Presencial / Curricular+Complementar / Ensino Médio' },
  { tipo_mediacao: '1', tipo_turma: '9', etapa_agregada: '305', etapas_ensino: [35, 36, 37, 38], descricao: 'Presencial / Curricular+Complementar / Normal/Magistério' },
  // Semipresencial — apenas EJA
  { tipo_mediacao: '2', tipo_turma: '6', etapa_agregada: '306', etapas_ensino: [69, 70, 71, 72], descricao: 'Semipresencial / Curricular / EJA' },
  // EAD — Curricular
  { tipo_mediacao: '3', tipo_turma: '6', etapa_agregada: '304', etapas_ensino: [], descricao: 'EAD / Curricular / Ensino Médio (sem FGB)' },
  { tipo_mediacao: '3', tipo_turma: '6', etapa_agregada: '306', etapas_ensino: [71, 74, 67], descricao: 'EAD / Curricular / EJA' },
  { tipo_mediacao: '3', tipo_turma: '6', etapa_agregada: '308', etapas_ensino: [39, 40, 64, 68, 75], descricao: 'EAD / Curricular / Técnico e FIC' },
]
