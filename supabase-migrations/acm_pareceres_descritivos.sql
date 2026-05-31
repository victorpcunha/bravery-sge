-- ============================================
-- BRAVERY SGE - Pareceres Descritivos
-- ============================================

CREATE TABLE IF NOT EXISTS academico_pareceres_descritivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  periodo INT NOT NULL,
  texto_parecer TEXT,
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(aluno_id, periodo)
);

CREATE INDEX IF NOT EXISTS idx_pareceres_aluno ON academico_pareceres_descritivos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_pareceres_turma ON academico_pareceres_descritivos(school_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'academico_pareceres_descritivos_updated_at'
  ) THEN
    CREATE TRIGGER academico_pareceres_descritivos_updated_at
      BEFORE UPDATE ON academico_pareceres_descritivos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

COMMENT ON TABLE academico_pareceres_descritivos IS 'Parecer descritivo por aluno e período';
COMMENT ON COLUMN academico_pareceres_descritivos.periodo IS 'Número do período avaliativo (1, 2, 3...)';
COMMENT ON COLUMN academico_pareceres_descritivos.texto_parecer IS 'Conteúdo textual do parecer descritivo';
