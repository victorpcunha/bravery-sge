# Feature Specification: Painel de Rendimento Escolar

**Feature Branch**: `028-painel-rendimento-escolar`

**Created**: 2026-09-12

**Status**: Draft

**Input**: User description: "Painel de Rendimento Escolar — Criação. Deve ser criado o Painel de Rendimento Escolar, com o objetivo de acompanhar o desempenho acadêmico dos alunos e identificar situações que necessitam de atenção pedagógica. Área de Resumo fixa, 4 KPIs gerais, abas Geral (Período, Etapa de Ensino, Turma com drill-down) e Situação (Situação com Adequado/Atenção/Risco + tendência + detalhe do aluno, e Situação Final pós-fechamento por Situações do Aluno Matriculado). Regras de cálculo reutilizam Métodos de Avaliação e dados acadêmicos existentes; performance com carregamento progressivo Escola → Etapa → Turma → Disciplina → Aluno."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — O painel tem um único objetivo principal, descritível em uma frase: permitir à coordenação acompanhar o rendimento acadêmico e identificar alunos que precisam de atenção pedagógica.
- **PE-102** — Título, subtítulo e os 4 KPIs fixos no topo comunicam imediatamente o propósito sem exigir exploração da interface.
- **PE-201** — Hierarquia reflete a tarefa: Resumo/KPIs primeiro, depois navegação Geral (como está o rendimento) vs. Situação (quem precisa de atenção), depois detalhamentos.
- **PE-202** — Filtros globais (Ano Letivo, Período de Análise, Unidade Escolar p/ superadmin) e os 4 KPIs ficam acima da dobra, pois são indispensáveis para iniciar qualquer análise.
- **PE-204** — Conteúdos agrupados por contexto: Resumo fixo, aba Geral (visão agregada), aba Situação (visão por aluno), drill-down de turma e detalhe de aluno separados.
- **PE-205** — Divulgação progressiva: detalhamento por disciplina/aluno (drill-down da turma, painel lateral do aluno) só é carregado quando o usuário solicita.
- **PE-301** — Layout Dashboard: o objetivo principal é monitorar indicadores, comparar métricas, identificar alertas e acompanhar tendências — não localizar registros nem cadastrar dados.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acompanhar rendimento geral da escola (Priority: P1)

A coordenadora abre o Painel de Rendimento Escolar, seleciona o Ano Letivo e o Período de Análise (ano completo ou período avaliativo do Método de Avaliação) e visualiza no topo os 4 KPIs gerais: Média Geral, % de Alunos Acima da Média, Frequência Média e % de Alunos em Risco (com total de alunos). Em seguida navega pela aba Geral para entender como está o rendimento por período, por etapa de ensino e por turma.

**Why this priority**: É o núcleo do painel — sem a visão agregada e os KPIs, nenhuma outra análise faz sentido. Entrega valor sozinha como MVP de monitoramento.

**Independent Test**: Pode ser testada abrindo o painel com um ano letivo que possua notas e frequência lançadas, verificando que os 4 KPIs e as 3 sub-abas da aba Geral exibem valores consistentes com o Diário de Classe/Fechamento.

**Acceptance Scenarios**:

1. **Given** ano letivo com notas e frequência lançadas, **When** a coordenadora abre o painel, **Then** o topo exibe título, filtros globais (Ano Letivo, Período de Análise) e os 4 KPIs calculados sobre os alunos avaliados.
2. **Given** superadmin sem escola em contexto, **When** abre o painel, **Then** um filtro de Unidade Escolar é exibido e os KPIs só são calculados após selecionar a escola.
3. **Given** sub-aba Período selecionada, **When** há 3 períodos avaliativos configurados, **Then** o gráfico de linha exibe a evolução da média nos 3 períodos e a tabela de distribuição por faixas soma 100% dos alunos avaliados.
4. **Given** sub-aba Etapa de Ensino, **When** a escola possui 2 etapas, **Then** cada etapa exibe Alunos Avaliados, Média, % Acima, % Abaixo, Frequência Média e Evolução vs. período anterior.
5. **Given** sub-aba Turma, **When** a lista carrega, **Then** cada linha exibe Turma, Alunos, Média, % Acima da Média e Frequência, sem carregar disciplinas/alunos individuais.

---

### User Story 2 - Identificar alunos que precisam de atenção (Priority: P1)

