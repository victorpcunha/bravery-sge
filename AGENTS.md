<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-summary -->
# Bravery SGE - Project Summary

## Goal
Sistema de Gestão Escolar completo: turmas, quadro de aulas, indicadores de avaliação, matrículas, perfis e permissões, funções profissionais.

## Progress
- **Turmas**: Migration, CRUD, listagem/cadastro page
- **Quadro de Aulas**: Migration, CRUD, grade editável dia×horário, validação conflitos
- **Indicadores de Avaliação**: Migration, CRUD hierárquico, import BNCC (Infantil só), Níveis de Desenvolvimento (método + personalizado), migração `indicadores_niveis`
- **Matrículas**: Migration (3 tabelas), CRUD, Transporte, Dispensas, Movimentações (Transferir/Reclassificar/Remanejar/Desistir)
- **Perfis e Permissões**: Complete module — migrations (5), actions, components (PerfilFiltros, PerfilGrid, MatrizPermissoes, PerfilForm), list + detail pages, visual protection, server-side validation, audit logging
- **Funções Profissionais**: CRUD page
- **Login**: CPF ou Email; mensagem genérica "Usuário ou senha inválidos"
- **Auth**: `criarAuthUser` via `supabase.auth.admin.createUser()`, link via `user_schools`
- **Sidebar**: Quadro de Aulas, Indicadores, Alunos Matriculados, Perfis e Permissões, Plano de Ensino, Painel do Aluno
- **Diário de Classe**: Frequência por Dia / por Aula (com validação de período ativo), Parecer Descritivo, Avaliação por Indicadores, Avaliações Numéricas (com recuperação)
- **Período Ativo do Aluno**: Coluna `data_saida` na `academico_matriculas`. Atualizada automaticamente ao criar movimentação. Células fora do período são desabilitadas com tooltip. Percentual de frequência calculado individualmente por aluno (presenças / dias válidos no período ativo).
- **Plano de Ensino (FASE 1–5)**:
  - Migration `plano_ensino.sql`: tables `planos_ensino`, `planos_ensino_disciplinas`, `planos_aula`
  - Migration `patch_planos_aula_periodos.sql`: `periodo` → `periodos INT[]`, `bncc_fields JSONB`
  - Server actions: CRUD planos/aula, `listarPeriodosPlanoEnsino`, `buscarBNCCBase`, `listarPlanoAulaPorMes`
  - Pages: list (`/plano-ensino`), create (`/plano-ensino/criar`), detail (`/plano-ensino/[id]`) with period tabs, multi-period checkboxes, BNCC fields per etapa (EI: campos experiência + objetivos; EF: unidades temáticas + objetos conhecimento + habilidades; EM: áreas conhecimento + competências + habilidades)
- **FASE 6 – Plano de Aula no Diário de Classe**: Nova aba "Plano de Aula" com:
  - Tabela `academico_diario_planos_aplicados` (link `plano_aula` → `data_aula`, sem duplicar dados)
  - Server actions em `diario-planos.ts`: `listarDiasComAula`, `listarPlanosAplicados`, `listarPlanosDisponiveis`, `aplicarPlanoAula`, `removerPlanoAulaAplicado`
  - Grade mensal restrita a dias com aula (filtra pelo Quadro de Horários)
  - Planos são criados **apenas** no Plano de Ensino; no diário o profissional seleciona qual aplicar ao dia
  - Remover aplicação não afeta o plano original (`planos_aula`)
  - Indicador visual BookOpen no Frequência por Aula preservado (removeu diálogo antigo)
  - Componente `plano-aula-diario.tsx`, ação `diario-planos.ts`
  - `criarPlanoAulaDoDiario` removido de `plano-ensino.ts` (dead code)
  - `disciplinaSelecionada` removido de `plano-aula-diario.tsx` (variável não usada)
- **Painel do Aluno (Visão 360º)**:
  - **FASE 1 — Migrações**: `saude_estudantes.sql`, `ocorrencias.sql`, `historico_manual.sql`, `patch_add_permite_historico_manual.sql`, `patch_recurso_painel_aluno.sql`, `fn_buscar_pessoas_matriculadas.sql`
  - **FASE 2 — Server Actions**: `painel-pessoa.ts` (12 funções), `historico-manual.ts` (ações de histórico manual)
  - **FASE 3 — Página + Filtros**: `/gestao-usuarios/painel-aluno`, `filtro-pessoa.tsx` (busca assíncrona com debounce 300ms), `filtro-turma.tsx` (dropdown dinâmico)
  - **FASE 4 — Cards**: `card-identificacao.tsx`, `card-contato.tsx`, `card-saude.tsx` (aparecem ao selecionar aluno, independente de turma)
  - **FASE 5 — Cards dependentes de turma**: `card-desempenho.tsx` (gráfico Recharts + frequência), `card-quadro-aulas.tsx` (grade dia×horário), `card-historico.tsx` (tabela + modal manual condicional)
  - **FASE 6 — Card Ocorrências**: `card-ocorrencias.tsx` (badge colorido por tipo disciplinar/pedagógica)
  - Cards de Identificação/Contato usam colunas da tabela `people` (`logradouro`, `bairro`, `telefone_celular`, `telefone_fixo`, `email`)
  - Busca de alunos usa RPC `buscar_pessoas_matriculadas` (SQL) com fallback em duas queries
  - Recurso de permissão: `gestao-usuarios.painel-aluno`
  - Recharts instalado para gráfico de desempenho

