# Tasks: Censo Escolar – Matrícula Inicial 2026

**Input**: Design documents from `specs/001-censo-escolar/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Reference data for INEP matrices, module page shell, and shared types.

- [X] T001 [P] Create reference data matrices in src/data/censo/idades-permitidas.ts (Anexo 3: 35+ etapa×idade combos)
- [X] T002 [P] Create reference data matrices in src/data/censo/recursos-deficiencias.ts (Anexo 4: 14×9 + 3×6 matrices)
- [X] T003 [P] Create reference data matrices in src/data/censo/contratacao-dependencia.ts (Anexo 5: 6×5 matrix)
- [X] T004 [P] Create reference data matrices in src/data/censo/etapas-formas-organizacao.ts (Anexo 6: 35+×6 matrix)
- [X] T005 [P] Create reference data in src/data/censo/etapas-ensino.ts (etapa codes and names from Tabela de Etapas 2026.xlsx)
- [X] T006 [P] Create reference data in src/data/censo/areas-conhecimento.ts (area codes from INEP table)
- [X] T007 Create shared types in src/lib/actions/censo-types.ts: ResultadoValidacao, ErroValidacao, ResultadoExportacao interfaces
- [X] T008 Create module page shell at src/app/(app)/(auth)/censo-escolar/page.tsx (filters: Ano Letivo + Etapa, placeholder for tabs)
- [X] T009 [P] Create validation summary component at src/components/censo/validacao-resumo.tsx (total errors per register tab)
- [X] T010 [P] Create error item component at src/components/censo/validacao-erro-item.tsx (error message + "Corrigir" link)
- [X] T011 [P] Create tab component at src/components/censo/validacao-aba.tsx (receives register type + error list, renders error items)

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migration to add INEP fields to operational tables. Must complete before any user story validation.

**⚠️ CRITICAL**: No user story validation can begin until fields exist in the database.

- [X] T012 Create migration SQL to add ~200 INEP fields to schools table (endereço, administrativo, mantenedora, parcerias, infraestrutura completa) in supabase-migrations/
- [X] T013 [P] Create migration SQL to add ~20 INEP fields to people table (deficiências completas, transtornos, recursos, certidão, formação continuada, email) in supabase-migrations/
- [X] T014 [P] Create migration SQL to add ~10 INEP fields to turmas table (horários INEP, etapa_codigo, eixo_qualificacao, itinerário formativo, áreas INEP) in supabase-migrations/
- [X] T015 [P] Create migration SQL to add ~15 INEP fields to academico_matriculas table (turma_multi, carga_horaria_iftp, AEE 11 campos, transporte detalhado 10 veículos) in supabase-migrations/
- [X] T016 [P] Create migration SQL to add INEP fields to turmas_profissionais table (funcao_censo, situacao_funcional, 25 area slots, itinerário flags) in supabase-migrations/
- [X] T017 Create validation engine skeleton in src/lib/actions/censo-regras.ts (structure for per-register validation functions, shared helpers for matrix lookup)

**Checkpoint**: Foundation ready — all INEP fields available in operational tables, user story validation can now begin.

## Phase 3: User Story 1 — Validar dados da escola e infraestrutura contra regras INEP (Priority: P1) 🎯 MVP

**Goal**: Professional clicks "Validar" and sees all INEP errors for Registro 00 (school data) and Registro 10 (infrastructure) in their respective tabs, with "Corrigir" links to `/escolas/[id]`.

**Independent Test**: Access module with a school having only name and INEP code. Click "Validar" → tabs 00 and 10 show missing fields (CEP, address, municipality, etc.) with clickable correction links.

### Implementation for User Story 1

- [X] T018 [US1] Implement validarRegistro00() in src/lib/actions/censo-regras.ts — validate all 53 fields: formats (CEP 8 digits, CNPJ valid, date range, email regex), conditionals (maintainers × dependency, partnerships × dependency per Anexo 5, dates × situation), profile restrictions
- [X] T019 [US1] Implement validarRegistro10() in src/lib/actions/censo-regras.ts — validate all 187 fields: "at least one" group rules (13 groups), "none of the listed" exclusion rule, classroom counts ≤ total, school feeding × in-person class
- [X] T020 [US1] Implement getCorrectionUrl() helper in src/lib/actions/censo-regras.ts — maps INEP field to target URL with tab/field params (Registro 00/10 → `/escolas/[id]?tab=...&field=...`)
- [X] T021 [US1] Wire validarRegistro00 and validarRegistro10 into validarCenso() in src/lib/actions/censo.ts, populate ResultadoValidacao.registro00 and .registro10
- [X] T022 [US1] Wire US1 validation results into module page at src/app/(app)/(auth)/censo-escolar/page.tsx — render "Registro 00 — Dados da Escola" and "Registro 10 — Infraestrutura" tabs with error items

**Checkpoint**: Professional can validate school data and infrastructure, see errors with correction links.

## Phase 4: User Story 2 — Validar turmas contra regras INEP (Priority: P2)

**Goal**: Validate existing turmas (Registro 20) against INEP rules: schedule format, stage × organization form compatibility, areas offered, minimum professionals/students.

**Independent Test**: Have 3 turmas: one complete, one without professional, one with "09:03-10:00" schedule. Validate → errors for the latter two with links to `/gestao-turmas/turmas/[id]` and `/gestao-turmas/quadro-aulas/`.

### Implementation for User Story 2

- [X] T023 [US2] Implement validarRegistro20() in src/lib/actions/censo-regras.ts — validate schedule format (hh:mm-hh:mm, minutes multiple of 5, start < end), stage × organization form (Anexo 6 matrix), areas × stage compatibility, at least 1 professional and 1 student per class
- [X] T024 [US2] Add correction URL mapping for Registro 20 — turma fields → `/gestao-turmas/turmas/[id]`, missing professional → `/gestao-turmas/quadro-aulas/?turma=[id]`
- [X] T025 [US2] Wire validarRegistro20 into validarCenso(), populate ResultadoValidacao.registro20
- [X] T026 [US2] Wire US2 validation results into module page — render "Registro 20 — Turmas" tab

**Checkpoint**: Turmas validated with correction links to Gestão de Turmas and Quadro de Aulas.

## Phase 5: User Story 3 — Validar pessoas contra regras INEP (Priority: P3)

**Goal**: Validate existing people (Registro 30) with different profiles (student/professional/manager): CPF, age × role, name format, disability incompatibilities, resource × disability matrix, academic training requirements.

**Independent Test**: Create 3 people: manager age 17, student with "Blindness" + "Libras Translator", professional without CPF. Validate → 3 errors reported with links to `/gestao-usuarios/usuarios/[id]`.

### Implementation for User Story 3

- [X] T027 [US3] Implement validarRegistro30() in src/lib/actions/censo-regras.ts — validate all 110 fields: CPF (conditional obligation, format, RF status), name (≥2 words, ≤4 repeated chars), age × role (Anexo 3: manager 18-95, professional 14-95, student per stage), disability incompatibilities (10 rules), deficiency × resource matrix (Anexo 4: 126 combos), resource × disorder matrix (18 combos), academic training × professional/manager role
- [X] T028 [US3] Add correction URL mapping for Registro 30 — person fields → `/gestao-usuarios/usuarios/[id]?tab=...`
- [X] T029 [US3] Wire validarRegistro30 into validarCenso(), populate ResultadoValidacao.registro30
- [X] T030 [US3] Wire US3 validation results into module page — render "Registro 30 — Pessoas" tab

**Checkpoint**: People validated with correction links to Gestão de Usuários, tabs for specific sections (deficiencies, formation).

## Phase 6: User Story 4 — Validar vínculos de gestores, profissionais e matrículas (Priority: P4)

**Goal**: Validate existing links — managers (Registro 40, max 3), professionals per class (Registro 50, function compatibility, areas subset), enrollments (Registro 60, age × stage, AEE, transport).

**Independent Test**: Have an EAD class with "Auxiliar" linked and a 10-year-old student in EJA Ensino Médio. Validate → both errors with links to Quadro de Aulas and Matrículas.

### Implementation for User Story 4

- [X] T031 [US4] Implement validarRegistro40() in src/lib/actions/censo-regras.ts — validate managers: max 3 per school, access criteria × dependency (owner only for private, public exam only for public)
- [X] T032 [US4] Implement validarRegistro50() in src/lib/actions/censo-regras.ts — validate professional × class: function × mediation type (7 rules), function × class type, areas subset of class offering, sequentiality (no gaps), itinerary areas conditional to FGB+IFA
- [X] T033 [US4] Implement validarRegistro60() in src/lib/actions/censo-regras.ts — validate enrollments: turma_multi × class stage (6 mappings), age × stage (Anexo 3: 35+ combos), AEE required for AEE classes (11 types, ≥1), transport conditional (Brasil residency + in-person/semi), vehicles (≥1, not all)
- [X] T034 [US4] Add correction URL mappings for Registros 40/50/60 — manager → `/escolas/[id]?tab=gestores`, professional → `/gestao-turmas/quadro-aulas/?turma=[id]`, enrollment → `/gestao-academica/matriculas/?turma=[id]`
- [X] T035 [US4] Wire validarRegistro40, validarRegistro50, validarRegistro60 into validarCenso(), populate respective ResultadoValidacao fields
- [X] T036 [US4] Wire US4 validation results into module page — render remaining tabs (Registros 40, 50, 60)

**Checkpoint**: All vínculos validated with correction links to their respective management screens.

## Phase 7: User Story 5 — Exportar arquivo .txt validado (Priority: P5)

**Goal**: When all errors are resolved, "Exportar" button generates ISO-8859-1 .txt file with correct structure and triggers download.

**Independent Test**: Fix all errors until 0 remaining. Click "Exportar" → download .txt file. Verify encoding, structure, terminator.

### Implementation for User Story 5

- [X] T037 [US5] Implement exportarCenso() in src/lib/actions/censo.ts — re-validate, if 0 errors generate .txt: mount lines per register in correct order (00→10→20→30→40→50→60), pipe-delimited, ISO-8859-1 encoding, uppercase, no accents, 99| terminator, handle paralyzed/extinct schools (only 00, 30, 40)
- [X] T038 [US5] Implement file naming in src/lib/actions/censo.ts — generate valid filename (max 20 chars, letters/numbers/underscore, no spaces)
- [X] T039 [US5] Wire exportarCenso into module page at src/app/(app)/(auth)/censo-escolar/page.tsx — "Exportar" button disabled while errors exist (tooltip: "Corrija todos os erros antes de exportar"), enabled when 0 errors, triggers download
- [X] T040 [US5] Add cross-register validations: student link max counts (4 schooling, 2 non-AEE, 4 AEE), person deduplication (Grupo 1 + Grupo 2 rules), overlapping schedules, identification hierarchy (INEP ID → CPF → Certidão Nova)

**Checkpoint**: Export generates valid .txt file ready for EducaCenso submission.

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Quality of life improvements and edge case handling.

- [X] T041 [P] Handle edge case: school without INEP code — show alert in validation, block export with clear message
- [X] T042 [P] Handle edge case: person with dual role (professional + student) — validate both independently, no duplicate Registro 30
- [X] T043 [P] Add loading state to module page during validation (skeleton/spinner)
- [X] T044 [P] Add "Validar novamente" button that clears and re-runs all validations
- [X] T045 Verify module page uses only Design Tokens (bg-card, text-foreground, border-border, text-success, text-destructive) — no hex colors
- [X] T046 Verify all forms and components use shadcn/ui primitives (Tabs, Button, Badge, Tooltip)
- [X] T047 Run quickstart.md validation scenarios and verify all pass
- [X] T048 Add recurso permission `censo-escolar` to perfis_permissoes if not already present

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories (fields must exist)
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (P1) → US2 (P2) → US3 (P3) → US4 (P4) → US5 (P5) in sequence
  - US4 depends on US1 (school data) + US2 (class data) + US3 (person data) for cross-validations
  - US5 depends on US4 for complete validation
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — No dependencies on other stories
- **US2 (P2)**: Can start after Foundational — Independent of US1 (uses turmas table)
- **US3 (P3)**: Can start after Foundational — Independent of US1/US2 (uses people table)
- **US4 (P4)**: DEPENDS on US1, US2, US3 — needs data from all three to validate links
- **US5 (P5)**: DEPENDS on US4 — needs complete validation before export

### Within Each User Story

- Validation functions before wiring into validarCenso()
- Wiring validarCenso() before wiring module page tab
- Correction URL helper before validation functions

### Parallel Opportunities

- T001-T006: All reference data matrices (6 files, no dependencies) — run together
- T009-T011: All UI components (3 files, no dependencies) — run together
- T012-T016: All migration SQL files (5 files, separate tables) — run together
- T018 + T023 + T027: Validation functions US1/US2/US3 can start in parallel after Foundational
- T041-T044: Polish tasks (different concerns, no dependencies) — run together

---

## Parallel Example: Setup Phase

```bash
# Launch all reference data tasks together:
Task: "Create reference data matrices in src/data/censo/idades-permitidas.ts"
Task: "Create reference data matrices in src/data/censo/recursos-deficiencias.ts"
Task: "Create reference data matrices in src/data/censo/contratacao-dependencia.ts"
Task: "Create reference data matrices in src/data/censo/etapas-formas-organizacao.ts"
Task: "Create reference data in src/data/censo/etapas-ensino.ts"
Task: "Create reference data in src/data/censo/areas-conhecimento.ts"

