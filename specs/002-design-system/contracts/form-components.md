# Form Components — API Contracts

**Feature**: 002-design-system
**Date**: 2026-06-11

## Padrão de Formulários

Formulários seguem um padrão visual consistente usando `<FormCard>` para agrupar campos e componentes shadcn/ui para todos os inputs.

### Composição Padrão — Página de Cadastro

```tsx
<PageContainer>
  <PageHeader
    title="Nova Matrícula"
    description="Cadastre uma nova matrícula no sistema"
    icon={GraduationCap}
    actions={<Button>Salvar</Button>}
    breadcrumbs={[
      { label: "Gestão Acadêmica", href: "/gestao-academica" },
      { label: "Matrículas", href: "/gestao-academica/matriculas" },
      { label: "Nova" }
    ]}
  />

  <FormCard title="Dados do Aluno" description="Informações pessoais">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Nome completo</Label>
        <Input placeholder="Nome do aluno" />
      </div>
      <div>
        <Label>CPF</Label>
        <Input placeholder="000.000.000-00" />
      </div>
    </div>
  </FormCard>

  <FormCard title="Dados Escolares" description="Informações da matrícula">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Turma</Label>
        <Select>...</Select>
      </div>
      <div>
        <Label>Data de matrícula</Label>
        <DatePicker />
      </div>
    </div>
  </FormCard>

  <div className="flex justify-end gap-3">
    <Button variant="outline">Cancelar</Button>
    <Button>Salvar</Button>
  </div>
</PageContainer>
```

### Composição Padrão — Formulário em Dialog

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Nova Turma</DialogTitle>
      <DialogDescription>Preencha os dados da turma</DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input placeholder="Nome da turma" />
      </div>
      <div>
        <Label>Ano Letivo</Label>
        <Select>...</Select>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button>Salvar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Composição Padrão — Confirmação Destrutiva

```tsx
<ConfirmDialog
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="Excluir matrícula"
  description="Esta ação é permanente e não pode ser desfeita."
  variant="destructive"
  confirmLabel="Excluir"
  onConfirm={handleDelete}
  loading={deleting}
/>
```

### Regras Obrigatórias de Formulário

| Regra | Padrão | Anti-Padrão |
|-------|--------|-------------|
| Container de seção | `<FormCard>` | `<div className="border border-border rounded-lg p-5 bg-muted/40 space-y-4">` |
| Espaçamento entre campos | `grid grid-cols-1 md:grid-cols-2 gap-4` | Espaçamento inline customizado |
| Espaçamento entre seções | Bloco de FormCards com `space-y-6` | Margens manuais variáveis |
| Label | `<Label>` do shadcn | `<label className="text-sm font-medium">` |
| Input | `<Input>` do shadcn | `<input type="text" className="...">` |
| Select | `<Select>` do shadcn | `<select className="...">` |
| Textarea | `<Textarea>` do shadcn | `<textarea className="...">` |
| Checkbox | `<Checkbox>` do shadcn | `<input type="checkbox">` |
| DatePicker | Componente custom | `<input type="date">` |
| Botão primário | `<Button>` (variante padrão) | `<Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">` |
| Botão cancelar | `<Button variant="outline">` | `<Button className="bg-muted text-foreground">` |
| Confirmação destrutiva | `<ConfirmDialog variant="destructive">` | `if (confirm('Tem certeza?'))` |
| Ações do formulário | `<div className="flex justify-end gap-3">` | Posicionamento e espaçamento inconsistente |
| Borda de input | `border-border` (padrão shadcn) | `border-2 border-border` |
| Foco de input | `focus:border-primary focus:ring-primary/20` | `focus:border-primary focus:ring-2` |

---

## Dialog Sizes

| Size | Max Width | Use Case |
|------|-----------|----------|
| `sm` (default) | `max-w-sm` | Confirmations, simple forms |
| `md` | `max-w-2xl` | Standard forms, multi-field |
| `lg` | `max-w-4xl` | Complex forms, tables in dialog |

### Usage

```tsx
// Small dialog (default)
<DialogContent>  // max-w-sm

// Medium dialog
<DialogContent className="max-w-2xl">

// Large dialog
<DialogContent className="max-w-4xl">
```

### Anti-Patterns Replaced

- Inconsistent dialog widths across pages
- Inline form sections instead of `<FormCard>`
- Native `<input>`, `<select>`, `<textarea>` elements