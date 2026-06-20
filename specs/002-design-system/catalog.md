# Design System Catalog — Componentes Oficiais

**Feature**: 002-design-system
**Date**: 2026-06-11
**Status**: Referência canônica para implementações futuras

## Layouts Oficiais

### Layout de Listagem

```
<PageContainer>
  <PageHeader
    title="..."
    description="..."
    icon={...}
    actions={<Button>Nova</Button>}
  />
  <PageSection variant="compact">
    <FilterBar searchValue={search} onSearchChange={setSearch}>
      <Select>...</Select>
      <Button>Nova</Button>
    </FilterBar>
  </PageSection>
  <PageSection title="..." variant="flush">
    <Table>...</Table>
    {data.length === 0 && <EmptyState ... />}
  </PageSection>
</PageContainer>
```

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