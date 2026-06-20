# Data & Feedback Components — API Contracts

**Feature**: 002-design-system
**Date**: 2026-06-11

## StatusBadge

```typescript
type StatusBadgeProps = {
  /** Semantic status value that determines color mapping */
  status: 'success' | 'warning' | 'destructive' | 'info' | 'primary' | 'muted'
  /** Badge label content */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}
```

### Status → Token Mapping

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| `success` | `bg-success/10` | `text-success` | `border-success/20` |
| `warning` | `bg-warning/10` | `text-warning` | `border-warning/20` |
| `destructive` | `bg-destructive/10` | `text-destructive` | `border-destructive/20` |
| `info` | `bg-info/10` (≡ `bg-accent/10`) | `text-info` (≡ `text-accent`) | `border-info/20` |
| `primary` | `bg-primary/10` | `text-primary` | `border-primary/20` |
| `muted` | `bg-muted` | `text-muted-foreground` | `border-border` |

### Rendering Rules

- Renders `<Badge className={cn(statusStyles[status], className)}>{children}</Badge>`
- Badge uses `border` from design tokens, never hardcoded colors
- All status colors work correctly in both Light Mode and Dark Mode (using opacity tokens)

### Anti-Patterns Replaced

- `bg-purple-100 text-purple-700 border-purple-200` → `<StatusBadge status="...">`
- `bg-cyan-100 text-cyan-700 border-cyan-200` → `<StatusBadge status="info">`
- `bg-lime-100 text-lime-700 border-lime-200` → `<StatusBadge status="success">`
- Inline `className` with hardcoded badge colors on ~20+ occurrences

### Usage Examples

```tsx
// Before:
<Badge className="bg-warning/10 text-warning">Profissional</Badge>

// After:
<StatusBadge status="warning">Profissional</StatusBadge>

// Before:
<Badge className={situacao === '1' ? "bg-success-light text-success" : "bg-muted text-muted-foreground"}>
  {label}
</Badge>

// After:
<StatusBadge status={situacao === '1' ? 'success' : 'muted'}>
  {label}
</StatusBadge>
```

---

## ConfirmDialog

```typescript
type ConfirmDialogProps = {
  /** Whether the dialog is open */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Dialog title */
  title: string
  /** Dialog description/body text */
  description?: string
  /** Label for the confirm button */
  confirmLabel?: string
  /** Label for the cancel button */
  cancelLabel?: string
  /** Visual variant of the confirm button */
  variant?: 'destructive' | 'warning'
  /** Callback when user confirms the action */
  onConfirm: () => void | Promise<void>
  /** Whether the confirm action is in progress (disables confirm button) */
  loading?: boolean
  /** Optional trigger element (for declarative usage) */
  children?: React.ReactNode
}
```

### Rendering Rules

- Uses shadcn `<AlertDialog>` primitives
- `variant="destructive"`: confirm button uses `<Button variant="destructive">`
- `variant="warning"`: confirm button uses `<Button>` (default primary)
- Cancel button always uses `<Button variant="outline">`
- When `loading={true}`, confirm button is disabled with spinner
- Title uses `<AlertDialogTitle>`
- Description uses `<AlertDialogDescription>`

### Anti-Patterns Replaced

- Multiple implementations of `<Dialog>` + `<DialogHeader>` + buttons with `confirm()` for destructive actions
- Inconsistent confirmation patterns across ~10+ pages

### Usage Examples

```tsx
// Before:
const [showConfirm, setShowConfirm] = useState(false)
// ... manual Dialog with custom buttons

// After:
<ConfirmDialog
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="Excluir turma"
  description="Esta ação não pode ser desfeita. Todos os dados da turma serão removidos permanentemente."
  variant="destructive"
  confirmLabel="Excluir"
  onConfirm={handleDelete}
  loading={deleting}
/>
```

---

## EmptyState (EXISTING — no changes)

```typescript
type EmptyStateProps = {
  /** Icon to display */
  icon: React.ComponentType<{ className?: string }>
  /** Title text */
  title: string
  /** Optional description text */
  description?: string
  /** Optional action button/link */
  action?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}
```

### Rendering Rules

- Centered layout with `<div className="py-16 text-center animate-fade-in">`
- Icon in rounded container: `<div className="p-4 rounded-2xl bg-muted/50">`
- Title: `<h3 className="text-base font-medium text-foreground">`
- Description: `<p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">`
- Action: `<div className="mt-5">`

### Note

EmptyState is used as-is, no changes needed. The inconsistency was that some pages used `card-glass` wrapper around the EmptyState while others used `border-border`. The fix is to always use EmptyState inside `<PageSection>` or `<Card>` with consistent styling.

---

## StatCard (EXISTING — no changes)

```typescript
type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>
  value: string | number
  label: string
  trend?: { value: string; positive?: boolean }
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  className?: string
}
```

### Note

StatCard serves as the reference pattern for well-designed components. It uses Design Tokens, supports Dark Mode, and follows the composition patterns established for this Design System. No changes are needed.