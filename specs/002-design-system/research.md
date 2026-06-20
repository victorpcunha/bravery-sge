# Research: Design System — Padronização Global de UI/UX

**Feature**: 002-design-system
**Date**: 2026-06-11

## Decision 1: Componentes compostos em `src/components/layout/` em vez de `src/components/ui/`

**Decision**: Componentes de layout e composição (PageContainer, PageHeader, PageSection, FilterBar, FormCard) residem em `src/components/layout/`. Componentes base (Button, Table, Dialog, Badge, etc.) permanecem em `src/components/ui/`. Componentes de feature permanecem em `src/components/[feature]/`.

**Rationale**: A constituição (Princípio IX) define `src/components/ui/` para componentes base do shadcn, e `src/components/[feature]/` para componentes de feature. Componentes de layout são transversais — não são base do shadcn e não pertencem a nenhuma feature específica. O diretório `src/components/layout/` já existe com `page-header.tsx` e `page-section.tsx`, confirmando que esta é a convenção estabelecida do projeto.

**Alternatives considered**:
- `src/components/ui/`: Rejeitada — mistura componentes de composição com primitivos do shadcn, violando Princípio IX.
- `src/components/design-system/`: Rejeitada — introduz novo diretório fora da convenção existente.
- `src/components/shared/`: Rejeitada — `layout/` já existe e é semanticamente mais preciso para PageContainer, PageHeader, etc.

## Decision 2: PageContainer como componente wrapper em vez de classe CSS utilitária

**Decision**: Criar `PageContainer` como componente React que encapsula `container mx-auto py-8 px-4` (e opcionalmente `max-w-6xl` para dashboards), em vez de adicionar uma classe Tailwind customizada ao `globals.css`.

**Rationale**: Um componente React com props (como `maxWidth` para layout Dashboard) é mais explícito, type-safe e documentável do que uma classe CSS que pode ser usada de forma inconsistente. Componentes permitem adicionar comportamentos futuros (breadcrumbs automáticos, scroll restoration) sem mudar o markup. A classe `container mx-auto py-8 px-4` está duplicada em 41+ páginas — um componente elimina essa duplicação.

**Alternatives considered**:
- Classe CSS `.page-container`: Rejeitada — não oferece type-safety, não documenta a API, e não permite extensões via props sem adicionar mais classes.
- Hook `usePageLayout()`: Rejeitada — over-engineering para um caso que é puramente visual/estrutural.
- Manter strings duplicadas: Rejeitada — é exatamente o problema que o Design System visa eliminar.

## Decision 3: Variantes do PageSection via prop `variant` em vez de subcomponentes

**Decision**: PageSection aceita prop `variant` com valores `"default"`, `"flush"` (sem padding interno, para tabelas) e `"compact"` (padding reduzido, para filtros). Não criar subcomponentes como `PageSectionFlush`.

**Rationale**: A API existente do PageSection já tem props `title`, `description`, `actions`, `children`, `className`. Adicionar `variant` segue o mesmo padrão do shadcn (Button usa `variant="destructive"`, etc.). Subcomponentes criam hierarquia desnecessária para uma variação de estilo que difere apenas em padding.

**Alternatives considered**:
- Subcomponentes (`PageSectionFlush`, `PageSectionCompact`): Rejeitada — fragmenta a API em múltiplos imports sem ganho real.
- Composição com `className` override: Rejeitada — cada consumidor precisaria lembrar as classes certas, re-introduzindo inconsistência.
- CSS modular por variante: Rejeitada — over-engineering; Tailwind variant props resolvem isso nativamente.

## Decision 4: StatusBadge com mapeamento semântico em vez de mapa de cores customizadas

**Decision**: StatusBadge aceita prop `status` com valores semânticos (`"success"`, `"warning"`, `"destructive"`, `"info"`, `"muted"`) e usa tokens `bg-success/10 text-success`, etc. Não aceita cores Tailwind arbitrárias como `"purple-100"`.

**Rationale**: O sistema já define tokens semânticos (`success`, `warning`, `destructive`, `info`, `primary`, `muted`) no `globals.css` e na constituição (Princípio IV). Mapear status para tokens semânticos elimina cores hardcoded, garante consistência entre Dark/Light mode, e torna o componente impossível de usar com cores fora do design system. Os mapeamentos existentes (perfil: `warning`, ativo: `success`, etc.) são definidos uma vez no componente, não espalhados por cada página.

