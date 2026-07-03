# Feature Specification: Histórico Escolar — Painel do Aluno

**Feature Branch**: `004-historico-escolar`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "Na tela de Painel do Aluno, no card Histórico Escolar, deve apresentar as matrículas que o aluno possui no sistema, sejam elas ativas ou com outra situação de matrícula. Ao clicar, expandir um grupo de informações com: Ano Letivo, Turma, Dias Letivos, Subgrupo de Avaliação Numérica (tabela com Períodos, Disciplinas, Notas por bimestre, Faltas por bimestre, Média final, Total de Faltas, Frequência em %) e Subgrupo de Avaliação por Indicadores (disciplinas com indicadores, ao selecionar apresenta indicadores e períodos com a opção registrada pelo professor). Botão Adicionar Histórico com modal: Card Dados Gerais (Ano Letivo*, Carga horária total, Dias letivos anuais, Estado*, Município*, Unidade Escolar*, Etapa de Ensino*, Situação*, Observações) e Card Registros Escolares (Disciplina*, Média final*, Carga Horária anual, Checkbox Parte Diversificada, botão Adicionar Disciplina). Sumário de cargas horárias: BNCC, Parte Diversificada, Total."

## Clarifications

### Session 2026-06-29

- Q: Múltiplas linhas do Histórico Escolar podem ficar expandidas simultaneamente? → A: Apenas uma linha expandida por vez (ao expandir outra, a anterior recolhe).

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Profissional expande matrícula e consulta avaliações detalhadas (Priority: P1)

Um profissional da educação acessa o Painel do Aluno, seleciona um aluno e uma turma, e visualiza o card "Histórico Escolar". O card lista todas as matrículas do aluno — ativas, transferidas, desistentes ou em qualquer outra situação — ordenadas do ano mais recente para o mais antigo. Ao clicar em uma linha, ela se expande exibindo três blocos de informação — e apenas uma linha permanece expandida por vez (expandir outra recolhe a anterior). Os blocos são: dados básicos da matrícula (Ano Letivo, Turma, Dias Letivos), um subgrupo de Avaliação Numérica e um subgrupo de Avaliação por Indicadores.

No subgrupo **Avaliação Numérica**, o profissional vê uma tabela onde cada linha é uma disciplina e cada coluna é um período (bimestre). As células mostram a nota do aluno naquele período. A tabela inclui ainda colunas de Média Final, Total de Faltas e Frequência em % por disciplina. Se houver recuperações, a nota de recuperação substitui a nota original do período no cálculo da média.

No subgrupo **Avaliação por Indicadores**, o profissional vê uma lista de disciplinas que possuem indicadores de avaliação cadastrados. Ao selecionar uma disciplina, aparece uma tabela com os indicadores (linhas) × períodos (colunas), exibindo o nível de desenvolvimento registrado pelo professor para cada combinação.

**Why this priority**: É o núcleo da funcionalidade. Centraliza num único ponto toda a trajetória de avaliação do aluno — notas, frequência, indicadores de desenvolvimento — eliminando a necessidade de consultar diários de classe, relatórios ou módulos separados para cada ano letivo anterior.

**Independent Test**: Cadastrar um aluno com 2 matrículas em anos diferentes (uma ativa, uma transferida), notas em 3 disciplinas por 2 períodos cada, faltas por disciplina e 4 indicadores avaliados com níveis. Acessar o Painel do Aluno, selecionar o aluno e turma, expandir cada linha do Histórico Escolar e verificar se todos os dados aparecem corretos.

**Acceptance Scenarios**:

1. **Given** um aluno com matrícula ativa em 2026 e matrícula transferida em 2025, **When** o profissional acessa o card Histórico Escolar, **Then** ambas as matrículas são listadas com suas respectivas situações ("Ativo", "Transferido").
2. **Given** uma matrícula expandida com avaliações numéricas, **When** o profissional visualiza a tabela de Avaliação Numérica, **Then** cada disciplina exibe notas por período, média final, total de faltas e frequência em %.
3. **Given** uma matrícula expandida com indicadores avaliados, **When** o profissional seleciona uma disciplina no subgrupo de indicadores, **Then** a tabela exibe cada indicador com o nível registrado em cada período.
4. **Given** uma matrícula sem avaliações cadastradas, **When** o profissional expande a linha, **Then** os subgrupos exibem mensagem informando que não há dados registrados, sem quebrar a interface.

---

### User Story 2 — Profissional adiciona histórico escolar manual com disciplinas (Priority: P1)

