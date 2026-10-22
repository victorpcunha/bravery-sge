-- ============================================
-- BRAVERY SGE - Gestão de Faturamento
-- Spec 043: Matrícula → Plano de Cobrança → Mensalidades
-- ============================================

-- 1. Configurações padrão de cobrança (por escola + ano, com abrangência por etapas)
CREATE TABLE IF NOT EXISTS faturamento_configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  ano_letivo_id UUID NOT NULL REFERENCES academico_anos_letivos(id) ON DELETE RESTRICT,
  etapa_ids UUID[] NULL,
  valor_mensalidade NUMERIC(10,2) NOT NULL CHECK (valor_mensalidade > 0),
  dia_vencimento INT NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
  mes_inicial INT NOT NULL DEFAULT 1 CHECK (mes_inicial BETWEEN 1 AND 12),
  mes_final INT NOT NULL DEFAULT 12 CHECK (mes_final BETWEEN 1 AND 12),
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (mes_final >= mes_inicial)
);

CREATE INDEX IF NOT EXISTS idx_fat_config_school ON faturamento_configuracoes(school_id);
CREATE INDEX IF NOT EXISTS idx_fat_config_ano ON faturamento_configuracoes(ano_letivo_id);

CREATE TRIGGER faturamento_configuracoes_updated_at
BEFORE UPDATE ON faturamento_configuracoes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. Planos de cobrança (1 por matrícula no contexto letivo)
CREATE TABLE IF NOT EXISTS faturamento_planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  matricula_id UUID NOT NULL REFERENCES academico_matriculas(id) ON DELETE CASCADE UNIQUE,
  ano_letivo_id UUID NOT NULL REFERENCES academico_anos_letivos(id) ON DELETE RESTRICT,
  responsavel_id UUID REFERENCES people(id) ON DELETE SET NULL,
  valor_mensalidade NUMERIC(10,2) NOT NULL CHECK (valor_mensalidade >= 0),
  dia_vencimento INT NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
  mes_inicial INT NOT NULL CHECK (mes_inicial BETWEEN 1 AND 12),
  mes_final INT NOT NULL CHECK (mes_final BETWEEN 1 AND 12),
  qtd_mensalidades INT NOT NULL CHECK (qtd_mensalidades > 0),
  config_origem_id UUID REFERENCES faturamento_configuracoes(id) ON DELETE SET NULL,
  situacao VARCHAR(20) NOT NULL DEFAULT 'ativo'
    CHECK (situacao IN ('ativo', 'encerrado')),
  asaas_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (mes_final >= mes_inicial)
);

CREATE INDEX IF NOT EXISTS idx_fat_planos_school ON faturamento_planos(school_id);
CREATE INDEX IF NOT EXISTS idx_fat_planos_matricula ON faturamento_planos(matricula_id);
CREATE INDEX IF NOT EXISTS idx_fat_planos_ano ON faturamento_planos(ano_letivo_id);
CREATE INDEX IF NOT EXISTS idx_fat_planos_responsavel ON faturamento_planos(responsavel_id);

CREATE TRIGGER faturamento_planos_updated_at
BEFORE UPDATE ON faturamento_planos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. Mensalidades (uma por competência dentro do plano)
CREATE TABLE IF NOT EXISTS faturamento_mensalidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id UUID NOT NULL REFERENCES faturamento_planos(id) ON DELETE CASCADE,
  competencia DATE NOT NULL,
  numero_parcela INT NOT NULL CHECK (numero_parcela > 0),
  valor NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
  vencimento DATE NOT NULL,
  situacao VARCHAR(20) NOT NULL DEFAULT 'pendente'
    CHECK (situacao IN ('pendente', 'pago', 'cancelado', 'isento')),
  pago_em DATE,
  forma_baixa TEXT,
  observacao TEXT,
  baixa_por UUID REFERENCES people(id) ON DELETE SET NULL,
  asaas_payment_id TEXT UNIQUE,
  asaas_status TEXT,
  invoice_url TEXT,
  sincronizado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (plano_id, competencia),
  CHECK (situacao <> 'pago' OR pago_em IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_fat_mens_plano ON faturamento_mensalidades(plano_id);
CREATE INDEX IF NOT EXISTS idx_fat_mens_vencimento ON faturamento_mensalidades(vencimento);
CREATE INDEX IF NOT EXISTS idx_fat_mens_situacao ON faturamento_mensalidades(situacao);
CREATE INDEX IF NOT EXISTS idx_fat_mens_competencia ON faturamento_mensalidades(competencia);

CREATE TRIGGER faturamento_mensalidades_updated_at
BEFORE UPDATE ON faturamento_mensalidades
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE faturamento_configuracoes IS 'Padrões de cobrança por escola/ano com abrangência por etapas (etapa_ids NULL = geral)';
COMMENT ON TABLE faturamento_planos IS 'Plano de cobrança: 1 por matrícula no contexto letivo (config_origem_id NULL = exceção)';
COMMENT ON TABLE faturamento_mensalidades IS 'Mensalidades por competência; vencida é derivada (pendente + vencimento passado)';
COMMENT ON COLUMN faturamento_mensalidades.asaas_payment_id IS 'Reserva para integração futura (spec 043 §23) — invisível no MVP';
