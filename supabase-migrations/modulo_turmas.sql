-- ============================================
-- BRAVERY SGE - Módulo Turmas (Registro 20 Censo)
-- ============================================

-- Tabela principal de turmas
CREATE TABLE IF NOT EXISTS turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,

  -- Identificação
  ano_letivo_id UUID NOT NULL REFERENCES academico_anos_letivos(id) ON DELETE RESTRICT,
  codigo_inep VARCHAR(20),
  nome VARCHAR(200) NOT NULL,
  tipo_mediacao VARCHAR(50) NOT NULL DEFAULT 'Presencial'
    CHECK (tipo_mediacao IN ('Presencial', 'Semipresencial', 'Educação a Distância - EAD')),
  tipo_ensino VARCHAR(50),
  capacidade_alunos INTEGER NOT NULL DEFAULT 0,
  local_funcionamento VARCHAR(100),
  ciclo_inicio VARCHAR(20),
  educacao_bilingue_surdos BOOLEAN DEFAULT false,
  formacao_alternancia BOOLEAN DEFAULT false,

  -- Modalidade e Etapa
  modalidade VARCHAR(100) NOT NULL,
  etapa_ensino_id UUID NOT NULL REFERENCES academico_etapas_ensino(id) ON DELETE RESTRICT,
  multietapa BOOLEAN DEFAULT false,

  -- Turno (simplificado: 1 turno por turma no schema principal, armazenado como array)
  turnos JSONB DEFAULT '[]'::jsonb,

  -- Dias de funcionamento
  dias_funcionamento JSONB DEFAULT '[]'::jsonb,

  -- Tipos da turma
  tipos_turma JSONB DEFAULT '[]'::jsonb,

  -- Organização curricular
  organizacao_curricular JSONB DEFAULT '[]'::jsonb,

  -- Áreas do itinerário formativo
  areas_itinerario JSONB DEFAULT '[]'::jsonb,

  -- Formação técnica
  tipo_curso VARCHAR(50),
  curso_tecnico_id VARCHAR(100),

  -- Forma de organização
  forma_organizacao VARCHAR(100),

  -- Status
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Disciplinas da turma (many-to-many entre turmas e academico_matriz_disciplinas)
CREATE TABLE IF NOT EXISTS turmas_disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  matriz_disciplina_id UUID NOT NULL REFERENCES academico_matriz_disciplinas(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(turma_id, matriz_disciplina_id)
);

-- Profissionais vinculados à turma
CREATE TABLE IF NOT EXISTS turmas_profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  vinculo_profissional_id UUID REFERENCES vinculos_profissionais(id) ON DELETE SET NULL,
  data_inicio DATE NOT NULL,
  data_encerramento DATE,
  ativo BOOLEAN DEFAULT true NOT NULL,
  disciplinas_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(turma_id, person_id, vinculo_profissional_id)
);

-- Etapas multietapa
CREATE TABLE IF NOT EXISTS turmas_multietapa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  etapa_ensino_id UUID NOT NULL REFERENCES academico_etapas_ensino(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(turma_id, etapa_ensino_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_turmas_school_id ON turmas(school_id);
CREATE INDEX IF NOT EXISTS idx_turmas_ano_letivo ON turmas(ano_letivo_id);
CREATE INDEX IF NOT EXISTS idx_turmas_etapa ON turmas(etapa_ensino_id);
CREATE INDEX IF NOT EXISTS idx_turmas_disciplinas_turma ON turmas_disciplinas(turma_id);
CREATE INDEX IF NOT EXISTS idx_turmas_profissionais_turma ON turmas_profissionais(turma_id);
CREATE INDEX IF NOT EXISTS idx_turmas_profissionais_pessoa ON turmas_profissionais(person_id);
CREATE INDEX IF NOT EXISTS idx_turmas_multietapa_turma ON turmas_multietapa(turma_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_turmas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_turmas_updated_at
BEFORE UPDATE ON turmas
FOR EACH ROW
EXECUTE FUNCTION update_turmas_updated_at();

CREATE TRIGGER update_turmas_profissionais_updated_at
BEFORE UPDATE ON turmas_profissionais
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE turmas IS 'Turmas escolares - Registro 20 do Censo Escolar';
COMMENT ON TABLE turmas_disciplinas IS 'Disciplinas vinculadas à turma';
COMMENT ON TABLE turmas_profissionais IS 'Profissionais vinculados à turma';
COMMENT ON TABLE turmas_multietapa IS 'Etapas multietapa da turma';