O profissional clica no botão "Adicionar Histórico" disponível no card Histórico Escolar. Um modal se abre com duas seções: Dados Gerais e Registros Escolares.

Na seção **Dados Gerais**, o profissional preenche os campos obrigatórios (Ano Letivo, Estado, Município, Unidade Escolar, Etapa de Ensino, Situação) e opcionais (Carga horária total, Dias letivos anuais, Observações). O campo Estado é uma lista de Unidades Federativas (UF), e o campo Município é um texto livre para o nome da cidade onde o aluno estudou. Etapa de Ensino lista todas as etapas cadastradas no sistema.

Na seção **Registros Escolares**, o profissional seleciona uma disciplina do sistema, informa a Média Final e a Carga Horária anual, e define se a disciplina é Parte Diversificada (checkbox). Ao clicar "Adicionar Disciplina", a disciplina aparece numa lista abaixo, e o sistema recalcula automaticamente três indicadores:
- **Carga Horária BNCC**: soma das cargas horárias das disciplinas com o checkbox desmarcado
- **Carga Horária Parte Diversificada**: soma das cargas horárias das disciplinas com o checkbox marcado
- **Total**: BNCC + Parte Diversificada

O profissional pode adicionar quantas disciplinas desejar e remover qualquer uma da lista antes de salvar. Ao clicar "Salvar", o histórico completo (dados gerais + disciplinas) é persistido e aparece imediatamente na listagem do card.

**Why this priority**: Permite registrar históricos de anos anteriores ou de transferências entre escolas, essencial para a completude do prontuário acadêmico do aluno e para processos de classificação/reclassificação.

**Independent Test**: Abrir o modal, preencher todos os dados gerais obrigatórios, adicionar 3 disciplinas (2 BNCC, 1 Parte Diversificada), verificar o sumário de cargas, remover 1 disciplina, confirmar recálculo, salvar, e verificar que o novo registro aparece na listagem com todas as informações.

**Acceptance Scenarios**:

1. **Given** o modal "Adicionar Histórico" aberto, **When** o profissional preenche os dados gerais obrigatórios e adiciona uma disciplina com Média Final 8.5 e Carga Horária 800h (BNCC), **Then** a disciplina aparece na lista e o sumário mostra BNCC=800h, Diversificada=0h, Total=800h.
2. **Given** 2 disciplinas adicionadas (BNCC 800h + Diversificada 200h), **When** o profissional visualiza o sumário, **Then** mostra BNCC=800h, Diversificada=200h, Total=1000h.
3. **Given** 3 disciplinas na lista, **When** o profissional remove a segunda, **Then** o sumário recalcula automaticamente considerando apenas as disciplinas restantes.
4. **Given** todos os campos obrigatórios preenchidos e ao menos uma disciplina adicionada, **When** o profissional clica em Salvar, **Then** o histórico é persistido, o modal fecha, e o registro aparece na listagem do card.

---

### User Story 3 — Profissional visualiza histórico manual na listagem (Priority: P2)

Os históricos adicionados manualmente aparecem na mesma listagem do card Histórico Escolar, junto com as matrículas do sistema. Cada registro manual é identificável e também pode ser expandido para visualizar as disciplinas cadastradas com suas respectivas médias e cargas horárias. O profissional pode diferenciar visualmente um registro manual de uma matrícula do sistema.

**Why this priority**: Complementa a User Story 2 — não basta adicionar, é preciso visualizar o que foi adicionado. Porém, depende da implementação do modal de adição (US-2).

**Independent Test**: Após adicionar um histórico manual via modal, verificar que ele aparece na listagem do card, pode ser expandido, e exibe as disciplinas com médias e cargas horárias conforme cadastrado.

**Acceptance Scenarios**:

1. **Given** um histórico manual salvo com 2 disciplinas, **When** o profissional expande o registro na listagem, **Then** as disciplinas são exibidas com nome, Média Final, Carga Horária e indicador de Parte Diversificada.
2. **Given** a listagem contendo matrículas do sistema e registros manuais, **When** o profissional visualiza o card, **Then** ambos os tipos são apresentados de forma distinguível.

---

### Edge Cases

