# Tasks: Portal do Responsável

**Input**: Design documents from `/specs/023-portal-responsavel/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Validação manual via `quickstart.md` (padrão do projeto — sem suite automatizada; gates `npx tsc --noEmit` + `npx next build`).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app em projeto existente: `src/app/portal/`, `src/components/portal/`, `src/lib/actions/portal.ts`
- Migrations: `supabase-migrations/patch_portal_*.sql` (aplicar via SQL Editor, padrão do projeto)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Migrations do banco + micro-alteração no motor existente

- [X] T001 Criar migration `supabase-migrations/patch_portal_termo.sql` (`portal_termos` + `portal_aceites` + seed v1 com texto FR-006, ver `data-model.md`) e aplicar via SQL Editor
- [X] T002 [P] Criar migration `supabase-migrations/patch_portal_comunicados.sql` (`comunicados` + `comunicados_leituras`, ver `data-model.md`) e aplicar via SQL Editor
- [X] T003 [P] Criar migration `supabase-migrations/patch_portal_ocorrencias.sql` de CONVERGÊNCIA (schema real já tem titulo/tipo/detalhes/apresentar_portal + ocorrencias_alunos; migration cria só o índice + comentários — R5 revisado) e aplicar via SQL Editor
- [X] T004 [P] Exportar `calcularFrequenciaBoletim` em `src/lib/actions/boletim.ts` (trocar `async function` por `export async function`, 1 linha — R4)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Fachada de autorização + shell do portal (layout, sessão, login) — BLOQUEIA todas as user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Criar fachada base em `src/lib/actions/portal.ts`: `validarVinculoPortal(responsavelId, alunoId)` (vínculo + matrícula vigente + flag, ver `contracts/portal-actions.md`) + `getSessaoPortal(responsavelId)`
- [X] T006 Criar shell do portal em `src/app/portal/layout.tsx`: `PortalProvider` (`src/components/portal/portal-provider.tsx`, context + localStorage) + guard client de sessão e aceite (redirects `/portal/login` e `/portal/termo`)
- [X] T007 Criar login em `src/app/portal/login/page.tsx`: e-mail + senha via `getSupabaseClient().signInWithPassword`, gate `portal_only` + flag (R2/R8), `signOut` + erro genérico `Usuário ou senha inválidos` em caso de falha

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Aceite do termo LGPD (Priority: P1) 🎯 MVP

**Goal**: Primeiro acesso bloqueado até aceitar o Termo vigente; aceite registrado com data/hora/versão; re-aceite em nova versão

**Independent Test**: quickstart cenários 1 e 8 (login → termo → aceite → `portal_aceites` + auditoria sem senha; publicar v2 exige novo aceite)

- [X] T008 [US1] Implementar `getTermoVigente` + `aceitarTermo` (idempotente + `registrarAuditoria` módulo `Portal do Responsável`, sem senha/conteúdo) em `src/lib/actions/portal.ts`
- [X] T009 [US1] Criar página do termo em `src/app/portal/termo/page.tsx` (conteúdo + botão Aceitar com loading PE-404; sem Topbar/Sidebar de dados)
- [X] T010 [US1] Ativar bloqueio total no guard de `src/app/portal/layout.tsx` (URL direta sem aceite → `/portal/termo`; cenário 1 do quickstart)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Seleção do aluno vinculado (Priority: P1)

**Goal**: Lista de vinculados (2+), entrada direta (1), estado vazio (0); Sidebar identifica aluno e permite troca preservando a página

**Independent Test**: quickstart cenário 2 (lista, troca atualiza tudo, credencial interna recusada)

- [X] T011 [US2] Criar seleção em `src/app/portal/selecionar-aluno/page.tsx` (lista nome + turma; 1 vínculo → redirect direto; 0 → EmptyState "procure a escola")
- [X] T012 [US2] Criar `src/components/portal/portal-sidebar.tsx` (itens Início/Boletim/Frequência/Horários/Ocorrências/Comunicados/Documentos + identificação do aluno + seletor de troca 2+)
- [X] T013 [US2] Criar `src/components/portal/portal-topbar.tsx` (padrão visual Bravery, nome do responsável + sair)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Início com KPIs e resumo (Priority: P2)

**Goal**: 4 KPIs acima da dobra + 3 cards (Comunicados/Médias/Ocorrências recentes) com "Ver Todos"

**Independent Test**: quickstart cenário 3 (KPIs batem com Diário/Painel; período da média recalcula; Aluno B sem zeros enganosos)

- [X] T014 [US3] Implementar `getInicioPortal` em `src/lib/actions/portal.ts` (fachada única delegando a `getFrequenciaGeral`, `getDadosBoletim`, contagem/top-3 — ver contracts)
- [X] T015 [US3] Criar `src/app/portal/aluno/page.tsx` com 4 StatCards (Presença, Média com seletor de período, Faltas, Ocorrências) + estados vazios
- [X] T016 [US3] Criar cards recentes em `src/components/portal/inicio-cards.tsx` (3 últimos + botões "Ver Todos" → rotas do mesmo aluno)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Boletim por bimestre (Priority: P2)

**Goal**: Abas de bimestre do método; tabela Disciplina × avaliações + Média; média mínima visível; verde/vermelho padrão Diário

**Independent Test**: quickstart cenário 4 (abas, avaliações do método, cores, bloqueio explicativo não-numérico)

- [X] T017 [US4] Implementar `getBoletimPortal` em `src/lib/actions/portal.ts` (repassa `getDadosBoletim` incl. `{ bloqueado, motivo }`)
- [X] T018 [US4] Criar `src/app/portal/aluno/boletim/page.tsx` (Tabs por bimestre + Table shadcn + cores por `media_minima` + EmptyState bloqueado)

---

## Phase 7: User Story 5 - Frequência em 3 visões (Priority: P2)

**Goal**: Geral (percentual + aulas + faltas + limite), Por Disciplina Geral (barra + %), Disciplina por Bimestre (filtro)

**Independent Test**: quickstart cenário 5 (limite = 25% das registradas p/ mínima 75%; valores batem com Diário)

- [X] T019 [US5] Implementar `getFrequenciaPortal` em `src/lib/actions/portal.ts` (via `calcularFrequenciaBoletim` exportada em T004 + `frecuencia_minima` do método)
- [X] T020 [US5] Criar `src/app/portal/aluno/frequencia/page.tsx` (3 abas + Progress shadcn nas tabelas por disciplina)

---

## Phase 8: User Story 6 - Horários, Ocorrências e Comunicados (Priority: P3)

**Goal**: Grade da turma com professor; ocorrências filtradas com badges; comunicados com não-lidos e modal

**Independent Test**: quickstart cenário 6 (grade completa; só `apresentar_no_portal=true` aparece; badge some após modal; escopo de turma respeitado)

- [X] T021 [US6] Implementar `getHorariosPortal` (+`professor_nome`) + `getOcorrenciasPortal` (filtro `todas|positiva|negativa`) + `getComunicadosPortal` (com `lido`) + `marcarComunicadoLido` em `src/lib/actions/portal.ts`
- [X] T022 [P] [US6] Criar `src/app/portal/aluno/horarios/page.tsx` (grade dia×horário reutilizando padrão `card-quadro-aulas`; contra `contracts/portal-actions.md`, pode avançar em paralelo com T021)
- [X] T023 [P] [US6] Criar `src/app/portal/aluno/ocorrencias/page.tsx` (filtro Todas/Positivas/Negativas default Todas + ícone/título/data/descrição/badge por item)
- [X] T024 [P] [US6] Criar `src/app/portal/aluno/comunicados/page.tsx` + modal `Ver Comunicado` (minicards + badge não lido removido ao abrir via `marcarComunicadoLido`)

---

## Phase 9: User Story 7 - Documentos placeholder (Priority: P3)

**Goal**: Item de Sidebar existente com estado "Em breve", sem funcionalidade (decisão Q1)

**Independent Test**: quickstart cenário 7 (EmptyState oficial, sem erro, sem dados)

- [X] T025 [US7] Criar `src/app/portal/aluno/documentos/page.tsx` (EmptyState "Em breve")

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Gates, validação end-to-end, mobile e auditoria

- [X] T026 Rodar `npx tsc --noEmit` e `npx next build` até verdes (SC-006)
- [ ] T027 [P] Executar `quickstart.md` cenários 1–11 e corrigir divergências (inclui isolamento SC-003 e re-aceite) — PENDENTE MANUAL: exige migrations aplicadas via SQL Editor + dados reais + navegador (trace estático feito; 1 divergência corrigida no guard sem-vínculo)
- [X] T028 [P] Revisão mobile 360px nas 7 páginas (`card-list <md`, sem scroll horizontal — SC-005) + revisar auditoria (login/aceite sem senha, best-effort)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 → US2 são sequenciais (US2 usa o gate de aceite da US1)
  - US3–US7 dependem do contexto da US2; podem avançar em paralelo entre si após US2 (páginas [P] contra `contracts/portal-actions.md`)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 gate (aceite) - seleção só existe pós-login/aceite
- **User Story 3 (P2)**: Depends on US1+US2 (contexto do aluno)
- **User Story 4 (P2)**: Depends on US1+US2; independente de US3 (action + página próprias)
- **User Story 5 (P2)**: Depends on US1+US2; depende de T004 (export já no Setup)
- **User Story 6 (P3)**: Depends on US1+US2; páginas T022–T024 paralelas entre si
- **User Story 7 (P3)**: Depends on US2 (shell/Sidebar); implementação trivial

### Within Each User Story

- Action em `portal.ts` antes da página que a consome (páginas podem ser escritas em paralelo contra `contracts/portal-actions.md`)
- `portal.ts` é um arquivo só: edits de actions de stories diferentes são sequenciais (sem [P] entre si)
- Story complete antes de validação no quickstart

### Parallel Opportunities

- T002, T003, T004 em paralelo (arquivos distintos)
- T022, T023, T024 em paralelo (páginas distintas, contrato fixo)
- T027, T028 em paralelo (validação vs. revisão visual)
- US4/US5/US6 podem ser feitas por pessoas distintas após US2 (ações sequenciais em `portal.ts`, páginas em paralelo)

---

## Parallel Example: User Story 6

```bash
# T021 primeiro (portal.ts é arquivo único):
Task: "Implementar getHorariosPortal + getOcorrenciasPortal + getComunicadosPortal + marcarComunicadoLido em src/lib/actions/portal.ts"
# Depois, páginas em paralelo (contrato em contracts/portal-actions.md já fixa as assinaturas):
Task: "Criar src/app/portal/aluno/horarios/page.tsx"
Task: "Criar src/app/portal/aluno/ocorrencias/page.tsx"
Task: "Criar src/app/portal/aluno/comunicados/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1+2)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T007) (CRITICAL - blocks all stories)
3. Complete Phase 3: US1 + Phase 4: US2 (login → aceite → seleção: portal acessível com contexto, sem dados ainda)
4. **STOP and VALIDATE**: quickstart cenários 1, 2 e 8 (gates LGPD + isolamento)

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 + US2 → portal abre com contexto (MVP de acesso!)
3. US3 → Início com valor percebido → validado (cenário 3)
4. US4 → US5 → Boletim e Frequência → validados (cenários 4–5)
5. US6 → US7 → apoio + placeholder → validados (cenários 6–7)
6. Polish → gates + mobile + auditoria (cenários 9–11)

### Parallel Team Strategy

Com múltiplos desenvolvedores após US2:

1. Dev A: US3 (Início)
2. Dev B: US4 (Boletim) + US5 (Frequência)
3. Dev C: US6 (Horários/Ocorrências/Comunicados) + US7 (placeholder)
4. Sincronizar edits em `src/lib/actions/portal.ts` (arquivo único — sequencializar)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- T021 concentra 4 actions em 1 task porque `portal.ts` é arquivo único (evita conflito de merge)
- Carga de comunicados/ocorrências para homologação via SQL manual (emissão interna = spec futura, decisão Q2)
- Migrations aplicadas via SQL Editor antes de qualquer teste (padrão do projeto)
- Stop at any checkpoint to validate story independently
