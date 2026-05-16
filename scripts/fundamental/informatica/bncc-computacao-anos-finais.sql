-- ============================================
-- COMPUTAÇÃO (INFORMÁTICA) - ANOS FINAIS (6º AO 9º)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Informática/Computação', 'Pensamento Computacional', 'anos_finais'),
('Informática/Computação', 'Mundo Digital', 'anos_finais'),
('Informática/Computação', 'Cultura Digital', 'anos_finais');

-- ============================================
-- 6º AO 9º ANO - GERAL (EF69CO)
-- ============================================

-- Pensamento Computacional - Programação - Tipos de dados
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Programação - Tipos de dados' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO01', 'Classificar informações, agrupando-as em coleções (conjuntos) e associando cada coleção a um "tipo de dado".', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Tipos de dados';

-- Programação - Linguagem de programação
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Programação - Linguagem de programação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO02', 'Elaborar algoritmos que envolvam instruções sequenciais, de repetição e de seleção usando uma linguagem de programação.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Linguagem de programação';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO03', 'Descrever com precisão a solução de um problema, construindo o programa que implementa a solução descrita.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Linguagem de programação';

-- Estratégias de solução de problemas - Decomposição
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Estratégias de solução de problemas - Decomposição' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO04', 'Construir soluções de problemas usando a técnica de decomposição e automatizar tais soluções usando uma linguagem de programação.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Estratégias de solução de problemas - Decomposição';

-- Estratégias de solução de problemas - Generalização
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Estratégias de solução de problemas - Generalização' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO05', 'Identificar os recursos ou insumos necessários (entradas) para a resolução de problemas, bem como os resultados esperados (saídas), determinando os respectivos tipos de dados.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Estratégias de solução de problemas - Generalização';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO06', 'Comparar diferentes casos particulares (instâncias) de um mesmo problema, identificando as semelhanças e diferenças entre eles, e criar um algoritmo para resolver todos, fazendo uso de variáveis (parâmetros).', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Estratégias de solução de problemas - Generalização';

-- Mundo Digital - Armazenamento e Transmissão de dados - Fundamentos de transmissão de dados
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Armazenamento e Transmissão de dados - Fundamentos de transmissão de dados' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO07', 'Entender o processo de transmissão de dados, como a informação é quebrada em pedaços, transmitida em pacotes através de múltiplos equipamentos, e reconstruída no destino.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Armazenamento e Transmissão de dados - Fundamentos de transmissão de dados';

-- Gestão de dados
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Armazenamento e Transmissão de dados - Gestão de dados' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO08', 'Compreender e utilizar diferentes formas de armazenar, manipular, compactar e recuperar arquivos, documentos e metadados.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Armazenamento e Transmissão de dados - Gestão de dados';

-- Sistemas distribuídos e internet - Fundamentos de sistemas distribuídos
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Sistemas distribuídos e internet - Fundamentos de sistemas distribuídos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO09', 'Compreender os conceitos de paralelismo, concorrência e armazenamento/processamento distribuídos.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Sistemas distribuídos e internet - Fundamentos de sistemas distribuídos';

-- Internet
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Sistemas distribuídos e internet - Internet' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO10', 'Entender como é a estrutura e funcionamento da internet.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Sistemas distribuídos e internet - Internet';

-- Cultura Digital - Tecnologia digital e sociedade
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Tecnologia digital e sociedade' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO11', 'Apresentar conduta e linguagem apropriadas ao se comunicar em ambiente digital, considerando a ética e o respeito.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Tecnologia digital e sociedade';

-- Tecnologia digital e sustentabilidade
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Tecnologia digital e sustentabilidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69CO12', 'Analisar o consumo de tecnologia na sociedade, compreendendo criticamente o caminho da produção dos recursos bem como aspectos ligados à obsolescência e à sustentabilidade.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Tecnologia digital e sustentabilidade';

