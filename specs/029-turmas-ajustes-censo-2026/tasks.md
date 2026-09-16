# Tasks: Turmas — Ajustes e Alinhamento Censo 2026

**Input**: Design documents from `/specs/029-turmas-ajustes-censo-2026/`

**Prerequisites**: spec.md, plan.md, data-model.md, quickstart.md

**Tests**: Não solicitados na spec — verificação via `npx tsc --noEmit`, `npx next build`, varreduras `grep` e roteiro `quickstart.md`.

**Organization**: Tarefas agrupadas por user story; cada story é um incremento testável independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos diferentes, sem dependências)
- **[Story]**: user story da spec (US1–US4)

---

## Phase 1: Setup (Catálogos + Migrations)

**Purpose**: Base oficial que BLOQUEIA todas as stories

**⚠️ CRITICAL**: Nenhuma story começa antes desta fase.

- [x] T001 Criar `src/data/censo/atividades-complementares.ts` (~150 itens da planilha, pulando 15002/15003/19101/19104/19105/22032, carry-forward de Área/Subárea)
- [x] T002 Corrigir `src/data/censo/etapas-ensino.ts` (69=iniciais, 70=finais, 64→308, nomes oficiais; decidir 30–34 e "Escolarização")
- [x] T003 Completar `src/data/censo/tipo-turma-mediacao.ts` (+EAD/305, tipo 9 sem 56/305, 305-tipo-9 vazio) + criar `src/data/censo/tipo-turma-codigos.ts`
- [ ] T004 [P] APLICAR no banco via SQL Editor `supabase-migrations/patch_turmas_atividades_complementares.sql` (M-01 — arquivo criado; **obrigatória antes de usar**: inserts com as novas colunas falham sem ela)
- [ ] T005 [P] APLICAR no banco via SQL Editor `supabase-migrations/patch_turmas_profissionais_atividades.sql` (M-02 — arquivo criado)

**Checkpoint**: Catálogos + colunas no banco — stories podem começar

---

## Phase 2: User Story 1 — Turma curricular com validação oficial (Priority: P1) 🎯 MVP

**Goal**: Modal com "Turma de:", Multietapa alinhada, Etapa condicional, matriz Tipo × Etapa, Formas/Disciplinas 4 cols + Selecionar Todas, sem Modalidade.

**Independent Test**: Criar Curricular Presencial etapa 15 (salva); tentar etapa incompatível (bloqueia com toast).

- [x] T006 [US1] `TurmaForm.tsx`: label "Turma de:" + rename "Educação Especial"; Multietapa `items-end`; remover Modalidade (campo, validação `handleSave`, gate da agregada)
- [x] T007 [US1] `TurmaForm.tsx`: Etapa Agregada/Etapa condicionais (disabled+null fora de 6/9; opções das etapas ativas escola/ano) + matriz Tipo × Etapa no save e nos selects
- [x] T008 [US1] `TurmaForm.tsx`: Formas de Organização (4 cols + label "Grupos Não Seriados") e Disciplinas (4 cols + "Selecionar Todas" no topo direito)
- [x] T009 [US1] `turmas.ts`: tipos sem `modalidade`, payload `atividade_complementar_1..6`, validação server-side espelho da matriz + auditoria mantida
- [x] T010 [US1] `TabEtapas.tsx`: 7 grupos oficiais (nomes/códigos da planilha)

**Checkpoint**: US1 funcional sozinha (cadastro curricular válido/bloqueado corretamente)

---

## Phase 3: User Story 2 — Atividade Complementar ponta a ponta (Priority: P1)

**Goal**: Card condicional, select agrupado + Adicionar (6, dedupe), profissional com atividades, export Códigos 1–6.

**Independent Test**: Turma complementar com 3 atividades + profissional em 2 → Registro 20 com `_1..3` em ordem e `_4..6` nulos.

- [x] T011 [US2] `TurmaForm.tsx`: card "Atividades Complementares" condicional (tipo 4/9) com select por Área/Subárea (só nomes) + Adicionar/Remover (6, sem duplicadas)
- [x] T012 [US2] `TurmaForm.tsx` (modal profissional): swap Disciplinas→"Atividades Complementares do Profissional" em turma complementar + "Selecionar Todas"
- [x] T013 [US2] `censo.ts` + `censo-regras.ts`: `buildRegistro20` emite `atividade_complementar_1..6`; Registro 50 aceita `atividades_ids`; mapa rótulo→código em tipo/forma

**Checkpoint**: US2 testável (fluxo complementar completo até o export)

---

## Phase 4: User Story 3 + Listagem (Priority: P2)

**Goal**: Vínculo com histórico (Calendar, inativar com término, ConfirmDialog) + filtros "Tipo", tabela full-width, títulos de modal.

**Independent Test**: Inativar vínculo (badge Inativo, histórico intacto); lixeira abre ConfirmDialog; tabela sem margens.

- [x] T014 [P] [US3] Modal profissional: Data de Início/Término em Popover+Calendar padrão; ação Inativar (pede término → `ativo=false`+`data_encerramento`); lixeira via `ConfirmDialog` (remover `confirm()`)
- [x] T015 [P] `turmas/page.tsx`: grupo "Tipo" nos filtros; tabela sem `px-4` + header `bg-muted text-foreground`; `DialogTitle` hierarquizados (Turma + Profissional)
- [x] T016 Remoção da modalidade no código (coluna da tabela + `dashboard.ts`/`alunos-por-modalidade-chart.tsx` delete + uso em `(auth)/page.tsx`; varreduras limpas) + arquivo `patch_turmas_remove_modalidade.sql` criado
- [ ] T016b APLICAR no banco via SQL Editor `supabase-migrations/patch_turmas_remove_modalidade.sql` (M-03 — **após** T016; código já não referencia a coluna)

**Checkpoint**: US3 + listagem prontas

---

## Phase 5: Polish (Gates finais)

**Purpose**: Verificação cruzada de toda a spec

- [ ] T017 Executar `quickstart.md` completo (US1–US4 + edge cases) e corrigir achados
- [x] T018 Gates: `npx tsc --noEmit` + `npx next build` verdes; `grep -ri modalidade src supabase-migrations` (só docs históricos de specs antigas); `grep confirm( src/app/**/gestao-turmas` vazio; 0 hex hardcoded nos arquivos tocados; 0 novas deps
