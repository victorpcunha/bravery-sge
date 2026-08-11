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
  - **Modernização (spec 014)**: Spec + plan + tasks em `specs/014-painel-aluno-modernizacao/`
  - **Fundação**: removido `max-w-5xl` dos 2 `PageContainer`; `filtro-pessoa.tsx` reescrito (botão trigger estilo `SearchInput` h-9 pl-10, avatar de iniciais `bg-primary/10`, nome `text-[15px] font-semibold`, CPF formatado `000.000.000-00`, `EmptyState` oficial, mantidos Popover/Command/debounce 300ms)
  - **Identificação**: `card-identificacao.tsx` sem sub-card (content direto no `PageSection`), header com avatar de iniciais em gradiente, chips coloridos `bg-x/10 text-x`, CPF com `IdCard`, endereço com número + município via `getMunicipioByCodigo`, filiações, telefones via `whatsapp` + `telefone_secundario` (lucide `Phone`)
  - **Saúde**: `card-saude.tsx` sem sub-card; seções renomeadas p/ "Tipos de Deficiência" (destructive), "Tipos de Transtorno" (warning), "Recursos de Acessibilidade" (info); ícones Stethoscope/Brain/Activity/Pill/Heart com chips coloridos
  - **Quadro de Aulas**: `card-quadro-aulas.tsx` sem sub-card; tabela no `PageSection` com cabeçalhos `bg-muted` uppercase, badge de horário `font-mono` em `bg-muted`, pill de disciplina `bg-primary/5 text-primary`, zebra `bg-muted/20`, sticky primeira coluna
  - **Histórico**: `card-historico.tsx` sem sub-card; botão "Adicionar Histórico" movido p/ `actions` do `PageSection` (h-9); modal `ModalHistoricoManual` subiu p/ `page.tsx` com reload via prop `refreshKey`; prop `schoolId` removida do card
  - **Expansões**: `expansao-notas.tsx` com `Tooltip` na célula de período com recuperação (mostra nota original + recuperação); `expansao-indicadores.tsx` auto-seleciona a 1ª disciplina
  - **Bugs corrigidos**: `painel-tabs.tsx` e `modern-tabs.tsx` (removido `useEffect` de URL sync que revertia a aba); `getNotasDetalhadas` (faltas `F+FJ` contam como falta; critério `por_dia` usa total geral, sem granularidade por disciplina); `getIndicadoresAvaliados` (não pula indicadores sem `disciplina_id` — agrupa por `disciplina_id ?? campo_experiencia`; corrigido lookup de níveis que consultava `indicadores_niveis` por ID de indicador em vez de `nivel_id`); `PessoaForm.tsx` (removido `delete payload.telefone_secundario` que apagava o telefone secundário no save); **frequência no Painel** (`getHistoricoSistema` e `getFrequenciaGeral` sempre consultavam `academico_frequencias_dia`, ignorando `criterio_frequencia` da turma — turmas `por_aula` mostravam percentual errado; agora resolvem o critério via matriz→método com helper `resolverCriterioFrequencia` e escolhem a tabela correta; limpos 3 registros órfãos de `frequencias_dia` da turma "1° ANO - AB")
  - Cards de Identificação/Contato usam colunas da tabela `people` (`logradouro`, `bairro`, `numero`, `complemento`, `municipio_residencia`, `whatsapp`, `telefone_secundario`, `email`, `filiacao_declarada`, `filiacao_1`, `filiacao_2`)
  - Busca de alunos usa RPC `buscar_pessoas_matriculadas` (SQL) com fallback em duas queries
  - Recurso de permissão: `gestao-usuarios.painel-aluno`
  - Recharts instalado para gráfico de desempenho
