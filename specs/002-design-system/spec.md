# Feature Specification: Design System — Padronização Global de UI/UX

**Feature Branch**: `002-design-system`

**Created**: 2026-06-11

**Status**: Draft

**Input**: User description: "Refatoração e Padronização Global de UI/UX do Bravery SGE. O sistema atualmente possui inconsistências visuais, estruturais e de experiência do usuário entre módulos e telas. Esta iniciativa tem como objetivo criar um Design System interno e padronizar toda a interface do sistema, definindo componentes reutilizáveis, layouts oficiais, padrões de navegação, estados visuais e regras de composição para futuras implementações."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Desenvolvedor cria nova página utilizando apenas componentes oficiais (Priority: P1)

Um desenvolvedor (humano ou agente de IA) precisa criar uma nova funcionalidade no sistema — por exemplo, uma página de listagem de turmas ou um formulário de cadastro. Ao consultar o catálogo de componentes oficiais, ele encontra layouts prontos (Listagem, Cadastro, Visualização), componentes compostos (PageHeader, FilterBar, DataTable, FormCard, EmptyState) e regras claras de composição. Ele monta a página inteira combinando esses componentes sem escrever estilos customizados, sem duplicar padrões, e sem criar variações inconsistentes. A página resultante é visualmente idêntica às demais páginas já padronizadas do sistema.

**Why this priority**: Este é o objetivo central do Design System — eliminar inconsistências futuras na origem. Se desenvolvedores e agentes não conseguirem usar os componentes oficiais para criar novas páginas, toda a migração deTelas existentes será em vão, pois novas inconsistências continuarão surgindo.

**Independent Test**: Criar uma página de listagem com filtros, tabela e empty state usando APENAS os componentes do catálogo. Verificar que: (1) nenhum estilo customizado foi necessário, (2) o resultado é visualmente consistente com as páginas já migradas, (3) o código não contém classes de cor hardcoded, `shadow-[rgba]`, `text-white`, ou `<button>` nativo.

**Acceptance Scenarios**:

1. **Given** o catálogo de componentes oficial documentado, **When** um desenvolvedor cria uma página de listagem usando PageHeader + FilterBar + DataTable + EmptyState, **Then** a página é visualmente consistente com as demais páginas padronizadas sem necessidade de estilos customizados.
2. **Given** o catálogo de componentes oficial documentado, **When** um desenvolvedor cria um formulário de cadastro usando PageHeader + FormCard, **Then** o formulário segue os padrões de espaçamento, agrupamento de campos e ações sem sobrescrever classes de layout.
3. **Given** uma página nova criada com componentes oficiais, **When** o usuário alterna entre Light Mode e Dark Mode, **Then** todos os elementos da página mantêm contraste e legibilidade adequados em ambos os modos.

---

### User Story 2 — Usuário navega entre módulos e percebe identidade visual consistente (Priority: P2)

Um profissional da educação (gestor, coordenador, professor) utiliza o sistema para realizar suas tarefas diárias — cadastrar alunos, gerenciar turmas, registrar frequência, emitir relatórios. Ao navegar entre diferentes módulos (Gestão Acadêmica, Gestão de Turmas, Gestão Pedagógica, Censo Escolar), ele percebe que os cabeçalhos, tabelas, formulários, botões, badges e estados vazios seguem o mesmo padrão visual. Não há diferenças de espaçamento, cores, tamanhos de fonte, bordas ou sombras entre telas de módulos diferentes. A experiência é percebida como coesa e profissional.

**Why this priority**: A inconsistência visual é o problema que motivou esta initiative. Sem padronização, cada módulo parece um sistema diferente, gerando confusão e desconfiança. No entanto, esta story depende da P1 porque a consistência só é alcançável após os componentes oficiais estarem definidos.

**Independent Test**: Navegar por pelo menos 5 módulos diferentes (Escolas, Usuários, Turmas, Matrículas, Indicadores) e verificar que: (1) todos os cabeçalhos seguem o mesmo padrão, (2) todas as tabelas usam o mesmo componente, (3) todos os botões primários têm a mesma aparência, (4) todos os estados vazios seguem o mesmo layout, (5) não há diferenças de espaçamento ou cor entre módulos.