O coordenador abre a aba Situação > sub-aba Situação e vê os 3 blocos (Adequado, Atenção, Risco) com quantidade e percentual, a tabela "Alunos que precisam de atenção" (Aluno, Turma, Média, Frequência, Motivo, Tendência) e clica em um aluno para ver o detalhe (Média Atual, Média Anterior, Frequência, Tendência, Desempenho por Disciplina, Pontos de Atenção).

**Why this priority**: É o segundo objetivo central do pedido ("quem precisa de atenção?"). Junto com a US1 forma o MVP completo do painel em período letivo (antes do fechamento).

**Independent Test**: Pode ser testada com turmas que tenham médias/frequências abaixo e próximas do mínimo do Método de Avaliação, verificando classificação, motivos objetivos e tendência por aluno.

**Acceptance Scenarios**:

1. **Given** aluno com média abaixo do mínimo do Método de Avaliação da turma, **When** a sub-aba Situação carrega, **Then** ele aparece em Risco com motivo objetivo (ex.: "Média abaixo do esperado").
2. **Given** aluno com frequência abaixo do mínimo configurado, **When** a listagem carrega, **Then** ele aparece em Risco com motivo relacionado à frequência.
3. **Given** aluno com média dentro da Faixa de Atenção acima do mínimo, **When** avaliado, **Then** ele é classificado em Atenção (não em Adequado nem em Risco).
4. **Given** aluno com média atual 1 ponto ou mais abaixo da média do período anterior, **When** exibido, **Then** sua tendência indica "Em queda"; variação menor que a margem indica "Estável".
5. **Given** clique em um aluno da tabela, **When** o detalhe abre, **Then** exibe Média Atual, Média Anterior, Frequência, Tendência, lista de média por disciplina e Pontos de Atenção objetivos.

---

### User Story 3 - Aprofundar análise de uma turma (drill-down) (Priority: P2)

A coordenadora clica em uma turma da tabela comparativa (aba Geral > Turma) e aprofunda a análise vendo desempenho por disciplina, distribuição das notas, frequência, alunos abaixo da média e evolução por período — dados carregados somente nesse momento.

**Why this priority**: Agrega valor investigativo, mas depende da US1 e envolve custo de performance; pode ser entregue após o básico.

**Independent Test**: Pode ser testada clicando em uma turma e verificando que o detalhamento carrega sob demanda com os 5 blocos esperados.

**Acceptance Scenarios**:

1. **Given** lista de turmas carregada sem dados de disciplina, **When** a coordenadora clica em uma turma, **Then** o sistema carrega sob demanda: desempenho por disciplina, distribuição das notas, frequência, alunos abaixo da média e evolução por período daquela turma.
2. **Given** turma sem notas lançadas no período, **When** o drill-down abre, **Then** é exibido estado vazio orientando que não há avaliações lançadas, sem erro.

---

### User Story 4 - Consultar Situação Final pós-fechamento (Priority: P2)

Após o Fechamento de Turma, a coordenação abre a aba Situação > sub-aba Situação Final e vê blocos por situação final (Aprovado, Reprovado, Aprovado Concluinte, Transferido, Deixou de Frequentar, Óbito, Sem Movimentação, Em Andamento), a tabela "Situação Final por Turma" e o cruzamento entre rendimento ao longo do ano e resultado final.

**Why this priority**: Depende do processo de Fechamento (pré-existente) e só tem valor após turmas fechadas; por isso P2.

**Independent Test**: Pode ser testada com um ano letivo contendo turmas fechadas e abertas, verificando blocos, indicação de turmas não fechadas e cruzamento rendimento × resultado.

**Acceptance Scenarios**:

1. **Given** ano letivo sem nenhuma turma fechada, **When** abre a sub-aba Situação Final, **Then** é exibido estado informativo de que não há situações finais definidas (sem blocos vazios ou erro).
2. **Given** ano com turmas abertas e fechadas, **When** abre a sub-aba, **Then** os resultados consideram apenas turmas com situação final definida e há indicação clara de quais turmas ainda não foram fechadas.
3. **Given** turmas fechadas com aprovados e reprovados, **When** visualiza os blocos, **Then** cada situação exibe quantidade e percentual usando exatamente a nomenclatura existente, sem agrupamento em "Outros".
4. **Given** tabela "Situação Final por Turma", **When** renderizada, **Then** há uma coluna por situação com ocorrência mais a coluna Turma; situações sem ocorrência não geram coluna.
5. **Given** alunos reprovados no fechamento, **When** consulta o cruzamento, **Then** é possível visualizar o histórico de rendimento desses alunos ao longo do ano.

