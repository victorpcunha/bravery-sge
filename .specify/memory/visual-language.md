# Visual Language

Version: 2.0.1

Status: Frozen

---

## 1. Objetivo

Este documento define a **linguagem visual** do Bravery SGE: as escolhas concretas de cor, tipografia, espaçamento, forma, elevação, movimento, superfícies e iconografia que dão à interface a sua aparência e personalidade.

Ele não define componentes ou regras executáveis — isso é responsabilidade do Design System. Seu papel é traduzir a personalidade e os princípios visuais definidos no Product Vision em decisões de linguagem visual que orientem a elaboração e a evolução do Design System.

Este documento é a fonte de verdade para o que o Bravery SGE *deve parecer*. O Design System é a fonte de verdade para *como* implementar essa aparência.

Em caso de conflito entre este documento e a Constitution, o Product Experience ou o Product Vision, prevalecem estes últimos. Em caso de conflito entre este documento e o Design System, prevalece o Design System (que deve incorporar a direção descrita aqui).

---

## 2. Relação com os demais documentos

| Documento | Responsabilidade |
|-----------|------------------|
| Constitution | Define os princípios arquiteturais e técnicos do projeto. |
| Product Experience | Define os critérios de decisão de experiência do usuário. |
| Product Vision | Define a personalidade, a percepção e a identidade do produto. |
| **Visual Language** | **Define a linguagem visual concreta que expressa a identidade.** |
| Design System | Define componentes, tokens, layouts e regras de implementação. |
| Specification | Define os requisitos funcionais da feature. |

A ordem de autoridade é:

```
Constitution > Product Experience > Design System > Product Vision > Visual Language > Specification
```

O Visual Language orienta, mas não substitui, o Design System. Toda direção descrita aqui deve ser incorporada ao Design System como tokens e componentes oficiais, em conformidade com o Princípio XI da Constitution (Design System First).

---

## 3. Princípios de linguagem

A linguagem visual do Bravery SGE se apoia em cinco princípios que dão à interface sua identidade. Estes princípios são a combinação da personalidade do produto (Product Vision seção 4) com as decisões visuais descritas a seguir.

### 3.1 Profissionalismo SaaS com clareza

*(transmite Confiança, Inteligência)*

A interface usa uma cor de marca vibrante e moderna (blue `#1F88EB` no brand primary, ver detalhes em §4). Essa base comunica profissionalismo, confiabilidade e acessibilidade — atributos necessários a um sistema educacional que precisa ser usado diariamente por gestores, professores e coordenadores. O blue é contrabalançado por uma **cor aditiva complementar** (cianês `#4FC3D7`) que aparece sem exagero: interações, indicadores de foco, estados ativos e elementos de destaque.

A resultante é uma interface que parece um SaaS moderno — limpa, profissional, rápida — sem ser fria/corporativa demais nem decorativa/colorida demais.

A regra é: o blue comanda a marca e as ações primárias; o cianês aditivo aparece apenas quando há interação, seleção ou destaque a comunicar.

### 3.2 Respiro contra densidade

*(transmite Leveza, Organização)*

A interface é densa, mas não comprimida. Cada elemento tem respiro suficiente para ser lido sem esforço, e cada seção tem respiro suficiente para ser reconhecida como unidade.

O Bravery SGE lida com turmas extensas, grades horárias, diários de classe e históricos longos. Alta densidade é inevitável — mas não significa bagunça. Densidade bem-resolvida **exige mais** hierarquia e mais respiro, não menos.

A regra é: entre dois elementos vizinhos, sempre existe ar suficiente para distingui-los. Comprimir para caber mais dados não é solução — é problema.

### 3.3 Profundidade com intenção

*(transmite Confiança, Inteligência)*

O Bravery SGE usa profundidade com objetivo: superfícies diferentes têm níveis de elevação distintos e previsíveis. Cards flutuam sobre o fundo; diálogos flutuam sobre os cards; popovers flutuam sobre tudo. A altura nunca é decorativa — ela comunica hierarquia visual e separação de contexto.

A regra é: a profundidade de um elemento deve poder ser explicada pela sua função na interface. Se não há função para a sombra, ela não deve existir.

### 3.4 Detalhe com confiência

*(transmite Confiança, Leveza)*

Os elementos são desenhados em pequena escala (radius, sombras, ícones, micro-detalhes), mas cada detalhe é escolhido com clareza de papel. Nada é decorativo. Pequenos detalhes existem para reforçar intenção: um radius ligeiramente mais suave acolhe; uma linha mais fina mantém a leveza; um ícone com traço consistente torna o sistema reconhecível.

A regra é: todo detalhe deve servir à clareza da interface. Detalhe que serve à estética sem servir à tarefa deve ser removido.

### 3.5 Movimento discreto

*(transmite Confiança, Eficiência)*

O movimento existe para orientar a percepção de continuidade e mudança de estado. Nunca para entreter. Animações são rápidas, preenchidas com curvas suaves e reversíveis. O usuário percebe o resultado da sua ação; não percebe o esforço visual do sistema.

