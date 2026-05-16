-- ============================================
-- COMPUTAÇÃO (INFORMÁTICA) - ANOS INICIAIS (1º AO 5º)
-- ============================================

-- Inserir Unidades Temáticas (Eixos)
INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Informática/Computação', 'Pensamento Computacional', 'anos_iniciais'),
('Informática/Computação', 'Mundo Digital', 'anos_iniciais'),
('Informática/Computação', 'Cultura Digital', 'anos_iniciais');

-- ============================================
-- 1º AO 5º ANO - GERAL (EF15CO)
-- ============================================

-- Pensamento Computacional

-- Organização e representação da informação
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Organização e representação da informação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15CO01', 'Identificar as principais formas de organizar e representar a informação de maneira estruturada (matrizes, registros, listas e grafos) ou não estruturada (números, palavras, valores verdade).', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Organização e representação da informação';

-- Algoritmos
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Algoritmos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15CO02', 'Construir e simular algoritmos, de forma independente ou em colaboração, que resolvam problemas simples e do cotidiano com uso de sequências, seleções condicionais e repetições de instruções.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Algoritmos';

-- Lógica computacional
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Lógica computacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15CO03', 'Realizar operações de negação, conjunção e disjunção sobre sentenças lógicas e valores "verdadeiro" e "falso".', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Lógica computacional';

-- Decomposição
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Decomposição' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15CO04', 'Aplicar a estratégia de decomposição para resolver problemas complexos, dividindo esse problema em partes menores, resolvendo-as e combinando suas soluções.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Decomposição';

-- Mundo Digital

-- Codificação da informação
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Codificação da informação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15CO05', 'Codificar a informação de diferentes formas, entendendo a importância desta codificação para o armazenamento, manipulação e transmissão em dispositivos computacionais.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Codificação da informação';

-- Funcionamento de dispositivos computacionais
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Funcionamento de dispositivos computacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15CO06', 'Conhecer os componentes básicos de dispositivos computacionais, entendendo os princípios de seu funcionamento.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Funcionamento de dispositivos computacionais';

-- Sistema Operacional
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Sistema Operacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15CO07', 'Conhecer o conceito de Sistema Operacional e sua importância na integração entre software e hardware.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Sistema Operacional';

-- Cultura Digital

-- Uso de artefatos computacionais
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Uso de artefatos computacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15CO08', 'Reconhecer e utilizar tecnologias computacionais para pesquisar e acessar informações, expressar-se crítica e criativamente e resolver problemas.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Uso de artefatos computacionais';

-- Segurança e responsabilidade no uso da tecnologia computacional
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Segurança e responsabilidade no uso da tecnologia computacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15CO09', 'Entender que as tecnologias devem ser utilizadas de maneira segura, ética e responsável, respeitando direitos autorais, de imagem e as leis vigentes.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Segurança e responsabilidade no uso da tecnologia computacional';

-- ============================================
-- 1º ANO - ESPECÍFICAS (EF01CO)
-- ============================================

