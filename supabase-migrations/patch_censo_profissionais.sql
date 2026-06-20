-- ============================================
-- BRAVERY SGE - Censo INEP 2026: Campos de Profissionais por Turma
-- Registro 50 (Vínculo Profissional × Turma)
-- ============================================

-- ============================================
-- FUNÇÃO CENSO (Registro 50 - campo 9)
-- Códigos INEP: 1-Docente, 2-Auxiliar, 3-Monitor, 4-Tradutor/Intérprete de Libras,
-- 5-Docente Titular, 6-Profissional de Apoio, 7-Guia-Intérprete, 8-Intérprete de LIBRAS,
-- 9-Profissional de apoio escolar para estudante com deficiência
-- ============================================

ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS funcao_censo VARCHAR(1);

-- ============================================
-- SITUAÇÃO FUNCIONAL (Registro 50 - campo 10)
-- Códigos: 1-Concursado/Efetivo, 2-Contrato Temporário, 3-Contrato Terceirizado, 4-Contrato CLT
-- ============================================

ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS situacao_funcional VARCHAR(1);

-- ============================================
-- ÁREAS DO CONHECIMENTO CENSO (Registro 50 - campos 11-35)
-- 25 slots VARCHAR(2) com código INEP da área
-- ============================================

ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_1 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_2 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_3 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_4 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_5 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_6 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_7 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_8 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_9 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_10 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_11 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_12 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_13 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_14 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_15 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_16 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_17 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_18 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_19 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_20 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_21 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_22 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_23 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_24 VARCHAR(2);
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS area_censo_25 VARCHAR(2);

-- ============================================
-- ITINERÁRIO FORMATIVO (Registro 50 - campos 36-40)
-- Flags indicando se o profissional leciona em cada itinerário
-- ============================================

ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS leciona_linguagens BOOLEAN;
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS leciona_matematica BOOLEAN;
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS leciona_natureza BOOLEAN;
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS leciona_humanas BOOLEAN;
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS leciona_iftp BOOLEAN;

-- ============================================
-- FIM
-- ============================================
