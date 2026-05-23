-- ============================================
-- Migration: Políticas RLS para people
-- WITH CHECK isolado por escola (mesmo critério do USING)
-- ============================================

-- Dropar policy existente
DROP POLICY IF EXISTS "people_school_isolation" ON people;
DROP POLICY IF EXISTS "people_select" ON people;
DROP POLICY IF EXISTS "people_insert" ON people;
DROP POLICY IF EXISTS "people_modify" ON people;
DROP POLICY IF EXISTS "people_delete" ON people;

-- Criar policy única cobrindo todas as operações
CREATE POLICY "people_school_isolation" ON people
USING (school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid()))
WITH CHECK (school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid()));