- **Dashboard — Modernização visual (spec 006)**:
  - Spec + plan + tasks em `specs/006-dashboard-modernizacao/`
  - **FASE A — Fundação**: novo `<DashboardHero>` (gradiente, saudação, escola, 4 quick actions em 2×2 mobile); `--chart-4` `#8B5CF6` → `#1A6FC2` (deep blue); `PageContainer` `max-w-7xl` em `maxWidth="dashboard"`
  - **FASE B — StatCards**: prop `size="hero"`, `tabular-nums`; hero metric = Frequência Média; 4 secundárias (Alunos, Matrículas Ativas, Docentes, Turmas)
  - **FASE B+ — Hero card enriquecido**: novo `<FrequenciaHeroCard>` combinando % grande + top 5 turmas com mais faltas (cor semântica por %)
  - **FASE C — Gráficos modernos**: `chart-helpers.tsx` (paleta semantic, tooltip com `shadow-lg`/`bg-popover`); 8 charts com `CartesianGrid` + `<Legend>` + gradient primary; ocupação/frequência por turma com cor semântica (success/warning/destructive) e `SemanticLegend`
  - **FASE C+ — Polimento**: BarCharts `alunos-por-*` com cor única primary (alinha Legend); `useIsMobile()` para Y-axis `width` responsivo; `truncateLabel` para labels longos
  - **FASE D — Widgets**: `frequencia-media-card.tsx` (tipografia 36px, PieChart 160px), `ocupacao-card.tsx` (`<PageSection>` + cor semântica), `aniversariantes-list.tsx` (`<PageSection>` + `EmptyState`)
  - **FASE E — Tabs + deep-link**: novo `<DashboardTabs>` (shadcn Tabs + `useSearchParams` + `router.replace`); 4 abas (Visão Geral, Acadêmico, Frequência, Alertas) com URL `?tab=...`
  - **FASE E+ — Prominência visual das tabs**: `bg-card` + `border` + `shadow-xs` (não `bg-muted/50`); inativa `text-foreground/80 font-semibold`; hover `bg-accent/10`; ativa `bg-primary` + `text-primary-foreground`; redistribuição de conteúdo (Taxa Ocupação e Ocupação por turma → Visão Geral; Etapa e Tipo → Acadêmico; Frequência só com Frequência Média + Frequência por turma)
  - **FASE G — Acessibilidade**: `prefers-reduced-motion` global; `--muted-foreground` light `#64748B` → `#475569` (4.04:1 → 7.5:1, passa AA); `EmptyState` com `aria-live="polite"` + `role="status"`
  - **FASE H — Responsividade (PE-6xx)**: `RiscoEvasaoTable` → cards em `<md` + tabela em `≥md`; `TurmasSemProfessorList` → badges empilhados em mobile; áreas de toque ≥ 36px (hero 44, tabs 40, select default 40)
- **Usuários — Modernização visual (spec 007)**:
  - Spec + plan + tasks em `specs/007-usuarios-modernizacao/`
  - **Bug fix mobile menu**: `src/app/(app)/layout.tsx` ganhou header mobile-only com `<SidebarTrigger>` (sticky top-0, blur) — antes o menu era invisível no celular
  - **FASE A — Fundação da lista**: novo `<Pagination>` (`src/components/ui/pagination.tsx`) com 10/pág client-side, prev/next, contador "Mostrando X a Y de Z", `role="navigation"`; empty state contextual (sem cadastros vs filtro sem resultado); `text-xs` → `text-[13px]` na linha 255
  - **FASE B — Lista mobile (card-list)**: `<ul>` cards em `<md>` com nome + CPF/INEP + badges + status + 2 botões de ação (`min-h-[44px]`); tabela em `≥md`; paginação compartilhada
  - **FASE C — Dialog oficial**: `DialogContent` já era `p-0 gap-0 flex flex-col max-h-[90vh]`; ajustei `DialogHeader` com `shrink-0` + `border-b border-border` para não rolar com body; `PessoaForm` já tinha body `flex-1 overflow-y-auto` + footer `shrink-0 border-t`
  - **FASE D — PessoaForm tipografia**: eliminei todas as ~22 violações de `text-xs` (hints → `text-[13px]`, labels → `text-[14px]` via shadcn default, títulos de seção `text-sm font-semibold` → `text-[16px] font-semibold`); erro de CPF ganhou `role="alert"`
  - **FASE E — PessoaForm responsivo**: 25 ocorrências de `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`; 2 ocorrências de `grid-cols-3` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; form rola naturalmente em mobile
  - **FASE F — Acessibilidade**: `aria-required="true"` em 7 inputs críticos (Nome, CPF condicional, Data Nascimento, Sexo, Cor/Raça, Nacionalidade, E-mail); `role="alert"` em erro de validação; botões do footer do Dialog `h-10` (PE-603)
  - **Ajustes pré-FASE G**: Tabs do PessoaForm modernizadas (mesmo padrão das tabs da Dashboard — `bg-card` + `border` + `shadow-xs` container, ativa `bg-primary`); campo "Perfis" renomeado para "Tipo de Pessoa" e checkboxes substituídos por **Pills clicáveis** (`<button type="button" aria-pressed>` com ícone `Check` no ativo)
  - **Pendência consciente**: ~25 outros campos com `*` no label não receberam `aria-required` (escopo reduzido para os 7 críticos que bloqueiam salvamento). Recomendação: spec futura com componente `<FormField required>` que auto-detecta `*`
