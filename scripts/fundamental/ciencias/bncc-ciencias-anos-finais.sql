-- ============================================
-- CIÊNCIAS - ANOS FINAIS (6º ao 9º)
-- ============================================

-- ============================================
-- 6º ANO - ANOS FINAIS
-- ============================================

-- Matéria e energia
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Misturas homogêneas e heterogêneas Separação de materiais Materiais sintéticos Transformações químicas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Matéria e energia' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI01', 'Classificar como homogênea ou heterogênea a mistura de dois ou mais materiais (água e sal, água e óleo, água e areia etc.).', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Misturas homogêneas e heterogêneas Separação de materiais Materiais sintéticos Transformações químicas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI02', 'Identificar evidências de transformações químicas a partir do resultado de misturas de materiais que originam produtos diferentes dos que foram misturados (mistura de ingredientes para fazer um bolo, mistura de vinagre com bicarbonato de sódio etc.).', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Misturas homogêneas e heterogêneas Separação de materiais Materiais sintéticos Transformações químicas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI03', 'Selecionar métodos mais adequados para a separação de diferentes sistemas heterogêneos a partir da identificação de processos de separação de materiais (como a produção de sal de cozinha, a destilação de petróleo, entre outros).', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Misturas homogêneas e heterogêneas Separação de materiais Materiais sintéticos Transformações químicas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI04', 'Associar a produção de medicamentos e outros materiais sintéticos ao desenvolvimento científico e tecnológico, reconhecendo benefícios e avaliando impactos socioambientais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Misturas homogêneas e heterogêneas Separação de materiais Materiais sintéticos Transformações químicas';

-- Vida e evolução
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Célula como unidade da vida Interação entre os sistemas locomotor e nervoso Lentes corretivas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Vida e evolução' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI05', 'Explicar a organização básica das células e seu papel como unidade estrutural e funcional dos seres vivos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Célula como unidade da vida Interação entre os sistemas locomotor e nervoso Lentes corretivas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI06', 'Concluir, com base na análise de ilustrações e/ou modelos (físicos ou digitais), que os organismos são um complexo arranjo de sistemas com diferentes níveis de organização.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Célula como unidade da vida Interação entre os sistemas locomotor e nervoso Lentes corretivas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI07', 'Justificar o papel do sistema nervoso na coordenação das ações motoras e sensoriais do corpo, com base na análise de suas estruturas básicas e respectivas funções.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Célula como unidade da vida Interação entre os sistemas locomotor e nervoso Lentes corretivas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI08', 'Explicar a importância da visão (captação e interpretação das imagens) na interação do organismo com o meio e, com base no funcionamento do olho humano, selecionar lentes adequadas para a correção de diferentes defeitos da visão.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Célula como unidade da vida Interação entre os sistemas locomotor e nervoso Lentes corretivas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI09', 'Deduzir que a estrutura, a sustentação e a movimentação dos animais resultam da interação entre os sistemas muscular, ósseo e nervoso.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Célula como unidade da vida Interação entre os sistemas locomotor e nervoso Lentes corretivas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI10', 'Explicar como o funcionamento do sistema nervoso pode ser afetado por substâncias psicoativas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Célula como unidade da vida Interação entre os sistemas locomotor e nervoso Lentes corretivas';

-- Terra e Universo
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Forma, estrutura e movimentos da Terra' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Terra e Universo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI11', 'Identificar as diferentes camadas que estruturam o planeta Terra (da estrutura interna à atmosfera) e suas principais características.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Forma, estrutura e movimentos da Terra';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI12', 'Identificar diferentes tipos de rocha, relacionando a formação de fósseis a rochas sedimentares em diferentes períodos geológicos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Forma, estrutura e movimentos da Terra';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI13', 'Selecionar argumentos e evidências que demonstrem a esfericidade da Terra.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Forma, estrutura e movimentos da Terra';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06CI14', 'Inferir que as mudanças na sombra de uma vara (gnômon) ao longo do dia em diferentes períodos do ano são uma evidência dos movimentos relativos entre a Terra e o Sol, que podem ser explicados por meio dos movimentos de rotação e translação da Terra e da inclinação de seu eixo de rotação em relação ao plano de sua órbita em torno do Sol.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Forma, estrutura e movimentos da Terra';

