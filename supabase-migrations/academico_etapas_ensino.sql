-- ============================================
-- BRAVERY SGE - Etapas de Ensino
-- ============================================
-- Tabela para armazenar a configuração de etapas de ensino por escola
-- Armazena quais etapas estão ativas/inativas e suas subetapas

-- Tabela principal de etapas de ensino por escola
CREATE TABLE academico_etapas_ensino (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  etapa_codigo INTEGER NOT NULL,  -- Código da etapa (INEP)
  etapa_nome VARCHAR(100) NOT NULL,  -- Nome da etapa
  etapa_tipo VARCHAR(50) NOT NULL,  -- Tipo: 'infantil', 'fundamental_inicial', etc.
  ativa BOOLEAN DEFAULT true NOT NULL,  -- Status ativo/inativo
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Restrição única por escola + etapa
  UNIQUE(school_id, etapa_codigo)
);

-- Tabela de subetapas
CREATE TABLE academico_subetapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etapa_ensino_id UUID NOT NULL REFERENCES academico_etapas_ensino(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para performance
CREATE INDEX idx_etapas_ensino_school_id ON academico_etapas_ensino(school_id);
CREATE INDEX idx_subetapas_etapa_id ON academico_subetapas(etapa_ensino_id);

-- Função para auto-atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at em academico_etapas_ensino
CREATE TRIGGER update_etapas_ensino_updated_at
BEFORE UPDATE ON academico_etapas_ensino
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em academico_subetapas
CREATE TRIGGER update_subetapas_updated_at
BEFORE UPDATE ON academico_subetapas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE academico_etapas_ensino IS 'Tabela de etapas de ensino por escola - armazena quais etapas estão ativas ou inativas';
COMMENT ON TABLE academico_subetapas IS 'Subetapas criadas para cada etapa de ensino';
COMMENT ON COLUMN academico_etapas_ensino.school_id IS 'Referência para a escola';
COMMENT ON COLUMN academico_etapas_ensino.etapa_codigo IS 'Código INEP da etapa';
COMMENT ON COLUMN academico_etapas_ensino.etapa_nome IS 'Nome da etapa de ensino';
COMMENT ON COLUMN academico_etapas_ensino.etapa_tipo IS 'Tipo da etapa (infantil, fundamental_inicial, etc)';
COMMENT ON COLUMN academico_etapas_ensino.ativa IS 'Indica se a etapa está ativa para a escola';
