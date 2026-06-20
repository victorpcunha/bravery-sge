# Data Model: Design System — Padronização Global de UI/UX

**Feature**: 002-design-system
**Date**: 2026-06-11

## Princípio

O Design System não introduz tabelas no banco de dados. As "entidades" são componentes React com APIs bem-definidas (props). Este documento define a interface de cada componente oficial — seus tipos, variantes, e relações.

## Componentes de Layout

### PageContainer

```
PageContainer
├── Props:
│   ├── maxWidth: "default" | "dashboard"     # default = sem max-width, dashboard = max-w-6xl
│   ├── className?: string
│   └── children: ReactNode
├── Renderiza: <div className="container mx-auto py-8 px-4 {maxWidthClass}">
│               {children}
│             </div>
└── Substitui: container mx-auto py-8 px-4 duplicado em 41+ páginas
```

### PageHeader

```
PageHeader (EXISTENTE, ENHANCEADO)
├── Props atuais:
│   ├── title: string
│   ├── description?: string
│   ├── icon?: LucideIcon
│   ├── actions?: ReactNode
│   └── className?: string
├── Props NOVAS:
│   └── breadcrumbs?: BreadcrumbItem[]
├── BreadcrumbItem:
│   ├── label: string
│   ├── href?: string          # se ausente, item é não-clicável (atual)
│   └── icon?: LucideIcon
├── Renderiza:
│   <div className="mb-8 animate-fade-in-up">
│     {/* breadcrumbs se fornecidos */}
│     <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
│       {breadcrumbs.map(b => b.href ? <Link href={b.href}>{b.label}</Link> : <span>{b.label}</span>)}
│     </nav>
│     <div className="flex items-start justify-between gap-4 flex-wrap">
│       <div className="flex items-start gap-3 min-w-0">
│         {icon && <div className="p-2.5 rounded-xl bg-primary/10 shrink-0"><Icon className="h-5 w-5 text-primary" /></div>}
│         <div className="min-w-0">
│           <h1 className="text-2xl font-heading font-semibold text-foreground tracking-tight truncate">{title}</h1>
│           {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
│         </div>
│       </div>
│       {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
│     </div>
│   </div>
├── Substitui: 3 padrões de heading (text-3xl bold, text-2xl bold, text-xl semibold) + breadcrumbs manuais
└── Arquivo: src/components/layout/page-header.tsx
```

### PageSection

```
PageSection (EXISTENTE, ENHANCEADO)
├── Props atuais:
│   ├── title: string
│   ├── description?: string
│   ├── actions?: ReactNode
│   ├── children: ReactNode
│   └── className?: string
├── Props NOVAS:
│   └── variant: "default" | "flush" | "compact"
├── Variantes:
│   ├── default:  rounded-xl border border-border bg-card shadow-xs, px-6 py-4 header + p-6 body
│   ├── flush:    rounded-xl border border-border bg-card shadow-xs, px-6 py-4 header + p-0 body (para tabelas)
│   └── compact:  rounded-xl border border-border bg-card shadow-xs, px-4 py-3 header + p-4 body (para filtros)
├── Substitui: card-glass + border-0 shadow-md, shadow-[0_2px_8px_rgba(0,0,0,0.06)]
└── Arquivo: src/components/layout/page-section.tsx
```

## Componentes de Dados

### FilterBar

```
FilterBar
├── Props:
│   ├── searchValue?: string
│   ├── onSearchChange?: (value: string) => void
│   ├── searchPlaceholder?: string             # default: "Buscar..."
│   ├── children?: ReactNode                   # filtros e ações
│   └── className?: string
├── Renderiza:
│   <div className="flex items-center gap-4 flex-wrap">
│     {searchValue !== undefined && <SearchInput ... />}
│     {children}
│   </div>
│   envolvido por PageSection variant="compact" na página
├── Uso: <FilterBar searchValue={search} onSearchChange={setSearch}>
│         <Select>...</Select>
│         <Button>Nova</Button>
│       </FilterBar>
└── Arquivo: src/components/layout/filter-bar.tsx
```

### SearchInput

```
SearchInput
├── Props:
│   ├── value: string
│   ├── onChange: (value: string) => void
│   ├── placeholder?: string                  # default: "Buscar..."
│   ├── className?: string
│   └── debounceMs?: number                   # default: 0 (instant)
├── Renderiza:
│   <div className="relative flex-1">
│     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
│     <Input value={value} onChange={...} placeholder={placeholder} className="pl-10" />
│   </div>
├── Substitui: ~15 páginas com implementação duplicada de campo de busca com ícone
└── Arquivo: src/components/layout/search-input.tsx
```

