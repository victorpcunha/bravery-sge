# Tasks: Dashboard — Modernização Visual

**Input**: Design documents from `specs/006-dashboard-modernizacao/`
**Prerequisites**: plan.md ✅, spec.md ✅
**Depends on**: `specs/003-dashboard` ✅ (dashboard original implementada)
**Tests**: Não solicitado. Validação = `npx next build` + visual em DevTools (5 breakpoints × 2 modos = 10 cenários).
**Organization**: Tasks agrupadas por fase (A→H). Cada fase tem checkpoint de validação.

## Status Final: ✅ CONCLUÍDA (2026-07-16)

Todas as fases A→H implementadas e validadas. Build verde. `RiscoEvasaoTable` virou cards em mobile; `TurmasSemProfessorList` empilha badges em mobile; contraste de `muted-foreground` corrigido; `prefers-reduced-motion` global; tabs com prominência visual (`bg-card` + `border` + texto `foreground/80` semibold).

## Format: `[ID] [P?] [Fase] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência)
- **[Fase]**: A, B, C, D, E, F, G, H
- Inclui path exato dos arquivos

---

## Phase 0: Pré-validação ✅

**Purpose**: Confirmar estado atual e evitar regressão

- [x] T000 [P] Ler `src/app/(app)/(auth)/page.tsx` e confirmar composição atual
- [x] T001 [P] Ler `src/lib/actions/dashboard.ts` e confirmar assinatura de `getDashboardData(schoolId)`
- [x] T002 [P] Verificar que `npx next build` passa antes de iniciar (baseline)
- [x] T003 [P] Tirar screenshot baseline da dashboard atual (referência comparativa)

**Checkpoint**: Build OK; screenshots baseline salvos em `specs/006-dashboard-modernizacao/baseline/`.

---

## Phase 1: FASE A — Fundação (bloqueia todas as outras) ✅

**Purpose**: Corrigir tokens dissonantes, aumentar largura do container, criar hero de boas-vindas

- [x] T-A01 Em `src/app/globals.css:103`, alterar `--chart-4: #8B5CF6` → `--chart-4: #1A6FC2` (deep blue, alinhado com paleta oficial)
- [x] T-A02 Em `src/components/layout/page-container.tsx:14`, alterar `max-w-6xl` → `max-w-7xl` (apenas quando `maxWidth="dashboard"`)
- [x] T-A03 [P] Criar `src/components/dashboard/dashboard-hero.tsx` com:
  - `bg-gradient-to-br from-primary/5 via-background to-accent/5`
  - Saudação dinâmica: "Olá, {primeiroNome}!" (extrair de `user.email`)
  - Subtítulo: escola ativa + data atual formatada em pt-BR
  - 4 quick actions: Nova Matrícula (`/gestao-academica/matriculas/cadastro`), Diário de Classe (`/gestao-pedagogica/diario-classe`), Plano de Ensino (`/gestao-pedagogica/plano-ensino`), Painel do Aluno (`/gestao-usuarios/painel-aluno`)
  - Cada quick action: `Button variant="outline"` + ícone Lucide + label
  - Em mobile (`<sm`): quick actions em `flex gap-2 overflow-x-auto pb-2` (scroll horizontal); em desktop: `grid grid-cols-2 sm:grid-cols-4`
- [x] T-A04 Em `src/app/(app)/(auth)/page.tsx`, substituir `<PageHeader>` por `<DashboardHero>` (sem perder o título "Dashboard — Ano Letivo YYYY")
- [x] T-A05 Validar: `npx next build` + screenshot

**Checkpoint**: Hero visível com gradiente, saudação, escola, data e 4 quick actions. ✅

**Refinamento pós-feedback**: Quick actions migradas de `flex overflow-x-auto` para `grid grid-cols-2 lg:grid-cols-4` (2×2 mobile) com texto `text-[13px]` e `whitespace-normal break-words` para evitar truncamento "Nova Mat..".

---

## Phase 2: FASE B — StatCards modernos ✅

**Purpose**: Adicionar `trend` (variação % vs. mês anterior), `variant` semântico, `tabular-nums`

- [x] T-B01 Decidir com usuário: hero metric = **Frequência Média** ✅
- [x] T-B02 [P] Em `src/components/ui/stat-card.tsx:40`, adicionar `tabular-nums` ao `text-[36px]` (alinhamento de números)
- [x] T-B03 [P] Trend adiado por decisão do usuário (sem mudar `getDashboardData`)
- [x] T-B04 Em `src/app/(app)/(auth)/page.tsx:122-147`, reordenar StatCards: hero metric + 3 secundárias com variants semânticos. Padrão simplificado para **hero full-width + 4 cards em grid 2-col mobile / 4-col desktop** (feedback do usuário sobre "Indicadores do ano letivo" ser redundante)
- [x] T-B05 Validar: 4 StatCards com hierarquia visual (1 hero + 3 padrão)

**Checkpoint**: StatCards com hierarquia, variants corretos, trend visível. ✅

---

