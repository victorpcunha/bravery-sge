# Feature Specification: Tela de Rematrículas

**Feature Branch**: `035-rematriculas`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Tela de Rematrículas — tela para rematricular alunos de forma automatizada no intervalo entre o encerramento de um Ano Letivo e o início de outro (turmas do novo ano já criadas). Card Origem e Destino com dois subcards (origem: ano encerrado mais recente bloqueado, etapa, turma, situação só Aprovado/Reprovado; destino habilitado após situação: ano ativo bloqueado, etapa, turma, data de matrícula sem futuro; regra de consistência situação × etapa). Listagem de alunos com checkbox, selecionar todos/limpar, nome+CPF, select de turma de destino por aluno, lixeira para remover da lista. Botão Salvar Rematrícula no rodapé. Após salvar, matricular em Alunos Matriculados respeitando a Regra Geral de Matrícula. Superadmin com filtro de Unidade Escolar. Responsiva para mobile. Módulo Gestão Acadêmica."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — A tela tem um único objetivo principal: rematricular em lote os alunos de uma turma encerrada para turmas do novo ano letivo.
- **PE-102** — Título, subcards "Origem"/"Destino" e listagem comunicam de imediato o que a tela faz e o que o usuário pode fazer nela.
- **PE-103** — "Salvar Rematrícula" é a única ação principal, posicionada no rodapé; seleção, remoção e ajustes por aluno são ações secundárias.
- **PE-204** — Origem e Destino são agrupados em dois subcards do mesmo card, cada um com contexto próprio e independente.
- **PE-304** — O layout é de criação em lote (origem → destino → alunos → salvar), organizando os campos na ordem mental do preenchimento.
- **PE-402** — Combinações inválidas (situação × etapa) e falhas de validação da Regra Geral de Matrícula explicam o problema e como resolvê-lo.
- **PE-403** — Após salvar, o usuário recebe confirmação imediata com a quantidade de alunos rematriculados.
- **PE-404** — O salvamento em lote comunica estado de processamento e impede salvamentos duplicados enquanto executa.
- **PE-502** — Listagem vazia (sem alunos elegíveis) informa que nenhum aluno corresponde aos filtros e orienta o próximo passo.
- **PE-601** — A mesma tarefa (configurar origem/destino, selecionar alunos, salvar) permanece possível em dispositivos móveis.
- **PE-602** — Subcards e listagem adaptam-se ao espaço disponível sem perda de funcionalidade (tabela vira lista de cartões em telas estreitas).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configurar origem e destino com regra de consistência (Priority: P1)

O profissional abre a tela de Rematrículas, vê o Ano Letivo de Origem já preenchido e bloqueado (último ano encerrado) e o Ano Letivo de Destino já preenchido e bloqueado (ano ativo). Escolhe a Etapa e a Turma de origem e a Situação (só famílias Aprovado/Reprovado). A partir daí o subcard Destino é habilitado: escolhe a Etapa e a Turma de destino e a Data de Matrícula (sem permitir data futura). O sistema impede combinação inválida entre Situação e Etapa de Destino.

**Why this priority**: Sem origem e destino válidos não há listagem nem salvamento; a regra de consistência é o principal mecanismo anti-erro operacional. Entrega valor sozinha (configuração validada).

**Independent Test**: Abrir a tela, conferir anos bloqueados corretos, selecionar etapa/turma/situação de origem, verificar que o destino só habilita após a situação e que combinações inválidas são bloqueadas com explicação.

**Acceptance Scenarios**:

