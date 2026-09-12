# Tasks: Painel de Rendimento Escolar

**Input**: Design documents from `/specs/028-painel-rendimento-escolar/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/rendimento-actions.md, quickstart.md

**Tests**: Não solicitados na spec — verificação via `npx tsc --noEmit`, `npx next build` e roteiro `quickstart.md` (Polish).

**Organization**: Tarefas agrupadas por user story; cada story é um incremento testável independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos diferentes, sem dependências)
- **[Story]**: user story da spec (US1–US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Migrations, engine compartilhado e registros de navegação/aba

- [x] T001 Criar migration de seed do recurso em `supabase-migrations/patch_rendimento_recurso.sql` (`gestao-pedagogica.rendimento`, padrão `patch_recursos_ocorrencias.sql`)
- [x] T002 Criar migration da coluna em `supabase-migrations/patch_metodo_faixa_atencao.sql` (`faixa_atencao_pp NUMERIC DEFAULT 5`)
- [x] T003 [P] Exportar `computarMediasPeriodo` (pura, sem mudar regra) em `src/lib/actions/avaliacoes-numericas.ts`
- [x] T004 [P] Registrar item "Rendimento Escolar" (`/gestao-pedagogica/rendimento`, recurso `gestao-pedagogica.rendimento`) no submenu Gestão Pedagógica em `src/components/layout/sidebar.tsx`
- [x] T005 [P] Registrar módulo `rendimento` + rota exact em `src/lib/tab-routes.tsx` (padrão Gestão Pedagógica)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base que BLOQUEIA todas as stories — tipos/helpers, config da Faixa, shell da página

**⚠️ CRITICAL**: Nenhuma story começa antes desta fase.

- [x] T006 Criar base de `src/lib/actions/rendimento.ts`: tipos (`FiltrosRendimento`, `PanoramaRendimento`, `ClassificacaoAluno`, `DetalheAluno`, `DetalheTurma`, `SituacaoFinalPanorama`), helper de permissão (`gestao-pedagogica.rendimento/visualizar`), resolver turmas+métodos em lote e períodos globais (R-03/R-04)
- [x] T007 Adicionar campo Faixa de Atenção (0–50, default 5, zod + auditoria existente) na edição de Método em `src/app/(app)/gestao-academica/metodos/` + `src/lib/actions/metodos.ts`
- [x] T008 Criar shell da página em `src/app/(app)/gestao-pedagogica/rendimento/page.tsx` (gate de permissão `EmptyState ShieldAlert`, contexto escola/ano, monta client)

**Checkpoint**: Foundation ready — stories podem começar (US3 depende de US1; demais em paralelo)

---

## Phase 3: User Story 1 — Rendimento geral da escola (Priority: P1) 🎯 MVP

**Goal**: Resumo fixo (filtros + 4 KPIs) e aba Geral com Período, Etapa e Turma (sem drill-down).

**Independent Test**: Abrir `/gestao-pedagogica/rendimento` com ano com notas/frequência; KPIs e 3 sub-abas conferem com Diário/Fechamento; rede mostra 1 action de panorama na carga.

- [x] T009 [US1] Implementar `getFiltrosRendimento` + `getPanoramaRendimento` em `src/lib/actions/rendimento.ts` (bulk em chunks + agregação em memória, turmas não-numéricas excluídas, R-01/R-02/R-09)
- [x] T010 [US1] Criar Resumo fixo em `src/components/rendimento/resumo-filtros-kpis.tsx` (Ano, Período, Escola p/ superadmin + 4 KPIs via `StatCard`)
- [x] T011 [US1] Criar shell de abas em `src/components/rendimento/rendimento-page-client.tsx` (Tabs Geral/Situação com deep-link `?tab=`, padrão `DashboardTabs`)
- [x] T012 [US1] Criar sub-aba Período em `src/components/rendimento/aba-geral-periodo.tsx` (5 indicadores + Recharts linha evolução + tabela de faixas fixas)
- [x] T013 [P] [US1] Criar sub-aba Etapa em `src/components/rendimento/aba-geral-etapas.tsx` (avaliados, média, %acima/abaixo, freq, evolução)
- [x] T014 [US1] Criar sub-aba Turma (tabela, sem drill-down) em `src/components/rendimento/aba-geral-turmas.tsx` (Turma, Alunos, Média, %Acima, Frequência; 1ª coluna sticky)

**Checkpoint**: US1 funcional e testável sozinha (MVP: monitoramento agregado)

---

## Phase 4: User Story 2 — Alunos que precisam de atenção (Priority: P1)

**Goal**: Aba Situação com blocos Adequado/Atenção/Risco, tabela com motivo+tendência e Sheet de detalhe do aluno.

**Independent Test**: Aluno abaixo do mínimo em Risco com motivo; a ≤0,5 da mínima em Atenção; queda ≥1,0 → "Em queda"; Sheet exibe médias, frequência, tendência, por disciplina e pontos de atenção.

- [x] T015 [US2] Implementar `getListaSituacao` + `getDetalheAluno` em `src/lib/actions/rendimento.ts` (precedência risco>atenção>adequado, catálogo de motivos, tendência R-07; linhas = só atenção+risco)
- [x] T016 [US2] Criar aba Situação em `src/components/rendimento/aba-situacao.tsx` (3 blocos + tabela Aluno/Turma/Média/Frequência/Motivo/Tendência com `<Pagination>`)
- [x] T017 [US2] Criar Sheet de detalhe do aluno em `src/components/rendimento/detalhe-aluno-sheet.tsx` (Média Atual/Anterior, Frequência, Tendência, por disciplina, Pontos de Atenção)

**Checkpoint**: US1 + US2 funcionais (MVP completo do período letivo)

---

## Phase 5: User Story 3 — Drill-down da turma (Priority: P2)

**Goal**: Aprofundar turma sob demanda (por disciplina, distribuição, frequência, abaixo da média, evolução).

**Independent Test**: Clicar numa turma carrega os 5 blocos sob demanda (nova action na rede); turma sem notas → estado vazio.

- [x] T018 [US3] Implementar `getDetalheTurma` em `src/lib/actions/rendimento.ts` (reuso do lote; faixas fixas; evolução por ordinal)
- [x] T019 [US3] Adicionar drill-down sob demanda em `src/components/rendimento/aba-geral-turmas.tsx` (expansão/dialog alimentado por `getDetalheTurma`, loading + empty states)

**Checkpoint**: US1 + US2 + US3 funcionais

---

## Phase 6: User Story 4 — Situação Final (Priority: P2)

**Goal**: Sub-aba Situação Final pós-fechamento (blocos dinâmicos, tabela por turma, cruzamento rendimento×resultado).

**Independent Test**: Ano sem fechamento → estado informativo; ano misto → só fechadas + aviso das abertas; colunas dinâmicas rotuladas (sem "Outros"); cruzamento exibe evolução dos reprovados.

- [x] T020 [US4] Implementar `getSituacaoFinal` + `getCruzamentoRendimento` em `src/lib/actions/rendimento.ts` (`turmas.fechada`, rótulos via `labelSituacaoMatricula`, R-08)
- [x] T021 [US4] Criar sub-aba Situação Final em `src/components/rendimento/aba-situacao-final.tsx` (blocos ocorrentes, tabela dinâmica sticky, aviso turmas abertas, gráfico cruzamento)

**Checkpoint**: Todas as stories funcionais e independentes

---

## Phase 6b: Filtro por disciplina na sub-aba Período (evolução FR-005)

**Goal**: Filtrar gráfico de evolução, distribuição e indicadores por disciplina específica.

**Independent Test**: Selecionar "Matemática" altera evolução, distribuição e indicadores para a disciplina; voltar a "Todas" restaura o geral.

- [x] T025 Agregado `porDisciplina` (recorte + evolução) em `src/lib/actions/rendimento.ts` (agrupado pela disciplina base, mesma regra do engine)
- [x] T026 Select de disciplina em `src/components/rendimento/aba-geral-periodo.tsx` (indicadores + evolução + distribuição reagem ao filtro)

---

## Phase 6c: Filtros locais por visualização (sem rolagem ao topo)

**Goal**: Cada bloco tem seu seletor local de Período (/Disciplina); backend calcula todos os recortes num único fetch.

**Independent Test**: Trocar o período no card de Turmas não altera os KPIs do Resumo nem exige rolagem; cada card exibe seu recorte.

- [x] T027 Reestruturação de `getPanoramaRendimento` em `src/lib/actions/rendimento.ts` (`recortes[]`: ano + cada ordinal sobre o mesmo bulk; tipos `RecortePanorama`/`FiltrosPanoramaInput`)
- [x] T028 Seletores locais em `resumo-filtros-kpis.tsx`, `aba-geral-periodo.tsx`, `aba-geral-etapas.tsx`, `aba-geral-turmas.tsx`, `aba-situacao.tsx` (drill-downs herdam o período do card de origem)

---

## Phase 6d: Filtros por card na sub-aba Período (período global só nos KPIs)

**Goal**: Período global volta ao Filtros (só Indicadores Gerais); Evolução com disciplina interna; Distribuição com período (sem ano) + disciplina internos; descrições contextuais.

**Independent Test**: Trocar o período global muda só os KPIs/indicadores; Evolução e Distribuição têm filtros próprios dentro dos cards.

- [x] T029 `resumo-filtros-kpis.tsx` (Período de Análise global, KPIs do recorte), `aba-geral-periodo.tsx` (indicadores do global; disciplina dentro da Evolução; período sem ano + disciplina dentro da Distribuição; descrições de contexto)

---

## Phase 6e: Global sem ano completo + evolução multilinha

**Goal**: Período global só com períodos específicos (default 1º); evolução com linha geral + linhas por disciplina.

**Independent Test**: Filtros sem opção ano; evolução exibe legenda com geral + disciplinas; filtro destaca geral + selecionada.

- [x] T030 `resumo-filtros-kpis.tsx` + `rendimento-page-client.tsx` (global sem ano, default 1º período), `aba-geral-periodo.tsx` (multiline geral + disciplinas, `Legend`, cores por índice)

---

## Phase 6f: Evolução só por disciplina (cores distintas, tooltip, pills de período)

**Goal**: Sem linha geral; pills de Períodos; tooltip com disciplina; paleta distinta + tracejado.

**Independent Test**: Gráfico só com linhas de disciplina; tooltip "Português: 6,67"; pills filtram o eixo X.

- [x] T031 `aba-geral-periodo.tsx` (remove linha geral, `ClickablePill` de períodos, tooltip por série, `CORES_EVOLUCAO` + `strokeDasharray`)
- [x] T032 `aba-geral-periodo.tsx` (pills → Select com "Todos os períodos")
- [x] T033 `aba-geral-periodo.tsx` (paleta `CORES_EVOLUCAO` com os 9 hex do solicitante — exceção documentada à regra de tokens p/ séries do Recharts)

---

## Phase 6g: Filtros da sub-aba Etapa (Etapa, Período sem ano, Disciplina)

**Goal**: 3 filtros locais; métricas por etapa+disciplina.

**Independent Test**: Filtrar etapa/disciplina restringe cards e métricas; período sem ano.

- [x] T034 `rendimento.ts` (`EtapaDisciplina` por recorte) + `aba-geral-etapas.tsx` (3 filtros, cards reagem)
- [x] T035 `aba-geral-etapas.tsx` (filtros 25%, card com hierarquia + badge ao lado do nome + "Média" rotulada, gráfico "Média por etapa"; `CORES_EVOLUCAO` em `format.ts`)
- [x] T036 `aba-geral-etapas.tsx` (gráfico "Média por etapa e disciplina": barras agrupadas por disciplina, legenda, cores estáveis)
- [x] T037 `rendimento.ts` (`TurmaDisciplina` por recorte) + `aba-geral-turmas.tsx` (3 filtros 25%: Etapa, Período, Disciplina)
- [x] T038 `rendimento.ts` (`getRecorteEtapa` + contagens acima/abaixo) + `aba-geral-periodo.tsx` (Etapa por card, sob demanda) + `aba-geral-etapas.tsx` (Etapa multi-seleção + contagens nos cards)
- [x] T039 `aba-geral-etapas.tsx` (Etapa vira select multi-seleção com Popover + "Selecionar todas"/"Limpar" internos, 25% na linha)
- [x] T040 `rendimento.ts` (`getFiltrosSituacao`, filtros etapa/turma/disciplina em `getListaSituacao`) + `aba-situacao.tsx` (sub-aba "Situação por Período", 4 filtros 25%, legenda interpretativa, tabela estilo histórico com expansão; remove `detalhe-aluno-sheet.tsx`)
- [x] T041 `rendimento.ts` (`disciplinaId` em `getDetalheAluno`: médias, pontos e lista por disciplina) + `aba-situacao.tsx` (legenda em tooltip dentro dos cards; detalhe herda disciplina)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validação final transversal

- [x] T022 [P] Rodar `npx tsc --noEmit` e `npx next build` verdes (41+ rotas), corrigir tipos/erros
- [x] T023 [P] Passada responsiva (`<md` cards) + acessibilidade (contraste, `aria-live` em estados, áreas de toque) nos componentes em `src/components/rendimento/`
- [x] T024 Executar roteiro `specs/028-painel-rendimento-escolar/quickstart.md` (8 cenários, incl. negação de permissão e conferência SC-002)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — início imediato; T003–T005 em paralelo
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as stories
- **Stories**: US1 e US2 após Foundation (paralelizáveis entre si); US3 depende de US1 (mesmo arquivo `aba-geral-turmas.tsx`); US4 após Foundation (paralelizável)
- **Polish**: após as stories desejadas

### User Story Dependencies

- **US1 (P1)**: após Foundation — sem dependências de stories
- **US2 (P1)**: após Foundation — integra-se ao shell de abas de US1, mas testável via deep-link `?tab=situacao`
- **US3 (P2)**: após US1 (estende `aba-geral-turmas.tsx`)
- **US4 (P2)**: após Foundation — testável via deep-link `?tab=situacao&sub=situacao-final`

### Parallel Opportunities

- T003, T004, T005 em paralelo; T013 em paralelo com T012/T014 (arquivos distintos)
- US1 × US2 × US4 em paralelo após Foundation (desenvolvedores distintos; US3 aguarda US1)
- T022 × T023 em paralelo

---

## Parallel Example: User Story 1

```bash
# Após T009–T011, lançar componentes de sub-abas juntos (arquivos distintos):
Task: "Criar sub-aba Período em src/components/rendimento/aba-geral-periodo.tsx"
Task: "Criar sub-aba Etapa em src/components/rendimento/aba-geral-etapas.tsx"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Phase 1 Setup + Phase 2 Foundational
2. Phase 3 (US1) → **STOP e VALIDAR** (quickstart cenários 1–3 + SC-002)
3. Deploy/demo

### Incremental Delivery

1. Setup + Foundational → base pronta
2. + US1 → MVP monitoramento → demo
3. + US2 → MVP período letivo completo → demo
4. + US3 → investigação por turma → demo
5. + US4 → pós-fechamento → demo

---

## Notes

- Rota/arquivos exatos em cada tarefa; sem novas dependências npm; sem hex hardcoded
- Migrations aplicadas via SQL Editor (sem CLI Supabase — padrão do repo)
- `frecuencia_minima`: usar o nome real da coluna (typo existente)
- Ausência de testes automatizados é intencional (não solicitados); gates = tsc + build + quickstart
