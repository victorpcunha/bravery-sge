-- ============================================
-- BRAVERY SGE - Políticas RLS para Matrizes Curriculares
-- ATENÇÃO: Remover ou ajustar para produção!
-- ============================================

-- ============================================
-- Tabela: academico_matrizes_curriculares
-- ============================================
ALTER TABLE academico_matrizes_curriculares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - matrizes curriculares"
ON academico_matrizes_curriculares
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_matriz_periodos
-- ============================================
ALTER TABLE academico_matriz_periodos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - matriz períodos"
ON academico_matriz_periodos
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_matriz_disciplinas
-- ============================================
ALTER TABLE academico_matriz_disciplinas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - matriz disciplinas"
ON academico_matriz_disciplinas
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_matriz_habilidades_bncc
-- ============================================
ALTER TABLE academico_matriz_habilidades_bncc ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - habilidades bncc"
ON academico_matriz_habilidades_bncc
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_matriz_habilidades_manuais
-- ============================================
ALTER TABLE academico_matriz_habilidades_manuais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - habilidades manuais"
ON academico_matriz_habilidades_manuais
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Confirmar criação das políticas
-- ============================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN (
  'academico_matrizes_curriculares',
  'academico_matriz_periodos',
  'academico_matriz_disciplinas',
  'academico_matriz_habilidades_bncc',
  'academico_matriz_habilidades_manuais'
);