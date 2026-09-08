-- ============================================
-- BRAVERY SGE - Portal por Escola: identidade do login
-- (spec 024) Uso interno; não exportado no Censo. Auditoria com
-- máscara base64 (semLogo em documentos-config.ts).
-- ============================================

ALTER TABLE documentos_config ADD COLUMN IF NOT EXISTS portal_imagem_fundo TEXT;
ALTER TABLE documentos_config ADD COLUMN IF NOT EXISTS portal_texto_login TEXT;

COMMENT ON COLUMN documentos_config.portal_imagem_fundo IS 'Imagem de fundo do login do portal (base64 data:image/*, teto 2 MB — FR-008)';
COMMENT ON COLUMN documentos_config.portal_texto_login IS 'Texto informativo da escola no login do portal (FR-008)';
