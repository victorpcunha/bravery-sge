-- ============================================
-- BRAVERY SGE - Buscar pessoas matriculadas
-- ============================================
-- Cria uma função RPC para buscar alunos com
-- matrícula ativa no ano letivo vigente da escola.
-- ============================================

CREATE OR REPLACE FUNCTION buscar_pessoas_matriculadas(
  p_termo TEXT,
  p_cpf_digits TEXT DEFAULT NULL,
  p_school_id UUID DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  nome_completo VARCHAR,
  cpf VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT p.id, p.nome_completo, p.cpf
  FROM people p
  WHERE (p_school_id IS NULL OR p.school_id = p_school_id)
    AND (
      p.nome_completo ILIKE '%' || p_termo || '%'
      OR (p_cpf_digits IS NOT NULL AND p.cpf ILIKE '%' || p_cpf_digits || '%')
    )
      AND EXISTS (
      SELECT 1
      FROM academico_matriculas m
      JOIN academico_anos_letivos an ON an.id = m.ano_letivo_id
      WHERE m.aluno_id = p.id
        AND (p_school_id IS NULL OR m.school_id = p_school_id)
        AND m.ativo = true
        AND an.status = 'ativo'
    )
  ORDER BY p.nome_completo
  LIMIT 30;
END;
$$;
