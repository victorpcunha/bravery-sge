-- ============================================
-- BRAVERY SGE - Métodos de Avaliação (COMPLETO)
-- ============================================
-- Tabelas complementares para configuração completa dos métodos de avaliação
-- Baseado na SPEC-GestaoAcademica-MetodosAvaliacao.md

-- ============================================
-- TABELA: Configuração de Avaliação Numérica
-- ============================================
CREATE TABLE IF NOT EXISTS academico_metodos_avaliacao_numerico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE CASCADE,
  forma_registro VARCHAR(20) DEFAULT 'decimal' CHECK (forma_registro IN ('inteiro', 'decimal')),
  permite_recuperacao VARCHAR(20) CHECK (permite_recuperacao IN ('avaliacao', 'periodo', 'final', 'nenhum')),
  tipo_media_periodo VARCHAR(20) DEFAULT 'ponderada' CHECK (tipo_media_periodo IN ('ponderada', 'somatoria')),
  tipo_resultado_final VARCHAR(30) DEFAULT 'media_periodos' CHECK (tipo_resultado_final IN ('media_periodos', 'somatoria')),
  media_maxima_periodo DECIMAL(5,2) DEFAULT 10.00,
  permite_conselho_componente BOOLEAN DEFAULT false,
  atribui_media_minima_conselho BOOLEAN DEFAULT false,
  usa_media_5_conceito BOOLEAN DEFAULT false,
  permite_recuperacao_final_para_reprovados BOOLEAN DEFAULT false,
  recuperacao_substitutiva BOOLEAN DEFAULT false,
  recuperacao_periodo_substitutiva BOOLEAN DEFAULT false,
  realizava_avaliacao_reclassificacao BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(metodo_id)
);

COMMENT ON TABLE academico_metodos_avaliacao_numerico IS 'Configurações específicas para avaliação numérica';
COMMENT ON COLUMN academico_metodos_avaliacao_numerico.forma_registro IS 'Formato de registro das notas: inteiro ou decimal';
COMMENT ON COLUMN academico_metodos_avaliacao_numerico.permite_recuperacao IS 'Tipo de recuperação permitda: avaliacao, periodo, final ou nenhum';
COMMENT ON COLUMN academico_metodos_avaliacao_numerico.tipo_media_periodo IS 'Tipo de cálculo de média do período: ponderada ou somatória';
COMMENT ON COLUMN academico_metodos_avaliacao_numerico.tipo_resultado_final IS 'Tipo de resultado final: média dos períodos ou somatória';

-- ============================================
-- TABELA: Configuração de Aprovação
-- ============================================
CREATE TABLE IF NOT EXISTS academico_metodos_avaliacao_aprovacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE CASCADE,
  aprovacao_automatica BOOLEAN DEFAULT false,
  media_minima DECIMAL(5,2) DEFAULT 7.00,
  pesos_periodos JSONB DEFAULT '[1,1,1,1]',
  -- Recuperação
  permite_recuperacao_final BOOLEAN DEFAULT false,
  media_minima_recuperacao DECIMAL(5,2) DEFAULT 5.00,
  usa_media_ponderada_recuperacao BOOLEAN DEFAULT false,
  peso_media_anual DECIMAL(5,2) DEFAULT 1.00,
  peso_recuperacao_final DECIMAL(5,2) DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(metodo_id)
);

COMMENT ON TABLE academico_metodos_avaliacao_aprovacao IS 'Configurações de aprovação direta e por recuperação';
COMMENT ON COLUMN academico_metodos_avaliacao_aprovacao.aprovacao_automatica IS 'Se true, não usa média mínima para aprovação';
COMMENT ON COLUMN academico_metodos_avaliacao_aprovacao.pesos_periodos IS 'Array de pesos para cada período (ex: [1,1,1,1])';
COMMENT ON COLUMN academico_metodos_avaliacao_aprovacao.usa_media_ponderada_recuperacao IS 'Se true, calcula média ponderada na recuperação';

