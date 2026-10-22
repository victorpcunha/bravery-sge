-- Spec 043: título identificador da configuração de faturamento (definido pela escola)
ALTER TABLE faturamento_configuracoes
  ADD COLUMN IF NOT EXISTS titulo TEXT;

COMMENT ON COLUMN faturamento_configuracoes.titulo IS 'Identificador da configuração definido pela escola (ex.: 2026 - Infantil e Anos Iniciais)';
