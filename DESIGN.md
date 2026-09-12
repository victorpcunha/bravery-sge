---
name: Bravery SGE
description: Census-compliant school management SaaS with a restrained steel-blue operational UI
colors:
  primary: "#4682B4"
  primary-foreground: "#FFFFFF"
  accent-cyan: "#59A5E3"
  deep-blue: "#396991"
  page-bg: "#EDF1F5"
  card-bg: "#FFFFFF"
  ink: "#1E293B"
  muted-ink: "#52607A"
  muted-bg: "#E4E9F0"
  border-line: "#D7DEE8"
  danger: "#C4453A"
  ok-green: "#16A34A"
  warn-amber: "#C2571C"
  sidebar-bg: "#294C69"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
  heading:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.deep-blue}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  card-resting:
    backgroundColor: "{colors.card-bg}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input-field:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "36px"
  status-badge:
    rounded: "{rounded.sm}"
    padding: "2px 8px"
---

# Design System: Bravery SGE

## Overview

**Creative North Star: "The Calm Registrar"**

Bravery SGE is an Operate-mode workspace: secretaries, principals, and teachers complete structured tasks all day, so the interface disappears into the job. One sans family, one steel-blue brand, tonal surfaces instead of shadows, and the same five page compositions everywhere. Density is welcome (wide tables, information-rich cards); decoration is not.

**Key Characteristics:**

- Restrained single-accent system: steel blue does the talking, gold accents focus, deep steel supports.
- Composition over invention: PageContainer, PageHeader, PageSection, FilterBar, FormCard, StatusBadge, ConfirmDialog, EmptyState, StatCard.
- Flat by default with a 5-level elevation reserve for overlays only.
- 15 px body copy with a tight 9-step type scale and fixed rem sizes (no fluid display type in product UI).
- Light-first SaaS surfaces with a true slate dark mode, never inverted brand blue.

## Colors

A cool institutional palette: steel blue leads, golden bronze assists interaction, deep steel backs it up, bluish-slate neutrals carry content.

### Primary

