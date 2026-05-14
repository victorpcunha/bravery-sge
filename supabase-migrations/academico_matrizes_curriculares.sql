-- ============================================
-- BRAVERY SGE - Matrizes Curriculares
-- ============================================
-- Tabelas para armazenar matrizes curriculares,
-- períodos, disciplinas e habilidades

-- ============================================
-- Tabela principal: Matrizes Curriculares
-- ============================================
CREATE TABLE academico_matrizes_curriculares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  ano_letivo_id UUID NOT NULL REFERENCES academico_anos_letivos(id) ON DELETE RESTRICT,
  etapa_ensino_id UUID NOT NULL REFERENCES academico_etapas_ensino(id) ON DELETE RESTRICT,
  subetapa_id UUID REFERENCES academico_subetapas(id) ON DELETE SET NULL,
  metodo_avaliacao_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE RESTRICT,
  descricao VARCHAR(200) NOT NULL,
  data_inicial DATE NOT NULL,
  data_final DATE NOT NULL,
  turnos TEXT[] NOT NULL DEFAULT '{}',
  tipo_turma TEXT[] NOT NULL DEFAULT '{}',
  aulas_diarias_regular INT,
  aulas_semanais_regular INT,
  aulas_anuais_regular INT,
  duracao_aula_regular INT,
  aulas_diarias_integral INT,
  aulas_semanais_integral INT,
  aulas_anuais_integral INT,
  duracao_aula_integral INT,
  ativa BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Restrição única: 1 matriz por etapa/ano (ou por subetapa quando aplicável)
  UNIQUE(school_id, ano_letivo_id, etapa_ensino_id, subetapa_id)
);

-- ============================================
-- Tabela: Períodos da Matriz
-- ============================================
CREATE TABLE academico_matriz_periodos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matriz_id UUID NOT NULL REFERENCES academico_matrizes_curriculares(id) ON DELETE CASCADE,
  periodo_ordem INT NOT NULL,
  periodo_nome VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Restrição única por matriz + ordem
  UNIQUE(matriz_id, periodo_ordem)
);

-- ============================================
-- Tabela: Disciplinas da Matriz por Período
-- ============================================
CREATE TABLE academico_matriz_disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  periodo_id UUID NOT NULL REFERENCES academico_matriz_periodos(id) ON DELETE CASCADE,
  disciplina_id UUID NOT NULL REFERENCES academico_disciplinas(id) ON DELETE RESTRICT,
  desconsidera_reprovacao BOOLEAN DEFAULT false NOT NULL,
  carga_horaria_regular_minutos INT,
  carga_horaria_integral_minutos INT,
  tipo_disciplina VARCHAR(50) NOT NULL DEFAULT 'base_comum'
    CHECK (tipo_disciplina IN ('base_comum', 'parte_diversificada')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Restrição única por período + disciplina
  UNIQUE(periodo_id, disciplina_id)
);

-- ============================================
-- Tabela: Habilidades BNCC da Disciplina
-- ============================================
CREATE TABLE academico_matriz_habilidades_bncc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matriz_disciplina_id UUID NOT NULL REFERENCES academico_matriz_disciplinas(id) ON DELETE CASCADE,
  habilidade_codigo VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Restrição única
  UNIQUE(matriz_disciplina_id, habilidade_codigo)
);

-- ============================================
-- Tabela: Habilidades Manuais
-- ============================================
CREATE TABLE academico_matriz_habilidades_manuais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matriz_disciplina_id UUID NOT NULL REFERENCES academico_matriz_disciplinas(id) ON DELETE CASCADE,
  codigo VARCHAR(50) NOT NULL,
  descricao TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- Índices para Performance
-- ============================================
CREATE INDEX idx_matrizes_school_id ON academico_matrizes_curriculares(school_id);
CREATE INDEX idx_matrizes_ano_letivo ON academico_matrizes_curriculares(ano_letivo_id);
CREATE INDEX idx_matrizes_etapa ON academico_matrizes_curriculares(etapa_ensino_id);
CREATE INDEX idx_matrizes_subetapa ON academico_matrizes_curriculares(subetapa_id);
CREATE INDEX idx_matrizes_metodo ON academico_matrizes_curriculares(metodo_avaliacao_id);

CREATE INDEX idx_periodos_matriz_id ON academico_matriz_periodos(matriz_id);

CREATE INDEX idx_disciplinas_periodo_id ON academico_matriz_disciplinas(periodo_id);
CREATE INDEX idx_disciplinas_disciplina_id ON academico_matriz_disciplinas(disciplina_id);

CREATE INDEX idx_habilidades_bncc_disciplina ON academico_matriz_habilidades_bncc(matriz_disciplina_id);
CREATE INDEX idx_habilidades_bncc_codigo ON academico_matriz_habilidades_bncc(habilidade_codigo);

CREATE INDEX idx_habilidades_manuais_disciplina ON academico_matriz_habilidades_manuais(matriz_disciplina_id);

-- ============================================
-- Função para auto-atualizar updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Triggers para updated_at automático
-- ============================================
CREATE TRIGGER update_matrizes_updated_at
BEFORE UPDATE ON academico_matrizes_curriculares
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_periodos_updated_at
BEFORE UPDATE ON academico_matriz_periodos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disciplinas_updated_at
BEFORE UPDATE ON academico_matriz_disciplinas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comentários para Documentação
-- ============================================
COMMENT ON TABLE academico_matrizes_curriculares IS 'Tabela principal de matrizes curriculares - uma por etapa/ano letivo';
COMMENT ON TABLE academico_matriz_periodos IS 'Períodos de cada matriz (baseado no método de avaliação)';
COMMENT ON TABLE academico_matriz_disciplinas IS 'Disciplinas vinculadas a cada período da matriz';
COMMENT ON TABLE academico_matriz_habilidades_bncc IS 'Habilidades BNCC vinculadas às disciplinas';
COMMENT ON TABLE academico_matriz_habilidades_manuais IS 'Habilidades criadas manualmente pelo professor';

COMMENT ON COLUMN academico_matrizes_curriculares.turnos IS 'Array de turnos: matutino, vespertino, noturno';
COMMENT ON COLUMN academico_matrizes_curriculares.tipo_turma IS 'Array de tipo: regular, integral';
COMMENT ON COLUMN academico_matrizes_curriculares.subetapa_id IS 'Null se não houver subetapa (etapa não é infantil)';