### Edge Cases

- Ano letivo sem nenhum período avaliativo configurado no Método de Avaliação: Período de Análise oferece apenas "Ano Letivo completo"; gráfico de evolução exibe estado vazio explicativo.
- Turmas avaliadas exclusivamente por modo não-numérico (conceito, parecer descritivo, indicadores sem nota): são desconsideradas em todos os cálculos do painel. Turmas que combinam avaliação numérica com outro modo são consideradas, computando-se apenas a parte numérica.
- Aluno matriculado sem nenhuma nota lançada no período: não conta como "Avaliado"; aparece apenas nos totais de matrícula quando aplicável, nunca com média zero presumida.
- Aluno com movimentação (transferido, remanejado, desistência) no período: média/frequência consideram apenas o período ativo da matrícula.
- Turma sem quadro de aulas ou sem frequência lançada: Frequência Média exibe estado "sem dados" em vez de 0%.
- Período de Análise = período específico sem lançamentos: KPIs e tabelas exibem estado vazio, sem erro.
- Superadmin com múltiplas escolas: trocar a Unidade Escolar recarrega todos os KPIs, abas e drill-downs (sem misturar dados entre escolas).
- Usuário sem permissão para o painel: exibe estado "Sem permissão" padrão do sistema.
- Grande volume (escola com centenas de turmas/milhares de alunos): carregamento inicial traz apenas agregados; drill-down e detalhe do aluno carregam sob demanda com estado de carregamento.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST exibir área de Resumo fixa (independente da aba) com título, subtítulo, filtros globais (Unidade Escolar exclusivo para Superadmin, Ano Letivo e Período de Análise — somente períodos específicos, sem "Ano Letivo completo") e 4 KPIs. O Período de Análise global aplica-se SOMENTE aos Indicadores Gerais do Resumo. Cada visualização detalhada possui seus próprios filtros locais (Etapa, Turma e Situação têm seletor local de Período, com "Ano Letivo completo"; Evolução tem filtro local de Disciplina; Distribuição tem filtros locais de Período específico — sem "Ano Letivo completo" — e Disciplina), sem exigir rolagem até o topo.
- **FR-002**: Sistema MUST exibir no Resumo 4 KPIs gerais: Média Geral, % de Alunos Acima da Média, Frequência Média e % de Alunos em Risco com total de alunos.
- **FR-003**: Sistema MUST oferecer navegação entre 2 abas principais (Geral, Situação) abaixo do Resumo, com sub-abas: Geral → Período, Etapa de Ensino, Turma; Situação → Situação, Situação Final.
- **FR-004**: Sistema MUST reutilizar as regras acadêmicas existentes (Métodos de Avaliação, registros de professores) para todos os cálculos de média, frequência, períodos e situação — sem criar regra paralela de cálculo.
- **FR-005**: Sub-aba Período MUST exibir Média Geral, % Acima, % Abaixo, % Frequência Abaixo do Mínimo, Total de Avaliados (conforme o Período de Análise global) + gráfico de linha da evolução com uma linha por disciplina ao longo dos períodos avaliativos (filtros locais dentro do card: Etapa — "Todas" ou específica, com dados sob demanda —, Disciplina — "Todas" ou específica — e Período — "Todos os períodos" ou específico; tooltip identifica a disciplina e a média no ponto; cores distintas por linha, com tracejado ao repetir a paleta) + tabela de Distribuição do Rendimento por faixas (9,0–10,0; 7,0–8,9; 5,0–6,9; Abaixo de 5,0) com quantidade e percentual e filtros locais obrigatórios dentro do card (Etapa, Período específico sem "Ano Letivo completo", Disciplina). Cada gráfico/tabela MUST exibir descrição textual do que a informação representa e do recorte (etapa/período/disciplina) a que se refere.
- **FR-006**: Sub-aba Etapa de Ensino MUST exibir gráfico "Média por etapa e disciplina" (barras agrupadas: cada etapa com uma barra por disciplina, com descrição do recorte) + cards por etapa com Alunos Avaliados, Média (rotulada), % Acima, % Abaixo, Frequência Média e Evolução vs. período anterior (badge na mesma linha do nome da etapa, à direita; nome com hierarquia de título de seção), com 3 filtros locais (Etapa em multi-seleção com "Marcar todas"/"Limpar"; Período somente específico, sem "Ano Letivo completo"; Disciplina — "Todas" por padrão, restringindo as métricas dos cards e do gráfico à disciplina).
- **FR-007**: Sub-aba Turma MUST exibir tabela comparativa (Turma, Alunos, Média, % Acima da Média, Frequência) com 3 filtros locais de 25% (Etapa de Ensino em 1º — "Todas as Etapas" por padrão; Período em 2º; Disciplina em 3º — restringindo as métricas da tabela à disciplina) e permitir drill-down por turma (desempenho por disciplina, distribuição das notas, frequência, alunos abaixo da média, evolução por período) carregado somente sob demanda.
- **FR-008**: Sub-aba Situação MUST classificar cada aluno em Adequado / Atenção / Risco usando média mínima e frequência mínima do Método de Avaliação da turma: Risco = média e/ou frequência abaixo do mínimo; Atenção = média/frequência dentro da Faixa de Atenção acima do mínimo e/ou queda perceptível entre períodos; Adequado = demais.
- **FR-009**: Sistema MUST tornar a Faixa de Atenção um valor configurável (percentual de pontos acima do mínimo, padrão 5 pontos percentuais), alterável nas configurações do sistema sem novo desenvolvimento.
- **FR-010**: Sub-aba "Situação por Período" MUST exibir 4 filtros locais de 25% (Período somente específico, sem "Ano Letivo completo"; Etapa de Ensino; Turma dependente da Etapa; Disciplina — restringindo média e classificação à disciplina), blocos Adequado/Atenção/Risco (quantidade + percentual) com legenda interpretativa (significado, parâmetros e exemplos), e tabela "Alunos que precisam de atenção" no estilo do histórico escolar (cabeçalhos uppercase, ícone do aluno, barra de frequência, badge de situação, linha expansível com média anterior, desempenho por disciplina e pontos de atenção).
- **FR-011**: Sistema MUST calcular a Tendência de cada aluno comparando média do período atual vs. anterior (Melhorando / Estável / Em queda), aplicando margem mínima de variação de 1,0 ponto para ignorar pequenas oscilações.
- **FR-012**: Sistema MUST oferecer detalhamento do aluno (painel lateral ou tela) com Média Atual, Média Anterior, Frequência, Tendência, Desempenho por Disciplina e seção "Pontos de Atenção" com motivos objetivos.
- **FR-013**: Sub-aba Situação Final MUST ficar disponível somente com base nos dados do Fechamento de Turma, considerar apenas turmas com situação final definida e indicar claramente turmas ainda não fechadas.
- **FR-014**: Sub-aba Situação Final MUST exibir blocos por situação final usando exatamente as Situações do Aluno Matriculado existentes (Aprovado, Reprovado, Aprovado Concluinte, Transferido, Deixou de Frequentar, Óbito, Sem Movimentação, Em Andamento), cada uma identificável individualmente, sem agrupar em "Outros" e sem criar situações novas.
- **FR-015**: Sub-aba Situação Final MUST exibir tabela "Situação Final por Turma" com coluna Turma + uma coluna por situação com ocorrência, e visualização cruzando rendimento ao longo do ano × resultado final (ex.: histórico dos reprovados).
- **FR-016**: Sistema MUST aplicar carregamento progressivo na hierarquia Escola → Etapa → Turma → Disciplina → Aluno: agregados no carregamento inicial; disciplina/aluno individual somente sob demanda (drill-down / detalhe), evitando recálculos repetitivos via consultas agregadas e reutilização de dados.
- **FR-017**: Sistema MUST restringir o acesso ao painel por permissão (recurso próprio dentro do módulo Gestão Pedagógica, via Perfis e Permissões), com isolamento multi-escola (schoolId) e validação server-side. A tela MUST residir dentro do módulo Gestão Pedagógica (navegação/sidebar).
- **FR-018**: Sistema MUST exibir estados de carregamento, vazio e erro seguindo os padrões oficiais do Design System (sem inventar padrões visuais).
- **FR-019**: Sistema MUST considerar apenas turmas que possuem avaliação numérica: turmas exclusivamente não-numéricas são desconsideradas em todos os cálculos; turmas que combinam avaliação numérica com outro modo são consideradas, computando-se apenas a parte numérica, sem presumir média zero para o que for não-numérico.
- **FR-020**: Sistema MUST definir "Alunos Avaliados" como alunos com ao menos uma nota lançada no Período de Análise, e aplicar esse critério de forma consistente em KPIs, sub-abas e percentuais.

