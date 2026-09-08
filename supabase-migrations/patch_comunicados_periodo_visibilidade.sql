-- ============================================
-- BRAVERY SGE - Comunicados do Portal: período de visibilidade + ano letivo
-- Estende a tabela da spec 023 para a gestão interna (spec 025)
-- Aplicar via SQL Editor
-- ============================================

ALTER TABLE comunicados
  ADD COLUMN IF NOT EXISTS ano_letivo_id UUID REFERENCES academico_anos_letivos(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS visivel_de TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS visivel_ate TIMESTAMPTZ;

-- Backfill: linhas legadas (carga manual pré-025) continuam visíveis —
-- início = data do comunicado, sem fim (NULL = ilimitado, ver R2).
UPDATE comunicados
SET visivel_de = COALESCE(visivel_de, data_comunicado::TIMESTAMPTZ)
WHERE visivel_de IS NULL;

CREATE INDEX IF NOT EXISTS idx_comunicados_ano ON comunicados(ano_letivo_id);
CREATE INDEX IF NOT EXISTS idx_comunicados_visibilidade ON comunicados(school_id, visivel_de, visivel_ate);

COMMENT ON COLUMN comunicados.ano_letivo_id IS 'Ano letivo do comunicado (NULL apenas em linhas legadas)';
COMMENT ON COLUMN comunicados.visivel_de IS 'Início da visibilidade no Portal do Responsável (NULL = sem início)';
COMMENT ON COLUMN comunicados.visivel_ate IS 'Fim da visibilidade no Portal do Responsável (NULL = sem fim)';
COMMENT ON COLUMN comunicados.escopo IS 'Visibilidade: {"tipo":"geral"} (legado) ou {"tipo":"turmas","etapa_ids":[...],"turma_ids":[...]} (snapshot do cadastro, spec 025)';
