---
name: Bravery SGE
description: Census-compliant school management SaaS with an indigo institutional operational UI
colors:
  primary: "#4F46E5"
  primary-foreground: "#FAFAFA"
  secondary: "#F1F2F9"
  secondary-foreground: "#1E1B4B"
  accent: "#F59E0B"
  accent-foreground: "#1C1917"
  page-bg: "#F8F9FC"
  card-bg: "#FFFFFF"
  ink: "#1E1B4B"
  muted-ink: "#64748B"
  muted-bg: "#F1F2F9"
  border-line: "#E2E5F0"
  ring-focus: "#4F46E5"
  danger: "#DC2626"
  danger-light: "#FEE2E2"
  ok-green: "#22C55E"
  ok-light: "#DCFCE7"
  warn-amber: "#F59E0B"
  warn-light: "#FEF3C7"
  info: "#3B82F6"
  info-light: "#DBEAFE"
  sidebar-bg: "#1E1B4B"
  chart-1: "#4F46E5"
  chart-2: "#3B82F6"
  chart-3: "#312E81"
  chart-4: "#22C55E"
  chart-5: "#F59E0B"
typography:
  display:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
  heading:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  subheading:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
  small:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.3
  data-mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
  full: "9999px"
spacing:
  base: "4px"
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  card-resting:
    backgroundColor: "{colors.card-bg}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input-field:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "44px"
  status-badge:
    rounded: "{rounded.full}"
    padding: "4px 12px"
  page-title:
    typography: "{typography.display}"
    textColor: "{colors.ink}"
  section-title:
    typography: "{typography.heading}"
    textColor: "{colors.ink}"
---

# Design System: Bravery SGE (Atlas v6)

> Fonte canônica única de verdade visual. `specs/002-design-system/catalog.md` detalha contratos de
> componentes; `AGENTS.md` traz as regras operacionais. Em caso de divergência, este arquivo vence.
> Tokens reais vivem em `src/app/globals.css` (`:root` = light; `.dark` preservado de geração
> anterior, fora do escopo). Auditoria de sistema todo: zero hex hardcoded em `src/**/*.tsx|ts`
> fora de `globals.css` e de `src/lib/pdf-palette.ts` (fonte única JS dos PDFs react-pdf, que não
> leem tokens CSS).

## Overview

**Creative North Star: "Atlas Escolar"**

Bravery SGE is an Operate-mode workspace: secretaries, principals, and teachers complete structured
tasks all day, so the interface disappears into the job. Titles speak with a screen-cut serif voice,
like the heading of an official school record; everything operable stays in a quiet sans. One
indigo voice with an amber spark for rare highlights, tonal surfaces instead of shadows, and the
same five page compositions everywhere. Density is welcome (wide tables, information-rich cards);
decoration is not.

**Key Characteristics:**

- Indigo system: deep indigo carries action, selection, and focus; amber appears only in rare,
  pointed highlights.
- Two type voices with strict jobs: Spectral for titles, Plus Jakarta Sans for everything operable.
- Composition over invention: PageContainer, PageHeader, PageSection, FilterBar, FormCard,
  StatusBadge, ConfirmDialog, EmptyState, StatCard.
- Flat by default with a 5-level elevation reserve for overlays only.
- 15 px body copy with a fixed role scale; tabular numerals for every number that counts.
- Light-first surfaces with the previous slate dark mode preserved untouched.
- Touch-first: every tappable element is at least 44 px; tables become minicards below `md`.
- Print parity: official PDF documents use the same Atlas ink, slate, and indigo values.

## Colors

An indigo institutional palette, measured end to end: app tokens, charts, sidebar, document PDFs,
and states. Indigo leads every action; amber highlights rarely and loudly.

### Primary

