# Tasks: Visibilidade dos Módulos do Portal do Responsável

**Input**: Design documents from `/specs/040-configurar-visibilidade-portal/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test runner in repo (`package.json`: `dev/build/start/lint` only). Validation = `npx tsc --noEmit` + `npx next build` + manual [quickstart.md](./quickstart.md). No test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Persistência da visibilidade (migration + aplicação)

- [X] T001 Create migration `supabase-migrations/patch_portal_modulos_visiveis.sql` with 6 `BOOLEAN NOT NULL DEFAULT TRUE` columns (`portal_vis_boletim`, `portal_vis_frequencia`, `portal_vis_horarios`, `portal_vis_ocorrencias`, `portal_vis_comunicados`, `portal_vis_documentos`) + COMMENTs per data-model.md
- [ ] T002 Apply migration via SQL Editor and verify the 6 columns exist on `schools` with default TRUE (manual; no Supabase CLI in repo) — ⚠️ PENDING: sem acesso ao SQL Editor neste ambiente; código defensivo com default tudo-visível até a aplicação (ver `getEscolaPortal`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Mapa canônico, tipos, leitura da visibilidade e contexto do portal — MUST complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Create neutral module `src/lib/portal-modulos.ts` (no `'use server'`): `ModuloPortal` keys, `MODULOS_PORTAL` (label + coluna por chave), `ModulosVisiveis` type, `todosVisiveis()` default per research R5
- [X] T004 [P] Extend `School` type in `src/lib/actions/schools.ts` with 6 optional booleans (`portal_vis_*`)
- [X] T005 [P] Extend `getEscolaPortal` in `src/lib/actions/portal-escola.ts` (select the 6 flags, return `modulosVisiveis` defaulting to all-true) and add `exigirModuloVisivel(schoolId, modulo)` helper throwing `Error('Módulo indisponível no portal desta escola')` per contracts/portal-visibilidade.md
- [X] T006 Extend `EscolaPortalCtx` in `src/components/portal/portal-provider.tsx` with `modulosVisiveis: Record<ModuloPortal, boolean>` (depends on T003, T005)
- [X] T007 Repass `modulosVisiveis` to `PortalProvider` in `src/app/portal/[slug]/layout.tsx` (depends on T005, T006)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Escola oculta o Boletim do portal (Priority: P1) 🎯 MVP

**Goal**: Gestor desmarca um módulo no card da Unidade Escolar; responsáveis da escola deixam de ver o módulo no menu e no acesso direto, sem vazar dados

**Independent Test**: Desmarcar só o Boletim da escola A, salvar e confirmar que (a) some do menu, (b) some do acesso rápido, (c) URL direta exibe orientação sem notas, (d) demais módulos normais e escola B inalterada (quickstart scenarios 1–3)

- [X] T008 [P] [US1] Add 6 `portal_vis_*` fields (`z.string().optional()`, convention `'1'`/`'0'`) to zod schema in `src/components/censo/escola-form.tsx`
- [X] T009 [US1] Render 6 `ClickablePill` toggles in group "Módulos visíveis no portal" (visible only when `portalAtivo`) inside card "Portal do Responsável" in `src/components/censo/escola-form.tsx` (depends on T008; inherits `readOnly` fieldset; travels via existing `{ documentos, ...censo }` split to `updateSchool`)
- [X] T010 [P] [US1] Call `exigirModuloVisivel` after `validarVinculoPortal` in `getBoletimPortal`, `getFrequenciaPortal`, `getHorariosPortal`, `getOcorrenciasPortal`, `getComunicadosPortal`, `marcarComunicadoLido`, `marcarOcorrenciaLida`, `getMediasInicio` in `src/lib/actions/portal.ts`
- [X] T011 [P] [US1] Filter `ITENS` by `modulosVisiveis` (keep `Início` always) in `src/components/portal/portal-sidebar.tsx` (desktop + mobile drawer share the component)
- [X] T012 [P] [US1] Render blocked `EmptyState` (`ShieldAlert`, "Módulo indisponível", "A escola optou por não exibir {rótulo} no portal. Procure a secretaria.") instead of calling the action when hidden, in the 6 module pages under `src/app/portal/[slug]/aluno/{boletim,frequencia,horarios,ocorrencias,comunicados,documentos}/page.tsx` (via shared `src/components/portal/modulo-bloqueado.tsx`)
- [ ] T013 [US1] Validate quickstart scenarios 1–3 (hide Boletim, portal menu/direct URL, cross-school isolation) — ⚠️ PENDING: requer ambiente com 2 escolas + responsáveis (manual)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Escola reexibe um módulo oculto (Priority: P2)

**Goal**: Reversão operacional sem suporte técnico e sem nova credencial/vínculo para o responsável

**Independent Test**: Remarcar o Boletim, salvar, recarregar o portal e confirmar menu + dados de volta (quickstart scenario 4). No new code expected — same toggle path as US1.

- [ ] T014 [US2] Validate quickstart scenario 4 (re-marcar Boletim, save toast, portal reload shows menu + data, no new password/vínculo) — ⚠️ PENDING: validação manual em ambiente (sem código novo; mesmo caminho de toggle da US1)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Início do portal reflete os módulos visíveis (Priority: P2)

**Goal**: Início sem atalhos quebrados — acesso rápido, blocos e "Ver Todos" só para módulos visíveis; tudo oculto → Início com identificação + orientação

**Independent Test**: Ocultar Comunicados + Boletim e confirmar zero caminhos (botão, card, "Ver Todos") para eles no Início; ocultar os 6 e confirmar Início íntegro só com identificação (quickstart scenario 5)

- [X] T015 [US3] Skip queries of hidden modules in `getInicioPortal` in `src/lib/actions/portal.ts` (return shape unchanged: empty arrays/zeros for hidden sections)
- [X] T016 [P] [US3] Filter `acessosRapidos` by `modulosVisiveis` in `src/app/portal/[slug]/aluno/page.tsx`
- [X] T017 [P] [US3] Omit blocks and "Ver Todos" buttons tied to hidden modules in `src/components/portal/inicio-cards.tsx` (receive visibility map via props from `src/app/portal/[slug]/aluno/page.tsx`)
- [X] T018 [US3] Render identification + orientation state (no broken shortcuts) when all 6 modules hidden in `src/app/portal/[slug]/aluno/page.tsx` (depends on T016, same file; KPIs of hidden modules also omitted)
- [ ] T019 [US3] Validate quickstart scenarios 3 + 5 (cross-school independence, all-hidden limit) — ⚠️ PENDING: validação manual em ambiente

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Garantias finais (Censo, build, regressão, memória operacional)

- [X] T020 [P] Verify Censo Registro 00 reads explicit columns and ignores `portal_vis_*` (same guarantee as specs 018/024) — verified in `src/lib/actions/censo.ts:buildRegistro00` (explicit field list, no `portal_*`)
- [X] T021 Run `npx tsc --noEmit`, `npx next build` (must be green) and `eslint` on touched files — `tsc` limpo + `next build` verde (53 rotas); eslint: só achados pré-existentes (`set-state-in-effect` em `setLoading` vigentes, `any`/unused em `escola-form.tsx`, memoização em `portal-provider.tsx`); warnings novos de `exhaustive-deps` (`bloqueado`) corrigidos
- [ ] T022 Run full quickstart validation including scenario 6 (read-only profile) and regression (internal management sees all data normally) — ⚠️ PENDING: requer ambiente com escolas + responsáveis (manual)
- [X] T023 [P] Record the feature in `AGENTS.md` project summary (Visibilidade do Portal por escola) per repo convention

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (T001 → T002 sequential: apply after creating)
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories (T003/T004/T005 parallel; T006 after T003+T005; T007 after T005+T006)
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (P1) → US2 (P2, validation-only) → US3 (P2) in priority order; US3 could start in parallel with US1 (different files except `portal.ts`/`aluno/page.tsx` touch points — prefer sequential to avoid same-file conflicts)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after US1 - Validation-only, no new code
- **User Story 3 (P2)**: Can start after Foundational - Touches `portal.ts` and `aluno/page.tsx` also touched in US1, so run after US1 to avoid conflicts

### Within Each User Story

- No test framework in repo — validation tasks (T013/T014/T019) execute quickstart scenarios instead
- Same-file tasks run sequentially (T008 → T009; T016 → T018); different-file tasks marked [P]
- Story complete before moving to next priority

### Parallel Opportunities

- T003 + T004 + T005 (different files, foundation)
- T008 + T010 + T011 + T012 (different files, US1)
- T016 + T017 (different files, US3)
- T020 + T023 alongside final validation

---

## Parallel Example: User Story 1

```bash
# Launch US1 implementation tasks together (different files, foundation ready):
Task: "Add 6 portal_vis_* zod fields in src/components/censo/escola-form.tsx"           # T008
Task: "Call exigirModuloVisivel in 8 portal actions in src/lib/actions/portal.ts"        # T010
Task: "Filter ITENS by modulosVisiveis in src/components/portal/portal-sidebar.tsx"      # T011
Task: "Render blocked EmptyState in 6 module pages under src/app/portal/[slug]/aluno/"   # T012
# Then sequential in the same file:
Task: "Render 6 ClickablePill toggles in src/components/censo/escola-form.tsx"           # T009 (after T008)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T007) (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (T008–T013)
4. **STOP and VALIDATE**: Test User Story 1 independently (quickstart 1–3)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Validate toggle-back → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (form + enforcement + sidebar + module pages)
   - Developer B: User Story 3 (Início + InicioCards) — after agreeing on `ModulosVisiveis` prop shape, or after US1 to avoid same-file conflicts in `portal.ts` / `aluno/page.tsx`
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable via quickstart scenarios
- Migration must be applied via SQL Editor before any story validation (no Supabase CLI)
- Avoid: vague tasks, same-file conflicts (T008→T009, T016→T018 sequential), cross-story dependencies that break independence
- `updateSchool` already covers FR-008 (permission `escolas/editar`) and FR-009 (audit diff) — no tasks needed for those
