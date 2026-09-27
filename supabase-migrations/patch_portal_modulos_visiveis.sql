-- ============================================
-- BRAVERY SGE - Portal do Responsável: visibilidade dos módulos por escola
-- (spec 040) Fora do payload do Censo (Registro 00 lê colunas explícitas).
-- DEFAULT TRUE = comportamento atual preservado para escolas existentes.
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS portal_vis_boletim BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS portal_vis_frequencia BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS portal_vis_horarios BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS portal_vis_ocorrencias BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS portal_vis_comunicados BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS portal_vis_documentos BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN schools.portal_vis_boletim IS 'Portal do Responsável: módulo Boletim visível (spec 040)';
COMMENT ON COLUMN schools.portal_vis_frequencia IS 'Portal do Responsável: módulo Frequência visível (spec 040)';
COMMENT ON COLUMN schools.portal_vis_horarios IS 'Portal do Responsável: módulo Horários visível (spec 040)';
COMMENT ON COLUMN schools.portal_vis_ocorrencias IS 'Portal do Responsável: módulo Ocorrências visível (spec 040)';
COMMENT ON COLUMN schools.portal_vis_comunicados IS 'Portal do Responsável: módulo Comunicados visível (spec 040)';
COMMENT ON COLUMN schools.portal_vis_documentos IS 'Portal do Responsável: módulo Documentos visível (spec 040)';