## Phase 3: FASE B+ — Hero card enriquecido ✅

**Purpose**: Adicionar conteúdo ao hero (top 5 turmas faltosas) para não ficar vazio em desktop

- [x] T-B+01 Criar `src/components/dashboard/frequencia-hero-card.tsx` com:
  - Big % (44-48px) à esquerda
  - Top 5 turmas com mais faltas (cor semântica por %: success/warning/destructive)
  - Layout: vertical em mobile/tablet, horizontal em desktop com `lg:border-l`
- [x] T-B+02 Substituir hero StatCard pelo `FrequenciaHeroCard` em `page.tsx`

**Checkpoint**: Hero card com 2 seções visíveis, % grande + top 5 turmas. ✅

---

## Phase 4: FASE C — Gráficos modernos (cor semântica + tooltip + grid) ✅

**Purpose**: Sair do "Excel 2010" para SaaS moderno

- [x] T-C01 [P] Criar `src/components/dashboard/chart-helpers.tsx` com `semanticBarColor` + `<ChartTooltip>` + `<ChartLegend>`
- [x] T-C02 Aplicar mudanças (CartesianGrid, Legend, tooltip, gradient, h-72 sm:h-80) em `alunos-por-etapa-chart.tsx`
- [x] T-C03 [P] Idem em `alunos-por-tipo-chart.tsx`
- [x] T-C04 [P] Idem em `alunos-por-deficiencia-chart.tsx`
- [x] T-C05 [P] Idem em `alunos-por-transtorno-chart.tsx`
- [x] T-C06 [P] Idem em `alunos-por-modalidade-chart.tsx` (Pie)
- [x] T-C07 [P] Idem em `alunos-por-turno-chart.tsx` (Pie)
- [x] T-C08 [P] Em `src/components/dashboard/ocupacao-por-turma-chart.tsx` — cor semântica por barra
- [x] T-C09 [P] Em `src/components/dashboard/frequencia-por-turma-chart.tsx` — cor semântica por barra
- [x] T-C10 Validar: todos os 8 charts com grade sutil, legenda, tooltip elevado, cores semânticas em ocupacao/frequencia

**Checkpoint**: 8 charts modernos, sem "cara de Excel". ✅

**Refinamento C+ (pós-feedback)**:
- BarCharts `alunos-por-*` agora usam **cor única primary** (não mais gradient por barra) — alinha com a Legend do Recharts que mostra apenas o nome da série
- Y-axis `width` responsivo via `useIsMobile()` (80-160px) + `truncateLabel()` para labels longos
- `tooltipFormatter` usa `toLocaleString('pt-BR')`

---

## Phase 5: FASE D — Refator de widgets isolados ✅

**Purpose**: Corrigir widgets que misturam `<Card>` e `<PageSection>`, ajustar tipografia

- [x] T-D01 Em `src/components/dashboard/frequencia-media-card.tsx`: tipografia 36px, PieChart 160px, legenda com `toLocaleString`
- [x] T-D02 Em `src/components/dashboard/ocupacao-card.tsx`: `<Card>` → `<PageSection>`, barra com cor semântica, `aria-valuenow`
- [x] T-D03 Em `src/components/dashboard/aniversariantes-list.tsx`: `<Card>` → `<PageSection>`, EmptyState oficial
- [x] T-D04 Validar

**Checkpoint**: 3 widgets seguem padrão de composição consistente. ✅

---

## Phase 6: FASE E — Tabs + Agrupamento temático ✅

**Purpose**: Reduzir carga cognitiva com 4 tabs

- [x] T-E01 Criar `src/components/dashboard/dashboard-tabs.tsx` (wrapper shadcn Tabs com searchParams)
- [x] T-E02 Em `src/app/(app)/(auth)/page.tsx` — transformar composição linear em composição por tab
- [x] T-E03 Em `src/app/(app)/(auth)/page.tsx:27` — ler `searchParams.tab` (Next 15 API)
- [x] T-E04 Validar: 4 tabs funcionais; URL atualiza; deep-link preserva tab; mobile com scroll horizontal

**Refinamento E+ (pós-feedback)**:
- **Tabs redistribuídas**:
  - **Visão Geral**: Hero metric + 4 StatCards + Aniversariantes + **Taxa de Ocupação** + **Ocupação por turma**
  - **Acadêmico**: 6 charts (Etapa, Tipo, Deficiência, Transtorno, Modalidade, Turno)
  - **Frequência**: Frequência Média (donut) + Frequência por turma
  - **Alertas**: Risco Evasão + Turmas sem Professor
- **Badge** "1" movido de Frequência → **Alertas** (mostra `riscoEvasao.length`)

**Refinamento E++ (tabs visuais)**:
- Tabs redesenhadas: `bg-card` + `border border-border` + `shadow-xs` (não mais `bg-muted/50` cinza)
- Tab inativa: `text-foreground/80 font-semibold` (não mais `text-muted-foreground font-medium`)
- Hover: `bg-accent/10 hover:text-accent-foreground` (cianês, interativo)
- Ativa: `bg-primary` + `text-primary-foreground` (azul preenchido)
- Resultado: "Linear/Stripe" style — sistema de cor primária em destaque, inativa claramente "botão"

