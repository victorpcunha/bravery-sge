# Tasks: Portal por Escola

**Input**: Design documents from `/specs/024-portal-por-escola/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Validação manual via `quickstart.md` (padrão do projeto — sem suite automatizada; gates `npx tsc --noEmit` + `npx next build`).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Portal: `src/app/portal/[slug]/` (move de `src/app/portal/*`), `src/components/portal/`, `src/lib/actions/portal-escola.ts`, `src/lib/portal-slug.ts`
- Cadastro: `src/components/censo/escola-form.tsx`, `src/app/(app)/escolas/[id]/page.tsx`
- Migrations: `supabase-migrations/patch_portal_*.sql` (aplicar via SQL Editor)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Migrations do banco

- [X] T001 Criar migration `supabase-migrations/patch_portal_escolas.sql` (`schools.portal_habilitado` + `portal_slug UNIQUE NULL`, ver `data-model.md`) e aplicar via SQL Editor
- [X] T002 [P] Criar migration `supabase-migrations/patch_portal_login_brand.sql` (`documentos_config.portal_imagem_fundo` + `portal_texto_login`, ver `data-model.md`) e aplicar via SQL Editor

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Resolução de escola por slug + escopo nas actions + shell sob `[slug]` — BLOQUEIA todas as user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Criar `src/lib/portal-slug.ts` (puro, client-safe: `normalizarSlug`, `sugerirSlug`, `SLUGS_RESERVADOS`) + `src/lib/actions/portal-escola.ts` (`'use server'`: `getEscolaPortal`, `validarSlugUnico`, ver `contracts/portal-escola.md`)
- [X] T004 Estender tipo `School` em `src/lib/actions/schools.ts` com `portal_habilitado: boolean` + `portal_slug: string | null`
- [X] T005 Estender `src/lib/actions/portal.ts`: `schoolId?` em `validarVinculoPortal` (exige `matricula.school_id === schoolId`) e `getSessaoPortal` (filtra alunos pela escola); repassar em todas as actions do portal
- [X] T006 Mover `src/app/portal/*` → `src/app/portal/[slug]/*` e criar `src/app/portal/[slug]/layout.tsx` (resolve escola via `getEscolaPortal`: indisponível/orientação sem montar sessão, senão `PortalProvider` com escola)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Habilitar portal e definir slug (Priority: P1) 🎯 MVP

**Goal**: Card "Portal do Responsável" no cadastro com pill Sim/Não + slug único; link ativa/desativa o portal da escola

**Independent Test**: quickstart cenários 1–2 (habilita → slug abre login; slug duplicado bloqueia; desabilita → indisponível)

- [X] T007 [US1] Adicionar grupo zod `portal` + card na aba Identificação em `src/components/censo/escola-form.tsx` (`PillToggleGroup` Sim/Não, Input slug só com Sim, preview `/portal/[slug]`, alerta de troca de slug, `readOnly` herdado)
- [X] T008 [US1] Carregar defaults do card (via `getSchool`) e tratar erro de slug duplicado em `src/components/censo/escola-form.tsx` (flag/slug viajam no `updateSchool` por serem colunas de `schools`)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Login personalizado da escola (Priority: P1)

**Goal**: Login do slug com nome/logo/imagem/texto da escola e fallback total ao padrão

**Independent Test**: quickstart cenário 3 (4 elementos com personalização; padrão sem ela)

- [X] T009 [US2] Personalizar `src/app/portal/[slug]/login/page.tsx` com branding de `getEscolaPortal` (logo + nome + bg + texto; fallback item a item, nunca quebra)
- [X] T010 [US2] Estender `ConfigDocumentos` + payload de `src/lib/actions/documentos-config.ts` (`portal_imagem_fundo` com teto 2 MB + máscara na auditoria, `portal_texto_login`) e campos no card em `src/components/censo/escola-form.tsx` (via grupo `documentos` → `salvarConfigDocumentos`)

---

## Phase 5: User Story 3 - Rotas genéricas viram orientação (Priority: P2)

**Goal**: Qualquer acesso sem slug válido vê orientação (sem form, sem dados); desabilitada vê indisponível

**Independent Test**: quickstart cenário 4 (genéricas e slug desconhecido → orientação; desabilitada → indisponível)

- [X] T011 [US3] Criar `src/components/portal/portal-orientacao.tsx` (variantes orientação/indisponível, texto único LGPD) + repurpor `src/app/portal/login/page.tsx` como orientação + variantes no `src/app/portal/[slug]/layout.tsx`

---

## Phase 6: User Story 4 - Escopo de dados pela escola do slug (Priority: P2)

**Goal**: Seleção e todas as leituras filtradas pela escola do slug; cross-escola nega

**Independent Test**: quickstart cenário 5 (2 escolas: cada slug só seus alunos; cross → "Acesso negado"; transferido some)

- [X] T012 [US4] Wire `schoolId` do slug no `src/components/portal/portal-provider.tsx` (repassa a todas as actions) + estado vazio orientador nas páginas quando sem vínculo na escola

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Gates, validação end-to-end e Censo intacto

- [X] T013 Rodar `npx tsc --noEmit` e `npx next build` até verdes (SC-005)
- [ ] T014 [P] Executar `quickstart.md` cenários 1–8 e corrigir divergências — PENDENTE MANUAL: exige migrations aplicadas via SQL Editor + dados reais + navegador
- [X] T015 [P] Revisar Registro 00 do Censo sem colunas do portal + auditoria (flag/slug sem base64) em `src/lib/actions/schools.ts` e `src/lib/actions/documentos-config.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 → US2/US3/US4 (slug precisa existir antes de branding/orientação/escopo serem testáveis)
  - US2, US3, US4 podem avançar em paralelo entre si após US1 (arquivos distintos)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (slug) for test; branding code independe
- **User Story 3 (P2)**: Depends on Foundational (layout `[slug]`); testável com qualquer slug
- **User Story 4 (P2)**: Depends on T005/T006 (escopo nas actions + provider)

### Within Each User Story

- Action/helpers antes das páginas que consomem
- `portal.ts` e `escola-form.tsx` são arquivos únicos: edits sequenciais dentro deles
- Helpers puros em `src/lib/portal-slug.ts` (client-safe) — nunca em `'use server'`

### Parallel Opportunities

- T002 em paralelo com T001 (migrations distintas)
- US2/US3/US4 em paralelo após US1 (arquivos distintos, contrato fixo em `contracts/portal-escola.md`)
- T014, T015 em paralelo (validação vs. revisão)

---

## Parallel Example: US2 + US3 + US4 (após US1)

```bash
# Arquivos distintos, contrato fixo:
Task: "Personalizar src/app/portal/[slug]/login/page.tsx com branding"
Task: "Criar src/components/portal/portal-orientacao.tsx + repurpor src/app/portal/login/page.tsx"
Task: "Wire schoolId no src/components/portal/portal-provider.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1+2)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T006) (CRITICAL - blocks all stories)
3. Complete Phase 3: US1 + Phase 4: US2 (escola habilitada com login personalizado)
4. **STOP and VALIDATE**: quickstart cenários 1–3

### Incremental Delivery

1. Setup + Foundational → base (slug resolve, escopo nas actions, shell sob `[slug]`)
2. US1 → governança por escola → validado (cenários 1–2)
3. US2 → login com cara da escola → validado (cenário 3)
4. US3 → genéricas viram orientação → validado (cenário 4)
5. US4 → isolamento A×B → validado (cenário 5)
6. Polish → gates + Censo + auditoria (cenários 6–8)

---

## Notes

- [P] tasks = different files, no dependencies
- Desvio registrado do contrato: helpers puros de slug vivem em `src/lib/portal-slug.ts` (client-safe), não em `portal-escola.ts` (`'use server'` não pode ser importado por client components como o EscolaForm) — atualizar `contracts/portal-escola.md` na implementação
- Links antigos `/portal/*` morrem: roteiro de repasse dos links novos faz parte da implantação (assunção da spec)
- Stop at any checkpoint to validate story independently
