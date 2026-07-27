# Implementation Plan: Dashboard — Modernização Visual

**Branch**: `006-dashboard-modernizacao` | **Date**: 2026-07-16 | **Spec**: [spec.md](./spec.md)
**Depends on**: `specs/003-dashboard` ✅ (dashboard original implementada)

## Summary

Refatorar a Dashboard atual (`src/app/(app)/(auth)/page.tsx`) para sair da "cara de 2010" e adotar linguagem SaaS moderna. Mudanças agrupadas em 8 fases (A→H): fundação (tokens, container, hero), StatCards modernos, gráficos com cor semântica, refator de widgets isolados, tabs com agrupamento temático, acessibilidade, e responsividade (PE-6xx). Sem mudança em contratos de dados (`getDashboardData` permanece).

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)
**Primary Dependencies**: shadcn/ui v4, Tailwind CSS v4, lucide-react, sonner, Recharts (já instalado)
**Storage**: Nenhuma migration nesta spec (apenas refatoração visual)
**Testing**: `npx next build` + validação visual manual em DevTools (360 / 768 / 1024 / 1280 / 1440px) em light + dark mode
**Target Platform**: Web (Next.js App Router, Client Components)
**Project Type**: Web application — refatoração frontend
**Performance Goals**: Build permanece estável. Dashboard carrega em <2s. Charts renderizam em <500ms.
**Constraints**: Zero novas dependências npm. Seguir tokens Design System (sem cores hardcoded). shadcn/ui para todos componentes novos. Não alterar assinatura de `getDashboardData`.
**Scale/Scope**: 1 página modificada, 13 componentes em `src/components/dashboard/` ajustados, 1 novo componente `<DashboardHero>`, 1 novo `<DashboardTabs>`, ajuste em 1 componente de layout (`page-container.tsx`), ajuste em 1 arquivo de tema (`globals.css`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Server Actions First | ✅ PASS | Nenhuma action nova nesta spec |
| II. Security First | ✅ PASS | Sem mudança em auth/permissions |
| III. Multi-Tenant by Design | ✅ PASS | `getDashboardData(schoolId)` permanece; escola ativa já é contexto |
| IV. Design Tokens over Hardcoded Styles | ✅ PASS | `--chart-4` ajustado em `globals.css`; demais usam tokens |
| V. Dark Mode Compatibility | ✅ PASS | Charts usam `var(--chart-N)` que tem variante dark |
| VI. shadcn/ui as UI Standard | ✅ PASS | Tabs, Card, Button, Select, EmptyState são shadcn |
| VII. Database Through Migrations | N/A | Nenhuma migration nesta spec |
| VIII. Auditability First | N/A | Nenhuma operação de dados |
| IX. Feature-Based Architecture | ✅ PASS | Novos componentes em `src/components/dashboard/` |
| X. No New Patterns Without Approval | ✅ PASS | Reutiliza Tabs shadcn, sem novas bibliotecas |
| XI. Design System First | ✅ PASS | DashboardHero, DashboardTabs seguem catálogo oficial; promove a `PageContainer.maxWidth` para `max-w-7xl` |

**Gate: PASS** — Nenhuma violação.

## Project Structure

### Documentation (this feature)

```text
specs/006-dashboard-modernizacao/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app/(app)/(auth)/
│   └── page.tsx                     # MODIFIED: composição nova (Hero + Tabs + StatCards)
│
├── components/
│   ├── dashboard/
│   │   ├── dashboard-hero.tsx                       # NEW: hero de boas-vindas + quick actions
│   │   ├── dashboard-tabs.tsx                       # NEW: Tabs shadcn (Visão Geral, Acadêmico, Frequência, Alertas)
│   │   ├── alunos-por-etapa-chart.tsx               # MODIFIED: grid, gradient, legend, tooltip
│   │   ├── alunos-por-tipo-chart.tsx                # MODIFIED: idem
│   │   ├── alunos-por-deficiencia-chart.tsx         # MODIFIED: idem
│   │   ├── alunos-por-transtorno-chart.tsx          # MODIFIED: idem
│   │   ├── alunos-por-modalidade-chart.tsx          # MODIFIED: idem
│   │   ├── alunos-por-turno-chart.tsx               # MODIFIED: idem
│   │   ├── ocupacao-por-turma-chart.tsx             # MODIFIED: cor semântica (success/warning/destructive)
│   │   ├── frequencia-por-turma-chart.tsx           # MODIFIED: cor semântica
│   │   ├── ocupacao-card.tsx                        # MODIFIED: PageSection, tipografia, cor semântica
│   │   ├── frequencia-media-card.tsx                # MODIFIED: tipografia 36px, sem text-2xl font-heading
│   │   ├── aniversariantes-list.tsx                 # MODIFIED: PageSection, tipografia
│   │   ├── risco-evasao-table.tsx                   # MODIFIED: PageSection, card-list mobile, cor semântica
│   │   └── turmas-sem-professor-list.tsx            # MODIFIED: empilhar badges em mobile
│   │
│   ├── layout/
│   │   └── page-container.tsx                       # MODIFIED: max-w-7xl quando maxWidth="dashboard"
│   │
│   └── ui/
│       └── (sem mudanças — reuso)
│
└── app/
    └── globals.css                                   # MODIFIED: --chart-4 de #8B5CF6 para #1A6FC2
```

## Implementation Phases

### FASE A — Fundação (dependência de todas as outras)

**Objetivo**: Corrigir tokens dissonantes, aumentar largura do container, criar hero de boas-vindas.

**Tasks-chave**:
- T-A01: `globals.css` — alterar `--chart-4: #8B5CF6` → `--chart-4: #1A6FC2`
- T-A02: `page-container.tsx` — `max-w-6xl` → `max-w-7xl` quando `maxWidth="dashboard"`
- T-A03: criar `dashboard-hero.tsx` (gradiente `from-primary/5 via-background to-accent/5`, saudação, escola, data, 4 quick actions)
- T-A04: criar `page.tsx` temporário com Hero (rollback se quebrar)

**Princípios PE**: PE-101, PE-201, PE-202, PE-301, PE-302, PE-602, PE-604

**Critério de aceite**: Dashboard carrega com hero visível, escola e data corretas, 4 quick actions clicáveis.

---

### FASE B — StatCards modernos

**Objetivo**: Adicionar `trend` (variação % vs. mês anterior), `variant` semântico, `tabular-nums`.

**Tasks-chave**:
- T-B01: `dashboard.ts` action — estender `DashboardData` com `trend` por métrica (opcional; se complexo, calcular client-side comparando com mês anterior)
- T-B02: `stat-card.tsx` — garantir `tabular-nums` no value
- T-B03: `page.tsx` — definir 1 hero metric + 3 secundárias com variants semânticos

**Princípios PE**: PE-202, PE-203, PE-801

**Critério de aceite**: 4 StatCards com hierarquia visual (1 maior + 3 padrão), variants corretos.

---

### FASE C — Gráficos modernos (cor semântica + tooltip + grid)

**Objetivo**: Sair do "Excel 2010" para SaaS moderno.

**Tasks-chave** (afetam 8 charts):
- T-C01: criar helper `chart-colors.ts` (paleta semanticBar() para ocupacao/frequencia)
- T-C02-C09: aplicar `<CartesianGrid>`, `<Legend>`, tooltip customizado, `h-72 sm:h-80` em cada chart
- T-C10: `ocupacao-por-turma-chart.tsx` — cor semântica (success/warning/destructive)
- T-C11: `frequencia-por-turma-chart.tsx` — cor semântica (success/warning/destructive)
- T-C12: charts de etapa/tipo/deficiência/transtorno/modalidade/turno — gradiente primary → primary/60 ou palette primary+accent

**Princípios PE**: PE-801, PE-802, PE-803, PE-604

**Critério de aceite**: Todos os 8 charts com grade sutil, legenda, tooltip elevado. Ocupação e Frequência por turma com cores semânticas.

---

### FASE D — Refator de widgets isolados

**Objetivo**: Corrigir widgets que misturam `<Card>` e `<PageSection>`, ajustar tipografia.

**Tasks-chave**:
- T-D01: `frequencia-media-card.tsx` — `text-2xl font-heading` → `text-[36px] font-bold tabular-nums`; `text-xs` → `text-[13px]`
- T-D02: `ocupacao-card.tsx` — `<Card>` → `<PageSection>`; barra com cor semântica
- T-D03: `aniversariantes-list.tsx` — `<Card>` → `<PageSection>`; aplicar tipografia oficial

**Princípios PE**: PE-202, PE-203, PE-501

**Critério de aceite**: 3 widgets seguem padrão de composição; tipografia alinhada com `visual-language.md §5`.

---

### FASE E — Tabs + Agrupamento temático

**Objetivo**: Reduzir carga cognitiva com 4 tabs (Visão Geral, Acadêmico, Frequência, Alertas).

**Tasks-chave**:
- T-E01: criar `dashboard-tabs.tsx` (wrapper shadcn Tabs com searchParams)
- T-E02: `page.tsx` — transformar composição linear em composição por tab
- T-E03: `page.tsx` — ler `searchParams.tab` (Next 15 API: `searchParams.tab` é Promise)
- T-E04: Tabs default "Visão Geral"; em mobile scroll horizontal

**Princípios PE**: PE-301, PE-302, PE-303, PE-602, PE-604, PE-605, PE-704

**Critério de aceite**: 4 tabs funcionais, URL atualiza ao mudar, deep-link funciona, mobile tem scroll horizontal.

---

### FASE F — Filtros de período (UI only, sem re-fetch)

**Objetivo**: Componente de filtro preparado para v2; sem acionar re-fetch nesta spec.

**Tasks-chave**:
- T-F01: criar `filtro-periodo.tsx` (Select "Mês atual | Trimestre | Ano letivo" — desabilitado "Mês" e "Trimestre" com tooltip "Em breve")
- T-F02: integrar no `<DashboardTabs>` ou `<DashboardHero>`

**Princípios PE**: PE-401, PE-501

**Critério de aceite**: Filtro visível, ano letivo selecionável, demais com tooltip "Em breve".

---

### FASE G — Acessibilidade (PE-9xx)

**Objetivo**: Garantir navegação por teclado, contraste AA, `prefers-reduced-motion`.

**Tasks-chave**:
- T-G01: validar todos os Recharts com `prefers-reduced-motion` (verificar se Recharts já respeita; documentar)
- T-G02: revisar contraste de texto em todos os badges/charts (≥4.5:1)
- T-G03: testar dark mode em todos os charts (gradient e cores semânticas legíveis)
- T-G04: garantir que Tabs shadcn são navegáveis por teclado (já são por padrão; validar)

**Princípios PE**: PE-901, PE-902, PE-903, PE-904

**Critério de aceite**: Tab navega por teclado; dark mode sem perda de legibilidade; reduced-motion desabilita animações de hover.

---

### FASE H — Responsividade e Mobile (PE-6xx) ⭐ CRÍTICA

**Objetivo**: Garantir que a mesma tarefa seja possível em qualquer dispositivo (PE-601), reorganizando (não removendo) funcionalidades (PE-602).

**Tasks-chave**:
- T-H01: `page-container.tsx` — testar todos os breakpoints (sm 640, md 768, lg 1024, xl 1280, 2xl 1440)
- T-H02: `dashboard-hero.tsx` — quick actions em `overflow-x-auto` em mobile, grid 4-col em desktop
- T-H03: `risco-evasao-table.tsx` — criar versão card-list para `<md`, manter Table para `≥md`
- T-H04: `turmas-sem-professor-list.tsx` — empilhar badges verticalmente em mobile
- T-H05: `page.tsx` — banner "Super Admin" empilhado em mobile, select `w-full sm:max-w-xs`
- T-H06: charts — Y-axis width menor em mobile (`width={60}` ou `width={80}`)
- T-H07: charts — `wrapperStyle={{ maxWidth: 220 }}` no Tooltip
- T-H08: validar áreas de toque ≥ 36px (botões, tabs, quick actions)
- T-H09: validar manualmente em Chrome DevTools nos 5 breakpoints

**Princípios PE**: **PE-601, PE-602, PE-603, PE-604, PE-605**

**Critério de aceite**: Dashboard funciona em 360px, 768px, 1024px, 1280px, 1440px sem scroll horizontal, sem perda de funcionalidade, sem alvos de toque < 36px.

---

## Riscos e Decisões

| # | Risco / Decisão | Mitigação |
|---|---|---|
| R1 | Drill-down em gráficos: clicar para ver detalhe | **Adiar para v2.** Manter `cursor="pointer"` agora sem ação |
| R2 | Filtro de período requer mudança em `getDashboardData` | **Adiar.** Filtro só UI; re-fetch em spec futura |
| R3 | `--chart-4` afeta TODOS os charts do sistema | **Aceitável.** Cor estava em desuso; validar com `npx next build` |
| R4 | Tabs em Next 15 com `searchParams` (Promise) | Tratar como `use(searchParams)` no client; documentar no code review |
| R5 | Tabela → card em mobile adiciona duplicação de markup | Aceitável; padrão é `block md:hidden` + `hidden md:block` |
| R6 | Hero metric é decisão de produto | Solicitar ao usuário: "Frequência Média" ou "Taxa de Ocupação"? |
| R7 | Spec 006 em paralelo com spec 004 (em andamento) | Ortogonais. 006 só toca `src/app/(app)/(auth)/page.tsx` e `src/components/dashboard/`; 004 só `src/app/(app)/(auth)/gestao-usuarios/painel-aluno/` |
| R8 | `FASE F` (Filtro) sem re-fetch pode parecer "meia-boca" | Aceitável; UX honesto com tooltip "Em breve" |

## Estratégia de Migração

- **Commits por fase**: 1 commit por fase (A, B, C, D, E, F, G, H)
- **Branching**: branch dedicada `006-dashboard-modernizacao` a partir de `main`
- **Feature flag**: nenhuma (refator contínuo, sem breaking change)
- **Rollback**: cada commit é revertível independentemente; `npx next build` após cada fase
- **Validação**: build + screenshot antes/depois de cada fase; comparativo em light + dark

## Validação Final

Antes de marcar spec como concluída:

- [ ] `npx next build` passa sem erro
- [ ] Dashboard carrega em <2s com dados em dev
- [ ] Todos os 8 charts renderizam sem warnings do Recharts
- [ ] Tabs funcionam; URL atualiza; deep-link preserva tab
- [ ] Teste visual em 360, 768, 1024, 1280, 1440px (light + dark)
- [ ] Navegação por teclado: Tab percorre Hero → StatCards → Tabs → Charts
- [ ] Empty states testados (escola sem dados, sem risco evasão, etc.)
- [ ] Skeletons aparecem durante re-fetch
