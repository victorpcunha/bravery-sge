-- ============================================
-- BRAVERY SGE - Adicionar data_saida à matrícula
-- ============================================

ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS data_saida DATE;

COMMENT ON COLUMN academico_matriculas.data_saida IS 'Data de saída/desligamento do aluno da turma. Quando preenchida, indica que o vínculo foi encerrado por transferência, remanejamento, desistência etc.';
