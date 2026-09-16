# Tasks: Quadro de Aulas — Ajustes + Aulas Extras

**Input**: Design documents from `/specs/030-quadro-aulas-ajustes/`

**Prerequisites**: spec.md, plan.md, data-model.md, quickstart.md

**Tests**: Não solicitados na spec — verificação via `npx tsc --noEmit`, `npx next build` e roteiro `quickstart.md`.

**Organization**: Tarefas agrupadas por user story; cada story é um incremento testável independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos diferentes, sem dependências)
- **[Story]**: user story da spec (US1–US4)

---

## Phase 1: Setup (Status + Migration)

**Purpose**: Base que BLOQUEIA US1 (status) e US4 (tabelas extras)

**⚠️ CRITICAL**: US4 não começa antes de T002 aplicada no banco.

- [x] T001 [US1] Criar `resolverStatusQuadro` (`src/lib/quadro-status.ts` ou `quadro-aulas.ts`): string-compare `YYYY-MM-DD`, `inativo` preservado, fallback Futuro, `hojeRef?` injetável; reproduzir caso 09/02/2026–11/12/2026 @ 30/08/2026 → `ativo`
- [ ] T002 APLICAR no banco via SQL Editor `supabase-migrations/patch_quadro_aulas_extras.sql` (M-01 — **obrigatória antes de US4**: card de extras falha sem as tabelas)

**Checkpoint**: Status derivado provado + tabelas no banco

---

## Phase 2: User Story 1 — Listagem legível com status correto (Priority: P1) 🎯 MVP

**Goal**: Tabela full-width, contraste, status calculado, lápis no editar.

**Independent Test**: Abrir `/gestao-turmas/quadro-aulas` com quadro vigente → 100% largura, títulos contrastados, "Ativo", lápis.

- [x] T003 [US1] `quadro-aulas/page.tsx`: remover `div.px-4`, `TableHead bg-muted text-foreground font-semibold uppercase text-[13px]`, `Eye→Pencil`, status via `resolverStatusQuadro`
- [x] T004 [P] [US1] Validar os 4 casos de status (Futuro/Ativo/Encerrado/Inativo manual) + `tsc` + `build`

**Checkpoint**: US1 funcional sozinha

---

## Phase 3: User Story 2 — Edição com formulário padrão (Priority: P1)

**Goal**: Excluir+Voltar, sem Grupos, DatePicker, 5 colunas, Intervalos, grade com contraste/separação e conflito formatado.

**Independent Test**: Editar quadro e percorrer Identificação → Intervalos → grade conferindo cada ajuste.

- [x] T005 [US2] `cadastro/page.tsx` topo + Identificação: Excluir ao lado de Voltar (ConfirmDialog + redirect); remover Labels Grupo 1/2/3 e divisor; `DatePicker` min/max; grid `lg:grid-cols-5` com Tempo de Aula dentro
- [x] T006 [US2] `cadastro/page.tsx` Intervalos + grade: subcard "Intervalos" com botão acima do vazio; `TableHead` dias contrastado + `border-l` entre colunas; conflito `.slice(0,5)` + `break-words max-w`
- [x] T007 [P] [US2] `tsc` + `build` + revisão visual mobile (5→2→1 colunas, grade com scroll)

**Checkpoint**: US2 testável (formulário padronizado)

---

## Phase 4: User Story 3 — Conflito por sobreposição (Priority: P1)

**Goal**: Sequencial não bloqueia; sobreposto bloqueia com mensagem formatada.

**Independent Test**: Quadro sequencial mesmo professor/horário → salva; sobreposto → conflito + bloqueio.

- [x] T008 [US3] `validarConflitosProfessor(..., vigencia?)` em `quadro-aulas.ts`: join com vigência, pula `!ativo`/`inativo`/`ignoreQuadroId`/sem-sobreposição; `checkConflito` passa `{inicio: dataInicial, fim: dataFinal}`
- [x] T009 [P] [US3] Teste manual dos 2 cenários (sequencial × sobreposto) + `tsc` + `build`

**Checkpoint**: US3 pronta (regra correta)

---

## Phase 5: User Story 4 — Aulas Extras + Diário (Priority: P2)

**Goal**: Card com blocos por sábado letivo, CRUD de aulas/intervalos, sincronização com Calendário, frequência no Diário.

**Independent Test**: Configurar aula extra → frequência no Diário → remover sábado (bloqueio) → excluir frequência → remover (confirmação).

- [x] T010 [US4] `quadro-aulas.ts`: `getDiasExtrasDoCalendario(turmaId)` (etapa→calendários do ano→eventos `dia_letivo` + filtro etapa) + `getExtrasDoQuadro` + `saveExtrasDoQuadro` (soft-inativa+reinsere + auditoria) + `removerDataExtra` (conta frequência, bloqueia se >0)
- [x] T011 [US4] `cadastro/page.tsx`: card "Aulas Extras" pós-grade (bloco por data, Adicionar Aula início/fim/disciplina/professor, lixeira por aula, intervalos por data, derivação em tempo real, ConfirmDialog/bloqueio na remoção)
- [x] T012 [US4] Diário: `getAulasDaTurma` + `listarDiasComAula` unem extras (`extra:true`); validar `registrarFrequenciaAula/Lote` sem mudança; documentar lacuna Boletim/Rendimento/Fechamento (incluir ids extras ou follow-up)

**Checkpoint**: US4 testável de ponta a ponta

---

## Phase 6: Polish (Gates finais)

- [x] T013 [P] `quickstart.md` executado por completo (US1→US4)
- [x] T014 [P] Varreduras: `grep 'type="date"'` e `grep 'Eye'` limpos no módulo quadro-aulas; `grep '#[0-9A-Fa-f]\{6\}'` sem hex novo; `npx tsc --noEmit` + `npx next build` verdes
