# Contracts — Server Actions: Importação Inicial

**Feature**: specs/039-importacao-inicial-usuarios/spec.md
**Action file**: `src/lib/actions/importacao.ts` (`'use server'`, `getSupabaseAdmin()`)
**Recurso**: `importacao-exportacao.importacao-inicial` — `validar*` exige `visualizar`; `confirmar*` exige `criar` (via `validarPermissaoEstrita`, import dinâmico de `./perfis`, padrão `comunicados.ts:283-284`)

Tipos `LoteInput`, `LinhaArquivo`, `ErroLinha`, `ResultadoLote` conforme [data-model.md](../data-model.md).
Cabeçalho oficial e `validarCabecalho` em `src/lib/importacao-modelos.ts` (neutro, sem `'use server'`);
motor de validação por linha em `src/lib/importacao-validacao.ts` (neutro, padrão `censo-situacao-final-helpers`).
`src/lib/actions/importacao.ts` (`'use server'`) exporta **somente** actions assíncronas.

## `validarLoteImportacao(schoolId, tipo, linhas, pessoaId?, cabecalho?) => Promise<ResultadoLote>`

- Valida tudo, **persiste nada** (`totalCriadas: 0`, `criadosIds: []`).
- Ordem: autenticação/escopo → cabeçalho (quando `cabecalho` informado, rejeita o lote se divergente) → limite 1.000 linhas → validação por linha (ordem das colunas do modelo; normalização código↔rótulo do sexo; CPF + certidão; unicidade arquivo + escola; datas; e-mail).
- O cliente sempre envia o `cabecalho` lido do arquivo (gate duplo: cliente barra antes, servidor revalida).
- Retorna `ResultadoLote` completo (resumo + `erros` ordenados por linha).

## `confirmarLoteImportacao(schoolId, tipo, linhas, pessoaId?, cabecalho?) => Promise<ResultadoLote>`

- **Revalida integralmente** (mesmo motor do validar — nenhuma confiança no preview do cliente) e insere **somente linhas válidas**, em sequência: `createPerson` (todos) + `createVinculoProfissional` (profissionais) — R-03.
- Falha de insert numa linha (ex.: corrida de duplicidade) → linha conta como rejeitada com erro `campo 'geral'`, sem abortar as demais.
- Ao fim: 1× `registrarAuditoriaAgregada` (R-08; best-effort) + `ResultadoLote` com `totalCriadas` e `criadosIds`.
- Reenvio do mesmo payload é seguro: CPFs já criados voltam como duplicidade (R-02).

## Erros — formato único

Toda rejeição de linha retorna 1+ `ErroLinha {linha, campo, mensagem, orientacao}` (PE-402). `campo 'geral'` para erros de lote (cabeçalho, arquivo vazio, limite excedido) com `linha 0`. Mensagens em linguagem do usuário, sem códigos internos/SQL.

## O que estas actions NÃO fazem (limites explícitos)

- Não criam `auth.users` nem `user_schools` (R-04).
- Não criam escolas, turmas, matrículas nem alocações (fora da spec — Assumptions).
- Não editam cadastros existentes (duplicado = rejeitado, FR-013).
- Não aceitam outro formato além de linhas já estruturadas do CSV (parse é do cliente, R-01); não aceitam `schoolId` fora do escopo do ator (negado sem vazar dados).
