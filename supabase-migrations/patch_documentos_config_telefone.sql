-- ============================================
-- BRAVERY SGE - Configurações de Documentos
-- Amplia telefone_doc para comportar DDD + telefone 1 e 2
-- (seed automático "Dados replicados do cadastro")
-- ============================================

ALTER TABLE documentos_config
  ALTER COLUMN telefone_doc TYPE VARCHAR(60);