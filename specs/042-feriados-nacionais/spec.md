# Feature Specification: Feriados Nacionais Automáticos no Calendário

**Feature Branch**: `042-feriados-nacionais`

**Created**: 2026-09-27

**Status**: Implemented — pendente QA vivo (executar `quickstart.md` §1–§6 com ambiente)

**Input**: User description: "Na tela de Estrutura Acadêmica, aba Calendários: definir automaticamente os feriados nacionais do Brasil para os calendários do Ano Letivo via API pública gratuita (BrasilAPI), sem botão de importação — automático na criação do calendário. Feriados estaduais/municipais seguem manuais. Se a API falhar, o calendário é criado mesmo assim com aviso; calendários já criados exibem seus feriados normalmente (leitura nunca depende da API)."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — O objetivo principal da tela (configurar anos letivos, calendários e eventos) não muda; a semeadura automática é comportamento invisível que elimina uma subtarefa repetitiva sem adicionar elementos à interface.
- **PE-403** — A criação do calendário confirma o resultado com feedback imediato informando quantos feriados nacionais foram incluídos.
- **PE-402** — Se a fonte de feriados estiver indisponível, a mensagem explica o que aconteceu e qual é o próximo passo (salvar novamente para tentar), sem jargão técnico.
- **PE-405** — A falha da fonte externa é recuperável: o calendário é preservado e uma nova tentativa acontece automaticamente no próximo salvamento, sem ação dedicada do usuário.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Calendário nasce com os feriados nacionais (Priority: P1)

A secretária monta o Ano Letivo e cria um calendário (ex.: anual, de janeiro a dezembro). Ao salvar, os feriados nacionais compreendidos no intervalo do calendário já aparecem como eventos de recesso — visíveis em vermelho na grade mensal e excluídos da contagem de dias letivos — sem nenhum clique ou botão adicional. Feriados estaduais e municipais continuam sendo cadastrados manualmente, como hoje.

**Why this priority**: É o valor central da feature: elimina o cadastro manual repetitivo dos ~12 feriados nacionais por calendário, que hoje é obrigatório em todo ano letivo. Entrega valor sozinha.

**Independent Test**: Criar um Ano Letivo 2026 e um calendário de janeiro a dezembro; conferir que os feriados nacionais do ano aparecem como eventos de recesso na Visualização.

**Acceptance Scenarios**:

1. **Given** um calendário novo salvo com intervalo anual, **When** abre a Visualização, **Then** cada feriado nacional dentro do intervalo existe como evento do tipo recesso, em dia único, com descrição identificando o feriado nacional pelo nome oficial.
2. **Given** um calendário semestral (ex.: fevereiro a junho), **When** salvo, **Then** somente os feriados dentro do intervalo são criados; feriados fora do intervalo são ignorados.
3. **Given** um calendário cujo intervalo atravessa a virada do ano (ex.: dezembro/2025 a fevereiro/2026), **When** salvo, **Then** os feriados dos dois anos civis compreendidos no intervalo são criados.
4. **Given** o salvamento concluído, **When** o resultado é exibido, **Then** há confirmação informando quantos feriados nacionais foram incluídos (incluindo o caso de zero, quando nenhum feriado cai no período).

---

### User Story 2 - Expansão de datas completa os feriados sem ressuscitar exclusões (Priority: P1)

O usuário edita um calendário ampliando seu intervalo (ex.: de semestral para anual). Ao salvar, os feriados nacionais da faixa nova de datas são criados automaticamente. Feriados que o usuário excluiu manualmente não reaparecem, e edições que não ampliam o intervalo não duplicam nada.

**Why this priority**: Garante que o automatismo continue funcionando após a criação sem violar a autonomia do usuário sobre exclusões manuais. Entrega valor sozinha.

**Independent Test**: Criar calendário semestral, excluir manualmente um feriado, editar ampliando para o ano todo e conferir: feriados da faixa nova surgem, o excluído não volta, nenhum duplicado.

**Acceptance Scenarios**:

