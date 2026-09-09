-- ============================================
-- BRAVERY SGE - Portal do Responsável: leitura de ocorrências
-- Controle lido/não lido por responsável (ausência = não lido).
-- ============================================

CREATE TABLE IF NOT EXISTS ocorrencias_leituras (
  ocorrencia_id UUID NOT NULL REFERENCES ocorrencias(id) ON DELETE CASCADE,
  responsavel_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  lido_em TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(ocorrencia_id, responsavel_id)
);

CREATE INDEX IF NOT EXISTS idx_ocorrencias_leituras_resp ON ocorrencias_leituras(responsavel_id);

COMMENT ON TABLE ocorrencias_leituras IS 'Controle lido/não lido de ocorrências por responsável no Portal (ausência de linha = não lido)';
