# Feature Specification: Ocorrências da Gestão Acadêmica

**Feature Branch**: `026-ocorrencias-gestao-academica`

**Created**: 2026-09-09

**Status**: Draft

**Input**: User description: "Módulo Gestão Acadêmica - Tela: Ocorrências. Deve ser criada a tela de Ocorrências, composta por duas partes: a tela de ocorrências acessada pelos profissionais da escola (esta spec) e, posteriormente, a disponibilização no Portal dos Responsáveis. Tela de Listagem com card de filtros (Escola para Superadmin, Data Inicial/Final, Profissionais multi-seleção, Alunos por busca, Tipo Todas/Positivas/Negativas) e card de listagem com minicards (ícone + badge de tipo, título, data, sinalização de Portal, profissionais, alunos, descrição em 100 chars, Editar/Excluir) + botão 'Nova Ocorrência'. Tela de Nova Ocorrência/Edição sem breadcrumbs com Voltar (+ Excluir em registro existente): título, tipo em pill (Positiva/Negativa), pill 'Apresentar Ocorrência no Portal', data, profissionais multi-seleção, alunos multi-seleção, descrição até 500 caracteres, rodapé Salvar/Cancelar."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — Listagem tem objetivo único (localizar ocorrências); cadastro/edição tem objetivo único (registrar ou alterar uma ocorrência). Duas telas separadas, sem misturar.
- **PE-102** — Título + descrição deixam claro que a tela registra ocorrências (positivas ou negativas) dos alunos, com sinalização das que aparecem no Portal dos Responsáveis.
- **PE-103** — "Nova Ocorrência" é a ação principal da listagem (destaque no topo direito do card de listagem); "Salvar" é a ação principal do formulário.
- **PE-201 / PE-203** — No minicard, título e tipo (ícone + badge) têm maior destaque; descrição truncada e listas de envolvidos têm peso secundário.
- **PE-204** — Formulário agrupa campos em blocos lógicos (identificação da ocorrência: título, tipo, data, visibilidade no portal; envolvidos: profissionais e alunos; relato: descrição).
- **PE-302** — Listagem com card de filtros + minicards para localizar ocorrências (mesmo padrão das telas de Comunicados e Usuários).
- **PE-304** — Cadastro/edição em tela própria (sem breadcrumbs, com "Voltar"), campos agrupados, validação durante o preenchimento.
- **PE-401** — Exclusão (na listagem e na edição) exige confirmação explícita via diálogo de confirmação.
- **PE-402** — Erros de validação (ex.: título vazio, data inválida, nenhum aluno/profissional selecionado se obrigatórios, descrição acima do limite) explicam o problema e como resolver.
- **PE-403** — Criação/edição/exclusão confirmam com mensagem de sucesso imediata.
- **PE-404** — Carregamento da listagem e salvamento comunicam estado (carregamento + botão em estado de salvamento).
- **PE-5xx** — Empty states contextuais: sem ocorrências cadastradas vs. filtros sem resultado.
- **PE-6xx** — Minicards empilham em mobile; filtros e formulário responsivos (mesmo padrão das specs 007/008/025).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listar e filtrar ocorrências (Priority: P1)

O profissional da escola acessa "Ocorrências" e vê o card de filtros e o card de listagem com minicards. Cada minicard exibe ícone + badge do tipo (Positiva/Negativa), título, data da ocorrência, sinalização se aparece no Portal dos Responsáveis, profissionais (quantidade e nomes), alunos envolvidos (quantidade e nomes), descrição truncada em 100 caracteres e ações Editar/Excluir. O botão "Nova Ocorrência" fica no topo direito do card de listagem. O acesso à tela respeita as permissões do perfil do profissional. Para Superadmin, o filtro de Escola é obrigatório e a listagem mostra as ocorrências da escola selecionada.

**Why this priority**: É a porta de entrada da funcionalidade — sem listagem não há gestão das ocorrências. Entrega valor sozinha (visão do que já foi registrado).

**Independent Test**: Acessar a tela, aplicar cada filtro isoladamente, criar 2 ocorrências via cadastro e confirmar que os minicards aparecem com todos os elementos e ações.

**Acceptance Scenarios**:

