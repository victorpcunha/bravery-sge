# Contracts: Ocorrências da Gestão Acadêmica (026)

**Feature**: `specs/026-ocorrencias-gestao-academica/spec.md` | **Date**: 2026-09-09

Contratos das Server Actions (`'use server'`, `src/lib/actions/ocorrencias.ts`, `getSupabaseAdmin()`).
Convenção do projeto: leituras `Promise<T>` (array vazio quando sem resultado); `getOcorrencia` retorna `Promise<Detalhe|null>` via `.maybeSingle()`; escritas `Promise<void>` / `Promise<{id}>` com `throw` em falha. `pessoaId?: string | null` em todas (auditoria + `validarPermissaoEstrita`). Datas `YYYY-MM-DD`.

## Admin — `src/lib/actions/ocorrencias.ts`

Recurso `RECURSO='gestao-academica.ocorrencias'`, auditoria `MODULO='Gestão Acadêmica — Ocorrências'`, `entidade='ocorrencias'`.

### `listarOcorrencias(schoolId, filtros, pessoaId?) => Promise<OcorrenciaLista[]>`

- Auth: `validarPermissaoEstrita(pessoaId, RECURSO, 'visualizar')` + escopo `school_id`.
- `filtros = { dataInicial?: string; dataFinal?: string; profissionalIds?: string[]; alunoIds?: string[]; tipo?: 'positiva'|'negativa' }` (`tipo` ausente = Todas).
- Retorna minicard-ready, ordem `data_ocorrencia DESC`: `{ id, titulo, tipo, dataOcorrencia, apresentarPortal, descricaoResumida(100, com reticências só acima de 100), profissionais: {id, nome}[], alunos: {id, nome}[] }`.
- Filtros de envolvidos: match se vinculado a **pelo menos um** dos ids (OR); `return []` cedo quando a junction não retorna ids.

### `getOcorrencia(id, schoolId, pessoaId?) => Promise<OcorrenciaDetalhe | null>`

- Auth: `visualizar` + `school_id` guard. Retorna campos do form: `{ id, titulo, tipo, dataOcorrencia, detalhes, apresentarPortal, profissionalIds[], alunoIds[] }`.

### `criarOcorrencia(schoolId, input, pessoaId?) => Promise<{ id: string }>`

- Auth: `validarPermissaoEstrita(pessoaId, RECURSO, 'criar')`.
- `input = { titulo, tipo, dataOcorrencia, detalhes, apresentarPortal, profissionalIds[], alunoIds[] }`.
- Validações § data-model (título 3–150, detalhes 1–500, envolvidos não-vazios e da escola/ativos); grava `ocorrencias` + junctions em sequência (junctions após o `id` gerado); auditoria `criar`.

### `atualizarOcorrencia(id, schoolId, input, pessoaId?) => Promise<void>`

- Auth: `editar`. Mesmas validações; lê anterior para auditoria `editar` (diff automático); junctions: deleta vínculos e reinsere o conjunto novo.

### `excluirOcorrencia(id, schoolId, pessoaId?) => Promise<void>`

- Auth: `excluir`. Hard delete (cascata nas junctions); auditoria `excluir` com snapshot.

### `listarProfissionaisSelecionaveis(schoolId, pessoaId?) => Promise<{id, nome}[]>`

- Auth: `visualizar`. Critério censo: `vinculos_profissionais.situacao='1'` + `people.ativo=true` + `perfil` contendo `profissional`/`gestor`; ordem por `nome_completo`.

### `resolverNomesPessoas(schoolId, ids, pessoaId?) => Promise<{id, nome}[]>`

- Auth: `visualizar`. Resolve nomes com escopo `school_id` (filtra fora da escola); usada pela edição para exibir chips de envolvidos já gravados, inclusive profissionais desativados após o registro (nome histórico).

## Reuso (sem função nova)

- `buscarPessoasMatriculadas(termo, schoolId, pessoaId?)` (`painel-pessoa.ts`) — busca async de alunos (≥3 letras) no filtro (seleção única) e no form (múltipla).
- `usePermissoes(schoolId)` + `useAuth()` (`schoolId` null p/ superadmin, `allSchools`, `pessoaId`) — guards client.

## Rotas (contrato de navegação)

- `GET /ocorrencias` — listagem (superadmin sem `?escola=`/sem escola selecionada vê EmptyState "Selecione uma escola", sem dados).
- `GET /ocorrencias/novo[?escola=]` — cadastro (sem "Excluir"); `?escola=` propaga `selectedSchoolId` (padrão Comunicados).
- `GET /ocorrencias/[id]` — edição (com "Excluir" via `ConfirmDialog`).
- Todas registradas como sub-rotas do módulo de aba `ocorrencias` em `tab-routes.tsx` (`exact` + `p.match(/^\/ocorrencias\/([^/]+)$/)`).
