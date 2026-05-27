-- ============================================
-- BRAVERY SGE - Perfis
-- Tabela de perfis de acesso do sistema
-- ============================================

CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_by UUID REFERENCES people(id),
  updated_by UUID REFERENCES people(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Unique index for active profile names within same school
CREATE UNIQUE INDEX IF NOT EXISTS idx_perfis_nome_unique ON perfis(school_id, nome) WHERE ativo = true;

-- Índices
CREATE INDEX IF NOT EXISTS idx_perfis_school ON perfis(school_id);
CREATE INDEX IF NOT EXISTS idx_perfis_ativo ON perfis(ativo);

-- Trigger updated_at
CREATE TRIGGER update_perfis_updated_at
  BEFORE UPDATE ON perfis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE perfis IS 'Perfis de acesso do sistema';
