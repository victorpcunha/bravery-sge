# Tasks: Histórico Escolar — Painel do Aluno

**Input**: Design documents from `specs/004-historico-escolar/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/server-actions.md ✅

**Tests**: Not requested — omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create migration and shared type definitions

- [x] T001 Create migration file `supabase-migrations/004_historico_escolar.sql` with table `historico_manual_disciplinas` and ALTER `historico_manual` ADD `estado VARCHAR(2)`
- [ ] T002 Execute migration `004_historico_escolar.sql` against Supabase database

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Server actions and shared types that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Add shared types (`NotasDetalhadas`, `IndicadoresAvaliados`, `HistoricoManualRecord`, `HistoricoManualInput`) in `src/lib/actions/painel-pessoa.ts`
- [x] T004 [P] Implement `getNotasDetalhadas(alunoId, turmaId)` server action in `src/lib/actions/painel-pessoa.ts` — query `academico_notas`, `academico_recuperacoes`, `academico_frequencias_dia`
- [x] T005 [P] Implement `getIndicadoresAvaliados(alunoId, turmaId)` server action in `src/lib/actions/painel-pessoa.ts` — query `academico_avaliacoes_indicadores` with joins to `indicadores_avaliacao` and `indicadores_niveis`
- [x] T006 [P] Implement `listarHistoricoManual(alunoId)` server action in `src/lib/actions/historico-manual.ts` — query `historico_manual` with `json_agg` for disciplinas
- [x] T007 [P] Implement `removerHistoricoManual(id)` server action in `src/lib/actions/historico-manual.ts` — delete by id (CASCADE handles disciplinas)
- [x] T008 Expand `adicionarHistoricoManual` server action in `src/lib/actions/historico-manual.ts` — accept `disciplinas` array, insert into `historico_manual_disciplinas` in transaction after creating `historico_manual` record

**Checkpoint**: All server actions ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Expandir matrícula e consultar avaliações detalhadas (Priority: P1) 🎯 MVP

**Goal**: Profissional expande uma linha de matrícula e visualiza Avaliação Numérica (tabela disciplina × período) e Avaliação por Indicadores (select disciplina + tabela indicador × período). Apenas uma linha expandida por vez.

**Independent Test**: Cadastrar aluno com notas, faltas e indicadores. Expandir linha no card — verificar tabelas de notas e indicadores.

### Implementation for User Story 1

- [x] T009 [P] [US1] Create `expansao-notas.tsx` component in `src/components/painel-pessoa/expansao-notas.tsx` — receives `NotasDetalhadas`, renders Table with disciplines (rows) × periods (columns) + Média Final, Total Faltas, Frequência % columns
- [x] T010 [P] [US1] Create `expansao-indicadores.tsx` component in `src/components/painel-pessoa/expansao-indicadores.tsx` — receives `IndicadoresAvaliados`, renders Select for disciplina + Table with indicadores (rows) × períodos (columns) showing nivel_sigla
- [x] T011 [US1] Refactor `card-historico.tsx` in `src/components/painel-pessoa/card-historico.tsx` — replace simple Table with Collapsible accordion, implement single-expand state (`expandedId: string | null`), lazy load data via `getNotasDetalhadas` and `getIndicadoresAvaliados` on expand
- [x] T012 [US1] Integrate `expansao-notas.tsx` and `expansao-indicadores.tsx` into `card-historico.tsx` expanded content area — pass fetched data to both subcomponents
- [x] T013 [US1] Add empty/loading states in `card-historico.tsx` — expand loading spinner, "Nenhuma avaliação numérica registrada" and "Nenhum indicador avaliado" messages per edge cases

**Checkpoint**: User Story 1 fully functional — expandir matrícula exibe notas e indicadores

---

## Phase 4: User Story 2 — Adicionar histórico escolar manual com disciplinas (Priority: P1)

**Goal**: Profissional abre modal "Adicionar Histórico" com Card Dados Gerais + Card Registros Escolares, adiciona múltiplas disciplinas com cálculo automático de cargas horárias (BNCC / Parte Diversificada / Total).

**Independent Test**: Abrir modal, preencher dados gerais, adicionar/remover disciplinas, verificar sumário, salvar.

### Implementation for User Story 2

- [x] T014 [US2] Refactor `modal-historico-manual.tsx` in `src/components/painel-pessoa/modal-historico-manual.tsx` — restructure form into Card Dados Gerais and Card Registros Escolares
- [x] T015 [US2] Add Dados Gerais fields in `modal-historico-manual.tsx`: Ano Letivo* (Select), Carga Horária total (Input number), Dias Letivos anuais (Input number), Estado* (Select UF with 27 siglas), Município* (Input text), Unidade Escolar* (Input text), Etapa de Ensino* (Select), Situação* (Select), Observações (Textarea)
- [x] T016 [US2] Add Registros Escolares section in `modal-historico-manual.tsx`: Disciplina* (Select — load via `getDisciplinas` from `matrizes.ts`), Média Final* (Input number step 0.01), Carga Horária anual (Input number), Checkbox "Parte Diversificada", Button "Adicionar Disciplina"
- [x] T017 [US2] Implement discipline list with add/remove in `modal-historico-manual.tsx` — `useState` array for disciplines, display list with remove button per item
- [x] T018 [US2] Implement carga horária summary in `modal-historico-manual.tsx` — `useMemo` calculating BNCC (sum unchecked), Parte Diversificada (sum checked), Total (BNCC + Div) in real time
- [x] T019 [US2] Update submit handler in `modal-historico-manual.tsx` — call expanded `adicionarHistoricoManual` with `disciplinas` array, handle loading/error states, close modal on success, trigger parent refresh
- [x] T020 [US2] Update form validation in `modal-historico-manual.tsx` — required fields (Ano Letivo, Estado, Município, Unidade Escolar, Etapa de Ensino, Situação); disable Save button when required fields incomplete

**Checkpoint**: User Story 2 fully functional — modal permite adicionar histórico com disciplinas

---

## Phase 5: User Story 3 — Visualizar histórico manual na listagem (Priority: P2)

**Goal**: Históricos manuais aparecem na listagem do card junto com matrículas do sistema, de forma distinguível, e podem ser expandidos para visualizar disciplinas.

**Independent Test**: Após adicionar histórico manual via modal, expandi-lo e verificar que disciplinas aparecem.

### Implementation for User Story 3

- [x] T021 [US3] Update `card-historico.tsx` — merge `getHistoricoSistema` and `listarHistoricoManual` results into unified list, add visual distinction (badge/icon) for manual vs system records
- [x] T022 [US3] Add manual record expansion in `card-historico.tsx` — when expanding a manual record, show Dados Gerais fields + discipline list (table with Disciplina, Média Final, Carga Horária, badge BNCC/Parte Diversificada)
- [x] T023 [US3] Add remove functionality in `card-historico.tsx` — delete button on manual records calling `removerHistoricoManual`, with ConfirmDialog, refresh list on success
- [x] T024 [US3] Update `card-historico.tsx` — remove `permite_historico_manual` flag condition from "Adicionar Histórico" button; control visibility via `pode.editar('gestao-usuarios.painel-aluno')` only

**Checkpoint**: All user stories functional — matrículas do sistema + históricos manuais visíveis, expansíveis e gerenciáveis

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation, edge cases, and final integration

- [x] T025 [P] Validate all edge cases from spec.md in `card-historico.tsx` — sem matrículas ("Nenhum registro de histórico escolar"), sem notas, sem indicadores, modal com campos vazios
- [x] T026 [P] Validate all edge cases from spec.md in `modal-historico-manual.tsx` — remover última disciplina (sumário zera, salvar permitido), campos obrigatórios pendentes
- [x] T027 Run `npx next build` and verify zero TypeScript errors
- [ ] T028 Execute quickstart.md validation scenarios end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T002) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (T003-T008)
- **User Story 2 (Phase 4)**: Depends on Foundational (T003-T008) — independent from US1
- **User Story 3 (Phase 5)**: Depends on US1 (T009-T013 for card structure) and US2 (T014-T020 for modal) — builds on both
- **Polish (Phase 6)**: Depends on all user stories

### User Story Dependencies

- **US1 (P1)**: Self-contained — new subcomponents + card refactor
- **US2 (P1)**: Self-contained — modal refactor, no dependency on US1
- **US3 (P2)**: Depends on US1 (card accordion structure) and US2 (modal/adicionar action)

### Within Each User Story

- Subcomponents before integration (T009, T010 before T012)
- UI before server integration (T014-T018 before T019)

### Parallel Opportunities

- T003, T004, T005, T006, T007 can run in parallel (different functions, same or different files)
- T009 and T010 can run in parallel (different new files)
- T025 and T026 can run in parallel (different files)
- **US1 and US2 can be implemented in parallel** after Foundational phase completes

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all server actions in parallel:
Task: "T004 [P] Implement getNotasDetalhadas in src/lib/actions/painel-pessoa.ts"
Task: "T005 [P] Implement getIndicadoresAvaliados in src/lib/actions/painel-pessoa.ts"
Task: "T006 [P] Implement listarHistoricoManual in src/lib/actions/historico-manual.ts"
Task: "T007 [P] Implement removerHistoricoManual in src/lib/actions/historico-manual.ts"
```

## Parallel Example: User Story 1 + User Story 2

```bash
# After Foundational phase, launch both in parallel:
Developer A:
  Task: "T009 [P] [US1] Create expansao-notas.tsx"
  Task: "T010 [P] [US1] Create expansao-indicadores.tsx"

Developer B:
  Task: "T014 [US2] Refactor modal-historico-manual.tsx structure"
  Task: "T015 [US2] Add Dados Gerais fields"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T008)
3. Complete Phase 3: User Story 1 (T009-T013)
4. **STOP and VALIDATE**: Expandir matrícula, verificar notas e indicadores
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Base de dados pronta
2. Add US1 → Expandir matrículas → **MVP!**
3. Add US2 → Modal de histórico manual → **Feature completa**
4. Add US3 → Integração manual + sistema na listagem → **Final**
5. Polish → Edge cases, build verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 are both P1 and can be implemented in parallel
- US3 depends on both US1 (card structure) and US2 (modal/action)
- T008 (expand `adicionarHistoricoManual`) creates `historico_manual` + `historico_manual_disciplinas` in a single transaction
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
