-- ============================================
-- BRAVERY SGE - Adiciona usa_vinculo_turma
-- ============================================
-- Indica se o perfil opera com vínculo em turma
-- (ex: Professor) ou acesso global (ex: Coordenador)

ALTER TABLE perfis
ADD COLUMN IF NOT EXISTS usa_vinculo_turma BOOLEAN DEFAULT false NOT NULL;

COMMENT ON COLUMN perfis.usa_vinculo_turma IS 'Se true, o perfil opera com vínculo em turma (professor). Se false, acesso administrativo global.';