A regra é: se tirasse a animação, a interface ainda teria que funcionar. A animação apenas torna a mudança mais compreensível.

---

## 4. Sistema de Cores

### 4.1 Papéis semânticos

O Bravery SGE opera com cinco famílias de cores, cada uma com papel semântico definido. A introdução de uma nova cor (família sextupla ou diferente) requer justificativa documentada e adesão ao Design System.

| Família | Papel semântico | Aplicações típicas |
|--------|------------------|--------------------|
| **Marca** (primary) — blue vibrante | Marca, ação primária, identidade. Botões, links, estados ativos. | Botão primário, link, logo do gradiente, indicador de foco (ring). |
| **Aditiva complementar** (accent) — cianês | Interação, seleção, foco, destaque. Corrente viva do sistema. | Foco de input (junto com ring), estado ativo, indicador de progresso. |
| **Apoio** (secondary) — deep blue | Apoio à interação, botão secundário, charts. | Botão secundário, chart secundário. |
| **Semântica de estado** (success, warning, destructive, info) | Comunicação de estado — sucesso, atenção, erro, informação. | Badges de status, mensagens de feedback, indicadores de validação. |
| **Superfície** (background, card, muted, border, foreground) | Fundos, textos e separações. Base neutra slate com leve tom azulado. | Fundo de página, fundo de card, separações, texto principal, texto secundário. |

**Regras de aplicação.**

- O blue `#1F88EB` é **a** cor de marca. Não deve ser substituída nem combinada com outra cor de marca.
- O cianês `#4FC3D7` é a cor aditiva complementar. Deve ser usada para foco de inputs, seleção e destaque interativo.
- O deep blue `#1A6FC2` é a cor de apoio — reservada para botão secundário e charts.
- As **cores semânticas** (success, warning, destructive, info) têm uso restrito ao seu significado. Nunca usar `destructive` como decoração; nunca usar `success` como destaque genérico.
- A paleta de **superfície** (slate) usa `#F6F8FA` como background — neutro, leve, com tom azulado sutil.
- A **sidebar** é branca (`#FAFBFC`) em light mode e slate-950 (`#0F172A`) em dark mode. Não usa a cor de marca como fundo.
- Em **dark mode**, o blue de marca permanece `#1F88EB` (não é invertido); a profundidade vem de bordas mais visíveis (`#334155`) e leve variação de tom entre `--background` (`#0F172A`) e `--card` (`#1E293B`).

### 4.2 Tokenização esperada

O Design System deve expor, no mínimo, os tokens abaixo. Os valores hex aqui são referência técnica para as próximas implementações; a designação final será feita no Design System:

**Light Mode.**

| Token | Valor de referência | Uso |
|-------|--------------------|----|
| `--primary` | `#1F88EB` | Marca, botão primário, logo, ring. |
| `--primary-foreground` | `#FFFFFF` | Texto sobre primary. |
| `--accent` | `#4FC3D7` | Foco de inputs, interação complementar. |
| `--accent-foreground` | `#0A2540` | Texto sobre accent. |
| `--secondary` | `#1A6FC2` | Botão secundário, charts. |
| `--secondary-foreground` | `#FFFFFF` | Texto sobre secondary. |
| `--background` | `#F6F8FA` | Fundo da página. |
| `--card` | `#FFFFFF` | Fundo de card/superfície. |
| `--foreground` | `#1E293B` | Texto principal (slate-800). |
| `--muted` | `#F1F5F9` | Fundo de seções/zonas (slate-100). |
| `--muted-foreground` | `#475569` | Texto secundário (slate-600). Contraste 7.5:1 sobre `--background` (passa WCAG AA). |
| `--border` | `#E2E8F0` | Bordas padrão (slate-200). |
| `--ring` | `#1F88EB` | Cor de foco (= primary). |
| `--destructive` | `#DC2626` | Erro/destruição. |
| `--success` | `#16A34A` | Sucesso. |
| `--warning` | `#D97706` | Atenção. |
| `--info` | `#1F88EB` | Informação (= primary). |
| `--sidebar` | `#FAFBFC` | Fundo da sidebar (quase branco). |
| `--sidebar-foreground` | `#1E293B` | Texto da sidebar. |
| `--sidebar-primary` | `#1F88EB` | Item ativo da sidebar. |
| `--sidebar-accent` | `#F1F5F9` | Hover da sidebar (muted). |

**Dark Mode.**

| Token | Valor de referência |
|-------|--------------------|
| `--primary` | `#1F88EB` (preservado) |
| `--accent` | `#4FC3D7` (preservado) |
| `--secondary` | `#4FC3D7` (cianês como apoio em dark) |
| `--background` | `#0F172A` (slate-950) |
| `--card` | `#1E293B` (slate-800) |
| `--border` | `#334155` (slate-700) |
| `--sidebar` | `#0F172A` (slate-950) |
| `--sidebar-primary` | `#1F88EB` (preservado) |

