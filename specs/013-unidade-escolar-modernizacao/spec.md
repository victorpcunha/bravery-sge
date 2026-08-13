# Feature Specification: Unidade Escolar — Acesso por perfil + Proteção + Modernização

**Feature Branch**: `013-unidade-escolar-modernizacao`
**Created**: 2026-08-12
**Status**: Implantado
**Depends on**: `specs/002-design-system`, `specs/005-design-system-v2`, `specs/007-usuarios-modernizacao`, `specs/008-perfis-modernizacao`
**Input**: User description: "Ajustar a tela de Unidade Escolar. A escola precisa visualizar as informações da própria unidade e editar infraestrutura, administrativo, equipamentos etc. A listagem serve ao Superadmin para verificar as escolas sob contrato e dar suporte."

## Contexto

O módulo `Escolas → Unidade Escolar` (`/escolas`) hoje é uma listagem em server component que exibe **todas** as `schools` para qualquer usuário logado (sem escopo e sem checagem de permissão). A tela de edição (`/escolas/[id]`) carrega o form gigante do Censo INEP (9 tabs, ~250 campos) com botão **Excluir** sempre visível. O link direto de escola na sidebar (não-superadmin) está incondicional e rotulado como "Escola".

O recurso de permissão `escolas` já existe seedado em `recursos.sql`, mas **nunca é checado**.

Esta spec entrega:

1. **Listagem escopada e protegida** — superadmin vê todas as escolas (contrato = estar cadastrada); usuário vinculado vê só as próprias.
2. **Permissão por perfil** — o recurso `escolas` (visualizar/criar/editar/excluir) passa a controlar as ações, com **edição estrita**: só quem tem perfil com `escolas.editar` altera; criação/exclusão exigem perfil (na prática superadmin).
3. **Escola sempre enxerga a própria unidade** — visualização em modo **read-only** para quem não tem permissão de edição.
4. **Modernização visual** — filtros, cards ricos, paginação, tabs modernas e footer sticky no form.

Esta spec **não altera o modelo de dados** (0 migrations): reaproveita o recurso `escolas` seedado, a tabela `schools` e o vínculo `user_schools`.

## Clarifications

### Session 2026-08-12

- Q: O que significa "escolas sob contrato" para a listagem? → A: **Estar cadastrada no sistema = ter contrato**. A listagem do superadmin já é a fonte; sem tabela/módulo de contrato novo.
- Q: Como a escola acessa a unidade? → A: **Mesma tela do form** (`/escolas/{schoolId}`), via link direto da sidebar.
- Q: A escola pode editar o que? → A: **Tudo** (identificação, endereço, infraestrutura, equipamentos etc.) — a tela existe para a escola manter os dados que mudam fisicamente. Mas a edição é **controlada por Perfis e Permissões** (recurso `escolas.editar`), não aberta a qualquer vínculo.
- Q: Acesso à própria unidade é garantido mesmo sem permissão `escolas.visualizar`? → A: **Sim.** Quem pertence à escola (vínculo em `user_schools`) sempre **visualiza** a própria unidade (modo read-only); a matriz controla quem **edita**.
- Q: Rótulo do link na sidebar? → A: Rótulo fixo **"Unidade Escolar"**.
- Q: Escopo visual? → A: Lista + tela da unidade + form (spec completa).

---

## Product Experience

| Categoria | Princípios | Aplicação |
|-----------|-----------|-----------|
| **PE-1xx** | PE-101 | Filtros rápidos: busca nome/INEP, situação, dependência, localização |
| **PE-2xx** | PE-201, PE-202 | Hierarquia: filtros > grid de cards > ações; paginação |
| **PE-4xx** | PE-401, PE-403 | Skeleton/spinner; empty states contextuais com CTA |
| **PE-5xx** | PE-501 | EmptyState oficial; ShieldAlert para permissão negada |
| **PE-6xx** | PE-601, PE-603 | Grid responsivo; footer de botões h-11; áreas de toque ≥ 36px |
| **PE-8xx** | PE-802, PE-803 | Cards ricos com StatusBadge semântico; banners de aviso com tokens |
| **PE-9xx** | PE-902, PE-905 | `fieldset disabled` (semântico) para read-only; bullets/aria corretos |

## User Scenarios

### User Story 1 — Superadmin acompanha as escolas sob contrato (P1)

Acessa `/escolas`. Vê os filtros (busca, situação, dependência, localização), os cards com INEP/tipo/local/contato e a paginação. Abre qualquer unidade, edita tudo e pode excluir.

**Acceptance**: listagem mostra todas as `schools`; "Nova Escola" visível; abrir unidade de outra escola funciona.

### User Story 2 — Gestor da escola vê e atualiza a própria unidade (P1)

Acessa pela sidebar "Unidade Escolar" → `/escolas/{schoolId}`. Vê o nome da escola no cabeçalho (sem breadcrumbs de lista), navega pelas 9 abas e edita infraestrutura/equipamentos/administrativo.

**Acceptance**: se o perfil tem `escolas.editar`, o form está totalmente editável e o Salvar persiste; se não tem, o form fica desabilitado com banner "Visualização somente" e botão "Voltar".

### User Story 3 — Profissional sem perfil/permissão não altera a unidade (P2)

