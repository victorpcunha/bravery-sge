---
name: Bravery SGE
description: Census-compliant school management SaaS with a teal institutional operational UI
colors:
  primary: "#3f9ea8"
  primary-foreground: "#0a292c"
  secondary: "#2c747c"
  secondary-foreground: "#FFFFFF"
  accent: "#2c747c"
  accent-foreground: "#FFFFFF"
  base-teal: "#3f9ea8"
  page-bg: "#eef4f4"
  card-bg: "#FFFFFF"
  ink: "#0a292c"
  muted-ink: "#3d5a5e"
  muted-bg: "#dce8e9"
  border-line: "#c4d9db"
  ring-focus: "#1b4d52"
  danger: "#B3261E"
  danger-light: "#F9E9E7"
  ok-green: "#2c747c"
  ok-light: "#dbebed"
  warn-amber: "#C2571C"
  warn-light: "#FBEFE2"
  info: "#2c747c"
  info-light: "#dbebed"
  sidebar-bg: "#3f9ea8"
  chart-1: "#3f9ea8"
  chart-2: "#1b4d52"
  chart-3: "#0a292c"
  chart-4: "#7fbbc2"
  chart-5: "#C2571C"
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
    backgroundColor: "{colors.ok-light}"
    textColor: "{colors.primary}"
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

# Design System: Bravery SGE (Atlas v5)

> Fonte canônica única de verdade visual. `specs/002-design-system/catalog.md` detalha contratos de
> componentes; `AGENTS.md` traz as regras operacionais. Em caso de divergência, este arquivo vence.
> Tokens reais vivem em `src/app/globals.css` (`:root` = light; `.dark` preservado de geração
> anterior, fora do escopo). Auditoria de sistema todo em 2026-09-15: zero hex hardcoded em
> `src/**/*.tsx|ts` fora de `globals.css`, `preview-atlas` e dos estilos react-pdf (que usam os
> mesmos valores Atlas como literais, sem acesso a tokens).

## Overview

**Creative North Star: "Atlas Escolar"**

Bravery SGE is an Operate-mode workspace: secretaries, principals, and teachers complete structured
tasks all day, so the interface disappears into the job. Titles speak with a screen-cut serif voice,
like the heading of an official school record; everything operable stays in a quiet sans. One
teal voice, tonal surfaces instead of shadows, and the same five page compositions
everywhere. Density is welcome (wide tables, information-rich cards); decoration is not.

**Key Characteristics:**

- Single-hue system: deep teal carries action, selection, and focus; tints carry calm.
- Two type voices with strict jobs: Spectral for titles, Plus Jakarta Sans for everything operable.
- Composition over invention: PageContainer, PageHeader, PageSection, FilterBar, FormCard,
  StatusBadge, ConfirmDialog, EmptyState, StatCard.
- Flat by default with a 5-level elevation reserve for overlays only.
- 15 px body copy with a fixed role scale; tabular numerals for every number that counts.
- Light-first surfaces with the previous slate dark mode preserved untouched.
- Touch-first: every tappable element is at least 44 px; tables become minicards below `md`.
- Print parity: official PDF documents use the same Atlas ink, muted, and teal values.

## Colors

A cool teal palette built from the brand anchor `#3f9ea8`, measured end to end: app tokens, charts,
sidebar, document PDFs, and states. One accent, locked everywhere. The anchor itself is reserved
for fills and large graphics (3.15:1 with white, so never text); text roles use its darkened shades.

### Primary

