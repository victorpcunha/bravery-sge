# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16+ (App Router) + TypeScript + Tailwind CSS v4. shadcn/ui (New York style), Lucide React, Sonner. Supabase (PostgreSQL) via Server Actions (`'use server'` + `getSupabaseAdmin()`, service_role bypasses RLS) in `src/lib/actions/`. Forms with React Hook Form + Zod. Dates with date-fns. Document PDFs with `@react-pdf/renderer` (preview rasterized via `pdfjs-dist`). Charts with Recharts (dashboard, student performance). Dev: `npx next dev -p 3001`. Build: `npx next build`.

## Users

Primary: school back-office staff at Brazilian private schools — secretaries (enrollments, documents, census), principals/managers (permissions, audit, school unit), teachers (class diary, teaching plans, assessments). Secondary: guardians via the Guardian Portal (spec 023/024/025: notices, documents), and Superadmin (multi-school management, audit). Users work daily during the school year on desktop, with mobile support for lists (card-list under `md`) and portal consumption.

## Product Purpose

Bravery SGE is a multi-tenant SaaS for complete school management with full INEP School Census compliance: daily pedagogical and administrative operation (classes, schedules, enrollments, gradebook, teaching plans, documents, notices) plus `.txt` census file export. Success means a school runs the whole year inside the system — from enrollment to report cards — and exports a valid census without rework.

## Positioning

The census-compliant all-in-one: unlike generic ERPs, every cadastral field follows INEP layouts (Registro 00/30/Situação Final), and unlike census-only tools, it covers the daily loop (schedule grid, class diary with active-period validation, indicator/numeric assessment, teaching plans applied to diary days, official documents with letterhead).

## Operating Context

School-year workflow driven by `academico_anos_letivos.status` (`'ativo' | 'planejamento' | 'encerrado'` — string column, never a boolean `ativo`). Rhythms: school setup (unit, calendars, stages, matrices, methods), enrollment (with transport, exemptions, movements: Transferir/Reclassificar/Remanejar/Desistir updating `academico_matriculas.data_saida`), daily teaching (per-day / per-lesson attendance, descriptive reports, indicator and numeric grades with recovery), planning (planos de ensino/aula with BNCC per stage), closing (conselho, fechamento), reporting (declaração, ficha individual, boletim numérico), communication (portal notices with visibility window). Dynamic RBAC (`perfis` + permission matrix Visualizar/Criar/Editar/Excluir per resource); setup mode (`isSetup`, no person) grants full access. Internal tab navigation keeps up to 6 module tabs alive with per-tab portals.

## Capabilities and Constraints

Technical constraints: all mutations are server actions with `getSupabaseAdmin()`; permission always validated server-side (`validarPermissaoEstrita` denies persons without `perfil_id`); audit capture is best-effort and never blocks the operation; `people` uses `nome_completo` (not `name`), `cpf`/`email` login, `telefone_celular`/`telefone_fixo`, address `logradouro`/`bairro`/`numero`/`complemento`/`municipio_residencia`, `whatsapp`/`telefone_secundario`; disciplines join via `turmas_disciplinas.matriz_disciplina_id → academico_matriz_disciplinas.id → academico_disciplinas.id` (`nome`, not `name`); `turmas.turnos` is JSONB of `{turno,...}` objects; dates built with local parsing (no UTC shift); migrations applied manually via SQL Editor (no Supabase CLI); 0 new npm deps per feature unless approved.

Full module inventory (detail lives in each `specs/*/spec.md`):

