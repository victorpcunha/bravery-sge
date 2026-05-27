-- ============================================
-- BRAVERY SGE - Adiciona perfil_id à people
-- Permite vincular perfil de acesso à pessoa
-- ============================================

ALTER TABLE people
  ADD COLUMN IF NOT EXISTS perfil_id UUID REFERENCES perfis(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_people_perfil ON people(perfil_id) WHERE perfil_id IS NOT NULL;

COMMENT ON COLUMN people.perfil_id IS 'Perfil de acesso do usuário (Perfis e Permissões)';
