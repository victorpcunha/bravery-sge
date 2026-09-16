# Tasks: Estrutura Acadêmica — Calendários: Ajustes

**Input**: Design documents from `/specs/031-calendarios-ajustes/`

**Prerequisites**: spec.md, plan.md, data-model.md, quickstart.md

**Tests**: Não solicitados na spec — verificação via `npx tsc --noEmit`, `npx next build` e roteiro `quickstart.md`.

**Organization**: Tarefas agrupadas por user story; cada story é um incremento testável independente. 0 migrations (nada a aplicar no banco).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos diferentes, sem dependências)
- **[Story]**: user story da spec (US1–US6)

---

## Phase 1: Setup (US1 + US2 — base visual, sem dependências)

- [x] T001 [US1] `estrutura-academica/page.tsx`: trocar `Tabs/TabsList/TabsTrigger/Content` por `ModernTabs` (`tabs=[calendarios,etapas,matrizes]`, `fullWidth`, `defaultValue="calendarios"`, `urlSync={false}`); remover imports e classes ad-hoc
- [x] T002 [US2] `TabCalendarios.tsx:771-800`: rótulos explícitos `Ano Letivo:/Início:/Término:` + `Encerrar/Ativar/Reativar flex-1` + `Excluir variant="destructive" flex-1` com ícone + label (remove `ghost icon-sm`); manter ConfirmDialogs

**Checkpoint**: Abas padrão + subcard novo, sem regressão de fluxos

---

## Phase 2: User Story 3 — Vínculo de Etapas (Priority: P1) 🎯 Núcleo funcional

**Goal**: Modal de calendário com etapas ativas em 7 grupos, Selecionar Todas por grupo, save obrigatório.

**Independent Test**: Criar calendário com etapas de 2 grupos → persiste e reabre marcado; save sem etapas bloqueia (§3 do quickstart).

- [x] T003 [US3] `TabCalendarios.tsx`: constante `GRUPOS_CALENDARIO` (7 títulos + códigos INEP, `data-model.md` §2) + state `etapasDisponiveis` via `getEtapasEnsino(effectiveSchoolId, selectedAno.id)` na abertura do modal (loading/empty states; grupos vazios ocultos; Multi 22/23/56 em Anos Finais)
- [x] T004 [US3] `TabCalendarios.tsx`: seção "Etapas de Ensino *" no modal (largura `max-w-2xl`, "Selecionar Todas" toggle por grupo + `ClickablePill` multi-select) + bloqueio `etapas.length===0` em `handleCreate/UpdateCalendario` + pré-preencher `cal.etapas` na edição (preserva valores fora do catálogo no save)

**Checkpoint**: US3 testável de ponta a ponta

---

## Phase 3: User Story 4 — Responsividade (Priority: P1)

**Goal**: Modais sem corte em 1366×768; `DatePicker` sem espaço vazio.

**Independent Test**: Abrir os 3 modais + pickers em 1366×768 e mobile (§4 do quickstart).

- [x] T005 [P] [US4] `components/ui/date-picker.tsx`: remover pad fixo de 42 células (semanas dinâmicas) + `PopoverContent max-w-[calc(100vw-2rem)] collisionPadding={16}`; conferir regressão visual nos outros consumidores (TurmaForm, comunicados, agenda)
- [x] T006 [P] [US4] `TabCalendarios.tsx`: `overflow-y-auto` nos `DialogContent`s dos modais Ano/Calendário/Evento (mantém `max-h-[90vh]`)

**Checkpoint**: US4 testável nas resoluções-alvo

---

## Phase 4: User Stories 5 + 6 — KPIs e Pills (Priority: P1)

**Goal**: KPIs StatCard no topo + Tipo de evento em pills, grade inalterada.

**Independent Test**: Calendário com 2 períodos → 3 KPIs no topo; evento salvo como Período gera KPI (§5–§6 do quickstart).

- [x] T007 [US5] `TabCalendarios.tsx`: mover `renderPeriodosKpis()` para acima de `renderCalendarGrid()`; KPI geral em `StatCard` (`CalendarCheck`) + KPI por período no mesmo visual com editar/excluir; remover `StatusBadge` do header; grid `grid-cols-2 lg:grid-cols-4`; sem períodos → só geral
- [x] T008 [P] [US6] `TabCalendarios.tsx:982-1003`: radios nativos → 3 `ClickablePill` seleção única ligados a `eventoForm.tipo`; pré-seleção na edição; regra de dias letivos inalterada

**Checkpoint**: US5 + US6 testáveis

---

## Phase 5: Polish (Gates finais)

- [ ] T009 [P] `quickstart.md` executado por completo (§1→§6) em 1366×768 + mobile — **QA manual pendente**
- [x] T010 [P] Varreduras: `grep 'type="radio"'` limpo no módulo calendários (resta 1 ocorrência pré-existente em `metodos/MetodosForm.tsx:466`, fora do escopo); `grep '#[0-9A-Fa-f]\{6\}'` sem hex novo; `npx tsc --noEmit` + `npx next build` verdes
