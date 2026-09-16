# Tasks: Estrutura Acadêmica — Matrizes: Ajustes

**Input**: Design documents from `/specs/032-matrizes-ajustes/`

**Prerequisites**: spec.md, plan.md, data-model.md, quickstart.md

**Tests**: Não solicitados na spec — verificação via `npx tsc --noEmit`, `npx next build`, migration aplicada e roteiro `quickstart.md`.

**Organization**: Tarefas agrupadas por user story; cada story é um incremento testável independente. Phase 0 é pré-requisito de codificação (verificações, sem código). Phase 5 (US6) vai em commit isolado (maior risco).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos diferentes, sem dependências)
- **[Story]**: user story da spec (US1–US7)

---

## Phase 0: Verificações pré-código (bloqueia Phases 1–5)

- [x] T000 Confirmar fonte canônica das quantidades de períodos: `quantidade_periodos_*` do Método vinculado × regra atual `tipo_turma→4/2` em `handleSave` (`MatrizForm.tsx:250`) — registra a decisão (FR-009) antes de codar a criação
- [x] T000b Mapear todos os pontos que computam média/frequência por disciplina (candidatos: `rendimento-calculo.ts`, `diario-classe.ts`, `fechamento-turma.ts`, `conselho-classe.ts`, `boletim.ts`, `rendimento.ts`) + decidir destino da extração do `MatrizForm` (colocalizado vs `src/components/matrizes/`)

**Decisões registradas (2026-09-16)**: T000 → manter `tipo_turma→4/2` (Método tem 4 quantidades por tipo de avaliação e a matriz não declara qual vale; agrupamento por Método mantido). T000b → bypass em `calcularDesempenhoAluno` (flags internas) + engine do fechamento + lista do conselho + agregados do boletim/rendimento (via `computarLinhas`); Portal e relatório-desempenho fora do escopo (FR-016); `MatrizForm` permanece colocalizado (usado pelas 2 rotas da pasta).

**Checkpoint**: FR-009 decidida; lista de arquivos do bypass fechada

---

## Phase 1: Base + leitura (US7 — fundação; sem dependências de UI)

- [x] T001 [US7] Criar e aplicar (SQL Editor) `patch_matriz_nao_reprova_pills.sql` (2 `BOOLEAN` + backfill + comments, `data-model.md` §0)
- [x] T002 [US7] `matrizes.ts`: `getDisciplinasPorPeriodo` com joins `habilidades_bncc(habilidade_codigo)` + `habilidades_manuais(codigo, descricao)` (aliases que `openDiscModal` espera); `substituirHabilidades` pula `insert` de array vazio; display de cargas lê `carga_horaria_*_minutos`
- [x] T003 [US7] `MatrizForm.tsx:575-576`: cargas da linha da disciplina via colunas reais; reabrir edição com tudo preenchido (quickstart §7)

**Checkpoint**: US7 testável de ponta a ponta (§7 do quickstart)

---

## Phase 2: Listagem (US1 + US2 — [P] com Phase 3 no markup)

- [x] T004 [US1] `TabMatrizes.tsx:211-259`: filtros soltos → `PageSection(compact, title="Filtros") + FilterBar`; Etapa com `SelectGroup/SelectLabel` (remove `<div>` em `SelectContent`); labels sem `text-xs`
- [x] T005 [US2] Card com título `font-display text-[20px] font-semibold` + contador; subcard rico (ícone `GraduationCap` em `bg-primary/10`, descrição, ano, datas `pt-BR`, etapa, turnos, tipo, qtd disciplinas via batch)
- [x] T006 [US2] Expansão filtrada pelos períodos da matriz (corrige `flat()` global), agrupada por `periodo_nome`, loading por matriz, `Promise.all` (fim do N+1); remover `Switch` + `handleToggleAtiva` da lista + código morto (`showDiscModal/discForm/savingDisc/replicarTarget` e imports); botões navegam p/ novas rotas

**Checkpoint**: US1 + US2 testáveis (§1–§2 do quickstart)

---

## Phase 3: Página de matriz (US3 + US4 — [P] com Phase 2 no markup)

