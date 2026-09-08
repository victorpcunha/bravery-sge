# Implementation Plan: Comunicados do Portal

**Branch**: `025-comunicados-portal` | **Date**: 2026-09-08 | **Spec**: `specs/025-comunicados-portal/spec.md`

**Input**: Feature specification from `/specs/025-comunicados-portal/spec.md`

## Summary

Tela administrativa onde a Escola registra comunicados exibidos no Portal dos Responsáveis, com direcionamento por etapas/turmas (snapshot no cadastro) e janela de visibilidade com data+hora. Abordagem: **estender a tabela `comunicados` existente** (spec 023) via patch migration (`ano_letivo_id`, `visivel_de/ate`, `etapa_ids` no `escopo` JSONB), CRUD em `src/lib/actions/comunicados.ts`, telas em `src/app/(app)/comunicados/` com componentes 100% reaproveitados do Design System, recurso `portal.comunicados`, e filtro de janela no `portal.ts` existente — sem tabela nova, sem dependência nova, sem mudança visual no portal.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (React Server Components + Client Components)

**Primary Dependencies**: shadcn/ui (+ `ui/calendar.tsx` sobre react-day-picker, `captionLayout="dropdown"` via passthrough), date-fns, react-hook-form + zod v4, Supabase (`getSupabaseAdmin()` service_role), lucide-react (`Megaphone`)

**Storage**: PostgreSQL Supabase — `ALTER TABLE comunicados` (patch migration aplicada via SQL Editor, padrão do projeto) + seed em `recursos`; índices `idx_comunicados_ano`, `idx_comunicados_visibilidade`

**Testing**: Validação manual via `quickstart.md` (projeto sem framework de testes; gates = `tsc --noEmit` + `next build` verdes)

**Target Platform**: Web interna (desktop-first 1366×768, responsivo mobile) + leitura no portal público existente

**Project Type**: Web application (feature em app existente)

**Performance Goals**: Listagem filtra em tempo compatível com as demais telas do sistema (SC-005: 95% das tentativas sem erro)

**Constraints**: Multi-tenant (`school_id` em toda query); RLS bypass só via Server Actions; permissão `portal.comunicados` validada server-side (`validarPermissaoEstrita`); auditoria best-effort; tokens Tailwind v4 (zero hex); rota interna `/comunicados` (nunca `/portal/*` — colidiria com `/portal/[slug]`)

**Scale/Scope**: Dezenas a centenas de comunicados/escola/ano; 2 telas (listagem + form criar/editar), ~5 arquivos novos + 4 toques (sidebar, tab-routes, portal.ts, recursos seed)

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — CRUD em `src/lib/actions/comunicados.ts` (`'use server'`); validação server-side autoritativa (zod no servidor); react-hook-form+zod no cliente só complementar. ✅
- **II. Security First** — `validarPermissaoEstrita(pessoaId, 'portal.comunicados', acao)` em toda action; `school_id` guardado; `EmptyState ShieldAlert` sem permissão; erro genérico em falha de leitura cruzada. ✅
- **III. Multi-Tenant** — tudo filtrado por `school_id`; superadmin seleciona escola (padrão das telas admin). ✅
- **IV/V. Tokens + Dark Mode** — só tokens (`bg-card`, `text-muted-foreground`, `border-border` etc.); `Megaphone` tile `bg-primary/10 text-primary`. ✅
- **VI. shadcn/ui** — `Calendar`/`Popover`/`Input type="time"`/`Button`/`Select`/`Textarea`/`Card`/`Badge`; `captionLayout="dropdown"` e `mode="range"` são props passthrough já suportadas — nenhum componente base alterado, nenhuma lib nova. ✅
- **VII. Migrations** — `supabase-migrations/patch_comunicados_periodo_visibilidade.sql` + `patch_recursos_portal.sql`; colunas em inglês-minúsculas, `nome`/`titulo` preservados. ✅
- **VIII. Auditability** — `registrarAuditoria` módulo `'Portal — Comunicados'` em criar/editar/excluir. ✅
- **IX. Feature-Based** — actions `lib/actions/comunicados.ts`, UI `components/comunicados/`, pages `app/(app)/comunicados/`. ✅
- **X. No New Patterns** — nenhum: reaproveita FilterBar/PageSection/Pagination/ConfirmDialog/EmptyState/DatePicker-idiom/Calendar passthrough. ✅
- **XI. Design System First** — listagem e form seguem layouts oficiais (Listagem + Cadastro/Edição); minicard segue precedente `oficiais-tab.tsx`/`plano-ensino`. ✅

### Product Experience (todos os princípios da spec refletidos)

- **PE-101/102** — duas telas de objetivo único; `PageHeader` ("Comunicados do Portal" + descrição "origem dos comunicados do Portal dos Responsáveis").
- **PE-103** — "Novo Comunicado" em `actions` do `PageSection(flush)`; "Salvar" primário no footer sticky.
- **PE-204** — form em 2 `FormCard`s (Identificação / Detalhes do Comunicado).
- **PE-302/304** — listagem com filtros + minicards; cadastro em tela própria sem breadcrumbs com "Voltar".
- **PE-401** — `ConfirmDialog variant="destructive"` nas duas exclusões.
- **PE-402** — zod server-side + mensagens orientadoras (período invertido, nenhuma turma, ano inválido, turma de outra escola).
- **PE-403/404** — toasts de sucesso; skeleton/pulse no loading; botões com `loading`.
- **PE-5xx** — `EmptyState` triplo (sem dados / filtro vazio / sem permissão).
- **PE-6xx** — grid `1/2/3` cols, filtros `grid-cols-1 sm:…`, áreas de toque ≥36px.

*Re-check pós-Phase 1: nenhuma decisão de research/data-model/contracts/quickstart viola ou contraria os itens acima.*

## Project Structure

### Documentation (this feature)

```text
specs/025-comunicados-portal/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── comunicados-actions.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
supabase-migrations/
├── patch_comunicados_periodo_visibilidade.sql  # ALTER comunicados + backfill + índices
└── patch_recursos_portal.sql                   # seed ('portal.comunicados','Comunicados do Portal','Portal')

src/
├── lib/actions/
│   ├── comunicados.ts        # listar/get/criar/atualizar/excluir (NOVO)
│   └── portal.ts             # filtro de janela em listarComunicadosPortal + marcarComunicadoLido (EDIT)
├── components/comunicados/   # (NOVO) filtros, minicard, form, campo período (Calendar range + time)
├── app/(app)/comunicados/
│   ├── page.tsx              # listagem (filtros + minicards + paginação)
│   ├── novo/page.tsx         # criação (ano travado)
│   └── [id]/page.tsx         # edição (useTabParams, + Excluir)
├── components/layout/sidebar.tsx  # item Comunicados em Gestão Acadêmica (EDIT)
└── lib/tab-routes.tsx             # módulo comunicados: /comunicados, /novo, /[id] (EDIT)
```

**Structure Decision**: Feature-Based Architecture (Constituição IX) — domínio `comunicados` isolado em actions/components/pages próprios; 4 toques em arquivos compartilhados (sidebar, tab-routes, portal.ts, seed de recursos).

## Complexity Tracking

> Nenhuma violação da Constituição — tabela justificada.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| — | — | — |