1. **Given** a tela carregada, **When** visualiza os anos, **Then** Origem exibe o último Ano Letivo encerrado (o mais recente, se houver mais de um) bloqueado para alteração e Destino exibe o Ano Letivo Ativo bloqueado para alteração.
2. **Given** o subcard Origem, **When** seleciona a etapa, **Then** só são listadas Etapas ativas do Ano Letivo de origem; **When** seleciona a turma, **Then** só são listadas turmas da etapa selecionada no ano de origem.
3. **Given** o filtro Situação, **When** abre as opções, **Then** aparecem apenas situações da família Aprovado (incluindo variações como Aprovado Concluinte e Aprovado por conselho) e da família Reprovado (incluindo Reprovado por frequência); Transferido, Desistente e Óbito não aparecem.
4. **Given** a Situação ainda não selecionada, **When** visualiza o subcard Destino, **Then** ele está desabilitado; **When** seleciona a Situação, **Then** o Destino é habilitado.
5. **Given** Situação da família Aprovado, **When** tenta escolher Etapa de Destino igual à de Origem, **Then** o sistema impede e explica que o aluno aprovado deve avançar de etapa.
6. **Given** Situação da família Reprovado, **When** tenta escolher Etapa de Destino diferente da de Origem, **Then** o sistema impede e explica que o aluno reprovado permanece na mesma etapa.
7. **Given** a Data de Matrícula, **When** tenta informar data futura, **Then** o sistema recusa e orienta a informar hoje ou data passada.

---

### User Story 2 - Selecionar alunos e ajustar destino individual (Priority: P1)

Após preencher Origem e Destino válidos, o profissional vê a listagem dos alunos da Turma de Origem na Situação filtrada, cada um com checkbox, nome e CPF. Pode marcar/desmarcar individualmente, usar "Selecionar Todos"/"Limpar Seleção", alterar a Turma de Destino de um aluno específico (dentro da mesma Etapa de Destino) e remover da lista (lixeira) alunos que deixaram a escola e não serão rematriculados.

**Why this priority**: É o núcleo operacional da rematrícula em lote; sem seleção/ajuste individual o profissional não consegue tratar exceções (saídas, turmas paralelas). Entrega valor sozinha.

**Independent Test**: Preencher origem+destino, conferir a lista, selecionar/limpar todos, alterar a turma de um aluno, remover outro pela lixeira e conferir o estado final da seleção.

**Acceptance Scenarios**:

1. **Given** Origem e Destino válidos, **When** a listagem carrega, **Then** exibe os alunos da Turma de Origem enquadrados na Situação selecionada, cada linha com checkbox, nome e CPF.
2. **Given** a listagem, **When** usa "Selecionar Todos", **Then** todos os alunos ficam marcados; **When** usa "Limpar Seleção", **Then** nenhum fica marcado.
3. **Given** um aluno listado, **When** visualiza sua Turma de Destino, **Then** ela vem pré-preenchida com a turma do subcard Destino; **When** altera, **Then** só pode escolher outra turma já criada da mesma Etapa de Destino.
4. **Given** um aluno que deixou a escola, **When** clica na lixeira da linha, **Then** ele sai da listagem e não será rematriculado (sem excluir nenhum dado existente).
5. **Given** nenhum aluno elegível para os filtros, **When** a listagem carrega, **Then** exibe estado vazio informando que não há alunos e orientando a revisar os filtros.

---

### User Story 3 - Salvar rematrícula e ver confirmação (Priority: P1)

Com alunos selecionados, o profissional clica em "Salvar Rematrícula" no rodapé da página. O sistema cria as matrículas no novo Ano Letivo (Etapa/Turma de destino de cada aluno, Data de Matrícula definida), respeitando a Regra Geral de Matrícula, e confirma quantos alunos foram rematriculados. Os novos vínculos passam a aparecer em Alunos Matriculados.

**Why this priority**: É a entrega de valor final — sem o salvamento, todo o resto é preparação. Entrega valor sozinha.

**Independent Test**: Selecionar alunos, salvar, conferir mensagem de confirmação e verificar os novos vínculos em Alunos Matriculados com data, etapa e turma corretas.

**Acceptance Scenarios**:

1. **Given** alunos selecionados e destino válido, **When** clica em "Salvar Rematrícula", **Then** o sistema cria uma matrícula por aluno no Ano Letivo de Destino com a Data de Matrícula informada e a Etapa/Turma de destino de cada um.
2. **Given** o salvamento concluído, **When** visualiza o retorno, **Then** recebe confirmação imediata com a quantidade de alunos rematriculados.
3. **Given** o salvamento concluído, **When** abre Alunos Matriculados, **Then** os alunos salvos aparecem vinculados às turmas de destino no novo ano.
4. **Given** um aluno que violaria a Regra Geral de Matrícula (duplicidade em turma Curricular ou conflito de turno/dias de funcionamento), **When** salva, **Then** ele não é matriculado e o retorno explica o motivo por aluno, sem impedir os demais.
5. **Given** o salvamento em andamento, **When** tenta clicar novamente em salvar, **Then** o botão indica processamento e não permite disparo duplicado.

