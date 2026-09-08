-- ============================================
-- BRAVERY SGE - Portal por Escola: habilitação + slug
-- (spec 024) Fora do payload do Censo (Registro 00 lê colunas explícitas).
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS portal_habilitado BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS portal_slug VARCHAR(60);

CREATE UNIQUE INDEX IF NOT EXISTS idx_schools_portal_slug ON schools(portal_slug);

COMMENT ON COLUMN schools.portal_habilitado IS 'Portal do Responsável habilitado para a escola (FR-001)';
COMMENT ON COLUMN schools.portal_slug IS 'Slug do link do portal: /portal/[slug] — único, minúsculas, sem acentos (FR-002)';
