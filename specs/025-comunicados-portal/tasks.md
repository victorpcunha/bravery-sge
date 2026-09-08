# Tasks: Comunicados do Portal

**Input**: Design documents from `/specs/025-comunicados-portal/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No test framework in this project — validation is manual via `quickstart.md` (Phase 7). No test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database migration + permission seed (files; apply via SQL Editor)

- [x] T001 [P] Write visibility-period migration in supabase-migrations/patch_comunicados_periodo_visibilidade.sql (ALTER comunicados ADD ano_letivo_id/visivel_de/visivel_ate, backfill visivel_de=data_comunicado, new indexes per data-model.md §1)
- [x] T002 [P] Write permission seed in supabase-migrations/patch_recursos_portal.sql (INSERT portal.comunicados / Comunicados do Portal / Portal with ON CONFLICT DO NOTHING)

**Checkpoint**: Apply both files via SQL Editor before Phase 2; legacy comunicados must remain readable

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Server actions + navigation that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Implement admin CRUD actions in src/lib/actions/comunicados.ts (listarComunicados/getComunicado/criarComunicado/atualizarComunicado/excluirComunicado per contracts/comunicados-actions.md, with validarPermissaoEstrita, school_id scope, server-side validation, registrarAuditoria módulo 'Portal — Comunicados')
- [x] T004 [P] Register Portal module with Comunicados item in src/components/layout/sidebar.tsx (Megaphone icon, href /comunicados, recurso portal.comunicados)
- [x] T005 [P] Register comunicados tab module in src/lib/tab-routes.tsx (TAB_MODULES + MODULES meta + ROUTES for /comunicados, /comunicados/novo, /comunicados/[id] stacked in the same tab)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Listar e filtrar comunicados (Priority: P1) 🎯 MVP

**Goal**: Gestão localiza comunicados via filtros padrão + minicards com Novo Comunicado no card

**Independent Test**: Abrir /comunicados com ano ativo pré-selecionado; ver minicards (envio/fim, título, descrição 100 chars, Editar/Excluir); filtrar por etapa/turma/datas; empty states contextualizados (quickstart.md §1)

- [x] T006 [P] [US1] Create filter card component in src/components/comunicados/comunicado-filtros.tsx (Ano Letivo default ativo + Data envio/final via Calendar captionLayout=dropdown in Popover + Etapa/Turma Selects scoped to school, PageSection compact + FilterBar pattern)
- [x] T007 [P] [US1] Create minicard component in src/components/comunicados/comunicado-minicard.tsx (Card grid pattern per oficiais-tab.tsx: dates, title, 100-char description, ghost icon-sm Edit/Delete buttons)
- [x] T008 [US1] Implement listing page in src/app/(app)/comunicados/page.tsx (PageContainer > PageHeader + filters + PageSection flush "Comunicados Registrados" with Novo action + grid + client Pagination 10/pág + EmptyState + ShieldAlert without permission; depends on T006, T007)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (with data seeded via SQL)

---

## Phase 4: User Story 2 - Criar novo comunicado (Priority: P1)

**Goal**: Gestão publica comunicado com etapas/turmas snapshot + período de visualização com hora

**Independent Test**: Novo Comunicado → ano travado, turmas dependentes pré-marcadas, range+time, Salvar válido → toast + minicard; inválido → bloqueio orientador (quickstart.md §2)

- [x] T009 [P] [US2] Create visibility-period field in src/components/comunicados/periodo-visibilidade-field.tsx (Calendar mode=range + captionLayout=dropdown in Popover + two Input type=time, design-token styling, returns visivelDe/visivelAte ISO)
- [x] T010 [US2] Create form component in src/components/comunicados/comunicado-form.tsx (FormCard Identificação: ano travado + etapas ativas + turmas dependentes pré-marcadas; FormCard Detalhes: título + periodo field + Textarea; sticky footer Cancelar/Salvar; react-hook-form + zod; validation with toasts)
- [x] T011 [US2] Implement creation page in src/app/(app)/comunicados/novo/page.tsx (no breadcrumbs, Voltar button, wires comunicado-form to criarComunicado; depends on T010)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (end-to-end publish flow)

---

## Phase 5: User Story 3 - Editar e excluir comunicado (Priority: P2)

**Goal**: Gestão corrige ou remove comunicados com confirmação; expiração antecipada tira do Portal

**Independent Test**: Editar preenche form + Excluir com ConfirmDialog; antecipar fim remove do Portal mas mantém na listagem; excluir some de tudo com toast (quickstart.md §3)

- [x] T012 [P] [US3] Implement edit page in src/app/(app)/comunicados/[id]/page.tsx (loads via useTabParams + getComunicado, reuses comunicado-form wired to atualizarComunicado, Voltar + Excluir buttons with ConfirmDialog variant=destructive)
- [x] T013 [P] [US3] Wire delete-with-confirmation on listing in src/app/(app)/comunicados/page.tsx (ConfirmDialog for minicard delete calling excluirComunicado; implemented together with T008)

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Visibilidade no Portal do Responsável (Priority: P2)

**Goal**: Portal exibe só comunicados vigentes do filho; expirados/futuros somem sem mudança visual

**Independent Test**: Vigente p/ Turma A visível só p/ responsável A; após fim some; futuro não aparece; leitura marca lido (quickstart.md §4)

- [x] T014 [US4] Enforce visibility window in src/lib/actions/portal.ts (server-side visivel_de/ate filter in listarComunicadosPortal + revalidate window/scope in marcarComunicadoLido; keep geral/turma_ids logic and existing signatures/UI untouched; receber_comunicados opt-out removido — broadcast sem opt-out)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Gates, validation, memory update

- [x] T015 [P] Run typecheck and build (npx tsc --noEmit and npx next build green)
- [x] T016 Run quickstart.md validation (all 5 sections incl. security/regression §5: cross-school isolation, legacy rows, audit trail)
- [x] T017 [P] Update AGENTS.md project summary with Comunicados do Portal progress notes

---

## Phase 8: Ajustes de UI pós-homologação (feedback)

- [x] T018 Mover Comunicados para o módulo Gestão Acadêmica no sidebar (src/components/layout/sidebar.tsx) + seed `portal.comunicados` com modulo 'Gestão Acadêmica' e UPDATE de correção (supabase-migrations/patch_recursos_portal.sql)
- [x] T019 Filtro de escola (superadmin) como primeiro filtro do FilterBar + botão Limpar filtros padrão auditoria (outline/sm/h-9/FilterX, alinhado via label-spacer) em src/components/comunicados/comunicado-filtros.tsx e src/app/(app)/comunicados/page.tsx
- [x] T020 Form: ano em max-w-[160px], etapas agrupadas por nível (etapa_tipo) com Selecionar todos/Limpar (outline/xs, padrão MatrizForm), turmas com mesmos botões, Detalhes em grid lg:4 (Título/Período/Hora ini/Hora fim), horas sem ícone com showPicker no clique — src/components/comunicados/comunicado-form.tsx + periodo-visibilidade-field.tsx (PeriodoDatasField/HoraField)
- [x] T021 Novo Comunicado no topo direito do card mesmo sem registros (actions no PageSection vazio) em src/app/(app)/comunicados/page.tsx
- [x] T022 Remover Etapas do form (só turmas, agrupadas por nível; `etapa_ids` derivado server-side via `derivarEtapas` em src/lib/actions/comunicados.ts); Limpar em vermelho (outline/xs/text-destructive)
- [x] T023 TimePicker shadcn próprio (src/components/ui/time-picker.tsx, tokens, sem relógio nativo) usado no HoraField
- [x] T024 Botões do form no padrão oficial (Limpar = destructive/sm/Trash2 como o Excluir de escolas/[id]; Selecionar todas = outline/sm como o Voltar) + minutos de 10 em 10 no TimePicker

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (T001, T002 in parallel; apply via SQL Editor before Phase 2)
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories (T003, T004, T005 in parallel, different files)
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - US1 (list) and US2 (create) are P1; US2's page needs US1's list only for navigation-back display, otherwise independent
  - US3 depends on US1 files (page.tsx edit) and US2 files (form reuse) — implement after Phases 3-4
  - US4 touches only portal.ts — can run in parallel with Phases 3-5 once Foundational is done
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories (seed data via SQL for testing)
- **User Story 2 (P1)**: Can start after Foundational - Uses T003 create action; testable with US1 list as viewer
- **User Story 3 (P2)**: Depends on US1 (page.tsx) + US2 (form) files - Must come after Phases 3-4
- **User Story 4 (P2)**: Can start after Foundational - portal.ts only; needs US2-created data for full validation

### Within Each User Story

- Components ([P], different files) before pages that compose them
- Core implementation before integration
- Story complete before moving to next priority (except US4 parallel track)

### Parallel Opportunities

- Phase 1: T001 + T002 (different migration files)
- Phase 2: T003 + T004 + T005 (actions, sidebar, tab-routes — different files)
- Phase 3: T006 + T007 (filtros + minicard — different files)
- Phase 4: T009 first, then T010, T011 sequentially (component composition chain)
- Phase 5: T012 + T013 (edit page + listing edit — different files)
- US4 (T014) can run in parallel with Phases 3-5 (isolated file)
- Phase 7: T015 + T017 in parallel; T016 after green build

---

## Parallel Example: Foundational Phase

```bash
# All three touch different files — launch together after SQL migrations applied:
Task: "Implement admin CRUD actions in src/lib/actions/comunicados.ts"
Task: "Register Portal module with Comunicados item in src/components/layout/sidebar.tsx"
Task: "Register comunicados tab module in src/lib/tab-routes.tsx"
```

## Parallel Example: User Story 1

```bash
# Launch both components together:
Task: "Create filter card component in src/components/comunicados/comunicado-filtros.tsx"
Task: "Create minicard component in src/components/comunicados/comunicado-minicard.tsx"
# Then: "Implement listing page in src/app/(app)/comunicados/page.tsx"
```

---

## Implementation Strategy

### MVP First (Foundational + US1 + US2)

1. Complete Phase 1: Setup (migrations written + applied via SQL Editor)
2. Complete Phase 2: Foundational (actions + sidebar + tabs)
3. Complete Phase 3: User Story 1 (listagem — validate with SQL-seeded rows)
4. Complete Phase 4: User Story 2 (criação — full publish flow)
5. **STOP and VALIDATE**: publish a comunicado end-to-end and see it in the list
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 → Test independently → Demo (gestão vê comunicados existentes)
3. Add US2 → Test independently → Demo (MVP! publica de ponta a ponta)
4. Add US3 → Test independently → Demo (corrige/remove)
5. Add US4 (or in parallel) → Test independently → Demo (portal respeita vigência)
6. Each story adds value without breaking previous stories (portal untouched until US4; US4 is additive filter)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 + US3 (listagem + edição/exclusão — same files)
   - Developer B: US2 (form + criação)
   - Developer C: US4 (portal.ts window filter)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Manual SQL Editor apply required for T001/T002 (project has no Supabase CLI flow)
- Never use /portal/* internal routes (collides with public /portal/[slug])