-- Pensamento Computacional - Organização de objetos (1º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Organização de objetos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01CO01', 'Organizar objetos físicos ou digitais considerando diferentes características para esta organização, explicitando semelhanças (padrões) e diferenças.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Organização de objetos';

-- Pensamento Computacional - Conceituação de Algoritmos (1º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Conceituação de Algoritmos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01CO02', 'Identificar e seguir sequências de passos aplicados no dia a dia para resolver problemas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Conceituação de Algoritmos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01CO03', 'Reorganizar e criar sequências de passos em meios físicos ou digitais, relacionando essas sequências à palavra "Algoritmos".', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Conceituação de Algoritmos';

-- Mundo Digital - Codificação da informação (1º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Codificação da informação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01CO04', 'Reconhecer o que é a informação, que ela pode ser armazenada, transmitida como mensagem por diversos meios e descrita em várias linguagens.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Codificação da informação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01CO05', 'Representar informação usando diferentes codificações.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Codificação da informação';

-- Cultura Digital - Uso de artefatos computacionais (1º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Uso de artefatos computacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01CO06', 'Reconhecer e explorar artefatos computacionais voltados a atender necessidades pessoais ou coletivas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Uso de artefatos computacionais';

-- Cultura Digital - Segurança e responsabilidade (1º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Segurança e responsabilidade no uso de tecnologia computacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01CO07', 'Conhecer as possibilidades de uso seguro das tecnologias computacionais para proteção dos dados pessoais e para garantir a própria segurança.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Segurança e responsabilidade no uso de tecnologia computacional';

-- ============================================
-- 2º ANO - ESPECÍFICAS (EF02CO)
-- ============================================

-- Pensamento Computacional - Modelagem de objetos (2º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Modelagem de objetos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02CO01', 'Criar e comparar modelos (representações) de objetos, identificando padrões e atributos essenciais.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Modelagem de objetos';

-- Pensamento Computacional - Algoritmos com repetições simples (2º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Algoritmos com repetições simples' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02CO02', 'Criar e simular algoritmos representados em linguagem oral, escrita ou pictográfica, construídos como sequências com repetições simples (iterações definidas) com base em instruções preestabelecidas ou criadas, analisando como a precisão da instrução impacta na execução do algoritmo.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Algoritmos com repetições simples';

-- Mundo Digital - Instrução de máquina (2º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Instrução de máquina' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02CO03', 'Identificar que máquinas diferentes executam conjuntos próprios de instruções e que podem ser usadas para definir algoritmos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Instrução de máquina';

-- Mundo Digital - Hardware e software (2º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Hardware e software' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02CO04', 'Diferenciar componentes físicos (hardware) e programas que fornecem as instruções (software) para o hardware.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Hardware e software';

-- Cultura Digital - Uso de artefatos computacionais (2º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Uso de artefatos computacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02CO05', 'Reconhecer as características e usos das tecnologias computacionais no cotidiano dentro e fora da escola.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Uso de artefatos computacionais';

-- Cultura Digital - Segurança e responsabilidade (2º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Segurança e responsabilidade no uso de tecnologia computacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02CO06', 'Reconhecer os cuidados com a segurança no uso de dispositivos computacionais.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Segurança e responsabilidade no uso de tecnologia computacional';

-- ============================================
-- 3º ANO - ESPECÍFICAS (EF03CO)
-- ============================================

-- Pensamento Computacional - Lógica computacional (3º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Lógica computacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03CO01', 'Associar os valores "verdadeiro" e "falso" a sentenças lógicas que dizem respeito a situações do dia a dia, fazendo uso de termos que indicam negação.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Lógica computacional';

-- Pensamento Computacional - Algoritmos com repetições condicionais simples (3º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Algoritmos com repetições condicionais simples' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03CO02', 'Criar e simular algoritmos representados em linguagem oral, escrita ou pictográfica, que incluam sequências e repetições simples com condição (iterações indefinidas), para resolver problemas de forma independente e em colaboração.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Algoritmos com repetições condicionais simples';

-- Pensamento Computacional - Decomposição (3º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Decomposição' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03CO03', 'Aplicar a estratégia de decomposição para resolver problemas complexos, dividindo esse problema em partes menores, resolvendo-as e combinando suas soluções.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Decomposição';

-- Mundo Digital - Codificação da informação (3º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Codificação da informação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03CO04', 'Relacionar o conceito de informação com o de dado.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Codificação da informação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03CO05', 'Compreender que dados são estruturados em formatos específicos dependendo da informação armazenada.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Codificação da informação';

-- Mundo Digital - Interface física (3º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Interface física' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03CO06', 'Reconhecer que, para um computador realizar tarefas, ele se comunica com o mundo exterior com o uso de interfaces físicas (dispositivos de entrada e saída).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Interface física';

-- Cultura Digital - Uso de tecnologias computacionais (3º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Uso de tecnologias computacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03CO07', 'Utilizar diferentes navegadores e ferramentas de busca para pesquisar e acessar informações.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Uso de tecnologias computacionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03CO08', 'Usar ferramentas computacionais em situações didáticas para se expressar em diferentes formatos digitais.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Uso de tecnologias computacionais';

-- Cultura Digital - Segurança e responsabilidade (3º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Segurança e responsabilidade no uso da tecnologia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03CO09', 'Reconhecer o potencial impacto do compartilhamento de informações pessoais ou de seus pares em meio digital.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Segurança e responsabilidade no uso da tecnologia';

-- ============================================
-- 4º ANO - ESPECÍFICAS (EF04CO)
-- ============================================

-- Pensamento Computacional - Matrizes e registros (4º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Matrizes e registros' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04CO01', 'Reconhecer objetos do mundo real e/ou digital que podem ser representados através de matrizes que estabelecem uma organização na qual cada componente está em uma posição definida por coordenadas, fazendo manipulações simples sobre estas representações.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Matrizes e registros';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04CO02', 'Reconhecer objetos do mundo real e/ou digital que podem ser representados através de registros que estabelecem uma organização na qual cada componente é identificado por um nome, fazendo manipulações sobre estas representações.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Matrizes e registros';

-- Pensamento Computacional - Algoritmos com repetições simples e aninhadas (4º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Algoritmos com repetições simples e aninhadas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04CO03', 'Criar e simular algoritmos representados em linguagem oral, escrita ou pictográfica, que incluam sequências e repetições simples e aninhadas (iterações definidas e indefinidas), para resolver problemas de forma independente e em colaboração.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Algoritmos com repetições simples e aninhadas';

-- Mundo Digital - Codificação da informação (4º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Codificação da informação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04CO04', 'Entender que para guardar, manipular e transmitir dados deve-se codificá-los de alguma forma que seja compreendida pela máquina (formato digital).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Codificação da informação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04CO05', 'Codificar diferentes informações para representação em computador (binária, ASCII, atributos de pixel, como RGB etc.).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Codificação da informação';

-- Cultura Digital - Uso de tecnologias computacionais (4º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Uso de tecnologias computacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04CO06', 'Usar diferentes ferramentas computacionais para criação de conteúdo (textos, apresentações, vídeos etc.).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Uso de tecnologias computacionais';

-- Cultura Digital - Segurança e responsabilidade no uso da tecnologia (4º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Segurança e responsabilidade no uso da tecnologia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04CO07', 'Demonstrar postura ética nas atividades de coleta, transferência, guarda e uso de dados.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Segurança e responsabilidade no uso da tecnologia';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04CO08', 'Reconhecer a importância de verificar a confiabilidade das fontes de informações obtidas na Internet.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Segurança e responsabilidade no uso da tecnologia';

-- ============================================
-- 5º ANO - ESPECÍFICAS (EF05CO)
-- ============================================

-- Pensamento Computacional - Listas e grafos (5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Listas e grafos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO01', 'Reconhecer objetos do mundo real e/ou digital que podem ser representados através de listas que estabelecem uma organização na qual há um número variável de itens dispostos em sequência, fazendo manipulações simples sobre estas representações.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Listas e grafos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO02', 'Reconhecer objetos do mundo real e/ou digital que podem ser representados através de grafos que estabelecem uma organização com uma quantidade variável de vértices conectados por arestas, fazendo manipulações simples sobre estas representações.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Listas e grafos';

-- Pensamento Computacional - Lógica computacional (5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Lógica computacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO03', 'Realizar operações de negação, conjunção e disjunção sobre sentenças lógicas e valores "verdadeiro" e "falso".', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Lógica computacional';

-- Pensamento Computacional - Algoritmos com seleção condicional (5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Algoritmos com seleção condicional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Pensamento Computacional' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO04', 'Criar e simular algoritmos representados em linguagem oral, escrita ou pictográfica, que incluam sequências, repetições e seleções condicionais para resolver problemas de forma independente e em colaboração.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Pensamento Computacional' AND oc.objeto_conhecimento = 'Algoritmos com seleção condicional';

-- Mundo Digital - Arquitetura de computadores (5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Arquitetura de computadores' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO05', 'Identificar os componentes principais de um computador (dispositivos de entrada/saída, processadores e armazenamento).', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Arquitetura de computadores';

-- Mundo Digital - Armazenamento de dados (5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Armazenamento de dados' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO06', 'Reconhecer que os dados podem ser armazenados em um dispositivo local ou remoto.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Armazenamento de dados';

-- Mundo Digital - Sistema operacional (5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Sistema operacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Mundo Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO07', 'Reconhecer a necessidade de um sistema operacional para a execução de programas e gerenciamento do hardware.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Mundo Digital' AND oc.objeto_conhecimento = 'Sistema operacional';

-- Cultura Digital - Segurança e responsabilidade (5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Segurança e responsabilidade no uso da tecnologia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO08', 'Acessar as informações na Internet de forma crítica para distinguir os conteúdos confiáveis de não confiáveis.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Segurança e responsabilidade no uso da tecnologia';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO09', 'Usar informações considerando aplicações e limites dos direitos autorais em diferentes mídias digitais.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Segurança e responsabilidade no uso da tecnologia';

-- Cultura Digital - Uso de tecnologias computacionais (5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Uso de tecnologias computacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Informática/Computação' AND unidade_tematica = 'Cultura Digital' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO10', 'Expressar-se crítica e criativamente na compreensão das mudanças tecnológicas no mundo do trabalho e sobre a evolução da sociedade.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Uso de tecnologias computacionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05CO11', 'Identificar a adequação de diferentes tecnologias computacionais na resolução de problemas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Informática/Computação' AND ut.unidade_tematica = 'Cultura Digital' AND oc.objeto_conhecimento = 'Uso de tecnologias computacionais';

