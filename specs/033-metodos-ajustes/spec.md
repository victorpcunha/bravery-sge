# Feature Specification: Métodos de Avaliação — Ajustes

**Feature Branch**: `033-metodos-ajustes`

**Created**: 2026-09-16

**Status**: Draft — aguardando aprovação para implementação

**Input**: User description: "Tela Métodos de Avaliação — Ajustes: Card de Filtros (busca 33%); Card Métodos tabela full-width com títulos em destaque; modais Novo/Editar viram página própria; Card Identificação (Ativo em Pill); subcard Método de Avaliação (4 tipos em Pills); Card Avaliações Numéricas (Forma de Registro reduzida em Pill única; Permite Recuperação em Pills multi; Tipo de Média do Período e Tipo de Resultado Final em Pills únicas; Opções em 2–3 colunas); Card Aprovações (Aprovação Automática em Pill; Aritmética/Ponderada em Pills únicas com tooltips simples + exemplo); Card Arredondamento (Tipo em Pills únicas com tooltips + exemplo; intervalos/margem inalterados; Aplicar em Pills multi); Card Parecer (Registro Geral em Pill, tooltip mantido); Card Níveis (remove cores, remove fundo do grupo, lixeira realinhada/centralizada/maior com ConfirmDialog); Card Conceitos (mesmos ajustes + Utiliza Conceito Final em Pill)."

**Decisões do solicitante (2026-09-16)**: (1) rotas no padrão Comunicados/Escolas — `metodos/novo` + `metodos/[id]` empilhadas na aba; (2) Excluir também na página de edição (além da lista).

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — A tela tem um objetivo principal: configurar métodos de avaliação completos (identificação → numéricas → aprovações → arredondamento → parecer/conceito/nível) sem atrito.
- **PE-102** — Filtros em card padrão, tabela full-width com cabeçalho em destaque e Pills comunicam o estado sem exploração; página própria comporta o volume de informações que o modal comprimia.
- **PE-201** — Cadastro segue o fluxo mental: Identificação → Numéricas → Aprovações → Arredondamento → condicionais (Parecer/Conceitos/Níveis); salvar volta à lista (padrão Comunicados).
- **PE-205** — Validações objetivas via `toast.error` antes de qualquer escrita (Descrição obrigatória — já existente, mantida).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filtros e tabela da listagem (Priority: P1)

O gestor abre Métodos de Avaliação e vê o campo "Buscar por nome" com ~33% da largura; a tabela de métodos ocupa 100% da largura (cabeçalho sem margens laterais) com títulos em destaque (fundo + uppercase, padrão do sistema).

**Why this priority**: É a leitura principal; busca gigante e tabela com margens quebram o padrão das demais listagens. Entrega valor sozinha.

**Independent Test**: Abrir a lista, medir visualmente a busca (~1/3 da linha) e conferir que o fundo do cabeçalho encosta nas bordas do card.

**Acceptance Scenarios**:

1. **Given** o Card de Filtros, **When** renderiza, **Then** "Buscar por nome" tem ~33% da largura (`w-1/3 min-w-[220px]` ou `searchClassName` no `FilterBar`); demais filtros (Escola superadmin, Status) fluem ao lado.
2. **Given** o Card Métodos, **When** renderiza a tabela, **Then** não há wrapper com margem lateral (remove `px-4`); o fundo da linha de títulos ocupa 100% da largura do card.
3. **Given** os títulos das colunas, **When** visualiza, **Then** têm destaque `bg-muted text-[13px] uppercase tracking-wider` (padrão `card-quadro-aulas.tsx`), sem `text-xs` novo.

---

### User Story 2 - Novo/Editar em página própria (Priority: P1)

"Novo Método" e o lápis de edição abrem páginas próprias (`metodos/novo`, `metodos/[id]`) empilhadas na mesma aba — sem `Dialog`. A página de edição tem também o botão Excluir (com `ConfirmDialog`), além da exclusão já existente na lista.

**Why this priority**: O volume de informações do cadastro não cabe num modal. Entrega valor sozinha.

**Independent Test**: Criar e editar métodos só pelas páginas; voltar preserva filtros/scroll da lista (keep-alive); excluir pela edição e pela lista.

**Acceptance Scenarios**:

1. **Given** clique em "Novo Método", **When** navega, **Then** abre `metodos/novo` empilhada na aba `metodos` (registrada em `tab-routes.tsx`, estática antes da dinâmica) — sem `Dialog`.
2. **Given** clique no lápis, **When** navega, **Then** abre `metodos/[id]` (params via `useTabParams()`), com `PageHeader` + Voltar e loading/spinner padrão.
3. **Given** superadmin sem escola, **When** abre novo/editar, **Then** vale o padrão `?escola=` (EmptyState orientando a voltar à lista, como Comunicados).
4. **Given** permissão, **When** sem criar/editar/excluir, **Then** guards via `usePermissoes('gestao-academica.metodos')` com `EmptyState ShieldAlert` (criar/editar/excluir/visualizar conforme a ação).
5. **Given** a página de edição, **When** visualiza o header, **Then** há Excluir (`variant="destructive"`, `ConfirmDialog` padrão) + Voltar; confirmar exclui e volta à lista.
6. **Given** salvar, **When** executa, **Then** toast + `router.push('/gestao-academica/metodos')` (padrão Comunicados); Descrição vazia bloqueia com `toast.error` (regra atual mantida).

---

### User Story 3 - Identificação e tipos em Pills (Priority: P1)

O checkbox "Ativo" vira Pill clicável; os 4 tipos (Numérico, Parecer Descritivo, Conceito, Nível de Desenvolvimento) viram Pills multi-select, mantendo o seletor de períodos 1–4 por tipo ativo.

**Why this priority**: É a porta de entrada do cadastro; checkboxes soltos destoam do resto do sistema. Entrega valor sozinha.

**Independent Test**: Alternar Ativo e os 4 tipos; cards condicionais abrem/fecham como antes; períodos persistem por tipo.

**Acceptance Scenarios**:

1. **Given** o Card Identificação, **When** visualiza "Ativo", **Then** é 1 `ClickablePill` (ativa = Ativo; apagada = Inativo), sem `Checkbox`.
2. **Given** o subcard Método de Avaliação, **When** visualiza, **Then** são 4 `ClickablePill` multi-select (Numérico, Parecer Descritivo, Conceito, Nível de Desenvolvimento), sem `Checkbox`.
3. **Given** um tipo ativo, **When** visualiza, **Then** o seletor de períodos 1–4 permanece como está (fora do escopo).

---

### User Story 4 - Numéricas em Pills + Opções em colunas (Priority: P1)

Forma de Registro (reduzida, Pill única), Permite Recuperação (Pills multi), Tipo de Média do Período e Tipo de Resultado Final (Pills únicas); subcard de Opções mantém checkboxes mas em grade 2–3 colunas.

**Why this priority**: É o card mais denso do cadastro; selects empilhados + opções em coluna única alongam a página sem necessidade. Entrega valor sozinha.

**Independent Test**: Trocar cada opção e salvar; reabrir com valores persistidos; condicionais de recuperação (final/avaliacao/periodo) aparecem como antes.

**Acceptance Scenarios**:

