# Feature Specification: Gestão de Faturamento

**Feature Branch**: `043-gestao-faturamento`

**Created**: 2026-09-29

**Status**: Draft

**Input**: User description: "Gestão de Faturamento — novo módulo para organizar e acompanhar a cobrança de mensalidades vinculadas às matrículas dos alunos: configuração padrão, geração de planos em massa com revisão, acompanhamento de mensalidades previstas/pagas/em aberto/vencidas, central de pendências, exceções individuais, baixa manual, visão financeira da matrícula, auditoria e preparação do domínio para futura integração com provedores de pagamento (sem incorporar regras de provedor nesta especificação)."

## Clarifications

### Session 2026-09-29

- Q: Valor padrão da mensalidade — único ou diferenciado? → A: Valor por etapa de ensino — a configuração permite definir para quais etapas ela se aplica, com fallback para um valor geral.
- Q: Saída do aluno — destino das mensalidades futuras não pagas? → A: Pergunta no momento da saída — o fluxo da movimentação oferece "cancelar futuras não pagas" com confirmação (opção marcada por padrão).
- Q: Responsável financeiro — um por plano ou múltiplos? → A: Um único responsável por plano — a secretaria escolhe qual vínculo é o financeiro; a troca é auditada.

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — Cada uma das três áreas conceituais (Visão Geral, Cobranças, Configuração) tem um objetivo principal próprio e testável separadamente.
- **PE-102** — Títulos e descrições devem deixar evidente o propósito de cada tela (ex.: "quanto estava previsto, recebido, em aberto e vencido").
- **PE-103** — A ação principal de cada tela é única e destacada ("Gerar planos", "Registrar pagamento", "Salvar configuração").
- **PE-201 / PE-202 / PE-203** — Indicadores financeiros (previsto, recebido, em aberto, vencido) têm prioridade visual e ficam acima da dobra na Visão Geral.
- **PE-204** — Plano, mensalidades, responsável financeiro e pendências são agrupados por contexto.
- **PE-301** — A Visão Geral usa layout de monitoramento (indicadores + pendências que exigem ação).
- **PE-302** — Cobranças usa layout de listagem (localizar, filtrar, selecionar mensalidades para baixa em massa).
- **PE-304** — Configuração de Faturamento usa layout de cadastro/edição.
- **PE-305** — A geração em massa usa fluxo em etapas dependentes (configurar → abrangência → revisão → confirmar), pois cada etapa influencia a seguinte; a justificativa está registrada nesta spec (§7 do documento de origem).
- **PE-401** — Substituição de planos existentes, cancelamentos e isenções em massa exigem confirmação explícita.
- **PE-402** — Mensagens de erro orientam a correção (ex.: matrícula sem responsável financeiro indica onde vincular).
- **PE-403 / PE-404** — Geração em massa informa quantidades processadas; operações longas comunicam progresso.
- **PE-9xx** — Situação da matrícula/mensalidade é sempre textual ("Em dia", "Vencida", "Sem plano"), nunca apenas cor.


## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configurar o faturamento do ano letivo em massa (Priority: P1)

A secretaria inicia o ano letivo com centenas de matrículas ativas sem plano de cobrança. Ela abre a Configuração de Faturamento, define valor padrão, dia de vencimento e período, seleciona a abrangência (todas as matrículas elegíveis do ano letivo), revisa o resumo (quantas serão configuradas, quantas já possuem plano, quantas têm inconsistência, quantas mensalidades e qual valor total previsto), escolhe preservar configurações existentes e confirma. O sistema gera os planos e mensalidades.

**Why this priority**: É o critério principal de sucesso da funcionalidade — sem isso, a secretaria volta ao fluxo aluno-por-aluno e o módulo perde seu propósito.

**Independent Test**: Pode ser testado criando um ano letivo com matrículas sem plano, executando a geração em massa e verificando que cada matrícula elegível passa a ter plano + mensalidades corretas, sem abrir nenhuma matrícula individualmente.

**Acceptance Scenarios**:

