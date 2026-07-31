# Feature Specification: Agenda do Profissional — Topbar Drawer

**Feature Branch**: `010-agenda-profissional`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description with 5 detailed criteria sections

## Product Experience Principles Applied

### Applied Principles

- **PE-101** — O Sheet lateral ("Agenda") possui um único objetivo: visualizar e gerenciar compromissos pessoais do profissional. Não acumula outras funções.
- **PE-102** — Header "Minha Agenda", filtro de mês obrigatório e botão "Adicionar Novo Compromisso" no footer comunicam o propósito da tela.
- **PE-103** — Botão "Adicionar Novo Compromisso" é a ação principal, fixa no footer do Sheet. Ações secundárias (excluir, tabs) têm peso visual menor.
- **PE-204** — Cards de eventos agrupam: horário (esquerda), título+detalhes (centro), badge categoria (topo). Conteúdo logicamente relacionado fica junto.
- **PE-401** — Excluir compromisso exige confirmação via `ConfirmDialog` (ação destrutiva).
- **PE-403** — Criar/excluir compromisso exibe toast de sucesso imediato.
- **PE-404** — Botão "Salvar" mostra loading spinner durante a criação.
- **PE-501** — Lista vazia exibe `<EmptyState>` com mensagem amigável ("Nenhum compromisso agendado.").
- **PE-603** — Sheet ocupa `w-3/4` em mobile, `sm:max-w-sm` em desktop. Botões têm `min-h-[44px]` para toque.
- **PE-904** — Categorias usam cores + texto (badges), não apenas cor. `aria-label` nos botões.

## User Scenarios & Testing

### User Story 1 - Visualizar agenda na Topbar (Priority: P1)

Como profissional, quero abrir um painel lateral ao clicar no calendário da Topbar para ver meus compromissos do mês.

**Why this priority**: É a porta de entrada da feature — sem o painel, nada mais funciona.

**Independent Test**: Clicar no ícone calendário abre Sheet lateral com header "Minha Agenda", select de mês e tabs Hoje/Semana/Mês.

**Acceptance Scenarios**:

1. **Given** um profissional logado, **When** clica no ícone calendário da Topbar, **Then** abre Sheet lateral da direita com overlay escuro.
2. **Given** o Sheet aberto sem compromissos, **When** nenhum filtro selecionado ainda, **Then** exibe "Nenhum compromisso agendado."
3. **Given** o Sheet aberto, **When** profissional clica no X ou fora do Sheet, **Then** o painel fecha.

---

### User Story 2 - Filtrar compromissos por mês e período (Priority: P1)

Como profissional, quero selecionar o mês e escolher entre "Hoje", "Semana" ou "Mês" para ver apenas os compromissos relevantes.

**Why this priority**: A agenda precisar ser filtrável para ser útil no dia a dia.

**Independent Test**: Selecionar um mês muda a lista; trocar a aba filtra por período.

**Acceptance Scenarios**:

1. **Given** o Sheet aberto, **When** profissional seleciona "Outubro" no select de mês, **Then** lista exibe apenas compromissos de Outubro.
2. **Given** compromissos no mês atual, **When** profissional clica na aba "Hoje", **Then** lista exibe apenas compromissos de hoje.
3. **Given** compromissos na semana atual, **When** profissional clica na aba "Semana", **Then** lista exibe apenas compromissos dos próximos 7 dias.

---

### User Story 3 - Criar novo compromisso (Priority: P1)

Como profissional, quero adicionar um compromisso com título, data, horário, categoria e detalhes.

**Why this priority**: Criar compromissos é a ação principal da agenda.

**Independent Test**: Preencher o modal e salvar adiciona o card na lista.

**Acceptance Scenarios**:

1. **Given** o Sheet aberto, **When** profissional clica "Adicionar Novo Compromisso", **Then** abre modal centralizado com formulário.
2. **Given** o modal aberto, **When** profissional preenche título, datas, horários, categoria e clica Salvar, **Then** compromisso é salvo, modal fecha, lista atualiza com toast de sucesso.
3. **Given** o modal com "Dia todo" ativo, **When** horários são ocultados, **Then** campo horário não é obrigatório.
4. **Given** o modal sem título, **When** profissional tenta salvar, **Then** validação impede e campo fica em erro.

