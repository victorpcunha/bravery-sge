# Tasks: Acesso ao Portal no Cadastro de Responsável

**Input**: Design documents from `/specs/022-acesso-portal-responsavel/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md

**Tests**: Manuais via `quickstart.md` (sem suite automatizada neste módulo).

**Organization**: Tasks grouped by user story (US1 P1 → US2 P2 → US3 P2). Cada story testável de forma independente pelo roteiro correspondente do quickstart.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Spec speckit + migration do banco

- [ ] T001 Criar estrutura `specs/022-acesso-portal-responsavel/{spec,plan,data-model,quickstart,tasks}.md`
- [ ] T002 [P] [SETUP] Criar migration `supabase-migrations/patch_portal_acesso_responsavel.sql` (`people.portal_acesso_habilitado BOOLEAN NOT NULL DEFAULT FALSE` + comment) e aplicar via SQL Editor

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base server-side que TODAS as user stories dependem (tipo + criação com `portalOnly`)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [FOUND] Estender tipo `Person` em `src/lib/actions/people.ts` com `portal_acesso_habilitado: boolean` + incluir coluna nos selects/payloads de `createPerson`/`updatePerson` (sem persistir `senha`/`confirmacao` em `people`)
- [ ] T004 [FOUND] Estender `criarAuthUser` em `src/lib/actions/people.ts` com param `portalOnly?: boolean` → `user_metadata { person_id, portal_only: true }` + auditoria com flag `portal: true` (sem senha no snapshot)
- [ ] T005 [FOUND] Criar `definirSenhaPortal(personId, schoolId, novaSenha, pessoaId?)` em `src/lib/actions/people.ts` (localiza via `fn_buscar_auth_user_por_pessoa`, `validarSenha`, `auth.admin.updateUserById`, auditoria fato `senha_portal: 'redefinida'`)
- [ ] T006 [FOUND] Criar `alternarAcessoPortal(personId, habilitar, pessoaId?)` em `src/lib/actions/people.ts` (update flag + `ban_duration 'none'`/`'100000000h'`, validação de permissão de edição de usuários + escopo `school_id`, auditoria do diff da flag)

**Checkpoint**: Foundation ready — `tsc --noEmit` verde; user story implementation can now begin

---

## Phase 3: User Story 1 - Habilitar acesso no cadastro (Priority: P1) 🎯 MVP

**Goal**: Seção "Acesso ao Portal" funcional na criação do responsável com credencial provisionada

**Independent Test**: Roteiro "US1" do `quickstart.md` (passos 1–10)

### Implementation for User Story 1

- [ ] T007 [US1] Adicionar `FormCard "Acesso ao Portal"` em `src/app/(app)/gestao-usuarios/usuarios/PessoaForm.tsx` visível quando `perfil` inclui `responsavel` (inclusive `apenasResponsavel`): `Checkbox Habilitar` + hint do login + `Senha`/`Confirmação` (`type="password"`) quando habilitado; grid `grid-cols-1 sm:grid-cols-2`; tokens + `text-[13px]` hints; `aria-required` no e-mail/senha quando habilitado
- [ ] T008 [US1] Estender estado `form` em `PessoaForm.tsx` (`portal_acesso_habilitado`, `senha_portal`, `confirmacao_senha_portal`) + validações client em `handleSave` (e-mail obrigatório/válido, senha forte espelhando `validarSenha`, confirmação igual) com mensagens PE-402
- [ ] T009 [US1] Integrar criação em `handleSave` (`PessoaForm.tsx`): `createPerson(portal_acesso_habilitado)` → vínculos `_new` via `vincularResponsavel` → `criarAuthUser({..., portalOnly: true})` quando Habilitar=Sim; toast sucesso (PE-403) + loading anti-duplo-submit (PE-404)
- [ ] T010 [US1] Traduzir erro de e-mail duplicado do Auth em mensagem amigável sem expor titularidade (LGPD), em `PessoaForm.tsx` e/ou `people.ts`

**Checkpoint**: US1 fully functional — quickstart passos 1–10 passam; `user_schools` sem duplicata

---

## Phase 4: User Story 2 - Gerenciar acesso existente (Priority: P2)

**Goal**: Habilitar/desabilitar/redefinir-senha/trocar e-mail na edição, com bloqueio via ban sem perda de dados

**Independent Test**: Roteiro "US2" do `quickstart.md` (passos 11–15)

### Implementation for User Story 2

- [ ] T011 [US2] Carregar `portal_acesso_habilitado` ao abrir `PessoaForm.tsx` em modo edição (sem exibir senha atual)
- [ ] T012 [US2] Integrar edição em `handleSave` (`PessoaForm.tsx`): diff da flag/senha/e-mail → `alternarAcessoPortal` / `definirSenhaPortal` / sync de e-mail via `updateUserById`; senha em branco = manter atual; sem recriar `user_schools`
- [ ] T013 [US2] Garantir `atualizarAcessoAuth` (inativação `ativo=false`) cobre a credencial do portal em `src/lib/actions/people.ts`

**Checkpoint**: US1 AND US2 work independently — quickstart passos 1–15 passam

---

## Phase 5: User Story 3 - Vínculo com aluno preservado (Priority: P3 — não-regressão)

**Goal**: Vínculos 1..N (tipos 1–5, principal, autorizações) idênticos com ou sem acesso

**Independent Test**: Roteiro "US3" do `quickstart.md` (passos 16–17)

### Implementation for User Story 3

- [ ] T014 [US3] Preservar UI/lógica de vínculo em `PessoaForm.tsx` (busca `buscarAlunos`, `TIPOS_VINCULO`, checkboxes Principal/Retirar/Comunicados) sem alteração visual
- [ ] T015 [US3] Corrigir persistência de vínculos na **edição** em `PessoaForm.tsx`/`src/lib/actions/people.ts` (hoje só persistem na criação — `handleSave:582-586`): chamar `vincularResponsavel`/`desvincularResponsavel` conforme diff, com auditoria vigente

**Checkpoint**: All user stories independently functional — quickstart completo (passos 1–17)

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Verificação final e consistência

- [ ] T016 [P] Rodar `npx tsc --noEmit` + `npx next build` verdes (43 rotas esperadas, sem novas rotas)
- [ ] T017 [P] Revisar tokens/dark-mode/responsivo da seção (sem hex, `bg-card`, `text-muted-foreground`, `border-border`) + `role="alert"` nos erros de validação
- [ ] T018 Executar `quickstart.md` de ponta a ponta e registrar resultado

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (T002 [P] paralelizável com T001)
- **Foundational (Phase 2)**: Depends on Setup (T002 migration aplicada) - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (P1) primeiro (MVP); US2 e US3 (P2) em seguida, paralelizáveis entre si após US1 se houver capacidade
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Within Each User Story

- Server (`people.ts`) antes do client (`PessoaForm.tsx`)
- Core implementation antes de integração/auditoria
- Story complete (quickstart do escopo) antes de passar à próxima prioridade

### Parallel Opportunities

- T001 + T002 em paralelo (arquivos diferentes)
- T003–T006 sequenciais (mesmo arquivo `people.ts`)
- T007–T010 após Foundation (mesmo arquivo `PessoaForm.tsx`, sequenciais)
- T016 + T017 em paralelo (verificação vs revisão visual)