1. **Given** 387 matrículas elegíveis sem plano e uma configuração padrão válida, **When** a secretaria confirma a geração em massa com "manter existentes", **Then** 387 planos são criados com mensalidades do mês inicial padrão até o mês final, e o resumo informa quantidades e valor total previsto.
2. **Given** 22 matrículas já possuem plano diferente do padrão, **When** a secretaria gera em massa com a opção padrão, **Then** essas 22 mantêm suas configurações e o sistema informa que foram preservadas.
3. **Given** a secretaria escolhe "substituir existentes", **When** confirma, **Then** o sistema exige confirmação explícita adicional e somente então substitui.
4. **Given** matrículas com inconsistência (sem responsável financeiro quando exigido, matrícula inativa), **When** a geração é revisada, **Then** essas matrículas são listadas como "não afetadas" com o motivo, sem bloquear as demais.

---

### User Story 2 - Acompanhar a situação financeira na Visão Geral (Priority: P1)

A gestora abre a Visão Geral do Faturamento e vê imediatamente, no contexto do ano letivo e unidade: previsto, recebido, em aberto e vencido no período, além da central de pendências (matrículas sem plano, mensalidades vencidas, responsáveis ausentes). Cada pendência leva direto à ação correspondente.

**Why this priority**: É o uso diário do módulo; responde "quanto entrou, quanto falta, o que exige atenção" sem exigir caça manual.

**Independent Test**: Pode ser testado com planos e mensalidades em diversas situações, verificando que os quatro indicadores e a lista de pendências refletem os dados e que cada pendência navega para a ação correta.

**Acceptance Scenarios**:

1. **Given** mensalidades pagas, pendentes futuras e pendentes com vencimento passado no período, **When** a gestora abre a Visão Geral, **Then** os indicadores Previsto, Recebido, Em aberto e Vencido exibem os valores corretos do contexto selecionado.
2. **Given** 12 matrículas ativas sem plano, **When** a gestora vê a pendência "12 matrículas sem plano de cobrança", **Then** a ação "Configurar em massa" inicia o fluxo de geração com essas matrículas como abrangência.
3. **Given** mensalidade pendente com vencimento anterior a hoje, **When** exibida, **Then** aparece textualmente como "Vencida" (estado derivado, não armazenado).
4. **Given** troca de ano letivo ou unidade no contexto, **When** alterado, **Then** indicadores e pendências são recalculados para o novo contexto.

---

### User Story 3 - Acompanhar cobranças e registrar pagamentos manualmente (Priority: P2)

A secretaria filtra as mensalidades (ano, turma, aluno, responsável, situação, competência), seleciona as três parcelas que um responsável pagou (agosto, setembro, outubro) e registra o pagamento em uma única operação informando data, forma e observação. Depois localiza a matrícula e confirma que as três aparecem como pagas.

**Why this priority**: Baixa manual é o fechamento do ciclo do MVP (configurar → gerar → acompanhar → baixar); sem ela o módulo só gera dívidas sem registrar recebimentos.

**Independent Test**: Pode ser testado gerando um plano, filtrando suas mensalidades na tela de Cobranças e registrando pagamento em massa, verificando situação, data e forma persistidas.

**Acceptance Scenarios**:

1. **Given** 3 mensalidades pendentes do mesmo plano, **When** a secretaria seleciona as 3 e registra pagamento com data, forma e observação, **Then** as 3 passam a "Pago" com os mesmos dados de baixa e o resumo informa "3 mensalidades baixadas".
2. **Given** mensalidades já pagas ou canceladas na seleção, **When** registrada a baixa em massa, **Then** elas são excluídas da operação e o sistema informa quais não foram afetadas e por quê.
3. **Given** filtros por turma + situação "Vencidas", **When** aplicados, **Then** somente mensalidades pendentes com vencimento passado daquela turma são listadas, com aluno, turma, responsável, competência, vencimento e valor.
4. **Given** mensalidade isenta ou cancelada, **When** listada, **Then** sua situação textual a distingue de "Pago" e ela não compõe os totais de recebido.

---

### User Story 4 - Tratar exceções individuais e ver a situação financeira da matrícula (Priority: P3)

Um aluno tem bolsa (valor diferente) e outro entrou em agosto (período diferente). A secretaria ajusta cada plano individualmente, marcando claramente a divergência em relação ao padrão, e visualiza a partir da matrícula o plano, mensalidades, pagamentos e pendências daquele aluno.

**Why this priority**: Exceções são o complemento do fluxo em massa; a visão na matrícula evita uma segunda regra financeira paralela.

