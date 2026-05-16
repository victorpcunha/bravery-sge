-- MATEMÁTICA - ANOS FINAIS (6º AO 9º ANO)

BEGIN;

DELETE FROM bncc_habilidades
WHERE objeto_conhecimento_id IN (
  SELECT oc.id FROM bncc_objetos_conhecimento oc
  JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
  WHERE ut.disciplina = 'Matemática'
);

DELETE FROM bncc_objetos_conhecimento
WHERE unidade_tematica_id IN (
  SELECT id FROM bncc_unidades_tematicas
  WHERE disciplina = 'Matemática'
);

DELETE FROM bncc_unidades_tematicas
WHERE disciplina = 'Matemática';


INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino)
SELECT 'Matemática', 'Números', 'anos_finais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Números' AND etapa_ensino = 'anos_finais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sistema de numeração decimal: características, leitura, escrita e comparação de números naturais e racionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sistema de numeração decimal: características, leitura, escrita e comparação de números naturais e racionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA01', 'Comparar, ordenar, ler e escrever números naturais e números racionais usando reta numérica.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Sistema de numeração decimal: características, leitura, escrita e comparação de números naturais e racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sistema de numeração decimal'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sistema de numeração decimal');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA02', 'Reconhecer o sistema de numeração decimal e suas características (base, valor posicional, zero).', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Sistema de numeração decimal'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Operações com números naturais. Divisão euclidiana'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Operações com números naturais. Divisão euclidiana');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA03', 'Resolver problemas envolvendo cálculos com números naturais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Operações com números naturais. Divisão euclidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fluxograma para paridade. Múltiplos e divisores. Números primos e compostos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fluxograma para paridade. Múltiplos e divisores. Números primos e compostos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA04', 'Construir algoritmo em linguagem natural e fluxograma para problema simples.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Fluxograma para paridade. Múltiplos e divisores. Números primos e compostos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Múltiplos e divisores'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Múltiplos e divisores');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA05', 'Classificar números em primos e compostos e estabelecer critérios de divisibilidade.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Múltiplos e divisores'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA06', 'Resolver problemas envolvendo ideias de múltiplo e divisor.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Múltiplos e divisores'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Frações: significados, equivalência, comparação, adição e subtração'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Frações: significados, equivalência, comparação, adição e subtração');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA07', 'Compreender, comparar e ordenar frações associadas às ideias de partes de inteiros.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Frações: significados, equivalência, comparação, adição e subtração'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Frações e números decimais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Frações e números decimais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA08', 'Reconhecer que números racionais podem ser expressos nas formas fracionária e decimal.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Frações e números decimais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Cálculo da fração de uma quantidade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Cálculo da fração de uma quantidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA09', 'Resolver problemas envolvendo cálculo da fração de uma quantidade.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Cálculo da fração de uma quantidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Adição e subtração de frações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Adição e subtração de frações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA10', 'Resolver problemas envolvendo adição ou subtração com frações.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Adição e subtração de frações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Operações com números racionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Operações com números racionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA11', 'Resolver problemas com números racionais na forma decimal envolvendo as quatro operações.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Operações com números racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Aproximação de números para potências de 10'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Aproximação de números para potências de 10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA12', 'Fazer estimativas de quantidades e aproximar números para múltiplos de potência de 10.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Aproximação de números para potências de 10'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Cálculo de porcentagens'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Cálculo de porcentagens');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA13', 'Resolver problemas envolvendo porcentagens sem regra de três.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Cálculo de porcentagens'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA13');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino)
SELECT 'Matemática', 'Álgebra', 'anos_finais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Álgebra' AND etapa_ensino = 'anos_finais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Propriedades da igualdade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Propriedades da igualdade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA14', 'Reconhecer que a igualdade não se altera ao adicionar, subtrair, multiplicar ou dividir ambos os membros.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Propriedades da igualdade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Partição de um todo em duas partes desiguais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Partição de um todo em duas partes desiguais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA15', 'Resolver problemas envolvendo partilha de quantidade em duas partes desiguais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Partição de um todo em duas partes desiguais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA15');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino)
SELECT 'Matemática', 'Geometria', 'anos_finais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Geometria' AND etapa_ensino = 'anos_finais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Plano cartesiano: pares ordenados'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Plano cartesiano: pares ordenados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA16', 'Associar pares ordenados a pontos do plano cartesiano (1º quadrante).', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Plano cartesiano: pares ordenados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Prismas e pirâmides: planificações e relações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Prismas e pirâmides: planificações e relações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA17', 'Quantificar e relacionar número de vértices, faces e arestas de prismas e pirâmides.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Prismas e pirâmides: planificações e relações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Polígonos: classificações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Polígonos: classificações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA18', 'Reconhecer, nomear e comparar polígonos considerando lados, vértices e ângulos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Polígonos: classificações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Triângulos: classificação'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Triângulos: classificação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA19', 'Identificar características dos triângulos e classificá-los.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Triângulos: classificação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Quadriláteros: classificação'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Quadriláteros: classificação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA20', 'Identificar características dos quadriláteros e classificá-los.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Quadriláteros: classificação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Ampliação e redução de figuras planas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Ampliação e redução de figuras planas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA21', 'Construir figuras planas semelhantes em ampliação e redução.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Ampliação e redução de figuras planas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Retas paralelas e perpendiculares'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Retas paralelas e perpendiculares');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA22', 'Utilizar instrumentos para representação de retas paralelas e perpendiculares.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Retas paralelas e perpendiculares'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Algoritmos para construções geométricas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Algoritmos para construções geométricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA23', 'Construir algoritmo para situações passo a passo.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Algoritmos para construções geométricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA23');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino)
SELECT 'Matemática', 'Grandezas e medidas', 'anos_finais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Grandezas e medidas' AND etapa_ensino = 'anos_finais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Problemas sobre medidas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Problemas sobre medidas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA24', 'Resolver problemas envolvendo comprimento, massa, tempo, temperatura, área, capacidade e volume.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Problemas sobre medidas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA24');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Ângulos: noção, usos e medida'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Ângulos: noção, usos e medida');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA25', 'Reconhecer a abertura do ângulo como grandeza.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Ângulos: noção, usos e medida'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Ângulos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Ângulos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA26', 'Resolver problemas envolvendo noção de ângulo em diferentes contextos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Ângulos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA26');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA27', 'Determinar medidas da abertura de ângulos com transferidor.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Ângulos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Plantas baixas e vistas aéreas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Plantas baixas e vistas aéreas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA28', 'Interpretar, descrever e desenhar plantas baixas simples.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Plantas baixas e vistas aéreas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA28');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Perímetro e área do quadrado'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Perímetro e área do quadrado');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA29', 'Analisar mudanças no perímetro e área ao ampliar ou reduzir lados do quadrado.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Perímetro e área do quadrado'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA29');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino)
SELECT 'Matemática', 'Probabilidade e estatística', 'anos_finais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Probabilidade e estatística' AND etapa_ensino = 'anos_finais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Cálculo de probabilidade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Cálculo de probabilidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA30', 'Calcular probabilidade de evento aleatório expressando-a por número racional.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Cálculo de probabilidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA30');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Leitura e interpretação de tabelas e gráficos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Leitura e interpretação de tabelas e gráficos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA31', 'Identificar variáveis, frequências e elementos constitutivos em gráficos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Leitura e interpretação de tabelas e gráficos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA31');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Interpretação de dados'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Interpretação de dados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA32', 'Interpretar dados de pesquisas sobre contextos ambientais, sustentabilidade, trânsito.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Interpretação de dados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA32');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coleta de dados e construção de gráficos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coleta de dados e construção de gráficos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA33', 'Planejar e coletar dados de pesquisa e usar planilhas eletrônicas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Coleta de dados e construção de gráficos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA33');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fluxogramas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fluxogramas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06MA34', 'Interpretar e desenvolver fluxogramas simples.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Fluxogramas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06MA34');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Múltiplos e divisores de um número natural'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Múltiplos e divisores de um número natural');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA01', 'Resolver problemas com números naturais envolvendo noções de divisor e múltiplo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Múltiplos e divisores de um número natural'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Cálculo de porcentagens e acréscimos/decréscimos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Cálculo de porcentagens e acréscimos/decréscimos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA02', 'Resolver problemas envolvendo porcentagens com acréscimos e decréscimos simples.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Cálculo de porcentagens e acréscimos/decréscimos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Números inteiros: usos, ordenação e operações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Números inteiros: usos, ordenação e operações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA03', 'Comparar e ordenar números inteiros e associá-los a pontos da reta numérica.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Números inteiros: usos, ordenação e operações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Números inteiros'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Números inteiros');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA04', 'Resolver problemas envolvendo operações com números inteiros.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Números inteiros'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fração e seus significados'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fração e seus significados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA05', 'Resolver um mesmo problema utilizando diferentes algoritmos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Fração e seus significados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fração'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fração');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA06', 'Reconhecer que resoluções de problemas com mesma estrutura podem usar mesmos procedimentos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Fração'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fluxograma'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fluxograma');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA07', 'Representar por fluxograma os passos para resolver um grupo de problemas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Fluxograma'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Frações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Frações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA08', 'Comparar e ordenar frações associadas às ideias de partes de inteiros.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Frações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Razão e fração'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Razão e fração');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA09', 'Utilizar associação entre razão e fração na resolução de problemas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Razão e fração'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Números racionais: ordenação e operações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Números racionais: ordenação e operações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA10', 'Comparar e ordenar números racionais e associá-los a pontos da reta numérica.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Números racionais: ordenação e operações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Multiplicação e divisão de números racionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Multiplicação e divisão de números racionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA11', 'Compreender e utilizar multiplicação e divisão de números racionais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Multiplicação e divisão de números racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA12', 'Resolver problemas envolvendo operações com números racionais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Operações com números racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Linguagem algébrica: variável e incógnita'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Linguagem algébrica: variável e incógnita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA13', 'Compreender ideia de variável representada por letra ou símbolo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Linguagem algébrica: variável e incógnita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sequências recursivas e não recursivas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sequências recursivas e não recursivas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA14', 'Classificar sequências em recursivas e não recursivas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Sequências recursivas e não recursivas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Simbologia algébrica'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Simbologia algébrica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA15', 'Utilizar simbologia algébrica para expressar regularidades em sequências.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Simbologia algébrica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Equivalência de expressões algébricas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Equivalência de expressões algébricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA16', 'Reconhecer se duas expressões algébricas são equivalentes.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Equivalência de expressões algébricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Proporcionalidade direta e inversa'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Proporcionalidade direta e inversa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA17', 'Resolver problemas de proporcionalidade direta e inversa entre duas grandezas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Proporcionalidade direta e inversa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Equações polinomiais do 1º grau'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Equações polinomiais do 1º grau');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA18', 'Resolver problemas representados por equações de 1º grau ax + b = c.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Equações polinomiais do 1º grau'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Transformações no plano cartesiano'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Transformações no plano cartesiano');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA19', 'Realizar transformações de polígonos no plano cartesiano.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Transformações no plano cartesiano'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Simétricos no plano cartesiano'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Simétricos no plano cartesiano');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA20', 'Reconhecer e representar o simétrico de figuras no plano cartesiano.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Simétricos no plano cartesiano'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Simetrias de translação, rotação e reflexão'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Simetrias de translação, rotação e reflexão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA21', 'Reconhecer e construir figuras obtidas por simetrias.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Simetrias de translação, rotação e reflexão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Circunferência como lugar geométrico'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Circunferência como lugar geométrico');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA22', 'Construir circunferências e reconhecê-las como lugar geométrico.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Circunferência como lugar geométrico'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Ângulos formados por retas paralelas e transversal'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Ângulos formados por retas paralelas e transversal');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA23', 'Verificar relações entre ângulos formados por retas paralelas cortadas por transversal.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Ângulos formados por retas paralelas e transversal'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA23');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Triângulos: construção e condição de existência'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Triângulos: construção e condição de existência');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA24', 'Construir triângulos e reconhecer condição de existência.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Triângulos: construção e condição de existência'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA24');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Triângulos: rigidez geométrica'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Triângulos: rigidez geométrica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA25', 'Reconhecer rigidez geométrica dos triângulos e aplicações.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Triângulos: rigidez geométrica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Algoritmo para construção de triângulo'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Algoritmo para construção de triângulo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA26', 'Descrever algoritmo para construção de triângulo conhecidos os três lados.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Algoritmo para construção de triângulo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA26');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Polígonos regulares'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Polígonos regulares');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA27', 'Calcular medidas de ângulos internos de polígonos regulares.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Polígonos regulares'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Algoritmo para polígono regular'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Algoritmo para polígono regular');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA28', 'Descrever algoritmo para construção de polígono regular.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Algoritmo para polígono regular'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA28');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Problemas envolvendo medições'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Problemas envolvendo medições');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA29', 'Resolver problemas envolvendo medidas de grandezas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Problemas envolvendo medições'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA29');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Volume de blocos retangulares'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Volume de blocos retangulares');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA30', 'Resolver problemas de cálculo de volume de blocos retangulares.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Volume de blocos retangulares'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA30');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Área de triângulos e quadriláteros'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Área de triângulos e quadriláteros');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA31', 'Estabelecer expressões de cálculo de área de triângulos e quadriláteros.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Área de triângulos e quadriláteros'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA31');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Área de figuras decompostas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Área de figuras decompostas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA32', 'Resolver problemas de área de figuras decompostas por quadrados, retângulos e triângulos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Área de figuras decompostas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA32');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Comprimento da circunferência'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Comprimento da circunferência');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA33', 'Estabelecer o número π como razão entre circunferência e diâmetro.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Comprimento da circunferência'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA33');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Experimentos aleatórios'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Experimentos aleatórios');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA34', 'Planejar e realizar experimentos aleatórios com cálculo de probabilidades.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Experimentos aleatórios'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA34');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Média e amplitude'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Média e amplitude');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA35', 'Compreender significado de média estatística e relacioná-la com amplitude.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Média e amplitude'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA35');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pesquisa amostral e censitária'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pesquisa amostral e censitária');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA36', 'Planejar e realizar pesquisa envolvendo tema da realidade social.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Pesquisa amostral e censitária'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA36');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Gráficos de setores'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Gráficos de setores');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07MA37', 'Interpretar e analisar dados em gráfico de setores.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Gráficos de setores'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07MA37');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Notação científica'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Notação científica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA01', 'Efetuar cálculos com potências de expoentes inteiros e usar notação científica.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Notação científica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Potenciação e radiciação'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Potenciação e radiciação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA02', 'Resolver problemas usando relação entre potenciação e radiciação.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Potenciação e radiciação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Princípio multiplicativo da contagem'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Princípio multiplicativo da contagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA03', 'Resolver problemas de contagem com princípio multiplicativo.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Princípio multiplicativo da contagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Porcentagens'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Porcentagens');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA04', 'Resolver problemas envolvendo cálculo de porcentagens.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Porcentagens'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Dízimas periódicas: fração geratriz'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Dízimas periódicas: fração geratriz');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA05', 'Reconhecer e obter fração geratriz para dízima periódica.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Dízimas periódicas: fração geratriz'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Valor numérico de expressões algébricas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Valor numérico de expressões algébricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA06', 'Resolver problemas envolvendo cálculo do valor numérico de expressões algébricas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Valor numérico de expressões algébricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Equação linear de 1º grau e reta no plano'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Equação linear de 1º grau e reta no plano');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA07', 'Associar equação linear de 1º grau com duas incógnitas a uma reta.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Equação linear de 1º grau e reta no plano'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sistema de equações de 1º grau'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sistema de equações de 1º grau');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA08', 'Resolver e elaborar problemas com sistemas de equações de 1º grau.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Sistema de equações de 1º grau'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Equação polinomial de 2º grau ax² = b'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Equação polinomial de 2º grau ax² = b');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA09', 'Resolver problemas com equações de 2º grau do tipo ax² = b.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Equação polinomial de 2º grau ax² = b'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA10', 'Identificar regularidade de sequência não recursiva e construir fluxograma.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Sequências recursivas e não recursivas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sequências recursivas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sequências recursivas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA11', 'Identificar regularidade de sequência recursiva e construir fluxograma.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Sequências recursivas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação de grandezas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação de grandezas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA12', 'Identificar variação direta, inversa ou não proporcional entre grandezas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Variação de grandezas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Proporcionalidade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Proporcionalidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA13', 'Resolver problemas envolvendo grandezas direta ou inversamente proporcionais.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Proporcionalidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Congruência de triângulos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Congruência de triângulos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA14', 'Demonstrar propriedades de quadriláteros por congruência de triângulos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Congruência de triângulos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construções geométricas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construções geométricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA15', 'Construir mediatriz, bissetriz, ângulos de 90°, 60°, 45° e 30°.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Construções geométricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Hexágono regular'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Hexágono regular');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA16', 'Descrever algoritmo para construção de hexágono regular.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Hexágono regular'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Mediatriz e bissetriz como lugares geométricos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Mediatriz e bissetriz como lugares geométricos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA17', 'Aplicar conceitos de mediatriz e bissetriz na resolução de problemas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Mediatriz e bissetriz como lugares geométricos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Transformações geométricas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Transformações geométricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA18', 'Reconhecer figuras obtidas por composições de transformações geométricas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Transformações geométricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Área de figuras planas e círculo'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Área de figuras planas e círculo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA19', 'Resolver problemas envolvendo área de quadriláteros, triângulos e círculos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Área de figuras planas e círculo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Volume e capacidade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Volume e capacidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA20', 'Reconhecer relação entre litro e decímetro cúbico.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Volume e capacidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Volume de bloco retangular'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Volume de bloco retangular');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA21', 'Resolver problemas de volume de recipiente com formato de bloco retangular.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Volume de bloco retangular'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Princípio multiplicativo e probabilidade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Princípio multiplicativo e probabilidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA22', 'Calcular probabilidade usando princípio multiplicativo e reconhecer soma = 1.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Princípio multiplicativo e probabilidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Tipos de gráficos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Tipos de gráficos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA23', 'Avaliar adequação de diferentes tipos de gráficos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Tipos de gráficos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA23');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variável contínua em classes'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variável contínua em classes');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA24', 'Classificar frequências de variável contínua em classes.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Variável contínua em classes'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA24');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de tendência central e dispersão'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de tendência central e dispersão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA25', 'Obter média, moda e mediana e relacionar com dispersão.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Medidas de tendência central e dispersão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pesquisa censitária ou amostral'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pesquisa censitária ou amostral');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA26', 'Selecionar razões para pesquisas amostrais e reconhecer tipos de amostragem.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Pesquisa censitária ou amostral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA26');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Execução de pesquisa amostral'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Execução de pesquisa amostral');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08MA27', 'Planejar e executar pesquisa amostral e escrever relatório.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Execução de pesquisa amostral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08MA27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Números reais e irracionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Números reais e irracionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA01', 'Reconhecer existência de segmentos cujo comprimento não é expresso por número racional.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Números reais e irracionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Números irracionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Números irracionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA02', 'Reconhecer número irracional e estimar localização na reta numérica.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Números irracionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Potências com expoentes negativos e fracionários'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Potências com expoentes negativos e fracionários');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA03', 'Efetuar cálculos com números reais inclusive potências com expoentes fracionários.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Potências com expoentes negativos e fracionários'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA04', 'Resolver problemas com números reais inclusive em notação científica.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Notação científica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Porcentagens sucessivas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Porcentagens sucessivas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA05', 'Resolver problemas com percentuais sucessivos e taxas percentuais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Porcentagens sucessivas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Funções: representações numérica, algébrica e gráfica'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Funções: representações numérica, algébrica e gráfica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA06', 'Compreender funções como relação de dependência entre duas variáveis.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Funções: representações numérica, algébrica e gráfica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Razão entre grandezas de espécies diferentes'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Razão entre grandezas de espécies diferentes');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA07', 'Resolver problemas envolvendo razão entre grandezas de espécies diferentes.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Razão entre grandezas de espécies diferentes'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA08', 'Resolver problemas de proporcionalidade direta e inversa entre grandezas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Proporcionalidade direta e inversa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fatoração e produtos notáveis. Equações de 2º grau'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fatoração e produtos notáveis. Equações de 2º grau');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA09', 'Compreender fatoração com base em produtos notáveis.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Fatoração e produtos notáveis. Equações de 2º grau'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA10', 'Demonstrar relações entre ângulos formados por retas paralelas cortadas por transversal.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Ângulos formados por retas paralelas e transversal'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Arcos e ângulos na circunferência'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Arcos e ângulos na circunferência');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA11', 'Resolver problemas com relações entre arcos e ângulos na circunferência.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Arcos e ângulos na circunferência'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Semelhança de triângulos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Semelhança de triângulos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA12', 'Reconhecer condições para que dois triângulos sejam semelhantes.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Semelhança de triângulos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Teorema de Pitágoras'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Teorema de Pitágoras');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA13', 'Demonstrar relações métricas do triângulo retângulo incluindo Pitágoras.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Teorema de Pitágoras'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Teorema de Pitágoras e proporcionalidade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Teorema de Pitágoras e proporcionalidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA14', 'Resolver problemas de aplicação do teorema de Pitágoras.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Teorema de Pitágoras e proporcionalidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA15', 'Descrever algoritmo para construção de polígono regular com régua e compasso.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Polígonos regulares'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Distância entre pontos no plano cartesiano'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Distância entre pontos no plano cartesiano');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA16', 'Determinar ponto médio e distância entre dois pontos no plano cartesiano.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Distância entre pontos no plano cartesiano'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Vistas ortogonais de figuras espaciais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Vistas ortogonais de figuras espaciais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA17', 'Reconhecer vistas ortogonais de figuras espaciais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Vistas ortogonais de figuras espaciais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Unidades para medidas muito grandes e pequenas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Unidades para medidas muito grandes e pequenas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA18', 'Reconhecer unidades para medidas muito grandes ou muito pequenas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Unidades para medidas muito grandes e pequenas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Volume de prismas e cilindros'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Volume de prismas e cilindros');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA19', 'Resolver problemas de volume de prismas e cilindros retos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Volume de prismas e cilindros'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Eventos dependentes e independentes'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Eventos dependentes e independentes');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA20', 'Reconhecer eventos independentes e dependentes e calcular probabilidade.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Eventos dependentes e independentes'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Análise de gráficos da mídia'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Análise de gráficos da mídia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA21', 'Analisar gráficos divulgados pela mídia identificando elementos que induzem a erro.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Análise de gráficos da mídia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção de gráficos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção de gráficos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA22', 'Escolher e construir o gráfico mais adequado para conjunto de dados.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Construção de gráficos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pesquisa amostral e relatório'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pesquisa amostral e relatório');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09MA23', 'Planejar e executar pesquisa amostral e comunicar resultados em relatório.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_finais'
AND oc.objeto_conhecimento = 'Pesquisa amostral e relatório'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09MA23');


COMMIT;
