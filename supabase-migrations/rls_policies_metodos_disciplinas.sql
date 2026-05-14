-- ============================================
-- BRAVERY SGE - Políticas RLS para Métodos e Disciplinas
-- ATENÇÃO: Remover ou ajustar para produção!
-- ============================================

-- ============================================
-- Tabela: academico_metodos_avaliacao
-- ============================================
ALTER TABLE academico_metodos_avaliacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - métodos de avaliação"
ON academico_metodos_avaliacao
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_disciplinas
-- ============================================
ALTER TABLE academico_disciplinas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - disciplinas"
ON academico_disciplinas
FOR ALL
USING (true)
WITH CHECK (true);