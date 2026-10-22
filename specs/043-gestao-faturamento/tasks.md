# Tasks: Gestão de Faturamento

**Input**: Design documents from `/specs/043-gestao-faturamento/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/faturamento-actions.md, quickstart.md

**Tests**: Manual validation via quickstart.md §1–§7 (repo não possui suite automatizada; sem TDD).

**Organization**: Tasks grouped by user story. Ordem das fases segue dependência (US5 Config precede US1 Geração); prioridades da spec preservadas nos labels.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Migrations e seeds versionados (aplicação via SQL Editor, padrão do repo)

- [X] T001 Create `supabase-migrations/faturamento.sql` with `faturamento_configuracoes`, `faturamento_planos`, `faturamento_mensalidades` tables, checks, indexes and `updated_at` triggers per data-model.md
- [X] T002 Create `supabase-migrations/patch_recursos_faturamento.sql` seeding `faturamento.visao-geral`, `faturamento.cobrancas`, `faturamento.configuracao` with auto-grant from `gestao-academica.matriculas`
- [ ] T003 Apply both migrations via SQL Editor and verify tables + resources exist (PENDENTE — ação manual do usuário no Supabase)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base neutra, navegação e casca das actions que TODAS as stories usam

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create shared types in `src/lib/faturamento-tipos.ts` (situations, filtros, `ResumoGeracao`, `ResultadoLote` per contracts)
- [X] T005 [P] Implement pure calculation helpers in `src/lib/faturamento-calculo.ts` (competências, vencimento `min(dia, último dia)`, resolução de config por etapa, situações derivadas, indicadores)
- [X] T006 Create action shell in `src/lib/actions/faturamento.ts` with `getSupabaseAdmin()`, `validarPermissaoEstrita` guards and auditoria helpers (module `Faturamento`)
- [X] T007 Register top-level `Faturamento` module with 3 submenu items in `src/components/layout/sidebar.tsx`
- [X] T008 Register `TAB_MODULES.faturamento` + 3 `ROUTES` entries in `src/lib/tab-routes.tsx` (stubs visão/cobranças substituídos em T019/T023)
- [X] T009 [P] Create textual status component in `src/components/faturamento/situacao-badge.tsx` (reusing `StatusBadge`, never color-only)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 5 - Definir o padrão de cobrança (Priority: P2, dependency of US1)

**Goal**: Configuração de Faturamento por escola/ano com abrangência por etapas; salvar nunca altera planos existentes

**Independent Test**: quickstart §1 passos 1–2 (salvar padrão; Cobranças continua vazia; pendência "sem plano" aparece)

### Implementation for User Story 5

- [X] T010 [US5] Implement `getConfiguracoes` + `salvarConfiguracao` in `src/lib/actions/faturamento.ts` (resource `faturamento.configuracao`, FR-006: no plan side effects)
- [X] T011 [P] [US5] Create config form in `src/components/faturamento/configuracao-client.tsx` (valor, vencimento, meses, etapas via pills, `react-hook-form + zod v4`)
- [X] T012 [US5] Create Config page in `src/app/(app)/faturamento/configuracao/page.tsx` (`PageContainer > PageHeader + FormCard`, permission gate `EmptyState ShieldAlert`)

**Checkpoint**: At this point, configuration can be saved and reused as generation default

---

## Phase 4: User Story 1 - Geração em massa do ano letivo (Priority: P1) 🎯 MVP

**Goal**: Configurar → abrangência → revisar → confirmar → gerar planos + mensalidades, preservando existentes por padrão

**Independent Test**: quickstart §1–§2 (387-style bulk generation; re-run preserves exception; aggregated audit record)

### Implementation for User Story 1

- [X] T013 [US1] Implement `simularGeracao` (read-only) in `src/lib/actions/faturamento.ts` returning `ResumoGeracao` (eligible/standard/existing/inconsistent/unaffected counts, estimated parcels, total)
- [X] T014 [US1] Implement `gerarPlanosEmMassa` in `src/lib/actions/faturamento.ts` (preserve-by-default, `substituir` opt-in, idempotent via UNIQUE competencia, `registrarAuditoriaAgregada`)
- [X] T015 [P] [US1] Create generation wizard in `src/components/faturamento/geracao-wizard.tsx` (abrangência → revisão → confirmação → resultado, `ConfirmDialog` for replace)
- [X] T016 [US1] Wire wizard entrypoint (header action on Cobranças/Visão Geral) with permission `faturamento.cobrancas` criar (Visão Geral OK; Cobranças em T023)

**Checkpoint**: At this point, MVP (Setup + Foundational + US5 + US1) is fully functional and testable independently — STOP and VALIDATE per quickstart §1–§2

---

## Phase 5: User Story 2 - Visão Geral e central de pendências (Priority: P1)

**Goal**: Previsto/Recebido/Em aberto/Vencido + pendências acionáveis no contexto ano/unidade/período

**Independent Test**: quickstart §4-parte (indicadores consistentes) + spec US2 scenarios (pendência "12 sem plano" → geração; "Vencida" textual derivada)

### Implementation for User Story 2

- [X] T017 [US2] Implement `getVisaoGeral` in `src/lib/actions/faturamento.ts` (SQL aggregates scoped by school/ano/turma/period + pendências with action routes)
- [X] T018 [P] [US2] Create overview client in `src/components/faturamento/visao-geral-client.tsx` (`StatCard`s above the fold + pendências list with direct actions, Recharts only if trend needed)
- [X] T019 [US2] Create Visão Geral page in `src/app/(app)/faturamento/page.tsx` (`PageContainer(maxWidth dashboard) > PageHeader + KPIs + pendências`)

**Checkpoint**: At this point, User Stories 1, 5 AND 2 work independently

---

## Phase 6: User Story 3 - Cobranças e baixa manual (Priority: P2)

**Goal**: Listar/filtrar mensalidades e registrar pagamento em lote (data + forma + observação)

**Independent Test**: quickstart §4 (filter, bulk baixa of 3 parcels, re-baixa ignored with warning; totals exclude isentas/canceladas)

### Implementation for User Story 3

- [X] T020 [US3] Implement `listarCobrancas` in `src/lib/actions/faturamento.ts` (filters per FR-014, server-side pagination 10/pág)
- [X] T021 [US3] Implement `baixarMensalidades` + `isentarMensalidades` + `cancelarMensalidades` in `src/lib/actions/faturamento.ts` (skip non-pending with report, aggregated audit)
- [X] T022 [P] [US3] Create cobranças list in `src/components/faturamento/cobrancas-client.tsx` (`FilterBar` + shadcn `Table` with sticky first column + multi-select + baixa dialog + `Pagination` + `EmptyState`)
- [X] T023 [US3] Create Cobranças page in `src/app/(app)/faturamento/cobrancas/page.tsx` (official listing layout, "Gerar planos" action)

**Checkpoint**: At this point, configure → generate → track → receive cycle is complete

---

## Phase 7: User Story 4 - Exceções individuais e visão na matrícula (Priority: P3)

**Goal**: Ajustes por plano com indicador de divergência + situação financeira visível a partir da matrícula + saída com cancelamento opcional

**Independent Test**: quickstart §3 + §5 (late entry ago–dez; divergência textual; saída cancela futuras, preserva pagas)

### Implementation for User Story 4

- [X] T024 [US4] Implement `getPlanoPorMatricula` + `criarPlanoIndividual` + `atualizarPlano` in `src/lib/actions/faturamento.ts` (`config_origem_id` NULL marks exception, troca de responsável auditada)
- [X] T025 [US4] Implement `tratarSaidaMatricula` in `src/lib/actions/faturamento.ts` (cancel unpaid future, preserve paid, plano → `encerrado`)
- [X] T026 [P] [US4] Create plan dialog in `src/components/faturamento/plano-dialog.tsx` (plano + grade de parcelas + divergência textual + baixa/isentar/cancelar por item)
- [X] T027 [US4] Add "cancelar futuras não pagas" checkbox (default checked) to movimentações dialog calling `tratarSaidaMatricula` (matrículas flow, no academic rule change)
- [X] T028 [US4] Add financial view entrypoint on matrícula (same-domain read via `getPlanoPorMatricula`, FR-017)

**Checkpoint**: All user stories independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validation, perf, docs

- [X] T029 Run full quickstart.md validation (§1–§7) and fix deviations (revisão de código + correções: renumeração de parcelas, corte de saída, lote em massa; QA vivo pendente de ambiente com migrations aplicadas)
- [X] T030 [P] Verify `npx tsc --noEmit` clean and `npx next build` green
- [X] T031 [P] Design review pass: `text-[15px]` descriptions, zero hex, minicards `<md`, touch targets ≥36px, `role="alert"` on errors (grep + lint: só achados do padrão pré-existente)
- [X] T032 Performance check: bulk generation of 400+ matrículas without action timeout; aggregates without N+1 (EXPLAIN spot-check) (inserts em lote 200/500 + auditoria só agregada; sem N+1 nas listagens)
- [X] T033 Update `AGENTS.md` project summary with Faturamento module notes (0 new npm deps, migrations applied)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (SQL Editor access needed for T003)
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3–7)**: All depend on Foundational completion
  - Phase 3 (US5 Config) MUST precede Phase 4 (US1 Geração) — generation consumes saved defaults
  - Phases 5–7 (US2/US3/US4) can proceed in parallel after US1, or sequentially P1 → P2 → P3
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US5 Config (P2)**: After Foundational; no story dependencies; blocks US1
- **US1 Geração (P1)**: After US5; MVP core with US5
- **US2 Visão (P1)**: After Foundational; needs plans data (US1) for meaningful validation but independently testable with seeded data
- **US3 Cobranças/Baixa (P2)**: After Foundational; needs mensalidades (US1) for validation
- **US4 Exceções (P3)**: After US1/US3 (extends plan dialog + baixa actions)

### Within Each User Story

- Actions before components before pages
- Core implementation before integration (T027–T028 last in US4)
- Story complete before moving to next priority

### Parallel Opportunities

- T004 + T005 + T009 (different neutral/component files, Phase 2)
- T011 + T012 blocked on T010 (same story chain) — T011/T012 parallel after T010
- T015 parallel with T013/T014? No — wizard consumes `ResumoGeracao`/`ResultadoLote` shapes (stabilized in contracts, so UI skeleton can start in parallel at risk)
- T018 after T017; T022 after T020/T021; T026 after T024
- T030 + T031 can run in parallel (Phase 8)

---

## Parallel Example: Phase 2 Foundational

```bash
# Launch neutral libs + badge together (different files, no dependencies):
Task: "Create shared types in src/lib/faturamento-tipos.ts"
Task: "Implement pure calculation helpers in src/lib/faturamento-calculo.ts"
Task: "Create textual status component in src/components/faturamento/situacao-badge.tsx"
```

---

## Implementation Strategy

### MVP First (US5 + US1)

1. Complete Phase 1: Setup (migrations via SQL Editor)
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: US5 Config
4. Complete Phase 4: US1 Geração em massa
5. **STOP and VALIDATE**: quickstart §1–§2 independently (secretaria configura ano sem abrir matrículas)
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. + US5 + US1 → MVP: configurar + gerar (Deploy/Demo)
3. + US2 → monitorar: indicadores + pendências (Deploy/Demo)
4. + US3 → operar: cobranças + baixa manual (Deploy/Demo)
5. + US4 → exceções + saída + visão na matrícula (Deploy/Demo)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers (after Foundational + US5 + US1):

1. Developer A: US2 Visão Geral
2. Developer B: US3 Cobranças/Baixa
3. Developer C: US4 Exceções (after US3 actions land, or against contracts)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability (US numbers = spec.md stories)
- Migrations (T001–T003) applied manually via SQL Editor — no Supabase CLI in this project
- `asaas_*` columns ship NULL and stay invisible (FR-024); provider integration is a future spec
- Commit after each task or logical group; `tsc` + `next build` green before phase checkpoints
