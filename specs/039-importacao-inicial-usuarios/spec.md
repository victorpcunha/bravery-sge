# Feature Specification: Importação Inicial de Usuários

**Feature Branch**: `039-importacao-inicial-usuarios`

**Created**: 2026-09-17

**Status**: Draft

**Input**: User description: "Precisamos definir uma forma de importar arquivos (importação inicial de uma nova escola), para adicionar os usuários da Unidade. Deve ser criado um novo módulo (Importação e Exportação). Dentro dele será mantido a tela de Censo Escolar. Além disso, será criado uma tela de Importação Inicial. Essa tela, deve ser possível selecionar uma Unidade Escolar. Logo a Unidade Escolar deve estar cadastrada anteriormente. Ao selecionar, deve ter um campo para subir um arquivo de excel, csv ou algo do tipo. Devemos ter 2 modelos de envio (Usuários do tipo Alunos e Usuários do tipo Profissional). Ao selecionar o tipo de envio, deve ter um campo para subir o arquivo. Esses arquivo deve ter os campos preenchidos da seguinte maneira, de acordo com a tela de Usuários: Usuários -> Aluno: Nome completo *, CPF **, Data de Nascimento *, Sexo *, Filiação 1 (mãe) ***, Filiação 2 (pai) ***, Matrícula da certidão de Nascimento ** (**: O obrigatório é o CPF. Se não houver CPF, a matrícula da certidão passa a ser obrigatória. ***: Caso a filiação não seja preenchida, deve ser atribuído o "Não declarado"). Usuário -> Profissional: Nome completo *, CPF *, Data de Nascimento *, Sexo *, E-mail *, Regime de contratação *, Função *, Situação *, Data de início *, Carga horária semanal *"

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — Cada tela tem um único objetivo principal: a tela de Importação Inicial existe apenas para importar um lote de usuários para uma unidade; baixar modelo, validar e confirmar são passos subordinados desse mesmo objetivo.
- **PE-103** — A ação principal ("Importar") deve ter destaque único; ações secundárias (baixar modelo, trocar tipo, cancelar) ficam visualmente subordinadas.
- **PE-204** — Conteúdos agrupados por contexto: seleção de unidade, seleção do tipo (Aluno/Profissional), envio do arquivo e resultado da validação são grupos visuais distintos.
- **PE-205** — Divulgação progressiva: o campo de upload e as instruções do modelo só aparecem depois da escolha do tipo de envio; o relatório de erros só aparece após o processamento.
- **PE-304** — Layout de criação de informações: a importação é uma operação de criação em massa, com validações durante o preenchimento/processamento e revisão antes da confirmação.
- **PE-402** — Erros de validação devem dizer o que aconteceu, em qual linha do arquivo e como corrigir (ex.: "Linha 12: CPF ausente e matrícula da certidão ausente — informe ao menos um dos dois").
- **PE-403** — Conclusão deve dar feedback imediato com quantidades (linhas recebidas, criadas, rejeitadas).
- **PE-404** — O processamento do arquivo deve comunicar estado de andamento (processando, sem travar a interface nem permitir duplo envio).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Importar lote de Alunos para uma unidade (Priority: P1)

O gestor (ou superadmin) acessa o módulo Importação e Exportação, abre Importação Inicial, seleciona a Unidade Escolar, escolhe o tipo "Alunos", envia o arquivo preenchido conforme o modelo, confere o resultado da validação e confirma a criação dos alunos naquela unidade.

**Why this priority**: É o caso central da feature — povoar uma escola nova com seus alunos sem digitação manual linha a linha. Sem ele, a feature não tem valor.

**Independent Test**: Pode ser testado de ponta a ponta só com um arquivo de alunos válido: seleciona escola + tipo Alunos + envia + confirma, e os alunos passam a existir na unidade.

**Acceptance Scenarios**:

1. **Given** uma unidade cadastrada e um arquivo de alunos válido, **When** o usuário seleciona a unidade, o tipo "Alunos", envia o arquivo e confirma, **Then** todos os alunos válidos são criados vinculados àquela unidade e o sistema informa quantos foram criados.
2. **Given** um arquivo de alunos com linhas inválidas, **When** o arquivo é processado, **Then** nenhuma linha inválida é criada silenciosamente e o sistema lista cada linha rejeitada com o motivo e como corrigir.
3. **Given** uma linha sem CPF e sem matrícula da certidão, **When** o arquivo é validado, **Then** a linha é rejeitada com mensagem indicando que ao menos um dos dois é obrigatório.
4. **Given** uma linha de aluno sem filiação 1 e/ou sem filiação 2, **When** a linha é importada, **Then** o campo ausente é gravado como "Não declarado".
5. **Given** um usuário da própria escola (não superadmin), **When** ele abre a Importação Inicial, **Then** a unidade já vem fixada na sua escola e ele não consegue importar para outra unidade.

---

### User Story 2 - Importar lote de Profissionais para uma unidade (Priority: P2)

