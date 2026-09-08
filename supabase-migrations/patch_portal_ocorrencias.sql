-- ============================================
-- BRAVERY SGE - Portal do Responsável: Ocorrências
-- Migration de CONVERGÊNCIA (spec 023, R5 revisado)
-- ============================================
-- Diagnóstico (2026-09-09, banco real):
-- A tabela `ocorrencias` de produção NÃO foi criada pelo arquivo
-- `supabase-migrations/ocorrencias.sql` do repositório (que prevê
-- `person_id` + `descricao` e nunca foi aplicado como escrito).
-- O schema real já contém tudo que o portal precisa:
--   - `titulo VARCHAR NOT NULL`            → título no portal
--   - `tipo CHECK ('positiva','negativa')` → filtro Todas/Positivas/Negativas (FR-017)
--   - `detalhes TEXT NOT NULL`             → descrição no portal
--   - `apresentar_portal BOOLEAN`          → visibilidade (FR-017)
--   - `ocorrencias_alunos(ocorrencia_id, aluno_id)` → vínculo N:N com o aluno
-- Por isso esta migration NÃO altera colunas: cria apenas o índice
-- usado pelas leituras do portal e documenta o schema real.
-- (O código do portal em `src/lib/actions/portal.ts` lê esse schema;
--  `painel-pessoa.getOcorrencias` ainda usa person_id/descricao e
--  precisa de ajuste em spec futura — fora do escopo do portal.)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_ocorrencias_alunos_aluno
  ON ocorrencias_alunos(aluno_id);

COMMENT ON COLUMN ocorrencias.titulo IS 'Título exibido no Portal do Responsável';
COMMENT ON COLUMN ocorrencias.tipo IS 'Natureza no portal: positiva|negativa (filtro Todas/Positivas/Negativas, FR-017)';
COMMENT ON COLUMN ocorrencias.detalhes IS 'Descrição exibida no Portal do Responsável';
COMMENT ON COLUMN ocorrencias.apresentar_portal IS 'Portal lista somente =true (FR-017)';
COMMENT ON TABLE ocorrencias_alunos IS 'Vínculo N:N ocorrência↔aluno; base do filtro por aluno no Portal do Responsável';