-- ============================================
-- 7º ANO - ANOS FINAIS
-- ============================================

-- Matéria e energia
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Máquinas simples Formas de propagação do calor Equilíbrio termodinâmico e vida na Terra História dos combustíveis e das máquinas térmicas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Matéria e energia' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI01', 'Discutir a aplicação, ao longo da história, das máquinas simples e propor soluções e invenções para a realização de tarefas mecânicas cotidianas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Máquinas simples Formas de propagação do calor Equilíbrio termodinâmico e vida na Terra História dos combustíveis e das máquinas térmicas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI02', 'Diferenciar temperatura, calor e sensação térmica nas diferentes situações de equilíbrio termodinâmico cotidianas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Máquinas simples Formas de propagação do calor Equilíbrio termodinâmico e vida na Terra História dos combustíveis e das máquinas térmicas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI03', 'Utilizar o conhecimento das formas de propagação do calor para justificar a utilização de determinados materiais (condutores e isolantes) na vida cotidiana, explicar o princípio de funcionamento de alguns equipamentos (garrafa térmica, coletor solar etc.) e/ou construir soluções tecnológicas a partir desse conhecimento.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Máquinas simples Formas de propagação do calor Equilíbrio termodinâmico e vida na Terra História dos combustíveis e das máquinas térmicas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI04', 'Avaliar o papel do equilíbrio termodinâmico para a manutenção da vida na Terra, para o funcionamento de máquinas térmicas e em outras situações cotidianas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Máquinas simples Formas de propagação do calor Equilíbrio termodinâmico e vida na Terra História dos combustíveis e das máquinas térmicas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI05', 'Discutir o uso de diferentes tipos de combustível e máquinas térmicas ao longo do tempo, para avaliar avanços, questões econômicas e problemas socioambientais causados pela produção e uso desses materiais e máquinas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Máquinas simples Formas de propagação do calor Equilíbrio termodinâmico e vida na Terra História dos combustíveis e das máquinas térmicas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI06', 'Discutir e avaliar mudanças econômicas, culturais e sociais, tanto na vida cotidiana quanto no mundo do trabalho, decorrentes do desenvolvimento de novos materiais e tecnologias (como automação e informatização).', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Máquinas simples Formas de propagação do calor Equilíbrio termodinâmico e vida na Terra História dos combustíveis e das máquinas térmicas';

-- Vida e evolução
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Diversidade de ecossistemas Fenômenos naturais e impactos ambientais Programas e indicadores de saúde pública' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Vida e evolução' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI07', 'Caracterizar os principais ecossistemas brasileiros quanto à paisagem, à quantidade de água, ao tipo de solo, à disponibilidade de luz solar, à temperatura etc., correlacionando essas características à flora e fauna específicas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Diversidade de ecossistemas Fenômenos naturais e impactos ambientais Programas e indicadores de saúde pública';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI08', 'Avaliar como os impactos provocados por catástrofes naturais ou mudanças nos componentes físicos, biológicos ou sociais de um ecossistema afetam suas populações, podendo ameaçar ou provocar a extinção de espécies, alteração de hábitos, migração etc.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Diversidade de ecossistemas Fenômenos naturais e impactos ambientais Programas e indicadores de saúde pública';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI09', 'Interpretar as condições de saúde da comunidade, cidade ou estado, com base na análise e comparação de indicadores de saúde (como taxa de mortalidade infantil, cobertura de saneamento básico e incidência de doenças de veiculação hídrica, atmosférica entre outras) e dos resultados de políticas públicas destinadas à saúde.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Diversidade de ecossistemas Fenômenos naturais e impactos ambientais Programas e indicadores de saúde pública';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI10', 'Argumentar sobre a importância da vacinação para a saúde pública, com base em informações sobre a maneira como a vacina atua no organismo e o papel histórico da vacinação para a manutenção da saúde individual e coletiva e para a erradicação de doenças.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Diversidade de ecossistemas Fenômenos naturais e impactos ambientais Programas e indicadores de saúde pública';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI11', 'Analisar historicamente o uso da tecnologia, incluindo a digital, nas diferentes dimensões da vida humana, considerando indicadores ambientais e de qualidade de vida.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Diversidade de ecossistemas Fenômenos naturais e impactos ambientais Programas e indicadores de saúde pública';

