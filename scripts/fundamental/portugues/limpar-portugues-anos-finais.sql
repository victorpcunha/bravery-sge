-- LIMPAR LÍNGUA PORTUGUESA - ANOS FINAIS (6º AO 9º)
-- Executar ANTES dos 3 scripts de dados

BEGIN;

DELETE FROM bncc_habilidades
WHERE objeto_conhecimento_id IN (
  SELECT oc.id FROM bncc_objetos_conhecimento oc
  JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
  WHERE ut.disciplina = 'Língua /Literatura Portuguesa'
  AND ut.etapa_ensino = 'anos_finais'
);

DELETE FROM bncc_objetos_conhecimento
WHERE unidade_tematica_id IN (
  SELECT id FROM bncc_unidades_tematicas
  WHERE disciplina = 'Língua /Literatura Portuguesa'
  AND etapa_ensino = 'anos_finais'
);

DELETE FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura Portuguesa'
AND etapa_ensino = 'anos_finais';

COMMIT;
