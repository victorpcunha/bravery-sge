-- ============================================
-- BRAVERY SGE - Conceder novas permissões do
-- Diário de Classe a perfis que já possuem
-- o recurso base 'gestao-pedagogica.diario-classe'
-- ============================================

DO $$
DECLARE
  v_recurso_base_id UUID;
  v_recurso_frequencia_id UUID;
  v_recurso_parecer_id UUID;
  v_recurso_indicador_id UUID;
  v_recurso_nota_id UUID;
  v_perfil RECORD;
BEGIN
  -- Buscar IDs dos recursos
  SELECT id INTO v_recurso_base_id FROM recursos WHERE codigo = 'gestao-pedagogica.diario-classe';
  SELECT id INTO v_recurso_frequencia_id FROM recursos WHERE codigo = 'gestao-pedagogica.diario-classe.frequencia';
  SELECT id INTO v_recurso_parecer_id FROM recursos WHERE codigo = 'gestao-pedagogica.diario-classe.parecer';
  SELECT id INTO v_recurso_indicador_id FROM recursos WHERE codigo = 'gestao-pedagogica.diario-classe.indicador';
  SELECT id INTO v_recurso_nota_id FROM recursos WHERE codigo = 'gestao-pedagogica.diario-classe.nota';

  -- Para cada perfil que tem permissão de visualizar o recurso base
  FOR v_perfil IN
    SELECT DISTINCT pp.perfil_id, pp.school_id
    FROM perfis_permissoes pp
    WHERE pp.recurso_id = v_recurso_base_id
      AND pp.visualizar = true
  LOOP
    -- Frequência
    IF v_recurso_frequencia_id IS NOT NULL THEN
      INSERT INTO perfis_permissoes (perfil_id, recurso_id, school_id, visualizar, criar, editar, excluir)
      VALUES (v_perfil.perfil_id, v_recurso_frequencia_id, v_perfil.school_id, true, true, true, false)
      ON CONFLICT (perfil_id, recurso_id, school_id) DO NOTHING;
    END IF;

    -- Parecer
    IF v_recurso_parecer_id IS NOT NULL THEN
      INSERT INTO perfis_permissoes (perfil_id, recurso_id, school_id, visualizar, criar, editar, excluir)
      VALUES (v_perfil.perfil_id, v_recurso_parecer_id, v_perfil.school_id, true, true, true, false)
      ON CONFLICT (perfil_id, recurso_id, school_id) DO NOTHING;
    END IF;

    -- Indicador
    IF v_recurso_indicador_id IS NOT NULL THEN
      INSERT INTO perfis_permissoes (perfil_id, recurso_id, school_id, visualizar, criar, editar, excluir)
      VALUES (v_perfil.perfil_id, v_recurso_indicador_id, v_perfil.school_id, true, true, true, false)
      ON CONFLICT (perfil_id, recurso_id, school_id) DO NOTHING;
    END IF;

    -- Nota
    IF v_recurso_nota_id IS NOT NULL THEN
      INSERT INTO perfis_permissoes (perfil_id, recurso_id, school_id, visualizar, criar, editar, excluir)
      VALUES (v_perfil.perfil_id, v_recurso_nota_id, v_perfil.school_id, true, true, true, false)
      ON CONFLICT (perfil_id, recurso_id, school_id) DO NOTHING;
    END IF;
  END LOOP;
END;
$$;
