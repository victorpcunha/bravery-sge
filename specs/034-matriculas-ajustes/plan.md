# Implementation Plan: Alunos Matriculados — Ajustes

**Branch**: `main` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/034-matriculas-ajustes/spec.md`

## Summary

Ajustes na listagem (US1: busca reduzida + filtro Turma server-side, tabela full-width com header em destaque, coluna ID, lixeira com `ConfirmDialog`) e no cadastro/edição (US2: migration `codigo_matricula` sequencial por escola + Excluir no Editar; US3: transporte em Pills + subcard Veículos em 2 grupos; US4 REVOGADA: remoção total de Dispensa de Disciplinas — frontend + backend + `patch_remove_dispensas.sql`; US5: movimentações com `StatusBadge`, 2 datas e campos por tipo; US6: rodapé sticky Cancelar/Salvar). 2 migrations + 0 deps.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (client components + Server Actions)

**Primary Dependencies**: shadcn/ui (Table, Button, Input, Select, Label, Textarea, Checkbox), `ClickablePill`, `ConfirmDialog`, `EmptyState`, `StatusBadge`, `PageContainer/PageHeader/PageSection/FilterBar`, `usePermissoes`, `useAuth`, `sonner`, `lucide-react` (Plus, Pencil, Trash2, DoorOpen, GraduationCap, ArrowLeft, Save, X)

**Storage**: PostgreSQL — 1 migration (`codigo_matricula INTEGER` + backfill + UNIQUE por escola); resto sem DDL

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro `quickstart.md` (repo sem framework de testes; build verde é o gate)

**Target Platform**: Web responsiva (filtros com `flex-wrap`; tabela com `overflow-x-auto`)

**Project Type**: Web application (Next.js, feature-based)

**Performance Goals**: Filtro Turma server-side (1 query por troca, mesmo padrão do Ano Letivo); nomes de etapa/turma destino nas movimentações resolvidos em batch (1–2 queries por load, não N+1); sem novas queries no save além do `max+1` do código

**Constraints**: Server Actions com `'use server'` + `getSupabaseAdmin()`; `pessoaId` + auditoria nas escritas (incl. `deleteMatricula`); permissão `gestao-academica.matriculas` (+ `movimentacoes` já existente); tokens Tailwind v4 (sem hex); dark-mode; abas internas (cadastro empilha no módulo `matriculas`, `id` via query param — sem `tab-routes` novo); migration aplicada via SQL Editor

**Scale/Scope**: ~4 arquivos-fonte (`matriculas/page.tsx`, `cadastro/content.tsx`, `lib/actions/matriculas.ts`, `lib/situacoes-matricula.ts` + ajuste pontual em `filter-bar.tsx`/`table.tsx` se optar por token global) + 1 migration

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — `deleteMatricula` + `max+1` do código em `lib/actions/matriculas.ts`; filtro Turma reusa `getMatriculas` (param `turma_id` já existe). ✅
- **II. Security First** — `deleteMatricula` com `validarPermissaoServer` (excluir); guards client já existentes mantidos; `ConfirmDialog` nas 2 superfícies de exclusão. ✅
- **III. Multi-Tenant** — código sequencial particionado por `school_id` (UNIQUE composta); filtro Turma por escola+ano efetivos; superadmin sem escola não carrega. ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn** — `ClickablePill`, `ConfirmDialog`, `StatusBadge`, `Table` shadcn; header com `text-foreground` (sem hex); pills com `aria-pressed` nativo. ✅
- **VII. Migrations** — 1 migration aditiva + backfill (aplicada via SQL Editor, como as anteriores). ✅
- **VIII. Auditability** — `deleteMatricula` com `pessoaId` + `registrarAuditoria` (`acao:'excluir'`); código entra no snapshot de criação. ✅
- **IX. Feature-Based** — tudo em `gestao-academica/matriculas/` + `lib/actions/matriculas.ts` + 1 prop opcional em `filter-bar.tsx`. ✅
- **X. No New Patterns** — footer/ConfirmDialog/Pills copiam `plano-aula-form.tsx`, `metodos/page.tsx`, `ocorrencia-form.tsx`; sequencial copia `codigo_pessoa`. ✅
- **XI. Design System First** — nenhum componente novo. ✅

### Product Experience

- **PE-101/102** → busca reduzida, filtro Turma, tabela full-width destacada, coluna ID mono, badges semânticos.
- **PE-201** → Dados → Transporte → Movimentações → rodapé fixo.
- **PE-205** → confirmação nas exclusões; `toast.error` em validação/FK; 2 datas explicitam retroatividade.

## Project Structure

### Documentation (this feature)

```text
specs/034-matriculas-ajustes/
├── plan.md              # This file
├── data-model.md        # DDL da migration + mapa de exibição por tipo de movimentação
├── quickstart.md        # Roteiro de verificação manual
├── spec.md              # Feature specification
└── tasks.md             # Execução por user story
```

### Source Code (repository root)

```text
supabase-migrations/
└── patch_codigo_matricula.sql          # NEW (codigo_matricula + backfill + unique) (FR-004)
src/
├── app/(app)/gestao-academica/matriculas/
│   ├── page.tsx                        # MOD: busca reduzida, filtro Turma, tabela full-width, coluna ID, lixeira (FR-001/002/003)
│   └── cadastro/content.tsx            # MOD: código read-only, Excluir no Editar, transporte pills, remoção dispensas, movimentações, footer (FR-004..010)
├── components/layout/
│   └── filter-bar.tsx                  # MOD: prop opcional searchClassName (retrocompatível) (FR-001)
├── lib/
│   ├── actions/matriculas.ts           # MOD: codigo no select, max+1 no create, deleteMatricula (FR-003/004)
│   └── situacoes-matricula.ts          # MOD: variant por tipo de movimentação p/ StatusBadge (FR-008)
```

## Phases

### Phase 0 — Verificação + migration (base; sem dependências)

Confirmar no banco/código: (a) valores reais de `transporte_responsavel` em leitura/escrita (`'1'/'2'/'3'` no form vs CHECK `'Não utiliza'/'Municipal'/'Estadual'`); (b) fonte verdadeira dos veículos (booleanas `veiculo_*` vs `transporte_veiculos JSONB`); (c) FKs que bloqueiam hard delete da matrícula (frequência/notas/parecer/conselho apontam p/ matrícula? — só CASCADEs de movimentações/dispensas; demais usam `aluno_id`); (d) consumidores de dispensas (só `content.tsx` + `matriculas.ts`). Criar + aplicar `patch_codigo_matricula.sql` via SQL Editor e conferir backfill. Sem essa fase as US2/US3 não têm mapeamento seguro.

### Phase 1 — Lista (US1 — paralelizável com Phase 0b após verificação)

`page.tsx`: `searchClassName` no `FilterBar`, Select Turma (server-side via `turma_id`), remove `px-4`, header com destaque, coluna ID (`font-mono`), lixeira + `ConfirmDialog` → `deleteMatricula`. `filter-bar.tsx`: prop opcional retrocompatível.

### Phase 2 — Código + Excluir (US2 — depende da migration aplicada)

`matriculas.ts`: `codigo_matricula` no select, `max+1` no create, `deleteMatricula` (permissão + auditoria + erro FK amigável). `content.tsx`: campo read-only antes do Ano Letivo (+ "Gerado ao salvar" no novo), Ano Letivo reduzido, Excluir no header do Editar.

### Phase 3 — Transporte + remoção Dispensas (US3, US4 REVOGADA — paralelizáveis entre si, sobre `content.tsx` em blocos distintos)

US3: Pills únicas + subcard 2 grupos multi (persistência na fonte confirmada na Fase 0; remover vars mortas `veiculosRodoviarios/Aquaviarios`). US4 REVOGADA: remover card de `content.tsx`, actions + type + `getDisciplinasDaTurma` órfã de `matriculas.ts`, tabela via `patch_remove_dispensas.sql`.

### Phase 4 — Movimentações + rodapé (US5, US6 — paralelizáveis entre si)

US5: `StatusBadge` por tipo (mapa em `situacoes-matricula.ts`), 2 datas rotuladas, campos por tipo com nomes resolvidos em batch. US6: remove flutuante + `pb-20`, footer sticky padrão.

### Phase 5 — Gates

`tsc`, `build`, `quickstart.md` completo, `grep '#[0-9A-Fa-f]\{6\}'` limpo no módulo matriculas.

## Complexity Tracking

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Sequencial por escola (migration + `max+1`) | ID curto do UUID / INEP | UUID curto não é estável-legível p/ secretaria; INEP só existe pós-Censo; sequencial copia `codigo_pessoa` (padrão do repo) |
| Hard delete | Soft-delete `ativo=false` | Solicitante decidiu exclusão permanente p/ vínculo criado incorretamente; erro de FK vira `toast` amigável |
| Filtro Turma server-side | Filtro client-side | Dados já vêm filtrados por ano no server; `turma_id` já é param de `getMatriculas`; consistente com Ano Letivo |
| Labels Nenhum/Estadual/Municipal mapeados p/ valores do banco | Migration renomeando CHECK | Sem DDL desnecessário; preserva Censo/auditoria que leem os valores atuais |
| Resolver nomes de etapa/turma destino em batch | Exibir IDs crus | IDs crus são inúteis p/ o gestor; batch evita N+1 |
| Manter modais de movimentação inalterados | Reescrever modais | Pedido cobre só exibição do histórico + labels de data; entrada e validações ficam como estão |
