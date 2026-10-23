-- ============================================
-- BRAVERY SGE - Spec 029 (hotfix): Atividades Complementares da Turma
-- As colunas atividade_complementar_1..6 foram criadas como VARCHAR(3),
-- mas os códigos da Tabela de Tipo de Atividade Complementar 2026 têm
-- 5 dígitos (ex.: 22019). O INSERT falhava com:
--   22001 value too long for type character varying(3)
-- Aplicar somente em ambientes onde a M-01 já rodou com VARCHAR(3).
-- ============================================

ALTER TABLE turmas ALTER COLUMN atividade_complementar_1 TYPE VARCHAR(5);
ALTER TABLE turmas ALTER COLUMN atividade_complementar_2 TYPE VARCHAR(5);
ALTER TABLE turmas ALTER COLUMN atividade_complementar_3 TYPE VARCHAR(5);
ALTER TABLE turmas ALTER COLUMN atividade_complementar_4 TYPE VARCHAR(5);
ALTER TABLE turmas ALTER COLUMN atividade_complementar_5 TYPE VARCHAR(5);
ALTER TABLE turmas ALTER COLUMN atividade_complementar_6 TYPE VARCHAR(5);
