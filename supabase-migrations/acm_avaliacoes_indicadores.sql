-- ============================================
-- BRAVERY SGE - Avaliações por Indicadores
-- ============================================

CREATE TABLE IF NOT EXISTS academico_avaliacoes_indicadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  indicador_id UUID NOT NULL REFERENCES indicadores_avaliacao(id) ON DELETE RESTRICT,
  periodo INT NOT NULL,
  nivel_id UUID REFERENCES indicadores_niveis(id) ON DELETE SET NULL,
  observacao TEXT,
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(aluno_id, indicador_id, periodo)
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_indicadores_aluno ON academico_avaliacoes_indicadores(aluno_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_indicadores_indicador ON academico_avaliacoes_indicadores(indicador_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_indicadores_turma ON academico_avaliacoes_indicadores(turma_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'academico_avaliacoes_indicadores_updated_at'
  ) THEN
    CREATE TRIGGER academico_avaliacoes_indicadores_updated_at
      BEFORE UPDATE ON academico_avaliacoes_indicadores
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

COMMENT ON TABLE academico_avaliacoes_indicadores IS 'Registro da avaliação de alunos por indicador e período';
COMMENT ON COLUMN academico_avaliacoes_indicadores.periodo IS 'Número do período avaliativo (1, 2, 3...)';
COMMENT ON COLUMN academico_avaliacoes_indicadores.nivel_id IS 'Nível de desenvolvimento selecionado para o indicador';