## Known Issues
- All server actions use `'use server'` + `getSupabaseAdmin()` (service_role, bypass RLS)
- `academico_anos_letivos` usa coluna `status` (string), NÃO `ativo` (boolean)

## UI & Design System

### Catálogo de Componentes Oficiais

Referência canônica: `specs/002-design-system/catalog.md` (tokens v2 em `specs/005-design-system-v2/spec.md`)

**Layout**:
- `PageContainer` — `src/components/layout/page-container.tsx` — Container de página com `maxWidth="default"|"dashboard"`
- `PageHeader` — `src/components/layout/page-header.tsx` — Cabeçalho com título, descrição, ícone, breadcrumbs, ações
- `PageSection` — `src/components/layout/page-section.tsx` — Seção com `variant="default"|"flush"|"compact"`
- `FilterBar` — `src/components/layout/filter-bar.tsx` — Barra de filtros com busca (SearchInput) e ações
- `SearchInput` — `src/components/layout/search-input.tsx` — Campo de busca com ícone
- `FormCard` — `src/components/layout/form-card.tsx` — Seção de formulário com título e descrição

**Feedback**:
- `StatusBadge` — `src/components/feedback/status-badge.tsx` — Badge semântico (`success|warning|destructive|info|primary|muted`)
- `ConfirmDialog` — `src/components/feedback/confirm-dialog.tsx` — Confirmação destrutiva com `variant="destructive"|"warning"`
- `EmptyState` — `src/components/ui/empty-state.tsx` — Estado vazio com ícone, título, descrição, ação
- `StatCard` — `src/components/ui/stat-card.tsx` — Card de estatística

**Layouts Oficiais**:
1. **Listagem**: `PageContainer > PageHeader + PageSection(compact, title="Filtros") > FilterBar + PageSection(flush, actions={Nova}) > Table + EmptyState`
   - Botão "Nova" vai no `PageSection(flush) actions`, NÃO no `PageHeader` ou `FilterBar`
   - Tabela: `font-medium text-foreground` para nome, `text-muted-foreground` para colunas secundárias, `<StatusBadge>` para status
   - Ações: `<Button variant="ghost" size="icon-sm"><Pencil/></Button>` + `<Trash2 className="text-destructive"/>`
   - Loading: `<Card><div className="p-6 space-y-3"><div className="h-10 bg-muted rounded-lg animate-pulse"/></div></Card>`
   - Empty: `<Card><EmptyState icon=... action={<Button>Nova</Button>}/></Card>`
2. **Listagem com Modal**: `PageContainer (lista) + Dialog(max-w-4xl, max-h-90vh, flex flex-col, p-0 gap-0) > DialogHeader(shrink-0) + NomeForm(flex-1 overflow-y-auto body + shrink-0 border-t footer)`
   - `DialogContent` sempre `p-0 gap-0` para zerar padding padrão
   - Body do form: `flex-1 overflow-y-auto px-6 py-4`
   - Footer: `shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30`
3. **Cadastro/Edição**: `PageContainer > PageHeader(breadcrumbs) + FormCard(s) + ações`
4. **Visualização**: `PageContainer > PageHeader(breadcrumbs) + PageSection(s)`
5. **Dashboard**: `PageContainer(maxWidth="dashboard") > PageHeader + StatCards + PageSections`

**Estados Globais**:
- **Loading**: Spinner centralizado com `animate-spin rounded-full h-8 w-8 border-b-2 border-primary` + texto `text-muted-foreground`
- **Error**: `toast.error()` do Sonner para ações; `<EmptyState icon={AlertCircle} ...>` para erros de página
- **Permission Denied**: `<EmptyState icon={ShieldAlert} title="Sem permissão" ...>`
- **Empty**: `<EmptyState icon={...} title="..." description="..." action={<Button>...</Button>} />`

### Regra #1: NUNCA use cores hexadecimais (#XXXXXX) em componentes ou páginas
Use SEMPRE os tokens Tailwind v4 derivados das CSS variables do `globals.css`:

| Uso | Token Tailwind | Hex (referência) |
|-----|---------------|------------------|
| Marca principal (blue) | `primary` / `bg-primary` / `text-primary` | #1F88EB |
| Texto em primary | `primary-foreground` | #FFFFFF |
| Interação/foco complementar (cianês) | `accent` / `bg-accent` / `text-accent` | #4FC3D7 |
| Ação secundária (deep blue) | `secondary` / `bg-secondary` / `text-secondary` | #1A6FC2 |
| Fundo de página | `background` / `bg-background` | #F6F8FA |
| Fundo de card | `card` / `bg-card` | #FFFFFF |
| Texto principal (slate-800) | `foreground` / `text-foreground` | #1E293B |
| Texto secundário (slate-500) | `muted-foreground` / `text-muted-foreground` | #64748B |
| Bordas (slate-200) | `border` / `border-border` | #E2E8F0 |
| Fundo muted (slate-100) | `muted` / `bg-muted` | #F1F5F9 |
| Foco/destaque (= primary) | `ring` / `bg-ring` / `text-ring` | #1F88EB |
| Destruição | `destructive` / `bg-destructive` | #DC2626 |
| Sucesso | `success` / `bg-success` / `text-success` | #16A34A |
| Aviso | `warning` / `bg-warning` / `text-warning` | #D97706 |
| Info (= primary) | `info` / `text-info` | #1F88EB |
| Sidebar fundo (quase branco) | `sidebar` / `bg-sidebar` | #FAFBFC |
| Sidebar texto | `sidebar-foreground` | #1E293B |
| Sidebar hover (muted) | `sidebar-accent` | #F1F5F9 |
| Sidebar ativo (= primary) | `sidebar-primary` | #1F88EB |

### Regra #2: Componentes de formulário
- SEMPRE use componentes shadcn/ui: `<Select>`, `<Input>`, `<Textarea>`, `<Button>`, etc.
- NUNCA use `<select>`, `<input type="text">` nativo com classes inline de estilo.
- Use `border-border` para bordas (não `border-slate-300`, `border-[#e2e8f0]`, etc.).
- Use `focus:border-accent focus:ring-accent/20` para estados de foco.
- Use `bg-card` para fundo de card (não `bg-white` ou `bg-[#fff]`).
- Use `bg-background` para fundo de página (não `bg-[#f8fafc]`).
- Use `bg-muted` para fundo de seções/zonas (não `bg-slate-50` ou `bg-[#f1f5f9]`).
- Use `text-muted-foreground` para texto secundário (não `text-slate-500` ou `text-[#64748b]`).

### Regra #3: Variantes de opacidade
- Use `primary/10`, `primary/80`, `foreground/60`, `accent/15`, etc. para opacidade.
- NUNCA use `bg-[#0F2B46]/10` ou `bg-[#1D3557]/10` — use `bg-primary/10`.
- Para badges de perfil: `bg-warning/10 text-warning`, `bg-primary/10 text-primary`, etc.

### Regra #4: Sidebar
- SEMPRE use tokens `sidebar-*`: `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`, `border-sidebar-border`, `bg-sidebar-primary`.
- NUNCA hardcode `#1D3557`, `#457B9D`, `#4FB3BF`, `#0F2B46` no sidebar.
- Sidebar é **branca** em light mode (`bg-sidebar`) e slate-950 em dark mode.
- Para ativo: `bg-primary/10 text-primary` (blue com 10% opacidade + texto blue).
- Para hover: `hover:bg-muted hover:text-foreground`.
- Para sub-item ativo: `bg-sidebar-accent/80`.
- Logo do sidebar usa gradiente `from-primary to-accent`.

### Regra #5: Tabelas com sticky
- Primeira coluna em tabelas com scroll horizontal: `sticky left-0 bg-background z-10`.
- Header correspondente: `sticky left-0 bg-muted z-10`.
- Container: `overflow-x-auto`.
- Use `border-border` para bordas de tabela (não `border-[#cbd5e1]`).

### Regra #6: Dark mode
- ThemeProvider (`next-themes`) está instalado no root layout.
- Classes CSS no `.dark` já estão definidas em `globals.css`.
- Ao criar componentes, use tokens (nunca `bg-white`, `text-gray-900`, etc.) para garantir compatibilidade com dark mode.
- Para testar dark mode, adicione `class="dark"` no `<html>`.
- Dark mode usa paleta slate: background `#0F172A` (slate-950), card `#1E293B` (slate-800), border `#334155` (slate-700).
- Primary permanece `#1F88EB` em dark mode (não é invertido).
- Sidebar em dark mode: `#0F172A` (slate-950).

### Regra #7: Gradientes
- Use `from-primary to-accent`, `from-primary to-primary/80`, etc.
- NUNCA use `from-[#0F2B46] to-[#2E8BA3]` ou `from-[#1D3557] to-[#457B9D]` em gradientes.

