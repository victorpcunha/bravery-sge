# Feature Specification: Dashboard — Modernização Visual

**Feature Branch**: `006-dashboard-modernizacao`
**Created**: 2026-07-16
**Status**: Draft
**Depends on**: `specs/003-dashboard` (dashboard original implementado)
**Input**: User description: "O sistema, atualmente, está com cara de sistema de gestão de 2010. Preciso que a tela seja ajustada para que seja mais moderno (SaaS moderno). A tela inicial, quando acessa o sistema, no sidebar está como 'Dashboard'. Tudo que for possível."

## Contexto

A Dashboard atual (`src/app/(app)/(auth)/page.tsx`) foi implementada conforme `specs/003-dashboard` e está funcional, mas apresenta sinais claros de "cara de sistema administrativo 2010":

- Ausência de hierarquia visual entre os 4 StatCards (todos competem igualmente)
- Gráficos do Recharts com paleta de cores dissonante da marca (uso de roxo `#8B5CF6` em `--chart-4`)
- Layout repetitivo de 2-colunas em sequência (5 grids idênticos)
- Tooltips genéricos e sem personalidade
- Componentes misturando `<Card>` cru e `<PageSection>` (quebra de padrão)
- Sem hero de boas-vindas, sem quick actions, sem tabs/filtro de período
- Sem adaptação mobile explícita além de breakpoints padrão de grid

Esta spec **não altera contratos de dados** (a assinatura de `getDashboardData(schoolId)` permanece) — é uma refatoração visual/UX alinhada com o Visual Language v2 e princípios PE do `product-experience.md`.

## Clarifications

### Session 2026-07-16

- Q: Drill-down nos gráficos (clicar numa barra abre detalhe)? → A: **Adiar.** Manter `cursor="pointer"` e `activeBar` agora sem ação; drill-down fica para v2.
- Q: Tabs persistem em URL (`?tab=...`)? → A: **Sim.** Deep-link via searchParams (Next 15 API).
- Q: Filtro de período requer mudança em `getDashboardData`? → A: **Não nesta spec.** Adiar para fase futura; manter período anual fixo.
- Q: `--chart-4` roxo `#8B5CF6` mantém ou troca? → A: **Trocar** para `#1A6FC2` (deep blue, alinhado com a paleta oficial).
- Q: A dashboard tem dados em dev? → A: **Misto.** Implementar empty states elegantes e skeletons para cobrir o caso "sem dados".
- Q: Quais KPIs viram "hero metric"? → A: **Frequência Média** (operacional) ou **Taxa de Ocupação** (gestão). Decisão do usuário durante implementação da FASE A.

---

## Product Experience

Esta spec aplica os seguintes princípios do `product-experience.md`:

| Categoria | Princípios | Aplicação |
|-----------|-----------|-----------|
| **PE-1xx Filosofia** | PE-101 | Dashboard é a "primeira parada" do usuário — deve orientar o dia, não decorar |
| **PE-2xx Hierarquia** | PE-201, PE-202, PE-203 | 1 hero metric + 3-4 secundárias; títulos 28/20/16/15px; agrupamento por prioridade |
| **PE-3xx Layout** | PE-301, PE-302, PE-303 | Tabs (agrupamento temático) > sequência linear; cards com respiro |
| **PE-4xx Feedback** | PE-401, PE-402 | Skeletons por seção (não spinner global); empty states com ação |
| **PE-5xx Estado Zero** | PE-501, PE-502 | Aniversariantes/Risco/Turmas sem prof — todos com EmptyState |
| **PE-6xx Responsividade** | **PE-601, PE-602, PE-603, PE-604, PE-605** | Tabela → cards em mobile; touch ≥ 36px; prioridade preservada |
| **PE-7xx Jornada** | PE-701, PE-704 | Quick actions no hero reduzem cliques; tabs diminuem carga cognitiva |
| **PE-8xx Visualização de Dados** | PE-801, PE-802, PE-803 | Cor semântica em Ocupação/Frequência; gradiente em destaque; tooltip enriquecido |
| **PE-9xx Acessibilidade** | PE-902 | Navegação por teclado via Tabs shadcn; contraste AA |

### Princípios do `product-vision.md` (seção 3, 4)

- **§3. Visão**: "plataforma de gestão educacional moderna — um SaaS profissional, claro e confiável"
- **§4.1 Atributos**: Clareza, Confiança, Organização, Eficiência, Leveza, Proximidade, Inteligência
- **§4.2 Não deve transmitir**: "ERP corporativo genérico", "sistema governamental burocrático"

### Princípios do `visual-language.md`

