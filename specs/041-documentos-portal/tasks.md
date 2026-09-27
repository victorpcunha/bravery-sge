# Tasks: Documentos no Portal do Responsável

**Input**: Design documents from `/specs/041-documentos-portal/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/portal-documentos.md, quickstart.md

**Tests**: Spec não solicita TDD nem suite automatizada; validação via `tsc --noEmit` + `eslint` + `next build` + E2E manual do quickstart (padrão do repo).

**Organization**: Tarefas agrupadas por user story (US1 P1, US2 P1, US3 P2) para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos diferentes, sem dependência pendente)
- **[Story]**: user story da spec (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estrutura base da feature (migration + catálogo neutro, sem dependência entre si)

- [X] T001 [P] Criar migration `supabase-migrations/patch_portal_documentos_escola.sql` (tabela `escola_portal_documentos` com PK `(school_id, documento_id)`, FK → `schools.id` ON DELETE CASCADE, `liberado` BOOLEAN NOT NULL DEFAULT TRUE, índice por `school_id`, comentários — research R1/R8)
- [X] T002 [P] Criar módulo neutro `src/lib/portal-documentos.ts` (constante `DOCUMENTOS_PORTAL` com os 4 oficiais, tipo de categoria `oficial|manual`, helpers `todosLiberados()` e `normalizarDocumentosLiberados()` com semântica opt-out — contracts §1, research R2)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Banco pronto antes de qualquer validação runtime das stories

**⚠️ CRITICAL**: Nenhuma validação runtime de story começa sem esta fase (código pode ser escrito, mas só valida com a tabela existindo)

- [ ] T003 Aplicar `supabase-migrations/patch_portal_documentos_escola.sql` via SQL Editor do Supabase e verificar criação da tabela `escola_portal_documentos` (depends on T001)

**Checkpoint**: Tabela existe e está vazia (ausência = tudo liberado) — stories podem ser implementadas e validadas

---

## Phase 3: User Story 1 - Escola define quais documentos o portal disponibiliza (Priority: P1) 🎯 MVP

**Goal**: Gestora seleciona por escola, no card Portal do Responsável, quais documentos ficam disponíveis; seleção persiste e é auditada (FR-001, FR-002, FR-009, FR-010, FR-011)

**Independent Test**: Na Unidade Escolar, desmarcar "Boletim Escolar", salvar, recarregar e confirmar persistência; conferir registro `editar` em Auditoria (módulo `Portal — Documentos`); pessoa sem `escolas/editar` vê somente leitura (quickstart §1)

- [X] T004 [US1] Implementar `getDocumentosLiberados` e `salvarDocumentosPortal` em `src/lib/actions/portal-documentos.ts` (upsert validado contra o catálogo, `validarPermissaoEstrita(pessoaId, 'escolas', 'editar')`, `registrarAuditoria` módulo `Portal — Documentos` — contracts §2, research R3/R6)
- [X] T005 [P] [US1] Adicionar seção "Documentos disponíveis no portal" ao card Portal do Responsável em `src/components/censo/escola-form.tsx` (grupo `portal_documentos` no schema zod, `ClickablePill` por documento agrupado por categoria, herda `readOnly` — contracts §5, research R3)
- [X] T006 [P] [US1] Carregar `getDocumentosLiberados` nos defaultValues e chamar `salvarDocumentosPortal` após `updateSchool` em `src/app/(app)/escolas/[id]/page.tsx` (padrão `documentos`/`salvarConfigDocumentos` — research R3)

**Checkpoint**: US1 funcional e testável sozinha (config persiste + audita), mesmo antes do portal exibir a galeria

---

## Phase 4: User Story 2 - Responsável gera documento do aluno em visualização (Priority: P1)

**Goal**: Portal exibe só documentos liberados e gera PDF no contexto do aluno/turma em visualização, com bloqueio server-side (FR-003, FR-004, FR-005, FR-006)

**Independent Test**: No portal, galeria sem o documento desmarcado; Declaração gerada com dados do aluno/turma visualizados sem pedir seleção; troca de aluno troca o contexto; acesso direto ao wrapper de documento não liberado retorna `Documento indisponível no portal desta escola` (quickstart §2–§3). Não depende da US1 (default = tudo liberado).

- [X] T007 [US2] Implementar `exigirDocumentoLiberado` e incluir `documentosLiberados` no retorno de `getEscolaPortal` em `src/lib/actions/portal-escola.ts` (contracts §3, research R4/R5)
- [X] T008 [P] [US2] Estender `EscolaPortalCtx` com `documentosLiberados` e repassar no `PortalProvider` em `src/components/portal/portal-provider.tsx` (depends on T007)
- [X] T009 [P] [US2] Implementar `listarDocumentosDisponiveisPortal` + 5 wrappers de geração em `src/lib/actions/portal.ts` (vínculo → módulo → documento → delegação ao motor com `pessoaId` undefined e `anoLetivoId`/`schoolId` do `PortalCtx` — contracts §4, research R4)
- [X] T010 [P] [US2] Adicionar props opcionais `alunoFixo`/`anoLetivoFixo` em `src/components/documentos/documento-gerador.tsx` (ocultam selects de ano/aluno e busca quando presentes; retrocompatível com o módulo interno — contracts §5)
- [X] T011 [US2] Criar galeria + fluxo de geração em `src/components/portal/documentos-portal.tsx` (padrão Minicard de `oficiais-tab.tsx`, consome `listarDocumentosDisponiveisPortal`, usa `DocumentoGerador` com aluno/ano fixos do `usePortal()` — depends on T009, T010)
- [X] T012 [US2] Reescrever `src/app/portal/[slug]/aluno/documentos/page.tsx` (mantém gate `ModuloBloqueado`, renderiza `documentos-portal.tsx` — depends on T011)

**Checkpoint**: US1 + US2 funcionam de ponta a ponta (configurar na escola → gerar no portal)

---

## Phase 5: User Story 3 - Portal orienta quando nada pode ser gerado (Priority: P2)

**Goal**: Mensagens claras em linguagem do responsável quando nada está liberado ou o documento não se aplica (FR-007, FR-008, PE-402)

**Independent Test**: Escola sem nada liberado → `EmptyState` orientativo + secretaria (quickstart §4); Boletim liberado em turma sem avaliação numérica → explicação simples + secretaria (quickstart §5)

- [X] T013 [P] [US3] Adicionar `EmptyState` "nenhum documento disponível" + orientação à secretaria na página/galeria do portal (`src/app/portal/[slug]/aluno/documentos/page.tsx`, `src/components/portal/documentos-portal.tsx` — FR-007)
- [X] T014 [P] [US3] Adaptar mensagens de inaplicabilidade ao responsável (Boletim bloqueado e demais motivos do motor com orientação à secretaria, sem jargão interno — FR-008, PE-402)

**Checkpoint**: Todas as stories funcionalmente completas

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação final, regressão e memória operacional

- [X] T015 Executar validação técnica nos arquivos tocados (`src/lib/portal-documentos.ts`, `src/lib/actions/portal-documentos.ts`, `src/lib/actions/portal.ts`, `src/lib/actions/portal-escola.ts`, `src/components/portal/documentos-portal.tsx`, `src/components/portal/portal-provider.tsx`, `src/components/documentos/documento-gerador.tsx`, `src/components/censo/escola-form.tsx`): `npx tsc --noEmit` + `eslint` + `npx next build` verde (quickstart §6)
- [ ] T016 Executar quickstart E2E completo (§1–§5) + regressão do Registro 00 do Censo (nenhuma coluna nova no payload — quickstart §7)
- [X] T017 [P] Registrar a feature no resumo do projeto em `AGENTS.md` (espelhar entradas de specs anteriores)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — T001 e T002 em paralelo
- **Foundational (Phase 2)**: depende de T001 — BLOQUEIA validação runtime das stories
- **User Stories (Phase 3+)**: dependem da Fase 2; US1 e US2 são independentes entre si (podem ser feitas em paralelo após a Fase 2); US3 estende arquivos da US2 (sequencial após US2)
- **Polish (Final Phase)**: depende das stories desejadas completas

### User Story Dependencies

- **US1 (P1)**: após Fase 2 — sem dependência de outras stories
- **US2 (P1)**: após Fase 2 — sem dependência da US1 (default opt-out = tudo liberado)
- **US3 (P2)**: após US2 (refina telas criadas na US2)

### Within Each User Story

- T004 → (T005, T006 em paralelo)
- T007 → (T008, T009, T010 em paralelo) → T011 → T012
- T013, T014 em paralelo (arquivos/trechos distintos)

### Parallel Opportunities

- T001 + T002 (arquivos distintos, sem dependência)
- T005 + T006 após T004
- T008 + T009 + T010 após T007
- T013 + T014 após US2

---

## Parallel Example: User Story 2

```bash
# Após T007, lançar juntos:
Task: "Estender EscolaPortalCtx em src/components/portal/portal-provider.tsx"
Task: "Implementar wrappers em src/lib/actions/portal.ts"
Task: "Adicionar props alunoFixo/anoLetivoFixo em src/components/documentos/documento-gerador.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: Foundational (T003 — CRITICAL)
3. Complete Phase 3: User Story 1 (T004–T006)
4. **STOP and VALIDATE**: quickstart §1 (persistência + auditoria + read-only)
5. Valor parcial: configuração pronta; portal segue com tudo visível (default preservado)