1. **Given** profissional com permissão de acesso, **When** abro a tela de Ocorrências, **Then** vejo o card de filtros e o card de listagem com o botão "Nova Ocorrência" no topo direito.
2. **Given** profissional sem permissão de acesso, **When** tento abrir a tela, **Then** vejo estado de "Sem permissão" e nenhum dado de ocorrência é exibido.
3. **Given** usuário Superadmin sem escola selecionada, **When** abro a tela, **Then** a listagem não exibe ocorrências até que uma escola seja selecionada no filtro.
4. **Given** ocorrências cadastradas no intervalo, **When** preencho Data Inicial e Data Final, **Then** vejo apenas ocorrências cuja data está dentro do intervalo.
5. **Given** filtro de Tipo em "Positivas", **When** aplico, **Then** vejo apenas ocorrências positivas; em "Todas", vejo positivas e negativas.
6. **Given** filtro de Profissional com 1 profissional selecionado, **When** aplico, **Then** vejo apenas ocorrências vinculadas a ele; o nome aparece dentro do próprio campo (sem chips abaixo).
7. **Given** busca de Alunos com menos de 3 letras digitadas, **When** digito, **Then** nenhuma sugestão é exibida; com 3+ letras, vejo alunos correspondentes para selecionar como filtro.
8. **Given** nenhuma ocorrência cadastrada, **When** abro a tela, **Then** vejo estado vazio com ação "Nova Ocorrência"; com filtros sem resultado, vejo estado vazio orientando a ajustar os filtros.

---

### User Story 2 - Criar nova ocorrência (Priority: P1)

O profissional clica em "Nova Ocorrência" e abre a tela de cadastro (sem breadcrumbs, com botão "Voltar", sem botão "Excluir" por ser registro novo). Informa título, tipo (Positiva ou Negativa via pill clicável), marca ou não o pill "Apresentar Ocorrência no Portal", informa a data da ocorrência (seletor de data com seleção de mês e ano), seleciona profissionais e alunos envolvidos (multi-seleção com chips removíveis), escreve a descrição (até 500 caracteres) e salva via rodapé Cancelar/Salvar.

**Why this priority**: É o coração da feature — sem criação não há registros para listar, editar ou exibir futuramente no Portal. Testável isoladamente da edição/exclusão.

**Independent Test**: Criar uma ocorrência completa (positiva e outra negativa, uma com apresentação no Portal e outra sem), salvar e confirmar que aparecem na listagem com os dados corretos.

**Acceptance Scenarios**:

1. **Given** tela de Nova Ocorrência, **When** abro, **Then** vejo botão "Voltar", nenhum botão "Excluir", tipo sem seleção prévia ou com padrão definido, e pill "Apresentar Ocorrência no Portal" desmarcado por padrão.
2. **Given** formulário válido (título, tipo, data, ≥1 aluno envolvido, descrição dentro do limite), **When** clico Salvar, **Then** vejo mensagem de sucesso e volto à listagem com o novo minicard.
3. **Given** título vazio ou tipo não selecionado ou data vazia, **When** tento salvar, **Then** o salvamento é bloqueado com mensagem explicando qual campo corrigir.
4. **Given** descrição com mais de 500 caracteres, **When** tento salvar, **Then** o salvamento é bloqueado com orientação sobre o limite.
5. **Given** pill "Apresentar Ocorrência no Portal" marcado, **When** salvo, **Then** a ocorrência fica sinalizada no minicard como visível no Portal (a exibição efetiva no Portal será tratada em spec futura).
6. **Given** profissional selecionado na multi-seleção, **When** clico no ícone de remover do chip, **Then** apenas aquele profissional é removido; existe ainda ação para remover todos de uma vez.
7. **Given** cadastro em andamento, **When** clico Cancelar ou Voltar, **Then** volto à listagem sem salvar e sem mensagem de sucesso.

---

### User Story 3 - Editar e excluir ocorrência (Priority: P2)

O profissional edita uma ocorrência pelo minicard (mesma tela do cadastro, com "Voltar" e botão "Excluir") ou exclui diretamente pelo minicard com confirmação. Alterações (inclusive marcar/desmarcar apresentação no Portal) refletem imediatamente na listagem.

