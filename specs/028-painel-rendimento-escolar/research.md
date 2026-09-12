# Research: Painel de Rendimento Escolar (028)

**Date**: 2026-09-12
**Spec**: `specs/028-painel-rendimento-escolar/spec.md`
**Método**: leitura direta do código existente (engine acadêmico, permissões, navegação, padrões de lote). Todas as decisões abaixo reutilizam regras/fontes já existentes — nenhuma regra paralela.

## R-01 — Motor de médias: reutilizar `computarMediasPeriodo` em lote

- **Decision**: O painel NÃO chama `calcularDesempenhoAluno` por aluno/disciplina. As actions do painel carregam linhas brutas em lote (`academico_notas`, `academico_recuperacoes`, `conselho_classe_resultados` com `turma_id IN (...)`) e computam em memória com a mesma matemática do engine. Para isso, `computarMediasPeriodo` (hoje privada em `src/lib/actions/avaliacoes-numericas.ts:497`) passa a ser exportada (extração pura, sem alterar regra).
- **Rationale**: `calcularDesempenhoAluno` faz ~3 queries por (aluno × disciplina) — inviável em escala escolar. O padrão de lote com a mesma regra já existe e é precedente oficial: `relatorio-desempenho.ts:96-167` ("espelha calcularDesempenhoAluno em lote"), `fechamento-turma.ts:169` e `portal.ts:507-510` (`calcularMediasPeriodoTurma`).
- **Alternatives considered**: (a) N×`calcularDesempenhoAluno` — rejeitada (N+1 em milhares de alunos); (b) view SQL pré-calculada — rejeitada v1 (regra duplicada em SQL divergiria do engine; considerar só se a análise de performance exigir, conforme a spec permite).

## R-02 — Frequência em lote com a semântica do Boletim

- **Decision**: Frequência calculada sobre loads em lote por turma (`academico_frequencias_dia` / `academico_frequencias_aula` com filtros de janela por `dia_letivo`/`data_aula`), agregando em memória com as regras de `calcularFrequenciaBoletim` (`boletim.ts:184-265`): `FJ` = presença + falta; `por_aula` conta só `horario_id` em horários ativos do quadro ativo; interseção janela da matrícula (`data_matricula`/`data_saida`) ∩ janela do período avaliativo.
- **Rationale**: Mesma fonte e mesma regra do Boletim/Diário/Painel do Aluno; evita divergência. O critério (`por_dia`/`por_aula`) vem do método via `resolverMetodoBoletim` (`boletim.ts:66-109`).
- **Alternatives considered**: (a) N×`calcularFrequenciaBoletim` — rejeitada (1–3 queries por aluno); (b) percentual do Painel do Aluno — é a mesma regra, mas calculada por aluno; o painel usa o lote equivalente.

## R-03 — Resolução método → turma (matriz → método)

- **Decision**: Reutilizar o caminho canônico: `turmas.(school_id, ano_letivo_id, etapa_ensino_id)` → `academico_matrizes_curriculares.metodo_avaliacao_id` → `academico_metodos_avaliacao` (+ `..._numerico`, `..._aprovacao`). Flag numérica: `tipos_avaliacao.numerico === true` (cf. `boletim.ts:105-106`, `fechamento-turma.ts:131`). Turmas cujo método não tem `metodoId` ou `temNumerico=false` são excluídas de todos os cálculos (decisão Q1 da spec).
- **Rationale**: É o mesmo resolver usado por Boletim, Fechamento, Relatório de Desempenho e Portal — garante "só numérico conta; misto conta só a parte numérica".
- **Parâmetros por turma**: `media_minima` ← `academico_metodos_avaliacao_aprovacao.media_minima` (default 7); `frequencia_minima` ← `academico_metodos_avaliacao.frecuencia_minima` (observar o typo existente `frecuencia_` — usar o nome real da coluna) (default 75); `qtd` ← `quantidade_periodos_numerico` (default 4); `criterio` ← `criterio_frequencia`.

## R-04 — Período de Análise global (escola) vs. ordinais por turma

- **Decision**: A lista global de períodos do filtro vem dos eventos `periodo_avaliativo` dos calendários do ano letivo (mesma query de `listarPeriodosAvaliativos`, sem filtro de etapa — união ordenada por `data_inicio`), com fallback `quantidade_periodos_numerico` ("Período N"). O valor selecionado é um **ordinal posicional**: "Período 2" = `ordem 2` na lista própria de cada turma (cada turma resolve seus avaliativos filtrados por etapa, como hoje).
- **Rationale**: Turmas de etapas distintas podem ter avaliativos distintos; o ordinal posicional é exatamente a semântica da coluna `periodo` do motor. "Ano Letivo completo" usa `media_anual` do engine (pesos de `pesos_periodos`, só períodos com nota) e frequência com janela `null` (ano todo ∩ matrícula).
- **Alternatives considered**: (a) datas globais aplicadas a todas as turmas — rejeitada (quebraria turmas com calendários/etapas distintos); (b) um período por etapa no filtro — rejeitada (complexidade sem ganho; o ordinal já é comparável).

## R-05 — Classificação Adequado / Atenção / Risco (precedência e motivos)

- **Decision**: Por aluno (na turma, no Período de Análise), com precedência **Risco > Atenção > Adequado**:
  - **Risco** se `media < media_minima` OU `frequencia < frequencia_minima` (qualquer uma basta; ambas = motivo "Rendimento + frequência").
  - **Atenção** se (não-risco) E [`media < media_minima + banda_media` OU `frequencia < frequencia_minima + 5pp` OU queda `media_anterior − media_atual >= 1,0`].
  - **Adequado** caso contrário.
  - Motivos objetivos de catálogo fechado: "Média abaixo do esperado", "Frequência abaixo do esperado", "Rendimento + frequência", "Próximo do limite da média", "Próximo do limite da frequência", "Queda de rendimento" (+ disciplina da maior queda no detalhe).
