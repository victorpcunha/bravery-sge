# Data Model: Comunicados do Portal (025)

**Feature**: `specs/025-comunicados-portal/spec.md` | **Date**: 2026-09-08

Estende o modelo da spec 023 (nenhuma tabela nova; 1 patch migration). Referências de tipos: `academico_anos_letivos.status` (string `ativo|planejamento|encerrado`), `academico_etapas_ensino.ativa` (boolean), `turmas.ativo` (boolean).

## 1. `comunicados` (estendida — migration `patch_comunicados_periodo_visibilidade.sql`)

| Coluna | Tipo | Regra |
|---|---|---|
| `id` | UUID PK | existente |
| `school_id` | UUID FK `schools` | existente, isolamento multi-tenant |
| `ano_letivo_id` | UUID FK `academico_anos_letivos` NULL | novo; NULL permitido só para linhas legadas; novos registros exigem o ano ativo |
| `titulo` | VARCHAR(200) | existente, obrigatório não-vazio |
| `descricao` | TEXT | existente, obrigatória não-vazia |
| `data_comunicado` | DATE | existente; gravada como `data(visivel_de)` — data de envio exibida |
| `visivel_de` | TIMESTAMPTZ NULL | novo; início da visibilidade; NULL = sem início (só legados) |
| `visivel_ate` | TIMESTAMPTZ NULL | novo; fim da visibilidade; NULL = sem fim (só legados) |
| `escopo` | JSONB | existente, evoluído (ver §2) |
| `created_by` | UUID FK `people` | existente (`pessoaId` do autor) |
| `created_at` / `updated_at` | TIMESTAMPTZ | existentes |

**Validações (server-side, autoritativas)**:
- `titulo`/`descricao` trim não-vazios; título ≤ 200.
- Novos/edições: `visivel_de` e `visivel_ate` obrigatórios, `visivel_de < visivel_ate`.
- `ano_letivo_id` = ano com `status='ativo'` da escola (não editável na UI; revalidado no servidor).
- `turma_ids` não-vazio; todas as turmas com `school_id` + `ano_letivo_id` da escola/ano; `etapa_ids` ⊆ etapas `ativa=true` da escola.
- Backfill da migration: `visivel_de = data_comunicado::timestamptz`, `visivel_ate = NULL`, `ano_letivo_id = NULL` (legados ficam fora do filtro por ano até reedição).

**Índices (novos, na migration)**: `idx_comunicados_ano (ano_letivo_id)`, `idx_comunicados_visibilidade (school_id, visivel_de, visivel_ate)`. Existentes preservados: `idx_comunicados_school`, `idx_comunicados_data`, `idx_comunicados_leituras_resp`.

## 2. `escopo` JSONB (formato evoluído)

```jsonc
// Novo (UI admin 025 — sempre este formato)
{ "tipo": "turmas", "etapa_ids": ["uuid", ...], "turma_ids": ["uuid", ...] }
// Legado (spec 023 — leitura mantida no portal, sem emissão pela UI)
{ "tipo": "geral" }
{ "tipo": "turmas", "turma_ids": ["uuid", ...] }  // sem etapa_ids
```

- Snapshot imutável do momento do cadastro/última edição (FR-011): desativar etapa/turma depois não altera comunicados.
- Portal decide por `turma_ids` (`includes(ctx.turmaId)`); `etapa_ids` é informativo (exibição/fidelidade admin).

## 3. `comunicados_leituras` (inalterada)

`(comunicado_id, responsavel_id, lido_em, UNIQUE par)` — ausência de linha = não lido. Exclusão do comunicado remove leituras em cascata (`ON DELETE CASCADE`).

## 4. Visibilidade no Portal (regra derivada)

```
visível ⟺ school_id = escola do slug
        AND (visivel_de IS NULL OR visivel_de <= now())
        AND (visivel_ate IS NULL OR now() <= visivel_ate)
        AND (escopo.geral OR ctx.turmaId ∈ escopo.turma_ids)
```

Estados derivados (sem coluna de status): `agendado` (now < de), `vigente` (dentro), `expirado` (now > ate). Admin lista todos; Portal só `vigente`.

## 5. `recursos` (seed — migration `patch_recursos_portal.sql`)

`('portal.comunicados', 'Comunicados do Portal', 'Portal')` via `INSERT ... ON CONFLICT (codigo) DO NOTHING`. Ações usadas: `visualizar` (listar/ver + item de sidebar), `criar`, `editar`, `excluir` (padrão `validarPermissaoEstrita`).

## 6. Auditoria (sem tabela nova)

Módulo `'Portal — Comunicados'`, entidade `'comunicados'`, via `registrarAuditoria` (master-data, padrão `diario-planos.ts`): `criar`/`editar` (com `dados_anteriores`/`dados_novos`, diff automático) /`excluir`. Best-effort, nunca bloqueia.
