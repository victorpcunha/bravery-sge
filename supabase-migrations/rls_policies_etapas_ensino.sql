-- ============================================
-- BRAVERY SGE - Políticas RLS para Etapas de Ensino
-- ATENÇÃO: Remover ou ajustar para produção!
-- ============================================

-- ============================================
-- Tabela: academico_etapas_ensino
-- ============================================

ALTER TABLE academico_etapas_ensino ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - etapas de ensino"
ON academico_etapas_ensino
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_subetapas
-- ============================================

ALTER TABLE academico_subetapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - subetapas"
ON academico_subetapas
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
WHERE tablename IN ('academico_etapas_ensino', 'academico_subetapas');
