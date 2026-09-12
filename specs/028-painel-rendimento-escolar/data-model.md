# Data Model: Painel de Rendimento Escolar (028)

**Spec**: `spec.md` · **Research**: `research.md`
**Princípio**: nenhuma tabela nova. O painel é uma **visão de leitura** sobre tabelas existentes + **1 coluna** (`faixa_atencao_pp`) + **1 seed de recurso**. Entidades abaixo são lógicas (formatos das actions), salvo indicação.

## 1. Fontes lidas (somente leitura)

| Tabela | Colunas usadas | Papel |
|---|---|---|
| `turmas` | `id, nome, school_id, ano_letivo_id, etapa_ensino_id, etapas_ensino_ids, fechada` | universo por escola/ano; `fechada` filtra Situação Final |
| `academico_matriculas` | `aluno_id, turma_id, situacao, ativo, data_matricula, data_saida` | alunos por turma; janela ativa; situação final |
| `people` | `id, nome_completo` | nomes |
| `turmas_disciplinas` → `academico_matriz_disciplinas` → `academico_disciplinas` | `matriz_disciplina_id, disciplina_id, nome` | disciplinas da turma (query pattern canônica) |
| `academico_matrizes_curriculares` | `metodo_avaliacao_id` | método da turma (school+ano+etapa) |
| `academico_metodos_avaliacao` | `nome, criterio_frequencia, frecuencia_minima` (typo real), `quantidade_periodos_numerico, tipos_avaliacao` **+ `faixa_atencao_pp` (novo)** | parâmetros por turma |
| `academico_metodos_avaliacao_numerico` / `..._aprovacao` | config do engine (`media_minima` em aprovacao etc.) | via `getNumericoConfigCompleta` — sem leitura direta nova |
| `academico_notas` | `turma_id, aluno_id, disciplina_id, periodo, valor, descricao` | bulk por turma |
| `academico_recuperacoes` | `turma_id, aluno_id, disciplina_id, periodo, tipo, valor, descricao` | bulk por turma |
| `conselho_classe_resultados` | `turma_id, aluno_id, matriz_disciplina_id, periodo, nota_conselho` | bulk por turma |
| `academico_frequencias_dia` | `turma_id, aluno_id, dia_letivo, status` | bulk por turma (critério `por_dia`) |
| `academico_frequencias_aula` | `turma_id, aluno_id, disciplina_id, horario_id, data_aula, status` | bulk por turma (critério `por_aula`, filtrado por horários ativos) |
| `quadro_aulas` + `quadro_aulas_horarios` | `id, ativo` | horários ativos por turma |
| `academico_calendarios` + `academico_calendario_eventos` | `tipo='periodo_avaliativo', descricao, data_inicio, data_termino, etapas` | Período de Análise (global + por turma) |
| `academico_anos_letivos` | `id, descricao/ano, status` | filtro Ano Letivo (via `getAnosLetivos`) |
| `academico_etapas_ensino` | `etapa_nome, etapa_codigo` | agrupamento por etapa |
| `schools` | `id, nome` | seletor superadmin (via `getSchoolsEscopadas`) |
| `recursos` | `codigo, nome, modulo` | seed `gestao-pedagogica.rendimento` |

## 2. Escrita (migrations)

- **M-01 `patch_rendimento_recurso.sql`**: `INSERT INTO recursos (codigo, nome, modulo) VALUES ('gestao-pedagogica.rendimento', 'Rendimento Escolar', 'Gestão Pedagógica') ON CONFLICT (codigo) DO NOTHING;` (padrão `patch_recursos_ocorrencias.sql`).
- **M-02 `patch_metodo_faixa_atencao.sql`**: `ALTER TABLE academico_metodos_avaliacao ADD COLUMN IF NOT EXISTS faixa_atencao_pp NUMERIC DEFAULT 5;` (+ `COMMENT`: pontos percentuais da escala; usado na classificação Atenção do Painel de Rendimento).
- Validação: `faixa_atencao_pp` entre 0 e 50 (server-side, zod na tela de Métodos); `NULL` = 5.

## 3. Entidades lógicas (tipos das actions em `rendimento.ts`)

### 3.1 `FiltrosRendimento` (input)
`{ schoolId, anoLetivoId, periodoOrdem: number | null /* null = ano completo */ }` + `pessoaId?`. Regras: `anoLetivoId` obrigatório; `periodoOrdem` validado contra 1..maxOrdens (clamp + erro amigável se inválido); escopo `schoolId` sempre (superadmin escolhe via seletor).