- **Indigo** (#4F46E5): brand, primary buttons, links, focus ring, chart-1. Off-white on Indigo
  **6.02:1 (AA)**.
- **Off-white on Indigo** (#FAFAFA): text on primary actions.
- **Soft Lavender** (#F1F2F9): secondary buttons, chips, neutral fills (`--secondary`, `--muted`).
  Ink on Lavender **14.32:1**.
- **Ink on Secondary** (#1E1B4B): text on secondary surfaces.
- **Amber Spark** (#F59E0B): rare pointed highlights only (`--accent`, warnings, recess days).
  Espresso on Amber **8.14:1 (AA)**. Amber never carries body text on light surfaces and never
  fills large areas.
- **Focus Indigo** (#4F46E5): `--ring` follows primary.

### Neutral

- **Page Mist** (#F8F9FC): page background light (`--background`) — sits under white cards
  so sections read as layers, not outlines.
- **Surface Mist** (#F8F9FC): section fills light (`--surface`).
- **Surface White** (#FFFFFF): cards, popovers, inputs light (`--card`, `--popover`).
- **Indigo Ink** (#1E1B4B): primary text light (`--foreground`). Ink on White **15.99:1**.
- **Secondary Slate** (#64748B): secondary text light (`--muted-foreground`). **4.76:1** on white.
- **Hairline** (#E2E5F0): default 1 px borders light (`--border`, `--input`).
- **Deep Sidebar** (#1E1B4B): sidebar background light (`--sidebar`); lavender text, indigo active
  tile with white glyphs, deep indigo hover wash.

### Semantic

Success Leaf (#22C55E / light #DCFCE7) for confirmations and school-day marks. Warning Amber
(#F59E0B / light #FEF3C7) for warnings. Danger Red (#DC2626 / light #FEE2E2, **4.83:1**) for
destructive actions. Info Blue (#3B82F6 / light #DBEAFE). Tinted fills use `/10` backgrounds with
`/20` borders (`bg-success/10 text-success border-success/20`). Known boundary: success green and
info blue as small text on white clear only ~2.3:1 and ~3.7:1, so badges pair them with their
light fills and semibold 12px labels, never running copy.

### Charts

Five persistent series colors, always in order: Indigo `#4F46E5`, Blue `#3B82F6`, Deep Indigo
`#312E81`, Green `#22C55E`, Amber `#F59E0B`. Single-series charts use Indigo. Frequency/occupancy
charts override with semantic color (success/warning/destructive) plus a `SemanticLegend` — the only place
where status color, not series color, leads.

### Print (document PDFs)

react-pdf stylesheets cannot read CSS tokens, so the six document stylesheets
(`boletim-escolar`, `declaracao-matricula`, `ficha-individual-aluno`, `historico-escolar`,
`relatorio-desempenho-pdf`, `relatorio-matriculas-pdf`) import `src/lib/pdf-palette.ts`, the single
JS source that mirrors the Atlas tokens (body Ink `#1E1B4B`, secondary `#64748B`, highlights and
rule lines Indigo `#4F46E5`). Any Atlas change updates `pdf-palette.ts` only — the six files
carry zero loose hex.

### Named Rules

- **The Token-Only Rule.** No hex in components, pages, or PDF stylesheets; every on-screen
  color resolves to a `globals.css` token (`bg-primary`, `text-muted-foreground`, `border-border`)
  and every print color to `src/lib/pdf-palette.ts`.
- **The One-Voice Rule.** Indigo marks the primary action, current selection, and state indicators
  only — never decoration or large fills. Secondary actions sit on soft lavender with ink text.
  Amber highlights rarely and loudly, never as fill or body text.
- **The Sidebar-Is-Indigo Rule.** Light-mode sidebar is deep indigo, never white; text is
  lavender; the active tile is indigo with white glyphs; hover is the deeper indigo wash.

## Typography

**Display Font:** Spectral, Georgia serif fallback (titles only — page 28px, section 20px, dialog
and sheet titles via `font-heading`, sidebar wordmark).
**Body Font:** Plus Jakarta Sans (system-ui fallback), weights 400/500/600/700 — everything
operable: copy, labels, buttons, table data.
**Data Font:** system mono stack (`font-mono`) — BNCC codes, times, INEP numbers, code-like badges.
**Print Font:** Helvetica / Helvetica-Bold (react-pdf built-ins — PDFs never load webfonts).

**Character:** The serif speaks like a record-book heading — institutional, calm, editorial. The
sans does the work without calling attention. Mono appears only where characters must line up
(codes, times, identifiers), never as decoration.

### Hierarchy

- **Title** (Spectral 700, 28px, 1.2): page titles — PageHeader (`font-display text-[28px]
  font-bold leading-tight`).
- **Heading** (Spectral 600, 20px, 1.3): section titles — PageSection/FormCard
  (`font-display text-[20px] font-semibold leading-snug`).
- **Subheading** (sans 600, 16px, 1.4): card headlines, names in lists — stays sans for scanning.
- **Body** (sans 400, 15px, 1.5): running copy and descriptions (`text-[15px]`); measure 65–75ch.
  15px is the established dense-Operate justification against the 16px web floor.
- **Body-strong** (sans 500, 15px, 1.5): emphasized running copy.
- **Label** (sans 500, 14px, 1.4): labels, buttons, table data.
- **Small** (sans 400, 13px, 1.4): hints, timestamps, legends (never body copy).
- **Caption** (sans 400, 12px, 1.3): lowest-priority annotations.
- **Data** (mono 400, 11–13px, 1.4 + `tabular-nums`): codes, times, identifiers.
- **KPI numerals stay sans** (`tabular-nums`): Spectral's proportional old-style figures would
  wobble in dashboards — StatCard values never take the serif.

### Named Rules

- **The Two-Voice Rule.** Spectral voices titles (28/20 + dialog/sheet titles + wordmark).
  Everything else — body, labels, buttons, table data, numerals — is Plus Jakarta Sans. No third
  family without a job only it can do.
- **The Fifteen-Pixel Body Rule.** Body copy is 15px; `text-sm` (14px) as a description default and
  `text-base` (16px) as a section title are both violations.
- **Responsive Display.** Titles step down on small screens so headings never dominate the viewport.
- Only weights the files load: Spectral 500/600/700, Jakarta 400/500/600/700 — no italics,
  no all-caps, no unloaded weights.

## Layout

Container-driven pages with responsive collapse: `PageContainer` (default; `maxWidth="dashboard"`)
→ `PageHeader` → `PageSection` (`default` card, `flush` for tables with `p-0` body, `compact` for
filters). Five official compositions: Listing (Header + compact Filters/FilterBar + flush table
section with the "Nova" button in section `actions`), Listing-with-Modal, Create/Edit (Header with
breadcrumbs + FormCards + end-aligned actions), Detail (Header + sections), Dashboard (Header +
StatCard grid + sections). FilterBar wraps SearchInput (leading icon, `pl-10`) plus Selects and
quick-filter buttons. **Below `md`, tables become minicard `<ul>`** (name + key data + status +
44 px actions); tables keep a sticky first column inside `overflow-x-auto` on `≥md`.

## Elevation & Depth

Flat by default with tonal layering; shadows tinted to the indigo ink `rgba(30,27,75,…)`:

- **Resting** (`shadow-sm`): cards at rest — the maximum for resting surfaces.
- **Floating** (`shadow-md`): card hover, dropdowns, popovers.
- **Overlay** (`shadow-lg`): dialogs, sheets, tooltips (`shadow-lg bg-popover`).
- **High** (`shadow-xl`): command palette, dialog-over-dialog.
- Dark mode re-issues the same ramp in black (0.3–0.7 alpha).

Motion uses three durations on one easing (`150ms` hover/focus, `200ms` popover/section, `300ms`
dialog/drawer/tabs; `cubic-bezier(0.4, 0, 0.2, 1)`), with `prefers-reduced-motion` respected. Animate
only `transform` and `opacity`; tactile press is `active:scale-[0.98]`.

## Shapes

One radius system, six steps, documented rule: inputs/badges `rounded-sm` (6px); buttons/tabs
`rounded-md` (8px); cards/modals `rounded-lg` (12px); hero/feature cards `rounded-xl` (16px);
decorative panels `rounded-2xl` (24px); status pills and avatars `rounded-full`. Borders are 1 px
`border-border`. Declare elevation once — border or shadow, never both. No `calc()` for radius;
no `rounded-3xl/4xl`.

## Components

Buttons lead with a single confident voice; cards stay flat; inputs stay calm until focus.
Variants below are token-bound (`button.tsx` cva): default/secondary/outline/ghost/destructive/
link/accent — all resolve to Atlas tokens, zero literals.

### Buttons

- **Shape:** `rounded-md` (8px), `min-h-[44px]`, `px-5`.
- **Primary:** `bg-primary text-primary-foreground`, hover `bg-primary/80`, press
  `active:scale-[0.98]`.
- **Secondary (lavender):** `bg-secondary text-secondary-foreground` with matching border —
  calm surface, ink text, quieter than primary.
- **Focus:** `focus-visible` ring + border in indigo (`ring-ring/50`, `border-ring`). List actions
  use `variant="ghost" size="icon-sm"` with destructive icons in `text-destructive`; gradients only
  as `from-primary to-accent` for logo/avatar/hero marks.

### Chips

- **Style:** `StatusBadge` over shadcn Badge — `bg-{semantic}/10 text-{semantic}
  border-{semantic}/20` for `success|warning|destructive|info|primary`; `bg-muted
  text-muted-foreground border-border` for `muted`.
- **State:** filter pills toggle `default`/`outline`; selected pills are buttons with `aria-pressed`.

### Cards / Containers

- **Corner Style:** `rounded-lg` (12px); hero variants `rounded-xl` (16px).
- **Background:** `bg-card` on `bg-background` page; muted zones `bg-muted`.
- **Shadow Strategy:** resting `shadow-sm` max; see Elevation & Depth.
- **Border:** 1px `border-border`.
- **Internal Padding:** sections `px-6 py-4` header + `p-6` body (`compact`: `px-4 py-3` + `p-4`;
  `flush` tables: `p-0`).

### Inputs / Fields

- **Style:** `bg-card`, 1px `border-border`, `rounded-sm` (6px), `min-h-[44px]`.
- **Focus:** indigo border + ring (both primary).
- **Error / Disabled:** inline message with `role="alert"`; required fields carry
  `aria-required="true"`; disabled fieldsets use `className="contents"` so tabs stay navigable.
- Label above input, helper optional, error below. Never placeholder-as-label.

### Navigation

- **Style:** deep indigo (`bg-sidebar text-sidebar-foreground`) in light; slate-950 in dark;
  wordmark in Spectral; top-level items with icon + label, collapsible groups, mobile header with
  `SidebarTrigger`.
- **States:** active indigo tile (`bg-sidebar-primary`) with white glyphs
  (`text-sidebar-primary-foreground`) at module and sub-item level; hover `hover:bg-sidebar-accent`;
  collapsed groups keep the wash treatment.
- **Mobile:** sidebar collapses to drawer; max 6 internal module tabs (tab system, spec 016).

### Pagination

- Shared `<Pagination>` — prev/next, `Mostrando X a Y de Z` counter (`text-[14px] tabular-nums`),
  `role="navigation"`, 10/page client-side (server-side for audit).

## Do's and Don'ts

### Do

- Start every page with `<PageContainer>` and every header with `<PageHeader>` (serif title comes
  free).
- Put the "Nova" button in the flush table section's `actions`.
- Use `<StatusBadge>` for every status and `<EmptyState>` for every empty/denied state.
- Ship minicard lists below `md` with 44 px actions.
- Use `font-mono` + `tabular-nums` for codes, times, and identifiers.
- Keep PDF colors on `pdf-palette.ts` when any color changes (zero loose hex in the six
  stylesheets).
- Spell the census truth exactly: `nome_completo`, `cpf`, `email`, `telefone_celular`,
  `telefone_fixo`, `logradouro`, `bairro`, `numero`, `complemento`.

### Don't

- Don't use hex, `rgb()`, or arbitrary color values on screen (`bg-[#...]`, `text-slate-*`,
  `bg-white`, `text-white` on primary). PDFs are the sole literal exception.
- Don't use native `<button>`, `<table>`, `<select>`, or styled `<input>` — use shadcn.
- Don't hand-roll headings, containers, or confirm flows — no `<h1>` with classes, no `container
  mx-auto py-8 px-4`, no `card-glass`, no `shadow-[rgba]`, no `if (confirm())`.
- Don't use `text-sm` for body copy, `text-base` for section titles, or unscaled 40px display type
  on mobile.
- Don't put the serif on numerals, buttons, body copy, or table data — titles only.
- Don't load font weights the files don't declare; don't use italics or all-caps.
- Don't compute radius with `calc()` or reach for `rounded-3xl/4xl`.
- Don't hardcode sidebar colors or ship a second saturated solid next to primary.
- Don't put an eyebrow label above a heading; the heading carries its own weight.
- Don't rely on hover-only or gesture-only interactions; every action has a visible, tappable
  control.

## Changelog

- **v6 (2026-09-15):** user-provided indigo palette applied to light only. Primary `#4F46E5`
  (6.02:1), secondary/muted lavender `#F1F2F9`, amber accent `#F59E0B` for rare highlights,
  semantic set (green/blue/amber/red) with light fills, sidebar deep indigo `#1E1B4B` with lavender
  text and indigo active tile; tokens + 6 PDFs + docs migrated in one pass; `.dark` preserved.
  Known boundary: success/info greens and blues as small text clear below AA, so badges pair them
  with light fills, never running copy.
- **v4 (2026-09-15):** full-system color pass + font definition. Six PDF stylesheets aligned to
  Atlas literals; Spectral 500/600/700 defined for titles with Jakarta kept for all
  operable text and numerals kept sans-tabular; button variants audited token-clean; frontmatter
  extended (`page-title`, `section-title`, `data-mono`). Superseded by v5 teal.
- **v3 Atlas (2026-09-15):** steel-blue → forest-green single-hue system. Primary `#14532D`
  (9.11:1, ends the 4.11:1 tradeoff); accent reunified with secondary `#2E7D4F`; ring follows
  primary; sidebar deep forest `#13291D`; shadows retinted to forest hue; `.dark` preserved
  untouched; touch minimum 44px and minicard rule codified; this file promoted to canonical source.
- **v2 (2026-07-11):** steel-blue repalette, slate dark mode, 9-step type, explicit radius.
- **v1 (2026-07-10):** initial catalog in `specs/002-design-system/catalog.md`.