Qualquer usuário vinculado visualiza a própria unidade, mas **não edita** sem permissão explícita no perfil; criar escola e excluir exigem perfil autorizado (superadmin na prática).

**Acceptance**: `updateSchool`/`createSchool`/`deleteSchool` lançam "Acesso negado: permissão insuficiente" server-side; botões ocultos no client.

---

## Requirements

### R1 — Validação estrita de permissão (`perfis.ts`)
- `validarPermissaoEstrita(pessoaId, recurso, acao)`: se `pessoaId` vazio → permite (superadmin/setup sem pessoa); pessoa sem `perfil_id` → **nega**; perfil inativo ou sem o recurso → **nega**; permissão verdadeira → passa. Reutiliza `validarPermissaoServer`.

### R2 — Server actions de escolas escopadas e protegidas (`schools.ts`)
- `getSchoolsEscopadas(ids: string[] | null)` → mantém `getSchools` removida; `null` = todas (superadmin); senão `.in('id', ids)`.
- `getSchool(id, opts?: { pessoaId, escolaDoUsuario })` → se `escolaDoUsuario === id` (própria unidade) **não exige** permissão; senão exige `escolas.visualizar`.
- `createSchool(school, pessoaId?)`, `updateSchool(id, school, pessoaId?)`, `deleteSchool(id, pessoaId?)` → `validarPermissaoEstrita(... 'criar'/'editar'/'excluir')` via import dinâmico de `./perfis` (padrão do projeto).
- `getFirstSchool`, `getUserAuthInfo`, `getDashboardData` permanecem inalterados.

### R3 — Listagem `/escolas` (client component, superadmin)
- Usa `useAuth()` (`schoolId`, `isSuperAdmin`, `allSchools`) + `usePermissoes`.
- Alimentação: `getSchoolsEscopadas(isSuperAdmin ? null : allSchools.ids)`.
- `PageHeader` usa ícone `School`, título "Unidade Escolar", ação "Nova Escola" só com `pode.criar('escolas')`.
- `PageSection compact "Filtros"` + `FilterBar` (busca + 3 `Selects`: situação, dependência, localização).
- Grid de cards (nome, `StatusBadge` de situação, INEP, tipo, local, telefone, e-mail) + `<Pagination>` 10/pág.
- Estados: loading skeleton; empty contextual (filtros vs sem cadastros, CTA condicional a `podeCriar`); estado "nenhuma escola vinculada" para não-superadmin sem `allSchools`.
- Rodapé compacto "Censo INEP 2026 (Registro 00)".

### R4 — Tela da unidade `/escolas/[id]`
- Escopo: `foraDeEscopo = schoolId && !isSuperAdmin && id !== schoolId` → `EmptyState` ShieldAlert "Sem permissão".
- Permissões estritas: `podeEditar = !foraDeEscopo && !isSetup && pode.editar('escolas')`; `podeExcluir` análogo.
- `getSchool(id, { pessoaId, escolaDoUsuario: schoolId })`.
- `PageHeader`: título = nome da escola; breadcrumbs **só superadmin** ("Unidade Escolar" > nome); ação Excluir (só `podeExcluir`) via `ConfirmDialog`.
- Sem `podeEditar` → banner warning "Visualização somente" + `<EscolaForm readOnly>`.
- Loading spinner; erro de carregamento → ShieldAlert.

### R5 — Criação `/escolas/novo`
- Guard `podeCriar = !isSetup && pode.criar('escolas')`; negado → `EmptyState` ShieldAlert.
- `createSchool({ ...tipo_registro: '00' }, pessoaId)`.
- Breadcrumbs "Unidade Escolar" > "Nova Escola".

### R6 — Sidebar
- Link direto da escola (não-superadmin com `schoolId`) rotulado **"Unidade Escolar"** (antes "Escola"). Permanece condicionado a `schoolId`.

### R7 — Form `escola-form.tsx`
- Nova prop `readOnly`.
- Modo read-only via `<fieldset disabled className="contents">` envolvendo **apenas** os `TabsContent` (as tabs continuam clicáveis para navegar/visualizar).
- Footer fixo inferior (sticky bottom-0, borda, `bg-background/95 backdrop-blur`): botão `h-11`; em read-only mostra **Voltar** e esconde o Salvar.
- Tabs modernizadas no padrão PessoaForm/Dashboard: `TabsList` `bg-card border shadow-xs p-1`; `TabsTrigger` `h-10` inativa `text-foreground/80`, ativa `bg-primary text-primary-foreground`.
- Callers passam `title=""` (PageHeader já é o título).

### R8 — Acessibilidade & Design System
- Tokens v2 (sem hex hardcoded), Plus Jakarta Sans, escala de radius/radii oficiais.
- `EmptyState` com `role="status"` herdado; banners com `role` implícito; contrastes AA.
- Áreas de toque ≥ 36px (tabs h-10, botões h-11, selects h-9).

---

## Constraints

- **0 migrations** (recurso `escolas` já seedado; nenhuma alteração em `schools`).
- **0 novas dependências npm**.
- Server actions com `'use server'` + `getSupabaseAdmin()`; permissão sempre validada server-side (Constitution II).
- Multi-tenant por design: escopo da escola honrado em `schools.ts` (Constitution III).

## Out of Scope

- Modelagem de "contrato comercial" (datas, valores, plano) — decisão: contrato = escola cadastrada.
- Tela de contratos nova.