**Acceptance Scenarios**:

1. **Given** o sistema com todas as páginas migradas, **When** o usuário navega de Escolas para Matrículas, **Then** os cabeçalhos de ambas as páginas possuem o mesmo ícone, tamanho de título, descrição e ações no mesmo posicionamento.
2. **Given** o sistema com todas as páginas migradas, **When** o usuário visualiza uma tabela em Gestão de Turmas e outra em Gestão Pedagógica, **Then** ambas usam o mesmo componente de tabela com os mesmos estilos de cabeçalho, linhas, paginação e ações em linha.
3. **Given** o sistema com todas as páginas migradas, **When** o usuário encontra um estado vazio em qualquer módulo, **Then** o EmptyState exibe ícone, título e descrição no mesmo padrão visual em todos os módulos.

---

### User Story 3 — Páginas existentes são migradas para os componentes oficiais (Priority: P3)

O sistema possui mais de 30 páginas com inconsistências identificadas: 9 estilos diferentes para botão primário, 2 padrões de card/container concorrentes, 3 tamanhos de heading, 3 abordagens de shadow, `<button>` nativos em vez de componentes oficiais, `text-white` em vez de tokens de cor, e uma página totalmente divergente (Disciplinas). Cada página é migrada para usar os layouts e componentes oficiais, resultando em eliminação completa de inconsistências.

**Why this priority**: A migração é necessária para entregar a consistência visual, mas depende de P1 (componentes definidos) para ter algo para migrar. É o trabalho mais volumoso, mas cada página migrada é uma vitória independente.

**Independent Test**: Para cada página migrada, verificar que: (1) usa PageHeader em vez de heading manual, (2) usa PageSection ou Card em vez de card-glass ou shadow-[rgba], (3) usa Button shadcn sem overrides de cor/sombra, (4) usa text-primary-foreground em vez de text-white, (5) usa Table shadcn em vez de <table> nativo, (6) não contém cores hardcoded (hex/rgb/rgba).

**Acceptance Scenarios**:

1. **Given** a página de Escolas antes da migração (com card-glass, heading manual, shadow hardcoded), **When** a página é migrada para usar os componentes oficiais, **Then** ela usa PageHeader, PageSection/Card, tokens de cor e shadow da escala padrão, sem nenhuma classe customizada.
2. **Given** a página de Disciplinas antes da migração (layout totalmente divergente com ml-64, native button, native table, text-primary no heading), **When** a página é migrada, **Then** ela segue o mesmo layout padrão das demais páginas sem nenhuma divergência estrutural.
3. **Given** uma página com botão primário usando `bg-primary hover:bg-primary/90 shadow-lg shadow-blue-500/20 text-white`, **When** migrada, **Then** o botão usa exclusivamente o componente Button com variante padrão, sem overrides de className para cor ou sombra.

---

### User Story 4 — Catálogo de componentes serve como referência para futuras implementações (Priority: P4)

Após a padronização, um novo desenvolvedor ou agente de IA consulta o catálogo de componentes para entender quais componentes oficiais existem, como compor uma página, quais tokens usar, quais padrões seguir, e quais anti-padrões evitar. O catálogo é acessível, atualizado e suficiente para que qualquer implementação futura siga os padrões sem necessidade de consultar código-fonte de páginas existentes.

**Why this priority**: O catálogo é o mecanismo de sustentabilidade do Design System. Sem ele, a padronização se perde pela primeira pessoa que não conhece os padrões. No entanto, ele só pode ser escrito completamente após os componentes estarem definidos (P1) e as páginas migradas (P3).

**Independent Test**: Um desenvolvedor que nunca trabalhou no sistema consegue criar uma página de listagem completa consultando apenas o catálogo de componentes, sem olhar código-fonte existente. A página resultante está conforme os padrões.

**Acceptance Scenarios**:

1. **Given** o catálogo de componentes documentado, **When** um novo desenvolvedor consulta o catálogo para criar uma página de listagem, **Then** ele encontra instruções claras de composição de layout, lista de componentes disponíveis com props e exemplos, e regras de design tokens.
2. **Given** o catálogo de componentes documentado, **When** um agente de IA recebe a tarefa de criar uma nova funcionalidade, **Then** ele utiliza exclusivamente os componentes listados no catálogo sem criar variações ou classes customizadas.
3. **Given** o catálogo com seção de anti-padrões, **When** um desenvolvedor consulta a lista de anti-padrões, **Then** ele encontra documentação explícita proibindo: text-white em botões, shadow-[rgba], card-glass, <button> nativo, <table> nativo, heading manual, e gradientes com cores hardcoded.

---

### User Story 5 — Dark Mode funciona consistentemente em todo o sistema (Priority: P5)

Após a padronização, o usuário alterna entre Light Mode e Dark Mode e percebe que todas as páginas mantêm contraste adequado, legibilidade e aparência profissional em ambos os modos. Não existem elementos com cores fixas incompatíveis com Dark Mode, textos ilegíveis, ou fundos que não se adaptam ao tema.

**Why this priority**: Dark Mode é um princípio constitucional (Princípio V), e a padronização é a oportunidade para garantir conformidade total. No entanto, é uma verificação transversal que depende de todas as páginas estarem migradas (P3).

**Independent Test**: Ativar Dark Mode e navegar por todos os módulos do sistema. Verificar que: (1) todos os textos têm contraste adequado contra seu fundo, (2) todos os componentes interativos (botões, inputs, selects) são visíveis e distinguíveis, (3) todos os badges e indicadores de status mantêm seu significado em ambos os modos, (4) tabelas com sticky columns mantêm contraste no header e na primeira coluna.

**Acceptance Scenarios**:

1. **Given** o sistema em Dark Mode, **When** o usuário navega por uma página de listagem com filtros e tabela, **Then** todos os textos, bordas, fundos e elementos interativos possuem contraste adequado e legibilidade equivalente ao Light Mode.
2. **Given** o sistema em Dark Mode, **When** o usuário interage com formulários usando select, input, dialog e dropdown, **Then** todos os componentes de formulário mantêm estilos visuais consistentes e usáveis.
3. **Given** o sistema em Dark Mode, **When** o usuário visualiza badges de status (ativo, inativo, sucesso, erro, aviso), **Then** cada badge mantém seu significado semântico e contraste adequado em ambos os modos.

---

### Edge Cases

- O que acontece quando uma página existente tem um padrão visual que é diferente mas funciona bem em Dark Mode? O Design System deve consolidar para um único padrão, mesmo que ambos funcionem.
- O que acontece quando um componente existente em `src/components/ui/` precisa ser modificado para atender ao Design System? A modificação deve ser compatível com todas as páginas que já o utilizam, sem quebrar funcionalidade existente.
- O que acontece quando uma page específica necessita de um layout que não se encaixa nos layouts padrão (listagem, cadastro, visualização, dashboard)? O Design System deve prever um layout genérico/flexível como fallback.
- Como tratar componentes que ainda usam `card-glass` (classe CSS customizada) que será removida? A migração deve substituir todos os usos de `card-glass` por componentes oficiais antes de remover a classe do CSS.
- O que acontece com a página de Disciplinas, que tem layout completamente divergente (sidebar hardcoded `ml-64`, native elements)? Deve ser completamente reescrita para seguir o layout padrão do sistema.

## Requirements *(mandatory)*

### Functional Requirements

**Layout Padrão**

- **FR-001**: O sistema DEVE definir layouts oficiais para 5 tipos de página: Listagem, Cadastro, Edição, Visualização e Dashboard, cada um com estrutura, espaçamento e composição documentados.
- **FR-002**: O sistema DEVE fornecer um componente de container de página que encapsule o espaçamento padrão (`container mx-auto py-8 px-4`), eliminando a duplicação desta string em mais de 40 páginas.
- **FR-003**: O sistema DEVE fornecer um componente de PageHeader oficial que suporte título, descrição, ícone opcional, ações primárias e breadcrumbs, substituindo os 3 padrões de heading manuais existentes (`text-3xl font-bold`, `text-2xl font-bold`, `text-xl font-semibold`).
- **FR-004**: O sistema DEVE fornecer um componente de PageSection oficial que suporte título, descrição, ações no header e conteúdo, com variantes para seções padrão e seções flush (sem padding interno, para tabelas).
- **FR-005**: Cada página do sistema DEVE seguir a composição: Container > PageHeader > Seções (PageSection ou Card), sem layouts alternativos não padronizados.

