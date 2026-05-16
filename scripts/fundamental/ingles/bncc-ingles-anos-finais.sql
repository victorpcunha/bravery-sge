-- ============================================
-- LÍNGUA INGLESA - ANOS FINAIS (6º AO 9º ANO)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Língua /Literatura estrangeira - Inglês', 'Oralidade', 'anos_finais'),
('Língua /Literatura estrangeira - Inglês', 'Leitura', 'anos_finais'),
('Língua /Literatura estrangeira - Inglês', 'Escrita', 'anos_finais'),
('Língua /Literatura estrangeira - Inglês', 'Conhecimentos Linguísticos', 'anos_finais'),
('Língua /Literatura estrangeira - Inglês', 'Dimensão Intercultural', 'anos_finais');


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Construção de laços afetivos e convívio social' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI01', 'Interagir em situações de intercâmbio oral, demonstrando iniciativa para utilizar a língua inglesa.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Construção de laços afetivos e convívio social';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI02', 'Coletar informações do grupo, perguntando e respondendo sobre a família, os amigos, a escola e a comunidade.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Construção de laços afetivos e convívio social';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Funções e usos da língua inglesa em sala de aula' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI03', 'Solicitar esclarecimentos em língua inglesa sobre o que não entendeu e o significado de palavras ou expressões desconhecidas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Funções e usos da língua inglesa em sala de aula';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Estratégias de compreensão de textos orais: palavras cognatas e pistas do contexto discursivo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI04', 'Reconhecer, com o apoio de palavras cognatas e pistas do contexto discursivo, o assunto e as informações principais em textos orais sobre temas familiares.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Estratégias de compreensão de textos orais: palavras cognatas e pistas do contexto discursivo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção de textos orais, com a mediação do professor' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI05', 'Aplicar os conhecimentos da língua inglesa para falar de si e de outras pessoas, explicitando informações pessoais e características relacionadas a gostos, preferências e rotinas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Produção de textos orais, com a mediação do professor';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI06', 'Planejar apresentação sobre a família, a comunidade e a escola, compartilhando-a oralmente com o grupo.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Produção de textos orais, com a mediação do professor';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Hipóteses sobre a finalidade de um texto' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI07', 'Formular hipóteses sobre a finalidade de um texto em língua inglesa, com base em sua estrutura, organização textual e pistas gráficas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Hipóteses sobre a finalidade de um texto';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Compreensão geral e específica: leitura rápida (skimming, scanning)' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI08', 'Identificar o assunto de um texto, reconhecendo sua organização textual e palavras cognatas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Compreensão geral e específica: leitura rápida (skimming, scanning)';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI09', 'Localizar informações específicas em texto.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Compreensão geral e específica: leitura rápida (skimming, scanning)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Construção de repertório lexical e autonomia leitora' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI10', 'Conhecer a organização de um dicionário bilíngue (impresso e/ou on-line) para construir repertório lexical.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Construção de repertório lexical e autonomia leitora';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI11', 'Explorar ambientes virtuais e/ou aplicativos para construir repertório lexical na língua inglesa.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Construção de repertório lexical e autonomia leitora';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Partilha de leitura, com mediação do professor' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI12', 'Interessar-se pelo texto lido, compartilhando suas ideias sobre o que o texto informa/comunica.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Partilha de leitura, com mediação do professor';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Planejamento do texto: brainstorming' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI13', 'Listar ideias para a produção de textos, levando em conta o tema e o assunto.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Planejamento do texto: brainstorming';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Planejamento do texto: organização de ideias' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI14', 'Organizar ideias, selecionando-as em função da estrutura e do objetivo do texto.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Planejamento do texto: organização de ideias';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção de textos escritos, em formatos diversos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI15', 'Produzir textos escritos em língua inglesa (histórias em quadrinhos, cartazes, chats, blogues, agendas, fotolegendas, entre outros), sobre si mesmo, sua família, seus amigos, gostos, preferências e rotinas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Produção de textos escritos, em formatos diversos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Construção de repertório lexical' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI16', 'Construir repertório relativo às expressões usadas para o convívio social e o uso da língua inglesa em sala de aula.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Construção de repertório lexical';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI17', 'Construir repertório lexical relativo a temas familiares (escola, família, rotina diária, atividades de lazer, esportes, entre outros).', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Construção de repertório lexical';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Pronúncia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI18', 'Reconhecer semelhanças e diferenças na pronúncia de palavras da língua inglesa e da língua materna e/ou outras línguas conhecidas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Pronúncia';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Presente simples e contínuo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI19', 'Utilizar o presente do indicativo para identificar pessoas (verbo to be) e descrever rotinas diárias.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Presente simples e contínuo';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI20', 'Utilizar o presente contínuo para descrever ações em progresso.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Presente simples e contínuo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Imperativo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI21', 'Reconhecer o uso do imperativo em enunciados de atividades, comandos e instruções.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Imperativo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Caso genitivo (‘s)' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI22', 'Descrever relações por meio do uso de apóstrofo (’) + s.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Caso genitivo (‘s)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Adjetivos possessivos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI23', 'Empregar, de forma inteligível, os adjetivos possessivos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Adjetivos possessivos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Países que têm a língua inglesa como língua materna e/ou oficial' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Dimensão Intercultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI24', 'Investigar o alcance da língua inglesa no mundo: como língua materna e/ou oficial (primeira ou segunda língua).', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Países que têm a língua inglesa como língua materna e/ou oficial';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Presença da língua inglesa no cotidiano' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Dimensão Intercultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI25', 'Identificar a presença da língua inglesa na sociedade brasileira/comunidade e seu significado.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Presença da língua inglesa no cotidiano';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LI26', 'Avaliar, problematizando elementos/produtos culturais de países de língua inglesa absorvidos pela sociedade brasileira/comunidade.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Presença da língua inglesa no cotidiano';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Funções e usos da língua inglesa: convivência e colaboração em sala de aula' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI01', 'Interagir em situações de intercâmbio oral para realizar as atividades em sala de aula, de forma respeitosa e colaborativa.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Funções e usos da língua inglesa: convivência e colaboração em sala de aula';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Práticas investigativas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI02', 'Entrevistar os colegas para conhecer suas histórias de vida.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Práticas investigativas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Estratégias de compreensão de textos orais: conhecimentos prévios' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI03', 'Mobilizar conhecimentos prévios para compreender texto oral.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Estratégias de compreensão de textos orais: conhecimentos prévios';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Compreensão de textos orais de cunho descritivo ou narrativo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI04', 'Identificar o contexto, a finalidade, o assunto e os interlocutores em textos orais presentes no cinema, na internet, na televisão, entre outros.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Compreensão de textos orais de cunho descritivo ou narrativo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção de textos orais, com mediação do professor' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI05', 'Compor, em língua inglesa, narrativas orais sobre fatos, acontecimentos e personalidades marcantes do passado.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Produção de textos orais, com mediação do professor';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Compreensão geral e específica: leitura rápida (skimming e scanning)' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI06', 'Antecipar o sentido global de textos em língua inglesa por inferências, com base em leitura rápida.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Compreensão geral e específica: leitura rápida (skimming e scanning)';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI07', 'Identificar a(s) informação(ões)-chave de partes de um texto em língua inglesa (parágrafos).', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Compreensão geral e específica: leitura rápida (skimming e scanning)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Construção do sentido global do texto' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI08', 'Relacionar as partes de um texto (parágrafos) para construir seu sentido global.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Construção do sentido global do texto';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Objetivos de leitura' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI09', 'Selecionar, em um texto, a informação desejada como objetivo de leitura.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Objetivos de leitura';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Leitura de textos digitais para estudo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI10', 'Escolher, em ambientes virtuais, textos em língua inglesa, de fontes confiáveis, para estudos/pesquisas escolares.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Leitura de textos digitais para estudo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Partilha de leitura' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI11', 'Participar de troca de opiniões e informações sobre textos lidos na sala de aula ou em outros ambientes.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Partilha de leitura';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Pré-escrita: planejamento de produção escrita' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI12', 'Planejar a escrita de textos em função do contexto (público, finalidade, layout e suporte).', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Pré-escrita: planejamento de produção escrita';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Escrita: organização em parágrafos ou tópicos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI13', 'Organizar texto em unidades de sentido, dividindo-o em parágrafos ou tópicos e subtópicos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Escrita: organização em parágrafos ou tópicos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção de textos escritos, em formatos diversos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI14', 'Produzir textos diversos sobre fatos, acontecimentos e personalidades do passado.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Produção de textos escritos, em formatos diversos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Construção de repertório lexical' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI15', 'Construir repertório lexical relativo a verbos regulares e irregulares, preposições e conectores.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Construção de repertório lexical';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Pronúncia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI16', 'Reconhecer a pronúncia de verbos regulares no passado (-ed).', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Pronúncia';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Polissemia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI17', 'Explorar o caráter polissêmico de palavras de acordo com o contexto de uso.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Polissemia';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Passado simples e contínuo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI18', 'Utilizar o passado simples e o passado contínuo para produzir textos orais e escritos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Passado simples e contínuo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Pronomes do caso reto e do caso oblíquo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI19', 'Discriminar sujeito de objeto utilizando pronomes a eles relacionados.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Pronomes do caso reto e do caso oblíquo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Verbo modal can (presente e passado)' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI20', 'Empregar, de forma inteligível, o verbo modal can para descrever habilidades.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Verbo modal can (presente e passado)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A língua inglesa como língua global na sociedade contemporânea' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Dimensão Intercultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI21', 'Analisar o alcance da língua inglesa e seus contextos de uso no mundo globalizado.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'A língua inglesa como língua global na sociedade contemporânea';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Variação linguística' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Dimensão Intercultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI22', 'Explorar modos de falar em língua inglesa, reconhecendo a variação linguística como fenômeno natural das línguas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Variação linguística';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LI23', 'Reconhecer a variação linguística como manifestação de formas de pensar e expressar o mundo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Variação linguística';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Negociação de sentidos (mal-entendidos e conflito de opiniões)' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI01', 'Fazer uso da língua inglesa para resolver mal-entendidos, emitir opiniões e esclarecer informações.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Negociação de sentidos (mal-entendidos e conflito de opiniões)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Usos de recursos linguísticos e paralinguísticos no intercâmbio oral' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI02', 'Explorar o uso de recursos linguísticos e paralinguísticos em situações de interação oral.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Usos de recursos linguísticos e paralinguísticos no intercâmbio oral';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Compreensão de textos orais, multimodais, de cunho informativo/jornalístico' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI03', 'Construir o sentido global de textos orais, relacionando suas partes, o assunto principal e informações relevantes.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Compreensão de textos orais, multimodais, de cunho informativo/jornalístico';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção de textos orais com autonomia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI04', 'Utilizar recursos e repertório linguísticos apropriados para informar/comunicar/falar do futuro.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Produção de textos orais com autonomia';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Construção de sentidos por meio de inferências e reconhecimento de implícitos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI05', 'Inferir informações e relações que não aparecem de modo explícito no texto para construção de sentidos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Construção de sentidos por meio de inferências e reconhecimento de implícitos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Leitura de textos de cunho artístico/literário' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI06', 'Apreciar textos narrativos em língua inglesa (contos, romances, entre outros), como forma de valorizar o patrimônio cultural.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Leitura de textos de cunho artístico/literário';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI07', 'Explorar ambientes virtuais e/ou aplicativos para acessar e usufruir do patrimônio artístico literário em língua inglesa.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Leitura de textos de cunho artístico/literário';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Reflexão pós-leitura' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI08', 'Analisar, criticamente, o conteúdo de textos, comparando diferentes perspectivas apresentadas sobre um mesmo assunto.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Reflexão pós-leitura';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Revisão de textos com a mediação do professor' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI09', 'Avaliar a própria produção escrita e a de colegas, com base no contexto de comunicação.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Revisão de textos com a mediação do professor';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI10', 'Reconstruir o texto, com cortes, acréscimos, reformulações e correções, para aprimoramento, edição e publicação final.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Revisão de textos com a mediação do professor';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção de textos escritos com mediação do professor/colegas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI11', 'Produzir textos (comentários em fóruns, relatos pessoais, mensagens instantâneas, tweets, reportagens, histórias de ficção, blogues, entre outros).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Produção de textos escritos com mediação do professor/colegas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI12', 'Construir repertório lexical relativo a planos, previsões e expectativas para o futuro.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Construção de repertório lexical';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Formação de palavras: prefixos e sufixos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI13', 'Reconhecer sufixos e prefixos comuns utilizados na formação de palavras em língua inglesa.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Formação de palavras: prefixos e sufixos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Verbos para indicar o futuro' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI14', 'Utilizar formas verbais do futuro para descrever planos e expectativas e fazer previsões.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Verbos para indicar o futuro';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Comparativos e superlativos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI15', 'Utilizar, de modo inteligível, as formas comparativas e superlativas de adjetivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Comparativos e superlativos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Quantificadores' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI16', 'Utilizar, de modo inteligível, some, any, many, much.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Quantificadores';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Pronomes relativos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI17', 'Empregar, de modo inteligível, os pronomes relativos (who, which, that, whose).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Pronomes relativos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Construção de repertório artístico-cultural' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Dimensão Intercultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI18', 'Construir repertório cultural por meio do contato com manifestações artístico-culturais vinculadas à língua inglesa.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Construção de repertório artístico-cultural';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Impacto de aspectos culturais na comunicação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Dimensão Intercultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI19', 'Investigar de que forma expressões, gestos e comportamentos são interpretados em função de aspectos culturais.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Impacto de aspectos culturais na comunicação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LI20', 'Examinar fatores que podem impedir o entendimento entre pessoas de culturas diferentes que falam a língua inglesa.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Impacto de aspectos culturais na comunicação';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Funções e usos da língua inglesa: persuasão' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI01', 'Fazer uso da língua inglesa para expor pontos de vista, argumentos e contra-argumentos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Funções e usos da língua inglesa: persuasão';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Compreensão de textos orais, multimodais, de cunho argumentativo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI02', 'Compilar as ideias-chave de textos por meio de tomada de notas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Compreensão de textos orais, multimodais, de cunho argumentativo';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI03', 'Analisar posicionamentos defendidos e refutados em textos orais sobre temas de interesse social e coletivo.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Compreensão de textos orais, multimodais, de cunho argumentativo';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI04', 'Expor resultados de pesquisa ou estudo com o apoio de recursos, tais como notas, gráficos, tabelas, entre outros.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Oralidade' AND oc.objeto_conhecimento = 'Produção de textos orais com autonomia';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Recursos de persuasão' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI05', 'Identificar recursos de persuasão (escolha e jogo de palavras, uso de cores e imagens, tamanho de letras), utilizados nos textos publicitários e de propaganda.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Recursos de persuasão';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Recursos de argumentação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI06', 'Distinguir fatos de opiniões em textos argumentativos da esfera jornalística.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Recursos de argumentação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI07', 'Identificar argumentos principais e as evidências/exemplos que os sustentam.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Recursos de argumentação';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Informações em ambientes virtuais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI08', 'Explorar ambientes virtuais de informação e socialização, analisando a qualidade e a validade das informações veiculadas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Informações em ambientes virtuais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI09', 'Compartilhar, com os colegas, a leitura dos textos escritos pelo grupo, valorizando os diferentes pontos de vista defendidos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Leitura' AND oc.objeto_conhecimento = 'Reflexão pós-leitura';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Escrita: construção da argumentação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI10', 'Propor potenciais argumentos para expor e defender ponto de vista em texto escrito.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Escrita: construção da argumentação';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Escrita: construção da persuasão' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI11', 'Utilizar recursos verbais e não verbais para construção da persuasão em textos da esfera publicitária.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Escrita: construção da persuasão';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção de textos escritos, com mediação do professor/colegas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Escrita' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI12', 'Produzir textos (infográficos, fóruns de discussão on-line, fotorreportagens, campanhas publicitárias, memes, entre outros).', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Escrita' AND oc.objeto_conhecimento = 'Produção de textos escritos, com mediação do professor/colegas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Usos de linguagem em meio digital: internetês' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI13', 'Reconhecer, nos novos gêneros digitais, novas formas de escrita na constituição das mensagens.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Usos de linguagem em meio digital: internetês';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Conectores (linking words)' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI14', 'Utilizar conectores indicadores de adição, condição, oposição, contraste, conclusão e síntese.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Conectores (linking words)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Orações condicionais (tipos 1 e 2)' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI15', 'Empregar, de modo inteligível, as formas verbais em orações condicionais dos tipos 1 e 2 (If-clauses).', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Orações condicionais (tipos 1 e 2)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Verbos modais: should, must, have to, may e might' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Conhecimentos Linguísticos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI16', 'Empregar os verbos should, must, have to, may e might para indicar recomendação, necessidade ou obrigação e probabilidade.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Conhecimentos Linguísticos' AND oc.objeto_conhecimento = 'Verbos modais: should, must, have to, may e might';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Expansão da língua inglesa: contexto histórico' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Dimensão Intercultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI17', 'Debater sobre a expansão da língua inglesa pelo mundo, em função do processo de colonização.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Expansão da língua inglesa: contexto histórico';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A língua inglesa e seu papel no intercâmbio científico, econômico e político' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Dimensão Intercultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI18', 'Analisar a importância da língua inglesa para o desenvolvimento das ciências, da economia e da política no cenário mundial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'A língua inglesa e seu papel no intercâmbio científico, econômico e político';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Construção de identidades no mundo globalizado' FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura estrangeira - Inglês' AND unidade_tematica = 'Dimensão Intercultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LI19', 'Discutir a comunicação intercultural por meio da língua inglesa como mecanismo de valorização pessoal e de construção de identidades.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura estrangeira - Inglês' AND ut.unidade_tematica = 'Dimensão Intercultural' AND oc.objeto_conhecimento = 'Construção de identidades no mundo globalizado';
