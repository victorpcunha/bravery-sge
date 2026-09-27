# Feature Specification: Visibilidade dos Módulos do Portal do Responsável

**Feature Branch**: `040-configurar-visibilidade-portal`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "Precisamos definir a seguinte situação. Hoje, ao acessar o portal, o responsável tem acesso a todas as funcionalidades do portal. Porém, a escola não quer que o responsável visualize informações do Boletim, por exemplo, pois dessa forma, o responsável não comparecerá nas Escola para as reuniões, visto que ele já tem as notas do aluno. Nessa situação, precisamos definir algo que seja possível a escola decidir o que estará disponível no Portal do Responsável, para os responsáveis visualizar. Atualmente temos a situação de Perfis e Permissões, mas acredito que não seja necessário criar um perfil só para responsáveis (me corrija se eu estiver errado), até pq a criação de acesso para responsáveis não solicita perfil, no momento. Pensei em criar uma nova tela uma nova configuração, na tela de Unidade Escolar. No registro da Unidade, já temos um card de 'Portal do Responsável', na aba 'Identificação'. Neste mesmo card, podemos adicionar algo para que seja possível marcar ou desmarcar (as funcionalidades) o que serão apresentadas no portal. Isso afetará todos os responsáveis."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — O card de configuração tem um único objetivo: definir quais módulos do portal os responsáveis daquela escola podem ver.
- **PE-102** — O propósito é comunicado pelo próprio card "Portal do Responsável" (título + descrição contextual), sem exigir exploração da tela.
- **PE-204** — Os interruptores de visibilidade ficam agrupados no card "Portal do Responsável" existente, junto ao habilitar/slug, em vez de criar tela ou card separado.
- **PE-402** — O responsável que tentar acessar um módulo oculto (ex. link antigo) recebe mensagem orientadora, não erro técnico.
- **PE-403** — Salvar a configuração fornece confirmação imediata de sucesso.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escola oculta o Boletim do portal (Priority: P1)

A direção da escola decide que as notas só serão apresentadas em reunião presencial. A secretária abre o cadastro da Unidade Escolar, aba Identificação, card "Portal do Responsável", desmarca o módulo Boletim e salva. A partir daí, nenhum responsável daquela escola vê o Boletim no menu do portal, nos botões de acesso rápido do Início, nem consegue abrir a tela por link direto.

**Why this priority**: É o caso motivador da feature — sem ele, a escola não tem como impedir que o responsável veja as notas em casa e deixe de comparecer às reuniões.

**Independent Test**: Desmarcar apenas o Boletim de uma escola, salvar e confirmar que (a) o item some do menu do portal, (b) o botão some do acesso rápido, (c) o acesso direto ao endereço do boletim exibe orientação em vez das notas, (d) os demais módulos continuam normais.

**Acceptance Scenarios**:

1. **Given** escola com portal habilitado e todos os módulos visíveis, **When** o gestor desmarca "Boletim" e salva, **Then** responsáveis daquela escola não veem mais o item Boletim no menu nem no acesso rápido do Início.
2. **Given** Boletim oculto para a escola, **When** o responsável abre o endereço direto do boletim (link antigo/favorito), **Then** o sistema exibe mensagem orientadora em vez das notas, sem expor nenhum dado de avaliação.
3. **Given** Boletim oculto para a escola A, **When** um responsável da escola B (Boletim visível) acessa o portal, **Then** o Boletim aparece normalmente para ele (isolamento por escola).

---

### User Story 2 - Escola reexibe um módulo oculto (Priority: P2)

Após o período de reuniões, a escola quer liberar novamente o Boletim. O gestor remarca o módulo no mesmo card, salva, e os responsáveis voltam a ver tudo sem precisar de nova senha, novo vínculo ou qualquer ação do responsável.

**Why this priority**: Garante que a configuração seja reversível e operacional no dia a dia, sem dependência de suporte técnico.

**Independent Test**: Remarcar um módulo previamente oculto, salvar e confirmar que ele reaparece no menu e volta a carregar os dados normalmente.

**Acceptance Scenarios**:

1. **Given** Boletim oculto, **When** o gestor remarca "Boletim" e salva, **Then** os responsáveis voltam a ver o item no menu e os dados carregam normalmente.
2. **Given** alteração de visibilidade salva, **When** a operação conclui, **Then** o gestor recebe confirmação imediata de sucesso.

---

### User Story 3 - Início do portal reflete os módulos visíveis (Priority: P2)

Com um ou mais módulos ocultos, a tela Início não exibe atalhos quebrados: botões de acesso rápido e botões "Ver Todos" aparecem somente para módulos visíveis, e blocos do Início vinculados a módulos ocultos (ex. "Comunicados Recentes", "Média do Bimestre por Disciplina") não são apresentados.

**Why this priority**: Evita becos sem saída — atalho que leva a uma tela bloqueada quebra a confiança do responsável no portal.

**Independent Test**: Ocultar Comunicados e Boletim e confirmar que o Início não exibe nenhum caminho (botão, card ou "Ver Todos") para esses módulos.