- Auth (`/login`): single CPF-or-email field, generic error "Usuário ou senha inválidos", `criarAuthUser` via `supabase.auth.admin.createUser()` linked by `user_schools`; password 10+ chars with upper/lower/digit/special, checked frontend and backend.
- Escolas (`/escolas`, `/escolas/novo`, `/escolas/[id]`, spec 013): superadmin list with scoped access (`getSchoolsEscopadas`); own unit always visible (read-only without `escolas.editar`); full edit gated by `validarPermissaoEstrita`; document-settings card writes `documentos_config` (not census).
- Turmas + Quadro de Aulas (`/turmas`, `/gestao-turmas/*`): CRUD of class groups; editable day×time grid with conflict validation; only active grid slots count for attendance.
- Matrículas (`/gestao-academica/matriculas*`): 3 tables (enrollment + transport + exemptions); movements Transfer/Reclassify/Relocate/Withdraw; `data_saida` drives each student's active period (out-of-period cells disabled with tooltip; per-student attendance %).
- Indicadores + BNCC (`/gestao-pedagogica/indicadores`, `/bncc/*`): hierarchical CRUD, BNCC import (Infantil), development levels (method + custom) via `indicadores_niveis`.
- Gestão de Usuários: Pessoas (`/gestao-usuarios/usuarios`, Registro 30, 8 tabs, dynamic profiles Aluno/Profissional/Gestor/Responsável); Funções Profissionais (CRUD); Perfis e Permissões (`/gestao-usuarios/perfis*`, spec 008: 5 migrations, matrix, visual + server guards, audit); Painel do Aluno 360º (`/gestao-usuarios/painel-aluno`, resource `gestao-usuarios.painel-aluno`, RPC `buscar_pessoas_matriculadas` with fallback, cards Identificação/Contato/Saúde/Desempenho/Quadro/Histórico/Ocorrências, Recharts).
- Estrutura Acadêmica (`/gestao-academica/estrutura-academica`): stages, calendars, curricular matrices; Métodos (`/gestao-academica/metodos`); Disciplinas (`/gestao-pedagogica/disciplinas`, server actions + audit since spec 017).
- Plano de Ensino (`/plano-ensino*`, spec 012): `planos_ensino`, `planos_ensino_disciplinas`, `planos_aula` (`periodos INT[]`, `bncc_fields JSONB`); list with school/year/class/discipline/period-pill filters + batch enrichment (teachers, grid hours); BNCC fields per stage (EI/EF/EM); lesson form in 3 cards with grid-hours computation.
- Diário de Classe (`/gestao-pedagogica/diario-classe*`, spec 011): Frequência por Dia/por Aula (active-period validation, BookOpen marker for applied plans), Parecer Descritivo, Avaliação por Indicadores, Avaliações Numéricas with recovery; "Plano de Aula" tab applies teaching-plan lessons to days with class (`academico_diario_planos_aplicados`, no data duplication, removal keeps original).
- Documentos (`/documentos`, specs 018/019/020/021): per-school `documentos_config` (logo base64 ≤2 MB, letterhead header/footer as fixed react-pdf views); resources `documentos.oficiais`, `documentos.preencher`, `relatorios`; generic `documento-gerador.tsx` (300 ms search debounce, 400 ms PDF debounce, canvas preview); Declaração de Matrícula; Ficha Individual (5 sections, `VALOR_DESCRICOES`, CEP `00000-000`); Boletim Numérico (blocked for non-numeric methods; periods from `periodo_avaliativo` calendar events; `FJ` = present % + absent count; no pass/fail verdict).
- Portal do Responsável + Comunicados (`/portal/[slug]`, `/comunicados*`, specs 023/024/025): internal management (active-year + date-range + stage/class filters, Vigente/Agendado/Expirado states) extends `comunicados` (`ano_letivo_id`, `visivel_de/ate`, `escopo.etapa_ids[]`); portal filters by visibility window; resource `portal.comunicados`.
- Auditoria (`/auditoria`, spec 017, Superadmin only): `auditoria` table + trigram index + backfill from `perfis_auditoria`; `src/lib/auditoria.ts` (`registrarAuditoria` field diffs, `registrarAuditoriaAgregada` summaries); ~20 instrumented modules; free-text search over record name + JSONB content, server-side pagination 10/page.
- Cross-cutting: Dashboard (`/` with `DashboardHero`, `FrequenciaHeroCard`, `DashboardTabs` `?tab=...`, 8 semantic charts, spec 006); Internal Tabs (spec 016: 1 tab per module, max 6, keep-alive panes, per-tab portals, URL sync); Agenda Profissional (spec 010); Histórico Escolar (spec 004); Censo Escolar + Situação Final (specs 001/015, `.txt` export); Ocorrências da Gestão Acadêmica (spec 026, in progress).
- Undecided: virtualization of the 50+ resource permission matrix on mobile; generic `<FormField required>` auto-`aria-required` component for the remaining `*` fields.

## Brand Commitments

Name Bravery SGE ("Gestão Escolar"); Plus Jakarta Sans only (weights 400/500/600/700, no italics/all-caps/serifs); tonal steel-blue brand `#4682B4` (rampa `#396991`/`#294C69`) with light-blue `#59A5E3` highlight accent (fg `#192E40`) and fixed golden `#B8863B` focus ring (spec 027, v7; primary/white 4.11:1 registrado como tradeoff); deep-steel sidebar in light mode; gradient `from-primary to-accent` reserved for logo/avatar/hero accents. Binding voice: school-domain Portuguese labels; error messages name the problem and recovery (generic login error is intentional).

## Evidence on Hand

Code: `src/app/(app)/**` (~46 routes), `src/components/{layout,feedback,ui,documentos,diario-classe,painel-pessoa,plano-ensino,tabs}`, `src/lib/actions/*` (~15+ action files), `src/app/globals.css` (token source), `supabase-migrations/*` (~45+ SQL files). Docs: `AGENTS.md` (operational rules, remains agent authority), `specs/002-design-system/catalog.md` (component contracts), `specs/005-design-system-v2/spec.md` (token decisions), `specs/003..026/*/spec.md|plan.md` (per-feature truth), `README.md`, `REDESIGN.md` (historic — navy palette superseded). Absences: `.specify/memory/visual-language.md` referenced by spec 005 no longer exists — do not fabricate its content; future work must not invent testimonials, benchmarks, or pricing.

## Product Principles

1. Census truth at the source: cadastral fields match INEP layouts so export is a projection, not a re-entry.
2. Active-period honesty: every attendance/grade view respects each student's `data_saida` window and counts only active grid slots.
3. Permission-gated everything: visual guards plus server-side `validarPermissaoEstrita` on every mutation.
4. Design-system first: official layouts/components/tokens only; no new visual patterns without approval.
5. Best-effort traceability: audit and diffs never block the user's save.

## Accessibility & Inclusion

Visual accessibility: WCAG AA contrast (light `--muted-foreground` `#475569` 7.5:1), dark-mode parity (slate palette, primary preserved), `prefers-reduced-motion` support, touch targets ≥36 px (hero 44, tabs 40), `EmptyState` with `aria-live="polite"` + `role="status"`. Keyboard/ARIA behavior follows shadcn/ui + Radix defaults (not custom-verified); `aria-required="true"` on 7 critical `PessoaForm` inputs, `role="alert"` on validation errors; remaining `*` fields pending a generic required-field component.
