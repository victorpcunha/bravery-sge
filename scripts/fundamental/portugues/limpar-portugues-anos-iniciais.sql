-- LIMPAR DADOS DE LÍNGUA PORTUGUESA (anos iniciais)
-- Executar ANTES de rodar os 3 SQLs

BEGIN;

-- 1º: Apagar habilidades
DELETE FROM bncc_habilidades
WHERE objeto_conhecimento_id IN (
  SELECT oc.id FROM bncc_objetos_conhecimento oc
  JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
  WHERE ut.disciplina = 'Língua /Literatura Portuguesa'
);

-- 2º: Apagar objetos de conhecimento
DELETE FROM bncc_objetos_conhecimento
WHERE unidade_tematica_id IN (
  SELECT id FROM bncc_unidades_tematicas
  WHERE disciplina = 'Língua /Literatura Portuguesa'
);

-- 3º: Apagar unidades temáticas
DELETE FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura Portuguesa'
AND campo_atuacao IS NOT NULL;  -- só as que têm campo_atuacao (anos iniciais)

-- 4º: Apagar campos de atuação (anos iniciais)
DELETE FROM bncc_campos_atuacao
WHERE etapa_ensino = 'anos_iniciais';

COMMIT;
