-- ============================================
-- Migration: Unique constraint CPF por escola
-- ============================================

-- Remover duplicatas: mantém apenas um registro por CPF na mesma escola
DELETE FROM people p
WHERE p.cpf IS NOT NULL
AND p.id != (
  SELECT p2.id
  FROM people p2
  WHERE p2.school_id = p.school_id AND p2.cpf = p.cpf
  ORDER BY p2.created_at, p2.id
  LIMIT 1
);

-- Índice único parcial: permite múltiplos NULL, mas CPF duplicado na mesma escola é proibido
CREATE UNIQUE INDEX IF NOT EXISTS idx_people_cpf_school
ON people(school_id, cpf)
WHERE cpf IS NOT NULL;