-- ============================================
-- TABELA: Configuração de Arredondamento
-- ============================================
CREATE TABLE IF NOT EXISTS academico_metodos_avaliacao_arredondamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE CASCADE,
  tipo_arredondamento VARCHAR(20) CHECK (tipo_arredondamento IN ('meio_ponto', 'decimal', 'nenhum')),
  -- Configuração meio ponto
  intervalo_inicial DECIMAL(5,2),
  intervalo_final DECIMAL(5,2),
  -- Configuração decimal
  margem_decimal INT,
  -- Aplicação
  aplica_media_periodo BOOLEAN DEFAULT false,
  aplica_media_anual BOOLEAN DEFAULT false,
  aplica_media_final BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(metodo_id)
);

COMMENT ON TABLE academico_metodos_avaliacao_arredondamento IS 'Configurações de arredondamento de notas';
COMMENT ON COLUMN academico_metodos_avaliacao_arredondamento.tipo_arredondamento IS 'Tipo: meio_ponto, decimal ou nenhum';
COMMENT ON COLUMN academico_metodos_avaliacao_arredondamento.intervalo_inicial IS 'Margem inicial para meio ponto (ex: 3)';
COMMENT ON COLUMN academico_metodos_avaliacao_arredondamento.intervalo_final IS 'Margem final para meio ponto (ex: 7)';
COMMENT ON COLUMN academico_metodos_avaliacao_arredondamento.margem_decimal IS 'Margem para arredondamento decimal (ex: 5)';

-- ============================================
-- TABELA: Conceitos (máx 6 por método)
-- ============================================
CREATE TABLE IF NOT EXISTS academico_metodos_conceitos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE CASCADE,
  descricao VARCHAR(50) NOT NULL,
  sigla VARCHAR(4) NOT NULL,
  cor_fundo VARCHAR(7) NOT NULL DEFAULT '#E2E8F0',
  cor_letra VARCHAR(7) NOT NULL DEFAULT '#1E293B',
  eh_conceito_final BOOLEAN DEFAULT false,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_metodos_conceitos_metodo 
  ON academico_metodos_conceitos(metodo_id);

COMMENT ON TABLE academico_metodos_conceitos IS 'Conceitos para avaliação por conceito (máx 6 por método)';
COMMENT ON COLUMN academico_metodos_conceitos.eh_conceito_final IS 'Se true, é conceito final do ano letivo';
COMMENT ON COLUMN academico_metodos_conceitos.ordem IS 'Ordem de exibição do conceito';

-- ============================================
-- TABELA: Níveis de Desenvolvimento (máx 6)
-- ============================================
CREATE TABLE IF NOT EXISTS academico_metodos_niveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE CASCADE,
  descricao VARCHAR(50) NOT NULL,
  sigla VARCHAR(4) NOT NULL,
  cor_fundo VARCHAR(7) NOT NULL DEFAULT '#E2E8F0',
  cor_letra VARCHAR(7) NOT NULL DEFAULT '#1E293B',
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_metodos_niveis_metodo 
  ON academico_metodos_niveis(metodo_id);

COMMENT ON TABLE academico_metodos_niveis IS 'Níveis para avaliação por nível de desenvolvimento (máx 6 por método)';
COMMENT ON COLUMN academico_metodos_niveis.ordem IS 'Ordem de exibição do nível';

-- ============================================
-- TABELA: Configuração de Parecer Descritivo
-- ============================================
CREATE TABLE IF NOT EXISTS academico_metodos_parecer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE CASCADE,
  registro_geral BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(metodo_id)
);

COMMENT ON TABLE academico_metodos_parecer IS 'Configurações para avaliação por parecer descritivo';
COMMENT ON COLUMN academico_metodos_parecer.registro_geral IS 'Se true, allows registro de único parecer para todas as disciplinas';