-- Terra e Universo
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Composição do ar Efeito estufa Camada de ozônio Fenômenos naturais (vulcões, terremotos e tsunamis) Placas tectônicas e deriva continental' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Terra e Universo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI12', 'Demonstrar que o ar é uma mistura de gases, identificando sua composição, e discutir fenômenos naturais ou antrópicos que podem alterar essa composição.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Composição do ar Efeito estufa Camada de ozônio Fenômenos naturais (vulcões, terremotos e tsunamis) Placas tectônicas e deriva continental';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI13', 'Descrever o mecanismo natural do efeito estufa, seu papel fundamental para o desenvolvimento da vida na Terra, discutir as ações humanas responsáveis pelo seu aumento artificial (queima dos combustíveis fósseis, desmatamento, queimadas etc.) e selecionar e implementar propostas para a reversão ou controle desse quadro.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Composição do ar Efeito estufa Camada de ozônio Fenômenos naturais (vulcões, terremotos e tsunamis) Placas tectônicas e deriva continental';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI14', 'Justificar a importância da camada de ozônio para a vida na Terra, identificando os fatores que aumentam ou diminuem sua presença na atmosfera, e discutir propostas individuais e coletivas para sua preservação.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Composição do ar Efeito estufa Camada de ozônio Fenômenos naturais (vulcões, terremotos e tsunamis) Placas tectônicas e deriva continental';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI15', 'Interpretar fenômenos naturais (como vulcões, terremotos e tsunamis) e justificar a rara ocorrência desses fenômenos no Brasil, com base no modelo das placas tectônicas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Composição do ar Efeito estufa Camada de ozônio Fenômenos naturais (vulcões, terremotos e tsunamis) Placas tectônicas e deriva continental';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07CI16', 'Justificar o formato das costas brasileira e africana com base na teoria da deriva dos continentes.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Composição do ar Efeito estufa Camada de ozônio Fenômenos naturais (vulcões, terremotos e tsunamis) Placas tectônicas e deriva continental';

-- ============================================
-- 8º ANO - ANOS FINAIS
-- ============================================

-- Matéria e energia
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Fontes e tipos de energia Transformação de energia Cálculo de consumo de energia elétrica Circuitos elétricos Uso consciente de energia elétrica' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Matéria e energia' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI01', 'Identificar e classificar diferentes fontes (renováveis e não renováveis) e tipos de energia utilizados em residências, comunidades ou cidades.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Fontes e tipos de energia Transformação de energia Cálculo de consumo de energia elétrica Circuitos elétricos Uso consciente de energia elétrica';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI02', 'Construir circuitos elétricos com pilha/bateria, fios e lâmpada ou outros dispositivos e compará-los a circuitos elétricos residenciais.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Fontes e tipos de energia Transformação de energia Cálculo de consumo de energia elétrica Circuitos elétricos Uso consciente de energia elétrica';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI03', 'Classificar equipamentos elétricos residenciais (chuveiro, ferro, lâmpadas, TV, rádio, geladeira etc.) de acordo com o tipo de transformação de energia (da energia elétrica para a térmica, luminosa, sonora e mecânica, por exemplo).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Fontes e tipos de energia Transformação de energia Cálculo de consumo de energia elétrica Circuitos elétricos Uso consciente de energia elétrica';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI04', 'Calcular o consumo de eletrodomésticos a partir dos dados de potência (descritos no próprio equipamento) e tempo médio de uso para avaliar o impacto de cada equipamento no consumo doméstico mensal.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Fontes e tipos de energia Transformação de energia Cálculo de consumo de energia elétrica Circuitos elétricos Uso consciente de energia elétrica';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI05', 'Propor ações coletivas para otimizar o uso de energia elétrica em sua escola e/ou comunidade, com base na seleção de equipamentos segundo critérios de sustentabilidade (consumo de energia e eficiência energética) e hábitos de consumo responsável.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Fontes e tipos de energia Transformação de energia Cálculo de consumo de energia elétrica Circuitos elétricos Uso consciente de energia elétrica';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI06', 'Discutir e avaliar usinas de geração de energia elétrica (termelétricas, hidrelétricas, eólicas etc.), suas semelhanças e diferenças, seus impactos socioambientais, e como essa energia chega e é usada em sua cidade, comunidade, casa ou escola.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Fontes e tipos de energia Transformação de energia Cálculo de consumo de energia elétrica Circuitos elétricos Uso consciente de energia elétrica';