### Key Entities

- **Painel de Rendimento (visão)**: agregado por escola + ano letivo + período de análise; composto por KPIs gerais, visões por período/etapa/turma e classificação de situação.
- **Classificação de Situação**: categoria por aluno (Adequado / Atenção / Risco) derivada de média vs. média mínima, frequência vs. frequência mínima (Método de Avaliação da turma), Faixa de Atenção configurável e variação entre períodos; com motivo objetivo e tendência (Melhorando / Estável / Em queda, margem 1,0 ponto).
- **Situação Final**: resultado do Fechamento de Turma por aluno, restrito ao vocabulário existente (Aprovado, Reprovado, Aprovado Concluinte, Transferido, Deixou de Frequentar, Óbito, Sem Movimentação, Em Andamento).
- **Período de Análise**: ano letivo completo ou um período avaliativo configurado no Método de Avaliação / calendário.
- **Faixa de Atenção (configuração)**: percentual de pontos acima do mínimo que caracteriza proximidade do limite; padrão 5 pontos percentuais, ajustável sem desenvolvimento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Coordenadores localizam os alunos em Risco e o motivo objetivo em até 3 cliques a partir da abertura do painel.
- **SC-002**: 100% dos valores de média, frequência e situação exibidos conferem com Diário de Classe / Fechamento para a mesma turma, período e aluno (zero divergência por regra paralela).
- **SC-003**: O carregamento inicial do painel exibe os KPIs e a primeira visão em tempo compatível com uso interativo mesmo em escolas de grande porte, com detalhamentos (turma/aluno) carregados sob demanda sem recarregar o painel.
- **SC-004**: 90% dos coordenadores identificam corretamente, no primeiro uso, quais alunos estão em Atenção vs. Risco e o que fazer a seguir (teste de usabilidade com 5+ participantes).
- **SC-005**: Situações finais exibidas usam exclusivamente a nomenclatura oficial existente, sem categorias genéricas — auditoria de conteúdo com zero ocorrências de "Outros" ou situações inventadas.