O gestor acessa a mesma tela, escolhe o tipo "Profissionais", envia o arquivo conforme o modelo de profissional (só dados pessoais: nome, CPF, nascimento, sexo, e-mail) e confirma a criação. O vínculo (regime, função, situação, início, carga horária) é completado depois na tela de Usuários.

**Why this priority**: Completa a importação inicial da escola (alunos + equipe). É independente do fluxo de alunos, mas usa a mesma estrutura.

**Independent Test**: Pode ser testado só com um arquivo de profissionais válido, sem envolver alunos.

**Acceptance Scenarios**:

1. **Given** uma unidade cadastrada e um arquivo de profissionais válido, **When** o usuário seleciona a unidade, o tipo "Profissionais", envia e confirma, **Then** os profissionais são criados naquela unidade (só dados pessoais; vínculo a completar na tela de Usuários).
2. **Given** uma linha de profissional sem e-mail, **When** o arquivo é validado, **Then** a linha é rejeitada com o motivo por campo.

---

### User Story 3 - Baixar o modelo correto antes de preencher (Priority: P2)

O usuário escolhe o tipo de envio (Alunos ou Profissionais) e baixa o arquivo-modelo correspondente, com as colunas na ordem e formato esperados, para preencher sem adivinhar a estrutura.

**Why this priority**: Sem modelo para download, o erro de preenchimento dispara e a importação vira tentativa e erro. É o principal redutor de suporte.

**Independent Test**: Pode ser testado sem importar nada — escolhe o tipo e baixa o modelo, conferindo colunas.

**Acceptance Scenarios**:

1. **Given** o tipo "Alunos" selecionado, **When** o usuário solicita o modelo, **Then** recebe um arquivo com exatamente as colunas do modelo de aluno.
2. **Given** o tipo "Profissionais" selecionado, **When** o usuário solicita o modelo, **Then** recebe um arquivo com exatamente as colunas do modelo de profissional.
3. **Given** nenhum tipo selecionado, **When** o usuário está na tela, **Then** fica claro que é preciso escolher o tipo antes de baixar ou enviar (sem botão de modelo genérico que induza ao erro).

---

### User Story 4 - Acessar Censo Escolar dentro do novo módulo (Priority: P3)

O usuário que hoje usa a tela de Censo Escolar passa a encontrá-la dentro do módulo "Importação e Exportação", com o mesmo comportamento atual (validar e exportar Matrícula Inicial e Situação Final).

**Why this priority**: É reorganização de navegação, sem mudança funcional; garante que a criação do módulo não quebre nem duplique o fluxo existente do Censo.

**Independent Test**: Pode ser testado navegando ao Censo pelo novo módulo e executando uma validação — sem usar a importação.

**Acceptance Scenarios**:

1. **Given** o módulo "Importação e Exportação", **When** o usuário o abre, **Then** vê as opções "Censo Escolar" e "Importação Inicial".
2. **Given** a tela de Censo Escolar no novo módulo, **When** o usuário valida/exporta, **Then** o comportamento é idêntico ao atual (mesmos registros, mesmas validações).

### Edge Cases