**Independent Test**: Pode ser testado alterando valor/vencimento de um plano e verificando o indicador de exceção, e abrindo a visão financeira a partir da matrícula.

**Acceptance Scenarios**:

1. **Given** um plano gerado pelo padrão, **When** a secretaria altera o valor da mensalidade, **Then** o plano passa a indicar textualmente que diverge do padrão e a auditoria registra alteração com usuário, data e valores.
2. **Given** matrícula criada em agosto com mês inicial padrão = janeiro, **When** a secretaria gera o plano ajustando o mês inicial para agosto, **Then** são criadas apenas as mensalidades de agosto a dezembro, sem janeiro–julho.
3. **Given** movimentação de saída encerrando a obrigação de cobrança, **When** processada, **Then** mensalidades futuras não pagas recebem situação de cancelada (permanecem rastreáveis) e pagamentos já realizados são preservados.
4. **Given** usuário autorizado na tela da matrícula, **When** acessa a situação financeira, **Then** vê plano, valor, período, responsável, mensalidades, pagamentos e pendências — os mesmos dados do módulo, sem divergência.

---

### User Story 5 - Definir o padrão de cobrança da escola (Priority: P2)

A gestora abre a Configuração de Faturamento, define para um ano letivo e unidade o valor padrão, dia de vencimento, mês inicial e mês final, e salva. Nenhuma matrícula existente é alterada por esse salvamento.

**Why this priority**: Pré-requisito lógico da geração em massa; testável isoladamente como cadastro.

**Independent Test**: Pode ser testado salvando uma configuração e verificando que ela é reutilizada como default na geração em massa sem alterar planos existentes.

**Acceptance Scenarios**:

1. **Given** configuração válida (valor > 0, dia 1–28/31 conforme regra, mês inicial ≤ mês final), **When** salva, **Then** ela fica disponível como padrão na geração em massa daquele ano/unidade.
2. **Given** planos já gerados, **When** a configuração padrão é alterada, **Then** nenhum plano existente muda e o sistema informa que a alteração vale apenas para novas gerações.
3. **Given** usuário sem permissão de configuração, **When** tenta salvar, **Then** recebe mensagem de falta de permissão conforme o padrão do sistema.

---

### Edge Cases

