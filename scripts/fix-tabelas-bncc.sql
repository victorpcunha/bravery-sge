-- ============================================
-- CORRE��O: AUMENTAR CAPACIDADE DAS COLUNAS
-- ============================================
-- As habilidades de Portugu�s t�m descri��es muito longas
-- e objetos de conhecimento com nomes extensos

-- Corrigir coluna descricao para TEXT (sem limite)
ALTER TABLE bncc_habilidades ALTER COLUMN descricao TYPE TEXT;

-- Corrigir coluna objeto_conhecimento para suportar nomes longos
ALTER TABLE bncc_objetos_conhecimento ALTER COLUMN objeto_conhecimento TYPE TEXT;