### 4.3 Disclosure cromático

- A variação **máxima** de tons aditivos em uma mesma tela deve ser mantida o mais baixa possível. Em uma interface típica, no máximo duas famílias aditivas devem coexistir com protagonismo (ex.: accent em foco + uma cor semântica em um badge).
- Gráficos devem usar as cores aditivas e/ou semânticas do sistema, nunca paletas importadas ou arbitrárias.
- **Proibido**: introduzir cores passando direto do aditivo para a paleta de superfície (ex.: usar `--accent` como fundo de seção vira bagunça semântica).

---

## 5. Sistema Tipográfico

### 5.1 Família tipográfica

A família tipográfica oficial do Bravery SGE é **Plus Jakarta Sans**. É uma sans-serif moderna com bom desempenho em corpos densos, leitura em telas e padrão reconhecível.

- Usada para **todos** os textos da interface: títulos, corpo, rótulos, botões, dados em tabela.
- Não existe tipografia secundária no Bravery SGE. Nenhuma família serifada ou monoespaçada deve ser adicionada sem justificativa documentada.
- Em código, código-fonte ou formatação de dados tabulares, uma monoespaçada do sistema (`font-mono`) pode ser usada, mas jamais como texto principal da interface.

### 5.2 Pesos

O Bravery SGE usa **apenas** quatro pesos da Plus Jakarta Sans:

| Peso | Uso |
|------|----|
| 400 | Texto corrido, parágrafos, descrições. |
| 500 | Rótulos, botões, legendas, dados em tabelas, tabs. |
| 600 | Subtítulos de seção, título de card, nomes em listas. |
| 700 | Título de página, indicador principal (número de KPI). |

- Não usar pesos intermediários (300, 450, 550).
- Não usar itálico da Plus Jakarta Sans. Itálico é para citação ou termo estrangeiro, situações raras e tratadas caso a caso.
- Não usar all-caps como estilo de rótulo (quebra a legibilidade da família).

### 5.3 Escala tipográfica

A escala tipográfica deve ser expressiva o suficiente para criar hierarquia imediata, sem exageros. A referência técnica para a escala (a designação final fica no Design System):

| Tokens sugeridos | Tamanho (px) | Peso | Uso |
|------------------|--------------|------|-----|
| `text-display` | 36 | 700 | Título do dashboard, KPI principal. |
| `text-title` | 28 | 700 | Título de página. |
| `text-heading` | 20 | 600 | Subtítulo de seção, título de card. |
| `text-subheading` | 16 | 600 | Nome em lista, headline de card. |
| `text-body` | 15 | 400 | Texto corrido. |
| `text-body-strong` | 15 | 500 | Parágrafo de conclusão, texto em destaque. |
| `text-label` | 14 | 500 | Rótulos, botões, dados em tabela. |
| `text-small` | 13 | 400 | Texto secundário, timestamp, legendas. |
| `text-caption` | 12 | 400 | Anotação de menor preço, assinatura. |

**Regras de aplicação.**

- O tamanho de corpo padrão é **15px** — não 14px. Esse incremento resolve a sensação de "texto apertado" em telas administrativas.
- A diferença entre deux níveis consecutivos deve ser **perceptível** (≥2px) — escalas com incrementos de 1px não produzem hierarquia visual.
- Títulos não usam `text-transform`. Mantêm capitalização natural da frase.
- A hierarquia deve ser comunicada **simultaneamente** por tamanho, peso e respiro — não por um apenas.
- O `line-height` para corpo é **1.5**; para títulos, **1.2-1.3**; para botões/rótulos curtos, **1**.

### 5.4 Famílias tipográficas proibidas

- Fontes serifadas como título ou corpo — quebra a clareza institucional.
- `system-ui`, `Helvetica` ou `Arial` como família principal — perde identidade.
- Fontes decorativas de qualquer tipo.
- Mais de uma família na mesma interface, salvo monoespaçada pontual para dados tabulares.

---

## 6. Sistema de Espaçamento

### 6.1 Fundamento

O espaçamento é o principal responsável pela percepção de **respiro** — apenas ele diferencia a sensação "formulário administrativo comprimido" de "interface profissional e organizada". O Bravery SGE opera com uma escala baseada em **4px**, mas deve favorecer respiro mais generoso, sem que a interface pareça espalhada.

### 6.2 Escala.SizeMode

A escala de espaçamento deve cobrir do microespaço (intra-componente) ao macroespaço (intra-seção). Referência técnica:

| Token sugerido | Valor | Uso |
|-----------------|-------|----|
| `space-1` | 4px | Gap mínimo entre ícone e texto. |
| `space-2` | 8px | Gap entre elementos de um botão, dentro de um badge, entre um label e seu input. |
| `space-3` | 12px | Padding interno de campo de input. |
| `space-4` | 16px | Padding interno padrão de card, gap entre itens em um form. |
| `space-5` | 20px | Padding interno de card destacado, gap entre colunas. |
| `space-6` | 24px | Padding de seção, gap entre sections de um form. |
| `space-8` | 32px | Gap entre PageHeader e conteúdo. |
| `space-10` | 40px | Gap entre seções principais de uma página. |
| `space-12` | 48px | Gap entre blocos discursivamente distintos (ex.: header e body de dashboard). |
| `space-16` | 64px | Padding vertical de página "vazia" ou heróica. |