- O que acontece quando uma matrícula elegível não possui responsável financeiro vinculado e a operação exige um? Ela aparece como inconsistência na revisão ("responsável ausente") e não impede as demais; a pendência direciona ao vínculo de responsável.
- Como o sistema trata geração em massa executada duas vezes seguidas (duplo clique / reenvio)? A operação é idempotente por padrão: matrículas já configuradas são preservadas e relatadas, sem duplicar planos nem mensalidades (competência única por plano).
- O que acontece quando o dia de vencimento não existe no mês (ex.: dia 31 em fevereiro)? Aplica-se a regra documentada do domínio (último dia do mês) de forma consistente em todas as mensalidades.
- Como ficam as mensalidades quando a matrícula muda de turma (remanejamento) no mesmo ano? O plano permanece vinculado à matrícula (não à turma); a exibição passa a refletir a turma atual.
- O que acontece quando o ano letivo é encerrado com mensalidades pendentes? Elas permanecem como pendentes/vencidas no contexto daquele ano; o novo ano exige nova geração (sem herança automática).
- Como o sistema trata exclusão de matrícula com plano? O plano e o histórico financeiro são preservados conforme a regra de auditoria (não apagar pagamentos); novas cobranças cessam.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE oferecer o módulo "Gestão de Faturamento" com navegação própria, separado do módulo Escolas, organizado nas áreas conceituais Visão Geral, Cobranças e Configuração de Faturamento.
- **FR-002**: O sistema DEVE controlar acesso ao módulo por permissões próprias (visualizar/criar/editar/excluir por recurso do faturamento), respeitando o escopo de escola/unidade do usuário.
- **FR-003**: A Visão Geral DEVE exibir os indicadores Previsto, Recebido, Em aberto e Vencido referentes ao contexto selecionado (ano letivo, unidade, período).
- **FR-004**: A Visão Geral DEVE apresentar uma central de pendências (matrículas sem plano, mensalidades vencidas, configuração incompleta, responsável financeiro ausente quando impeditivo) com ação direta para cada pendência.
- **FR-005**: O sistema DEVE permitir cadastrar Configurações de Faturamento por escola/unidade e ano letivo contendo título identificador (definido pela escola), valor padrão da mensalidade, dia padrão de vencimento, mês inicial padrão e mês final, sendo possível definir a quais etapas de ensino cada configuração se aplica; uma configuração sem etapas vinculadas vale como padrão geral (fallback) para as etapas não cobertas.
- **FR-006**: Salvar ou alterar a configuração padrão NÃO DEVE modificar planos ou mensalidades já existentes.
- **FR-007**: O sistema DEVE permitir gerar planos de cobrança em massa com abrangência configurável: todas as matrículas elegíveis, por turma, por etapa, por unidade (conforme permissão) ou seleção manual.
- **FR-008**: Antes de confirmar a geração em massa, o sistema DEVE apresentar revisão informando: quantidade de matrículas, quantas seguirão o padrão, quantas já possuem configuração, quantas têm inconsistência, quantas não serão afetadas, quantidade estimada de mensalidades e valor total previsto quando calculável.
- **FR-009**: A geração em massa DEVE preservar configurações existentes por padrão e informar a quantidade afetada; a substituição exige opção explícita + confirmação adicional.
- **FR-010**: O sistema DEVE representar o Plano de Cobrança vinculado à matrícula (1 plano por matrícula no contexto letivo) com matrícula, escola, ano letivo, um único responsável financeiro, valor, dia de vencimento, período, quantidade de mensalidades e situação; a troca do responsável DEVE ser auditada.
- **FR-011**: Cada plano DEVE gerar mensalidades individualizadas por competência (ex.: ago/2026–dez/2026), cada uma com plano, competência, número da parcela, valor, vencimento, situação, data/forma de baixa quando houver; a competência DEVE ser única dentro do plano.
- **FR-012**: As situações armazenadas da mensalidade DEVEM ser no mínimo: Pendente, Pago, Cancelado, Isento; "Vencida" DEVE ser derivada (pendente + vencimento passado), não um estado armazenado.
- **FR-013**: A matrícula no faturamento DEVE exibir situação textual explícita: Em dia, Pendente, Vencida ou Sem plano (esta última obrigatória para não ocultar matrículas sem configuração).
- **FR-014**: A tela de Cobranças DEVE filtrar por ano letivo, unidade (conforme permissão), turma, aluno, responsável, situação (Todas/Pagas/Em aberto/Vencidas/Canceladas/Isentas) e competência/período, exibindo aluno, turma, matrícula, responsável, competência, vencimento, valor, situação e data de pagamento quando aplicável.
- **FR-015**: O sistema DEVE permitir baixa manual de uma ou várias mensalidades em uma única operação, informando data do pagamento, forma de pagamento e observação opcional; registros já pagos/cancelados/isentos DEVEM ser excluídos da operação com aviso.
- **FR-016**: O sistema DEVE permitir tratar exceções individuais: valor diferente, vencimento diferente, mês inicial diferente, alteração de responsável, isenção e cancelamento de mensalidade, indicando textualmente quando a configuração diverge do padrão.
- **FR-017**: A matrícula DEVE oferecer visão da sua situação financeira (plano, valor, período, responsável, mensalidades, pagamentos, pendências, vencimentos) consumindo o mesmo domínio do módulo, sem regra paralela.
- **FR-018**: O responsável financeiro DEVE reutilizar os relacionamentos existentes de pessoas/responsáveis; nenhuma nova entidade de pessoa DEVE ser criada para o faturamento.
- **FR-019**: Movimentação de saída que encerre a obrigação de cobrança DEVE oferecer, no próprio fluxo da movimentação, a opção "cancelar mensalidades futuras não pagas" com confirmação (opção marcada por padrão); mensalidades canceladas permanecem rastreáveis e pagamentos já realizados são preservados.
- **FR-020**: Nova matrícula durante o ano DEVE poder gerar plano com mês inicial ajustável (padrão = mês de entrada), sem gerar competências anteriores ao mês inicial.
- **FR-021**: Operações relevantes (criação/alteração de plano, geração/alteração em massa, baixa, cancelamento, isenção, troca de responsável, alteração de configuração) DEVEM ser auditáveis com usuário, escola, data/hora, ação e registros afetados, no padrão de auditoria do sistema.
- **FR-022**: O domínio DEVE reservar campos separados para informações de integração externa futura (identificador externo do cliente/cobrança, situação externa, URL externa, data de sincronização) sem expor conceitos de provedor ao usuário e sem tornar o provedor fonte das regras financeiras.
- **FR-023**: Ações em massa (gerar, alterar, baixar, cancelar, isentar, exportar) DEVEM informar quantidade, impacto esperado, registros não afetados e exceções; operações destrutivas exigem confirmação.
- **FR-024**: Nenhum conceito de provedor de pagamento (conta externa, API key, customer/payment externo, webhook, Pix Automático, split, taxas, onboarding regulatório) DEVE aparecer como requisito ou regra da experiência principal.

