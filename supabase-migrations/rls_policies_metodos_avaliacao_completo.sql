-- ============================================
-- BRAVERY SGE - Políticas RLS para Métodos de Avaliação (Completas)
-- ATENÇÃO: Ajustar para produção!
-- ============================================

-- ============================================
-- Tabela: academico_metodos_avaliacao_numerico
-- ============================================
ALTER TABLE academico_metodos_avaliacao_numerico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - config numérica"
ON academico_metodos_avaliacao_numerico
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_metodos_avaliacao_aprovacao
-- ============================================
ALTER TABLE academico_metodos_avaliacao_aprovacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - aprovação"
ON academico_metodos_avaliacao_aprovacao
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_metodos_avaliacao_arredondamento
-- ============================================
ALTER TABLE academico_metodos_avaliacao_arredondamento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - arredondamento"
ON academico_metodos_avaliacao_arredondamento
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_metodos_conceitos
-- ============================================
ALTER TABLE academico_metodos_conceitos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - conceitos"
ON academico_metodos_conceitos
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_metodos_niveis
-- ============================================
ALTER TABLE academico_metodos_niveis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - níveis"
ON academico_metodos_niveis
FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Tabela: academico_metodos_parecer
-- ============================================
ALTER TABLE academico_metodos_parecer ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para desenvolvimento - parecer"
ON academico_metodos_parecer
FOR ALL
USING (true)
WITH CHECK (true);