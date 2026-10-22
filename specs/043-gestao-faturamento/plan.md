# Implementation Plan: Gestão de Faturamento

**Branch**: `main` | **Date**: 2026-09-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/043-gestao-faturamento/spec.md` (+ clarificações: valor por etapa, saída com confirmação, responsável único)

## Summary

Novo módulo top-level **Faturamento** (Visão Geral, Cobranças, Configuração) que implementa o fluxo "configurar → abrangência → revisar → gerar em massa → acompanhar → tratar exceções" sobre o chain Matrícula → Plano → Mensalidades. Internals-first: baixa manual no MVP; colunas `asaas_*` reservadas e invisíveis. Reutiliza sidebar/tab/permissões/auditoria/rematrícula-lote como precedentes verificados (ver [research.md](research.md)).

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (padrão do repo)

**Primary Dependencies**: shadcn/ui, react-hook-form + zod v4, Recharts (indicadores da Visão Geral), Sonner (toasts)

**Storage**: Supabase Postgres via `getSupabaseAdmin()` em Server Actions; migrations em `supabase-migrations/` aplicadas via SQL Editor

**Testing**: Validação manual pelo [quickstart.md](quickstart.md) + `tsc --noEmit` + `next build` (padrão do repo; sem suite automatizada existente)

**Target Platform**: Web responsivo (minicards `<md`, tabelas `≥md`, toques ≥36px — PE-6xx)

**Project Type**: Web application (Next.js, feature-based: actions / components / pages)

**Performance Goals**: Visão Geral e Cobranças respondem com agregações SQL por escola/ano (evitar N+1); geração em massa de ~400 matrículas conclui sem timeout da action (pré-carregar mapas como `rematricularLote`; chunk se necessário)

**Constraints**: `'use server'` exporta só async (helpers puros em módulos neutros); sem hex (tokens Tailwind); sem API Routes para regra de negócio; multi-tenant (`schoolId` em tudo); dark-mode via tokens

**Scale/Scope**: centenas de matrículas/escola; 3 páginas, ~12 actions, 2 tabelas novas + 1 migration de recursos, ~8 componentes

## Constitution & Product Experience Check

### Constitution

- I Server Actions First: todas as leituras/escritas em `src/lib/actions/faturamento.ts`; cálculos puros em `src/lib/faturamento-calculo.ts` (neutro). ✅
- II Security First: `validarPermissaoEstrita` em toda mutação (`faturamento.visao-geral/cobrancas/configuracao`); escopo `schoolId`; superadmin com seletor de unidade. ✅
- III Multi-Tenant: `school_id` em configuração/plano; filtros sempre escopados; superadmin escolhe unidade. ✅
- IV/V/VI/XI Design: tokens, shadcn, `PageContainer/Header/Section`, `FilterBar`, `StatCard`, `StatusBadge`, `EmptyState`, `Pagination`, `ConfirmDialog` — zero componente novo salvo composição local. ✅
- VII Migrations: `faturamento.sql` + `patch_recursos_faturamento.sql`; convenções (`nome_completo`, `situacao`, sem `ativo` multiestado — usa `situacao` em mensalidades; `ativo` boolean só na configuração). ✅
- VIII Auditability: individual via `registrarAuditoria`, massa via `registrarAuditoriaAgregada`. ✅
- IX Feature-Based: actions / components/`faturamento` / pages `/faturamento`. ✅
- X No New Patterns: nenhum padrão novo (wizard = composição de Dialog + revisão, como cadastro de matrícula). ✅

### Product Experience

- PE-101/102/103: 3 telas com objetivo único, título+descrição, 1 ação principal cada. ✅
- PE-201/202/203: KPIs acima da dobra na Visão Geral. ✅ PE-204: grupos por contexto. ✅
- PE-301 (Visão = monitoramento), PE-302 (Cobranças = listagem), PE-304 (Config = cadastro), PE-305 (geração = etapas dependentes, justificativa na spec §7). ✅
- PE-401 (substituir/cancelar/isentar com confirmação), PE-402 (erros com `motivo+proximoPasso`), PE-403/404 (resumos + progresso). ✅
- PE-9xx: situação sempre textual. ✅

GATE: sem violações — sem exceções a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/043-gestao-faturamento/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── faturamento-actions.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
supabase-migrations/
├── faturamento.sql                  # configuracoes + planos + mensalidades + índices + triggers updated_at
└── patch_recursos_faturamento.sql   # 3 recursos + auto-grant a partir de gestao-academica.matriculas

src/
├── lib/
│   ├── actions/faturamento.ts       # ~12 actions (contratos em contracts/)
│   ├── faturamento-calculo.ts       # neutro: competencias, vencimento, resolução de config, derivados
│   └── faturamento-tipos.ts         # neutro: tipos compartilhados client/server
├── components/faturamento/
│   ├── visao-geral-client.tsx       # KPIs + pendências com ações
│   ├── cobrancas-client.tsx         # filtros + tabela + baixa em massa
│   ├── configuracao-client.tsx      # form por ano + abrangência por etapas
│   ├── geracao-wizard.tsx           # abrangência → revisão → confirmação → resultado
│   ├── plano-dialog.tsx             # exceção individual + grade de parcelas
│   └── situacao-badge.tsx           # texto explícito (reuso de StatusBadge)
└── app/(app)/faturamento/
    ├── page.tsx                     # Visão Geral
    ├── cobrancas/page.tsx
    └── configuracao/page.tsx

Edições em arquivos existentes:
├── src/components/layout/sidebar.tsx      # módulo top-level Faturamento + 3 subitens
├── src/lib/tab-routes.tsx                 # TAB_MODULES.faturamento + 3 ROUTES
└── diálogo de movimentações (matriculas)  # checkbox "cancelar futuras não pagas" → tratarSaidaMatricula
```

**Structure Decision**: Feature-based architecture (Constitution IX); 3 módulos de aba (`faturamento`, `faturamento-cobrancas`, `faturamento-configuracao`) — 1 aba por tela, padrão dos demais módulos; sem API Routes (webhook Asaas é fase futura com spec própria).

## Complexity Tracking

> Sem violações do Constitution Check — tabela não aplicável.
