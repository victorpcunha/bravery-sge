-- ============================================
-- GEOGRAFIA - ANOS INICIAIS (1º AO 5º ANO)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Geografia', 'O sujeito e seu lugar no mundo', 'anos_iniciais'),
('Geografia', 'Conexões e escalas', 'anos_iniciais'),
('Geografia', 'Mundo do trabalho', 'anos_iniciais'),
('Geografia', 'Formas de representação e pensamento espacial', 'anos_iniciais'),
('Geografia', 'Natureza, ambientes e qualidade de vida', 'anos_iniciais');


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O modo de vida das crianças em diferentes lugares' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE01', 'Descrever características observadas de seus lugares de vivência (moradia, escola etc.) e identificar semelhanças e diferenças entre esses lugares.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'O modo de vida das crianças em diferentes lugares';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE02', 'Identificar semelhanças e diferenças entre jogos e brincadeiras de diferentes épocas e lugares.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'O modo de vida das crianças em diferentes lugares';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Situações de convívio em diferentes lugares' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE03', 'Identificar e relatar semelhanças e diferenças de usos do espaço público (praças, parques) para o lazer e diferentes manifestações.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Situações de convívio em diferentes lugares';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE04', 'Discutir e elaborar, coletivamente, regras de convívio em diferentes espaços (sala de aula, escola etc.).', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Situações de convívio em diferentes lugares';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ciclos naturais e a vida cotidiana' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE05', 'Observar e descrever ritmos naturais (dia e noite, variação de temperatura e umidade etc.) em diferentes escalas espaciais e temporais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Ciclos naturais e a vida cotidiana';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Diferentes tipos de trabalho existentes no seu dia a dia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE06', 'Descrever e comparar diferentes tipos de moradia ou objetos de uso cotidiano, considerando técnicas e materiais utilizados em sua produção.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Diferentes tipos de trabalho existentes no seu dia a dia';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE07', 'Descrever atividades de trabalho relacionadas com o dia a dia da sua comunidade.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Diferentes tipos de trabalho existentes no seu dia a dia';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Pontos de referência' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE08', 'Criar mapas mentais e desenhos com base em itinerários, contos literários, histórias inventadas e brincadeiras.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Pontos de referência';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE09', 'Elaborar e utilizar mapas simples para localizar elementos do local de vivência, considerando referenciais espaciais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Pontos de referência';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Condições de vida nos lugares de vivência' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE10', 'Descrever características de seus lugares de vivência relacionadas aos ritmos da natureza (chuva, vento, calor etc.).', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Condições de vida nos lugares de vivência';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01GE11', 'Associar mudanças de vestuário e hábitos alimentares em sua comunidade ao longo do ano.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Condições de vida nos lugares de vivência';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Convivência e interações entre pessoas na comunidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE01', 'Descrever a história das migrações no bairro ou comunidade em que vive.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Convivência e interações entre pessoas na comunidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE02', 'Comparar costumes e tradições de diferentes populações inseridas no bairro ou comunidade em que vive.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Convivência e interações entre pessoas na comunidade';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Riscos e cuidados nos meios de transporte e de comunicação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE03', 'Comparar diferentes meios de transporte e de comunicação, indicando o seu papel na conexão entre lugares.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Riscos e cuidados nos meios de transporte e de comunicação';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Experiências da comunidade no tempo e no espaço' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE04', 'Reconhecer semelhanças e diferenças nos hábitos, nas relações com a natureza e no modo de viver de pessoas em diferentes lugares.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Experiências da comunidade no tempo e no espaço';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Mudanças e permanências' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE05', 'Analisar mudanças e permanências, comparando imagens de um mesmo lugar em diferentes tempos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Mudanças e permanências';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Tipos de trabalho em lugares e tempos diferentes' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE06', 'Relacionar o dia e a noite a diferentes tipos de atividades sociais (horário escolar, comercial, sono etc.).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Tipos de trabalho em lugares e tempos diferentes';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE07', 'Descrever as atividades extrativas (minerais, agropecuárias e industriais) de diferentes lugares.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Tipos de trabalho em lugares e tempos diferentes';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Localização, orientação e representação espacial' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE08', 'Identificar e elaborar diferentes formas de representação (desenhos, mapas mentais, maquetes) para representar componentes da paisagem.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Localização, orientação e representação espacial';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE09', 'Identificar objetos e lugares de vivência (escola e moradia) em imagens aéreas e mapas (visão vertical) e fotografias (visão oblíqua).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Localização, orientação e representação espacial';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE10', 'Aplicar princípios de localização e posição de objetos por meio de representações espaciais da sala de aula e da escola.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Localização, orientação e representação espacial';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os usos dos recursos naturais: solo e água no campo e na cidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02GE11', 'Reconhecer a importância do solo e da água para a vida, identificando seus diferentes usos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Os usos dos recursos naturais: solo e água no campo e na cidade';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A cidade e o campo: aproximações e diferenças' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE01', 'Identificar e comparar aspectos culturais dos grupos sociais de seus lugares de vivência.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'A cidade e o campo: aproximações e diferenças';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE02', 'Identificar marcas de contribuição cultural e econômica de grupos de diferentes origens.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'A cidade e o campo: aproximações e diferenças';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE03', 'Reconhecer os diferentes modos de vida de povos e comunidades tradicionais em distintos lugares.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'A cidade e o campo: aproximações e diferenças';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Paisagens naturais e antrópicas em transformação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE04', 'Explicar como os processos naturais e históricos atuam na produção e na mudança das paisagens.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Paisagens naturais e antrópicas em transformação';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Matéria-prima e indústria' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE05', 'Identificar alimentos, minerais e outros produtos cultivados e extraídos da natureza.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Matéria-prima e indústria';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Representações cartográficas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE06', 'Identificar e interpretar imagens bidimensionais e tridimensionais em diferentes tipos de representação cartográfica.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Representações cartográficas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE07', 'Reconhecer e elaborar legendas com símbolos de diversos tipos de representações em diferentes escalas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Representações cartográficas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção, circulação e consumo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE08', 'Relacionar a produção de lixo doméstico ou da escola aos problemas causados pelo consumo excessivo.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Produção, circulação e consumo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Impactos das atividades humanas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE09', 'Investigar os usos dos recursos naturais, com destaque para os usos da água em atividades cotidianas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Impactos das atividades humanas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE10', 'Identificar os cuidados necessários para utilização da água na agricultura e na geração de energia.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Impactos das atividades humanas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03GE11', 'Comparar impactos das atividades econômicas urbanas e rurais sobre o ambiente físico natural.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Impactos das atividades humanas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Território e diversidade cultural' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE01', 'Selecionar, em seus lugares de vivência e em suas histórias familiares, elementos de distintas culturas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Território e diversidade cultural';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos migratórios no Brasil' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE02', 'Descrever processos migratórios e suas contribuições para a formação da sociedade brasileira.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Processos migratórios no Brasil';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Instâncias do poder público e canais de participação social' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE03', 'Distinguir funções e papéis dos órgãos do poder público municipal e canais de participação social.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Instâncias do poder público e canais de participação social';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Relação campo e cidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE04', 'Reconhecer especificidades e analisar a interdependência do campo e da cidade.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Relação campo e cidade';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Unidades político-administrativas do Brasil' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE05', 'Distinguir unidades político-administrativas oficiais nacionais.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Unidades político-administrativas do Brasil';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Territórios étnico-culturais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE06', 'Identificar e descrever territórios étnico-culturais existentes no Brasil.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Territórios étnico-culturais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Trabalho no campo e na cidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE07', 'Comparar as características do trabalho no campo e na cidade.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Trabalho no campo e na cidade';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção, circulação e consumo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE08', 'Descrever e discutir o processo de produção, circulação e consumo de diferentes produtos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Produção, circulação e consumo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Sistema de orientação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE09', 'Utilizar as direções cardeais na localização de componentes físicos e humanos nas paisagens.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Sistema de orientação';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Elementos constitutivos dos mapas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE10', 'Comparar tipos variados de mapas, identificando suas características e finalidades.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Elementos constitutivos dos mapas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Conservação e degradação da natureza' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04GE11', 'Identificar as características das paisagens naturais e antrópicas no ambiente em que vive.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Conservação e degradação da natureza';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Dinâmica populacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE01', 'Descrever e analisar dinâmicas populacionais na Unidade da Federação em que vive.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Dinâmica populacional';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Diferenças étnico-raciais e étnico-culturais e desigualdades sociais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE02', 'Identificar diferenças étnico-raciais e étnico-culturais e desigualdades sociais entre grupos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Diferenças étnico-raciais e étnico-culturais e desigualdades sociais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Território, redes e urbanização' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE03', 'Identificar as formas e funções das cidades e analisar as mudanças provocadas pelo seu crescimento.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Território, redes e urbanização';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE04', 'Reconhecer as características da cidade e analisar as interações entre a cidade e o campo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Território, redes e urbanização';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Trabalho e inovação tecnológica' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE05', 'Identificar e comparar as mudanças dos tipos de trabalho e desenvolvimento tecnológico.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Trabalho e inovação tecnológica';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE06', 'Identificar e comparar transformações dos meios de transporte e de comunicação.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Trabalho e inovação tecnológica';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE07', 'Identificar os diferentes tipos de energia utilizados na produção industrial, agrícola e extrativa.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Trabalho e inovação tecnológica';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Mapas e imagens de satélite' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE08', 'Analisar transformações de paisagens nas cidades, comparando fotografias e imagens de satélite.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Mapas e imagens de satélite';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Representação das cidades e do espaço urbano' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE09', 'Estabelecer conexões e hierarquias entre diferentes cidades, utilizando mapas temáticos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Representação das cidades e do espaço urbano';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Qualidade ambiental' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE10', 'Reconhecer e comparar atributos da qualidade ambiental e formas de poluição dos cursos de água e oceanos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Qualidade ambiental';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Diferentes tipos de poluição' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE11', 'Identificar e descrever problemas ambientais que ocorrem no entorno da escola, propondo soluções.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Diferentes tipos de poluição';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Gestão pública da qualidade de vida' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05GE12', 'Identificar órgãos do poder público responsáveis por buscar soluções para a melhoria da qualidade de vida.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Gestão pública da qualidade de vida';
