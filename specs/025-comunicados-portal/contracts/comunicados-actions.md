# Contracts: Comunicados do Portal (025)

**Feature**: `specs/025-comunicados-portal/spec.md` | **Date**: 2026-09-08

Contratos das Server Actions (`'use server'`, `src/lib/actions/comunicados.ts`, `getSupabaseAdmin()`).
Convenção de retorno do projeto: leituras `Promise<T|null>` via `.maybeSingle()`; escritas `Promise<void>` com `throw` em falha. `pessoaId?: string | null` em todas as mutações (auditoria + `validarPermissaoEstrita`).

## Admin — `src/lib/actions/comunicados.ts`

### `listarComunicados(schoolId, filtros, pessoaId?) => Promise<ComunicadoLista[]>`

- Auth: `validarPermissaoEstrita(pessoaId, 'portal.comunicados', 'visualizar')` + escopo `school_id`.
- `filtros = { anoLetivoId: string; dataEnvio?: string; dataFinal?: string; etapaId?: string; turmaId?: string }` (datas `YYYY-MM-DD`).
- Retorna minicard-ready: `{ id, titulo, descricaoResumida(100), dataEnvio, dataFinal, anoLetivoId, etapaNomes[], turmaNomes[], estado: 'agendado'|'vigente'|'expirado' }`, ordem `visivel_de DESC`.
- Filtro de datas: interseção com `[visivel_de, visivel_ate]`; linhas legadas (`visivel_* NULL`) casam por `data_comunicado`.

### `getComunicado(id, schoolId, pessoaId?) => Promise<ComunicadoDetalhe | null>`

- Auth: `visualizar` + `school_id` guard. Retorna campos do form (inclui `etapaIds[]`, `turmaIds[]` extraídos do `escopo`).

### `criarComunicado(schoolId, input, pessoaId?) => Promise<{ id: string }>`

- Auth: `validarPermissaoEstrita(pessoaId, 'portal.comunicados', 'criar')`.
- `input = { anoLetivoId, turmaIds[], titulo, descricao, visivelDe: ISO, visivelAte: ISO }` (etapas removidas da UI — `etapa_ids` do `escopo` é derivado server-side das turmas via `derivarEtapas`, incluindo extras de `turmas_multietapa`).
- Validações §1 data-model (ano ativo da escola, turmas da escola/ano, `de < ate`, turmaIds não-vazio); grava `escopo={tipo:'turmas', etapa_ids, turma_ids}`, `data_comunicado=data(visivelDe)`, `created_by=pessoaId`; auditoria `criar`.

### `atualizarComunicado(id, schoolId, input, pessoaId?) => Promise<void>`

- Auth: `editar`. Mesmas validações; lê `anterior` para auditoria `editar` (diff automático).

### `excluirComunicado(id, schoolId, pessoaId?) => Promise<void>`

- Auth: `excluir`. Hard delete (cascata em `comunicados_leituras`); auditoria `excluir`.

## Suporte (reuso — sem função nova)

- `getAnosLetivos(schoolId)` (`calendarios.ts`), `getAnoLetivoAtivo(schoolId)` (`turmas.ts`), `getEtapasEnsino(schoolId, anoLetivoId)` (`etapas-ensino.ts`, `ativa=true`), `getTurmas(schoolId, ...)` (`turmas.ts`).

## Portal — alteração em `src/lib/actions/portal.ts` (existente)

- `listarComunicadosPortal`: adiciona à query `comunicados` o filtro da janela (`visivel_de IS NULL OR <= now`, `visivel_ate IS NULL OR >= now`); mantém `geral`/`turma_ids` em JS + join `lido`. Sem opt-out por vínculo (comunicado é broadcast da escola; assuntos individuais serão Ocorrências).
- `marcarComunicadoLido`: revalida janela + escopo antes do upsert idempotente (retorna erro amigável se fora da visibilidade).
- Sem mudança de assinatura nem de UI do portal.
