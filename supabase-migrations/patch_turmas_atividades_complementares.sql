-- ============================================
-- BRAVERY SGE - Spec 029: Atividades Complementares da Turma
-- Registro 20 (atividade_complementar_1..6)
-- Ordem de adição na UI = posição 1..6; <6 atividades = excedentes NULL
-- ============================================

ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_1 VARCHAR(3);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_2 VARCHAR(3);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_3 VARCHAR(3);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_4 VARCHAR(3);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_5 VARCHAR(3);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_6 VARCHAR(3);

-- Spec 029 FR-006: turma de AEE / Atividade Complementar (pura) não possui etapa —
-- etapa_ensino_id passa a aceitar NULL (obrigatória só p/ Curricular / tipo 9)
ALTER TABLE turmas ALTER COLUMN etapa_ensino_id DROP NOT NULL;
