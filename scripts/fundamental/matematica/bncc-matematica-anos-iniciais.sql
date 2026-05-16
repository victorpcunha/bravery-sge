-- MATEMÁTICA - ANOS INICIAIS (1º AO 5º ANO)

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
SELECT 'Matemática', 'Números', 'anos_iniciais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Números' AND etapa_ensino = 'anos_iniciais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Contagem de rotina. Contagem ascendente e descendente. Reconhecimento de números no contexto diário'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Contagem de rotina. Contagem ascendente e descendente. Reconhecimento de números no contexto diário');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA01', 'Utilizar números naturais como indicador de quantidade ou de ordem.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Contagem de rotina. Contagem ascendente e descendente. Reconhecimento de números no contexto diário'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Quantificação de elementos de uma coleção: estimativas, contagem, pareamento e comparação'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Quantificação de elementos de uma coleção: estimativas, contagem, pareamento e comparação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA02', 'Contar de maneira exata ou aproximada utilizando diferentes estratégias.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Quantificação de elementos de uma coleção: estimativas, contagem, pareamento e comparação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Quantificação de elementos de uma coleção'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Quantificação de elementos de uma coleção');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA03', 'Estimar e comparar quantidades de objetos de dois conjuntos.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Quantificação de elementos de uma coleção'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Leitura, escrita e comparação de números naturais (até 100). Reta numérica'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Leitura, escrita e comparação de números naturais (até 100). Reta numérica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA04', 'Contar a quantidade de objetos de coleções até 100 unidades.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura, escrita e comparação de números naturais (até 100). Reta numérica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA05', 'Comparar números naturais de até duas ordens.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura, escrita e comparação de números naturais (até 100). Reta numérica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção de fatos básicos da adição'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção de fatos básicos da adição');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA06', 'Construir fatos básicos da adição e utilizá-los em cálculos.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Construção de fatos básicos da adição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Composição e decomposição de números naturais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Composição e decomposição de números naturais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA07', 'Compor e decompor número de até duas ordens por meio de adições.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Composição e decomposição de números naturais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Problemas envolvendo diferentes significados da adição e da subtração'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Problemas envolvendo diferentes significados da adição e da subtração');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA08', 'Resolver problemas de adição e subtração com números de até dois algarismos.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas envolvendo diferentes significados da adição e da subtração'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA08');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino)
SELECT 'Matemática', 'Álgebra', 'anos_iniciais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Álgebra' AND etapa_ensino = 'anos_iniciais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Padrões figurais e numéricos: investigação de regularidades em sequências'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Padrões figurais e numéricos: investigação de regularidades em sequências');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA09', 'Organizar e ordenar objetos familiares por meio de atributos.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Padrões figurais e numéricos: investigação de regularidades em sequências'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sequências recursivas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sequências recursivas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA10', 'Descrever elementos ausentes em sequências recursivas de números naturais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Sequências recursivas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA10');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino)
SELECT 'Matemática', 'Geometria', 'anos_iniciais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Geometria' AND etapa_ensino = 'anos_iniciais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Localização de objetos e de pessoas no espaço'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Localização de objetos e de pessoas no espaço');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA11', 'Descrever a localização de pessoas e de objetos no espaço.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Localização de objetos e de pessoas no espaço'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA12', 'Descrever a localização segundo um dado ponto de referência.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Localização de objetos e de pessoas no espaço'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras geométricas espaciais: reconhecimento e relações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras geométricas espaciais: reconhecimento e relações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA13', 'Relacionar figuras geométricas espaciais a objetos familiares.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras geométricas espaciais: reconhecimento e relações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras geométricas planas: reconhecimento do formato das faces'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras geométricas planas: reconhecimento do formato das faces');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA14', 'Identificar e nomear figuras planas (círculo, quadrado, retângulo, triângulo).', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras geométricas planas: reconhecimento do formato das faces'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA14');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino)
SELECT 'Matemática', 'Grandezas e medidas', 'anos_iniciais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Grandezas e medidas' AND etapa_ensino = 'anos_iniciais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de comprimento, massa e capacidade: comparações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de comprimento, massa e capacidade: comparações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA15', 'Comparar comprimentos, capacidades ou massas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de comprimento, massa e capacidade: comparações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de tempo: unidades de medida e uso do calendário'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de tempo: unidades de medida e uso do calendário');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA16', 'Relatar sequência de acontecimentos relativos a um dia.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de tempo: unidades de medida e uso do calendário'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de tempo'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de tempo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA17', 'Reconhecer e relacionar períodos do dia, dias da semana e meses do ano.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de tempo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA18', 'Produzir a escrita de uma data apresentando dia, mês e ano.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de tempo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sistema monetário brasileiro: reconhecimento de cédulas e moedas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sistema monetário brasileiro: reconhecimento de cédulas e moedas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA19', 'Reconhecer valores de moedas e cédulas do sistema monetário brasileiro.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Sistema monetário brasileiro: reconhecimento de cédulas e moedas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA19');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino)
SELECT 'Matemática', 'Probabilidade e estatística', 'anos_iniciais'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Matemática' AND unidade_tematica = 'Probabilidade e estatística' AND etapa_ensino = 'anos_iniciais');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Noção de acaso'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Noção de acaso');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA20', 'Classificar eventos envolvendo o acaso em situações do cotidiano.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Noção de acaso'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Leitura de tabelas e de gráficos de colunas simples'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Leitura de tabelas e de gráficos de colunas simples');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA21', 'Ler dados expressos em tabelas e em gráficos de colunas simples.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura de tabelas e de gráficos de colunas simples'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coleta e organização de informações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coleta e organização de informações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01MA22', 'Realizar pesquisa com até duas variáveis categóricas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Coleta e organização de informações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01MA22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Leitura, escrita, comparação e ordenação de números de até três ordens'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Leitura, escrita, comparação e ordenação de números de até três ordens');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA01', 'Comparar e ordenar números naturais (até centenas).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura, escrita, comparação e ordenação de números de até três ordens'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Leitura, escrita, comparação e ordenação'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Leitura, escrita, comparação e ordenação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA02', 'Fazer estimativas da quantidade de objetos (até 1000 unidades).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura, escrita, comparação e ordenação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA03', 'Comparar quantidades de objetos de dois conjuntos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura, escrita, comparação e ordenação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Composição e decomposição de números naturais (até 1000)'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Composição e decomposição de números naturais (até 1000)');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA04', 'Compor e decompor números naturais de até três ordens.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Composição e decomposição de números naturais (até 1000)'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção de fatos fundamentais da adição e da subtração'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção de fatos fundamentais da adição e da subtração');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA05', 'Construir fatos básicos da adição e subtração.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Construção de fatos fundamentais da adição e da subtração'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA06', 'Resolver problemas de adição e subtração com números de até três ordens.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas envolvendo diferentes significados da adição e da subtração'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Problemas envolvendo adição de parcelas iguais (multiplicação)'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Problemas envolvendo adição de parcelas iguais (multiplicação)');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA07', 'Resolver problemas de multiplicação (por 2, 3, 4 e 5).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas envolvendo adição de parcelas iguais (multiplicação)'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Problemas envolvendo dobro, metade, triplo e terça parte'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Problemas envolvendo dobro, metade, triplo e terça parte');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA08', 'Resolver problemas envolvendo dobro, metade, triplo e terça parte.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas envolvendo dobro, metade, triplo e terça parte'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção de sequências repetitivas e recursivas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção de sequências repetitivas e recursivas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA09', 'Construir sequências de números naturais em ordem crescente ou decrescente.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Construção de sequências repetitivas e recursivas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Identificação de regularidade de sequências'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Identificação de regularidade de sequências');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA10', 'Descrever padrão de sequências repetitivas e recursivas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Identificação de regularidade de sequências'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Determinação de elementos ausentes na sequência'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Determinação de elementos ausentes na sequência');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA11', 'Descrever elementos ausentes em sequências repetitivas e recursivas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Determinação de elementos ausentes na sequência'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Localização e movimentação de pessoas e objetos no espaço'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Localização e movimentação de pessoas e objetos no espaço');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA12', 'Identificar e registrar localização e deslocamentos no espaço.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Localização e movimentação de pessoas e objetos no espaço'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Esboço de roteiros e de plantas simples'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Esboço de roteiros e de plantas simples');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA13', 'Esboçar roteiros ou plantas de ambientes familiares.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Esboço de roteiros e de plantas simples'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras geométricas espaciais: reconhecimento e características'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras geométricas espaciais: reconhecimento e características');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA14', 'Reconhecer e nomear figuras geométricas espaciais.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras geométricas espaciais: reconhecimento e características'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras geométricas planas: reconhecimento e características'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras geométricas planas: reconhecimento e características');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA15', 'Reconhecer e nomear figuras planas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras geométricas planas: reconhecimento e características'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medida de comprimento: unidades padronizadas e não padronizadas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medida de comprimento: unidades padronizadas e não padronizadas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA16', 'Estimar, medir e comparar comprimentos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medida de comprimento: unidades padronizadas e não padronizadas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medida de capacidade e de massa'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medida de capacidade e de massa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA17', 'Estimar, medir e comparar capacidade e massa.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medida de capacidade e de massa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de tempo: intervalo de tempo, calendário, horas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de tempo: intervalo de tempo, calendário, horas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA18', 'Indicar duração de intervalos de tempo usando calendário.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de tempo: intervalo de tempo, calendário, horas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA18');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA19', 'Medir duração de intervalo de tempo com relógio digital.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de tempo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sistema monetário brasileiro'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sistema monetário brasileiro');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA20', 'Estabelecer equivalência de valores entre moedas e cédulas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Sistema monetário brasileiro'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Análise da ideia de aleatório'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Análise da ideia de aleatório');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA21', 'Classificar resultados de eventos cotidianos aleatórios.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Análise da ideia de aleatório'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coleta, classificação e representação de dados'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coleta, classificação e representação de dados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA22', 'Comparar informações de pesquisas em tabelas e gráficos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Coleta, classificação e representação de dados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coleta e organização de dados'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coleta e organização de dados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02MA23', 'Realizar pesquisa em universo de até 30 elementos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Coleta e organização de dados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02MA23');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Leitura, escrita e ordenação de números naturais de quatro ordens'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Leitura, escrita e ordenação de números naturais de quatro ordens');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA01', 'Ler, escrever e comparar números naturais até a unidade de milhar.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura, escrita e ordenação de números naturais de quatro ordens'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA02', 'Identificar características do sistema de numeração decimal.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Composição e decomposição de números naturais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção de fatos fundamentais da adição, subtração e multiplicação'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção de fatos fundamentais da adição, subtração e multiplicação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA03', 'Construir e utilizar fatos básicos da adição e multiplicação.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Construção de fatos fundamentais da adição, subtração e multiplicação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reta numérica'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reta numérica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA04', 'Estabelecer relação entre números naturais e pontos da reta numérica.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Reta numérica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Procedimentos de cálculo mental e escrito com números naturais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Procedimentos de cálculo mental e escrito com números naturais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA05', 'Utilizar diferentes procedimentos de cálculo envolvendo adição e subtração.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Procedimentos de cálculo mental e escrito com números naturais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Problemas de adição e subtração'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Problemas de adição e subtração');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA06', 'Resolver e elaborar problemas de adição e subtração.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas de adição e subtração'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Problemas de multiplicação e divisão'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Problemas de multiplicação e divisão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA07', 'Resolver problemas de multiplicação (por 2, 3, 4, 5 e 10).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas de multiplicação e divisão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA08', 'Resolver problemas de divisão de número natural por outro (até 10).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas de multiplicação e divisão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Metade, terça parte, quarta parte, quinta parte e décima parte'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Metade, terça parte, quarta parte, quinta parte e décima parte');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA09', 'Associar quociente de divisão com resto zero às ideias de metade, terça parte.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Metade, terça parte, quarta parte, quinta parte e décima parte'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Regularidades em sequências numéricas recursivas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Regularidades em sequências numéricas recursivas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA10', 'Identificar regularidades em sequências ordenadas de números naturais.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Regularidades em sequências numéricas recursivas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação de igualdade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação de igualdade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA11', 'Compreender a ideia de igualdade para escrever sentenças de adição ou subtração.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Relação de igualdade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Localização e movimentação: representação de objetos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Localização e movimentação: representação de objetos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA12', 'Descrever e representar movimentação de pessoas ou objetos no espaço.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Localização e movimentação: representação de objetos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras geométricas espaciais: reconhecimento e planificações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras geométricas espaciais: reconhecimento e planificações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA13', 'Associar figuras geométricas espaciais a objetos do mundo físico.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras geométricas espaciais: reconhecimento e planificações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras geométricas espaciais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras geométricas espaciais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA14', 'Descrever características de figuras espaciais relacionando com planificações.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras geométricas espaciais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA15', 'Classificar e comparar figuras planas em relação a lados e vértices.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras geométricas planas: reconhecimento e características'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Congruência de figuras geométricas planas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Congruência de figuras geométricas planas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA16', 'Reconhecer figuras congruentes usando sobreposição e malhas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Congruência de figuras geométricas planas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Significado de medida e de unidade de medida'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Significado de medida e de unidade de medida');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA17', 'Reconhecer que o resultado de uma medida depende da unidade usada.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Significado de medida e de unidade de medida'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Unidade de medida'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Unidade de medida');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA18', 'Escolher unidade de medida e instrumento apropriado para medições.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Unidade de medida'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de comprimento'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de comprimento');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA19', 'Estimar, medir e comparar comprimentos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de comprimento'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de capacidade e de massa'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de capacidade e de massa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA20', 'Estimar e medir capacidade e massa usando unidades padronizadas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de capacidade e de massa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Comparação de áreas por superposição'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Comparação de áreas por superposição');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA21', 'Comparar áreas de faces de objetos visualmente ou por superposição.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Comparação de áreas por superposição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA22', 'Ler e registrar medidas e intervalos de tempo usando relógios.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de tempo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA23', 'Ler horas e reconhecer relação entre hora e minutos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de tempo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA24', 'Resolver problemas de comparação de valores monetários.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Sistema monetário brasileiro'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA24');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Análise da ideia de acaso'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Análise da ideia de acaso');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA25', 'Identificar todos os resultados possíveis em eventos aleatórios.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Análise da ideia de acaso'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Leitura e interpretação de dados'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Leitura e interpretação de dados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA26', 'Resolver problemas com dados em tabelas de dupla entrada e gráficos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura e interpretação de dados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA26');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Interpretação de dados'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Interpretação de dados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA27', 'Ler e interpretar dados em tabelas de dupla entrada e gráficos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Interpretação de dados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coleta e classificação de dados'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coleta e classificação de dados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03MA28', 'Realizar pesquisa com variáveis categóricas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Coleta e classificação de dados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03MA28');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sistema de numeração decimal: leitura e ordenação de números de até cinco ordens'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sistema de numeração decimal: leitura e ordenação de números de até cinco ordens');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA01', 'Ler, escrever e ordenar números naturais até dezenas de milhar.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Sistema de numeração decimal: leitura e ordenação de números de até cinco ordens'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Composição e decomposição de número de até cinco ordens'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Composição e decomposição de número de até cinco ordens');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA02', 'Mostrar que todo número pode ser escrito por adições e multiplicações por potências de dez.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Composição e decomposição de número de até cinco ordens'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Propriedades das operações para diferentes estratégias de cálculo'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Propriedades das operações para diferentes estratégias de cálculo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA03', 'Resolver problemas com números naturais envolvendo adição e subtração.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Propriedades das operações para diferentes estratégias de cálculo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relações entre operações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relações entre operações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA04', 'Utilizar relações entre adição e subtração e entre multiplicação e divisão.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Relações entre operações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Propriedades das operações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Propriedades das operações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA05', 'Utilizar propriedades das operações para desenvolver cálculo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Propriedades das operações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA06', 'Resolver problemas de multiplicação (adição de parcelas iguais).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas de multiplicação e divisão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA07', 'Resolver problemas de divisão com divisor de até dois algarismos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas de multiplicação e divisão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Problemas de contagem'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Problemas de contagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA08', 'Resolver problemas simples de contagem.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas de contagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Frações unitárias mais usuais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Frações unitárias mais usuais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA09', 'Reconhecer frações unitárias mais usuais usando reta numérica.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Frações unitárias mais usuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Representação decimal de números racionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Representação decimal de números racionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA10', 'Reconhecer regras do sistema decimal para representação decimal.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Representação decimal de números racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sequência numérica recursiva de múltiplos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sequência numérica recursiva de múltiplos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA11', 'Identificar regularidades em sequências de múltiplos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Sequência numérica recursiva de múltiplos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sequência numérica com restos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sequência numérica com restos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA12', 'Reconhecer grupos com restos iguais em divisões.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Sequência numérica com restos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relações inversas entre operações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relações inversas entre operações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA13', 'Reconhecer relações inversas entre adição e subtração.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Relações inversas entre operações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Propriedades da igualdade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Propriedades da igualdade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA14', 'Reconhecer que a igualdade permanece ao adicionar ou subtrair mesmo número.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Propriedades da igualdade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA15', 'Determinar número desconhecido em igualdade.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Propriedades da igualdade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Localização e movimentação: paralelismo e perpendicularismo'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Localização e movimentação: paralelismo e perpendicularismo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA16', 'Descrever deslocamentos por meio de malhas quadriculadas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Localização e movimentação: paralelismo e perpendicularismo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras geométricas espaciais: planificações'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras geométricas espaciais: planificações');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA17', 'Associar prismas e pirâmides a planificações.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras geométricas espaciais: planificações'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Ângulos retos e não retos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Ângulos retos e não retos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA18', 'Reconhecer ângulos retos e não retos em figuras poligonais.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Ângulos retos e não retos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Simetria de reflexão'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Simetria de reflexão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA19', 'Reconhecer simetria de reflexão em figuras geométricas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Simetria de reflexão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de comprimento, massa e capacidade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de comprimento, massa e capacidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA20', 'Medir e estimar comprimentos, massas e capacidades.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de comprimento, massa e capacidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Áreas em malhas quadriculadas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Áreas em malhas quadriculadas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA21', 'Medir e comparar área de figuras planas em malha quadriculada.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Áreas em malhas quadriculadas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA22', 'Ler e registrar medidas de tempo em horas, minutos e segundos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de tempo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de temperatura'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de temperatura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA23', 'Reconhecer temperatura como grandeza.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de temperatura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA24', 'Registrar temperaturas máxima e mínima e elaborar gráficos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de temperatura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA24');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA25', 'Resolver problemas de compra, venda e formas de pagamento.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Sistema monetário brasileiro'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Análise de chances de eventos aleatórios'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Análise de chances de eventos aleatórios');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA26', 'Identificar eventos aleatórios com maior chance de ocorrência.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Análise de chances de eventos aleatórios'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA26');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA27', 'Analisar dados em tabelas e gráficos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura e interpretação de dados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Diferenciação entre variáveis categóricas e numéricas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Diferenciação entre variáveis categóricas e numéricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04MA28', 'Realizar pesquisa com variáveis categóricas e numéricas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Diferenciação entre variáveis categóricas e numéricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04MA28');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sistema de numeração decimal: leitura de números de até seis ordens'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sistema de numeração decimal: leitura de números de até seis ordens');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA01', 'Ler, escrever e ordenar números naturais até centenas de milhar.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Sistema de numeração decimal: leitura de números de até seis ordens'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Números racionais na forma decimal e reta numérica'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Números racionais na forma decimal e reta numérica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA02', 'Ler, escrever e ordenar números racionais na forma decimal.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Números racionais na forma decimal e reta numérica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Representação fracionária dos números racionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Representação fracionária dos números racionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA03', 'Identificar e representar frações associando-as à divisão.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Representação fracionária dos números racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Comparação de números racionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Comparação de números racionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA04', 'Identificar frações equivalentes.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Comparação de números racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA05', 'Comparar e ordenar números racionais positivos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Comparação de números racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Cálculo de porcentagens'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Cálculo de porcentagens');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA06', 'Associar 10%, 25%, 50%, 75% e 100% às frações correspondentes.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Cálculo de porcentagens'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Adição e subtração de números naturais e racionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Adição e subtração de números naturais e racionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA07', 'Resolver problemas de adição e subtração.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Adição e subtração de números naturais e racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Multiplicação e divisão de números racionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Multiplicação e divisão de números racionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA08', 'Resolver problemas de multiplicação e divisão.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Multiplicação e divisão de números racionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA09', 'Resolver problemas de contagem usando princípio multiplicativo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Números' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Problemas de contagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Propriedades da igualdade e noção de equivalência'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Propriedades da igualdade e noção de equivalência');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA10', 'Concluir que igualdade permanece ao adicionar, subtrair, multiplicar ou dividir.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Propriedades da igualdade e noção de equivalência'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Igualdade com termo desconhecido'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Igualdade com termo desconhecido');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA11', 'Resolver problemas com igualdade e termo desconhecido.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Igualdade com termo desconhecido'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Grandezas diretamente proporcionais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Grandezas diretamente proporcionais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA12', 'Resolver problemas de proporcionalidade direta.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Grandezas diretamente proporcionais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Partilha em duas partes'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Partilha em duas partes');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA13', 'Resolver problemas de partilha em duas partes desiguais.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Álgebra' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Partilha em duas partes'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Plano cartesiano: 1º quadrante'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Plano cartesiano: 1º quadrante');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA14', 'Utilizar representações para localização de objetos no plano.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Plano cartesiano: 1º quadrante'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Plano cartesiano'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Plano cartesiano');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA15', 'Interpretar e representar localização no plano cartesiano.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Plano cartesiano'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA16', 'Associar figuras espaciais a planificações.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras geométricas espaciais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras planas: características e ângulos'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras planas: características e ângulos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA17', 'Reconhecer e nomear polígonos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Figuras planas: características e ângulos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Ampliação e redução de figuras em malhas'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Ampliação e redução de figuras em malhas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA18', 'Reconhecer congruência de ângulos em ampliação e redução.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Geometria' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Ampliação e redução de figuras em malhas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Medidas de comprimento, área, massa, tempo, temperatura e capacidade'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Medidas de comprimento, área, massa, tempo, temperatura e capacidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA19', 'Resolver problemas envolvendo medidas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Medidas de comprimento, área, massa, tempo, temperatura e capacidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Áreas e perímetros de figuras poligonais'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Áreas e perímetros de figuras poligonais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA20', 'Concluir que perímetros iguais podem ter áreas diferentes.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Áreas e perímetros de figuras poligonais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Noção de volume'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Noção de volume');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA21', 'Reconhecer volume como grandeza associada a sólidos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Grandezas e medidas' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Noção de volume'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Espaço amostral'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Espaço amostral');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA22', 'Apresentar todos os possíveis resultados de experimento aleatório.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Espaço amostral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Probabilidade de eventos equiprováveis'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Probabilidade de eventos equiprováveis');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA23', 'Determinar probabilidade em eventos aleatórios equiprováveis.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Probabilidade de eventos equiprováveis'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA24', 'Interpretar dados estatísticos em tabelas e gráficos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Leitura e interpretação de dados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA24');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coleta e representação de dados'
FROM bncc_unidades_tematicas ut WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coleta e representação de dados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05MA25', 'Realizar pesquisa com variáveis categóricas e numéricas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Matemática' AND ut.unidade_tematica = 'Probabilidade e estatística' AND ut.etapa_ensino = 'anos_iniciais'
AND oc.objeto_conhecimento = 'Coleta e representação de dados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05MA25');


COMMIT;