**Why this priority**: Mantém os registros corretos e permite remover erros; depende das US1–US2 para existir conteúdo.

**Independent Test**: Editar título/tipo/data/envolvidos de uma ocorrência e conferir reflexo na listagem; excluir outra com confirmação e conferir remoção.

**Acceptance Scenarios**:

1. **Given** minicard existente, **When** clico Editar, **Then** abro a tela com todos os campos preenchidos, botão "Voltar" e botão "Excluir" visível.
2. **Given** edição válida, **When** salvo, **Then** vejo mensagem de sucesso e o minicard atualizado na listagem.
3. **Given** exclusão pelo minicard ou pela tela de edição, **When** confirmo no diálogo, **Then** a ocorrência é removida, some da listagem e vejo mensagem de sucesso.
4. **Given** diálogo de exclusão aberto, **When** cancelo, **Then** nada é excluído e permaneço onde estava.

---

### Edge Cases

- O que acontece quando o intervalo de datas é invertido (Data Inicial posterior à Data Final)? O sistema bloqueia a aplicação do filtro ou a validação com mensagem orientando a corrigir.
- Como o sistema trata ocorrência sem nenhum aluno envolvido? O salvamento é bloqueado, pois a ocorrência sempre se refere a pelo menos um aluno.
- Como o sistema trata ocorrência sem nenhum profissional vinculado? O salvamento é bloqueado, pois ao menos um profissional responsável pelo registro é exigido.
- O que acontece quando um profissional filtrado é desativado após o registro? Ocorrências já registradas mantêm o nome histórico; o filtro lista apenas profissionais ativos para novas seleções.
- O que acontece quando um aluno transferido de escola possui ocorrências antigas? As ocorrências permanecem vinculadas à escola de origem e não aparecem na nova escola.
- Como o sistema trata descrição exatamente com 100 caracteres na listagem? Exibe integralmente, sem reticências; acima disso, trunca com reticências.
- O que acontece ao clicar em Salvar duas vezes seguidas rapidamente? Apenas um registro é criado (botão entra em estado de salvamento e ignora cliques duplicados).
- Como o sistema trata a data da ocorrência futura? É permitida apenas se for data válida de calendário; datas futuras distantes geram alerta de confirmação (não bloqueio), pois a ocorrência refere-se a fato já ocorrido.
- O que acontece quando o Superadmin troca a escola no filtro após aplicar outros filtros? Os demais filtros são mantidos e a listagem recarrega para a nova escola.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir a tela de Ocorrências somente para profissionais cujo perfil possua permissão de acesso; sem permissão, DEVE exibir estado de "Sem permissão" sem expor dados.
- **FR-002**: O sistema DEVE exigir a seleção de Escola no filtro para usuários Superadmin antes de listar ocorrências; para usuários de escola, o contexto da própria escola DEVE ser aplicado automaticamente.
- **FR-003**: O sistema DEVE oferecer filtro por intervalo de datas (Data Inicial e Data Final) aplicado sobre a data da ocorrência, com seletor de data que permita escolha direta de mês e ano.
- **FR-004**: O sistema DEVE oferecer filtro por Profissional com seleção única, listando apenas profissionais ativos; o nome do selecionado DEVE aparecer dentro do próprio campo (com X interno para limpar), sem chips abaixo.
- **FR-005**: O sistema DEVE oferecer filtro por Aluno com seleção única e busca por nome que só sugere resultados após 3 ou mais letras digitadas; o nome do selecionado DEVE aparecer dentro do próprio campo (com X interno para limpar).
- **FR-006**: O sistema DEVE oferecer filtro por Tipo de Ocorrência (Todas, Positivas, Negativas) com padrão "Todas".
- **FR-007**: O sistema DEVE exibir as ocorrências em minicards (não em tabela), cada um contendo: ícone de identificação do tipo, badge do tipo, título, data da ocorrência, sinalização de apresentação no Portal, profissionais (quantidade e nomes), alunos (quantidade e nomes), descrição truncada em 100 caracteres e botões Editar/Excluir.
- **FR-008**: O sistema DEVE exibir o botão "Nova Ocorrência" no topo direito do card de listagem, seguindo o padrão do sistema.
- **FR-009**: O sistema DEVE abrir tela própria de cadastro ao clicar em "Nova Ocorrência", sem breadcrumbs, com botão "Voltar" e sem botão "Excluir".
- **FR-010**: O sistema DEVE abrir a mesma tela em modo edição ao clicar em Editar, com botão "Voltar" e botão "Excluir" visível.
- **FR-011**: O sistema DEVE exigir no cadastro: título (texto), tipo (Positiva ou Negativa via pill clicável de seleção única), data da ocorrência (seletor com mês/ano) e ao menos um aluno envolvido e um profissional vinculado.
- **FR-012**: O sistema DEVE oferecer o pill clicável "Apresentar Ocorrência no Portal" (liga/desliga, desmarcado por padrão); a exibição efetiva no Portal será tratada em spec futura, mas a sinalização DEVE persistir e aparecer no minicard.
- **FR-013**: O sistema DEVE oferecer seleção de Profissionais e de Alunos Envolvidos no cadastro com multi-seleção em chips no padrão do sistema (fundo primary suave, cantos 6px), com remoção individual por chip e botão "Limpar tudo" no estilo do botão "Limpar" de Comunicados.
- **FR-014**: O sistema DEVE limitar a descrição a 500 caracteres, com contador visível, bloqueando salvamento acima do limite.
- **FR-015**: O sistema DEVE exibir botões Salvar (principal) e Cancelar no rodapé da página de cadastro/edição, seguindo o padrão do sistema.
- **FR-016**: O sistema DEVE exigir confirmação explícita antes de excluir uma ocorrência (tanto na listagem quanto na edição), com opção segura de cancelamento.
- **FR-017**: O sistema DEVE registrar auditoria de criação, edição e exclusão de ocorrências (usuário, escola, data/hora, operação, registro afetado), seguindo o padrão do sistema.
- **FR-018**: O sistema DEVE isolar os dados por escola (multi-tenant): cada escola visualiza e gerencia apenas as próprias ocorrências.

