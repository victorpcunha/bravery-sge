# Implementation Plan: Portal do Responsável

**Branch**: `023-portal-responsavel` | **Date**: 2026-09-08 | **Spec**: `specs/023-portal-responsavel/spec.md`

**Input**: Feature specification from `/specs/023-portal-responsavel/spec.md`

## Summary

Criar área externa isolada (`src/app/portal/`, irmã de `(app)`) com login próprio por e-mail+senha (gate `portal_only` da spec 022), gate LGPD de Termo versionado com aceite registrado, seleção de aluno vinculado e 7 páginas só-leitura (Início, Boletim, Frequência, Horários, Ocorrências, Comunicados, Documentos-placeholder). Todos os dados acadêmicos reutilizam o motor existente (`boletim.ts`, `calcularDesempenhoAluno`, regras de frequência, `getQuadroAulas`) através de fachada `portal-*` que valida o vínculo `responsavel_alunos` server-side em cada chamada. 3 migrations aditivas: termo LGPD, comunicados + leituras, colunas do portal em `ocorrencias`. Emissão de comunicados e conteúdo de Documentos ficam para specs futuras (decisões Q1/Q2 registradas na spec).

## Technical Context

**Language/Version**: TypeScript 5 + Next.js 15 (App Router; verificar `package.json` na implementação — sem nova versão)

**Primary Dependencies**: `supabase-js` (Auth browser via `getSupabaseClient`), `react-hook-form + zod v4` (login), shadcn/ui + componentes oficiais (PageContainer/PageHeader/PageSection, StatCard, EmptyState, StatusBadge, Pagination), Recharts somente se o Início exigir gráfico (evitar; KPIs + tabelas cobrem a spec)

**Storage**: PostgreSQL via Supabase; **3 migrations** em `supabase-migrations/` (`patch_portal_termo.sql`, `patch_portal_comunicados.sql`, `patch_portal_ocorrencias.sql`); senha NUNCA em tabela (só Supabase Auth, padrão spec 022)

**Testing**: Validação manual guiada por `quickstart.md` (padrão do projeto: sem suite automatizada; gates `npx tsc --noEmit` + `npx next build` verdes)

**Target Platform**: Web responsiva, mobile-first (viewport 360px sem scroll horizontal — SC-005; responsáveis acessam majoritariamente pelo celular)

**Project Type**: Web application — nova área em projeto existente (grupo de rotas + server actions + componentes por domínio)

**Performance Goals**: Login + aceite + seleção do aluno em até 3 minutos (SC-001); páginas do portal carregam com 1–3 server actions por tela (fachada agrega para evitar N+1 client-side)

**Constraints**: Sessão só no browser (sem `@supabase/ssr`, sem cookies SSR — padrão vigente); server actions com `getSupabaseAdmin()` + validação de vínculo server-side (bypass RLS é o padrão do projeto); erro de login sempre genérico; 0 hex hardcoded / só Design Tokens; dark mode compatível

**Scale/Scope**: 7 páginas + login + termo + seleção de aluno; ~8–10 componentes em `src/components/portal/`; 1 arquivo de actions `src/lib/actions/portal.ts` (+ 1 linha: exportar `calcularFrequenciaBoletim`); estimado em dezenas de vínculos/turmas por escola (sem requisito de alta concorrência)

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — PASS: toda leitura/escrita via `'use server'` em `src/lib/actions/portal.ts`; zero API Routes; validação server-side autoritativa (`validarVinculoPortal`).
- **II. Security First** — PASS: gate `portal_only` + `portal_acesso_habilitado`; vínculo revalidado por chamada; credencial interna recusada com mensagem genérica; nada de permissão vinda do frontend.
- **III. Multi-Tenant by Design** — PASS: `school_id` derivado da matrícula/vínculo em todas as queries; isolamento total entre escolas e entre alunos (SC-003).
- **IV/V. Design Tokens + Dark Mode** — PASS: só tokens (`bg-card`, `text-muted-foreground`, `border-border`...), sem hex; shadcn/ui como base.
- **VI. shadcn/ui** — PASS: Input/Button/Dialog/Select/Table/Badge/Tooltip oficiais; sem nativos estilizados.
- **VII. Database Through Migrations** — PASS: 3 migrations em `supabase-migrations/`; nenhuma alteração manual; convenções (`nome`, `status`) respeitadas.
- **VIII. Auditability First** — PASS: login, aceite (com versão) e troca de aluno via `registrarAuditoria` (best-effort, sem senha nos snapshots).
- **IX. Feature-Based Architecture** — PASS: actions `portal.ts`, componentes `components/portal/`, páginas `portal/`; sem estruturas paralelas.
- **X. No New Patterns** — PASS: sem `@supabase/ssr`, sem lib de estado, sem RLS; `alunoId` em context (padrão React já usado no app); única exceção micro: exportar função existente (`calcularFrequenciaBoletim`) — documentado em R4, não é padrão novo.
- **XI. Design System First** — PASS: layouts oficiais (Dashboard no Início via PE-301; Listagem/Visualização nas internas), `card-list <md` + tabela `≥md` (padrão specs 007/008).

