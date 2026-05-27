-- ============================================
-- BRAVERY SGE - Auditoria de Perfis e Permissões
-- Registra alterações em perfis e permissões
-- ============================================

CREATE TABLE IF NOT EXISTS perfis_auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  entidade VARCHAR(50) NOT NULL,
  entidade_id UUID NOT NULL,
  acao VARCHAR(20) NOT NULL CHECK (acao IN ('criar', 'editar', 'excluir')),
  dados_anteriores JSONB,
  dados_novos JSONB,
  pessoa_id UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_perfis_auditoria_entidade ON perfis_auditoria(entidade, entidade_id);
CREATE INDEX IF NOT EXISTS idx_perfis_auditoria_school ON perfis_auditoria(school_id);
CREATE INDEX IF NOT EXISTS idx_perfis_auditoria_created ON perfis_auditoria(created_at DESC);

COMMENT ON TABLE perfis_auditoria IS 'Registro de auditoria de alterações em perfis e permissões';