- **§3.2 Respiro contra densidade**: Densidade bem-resolvida exige mais hierarquia e mais respiro
- **§4 Cores**: primary `#1F88EB`, accent `#4FC3D7`, secondary `#1A6FC2` — paleta de chart deve seguir
- **§5 Tipografia**: 15px corpo, 28px título página, 20px seção, 36px display
- **§6 Espaçamento**: `space-8` (32px) entre PageHeader e conteúdo, `space-6` (24px) entre seções
- **§7 Radius**: cards `rounded-lg` (12px), botões `rounded-md` (8px), inputs/badges `rounded-sm` (6px)
- **§8 Elevação**: cards em repouso `shadow-sm` apenas; `shadow-md` em hover; `shadow-lg` em overlays

---

## User Scenarios & Testing

### User Story 1 — Gestor acessa dashboard e identifica prioridade do dia em < 5 segundos (Priority: P1)

Ao logar, o gestor visualiza imediatamente:
- **Hero de boas-vindas** com nome, escola, data atual e 4 quick actions
- **1 hero metric** destacada (KPI principal: Frequência Média ou Taxa de Ocupação)
- **3 StatCards secundárias** com `variant` semântico e `trend` (% vs. mês anterior)
- Tabs para navegação temática (Visão Geral, Acadêmico, Frequência, Alertas)
- Tabs default "Visão Geral" carrega primeiro; tabs alternam conteúdo sem refresh

**Why this priority**: É o cenário fundamental — "abrir o sistema e saber o que importa hoje". Sem isso, qualquer outra melhoria é cosmética.

**Independent Test**: Logar em escola com 50 matrículas, 8 turmas, 5 docentes. Acessar `/`. Verificar: hero mostra "Olá, {nome}" + data + escola + 4 botões de ação; hero metric em destaque; 3 secundárias; tab "Visão Geral" ativa por padrão.

**Acceptance Scenarios**:
1. **Given** um gestor logado, **When** acessa `/`, **Then** o hero de boas-vindas aparece no topo com nome do usuário, escola ativa, data atual em pt-BR e 4 quick actions (Nova Matrícula, Diário de Classe, Plano de Ensino, Painel do Aluno).
2. **Given** a dashboard carregada, **When** o usuário olha os 4 cards de KPI, **Then** 1 está em destaque visual maior (hero metric) e os outros 3 são StatCards padrão.
3. **Given** o usuário clica numa tab (Acadêmico/Frequência/Alertas), **When** a tab muda, **Then** o conteúdo da tab anterior é ocultado e o novo exibido; URL é atualizada para `?tab=academico`.
4. **Given** o usuário recarrega a página com `?tab=frequencia`, **When** a dashboard monta, **Then** a tab "Frequência" fica ativa por padrão.

---

### User Story 2 — Gestor identifica alertas críticos (risco evasão, turmas sem professor) sem rolar a página inteira (Priority: P1)

Os alertas (Risco de Evasão e Turmas sem Professor) ficam isolados na **tab "Alertas"** e não competem visualmente com os dados analíticos. Cores semânticas comunicam gravidade: vermelho (>40% faltas), amarelo (25-40%), verde (≤25%).

**Why this priority**: Alertas exigem atenção imediata. Poluir a visão geral com 11 widgets degrada a leitura.

**Independent Test**: Criar 2 turmas com risco de evasão (uma com 50% faltas, outra com 28%) e 1 turma sem professor em Matemática. Acessar tab "Alertas" — verificar que as 2 turmas aparecem com cores vermelha e amarela, e a turma sem professor lista "Matemática" como badge warning.

**Acceptance Scenarios**:
1. **Given** uma turma com percentual médio de faltas >40%, **When** o usuário acessa a tab "Alertas", **Then** o percentual é exibido em `text-destructive` (vermelho).
2. **Given** uma turma com percentual médio entre 25% e 40%, **When** o usuário acessa a tab "Alertas", **Then** o percentual é exibido em `text-warning` (amarelo).
3. **Given** uma turma com percentual ≤25%, **When** o usuário acessa a tab "Alertas", **Then** o percentual é exibido em `text-success` (verde).
4. **Given** uma turma com disciplina sem professor vinculado, **When** o usuário acessa a tab "Alertas", **Then** a disciplina aparece como `<StatusBadge status="warning">`.

---

### User Story 3 — Gestor analisa gráficos com leitura rápida por cor semântica (Priority: P2)

Os gráficos de Ocupação por Turma e Frequência por Turma adotam **cor semântica** (não a paleta chart-1..5 aleatória) para comunicar status de cada barra. Em Ocupação: verde (≤80%), amarelo (80-100%), vermelho (>100%). Em Frequência: verde (≥90%), amarelo (75-90%), vermelho (<75%).

**Why this priority**: Reduz carga cognitiva. Gestor não precisa olhar número — cor já comunica.

**Independent Test**: Criar 3 turmas com ocupação 70%, 95%, 110% e 3 com frequência 95%, 80%, 70%. Renderizar gráfico de Ocupação por Turma — verificar que cada barra tem cor semântica correspondente.