---

### User Story 4 - Superadmin escolhe a Unidade Escolar (Priority: P2)

O Superadmin abre a tela e primeiro seleciona a Unidade Escolar; todos os anos, etapas, turmas e alunos passam a refletir apenas aquela escola.

**Why this priority**: Necessário para o perfil com acesso multi-escola, mas não afeta o fluxo principal dos gestores de escola única. Entrega valor sozinha.

**Independent Test**: Entrar como Superadmin, trocar a Unidade Escolar e conferir que origem, destino e listagem recarregam com os dados da escola escolhida.

**Acceptance Scenarios**:

1. **Given** usuário Superadmin, **When** abre a tela, **Then** há um seletor de Unidade Escolar antes dos demais filtros.
2. **Given** a troca de escola, **When** confirma, **Then** Origem, Destino e listagem são recarregados e qualquer seleção anterior incompatível é limpa.

---

### Edge Cases

- Não existe Ano Letivo encerrado: Origem não tem ano válido — a tela informa que a rematrícula exige um ano encerrado e bloqueia o fluxo.
- Não existe Ano Letivo ativo: Destino não tem ano válido — a tela informa que é preciso um ano ativo com turmas criadas e bloqueia o fluxo.
- Turma de origem sem alunos na Situação filtrada: listagem exibe estado vazio orientando a revisar os filtros.
- Etapa de Destino sem turmas criadas no novo ano: destino não pode ser concluído — a tela informa que é preciso criar turmas antes de rematricular.
- Aluno já matriculado no Ano de Destino (re-execução do lote): ele não gera matrícula duplicada — é sinalizado na lista ou excluído do salvamento com explicação.
- Aluno "Aprovado Concluinte" de etapa final sem etapa seguinte na escola (ex. concluiu o último ano ofertado): o destino não oferece etapa válida — o aluno não é rematriculado e o motivo é explicado.
- Nenhum aluno selecionado ao salvar: o sistema recusa o salvamento e orienta a selecionar ao menos um aluno.
- Falha parcial no salvamento (alguns alunos salvos, outros não): o retorno discrimina por aluno o que foi criado e o que falhou, com motivo e próximo passo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir o Ano Letivo de Origem pré-selecionado e bloqueado, correspondente ao Ano Letivo encerrado mais recente.
- **FR-002**: O sistema DEVE listar na Etapa de Origem apenas as Etapas ativas do Ano Letivo de origem.
- **FR-003**: O sistema DEVE listar na Turma de Origem apenas as turmas da etapa selecionada no Ano Letivo de origem.
- **FR-004**: O sistema DEVE listar no filtro Situação apenas situações das famílias Aprovado (incluindo Aprovado Concluinte e Aprovado por conselho de classe) e Reprovado (incluindo Reprovado por frequência); Transferido, Desistente e Óbito NÃO podem aparecer.
- **FR-005**: O sistema DEVE manter o subcard Destino desabilitado até que a Situação seja selecionada.
- **FR-006**: O sistema DEVE exibir o Ano Letivo de Destino pré-selecionado e bloqueado, correspondente ao Ano Letivo Ativo.
- **FR-007**: O sistema DEVE listar na Etapa de Destino apenas as Etapas ativas do Ano Letivo de destino.
- **FR-008**: O sistema DEVE listar na Turma de Destino apenas as turmas já criadas para a etapa selecionada no Ano Letivo de destino.
- **FR-009**: O sistema DEVE recusar Data de Matrícula futura, orientando a informar a data atual ou passada.
- **FR-010**: O sistema DEVE impedir Etapa de Destino igual à de Origem quando a Situação for da família Aprovado, explicando que o aluno deve avançar de etapa.
- **FR-011**: O sistema DEVE impedir Etapa de Destino diferente da de Origem quando a Situação for da família Reprovado, explicando que o aluno permanece na mesma etapa.
- **FR-012**: O sistema DEVE exibir a listagem de alunos somente após Origem e Destino válidos, com um aluno por linha contendo checkbox de seleção, nome e CPF.
- **FR-013**: O sistema DEVE oferecer "Selecionar Todos" e "Limpar Seleção" para a listagem de alunos.
- **FR-014**: O sistema DEVE pré-preencher a Turma de Destino de cada aluno com a turma do subcard Destino e permitir alteração individual apenas para outra turma já criada da mesma Etapa de Destino.
- **FR-015**: O sistema DEVE permitir remover um aluno da listagem (lixeira) sem excluir nenhum dado existente; o aluno removido não é rematriculado.
- **FR-016**: O sistema DEVE exibir o botão "Salvar Rematrícula" no rodapé da página como ação principal.
- **FR-017**: O sistema DEVE, ao salvar, criar uma matrícula por aluno selecionado no Ano Letivo de Destino, com a Data de Matrícula informada e a Etapa/Turma de destino de cada aluno, aplicando a Regra Geral de Matrícula (sem duplicidade em turmas Curriculares, sem conflito de turno/dias de funcionamento).
- **FR-018**: O sistema DEVE recusar o salvamento quando nenhum aluno estiver selecionado, orientando a selecionar ao menos um.
- **FR-019**: O sistema DEVE confirmar o salvamento com a quantidade de alunos rematriculados e discriminar por aluno eventuais não-criações com motivo e próximo passo.
- **FR-020**: O sistema DEVE registrar cada rematrícula criada com responsável, escola, data/hora e vínculo de origem, permitindo rastreabilidade posterior.
- **FR-021**: O sistema DEVE exibir seletor de Unidade Escolar para usuários Superadmin, recarregando origem, destino e listagem ao trocar de escola.
- **FR-022**: A tela DEVE residir no módulo Gestão Acadêmica.
- **FR-023**: A tela DEVE ser totalmente utilizável em dispositivos móveis (filtros, seleção por aluno e salvamento sem perda de funcionalidade).