### Regra #8: Componentes oficiais do Design System
- SEMPRE use os componentes oficiais listados acima para layouts, feedback e estados.
- NUNCA use `container mx-auto py-8 px-4` inline — use `<PageContainer>`.
- NUNCA use headings manuais (`<h1>` com classes) — use `<PageHeader>`.
- NUNCA use `card-glass` ou `shadow-[rgba]` — use `<PageSection>` ou `<Card>`.
- NUNCA use `<button>` nativo para ações — use `<Button>` shadcn.
- NUNCA use `<table>` nativo com estilos inline — use `<Table>` shadcn.
- NUNCA use cores hardcoded em badges — use `<StatusBadge>`.
- NUNCA use `text-white` em botões sobre fundo primary — use `text-primary-foreground` ou Button variante padrão.

### Regra #9: Anti-padrões proibidos
- `text-white` em botões → `text-primary-foreground` ou Button default
- `shadow-[rgba]` → `shadow-xs`, `shadow-sm`, `shadow-md`
- `card-glass` → `PageSection` ou `Card`
- `<button>` nativo → `<Button>` shadcn ou `variant="ghost"`
- `<table>` nativo → `<Table>` shadcn
- Heading manual → `<PageHeader>`
- `shadow-lg shadow-blue-500/20` → `shadow-sm` ou `shadow-md`
- `bg-purple-100 text-purple-700` → `<StatusBadge>`
- `ml-64` (sidebar hardcoded) → remover (layout gerencia sidebar)
- `text-foreground/80` → `text-muted-foreground`
- `border-2 border-border` → `border-border` (1px padrão)
- `bg-white` → `bg-card` ou `bg-background`
- `text-gray-*`, `text-slate-*` → `text-foreground` ou `text-muted-foreground`
- `border-slate-*` → `border-border`
- Gradientes hardcoded (`from-[#0F2B46] to-[#2E8BA3]`, `from-[#1D3557] to-[#457B9D]`) → `from-primary to-accent`
- Nome completo: `nome_completo` (NÃO `name`)
- Login CPF/email: colunas `cpf`, `email`
- Contato: `telefone_celular`, `telefone_fixo`
- Endereço: `logradouro`, `bairro`, `numero`, `complemento`

### Regra #10: Escala Tipográfica (v2 — Visual Language)
- Corpo padrão do sistema é **15px** — não `text-sm` (14px). Use `text-[15px]` para descrições, parágrafos e texto corrido.
- Título de página (PageHeader): `text-[28px] font-bold leading-tight`
- Título de seção (PageSection/FormCard): `text-[20px] font-semibold leading-snug`
- Headline de card: `text-[16px] font-semibold`
- Rótulos/botões: `text-[14px] font-medium`
- KPI/display (StatCard value): `text-[36px] font-bold leading-none`
- **Proibido**: usar `text-sm` como corpo de descrição — use `text-[15px]`
- **Proibido**: usar `text-base` como título de seção — use `text-[20px]`
- **Proibido**: usar `text-2xl font-semibold` como título de página — use `text-[28px] font-bold`
- Usar apenas pesos 400, 500, 600, 700 (Plus Jakarta Sans)
- Fonte oficial: Plus Jakarta Sans (não usar `system-ui`, `Helvetica`, `Arial`, serifadas ou decorativas)

### Regra #11: Escala de Radius (v2 — Visual Language)
- 6 níveis oficiais: `rounded-sm` (6px), `rounded-md` (8px), `rounded-lg` (12px), `rounded-xl` (16px), `rounded-2xl` (24px), `rounded-full` (9999px)
- Inputs/badges: `rounded-sm` (6px)
- Botões/tabs: `rounded-md` (8px)
- Cards/modais: `rounded-lg` (12px)
- **Proibido**: `calc()` para radius — apenas valores da escala oficial
- **Proibido**: `rounded-3xl` e `rounded-4xl` — removidos da escala oficial

### Relacionamentos de disciplinas (query pattern)
- `turmas_disciplinas.matriz_disciplina_id` → `academico_matriz_disciplinas.id`
- `academico_matriz_disciplinas.disciplina_id` → `academico_disciplinas.id`
- `academico_disciplinas.nome` — coluna `nome`, NÃO `name`
- Query correta: `.select('matriz_disciplina_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))')`

## Commands
- Build: `npx next build`
- Dev: `npx next dev -p 3001`
<!-- END:project-summary -->

<!-- SPECKIT START -->
Current plan: specs/004-historico-escolar/plan.md
Feature: Histórico Escolar — Painel do Aluno
Spec: specs/004-historico-escolar/spec.md
Data model: specs/004-historico-escolar/data-model.md
Quickstart: specs/004-historico-escolar/quickstart.md
<!-- SPECKIT END -->