**Acceptance Scenarios**:
1. **Given** um gráfico de Ocupação por Turma, **When** a taxa é ≤80%, **Then** a barra usa `var(--success)` ou `#16A34A`.
2. **Given** um gráfico de Ocupação por Turma, **When** a taxa está entre 80% e 100%, **Then** a barra usa `var(--warning)` ou `#D97706`.
3. **Given** um gráfico de Ocupação por Turma, **When** a taxa é >100%, **Then** a barra usa `var(--destructive)` ou `#DC2626`.
4. **Given** um gráfico de Frequência por Turma, **When** a taxa é <75%, **Then** a barra usa cor destructiva.

---

### User Story 4 — Dashboard funciona em mobile (≥360px) sem perda de funcionalidade (Priority: P2)

A dashboard reorganiza (não remove) widgets em telas <768px. Tabelas viram listas de cards em mobile. Quick actions no hero ficam em scroll horizontal. Tabs são navegáveis por toque (≥36px de altura).

**Why this priority**: Gestores acessam a dashboard em reuniões, pelo celular. Mobile é uso legítimo, não acessório.

**Independent Test**: Redimensionar Chrome DevTools para 360px. Verificar: StatCards em 2 colunas; hero com quick actions em scroll horizontal; tabs tocáveis; tabela de Risco Evasão renderiza como cards (não tabela com scroll horizontal).

**Acceptance Scenarios**:
1. **Given** viewport 360px, **When** a dashboard carrega, **Then** os 4 StatCards aparecem em grid 2x2 (2 colunas).
2. **Given** viewport 360px e tab "Alertas", **When** o usuário visualiza Risco Evasão, **Then** a tabela é renderizada como cards verticais com turma, % faltas e alunos em baixa frequência.
3. **Given** viewport 360px, **When** o usuário toca numa tab, **Then** o alvo de toque é ≥36px de altura.
4. **Given** viewport 360px, **When** o usuário rola o hero, **Then** os quick actions ficam acessíveis via scroll horizontal sem quebrar layout.
5. **Given** viewport 1280px (desktop), **When** a dashboard carrega, **Then** StatCards em 4 colunas; tabelas em formato tabular; quick actions em grid 4-col.

---

### User Story 5 — Gestor consulta gráficos com tooltip enriquecido e legenda (Priority: P3)

Todos os BarCharts exibem `<Legend>` (não só Pies) e tooltip customizado com `shadow-lg`, `rounded-md`, `bg-popover`, `border-border`. Grid sutil de fundo (`<CartesianGrid strokeDasharray="3 3" />`) aumenta legibilidade sem poluir.

**Why this priority**: Polish visual. Modern SaaS tem tooltips elegantes; 2010 tinha tooltips genéricos.

**Independent Test**: Renderizar qualquer BarChart (ex.: Alunos por Etapa). Passar mouse sobre barra — tooltip com fundo elevado, borda, e labels formatados. Verificar legenda abaixo do gráfico.

**Acceptance Scenarios**:
1. **Given** um BarChart, **When** o usuário passa o mouse sobre uma barra, **Then** o tooltip aparece com `shadow-lg`, `rounded-md` e informações formatadas.
2. **Given** um BarChart com múltiplas categorias, **When** renderizado, **Then** uma `<Legend>` aparece na parte inferior com a cor de cada categoria.
3. **Given** um BarChart, **When** renderizado, **Then** um `<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />` está visível como grade de fundo.

---

## Edge Cases

- **Escola sem nenhum dado**: dashboard mostra StatCards com valor 0, gráficos com empty state, listas com EmptyState
- **Super Admin com visão global**: mantém `<Select>` de escola, mas com `w-full sm:max-w-xs` em mobile
- **Ano letivo sem `status='ativo'`**: `data?.anoLetivo` é null; hero exibe "Nenhum ano letivo ativo"
- **Mês sem aniversariantes**: EmptyState com ícone `Cake` e mensagem amigável
- **Sem risco de evasão**: EmptyState com ícone `AlertTriangle` e mensagem "Nenhuma turma com risco de evasão"
- **Sem turma sem professor**: EmptyState com ícone `CheckCircle` e mensagem positiva
- **Dark mode**: todos os charts devem usar `var(--chart-N)` corretamente mapeados; gradientes devem ter versão dark
- **prefers-reduced-motion**: animações de hover em cards devem ser desabilitadas
- **Sem dados em gráficos** (etapa/tipo/deficiência/transtorno/modalidade/turno/ocupação/frequência): EmptyState com `BarChart3` ou `PieChartIcon` dentro de cada card

## Out of Scope

- Drill-down em gráficos (clicar para ver detalhe) — adiado para v2
- Backend novo (a spec não altera `getDashboardData`)
- Real-time updates (polling, websocket)
- Personalização por perfil (gestor vs. professor vs. coordenador) — dashboard única
- Modo "somente leitura" para responsável
- Filtro de período funcional (componente UI pronto, mas não aciona re-fetch nesta spec)
