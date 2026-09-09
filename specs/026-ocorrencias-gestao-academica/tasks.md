# Tasks: Ocorrências da Gestão Acadêmica

**Input**: Design documents from `/specs/026-ocorrencias-gestao-academica/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Não solicitados na spec — validação via roteiro manual `quickstart.md` (Phase 6) + `tsc` + `next build`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Monolito Next.js: `src/app/(app)/` (rotas), `src/lib/actions/` (server actions), `src/components/` (UI), `supabase-migrations/` (SQL)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Schema convergente + seed de permissão aplicados no banco

- [x] T001 Criar migration convergente em `supabase-migrations/ocorrencias_gestao.sql` (tabela canônica + `ocorrencias_alunos` + `ocorrencias_profissionais` + índices, tudo `IF NOT EXISTS` + `ADD COLUMN IF NOT EXISTS`, sem alterar schema legado)
- [x] T002 [P] Criar seed do recurso em `supabase-migrations/patch_recursos_ocorrencias.sql` (`gestao-academica.ocorrencias` / `Ocorrências` / `Gestão Acadêmica`, `ON CONFLICT DO NOTHING`)
- [ ] T003 Aplicar T001+T002 via SQL Editor e verificar tabelas, constraint `tipo (positiva,negativa)` e linha em `recursos` (depends on T001, T002)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Actions server-side + navegação + base de multi-select — tudo que as stories consomem

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implementar todas as Server Actions em `src/lib/actions/ocorrencias.ts` (`listarOcorrencias`, `getOcorrencia`, `criarOcorrencia`, `atualizarOcorrencia`, `excluirOcorrencia`, `listarProfissionaisSelecionaveis` + validação zod server-side + `validarPermissaoEstrita` + `registrarAuditoria` + escopo `school_id`)
- [x] T005 [P] Registrar item Ocorrências no submenu Gestão Acadêmica em `src/components/layout/sidebar.tsx` (com `recurso: 'gestao-academica.ocorrencias'`)
- [x] T006 [P] Registrar módulo `ocorrencias` + rotas `exact('/ocorrencias')`, `exact('/ocorrencias/novo')` e `match(/^\/ocorrencias\/([^/]+)$/)` em `src/lib/tab-routes.tsx`
- [x] T007 [P] Criar base de multi-select com chips em `src/components/ocorrencias/multi-select-field.tsx` (Popover + Command + Badge com X individual + "Limpar tudo", sem nova dependência)
- [x] T008 Criar wrappers em `src/components/ocorrencias/profissionais-select-field.tsx` (opções síncronas) e `src/components/ocorrencias/alunos-select-field.tsx` (busca async ≥3 letras, debounce 300ms, props `multiple`/`maxSelecionados`) reutilizando `buscarPessoasMatriculadas` (depends on T007)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Listar e filtrar ocorrências (Priority: P1) 🎯 MVP

**Goal**: Profissional com permissão localiza ocorrências via filtros e minicards; Superadmin filtra por escola

**Independent Test**: Seed 2 ocorrências via SQL Editor (1 positiva com `apresentar_portal=true`, 1 negativa sem); abrir `/ocorrencias`, conferir minicards completos e aplicar cada filtro isoladamente (tipo, datas, profissional, aluno 3+ letras); sem permissão → `ShieldAlert`; superadmin sem escola → EmptyState sem dados

### Implementation for User Story 1

- [x] T009 [P] [US1] Criar minicard em `src/components/ocorrencias/ocorrencia-minicard.tsx` (ícone+badge `StatusBadge` por tipo, título, data, sinalização Portal, profissionais/alunos com quantidade+nomes, descrição 100 chars, Editar/Excluir com `podeEditar`/`podeExcluir`)
- [x] T010 [P] [US1] Criar card de filtros em `src/components/ocorrencias/ocorrencia-filtros.tsx` (Select escola p/ superadmin, 2 `Calendar captionLayout="dropdown"`, multi profissionais, busca aluno única, pills Todas/Positivas/Negativas, "Limpar filtros", validação dataInicial ≤ dataFinal)
- [x] T011 [US1] Criar listagem em `src/app/(app)/ocorrencias/page.tsx` (PageContainer/Header/Section, guard `usePermissoes`, `?escola=` superadmin, grid 1/2/3 + `Skeleton`, `Pagination` 10/pág, `EmptyState`s contextuais, botão "Nova Ocorrência" em `actions`, navegação p/ novo/editar) (depends on T009, T010)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Criar nova ocorrência (Priority: P1)

**Goal**: Profissional registra ocorrência completa e a vê na listagem

**Independent Test**: "Nova Ocorrência" → tela sem breadcrumbs, com Voltar, sem Excluir; salvar vazio e descrição 501 chars bloqueiam com mensagens por campo; cadastro válido (Negativa + Portal + 2 profissionais + 2 alunos, remover 1 chip pelo X) → toast + minicard com sinalização Portal; duplo clique em Salvar cria 1 registro

### Implementation for User Story 2

- [x] T012 [P] [US2] Criar formulário em `src/components/ocorrencias/ocorrencia-form.tsx` (3 FormCards: Identificação com `ClickablePill` tipo + toggle Portal + `Calendar dropdown`, Envolvidos com T007/T008, Relato com Textarea 500 + contador; react-hook-form + zod; footer sticky Salvar/Cancelar com anti-duplo-submit; suporta `initialData` p/ reuso na edição)
- [x] T013 [US2] Criar página de cadastro em `src/app/(app)/ocorrencias/novo/page.tsx` (sem breadcrumbs, Voltar, `?escola=` p/ superadmin, guard `pode.criar`, `criarOcorrencia` + toast + retorno à listagem) (depends on T012)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Editar e excluir ocorrência (Priority: P2)

**Goal**: Profissional corrige registros e remove erros com confirmação explícita

**Independent Test**: Editar → campos preenchidos + Voltar + Excluir; salvar alteração reflete no minicard (inclusive desmarcar Portal); excluir pelo minicard e pela edição sempre abre `ConfirmDialog`; cancelar nada altera; confirmar remove + toast; auditoria em `/auditoria` mostra criar/editar/excluir com diffs

### Implementation for User Story 3

- [x] T014 [US3] Criar página de edição em `src/app/(app)/ocorrencias/[id]/page.tsx` (reuso de `ocorrencia-form.tsx` com `initialData` via `getOcorrencia`, Voltar, Excluir com `ConfirmDialog`, `atualizarOcorrencia`/`excluirOcorrencia` + toasts)
- [x] T015 [US3] Adicionar exclusão com `ConfirmDialog` na listagem em `src/app/(app)/ocorrencias/page.tsx` (guard `pode.excluir`, estado `deleteId`/`deleting`, remoção otimista da lista)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação end-to-end e build verde

- [ ] T016 Executar roteiro completo em `specs/026-ocorrencias-gestao-academica/quickstart.md` (cenários 1–3) e corrigir achados
- [x] T017 [P] Rodar `npx tsc --noEmit` limpo e `npx next build` verde com rotas `/ocorrencias`, `/ocorrencias/novo`, `/ocorrencias/[id]` presentes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (seed via SQL para teste independente)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Reuses T007/T008/T009 from foundation; independently testable via criação → listagem
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Reuses form (T012) and listagem (T011); needs registros existentes (via US2 ou seed SQL)

### Within Each User Story

- Components before pages (minicard/filtros antes da page; form antes de novo/[id])
- Core implementation before integration (T015 por último, edita page existente)
- Story complete before moving to next priority

### Parallel Opportunities

- T001 + T002 (migrations diferentes); T005 + T006 + T007 (arquivos diferentes, sem dependências)
- T009 + T010 (componentes diferentes da US1)
- T012 pode iniciar em paralelo com Phase 3 (usa só fundação + contrato do form)
- T017 (build) roda em paralelo com correções manuais de T016

---

## Parallel Example: User Story 1

```bash
# Launch both US1 components together (different files, foundation done):
Task: "Criar minicard em src/components/ocorrencias/ocorrencia-minicard.tsx"
Task: "Criar card de filtros em src/components/ocorrencias/ocorrencia-filtros.tsx"

# Then page assembly (depends on both):
Task: "Criar listagem em src/app/(app)/ocorrencias/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (migrations aplicadas)
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (seed via SQL Editor)
4. **STOP and VALIDATE**: Test User Story 1 independently (filtros + minicards + permissões + escola superadmin)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (loop completo criar → listar)
4. Add User Story 3 → Test independently → Deploy/Demo (gestão total)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T009–T011)
   - Developer B: User Story 2 (T012–T013)
   - Developer C: User Story 3 (T014–T015, após T011–T013 ou com mocks de seed)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Migrations aplicadas via SQL Editor (sem CLI Supabase); auditoria best-effort não bloqueia mutações
- Fora de escopo (follow-ups no plan.md): exibição no Portal; alinhamento do card do Painel do Aluno ao schema canônico
