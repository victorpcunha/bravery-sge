-- ============================================
-- BRAVERY SGE - Alterar permite_recuperacao 
-- para suportar múltiplas seleções
-- ============================================
-- ATENÇÃO: Rodar no SQL Editor do Supabase Dashboard
-- ============================================

-- 1. Remover CHECK constraint (nome pode variar, dropar por nome da coluna)
ALTER TABLE academico_metodos_avaliacao_numerico 
DROP CONSTRAINT IF EXISTS academico_metodos_avaliacao_numerico_permite_recuperacao_check;

-- 2. Alterar tipo para TEXT (comporta múltiplos valores separados por vírgula)
ALTER TABLE academico_metodos_avaliacao_numerico 
ALTER COLUMN permite_recuperacao TYPE TEXT;

-- 3. Atualizar registros existentes: 'nenhum' → NULL
UPDATE academico_metodos_avaliacao_numerico 
SET permite_recuperacao = NULL 
WHERE permite_recuperacao = 'nenhum';

-- 4. Recarregar cache do PostgREST
NOTIFY pgrst, 'reload schema';
