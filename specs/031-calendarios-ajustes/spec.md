# Feature Specification: Estrutura Acadêmica — Calendários: Ajustes

**Feature Branch**: `031-calendarios-ajustes`

**Created**: 2026-09-15

**Status**: Implemented — pendente QA manual (executar `quickstart.md`, ênfase em 1366×768)

**Input**: User description: "Tela Estrutura Acadêmica — Aba Calendários — Ajustes: Navegação por Abas (Calendários, Etapas, Matrizes) no padrão Dashboard (ModernTabs); Card Anos Letivos com rótulos explícitos (Ano Letivo/Início/Término), botão Encerrar 50% e botão Excluir vermelho no mesmo estilo do Encerrar; Card Calendários com vínculo de Etapas de Ensino no modal Novo/Editar (só ativas da escola+ano, 7 grupos, Selecionar Todas por grupo); responsividade do calendário no modal (sem corte em 1366x768, sem espaço vazio); Card Visualização com KPIs de Dias Letivos (geral + por período avaliativo) no topo em formato KPI; Modal Novo Evento com Tipo em Pills clicáveis de seleção única."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — A aba Calendários tem um objetivo principal: configurar anos letivos, calendários por etapa e eventos, sem atrito visual nem bloqueios indevidos.
- **PE-102** — Abas no padrão Dashboard, rótulos explícitos no subcard e KPIs em destaque comunicam a estrutura sem exploração.
- **PE-201** — Ordem do modal de calendário segue o fluxo mental: Identificação (nome/datas) → Etapas vinculadas → salvar (etapas obrigatórias, validadas antes do save).
- **PE-204** — Só grupos/etapas ativos aparecem no modal (divulgação progressiva: grupo sem etapa ativa não é exibido); "Selecionar Todas" por grupo acelera o vínculo.
- **PE-205** — Validação de etapas obrigatórias e de datas via `toast.error` objetivo, antes de qualquer escrita.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Abas no padrão do sistema (Priority: P1)

O gestor abre Gestão Acadêmica → Estrutura Acadêmica e vê as abas Calendários/Etapas/Matrizes no mesmo padrão visual da Dashboard (Visão Geral, Alertas etc. — `ModernTabs`: container `bg-card` com borda, aba ativa `bg-primary`).

**Why this priority**: Consistência visual é a base; divergência atual quebra a identidade do sistema. Entrega valor sozinha.

**Independent Test**: Abrir `/gestao-academica/estrutura-academica` e comparar as abas com as da Dashboard (formato, hover, ativa).

**Acceptance Scenarios**:

1. **Given** a página, **When** renderiza as abas, **Then** usa `ModernTabs` (container `bg-card border shadow-xs`, ativa `bg-primary text-primary-foreground`, inativa `text-muted-foreground font-semibold`, hover `bg-accent/15`).
2. **Given** as 3 abas, **When** alterna entre elas, **Then** o conteúdo de cada aba renderiza como antes (sem regressão de dados/permissões).

---

### User Story 2 - Subcard do Ano Letivo com rótulos e botões consistentes (Priority: P1)

A secretária seleciona um ano letivo e vê `Ano Letivo: 2026`, `Início: 09/02/2026`, `Término: 11/12/2026` com rótulos explícitos; os botões Encerrar e Excluir ocupam 50% cada, o Excluir em vermelho no mesmo formato do Encerrar (sem lixeira isolada).

**Why this priority**: Elimina ambiguidade dos dados exibidos e a inconsistência entre os botões. Entrega valor sozinha.

**Independent Test**: Selecionar um ano letivo e conferir rótulos, larguras e estilo dos dois botões.

**Acceptance Scenarios**:

1. **Given** ano selecionado, **When** visualiza o subcard, **Then** as 3 informações têm rótulo explícito (`Ano Letivo:`, `Início:`, `Término:`) com datas em `pt-BR`.
2. **Given** ano com status ativo, **When** visualiza as ações, **Then** `Encerrar` ocupa 50% da largura e `Excluir` ocupa os outros 50%, no mesmo formato/tamanho (`size="sm"`, `flex-1`), porém `variant="destructive"` com ícone + label "Excluir".
3. **Given** ano em planejamento (3 botões: Ativar/Encerrar/Excluir), **When** visualiza, **Then** os 3 dividem a largura igualmente no mesmo formato.
4. **Given** clique em Excluir ou Encerrar, **When** confirma, **Then** os fluxos atuais (`ConfirmDialog`, auditoria, toasts) funcionam como antes.