### Incremental Delivery

1. Setup + Foundational → base pronta
2. + US1 → configuração por escola funcional (MVP)
3. + US2 → responsável gera do portal (valor fim a fim; quickstart §2–§3)
4. + US3 → estados orientativos (quickstart §4–§5)
5. + Polish → build verde + E2E + Censo + AGENTS.md

### Parallel Team Strategy

Com múltiplos desenvolvedores após Setup + Foundational:

1. Dev A: US1 (T004–T006)
2. Dev B: US2 (T007–T012)
3. US3 após US2; Polish ao final

---

## Notes

- **Pendentes de ambiente (2026-09-27)**: T003 (aplicar `patch_portal_documentos_escola.sql` via SQL Editor — sem acesso DDL neste ambiente) e T016 (E2E manual quickstart §1–§5 com app rodando). Sem a migration aplicada, a leitura normaliza para tudo liberado (opt-out) e `salvarDocumentosPortal` falha ao gravar — comportamento esperado até a aplicação.
- [P] = arquivos diferentes, sem dependência pendente
- [Story] mapeia a tarefa à user story (rastreabilidade US1/US2/US3)
- `preenchimento manual` não gera tarefa de portal (catálogo nasce sem modelos — R7); quando os modelos existirem, basta acrescentar entradas ao catálogo + pills automáticos (FR-009)
- Relatórios gerenciais fora do escopo (assunção da spec)
- Commits após cada tarefa ou grupo lógico; parar nos checkpoints para validar
