# Feature Specification: Dashboard — Visão Gerencial da Escola

**Feature Branch**: `003-dashboard`

**Created**: 2026-06-20

**Status**: Draft

**Input**: User description: "Novo Dashboard com cards de Docentes, Turmas, Alunos, Matrículas, Ano Letivo, Calendário Escolar, gráficos de alunos por etapa/tipo/deficiência/transtorno/modalidade/turno, taxa de ocupação, frequência média, risco de evasão, aniversariantes e alertas de turmas sem professor vinculado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Gestor visualiza indicadores-chave da escola (Priority: P1)

O gestor escolar acessa o dashboard e vê imediatamente os 4 cards principais com dados reais do banco: quantidade de Docentes (profissionais com vínculo ativo em turmas, contados sem duplicação), Turmas ativas, Alunos (pessoas distintas com matrícula ativa) e Matrículas (total de registros de matrícula ativa). O ano letivo vigente é exibido como texto acima dos cards. A seção "Próximos Passos" é removida.

**Why this priority**: São os indicadores mais básicos que todo gestor precisa ver ao abrir o sistema. Sem eles o dashboard não cumpre sua função mínima.

**Independent Test**: Criar dados de teste: 3 docentes (1 vinculado a 2 turmas), 2 turmas ativas, 5 alunos com 6 matrículas (1 aluno em 2 turmas). Verificar cards mostram: Docentes=3, Turmas=2, Alunos=5, Matrículas=6.

**Acceptance Scenarios**:

1. **Given** uma escola com profissionais vinculados a turmas, **When** o gestor acessa o dashboard, **Then** o card Docentes mostra a contagem DISTINCT de person_id em turmas_profissionais com ativo=true
2. **Given** turmas com ativo=true, **When** o dashboard carrega, **Then** o card Turmas mostra a contagem correta
3. **Given** alunos com múltiplas matrículas ativas, **When** o dashboard carrega, **Then** Alunos conta pessoas distintas e Matrículas conta registros totais
4. **Given** ano letivo com status='ativo', **When** dashboard carrega, **Then** o ano letivo é exibido como texto no cabeçalho "Dashboard — Ano Letivo 2026"

---

### User Story 2 — Gestor consulta calendário escolar e aniversariantes (Priority: P1)

No dashboard, o gestor vê um mini calendário do mês atual com os dias letivos e recessos marcados, o total de dias letivos cumpridos vs total do ano, e a lista de aniversariantes do mês (alunos com matrícula ativa).

**Why this priority**: Informações de planejamento diário que o gestor consulta frequentemente.

**Independent Test**: Criar calendário com eventos de recesso e dia letivo no mês atual, e alunos com data_nascimento no mês. Verificar se o calendário mostra os eventos e a lista de aniversariantes aparece.

**Acceptance Scenarios**:

1. **Given** um calendário escolar com eventos no mês atual, **When** dashboard carrega, **Then** o card de calendário exibe os dias do mês com marcações visuais para dia_letivo e recesso
2. **Given** o ano letivo ativo com data_inicio e data_termino, **When** dashboard carrega, **Then** exibe "X de Y dias letivos cumpridos"
3. **Given** alunos com data_nascimento no mês atual, **When** dashboard carrega, **Then** a lista de aniversariantes mostra nome, data formatada e turma atual

---

### User Story 3 — Gestor analisa distribuição de alunos por categorias (Priority: P2)

O dashboard exibe gráficos (Recharts) que mostram a distribuição de alunos matriculados por: Etapa de Ensino, Tipo de Turma, Modalidade, Turno, Deficiências e Transtornos de Aprendizagem. Cada gráfico é independente e pode ser visualizado sem scroll excessivo.

**Why this priority**: Essenciais para planejamento pedagógico e prestação de contas, mas dependem dos dados básicos já carregados.

**Independent Test**: Criar matrículas em diferentes etapas e tipos de turma. Verificar que os gráficos de barra e pizza renderizam com as quantidades corretas e legendas legíveis.

**Acceptance Scenarios**:

1. **Given** matrículas ativas distribuídas entre etapas, **When** dashboard carrega, **Then** o gráfico "Alunos por Etapa" exibe barras horizontais com nomes das etapas e quantidades
2. **Given** turmas com tipos_turma variados (Curricular, AEE, Atividade Complementar), **When** dashboard carrega, **Then** o gráfico "Alunos por Tipo de Turma" exibe pizza com proporções
3. **Given** alunos com flags de deficiência marcadas na tabela people, **When** dashboard carrega, **Then** gráfico de deficiências mostra contagem por tipo (ex: TEA: 5, Baixa Visão: 2)
4. **Given** alunos com flags de transtorno, **When** dashboard carrega, **Then** gráfico de transtornos mostra contagem (ex: TDAH: 3, Dislexia: 1)

