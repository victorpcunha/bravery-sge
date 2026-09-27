# Feature Specification: Documentos no Portal do Responsável

**Feature Branch**: `041-documentos-portal`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "Hoje, o Portal do Responsável tem uma tela de 'Documentos', onde pode ser possível gerar os documentos dos alunos, de acordo com a necessidade. A ideia é que, conforme a necessidade da Escola, a mesma pode disponibilizar alguns documentos que possam ser gerados diretamente pelo Responsável, através do Portal. Isso diminui o fluxo de solicitação dos pais para a secretaria. Os documentos oficiais e os documentos de preenchimento manual, atualmente, não possuem uma regra para definir quais documentos podem ou não ser habilitados no portal (pelo menos acredito que não e, se tiver, não sei onde configurar isso no sistema atualmente.) O que pensei foi o seguinte: Na tela de Unidades Escolares, no cadastro da Unidade, na aba Identificação, temos um card de Portal do Responsável. Neste card, precisamos definir algo que possa selecionar quais documentos oficiais e/ou preenchimento manual podem ou não ser disponibilizados no Portal, para que o responsável possa gerar diretamente de casa. OBS: Reforço que, o documento gerado no Portal, deve ser atribuído ao aluno e turma que o responsável está visualizando."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — A tela de Documentos do Portal tem um único objetivo principal: permitir que o responsável gere documentos do aluno que está visualizando. A tela de configuração na Unidade Escolar também tem objetivo único: definir quais documentos ficam disponíveis no portal daquela escola.
- **PE-102** — O propósito de cada tela é comunicado de imediato: no portal, título/descrição identificam o aluno e a turma em visualização; na escola, o seletor fica dentro do card "Portal do Responsável", junto às demais definições do portal.
- **PE-201** — No portal, os documentos liberados têm prioridade visual; documentos não liberados não competem por atenção (não aparecem). Na escola, a seleção de documentos é secundária dentro do card do portal, abaixo do essencial (habilitação e módulos visíveis).
- **PE-204** — A seleção de documentos é agrupada logicamente dentro do card "Portal do Responsável" (aba Identificação da Unidade Escolar), junto às demais definições do portal, e separada por categoria (Documentos Oficiais / Preenchimento Manual).
- **PE-402** — Quando um documento não puder ser gerado (ex.: turma sem avaliação numérica para o Boletim, aluno sem dados para o Histórico), o portal explica o motivo em linguagem do responsável e orienta o próximo passo (procurar a secretaria).
- **PE-403** — A conclusão da geração de um documento fornece feedback imediato (pré-visualização e opção de download), sem exigir que o responsável deduza o resultado.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escola define quais documentos o portal disponibiliza (Priority: P1)

A pessoa gestora da escola acessa o cadastro da Unidade Escolar (aba Identificação, card "Portal do Responsável") e marca quais documentos oficiais e/ou de preenchimento manual ficam disponíveis para os responsáveis gerarem pelo portal. Ao salvar, a escolha passa a valer para todos os responsáveis daquela escola.

**Why this priority**: É o controle central da funcionalidade — sem ele, não há como a escola decidir o que disponibilizar, e o portal não tem regra do que exibir. Entrega valor sozinho (configuração pronta para uso).

**Independent Test**: Pode ser testado acessando o cadastro de uma escola, alterando a seleção de documentos, salvando e recarregando a tela para confirmar que a seleção persistiu.

**Acceptance Scenarios**:

1. **Given** uma escola com portal habilitado, **When** a gestora desmarca "Boletim Escolar" e salva, **Then** responsáveis dessa escola deixam de ver o Boletim na tela de Documentos do portal.
2. **Given** uma escola com portal habilitado, **When** a gestora marca todos os documentos e salva, **Then** responsáveis dessa escola veem todos os documentos na tela de Documentos do portal.
3. **Given** uma pessoa sem permissão de edição de escolas, **When** ela abre o cadastro da unidade, **Then** a seleção de documentos aparece somente leitura (não pode alterar).

---

### User Story 2 - Responsável gera documento do aluno em visualização (Priority: P1)

A pessoa responsável entra no portal, seleciona um aluno (quando há mais de um vinculado) e abre a tela de Documentos. Ela vê somente os documentos liberados pela escola e gera o documento desejado, que sai automaticamente com os dados do aluno e da turma em visualização, sem precisar escolher aluno ou turma.

