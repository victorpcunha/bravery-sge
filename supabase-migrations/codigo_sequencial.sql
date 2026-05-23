-- ============================================
-- Migration: Código sequencial por escola
-- ============================================

-- Renomear coluna VARCHAR antiga
ALTER TABLE people RENAME COLUMN codigo_pessoa TO codigo_pessoa_old;

-- Adicionar nova coluna INTEGER
ALTER TABLE people ADD COLUMN codigo_pessoa INTEGER;

-- Backfill: números sequenciais por escola
WITH numbered AS (
  SELECT id,
    ROW_NUMBER() OVER (PARTITION BY school_id ORDER BY created_at, id) AS seq
  FROM people
)
UPDATE people p
SET codigo_pessoa = n.seq
FROM numbered n
WHERE p.id = n.id;

-- Not null após backfill
ALTER TABLE people ALTER COLUMN codigo_pessoa SET NOT NULL;

-- Re criar índice único (school_id, codigo_pessoa)
DROP INDEX IF EXISTS idx_people_codigo;
CREATE UNIQUE INDEX idx_people_codigo ON people(school_id, codigo_pessoa);

-- Dropar coluna velha
ALTER TABLE people DROP COLUMN codigo_pessoa_old;