- **Brand Anchor** (#3f9ea8): THE primary. Buttons, fills, chart series, large graphic areas.
  Teal Ink on Anchor **4.88:1 (AA)**, so text on primary is always ink, never white (white on
  Anchor is 3.15:1, large text only).
- **Teal Ink on Primary** (#0a292c): text on primary buttons, active pills, badges.
- **Deep Teal** (#1b4d52): focus ring, PDF highlights and rule lines, chart-1 depth. White on Deep
  Teal **9.42:1 (AAA)**.
- **Support Teal** (#2c747c): secondary buttons, interaction highlight (`--secondary`, `--accent`,
  `--info`, `--success` light roles). White on Support **5.39:1 (AA)**; Support on paper
  **4.85:1 (AA)**, so body links use `text-secondary`, never `text-primary`.
- **Tonal Tint** (#dbebed): quiet fills for secondary buttons, active pills, success/info lights.
  Deep Teal on Tint **7.68:1**.
- **Focus Teal** (#1b4d52): `--ring` stays deep (a ring in Anchor would clear only 3.15:1 on
  white). A 2 px ring clears 9:1.

### Neutral

- **Cool Paper** (#eef4f4): page background light (`--background`).
- **Surface White** (#FFFFFF): cards, popovers, inputs light (`--card`, `--popover`, `--input`).
- **Teal Ink** (#0a292c): primary text light (`--foreground`). Ink on Paper **13.82:1**.
- **Mist Zone** (#dce8e9): section/panel fills light (`--muted`).
- **Secondary Ink** (#3d5a5e): secondary text light (`--muted-foreground`). **6.69:1** on paper,
  **7.44:1** on white.
- **Hairline** (#c4d9db): default 1 px borders light (`--border`).
- **Brand Sidebar** (#3f9ea8): sidebar background light (`--sidebar`); ink text (4.88:1),
  ink active tile and indicator bar, ink/12 hover wash.

### Semantic

Success Leaf = Support Teal (#2c747c / light #dbebed). Warning Amber (#C2571C / light #FBEFE2;
4.49:1, pre-existing boundary — do not expand amber usage to compensate). Danger Red (#B3261E /
light #F9E9E7, **6.54:1**). Info Teal (= secondary). Tinted fills use `/10` backgrounds with
`/20` borders (`bg-success/10 text-success border-success/20`).

### Charts

Five persistent series colors, always in order: Anchor `#3f9ea8`, Deep Teal `#1b4d52`, Ink
`#0a292c`, Mist `#7fbbc2`, Amber `#C2571C`. Single-series charts use the Anchor. Frequency/occupancy
charts override with semantic color (success/warning/destructive) plus a `SemanticLegend` — the only place
where status color, not series color, leads.

### Print (document PDFs)

react-pdf stylesheets cannot read CSS tokens, so the six document stylesheets
(`boletim-escolar`, `declaracao-matricula`, `ficha-individual-aluno`, `historico-escolar`,
`relatorio-desempenho-pdf`, `relatorio-matriculas-pdf`) carry Atlas as literals: body Ink
`#0a292c`, secondary `#3d5a5e`, highlights and rule lines Deep Teal `#1b4d52`. Any Atlas change must
update these six files in the same pass (audited together; zero drift allowed).

### Named Rules

- **The Token-Only Rule.** No hex in components or pages; every on-screen color resolves to a
  `globals.css` token (`bg-primary`, `text-muted-foreground`, `border-border`). The only literals
  allowed in `src` are the six PDF stylesheets above.
- **The One-Voice Rule.** The Anchor marks the primary action, current selection, and state
  indicators only — never decoration or large fills. Secondary actions use the tonal tint with
  teal text, never a second saturated solid.
- **The Anchor-Text Rule.** `text-primary` on light surfaces clears only non-text and large-text
  contrast — use it for icons and graphics, never body copy. Body links use `text-secondary`.
  Text on primary fills is always Teal Ink.
- **The Sidebar-Is-Anchor Rule.** Light-mode sidebar is the brand anchor, never white and
  never ink; text is always ink (`text-sidebar-foreground`), hover is an ink/12 wash, the active
  tile and indicator bar are ink with white glyphs.

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

Flat by default with tonal layering; shadows tinted to the teal ink `rgba(10,41,44,…)`:

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
- **Secondary (tonal):** tint fill with `text-primary` and matching border — colored, but quieter
  than primary.
- **Focus:** `focus-visible` ring + border in teal (`ring-ring/50`, `border-ring`). List actions
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
- **Focus:** teal border + ring (both teal since v3).
- **Error / Disabled:** inline message with `role="alert"`; required fields carry
  `aria-required="true"`; disabled fieldsets use `className="contents"` so tabs stay navigable.
- Label above input, helper optional, error below. Never placeholder-as-label.

### Navigation

- **Style:** brand anchor (`bg-sidebar text-sidebar-foreground`) in light; slate-950 in dark;
  wordmark in Spectral; top-level items with icon + label, collapsible groups, mobile header with
  `SidebarTrigger`.
- **States:** active ink tile (`bg-sidebar-primary`) with white glyphs
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
- Keep PDF stylesheets on the Atlas literals when any color changes.
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

- **v5 (2026-09-15):** redefined around the teal anchor `#3f9ea8` (single-hue ramp from the
  provided tints and shades). Primary IS the anchor (ink text 4.88:1 AA; white would be 3.15:1, so
  `text-primary` is icons and large text only, body links use secondary); ring stays Deep Teal
  `#1b4d52` for focus visibility; sidebar teal ink `#0a292c`; shadows retinted;
  tokens + 6 PDFs + docs migrated in one pass; `.dark` preserved.
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
