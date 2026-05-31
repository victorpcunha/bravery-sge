-- ============================================
-- BRAVERY SGE - Limpeza: remove sub-recursos
-- do Diário de Classe e consolida em 1 só
-- ============================================

DO $$
DECLARE
  v_ids UUID[];
BEGIN
  -- Coletar IDs dos sub-recursos
  SELECT array_agg(id) INTO v_ids FROM recursos
  WHERE codigo IN (
    'gestao-pedagogica.diario-classe.frequencia',
    'gestao-pedagogica.diario-classe.parecer',
    'gestao-pedagogica.diario-classe.indicador',
    'gestao-pedagogica.diario-classe.nota'
  );

  -- Remover permissões desses recursos
  IF v_ids IS NOT NULL THEN
    DELETE FROM perfis_permissoes WHERE recurso_id = ANY(v_ids);
  END IF;

  -- Remover os sub-recursos
  DELETE FROM recursos WHERE codigo IN (
    'gestao-pedagogica.diario-classe.frequencia',
    'gestao-pedagogica.diario-classe.parecer',
    'gestao-pedagogica.diario-classe.indicador',
    'gestao-pedagogica.diario-classe.nota'
  );
END;
$$;
