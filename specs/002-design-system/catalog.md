# Design System Catalog — Componentes Oficiais

**Feature**: 002-design-system
**Date**: 2026-07-10 (v2 — codifica Visual Language v1.0.0)
**Status**: Referência canônica para implementações futuras

## Layouts Oficiais

### Layout de Listagem

```
<PageContainer>
  <PageHeader
    title="..."
    description="..."
    icon={...}
  />
  <PageSection variant="compact" title="Filtros" className="mb-6">
    <FilterBar searchValue={search} onSearchChange={setSearch}>
      <Select>...</Select>  {/* escola (superadmin), ano letivo, etc. */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={active ? 'default' : 'outline'} size="sm">Filtro Rápido</Button>
      </div>
    </FilterBar>
  </PageSection>
  {/* Loading state */}
  <Card className="shadow-sm"><div className="p-6 space-y-3">
    {[1,2,3].map(i => <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />)}
  </div></Card>
  {/* Empty state */}
  <Card className="shadow-sm">
    <EmptyState icon={...} title="..." description="..." action={<Button>Nova</Button>} />
  </Card>
  {/* Data state — botão "Nova" vai no PageSection actions, NÃO no PageHeader */}
  <PageSection variant="flush" title="N registro(s)" actions={
    <Button size="sm"><Plus /> Nova</Button>
  }>
    <div className="px-4">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Coluna</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[90px]">Ações</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell><span className="font-medium text-foreground">{item.nome}</span></TableCell>
              <TableCell className="text-muted-foreground">{item.coluna}</TableCell>
              <TableCell><StatusBadge status={item.ativo ? 'success' : 'muted'}>...</StatusBadge></TableCell>
              <TableCell>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon-sm"><Pencil /></Button>
                  <Button variant="ghost" size="icon-sm"><Trash2 className="text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </PageSection>
</PageContainer>
```

### Layout de Listagem com Modal (formulário em Dialog)

Para CRUDs onde o formulário abre num modal em vez de página separada:

```
{/* Page content (list) */}
<Dialog open={dialogOpen} onOpenChange={...}>
  <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
    <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
      <DialogTitle>Editar / Nova</DialogTitle>
      <DialogDescription>...</DialogDescription>
    </DialogHeader>
    <NomeForm
      schoolId={...} editId={editId}
      onSaved={handleSaved} onCancel={() => setDialogOpen(false)}
    />
  </DialogContent>
</Dialog>
<ConfirmDialog ... />  {/* exclusão */}
```

**Estrutura do componente de formulário (NomeForm.tsx):**

```
 {/* Body scrollável */}
 <div className="flex-1 overflow-y-auto px-6 py-4">
   <FormCard title="..." description="...">
     ...campos...
   </FormCard>
 </div>
 {/* Footer fixo */}
 <div className="shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30">
   <Button variant="outline" onClick={onCancel}>Cancelar</Button>
   <Button form="form-id" type="submit">Salvar</Button>
 </div>
```

Key points:
- `DialogContent` usa `p-0 gap-0` para zerar padding/gap padrão
- `DialogHeader` é `shrink-0` (não rola)
- Body é `flex-1 overflow-y-auto`
- Footer é `shrink-0 border-t` (fixo no fundo)
- Botão "Nova" vai no `PageSection actions`, NÃO no `PageHeader` ou `FilterBar`

### Layout de Cadastro/Edição

```
<PageContainer>
  <PageHeader
    title="Nova..."
    description="..."
    icon={...}
    breadcrumbs={[...]}
    actions={<Button>Salvar</Button>}
  />
  <FormCard title="..." description="...">
    ...fields...
  </FormCard>
  <FormCard title="..." description="...">
    ...fields...
  </FormCard>
  <div className="flex justify-end gap-3">
    <Button variant="outline">Cancelar</Button>
    <Button>Salvar</Button>
  </div>
</PageContainer>
```

### Layout de Visualização (Detail)

```
<PageContainer>
  <PageHeader
    title="..."
    description="..."
    icon={...}
    breadcrumbs={[...]}
    actions={<Button variant="outline">Editar</Button>}
  />
  <PageSection title="..." description="...">
    ...content...
  </PageSection>
  <PageSection title="..." description="...">
    ...content...
  </PageSection>
</PageContainer>
```

### Layout de Dashboard

```
<PageContainer maxWidth="dashboard">
  <PageHeader title="Dashboard" ... />
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard ... />
    <StatCard ... />
    <StatCard ... />
    <StatCard ... />
  </div>
  <PageSection title="..." className="mt-6">
    ...content...
  </PageSection>
</PageContainer>
```

