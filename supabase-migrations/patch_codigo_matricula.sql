-- ============================================
-- BRAVERY SGE - Código sequencial de matrícula (spec 034)
-- Código legível por escola, gerado pelo app (max+1),
-- espelhando o padrão codigo_pessoa (codigo_sequencial.sql)
-- Aplicar via SQL Editor
-- ============================================

ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS codigo_matricula INTEGER;

-- Backfill: sequencial por escola para registros legados
WITH numeradas AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY school_id ORDER BY data_matricula, created_at
  ) AS seq
  FROM academico_matriculas
  WHERE codigo_matricula IS NULL
)
UPDATE academico_matriculas m
SET codigo_matricula = n.seq
FROM numeradas n WHERE n.id = m.id;

ALTER TABLE academico_matriculas ALTER COLUMN codigo_matricula SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_matriculas_codigo
  ON academico_matriculas(school_id, codigo_matricula);

COMMENT ON COLUMN academico_matriculas.codigo_matricula IS 'Código sequencial de matrícula por escola (gerado pelo app: max+1). Exibido como ID na listagem.';
