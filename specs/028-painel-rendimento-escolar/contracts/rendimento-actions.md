# Contracts: Server Actions do Painel de Rendimento (`src/lib/actions/rendimento.ts`)

Todas `'use server'` + `getSupabaseAdmin()`. Permissão: `validarPermissaoServer(pessoaId, 'gestao-pedagogica.rendimento', 'visualizar')`. Erros: `Error` com mensagem PT amigável (padrão PE-402). Tipos completos em `data-model.md §3`.

## `getFiltrosRendimento(schoolId, pessoaId?)`
- **Retorna**: `{ anos: [{id, descricao, status}], periodos: [{ordem, nome}], escolas?: [{id, nome}] }` (`escolas` só p/ superadmin, via `getSchoolsEscopadas`).
- **Regra**: períodos = união dos avaliativos dos calendários do ano (R-04); sem eventos → `qtd = max(quantidade_periodos_numerico)` dos métodos → "Período N".

## `getPanoramaRendimento({ schoolId, anoLetivoId, periodoOrdem }, pessoaId?)`
- **Retorna**: `PanoramaRendimento` (KPIs + porPeriodo + porEtapa + porTurma — só agregados).
- **Regra**: bulk por turma em chunks (`turma_id IN (...)`); turmas sem método numérico excluídas; "Avaliado" = ≥1 nota no recorte.

## `getListaSituacao({ schoolId, anoLetivoId, periodoOrdem }, pessoaId?)`
- **Retorna**: `{ resumo: { adequado, atencao, risco } /* qtd + pct */, linhas: ClassificacaoAluno[] }` (linhas = só atenção+risco).
- **Regra**: precedência risco > atenção > adequado; motivos do catálogo fechado (R-05); tendência R-07.

## `getDetalheTurma({ schoolId, turmaId, periodoOrdem }, pessoaId?)`
- **Retorna**: `DetalheTurma` (por disciplina, distribuição em faixas fixas, frequência, abaixo da média, evolução). Sob demanda (drill-down).

## `getDetalheAluno({ schoolId, turmaId, alunoId, periodoOrdem }, pessoaId?)`
- **Retorna**: `DetalheAluno` (médias, frequência, tendência, por disciplina, pontos de atenção). Sob demanda (Sheet).

## `getSituacaoFinal({ schoolId, anoLetivoId }, pessoaId?)`
- **Retorna**: `SituacaoFinalPanorama` (blocos ocorrentes rotulados via `labelSituacaoMatricula`, tabela por turma com colunas dinâmicas, `turmasNaoFechadas`). Sem turma fechada → `{ vazio: true }` (estado informativo, sem erro).

## `getCruzamentoRendimento({ schoolId, anoLetivoId, situacaoDb }, pessoaId?)`
- **Retorna**: `{ evolucao: [{ alunoId, nome, turmaNome, medias: (number|null)[] }] }` p/ o recorte (ex.: reprovados).

## Alteração em `src/lib/actions/metodos.ts` (campo Faixa de Atenção)
- `updateMetodo`-equivalente passa a aceitar `faixa_atencao_pp: number|null` (0–50, default 5) com auditoria pelo fluxo existente. Sem nova action de escrita além do campo.
