-- ============================================
-- BRAVERY SGE - Diário de Classe: Planos Aplicados
-- Tabela de ligação entre plano_aula e dia de aula
-- no diário de classe. Não duplica dados do plano,
-- apenas referencia o plano_aula original.
-- ============================================

CREATE TABLE IF NOT EXISTS academico_diario_planos_aplicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  matriz_disciplina_id UUID NOT NULL REFERENCES academico_matriz_disciplinas(id) ON DELETE CASCADE,
  data_aula DATE NOT NULL,
  horario_id UUID REFERENCES quadro_aulas_horarios(id) ON DELETE SET NULL,
  plano_aula_id UUID NOT NULL REFERENCES planos_aula(id) ON DELETE CASCADE,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (plano_aula_id, data_aula, horario_id)
);

CREATE INDEX IF NOT EXISTS idx_diario_planos_aplicados_turma_data
  ON academico_diario_planos_aplicados(turma_id, matriz_disciplina_id, data_aula);

COMMENT ON TABLE academico_diario_planos_aplicados IS
  'Liga um plano_aula a um dia/horário específico no diário de classe. Remover esta ligação não afeta o plano original.';