**Componentes de Dados**

- **FR-006**: O sistema DEVE fornecer um componente de FilterBar oficial para barras de filtro/pesquisa em páginas de listagem, suportando campo de busca, filtros por select/dropdown, e ações de exportação ou criação.
- **FR-007**: O sistema DEVE definir o padrão oficial de tabela de dados, incluindo: header estilizado, linhas com hover, sticky first column quando aplicável, paginação, ações em linha (editar, excluir, ativar/inativar), estado de carregamento e estado vazio com EmptyState.
- **FR-008**: O sistema DEVE fornecer um componente de EmptyState oficial que substitua os 2 padrões existentes (card-glass empty state e border-border empty state), com ícone, título, descrição opcional e ação opcional.
- **FR-009**: O sistema DEVE fornecer um componente de StatCard oficial (já existente) como padrão para cards de estatística/summary em dashboards, eliminando variações customizadas.
- **FR-010**: O sistema DEVE fornecer um componente de StatusBadge oficial que mapeie status do sistema para cores via design tokens, eliminando cores hardcoded em badges (`purple-100`, `cyan-700`, `lime-100`, etc.).

**Formulários**

- **FR-011**: O sistema DEVE definir padrões oficiais para espaçamento de formulários, incluindo: espaçamento entre campos (`space-y-4` ou `gap-4`), agrupamento de campos em seções (fieldsets visuais com borda e título), e alinhamento de ações (cancelar + salvar).
- **FR-012**: O sistema DEVE fornecer um componente de FormCard oficial para seções de formulário dentro de dialogs ou páginas de cadastro, com título, descrição opcional e padding consistente.
- **FR-013**: O sistema DEVE padronizar o uso de componentes shadcn/ui para todos os campos de formulário (Input, Select, Textarea, Checkbox, RadioGroup, DatePicker), proibindo inputs nativos estilizados manualmente.

**Estados Visuais Globais**

- **FR-014**: O sistema DEVE definir estados oficiais para Loading (spinner centralizado consoante design atual), Success (toast via Sonner), Error (toast de erro + fallback visual), Empty (EmptyState) e Permissão Insuficiente (tela dedicada ou seção bloqueada).
- **FR-015**: O sistema DEVE padronizar diálogos de confirmação (ConfirmDialog) para ações destrutivas (excluir, desativar, remover), com mensagem, descrição, botão de confirmação destructivo e botão de cancelamento.

**Design Tokens e Consistência Visual**

- **FR-016**: O sistema DEVE eliminar todas as instâncias de `text-white` em botões e elementos sobre fundo primary, substituindo por `text-primary-foreground`.
- **FR-017**: O sistema DEVE eliminar todas as instâncias de `shadow-[rgba]` (shadow com hardcoded rgba), substituindo por `shadow-xs`, `shadow-sm`, `shadow-md` da escala padrão.
- **FR-018**: O sistema DEVE eliminar a classe CSS `card-glass` e substituir todos os usos por PageSection ou Card shadcn.
- **FR-019**: O sistema DEVE eliminar todos os atributos `className` em componentes Button que sobrescrevem cor (`bg-primary hover:bg-primary/90`), sombra (`shadow-lg shadow-primary/20`) ou cor de texto (`text-white`), usando apenas variantes do componente.
- **FR-020**: O sistema DEVE eliminar todos os `<button>` nativos, substituindo por `<Button>` do shadcn/ui ou por `<button>` com estilo `variant="ghost"` quando necessário.
- **FR-021**: O sistema DEVE eliminar todas as `<table>` nativas com estilos inline, substituindo por componentes `<Table>`, `<TableHeader>`, `<TableBody>`, `<TableRow>`, `<TableHead>`, `<TableCell>` do shadcn/ui.
- **FR-022**: O sistema DEVE padronizar os cabeçalhos de página usando exclusivamente o componente PageHeader, eliminando os 3 padrões manuais existentes.
- **FR-023**: O sistema DEVE consolidar os 9 padrões de botão primário identificados em um único padrão oficial usando a variante padrão do componente Button.

