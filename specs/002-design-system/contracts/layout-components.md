# Layout Components — API Contracts

**Feature**: 002-design-system
**Date**: 2026-06-11

## PageContainer

```typescript
type PageContainerProps = {
  /** Content of the page */
  children: React.ReactNode
  /** Maximum width constraint. "default" = full width, "dashboard" = max-w-6xl */
  maxWidth?: 'default' | 'dashboard'
  /** Additional CSS classes */
  className?: string
}
```

### Rendering Rules

- `maxWidth="default"`: `<div className="container mx-auto py-8 px-4 {className}">`
- `maxWidth="dashboard"`: `<div className="container mx-auto py-8 px-4 max-w-6xl {className}">`

### Anti-Patterns Replaced

- `<div className="container mx-auto py-8 px-4">` (41+ occurrences)
- `<div className="container mx-auto py-8 px-4 max-w-6xl">` (1 occurrence)
- `<div className="ml-64 p-8">` (1 occurrence — Disciplinas page)

---

## PageHeader

```typescript
type BreadcrumbItem = {
  /** Display label */
  label: string
  /** Link href. If absent, item is non-clickable (current page) */
  href?: string
  /** Optional icon before label */
  icon?: React.ComponentType<{ className?: string }>
}

type PageHeaderProps = {
  /** Page title (required) */
  title: string
  /** Optional subtitle/description */
  description?: string
  /** Optional icon displayed in a rounded container */
  icon?: React.ComponentType<{ className?: string }>
  /** Action buttons/links rendered on the right side */
  actions?: React.ReactNode
  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[]
  /** Additional CSS classes */
  className?: string
}
```

### Rendering Rules

- Heading: `<h1 className="text-2xl font-heading font-semibold text-foreground tracking-tight truncate">`
- Icon container: `<div className="p-2.5 rounded-xl bg-primary/10 shrink-0">`
- Breadcrumbs: `<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">`
- Outer wrapper: `<div className="mb-8 animate-fade-in-up">`

### Anti-Patterns Replaced

- `<h1 className="text-3xl font-bold text-foreground">` (~15 pages)
- `<h1 className="text-2xl font-bold text-primary">` (~5 pages)
- `<h1 className="text-xl font-semibold">` (~10 pages)
- Manual `<button>` breadcrumbs in Disciplinas page

---

## PageSection

```typescript
type PageSectionProps = {
  /** Section title (required) */
  title: string
  /** Optional section description */
  description?: string
  /** Action buttons/links rendered in the header right side */
  actions?: React.ReactNode
  /** Section content */
  children: React.ReactNode
  /** Visual variant */
  variant?: 'default' | 'flush' | 'compact'
  /** Additional CSS classes */
  className?: string
}
```

### Variant Rendering

| Variant | Header Padding | Body Padding | Use Case |
|---------|---------------|-------------|----------|
| `default` | `px-6 py-4` | `p-6` | Standard content sections |
| `flush` | `px-6 py-4` | `p-0` | Tables, lists (no inner padding) |
| `compact` | `px-4 py-3` | `p-4` | Filter bars, compact cards |

### Common Wrapper Styles

All variants share: `rounded-xl border border-border bg-card shadow-xs`

### Anti-Patterns Replaced

- `<div className="border-0 shadow-md card-glass">` (~44 instances)
- `<div className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">` (~30 instances)
- `<div className="border border-border rounded-lg p-5 bg-muted/40 space-y-4">` (form sections)

---

## FilterBar

```typescript
type FilterBarProps = {
  /** Controlled search input value. If undefined, search input is not rendered */
  searchValue?: string
  /** Callback when search input value changes */
  onSearchChange?: (value: string) => void
  /** Search input placeholder text */
  searchPlaceholder?: string
  /** Filter controls and action buttons rendered beside the search input */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}
```

### Rendering Rules

- Layout: `<div className="flex items-center gap-4 flex-wrap">`
- Search has `flex-1` width, children render after
- FilterBar is typically wrapped in `<PageSection variant="compact">` on the page

### Note

FilterBar itself does not include a container — it is purely a layout for filters. The container (border, background, padding) comes from `PageSection variant="compact"` on the page.

---

## SearchInput

```typescript
type SearchInputProps = {
  /** Controlled input value */
  value: string
  /** Callback when input value changes */
  onChange: (value: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
  /** Debounce delay in milliseconds (0 = instant) */
  debounceMs?: number
}
```

### Rendering Rules

- Search icon: `<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />`
- Input: `<Input value={value} onChange={...} placeholder={placeholder} className="pl-10" />`

---

## FormCard

```typescript
type FormCardProps = {
  /** Form section title */
  title: string
  /** Optional form section description */
  description?: string
  /** Form fields and content */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}
```

### Rendering Rules

- Uses `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`
- Content area: `<CardContent className="space-y-4">`
- Composed from shadcn Card primitives (not a new card component)

### Anti-Patterns Replaced

- `border border-border rounded-lg p-5 bg-muted/40 space-y-4`
- `border border-border rounded-lg p-4 bg-muted/30`
- `shadow-[0_2px_8px_rgba(0,0,0,0.06)]` cards for form sections