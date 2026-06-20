# Data Components — API Contracts

**Feature**: 002-design-system
**Date**: 2026-06-11

## DataTable Pattern

Nota: DataTable não é um componente novo — é um **padrão de composição** usando shadcn `<Table>` com props e estilos consistentes. Não criamos um componente DataTable que encapsula lógica de dados (paginação, ordenação, filtros), pois cada página tem necessidades diferentes. Em vez disso, documentamos o padrão visual que todas as tabelas de dados devem seguir.

### Composição Padrão

```tsx
<PageSection title="Turmas" variant="flush">
  <Table>
    <TableHeader>
      <TableRow className="bg-muted hover:bg-muted">
        <TableHead className="font-semibold text-muted-foreground">Nome</TableHead>
        <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
        <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id} className="hover:bg-muted/50">
          <TableCell className="font-medium">{item.nome}</TableCell>
          <TableCell><StatusBadge status={...}>{item.status}</StatusBadge></TableCell>
          <TableCell className="text-right">
            <DropdownMenu>...</DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  {data.length === 0 && (
    <EmptyState icon={Users} title="Nenhum item encontrado" description="..." />
  )}
</PageSection>
```

### Regras Obrigatórias

| Regra | Padrão | Anti-Padrão |
|-------|--------|-------------|
| Container | `<PageSection variant="flush">` | `<div className="bg-card rounded-lg shadow-sm border border-border">` |
| Header | `<TableHeader>` com `bg-muted` | `<thead className="bg-muted">` |
| Header text | `font-semibold text-muted-foreground` | `text-foreground/80` ou `font-semibold` sem token |
| Row hover | `hover:bg-muted/50` | `hover:bg-gray-50` ou sem hover |
| Sticky column | `sticky left-0 bg-background z-10` | `position: sticky` sem bg |
| Sticky header | `sticky left-0 bg-muted z-10` | Header sem bg no sticky |
| Actions | `<DropdownMenu>` com ícones | `<button>` nativo com ícones |
| Status badges | `<StatusBadge>` | `className` hardcoded |
| Empty state | `<EmptyState>` dentro da section | `<div>` customizado |

### Anti-Padrões Substituídos

- `<table className="w-full">` com `<thead>`, `<tr>`, `<th>`, `<td>` nativos
- `<thead className="bg-muted">` com `<th>` sem componentes shadcn
- Ações em `<button>` nativo em vez de `<DropdownMenu>`

---

## Componentes Existentes Referenciados

### Table (shadcn/ui)

Já instalado. Usar componentes `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableHead>`, `<TableCell>`.

**Arquivo**: `src/components/ui/table.tsx`

### Badge (shadcn/ui)

Usar como base para `<StatusBadge>`. O Badge shadcn permanece inalterado.

**Arquivo**: `src/components/ui/badge.tsx`

### Card (shadcn/ui)

Usar como base para `<FormCard>`. Componentes `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>` permanecem inalterados.

**Arquivo**: `src/components/ui/card.tsx`

### AlertDialog (shadcn/ui)

Usar como base para `<ConfirmDialog>`. Componentes shadcn AlertDialog permanecem inalterados.

**Arquivo**: `src/components/ui/alert-dialog.tsx`

### Button (shadcn/ui)

Usar como padrão para todos os botões. **Anti-padrão**: adicionar `className` com overrides de cor, sombra ou texto.

**Uso correto**:
```tsx
<Button>Nova Turma</Button>
<Button variant="destructive">Excluir</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="ghost">Voltar</Button>
```

**Uso proibido**:
```tsx
<Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">Nova Turma</Button>
<Button className="bg-success hover:bg-success shadow-lg shadow-emerald-500/20">Cadastrar</Button>
```