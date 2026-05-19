-- ============================================
-- BRAVERY SGE - Métodos de Avaliação
-- Script COMPLETO para executar no SQL Editor
-- ============================================
-- ATENÇÃO: Abra https://supabase.com/dashboard
-- → Project: wfxmmwmxmantgzydusnw
-- → SQL Editor
-- → Cole todo este conteúdo
-- → Execute (Ctrl+Enter)
-- ============================================

-- ============================================
-- PARTE 1: Main table - add missing columns
-- ============================================
ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS criterio_frequencia VARCHAR(20) DEFAULT 'por_dia'
CHECK (criterio_frequencia IN ('por_dia', 'por_aula'));

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS frecuencia_minima DECIMAL(5,2) DEFAULT 75.00;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS tipos_avaliacao JSONB DEFAULT '{}';

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS quantidade_periodos_numerico INT;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS quantidade_periodos_parecer INT;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS quantidade_periodos_conceito INT;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS quantidade_periodos_nivel INT;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- ============================================
-- PARTE 2: updated_at trigger for main table
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_metodos_avaliacao_updated ON academico_metodos_avaliacao;
CREATE TRIGGER update_metodos_avaliacao_updated
  BEFORE UPDATE ON academico_metodos_avaliacao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- PARTE 3: Auxiliary tables
-- ============================================

-- Configuração de Avaliação Numérica
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

-- Configuração de Aprovação
CREATE TABLE IF NOT EXISTS academico_metodos_avaliacao_aprovacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE CASCADE,
  aprovacao_automatica BOOLEAN DEFAULT false,
  media_minima DECIMAL(5,2) DEFAULT 7.00,
  pesos_periodos JSONB DEFAULT '[1,1,1,1]',
  permite_recuperacao_final BOOLEAN DEFAULT false,
  media_minima_recuperacao DECIMAL(5,2) DEFAULT 5.00,
  usa_media_ponderada_recuperacao BOOLEAN DEFAULT false,
  peso_media_anual DECIMAL(5,2) DEFAULT 1.00,
  peso_recuperacao_final DECIMAL(5,2) DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(metodo_id)
);

-- Configuração de Arredondamento
CREATE TABLE IF NOT EXISTS academico_metodos_avaliacao_arredondamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE CASCADE,
  tipo_arredondamento VARCHAR(20) CHECK (tipo_arredondamento IN ('meio_ponto', 'decimal', 'nenhum')),
  intervalo_inicial DECIMAL(5,2),
  intervalo_final DECIMAL(5,2),
  margem_decimal INT,
  aplica_media_periodo BOOLEAN DEFAULT false,
  aplica_media_anual BOOLEAN DEFAULT false,
  aplica_media_final BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(metodo_id)
);

-- Conceitos (máx 6 por método)
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

-- Níveis de Desenvolvimento (máx 6)
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

-- Configuração de Parecer Descritivo
CREATE TABLE IF NOT EXISTS academico_metodos_parecer (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo_id UUID NOT NULL REFERENCES academico_metodos_avaliacao(id) ON DELETE CASCADE,
  registro_geral BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(metodo_id)
);

-- ============================================
-- PARTE 4: Indexes for auxiliary tables
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
-- PARTE 5: updated_at triggers for aux tables
-- ============================================
DROP TRIGGER IF EXISTS update_metodos_numerico_updated ON academico_metodos_avaliacao_numerico;
CREATE TRIGGER update_metodos_numerico_updated
  BEFORE UPDATE ON academico_metodos_avaliacao_numerico
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_metodos_aprovacao_updated ON academico_metodos_avaliacao_aprovacao;
CREATE TRIGGER update_metodos_aprovacao_updated
  BEFORE UPDATE ON academico_metodos_avaliacao_aprovacao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_metodos_arredondamento_updated ON academico_metodos_avaliacao_arredondamento;
CREATE TRIGGER update_metodos_arredondamento_updated
  BEFORE UPDATE ON academico_metodos_avaliacao_arredondamento
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_metodos_conceitos_updated ON academico_metodos_conceitos;
CREATE TRIGGER update_metodos_conceitos_updated
  BEFORE UPDATE ON academico_metodos_conceitos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_metodos_niveis_updated ON academico_metodos_niveis;
CREATE TRIGGER update_metodos_niveis_updated
  BEFORE UPDATE ON academico_metodos_niveis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_metodos_parecer_updated ON academico_metodos_parecer;
CREATE TRIGGER update_metodos_parecer_updated
  BEFORE UPDATE ON academico_metodos_parecer
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- PARTE 6: Constraints (triggers)
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

DROP TRIGGER IF EXISTS trigger_max_conceitos ON academico_metodos_conceitos;
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

DROP TRIGGER IF EXISTS trigger_max_conceitos_finais ON academico_metodos_conceitos;
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

DROP TRIGGER IF EXISTS trigger_max_niveis ON academico_metodos_niveis;
CREATE TRIGGER trigger_max_niveis
  BEFORE INSERT OR UPDATE ON academico_metodos_niveis
  FOR EACH ROW EXECUTE FUNCTION check_max_niveis();

-- ============================================
-- PARTE 7: Comments
-- ============================================
COMMENT ON TABLE academico_metodos_avaliacao IS 'Métodos de avaliação: numérico, parecer, conceito, nível';

-- ============================================
-- PARTE 8: RLS Policies
-- ============================================
ALTER TABLE academico_metodos_avaliacao_numerico ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir tudo - numérica" ON academico_metodos_avaliacao_numerico;
CREATE POLICY "Permitir tudo - numérica"
  ON academico_metodos_avaliacao_numerico FOR ALL
  USING (true) WITH CHECK (true);

ALTER TABLE academico_metodos_avaliacao_aprovacao ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir tudo - aprovação" ON academico_metodos_avaliacao_aprovacao;
CREATE POLICY "Permitir tudo - aprovação"
  ON academico_metodos_avaliacao_aprovacao FOR ALL
  USING (true) WITH CHECK (true);

ALTER TABLE academico_metodos_avaliacao_arredondamento ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir tudo - arredondamento" ON academico_metodos_avaliacao_arredondamento;
CREATE POLICY "Permitir tudo - arredondamento"
  ON academico_metodos_avaliacao_arredondamento FOR ALL
  USING (true) WITH CHECK (true);

ALTER TABLE academico_metodos_conceitos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir tudo - conceitos" ON academico_metodos_conceitos;
CREATE POLICY "Permitir tudo - conceitos"
  ON academico_metodos_conceitos FOR ALL
  USING (true) WITH CHECK (true);

ALTER TABLE academico_metodos_niveis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir tudo - níveis" ON academico_metodos_niveis;
CREATE POLICY "Permitir tudo - níveis"
  ON academico_metodos_niveis FOR ALL
  USING (true) WITH CHECK (true);

ALTER TABLE academico_metodos_parecer ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir tudo - parecer" ON academico_metodos_parecer;
CREATE POLICY "Permitir tudo - parecer"
  ON academico_metodos_parecer FOR ALL
  USING (true) WITH CHECK (true);

-- ============================================
-- FINAL: Recarregar cache do PostgREST
-- ============================================
NOTIFY pgrst, 'reload schema';

-- ============================================
-- VERIFICAR: Confira as colunas
-- ============================================
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'academico_metodos_avaliacao'
ORDER BY ordinal_position;
