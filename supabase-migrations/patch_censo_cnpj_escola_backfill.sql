-- ============================================
-- BRAVERY SGE - Censo INEP 2026: Unificação do CNPJ da Escola
-- ============================================
-- Contexto: o formulário da Unidade Escolar gravava o "CNPJ da Escola"
-- na coluna legada `schools.cnpj` (censo_2026_tables.sql), enquanto a
-- validação/exportação do Censo leem a coluna INEP `schools.cnpj_escola`
-- (patch_censo_schools.sql) — gerando falso erro de "obrigatório".
-- A partir deste patch, a coluna canônica é `cnpj_escola`.
--
-- Pré-requisito: patch_censo_schools.sql aplicado.
-- Como aplicar: rodar este arquivo no SQL Editor do Supabase.
-- Idempotente: pode rodar mais de uma vez sem efeito colateral.
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'schools' AND column_name = 'cnpj_escola'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'schools' AND column_name = 'cnpj'
  ) THEN
    UPDATE schools
    SET cnpj_escola = cnpj
    WHERE (cnpj_escola IS NULL OR cnpj_escola = '')
      AND cnpj IS NOT NULL AND cnpj <> '';
  END IF;
END $$;
