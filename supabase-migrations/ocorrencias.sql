-- ============================================
-- BRAVERY SGE - Ocorrências
-- Registro de ocorrências disciplinares e
-- pedagógicas dos estudantes
-- ============================================

CREATE TABLE IF NOT EXISTS ocorrencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES turmas(id) ON DELETE SET NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('disciplinar', 'pedagogica')),
  descricao TEXT NOT NULL,
  data_ocorrencia DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES people(id),
  updated_by UUID REFERENCES people(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ocorrencias_person ON ocorrencias(person_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_school ON ocorrencias(school_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_turma ON ocorrencias(turma_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_data ON ocorrencias(data_ocorrencia DESC);

COMMENT ON TABLE ocorrencias IS 'Ocorrências disciplinares e pedagógicas registradas para estudantes';