### 6.3 Regras de aplicação

- A **escala completa** deve ser usada. Espaços ad-hoc (7px, 11px, 22px) são proibidos.
- Componentes vizinhos do mesmo nível devem ter o **mesmo** espaço interno; a diferença entre níveis deve ser de **no mínimo** 4px.
- O respiro vertical entre seções principais deve ser sempre **maior** que o respiro vertical interno de uma seção.
- Forms nunca devem ser comprimidos para "caber mais campos visíveis". Campos têm o mesmo respiro, independentemente do total; a página cresce para baixo.
- Tabelas podem usar `space-3` ou `space-4` entre colunas, mas o respiro horizontal entre colunas distintas (ex.: coluna de nome e coluna de ação) deve ser **maior** que o respiro intra-célula, para ressaltar separação.
- Em containers com altura elevada, o respiro interno nunca é inferior a `space-4`.

### 6.4 Proibições

- Uso de `space-0` como gap entre componentes distintos (destrói hierarquia).
- Uso de `space-1` em gap entre seções (produz "formulário administrativo").
- Variação ad-hoc de espaços fora da escala.

---

## 7. Sistema de Forma

### 7.1 Radius

A escala de border-radius segue um **tom médio**: nem quadrado (séria demais, fria), nem round (casual demais, brincalhona). O Bravery SGE usa radius entre 6px e 24px, com unidade forte.

| Token sugerido | Valor | Uso |
|-----------------|-------|----|
| `radius-sm` | 6px | Inputs, badges, chips, tags. |
| `radius-md` | 8px | Botões, itens de menu, tabs. |
| `radius-lg` | 12px | Cards, modais, popovers, dropdowns. |
| `radius-xl` | 16px | Cards hero, seções de destaque. |
| `radius-2xl` | 24px | Apenas em containers decorativos (avatar, banner de destaque, hero image). |
| `radius-full` | 9999px | Pills, avatares, overlay circular. |

**Regras.**

- O `radius` atual base (12px) deve ser **preservado** como `radius-lg`. Não deve ser usado como valor padrão para todos os elementos.
- Inputs e badges usam `radius-sm` (mais definido). Botões usam `radius-md` (amigáveis). Cards usam `radius-lg` (acolhimento).
- O `radius-full` é um formato, não um estilo — usado apenas em componentes onde o formato circular é intrínseco (avatar, pill).
- Não usar `radius-0` em componentes interativos. A frieza institucional vem do navy, não do quadrado.

### 7.2 Bordas

- A borda padrão usa `border-border` (`#D0D7DE`) com `1px`.
- Bordas de 2px ou mais são reservadas para estados de foco — não para hierarquia entre cards.
- Em modo escuro, as bordas usam `--border` (`#30363D`) — mais visíveis que o atual.
- Separadores internos a card usam `border-border` em sua forma mais clara (evitar linhas grossas dentro de cards).

### 7.3 Proibições de forma

- Bordas duplas (ex.: card com border + inner card com border).
- Sombras como substituto de borda — borda e sombra têm papéis distintos.
- Cantos quadrados (`radius-0`) em elementos interativos.

---

## 8. Sistema de Elevação

### 8.1 Níveis

O Bravery SGE usa **cinco níveis** de elevação. Cada nível comunica uma posição na hierarquia de superfícies; a passagem de um nível para outro deve ser visualmente perceptível mas nunca teatral.

| Nível | Token sugerido | Propriedades | Uso |
|-------|----------------|--------------|-----|
| 0 — Flat | `shadow-none` | sem sombra | Fundo de página, fundos de seção, superfícies nível 0. |
| 1 — Resting | `shadow-sm` | sombra muito sutil, ~0.04 de opacidade | Card em repouso, button em estado default. Distingue superfície de fundo. |
| 2 — Floating | `shadow-md` | sombra suave, ~0.08 de opacidade | Card em hover, dropdown, popover, tooltip. Comunica que está acima do conteúdo. |
| 3 — Overlay | `shadow-lg` | sombra marcante, ~0.12 de opacidade | Dialog, sheet, modal. Modo de foco exclusivo. |
| 4 — High | `shadow-xl` | sombra pronunciada, ~0.16 de opacidade | Command palette, dialog mais acima de outro. Estágios raros. |

### 8.2 Regras de aplicação

