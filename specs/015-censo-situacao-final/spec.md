# Spec: Censo Escolar — Situação Final (Registros 89/90/91)

**Feature**: 015-censo-situacao-final
**Data**: 2026-09-04
**Base**: `documentacao_interna/Censo Escolar/Arquivos do INEP/2025/Situação Final/layout_de_importacao_e_exportacao_2025_situacao_do_aluno.v3.xlsx`

## Objetivo

Implementar a segunda etapa do módulo de Censo Escolar: **Situação do Aluno (Situação Final)**. O motor lê dados operacionais já existentes (`academico_matriculas`, `turmas`, `people`, `schools`, `vinculos_profissionais`), valida contra as regras do INEP 2025 (v3) e exporta o arquivo `.txt` com os registros **89**, **90** e **91**, além do trailer `99`.

O arquivo de Identificação (`layout_de_identificacao_2025.xlsx`) **não** é gerado nesta feature. Aluno sem `inep_id` gera erro de validação apontando para o cadastro.

## Escopo

- **Registro 89** — Escola + Gestor (1 linha por escola).
- **Registro 90** — Situação do aluno (1 linha por matrícula de escolarização).
- **Registro 91** — Alunos "admitidos após" a Matrícula Inicial (1 linha por matrícula admitida após).
- Validação com telas de correção (URLs) e exportação no formato pipe-delimited, CRLF, uppercase, ISO-8859-1, trailer `99|`.

## Decisões de Mapeamento

| Situação interna (DB) | Código INEP | Rótulo censo |
|---|---|---|
| `Ativo` | 8 | Em andamento |
| `Reclassificado` | 8 | Em andamento |
| `Remanejado` | 8 | Em andamento |
| `Transferido` | 1 | Transferido |
| `Desistente` | 2 | Deixou de frequentar |
| `Óbito` | 3 | Falecido |
| `Reprovado` | 4 | Reprovado |
| `Reprovado por frequência` | 4 | Reprovado |
| `Aprovado` | 5 | Aprovado |
| `Aprovado por conselho de classe` | 5 | Aprovado |
| `Aprovado concluinte` | 6 | Aprovado concluinte |
| `Sem movimentação` | 7 | Sem movimentação |

**Admitido após** = `data_matricula > DATA_REFERENCIA_CENSO` (2026-05-27, última quarta-feira de maio — mesma referência usada na Matrícula Inicial).

## Regras de Validação (resumo)

### Arquivo (Regras Gerais)
- ISO-8859-1. Registro 90 com 8 campos. Registro 90 após 89/90; 91 após 89/90/91.
- Um registro 89 por escola. Um registro 90 para cada matrícula ativa de escolarização em turma que não seja de itinerário formativo exclusivo.
- Sem letras minúsculas nem caracteres acentuados.

### Registro 89
- Código escola INEP: 8 numéricos, existe no cadastro, não "Extinta", não "Faltante".
- CPF do gestor: 11 numéricos, na Receita Federal, ≠ 00000000191, status ativo.
- Nome do gestor: ≤100 caracteres alfabéticos, sem acentuação, conforme Receita.
- Gestor diferente do informado na Matrícula Inicial → aviso (importada parcialmente).

### Registro 90
- Código escola = registro 89 antecedente.
- Turma: existe na escola, de escolarização, não IF-exclusivo.
- Aluno: vinculado à turma informada.
- Código da matrícula: preenchido, pertence ao aluno e à turma.
- Situação do aluno (1–8):
  - admitido após → somente 1 ou 2;
  - Educação Infantil → somente 1, 2, 3, 8;
  - não pode ser 6 exceto etapas finais (27,28,29,37,38,39,40,41,67,68,70,71,73,74);
  - não pode ser 8 exceto etapas 39,40,67,68,69,70,71,73,74;
  - não pode ser 7 exceto etapas 1,2.

### Registro 91
- Turma: existe na escola, de escolarização, não educação especial para aluno sem deficiência, etapa permitida pela Tabela de Regra de Admissão.
- Aluno: com vínculo na Matrícula Inicial em turma ativa de escolarização; não duplicado no mesmo 91/matrícula; situação do vínculo original Transferido(1)/Deixou de frequentar(2).
- Código da matrícula: deve ser nulo.
- Tipo de mediação: preenchido (1–3) quando turma for nula; nulo quando preenchida.
- Código da etapa: obrigatório quando turma nula ou quando etapa da turma ∈ {3,22,23,56,64,72}; nulo caso contrário; compatível com mediação e com a etapa da turma (regras E26–E32).
- Situação do aluno: mesmas regras de etapa do Registro 90.

## Não Escopo
- Arquivo de Identificação (`layout_de_identificacao_2025.xlsx`).
- Migrations: nenhuma — campos INEP já existem; "admitido após" é derivado de `data_matricula`.
- Módulo de Matrícula Inicial: inalterado.