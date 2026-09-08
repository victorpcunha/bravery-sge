# Feature Specification: Comunicados do Portal

**Feature Branch**: `025-comunicados-portal`

**Created**: 2026-09-08

**Status**: Draft

**Input**: User description: "Tela de Comunicados do Portal: a Escola registra um comunicado e o mesmo é apresentado no Portal dos Responsáveis (ex.: escola fechada para reforma). A tela é a origem dos comunicados do Portal. Os comunicados são enviados para os alunos das Etapas de Ensino e Turmas selecionadas no momento do cadastro — o responsável visualiza somente o que é voltado para o filho dele. Padrão do sistema: Tela de Listagem + Tela de Novo Comunicado, minicards, filtros, calendário shadcn com seletor mês/ano, range + time picker no período de visualização."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — Listagem tem objetivo único (localizar comunicados); cadastro/edição tem objetivo único (registrar ou alterar um comunicado). Duas telas separadas, sem misturar.
- **PE-102** — Título + descrição deixam claro que a tela é a origem dos comunicados exibidos no Portal dos Responsáveis.
- **PE-103** — "Novo Comunicado" é a ação principal da listagem (destaque no card "Comunicados Registrados"); "Salvar" é a ação principal do formulário.
- **PE-204** — Formulário agrupado em dois cards: "Identificação" (ano, etapas, turmas) e "Detalhes do Comunicado" (título, período, descrição).
- **PE-302** — Listagem com card de filtros + minicards para localizar comunicados (mesmo padrão da tela de Usuários).
- **PE-304** — Cadastro/edição em tela própria (sem breadcrumbs, com "Voltar"), campos agrupados, validação durante o preenchimento.
- **PE-401** — Exclusão (na listagem e na edição) exige confirmação explícita via ConfirmDialog.
- **PE-402** — Erros de validação (ex.: período final anterior ao início, nenhuma turma selecionada) explicam o problema e como resolver.
- **PE-403** — Criação/edição/exclusão confirmam com toast de sucesso.
- **PE-404** — Carregamento da listagem e salvamento comunicam estado (skeleton/spinner + botão em loading).
- **PE-5xx** — Empty states contextuais: sem comunicados cadastrados vs. filtros sem resultado; portal sem comunicados no período.
- **PE-6xx** — Minicards empilham em mobile; filtros e formulário responsivos (mesmo padrão das specs 007/008).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listar e filtrar comunicados (Priority: P1)

A gestão acessa "Comunicados do Portal" e vê o card de filtros (padrão da tela de Usuários) e o card "Comunicados Registrados" com minicards. Cada minicard exibe datas de envio/final, título, descrição truncada em 100 caracteres e ações Editar/Excluir. O botão "Novo Comunicado" fica no topo direito do card. O Ano Letivo vem pré-selecionado com o ano ativo atual.

**Why this priority**: É a porta de entrada da funcionalidade — sem listagem não há gestão dos comunicados. Entrega valor sozinha (visão do que já foi publicado).

**Independent Test**: Acessar a tela, conferir filtros com ano ativo pré-selecionado, criar 2 comunicados via banco e confirmar que os minicards aparecem com datas, título, descrição truncada e ações.

**Acceptance Scenarios**:

1. **Given** tela de Comunicados com o ano letivo ativo vigente, **When** abro a tela, **Then** o filtro Ano Letivo já vem selecionado com o ano ativo e a listagem mostra os comunicados desse ano.
2. **Given** comunicados cadastrados, **When** aplico filtro por Etapa de Ensino e Turma, **Then** vejo apenas os comunicados direcionados àquelas etapas/turmas.
3. **Given** filtro por Data de envio e Data final preenchidos, **When** aplico, **Then** a listagem mostra apenas comunicados cujo período cruza o intervalo informado.
4. **Given** nenhum comunicado cadastrado, **When** abro a tela, **Then** vejo estado vazio com ação "Novo Comunicado"; com filtros sem resultado, vejo estado vazio orientando a ajustar os filtros.

---

### User Story 2 - Criar novo comunicado (Priority: P1)

A gestão clica em "Novo Comunicado" e abre a tela de Novo Registro (padrão do sistema, sem breadcrumbs, com botão "Voltar"). No card Identificação, o Ano Letivo vem pré-definido com o ano ativo (sem edição); seleciona as Etapas de Ensino (somente as ativas da Estrutura Acadêmica) e as Turmas (dependentes das etapas, todas marcadas por padrão, podendo desmarcar). No card Detalhes, informa título, período de visualização (range de datas + horário início/fim) e descrição, e salva via rodapé Cancelar/Salvar.

**Why this priority**: É o coração da feature — sem criação não há origem de comunicados para o Portal. Testável isoladamente da edição/exclusão.

**Independent Test**: Criar um comunicado completo, salvar e confirmar que ele aparece na listagem e fica visível no Portal do Responsável dentro do período.

**Acceptance Scenarios**:

1. **Given** tela de Novo Comunicado, **When** abro, **Then** o Ano Letivo exibe o ano ativo sem possibilidade de alteração.
2. **Given** etapas ativas da escola, **When** seleciono etapas, **Then** o seletor de Turmas lista apenas turmas daquelas etapas, todas marcadas por padrão.
3. **Given** formulário válido (título, período com início < fim, descrição, ≥1 turma), **When** clico Salvar, **Then** vejo toast de sucesso e volto à listagem com o novo minicard.
4. **Given** período final anterior ao início ou nenhuma turma marcada, **When** tento salvar, **Then** o salvamento é bloqueado com mensagem explicando o que corrigir.

---

### User Story 3 - Editar e excluir comunicado (Priority: P2)

A gestão edita um comunicado pelo minicard (mesma tela do cadastro, com "Voltar" e botão "Excluir") ou exclui diretamente pelo minicard com confirmação. Alterações refletem imediatamente no Portal dos Responsáveis (inclusive encerrar a visibilidade antecipando a data final).

**Why this priority**: Mantém os comunicados corretos e permite remover erros; depende das US1–US2 para existir conteúdo.

**Independent Test**: Editar título/período de um comunicado e conferir reflexo na listagem e no Portal; excluir outro com confirmação e conferir remoção.

**Acceptance Scenarios**:

1. **Given** minicard existente, **When** clico Editar, **Then** abro a tela com todos os campos preenchidos, botão "Voltar" e botão "Excluir".
2. **Given** edição com data final antecipada para o passado, **When** salvo, **Then** o comunicado some do Portal do Responsável mas permanece na listagem administrativa.
3. **Given** exclusão pelo minicard ou pela tela de edição, **When** confirmo no diálogo, **Then** o comunicado é removido, some do Portal e vejo toast de sucesso.

---

### User Story 4 - Responsável vê somente comunicados do filho no período (Priority: P2)

O responsável abre o Portal e vê apenas comunicados direcionados às etapas/turmas em que o filho estava matriculado no momento do cadastro e cujo período de visualização está vigente (data/hora atual dentro do intervalo). Comunicado expirado não aparece mais.

**Why this priority**: É o propósito declarado da feature (responsável ciente do que é voltado ao filho). Depende das US1–US3 para haver conteúdo.

**Independent Test**: Com 2 alunos em turmas distintas, publicar comunicado para 1 turma e conferir que cada responsável vê apenas o seu; avançar o relógio para após o fim e conferir que some.

**Acceptance Scenarios**:

1. **Given** comunicado direcionado à Turma A com período vigente, **When** o responsável do aluno da Turma A abre o Portal, **Then** ele vê o comunicado; o responsável da Turma B não vê.
2. **Given** comunicado com período encerrado, **When** qualquer responsável abre o Portal, **Then** o comunicado não é exibido.
3. **Given** comunicado com início futuro, **When** o responsável abre o Portal antes do início, **Then** o comunicado ainda não é exibido.

### Edge Cases