- A elevação deve **sempre** poder ser explicada pela função do elemento: resting card, hovered, popover, dialog, high overlay.
- Não usar `shadow-lg` em cards em repouso — isso transforma a interface em "montanha de cards flutuantes", sensação de baixa qualidade.
- Em **dark mode**, sombras não funcionam bem: a percepção de profundidade deve usar **bordas** `--border`-mais-vísíveis + leve variação de tom (`card` mais escuro que `background`). Manter a tokenização de sombra, mas a percepção de elevação em dark vem primariamente da **tonalidade**, não da sombra.
- Cards em página devem usar **no máximo** `shadow-sm` por padrão; `shadow-md` apenas em hover se a interação justificar.
- O sidebar não usa sombra interna; sua separação vem da cor de fundo distinta e de uma borda tênue (1px) no lado de oposição ao conteúdo.

### 8.3 Proibições

- Variações de `box-shadow` com cores ad-hoc, exceto `--ring` em estados de foco.
- Sombras coloridas (ex.: `shadow-lg shadow-blue-500/20`) — sombra é interpretativa de profundidade, não decoração.
- Subir toda a interface a `shadow-md` para "ganhar presença" — isso nivela a hierarquia e destrói interpretabilidade.

---

## 9. Sistema de Movimento

### 9.1 Tempo e esperas

O Bravery SGE opera com **três durações padrão**:

| Token sugerido | Duração | Uso |
|----------------|---------|----|
| `transition-fast` | 150ms | Estados de interação — hover, foco, toggle, mudança de ícone. |
| `transition` | 200ms | Mudanças de contexto — transição de página suave, abertura de popover, abertura de seção. |
| `transition-slow` | 300ms | Movimentos maiores — abertura de dialog, expansão de drawer, transição entre tabs de uma dashboard. |

Durações fora dessa escala (400ms, 500ms, 1s) só devem aparecer em operações de longa duração com indicador de progresso explícito.

### 9.2 Easing

A curva padrão do Bravery SGE é **`cubic-bezier(0.4, 0, 0.2, 1)`** — suave, sem saltos. Em saídas de elementos (ex.: fechamento de diálogo), pode usar `cubic-bezier(0, 0, 0.2, 1)` para inverter intenção.

Não usar:
- `ease-in-out` puro (genérica e sem personalidade).
- `linear` para movimento visível (mecânico, incômodo).
- Curvas com `overshoot` (ex.: `cubic-bezier(0.34, 1.56, 0.64, 1)`) — produzem "efeito de mola" incompatible com calma institucional.

### 9.3 Regras de aplicação

- **Toda** animação deve poder ser removida sem quebrar a interface. Ela apenas torna a mudança de estado mais compreensível.
- Movimento **decorativo em loop** (ex.: `animate-pulse-soft` no estado atual) é permitido apenas em estados de carregamento e com baixa frequência (uma só instância por tela).
- **Movimento de entrada** (entrar de aba, fade-in de página) é permitido once, com duração ≤ 300ms. Não repetir em cada interação do usuário na mesma tela.
- Animações devem respeitar `prefers-reduced-motion`. O Design System deve expor variantes que sobem essa preferência.
- Não animar:
  - mudança de cor de fundo de página,
  - mudança de texto,
  - mudança de número exibido em KPI (a menos que seja uma operação explícita de contagem).

### 9.4 Proibições

- Animações automáticas em loop que não comunicam estado (ex.: banners pulsando texto).
- Animação de entrada em todos os ítens de uma lista com efeito cascata — cria sensação de "apresentação", não de ferramenta de trabalho.
- Movimento de "salto" (`overshoot`) — quebra a calma institucional.
- Animação duração > 300ms para qualquer coisa que não seja uma operação de longa duração sinalizada.

---

## 10. Sistema de Iconografia

### 10.1 Família

O Bravery SGE adota **Lucide** como biblioteca base de ícones. É um conjunto open-source coerente, leve, com traço consistente e bom volume de símbolos utilizáveis no domínio escolar.

- **Apenas** ícones Lucide são permitidos como ícones oficiais do sistema.
- Ícones de outras bibliotecas (Heroicons, Phosphor, Feather, Material Icons) só devem ser introduzidos mediante justificativa documentada no Design System.
- Ícones SVG personalizados devem seguir as mesmas regras de traço e tamanho de Lucide; não podem ser desenhados em estilo diferente.

### 10.2 Traço e tamanho

- **Stroke width**: 1.5px (tam. 16-24px) ou 2px (tam. 32px). Nunca variar sem motivo.
- **Tamanho padrão**: 20px dentro de botões e controles; 16px como ícone inline em texto; 24px como ícone de destaque em EmptyState. 32px apenas em estados hero.
- Não usar ícones preenchidos (`fill`). O Bravery SGE usa apenas line icons.
- Não aplicar gradientes a ícones. Cores planas, com tokens semânticos.

### 10.3 Regras de aplicação

- Todo ícone deve ser **acompanhado por rótulo textual** em menus, tabs e ações — exceto em situações de reconhecimento alto (ex.: botão X em dialog, Kebab menu, chevron de ordenação).
- Ícones **não substituem** rótulos em ações destrutivas ou em ações críticas.
- Ícones redundantes são proibidos — um mesmo significado não pode ter dois ícones diferentes em partes distintas do sistema.
- Em dark mode, ícones herdam `currentColor` e seguem tokens de `text-foreground` ou `text-muted-foreground`.

