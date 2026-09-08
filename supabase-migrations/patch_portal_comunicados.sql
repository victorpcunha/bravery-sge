-- ============================================
-- BRAVERY SGE - Portal do Responsável: Comunicados
-- Avisos da escola + controle de leitura (spec 023)
-- Emissão/postagem interna em spec futura (Q2)
-- ============================================

CREATE TABLE IF NOT EXISTS comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  data_comunicado DATE NOT NULL DEFAULT CURRENT_DATE,
  escopo JSONB NOT NULL DEFAULT '{"tipo":"geral"}',
  created_by UUID REFERENCES people(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS comunicados_leituras (
  comunicado_id UUID NOT NULL REFERENCES comunicados(id) ON DELETE CASCADE,
  responsavel_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  lido_em TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(comunicado_id, responsavel_id)
);

CREATE INDEX IF NOT EXISTS idx_comunicados_school ON comunicados(school_id);
CREATE INDEX IF NOT EXISTS idx_comunicados_data ON comunicados(data_comunicado DESC);
CREATE INDEX IF NOT EXISTS idx_comunicados_leituras_resp ON comunicados_leituras(responsavel_id);

COMMENT ON TABLE comunicados IS 'Avisos da escola lidos no Portal do Responsável. escopo: {"tipo":"geral"} ou {"tipo":"turmas","turma_ids":[...]}';
COMMENT ON TABLE comunicados_leituras IS 'Controle lido/não lido por responsável (ausência de linha = não lido)';
COMMENT ON COLUMN comunicados.escopo IS 'Visibilidade: geral (toda a escola) ou turmas (lista de turma_ids)';
