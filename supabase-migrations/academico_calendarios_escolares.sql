-- ============================================
-- BRAVERY SGE - Módulo Gestão Acadêmica
-- Tabelas para Calendários Escolares
-- ============================================

-- ============================================
-- TABELA: Anos Letivos
-- ============================================

CREATE TABLE IF NOT EXISTS academico_anos_letivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  descricao VARCHAR(50) NOT NULL,
  data_inicio DATE NOT NULL,
  data_termino DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'planejamento' CHECK (status IN ('ativo', 'planejamento', 'encerrado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anos_letivos_school ON academico_anos_letivos(school_id);
CREATE INDEX idx_anos_letivos_status ON academico_anos_letivos(status);

-- ============================================
-- TABELA: Calendários Escolares
-- ============================================

CREATE TABLE IF NOT EXISTS academico_calendarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ano_letivo_id UUID REFERENCES academico_anos_letivos(id) ON DELETE CASCADE NOT NULL,
  descricao VARCHAR(100) NOT NULL,
  data_inicio DATE NOT NULL,
  data_termino DATE NOT NULL,
  etapas TEXT[], -- Array de etapas atendidas
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calendarios_ano_letivo ON academico_calendarios(ano_letivo_id);

-- ============================================
-- TABELA: Eventos do Calendário
-- ============================================

CREATE TABLE IF NOT EXISTS academico_calendario_eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendario_id UUID REFERENCES academico_calendarios(id) ON DELETE CASCADE NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('dia_letivo', 'recesso')),
  data_inicio DATE NOT NULL,
  data_termino DATE NOT NULL,
  etapas TEXT[], -- Array de etapas atendidas pelo evento
  recorrencia_tipo VARCHAR(20) DEFAULT 'nao_repete' CHECK (recorrencia_tipo IN ('nao_repete', 'todos_dias', 'dias_semana')),
  recorrencia_dias TEXT[], -- Array de dias da semana para recorrência
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_eventos_calendario ON academico_calendario_eventos(calendario_id);

-- ============================================
-- HABILITAR RLS
-- ============================================

ALTER TABLE academico_anos_letivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE academico_calendarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE academico_calendario_eventos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS
-- ============================================

CREATE POLICY "anos_letivos_school_isolation" ON academico_anos_letivos
USING (school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid()));

CREATE POLICY "calendarios_school_isolation" ON academico_calendarios
USING (
  ano_letivo_id IN (
    SELECT id FROM academico_anos_letivos 
    WHERE school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid())
  )
);

CREATE POLICY "eventos_school_isolation" ON academico_calendario_eventos
USING (
  calendario_id IN (
    SELECT id FROM academico_calendarios 
    WHERE ano_letivo_id IN (
      SELECT id FROM academico_anos_letivos 
      WHERE school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid())
    )
  )
);

-- ============================================
-- TRIGGERS updated_at
-- ============================================

CREATE TRIGGER academico_anos_letivos_updated_at
  BEFORE UPDATE ON academico_anos_letivos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER academico_calendarios_updated_at
  BEFORE UPDATE ON academico_calendarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER academico_calendario_eventos_updated_at
  BEFORE UPDATE ON academico_calendario_eventos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FIM
-- ============================================