- **Steel Blue** (#4682B4): brand, primary buttons, links, active sidebar accents, chart-1. Contrast on white 4.11:1 (AA-large; documented tradeoff — `--secondary` is the AA-normal fill).
- **White on Blue** (#FFFFFF): text on primary and secondary actions (`--primary-foreground`, `--secondary-foreground` light).
- **Light Accent** (#59A5E3): realces claros — seleção, hovers, complementos (`--accent`). Texto sobre accent é Deep Navy (#192E40, 5.26:1).
- **Focus Gold** (#B8863B): anel de foco fixo (`--ring`), desacoplado do accent por contraste.
- **Deep Steel** (#396991): secondary buttons, informative text, charts (`--secondary`, `--info` light; chart-3). 5.83:1 on white.

### Neutral

- **Slate Page Wash** (#EDF1F5): page background light (`--background`).
- **Surface White** (#FFFFFF): cards, popovers, inputs light (`--card`, `--popover`, `--input`).
- **Slate Ink** (#1E293B): primary text light (`--foreground`, `--card-foreground`).
- **Muted Zone** (#E4E9F0): section/panel fills light (`--muted`); sidebar hover is a white/12 wash (`--sidebar-accent`).
- **Secondary Ink** (#52607A): secondary text light (`--muted-foreground`, 5.58:1 on page wash).
- **Hairline** (#D7DEE8): default 1 px borders light (`--border`).
- **Deep Sidebar** (#294C69): sidebar background light (`--sidebar`, 9:1 with white text); dark mode stays slate-950 with its own tokens.
- **Focus Gold** (#B8863B): ring equals accent in light mode (`--ring`); dark keeps its own ring.

### Named Rules

- **The Token-Only Rule.** No hex in components or pages; every color resolves to a `globals.css` token (`bg-primary`, `text-muted-foreground`, `border-border`).
- **The One-Voice Rule.** Primary blue marks the primary action, current selection, and state indicators only — never decoration or large fills.
- **The Sidebar-Is-Deep-Steel Rule.** Light-mode sidebar is deep steel, never white; hover is a white/12 wash with white text (`text-sidebar-foreground`, never `text-accent-foreground` — contrast).

Semantic colors: Success Leaf (#16A34A), Warning Amber (#C2571C), Danger Red (#C4453A), Info Steel (= secondary). Tinted fills use `/10` backgrounds with `/20` borders (`bg-success/10 text-success border-success/20`). Charts: `#4682B4`, `#B8863B`, `#396991`, `#294C69`, `#16A34A`.

## Typography

**Display Font:** Plus Jakarta Sans (with system-ui fallback)
**Body Font:** Plus Jakarta Sans (with system-ui fallback)
**Label/Mono Font:** Plus Jakarta Sans for labels; system mono only for code, data, or time badges

**Character:** One well-tuned sans carries everything from KPI numerals (`tabular-nums`) to form labels; hierarchy comes from size/weight steps (ratio ~1.125–1.2), never from a second family.

### Hierarchy

- **Display** (700, 36px, 1.2): KPI numerals only — StatCard value (`text-[36px] font-bold leading-none`).
- **Title** (700, 28px, 1.2): page titles — PageHeader (`text-[28px] font-bold leading-tight`).
- **Heading** (600, 20px, 1.3): section titles — PageSection/FormCard (`text-[20px] font-semibold leading-snug`).
- **Subheading** (600, 16px, 1.4): card headlines, names in lists.
- **Body** (400, 15px, 1.5): running copy and descriptions (`text-[15px]`); measure 65–75ch for prose, denser tables allowed.
- **Label** (500, 14px, 1.4): labels, buttons, table data.
- **Small** (400, 13px, 1.4): hints, timestamps, legends (never body copy).
- **Caption** (400, 12px, 1.3): lowest-priority annotations.

### Named Rules

- **The Fifteen-Pixel Body Rule.** Body copy is 15px; `text-sm` (14px) as a description default and `text-base` (16px) as a section title are both violations.
- **The Weight-Ceiling Rule.** Only weights 400/500/600/700; no italics, no all-caps, no serif or decorative faces.

## Layout

Container-driven pages with responsive collapse, not fluid type: `PageContainer` (default uncapped; `maxWidth="dashboard"` for dashboards) → `PageHeader` (icon tile `bg-primary/10`, breadcrumbs, actions) → `PageSection` (`default` card, `flush` for tables with `p-0` body, `compact` for filters) → content. Five official compositions: Listing (Header + compact Filters/FilterBar + flush table section with the "Nova" button in section `actions`), Listing-with-Modal, Create/Edit (Header with breadcrumbs + FormCards + end-aligned actions), Detail (Header + sections), Dashboard (Header + StatCard grid + sections). FilterBar wraps SearchInput (leading icon, `pl-10`, optional debounce) plus Selects and quick-filter buttons. Mobile lists switch to card `<ul>` under `md` with 44px action targets; tables keep a sticky first column (`sticky left-0`) inside `overflow-x-auto`. Tab bars and modal footers follow the dashboard pattern (`bg-card border shadow-xs`; active tab `bg-primary text-primary-foreground`; dialog body `flex-1 overflow-y-auto`, footer `shrink-0 border-t bg-muted/30`).

## Elevation & Depth

Flat by default with tonal layering; shadows appear only as a response to state or overlay.

### Shadow Vocabulary

- **Resting** (`shadow-sm`: `0 1px 3px rgba(13,17,23,0.04), 0 1px 2px rgba(13,17,23,0.06)`): cards at rest — the maximum for resting surfaces.
- **Floating** (`shadow-md`: `0 6px 16px rgba(13,17,23,0.08), 0 3px 6px rgba(13,17,23,0.04)`): card hover, dropdowns, popovers.
- **Overlay** (`shadow-lg`: `0 12px 28px rgba(13,17,23,0.12), 0 4px 10px rgba(13,17,23,0.04)`): dialogs, sheets, tooltips (`shadow-lg bg-popover`).
- **High** (`shadow-xl`: `0 20px 40px rgba(13,17,23,0.16), 0 8px 16px rgba(13,17,23,0.06)`): command palette, dialog-over-dialog.
- Dark mode re-issues the same ramp in black (`0.3–0.7` alpha).

### Named Rules

- **The Flat-By-Default Rule.** Resting cards use at most `shadow-sm`; `shadow-md` only on hover; `shadow-lg/xl` reserved for overlays. Declare elevation once — border or shadow, never a 1px border under a wide soft shadow.

## Shapes

Quiet rectangles with an explicit 6-step radius scale and 1px hairlines; pills only for small controls.

Corners: inputs, badges, chips, and tags `rounded-sm` (6px); buttons, menu items, and tabs `rounded-md` (8px); cards, modals, popovers, and dropdowns `rounded-lg` (12px, the `--radius` alias); hero/feature cards `rounded-xl` (16px); decorative containers, avatars-as-panels, and banners `rounded-2xl` (24px); pills, avatars, and circular overlays `rounded-full` (9999px). Borders are 1px `border-border`; icon tiles are `rounded-xl bg-primary/10`. Motion uses three durations on one easing (`150ms` hover/focus, `200ms` popover/section, `300ms` dialog/drawer/tabs; `cubic-bezier(0.4, 0, 0.2, 1)`), with `prefers-reduced-motion` respected and no orchestrated page-load sequences.

## Components

Buttons lead with a single confident voice, then echo it everywhere; cards stay flat; inputs stay calm until focus.

### Buttons

- **Shape:** `rounded-md` (8px), height 40px (dialog footer 40px, touch targets ≥36px, hero actions 44px).
- **Primary:** `bg-primary text-primary-foreground`, hover `bg-primary/90`, tactile `active:scale-[0.98]`.
- **Hover / Focus:** `focus-visible:ring-2 ring-ring/30`; focus borders shift to gold (`focus:border-accent focus:ring-accent/20`).
- **Secondary / Ghost / Tertiary:** secondary is deep steel (`bg-secondary`); list actions use `variant="ghost" size="icon-sm"` with destructive icons in `text-destructive`; gradients only as `from-primary to-accent` for logo/avatar/hero marks.

### Chips

- **Style:** `StatusBadge` over shadcn Badge — `bg-{semantic}/10 text-{semantic} border-{semantic}/20` for `success|warning|destructive|info|primary`; `bg-muted text-muted-foreground border-border` for `muted`.
- **State:** filter pills toggle `default`/`outline`; selected "Tipo de Pessoa" pills are buttons with `aria-pressed` and a Check icon.

### Cards / Containers

- **Corner Style:** `rounded-lg` (12px); hero variants `rounded-xl` (16px).
- **Background:** `bg-card` on `bg-background` page; muted zones `bg-muted`.
- **Shadow Strategy:** resting `shadow-sm` max; see Elevation & Depth.
- **Border:** 1px `border-border`.
- **Internal Padding:** sections `px-6 py-4` header + `p-6` body (`compact`: `px-4 py-3` + `p-4`; `flush` tables: `p-0`).

### Inputs / Fields

- **Style:** `bg-card` (`--input` white light / slate dark), 1px `border-border`, `rounded-sm` (6px), `h-9`-class height.
- **Focus:** gold border + gold/20 ring (`focus:border-accent focus:ring-accent/20`).
- **Error / Disabled:** inline message with `role="alert"`; required fields carry `aria-required="true"`; disabled fieldsets use `className="contents"` so tabs stay navigable.

### Navigation

- **Style:** white (light) / slate-950 (dark) sidebar on `bg-sidebar text-sidebar-foreground`; top-level items with icon + label, collapsible groups, mobile header with `SidebarTrigger`.
- **States:** active `bg-primary/10 text-primary` with luminous bar; hover `hover:bg-muted hover:text-foreground`; sub-item active `bg-sidebar-accent/80`.
- **Mobile:** sidebar collapses to drawer; tab bars use the card container pattern above.

### Pagination

- **Style:** shared `<Pagination>` — prev/next, `Mostrando X a Y de Z` counter (`text-[14px] tabular-nums`), `role="navigation"`, 10/page client-side (server-side for audit).

## Do's and Don'ts

Concrete guardrails from the implemented system. Tokens resolve via Tailwind v4 (`bg-primary`, `text-muted-foreground`, `border-border`, `from-primary to-accent`).

### Do:

- **Do** start every page with `<PageContainer>` and every header with `<PageHeader>`.
- **Do** put the "Nova" button in the flush table section's `actions`, with table names in `font-medium text-foreground` and secondary columns in `text-muted-foreground`.
- **Do** use `<StatusBadge>` for every status and `<EmptyState>` for every empty/denied state (`ShieldAlert` + "Sem permissão").
- **Do** spell the census truth exactly: `nome_completo`, `cpf`, `email`, `telefone_celular`, `telefone_fixo`, `logradouro`, `bairro`, `numero`, `complemento`.
- **Do** use tabular numerals for KPIs and counters (`tabular-nums`).

### Don't:

- **Don't** use hex, `rgb()`, or arbitrary color values in components or pages (`bg-[#...]`, `text-slate-*`, `border-slate-*`, `bg-white`, `text-white` on primary).
- **Don't** use native `<button>`, `<table>`, `<select>`, or `<input type="text">` with inline styling — use shadcn `<Button>`, `<Table>`, `<Select>`, `<Input>`.
- **Don't** hand-roll headings, containers, or confirm flows — no `<h1>` with classes, no `container mx-auto py-8 px-4`, no `card-glass`, no `shadow-[rgba]`, no `if (confirm())`.
- **Don't** use `text-sm` for body copy, `text-base` for section titles, or `text-2xl font-semibold` for page titles.
- **Don't** compute radius with `calc()` or reach for `rounded-3xl/4xl` — only the six official steps.
- **Don't** hardcode sidebar colors (`#0F2B46`, `#1D3557`, navy fills) or colored hard-offset shadows, gradient text, kickers/eyebrows, or glass-as-decoration.
