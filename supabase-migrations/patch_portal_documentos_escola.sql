-- ============================================
-- BRAVERY SGE - Portal do Responsável: documentos disponíveis por escola
-- (spec 041) Tabela dedicada, fora do payload do Censo
-- (Registro 00 lê colunas explícitas de schools).
-- Ausência de linha = liberado (opt-out): escolas existentes mantêm
-- tudo visível sem backfill e documentos futuros nascem liberados.
-- ============================================

CREATE TABLE IF NOT EXISTS escola_portal_documentos (
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  documento_id TEXT NOT NULL,
  liberado BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (school_id, documento_id)
);

CREATE INDEX IF NOT EXISTS idx_escola_portal_documentos_school
  ON escola_portal_documentos(school_id);

COMMENT ON TABLE escola_portal_documentos IS 'Portal do Responsável: documentos liberados por escola (spec 041). Ausência de linha = liberado.';
COMMENT ON COLUMN escola_portal_documentos.school_id IS 'Escola dona da configuração';
COMMENT ON COLUMN escola_portal_documentos.documento_id IS 'Id do catálogo DOCUMENTOS_PORTAL (src/lib/portal-documentos.ts)';
COMMENT ON COLUMN escola_portal_documentos.liberado IS 'FALSE = oculto e bloqueado no portal';