### 3.2 `PanoramaRendimento` (carga inicial — só agregados)
- `kpis`: `{ mediaGeral: number|null, pctAcima: number|null, freqMedia: number|null, pctRisco: number|null, totalAlunos, totalAvaliados }`
- `porPeriodo[]`: `{ ordem, nome, media, pctAcima, pctAbaixo, pctFreqAbaixo, avaliados }` (todos os ordinais — alimenta o gráfico de evolução independente do filtro)
- `porEtapa[]`: `{ etapaId, nome, avaliados, media, pctAcima, pctAbaixo, freqMedia, evolucao: number|null }` (`evolucao` = media(período sel.) − media(período anterior); ano completo = últimos 2 ordinais com dados)
- `porTurma[]`: `{ turmaId, nome, etapaNome, alunos, media, pctAcima, frequencia }`
- Definições: "Avaliado" = ≥1 nota no Período de Análise (decisão Q2); média do aluno = média das disciplinas com nota (período) ou das `media_anual` (ano completo); percentuais sobre avaliados; `null` (nunca 0) sem dados.

### 3.3 `ClassificacaoAluno` (Situação)
`{ alunoId, nome, turmaId, turmaNome, media, mediaAnterior: number|null, frequencia: number|null, categoria: 'adequado'|'atencao'|'risco', motivos: Motivo[], tendencia: 'melhorando'|'estavel'|'queda' }`
- `Motivo` (catálogo fechado): `media_abaixo | frequencia_abaixo | rendimento_frequencia | media_proxima_limite | frequencia_proxima_limite | queda_rendimento` → rótulos PT objetivos ("Média abaixo do esperado", "Frequência abaixo do esperado", "Rendimento + frequência", "Próximo do limite da média", "Próximo do limite da frequência", "Queda de rendimento").
- Precedência: risco > atenção > adequado (R-05). Aluno sem nota no período: excluído da lista (não-avaliado); sem frequência lançada: `frequencia=null`, não dispara motivo de frequência.
- `getListaSituacao` retorna `{ adequado, atencao, risco }` (contagens + percentuais) + `linhas[]` só de atenção+risco (ordenadas: risco, queda, nome).

### 3.4 `DetalheAluno`
`{ mediaAtual, mediaAnterior, frequencia, tendencia, porDisciplina: [{ nome, media }], pontosAtencao: string[] }` — pontos incluem a disciplina de maior queda ("Queda de rendimento em Matemática") quando aplicável.

### 3.5 `DetalheTurma` (drill-down)
`{ porDisciplina: [{ id, nome, media, avaliados }], distribuicao: [{ faixa, quantidade, percentual }], frequencia, abaixoMedia: [{ alunoId, nome, media }], evolucao: [{ ordem, nome, media }] }` — faixas fixas `9,0–10,0 / 7,0–8,9 / 5,0–6,9 / Abaixo de 5,0`.

### 3.6 `SituacaoFinalPanorama`
- `blocos[]`: `{ situacaoDb, rotulo, quantidade, percentual }` — só situações ocorrentes, rótulo via `labelSituacaoMatricula`.
- `porTurma[]`: `{ turmaId, turmaNome, [situacaoDb]: quantidade }` — colunas dinâmicas no front a partir da união ocorrente.
- `turmasNaoFechadas[]`: `{ turmaId, turmaNome }` (aviso explícito).
- `cruzamento`: `getCruzamentoRendimento({..., situacaoDb})` → `{ alunoId, nome, turmaNome, evolucao: (number|null)[] }` por período.

## 4. Regras de validação (server-side, autoritativas)

- Autenticação + `validarPermissaoServer(pessoaId, 'gestao-pedagogica.rendimento', 'visualizar')` em toda action; `schoolId` do contexto (nunca do client sem checagem de escopo; superadmin via `getSchoolsEscopadas`).
- `faixa_atencao_pp`: numérico 0–50, default 5.
- Tendência: limiar 1,0 (R-07). Banda de atenção: R-06.
- Consistência: mesmos ordinais do calendário; `periodo > qtd` da turma → turma ignorada naquele recorte (sem erro global).

## 5. Diagrama de relações (leitura)

```text
schools ──< turmas ──< academico_matriculas >── people (alunos)
  │            │── turmas_disciplinas ── matriz ── disciplinas
  │            │── (school,ano,etapa) ── matrizes ── metodos_avaliacao (+numerico/aprovacao)
  │            ├── notas / recuperacoes / conselhos (bulk por turma_id)
  │            ├── frequencias_dia | frequencias_aula (bulk por turma_id)
  │            └── quadro_aulas ── horarios (ativos)
  └── calendarios ── eventos periodo_avaliativo ──▶ Período de Análise
turmas.fechada=true + matriculas.situacao ──▶ Situação Final
```
