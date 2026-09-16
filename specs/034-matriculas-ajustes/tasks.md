# Tasks: Alunos Matriculados — Ajustes

**Input**: Design documents from `/specs/034-matriculas-ajustes/`

**Prerequisites**: spec.md, plan.md, data-model.md, quickstart.md

**Tests**: Não solicitados na spec — verificação via `npx tsc --noEmit`, `npx next build` e roteiro `quickstart.md`.

**Organization**: Tarefas agrupadas por user story; cada story é um incremento testável independente. 2 migrations (aplicar no banco via SQL Editor: `patch_codigo_matricula.sql` antes de US2 + `patch_remove_dispensas.sql` na US4).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos/blocos diferentes, sem dependências)
- **[Story]**: user story da spec (US1–US6)

---

## Phase 0: Verificação + migration (base, sem dependências)

- [ ] T000 Verificação: confirmar (a) valores reais de `transporte_responsavel` em leitura/escrita, (b) fonte verdadeira dos veículos (`veiculo_*` vs JSONB), (c) FKs que bloqueiam hard delete da matrícula, (d) ordenação atual das dispensas — registrar achados no data-model
- [ ] T001 [US2] Criar `supabase-migrations/patch_codigo_matricula.sql` (coluna + backfill + UNIQUE por escola), aplicar via SQL Editor e conferir sequência 1..N por escola (§0 do quickstart)

**Checkpoint**: Mapeamentos confirmados + códigos legados numerados

---

## Phase 1: User Story 1 — Filtros e tabela (Priority: P1)

**Goal**: Busca reduzida + filtro Turma server-side + tabela full-width destacada + coluna ID + lixeira com confirmação.

**Independent Test**: §1 do quickstart.

- [ ] T002 [US1] `filter-bar.tsx`: prop opcional `searchClassName` (retrocompatível) para largura reduzida da busca
- [ ] T003 [US1] `matriculas/page.tsx`: Select Turma (turmas ativas escola+ano, server-side via `turma_id`); remove `px-4`; header com destaque (`text-foreground`, sem hex); coluna ID `font-mono` antes do Aluno; lixeira + `ConfirmDialog` → `deleteMatricula` + reload (alargar Ações p/ ~`w-[120px]`)

**Checkpoint**: US1 testável de ponta a ponta

---

## Phase 2: User Story 2 — Código + Excluir no Editar (Priority: P1)

**Goal**: Código sequencial gerado/exibido + Excluir no header do Editar.

**Independent Test**: §2 do quickstart.

- [ ] T004 [US2] `lib/actions/matriculas.ts`: `codigo_matricula` no select; `max+1` por escola no `createMatricula`; `deleteMatricula(id, pessoaId)` (permissão excluir + auditoria + erro FK amigável)
- [ ] T005 [US2] `cadastro/content.tsx` (bloco Dados): campo read-only "Código de Matrícula" antes do Ano Letivo ("Gerado ao salvar" no novo); Ano Letivo com largura reduzida; Excluir (destructive + `ConfirmDialog`) no `PageHeader` do Editar ao lado de Voltar

**Checkpoint**: US2 testável

---

## Phase 3: User Story 3 + remoção Dispensas (US4 REVOGADA) (Priority: P1)

**Goal**: Pills de poder público + subcard Veículos em 2 grupos; Dispensa de Disciplinas removida por completo.

**Independent Test**: §3–§4 do quickstart.

- [x] T006 [P] [US3] `content.tsx` (bloco Transporte): `Select` → 3 `ClickablePill` únicas (labels Nenhum/Estadual/Municipal, valores do banco); subcard "Veículos Utilizados" em 2 grupos multi (fonte da Fase 0); Nenhum oculta + limpa no save; remover vars mortas `veiculosRodoviarios/Aquaviarios`
- [x] T007 [P] [US4 REVOGADA] Remoção total: card de `content.tsx` (estado, handlers, save em lote, imports `Badge`/`Separator`/`Plus`/`BookOpen`); actions + type `Dispensa` + `getDisciplinasDaTurma` órfã de `matriculas.ts`; tabela via `supabase-migrations/patch_remove_dispensas.sql`; textos de confirmação ajustados; docs (`AGENTS.md`, `CONTEXTO.md`, specs/034)

**Checkpoint**: US3 + US4 testáveis

---

## Phase 4: User Stories 5 + 6 — Movimentações + rodapé (Priority: P1)

**Goal**: Histórico com badge, 2 datas e campos por tipo; footer sticky padrão.

**Independent Test**: §5–§6 do quickstart.

- [ ] T008 [US5] `situacoes-matricula.ts` + `content.tsx` (bloco Movimentações): `StatusBadge` por tipo; 2 datas rotuladas por item; campos por tipo (Transferência→Obs; Reclassificação→Etapa+Turma+Obs; Remanejamento→Destino+Obs; Desistência→Motivo+Obs) com nomes resolvidos em batch; modais inalterados
- [ ] T009 [P] [US6] `content.tsx` (rodapé): remover botão flutuante + `pb-20`; footer sticky Cancelar (outline, volta à lista) + Salvar (`h-11`, desabilitados ao salvar)

**Checkpoint**: US5 + US6 testáveis

---

## Phase 5: Polish (Gates finais)

- [ ] T010 [P] `quickstart.md` executado por completo (§0→§6) — **QA manual pendente**
- [ ] T011 [P] Varreduras: `grep '#[0-9A-Fa-f]\{6\}'` limpo no módulo matriculas; `grep 'fixed bottom-6 right-6'` sem flutuante restante; `npx tsc --noEmit` + `npx next build` verdes