# Launch all UI components together:
Task: "Create validation summary component at src/components/censo/validacao-resumo.tsx"
Task: "Create error item component at src/components/censo/validacao-erro-item.tsx"
Task: "Create tab component at src/components/censo/validacao-aba.tsx"
```

## Parallel Example: Foundational Phase

```bash
# Launch all migrations together:
Task: "Create migration SQL to add ~200 INEP fields to schools table"
Task: "Create migration SQL to add ~20 INEP fields to people table"
Task: "Create migration SQL to add ~10 INEP fields to turmas table"
Task: "Create migration SQL to add ~15 INEP fields to academico_matriculas table"
Task: "Create migration SQL to add INEP fields to turmas_profissionais table"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (reference data + module shell)
2. Complete Phase 2: Foundational (migrations)
3. Complete Phase 3: User Story 1 (validate school + infrastructure)
4. **STOP and VALIDATE**: Test US1 independently — validate school data, see errors, click correction links
5. Demo: school data validated against INEP rules

### Incremental Delivery

1. Setup + Foundational → INEP fields available everywhere
2. Add US1 → School data validated → Demo (MVP!)
3. Add US2 → Classes validated → Demo
4. Add US3 → People validated → Demo
5. Add US4 → Links validated → Demo
6. Add US5 → Export .txt → Demo (complete!)
7. Polish → Production ready

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Migration SQL files (T012-T016) must be idempotent (IF NOT EXISTS / ALTER TABLE IF NOT EXISTS patterns)
- Correction URLs follow the pattern: screen path + entity ID + tab/field query params
- All server actions use `'use server'` + `getSupabaseAdmin()` per constitution principle I
- Reference data matrices (T001-T006) are loaded server-side during validation, not bundled to client
- Module page is a client component (needs useState for tabs, validation result state)

---

**Status**: All 48 tasks completed. Implementation done on 2026-06-09.
