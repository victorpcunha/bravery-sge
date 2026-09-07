# Spec: Boletim Escolar

**Feature**: `021-boletim-escolar`
**Data**: 2026-09-05
**Status**: Implementado

## Visão geral

Novo documento oficial no módulo **Documentos** (aba **Documentos Oficiais**), integrado à galeria de
minicards (spec 020). O **Boletim Escolar** é gerado a partir dos registros de notas e frequência do
aluno no Ano Letivo e no Período de Avaliação selecionados na emissão.

O documento contempla **exclusivamente avaliações numéricas** acompanhadas de frequência. Turmas cujo
Método de Avaliação não seja numérico (Conceito, Parecer Descritivo) são **bloqueadas** na emissão,
com mensagem explicativa. Turmas com mais de um método (ex.: numérico + parecer) geram apenas a parte
numérica.

## Corpo do Boletim Escolar

### 1. Identificação Acadêmica

- Nome completo do aluno
- Ano letivo
- Período de avaliação selecionado
- Etapa de ensino, Turma e Turno (quando aplicável) na mesma linha

(A Unidade Escolar não é exibida no corpo — já consta no papel timbrado.)

### 2. Resultado por Disciplina

Tabela uniforme para todas as disciplinas cursadas pelo aluno no período:

| Configuração de frequência da turma | Colunas da tabela |
|-------------------------------------|-------------------|
| `por_aula` (por aula/disciplina) | Disciplina · Nota obtida no período · Frequência (%) · Total de faltas |
| `por_dia` (por dia letivo) | Disciplina · Nota obtida no período |

A identificação da forma de registro (`por_aula`/`por_dia`) é **automática**, a partir da configuração
do Método de Avaliação da turma (sem seleção manual).

- **Nota obtida no período**: média do período calculada pelo motor de avaliação do sistema
  (`calcularDesempenhoAluno` — recuperação por avaliação, por período e nota de conselho aplicadas).
- **Frequência/Faltas por disciplina**: apenas `por_aula`, agrupadas por `disciplina_id`.
- Notas não lançadas no período → `—` (não inventar valores).

### 3. Resultado Geral do Período

- **Média do Período**: média aritmética das notas das disciplinas no período (disciplinas sem nota
  são ignoradas; se nenhuma tiver nota → `—`).
- **Total de faltas**: sempre exibido — em turmas `por_dia`, a frequência geral do período; em turmas
  `por_aula`, a soma das faltas das disciplinas.

> Este documento **não** apresenta veredito de aprovação/reprovação — isso pertence ao Fechamento de
> Turma (fora do escopo).

## Requisitos funcionais

- **FR-001**: Acessível com a permissão `documentos.oficiais` (visualizar), sem novas migrations/tabelas.
- **FR-002**: Fluxo de geração herdado da Declaração/Ficha: Ano Letivo + busca/seleção de aluno
  (nome/CPF, mínimo 3 caracteres) **+ seletor de Período de Avaliação**.
- **FR-003**: O seletor de períodos é alimentado **exclusivamente** pelos Períodos Avaliativos do
  calendário do ano letivo (`academico_calendario_eventos` com `tipo='periodo_avaliativo'`), com nome
  e faixa de datas. Fallback: quantidade de períodos do método (`quantidade_periodos_numerico`) com
  rótulos "Período N", sem faixa de datas.
- **FR-004**: Bloqueio de geração quando o Método de Avaliação da turma não tiver a flag numérica —
  mensagem: *"Esta turma utiliza avaliação por [Conceito/Parecer Descritivo]; o Boletim Numérico não
  está disponível para este Método de Avaliação."*
- **FR-005**: Notas/médias obtidas exclusivamente do motor `calcularDesempenhoAluno` (mesmas regras do
  Diário de Classe e Fechamento), sem regras próprias de cálculo.
- **FR-006**: Frequência/faltas do período filtradas pela faixa de datas do Período Avaliativo
  interseccionada com a janela ativa da matrícula (`data_matricula` → `data_saida`). Status `FJ` conta
  como presença (percentual) e como falta (total), igual ao restante do sistema.
- **FR-007**: Pré-visualização em imagens + download em PDF (`@react-pdf/renderer` → `toBlob`),
  papel timbrado via `montarEscola`, assinatura editável por emissão, Data de Emissão = data em que o
  PDF foi gerado (local, no render).
- **FR-008**: Nomes em Title Case (`nomeTitulo`), datas `dd/mm/yyyy` (`formatarData`), CPF formatado.

## Ajustes de UX/UI

- Novo minicard na galeria (ícone `GraduationCap`), título "Boletim Escolar".
- No fluxo de geração, o seletor "Período de Avaliação" aparece **após** o aluno ser selecionado
  (e depende da turma do aluno).
- Quando o método não é numérico, o seletor de período é substituído por um bloco informativo
  (`EmptyState` `ShieldAlert`) com o motivo do bloqueio — o botão "Baixar PDF" não é exibido.
- Sem períodos no calendário (fallback), o seletor lista "Período 1..N" e a frequência é apresentada
  sobre a janela ativa da matrícula.