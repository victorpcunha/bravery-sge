-- ============================================
-- BRAVERY SGE - Perfis Permissões
-- Tabela de permissões por perfil e recurso
-- ============================================

CREATE TABLE IF NOT EXISTS perfis_permissoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  perfil_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  recurso_id UUID NOT NULL REFERENCES recursos(id) ON DELETE RESTRICT,
  visualizar BOOLEAN DEFAULT false NOT NULL,
  criar BOOLEAN DEFAULT false NOT NULL,
  editar BOOLEAN DEFAULT false NOT NULL,
  excluir BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES people(id),
  updated_by UUID REFERENCES people(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(perfil_id, recurso_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_perfis_permissoes_perfil ON perfis_permissoes(perfil_id);
CREATE INDEX IF NOT EXISTS idx_perfis_permissoes_recurso ON perfis_permissoes(recurso_id);
CREATE INDEX IF NOT EXISTS idx_perfis_permissoes_school ON perfis_permissoes(school_id);

-- Trigger updated_at
CREATE TRIGGER update_perfis_permissoes_updated_at
  BEFORE UPDATE ON perfis_permissoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE perfis_permissoes IS 'Permissões por perfil e recurso';