### 10.4 Proibições

- Ícones coloridos com paleta fora dos tokens semânticos (ex.: ícone "decorativo" em roxo ou pink).
- Ícones de Emoji como substituto de ícone da interface (pode haver exceção pontual em mensagens de feedback, com autorização).
- Misturar ícones de bibliotecas diferentes na mesma tela.

---

## 11. Sistema de Superfícies e Camadas

### 11.1 Níveis de superfície

O Bravery SGE organiza visualmente a interface em **níveis de superfície**. Esta organização é tão importante quanto a elevação: ela evita a saturação visual de "tudo parece white cards" e dá identidade às seções.

| Nível | Função | Cor de referência | Token |
|------|------|-------------------|-------|
| 0 — Page | Fundo da página inteira. | `#F1F3F8` (cinza azulado suave) | `bg-background` |
| 1 — Section | Seção grande dentro da página. Pode usar tom levemente mais claro para "selar" uma zona. | `#FFFFFF` ou `#F5F7FC` | `bg-card` ou `bg-muted` |
| 2 — Card | Card individual, container de conteúdo delimitado. | `#FFFFFF` | `bg-card` |
| 3 — Nested | Conteúdo dentro de card que precisa ser reconhecido como sub-unidade (ex.: subseção de FormCard). | `#F8FAFD` (leicht mais claro que card) | `bg-muted` |
| 4 — Input/Control | Campo de input, elemento interativo isolado. | `#FFFFFF` | `bg-input` |

### 11.2 Regras de aplicação

- A passagem de um nível para outro deve ser **perceptível** — sem nenhum elemento entre eles, a diferença existe.
- Em formulários, `FormCard` recebe `bg-card`; subseções dentro dele (ex.: fieldsets, agrupamentos de campos) podem usar `bg-muted` para divisão visual sem recorrer a bordas.
- A página nunca usa `bg-card` como fundo geral; isso elimina a hierarquia de superfícies.
- O sidebar é uma superfície `Nível 0` em mobile e uma superfície lateral em desktop — usa `bg-sidebar` próprio (não `bg-card`).

### 11.3 Vidro e translucidez

- `Glassmorphism` (`glass`, `glass-dark`) é **proibido** em superfícies principais — apenas permitido em casos raros (ex.: barra superior flutuante em mobile, banner de status), com justificativa explícita.
- Em dark mode, o uso de `glass-dark` deve ser excepcional e nunca como fundo de card principal — atrapalha a legibilidade.

---

## 12. Sistema de Densidade

### 12.1 Filosofia de densidade

O Bravery SGE não oferece **modo denso** (compact) e **modo confortável** (comfortable) como opção. Existe **apenas uma densidade**: confortável.

A justificativa: o sistema é multiperfil (gestores, professores, coordenadores, admins), usado em telas pequenas e grandes. Variantes de densidade multiplicam custo de teste e manutenção sem ganho proporcional. Em vez de variar densidade, a interface organiza densidade por **contexto**: tabelas podem ser mais comprimidas que formulários, sem que exista um "toggle global".

### 12.2 Densidade padrão por elemento

| Elemento | Altura | Padding horizontal | Observação |
|---------|--------|--------------------|------------|
| Input | 40px | 12px | É legível em toque (área ≥ 40px). |
| Select | 40px | 12px | Mesma altura do input. |
| Button | 40px (default) | 16px | 32px em `sm`, 44px em `lg`. |
| Linha de tabela | 44px | 12-16px | Inclui respiro vertical suficiente para diferença entre linhas. |
| Card padding | 24px | n/a | Respiro interno do card. |
| Avatar | 32-40px | n/a | Nunca inferior a 32px. |
| Badge | 24px altura | 8px horizontal | Sem texto longo intern. |

### 12.3 Sistema de sorteio de densidade

- Formulários são **sempre** confortáveis. Campos devem ter o respiro padrão de input (40px de altura). Não comprimir.
- Tabelas podem ser mais densas (linha de 36px) **apenas** em situações de alta densidade justificada (ex.: nota.quick entry em diário de classe). Em listagens de CRUD, manter 44px.
- Listas verticais (ex.: alunos em uma turma) usam 44px de linha — nunca inferior.
- Dashboards não têm "densidade"; usam grid responsiva com respiro `space-4` ou `space-6` entre cartões.

### 12.4 Proibições

- Variantes globais de densidade (`compact mode`, `comfortable mode`).
- Inputs com altura inferior a 36px — quebra toque em mobile.
- Tabelas com linhas inferiores a 32px — quebra legibilidade de dados.
- `scale-90` ou `scale-95` como "compactar" elementos — isso é zoom, não densidade.

---

## 13. Critério de aplicação

### 13.1 Quando aplicar a Visual Language

A Visual Language deve ser consultada:

- na **elaboração de qualquer componente novo** do Design System;
- na **revisão de componente existente** que ganha nova variante, estado ou uso;
- na **decisão sobre um token novo** (cor, espaço, typo, shadow);
- na **avaliação de uma proposta de layout** para uma funcionalidade nova;
- no **redesign de um módulo** ou de uma tela;
- na **revisão de consistência visual** periódica.

### 13.2 Ordem de consulta

Antes de tomar uma decisão visual, consultar os documentos na seguinte ordem:

1. **Product Vision** — verificar a personalidade e os princípios visuais (seções 5-8).
2. **Visual Language (este documento)** — verificar cores, tipografia, espaçamento, forma, elevação, movimento, iconografia, superfícies e densidade.
3. **Design System** — verificar quais tokens, componentes e layouts já implementam a direção.
4. **Specification** — verificar requisitos funcionais que possam restringir a decisão.

Se a Visual Language e o Design System divergirem, prevalece o Design System. Se isso causar inconsistência com a Visual Language, a divergência deve ser registrada como dívida técnica para revisão futura.

### 13.3 Quando a Visual Language e o Design System entram em conflito

Há três caminhos possíveis para resolver divergências:

1. **O Design System está correto e a Visual Language precisa evoluir.** A experiência de implementação revelou que a direção visual precisa ser ajustada. Nesse caso, abre-se uma proposta de alteração da Visual Language (seção 14).
2. **A Visual Language está correta e o Design System deve evoluir.** Um token ou componente do Design System não reflete a direção atual. Nesse caso, abre-se uma tarefa de atualização do Design System para refletir a Visual Language.
3. **Ambos estão corretos, mas para contextos diferentes.** A divergência é legitimate e deve ser documentada como exceção, para que implementadores saibam quando usar um ou outro.

Em qualquer caso, divergências não resolvidas não devem ser levadas para produção: elas devem ser registradas, decididas e propagadas.

### 13.4 Quando uma decisão visual não existe nos documentos

Quando uma decisão visual não estiver coberta por este documento nem pelo Design System, ela deve ser:

- referida à **personalidade do produto** (Product Vision seção 4) e a estes **princípios de linguagem** (seção 3);
- registrada na **Specification** da funcionalidade, com justificativa explícita;
- **marcada como pendente de incorporação** ao Design System ou a este documento, conforme sua natureza.

Decisões não cobertas são **temporárias**. O registro garante que elas sejam revisadas e, se necessário, promovidas a regra.

---

## 14. Evolução

### 14.1 O que pertence a este documento

Pertence à Visual Language tudo o que define a aparência concreta e a **direção visual** do produto:

- papéis semânticos das cores;
- diretrizes de paleta;
- família tipográfica e escala;
- escala de espaçamento;
- radius, bordas e elevação;
- movimento e transitions;
- iconografia;
- superfícies e camadas;
- densidade.

Não pertence a este documento:

- tokens individuais em código (`globals.css`) — Design System;
- implementação de componentes — Design System;
- contratos de props — Design System;
- requisitos funcionais — Specification;
- decisões de implementação pontuais — Specification da feature.

Quando uma direção deste documento se tornar suficientemente executável — com verificação objetiva e auditoria — ela deve ser **promovida** ao Design System. A Visual Language orienta; o Design System executa.

### 14.2 Quando atualizar

A Visual Language deve ser atualizada quando:

- uma nova família de cores, peso tipográfico ou token de espaçamento for estabelecida como direção permanente;
- a escala tipográfica, de radius, de elevação ou de movimento for revisada;
- a iconografia ou o sistema de superfícies for alterada;
- uma inconsistência for identificada entre a direção e o produto implementado;
- uma direção existente for substituída ou removida.

Não deve ser atualizada para:

- registrar decisões de componente específico — Design System;
- introduzir variações locais que não se aplicam a todo o produto;
- corrigir valores hexadecimais específicos — Design System (este documento dá referência, não autoridade final sobre o hex).

### 14.3 Versionamento

Este documento segue o versionamento semântico definido pela Constitution:

- **MAJOR** — mudanças incompatíveis com a versão anterior. Substituição de família tipográfica, mudança de paleta principal, redirecionamento da linguagem visual. Revisões MAJOR exigem verificação de impacto em todo o Design System.
- **MINOR** — novos tokens de cores, novos pesos, novas escalas, desde que compatíveis com a direção existente. Não invalidam decisões anteriores.
- **PATCH** — esclarecimentos, correções de redação, ajustes de valores de referência. Não alteram o significado de nenhuma direção.

### 14.4 Processo de alteração

toda mudança neste documento deve:

1. ser proposta com justificativa explícita;
2. ser avaliada à luz da personalidade do produto e dos princípios desta linguagem;
3. ser registrada no changelog;
4. ter a versão e o status atualizados no cabeçalho;
5. ser verificada quanto ao impacto sobre o Design System.

---

## Changelog

### [2.0.1] — 2026-07-16

#### Alterado — Acessibilidade: contraste AA em texto secundário