---

### User Story 4 - Excluir compromisso (Priority: P2)

Como profissional, quero excluir um compromisso com confirmação para evitar remoções acidentais.

**Why this priority**: Útil mas não bloqueia o uso da agenda.

**Independent Test**: Passar mouse sobre card revela lixeira; clicar confirma e remove.

**Acceptance Scenarios**:

1. **Given** um card de compromisso, **When** profissional passa o mouse, **Then** lixeira aparece no canto superior direito com animação suave.
2. **Given** lixeira visível, **When** profissional clica, **Then** abre `ConfirmDialog` perguntando "Excluir compromisso?".
3. **Given** confirmação visível, **When** profissional confirma exclusão, **Then** compromisso some, lista atualiza, toast de sucesso.

---

### Edge Cases

- Mês sem compromissos → EmptyState "Nenhum compromisso agendado."
- Tentar salvar com data final anterior à data inicial → validação client-side
- Categoria "Outro" selecionada → badge cor muted
- Lista com muitos compromissos → scroll natural no body do Sheet
- Horário final < inicial → toast.error "Horário final deve ser após horário inicial"

## Requirements

### Functional Requirements

- **FR-001**: Botão calendário na Topbar deve abrir Sheet lateral (direita) com overlay
- **FR-002**: Sheet deve ter header fixo ("Minha Agenda"), corpo com scroll, footer com botão "Adicionar Novo Compromisso"
- **FR-003**: Select de mês no topo do Sheet, obrigatório, com meses Janeiro–Dezembro + ano corrente
- **FR-004**: Tabs "Hoje" | "Semana" | "Mês" no topo do Sheet, aba ativa com `bg-primary text-primary-foreground`
- **FR-005**: Compromissos agrupados por rótulo de data (ex: "24 de Outubro")
- **FR-006**: Card de evento: horário início/fim (esquerda), título + detalhes (centro), badge categoria (topo direito)
- **FR-007**: Lixeira no card visível apenas no hover (`opacity-0 group-hover:opacity-100`)
- **FR-008**: ConfirmDialog ao clicar lixeira: título "Excluir compromisso", descrição "Tem certeza que deseja excluir?"
- **FR-009**: Modal de criação com campos: Título, Dia Todo (pill), Data Inicial, Data Final, Categoria, Horário Inicial, Horário Final, Detalhes
- **FR-010**: "Dia Todo" desmarca obrigatoriedade de horários; "Dia Todo" ativo remove campos de horário
- **FR-011**: Categorias: Reunião, Aula, Formação, Outro — cada uma com badge de cor semântica
- **FR-012**: Validação client-side: Título e Datas obrigatórios; Horários obrigatórios se `dia_todo=false`
- **FR-013**: Ao salvar, chamar server action, fechar modal, atualizar lista via revalidate/refresh
- **FR-014**: Tabela `agenda_compromissos` no Supabase com `school_id`, `pessoa_id`, `titulo`, `data_inicial`, `data_final`, `horario_inicial`, `horario_final`, `dia_todo`, `categoria`, `detalhes`
- **FR-015**: Empty state: "Nenhum compromisso agendado."

### Key Entities

- **agenda_compromissos**: Compromisso pessoal do profissional — contém título, período (data+opcional hora), categoria, detalhes. Pertence a uma `school` e uma `people` (pessoa).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Sheet abre em <500ms após clique no calendário
- **SC-002**: Criação de compromisso leva <1s (incluindo persistência)
- **SC-003**: Lista atualiza em tempo real após criar/excluir sem recarregar página

## Assumptions

- Profissional logado está autenticado via `useAuth()` que fornece `user`, `pessoa_id`, `school_id`
- Categorias fixas: reunião, aula, formação, outro
- Compromissos são pessoais (visíveis apenas para o profissional que criou)
- Horários opcionais: se não informados, compromisso é "Dia todo"
