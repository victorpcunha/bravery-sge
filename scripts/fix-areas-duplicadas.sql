�-- Remover duplicatas mantendo apenas uma ocorr�ncia de cada �rea
DELETE FROM bncc_competencias WHERE id IN (
  SELECT c.id FROM bncc_competencias c
  JOIN bncc_areas_conhecimento a ON a.id = c.area_id
  WHERE a.id IN (
    SELECT id FROM (
      SELECT id, nome, tipo_ensino,
        ROW_NUMBER() OVER (PARTITION BY nome, tipo_ensino ORDER BY created_at) AS rn
      FROM bncc_areas_conhecimento
    ) sub WHERE rn > 1
  )
);

DELETE FROM bncc_areas_conhecimento WHERE id IN (
  SELECT id FROM (
    SELECT id, nome, tipo_ensino,
      ROW_NUMBER() OVER (PARTITION BY nome, tipo_ensino ORDER BY created_at) AS rn
    FROM bncc_areas_conhecimento
  ) sub WHERE rn > 1
);

-- Adicionar constraint UNIQUE para evitar futuras duplicatas
ALTER TABLE bncc_areas_conhecimento ADD CONSTRAINT bncc_areas_unique UNIQUE (nome, tipo_ensino);
