# Implementation Plan: Painel de Rendimento Escolar

**Branch**: `main` | **Date**: 2026-09-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/028-painel-rendimento-escolar/spec.md`

## Summary

Painel de leitura (sem escrita própria) no módulo **Gestão Pedagógica** (`/gestao-pedagogica/rendimento`) que acompanha o rendimento com as **mesmas regras do engine acadêmico** (médias via `computarMediasPeriodo`, frequência via semântica `calcularFrequenciaBoletim`, parâmetros do Método da turma). Carga em 3 níveis progressivos (panorama agregado → lista de situação → drill-downs sob demanda) com bulk loads + agregação em memória. 2 migrations (seed de recurso + `faixa_atencao_pp` no método) e 7 actions de leitura em `src/lib/actions/rendimento.ts`.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (RSC + client components interativos)

**Primary Dependencies**: shadcn/ui, Recharts (gráficos — biblioteca oficial), Supabase via `getSupabaseAdmin()`, react-hook-form + zod v4 (só p/ o campo Faixa na tela de Métodos)

**Storage**: PostgreSQL (Supabase) — 0 tabelas novas; 1 coluna (`academico_metodos_avaliacao.faixa_atencao_pp`); 1 seed em `recursos`

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro `quickstart.md` (repo sem framework de testes; build verde é o gate)

**Target Platform**: Web responsiva (desktop-first, cards em `<md` nas tabelas densas)

**Project Type**: Web application (Next.js, feature-based)

**Performance Goals**: Carga inicial = 1 action agregada (bulk em chunks + memória); drill-downs/detalhes só sob demanda; sem N+1 por aluno/disciplina

**Constraints**: Leitura via Server Actions; `schoolId` sempre; permissão `gestao-pedagogica.rendimento/visualizar`; tokens Tailwind v4 (sem hex); dark-mode; primeira coluna sticky em tabelas densas

**Scale/Scope**: Escolas com centenas de turmas / milhares de alunos, N períodos e M disciplinas por turma

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — toda leitura em `src/lib/actions/rendimento.ts` (`'use server'`); validação server-side autoritativa; sem API Routes. ✅
- **II. Security First** — `validarPermissaoServer(pessoaId, 'gestao-pedagogica.rendimento', 'visualizar')` em toda action; escopo `schoolId` (superadmin via `getSchoolsEscopadas`); `EmptyState ShieldAlert` sem permissão. ✅
- **III. Multi-Tenant** — filtros e loads sempre por `school_id`; troca de escola recarrega tudo. ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn** — `PageContainer/PageHeader/PageSection/FilterBar/StatCard/StatusBadge/EmptyState/Pagination`, Tabs, Table, Sheet, Select; Recharts com `chart-helpers`. ✅
- **VII. Migrations** — M-01 seed recurso + M-02 coluna (padrão `patch_recursos_ocorrencias.sql`); sem DDL fora de migration. ✅
- **VIII. Auditability** — painel é leitura (sem trilha); edição da Faixa usa auditoria existente de Métodos. ✅
- **IX. Feature-Based** — actions `rendimento.ts`, componentes `src/components/rendimento/`, página `gestao-pedagogica/rendimento/`. ✅
- **X. No New Patterns** — nenhum: Recharts/tabs/sidebar/permissões seguem padrões existentes. ✅
- **XI. Design System First** — layout Dashboard oficial; sem componentes locais quando houver oficial. ✅
- Exceção justificada: exportar `computarMediasPeriodo` (pura) de `avaliacoes-numericas.ts` — extração sem mudança de regra (ver Complexity Tracking).

### Product Experience

- **PE-101/102** → página única "Rendimento Escolar" com título+subtítulo+KPIs comunicando o propósito imediato.
- **PE-201/202/203** → Resumo fixo + KPIs acima da dobra; Geral (agregado) antes de Situação (individual); peso visual por StatCard.
- **PE-204** → agrupamento Resumo / Geral / Situação / drill-down / detalhe-aluno.
- **PE-205** → drill-down turma, Sheet do aluno e Situação Final detalhada sob demanda; abas progressivas.
- **PE-301** → layout Dashboard (monitorar, comparar, alertar, tendência).
- Trade-off documentado: percentuais sobre "avaliados" (não matriculados) — decisão Q2 da spec, exibido como "Total de Avaliados" para transparência.

## Project Structure

### Documentation (this feature)

```text
specs/028-painel-rendimento-escolar/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── rendimento-actions.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/(app)/gestao-pedagogica/rendimento/
│   └── page.tsx                        # wrapper server (perm + contexto) + client
├── components/rendimento/
│   ├── rendimento-page-client.tsx      # Resumo fixo + tabs Geral/Situação
│   ├── resumo-filtros-kpis.tsx         # Ano, Período, Escola (superadmin) + 4 KPIs
│   ├── aba-geral-periodo.tsx           # indicadores + linha evolução + distribuição
│   ├── aba-geral-etapas.tsx            # comparação por etapa
│   ├── aba-geral-turmas.tsx            # tabela + drill-down (sob demanda)
│   ├── aba-situacao.tsx                # blocos + tabela atenção/risco + Sheet aluno
│   └── aba-situacao-final.tsx          # blocos + tabela dinâmica + cruzamento
├── lib/actions/
│   ├── rendimento.ts                   # 7 actions de leitura (contracts/)
│   ├── avaliacoes-numericas.ts         # exportar computarMediasPeriodo (pura)
│   └── metodos.ts                      # campo faixa_atencao_pp
└── lib/
    ├── tab-routes.tsx                  # módulo 'rendimento' + rota exact
    └── situacoes-matricula.ts          # reuso labelSituacaoMatricula (sem alteração)

supabase-migrations/
├── patch_rendimento_recurso.sql        # seed gestao-pedagogica.rendimento
└── patch_metodo_faixa_atencao.sql      # coluna faixa_atencao_pp DEFAULT 5
```

**Structure Decision**: Next.js App Router feature-based (padrão da Constituição IX); rota aninhada à Gestão Pedagógica existente; 1 aba por módulo (máx. 6, spec 016).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Exportar `computarMediasPeriodo` (privada → pública, sem mudar regra) | Painel precisa da mesma matemática em lote sobre loads school-wide; duplicar o código criaria regra paralela (proibido pela spec) | N×`calcularDesempenhoAluno` gera milhares de queries; view SQL duplicaria a regra fora do engine |
