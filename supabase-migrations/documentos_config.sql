-- ============================================
-- BRAVERY SGE - Configurações de Documentos
-- Dados de uso interno do sistema (cabeçalho, rodapé e identidade
-- visual dos documentos/relatórios). NÃO são exportados no Censo Escolar.
-- ============================================

CREATE TABLE IF NOT EXISTS documentos_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL UNIQUE REFERENCES schools(id) ON DELETE CASCADE,

  -- Campos replicados do cadastro da Unidade Escolar (editáveis somente aqui,
  -- sem alterar o cadastro original / Registro 00 do Censo)
  nome_escola_doc VARCHAR(100),
  cnpj_doc VARCHAR(14),
  logradouro_doc VARCHAR(120),
  numero_doc VARCHAR(10),
  bairro_doc VARCHAR(60),
  municipio_doc VARCHAR(7),
  cep_doc VARCHAR(8),
  telefone_doc VARCHAR(20),
  email_doc VARCHAR(120),

  -- Campos adicionais
  nome_fantasia VARCHAR(120),
  site VARCHAR(200),
  mantenedora TEXT,
  cabecalho TEXT,
  rodape TEXT,
  responsavel_nome VARCHAR(120),
  responsavel_cargo VARCHAR(120),
  logo TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL
);

COMMENT ON TABLE documentos_config IS
  'Configuracoes de Documentos da Unidade Escolar (uso interno; nao exportadas no Censo Escolar)';

COMMENT ON COLUMN documentos_config.municipio_doc IS 'Codigo IBGE do municipio (7 digitos)';

CREATE INDEX IF NOT EXISTS idx_documentos_config_school ON documentos_config(school_id);