## Componentes Oficiais

### Layout

| Componente | Arquivo | Descrição |
|-----------|---------|-----------|
| `PageContainer` | `src/components/layout/page-container.tsx` | Container de página com espaçamento padrão |
| `PageHeader` | `src/components/layout/page-header.tsx` | Cabeçalho com título, descrição, ícone, breadcrumbs e ações |
| `PageSection` | `src/components/layout/page-section.tsx` | Seção de conteúdo com variantes default/flush/compact |
| `FilterBar` | `src/components/layout/filter-bar.tsx` | Barra de filtros com busca e ações |
| `SearchInput` | `src/components/layout/search-input.tsx` | Campo de busca com ícone |
| `FormCard` | `src/components/layout/form-card.tsx` | Seção de formulário com título e descrição |

### Feedback

| Componente | Arquivo | Descrição |
|-----------|---------|-----------|
| `StatusBadge` | `src/components/feedback/status-badge.tsx` | Badge de status com mapeamento semântico |
| `ConfirmDialog` | `src/components/feedback/confirm-dialog.tsx` | Diálogo de confirmação para ações destrutivas |
| `EmptyState` | `src/components/ui/empty-state.tsx` | Estado vazio com ícone, título e ação |
| `StatCard` | `src/components/ui/stat-card.tsx` | Card de estatística com ícone, valor e trend |

### shadcn/ui (base, inalterados)

Button, Card, Table, Dialog, AlertDialog, Badge, Input, Select, Textarea, Checkbox, RadioGroup, DropdownMenu, Tooltip, Tabs, Separator, ScrollArea, Progress, Skeleton, Sheet, Popover, Label, Calendar, DatePicker

## Props Reference

See [contracts/layout-components.md](./contracts/layout-components.md), [contracts/data-components.md](./contracts/data-components.md), [contracts/feedback-components.md](./contracts/feedback-components.md), [contracts/form-components.md](./contracts/form-components.md).

## Design Token Registry