---

### User Story 3 - Calendário vinculado a Etapas de Ensino (Priority: P1)

A escola tem calendários distintos por etapa (ex.: um para o Infantil, outro para o Fundamental). Ao criar/editar um calendário, o profissional marca quais Etapas farão parte, vendo só as ativas da escola + ano letivo, organizadas nos 7 grupos, com "Selecionar Todas" por grupo. Salvar sem marcar nenhuma etapa é bloqueado.

**Why this priority**: É o único item com lacuna funcional real (hoje o vínculo existe no banco mas não tem UI). Entrega valor sozinha.

**Independent Test**: Criar um calendário marcando etapas de 2 grupos, salvar, reabrir em edição e conferir a marcação persistida; tentar salvar sem etapas → bloqueio.

**Acceptance Scenarios**:

1. **Given** modal Novo/Editar Calendário com escola + ano selecionados, **When** abre a seção Etapas, **Then** lista só as etapas com `ativa=true` para aquela escola + ano letivo, agrupadas nos 7 grupos (Infantil; Anos Iniciais; Anos Finais; Ensino Médio; Ensino Médio Normal/Magistério; EJA; Curso Técnico e Qualificação Profissional).
2. **Given** grupos sem nenhuma etapa ativa, **When** renderiza, **Then** o grupo não é exibido.
3. **Given** etapas 22/23/56 (Multi/Correção de Fluxo) ativas, **When** renderiza, **Then** aparecem dentro do grupo Anos Finais (decisão registrada).
4. **Given** um grupo exibido, **When** clica "Selecionar Todas" do grupo, **Then** todas as etapas daquele grupo ficam marcadas (toggle: se todas já marcadas, desmarca).
5. **Given** formulário com zero etapas marcadas, **When** tenta salvar, **Then** salvamento bloqueado com `toast.error` (decisão registrada: obrigatória).
6. **Given** calendário salvo com etapas, **When** reabre em edição, **Then** as etapas persistem marcadas; leitura/escrita usa a coluna `etapas TEXT[]` existente (códigos INEP como string), sem migration.

---

### User Story 4 - Modal de calendário responsivo (Priority: P1)

O profissional usa resolução 1366×768: o modal Novo/Editar Calendário e o `DatePicker` cabem na tela sem corte, e o calendário não exibe espaço vazio abaixo do grid de dias.

**Why this priority**: Corte de conteúdo em resolução comum impede a operação. Entrega valor sozinha.

**Independent Test**: Em 1366×768, abrir o modal de calendário, abrir os dois `DatePicker`s e conferir que nada é cortado e não há área vazia no calendário.

**Acceptance Scenarios**:

1. **Given** viewport 1366×768, **When** abre qualquer modal da aba (Ano/Calendário/Evento), **Then** todo o conteúdo é alcançável (scroll interno do modal, `max-h-[90vh] + overflow-y-auto`), sem corte.
2. **Given** `DatePicker` aberto, **When** visualiza o grid do mês, **Then** só as semanas necessárias são renderizadas (sem linhas vazias fixas); o popover respeita a largura da viewport (`max-w-[calc(100vw-2rem)]`, `collisionPadding`).
3. **Given** mobile (<640px), **When** abre o modal, **Then** os campos Início/Término empilham (`DatePickerDual` já empilha) e as pills de etapa quebram em múltiplas linhas.

---

### User Story 5 - KPIs de Dias Letivos no topo da Visualização (Priority: P1)

O gestor seleciona um calendário e vê no topo do card: um KPI em destaque com o total de Dias Letivos + um KPI para cada Período Avaliativo criado (com dias letivos, datas e ações editar/excluir). A grade de dias continua funcionando como antes, abaixo.

**Why this priority**: Transforma números hoje tímidos (badge no header / cards no fim) em leitura imediata. Entrega valor sozinha.

**Independent Test**: Selecionar calendário com 2 períodos avaliativos → 3 KPIs no topo (geral + 2), grade abaixo inalterada.