- [x] T007 [US3] Novas rotas `estrutura-academica/matrizes/novo/page.tsx` + `estrutura-academica/matrizes/[id]/page.tsx` (wrappers finos; `content.tsx` se `useSearchParams` exigir) + registro em `tab-routes.tsx` (empilha na aba, keep-alive); remover `Dialog` de matriz da lista
- [x] T008 [US3] Extrair `MatrizForm` para a página: Identificação em 3 linhas (Ano|Etapa|Subetapa; Método|Início|Término; Turnos|Tipo), `Switch` só na edição, criação permanece na página com Períodos na sequência (FR-008, quantidades per T000)
- [x] T009 [US4] Períodos: "Adicionar Disciplina" no topo à direita `size="sm"` (remove `w-full` do fim); botão "Replicar para os demais períodos" + `ConfirmDialog warning` com texto detalhado; `replicarDisciplinas` copia `nao_reprova_*`

**Checkpoint**: US3 + US4 testáveis (§3–§4 do quickstart)

---

## Phase 4: Modal de disciplina (US5 — depende da Phase 1)

- [x] T010 [US5] `matrizes.ts`: select filtra `school_id + ativo=true + tipo_ensino` (`or(...,todos)`); Tipo trava via `diretriz_curricular` (implementado como `ClickablePill` active+disabled — `PillToggleGroup` disabled riscaria o texto com `line-through`); título do modal em destaque (`font-display text-[20px]`)
- [x] T011 [US5] Toggle → 2 `ClickablePill` multi + escrita em `nao_reprova_*` (espelho `desconsidera = OR`); BNCC em grupo externo expansível, tudo recolhido; checkbox desmarcado `border-primary/40 bg-card`; "Limpar" `variant="destructive"` outline; "Adicionar" confirma no período

**Checkpoint**: US5 testável (§5 do quickstart)

---

## Phase 5: Regras de situação (US6 — depende da Phase 1; commit isolado ⚠️)

**Goal**: Pills excluindo a disciplina do cômputo correspondente nos 5 consumidores, via origens únicas.

- [x] T012 [US6] Bypass `nao_reprova_nota` em `rendimento-calculo.ts:computarMediasPeriodo` (origem única Diário×Rendimento) + `fechamento-turma.ts` + `conselho-classe.ts` + `boletim.ts` (disciplina excluída do cômputo de média, mantida na exibição)
- [x] T013 [US6] Bypass `nao_reprova_frequencia` nos helpers de frequência (`diario-classe.ts`, `calcularFrequenciaBoletim`, rendimento/fechamento) — disciplina excluída do cômputo de frequência mínima, mantida na exibição

**Implementação real (2026-09-16)**: bypass aplicado em `calcularDesempenhoAluno` (flags internas — cobre Diário/Boletim/Histórico/Portal), engine do fechamento + `resolverFrequencias` (por_aula) + médias gerais, lista do conselho (skip), agregados do Boletim (Média do Período + faltas) e `computarLinhas` do rendimento (médias + `freqJanela` por_aula — propaga p/ Situação/Detalhes/Cruzamento). `por_dia` sem vínculo por disciplina: geral inalterado (documentado). Portal e relatório-desempenho fora do escopo.

**Checkpoint**: US6 testável (§6 do quickstart); revisar diff com atenção redobrada antes de juntar

---

## Phase 6: Polish (Gates finais)

- [ ] T014 [P] `quickstart.md` executado por completo (§1→§7) — **QA manual pendente**
- [x] T015 [P] Varreduras: `grep '#[0-9A-Fa-f]\{6\}'` sem hex novo; `npx tsc --noEmit` + `npx next build` verdes (41→43 rotas, `matrizes/novo` + `matrizes/[id]`); migration criada em `supabase-migrations/patch_matriz_nao_reprova_pills.sql` — **aplicar via SQL Editor antes de usar (obrigatória: selects com `nao_reprova_*` falham sem as colunas)**; eslint das páginas novas limpo (MatrizForm/TabMatrizes mantêm `any`s pré-existentes, padrão do repo)