**Alternatives considered**:
- Mapa de cores customizadas (`{ perfil: 'purple-100 text-purple-700' }`): Rejeitada — permite escapar do design system, é exatamente o problema atual.
- Props `bgClass` + `textClass`: Rejeitada — mesma questão, permite qualquer classe.
- Apenas variantes de `<Badge>` do shadcn: Rejeitada — Badge do shadcn não tem mapeamento semântico de status, apenas `variant="default"|"secondary"|"destructive"|"outline"`.

## Decision 5: FormCard usa Card do shadcn com composição em vez de componente totalmente novo

**Decision**: FormCard é um wrapper em torno de `Card` + `CardHeader` + `CardContent` do shadcn, com padding consistente (`p-5`) e espaçamento de seções (`space-y-6` entre FormCards). Não é um componente fundamentalmente novo, mas uma combinação documentada com valores padrão.

**Rationale**: O Card do shadcn já suporta `CardHeader` com `CardTitle` e `CardDescription`, e `CardContent` com padding. O padrão de formulário (`border border-border rounded-lg p-5 bg-muted/40 space-y-4`) aparece com 3 variações. Em vez de criar um componente rival, FormCard utiliza o Card existente com={}padrões documentados. Isso respeita o Princípio VI (shadcn/ui como padrão).

**Alternatives considered**:
- Componente totalmente novo com markup próprio: Rejeitada — viola Princípio VI, duplica funcionalidade do Card shadcn.
- Apenas documentar o padrão sem componente: Rejeitada — sem componente, cada página pode variar livremente, re-introduzindo inconsistência.

## Decision 6: FilterBar como componente composto com slots em vez de formulário totalmente controlado

**Decision**: FilterBar é um componente de layout que aceita `children` e opcionalmente `searchValue`, `onSearchChange`, `searchPlaceholder` para o campo de busca. Filtros específicos e ações são passados como `children` (composição), não como props config.

**Rationale**: Cada página de listagem tem filtros diferentes (por status, por turma, por perfil, etc.). Um componente totalmente controlado com props para cada filtro criaria uma API complexa e frágil. Composição via children segue o padrão React/shadcn e permite máxima flexibilidade dentro de um layout consistente. O SearchInput já existe como padrão em praticamente todas as páginas de listagem e pode ser embutido no FilterBar.

**Alternatives considered**:
- FilterBar com props para cada tipo de filtro (`filters: FilterConfig[]`): Rejeitada — cria API complexa, cada página precisaria adaptar a config ao seu modelo de dados.
- Apenas documentar o layout sem componente: Rejeitada — sem componente, variações de padding/spacing/ordem ressurjam.
- FilterBar render prop (`renderFilters={() => ...}`): Rejeitada — children é mais idiomático em React que render props para composição.

## Decision 7: Catálogo de componentes como documentação Markdown em vez de Storybook

**Decision**: O catálogo de componentes é documentado em Markdown dentro de `specs/002-design-system/catalog.md`, servindo como referência para desenvolvedores e agentes de IA. Não é criado um Storybook ou ferramenta visual interativa.

**Rationale**: O objetivo principal é servir como referência canônica para futuras implementações, incluindo agentes de IA. Markdown é acessível, versionável com git, pesquisável, e pode ser incluído no AGENTS.md como referência. Storybook exige infraestrutura adicional, não é automaticamente consumido por agentes de IA, e dissocia a documentação do código-fonte. O AGENTS.md já é a fonte de memória operacional do projeto.

**Alternatives considered**:
- Storybook: Rejeitada — over-engineering para o objetivo. Exige setup, build, deploy e manutenção. Não é consumido por agentes de IA.
- Documentação inline em JSDoc/TSDoc: Rejeitada — fragmentada por arquivo, difícil de usar como referência de composição de página.
- Comentários no código: Rejeitada — não serve como referência canônica para composição de páginas.

## Decision 8: Migração incremental página-por-página em vez de big-bang rewrite

**Decision**: A migração de páginas existentes é executada página-por-página, em vez de reescrever todas as páginas de uma vez. Cada página migrada é independente e funciona sozinha. Páginas não-migradas continuam funcionando com estilos antigos.

**Rationale**: O sistema tem 30+ páginas em produção. Um big-bang rewrite seria arriscado, difícil de testar e bloquearia releases. A migração incremental permite: (1) testar cada página individualmente, (2) manter o sistema funcional durante todo o processo, (3) priorizar páginas com mais inconsistências, (4) reverter problemas isoladamente. A classe `card-glass` só é removida do CSS APÓS todas as páginas serem migradas.

**Alternatives considered**:
- Big-bang rewrite: Rejeitada — risco de regressão em 30+ páginas, impossível testar tudo de uma vez.
- Feature flag para Design System: Rejeitada — over-engineering; componentes novos são compatíveis com dados existentes, não precisam de flag.
- Criar componentes novos ao lado dos antigos: Rejeitada — isso já é o plano (componentes novos em `layout/`, antigos permanecem até migração).