- Comunicado sem turmas: impossível — validação exige ao menos 1 turma selecionada.
- Etapa desativada na Estrutura Acadêmica após o cadastro: comunicados já criados mantêm o direcionamento original (snapshot do momento do cadastro); novos cadastros listam só etapas ativas.
- Turma desativada/encerrada após o cadastro: comunicado mantém o vínculo histórico; Portal resolve visibilidade pela matrícula vigente do aluno.
- Exclusão de comunicado já expirado: permitida normalmente (só afeta a listagem administrativa).
- Ano letivo trocado (novo ano ativo): a listagem abre no novo ano; comunicados do ano anterior continuam acessíveis pelo filtro.
- Período com início = fim no mesmo dia e horários iguais: bloqueado (fim deve ser posterior ao início).
- Superadmin sem escola de contexto: usa o mesmo seletor de escola das telas administrativas antes de listar/criar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST exibir a tela de Listagem com card de filtros no padrão da tela de Usuários (PageSection compact + FilterBar) contendo: Ano Letivo (default = ano ativo atual), Data de envio, Data final (ambas via Calendar shadcn com seletor de mês/ano), Etapa de Ensino e Turma.
- **FR-002**: Sistema MUST listar no filtro de Etapa de Ensino somente as etapas ativas da escola (Estrutura Acadêmica, aba de Etapas), respeitando o escopo da escola (multi-tenant).
- **FR-003**: Sistema MUST exibir os comunicados no card "Comunicados Registrados" com o botão "Novo Comunicado" no topo direito do card (actions do PageSection, padrão do sistema).
- **FR-004**: Sistema MUST renderizar cada comunicado como minicard contendo: Data de envio e Data final, Título, Descrição truncada em 100 caracteres e botões de ação Editar/Excluir no padrão do sistema (ghost icon-sm).
- **FR-005**: Sistema MUST abrir a tela de Novo Comunicado sem breadcrumbs, com botão "Voltar", ao clicar em "Novo Comunicado".
- **FR-006**: Sistema MUST pré-definir o Ano Letivo com o ano ativo atual na criação, sem possibilidade de alteração.
- **FR-007**: Sistema MUST oferecer o seletor de Etapas de Ensino (somente ativas da escola) e o seletor de Turmas dependente das etapas selecionadas (somente turmas daquelas etapas), com todas as turmas marcadas por padrão e possibilidade de desmarcar.
- **FR-008**: Sistema MUST oferecer no card "Detalhes do Comunicado": Título (obrigatório), Período de visualização (range de datas shadcn + horário de início e fim) e Descrição via Textarea (obrigatória).
- **FR-009**: Sistema MUST validar server-side: título e descrição não vazios, início do período anterior ao fim (data+hora), ao menos 1 turma selecionada, ano letivo ativo válido, etapas/turmas pertencentes à escola.
- **FR-010**: Sistema MUST exibir no Portal do Responsável somente comunicados cujo período de visualização esteja vigente (início ≤ agora ≤ fim) e direcionados a etapa/turma com vínculo do aluno no momento do cadastro; fora do período, o comunicado não é apresentado.
- **FR-011**: Sistema MUST congelar o direcionamento no momento do cadastro (snapshot de etapas/turmas): edições posteriores de etapas/turmas da escola não alteram comunicados já criados, salvo reedição explícita do comunicado.
- **FR-012**: Sistema MUST oferecer na tela de Edição (mesmo layout da criação) o botão "Voltar" e o botão "Excluir" conforme padrão do sistema, com exclusão mediante ConfirmDialog.
- **FR-013**: Sistema MUST exigir confirmação explícita (ConfirmDialog) para toda exclusão, com toast de sucesso após concluir.
- **FR-014**: Sistema MUST restringir acesso por permissão de recurso dedicado (padrão `modulo.recurso`, a definir no plan — ex. `portal.comunicados`), validada server-side, com estado "Sem permissão" (ShieldAlert) quando ausente.
- **FR-015**: Sistema MUST isolar dados por escola (schoolId em todas as leituras/escritas) e auditar criação/edição/exclusão (usuário, escola, data/hora, operação, entidade afetada).
- **FR-016**: Sistema MUST oferecer rodapé de formulário no padrão do sistema (Cancelar + Salvar, sticky bottom) com estado de loading durante o salvamento.
- **FR-017**: Sistema MUST paginar ou limitar a listagem de minicards seguindo o padrão do sistema (paginação client-side 10/pág quando aplicável) e manter empty states contextuais.

### Key Entities

- **Comunicado**: título, descrição, ano letivo, início/fim da visibilidade (data+hora), escola; origem dos itens exibidos no Portal dos Responsáveis.
- **Direcionamento do comunicado (snapshot)**: conjunto de etapas de ensino + turmas selecionadas no momento do cadastro/última edição; governa quais responsáveis veem o comunicado.
- **Período de visualização**: intervalo data+hora que delimita a exibição no Portal; fora dele, o comunicado existe só na gestão administrativa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Gestão publica um comunicado (etapas + turmas + período + texto) em até 3 minutos sem suporte, do clique em "Novo Comunicado" ao toast de sucesso.
- **SC-002**: Responsável identifica em até 30 segundos os comunicados vigentes voltados ao filho, sem ver comunicados de outras turmas.
- **SC-003**: 0 comunicados expirados exibidos no Portal (verificado por teste funcional com relógio após o fim do período).
- **SC-004**: 0 vazamentos entre escolas: comunicados da escola A nunca aparecem no portal da escola B (incluindo chamada direta de leitura).
- **SC-005**: Filtros retornam o resultado em tempo compatível com as demais listagens do sistema, sem erros, em 95% das tentativas.

## Assumptions

- Direcionamento é snapshot no cadastro (não recalculado por mudanças posteriores de etapas/turmas), porque o pedido diz "no momento do cadastro do comunicado".
- Visibilidade no Portal combina período vigente + vínculo do aluno com a etapa/turma do snapshot; regra de matrícula vigente (transferências) segue o padrão do Portal (specs 022–024).
- Componentes de data/hora são os padrões shadcn já usados no sistema (Calendar com seletor mês/ano nos filtros; Range + Time Picker no período), estilizados com tokens do Design System.
- Recurso de permissão dedicado segue o padrão `modulo.recurso`; nome exato definido no plan (depende do catálogo de recursos existente).
- Migration nova em `supabase-migrations/` (padrão do projeto, aplicada via SQL Editor); auditoria segue o framework `src/lib/auditoria.ts` (spec 017).
- Superadmin seleciona a escola antes de listar/criar (mesmo padrão das telas administrativas); escola comum opera no próprio escopo.
- Descrição do minicard truncada em 100 caracteres com ellipsis; texto completo visível na edição e no Portal.
- Exclusão é definitiva (hard delete) mediante confirmação; sem lixeira nesta versão.