- **Rationale**: Implementa literalmente FR-008/FR-010 sem thresholds fixos — tudo deriva do método da turma + Faixa de Atenção configurável.

## R-06 — Faixa de Atenção: coluna no método + campo na tela de Métodos

- **Decision**: Nova coluna `faixa_atencao_pp NUMERIC DEFAULT 5` em `academico_metodos_avaliacao` (migration) + campo numérico na edição do Método (tela `/gestao-academica/metodos`, RHF+zod). Semântica: pontos percentuais da escala — banda da média = `faixa_atencao_pp/100 × media_maxima_periodo` (5pp em escala 0–10 = 0,5); banda da frequência = `faixa_atencao_pp` somado ao mínimo (75% → 80%).
- **Rationale**: O limite mínimo varia por método/turma, logo a faixa pertence ao método (não a um setting global) — e "ajustável sem novo desenvolvimento" = campo editável na tela de Métodos existente. Default 5 preserva o sugerido na spec.
- **Alternatives considered**: (a) tabela global de configurações por escola — rejeitada (criaria novo padrão de settings; o limite é por método); (b) constante no código — rejeitada (viola FR-009).

## R-07 — Tendência (margem 1,0 ponto)

- **Decision**: `diff = media_atual − media_anterior`; `diff >= +1,0` → Melhorando; `diff <= −1,0` → Em queda; senão Estável. Período específico P>1: compara P vs P−1. P=1 ou Ano completo: compara os dois últimos períodos com média não-nula (sem anterior → Estável). Justificativa da margem: 1,0 = 10% da escala 0–10 — mesma ordem de grandeza da granularidade de julgamento docente (proposta do solicitante na spec, sem padrão concorrente no sistema).
- **Rationale**: Adota a proposta do solicitante; margem maior que a banda de atenção (0,5) para não classificar ruído como mudança relevante.

## R-08 — Situação Final: colunas dinâmicas com rótulos oficiais

- **Decision**: Sub-aba lê `academico_matriculas.situacao` das turmas com `turmas.fechada = true` (+ `verificarTurmaFechada`, `fechamento-turma.ts:84-87`); colunas = valores distintos **ocorrentes**, rotulados via `labelSituacaoMatricula` (`situacoes-matricula.ts`) — sem "Outros", sem situações inventadas. "Em Andamento" = rótulo de `Ativo`. Turmas com `fechada=false` listadas em aviso "ainda não fechadas" e excluídas dos blocos.
- **Rationale**: Reconcilia a lista de 8 nomes da spec com o catálogo real de 12 valores do sistema (ex.: `Desistente`→"Deixou de frequentar", variantes de conselho/frequência) — o orientado pela spec ("exatamente a nomenclatura existente") é o catálogo, e a dinamicidade satisfaz "uma coluna para cada situação com ocorrência".
- **Cruzamento rendimento × resultado**: para o recorte (ex.: reprovados), a action retorna a evolução das médias por período de cada aluno (reuso do lote R-01) para gráfico de linhas/barras.

## R-09 — Estratégia de carga (performance)

- **Decision**: 3 níveis progressivos, um por necessidade de tela:
  1. **Panorama** (carga inicial, aba Geral): só agregados por período/etapa/turma + KPIs — 1 action (`getPanoramaRendimento`), bulk loads com `turma_id IN (...)` em chunks + agregação em memória.
  2. **Situação** (ao abrir a aba): `getListaSituacao` retorna contagens + linhas só de Atenção/Risco (Adequado = só contagem) — payload limitado; paginação client-side com `<Pagination>` oficial.
  3. **Drill-down turma / detalhe aluno / situação final**: actions dedicadas sob demanda (`getDetalheTurma`, `getDetalheAluno`, `getSituacaoFinal`).
- **Rationale**: Cumpre FR-016 e as considerações de performance da spec (hierarquia Escola→Etapa→Turma→Disciplina→Aluno, sem recálculos repetitivos). Bulk `IN` em chunks evita o limite de URL do PostgREST e picos de conexão.
- **Alternatives considered**: (a) tudo numa action — rejeitada (payload com milhares de alunos); (b) views/materialized — adiado (só se a medição pós-implantação exigir; a spec autoriza, não obriga).

## R-10 — Navegação, permissão e padrões de UI

- **Decision**: Rota `/gestao-pedagogica/rendimento` (módulo Gestão Pedagógica, cf. OBS da spec); recurso `gestao-pedagogica.rendimento` (migration seed no padrão `patch_recursos_ocorrencias.sql`); item "Rendimento Escolar" no submenu Gestão Pedagógica do sidebar (padrão `sidebar.tsx:119-129`); módulo de aba `rendimento` em `tab-routes.tsx` (padrão das rotas da Gestão Pedagógica); layout Dashboard oficial (`PageContainer maxWidth="dashboard"`, `PageHeader`, `StatCard`, `PageSection`, Tabs com deep-link `?tab=` no padrão `DashboardTabs`, Recharts — biblioteca oficial de gráficos); detalhe do aluno em `Sheet` (painel lateral); tabela "Situação Final por Turma" com primeira coluna sticky (padrão das tabelas).
- **Rationale**: Segue Constituição (Server Actions, `src/lib/actions/rendimento.ts`, validação `validarPermissaoServer`, `schoolId`, migrations em `supabase-migrations/`, sem novas deps) e Design System v2.
- **Auditoria**: painel é leitura — sem escrita de auditoria (spec 017 audita criações/edições; exceção: edição da Faixa de Atenção na tela de Métodos usa o fluxo de auditoria já existente de Métodos, sem ação nova).