## Decision 9: EmptyState existente como base, não reescrita

**Decision**: O componente EmptyState existente em `src/components/ui/empty-state.tsx` já tem API adequada (ícone, título, descrição, ação, className). Ele serve como componente oficial com ajustes mínimos. Não é criado um novo componente.

**Rationale**: O EmptyState atual já suporta os casos de uso necessários (ícone, título, descrição, ação). Os dois padrões existentes (card-glass empty state e border-border empty state) diferem no container, não no componente EmptyState em si. A padronização é alcançada usando EmptyState dentro de Card ou PageSection, não modificando o componente EmptyState.

**Alternatives considered**:
- Reescrever EmptyState com mais variantes: Rejeitada — o componente atual é suficiente; variantes são do container (Card vs PageSection), não do empty state.
- Criar EmptyStateCard e EmptyStateSection: Rejeitada — fragmentação desnecessária.

## Decision 10: Header margin padronizado como `mb-8`

**Decision**: O espaçamento entre PageHeader e o conteúdo abaixo é padronizado em `mb-8` (2rem), consolidando os dois padrões atuais (`mb-6` e `mb-8`). O PageHeader já usa `mb-8`.

**Rationale**: `mb-8` é o padrão mais usado (41 instâncias vs. ~7 com `mb-6`), é o valor que o PageHeader existente já usa, e oferece melhor hierarquia visual entre o header e o conteúdo. `mb-6` seria muito apertado para páginas com filtros abaixo do header.

**Alternatives considered**:
- `mb-6`: Rejeitada — menoria das páginas usa `mb-8`; mudar para `mb-6` diminuiria o respiro visual.
- Variável CSS `--page-header-margin`: Rejeitada — over-engineering para um valor fixo.

## Decision 11: Heading size padronizado como `text-2xl font-semibold`

**Decision**: O tamanho de heading do PageHeader é padronizado em `text-2xl font-heading font-semibold`, consolidando os 3 padrões atuais (`text-3xl font-bold`, `text-2xl font-bold text-primary`, `text-xl font-semibold`). O PageHeader existente já usa `text-2xl font-heading font-semibold`.

**Rationale**: `text-2xl` é o valor intermediário — não tão grande quanto `text-3xl` (que era usado em páginas antigas e cria hierarquia exagerada), nem tão pequeno quanto `text-xl` (que fica subdimensionado para título de página). `font-heading` usa a fonte Plus Jakarta Sans (constitucional), e `font-semibold` é o peso recomendado da constituição (600). O PageHeader existente já usa exatamente estes valores, confirmando que é a escolha correta.

**Alternatives considered**:
- `text-3xl font-bold`: Rejeitada — muito grande, cria hierarquia excessiva, não usa `font-heading`.
- `text-xl font-semibold`: Rejeitada — muito pequeno para título de página, não se distingue o suficiente de seções.

## Decision 12: ConfirmDialog usa AlertDialog do shadcn com composição

**Decision**: ConfirmDialog é um wrapper em torno de `AlertDialog` do shadcn, com props para `title`, `description`, `confirmLabel`, `cancelLabel`, `variant` (`destructive` | `warning`), e `onConfirm`. Não é um componente totalmente novo.

**Rationale**: O padrão de confirmação destrutiva já é usado em múltiplas páginas com `Dialog` + `DialogHeader` + botões manuais. `AlertDialog` do shadcn é semanticamente correto para confirmações e já suporta os padrões necessários. O wrapper Documenta a composição e garante aparência consistente.

**Alternatives considered**:
- Componente totalmente novo: Rejeitada — viola Princípio VI (shadcn/ui como padrão).
- Apenas documentar o padrão: Rejeitada — sem wrapper, cada página continuaria com implementação ligeiramente diferente.

## Decision 13: Layout Dashboard com `max-w-6xl` via prop no PageContainer

**Decision**: PageContainer aceita prop `maxWidth` com valores `"default"` (sem max-width) e `"dashboard"` (max-w-6xl). O dashboard atual já usa `max-w-6xl`, e esta é a única variação de largura identificada.

**Rationale**: Apenas uma página (Dashboard) usa `max-w-6xl`, enquanto 40+ páginas usam largura total. Em vez de criar layouts separados, um componente com `maxWidth` prop resolve o caso específico sem over-engineering.

**Alternatives considered**:
- Dois componentes separados (PageContainer e DashboardContainer): Rejeitada — diferença é apenas uma classe CSS.
- Variável CSS `--page-max-width`: Rejeitada — over-engineering para um caso.