1. **Given** edição que amplia o intervalo do calendário, **When** salva, **Then** somente feriados das datas novas (fora do intervalo anterior) são criados.
2. **Given** um feriado excluído manualmente pelo usuário, **When** o calendário é editado e salvo sem ampliar o intervalo, **Then** o feriado excluído NÃO é recriado.
3. **Given** um calendário sem nenhum feriado nacional automático (semeadura anterior falhou), **When** qualquer salvamento, **Then** uma nova tentativa de semeadura do intervalo é executada (recuperação automática, sem botão).

---

### User Story 3 - Falha da fonte externa nunca bloqueia nem apaga (Priority: P1)

Quando o serviço público de feriados está indisponível, a criação/edição do calendário funciona normalmente (sem os feriados automáticos) com um aviso orientando a salvamento futuro. Calendários que já possuem feriados gravados continuam exibindo tudo normalmente, pois a leitura nunca consulta a fonte externa.

**Why this priority**: Protege a operação da escola contra indisponibilidade de terceiros e estabelece a garantia de que dado gravado não depende de serviço externo para ser exibido. Entrega valor sozinha.

**Independent Test**: Simular indisponibilidade da fonte (bloquear o host) e criar um calendário — salva com aviso; abrir um calendário antigo — feriados exibidos normalmente.

**Acceptance Scenarios**:

1. **Given** a fonte de feriados indisponível ou com timeout, **When** cria ou edita um calendário, **Then** o calendário é salvo normalmente e um aviso informa que os feriados não puderam ser carregados e que basta salvar novamente para tentar.
2. **Given** um calendário com feriados já gravados, **When** a fonte externa cai depois, **Then** grade mensal, indicadores de dias letivos e detalhes do dia exibem os feriados normalmente.
3. **Given** qualquer tela de leitura (Visualização, grade, indicadores), **When** renderizada, **Then** nenhuma consulta à fonte externa é realizada.

---

### User Story 4 - Calendários legados recebem os feriados (Priority: P2)

Calendários criados antes desta funcionalidade (sem feriados automáticos) são preenchidos uma única vez com os feriados nacionais de seus intervalos, respeitando eventos manuais já existentes (sem duplicar nem sobrescrever).

**Why this priority**: Uniformiza a base histórica sem exigir retrabalho manual escola por escola. É descopável: o fluxo novo (US1–US3) funciona sem ela.

**Independent Test**: Executar o preenchimento duas vezes seguidas sobre a mesma base — a segunda não cria nenhum evento novo.

**Acceptance Scenarios**:

1. **Given** calendários legados sem feriados automáticos, **When** o preenchimento é executado, **Then** cada um recebe os feriados nacionais do seu intervalo como eventos de recesso.
2. **Given** data com evento manual já existente, **When** o preenchimento passa por ela, **Then** o evento manual é preservado e nenhum duplicado é criado.
3. **Given** preenchimento já executado, **When** executado novamente, **Then** nada é alterado (idempotente).

### Edge Cases

- Feriado nacional que cai em sábado ou domingo: é registrado normalmente como evento de recesso (fidelidade ao calendário oficial; o dia já é não-letivo por ser fim de semana).
- Data do feriado com evento manual sobreposto (recesso, não-letivo ou dia letivo): o evento manual prevalece e nenhum duplicado é criado. Sobreposição apenas com período avaliativo não impede a criação do feriado.
- Datas facultativas retornadas pela fonte (ex.: Carnaval): são incluídas junto aos demais; a escola pode excluí-las manualmente pelo fluxo atual.
- Calendário sem nenhum feriado nacional no intervalo: salvamento informa zero feriados incluídos, sem erro.
- Fonte retorna ano sem feriados ou resposta vazia: tratado como zero feriados, sem erro e sem aviso de falha.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST preencher automaticamente os feriados nacionais ao salvar um calendário novo, buscando os feriados do(s) ano(s) civil(is) compreendido(s) no intervalo do calendário em fonte pública gratuita, sem exigir chave ou ação do usuário.
- **FR-002**: Cada feriado preenchido MUST ser gravado como evento do calendário do tipo recesso, em dia único, com descrição que identifique o feriado nacional pelo nome oficial e validade para todas as etapas (sem restrição de etapa).
- **FR-003**: O preenchimento MUST ignorar feriados fora do intervalo do calendário e MUST pular datas que já possuam evento sobreposto do tipo recesso, não-letivo ou dia letivo; sobreposição apenas com período avaliativo não impede a criação.
- **FR-004**: A edição de calendário que amplia o intervalo MUST preencher somente os feriados das datas novas; edições sem ampliação não devem recriar feriados excluídos manualmente nem duplicar existentes.
- **FR-005**: Se o calendário não possuir nenhum feriado nacional automático, qualquer salvamento MUST tentar novamente o preenchimento do intervalo (recuperação sem botão dedicado).
- **FR-006**: A falha ou indisponibilidade da fonte de feriados MUST NOT impedir o salvamento do calendário; o sistema MUST exibir aviso orientando novo salvamento para tentar novamente.
- **FR-007**: Nenhum fluxo de leitura (grade mensal, indicadores de dias letivos, detalhes do dia, documentos, relatórios) MUST depender da fonte externa; tudo é exibido a partir dos eventos gravados.
- **FR-008**: Cada feriado preenchido automaticamente MUST ser registrado na auditoria como criação de evento de calendário, com usuário, escola, data/hora e entidade afetada.
- **FR-009**: O salvamento MUST confirmar quantos feriados nacionais foram incluídos (incluindo zero), e o aviso de falha MUST seguir o padrão de feedback do sistema.
- **FR-010**: Feriados estaduais e municipais MUST permanecer exclusivamente manuais; esta funcionalidade não deve criar, sugerir ou alterar eventos além dos feriados nacionais da fonte.

