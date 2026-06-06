-- ============================================
-- BRAVERY SGE - Saúde do Estudante
-- Informações médicas relevantes para o
-- ambiente escolar
-- ============================================

CREATE TABLE IF NOT EXISTS saude_estudantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  medicamentos TEXT,
  condicoes TEXT,
  created_by UUID REFERENCES people(id),
  updated_by UUID REFERENCES people(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_saude_estudantes_person ON saude_estudantes(person_id);
CREATE INDEX IF NOT EXISTS idx_saude_estudantes_school ON saude_estudantes(school_id);

COMMENT ON TABLE saude_estudantes IS 'Informações de saúde dos estudantes (medicamentos, condições)';