-- ============================================
-- INDEXES para Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_metodos_numerico_metodo 
  ON academico_metodos_avaliacao_numerico(metodo_id);

CREATE INDEX IF NOT EXISTS idx_metodos_aprovacao_metodo 
  ON academico_metodos_avaliacao_aprovacao(metodo_id);

CREATE INDEX IF NOT EXISTS idx_metodos_arredondamento_metodo 
  ON academico_metodos_avaliacao_arredondamento(metodo_id);

CREATE INDEX IF NOT EXISTS idx_metodos_parecer_metodo 
  ON academico_metodos_parecer(metodo_id);

-- ============================================
-- CONSTRAINTS
-- ============================================

-- Limitar maximo de conceitos por método (6)
CREATE OR REPLACE FUNCTION check_max_conceitos()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF (SELECT COUNT(*) FROM academico_metodos_conceitos 
        WHERE metodo_id = NEW.metodo_id) >= 6 THEN
      RAISE EXCEPTION 'Máximo de 6 conceitos permitidos por método';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF (SELECT COUNT(*) FROM academico_metodos_conceitos 
        WHERE metodo_id = NEW.metodo_id AND id != NEW.id) >= 6 THEN
      RAISE EXCEPTION 'Máximo de 6 conceitos permitidos por método';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_max_conceitos
  BEFORE INSERT OR UPDATE ON academico_metodos_conceitos
  FOR EACH ROW EXECUTE FUNCTION check_max_conceitos();

-- Limitar maximo de conceitos finais por método (6)
CREATE OR REPLACE FUNCTION check_max_conceitos_finais()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.eh_conceito_final = true THEN
    IF (SELECT COUNT(*) FROM academico_metodos_conceitos 
        WHERE metodo_id = NEW.metodo_id AND eh_conceito_final = true) >= 6 THEN
      RAISE EXCEPTION 'Máximo de 6 conceitos finais permitidos por método';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_max_conceitos_finais
  BEFORE INSERT OR UPDATE ON academico_metodos_conceitos
  FOR EACH ROW EXECUTE FUNCTION check_max_conceitos_finais();

-- Limitar maximo de níveis por método (6)
CREATE OR REPLACE FUNCTION check_max_niveis()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF (SELECT COUNT(*) FROM academico_metodos_niveis 
        WHERE metodo_id = NEW.metodo_id) >= 6 THEN
      RAISE EXCEPTION 'Máximo de 6 níveis permitidos por método';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF (SELECT COUNT(*) FROM academico_metodos_niveis 
        WHERE metodo_id = NEW.metodo_id AND id != NEW.id) >= 6 THEN
      RAISE EXCEPTION 'Máximo de 6 níveis permitidos por método';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_max_niveis
  BEFORE INSERT OR UPDATE ON academico_metodos_niveis
  FOR EACH ROW EXECUTE FUNCTION check_max_niveis();

-- ============================================
-- Função para atualizar timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_metodos_numerico_updated
  BEFORE UPDATE ON academico_metodos_avaliacao_numerico
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_metodos_aprovacao_updated
  BEFORE UPDATE ON academico_metodos_avaliacao_aprovacao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_metodos_arredondamento_updated
  BEFORE UPDATE ON academico_metodos_avaliacao_arredondamento
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_metodos_conceitos_updated
  BEFORE UPDATE ON academico_metodos_conceitos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_metodos_niveis_updated
  BEFORE UPDATE ON academico_metodos_niveis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_metodos_parecer_updated
  BEFORE UPDATE ON academico_metodos_parecer
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Comentários das tabelas
-- ============================================
-- Tabela principal (se ainda não tiver comentário)
COMMENT ON TABLE academico_metodos_avaliacao IS 'Métodos de avaliação: numérico, parecer, conceito, nível';

-- ============================================
-- GRANTS (Ajustar conforme necessidade)
-- ============================================
-- Os grants serão configurados via RLS policies no arquivo separado