-- ============================================
-- BRAVERY SGE - Quadro de Aulas
-- Grade horária das turmas com distribuição
-- de disciplinas e professores por dia/horário
-- ============================================

CREATE TABLE IF NOT EXISTS quadro_aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  ano_letivo_id UUID NOT NULL REFERENCES academico_anos_letivos(id) ON DELETE RESTRICT,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  data_inicial DATE NOT NULL,
  data_final DATE NOT NULL,
  tempo_aula_minutos INTEGER NOT NULL DEFAULT 50,
  intervalos JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'futuro'
    CHECK (status IN ('ativo', 'inativo', 'futuro', 'encerrado')),
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS quadro_aulas_horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadro_aula_id UUID NOT NULL REFERENCES quadro_aulas(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  horario_inicial TIME NOT NULL,
  horario_final TIME NOT NULL,
  disciplina_id UUID REFERENCES academico_matriz_disciplinas(id) ON DELETE RESTRICT,
  professor_id UUID REFERENCES people(id) ON DELETE SET NULL,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_quadro_aulas_school ON quadro_aulas(school_id);
CREATE INDEX IF NOT EXISTS idx_quadro_aulas_turma ON quadro_aulas(turma_id);
CREATE INDEX IF NOT EXISTS idx_quadro_aulas_ano ON quadro_aulas(ano_letivo_id);
CREATE INDEX IF NOT EXISTS idx_quadro_aulas_status ON quadro_aulas(status);
CREATE INDEX IF NOT EXISTS idx_quadro_aulas_horarios_quadro ON quadro_aulas_horarios(quadro_aula_id);
CREATE INDEX IF NOT EXISTS idx_quadro_aulas_horarios_professor ON quadro_aulas_horarios(professor_id);
CREATE INDEX IF NOT EXISTS idx_quadro_aulas_horarios_dia ON quadro_aulas_horarios(dia_semana);
CREATE INDEX IF NOT EXISTS idx_quadro_aulas_horarios_conflito ON quadro_aulas_horarios(professor_id, dia_semana, horario_inicial, horario_final);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_quadro_aulas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quadro_aulas_updated_at
BEFORE UPDATE ON quadro_aulas
FOR EACH ROW
EXECUTE FUNCTION update_quadro_aulas_updated_at();

CREATE TRIGGER update_quadro_aulas_horarios_updated_at
BEFORE UPDATE ON quadro_aulas_horarios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE quadro_aulas IS 'Quadros de aulas - grade horária das turmas';
COMMENT ON TABLE quadro_aulas_horarios IS 'Horários individuais do quadro de aulas com disciplina/professor';