### Key Entities

- **Ocorrência**: Registro de fato positivo ou negativo envolvendo alunos; atributos: título, tipo (positiva/negativa), data da ocorrência, descrição (até 500 caracteres), sinalização de apresentação no Portal, escola dona do registro.
- **Profissional vinculado**: Profissional da escola corresponsável/relatado na ocorrência; relação N:N com a ocorrência; ao menos um por ocorrência.
- **Aluno envolvido**: Aluno ao qual a ocorrência se refere; relação N:N com a ocorrência; ao menos um por ocorrência.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Profissionais com permissão localizam uma ocorrência específica aplicando filtros em menos de 1 minuto.
- **SC-002**: 90% dos profissionais concluem o cadastro de uma ocorrência sem erros de validação na primeira tentativa.
- **SC-003**: 100% das exclusões passam por confirmação explícita (nenhuma exclusão por clique único acidental).
- **SC-004**: Profissionais sem permissão nunca visualizam dados de ocorrências (0 vazamentos em testes de acesso).
- **SC-005**: Superadmin visualiza apenas ocorrências da escola selecionada (0 registros de outras escolas na listagem).

## Assumptions

- Recurso de permissão seguirá o padrão `modulo.recurso` do cadastro de Perfis e Permissões (nome exato definido no plano); leitura/escrita/exclusão respeitam as permissões granulares do perfil.
- Paginação, ordenação padrão (mais recentes primeiro), loading, empty states e toasts seguem o padrão das telas de Comunicados/Usuários (10 itens por página).
- A busca de alunos no filtro reutiliza o padrão assíncrono do Painel do Aluno (debounce, mínimo 3 letras); a multi-seleção de alunos no cadastro usa o mesmo catálogo de alunos da escola.
- "Profissionais ativos" são pessoas com vínculo profissional ativo na escola.
- A funcionalidade do Portal do Responsável (exibição das ocorrências marcadas) está fora do escopo desta spec e será tratada em spec futura; aqui apenas a sinalização é persistida e exibida.
- Auditoria segue o framework best-effort do sistema (falha de auditoria não bloqueia a operação).
- Migrations aplicadas via SQL Editor (sem CLI Supabase), conforme padrão do projeto.