**Responsividade**

- **FR-024**: O sistema DEVE funcionar corretamente em 4 breakpoints: celular (base, <768px), tablet (md, 768px+), laptop (lg, 1024px+), e widescreen (xl, 1280px+).
- **FR-025**: O sistema DEVE garantir que tabelas com sticky columns funcionem corretamente em todos os breakpoints, com scroll horizontal em telas menores.
- **FR-026**: O sistema DEVE garantir que formulários em dialogs sejam responsivos, com campos empilhados em celular e organizados em grid em telas maiores.

**Dark Mode**

- **FR-027**: O sistema DEVE garantir que 100% dos componentes visuais funcionem corretamente em Light Mode e Dark Mode, sem textos ilegíveis, contrastes inadequados ou elementos invisíveis. O escopo de acessibilidade é visual (contraste WCAG AA, legibilidade, Dark Mode); navegação por teclado, ARIA e suporte a leitores de tela seguem o padrão do shadcn/ui mas não são escopo de verificação desta iniciativa.
- **FR-028**: O sistema DEVE garantir que badges de status mantenham significado semântico e contraste adequado em ambos os modos, usando opacidade sobre tokens de cor em vez de cores fixas.

**Componentes de Navegação e Interação**

- **FR-029**: O sistema DEVE padronizar breadcrumbs em PageHeader com links navegáveis e item atual não-clicável.
- **FR-030**: O sistema DEVE padronizar modais/dialog como componentes form shadcn/ui com tamanhos consistentes (sm, md, lg) e ações padronizadas.
- **FR-031**: O sistema DEVE padronizar dropdowns e menus de ação em linha como DropdownMenu shadcn/ui com ícones e ações consistentes (editar, excluir, ativar/inativar).

**Catálogo e Documentação**

- **FR-032**: O sistema DEVE ter um catálogo de componentes oficiais documentado, listando todos os componentes disponíveis, suas props, variantes e exemplos de uso.
- **FR-033**: O sistema DEVE documentar anti-padrões proibidos, incluindo lista explícita com exemplos do que não deve ser usado: `text-white` em botões, `shadow-[rgba]`, `card-glass`, `<button>` nativo, `<table>` nativo, heading manual, gradientes hardcoded, `bg-white`, `text-gray-*`, `border-slate-*`.
- **FR-034**: O sistema DEVE documentar regras de composição de páginas, incluindo: layout padrão, composição de PageHeader, seções com PageSection, formulários com FormCard, e estados com EmptyState/Loading/Error.

**Consolidação de Componentes Duplicados**

- **FR-035**: O sistema DEVE identificar e consolidar todos os componentes duplicados ou inconsistentes existentes, eliminando variações não-padronizadas e mantendo uma única versão oficial de cada componente.
- **FR-036**: O sistema DEVE remover a classe CSS `card-glass` do arquivo `globals.css` após a migração de todos os usos para PageSection ou Card.

### Key Entities

