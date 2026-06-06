-- ============================================
-- BRAVERY SGE - Configuração: Histórico Manual
-- Adiciona coluna para habilitar/desabilitar
-- registro manual de histórico escolar
-- ============================================

ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS permite_historico_manual BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN schools.permite_historico_manual IS
  'Habilita o registro manual de histórico escolar no Painel do Aluno';