-- ============================================
-- 6º ANO (EF06CO)
-- ============================================

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO01', 'Classificar informações, agrupando-as em coleções (conjuntos) e associando cada coleção a um "tipo de dados".', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Tipos de dados';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO02', 'Elaborar algoritmos que envolvam instruções sequenciais, de repetição e de seleção usando uma linguagem de programação.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Linguagem de programação';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO03', 'Descrever com precisão a solução de um problema, construindo o programa que implementa a solução descrita.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Linguagem de programação';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO04', 'Construir soluções de problemas usando a técnica de decomposição e automatizar tais soluções usando uma linguagem de programação.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Estratégias de solução de problemas - Decomposição';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO05', 'Identificar os recursos ou insumos necessários (entradas) para a resolução de problemas, bem como os resultados esperados (saídas), determinando os respectivos tipos de dados.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Estratégias de solução de problemas - Generalização';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO06', 'Comparar diferentes casos particulares (instâncias) de um mesmo problema, identificando as semelhanças e diferenças entre eles, e criar um algoritmo para resolver todos, fazendo uso de variáveis (parâmetros).', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Estratégias de solução de problemas - Generalização';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO07', 'Entender o processo de transmissão de dados, como a informação é quebrada em pedaços, transmitida em pacotes através de múltiplos equipamentos, e reconstruída no destino.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Armazenamento e Transmissão de dados - Fundamentos de transmissão de dados';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO08', 'Compreender e utilizar diferentes formas de armazenar, manipular, compactar e recuperar arquivos, documentos e metadados.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Armazenamento e Transmissão de dados - Gestão de dados';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO09', 'Apresentar conduta e linguagem apropriadas ao se comunicar em ambiente digital, considerando a ética e o respeito.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Tecnologia digital e sociedade';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CO10', 'Analisar o consumo de tecnologia na sociedade, compreendendo criticamente o caminho da produção dos recursos bem como aspectos ligados à obsolescência e à sustentabilidade.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Tecnologia digital e sustentabilidade';

-- ============================================
-- 7º ANO (EF07CO)
-- ============================================

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO01', 'Criar soluções de problemas para os quais seja adequado o uso de registros e matrizes unidimensionais para descrever suas informações e automatizá-las usando uma linguagem de programação.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Linguagem de programação';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Programação - Análise de programas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO02', 'Analisar programas para detectar e remover erros, ampliando a confiança na sua correção.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Análise de programas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO03', 'Construir soluções computacionais de problemas de diferentes áreas do conhecimento, de forma individual e colaborativa, selecionando as estruturas de dados e técnicas adequadas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Linguagem de programação';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Programação - Propriedades de grafos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO04', 'Explorar propriedades básicas de grafos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Propriedades de grafos';

-- Estratégias de solução de problemas - Reúso
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Estratégias de solução de problemas - Reúso' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO05', 'Criar algoritmos fazendo uso da decomposição e do reúso no processo de solução de forma colaborativa e cooperativa e automatizá-los usando uma linguagem de programação.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Estratégias de solução de problemas - Reúso';

-- Mundo Digital - Protocolos de comunicação em redes
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Protocolos de comunicação em redes' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO06', 'Compreender o papel de protocolos para a transmissão de dados.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Protocolos de comunicação em redes';

-- Fundamentos de Segurança Cibernética
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Fundamentos de Segurança Cibernética' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO07', 'Identificar problemas de segurança cibernética e experimentar formas de proteção.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Fundamentos de Segurança Cibernética';

-- Cultura Digital - Cyberbullying
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Cyberbullying' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO08', 'Demonstrar empatia sobre opiniões divergentes na web.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Cyberbullying';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO09', 'Reconhecer e debater sobre cyberbullying.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Cyberbullying';

-- Cultura Digital - Impactos da tecnologia digital
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Impactos da tecnologia digital' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO10', 'Identificar os impactos ambientais do descarte de peças de computadores e eletrônicos, bem como sua relação com a sustentabilidade.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Impactos da tecnologia digital';

-- Produção Digital
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção Digital' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CO11', 'Criar, documentar e publicar, de forma individual ou colaborativa, produtos (vídeos, podcasts, web sites) usando recursos de tecnologia.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Produção Digital';

