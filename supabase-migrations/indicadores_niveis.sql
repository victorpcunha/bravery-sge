-- ============================================
-- BRAVERY SGE - Níveis de Desenvolvimento
-- por Indicador de Avaliação
-- ============================================

-- 1. Criar tabela de níveis por indicador
CREATE TABLE IF NOT EXISTS indicadores_niveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicador_id UUID NOT NULL REFERENCES indicadores_avaliacao(id) ON DELETE CASCADE,
  descricao VARCHAR(200) NOT NULL,
  sigla VARCHAR(20),
  ordem INTEGER NOT NULL DEFAULT 0,
  origem VARCHAR(20) NOT NULL DEFAULT 'metodo'
    CHECK (origem IN ('metodo', 'personalizado')),
  metodo_nivel_id UUID REFERENCES academico_metodos_niveis(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_indicadores_niveis_indicador ON indicadores_niveis(indicador_id);
CREATE INDEX IF NOT EXISTS idx_indicadores_niveis_metodo_nivel ON indicadores_niveis(metodo_nivel_id);

-- 2. Migrar dados existentes de opcoes_registro_ids (apenas se a coluna ainda existir)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'indicadores_avaliacao'
    AND column_name = 'opcoes_registro_ids'
  ) THEN
    INSERT INTO indicadores_niveis (indicador_id, descricao, sigla, ordem, origem, metodo_nivel_id)
    SELECT
      i.id,
      mn.descricao,
      mn.sigla,
      mn.ordem,
      'metodo',
      mn.id
    FROM indicadores_avaliacao i
    CROSS JOIN LATERAL unnest(i.opcoes_registro_ids) AS opcao_id
    JOIN academico_metodos_niveis mn ON mn.id = opcao_id::uuid
    WHERE array_length(i.opcoes_registro_ids, 1) > 0;

    ALTER TABLE indicadores_avaliacao DROP COLUMN opcoes_registro_ids;
  END IF;
END $$;

-- 3. Remover indicadores de Fundamental/Médio/EJA importados da BNCC incorretamente
DELETE FROM indicadores_avaliacao
WHERE origem = 'matriz'
  AND disciplina_id IS NOT NULL
  AND utilizado = false
  AND ativo = true;

-- 4. Comentários
COMMENT ON TABLE indicadores_niveis IS 'Níveis de desenvolvimento por indicador de avaliação';
COMMENT ON COLUMN indicadores_niveis.origem IS 'Origem do nível: metodo (copiado do método de avaliação) ou personalizado (criado manualmente para este indicador)';
COMMENT ON COLUMN indicadores_niveis.metodo_nivel_id IS 'ID do nível original no método de avaliação (se origem = metodo)';