### Product Experience

Todos os princípios da spec têm reflexo no plano: PE-101 (1 objetivo/página → 7 rotas distintas); PE-102 (aluno na Sidebar + PageHeader); PE-201/202 (KPIs acima da dobra); PE-204 (cards/abas por contexto); PE-205 (modal de comunicado, seletor sem sair da página); PE-301 (Início = Dashboard); PE-402 (erro genérico + estados vazios orientadores); PE-404 (loading em login/aceite/troca); PE-5xx (empty states: sem vínculo, sem lançamentos, Documentos "Em breve"); PE-6xx (mobile-first 360px). Nenhuma contradição; nenhum trade-off intencional.

**Re-check pós-Phase 1**: mantido — data-model, contracts e quickstart não introduzem violações (só leitura + 2 escritas auditadas: aceite e leitura de comunicado).

## Project Structure

### Documentation (this feature)

```text
specs/023-portal-responsavel/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── portal-actions.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/portal/                        # NOVO grupo de rotas (irmão de (app))
│   ├── layout.tsx                       # PortalProvider + guard de sessão/termo (client)
│   ├── login/page.tsx                   # E-mail + senha, erro genérico
│   ├── termo/page.tsx                   # Termo vigente + Aceitar
│   ├── selecionar-aluno/page.tsx        # Lista de vinculados (2+)
│   ├── aluno/page.tsx                   # Início (KPIs + 3 cards)
│   ├── aluno/boletim/page.tsx
│   ├── aluno/frequencia/page.tsx
│   ├── aluno/horarios/page.tsx
│   ├── aluno/ocorrencias/page.tsx
│   ├── aluno/comunicados/page.tsx
│   └── aluno/documentos/page.tsx        # Placeholder "Em breve"
├── components/portal/                  # NOVO (portal-sidebar, portal-topbar, kpi cards, tabelas, seletor-aluno, termo-view, comunicados minicards...)
├── lib/actions/portal.ts               # NOVO (fachada: validarVinculoPortal + delegação ao motor)
├── lib/actions/boletim.ts              # EDIT (exportar calcularFrequenciaBoletim — 1 linha)
└── components/ui/ + layout/ + feedback/ # REUSO (sem alterações)

supabase-migrations/
├── patch_portal_termo.sql              # NOVO (portal_termos + portal_aceites + seed v1)
├── patch_portal_comunicados.sql        # NOVO (comunicados + comunicados_leituras)
└── patch_portal_ocorrencias.sql        # NOVO (convergência: índice em ocorrencias_alunos + docs do schema real; sem novas colunas — R5 revisado)
```

**Structure Decision**: área nova isolada em grupo de rotas `portal` (R1) + domínio `portal` em actions/components (Constituição IX); reuso integral de UI oficial e motor acadêmico (R4); migrations aditivas sem tocar tabelas existentes além de ADD COLUMN NULL/DEFAULT (R5–R7).

## Complexity Tracking

> Nenhuma violação à Constituição — tabela vazia por conformidade.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
