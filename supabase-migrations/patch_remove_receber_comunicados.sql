-- ============================================
-- BRAVERY SGE - Remove opt-out de comunicados por vínculo
-- Comunicados são broadcast escola→responsáveis (spec 025);
-- assuntos individuais serão Ocorrências (spec futura).
-- O checkbox "Comunicados" da tela de Usuários deixa de existir.
-- Aplicar via SQL Editor
-- ============================================

ALTER TABLE responsavel_alunos
  DROP COLUMN IF EXISTS receber_comunicados;