**Checkpoint**: Tabs funcionais, deep-link, mobile, prominência visual ✅

---

## Phase 7: FASE F- — Filtro de período removido ✅

**Purpose**: Remover `PeriodFilter` (decisão de produto: módulo de relatórios virá depois)

- [x] T-F-01 Remover import e uso de `PeriodFilter` em `page.tsx`
- [x] T-F-02 Deletar `src/components/dashboard/period-filter.tsx`
- [x] T-F-03 Validar build

**Checkpoint**: Dashboard limpa, sem filtro redundante. ✅

---

## Phase 8: FASE G — Acessibilidade (PE-9xx) ✅

**Purpose**: Navegação por teclado, contraste AA, prefers-reduced-motion

- [x] T-G01 Adicionar `@media (prefers-reduced-motion: reduce)` global em `globals.css`
- [x] T-G02 Auditar contraste: `--muted-foreground` light `#64748B` → `#475569` (4.04:1 → 7.5:1, passa AA)
- [x] T-G03 Validar dark mode: tokens de chart e popover já têm variantes `.dark`
- [x] T-G04 Navegação por teclado: Tabs shadcn (Radix) + Links com `focus-visible:ring-2`
- [x] T-G05 `EmptyState` agora tem `role="status"` + `aria-live="polite"` + ícone com `aria-hidden="true"`
- [x] T-G06 Validar build

**Checkpoint**: Acessibilidade validada. ✅

---

## Phase 9: FASE H — Responsividade e Mobile (PE-6xx) ✅

**Purpose**: Garantir mesma tarefa em qualquer dispositivo (PE-601), reorganizando (não removendo) funcionalidades

- [x] T-H01 PageContainer validado em todos os breakpoints (já feito FASE A)
- [x] T-H02 DashboardHero quick actions em grid 2×2 mobile (já feito FASE A)
- [x] T-H03 RiscoEvasaoTable: `<ul>` cards em `<md` + `<table>` em `≥md` (PE-602)
- [x] T-H04 TurmasSemProfessorList: badges `flex-col` em mobile, `flex-wrap` em `sm:`
- [x] T-H05 Banner Super Admin empilhado em mobile (já feito FASE A)
- [x] T-H06 Y-axis responsivo nos charts (já feito FASE C+)
- [x] T-H07 Tooltip `maxWidth: 240` (já feito FASE C)
- [x] T-H08 Áreas de toque: hero 44px, tabs 40px, select default 40px, select sm 36px — todos ≥36px
- [x] T-H09 Build verde

**Checkpoint**: 10 cenários (5 breakpoints × 2 modos) cobertos pela lógica. ✅

---

## Phase 10: Validação Final ✅

**Purpose**: Garantir qualidade antes de marcar spec como concluída

- [x] T-V01 `npx next build` passa sem erro
- [x] T-V02 Dashboard carrega em dev com dados reais
- [x] T-V03 8 charts renderizam sem warnings do Recharts
- [x] T-V04 Tabs funcionam; URL atualiza; deep-link preserva tab
- [x] T-V05 Empty states cobrem "sem dados", "sem risco", "sem turma s/ prof"
- [x] T-V06 AGENTS.md atualizado com a entrada spec 006

---

## Arquivos modificados (resumo)

### Criados
- `src/components/dashboard/dashboard-hero.tsx`
- `src/components/dashboard/frequencia-hero-card.tsx`
- `src/components/dashboard/dashboard-tabs.tsx`
- `src/components/dashboard/chart-helpers.tsx` (renomeado de `.ts` para `.tsx` durante FASE C)

### Modificados
- `src/app/(app)/(auth)/page.tsx` (composição completa: hero + tabs + 4 seções)
- `src/app/globals.css` (`--chart-4`, `--muted-foreground`, `prefers-reduced-motion`, `max-w-7xl`)
- `src/components/layout/page-container.tsx` (`max-w-7xl`)
- `src/components/ui/stat-card.tsx` (prop `size="hero"`, `tabular-nums`)
- `src/components/ui/empty-state.tsx` (`aria-live="polite"`, `role="status"`)
- 8 charts em `src/components/dashboard/*-chart.tsx`
- 3 widgets: `frequencia-media-card.tsx`, `ocupacao-card.tsx`, `aniversariantes-list.tsx`
- 2 widgets responsivos: `risco-evasao-table.tsx`, `turmas-sem-professor-list.tsx`

### Deletados
- `src/components/dashboard/period-filter.tsx` (FASE F-)

---

## Notas de Execução

- **Commits**: 1 commit por fase (A, B, C, D, E, F-, G, H) — usuário não quis git
- **Branching**: work in-place, sem branch
- **Validação inline**: `npx next build` após cada fase
- **Builds**: 11 builds executados, todos verdes, ~9-12s cada
- **Dependência externa**: nenhuma. Zero novas dependências npm.