-- Vida e evolução
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Mecanismos reprodutivos Sexualidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Vida e evolução' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI07', 'Comparar diferentes processos reprodutivos em plantas e animais em relação aos mecanismos adaptativos e evolutivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Mecanismos reprodutivos Sexualidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI08', 'Analisar e explicar as transformações que ocorrem na puberdade considerando a atuação dos hormônios sexuais e do sistema nervoso.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Mecanismos reprodutivos Sexualidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI09', 'Comparar o modo de ação e a eficácia dos diversos métodos contraceptivos e justificar a necessidade de compartilhar a responsabilidade na escolha e na utilização do método mais adequado à prevenção da gravidez precoce e indesejada e de Doenças Sexualmente Transmissíveis (DST).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Mecanismos reprodutivos Sexualidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI10', 'Identificar os principais sintomas, modos de transmissão e tratamento de algumas DST (com ênfase na AIDS), e discutir estratégias e métodos de prevenção.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Mecanismos reprodutivos Sexualidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI11', 'Selecionar argumentos que evidenciem as múltiplas dimensões da sexualidade humana (biológica, sociocultural, afetiva e ética).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Mecanismos reprodutivos Sexualidade';

-- Terra e Universo
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Sistema Sol, Terra e Lua Clima' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Terra e Universo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI12', 'Justificar, por meio da construção de modelos e da observação da Lua no céu, a ocorrência das fases da Lua e dos eclipses, com base nas posições relativas entre Sol, Terra e Lua.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Sistema Sol, Terra e Lua Clima';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI13', 'Representar os movimentos de rotação e translação da Terra e analisar o papel da inclinação do eixo de rotação da Terra em relação à sua órbita na ocorrência das estações do ano, com a utilização de modelos tridimensionais.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Sistema Sol, Terra e Lua Clima';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI14', 'Relacionar climas regionais aos padrões de circulação atmosférica e oceânica e ao aquecimento desigual causado pela forma e pelos movimentos da Terra.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Sistema Sol, Terra e Lua Clima';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI15', 'Identificar as principais variáveis envolvidas na previsão do tempo e simular situações nas quais elas possam ser medidas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Sistema Sol, Terra e Lua Clima';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08CI16', 'Discutir iniciativas que contribuam para restabelecer o equilíbrio ambiental a partir da identificação de alterações climáticas regionais e globais provocadas pela intervenção humana.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Sistema Sol, Terra e Lua Clima';

-- ============================================
-- 9º ANO - ANOS FINAIS
-- ============================================

-- Matéria e energia
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Aspectos quantitativos das transformações químicas Estrutura da matéria Radiações e suas aplicações na saúde' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Matéria e energia' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI01', 'Investigar as mudanças de estado físico da matéria e explicar essas transformações com base no modelo de constituição submicroscópica.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Aspectos quantitativos das transformações químicas Estrutura da matéria Radiações e suas aplicações na saúde';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI02', 'Comparar quantidades de reagentes e produtos envolvidos em transformações químicas, estabelecendo a proporção entre as suas massas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Aspectos quantitativos das transformações químicas Estrutura da matéria Radiações e suas aplicações na saúde';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI03', 'Identificar modelos que descrevem a estrutura da matéria (constituição do átomo e composição de moléculas simples) e reconhecer sua evolução histórica.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Aspectos quantitativos das transformações químicas Estrutura da matéria Radiações e suas aplicações na saúde';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI04', 'Planejar e executar experimentos que evidenciem que todas as cores de luz podem ser formadas pela composição das três cores primárias da luz e que a cor de um objeto está relacionada também à cor da luz que o ilumina.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Aspectos quantitativos das transformações químicas Estrutura da matéria Radiações e suas aplicações na saúde';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI05', 'Investigar os principais mecanismos envolvidos na transmissão e recepção de imagem e som que revolucionaram os sistemas de comunicação humana.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Aspectos quantitativos das transformações químicas Estrutura da matéria Radiações e suas aplicações na saúde';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI06', 'Classificar as radiações eletromagnéticas por suas frequências, fontes e aplicações, discutindo e avaliando as implicações de seu uso em controle remoto, telefone celular, raio X, forno de micro-ondas, fotocélulas etc.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Aspectos quantitativos das transformações químicas Estrutura da matéria Radiações e suas aplicações na saúde';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI07', 'Discutir o papel do avanço tecnológico na aplicação das radiações na medicina diagnóstica (raio X, ultrassom, ressonância nuclear magnética) e no tratamento de doenças (radioterapia, cirurgia ótica a laser, infravermelho, ultravioleta etc.).', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Aspectos quantitativos das transformações químicas Estrutura da matéria Radiações e suas aplicações na saúde';

