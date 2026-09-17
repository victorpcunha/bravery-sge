# Implementation Plan: Tela de Rematrículas

**Branch**: `035-rematriculas` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/035-rematriculas/spec.md`

## Summary

Tela de trabalho única no módulo Gestão Acadêmica para rematricular em lote alunos de uma turma de um Ano Letivo encerrado para turmas do Ano Letivo ativo. Abordagem: reutilizar integralmente o fluxo de criação existente (`createMatricula` — Regra Geral, código sequencial, auditoria) dentro de uma nova server action `rematricularLote` que valida permissão (`gestao-academica.rematriculas`/`criar`), revalida a consistência Situação × Etapa e retorna resultado por aluno; UI em page fina + client component com subcards Origem/Destino, listagem com seleção individual e salvamento com estado de processamento.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js 16.2.4 (App Router) + React 19.2.4

**Primary Dependencies**: `@supabase/supabase-js` ^2.105.3, `react-hook-form` + `zod` v4 (se aplicável ao form de destino), shadcn/ui (Select, Checkbox, Button, Table, Badge), `sonner` (toast), `lucide-react`

**Storage**: PostgreSQL via Supabase — **zero tabelas novas**; 1 migration de seed (`patch_recursos_rematriculas.sql`, recurso `gestao-academica.rematriculas`); escritas só em `academico_matriculas` via `createMatricula`; auditoria via `auditoria` (já coberta por `registrarMatricula`)

**Testing**: Sem framework de testes no repo — validação via `npx tsc --noEmit` + `npx next build` + roteiro manual em [quickstart.md](./quickstart.md)

**Target Platform**: Web responsiva (desktop predominante + mobile 360px sem rolagem horizontal, SC-006)

**Project Type**: Web application — tela interna existente (Next.js App Router + Server Actions)

**Performance Goals**: Lote típico (≤ 40 alunos) concluído em < 30s; listagem de elegíveis carrega em < 3s (queries por `aluno_id + ano_letivo_id`, mesma forma de `validarRegraGeralMatricula`)

**Constraints**: Server Actions first (`src/lib/actions/rematriculas.ts`); validação server-side autoritativa (regra Situação × Etapa + data não futura revalidadas no batch); `pessoaId` repassado para auditoria; tokens de design apenas (Regras #1–#11); dark mode compatível

**Scale/Scope**: 1 tela + 1 action file + 1 migration + 2 registros de navegação (sidebar, tab-routes); escopo por escola (`schoolId`/`escolaOperacional`), volume por turma

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — Leituras via actions existentes (`getAnosLetivos`, `getEtapasEnsino`, `getTurmasAtivas`); escritas via nova `rematricularLote` em `src/lib/actions/rematriculas.ts` delegando a `createMatricula`. ✅
- **II. Security First** — Guard client (`pode.visualizar`) + `validarPermissaoServer(pessoaId, 'gestao-academica.rematriculas', 'criar')` no batch; escopo por escola em todas as queries. ✅
- **III. Multi-Tenant** — `escolaOperacional` (superadmin escolhe; demais usam `schoolId`); sem hardcode. ✅
- **IV/V/VI/XI. Tokens, Dark Mode, shadcn, Design System** — Só componentes oficiais (`PageContainer/Header/Section`, `FilterBar`, `Table`, `Select`, `Checkbox`, `Button`, `EmptyState`, `StatusBadge`, `Pagination` se necessário); tokens, sem hex; mobile cards `<md`. ✅
- **VII. Database Through Migrations** — 1 migration de seed de recurso (aplicada via SQL Editor, sem CLI Supabase — padrão do projeto). ✅
- **VIII. Auditability** — Registro individual por matrícula via `registrarMatricula` com `pessoaId`. ✅
- **IX. Feature-Based** — Actions `src/lib/actions/rematriculas.ts`, components `src/components/rematriculas/`, page `src/app/(app)/gestao-academica/rematriculas/`. ✅
- **X. No New Patterns** — Nenhuma lib, padrão ou estrutura nova (padrão Rendimento + `escolaOperacional`). ✅

Sem violações — sem exceções a justificar.

### Product Experience

- **PE-101/102** — Tela de objetivo único com título + subcards autoexplicativos → `PageHeader` + `PageSection` Origem/Destino.
- **PE-103** — `Salvar Rematrícula` como única ação principal no rodapé (sticky, `h-11`); lixeira/ajustes como ações secundárias ghost.
- **PE-204** — Subcards Origem/Destino agrupados no card "Origem e Destino".
- **PE-304** — Ordem de preenchimento origem → destino → alunos → salvar reflete a tarefa de criação em lote.
- **PE-402/403/404** — Erros por aluno com motivo + próximo passo; toast de confirmação com contagem; botão com estado de processamento anti-duplo-clique.
- **PE-502** — `EmptyState` para sem elegíveis / sem ano válido / sem turmas no destino.
- **PE-601/602** — Cards `<md>` + tabela `≥md`; subcards empilhados; toques ≥ 44px.

*Re-check pós-Phase 1*: nenhum artefato de design contraria os princípios — as decisões R-06 (prevenção client + revalidação server), R-10 (cards mobile) e R-08 (aviso de já-matriculados) sustentam PE-402/502/601. ✅

## Project Structure

### Documentation (this feature)

```text
specs/035-rematriculas/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── rematriculas-actions.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/(app)/gestao-academica/rematriculas/
│   └── page.tsx                        # fina: PageContainer + client (padrão rendimento)
├── components/rematriculas/
│   ├── rematriculas-client.tsx         # orquestra escola/origem/destino/lista/save
│   ├── origem-destino-card.tsx         # subcards Origem + Destino
│   └── alunos-rematricula-list.tsx     # tabela md+ / cards <md + seleção
├── lib/actions/
│   └── rematriculas.ts                 # listarAlunosElegiveis + rematricularLote (+ helpers)
├── lib/
│   └── situacoes-matricula.ts          # reuso (sem alteração)
├── components/layout/
│   └── sidebar.tsx                     # +1 submenu (ALTERAÇÃO)
└── lib/
    └── tab-routes.tsx                  # TAB_MODULES + MODULES + ROUTES (ALTERAÇÃO)

supabase-migrations/
└── patch_recursos_rematriculas.sql     # seed gestao-academica.rematriculas (NOVA)
```

**Structure Decision**: Padrão Rendimento (single working screen) — page fina + feature components + action file dedicado; sem sub-rota de cadastro (não há entidade persistida para editar). Reuso total das actions de leitura do fluxo de matrícula.

## Complexity Tracking

> Sem violações do Constitution Check — tabela não aplicável.
