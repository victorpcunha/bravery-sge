-- ============================================
-- BRAVERY SGE - Políticas RLS para Desenvolvimento
-- ATENÇÃO: Remover ou ajustar para produção!
-- ============================================

-- ============================================
-- Tabela: academico_anos_letivos
-- ============================================

-- Habilitar RLS
ALTER TABLE academico_anos_letivos ENABLE ROW LEVEL SECURITY;

-- Política: Permitir todas as operações para desenvolvimento
-- Em produção, isso deve ser substituído por políticas baseadas em auth.uid()
CREATE POLICY "Permitir tudo para desenvolvimento - anos letivos"
ON academico_anos_letivos
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_calendarios
-- ============================================

ALTER TABLE academico_calendarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - calendários"
ON academico_calendarios
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_calendario_eventos
-- ============================================

ALTER TABLE academico_calendario_eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - eventos"
ON academico_calendario_eventos
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
WHERE tablename IN ('academico_anos_letivos', 'academico_calendarios', 'academico_calendario_eventos');