## Assumptions

- Reutilização integral do motor acadêmico existente (mesmas funções/fontes do Diário, Painel do Aluno, Boletim e Fechamento) para médias, frequência (critério por dia/aula, período ativo da matrícula), períodos avaliativos e situação final.
- "Acima da Média" = média do aluno ≥ média mínima do Método de Avaliação da turma; "Abaixo" = estritamente menor. Frequência "abaixo do mínimo" usa a frequência mínima do mesmo método.
- Tendência: diferença (atual − anterior) ≥ +1,0 → Melhorando; ≤ −1,0 → Em queda; caso contrário Estável (proposta do solicitante adotada como padrão por ser simples, explicável e consistente com escala 0–10).
- Faixa de Atenção padrão 5 pontos percentuais acima do mínimo (ex.: mínimo 6,0 → atenção até 6,5 em escala 0–10? definição exata percentual vs. pontos a detalhar no plan); ajuste via configuração do sistema sem deploy.
- Faixas de distribuição fixas em 9,0–10,0 / 7,0–8,9 / 5,0–6,9 / Abaixo de 5,0 conforme exemplo do pedido.
- Períodos avaliativos vêm do calendário (eventos tipo periodo_avaliativo) / quantidade configurada no método, mesmo padrão do Boletim.
- Frequência do painel usa o critério da turma (por dia / por aula) e o período ativo da matrícula (data_saida), como no Painel do Aluno.
- Situação Final lê o resultado do Fechamento; turmas abertas contribuem com "Em Andamento" apenas onde a fonte oficial já registra esse estado — sem inferir aprovação/reprovação parcial.
- Permissão dedicada ao painel como recurso do módulo Gestão Pedagógica, verificada server-side; sidebar exibe o item dentro da Gestão Pedagógica conforme permissão de visualização.
- Layout Dashboard oficial (PageContainer dashboard + PageHeader + StatCards + PageSections + Tabs + Recharts), tokens e tipografia do Design System; sem hex hardcoded; dark-mode compatível.
- Auditoria: painel é leitura — sem trilha de auditoria de escrita; apenas leitura respeitando escopo.
- Fora de escopo v1: exportação PDF/CSV, alertas/notificações automáticas, comparação entre escolas, projeções preditivas, edição de notas pelo painel.
