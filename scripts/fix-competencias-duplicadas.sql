�-- 1. Remover duplicatas de compet�ncias mantendo apenas uma por (area_id, codigo)
DELETE FROM bncc_competencias WHERE id IN (
  SELECT id FROM (
    SELECT id, area_id, codigo,
      ROW_NUMBER() OVER (PARTITION BY area_id, codigo ORDER BY created_at) AS rn
    FROM bncc_competencias
  ) sub WHERE rn > 1
);

-- 2. Adicionar UNIQUE constraint para evitar futuras duplicatas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bncc_competencias_unique') THEN
    ALTER TABLE bncc_competencias ADD CONSTRAINT bncc_competencias_unique UNIQUE (area_id, codigo);
  END IF;
END $$;