### StatusBadge

```
StatusBadge
├── Props:
│   ├── status: "success" | "warning" | "destructive" | "info" | "primary" | "muted"
│   ├── children: ReactNode
│   └── className?: string
├── Mapeamento status → tokens:
│   ├── success:    bg-success/10 text-success border-success/20
│   ├── warning:    bg-warning/10 text-warning border-warning/20
│   ├── destructive: bg-destructive/10 text-destructive border-destructive/20
│   ├── info:       bg-info/10 text-info border-info/20  (info = accent)
│   ├── primary:    bg-primary/10 text-primary border-primary/20
│   └── muted:      bg-muted text-muted-foreground border-border
├── Renderiza: <Badge className={cn(statusStyles[status], className)}>{children}</Badge>
├── Substitui: bg-purple-100 text-purple-700, bg-cyan-100 text-cyan-700, bg-lime-100 text-lime-700, etc.
└── Arquivo: src/components/feedback/status-badge.tsx
```

## Componentes de Formulário

### FormCard

```
FormCard
├── Props:
│   ├── title: string
│   ├── description?: string
│   ├── children: ReactNode
│   └── className?: string
├── Renderiza:
│   <Card>
│     <CardHeader>
│       <CardTitle>{title}</CardTitle>
│       {description && <CardDescription>{description}</CardDescription>}
│     </CardHeader>
│     <CardContent className="space-y-4">
│       {children}
│     </CardContent>
│   </Card>
├── Substitui: 3 padrões de seção de formulário
│   ├── border border-border rounded-lg p-5 bg-muted/40 space-y-4
│   ├── border border-border rounded-lg p-4 bg-muted/30
│   └── shadow-[0_2px_8px_rgba(0,0,0,0.06)] cards
└── Arquivo: src/components/layout/form-card.tsx
```

## Componentes de Feedback

### ConfirmDialog

```
ConfirmDialog
├── Props:
│   ├── open: boolean
│   ├── onOpenChange: (open: boolean) => void
│   ├── title: string
│   ├── description?: string
│   ├── confirmLabel?: string                  # default: "Confirmar"
│   ├── cancelLabel?: string                   # default: "Cancelar"
│   ├── variant?: "destructive" | "warning"    # default: "destructive"
│   ├── onConfirm: () => void | Promise<void>
│   ├── loading?: boolean
│   └── children?: ReactNode                   # trigger element
├── Renderiza: AlertDialog do shadcn com composição
│   ├── Botão confirmar: variant="destructive" se variant="destructive", variant="default" se variant="warning"
│   ├── Botão cancelar: variant="outline"
│   └── Suporte a loading state com disabled no botão de confirmar
├── Substitui: múltiplos patterns de confirms com Dialog manual + botões
└── Arquivo: src/components/feedback/confirm-dialog.tsx
```

## Componentes Existentes (referência, sem mudanças estruturais)

### EmptyState (já existe)

```
EmptyState (EXISTENTE, inalterado)
├── Props:
│   ├── icon: LucideIcon
│   ├── title: string
│   ├── description?: string
│   ├── action?: ReactNode
│   └── className?: string
├── Renderiza: ícone grande + título + descrição + ação
├── Arquivo: src/components/ui/empty-state.tsx
└── Status: Usado como-is. Não necessita mudanças.
```

### StatCard (já existe)

```
StatCard (EXISTENTE, inalterado)
├── Props:
│   ├── icon: LucideIcon
│   ├── value: string | number
│   ├── label: string
│   ├── trend?: { value: string; positive?: boolean }
│   ├── variant?: "default" | "success" | "warning" | "destructive"
│   └── className?: string
├── Renderiza: Card com ícone colorido + valor + label + trend
├── Arquivo: src/components/ui/stat-card.tsx
└── Status: Usado como-is. Serve como referência de padrão de componente.
```

## Entidades de Documentação

### Design Token Registry

Entidade documental (não é código). Lista canônica de tokens CSS do `globals.css`:

| Token | Uso | Classe Tailwind |
|-------|-----|-----------------|
| `--primary` | Marca principal, ações primárias | `bg-primary`, `text-primary` |
| `--primary-foreground` | Texto em bg-primary | `text-primary-foreground` |
| `--accent` | Ação secundária, links | `bg-accent`, `text-accent` |
| `--background` | Fundo de página | `bg-background` |
| `--card` | Fundo de cards/seções | `bg-card` |
| `--foreground` | Texto principal | `text-foreground` |
| `--muted-foreground` | Texto secundário | `text-muted-foreground` |
| `--border` | Bordas | `border-border` |
| `--muted` | Fundo de seções muted | `bg-muted` |
| `--ring` | Foco/destaque | `ring-ring` |
| `--destructive` | Destruição/erro | `bg-destructive` |
| `--success` | Sucesso | `bg-success`, `text-success` |
| `--warning` | Aviso | `bg-warning`, `text-warning` |
| `--info` | Info (= accent) | `text-info` |
| `--sidebar` | Sidebar fundo | `bg-sidebar` |
| `--sidebar-foreground` | Sidebar texto | `text-sidebar-foreground` |
| `--sidebar-accent` | Sidebar acento | `bg-sidebar-accent` |
| `--sidebar-primary` | Sidebar primário | `bg-sidebar-primary` |