**Why this priority**: É o benefício final da funcionalidade (responsável resolve de casa, sem acionar a secretaria). Testável de ponta a ponta com a Story 1.

**Independent Test**: Pode ser testado entrando no portal como responsável, abrindo Documentos de um aluno e gerando um documento liberado, conferindo que os dados no documento são os do aluno/turma visualizados.

**Acceptance Scenarios**:

1. **Given** um responsável visualizando o aluno "Ana" da turma "1º ANO A", **When** ele gera a Declaração de Matrícula, **Then** o documento contém os dados da Ana e da turma 1º ANO A, sem pedir seleção de aluno ou turma.
2. **Given** um responsável com dois filhos vinculados, **When** ele troca o aluno em visualização, **Then** a tela de Documentos passa a gerar documentos do outro aluno (contexto acompanha a troca).
3. **Given** a escola liberou apenas Declaração e Ficha, **When** o responsável abre a tela de Documentos, **Then** ele vê somente esses dois documentos (Boletim e Histórico não aparecem).

---

### User Story 3 - Portal orienta quando nada pode ser gerado (Priority: P2)

Quando a escola não liberou nenhum documento, ou quando um documento liberado não se aplica ao aluno/turma (ex.: Boletim em turma sem avaliação numérica), o portal mostra uma mensagem clara explicando a situação e orientando a procurar a secretaria — em vez de tela vazia ou erro técnico.

**Why this priority**: Evita frustração e ligações confusas para a escola; complementa as Stories 1–2 com o comportamento de borda mais comum.

**Independent Test**: Pode ser testado configurando uma escola sem nenhum documento liberado e abrindo a tela de Documentos no portal, verificando a mensagem orientativa.

**Acceptance Scenarios**:

1. **Given** uma escola que não liberou nenhum documento, **When** o responsável abre a tela de Documentos, **Then** ele vê uma mensagem informando que não há documentos disponíveis e orientando a procurar a secretaria.
2. **Given** o Boletim liberado mas o aluno está em turma que usa apenas avaliação por conceito, **When** o responsável tenta gerar o Boletim, **Then** ele vê explicação em linguagem simples de que o Boletim numérico não se aplica àquela turma, com orientação de procurar a secretaria.

---

### Edge Cases

- O que acontece quando o portal da escola está desabilitado ou o módulo "Documentos" está oculto? A tela de Documentos do portal permanece bloqueada como hoje (a seleção por documento só tem efeito quando o módulo está visível).
- Como o sistema trata um documento que era liberado e foi desmarcado depois? Ele some do portal imediatamente; documentos já baixados anteriormente continuam válidos como arquivos (não há revogação de PDF já emitido).
- O que acontece quando um documento liberado exige um período de avaliação (Boletim) ou dado inexistente (Histórico sem registros)? Valem as mesmas regras e mensagens já usadas no módulo interno de Documentos, adaptadas para linguagem do responsável.
- Como fica o responsável que visualiza um aluno cuja matrícula mudou de turma? O documento sempre reflete a turma atual do aluno no momento da geração.
- O que acontece com a categoria "Preenchimento Manual" se ainda não houver modelos cadastrados? A categoria aparece na configuração da escola de forma extensível, mas só gera efeito no portal quando houver modelos disponíveis; enquanto não houver, o portal informa que não há modelos disponíveis.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O cadastro da Unidade Escolar (aba Identificação, card "Portal do Responsável") DEVE permitir selecionar, por escola, quais documentos ficam disponíveis no portal, separados por categoria (Documentos Oficiais e Preenchimento Manual).
- **FR-002**: A seleção de documentos DEVE valer para todos os responsáveis daquela escola (configuração por escola, não por aluno, turma ou responsável).
- **FR-003**: A tela de Documentos do portal DEVE exibir somente os documentos liberados pela escola do aluno em visualização, mantendo o padrão visual de galeria já usado no módulo interno de Documentos.
- **FR-004**: Todo documento gerado no portal DEVE usar automaticamente o aluno e a turma em visualização, sem exigir seleção de aluno, turma ou ano letivo pelo responsável (exceto seleções inerentes ao documento, como o período de avaliação do Boletim).
- **FR-005**: Quando o responsável trocar o aluno em visualização, a tela de Documentos DEVE passar a operar no contexto do novo aluno sem necessidade de nova configuração.
- **FR-006**: Documentos não liberados pela escola NÃO DEVEM ser acessíveis pelo portal por nenhum caminho (a restrição DEVE ser verificada também no servidor, não apenas ocultando na tela).
- **FR-007**: Quando nenhum documento estiver liberado para a escola, o portal DEVE exibir mensagem orientativa informando que não há documentos disponíveis e indicando a secretaria como próximo passo.
- **FR-008**: Quando um documento liberado não se aplicar ao aluno/turma (ex.: Boletim numérico em turma sem avaliação numérica), o portal DEVE exibir explicação em linguagem simples, com orientação de procurar a secretaria.
- **FR-009**: Novos documentos oficiais ou modelos de preenchimento manual criados no futuro DEVEM entrar automaticamente no mesmo mecanismo de liberação por escola (sem necessidade de reformular a configuração).
- **FR-010**: Alterações na seleção de documentos da escola DEVEM ficar registradas com identificação de quem alterou, quando e o que mudou.
- **FR-011**: A configuração DEVE respeitar o regime de permissões da escola: somente quem pode editar a Unidade Escolar pode alterar a seleção; os demais veem somente leitura.