---

### User Story 4 — Gestor monitora ocupação e frequência (Priority: P2)

O dashboard exibe a taxa de ocupação das turmas (matrículas ativas / capacidade total), a frequência média da escola (presenças / total de registros de frequência), e um alerta de turmas com maior risco de evasão (alunos com >25% de faltas).

**Why this priority**: Indicadores de gestão operacional — ajudam a identificar turmas superlotadas ou com alto absenteísmo.

**Independent Test**: Criar turma com capacidade=30 e 20 matrículas (66%), registros de frequência com 80% de presença, e uma turma com vários alunos acima de 25% de faltas. Verificar gráficos e alertas.

**Acceptance Scenarios**:

1. **Given** turmas com capacidade_alunos e matrículas ativas, **When** dashboard carrega, **Then** o card de ocupação mostra barra de progresso e percentual (ex: "650/800 vagas — 81%")
2. **Given** registros de frequência no banco, **When** dashboard carrega, **Then** o card de frequência média mostra percentual calculado como presenças/total
3. **Given** alunos com percentual de faltas >25% em uma turma, **When** dashboard carrega, **Then** a tabela de risco de evasão lista a turma com a quantidade de alunos em baixa frequência

---

### User Story 5 — Gestor vê alertas de turmas sem professor (Priority: P3)

O dashboard exibe uma lista de disciplinas que foram atribuídas a turmas mas não possuem nenhum profissional vinculado para ministrá-las. Isso permite ao gestor identificar rapidamente lacunas na alocação de docentes.

**Why this priority**: Importante para planejamento, mas é um alerta pontual — não precisa de atualização em tempo real. Menor prioridade que os indicadores principais.

**Independent Test**: Criar turma com disciplina "Matemática" sem professor vinculado. Verificar que o dashboard lista "Turma X — Matemática" nos alertas.

**Acceptance Scenarios**:

1. **Given** uma turma com disciplina cadastrada mas sem profissional vinculado na turmas_profissionais.disciplinas_ids, **When** dashboard carrega, **Then** a seção de alertas lista a turma e o nome da disciplina
2. **Given** todas as disciplinas possuem professor vinculado, **When** dashboard carrega, **Then** a seção de alertas mostra "Todas as disciplinas possuem professores vinculados"

---

### Edge Cases