**Acceptance Scenarios**:

1. **Given** calendário selecionado, **When** visualiza o card, **Then** o primeiro bloco é a linha de KPIs: 1 `StatCard` oficial (total geral) + 1 card por período avaliativo no mesmo visual (valor `text-[36px] tabular-nums`), em grid `grid-cols-2 lg:grid-cols-4`.
2. **Given** cada KPI de período, **When** visualiza, **Then** exibe nome do período, dias letivos, faixa de datas e mantém os botões editar/excluir atuais.
3. **Given** calendário sem períodos avaliativos, **When** visualiza, **Then** só o KPI geral aparece (sem seção vazia).
4. **Given** a grade mensal, **When** interage (clicar em dia, legenda), **Then** comportamento idêntico ao atual (sem regressão).

---

### User Story 6 - Tipo de Evento em Pills (Priority: P1)

Ao criar/editar um evento, o profissional escolhe o tipo (Recesso, Dia Letivo, Período Avaliativo) em Pills clicáveis de seleção única: marcar uma desmarca a anterior, no padrão dos demais campos do sistema.

**Why this priority**: Padronização com o resto do sistema (`ClickablePill`); radios nativos destoam. Entrega valor sozinha.

**Independent Test**: Abrir Novo Evento, clicar nas 3 pills em sequência e conferir seleção única + persistência do tipo salvo.

**Acceptance Scenarios**:

1. **Given** modal Novo/Editar Evento, **When** visualiza o campo Tipo, **Then** são 3 `ClickablePill` (Recesso, Dia Letivo, Período Avaliativo), sem `input[type=radio]` nativo.
2. **Given** uma pill ativa, **When** clica em outra, **Then** a anterior desmarca automaticamente (seleção única).
3. **Given** evento salvo, **When** reabre em edição, **Then** a pill do tipo persistido está ativa; o cálculo de dias letivos permanece inalterado.

### Edge Cases

- Escola sem nenhuma etapa ativa no ano: modal de calendário exibe `EmptyState`/mensagem orientando ativar etapas na aba Etapas (não lista grupos vazios).
- Superadmin sem escola selecionada: seção de etapas não carrega (depende de `effectiveSchoolId + selectedAno`).
- Calendários legados com `etapas = []`: edição exige marcar ≥1 etapa antes de salvar (regra nova vale para update também).
- `etapas` com valores fora do catálogo atual: edição preserva os valores no save (não apaga o que não exibe), filtrando só a exibição.
- Dia clicado fora da vigência do calendário: mantém o `toast.error` atual.
- Mês com 4–6 semanas no `DatePicker`: altura do popover varia por mês (sem área fixa reservada).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `estrutura-academica/page.tsx` MUST usar `ModernTabs` (`tabs=[calendarios,etapas,matrizes]`, `fullWidth`, `defaultValue="calendarios"`, `urlSync={false}`), removendo `Tabs/TabsList/TabsTrigger` ad-hoc (ícones das abas saem — `ModernTabItem` não tem slot de ícone, como na Dashboard).
- **FR-002**: Subcard do ano (`TabCalendarios.tsx:771-800`) MUST exibir rótulos explícitos `Ano Letivo:` / `Início:` / `Término:` (label `text-muted-foreground` + valor `font-medium text-foreground`, datas `pt-BR`).
- **FR-003**: Botão `Encerrar` (e `Ativar`/`Reativar` quando presentes) MUST usar `flex-1`; `Excluir` MUST virar `<Button size="sm" variant="destructive" className="flex-1"><Trash2/> Excluir</Button>` (50/50 no ativo; terços iguais com 3 botões); fluxos `ConfirmDialog` inalterados.
- **FR-004**: Modal Novo/Editar Calendário MUST ter seção "Etapas de Ensino *" carregando `getEtapasEnsino(effectiveSchoolId, selectedAno.id)` (só `ativa=true`) ao abrir; agrupamento por **código INEP explícito** nos 7 grupos do US3 (não por `etapa_tipo` — Médio e Normal/Magistério compartilham o tipo); grupos vazios ocultos.
- **FR-005**: Cada grupo MUST ter botão "Selecionar Todas" (toggle do grupo) + etapas em `ClickablePill` multi-select; modal passa de `max-w-lg` para `max-w-2xl`.
- **FR-006**: `handleCreate/UpdateCalendario` MUST bloquear save com `etapas.length === 0` (`toast.error`); persistir códigos INEP como string no `TEXT[]` existente; pré-preencher na edição via `cal.etapas`; exibição filtra, mas o save preserva valores fora do catálogo.
- **FR-007**: `DatePicker` (`components/ui/date-picker.tsx`) MUST renderizar só as semanas do mês (remover preenchimento fixo de 42 células); `PopoverContent` com `max-w-[calc(100vw-2rem)]` + `collisionPadding={16}`.
- **FR-008**: `DialogContent` dos modais Ano/Calendário/Evento MUST ter `overflow-y-auto` (com `max-h-[90vh]` já existente) para caber em 768px de altura.
- **FR-009**: Card Visualização MUST renderizar a linha de KPIs **acima** da grade: `StatCard` oficial (total geral via `getDiasLetivosPorMes`) + 1 card por `periodo_avaliativo` no mesmo visual (nome, dias, datas, editar/excluir preservados), grid `grid-cols-2 lg:grid-cols-4`; `StatusBadge` do header sai (KPI o substitui); grade inalterada.
- **FR-010**: Sem períodos avaliativos, a linha de KPIs exibe só o geral (sem seção vazia).
- **FR-011**: Campo Tipo do modal Evento MUST usar 3 `ClickablePill` de seleção única (Recesso, Dia Letivo, Período Avaliativo), sem `input[type=radio]`; valor persiste em `eventoForm.tipo`; regra de dias letivos inalterada.