- **PageContainer**: Componente de container de página com espaçamento padrão — elimina a duplicação de `container mx-auto py-8 px-4` em 40+ páginas.
- **PageHeader**: Componente de cabeçalho de página com título, descrição, ícone, breadcrumbs e ações — consolida os 3 padrões de heading em um único componente.
- **PageSection**: Componente de seção de conteúdo com header e body — já existe em versão inicial, deve ser aprimorado com variantes (default, flush, compact) e consolidado como padrão oficial.
- **FilterBar**: Componente de barra de filtros para páginas de listagem — padroniza busca, filtros por dropdown e ações primárias.
- **DataTable**: Padrão de tabela de dados com header estilizado, linhas, sticky column, paginação, ações e estados — consolida shadcn Table + padrões de uso.
- **FormCard**: Componente de seção de formulário com título, descrição e padding — consolida os 3 padrões de seção de formulário existentes.
- **EmptyState**: Componente de estado vazio com ícone, título, descrição e ação — já existe em versão inicial, deve consolidar os 2 padrões.
- **StatCard**: Componente de card de estatística — já existe e está padronizado, servir como referência.
- **StatusBadge**: Componente de badge de status que mapeia estados para tokens de cor — elimina cores hardcoded em badges.
- **ConfirmDialog**: Componente de diálogo de confirmação para ações destrutivas — padroniza o padrão de confirmação duplicado em múltiplas páginas.
- **SearchInput**: Componente de campo de busca com ícone de lupa — padroniza o campo de busca que aparece em quase todas as páginas de listagem.
- **Design Token Registry**: Catálogo documentado de todos os tokens CSS disponíveis (cores, espaçamento, sombras, tipografia) — serve como referência canônica para implementações futuras.
- **Anti-Pattern Registry**: Lista documentada de padrões proibidos com exemplos — impede regressão de inconsistências.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um desenvolvedor ou agente de IA consegue criar uma página de listagem completa (com header, filtros, tabela e estado vazio) em menos de 30 minutos consultando apenas o catálogo de componentes, sem escrever estilos customizados.
- **SC-002**: Zero instâncias de anti-padrões (`text-white` em botões, `shadow-[rgba]`, `card-glass`, `<button>` nativo para ações principais, `<table>` nativo, heading manual fora de PageHeader) em páginas migradas.
- **SC-003**: Todas as 30+ páginas do sistema seguem um dos 5 layouts oficiais (Listagem, Cadastro, Edição, Visualização ou Dashboard) com variação zero em espaçamento, cores de heading, estilos de botão primário e estilos de card.
- **SC-004**: 100% dos componentes visuais mantêm contraste WCAG AA em Light Mode e Dark Mode (escopo: acessibilidade visual — contraste, legibilidade, adaptação de tema). Navegação por teclado e ARIA seguem o shadcn/ui padrão e não são escopo de verificação.
- **SC-005**: Nenhuma página contém cores hardcoded (hex, rgb, rgba não-mapeadas a tokens) após a migração completa.
- **SC-006**: A redução de código duplicado é mensurável: eliminação da classe `card-glass` do CSS, redução de definições de estilo inline em botões de 9 padrões para 1, e eliminação de 3 padrões de heading para 1 componente PageHeader.

## Clarifications

### Session 2026-06-11

- Q: Qual é o escopo de acessibilidade que o Design System deve garantir? → A: Acessibilidade visual apenas — contraste WCAG AA, Dark Mode, legibilidade. Navegação por teclado e ARIA seguem o padrão do shadcn/ui mas não são escopo de verificação.

## Assumptions

- A padronização ocorre dentro dos limites do framework atual (Next.js App Router + Tailwind CSS v4 + shadcn/ui), sem introduzir novos frameworks ou bibliotecas de UI.
- Os Design Tokens já definidos no `globals.css` e na constituição do projeto são a fonte de verdade — nenhum token novo será criado sem justificativa documentada.
- A biblioteca shadcn/ui continua sendo a fonte oficial de componentes base — novos componentes oficiais (PageHeader, PageSection, FilterBar, etc.) são compostos a partir de primitivos shadcn, não alternativas para shadcn.
- A migração de páginas existentes é incremental — cada página pode ser migrada independentemente sem quebrar outras, e páginas não-migradas continuam funcionando normalmente.
- O catálogo de componentes é documentado em formato Markdown dentro do repositório (em `specs/002-design-system/` ou similar), servindo tanto desenvolvedores quanto agentes de IA.
- A página de Disciplinas, que possui layout completamente divergente (sidebar hardcoded, native elements), será completamente reescrita para seguir o layout padrão do sistema.
- A classe CSS `card-glass` só será removida de `globals.css` após a migração de todos os usos.
- Responsividade é garantida nos 4 breakpoints padrão do Tailwind (base, md, lg, xl) — não há necessidade de suporte a navegadores legacy ou dispositivos específicos.