### Anti-Pattern Registry

Entidade documental. Lista canônica de padrões proibidos:

| Padrão Proibido | Substituição | Contexto |
|-----------------|-------------|----------|
| `text-white` em botões | `text-primary-foreground` ou Button variante padrão | Botões sobre fundo primary |
| `bg-white` | `bg-card` ou `bg-background` | Fundos |
| `text-gray-*`, `text-slate-*` | `text-foreground` ou `text-muted-foreground` | Texto |
| `border-slate-*` | `border-border` | Bordas |
| `shadow-[rgba]` | `shadow-xs`, `shadow-sm`, `shadow-md` | Sombras |
| `card-glass` | `PageSection` ou `Card` shadcn | Cards/seções |
| `<button>` nativo | `<Button>` shadcn | Botões interativos |
| `<table>` nativo | `<Table>` shadcn | Tabelas de dados |
| Heading manual (h1 com classes) | `<PageHeader>` | Cabeçalhos de página |
| `border-2` | `border` (1px padrão) | Bordas de input |
| `shadow-lg shadow-blue-500/20` | `shadow-sm` ou `shadow-md` | Sombras em botões |
| `bg-purple-100 text-purple-700` | `<StatusBadge status="...">` | Badges de status |
| `ml-64` (sidebar hardcoded) | Remover (layout gerencia sidebar) | Layout de página |
| `text-foreground/80` | `text-muted-foreground` | Texto secundário |
| `bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20` | `<Button>` (variante padrão) | Botão primário |
| `max-w-6xl` em container | `<PageContainer maxWidth="dashboard">` | Dashboard |

## Relacionamentos

```
PageContainer
  └── PageHeader
  │     ├── breadcrumbs (BreadcrumbItem[])
  │     └── actions (ReactNode: Button | ButtonGroup)
  └── PageSection (múltiplos)
  │     ├── variant: default | flush | compact
  │     └── children: FilterBar | Table | FormCard | Card | EmptyState | ...
  └── Para layouts de Dashboard:
      PageContainer(maxWidth="dashboard")
      └── StatCard (múltiplos)

FilterBar
  ├── SearchInput (opcional)
  └── children: Select | Button | Badge | ...

FormCard
  └── Input | Select | Textarea | Checkbox | ...

ConfirmDialog
  └── Trigger: Button
  └── Content: title + description + actions

StatusBadge
  └── children: string (label)
```

## Mapeamento de Padrões Antigos → Novos

| Padrão Antigo | Padrão Novo | Onde |
|--------------|-------------|------|
| `<div className="container mx-auto py-8 px-4">` | `<PageContainer>` | 41+ páginas |
| `<div className="container mx-auto py-8 px-4 max-w-6xl">` | `<PageContainer maxWidth="dashboard">` | 2 páginas |
| `<h1 className="text-3xl font-bold">` | `<PageHeader title="...">` | ~15 páginas |
| `<h1 className="text-2xl font-bold text-primary">` | `<PageHeader title="...">` | ~5 páginas |
| `<h1 className="text-xl font-semibold">` | `<PageHeader title="...">` | ~10 páginas |
| `<div className="border-0 shadow-md card-glass">` | `<PageSection>` ou `<Card>` | ~44 instâncias |
| `<div className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">` | `<PageSection>` | ~30 instâncias |
| `<div className="border border-border rounded-lg p-5 bg-muted/40 space-y-4">` | `<FormCard title="...">` | ~30 instâncias |
| `<Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-blue-500/20 text-white">` | `<Button>` (default variant) | ~30 instâncias |
| `<div className="ml-64 p-8">` | `<PageContainer>` | 1 página |
| `<button onClick={...} className="hover:text-primary">` | `<Button variant="ghost">` | ~45 instâncias |
| `<table className="w-full"><thead><tr><th>...</th></tr></thead>...` | `<Table>` shadcn | ~10 instâncias |
| `bg-purple-100 text-purple-700 border-purple-200` | `<StatusBadge status="...">` | ~5 instâncias |