### Key Entities

- **Calendário — etapas vinculadas**: `academico_calendarios.etapas TEXT[]` (existente, sem DDL) — códigos INEP como string; vazio = legado (edição passa a exigir ≥1).
- **Etapa ativa (leitura)**: `academico_etapas_ensino(school_id, ano_letivo_id, etapa_codigo, ativa=true)` via `getEtapasEnsino` existente.
- **KPI geral (derivado)**: soma de `getDiasLetivosPorMes(dias, eventos).totalLetivos` — já calculado hoje no header.
- **KPI por período (derivado)**: `contarDiasLetivosNoIntervalo(inicio, termino, eventos)` por evento `tipo='periodo_avaliativo'` — mesma função atual, só reposicionada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Abas visualmente idênticas às da Dashboard (container, ativa, hover) e as 3 abas funcionam sem regressão.
- **SC-002**: Subcard exibe os 3 rótulos; Encerrar/Excluir 50/50 com Excluir vermelho no mesmo formato; fluxos de confirmar inalterados.
- **SC-003**: Calendário criado com etapas de 2 grupos persiste e reabre marcado; save sem etapas bloqueia; só ativas listadas; grupos vazios ocultos; Multi (22/23/56) em Anos Finais.
- **SC-004**: Em 1366×768 nenhum modal é cortado e o `DatePicker` não tem espaço vazio abaixo do grid.
- **SC-005**: Calendário com 2 períodos → 3 KPIs no topo (geral + 2 com editar/excluir); grade inalterada; sem períodos → só o geral.
- **SC-006**: Tipo de evento em 3 pills com seleção única; tipo persiste; sem `input[type=radio]` no modal.
- **SC-007**: `tsc --noEmit` + `next build` verdes; 0 migrations; 0 novas deps npm; 0 hex hardcoded.

## Assumptions

- Decisões do solicitante (via questionário): Multi/Correção (22/23/56) em **Anos Finais**; KPIs com **StatCard oficial**; etapas **obrigatórias** no modal.
- `etapas TEXT[]` guarda códigos INEP como string (estável entre anos; UUIDs de `academico_etapas_ensino` variam por ano letivo) — valores atuais no banco são `[]` (sem UI até hoje), então não há legado a migrar.
- Permissões inalteradas (`gestao-academica.estrutura-academica.calendarios`); auditoria automática existente cobre as escritas (etapas entram no diff).
- Módulos consumidores de `calendario.etapas` (Quadro de Aulas extras, Boletim, Comunicados) interpretam vazio como "todas" — calendário novo sempre terá ≥1 etapa, sem impacto neles.
