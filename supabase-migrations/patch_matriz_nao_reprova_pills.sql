-- Migration: Pills "Não reprova por nota / frequência" por disciplina da matriz (spec 032)
-- 1 migration, sem CLI Supabase: aplicar via SQL Editor.

ALTER TABLE academico_matriz_disciplinas
  ADD COLUMN IF NOT EXISTS nao_reprova_nota BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nao_reprova_frequencia BOOLEAN NOT NULL DEFAULT false;

-- Backfill do legado: desconsidera_reprovacao=true equivalia a "não reprova por nada"
UPDATE academico_matriz_disciplinas
SET nao_reprova_nota = true,
    nao_reprova_frequencia = true
WHERE desconsidera_reprovacao = true
  AND (nao_reprova_nota = false OR nao_reprova_frequencia = false);

COMMENT ON COLUMN academico_matriz_disciplinas.nao_reprova_nota IS 'Exclui a disciplina do cômputo de média mínima (Diário/Fechamento/Conselho/Boletim/Rendimento)';
COMMENT ON COLUMN academico_matriz_disciplinas.nao_reprova_frequencia IS 'Exclui a disciplina do cômputo de frequência mínima (Diário/Fechamento/Boletim/Rendimento)';