### Key Entities

- **Lote de Rematrícula**: conjunto de origem (ano, etapa, turma, situação) + destino (ano, etapa, turma, data) + alunos selecionados, processado em um salvamento.
- **Aluno Elegível**: aluno da Turma de Origem enquadrado na Situação filtrada e ainda não matriculado no Ano de Destino, passível de seleção.
- **Destino Individual**: Etapa/Turma de destino efetiva de cada aluno (padrão = turma do subcard Destino, ajustável por aluno dentro da mesma etapa).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um profissional completa a rematrícula de uma turma típica (até 40 alunos) em menos de 5 minutos, do carregamento da tela à confirmação.
- **SC-002**: 100% das matrículas criadas aparecem em Alunos Matriculados com Data de Matrícula, Etapa e Turma de destino corretas.
- **SC-003**: Zero matrículas criadas com combinação inválida de Situação × Etapa (aprovado na mesma etapa ou reprovado em etapa diferente).
- **SC-004**: Zero matrículas duplicadas em turmas Curriculares e zero violações de turno/dias de funcionamento criadas pelo lote.
- **SC-005**: 100% dos alunos não rematriculados por violação de regra recebem motivo visível e próximo passo, sem bloquear os demais.
- **SC-006**: A tarefa completa é executável em um celular (largura 360px) sem rolagem horizontal e sem perda de função.

## Assumptions

- A "Situação" de cada aluno é a situação registrada em sua matrícula de origem no Ano Letivo encerrado.
- Família "Aprovado" = Aprovado, Aprovado por conselho de classe, Aprovado concluinte; família "Reprovado" = Reprovado, Reprovado por frequência (conforme mapeamento da Situação Final do Censo).
- A Data de Matrícula vem pré-preenchida com a data atual.
- Alunos já matriculados no Ano Letivo de Destino não geram nova matrícula (são sinalizados/excluídos do lote com explicação).
- A "Regra Geral de Matrícula" é a validação já aplicada à matrícula individual (sem duplicidade em turmas Curriculares, sem conflito de turno/dias de funcionamento) — nenhuma regra nova de matrícula é criada.
- Controle de acesso e auditoria seguem os padrões do sistema (permissão do módulo de matrículas/gestão acadêmica; responsável, escola e data/hora registrados).
- "Último Ano Letivo encerrado" = o encerrado com data de encerramento mais recente; "Ano Letivo Ativo" = o ano com status ativo (se houver mais de um ativo, o mais recente).