- Escola sem nenhum dado cadastrado: dashboard mostra todos os cards com valor zero, calendário vazio, listas vazias
- Ano letivo sem status='ativo': exibe "Nenhum ano letivo ativo" no lugar do ano
- Mês sem aniversariantes: exibe "Nenhum aniversariante este mês"
- Super Admin com visão global: dados agregados de todas as escolas ou filtrar por escola selecionada
- Aluno com data_saida (período ativo encerrado): não conta nas estatísticas se data_saida < hoje
- Turma sem quadro de aulas: não afeta os cards principais, apenas ignora métricas de aula
- Múltiplos calendários no mesmo ano letivo: consolidar eventos de todos os calendários
- JSONB tipos_turma vazio ou null: tratar como array vazio, não quebrar a query

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE exibir card "Docentes" com contagem DISTINCT de profissionais com vínculo ativo em turmas (turmas_profissionais WHERE ativo=true)
- **FR-002**: Sistema DEVE exibir card "Turmas" com contagem de turmas WHERE ativo=true
- **FR-003**: Sistema DEVE exibir card "Alunos" com contagem DISTINCT de pessoas (aluno_id) com matrícula ativa (academico_matriculas WHERE ativo=true AND situacao='Ativo')
- **FR-004**: Sistema DEVE exibir card "Matrículas" com contagem total de registros ativos em academico_matriculas
- **FR-005**: Sistema DEVE exibir o ano letivo vigente como texto descritivo no cabeçalho (academico_anos_letivos WHERE status='ativo')
- **FR-006**: Sistema DEVE remover a seção "Próximos Passos" do dashboard
- **FR-007**: Sistema DEVE exibir card de Calendário Escolar com grade do mês atual, marcando dias letivos e recessos
- **FR-008**: Sistema DEVE exibir contagem de dias letivos cumpridos vs total do ano
- **FR-009**: Sistema DEVE exibir gráfico de Alunos por Etapa de Ensino (Recharts BarChart horizontal)
- **FR-010**: Sistema DEVE exibir gráfico de Alunos por Tipo de Turma (Recharts BarChart horizontal)
- **FR-011**: Sistema DEVE exibir gráfico de Alunos por Deficiências (Recharts BarChart horizontal)
- **FR-012**: Sistema DEVE exibir gráfico de Alunos por Transtornos que Impactam a Aprendizagem (Recharts BarChart horizontal)
- **FR-013**: Sistema DEVE exibir gráfico de Alunos por Modalidade (Recharts PieChart)
- **FR-014**: Sistema DEVE exibir gráfico de Alunos por Turno (Recharts PieChart)
- **FR-015**: Sistema DEVE exibir card de Taxa de Ocupação da Escola com barra de progresso (matrículas ativas / soma da capacidade das turmas)
- **FR-016**: Sistema DEVE exibir card de Frequência Média da Escola (presenças / total de registros em academico_frequencias_dia)
- **FR-017**: Sistema DEVE exibir tabela de Risco de Evasão com turmas onde há alunos com >25% de faltas
- **FR-018**: Sistema DEVE exibir lista de Aniversariantes do Mês (alunos com data_nascimento no mês corrente e matrícula ativa)
- **FR-019**: Sistema DEVE exibir alerta de Turmas sem Professor (disciplinas atribuídas à turma sem profissional vinculado)
- **FR-020**: Todos os gráficos DEVEM ser responsivos (grid de 1-3 colunas conforme viewport)
- **FR-021**: Sistema DEVE usar Design Tokens e componentes oficiais do Design System (PageContainer, PageHeader, PageSection, Card)
- **FR-022**: Sistema DEVE funcionar corretamente em Light Mode e Dark Mode
- **FR-023**: Dashboard DEVE respeitar o contexto multi-tenant (school_id) para usuários não-admin
- **FR-024**: Super Admin DEVE ter um seletor de escola no dashboard para filtrar os dados por unidade escolar
- **FR-025**: Gráficos de barra DEVEM exibir apenas números inteiros no eixo X (allowDecimals=false)
- **FR-026**: Gráficos de barra NÃO DEVEM exibir efeito hover com fundo cinza nas barras
- **FR-027**: Calendário Escolar DEVE ocupar 100% da largura com navegação entre meses (anterior/próximo)
- **FR-028**: Aniversariantes do Mês DEVE ocupar 100% da largura em linha independente
- **FR-029**: Sistema DEVE exibir gráfico de Taxa de Ocupação por Turma (Recharts BarChart horizontal com %)
- **FR-030**: Sistema DEVE exibir gráfico de Frequência Média por Turma (Recharts BarChart horizontal com %)
- **FR-031**: Gráfico de Alunos por Etapa DEVE estar centralizado sem espaço excessivo à esquerda

### Key Entities

- **DashboardData**: Objeto agregado retornado pela server action `getDashboardData` contendo todos os indicadores, gráficos e listas
- **Docente**: Pessoa (people) com perfil 'profissional' que possui vínculo ativo em turmas_profissionais
- **Aluno**: Pessoa (people) com perfil 'aluno' que possui ao menos uma matrícula ativa
- **Matrícula**: Registro em academico_matriculas com ativo=true e situacao='Ativo'
- **Calendário**: Eventos de academico_calendario_eventos agrupados por mês
- **Ocupação**: Razão entre matrículas ativas e capacidade_alunos somada das turmas

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dashboard carrega em menos de 3 segundos com dados reais de uma escola com até 500 alunos
- **SC-002**: Todos os 4 cards principais refletem contagens exatas do banco de dados (verificável via query SQL direta)
- **SC-003**: Gráficos renderizam corretamente com 0 ou muitos dados (sem quebrar o layout)
- **SC-004**: Gestor consegue identificar em menos de 10 segundos quantos alunos, docentes e turmas a escola possui
- **SC-005**: Dashboard é totalmente funcional em resoluções de 1024px a 1920px de largura

## Assumptions

- Recharts já está instalado e disponível no projeto
- A tabela `turmas` usa a coluna `ativo` (boolean) para indicar turmas ativas
- A tabela `people` armazena flags de deficiência e transtorno como colunas booleanas (cegueira, baixa_visao, tea, tdah, dislexia, etc.)
- A tabela `turmas.tipos_turma` é um JSONB array de strings
- O ano letivo ativo é identificado por `academico_anos_letivos.status = 'ativo'`
- O calendário escolar usa `academico_calendario_eventos` com tipos 'dia_letivo' e 'recesso'
- O critério de frequência pode ser por dia ou por aula, mas a métrica agregada do dashboard usa `academico_frequencias_dia`
- Nenhuma migration nova é necessária — todos os dados já existem no banco
- A server action `getDashboardData` será criada ou expandida em `src/lib/actions/dashboard.ts` (seguindo padrão Feature-Based Architecture)