**Acceptance Scenarios**:

1. **Given** Comunicados oculto, **When** o responsável abre o Início, **Then** não há botão de acesso rápido nem bloco "Comunicados Recentes" com "Ver Todos" para comunicados.
2. **Given** Boletim oculto em turma com avaliação numérica, **When** o responsável abre o Início, **Then** o bloco "Média do Bimestre por Disciplina" não é apresentado.

---

### Edge Cases

- O que acontece quando todos os módulos funcionais estão ocultos? O Início exibe identificação do aluno e mensagem orientadora, sem menu vazio quebrado (apenas o item "Início" permanece no menu).
- Como o sistema trata escolas existentes na ativação da feature? Todas nascem com os 6 módulos visíveis (comportamento atual preservado, zero regressão).
- O que acontece se o gestor sem permissão de edição na Unidade Escolar tentar alterar a visibilidade? A alteração é recusada com mensagem de falta de permissão, como os demais campos do card.
- Como ficam registros de auditoria? Toda alteração da visibilidade registra quem, qual escola, quando e quais módulos mudaram.
- O que acontece com o app interno da escola? Nada muda — a gestão continua vendo todos os dados normalmente; a visibilidade afeta somente o Portal do Responsável.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST oferecer, no card "Portal do Responsável" do cadastro da Unidade Escolar (aba Identificação), um controle de marcar/desmarcar por módulo funcional do portal: Boletim, Frequência, Horários, Ocorrências, Comunicados e Documentos.
- **FR-002**: Sistema MUST aplicar a visibilidade por escola, afetando todos os responsáveis vinculados àquela escola de forma uniforme (sem perfil de responsável e sem configuração individual).
- **FR-003**: Sistema MUST exibir no menu do portal (sidebar e navegação mobile) somente o item "Início" mais os módulos marcados como visíveis para a escola.
- **FR-004**: Sistema MUST exibir nos botões de acesso rápido do Início somente os módulos marcados como visíveis para a escola.
- **FR-005**: Sistema MUST bloquear server-side o acesso direto (endereço/link antigo) a módulo oculto, exibindo mensagem orientadora ao responsável sem expor nenhum dado do módulo.
- **FR-006**: Sistema MUST ocultar no Início os blocos e botões "Ver Todos" vinculados a módulos ocultos (Comunicados Recentes, Média do Bimestre por Disciplina, Ocorrências Recentes).
- **FR-007**: Sistema MUST preservar o comportamento atual para escolas existentes: todos os módulos nascem visíveis; nenhuma escola perde acesso por padrão.
- **FR-008**: Sistema MUST exigir, para alterar a visibilidade, a mesma permissão de edição da Unidade Escolar já exigida pelos demais campos do card.
- **FR-009**: Sistema MUST registrar em auditoria cada alteração de visibilidade (usuário, escola, data/hora e módulos alterados).
- **FR-010**: Sistema MUST manter o item "Início" sempre visível no portal, independentemente da configuração (o Início nunca pode ser oculto).

### Key Entities

- **Visibilidade do Portal por Escola**: quais dos 6 módulos funcionais (Boletim, Frequência, Horários, Ocorrências, Comunicados, Documentos) estão visíveis para os responsáveis de uma escola; um conjunto por escola.
- **Unidade Escolar**: dona da configuração; cada escola tem sua própria visibilidade, isolada das demais.
- **Responsável**: leitor afetado; enxerga somente os módulos visíveis da escola do aluno visualizado, sem perfil próprio no sistema de permissões.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um gestor conclui a ocultação de um módulo (abrir cadastro, desmarcar, salvar) em menos de 2 minutos, sem ajuda do suporte.
- **SC-002**: 100% das tentativas de acesso direto a um módulo oculto resultam em mensagem orientadora, com zero registros de dados do módulo entregues.
- **SC-003**: Após a ativação, 100% das escolas existentes permanecem com os 6 módulos visíveis até que um gestor altere explicitamente a configuração.
- **SC-004**: Responsáveis de escolas diferentes enxergam visibilidades independentes em 100% dos testes por escola (nenhum vazamento entre escolas).

## Assumptions

- Responsáveis não possuem perfil no sistema de Perfis e Permissões e o acesso ao portal não solicita perfil; por isso a solução é uma configuração por escola, e não um perfil novo (confirma o entendimento do solicitante).
- O item "Início" do portal é estrutural (identificação do aluno + resumo) e permanece sempre visível; apenas os 6 módulos funcionais são configuráveis.
- A permissão de edição segue a regra vigente do card (recurso `escolas`, ação editar); visualização do card segue a regra de leitura vigente.
- O bloqueio de acesso direto reaproveita o padrão de mensagem orientadora já usado para portal desabilitado, em vez de criar um novo padrão visual.
- Detalhes de persistência (colunas, tabelas, migrations) serão definidos na fase de planejamento, respeitando a convenção de que campos internos da escola ficam fora do payload do Censo.