- **Perfis e Permissões — Modernização visual (spec 008)**:
  - Spec + plan + tasks em `specs/008-perfis-modernizacao/`
  - **FASE A — Fundação da lista**: paginação 10/pág client-side reutilizando `<Pagination>` da spec 007; empty state contextual com `EmptyState` oficial (filtros sem resultado vs sem cadastros); loading com skeleton card; `text-sm` → `text-[14px] tabular-nums` no contador
  - **FASE B — Lista mobile (card-list)**: `<ul>` cards em `<md>` com nome + descrição (`line-clamp-2`) + badges (Tipo + Situação) + data cadastro + 2 botões de ação (`min-h-[44px]`); tabela em `≥md`; paginação compartilhada
  - **FASE C — Matriz de permissões mobile**: `<ul>` cards em `<md>` com grid 2x2 de checkboxes (Visualizar, Criar, Editar, Excluir); tabela em `≥md` (sticky left mantido); módulo label `text-sm font-semibold` → `text-[13px] font-semibold uppercase tracking-wider`; `EmptyState` oficial
  - **FASE D — Form de cadastro**: footer **sticky bottom-0** com `backdrop-blur` e `border-t`, botões `min-h-[40px] sm:min-h-[44px]`; `text-xs` → `text-[13px]` em 3 hints; `aria-required="true"` no Input "Nome do Perfil"; `id` + `htmlFor` ligando Labels aos Inputs; `role="alert"` no aviso de perfil inativo
  - **FASE E — Acessibilidade**: subsumida pela FASE D; tab cycle via Radix UI
  - **Notas**: reuso integral do `<Pagination>` da spec 007; matriz com 50+ recursos em mobile fica longa (virtualizar em spec futura)
  - **Notas**: 0 hex hardcoded; 0 novas deps npm; 11 builds verdes durante execução
- **Plano de Ensino — Modernização de Telas (spec 012)**:
  - Spec + plan + tasks em `specs/012-plano-ensino-modernizacao/`
  - **Lista**: card de filtros (`PageSection compact` + `FilterBar`): escola p/ superadmin ("Selecione uma escola", sem "Todas as Escolas"), ano letivo com **padrão ativo** (`status==='ativo'` calculado no cliente), turma, disciplina ("Selecione uma disciplina" default + "Todas"), período em **pills multi-select** (`ClickablePill`); mini-cards ricos (disciplina em destaque, turma, bimestre = união de períodos, professor via `turmas_profissionais`, aulas+horas do Quadro de Aulas, última atualização, "Ver Plano"); botão "Novo Plano de Ensino" no header da `PageSection`; superadmin cria via `?escola=` (query param da lista)
  - **Criação**: sem breadcrumbs; card Identificação 100% largura com Ano Letivo + Turma 50/50; disciplinas como **cards interativos** (border-primary + bg-primary/5 + Check no canto superior direito); toggle interdisciplinar mantido
  - **Plano de Aula (detalhe)**: sem breadcrumbs; form extraído p/ `src/components/plano-ensino/plano-aula-form.tsx` em **3 cards** (Identificação e Conteúdo, Estrutura da BNCC, Planejamento Pedagógico); períodos e BNCC N1/N2 em pills; Habilidades com **código em Badge**; **cômputo de aulas/horas do Quadro de Aulas** por disciplina (`calcularAulasDoQuadro`, debounce 500ms) no intervalo de datas; footer **sticky bottom** com Cancelar/Salvar `h-11`
  - **Server actions**: `listarPlanosEnsino(schoolId, pessoaId, opts)` com filtros `{anoLetivoId, turmaId, matrizDisciplinaId, periodos}` + enriquecimento em batch (disciplinas c/ matriz id, professores, periodos, aulas_quadro+horas_quadro, ultima_atualizacao); nova `calcularAulasDoQuadro`
  - **Notas**: 0 migrations; 0 novas deps npm; 1 build verde (`npx next build`)

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
| Texto secundário (slate-600) | `muted-foreground` / `text-muted-foreground` | #475569 |
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