### Key Entities

- **Evento de calendário — feriado nacional**: evento do tipo recesso, em dia único, cuja descrição identifica o feriado nacional pelo nome oficial; pertence a um calendário, vale para todas as etapas e é exibido na grade como dia não-letivo (vermelho), excluído da contagem de dias letivos.
- **Fonte pública de feriados nacionais**: serviço externo gratuito, sem autenticação, consultado somente no salvamento do calendário, por ano civil; inclui feriados fixos e móveis (ex.: Carnaval, Paixão de Cristo, Corpus Christi).
- **Marcador de semeadura**: o prefixo da descrição dos eventos automáticos identifica quais eventos foram gerados pela funcionalidade (base da regra de recuperação FR-005), sem necessidade de nova coluna ou tabela.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ao criar um calendário anual de 2026, todos os feriados nacionais oficiais do ano aparecem como eventos de recesso na Visualização, e o total de dias letivos do ano os exclui.
- **SC-002**: Um calendário semestral recebe somente o subconjunto de feriados do seu intervalo; um calendário que atravessa a virada do ano recebe os feriados dos dois anos.
- **SC-003**: Após excluir manualmente um feriado e salvar o calendário sem ampliar datas, o feriado permanece excluído; ao ampliar o intervalo, apenas os feriados das datas novas são adicionados e nenhum evento é duplicado.
- **SC-004**: Com a fonte externa indisponível, a criação de calendário é concluída com aviso orientando novo salvamento, e calendários existentes continuam exibindo seus feriados sem qualquer degradação.
- **SC-005**: O preenchimento de calendários legados pode ser executado duas vezes seguidas sem criar duplicados na segunda execução.
- **SC-006**: Cada feriado criado automaticamente possui registro de auditoria com usuário, escola, data/hora e entidade afetada.

## Assumptions

- Fonte adotada: BrasilAPI (`GET /api/feriados/v1/{ano}`), gratuita, sem chave e sem cadastro; inclui fixos e móveis calculados. Alternativas com chave paga ou nomes em inglês foram descartadas.
- O sistema é online-only; não há fallback local de feriados. A garantia contra indisponibilidade é arquitetural: a fonte é consultada somente na escrita (salvamento), nunca na leitura.
- Todo item retornado pela fonte para o ano é importado (incluindo pontos facultativos como Carnaval); a escola exclui manualmente o que não quiser, pelo fluxo atual de exclusão de eventos.
- Eventos automáticos usam o tipo recesso (decisão do solicitante): cor vermelha na grade, exclusão da contagem de dias letivos e visibilidade no detalhe do dia sem mudanças adicionais.
- Sem mudanças de banco de dados (reuso da tabela de eventos) e sem novas dependências.
- Permissão exigida é a já existente para calendários (`gestao-academica.estrutura-academica.calendarios`); auditoria segue o padrão best-effort do projeto.
- A US4 (legados) é descopável sem impacto nas US1–US3.