### Key Entities

- **Disponibilidade de Documentos no Portal**: representa, por escola, quais documentos (oficiais e de preenchimento manual) os responsáveis podem gerar pelo portal; pertence a uma única escola e vale para todos os seus responsáveis.
- **Documento Oficial**: documento gerado a partir dos dados do sistema (ex.: Declaração de Matrícula, Ficha Individual do Aluno, Boletim Escolar, Histórico Escolar); cada tipo tem suas próprias regras de aplicabilidade ao aluno/turma.
- **Modelo de Preenchimento Manual**: modelo em branco com cabeçalho da escola para impressão/preenchimento; disponibilizado no portal quando a escola liberar e houver modelos disponíveis.
- **Aluno em visualização**: o aluno (e sua turma atual) que o responsável está visualizando no portal; é o contexto obrigatório de todo documento gerado pelo portal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Uma gestora consegue liberar ou bloquear um documento para o portal em até 2 minutos, a partir da tela da Unidade Escolar, sem ajuda do suporte.
- **SC-002**: Um responsável consegue gerar um documento liberado em até 3 minutos após entrar na tela de Documentos do portal, sem contato com a secretaria.
- **SC-003**: 100% dos documentos gerados pelo portal contêm os dados do aluno e da turma em visualização (zero ocorrências de documento emitido com aluno/turma trocados em testes de aceite).
- **SC-004**: 100% das tentativas de acesso a documentos não liberados pelo portal são negadas (verificação de aceite incluindo caminhos diretos, não apenas a navegação visível).
- **SC-005**: Redução do volume de solicitações de documentos à secretaria nas escolas que aderirem (percebida em até 60 dias de uso), medida por relato das escolas participantes.

## Assumptions

- Por padrão, todos os documentos ficam liberados para escolas que já têm o portal com o módulo Documentos visível (comportamento opt-out), preservando o acesso atual até a gestora decidir restringir; a definição final do padrão será confirmada no planejamento.
- A categoria "Preenchimento Manual" ainda não possui modelos implementados no módulo interno (seção marcada como "Em breve"); a configuração por escola cobre a categoria de forma extensível, com efeito prático no portal quando os modelos existirem.
- O acesso ao portal segue as regras atuais de vínculo do responsável (credencial e alunos vinculados); esta funcionalidade não altera quem pode entrar no portal, apenas o que pode gerar lá dentro.
- As regras de aplicabilidade de cada documento (ex.: bloqueio do Boletim em turmas sem avaliação numérica, períodos avaliativos) são as mesmas do módulo interno de Documentos; o portal reutiliza essas regras com mensagens adaptadas ao responsável.
- Relatórios gerenciais (seção "Relatórios" do módulo interno) estão fora do escopo: a liberação no portal cobre apenas Documentos Oficiais e Preenchimento Manual.
- O layout da tela de Documentos do portal segue os padrões do Design System e o padrão de galeria do módulo interno; decisões visuais detalhadas pertencem ao plano.