1. **Given** Forma de Registro, **When** visualiza, **Then** são 2 `ClickablePill` seleção única (Inteiro/Decimal) em container de largura reduzida (`max-w-xs`), sem `Select`.
2. **Given** Permite Recuperação, **When** visualiza, **Then** são 3 `ClickablePill` multi-select (Por Avaliação/Por Período/Final), sem `Checkbox`; condicionais (`rec_final_reprovados`, `rec_substitutiva`, etc.) mantêm as mesmas regras de exibição.
3. **Given** Tipo de Média do Período, **When** visualiza, **Then** são 2 `ClickablePill` seleção única (Ponderada/Somatória), sem `Select`.
4. **Given** Tipo de Resultado Final, **When** visualiza, **Then** são 2 `ClickablePill` seleção única (Média dos Períodos/Somatória dos Períodos), sem `Select`.
5. **Given** o subcard Opções, **When** visualiza, **Then** mantém `Checkbox`/`CheckboxWithTooltip` mas em `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (não coluna única).

---

### User Story 5 - Aprovações com Pills explicadas (Priority: P1)

Aprovação Automática vira Pill; Aritmética × Ponderada viram 2 Pills únicas com tooltips em linguagem simples + exemplo (substituindo o texto técnico atual); pesos só quando Ponderada.

**Why this priority**: O texto atual ("Se desmarcado: média aritmética", fórmula crua) exige conhecimento técnico do gestor. Entrega valor sozinha.

**Independent Test**: Alternar Aritmética/Ponderada, ver tooltips, salvar cada modo e reabrir; pesos só visíveis na Ponderada.

**Acceptance Scenarios**:

1. **Given** Aprovação Direta, **When** visualiza, **Then** "Aprovação Automática" é 1 `ClickablePill` (sem `Checkbox`); o esmaecimento de Média Mínima/pesos quando ativa é mantido.
2. **Given** Aprovação por Recuperação, **When** visualiza, **Then** há 2 `ClickablePill` seleção única: "Média Aritmética" (`usa_media_ponderada_recuperacao=false`) e "Média Ponderada" (`=true`) — sem `Checkbox`, sem "(Se desmarcado…)".
3. **Given** cada Pill, **When** passa o mouse no `Info`, **Then** o tooltip exibe exatamente:
   - Aritmética: "A nota final é a média simples entre a Média das Avaliações (MA) e a nota da Recuperação (RF). Exemplo: se a MA foi 5,0 e a Recuperação foi 8,0, a nota final é (5,0 + 8,0) ÷ 2 = 6,5."
   - Ponderada: "A nota final dá pesos diferentes para a Média das Avaliações (MA) e a Recuperação (RF), em vez de uma média simples. Exemplo com os pesos recomendados (peso 2 para a MA e peso 1 para a Recuperação): se a MA foi 5,0 e a Recuperação foi 8,0, a nota final é (5,0 × 2 + 8,0 × 1) ÷ 3 = 6,0."
4. **Given** Ponderada ativa, **When** visualiza, **Then** os campos Peso Média Anual / Peso Recuperação Final aparecem (como hoje); com Aritmética ficam ocultos.

---

### User Story 6 - Arredondamento em Pills explicadas (Priority: P1)

Tipo de Arredondamento vira 3 Pills únicas com tooltips + exemplo; Intervalo Inicial/Final e Margem inalterados e condicionais como hoje; "Aplicar Arredondamento na" vira Pills multi.

**Why this priority**: Mesmo problema de linguagem técnica do US5, no outro card numérico. Entrega valor sozinha.

**Independent Test**: Trocar Nenhum/Meio Ponto/Decimal, ver tooltips e campos condicionais; marcar as 3 aplicações; salvar e reabrir.

**Acceptance Scenarios**:

1. **Given** Tipo de Arredondamento, **When** visualiza, **Then** são 3 `ClickablePill` seleção única (Nenhum/Meio Ponto/Decimal), sem `Select`.
2. **Given** cada opção, **When** passa o mouse no `Info`, **Then** o tooltip exibe exatamente:
   - Nenhum: "A nota final permanece exatamente como foi calculada, sem nenhum ajuste. Exemplo: 7,3 continua 7,3."
   - Meio Ponto: "A nota final é ajustada para o meio ponto mais próximo. Exemplo: 7,3 vira 7,5; 7,1 vira 7,0."
   - Decimal: "A nota final é ajustada para um número inteiro. Exemplo: 7,3 vira 7,0; 7,6 vira 8,0."
3. **Given** o tipo, **When** é Meio Ponto/Decimal/Nenhum, **Then** Intervalo Inicial/Final e Margem mantêm exibição, valores e persistência atuais (sem alteração).
4. **Given** "Aplicar Arredondamento na", **When** visualiza, **Then** são 3 `ClickablePill` multi-select (Média do Período/Média Anual/Média Final), sem `Checkbox`.

---

### User Story 7 - Parecer, Conceitos e Níveis modernizados (Priority: P1)

Registro de Parecer Geral vira Pill (tooltip mantido); Conceitos e Níveis perdem cores e fundo do grupo; lixeira realinhada/centralizada/maior com `ConfirmDialog`; Utiliza Conceito Final vira Pill.

**Why this priority**: Cores por conceito/nível são legado visual (fora da paleta Atlas), o fundo do grupo polui e a lixeira desalinhada/sem confirmação permite exclusão acidental. Entrega valor sozinha.

**Independent Test**: Adicionar/remover conceitos e níveis (com confirmação), salvar e reabrir; sem nenhum seletor de cor na tela.

**Acceptance Scenarios**:

1. **Given** o Card Parecer, **When** visualiza, **Then** "Registro de Parecer Geral" é 1 `ClickablePill`; tooltip/texto auxiliar atuais mantidos sem alteração.
2. **Given** Conceitos ou Níveis, **When** visualiza um item, **Then** há só Descrição + Sigla (+ lixeira); nenhum "Cor de Fundo"/"Cor da Letra", `ColorPreview` ou `COLORS_*` (save mantém defaults para as colunas do banco).
3. **Given** o grupo do item, **When** visualiza, **Then** sem fundo visual (`bg-muted` removido — só `border`); Descrição/Sigla inalterados.
4. **Given** a lixeira, **When** visualiza, **Then** está centralizada verticalmente com os campos (`items-center`, sem `mt-1`) em tamanho maior (ex. `h-11 w-11`); **When** clica, **Then** abre o `ConfirmDialog` padrão do sistema (não exclui direto).
5. **Given** "Utiliza Conceito Final", **When** visualiza, **Then** é 1 `ClickablePill` (sem `Checkbox`); a lista de Conceitos Finais aparece como hoje quando ativa.

### Edge Cases

- Superadmin sem escola (lista): mantém o `EmptyState` "Selecione uma Escola" atual.
- Superadmin sem `?escola=` (novo/editar): EmptyState orientando a voltar à lista (padrão Comunicados).
- Método sem nenhum tipo ativo: save como hoje (só principal; blocos condicionais ausentes) — sem validação nova.
- Excluir método em uso por matriz: erro do banco exibido via `toast.error` (comportamento atual de `deleteMetodo` mantido).
- Recuperação "final" desmarcada após pesos preenchidos: `permite_recuperacao_final` derivado como hoje (`includes('final')`); bloco de recuperação some como hoje.
- Conceitos/níveis legados com cor: valores do banco preservados (só a UI some); re-save usa defaults quando a lista é reescrita (comportamento atual do `saveMetodo` mantido).
- F5 na página de edição: vale o padrão das abas internas (workspace reinicia no Dashboard; `[id]` segue `useTabParams`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Busca MUST ter ~33% da largura (via `searchClassName` opcional no `FilterBar` ou `SearchInput` direto com `w-1/3 min-w-[220px]`); sem `text-xs` novo em labels de filtro.
- **FR-002**: Tabela MUST NOT ter wrapper com margem lateral (remove `px-4`); `TableHead` MUST ter `bg-muted text-[13px] uppercase tracking-wider` (padrão spec 014).
- **FR-003**: Novo/Editar MUST ser rotas `gestao-academica/metodos/novo` + `gestao-academica/metodos/[id]` registradas em `tab-routes.tsx` (estática antes da dinâmica, módulo `metodos`); `Dialog` de método removido da lista.
- **FR-004**: `[id]` MUST ler params via `useTabParams()`; novo/editar MUST suportar `?escola=` p/ superadmin (padrão Comunicados); guards via `usePermissoes` do recurso `gestao-academica.metodos`.
- **FR-005**: Edição MUST ter Excluir (`variant="destructive"` + `ConfirmDialog`) além da lista; save volta à lista (`router.push`), Descrição obrigatória mantida.
- **FR-006**: Ativo MUST ser 1 `ClickablePill`; 4 tipos MUST ser `ClickablePill` multi; períodos 1–4 inalterados.
- **FR-007**: Forma de Registro MUST ser 2 Pills únicas em container reduzido (`max-w-xs`); Recuperação 3 Pills multi (condicionais inalteradas); Média do Período e Resultado Final 2 Pills únicas cada; Opções em `grid sm:2 lg:3` (checkboxes mantidos).
- **FR-008**: Aprovação Automática MUST ser Pill (esmaecimento mantido); Aritmética/Ponderada MUST ser 2 Pills únicas mapeadas em `usa_media_ponderada_recuperacao` com os tooltips literais do US5; pesos só na Ponderada.
- **FR-009**: Arredondamento MUST ser 3 Pills únicas com os tooltips literais do US6; intervalos/margem e condicionais inalterados; Aplicar 3 Pills multi.
- **FR-010**: Registro Geral MUST ser Pill (tooltip/texto mantidos); Utiliza Conceito Final MUST ser Pill (lista de finais como hoje).
- **FR-011**: Conceitos/Níveis MUST NOT exibir cor (remove `COLORS_*`, `ColorPreview`, helpers de contraste, inputs `type="color"`); grupo sem `bg-muted`; lixeira `items-center`, maior, com `ConfirmDialog` por item.
- **FR-012**: 0 migrations; 0 novas deps npm; 0 hex hardcoded (remover `COLORS_*` reduz o legado); `tsc --noEmit` + `next build` verdes.

### Key Entities

- **Método (leitura/escrita)**: `academico_metodos_avaliacao` + tabelas satélite (`_numerico`, `_aprovacao`, `_arredondamento`, `_parecer`, `academico_metodos_conceitos`, `academico_metodos_niveis`) — sem DDL; colunas `cor_fundo/cor_letra` preservadas no banco (só saem da UI).
- **Rota empilhada**: `metodos/novo` + `metodos/[id]` sob o módulo `metodos` em `tab-routes.tsx` (decisão registrada).
- **Permissão**: `gestao-academica.metodos` (criar/editar/excluir/visualizar via `usePermissoes`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Busca ~33%; tabela full-width com cabeçalho em destaque; sem regressão de filtros/status/permissões.
- **SC-002**: Novo/editar só por páginas (sem `Dialog`); voltar preserva lista (keep-alive); excluir funciona na lista e na edição.
- **SC-003**: Todos os checkboxes/selects listados viram Pills (single vs multi corretos); Opções em grade; condicionais e persistência inalteradas.
- **SC-004**: Tooltips de Aritmética/Ponderada/Arredondamento com os textos literais; pesos/intervalos condicionais como hoje.
- **SC-005**: Zero seletor de cor; grupos sem fundo; lixeira centralizada/maior com confirmação; Conceito Final em Pill.
- **SC-006**: `tsc` + `build` verdes; 0 migrations; 0 deps; 0 hex novo.
