# Tasks: Dashboard — Visão Gerencial da Escola

**Input**: Design documents from `specs/003-dashboard/`

**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Nenhum framework de teste automatizado. Validação via build + inspeção visual.

**Organization**: Tasks grouped by implementation phase.

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Server Action + Types

**Purpose**: Criar a server action que alimenta todo o dashboard.

- [X] T001 [US1] Create `src/lib/actions/dashboard.ts` — server action `getDashboardData(schoolId)` that executes all 14 sub-queries via `Promise.all` and returns `DashboardData` type. Queries: docentes, turmas, alunos, matriculas, anoLetivo, calendario, alunosPorEtapa, alunosPorTipoTurma, alunosPorDeficiencia, alunosPorTranstorno, alunosPorModalidade, alunosPorTurno, ocupacao, frequenciaMedia, riscoEvasao, aniversariantes, turmasSemProfessor

---

## Phase 2: Chart Components

**Purpose**: Criar componentes Recharts reutilizáveis para cada gráfico do dashboard.

- [ ] T002 [P] [US3] Create `src/components/dashboard/alunos-por-etapa-chart.tsx` — Recharts BarChart horizontal com dados `{etapa, quantidade}[]`
- [ ] T003 [P] [US3] Create `src/components/dashboard/alunos-por-tipo-chart.tsx` — Recharts PieChart com dados `{tipo, quantidade}[]`
- [ ] T004 [P] [US3] Create `src/components/dashboard/alunos-por-deficiencia-chart.tsx` — Recharts BarChart horizontal com dados `{nome, quantidade}[]`
- [ ] T005 [P] [US3] Create `src/components/dashboard/alunos-por-transtorno-chart.tsx` — Recharts BarChart horizontal com dados `{nome, quantidade}[]`
- [ ] T006 [P] [US3] Create `src/components/dashboard/alunos-por-modalidade-chart.tsx` — Recharts PieChart com dados `{modalidade, quantidade}[]`
- [ ] T007 [P] [US3] Create `src/components/dashboard/alunos-por-turno-chart.tsx` — Recharts PieChart com dados `{turno, quantidade}[]`

---

## Phase 3: Info Cards + Lists

**Purpose**: Criar cards não-gráfico e listas.

- [ ] T008 [P] [US4] Create `src/components/dashboard/ocupacao-card.tsx` — Card com barra de progresso mostrando capacidadeTotal vs matriculasAtivas e percentual
- [ ] T009 [P] [US4] Create `src/components/dashboard/frequencia-media-card.tsx` — Card com donut/radial chart de presencas/total + percentual
- [ ] T010 [P] [US4] Create `src/components/dashboard/risco-evasao-table.tsx` — Tabela shadcn listando turmas com risco (nome, total alunos, alunos baixa frequencia, percentual faltas)
- [ ] T011 [P] [US2] Create `src/components/dashboard/calendario-card.tsx` — Card com grid do mês atual, células coloridas por tipo (dia_letivo/recesso), contagem dias cumpridos/total
- [ ] T012 [P] [US2] Create `src/components/dashboard/aniversariantes-list.tsx` — Lista de alunos aniversariantes do mês (nome, data formatada, turma)
- [ ] T013 [P] [US5] Create `src/components/dashboard/turmas-sem-professor-list.tsx` — Lista de alertas com turma e disciplinas sem professor

---

## Phase 4: Dashboard Page Rewrite

**Purpose**: Reescrever a página principal do dashboard integrando todos os componentes.

- [ ] T014 [US1] Rewrite `src/app/(app)/(auth)/page.tsx` — substituir dashboard atual pelo novo layout com: PageContainer + PageHeader (com ano letivo no título) + 4 StatCards + grid de gráficos e cards. Remover "Próximos Passos". Integrar `getDashboardData` com useEffect. Loading/error states.

---

## Phase 5: Build & Verify

- [ ] T015 Run `npx next build` — verify zero errors, all imports resolve
- [ ] T016 Manual verification — Light Mode e Dark Mode, responsividade, dados reais

---

## Dependencies & Execution Order

- Phase 1 (T001) → must complete first (all components depend on data)
- Phase 2 (T002-T007) → can run in parallel after T001
- Phase 3 (T008-T013) → can run in parallel after T001
- Phase 4 (T014) → depends on Phase 1 + Phase 2 + Phase 3
- Phase 5 (T015-T016) → after Phase 4

### Parallel Opportunities
- T002-T007 (all chart components) can run in parallel
- T008-T013 (all card/list components) can run in parallel
- Phase 2 and Phase 3 can run in parallel together