See [data-model.md — Design Token Registry](./data-model.md#design-token-registry).

## Anti-Padrões Proibidos

See [data-model.md — Anti-Pattern Registry](./data-model.md#anti-pattern-registry).

## Estados Globais

### Loading State

O estado de carregamento oficial usa um spinner centralizado com mensagem de texto.

```
<div className="flex flex-col items-center justify-center py-16">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
  <p className="text-muted-foreground">Carregando...</p>
</div>
```

**Uso em páginas cliente**: Verificar `loading` state antes de renderizar conteúdo. Quando `loading === true`, renderizar o spinner. Quando `loading === false` e dados existem, renderizar o conteúdo.

**Anti-padrões**:
- Não usar spinners customizados com cores ou tamanhos diferentes
- Não usar `<div className="min-h-screen flex items-center justify-center">` para spinners inline em componentes
- Não usar skeleton loaders com cores hardcoded

### Error State

O estado de erro oficial usa toast (`sonner`) para erros de ação e fallback visual para erros de página.

**Erro de ação (toast)**:
```tsx
import { toast } from 'sonner'
// Na server action ou no catch do cliente:
toast.error('Erro ao carregar dados')
toast.success('Dados salvos com sucesso')
```

**Erro de página (fallback visual)**:
```tsx
<PageContainer>
  <PageHeader title="Erro" />
  <PageSection title="Algo deu errado">
    <p className="text-muted-foreground">
      Não foi possível carregar os dados. Tente novamente.
    </p>
    <Button variant="outline" onClick={retry}>Tentar Novamente</Button>
  </PageSection>
</PageContainer>
```

**Anti-padrões**:
- Não usar `alert()` ou `window.alert()` para erros
- Não usar mensagens de erro com cores hardcoded
- Não exibir mensagens de erro técnicas (stack traces, SQL errors) ao usuário

### Permission Denied State

O estado de permissão insuficiente usa um componente visual que informa o usuário.

```tsx
<PageContainer>
  <PageHeader title="Acesso Restrito" />
  <EmptyState
    icon={ShieldAlert}
    title="Sem permissão"
    description="Você não tem permissão para acessar esta funcionalidade. Contate um administrador."
  />
</PageContainer>
```

**Alternativa (seção bloqueada dentro de página)**:
```tsx
<PageSection title="...">
  <div className="flex flex-col items-center justify-center py-8">
    <ShieldAlert className="h-8 w-8 text-muted-foreground mb-3" />
    <p className="text-sm text-muted-foreground">
      Você não tem permissão para visualizar esta seção.
    </p>
  </div>
</PageSection>
```

**Anti-padrões**:
- Não usar redirecionamentos automáticos sem feedback visual
- Não exibir mensagens de erro técnico sobre permissões (ex: nomes de roles internas)
- Não usar cores hardcoded para indicar permissão negada

## Regras de Composição

1. **Toda página começa com `<PageContainer>`** — nunca `container mx-auto py-8 px-4` inline
2. **Todo cabeçalho é `<PageHeader>`** — nunca `<h1>` manual com classes customizadas
3. **Todo conteúdo é `<PageSection>` ou `<Card>`** — nunca `card-glass` ou `shadow-[rgba]`
4. **Todo formulário usa `<FormCard>`** — nunca div com `border rounded-lg bg-muted`
5. **Todo botão é `<Button>` shadcn** — nunca `<button>` nativo com classes
6. **Toda tabela é `<Table>` shadcn** — nunca `<table>` nativo com estilos inline
7. **Todo badge de status é `<StatusBadge>`** — nunca cores hardcoded como `bg-purple-100`
8. **Todo estado vazio é `<EmptyState>`** — nunca div customizado
9. **Todo filtro é `<FilterBar>`** — nunca busca inline duplicada
10. **Toda confirmação destrutiva é `<ConfirmDialog>`** — nunca `if (confirm())`

## Gradientes

Use tokens: `from-primary to-accent`, `from-primary to-primary/80`, etc.

**Proibido**: `from-[#1D3557] to-[#457B9D]`, `from-blue-500 to-emerald-500`

## Sombras

Use escala Tailwind: `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`

**Proibido**: `shadow-[0_2px_8px_rgba(0,0,0,0.06)]`, `shadow-lg shadow-blue-500/20`, `shadow-lg shadow-emerald-500/20`

## Cores de Texto em Botões

Use `text-primary-foreground` (ou variante padrão do Button que já usa a cor correta).

**Proibido**: `text-white` em botões sobre fundo primary

## Design Tokens v2 (Visual Language v2.0.0)

### Tokens de Cor (Light Mode)

| Token | Valor | Uso |
|-------|-------|-----|
| `--primary` | `#1F88EB` | Marca, botão primário, logo, ring |
| `--primary-foreground` | `#FFFFFF` | Texto sobre primary |
| `--accent` | `#4FC3D7` | Foco de inputs, interação complementar (cianês) |
| `--accent-foreground` | `#0A2540` | Texto sobre accent |
| `--secondary` | `#1A6FC2` | Botão secundário, charts (deep blue) |
| `--secondary-foreground` | `#FFFFFF` | Texto sobre secondary |
| `--background` | `#F6F8FA` | Fundo da página (slate-50) |
| `--card` | `#FFFFFF` | Fundo de card/superfície |
| `--foreground` | `#1E293B` | Texto principal (slate-800) |
| `--muted` | `#F1F5F9` | Fundo de seções/zonas (slate-100) |
| `--muted-foreground` | `#64748B` | Texto secundário (slate-500) |
| `--border` | `#E2E8F0` | Bordas padrão (slate-200) |
| `--ring` | `#1F88EB` | Cor de foco (= primary) |
| `--destructive` | `#DC2626` | Erro/destruição |
| `--success` | `#16A34A` | Sucesso |
| `--warning` | `#D97706` | Atenção |
| `--info` | `#1F88EB` | Informação (= primary) |
| `--sidebar` | `#FAFBFC` | Fundo da sidebar (quase branco) |
| `--sidebar-foreground` | `#1E293B` | Texto da sidebar |
| `--sidebar-primary` | `#1F88EB` | Item ativo da sidebar |
| `--sidebar-accent` | `#F1F5F9` | Hover da sidebar (muted) |

**Regras**:
- `--primary` (`#1F88EB`) é a cor de marca — botão primário, logo, links, ring.
- `--accent` (`#4FC3D7`) é a cor complementar — foco de inputs, seleção, destaque interativo.
- `--secondary` (`#1A6FC2`) é a cor de apoio — botão secundário, charts.
- `--info` acompanha `--primary` (blue).
- `--ring` acompanha `--primary` (blue).
- Sidebar é **branca** em light mode, **slate-950** em dark mode.

### Tokens de Cor (Dark Mode)

| Token | Valor |
|-------|-------|
| `--primary` | `#1F88EB` (preservado) |
| `--accent` | `#4FC3D7` (preservado) |
| `--secondary` | `#4FC3D7` (cianês como apoio em dark) |
| `--background` | `#0F172A` (slate-950) |
| `--card` | `#1E293B` (slate-800) |
| `--border` | `#334155` (slate-700) |
| `--sidebar` | `#0F172A` (slate-950) |
| `--sidebar-primary` | `#1F88EB` (preservado) |

### Escala de Radius (6 níveis)

| Token | Valor | Tailwind | Uso |
|-------|-------|----------|-----|
| `--radius-sm` | 6px | `rounded-sm` | Inputs, badges, chips, tags |
| `--radius-md` | 8px | `rounded-md` | Botões, itens de menu, tabs |
| `--radius-lg` | 12px | `rounded-lg` | Cards, modais, popovers, dropdowns |
| `--radius-xl` | 16px | `rounded-xl` | Cards hero, seções de destaque |
| `--radius-2xl` | 24px | `rounded-2xl` | Containers decorativos (avatar, banner, hero) |
| `--radius-full` | 9999px | `rounded-full` | Pills, avatares, overlay circular |

**Regras**:
- Valores explícitos — **proibido** `calc()` para radius.
- `--radius` (sem sufixo) = 12px — alias de `--radius-lg` para compatibilidade com `rounded-lg`.
- `--radius-3xl` e `--radius-4xl` foram removidos — não existem na escala oficial.

### Escala Tipográfica (9 níveis)

| Token | Tamanho | Peso | Line-height | Uso |
|-------|---------|------|-------------|-----|
| `--text-display` | 36px | 700 | 1.2 | KPI principal, título de dashboard |
| `--text-title` | 28px | 700 | 1.2 | Título de página (PageHeader) |
| `--text-heading` | 20px | 600 | 1.3 | Subtítulo de seção (PageSection) |
| `--text-subheading` | 16px | 600 | 1.4 | Headline de card, nome em lista |
| `--text-body` | 15px | 400 | 1.5 | Texto corrido, descrições |
| `--text-body-strong` | 15px | 500 | 1.5 | Parágrafo de conclusão, destaque |
| `--text-label` | 14px | 500 | 1.4 | Rótulos, botões, dados em tabela |
| `--text-small` | 13px | 400 | 1.4 | Texto secundário, timestamp, legendas |
| `--text-caption` | 12px | 400 | 1.3 | Anotação de menor prioridade |

**Uso em componentes** (via arbitrary values):
- PageHeader title: `text-[28px] font-bold leading-tight`
- PageHeader description: `text-[15px] leading-normal`
- PageSection title: `text-[20px] font-semibold leading-snug`
- PageSection description: `text-[15px]`
- FormCard title: `text-[20px] font-semibold`
- FormCard description: `text-[15px]`
- StatCard value: `text-[36px] font-bold leading-none`
- StatCard label: `text-[14px] font-medium`

**Anti-padrões tipográficos**:
- `text-sm` (14px) como corpo padrão de descrições ou parágrafos — usar `text-[15px]`
- `text-base` (16px) como título de seção — usar `text-[20px]`
- `text-2xl font-semibold` (24px/600) como título de página — usar `text-[28px] font-bold`

### Fonte Oficial

**Plus Jakarta Sans** — única família tipográfica do sistema.
- Pesos: 400 (corpo), 500 (rótulos), 600 (subtítulos), 700 (títulos)
- Proibido: itálico, all-caps, fontes serifadas, `system-ui`

### Movimento (3 durações)

| Token | Duração | Easing | Uso |
|-------|---------|--------|-----|
| `--transition-fast` | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover, foco, toggle |
| `--transition` | 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Abertura de popover, transição de seção |
| `--transition-slow` | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Dialog, drawer, tabs de dashboard |

**Proibido**: `ease-in-out` (genérico), `linear` para movimento visível, curvas com overshoot.

### Elevação (5 níveis)

| Nível | Token | Uso |
|-------|-------|-----|
| 0 — Flat | `shadow-none` | Fundo de página, fundos de seção |
| 1 — Resting | `shadow-sm` | Card em repouso (padrão) |
| 2 — Floating | `shadow-md` | Card em hover, dropdown, popover |
| 3 — Overlay | `shadow-lg` | Dialog, sheet, modal |
| 4 — High | `shadow-xl` | Command palette, dialog sobre dialog |

**Regras**: Cards em repouso usam **no máximo** `shadow-sm`. `shadow-md` apenas em hover. `shadow-lg`/`shadow-xl` reservados para overlays.