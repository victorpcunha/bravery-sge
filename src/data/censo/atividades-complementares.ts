// INEP Censo Escolar 2026 — Tabela de Tipo de Atividade Complementar
// Fonte: Tabela de Tipo de Atividade Complementar 2026.xlsx (aba "Tabela")
// documentacao_interna/Censo Escolar/Arquivos do INEP/2026/Matricula Inicial/v4/Tabelas Auxiliares/
//
// CONVENÇÕES:
// - `codigo` é o Código da Atividade (5 dígitos) — é o que vai para a exportação
//   (atividade_complementar_1..6 no Registro 20). A UI exibe apenas `nome`.
// - Códigos com nome vazio na planilha (15002, 15003, 19101, 19104, 19105, 22032)
//   foram EXCLUÍDOS deste catálogo.
// - Onde a planilha omite o nome da Área/Subárea (células mescladas), o nome foi
//   repetido da Área (casos 31, 41 e 13x) e documentado abaixo.

export interface AtividadeComplementar {
  codigo: string;
  nome: string;
  area: string;
  subarea: string;
}

export const ATIVIDADES_COMPLEMENTARES: AtividadeComplementar[] = [
  // ----- 1. Cultura, Artes e Educação Patrimonial -----
  { codigo: '11002', nome: 'Canto coral', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '11. Música' },
  { codigo: '11006', nome: 'Banda', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '11. Música' },
  { codigo: '11011', nome: 'Iniciação musical', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '11. Música' },
  { codigo: '11012', nome: 'Percussão corporal', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '11. Música' },
  { codigo: '11013', nome: 'Composição e produção musical digital', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '11. Música' },
  { codigo: '11014', nome: 'Escrita Musical', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '11. Música' },
  { codigo: '11015', nome: 'Instalação sonora', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '11. Música' },
  { codigo: '11016', nome: 'Trilha sonora para filmes e games', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '11. Música' },
  { codigo: '12003', nome: 'Desenho', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12004', nome: 'Escultura e Cerâmica', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12005', nome: 'Grafite', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12007', nome: 'Pintura', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12008', nome: 'Arte e inteligência artificial', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12009', nome: 'Arte digital', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12010', nome: 'Fotografia', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12011', nome: 'Intervenção Urbana', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12012', nome: 'Videoarte', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12013', nome: 'Instalação artística', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '12014', nome: 'História em Quadrinhos', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '12. Artes visuais' },
  { codigo: '13001', nome: 'Exibição', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '13. Audiovisual' },
  { codigo: '13002', nome: 'Produção audiovisual', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '13. Audiovisual' },
  { codigo: '14001', nome: 'Teatro', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '14. Artes cênicas' },
  { codigo: '14002', nome: 'Danças', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '14. Artes cênicas' },
  { codigo: '14004', nome: 'Circo-teatro e Palhaçaria', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '14. Artes cênicas' },
  { codigo: '15001', nome: 'Capoeira', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '15. Manifestações Culturais Regionais' },
  { codigo: '15004', nome: 'Contos', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '15. Manifestações Culturais Regionais' },
  { codigo: '16001', nome: 'Educação Patrimonial', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '16. Educação Patrimonial' },
  { codigo: '16002', nome: 'Passeios e visitas a monumentos locais', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '16. Educação Patrimonial' },
  { codigo: '16003', nome: 'Projetos de preservação do patrimônio', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '16. Educação Patrimonial' },
  { codigo: '17004', nome: 'Cantinho de Leitura', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '17. Leitura e Salas Temáticas' },
  { codigo: '17002', nome: 'Línguas Estrangeiras', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '17. Leitura e Salas Temáticas' },
  { codigo: '17005', nome: 'Contação de histórias', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '17. Leitura e Salas Temáticas' },
  { codigo: '19001', nome: 'Eventos de celebração à Diversidade Cultural na Escola', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '19. Outras' },
  { codigo: '19002', nome: 'Promoção do respeito à Diversidade Cultural', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '19. Outras' },
  { codigo: '19003', nome: 'Visita a Equipamentos de Cultura da Localidade', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '19. Outras' },
  { codigo: '19004', nome: 'Passeios externos', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '19. Outras' },
  { codigo: '19005', nome: 'Festivais e mostras artísticas', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '19. Outras' },
  { codigo: '19006', nome: 'Curadoria', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '19. Outras' },
  { codigo: '19007', nome: 'Performance', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '19. Outras' },
  { codigo: '19999', nome: 'Outra categoria de Cultura, Artes e Educação Patrimonial', area: '1. Cultura, Artes e Educação Patrimonial', subarea: '19. Outras' },

  // ----- 2. Esporte e Lazer -----
  { codigo: '21001', nome: 'Recreação (Brinquedoteca e Jogos)', area: '2. Esporte e Lazer', subarea: '21. Recreação' },
  { codigo: '21002', nome: 'Brincar livre', area: '2. Esporte e Lazer', subarea: '21. Recreação' },
  { codigo: '21003', nome: 'Jogos específicos para a Educação Infantil', area: '2. Esporte e Lazer', subarea: '21. Recreação' },
  { codigo: '22007', nome: 'Yoga', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22009', nome: 'Tênis de campo', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22011', nome: 'Atletismo', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22012', nome: 'Badminton', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22014', nome: 'Basquete', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22015', nome: 'Ciclismo', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22018', nome: 'Futebol', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22019', nome: 'Futsal', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22020', nome: 'Ginástica (rítmica, artística, acrobática)', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22021', nome: 'Handebol', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22022', nome: 'Judô', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22023', nome: 'Karatê', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22024', nome: 'Luta Olímpica', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22025', nome: 'Natação', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22026', nome: 'Taekwondo', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22027', nome: 'Tênis de Mesa', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22028', nome: 'Voleibol', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22029', nome: 'Vôlei de Praia', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22033', nome: 'Balé', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22034', nome: 'Skate e esportes radicais urbanos', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '22035', nome: 'Habilidades circenses', area: '2. Esporte e Lazer', subarea: '22. Atividades Desportivas' },
  { codigo: '29999', nome: 'Outra categoria de Esporte e Lazer', area: '2. Esporte e Lazer', subarea: '29. Outras' },

  // ----- 3. Acompanhamento Pedagógico -----
  // (planilha omite os nomes de Área/Subárea nestas linhas — área inferida de
  // "39999 Outra categoria de Acompanhamento Pedagógico"; subárea 31 sem nome
  // próprio, usa o nome da área)
  { codigo: '31001', nome: 'Matemática', area: '3. Acompanhamento Pedagógico', subarea: '31. Acompanhamento Pedagógico' },
  { codigo: '31016', nome: 'Linguagens', area: '3. Acompanhamento Pedagógico', subarea: '31. Acompanhamento Pedagógico' },
  { codigo: '31017', nome: 'Ciências da Natureza', area: '3. Acompanhamento Pedagógico', subarea: '31. Acompanhamento Pedagógico' },
  { codigo: '31018', nome: 'Ciências Humanas e Sociais', area: '3. Acompanhamento Pedagógico', subarea: '31. Acompanhamento Pedagógico' },
  { codigo: '39999', nome: 'Outra categoria de Acompanhamento Pedagógico', area: '3. Acompanhamento Pedagógico', subarea: '39. Outras' },

  // ----- 4. Educação em Direitos Humanos, Cidadania e Civismo -----
  // (planilha omite o nome da Subárea — usa o nome da Área)
  { codigo: '41007', nome: 'Educação em Direitos Humanos', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41001', nome: 'Direitos da criança e do adolescente', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41014', nome: 'Respeito e valorização do idoso', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41015', nome: 'Educação para o trânsito', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41016', nome: 'Estudo do Estatuto do Idoso', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41017', nome: 'Legislação e conduta no Trânsito', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41018', nome: 'Parcerias com os órgãos de Trânsito', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41019', nome: 'Ações de respeito à diversidade', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41020', nome: 'Constituição, direitos e deveres do cidadão', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41021', nome: 'Estudo do Estatuto da Criança e do Adolescente', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41022', nome: 'Ações de integração Família e Escola', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41023', nome: 'Ações de integração Comunidade e Escola', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41024', nome: 'Vida Familiar e Social', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41025', nome: 'Protagonismo Estudantil, Projeto de Vida, Agremiações Estudantis', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41026', nome: 'Cultura de paz', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41027', nome: 'Direitos dos refugiados e imigrantes', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41028', nome: 'Educação Inclusiva', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },
  { codigo: '41029', nome: 'Democracia e participação social', area: '4. Educação em Direitos Humanos, Cidadania e Civismo', subarea: '41. Educação em Direitos Humanos, Cidadania e Civismo' },

  // ----- 10. Iniciação Científica -----
  { codigo: '10103', nome: 'Iniciação Científica', area: '10. Iniciação Científica', subarea: '101. Iniciação Científica' },

  // ----- 13. Educação Ambiental, Desenvolvimento Sustentável -----
  // (planilha omite o nome da Subárea — usa o nome da Área)
  { codigo: '13301', nome: 'Educação Ambiental e Desenvolvimento Sustentável', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },
  { codigo: '13104', nome: 'Conservação do solo e composteira: canteiros sustentáveis (horta) e/ou jardinagem escolar', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },
  { codigo: '13303', nome: 'Reciclagem', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },
  { codigo: '13304', nome: 'Reflorestamento - Plantio de árvores', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },
  { codigo: '13305', nome: 'Consumo consciente de água', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },
  { codigo: '13306', nome: 'Escolas sustentáveis e COM-vida', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },
  { codigo: '13307', nome: 'Coleta seletiva/Gestão de resíduos', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },
  { codigo: '13308', nome: 'Captação e aproveitamento de água de chuva', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },
  { codigo: '13309', nome: 'Uso de energias alternativas na escola', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },
  { codigo: '13310', nome: 'Projetos de pesquisa na escola e entorno', area: '13. Educação Ambiental, Desenvolvimento Sustentável', subarea: '133. Educação Ambiental, Desenvolvimento Sustentável' },

  // ----- 14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica -----
  { codigo: '14101', nome: 'Fotografia', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '141. Comunicação e Uso de Mídias' },
  { codigo: '14102', nome: 'História em Quadrinhos', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '141. Comunicação e Uso de Mídias' },
  { codigo: '14103', nome: 'Jornal Escolar', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '141. Comunicação e Uso de Mídias' },
  { codigo: '14104', nome: 'Rádio Escolar', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '141. Comunicação e Uso de Mídias' },
  { codigo: '14105', nome: 'Vídeo', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '141. Comunicação e Uso de Mídias' },
  { codigo: '14106', nome: 'Playlists comentadas, fanfics, fanzines, e-zines, fanvídeos, fanclipes', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '141. Comunicação e Uso de Mídias' },
  { codigo: '14201', nome: 'Robótica Educacional', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '142. Cultura Digital e Tecnológica' },
  { codigo: '14202', nome: 'Tecnologias Educacionais', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '142. Cultura Digital e Tecnológica' },
  { codigo: '14203', nome: 'Ambientes de Redes Sociais', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '142. Cultura Digital e Tecnológica' },
  { codigo: '14204', nome: 'Pensamento computacional e cultura digital', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '142. Cultura Digital e Tecnológica' },
  { codigo: '14205', nome: 'Computação, programação', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '142. Cultura Digital e Tecnológica' },
  { codigo: '14206', nome: 'Ética e segurança digital', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '142. Cultura Digital e Tecnológica' },
  { codigo: '14999', nome: 'Outra Categoria de Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', area: '14. Comunicação, Uso de Mídias e Cultura Digital e Tecnológica', subarea: '149. Outras' },

  // ----- 15. Educação para valorização do multiculturalismo -----
  { codigo: '15101', nome: 'Memória e História das Comunidades Tradicionais', area: '15. Educação para valorização do multiculturalismo nas matrizes históricas e culturais Brasileiras', subarea: '151. Memória e História das Comunidades Tradicionais' },
  { codigo: '15201', nome: 'Memória e História da Cultura Afro-Brasileira e Africana', area: '15. Educação para valorização do multiculturalismo nas matrizes históricas e culturais Brasileiras', subarea: '152. Memória e História da Cultura Afro-Brasileira e Africana' },
  { codigo: '15301', nome: 'Memória e História das Culturas Indígenas', area: '15. Educação para valorização do multiculturalismo nas matrizes históricas e culturais Brasileiras', subarea: '153. Memória e História das Culturas Indígenas' },
  { codigo: '15401', nome: 'Respeito à Diversidade Étnico-Racial', area: '15. Educação para valorização do multiculturalismo nas matrizes históricas e culturais Brasileiras', subarea: '154. Diversidade e Multiculturalismo' },
  { codigo: '15402', nome: 'A contribuição dos povos no Multiculturalismo Brasileiro', area: '15. Educação para valorização do multiculturalismo nas matrizes históricas e culturais Brasileiras', subarea: '154. Diversidade e Multiculturalismo' },

  // ----- 17. Trabalho e Educação para o consumo, financeira e fiscal -----
  { codigo: '17101', nome: 'Educação para o Consumo Sustentável', area: '17. Trabalho e Educação para o consumo, financeira e fiscal', subarea: '171. Educação para o Consumo' },
  { codigo: '17102', nome: 'Fomento da Economia Solidária e Criativa', area: '17. Trabalho e Educação para o consumo, financeira e fiscal', subarea: '171. Educação para o Consumo' },
  { codigo: '17201', nome: 'Educação Financeira', area: '17. Trabalho e Educação para o consumo, financeira e fiscal', subarea: '172. Educação Financeira' },
  { codigo: '17202', nome: 'Economia', area: '17. Trabalho e Educação para o consumo, financeira e fiscal', subarea: '172. Educação Financeira' },
  { codigo: '17301', nome: 'Controle social do gasto público', area: '17. Trabalho e Educação para o consumo, financeira e fiscal', subarea: '173. Educação Fiscal' },
  { codigo: '17302', nome: 'Educação Tributária', area: '17. Trabalho e Educação para o consumo, financeira e fiscal', subarea: '173. Educação Fiscal' },
  { codigo: '17401', nome: 'Direitos e Deveres do Trabalhador', area: '17. Trabalho e Educação para o consumo, financeira e fiscal', subarea: '174. Trabalho' },
  { codigo: '17402', nome: 'O mundo do trabalho', area: '17. Trabalho e Educação para o consumo, financeira e fiscal', subarea: '174. Trabalho' },

  // ----- 19. Saúde e Educação Socioemocional -----
  { codigo: '19102', nome: 'Higiene e Cuidados Pessoais/Higiene Pessoal', area: '19. Saúde e Educação Socioemocional', subarea: '191. Promoção da Saúde' },
  { codigo: '19103', nome: 'Saúde Bucal', area: '19. Saúde e Educação Socioemocional', subarea: '191. Promoção da Saúde' },
  { codigo: '19106', nome: 'Prevenção ao uso de álcool, Tabaco e Drogas', area: '19. Saúde e Educação Socioemocional', subarea: '191. Promoção da Saúde' },
  { codigo: '19107', nome: 'Primeiros Socorros', area: '19. Saúde e Educação Socioemocional', subarea: '191. Promoção da Saúde' },
  { codigo: '19108', nome: 'Ações de prevenção a doenças epidemiológicas', area: '19. Saúde e Educação Socioemocional', subarea: '191. Promoção da Saúde' },
  { codigo: '19109', nome: 'Meditação', area: '19. Saúde e Educação Socioemocional', subarea: '191. Promoção da Saúde' },
  { codigo: '19110', nome: 'Saúde Mental e Bem-Estar Psicológico', area: '19. Saúde e Educação Socioemocional', subarea: '191. Promoção da Saúde' },
  { codigo: '19201', nome: 'Desenvolvimento de competências socioemocionais', area: '19. Saúde e Educação Socioemocional', subarea: '192. Educação de competências socioemocionais' },
  { codigo: '19202', nome: 'Atividades de autoconhecimento, identificação e gestão de sentimentos', area: '19. Saúde e Educação Socioemocional', subarea: '192. Educação de competências socioemocionais' },
  { codigo: '19203', nome: 'Atividades de empatia e gestão de conflitos', area: '19. Saúde e Educação Socioemocional', subarea: '192. Educação de competências socioemocionais' },

  // ----- 20. Educação Alimentar e Nutricional -----
  { codigo: '20101', nome: 'Educação alimentar e nutricional', area: '20. Educação Alimentar e Nutricional', subarea: '201. Educação Alimentar e Nutricional' },
  { codigo: '20102', nome: 'Estudos dos aspectos nutricionais dos alimentos', area: '20. Educação Alimentar e Nutricional', subarea: '201. Educação Alimentar e Nutricional' },
  { codigo: '20103', nome: 'Ações de Prevenção dos distúrbios alimentares', area: '20. Educação Alimentar e Nutricional', subarea: '201. Educação Alimentar e Nutricional' },
  { codigo: '20104', nome: 'Elaboração de Cardápio Contextualizado local', area: '20. Educação Alimentar e Nutricional', subarea: '201. Educação Alimentar e Nutricional' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getAtividadeByCodigo(codigo: string): AtividadeComplementar | undefined {
  return ATIVIDADES_COMPLEMENTARES.find(a => a.codigo === codigo);
}

export interface GrupoAtividades {
  area: string;
  subareas: { subarea: string; itens: AtividadeComplementar[] }[];
}

export function agruparAtividades(): GrupoAtividades[] {
  const grupos: GrupoAtividades[] = [];
  for (const a of ATIVIDADES_COMPLEMENTARES) {
    let g = grupos.find(g => g.area === a.area);
    if (!g) {
      g = { area: a.area, subareas: [] };
      grupos.push(g);
    }
    let s = g.subareas.find(s => s.subarea === a.subarea);
    if (!s) {
      s = { subarea: a.subarea, itens: [] };
      g.subareas.push(s);
    }
    s.itens.push(a);
  }
  return grupos;
}

export const MAX_ATIVIDADES_POR_TURMA = 6;
