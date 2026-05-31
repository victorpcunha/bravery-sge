-- ============================================
-- PATCH: Corrigir estrutura academico_frequencias_aula
-- ============================================
-- Motivo: aula_id estava referenciando quadro_aulas(id)
-- (cabeçalho) ao invés de quadro_aulas_horarios(id)
-- e faltava coluna data_aula.
-- ============================================

DROP TABLE IF EXISTS academico_frequencias_aula;

CREATE TABLE IF NOT EXISTS academico_frequencias_aula (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  horario_id UUID NOT NULL REFERENCES quadro_aulas_horarios(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  disciplina_id UUID NOT NULL REFERENCES academico_matriz_disciplinas(id) ON DELETE RESTRICT,
  data_aula DATE NOT NULL,
  status VARCHAR(2) CHECK (status IN ('P', 'F', 'FJ')),
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(horario_id, aluno_id, data_aula)
);

CREATE INDEX IF NOT EXISTS idx_freq_aula_turma ON academico_frequencias_aula(turma_id);
CREATE INDEX IF NOT EXISTS idx_freq_aula_aluno ON academico_frequencias_aula(aluno_id);
CREATE INDEX IF NOT EXISTS idx_freq_aula_horario ON academico_frequencias_aula(horario_id);
CREATE INDEX IF NOT EXISTS idx_freq_aula_data ON academico_frequencias_aula(data_aula);

CREATE TRIGGER academico_frequencias_aula_updated_at
BEFORE UPDATE ON academico_frequencias_aula
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE academico_frequencias_aula IS 'Registro de frequência por aula do quadro de horários';
COMMENT ON COLUMN academico_frequencias_aula.status IS 'P=Presente, F=Falta, FJ=Falta Justificada';
