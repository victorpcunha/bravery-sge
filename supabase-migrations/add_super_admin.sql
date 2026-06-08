-- ============================================
-- FASE A — Super Admin: adiciona is_super_admin
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN people.is_super_admin IS 'Usuário com acesso global a todas as escolas. Consultar por email sem filtrar school_id.';
