# Tasks: Design System — Padronização Global de UI/UX

**Input**: Design documents from `specs/002-design-system/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Core Components)

**Purpose**: Create and enhance all 8 official Design System components. These are prerequisites for every user story.

- [X] T001 [P] Create PageContainer component in src/components/layout/page-container.tsx — wraps `container mx-auto py-8 px-4` with optional `maxWidth` prop ("default" | "dashboard")
- [X] T002 [P] Enhance PageHeader component in src/components/layout/page-header.tsx — add `breadcrumbs` prop (BreadcrumbItem[] with label, href?, icon?) rendering nav with links and non-clickable current item
- [X] T003 [P] Enhance PageSection component in src/components/layout/page-section.tsx — add `variant` prop ("default" | "flush" | "compact") with flush (no body padding, for tables) and compact (reduced padding, for filter bars)
- [X] T004 [P] Create FilterBar component in src/components/layout/filter-bar.tsx — accepts searchValue, onSearchChange, searchPlaceholder, children; renders SearchInput + children in flex row
- [X] T005 [P] Create SearchInput component in src/components/layout/search-input.tsx — accepts value, onChange, placeholder, className, debounceMs; renders Input with Search icon
- [X] T006 [P] Create FormCard component in src/components/layout/form-card.tsx — wraps Card + CardHeader + CardContent with title, description, children, className props; content area uses `space-y-4`
- [X] T007 [P] Create StatusBadge component in src/components/feedback/status-badge.tsx — accepts status ("success" | "warning" | "destructive" | "info" | "primary" | "muted"), children, className; maps status to token classes (bg-status/10 text-status border-status/20); wraps Badge component
- [X] T008 [P] Create ConfirmDialog component in src/components/feedback/confirm-dialog.tsx — wraps AlertDialog with title, description, confirmLabel, cancelLabel, variant ("destructive" | "warning"), onConfirm, loading props; uses Button variants for actions
- [X] T009 Create feedback components barrel export in src/components/feedback/index.ts — export StatusBadge and ConfirmDialog
- [X] T010 Create SearchInput barrel export in src/components/layout/index.ts — export PageContainer, PageHeader, PageSection, FilterBar, SearchInput, FormCard (re-export from existing page-header.tsx and page-section.tsx)
- [X] T011 Verify all 8 components render correctly in Light Mode and Dark Mode by creating a temporary demo page in src/app/(app)/(auth)/design-system-demo/page.tsx that exercises all components and variants, then verify `npx next build` passes

**Checkpoint**: All core components implemented. Each component uses only Design Tokens, wraps shadcn/ui primitives, and renders correctly in both themes.

---

## Phase 2: Foundational (Catalog & Anti-Pattern Documentation)

**Purpose**: Create the canonical component catalog that serves as reference for US1 and US4. This MUST be complete before any migration begins.

- [X] T012 Create component catalog in specs/002-design-system/catalog.md — document all official components with props, variants, usage examples, composition rules, and anti-patterns registry (this file already exists as stub, fill with final content including real examples from the created components)
- [X] T013 Update AGENTS.md UI & Design System section — replace the current "UI & Design System" rules section with a concise reference to the Design System catalog: official components list, layout composition rules, anti-pattern prohibitions, and link to specs/002-design-system/catalog.md

**Checkpoint**: Catalog is documented. A developer can consult it to know which components exist and how to compose pages.

---

## Phase 3: User Story 1 — Desenvolvedor cria nova página utilizando apenas componentes oficiais (Priority: P1) 🎯 MVP

**Goal**: Verify that a developer can create a complete list page using only official Design System components (PageContainer, PageHeader, FilterBar, PageSection, Table, EmptyState, StatusBadge) without writing custom styles.

**Independent Test**: Create a test page that combines all layout components into a standard list page. Verify: (1) no custom CSS classes needed, (2) visually consistent with existing pages, (3) no hardcoded colors, `shadow-[rgba]`, `text-white` on buttons, or `<button>` native elements in the new page code.

### Implementation for User Story 1

- [X] T014 [US1] Create reference list page in src/app/(app)/(auth)/design-system-demo/list-page.tsx — a complete list page using only PageContainer, PageHeader, FilterBar, SearchInput, PageSection(variant="flush"), Table shadcn, StatusBadge, EmptyState, and DropdownMenu; no custom styles allowed
- [X] T015 [US1] Create reference form page in src/app/(app)/(auth)/design-system-demo/form-page.tsx — a complete form page using PageContainer, PageHeader (with breadcrumbs), FormCard, Input, Select, Textarea, Button, and ConfirmDialog; no custom styles allowed
- [X] T016 [US1] Create reference detail page in src/app/(app)/(auth)/design-system-demo/detail-page.tsx — a complete detail/view page using PageContainer, PageHeader, PageSection, and Cards; no custom styles allowed
- [X] T017 [US1] Create reference dashboard page in src/app/(app)/(auth)/design-system-demo/dashboard-page.tsx — a complete dashboard using PageContainer(maxWidth="dashboard"), PageHeader, StatCard, and PageSection; no custom styles allowed
- [X] T018 [US1] Update demo page in src/app/(app)/(auth)/design-system-demo/page.tsx to link to all reference pages (list, form, detail, dashboard) with navigation

**Checkpoint**: All 4 reference pages render correctly in Light Mode and Dark Mode. No anti-patterns in the code. Developer can create a new page in <30 minutes using only the catalog.

---

## Phase 4: User Story 3 (Group 1) — Dashboard + Módulos Administrativos (Priority: P3 partial)

**Goal**: Migrate dashboard, escolas, gestão de usuários (usuarios, perfis, funções, painel-aluno), and login pages to use only official Design System components. This delivers visible consistency (US2) for these modules.

**Independent Test**: Navigate through all pages in this group. Verify: (1) all use PageHeader instead of manual headings, (2) all use PageSection or Card instead of card-glass, (3) no `text-white` on buttons, (4) no `shadow-[rgba]`, (5) no native `<button>` for primary actions, (6) Dark Mode works correctly.

### Implementation for Group 1

- [X] T019 [P] [US3] Migrate Dashboard page in src/app/(app)/(auth)/page.tsx — replace `container mx-auto py-8 px-4 max-w-6xl` with PageContainer(maxWidth="dashboard"), verify PageHeader and StatCard usage, ensure no anti-patterns remain
- [X] T020 [P] [US3] Migrate Escolas listing page in src/app/(app)/escolas/page.tsx — replace container with PageContainer, heading with PageHeader, card-glass with Card, shadow-lg shadow-blue-500/20 with shadow-sm, text-white with text-primary-foreground on buttons, native heading patterns eliminated
- [X] T021 [P] [US3] Migrate Escolas detail page in src/app/(app)/escolas/[id]/page.tsx — replace container with PageContainer, manual heading with PageHeader (with breadcrumbs), card sections with PageSection
- [X] T022 [P] [US3] Migrate Escolas create page in src/app/(app)/escolas/novo/page.tsx — replace container with PageContainer, form sections with FormCard
- [X] T023 [US3] Migrate Usuários listing page in src/app/(app)/gestao-usuarios/usuarios/page.tsx — replace container with PageContainer, heading with PageHeader, search with SearchInput, filter+action bar with FilterBar inside PageSection(compact), card/shadow-[rgba] with PageSection, badge colors with StatusBadge, confirm patterns with ConfirmDialog
- [X] T024 [P] [US3] Migrate Usuários form component in src/app/(app)/gestao-usuarios/usuarios/PessoaForm.tsx — replace form sections with FormCard, border-border shadow-[rgba] patterns with Card, native buttons with Button shadcn
- [X] T025 [P] [US3] Migrate Perfis listing page in src/app/(app)/gestao-usuarios/perfis/page.tsx — replace container with PageContainer, heading with PageHeader, filter bar with FilterBar, badge colors with StatusBadge
- [X] T026 [P] [US3] Migrate Perfis detail page in src/app/(app)/gestao-usuarios/perfis/[id]/page.tsx — replace container with PageContainer, heading with PageHeader (with breadcrumbs), sections with PageSection
- [X] T027 [P] [US3] Migrate Perfis components (PerfilFiltros, PerfilGrid, PerfilForm, MatrizPermissoes) in src/components/perfis/ — replace shadow-[rgba] with PageSection/Card, hardcoded badge colors with StatusBadge, native buttons with Button
- [X] T028 [P] [US3] Migrate Funções listing page in src/app/(app)/gestao-usuarios/funcoes/page.tsx — replace container with PageContainer, heading with PageHeader, filter bar with FilterBar, confirm with ConfirmDialog
- [X] T029 [P] [US3] Migrate Painel do Aluno page in src/app/(app)/gestao-usuarios/painel-aluno/page.tsx — replace container with PageContainer, heading with PageHeader, card patterns with Card/PageSection
- [X] T030 [P] [US3] Migrate Painel do Aluno components in src/components/painel-pessoa/ — replace card patterns with Card, hardcoded colors with tokens, StatusBadge where applicable

**Checkpoint**: All Group 1 pages use official components. No anti-patterns remain in these modules. Dark Mode works correctly.

---

## Phase 5: User Story 3 (Group 2) — Módulos de Turmas e Acadêmicos

**Goal**: Migrate gestão de turmas (turmas, quadro-aulas) and gestão acadêmica (matrículas, métodos, estrutura acadêmica) pages.

**Independent Test**: Navigate through all pages in this group. Verify same anti-pattern elimination as Group 1.

### Implementation for Group 2

- [X] T031 [P] [US3] Migrate Turmas listing page in src/app/(app)/gestao-turmas/turmas/page.tsx — replace container with PageContainer, heading with PageHeader, filter bar with FilterBar, shadow-[rgba] with PageSection, native <button> status toggles with Button variant="ghost", text-white with text-primary-foreground, card-glass with Card
- [X] T032 [P] [US3] Migrate Quadro de Aulas listing page in src/app/(app)/gestao-turmas/quadro-aulas/page.tsx — replace container with PageContainer, heading with PageHeader, card-glass with PageSection, shadow patterns with proper tokens
- [X] T033 [P] [US3] Migrate Quadro de Aulas create page in src/app/(app)/gestao-turmas/quadro-aulas/cadastro/page.tsx — replace container with PageContainer, heading with PageHeader (with breadcrumbs), form sections with FormCard
- [X] T034 [P] [US3] Migrate Matrículas listing page in src/app/(app)/gestao-academica/matriculas/page.tsx — replace container with PageContainer, heading with PageHeader, filter bar with FilterBar, hardcoded badge colors with StatusBadge, shadow-[rgba] with PageSection
- [X] T035 [P] [US3] Migrate Matrículas create page in src/app/(app)/gestao-academica/matriculas/cadastro/page.tsx — replace container with PageContainer, form sections with FormCard, hardcoded button styles with Button default
- [X] T036 [P] [US3] Migrate Matrículas cadastro content component in src/app/(app)/gestao-academica/matriculas/cadastro/content.tsx — replace border-border patterns with FormCard, text-white with text-primary-foreground, native buttons with Button
- [X] T037 [P] [US3] Migrate Métodos listing page in src/app/(app)/gestao-academica/metodos/page.tsx — replace container with PageContainer, heading with PageHeader, filter bar with FilterBar
- [X] T038 [P] [US3] Migrate Métodos form component (MetodosForm) in src/app/(app)/gestao-academica/metodos/MetodosForm.tsx — replace shadow-[rgba] section patterns with FormCard, hardcoded button styles with Button, bg-muted/text patterns with proper tokens
- [X] T039 [P] [US3] Migrate Estrutura Acadêmica page in src/app/(app)/gestao-academica/estrutura-academica/page.tsx — replace container with PageContainer
- [X] T040 [P] [US3] Migrate Estrutura Acadêmica tab components (TabEtapas, TabCalendarios, TabMatrizes, MatrizForm) in src/app/(app)/gestao-academica/estrutura-academica/ — replace shadow-[rgba] patterns with FormCard, native buttons with Button, text-white with tokens, bg-muted patterns with proper tokens

**Checkpoint**: All Group 2 pages use official components. Modules de Turmas e Acadêmico have consistent UI.

---

## Phase 6: User Story 3 (Group 3) — Módulos Pedagógicos, BNCC e Censo

**Goal**: Migrate gestão pedagógica (indicadores, disciplinas, diário de classe, plano de ensino, conselho de classe), BNCC, and censo escolar pages.

**Independent Test**: Navigate through all pages in this group. Verify same anti-pattern elimination. Special attention to Disciplinas page (most divergent).

### Implementation for Group 3

- [X] T041 [P] [US3] Migrate Indicadores listing page in src/app/(app)/gestao-pedagogica/indicadores/page.tsx — replace container with PageContainer, heading with PageHeader, filter bar with FilterBar, shadow-[rgba] with PageSection, hardcoded button styles with Button default
- [X] T042 [P] [US3] Migrate Disciplinas page in src/app/(app)/gestao-pedagogica/disciplinas/page.tsx — COMPLETE REWRITE: replace ml-64 layout with PageContainer, native <table> with Table shadcn, native <button> with Button, text-primary heading with PageHeader, border-2 with border, text-foreground/80 with text-muted-foreground, bg-card with Card/PageSection
- [X] T043 [P] [US3] Migrate Diário de Classe listing page in src/app/(app)/gestao-pedagogica/diario-classe/page.tsx — replace container with PageContainer, heading with PageHeader
- [X] T044 [P] [US3] Migrate Diário de Classe detail page in src/app/(app)/gestao-pedagogica/diario-classe/[turmaId]/page.tsx — replace container with PageContainer, heading with PageHeader, tab patterns
- [X] T045 [P] [US3] Migrate Diário de Classe components in src/components/diario-classe/ — replace native <button> elements with Button variant="ghost", shadow-[2px_0_4px] sticky patterns with tokens, hardcoded patterns with Design System components
- [X] T046 [P] [US3] Migrate Plano de Ensino listing page in src/app/(app)/gestao-pedagogica/plano-ensino/page.tsx — replace container with PageContainer, heading with PageHeader, filter bar with FilterBar
- [X] T047 [P] [US3] Migrate Plano de Ensino create page in src/app/(app)/gestao-pedagogica/plano-ensino/criar/page.tsx — replace form sections with FormCard, container with PageContainer, heading with PageHeader (with breadcrumbs)
- [X] T048 [P] [US3] Migrate Plano de Ensino detail page in src/app/(app)/gestao-pedagogica/plano-ensino/[id]/page.tsx — replace container with PageContainer, sections with PageSection
- [X] T049 [P] [US3] Migrate Conselho de Classe pages in src/app/(app)/gestao-pedagogica/conselho-classe/ — replace container with PageContainer, heading with PageHeader, table patterns with Table shadcn
- [X] T050 [P] [US3] Migrate Conselho de Classe components in src/components/conselho-classe/ — replace native buttons, hardcoded styles with Design System components
- [X] T051 [P] [US3] Migrate BNCC pages in src/app/(app)/bncc/ — replace container with PageContainer for all BNCC sub-pages, heading with PageHeader, card-glass with Card/PageSection, text-white with text-primary-foreground, gradient from-[#1D3557] patterns with from-primary tokens
- [X] T052 [P] [US3] Migrate Censo Escolar page in src/app/(app)/(auth)/censo-escolar/page.tsx — replace container with PageContainer (if not already using it), verify all components follow Design System
- [X] T053 [P] [US3] Migrate Censo Escolar components in src/components/censo/ — verify all use Design System components, replace any remaining anti-patterns

**Checkpoint**: All Group 3 pages use official components. Disciplinas page fully rewritten. No divergent layouts remain.

---

## Phase 7: User Story 4 — Catálogo de componentes serve como referência para futuras implementações (Priority: P4)

**Goal**: Finalize the component catalog with real examples extracted from migrated code, ensuring it serves as a complete and authoritative reference.

**Independent Test**: A developer who has never worked on the system can create a complete list page by consulting only the catalog, without looking at source code.

### Implementation for User Story 4

- [X] T054 [US4] Finalize catalog in specs/002-design-system/catalog.md — update with real code examples extracted from the migrated reference pages, add all component props tables (copy from contracts/), add composition diagram for each layout type, add anti-pattern registry with before/after examples from actual migrated code
- [X] T055 [US4] Update AGENTS.md with final Design System rules — ensure the UI & Design System section in AGENTS.md has: (1) complete list of official components with file paths, (2) composition rules for each layout type, (3) anti-pattern prohibitions with before/after examples, (4) link to specs/002-design-system/catalog.md as canonical reference

**Checkpoint**: Catalog is complete, authoritative, and usable by a new developer or AI agent to create pages without custom styles.

---

## Phase 8: User Story 5 + Polish — Dark Mode Verification & Cleanup

**Goal**: Verify Dark Mode across all pages, remove legacy CSS, run final build verification.

**Independent Test**: Toggle Dark Mode ON and navigate every module. Verify WCAG AA contrast on all text, all badges maintain semantic meaning, all sticky columns have correct backgrounds, no invisible elements. Then run `npx next build` and verify no errors.

### Implementation for US5 + Polish

- [X] T056 [US5] Audit all migrated pages for Dark Mode contrast — systematically check each module group: (1) all text has adequate contrast against its background, (2) all interactive elements (buttons, inputs, selects) are visible, (3) all badges maintain semantic meaning in both modes, (4) all sticky table columns have correct background in both modes, (5) all form sections and cards have visible borders
- [X] T057 [US5] Fix any Dark Mode contrast issues found in audit — adjust token usage, add missing dark mode styles, ensure no hardcoded colors remain
- [X] T058 Remove `card-glass` CSS class from src/app/globals.css — delete the `.card-glass` and `.card-glass:hover` rule blocks; verify no remaining references to `card-glass` in any component file (should be 0 after all migrations)
- [X] T059 Remove Design System demo pages — delete src/app/(app)/(auth)/design-system-demo/ directory (temporary reference pages no longer needed in production)
- [X] T060 Run `npx next build` and verify zero build errors — ensure all component imports resolve, all TypeScript types are correct, no unused imports remain
- [X] T061 Run anti-pattern audit across all tsx files — search for remaining instances of: `text-white` (in button contexts), `shadow-[`, `card-glass`, `bg-white`, `text-gray-`, `border-slate-`, `<button` (native, not shadcn), `<table` (native, not shadcn). Each instance should be either eliminated or documented as an exception per constitution rules

**Checkpoint**: Dark Mode works consistently. `card-glass` removed from CSS. Build passes. Zero anti-patterns remaining (or documented exceptions).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion (components must exist to document them)
- **Phase 3 (US1)**: Depends on Phase 2 (catalog must exist for developer reference)
- **Phase 4 (US3 Group 1)**: Depends on Phase 1 (components must exist to migrate to). Can start after Phase 1.
- **Phase 5 (US3 Group 2)**: Depends on Phase 1. Can start after Phase 4 or in parallel if team capacity allows.
- **Phase 6 (US3 Group 3)**: Depends on Phase 1. Can start after Phase 5 or in parallel.
- **Phase 7 (US4)**: Depends on Phase 3 + Phase 6 (catalog needs real examples from migrated code)
- **Phase 8 (US5 + Polish)**: Depends on Phase 6 (all pages must be migrated before Dark Mode audit)

### User Story Dependencies

- **US1 (P1)**: Components + Catalog → Reference pages prove system works
- **US2 (P2)**: Delivered incrementally through US3 migration (Group 1 = first visible consistency)
- **US3 (P3)**: Depends on US1 (components) for migration targets
- **US4 (P4)**: Depends on US1 (components defined) + US3 (real code examples)
- **US5 (P5)**: Depends on US3 (all pages migrated) for full Dark Mode audit

### Within Each Phase

- Phase 1: All component creation tasks [P] can run in parallel
- Phase 3: All reference page tasks [P] can run in parallel
- Phase 4-6: Migration tasks within the same group can run in parallel if files don't overlap
- Phase 8: Audit must come before fix; fix before build verification

### Parallel Opportunities

- T001-T008 (all component creation) can run in parallel
- T014-T018 (all reference pages) can run in parallel
- T020-T022 (Escolas pages) can run in parallel
- T025-T030 (Usuários/Perfis/Funções/Painel pages) can run in parallel
- T031-T040 (Turmas/Acadêmico pages) can run in parallel
- T041-T053 (Pedagógico pages) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Create all 8 core components
2. Complete Phase 2: Document catalog
3. Complete Phase 3: Create reference pages
4. **STOP and VALIDATE**: Developer can create a page using only catalog + components in <30 minutes

### Incremental Delivery

1. Phase 1 + 2 + 3 → Components + Catalog + Reference pages (MVP!)
2. Phase 4 → Dashboard + Escolas + Usuários migrated (first visible consistency)
3. Phase 5 → Turmas + Acadêmico migrated
4. Phase 6 → Pedagógico + BNCC + Censo migrated (all pages done!)
5. Phase 7 → Catalog finalized with real examples
6. Phase 8 → Dark Mode verified, cleanup complete

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Migration tasks (T019-T053) can be done page-by-page; each completed page is independently verifiable
- The Disciplinas page (T042) requires a rewrite rather than a migration due to its completely divergent layout (ml-64, native elements)
- `card-glass` CSS removal (T058) MUST wait until all pages are migrated (T019-T053 complete)
- Demo pages (T059) are temporary and should be deleted before production deployment
- Anti-pattern audit (T061) is the final validation gate — zero instances means the Design System is fully adopted