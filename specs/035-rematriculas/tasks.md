# Tasks: Tela de Rematrículas

**Input**: Design documents from `/specs/035-rematriculas/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Tests**: Não solicitados na spec; validação via `tsc` + `build` + `quickstart.md` (T015–T018).
**Organization**: Tasks grouped by user story (US1–US4 da spec).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Migration de permissão + scaffolds vazios

- [X] T001 Create permission seed migration in supabase-migrations/patch_recursos_rematriculas.sql (recurso `gestao-academica.rematriculas`, formato de patch_recursos_documentos.sql; aplicar via SQL Editor)
- [X] T002 [P] Scaffold server action module in src/lib/actions/rematriculas.ts (`'use server'`, imports, stub exports `listarAlunosElegiveis` + `rematricularLote`)
- [X] T003 [P] Scaffold page and components in src/app/(app)/gestao-academica/rematriculas/page.tsx, src/components/rematriculas/rematriculas-client.tsx, src/components/rematriculas/origem-destino-card.tsx, src/components/rematriculas/alunos-rematricula-list.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Navegação + rota existente antes de qualquer user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Register sidebar submenu entry with icon import in src/components/layout/sidebar.tsx (`{ title: 'Rematrículas', href: '/gestao-academica/rematriculas', recurso: 'gestao-academica.rematriculas' }` no submenu Gestão Acadêmica)
- [X] T005 Register tab module in src/lib/tab-routes.tsx (import da page + `TAB_MODULES.rematriculas` + `MODULES` meta + `ROUTES` entry `exact('/gestao-academica/rematriculas')`)

**Checkpoint**: Rota acessível no sidebar e no tab-system — user stories podem começar

---

## Phase 3: User Story 1 - Origem e destino com consistência (Priority: P1)

**Goal**: Card Origem e Destino funcional — anos travados, etapa/turma/situação de origem, destino habilitado após situação, combinação inválida Situação × Etapa bloqueada com explicação, data sem futuro

**Independent Test**: Abrir a tela, conferir anos travados (último encerrado / ativo), selecionar origem, verificar destino habilitando após situação e combinações inválidas bloqueadas (spec US1 cenários 1–7)

### Implementation for User Story 1

- [X] T006 [US1] Implement client shell with schoolId, visualizar guard and PageHeader in src/components/rematriculas/rematriculas-client.tsx (padrão rendimento-page-client: `useAuth` + `usePermissoes`, `EmptyState` ShieldAlert sem permissão, estados de carregamento)
- [X] T007 [P] [US1] Implement origem-destino-card.tsx in src/components/rematriculas/origem-destino-card.tsx (subcards Origem/Destino; anos travados via `getAnosLetivos` + filtro `status`; etapas via `getEtapasEnsino`; turmas via `getTurmasAtivas`; 5 situações do filtro; Aprovado exclui etapa origem do destino / Reprovado trava destino na origem; data ≤ hoje; `EmptyState` para sem ano encerrado/ativo e etapa sem turmas)
- [X] T008 [US1] Wire thin page and card state in src/app/(app)/gestao-academica/rematriculas/page.tsx and src/components/rematriculas/rematriculas-client.tsx (page fina padrão rendimento; client mantém estado origem/destino e renderiza o card; depende de T006, T007)

**Checkpoint**: US1 testável independente — configuração origem/destino válida e inválida tratada, sem listagem ainda

---

## Phase 4: User Story 2 - Seleção de alunos e destino individual (Priority: P1)

**Goal**: Listagem de elegíveis com checkbox, Selecionar Todos/Limpar, nome+CPF, turma de destino por aluno, lixeira, aviso de já-matriculados, estado vazio

**Independent Test**: Com origem+destino válidos, conferir lista (só situação filtrada, sem transferidos), todos/limpar, troca de turma individual, remoção pela lixeira (spec US2 cenários 1–5)

### Implementation for User Story 2

- [X] T009 [US2] Implement listarAlunosElegiveis per contracts/rematriculas-actions.md in src/lib/actions/rematriculas.ts (matrículas ativas da turma origem na situação filtrada + join people; exclui com matrícula ativa no ano destino; retorna `{ alunos, jaMatriculados }`)
- [X] T010 [P] [US2] Implement alunos-rematricula-list.tsx in src/components/rematriculas/alunos-rematricula-list.tsx (`<ul>` cards `block md:hidden` + `<Table>` `hidden md:block`; checkbox ≥44px; Selecionar Todos/Limpar; Select de turma da mesma etapa; lixeira remove da lista sem excluir dados; `EmptyState` sem elegíveis)
- [X] T011 [US2] Integrate listagem into client in src/components/rematriculas/rematriculas-client.tsx (carrega ao validar origem+destino; aviso "N já possuem matrícula no novo ano"; seleção + destinos individuais no estado; depende de T009, T010)

**Checkpoint**: US1 + US2 funcionais — seleção completa pronta para salvar

---

## Phase 5: User Story 3 - Salvar rematrícula com confirmação (Priority: P1)

**Goal**: Botão Salvar Rematrícula no rodapé cria as matrículas via `createMatricula` por aluno, com anti-duplo-clique, confirmação com contagem e falhas discriminadas por aluno

**Independent Test**: Selecionar alunos, salvar, conferir toast de contagem + novos vínculos em Alunos Matriculados; violação da Regra Geral vira falha por aluno sem bloquear os demais (spec US3 cenários 1–5)

### Implementation for User Story 3

- [X] T012 [US3] Implement rematricularLote per contracts/rematriculas-actions.md in src/lib/actions/rematriculas.ts (`validarPermissaoServer` criar + escopo escola; revalida data ≤ hoje e Situação × Etapa por item; turma destino na etapa/ano; `createMatricula` por item com erro capturado → `{ criados, falhas, jaMatriculados }`)
- [X] T013 [US3] Add sticky footer Salvar with processing state and result feedback in src/components/rematriculas/rematriculas-client.tsx (botão principal `h-11`, desabilitado sem seleção/processando; toast de confirmação; lista de falhas com motivo + próximo passo; depende de T012)

**Checkpoint**: Fluxo P1 completo (US1→US2→US3) entregando rematrículas reais

---

## Phase 6: User Story 4 - Superadmin escolhe Unidade Escolar (Priority: P2)

**Goal**: Seletor de Unidade Escolar para Superadmin recarregando origem/destino/lista

**Independent Test**: Como Superadmin, trocar de escola e conferir recarga + limpeza de seleção incompatível (spec US4 cenários 1–2)

### Implementation for User Story 4

- [X] T014 [US4] Add superadmin school selector with escolaOperacional in src/components/rematriculas/rematriculas-client.tsx (fórmula R-11 + auto-select com 1 escola + `PageSection(compact, title="Unidade Escolar")` só para superadmin; depende de T008, T011, T013)

**Checkpoint**: Todas as user stories funcionais

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validação final e conformidade visual

- [X] T015 [P] Run npx tsc --noEmit and fix type errors (repo root)
- [X] T016 Run npx next build and fix failures (repo root; após T015)
- [X] T017 [P] Execute quickstart.md scenarios 1–5 in specs/035-rematriculas/quickstart.md and fix findings (incl. SC-001 <5min e SC-006 360px)
- [X] T018 [P] Mobile 360px without horizontal scroll plus dark-mode visual check in src/components/rematriculas/ (cards, subcards empilhados, toques ≥44px, só tokens)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Depends on **US1** (precisa do estado origem/destino válido para carregar a lista)
- **User Story 3 (P1)**: Depends on **US2** (precisa da seleção + destinos individuais)
- **User Story 4 (P2)**: Depends on **US1–US3** (altera o client que as integra)
- ⚠️ Cadeia sequencial US1→US2→US3→US4: as stories NÃO são paralelizáveis entre si (mesmo fluxo, estado compartilhado); paralelismo existe apenas dentro de cada story (tarefas [P] em arquivos distintos)

### Within Each User Story

- Action server antes da integração no client (T009→T011, T012→T013)
- Componente visual [P] em paralelo com a action (T006+T007, T009+T010)
- Story completa antes de passar à próxima prioridade

### Parallel Opportunities

- T002 + T003 (scaffolds em arquivos distintos)
- T004 + T005 (sidebar vs tab-routes)
- T006 + T007 (client shell vs card)
- T009 + T010 (action vs lista)
- T015 + T017 + T018 (validações independentes); T016 após T015

---

## Parallel Example: User Story 2

```bash
# Launch action + list component together (different files):
Task: "Implement listarAlunosElegiveis per contracts/rematriculas-actions.md in src/lib/actions/rematriculas.ts"
Task: "Implement alunos-rematricula-list.tsx in src/components/rematriculas/alunos-rematricula-list.tsx"

