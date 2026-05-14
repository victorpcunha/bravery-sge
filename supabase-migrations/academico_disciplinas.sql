-- ============================================
-- BRAVERY SGE - Disciplinas
-- ============================================
-- Tabela de disciplinas do sistema

CREATE TABLE academico_disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  nome_abreviado VARCHAR(20),
  componente VARCHAR(50) NOT NULL DEFAULT 'todos'
    CHECK (componente IN ('linguagens', 'matematica', 'ciencias_natureza', 'ciencias_humanas', 'ensino_religioso', 'educacao_fisica', 'arte', 'todos')),
  tipo_ensino VARCHAR(50) NOT NULL DEFAULT 'todos'
    CHECK (tipo_ensino IN ('infantil', 'fundamental', 'medio', 'eja', 'todos')),
  carga_horaria_padrao INT, -- Carga horária padrão em minutos
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comentários
COMMENT ON TABLE academico_disciplinas IS 'Disciplinas disponíveis no sistema';
COMMENT ON COLUMN academico_disciplinas.componente IS 'Componente curricular: linguagens, matematica, ciencias_natureza, etc';
COMMENT ON COLUMN academico_disciplinas.tipo_ensino IS 'Tipo de ensino: infantil, fundamental, medio, eja, todos';