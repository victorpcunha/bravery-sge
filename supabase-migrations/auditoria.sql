-- ============================================
-- BRAVERY SGE - Auditoria Geral
-- Registro automático de criações, edições e exclusões
-- em todas as telas do sistema (Master-Data: diffs completos;
-- alto volume: resumo agregado por sessão de salvamento)
-- ============================================

CREATE TABLE IF NOT EXISTS auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  pessoa_id UUID REFERENCES people(id) ON DELETE SET NULL,
  modulo VARCHAR(150) NOT NULL,
  entidade VARCHAR(80) NOT NULL,
  entidade_id UUID,
  registro_nome TEXT,
  acao VARCHAR(20) NOT NULL CHECK (acao IN ('criar', 'editar', 'excluir')),
  dados_anteriores JSONB,
  dados_novos JSONB,
  alteracoes JSONB,
  resumo JSONB
);

CREATE INDEX IF NOT EXISTS idx_auditoria_school ON auditoria(school_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_pessoa ON auditoria(pessoa_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_modulo ON auditoria(modulo);
CREATE INDEX IF NOT EXISTS idx_auditoria_acao ON auditoria(acao);
CREATE INDEX IF NOT EXISTS idx_auditoria_entidade ON auditoria(entidade, entidade_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_created ON auditoria(created_at DESC);

-- Índice trigram para a busca livre (por nome/identificação do registro)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_auditoria_nome_trgm ON auditoria USING gin (registro_nome gin_trgm_ops);

COMMENT ON TABLE auditoria IS 'Registro de auditoria geral do sistema (criações, edições e exclusões em todas as telas)';

-- ============================================
-- Backfill: migra os registros históricos de perfis_auditoria
-- para a nova tabela (best-effort de registro_nome por entidade),
-- mapeando os módulos legados para os rótulos do sistema.
-- A tabela perfis_auditoria é preservada como arquivo histórico;
-- todo o código novo passa a gravar apenas em auditoria.
-- ============================================

INSERT INTO auditoria (
  created_at,
  school_id,
  pessoa_id,
  modulo,
  entidade,
  entidade_id,
  registro_nome,
  acao,
  dados_anteriores,
  dados_novos
)
SELECT
  pa.created_at,
  pa.school_id,
  pa.pessoa_id,
  CASE
    WHEN pa.entidade IN ('perfil', 'permissoes') THEN 'Perfis e Permissões'
    WHEN pa.entidade = 'pessoa' THEN 'Usuários'
    WHEN pa.entidade = 'fechamento_turma' THEN 'Fechamento de Turma'
    ELSE pa.entidade
  END AS modulo,
  pa.entidade,
  pa.entidade_id,
  CASE
    WHEN pa.entidade = 'perfil' THEN p.nome
    WHEN pa.entidade = 'pessoa' THEN pe.nome_completo
    WHEN pa.entidade = 'fechamento_turma' THEN t.nome
    ELSE pa.entidade_id::text
  END AS registro_nome,
  pa.acao,
  pa.dados_anteriores,
  pa.dados_novos
FROM perfis_auditoria pa
LEFT JOIN perfis p ON pa.entidade = 'perfil' AND p.id = pa.entidade_id
LEFT JOIN people pe ON pa.entidade = 'pessoa' AND pe.id = pa.entidade_id
LEFT JOIN turmas t ON pa.entidade = 'fechamento_turma' AND t.id = pa.entidade_id
ON CONFLICT (id) DO NOTHING;