- Aluno sem nenhuma matrícula e sem nenhum histórico manual: card exibe "Nenhum registro de histórico escolar."
- Matrícula do sistema sem avaliações numéricas: subgrupo exibe "Nenhuma avaliação numérica registrada."
- Matrícula do sistema sem indicadores avaliados: subgrupo exibe "Nenhum indicador avaliado."
- Matrícula de uma turma sem disciplinas com indicadores cadastrados: lista de seleção do subgrupo de indicadores aparece vazia.
- Modal "Adicionar Histórico" com os campos obrigatórios não preenchidos: botão Salvar desabilitado com indicador visual dos campos pendentes.
- Remoção da última disciplina da lista no modal: sumário volta a 0h em todos os indicadores. Salvar ainda é permitido (dados gerais sem disciplinas é válido).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE listar todas as matrículas do aluno (qualquer situação), ordenadas por ano letivo decrescente.
- **FR-002**: O sistema DEVE listar todos os registros de histórico manual do aluno, junto com as matrículas do sistema, de forma distinguível.
- **FR-003**: Cada item da listagem DEVE ser expansível, revelando dados detalhados daquele registro.
- **FR-004**: Para matrículas do sistema, a expansão DEVE incluir o subgrupo "Avaliação Numérica" com tabela disciplina × período.
- **FR-005**: A tabela de Avaliação Numérica DEVE incluir Média Final, Total de Faltas e Frequência em % por disciplina.
- **FR-006**: Notas de recuperação DEVEM substituir a nota original do período no cálculo da média final.
- **FR-007**: Para matrículas do sistema, a expansão DEVE incluir o subgrupo "Avaliação por Indicadores" com seletor de disciplina e tabela indicador × período.
- **FR-008**: O botão "Adicionar Histórico" DEVE estar visível para profissionais com permissão de edição no Painel do Aluno, independentemente da configuração da escola.
- **FR-009**: O modal "Adicionar Histórico" DEVE conter seção de Dados Gerais com: Ano Letivo*, Estado* (select UF), Município*, Unidade Escolar*, Etapa de Ensino*, Situação*, Carga horária total, Dias letivos anuais, Observações.
- **FR-010**: O modal DEVE conter seção de Registros Escolares com seletor de Disciplina*, campo Média Final*, campo Carga Horária anual e checkbox Parte Diversificada.
- **FR-011**: O sistema DEVE permitir adicionar múltiplas disciplinas na seção Registros Escolares e remover qualquer uma antes de salvar.
- **FR-012**: O sistema DEVE exibir e atualizar em tempo real o sumário de cargas horárias (BNCC, Parte Diversificada, Total).
- **FR-013**: Ao salvar, o sistema DEVE persistir os dados gerais e todas as disciplinas vinculadas em uma única operação.

### Key Entities

- **Matrícula do Sistema**: Vínculo do aluno a uma turma em um ano letivo, com dados de avaliação numérica, frequência e indicadores de desenvolvimento. Inclui a situação atual (Ativo, Transferido, Desistente, etc.).
- **Histórico Manual**: Registro inserido pelo profissional contendo dados gerais de um ano letivo cursado externamente e uma lista de disciplinas com suas respectivas médias finais e cargas horárias.
- **Disciplina do Histórico Manual**: Vínculo entre um histórico manual e uma disciplina do sistema, contendo a média final obtida, a carga horária anual cursada e a classificação como Base Comum ou Parte Diversificada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O profissional localiza e expande qualquer matrícula do aluno em até 2 segundos após o card carregar.
- **SC-002**: A tabela de Avaliação Numérica exibe corretamente dados para alunos com até 15 disciplinas e 4 períodos sem degradação visual.
- **SC-003**: O sumário de cargas horárias no modal recalcula em tempo real — o resultado aparece em menos de 100ms após adicionar ou remover uma disciplina.
- **SC-004**: O profissional completa o cadastro de um histórico manual (dados gerais + 5 disciplinas) em menos de 3 minutos.
- **SC-005**: 100% dos históricos manuais salvos aparecem na listagem e podem ser expandidos para visualização das disciplinas.

## Assumptions

- As disciplinas disponíveis para seleção no modal e nos subgrupos de indicadores são as mesmas já cadastradas no sistema (`academico_disciplinas`).
- As etapas de ensino disponíveis no modal são as cadastradas no sistema (`academico_etapas_ensino`).
- Os anos letivos disponíveis no modal são os cadastrados para a escola (`academico_anos_letivos`).
- O campo Estado utiliza a lista padrão de Unidades Federativas brasileiras (siglas de 2 letras).
- O campo Município é texto livre — não depende de uma tabela de municípios.
- "Dias Letivos" no contexto da expansão da matrícula do sistema é derivado dos registros de frequência existentes.
- Os campos marcados com asterisco (*) são obrigatórios para salvar.
- A permissão para o botão "Adicionar Histórico" é controlada pelo recurso `gestao-usuarios.painel-aluno` com ação `editar`.