-- ============================================
-- 8º ANO (EF08CO)
-- ============================================

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO01', 'Construir soluções de problemas usando a técnica de recursão e automatizar tais soluções usando uma linguagem de programação.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Estratégias de solução de problemas - Decomposição';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO02', 'Criar soluções de problemas para os quais seja adequado o uso de listas para descrever suas informações e automatizá-las usando uma linguagem de programação, empregando ou não a recursão.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Linguagem de programação';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Programação - Algoritmos clássicos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO03', 'Utilizar algoritmos clássicos de manipulação sobre listas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Algoritmos clássicos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Programação - Projetos com programação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO04', 'Construir soluções computacionais de problemas de diferentes áreas do conhecimento, de forma individual e colaborativa, selecionando as estruturas de dados e técnicas adequadas, aperfeiçoando e articulando saberes escolares.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Projetos com programação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO05', 'Compreender os conceitos de paralelismo, concorrência e armazenamento/processamento distribuídos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Sistemas distribuídos e internet - Fundamentos de sistemas distribuídos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO06', 'Entender como é a estrutura e funcionamento da internet.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Sistemas distribuídos e internet - Internet';

-- Cultura Digital - Redes sociais e segurança da informação
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Redes sociais e segurança da informação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO07', 'Compartilhar informações por meio de redes sociais, compreendendo a sua dinâmica de funcionamento, de forma responsável e avaliando sua confiabilidade.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Redes sociais e segurança da informação';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO08', 'Distinguir os tipos de dados pessoais que são solicitados em espaços digitais e os riscos associados.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Redes sociais e segurança da informação';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO09', 'Analisar criticamente as políticas de termos de uso das redes sociais e demais plataformas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Redes sociais e segurança da informação';

-- Segurança em ambientes virtuais
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Segurança em ambientes virtuais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO10', 'Discutir questões sobre segurança e privacidade relacionadas ao uso dos ambientes virtuais.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Segurança em ambientes virtuais';

-- Uso crítico das mídias digitais
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Uso crítico das mídias digitais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CO11', 'Avaliar a precisão, relevância, adequação, abrangência e vieses que ocorrem em fontes de informação eletrônica.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Uso crítico das mídias digitais';

-- ============================================
-- 9º ANO (EF09CO)
-- ============================================

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO01', 'Criar soluções de problemas para os quais seja adequado o uso de árvores e grafos para descrever suas informações e automatizá-las usando uma linguagem de programação.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Linguagem de programação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO02', 'Construir soluções computacionais de problemas de diferentes áreas do conhecimento, de forma individual e colaborativa, selecionando as estruturas de dados e técnicas adequadas, aperfeiçoando e articulando saberes escolares.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Programação - Projetos com programação';

-- Autômatos e linguagens baseadas em eventos
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Autômatos e linguagens baseadas em eventos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO03', 'Usar autômatos para descrever comportamentos de forma abstrata automatizando-os através de uma linguagem de programação baseada em eventos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Autômatos e linguagens baseadas em eventos';

-- Segurança cibernética
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Segurança cibernética' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO04', 'Compreender o funcionamento de malwares e outros ataques cibernéticos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Segurança cibernética';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO05', 'Analisar técnicas de criptografia para armazenamento e transmissão de dados.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Segurança cibernética';

-- Cultura Digital - 9º ano
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO06', 'Analisar problemas sociais de sua cidade e estado a partir de ambientes digitais, propondo soluções.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Tecnologia digital e sociedade';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO07', 'Avaliar aplicações e implicações políticas, socioambientais e culturais das tecnologias digitais para propor alternativas aos desafios do mundo contemporâneo.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Tecnologia digital e sociedade';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO08', 'Discutir como a distribuição desigual de recursos de computação em uma economia global levanta questões de equidade, acesso e poder.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Tecnologia digital e sociedade';

-- Autoria em meio digital
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Autoria em meio digital' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO09', 'Criar ou utilizar conteúdo em meio digital, compreendendo questões éticas relacionadas a direitos autorais e de uso de imagem.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Autoria em meio digital';

-- Qualidade da informação
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Qualidade da informação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_finais';
INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CO10', 'Avaliar a veracidade, credibilidade e relevância da informação em seus diferentes formatos, sendo capaz de identificar o propósito pelo qual foi disseminada.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Qualidade da informação';