### Key Entities

- **Plano de Cobrança**: configuração financeira de uma matrícula em um ano letivo (um único responsável financeiro, valor, dia de vencimento, período, quantidade de mensalidades, situação); relação Matrícula → Plano → Mensalidades; o aluno não é o vínculo principal.
- **Mensalidade**: cobrança de uma competência específica dentro de um plano (competência única por plano, número da parcela, valor, vencimento, situação Pendente/Pago/Cancelado/Isento, data/forma de baixa); "Vencida" é derivada.
- **Configuração de Faturamento**: padrão por escola/unidade e ano letivo (valor, dia de vencimento, mês inicial, mês final) com abrangência por etapas de ensino — cada configuração define a quais etapas se aplica, e uma configuração sem etapas vinculadas serve de padrão geral para as etapas não cobertas; nunca altera planos existentes ao ser salva.
- **Responsável Financeiro**: pessoa já cadastrada e vinculada ao aluno pelos relacionamentos existentes; ausência impeditiva vira pendência explícita.
- **Matrícula (existente)**: âncora do plano; entrada define o mês inicial padrão e saída encerra obrigações futuras com rastreabilidade.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Uma secretaria configura o faturamento de um ano letivo com 300+ matrículas em uma única operação em massa (configurar + revisar + confirmar) sem abrir nenhuma matrícula individualmente.
- **SC-002**: 100% das matrículas ativas aparecem na visão operacional do faturamento, inclusive as sem plano (situação "Sem plano" explícita) — nenhuma matrícula desaparece da visão.
- **SC-003**: Uma baixa de 3 mensalidades de um responsável é registrada em uma única operação, e as 3 passam a constar como pagas com data, forma e observação.
- **SC-004**: Após uma geração em massa com planos preexistentes, 0 planos existentes são alterados sem confirmação explícita de substituição.
- **SC-005**: A Visão Geral responde às 5 perguntas (previsto, recebido, em aberto, vencido, pendências) em uma única tela, com valores consistentes com a base de mensalidades do contexto selecionado.
- **SC-006**: Toda operação relevante (geração em massa, baixa, cancelamento, isenção, alteração de plano) possui registro de auditoria com usuário, escola, data/hora e registros afetados.
- **SC-007**: Nenhuma tela do MVP exige ou exibe credenciais, contas ou identificadores de provedores de pagamento.

## Assumptions

- O vínculo aluno ↔ responsável reutiliza o relacionamento existente de responsáveis do sistema; o faturamento não cria entidade própria de pessoa.
- O mês final padrão de um plano é dezembro do ano letivo, salvo configuração em contrário; o mês inicial padrão de nova matrícula é o mês de entrada.
- Na geração em massa, cada matrícula utiliza a configuração cuja abrangência de etapas inclui a etapa da matrícula; havendo sobreposição, prevalece a configuração mais específica; sem correspondência, aplica-se a configuração geral (fallback).
- Dia de vencimento inexistente no mês (ex.: 31 em fevereiro) resolve-se para o último dia do mês, aplicado consistentemente.
- "Elegível" para geração em massa significa matrícula ativa no ano letivo/unidade do contexto, sem plano vigente — matrículas inativas ou com plano são classificadas como não afetadas/preservadas.
- Escopo por escola, permissões por recurso (`modulo.recurso`) e auditoria seguem os padrões já estabelecidos do Bravery; detalhes de implementação serão definidos no plan.
- Integração com provedores de pagamento é fase futura com especificação própria; este MVP apenas reserva campos de integração externa separados do domínio.
- Negociação de dívida, acordos, bolsas com regras próprias, conciliação bancária, contabilidade e contas a pagar estão fora do MVP.
