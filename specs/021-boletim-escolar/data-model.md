# Data Model: Boletim Escolar

**Feature**: `021-boletim-escolar`

## Migrations

Nenhuma. O Boletim reusa o recurso de permissão `documentos.oficiais` (seed da spec 019,
`supabase-migrations/patch_recursos_documentos.sql`).

## Entidades consumidas (somente leitura)

### Identidade Visual da Escola — `documentos_config` (spec 018)

Reuso de `montarEscola` (`src/lib/actions/documentos.ts`): mesmos campos da Ficha (spec 020), com
fallback por campo para `schools`.

### Boletim — dados lidos

| Fonte | Campos |
|-------|--------|
| `people` | `nome_completo`, `cpf` |
| `academico_matriculas` | `data_matricula`, `data_saida`, `situacao`, `ativo`, `turma_id` |
| `turmas` (via `turma_id`) | `nome`, `turnos` (JSONB array), `ano_letivo_id`, `etapa_ensino_id` |
| `academico_etapas_ensino` (via `etapa_ensino_id`) | `etapa_nome`, `etapa_codigo` |
| `academico_anos_letivos` (via `ano_letivo_id`) | `descricao`, `data_inicio`, `data_termino` |
| `academico_matrizes_curriculares` | `metodo_avaliacao_id` (filtro school+ano+etapa) |
| `academico_metodos_avaliacao` | `nome`, `tipos_avaliacao` (JSONB flags), `quantidade_periodos_numerico`, `criterio_frequencia` (`por_dia`/`por_aula`) |
| `academico_calendarios` | `id`, `ano_letivo_id` |
| `academico_calendario_eventos` | `descricao`, `tipo` (`periodo_avaliativo`), `data_inicio`, `data_termino`, `etapas` |
| `turmas_disciplinas` | `turma_id`, `matriz_disciplina_id` |
| `academico_matriz_disciplinas` | `id`, `disciplina_id` |
| `academico_disciplinas` | `nome` |
| `academico_notas` | `periodo`, `valor`, `descricao` (via motor) |
| `academico_recuperacoes` | `periodo`, `tipo`, `descricao`, `valor` (via motor) |
| `conselho_classe_resultados` | `periodo`, `nota_conselho` (via motor) |
| `academico_frequencias_dia` | `aluno_id`, `turma_id`, `dia_letivo`, `disciplina_id` (null), `status` |
| `academico_frequencias_aula` | `aluno_id`, `turma_id`, `data_aula`, `disciplina_id`, `status` |

**Regra de seleção da matrícula**: mais de uma matrícula no mesmo ano → prioriza `ativo = true` e, em
seguida, a mais recente (`data_matricula` desc). Igual à Declaração/Ficha.

## Resolução do Método de Avaliação

`turma` (`school_id` + `ano_letivo_id` + `etapa_ensino_id`) → `academico_matrizes_curriculares` →
`metodo_avaliacao_id` → `academico_metodos_avaliacao`. Mesma cadeia de `getMetodoIdDaTurma` /
`resolverMetodoFechamento` / `resolverCriterioFrequencia`.

- `tipos_avaliacao.numerico === true` → permite o Boletim (gera apenas a parte numérica mesmo se
  houver outras flags).
- `criterio_frequencia` escolhe a tabela de frequência (`academico_frequencias_aula` para `por_aula`).

## Períodos Avaliativos (fonte do seletor de período)

Eventos de `academico_calendario_eventos` com `tipo='periodo_avaliativo'` dos calendários do ano
letivo (`academico_calendarios.ano_letivo_id`), filtrados por `etapas` quando o array estiver
preenchido (compatível com a etapa da turma). Ordenados por `data_inicio`; a posição 1-based é o
`periodo` INT usado nas notas/motor. Limite = `quantidade_periodos_numerico`.

**Fallback** (nenhum evento): `quantidade_periodos_numerico` períodos rotulados "Período N", sem faixa
de datas (a frequência passa a ser a da janela ativa da matrícula).

## Query Patterns

### Períodos do Boletim

```
Source: academico_matriculas → turma_id (prefere ativo)
Source: academico_matrizes_curriculares (school+ano+etapa) → metodo_avaliacao_id
Source: academico_metodos_avaliacao → tipos_avaliacao, quantidade_periodos_numerico, criterio_frequencia, nome

Source: academico_calendarios (ano_letivo_id) → ids
Source: academico_calendario_eventos
Filter: calendario_id in ids, tipo = 'periodo_avaliativo'
Filter: etapas = [] OU etapas contém a etapa da turma
Order:  data_inicio asc
```

### Notas do período (por disciplina)

```
Para cada turmas_disciplinas.matriz_disciplina_id:
  calcularDesempenhoAluno(turmaId, alunoId, matrizDisciplinaId, quantidadePeriodos)
    → medias_periodo[periodoOrdem - 1] = Nota obtida no período
```

### Frequência do período

```
Tabela = criterio_frequencia === 'por_aula' ? academico_frequencias_aula : academico_frequencias_dia
Coluna de data = 'por_aula' ? data_aula : dia_letivo
Filter: turma_id, aluno_id
Window: data_matricula ≤ data ≤ data_saida  (janela ativa)
        E (se o período tiver datas) data_inicio ≤ data ≤ data_termino
por_aula: agrupar por disciplina_id
  freq%  = round(presencas(P|FJ) / total(status not null) * 100)
  faltas = count(status in F|FJ)
por_dia:  mesmo cálculo, sem agrupar (Resultado Geral)
```

## Regras de cálculo (reuso integral, sem regras próprias)

- Média do período por disciplina: motor `calcularDesempenhoAluno` (recuperação por avaliação,
  recuperação por período, nota de conselho) — idêntico ao Diário de Classe e Fechamento.
- `FJ` conta como **presença** para o percentual e como **falta** para o total.
- Sem veredito de aprovação/reprovação; `media_anual`/`media_final`/`status` não são exibidos.