-- Vida e evolução
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Hereditariedade Ideias evolucionistas Preservação da biodiversidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Vida e evolução' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI08', 'Associar os gametas à transmissão das características hereditárias, estabelecendo relações entre ancestrais e descendentes.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Hereditariedade Ideias evolucionistas Preservação da biodiversidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI09', 'Discutir as ideias de Mendel sobre hereditariedade (fatores hereditários, segregação, gametas, fecundação), considerando-as para resolver problemas envolvendo a transmissão de características hereditárias em diferentes organismos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Hereditariedade Ideias evolucionistas Preservação da biodiversidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI10', 'Comparar as ideias evolucionistas de Lamarck e Darwin apresentadas em textos científicos e históricos, identificando semelhanças e diferenças entre essas ideias e sua importância para explicar a diversidade biológica.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Hereditariedade Ideias evolucionistas Preservação da biodiversidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI11', 'Discutir a evolução e a diversidade das espécies com base na atuação da seleção natural sobre as variantes de uma mesma espécie, resultantes de processo reprodutivo.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Hereditariedade Ideias evolucionistas Preservação da biodiversidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI12', 'Justificar a importância das unidades de conservação para a preservação da biodiversidade e do patrimônio nacional, considerando os diferentes tipos de unidades (parques, reservas e florestas nacionais), as populações humanas e as atividades a eles relacionados.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Hereditariedade Ideias evolucionistas Preservação da biodiversidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI13', 'Propor iniciativas individuais e coletivas para a solução de problemas ambientais da cidade ou da comunidade, com base na análise de ações de consumo consciente e de sustentabilidade bem-sucedidas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Hereditariedade Ideias evolucionistas Preservação da biodiversidade';

-- Terra e Universo
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Composição, estrutura e localização do Sistema Solar no Universo Astronomia e cultura Vida humana fora da Terra Ordem de grandeza astronômica Evolução estelar' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ciências' AND unidade_tematica = 'Terra e Universo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI14', 'Descrever a composição e a estrutura do Sistema Solar (Sol, planetas rochosos, planetas gigantes gasosos e corpos menores), assim como a localização do Sistema Solar na nossa Galáxia (a Via Láctea) e dela no Universo (apenas uma galáxia Amongbillions).', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Composição, estrutura e localização do Sistema Solar no Universo Astronomia e cultura Vida humana fora da Terra Ordem de grandeza astronômica Evolução estelar';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI15', 'Relacionar diferentes leituras do céu e explicações sobre a origem da Terra, do Sol ou do Sistema Solar às necessidades de distintas culturas (agricultura, caça, mito, orientação espacial e temporal etc.).', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Composição, estrutura e localização do Sistema Solar no Universo Astronomia e cultura Vida humana fora da Terra Ordem de grandeza astronômica Evolução estelar';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI16', 'Selecionar argumentos sobre a viabilidade da sobrevivência humana fora da Terra, com base nas condições necessárias à vida, nas características dos planetas e nas distâncias e nos tempos envolvidos em viagens interplanetárias e interestelares.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Composição, estrutura e localização do Sistema Solar no Universo Astronomia e cultura Vida humana fora da Terra Ordem de grandeza astronômica Evolução estelar';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09CI17', 'Analisar o ciclo evolutivo do Sol (nascimento, vida e morte) baseado no conhecimento das etapas de evolução de estrelas de diferentes dimensões e os efeitos desse processo no nosso planeta.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ciências' AND oc.objeto_conhecimento = 'Composição, estrutura e localização do Sistema Solar no Universo Astronomia e cultura Vida humana fora da Terra Ordem de grandeza astronômica Evolução estelar';