- Arquivo vazio (só cabeçalho ou zero linhas): rejeitar com mensagem orientando a preencher ao menos uma linha.
- Arquivo com colunas faltando, extras ou fora de ordem: rejeitar ou mapear — comportamento definido no plan; nunca importar coluna errada em campo errado silenciosamente.
- Linha duplicada dentro do próprio arquivo (mesmo CPF duas vezes): reportar como erro de duplicidade com os números das linhas.
- CPF já cadastrado no sistema: a linha é rejeitada como duplicidade, com o número da linha e orientação para tratar o caso manualmente na tela de Usuários.
- Arquivo com encoding/separador inesperado (CSV com `;` vs `,`, acentos quebrados): detectar ou orientar o formato esperado na mensagem de erro.
- Data de nascimento futura ou em formato inválido: rejeitar a linha com motivo claro.
- Falha parcial: o sistema importa as linhas válidas e reporta as rejeitadas no relatório de erros para correção e reenvio.
- Formato aceito: somente CSV (com separador e encoding definidos no plan); o sistema gera o arquivo-modelo CSV para download.
- Envio duplo acidental (duplo clique / reenvio do mesmo arquivo): não criar registros duplicados — o botão de confirmação deve ser desabilitado durante o processamento e/ou o lote deve ser idempotente.
- Unidade sem vínculo com o usuário (tentativa de importar para outra escola via manipulação): negar com mensagem de sem permissão, sem revelar dados da outra unidade.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST oferecer um módulo de navegação "Importação e Exportação" contendo a tela existente de Censo Escolar (comportamento inalterado) e a nova tela de Importação Inicial.
- **FR-002**: A tela de Importação Inicial MUST exigir a seleção de uma Unidade Escolar previamente cadastrada antes do envio; usuário vinculado a uma escola MUST ficar restrito à sua própria unidade.
- **FR-003**: A tela MUST exigir a escolha do tipo de envio: "Alunos" ou "Profissionais"; o campo de upload e as instruções do modelo MUST corresponder ao tipo selecionado.
- **FR-004**: O sistema MUST gerar para download o modelo CSV de Alunos e o modelo CSV de Profissionais, cada um com as colunas oficiais da importação.
- **FR-005**: O sistema MUST aceitar no upload arquivos `.csv` (UTF-8, separador `;` com fallback `,`) e `.xlsx` (aba `Preencher` ou primeira); outros formatos MUST ser rejeitados com mensagem clara.
- **FR-006**: Cada linha do modelo Aluno MUST conter: Nome completo (obrigatório), CPF (condicional), Data de Nascimento (obrigatória), Sexo (obrigatório), Filiação 1 (opcional, default "Não declarado"), Filiação 2 (opcional, default "Não declarado"), Matrícula da certidão de nascimento (condicional).
- **FR-007**: Na importação de Alunos, o sistema MUST exigir CPF **OU** matrícula da certidão em cada linha (ao menos um dos dois); linha sem ambos MUST ser rejeitada.
- **FR-008**: Na importação de Alunos, filiação 1 e/ou filiação 2 ausentes MUST ser gravadas como "Não declarado".
- **FR-009**: Cada linha do modelo Profissional MUST conter: Nome completo, CPF, Data de Nascimento, Sexo e E-mail — todos obrigatórios. O vínculo (regime, função, situação, início, carga horária) NÃO faz parte da importação e é completado na tela de Usuários.
- **FR-010**: O sistema MUST validar cada linha contra as mesmas regras da tela de Usuários (formato de CPF, e-mail, datas, valores de sexo) e rejeitar linhas inválidas com motivo por campo.
- **FR-011**: O resultado do processamento MUST exibir resumo (total de linhas, criadas, rejeitadas) e lista de erros por número da linha com motivo e orientação de correção.
- **FR-012**: Em caso de falha parcial, o sistema MUST importar as linhas válidas e reportar as rejeitadas no relatório de erros (com número da linha, motivo e orientação), permitindo correção e reenvio só das rejeitadas.
- **FR-013**: Linha com CPF já existente no sistema MUST ser rejeitada como duplicidade (sem alterar o cadastro existente), com o número da linha e orientação para tratamento manual na tela de Usuários.
- **FR-014**: O sistema MUST registrar auditoria do lote importado (quem importou, quando, para qual unidade, tipo, quantidades criadas/rejeitadas).
- **FR-015**: O acesso à Importação Inicial MUST respeitar permissões e escopo por escola (usuário só importa para unidades às quais tem acesso; superadmin seleciona qualquer unidade).

### Key Entities

- **Lote de Importação**: um envio de arquivo — unidade destino, tipo (Aluno/Profissional), quem enviou, quando, quantidades (recebidas, criadas, rejeitadas).
- **Linha do arquivo**: um registro candidato — valores brutos da linha, número da linha, estado (válida/criada/rejeitada) e motivo de rejeição quando houver.
- **Modelo de planilha (Aluno / Profissional)**: definição das colunas oficiais esperadas em cada tipo de envio.
- **Unidade Escolar**: destino da importação — precisa existir previamente; todo usuário criado pertence a exatamente uma unidade do lote.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um gestor consegue importar 300 alunos válidos de uma escola nova em até 10 minutos (do download do modelo à confirmação), sem digitação manual linha a linha.
- **SC-002**: 100% das linhas inválidas são barradas com mensagem que indica a linha, o campo e como corrigir — nenhum registro inválido é criado silenciosamente.
- **SC-003**: 100% das linhas de aluno sem filiação têm "Não declarado" gravado nos campos ausentes.
- **SC-004**: 100% das linhas sem CPF e sem matrícula da certidão são rejeitadas.
- **SC-005**: A tela de Censo Escolar continua acessível e funcional pelo novo módulo, sem regressão (validar e exportar funcionam como antes).
- **SC-006**: Nenhum usuário consegue importar pessoas para uma unidade fora do seu escopo (0 vazamentos entre escolas em teste de acesso).

## Assumptions

- A Unidade Escolar destino já está cadastrada antes da importação (a tela não cria escolas).
- Os modelos para download espelham os campos descritos nesta spec; detalhes de formato (ordem das colunas, `DD/MM/AAAA` vs `AAAA-MM-DD`, valores aceitos de Sexo) seguem os mesmos padrões da tela de Usuários e serão fixados no plan.
- Usuários importados nascem vinculados à unidade do lote; matrícula em turma e alocação de profissional em turma NÃO fazem parte desta importação (são etapas posteriores nas telas próprias).
- A importação cria pessoas novas; não edita cadastros existentes (salvo decisão da clarificação sobre CPF duplicado).
- Limite prático de tamanho do arquivo e paginação do relatório de erros serão definidos no plan (default: suportar ao menos 1.000 linhas por arquivo).
- Permissão de importação segue o padrão `módulo.recurso` do sistema; o recurso exato será definido no plan.
