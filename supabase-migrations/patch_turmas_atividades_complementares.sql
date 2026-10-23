-- ============================================
-- BRAVERY SGE - Spec 029: Atividades Complementares da Turma
-- Registro 20 (atividade_complementar_1..6)
-- Ordem de adição na UI = posição 1..6; <6 atividades = excedentes NULL
-- ============================================

-- Códigos INEP da Tabela de Tipo de Atividade Complementar têm 5 dígitos (ex.: 22019).
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_1 VARCHAR(5);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_2 VARCHAR(5);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_3 VARCHAR(5);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_4 VARCHAR(5);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_5 VARCHAR(5);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_6 VARCHAR(5);

-- Spec 029 FR-006: turma de AEE / Atividade Complementar (pura) não possui etapa —
-- etapa_ensino_id passa a aceitar NULL (obrigatória só p/ Curricular / tipo 9)
ALTER TABLE turmas ALTER COLUMN etapa_ensino_id DROP NOT NULL;
