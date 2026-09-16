# Tasks: Métodos de Avaliação — Ajustes

**Input**: Design documents from `/specs/033-metodos-ajustes/`

**Prerequisites**: spec.md, plan.md, data-model.md, quickstart.md

**Tests**: Não solicitados na spec — verificação via `npx tsc --noEmit`, `npx next build` e roteiro `quickstart.md`.

**Organization**: Tarefas agrupadas por user story; cada story é um incremento testável independente. 0 migrations (nada a aplicar no banco).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos/blocos diferentes, sem dependências)
- **[Story]**: user story da spec (US1–US7)

---

## Phase 1: Setup — Lista + rotas + extração do form (US1 + US2 — base)

- [ ] T001 [US1] `metodos/page.tsx`: busca ~33% (`searchClassName` opcional no `FilterBar` ou `SearchInput w-1/3 min-w-[220px]`); remover wrapper `px-4` da tabela; `TableHead bg-muted text-[13px] uppercase tracking-wider`; sem `text-xs` novo
- [ ] T002 [US2] Extrair `MetodosForm.tsx` → `components/metodos/metodo-form.tsx` (mesma lógica de dados; `onSaved/onCancel` viram navegação ou callbacks finos); criar `metodos/novo/page.tsx` (Suspense + `?escola=` + guard criar) e `metodos/[id]/page.tsx` (`useTabParams()` + guards + Excluir com `ConfirmDialog` + Voltar); `page.tsx` da lista navega via `router.push` (remove `Dialog`/`modalOpen`/`editId`)
- [ ] T003 [US2] `lib/tab-routes.tsx`: registrar `exact('/gestao-academica/metodos/novo')` + regex `/gestao-academica/metodos/([^/]+)` no módulo `metodos` (estática antes da dinâmica)

**Checkpoint**: Lista nova + páginas novo/editar navegáveis, keep-alive preservado, excluir nas duas superfícies

---

## Phase 2: User Story 3 — Identificação e tipos em Pills (Priority: P1)

**Goal**: Ativo + 4 tipos em `ClickablePill`, condicionais e períodos intactos.

**Independent Test**: Alternar Ativo e tipos; cards condicionais abrem/fecham; períodos persistem (§3 do quickstart).

- [ ] T004 [US3] Form extraído: `ativo` → 1 `ClickablePill`; `tipos_avaliacao` → 4 `ClickablePill` multi; remover `Checkbox` desses blocos; períodos 1–4 intactos

**Checkpoint**: US3 testável de ponta a ponta

---

## Phase 3: User Story 4 — Numéricas em Pills + Opções em colunas (Priority: P1)

**Goal**: 4 selects/checkbox-groups viram Pills (single/multi corretos); Opções em grade.

**Independent Test**: Trocar cada opção, salvar, reabrir; condicionais de recuperação intactas (§4 do quickstart).

- [ ] T005 [P] [US4] `forma_registro` → 2 Pills únicas em `max-w-xs` (remove `Select`); `permite_recuperacao` → 3 Pills multi (remove `Checkbox`, condicionais intactas)
- [ ] T006 [P] [US4] `tipo_media_periodo` + `tipo_resultado_final` → 2+2 Pills únicas (remove `Select`s); Opções → `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (checkboxes mantidos)

**Checkpoint**: US4 testável

---

## Phase 4: User Stories 5 + 6 — Pills explicadas (Priority: P1)

**Goal**: Aprovações e Arredondamento em Pills com tooltips literais; condicionais intactas.

**Independent Test**: Alternar modos, ler tooltips, salvar e reabrir cada modo (§5–§6 do quickstart).

- [ ] T007 [US5] `aprovacao_automatica` → Pill (esmaecimento mantido); `usa_media_ponderada` → 2 Pills únicas (Aritmética=false/Ponderada=true) + `Tooltip` com textos literais da spec; remover "(Se desmarcado…)" e fórmula crua; pesos só na Ponderada
- [ ] T008 [P] [US6] `tipo_arredondamento` → 3 Pills únicas + tooltips literais da spec (remove 3 `Select`s); intervalos/margem e condicionais intactos; `aplica_*` → 3 Pills multi (remove `Checkbox`es)

**Checkpoint**: US5 + US6 testáveis

---

## Phase 5: User Story 7 — Parecer, Conceitos e Níveis (Priority: P1)

**Goal**: Pills finais + remoção de cores/fundo + lixeira com confirmação.

**Independent Test**: CRUD de conceitos/níveis com confirmação; zero seletor de cor; salvar e reabrir (§7 do quickstart).

- [ ] T009 [US7] `registro_geral` + `Utiliza Conceito Final` → Pills (tooltip/texto do parecer mantidos; lista de finais como hoje)
- [ ] T010 [US7] `CardConceitosList` + `CardNiveisList`: remover `COLORS_*`, `ColorPreview`, helpers de contraste, `type="color"`; grupo sem `bg-muted`; lixeira `items-center` maior (`h-11 w-11`) com `ConfirmDialog` por item

**Checkpoint**: US7 testável

---

## Phase 6: Polish (Gates finais)

- [ ] T011 [P] `quickstart.md` executado por completo (§1→§7) — **QA manual pendente**
- [ ] T012 [P] Varreduras: `grep 'type="color"'` e `grep '#[0-9A-Fa-f]\{6\}'` limpos no módulo metodos; `grep 'Dialog'` sem modal de método restante; `npx tsc --noEmit` + `npx next build` verdes
