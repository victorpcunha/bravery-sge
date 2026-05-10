-- ============================================
-- BRAVERY SGE - Escola de Desenvolvimento
-- ============================================

-- Inserir escola de teste para desenvolvimento
INSERT INTO schools (
  tipo_registro,
  nome_escola,
  situacao_funcionamento,
  dependencia_administrativa,
  formato_organizacional,
  localizacao
) VALUES (
  '00',
  'Escola Bravery - Desenvolvimento',
  '1', -- Em atividade
  '4', -- Particular
  '1', -- Escola
  '1'  -- Urbana
)
RETURNING id;