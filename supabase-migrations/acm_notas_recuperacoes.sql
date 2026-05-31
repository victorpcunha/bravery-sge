-- ============================================
-- BRAVERY SGE - Notas e Recuperações
-- ============================================

CREATE TABLE IF NOT EXISTS academico_notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  disciplina_id UUID NOT NULL REFERENCES academico_matriz_disciplinas(id) ON DELETE RESTRICT,
  periodo INT NOT NULL,
  valor DECIMAL(5,2),
  descricao VARCHAR(100),
  data_aplicacao DATE,
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notas_aluno ON academico_notas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_notas_turma ON academico_notas(turma_id);
CREATE INDEX IF NOT EXISTS idx_notas_disciplina ON academico_notas(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_notas_periodo ON academico_notas(periodo);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'academico_notas_updated_at'
  ) THEN
    CREATE TRIGGER academico_notas_updated_at
      BEFORE UPDATE ON academico_notas
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

COMMENT ON TABLE academico_notas IS 'Notas individuais de avaliações por aluno, disciplina e período';

CREATE TABLE IF NOT EXISTS academico_recuperacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  disciplina_id UUID NOT NULL REFERENCES academico_matriz_disciplinas(id) ON DELETE RESTRICT,
  periodo INT,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('avaliacao', 'periodo', 'final')),
  valor DECIMAL(5,2),
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recuperacoes_aluno ON academico_recuperacoes(aluno_id);
CREATE INDEX IF NOT EXISTS idx_recuperacoes_turma ON academico_recuperacoes(turma_id);
CREATE INDEX IF NOT EXISTS idx_recuperacoes_disciplina ON academico_recuperacoes(disciplina_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'academico_recuperacoes_updated_at'
  ) THEN
    CREATE TRIGGER academico_recuperacoes_updated_at
      BEFORE UPDATE ON academico_recuperacoes
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

COMMENT ON TABLE academico_recuperacoes IS 'Recuperação de notas por aluno, disciplina e tipo';
COMMENT ON COLUMN academico_recuperacoes.tipo IS 'avaliacao, periodo ou final';
COMMENT ON COLUMN academico_recuperacoes.periodo IS 'Período sendo recuperado (null para recuperação final)';
