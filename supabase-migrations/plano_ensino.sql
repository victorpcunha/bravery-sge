-- ============================================
-- BRAVERY SGE - Plano de Ensino
-- ============================================

-- 1. Tabela principal: planos_ensino
CREATE TABLE IF NOT EXISTS planos_ensino (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  ano_letivo_id UUID NOT NULL REFERENCES academico_anos_letivos(id) ON DELETE RESTRICT,
  etapa_id UUID NOT NULL REFERENCES academico_etapas_ensino(id) ON DELETE RESTRICT,
  subetapa_id UUID REFERENCES academico_subetapas(id) ON DELETE SET NULL,
  is_interdisciplinar BOOLEAN DEFAULT false NOT NULL,
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_planos_ensino_turma ON planos_ensino(turma_id);
CREATE INDEX IF NOT EXISTS idx_planos_ensino_ano ON planos_ensino(ano_letivo_id);

-- 2. Disciplinas do plano
CREATE TABLE IF NOT EXISTS planos_ensino_disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_ensino_id UUID NOT NULL REFERENCES planos_ensino(id) ON DELETE CASCADE,
  matriz_disciplina_id UUID NOT NULL REFERENCES academico_matriz_disciplinas(id) ON DELETE RESTRICT,
  UNIQUE(plano_ensino_id, matriz_disciplina_id)
);

CREATE INDEX IF NOT EXISTS idx_planos_disciplinas_plano ON planos_ensino_disciplinas(plano_ensino_id);

-- 3. Planos de Aula
CREATE TABLE IF NOT EXISTS planos_aula (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_ensino_id UUID NOT NULL REFERENCES planos_ensino(id) ON DELETE CASCADE,
  periodo INT NOT NULL,
  tema VARCHAR(200) NOT NULL,
  conteudo TEXT,
  data_inicio DATE,
  data_fim DATE,
  recursos_didaticos TEXT,
  metodologia TEXT,
  avaliacao TEXT,
  referencias TEXT,
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_planos_aula_plano ON planos_aula(plano_ensino_id);
CREATE INDEX IF NOT EXISTS idx_planos_aula_periodo ON planos_aula(periodo);

-- 4. Resource de permissão
INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-pedagogica.plano-ensino', 'Plano de Ensino', 'Gestão Pedagógica')
ON CONFLICT (codigo) DO NOTHING;

-- 5. Conceder permissão para perfis que já têm acesso a gestao-pedagogica
DO $$
DECLARE
  v_recurso_id UUID;
  v_perfil RECORD;
BEGIN
  SELECT id INTO v_recurso_id FROM recursos WHERE codigo = 'gestao-pedagogica.plano-ensino';

  FOR v_perfil IN
    SELECT DISTINCT pp.perfil_id, pp.school_id
    FROM perfis_permissoes pp
      JOIN recursos r ON r.id = pp.recurso_id
    WHERE r.codigo LIKE 'gestao-pedagogica.%'
      AND pp.visualizar = true
  LOOP
    INSERT INTO perfis_permissoes (perfil_id, recurso_id, school_id, visualizar, criar, editar, excluir)
    VALUES (v_perfil.perfil_id, v_recurso_id, v_perfil.school_id, true, true, true, false)
    ON CONFLICT (perfil_id, recurso_id) DO NOTHING;
  END LOOP;
END;
$$;

COMMENT ON TABLE planos_ensino IS 'Planos de ensino por turma/ano/etapa';
COMMENT ON TABLE planos_ensino_disciplinas IS 'Disciplinas vinculadas a cada plano';
COMMENT ON TABLE planos_aula IS 'Planos de aula individuais dentro de cada período';