# Then integrate (depends on both):
Task: "Integrate listagem into client in src/components/rematriculas/rematriculas-client.tsx"
```

---

## Implementation Strategy

### MVP (cadeia P1: US1 → US2 → US3)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T005)
3. Complete US1 (T006–T008) → **STOP and VALIDATE** configuração
4. Complete US2 (T009–T011) → **STOP and VALIDATE** seleção
5. Complete US3 (T012–T013) → **STOP and VALIDATE** salvamento real (MVP!)
6. Deploy/demo se pronto

MVP = US1+US2+US3 (fluxo ponta-a-ponta). US1 isolada só configura; US4 (superadmin) e Polish vêm depois.

### Incremental Delivery

1. Setup + Foundational → rota navegável
2. + US1 → origem/destino validados (demo de regra anti-erro)
3. + US2 → seleção com exceções (demo operacional)
4. + US3 → rematrículas reais (MVP!)
5. + US4 → multi-escola → Polish → `tsc` + `build` verdes

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Reuso obrigatório: `createMatricula`, `getAnosLetivos`, `getEtapasEnsino`, `getTurmasAtivas`, `SITUACOES` de `src/lib/situacoes-matricula.ts`, fórmula `escolaOperacional`
- Migration T001 aplica-se via SQL Editor (sem CLI Supabase)
- Commit após cada task ou grupo lógico
