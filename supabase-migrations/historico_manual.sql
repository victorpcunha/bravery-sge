-- ============================================
-- BRAVERY SGE - Histórico Escolar Manual
-- Registro manual de histórico escolar para
-- estudantes (anos anteriores, transferências)
-- ============================================

CREATE TABLE IF NOT EXISTS historico_manual (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  ano_letivo_id UUID NOT NULL REFERENCES academico_anos_letivos(id) ON DELETE RESTRICT,
  carga_horaria INTEGER,
  dias_letivos INTEGER,
  media_aprovacao NUMERIC(5,2),
  municipio VARCHAR(255),
  unidade_escolar VARCHAR(255),
  etapa_ensino_id UUID REFERENCES academico_etapas_ensino(id) ON DELETE RESTRICT,
  situacao VARCHAR(30),
  observacoes TEXT,
  created_by UUID REFERENCES people(id),
  updated_by UUID REFERENCES people(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_historico_manual_person ON historico_manual(person_id);
CREATE INDEX IF NOT EXISTS idx_historico_manual_school ON historico_manual(school_id);
CREATE INDEX IF NOT EXISTS idx_historico_manual_ano ON historico_manual(ano_letivo_id);

COMMENT ON TABLE historico_manual IS 'Registros manuais de histórico escolar de estudantes';
