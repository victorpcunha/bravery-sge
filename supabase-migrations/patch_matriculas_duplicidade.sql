-- ============================================
-- BRAVERY SGE - Bloqueio de matrículas duplicadas
-- Regra: um aluno não pode ter duas matrículas ativas na mesma turma.
-- Aplicar via SQL Editor, APÓS resolver os duplicados existentes.
-- ============================================

-- Diagnóstico: liste os duplicados antes de criar o índice.
-- SELECT aluno_id, turma_id, count(*) AS qtd,
--        array_agg(id ORDER BY created_at) AS matriculas,
--        array_agg(codigo_matricula ORDER BY created_at) AS codigos
-- FROM academico_matriculas
-- WHERE ativo AND situacao = 'Ativo'
-- GROUP BY aluno_id, turma_id
-- HAVING count(*) > 1;

-- Gate: impede criar o índice com a base ainda inconsistente.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM academico_matriculas
    WHERE ativo AND situacao = 'Ativo'
    GROUP BY aluno_id, turma_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Existem matrículas ativas duplicadas (mesmo aluno + turma). Exclua ou inative as duplicatas antes de criar o índice.';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_matriculas_aluno_turma_ativa
  ON academico_matriculas (aluno_id, turma_id)
  WHERE ativo AND situacao = 'Ativo';

COMMENT ON INDEX idx_matriculas_aluno_turma_ativa IS 'Impede duplicidade de matrícula ativa do mesmo aluno na mesma turma.';