- **Muted-foreground**: `#64748B` (slate-500) → `#475569` (slate-600). Contraste sobre `--background` (`#F6F8FA`):
  - **Antes**: 4.04:1 — **falhava** WCAG AA (4.5:1) para texto normal < 18px bold
  - **Depois**: 7.55:1 — **passa** AA Large e Normal
- Decisão alinhada com o princípio **§10.2** ("A diferença entre dois níveis consecutivos deve ser perceptível") e com a meta de **PE-901** (contraste WCAG AA em todo texto).
- Aplicado em `src/app/globals.css` (light mode). Dark mode preservado em `#94A3B8` (já passava 7.9:1).
- Justificativa: a escala 9 níveis da tipografia (especificamente corpo 15px) é classificada como "texto normal" pelo WCAG, exigindo 4.5:1 mínimo. Slate-500 falhava marginalmente.
- Trade-off aceito: leve redução da "suavidade" do texto secundário (slate-500 → slate-600), ganha-se leitura confiável em todos os tamanhos.
- Não quebra nenhuma regra da Constituição; é correção dentro do Princípio XI (Design System First).

### [2.0.0] — 2026-07-11

#### Alterado — Repalette para SaaS moderno blue

- **Cor de marca**: `#0F2B46` (navy) → `#1F88EB` (blue vibrante). O Bravery SGE deixa de ser "institucional navy" e passa a ser "SaaS moderno blue".
- **Secondary**: `#2E8BA3` (teal) → `#1A6FC2` (deep blue). Alinhada com a nova família blue.
- **Background**: `#F1F3F8` → `#F6F8FA` (slate-50, neutro com tom azulado sutil).
- **Foreground**: `#0D1117` → `#1E293B` (slate-800, mais suave).
- **Muted**: `#E8ECF1` → `#F1F5F9` (slate-100).
- **Muted-foreground**: `#57606A` → `#64748B` (slate-500).
- **Border**: `#D0D7DE` → `#E2E8F0` (slate-200).
- **Ring**: `#4FC3D7` (accent) → `#1F88EB` (primary). Foco agora usa a cor de marca.
- **Accent**: `#4FC3D7` preservado como complementar (foco de inputs).
- **Sidebar**: navy profundo → branco `#FAFBFC` (light mode) / slate-950 `#0F172A` (dark mode).
- **Dark mode**: background `#0D1117` → `#0F172A` (slate-950), card `#161B22` → `#1E293B` (slate-800), border `#30363D` → `#334155` (slate-700).
- **Dark mode primary**: `#E8F0FE` (invertido) → `#1F88EB` (preservado do light mode).
- **Semânticas** ajustadas: destructive `#CF222E` → `#DC2626`, success `#1A7F37` → `#16A34A`, warning `#9A6700` → `#D97706`.
- Princípio §3.1 renomeado: "Calma institucional com presença" → "Profissionalismo SaaS com clareza".

### [1.0.0] — 2026-07-10

#### Adicionado

- Documento criado com 12 seções: Objetivo, Relação com demais documentos, Princípios de linguagem, Sistema de Cores, Sistema Tipográfico, Sistema de Espaçamento, Sistema de Forma, Sistema de Elevação, Sistema de Movimento, Sistema de Iconografia, Sistema de Superfícies e Camadas, Sistema de Densidade.
- Seção 13 — Critério de aplicação com ordem de consulta, tratamento de divergências e decisão sem cobertura.
- Seção 14 — Evolução, versionamento e processo de alteração.
- Changelog inicial.

#### Decisões de direção tomadas

- **Cor accent promovida a `#4FC3D7`** (cianês luminosa) como token aditivo principal para foco e interação. `#2E8BA3` (teal) preservada como secondary.
- **Background `#F4F6F9` → `#F1F3F8`** — leve aquecimento da base neutra.
- **Plus Jakarta Sans** confirmada como única família tipográfica.
- **Tamanho de corpo padrão: 15px** (era 14px) — incremento para reduzir sensação de texto apertado.
- **Escala tipográfica**: 9 níveis entre `text-caption` (12px) e `text-display` (36px).
- **Escala de espaçamento**: 12 níveis entre `space-1` (4px) e `space-16` (64px).
- **Radius base preservado em 12px** como `radius-lg` para cards; `radius-sm` (6px) para inputs; `radius-md` (8px) para buttons.
- **Sombras**: 5 níveis, com `shadow-sm` como padrão para cards em repouso.
- **Motion**: 3 durações (150ms, 200ms, 300ms), curva padrão `cubic-bezier(0.4, 0, 0.2, 1)`, sem overshoot.
- **Iconografia**: Lucide como única biblioteca oficial, stroke 1.5-2px, line icons apenas.
- **Superfícies**: 5 níveis (Page, Section, Card, Nested, Input).
- **Densidade**: uma só, confortável; proibidas variantes globais compact/comfortable.
- **Glassmorphism**: proibido em superfícies principais, excepcional apenas em banners/overlays pontuais.