-- ============================================
-- BRAVERY SGE - Situações do Aluno Matriculado
-- Adiciona as situações finais do Censo Escolar ao
-- CHECK de academico_matriculas.situacao
-- ============================================

ALTER TABLE academico_matriculas
  DROP CONSTRAINT IF EXISTS academico_matriculas_situacao_check;

ALTER TABLE academico_matriculas
  ADD CONSTRAINT academico_matriculas_situacao_check
  CHECK (situacao IN (
    'Ativo',
    'Transferido',
    'Desistente',
    'Óbito',
    'Reclassificado',
    'Remanejado',
    'Aprovado',
    'Aprovado por conselho de classe',
    'Reprovado',
    'Reprovado por frequência',
    'Aprovado concluinte',
    'Sem movimentação'
  ));