# Product Experience

Version: 1.0.0

Status: Stable

---

## 1. Objetivo

Este documento define os princípios de Product Experience (PE) que orientam a tomada de decisões sobre a experiência do usuário antes da implementação técnica.

Seu objetivo é garantir que todas as funcionalidades ofereçam uma experiência consistente, previsível e centrada na tarefa do usuário.

Este documento complementa a Constitution, o Design System e as especificações de cada funcionalidade, sem substituí-los.

Em caso de conflito entre este documento e a Constitution, prevalecem sempre as diretrizes estabelecidas pela Constitution.

---

## 2. Relação com os demais documentos

| Documento | Responsabilidade |
|-----------|------------------|
| Constitution | Define os princípios arquiteturais obrigatórios do projeto. |
| Product Experience | Define os critérios para tomada de decisões de experiência do usuário. |
| Product Vision | Define a personalidade, a percepção e a identidade do produto. |
| Design System | Define componentes, layouts, tokens e padrões visuais. |
| Spec | Define os requisitos funcionais da feature. |
| Plan | Define a estratégia de implementação. |
| Tasks | Define as tarefas de implementação. |

A experiência de permissões e autorização (quando comunicar falta de permissão, quando bloquear-re, como orientar o usuário) é definida pelo Design System em conjunto com o AGENTS.md, que cataloga os componentes e padrões visuais para estados de permissão negada. Este documento não duplica essas regras; funcionalidades que envolvam permissões devem consultar o Design System para a implementação visual e os princípios PE-4xx e PE-5xx para o comportamento de feedback e estado vazio.

---

## 3. Como utilizar este documento

Antes de implementar uma funcionalidade:

1. Ler a Constitution.
2. Ler a Spec da funcionalidade.
3. Consultar este documento.
4. Identificar quais princípios de Product Experience são aplicáveis.
5. Registrar os princípios utilizados na documentação da feature, no bloco "Product Experience" da `spec.md`.
6. Elaborar o plano de implementação.

Este documento não deve ser utilizado para definir requisitos funcionais ou substituir decisões arquiteturais.

---

## 4. Ordem de aplicação

Os princípios devem ser aplicados na seguinte ordem:

1. PE-1xx — Filosofia do Produto
2. PE-7xx — Navegação, Jornadas e Carga Cognitiva
3. PE-2xx — Hierarquia da Informação
4. PE-3xx — Escolha de Layout
5. PE-8xx — Visualização de Dados
6. PE-4xx — Feedback, Erro e Recuperação
7. PE-5xx — Estado Zero e Onboarding
8. PE-6xx — Responsividade e Mobile
9. PE-9xx — Acessibilidade

Nem todas as categorias serão utilizadas em todas as funcionalidades.

A ordem reflete o fluxo natural de decisões: primeiro define-se o objetivo da tela (PE-1xx) e seu lugar na jornada do usuário (PE-7xx), para então organizar a informação dentro dela (PE-2xx), escolher o layout (PE-3xx), decidir a visualização de dados (PE-8xx) e definir os feedbacks (PE-4xx). Estados vazios (PE-5xx), responsividade (PE-6xx) e acessibilidade (PE-9xx) são camadas de refinamento aplicados por último, sobre as decisões já tomadas.

---

## 5. Tabela de referência rápida

| Categoria | Quando consultar |
|-----------|------------------|
| PE-1xx | Definir o objetivo principal da interface. |
| PE-2xx | Organizar e priorizar informações. |
| PE-3xx | Escolher o layout mais adequado. |
| PE-4xx | Definir feedbacks, erros e recuperação. |
| PE-5xx | Projetar estados vazios e onboarding. |
| PE-6xx | Adaptar a experiência para dispositivos móveis. |
| PE-7xx | Definir navegação, jornadas e reduzir carga cognitiva. |
| PE-8xx | Escolher a melhor forma de apresentar informações. |
| PE-9xx | Garantir acessibilidade e inclusão. |

---

## 6. Estrutura dos princípios

Todos os princípios deste documento seguem obrigatoriamente uma estrutura padronizada.

Essa padronização garante consistência entre os princípios, facilita sua manutenção ao longo do tempo e permite que pessoas e agentes de IA localizem rapidamente as informações necessárias para a tomada de decisão.

Cada princípio deve conter, obrigatoriamente, as seguintes seções:

- **Identificador** (PE-XXX)
- **Objetivo**
- **Problema que resolve**
- **Critérios de decisão**
- **Quando não aplicar**
- **Exemplos**
- **Forma de verificação**
- **Referências**

Todos os princípios devem ser independentes entre si, possuir responsabilidade única e tratar apenas um problema de experiência do usuário.

Quando um princípio não possuir exceções, a seção **Quando não aplicar** deve informar explicitamente que não existem exceções.

Sempre que um princípio depender de outro para sua correta aplicação, essa relação deve ser registrada na seção **Referências**, evitando duplicação de regras entre categorias.

---

## 7. Categorias

## PE-1xx — Filosofia do Produto

Esta categoria reúne os princípios fundamentais que orientam todas as decisões de Product Experience do sistema.

Os princípios desta categoria são obrigatórios para qualquer funcionalidade, independentemente do módulo ou do tipo de interface.

Seu objetivo é garantir que todas as telas compartilhem a mesma filosofia de uso, reduzindo inconsistências na experiência do usuário e servindo como base para a aplicação das demais categorias deste documento.

Os princípios desta categoria devem ser consultados antes de qualquer outro princípio de Product Experience. 

Para este documento, considera-se como "tela" qualquer unidade autônoma de interação com o usuário, incluindo páginas, modais, dialogs, drawers, etapas de um wizard e seções com navegação própria (como abas).

### Estrutura da categoria (v1.0)

- PE-101 — Cada tela deve possuir um único objetivo principal.
- PE-102 — O propósito da tela deve ser compreendido rapidamente.
- PE-103 — A ação principal deve ser claramente identificável.

---

---

## PE-101 — Cada tela deve possuir um único objetivo principal

### Objetivo

Garantir que toda interface seja construída em torno de uma única necessidade principal do usuário.

### Problema que resolve

Interfaces que tentam atender múltiplos objetivos simultaneamente aumentam a carga cognitiva, dificultam a tomada de decisão e tornam a experiência inconsistente.

### Critérios de decisão

Antes de projetar uma tela, responda à seguinte pergunta:

> Qual é a principal tarefa que o usuário veio realizar nesta tela?

A resposta deve poder ser descrita em uma única frase objetiva.

Se a resposta exigir múltiplas frases, utilizar a conjunção "e" para descrever tarefas distintas ou listar objetivos independentes, a interface possui mais de um objetivo principal e deve ser reorganizada ou dividida.

Quando for necessária a divisão da interface, consultar os princípios da categoria PE-3xx (Escolha de Layout) e PE-7xx (Navegação, Jornadas e Carga Cognitiva).

### Quando não aplicar

Este princípio não possui exceções.

Toda interface deve possuir um objetivo principal claramente definido.

### Exemplos

**Bom**

- Painel do Aluno: permitir que o aluno acompanhe rapidamente sua vida acadêmica.
- Listagem de Turmas: permitir localizar e acessar uma turma.
  - Ações secundárias: criar turma, exportar dados e aplicar filtros.
- Cadastro de Aluno: permitir cadastrar ou editar um aluno.

**Ruim**

Uma única tela que mistura:

- Dashboard
- Cadastro
- Relatórios
- Configurações
- Auditoria

sem uma tarefa predominante.

### Forma de verificação

O propósito da tela pode ser descrito em uma única frase objetiva, sem utilizar conjunções que indiquem objetivos independentes (como "e")?

Se não for possível, a tela possui mais de um objetivo principal e o princípio não foi atendido.

### Referências

- Constitution
- Design System

---

## PE-102 — O propósito da tela deve ser claramente compreendido

### Objetivo

Garantir que o usuário compreenda rapidamente para que uma interface existe, reduzindo dúvidas, interpretações incorretas e tempo de adaptação.

### Problema que resolve

Interfaces que não comunicam claramente seu propósito obrigam o usuário a explorar a tela para entender sua função, aumentando a carga cognitiva e reduzindo a eficiência da navegação.

### Critérios de decisão

Ao projetar uma interface, o propósito da tela deve estar evidente logo no primeiro contato visual.

O usuário deve conseguir compreender rapidamente:

- O que esta tela representa.
- Qual problema ela resolve.
- O que ele pode fazer nela.

O propósito deve ser comunicado principalmente por meio da combinação entre:

- título da página;
- descrição contextual, quando necessária;
- organização inicial das informações;

Nenhum desses elementos deve depender da leitura completa da interface para transmitir seu significado.

### Quando não aplicar

Este princípio não possui exceções.

Toda interface deve comunicar claramente seu propósito desde o primeiro contato.

### Exemplos

**Bom**

- "Painel do Aluno" apresenta imediatamente indicadores acadêmicos, próximas aulas e desempenho, deixando claro que a tela serve para acompanhar a vida escolar do aluno.

- "Listagem de Turmas" apresenta o título, filtros e tabela de turmas, deixando evidente que seu objetivo é localizar e acessar turmas existentes.

- "Cadastro de Aluno" apresenta imediatamente um formulário organizado para criação ou edição de um aluno.

**Ruim**

Uma tela cujo primeiro conteúdo seja uma grande tabela sem contexto, sem título descritivo, sem descrição e sem indicar claramente sua finalidade.

Ou uma interface onde o usuário precise percorrer vários componentes antes de compreender o motivo daquela página existir.

### Forma de verificação

Verifique se a interface comunica seu propósito utilizando, pelo menos, os seguintes elementos:

- título da página;
- organização inicial do conteúdo;
- descrição contextual, quando necessária.

Se esses elementos forem suficientes para comunicar claramente a finalidade da tela, o princípio foi atendido.

Caso o usuário precise explorar a interface para entender sua finalidade, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-101

---

## PE-103 — A ação principal deve ser claramente identificável

### Objetivo

Garantir que o usuário identifique rapidamente qual é a principal ação disponível na interface, reduzindo dúvidas, hesitação e erros durante a execução de tarefas.

### Problema que resolve

Interfaces que apresentam diversas ações com o mesmo peso visual dificultam a tomada de decisão, aumentam a carga cognitiva e levam o usuário a executar ações incorretas ou menos importantes.

### Critérios de decisão

Toda interface deve possuir, no máximo, uma ação principal claramente destacada.

A ação principal deve representar o objetivo mais importante daquela tela e possuir maior destaque visual que as demais ações.

O destaque pode ocorrer por meio de fatores como:

- posição na interface;
- contraste visual;
- tamanho;
- hierarquia visual;
- variante do componente.

As ações secundárias devem permanecer acessíveis, porém visualmente subordinadas à ação principal.

Ações destrutivas nunca devem competir visualmente com a ação principal.

### Quando não aplicar

Este princípio não se aplica a telas exclusivamente informativas, nas quais nenhuma ação seja esperada do usuário.

Nesses casos, a interface deve priorizar a comunicação das informações em vez da execução de ações.

### Exemplos

**Bom**

- Na tela de Cadastro de Aluno, o botão "Salvar" possui maior destaque visual que "Cancelar".
- Na Listagem de Turmas, "Nova Turma" é a principal ação da página, enquanto "Exportar" e "Importar" permanecem como ações secundárias.
- Em um diálogo de confirmação, "Confirmar" recebe maior destaque que "Cancelar".
- Na Listagem de Turmas, o botão "Nova Turma" utiliza a variante principal do Button no PageHeader, enquanto "Exportar" utiliza uma variante secundária.

**Ruim**

- "Salvar", "Cancelar", "Excluir", "Duplicar" e "Exportar" possuem exatamente o mesmo peso visual.
- A ação principal está escondida dentro de um menu secundário.
- O botão "Excluir" possui mais destaque que "Salvar".

### Forma de verificação

Verifique se a interface possui apenas uma ação principal claramente destacada.

Um observador consegue identificar qual é a principal ação da tela apenas pela hierarquia visual, sem precisar ler todos os botões disponíveis?

Se a resposta for negativa, ou se duas ou mais ações competirem visualmente pela atenção do usuário, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-101
- PE-102

---

## PE-2xx — Hierarquia da Informação

### Observação
Esta categoria trata da organização visual da informação em uma única tela. A divulgação progressiva entre telas (wizards, multi-step) é tratada pela categoria PE-7xx. A escolha do formato de visualização (tabela vs. card vs. gráfico) é tratada pela categoria PE-8xx.

### Estrutura da categoria (v1.0)

- PE-201 — A hierarquia da informação deve refletir a importância para o usuário.
- PE-202 — Informações críticas devem posicionar-se acima da dobra.
- PE-203 — O peso visual deve refletir a prioridade da informação.
- PE-204 — Conteúdos logicamente relacionados devem ser visualmente agrupados.
- PE-205 — Informações densas ou secundárias devem utilizar divulgação progressiva.

---

## PE-201 — A hierarquia da informação deve refletir a importância para o usuário

### Objetivo

Garantir que as informações apresentadas na interface sejam organizadas de acordo com sua relevância para a principal tarefa do usuário, permitindo que os elementos mais importantes sejam identificados primeiro.

### Problema que resolve

Interfaces que apresentam todas as informações com o mesmo nível de destaque dificultam a identificação do que realmente importa, aumentam a carga cognitiva e tornam a execução das tarefas mais lenta e menos eficiente.

### Critérios de decisão

Antes de definir a organização da interface, identifique quais informações são essenciais para que o usuário cumpra o objetivo principal da tela.

As informações mais importantes devem possuir prioridade visual sobre todas as demais.

Ao definir essa prioridade, considere principalmente:

- a tarefa principal que o usuário deseja realizar;
- a frequência de utilização da informação;
- o impacto da informação na tomada de decisão;
- a necessidade de consulta imediata durante o uso da interface.

Informações secundárias não devem competir visualmente com aquelas que são essenciais para a realização da tarefa principal.

A prioridade da informação deve sempre apoiar o objetivo definido pelo princípio PE-101.

### Quando não aplicar

Este princípio não possui exceções.

Toda interface deve estabelecer uma ordem de prioridade entre as informações apresentadas.

### Exemplos

**Bom**

- No Painel do Aluno, indicadores acadêmicos aparecem antes de informações administrativas.
- Na tela de Matrículas, os dados necessários para confirmar a matrícula possuem maior destaque que informações históricas.
- Em uma tela financeira, valores em aberto possuem prioridade sobre registros já quitados.

**Ruim**

- Todas as informações possuem o mesmo tamanho, contraste e posição visual.
- Dados pouco relevantes aparecem antes das informações necessárias para a principal tarefa do usuário.
- Informações históricas recebem o mesmo destaque que dados utilizados para tomada de decisão imediata.

### Forma de verificação

As informações mais importantes para a principal tarefa da tela são identificadas antes das demais?

Caso informações secundárias possuam o mesmo nível de prioridade visual das informações essenciais, o princípio não foi atendido.

### Referências

- PE-101
- PE-102
- PE-103
- Design System

---

## PE-202 — Informações críticas devem posicionar-se acima da dobra

### Objetivo

Garantir que as informações mais importantes para a principal tarefa do usuário sejam apresentadas imediatamente, sem exigir rolagem da página ou exploração inicial da interface.

### Problema que resolve

Quando informações essenciais ficam ocultas abaixo da dobra ou dispersas ao longo da interface, o usuário precisa percorrer a tela para localizar o que realmente importa, aumentando o tempo de execução da tarefa e a carga cognitiva.

### Critérios de decisão

Após identificar as informações prioritárias conforme o princípio PE-201, posicione-as na primeira área visível da interface.

Sempre que possível, o usuário deve conseguir visualizar as informações necessárias para iniciar sua principal tarefa imediatamente após o carregamento da página.

Caso a quantidade de informações críticas exceda o espaço disponível, priorize sua organização por importância, mantendo acima da dobra apenas aquilo que é indispensável para a tomada de decisão inicial.

Informações secundárias ou complementares podem ser posicionadas abaixo da dobra quando sua consulta não for necessária para o início da tarefa principal.

Para este princípio, considera-se "acima da dobra" a área inicialmente visível no breakpoint predominante da funcionalidade. O breakpoint predominante é definido pelo dispositivo de uso principal da funcionalidade — por padrão, o desktop (1366×768) —, salvo quando a Specification indicar expressamente outro perfil de uso. A adaptação para os demais breakpoints é tratada pelos princípios da categoria PE-6xx.

### Quando não aplicar

Este princípio não se aplica quando a própria natureza da funcionalidade exigir navegação sequencial por grandes volumes de conteúdo, como documentos extensos, relatórios completos ou registros históricos.

Mesmo nesses casos, a interface deve apresentar acima da dobra um resumo ou contexto suficiente para orientar o usuário.

### Exemplos

**Bom**

- Um dashboard apresenta indicadores principais logo na abertura da página.
- A tela de Matrículas exibe imediatamente a situação da matrícula e as ações disponíveis.
- Um formulário apresenta os campos obrigatórios antes das informações opcionais.

**Ruim**

- O usuário precisa rolar a página para descobrir o principal indicador da tela.
- A ação principal somente aparece após diversos blocos de informações secundárias.
- Informações críticas ficam ocultas após tabelas ou conteúdos pouco relevantes.

### Forma de verificação

As informações essenciais para que o usuário inicie sua principal tarefa estão visíveis sem necessidade de rolagem da interface?

Caso informações críticas estejam posicionadas abaixo da dobra sem justificativa funcional, o princípio não foi atendido.

### Referências

- PE-101
- PE-201
- Design System

---

## PE-203 — O peso visual deve refletir a prioridade da informação

### Objetivo

Garantir que a importância das informações seja comunicada por meio da hierarquia visual da interface, permitindo que o usuário identifique naturalmente o que merece maior atenção.

### Problema que resolve

Interfaces que apresentam todas as informações com o mesmo peso visual dificultam a leitura, aumentam a carga cognitiva e obrigam o usuário a analisar toda a interface para identificar o que realmente importa.

### Critérios de decisão

Após definir quais informações possuem maior prioridade (PE-201) e posicioná-las adequadamente (PE-202), utilize a hierarquia visual para reforçar essa importância.

O peso visual pode ser estabelecido por meio de fatores como:

- tamanho;
- contraste;
- tipografia;
- cor, utilizando exclusivamente os Design Tokens definidos pelo Design System;
- espaçamento;
- alinhamento;
- proximidade com outros elementos;
- variante do componente utilizada;

Quanto maior a importância da informação para a tarefa principal do usuário, maior deve ser seu peso visual.

Informações secundárias devem permanecer legíveis, porém com menor destaque, evitando competir pela atenção do usuário.

A hierarquia visual deve ser consistente em toda a interface.

### Quando não aplicar

Este princípio não se aplica quando a interface apresentar apenas uma única informação principal, sem elementos concorrentes.

Mesmo nesses casos, deve-se preservar a consistência visual definida pelo Design System.

### Exemplos

**Bom**

- O nome do aluno possui maior destaque que seu número de matrícula.
- O saldo pendente utiliza maior contraste que os pagamentos já concluídos.
- O indicador de frequência recebe maior destaque que informações complementares.
- Um KPI principal possui maior tamanho e contraste que indicadores secundários.

**Ruim**

- Todos os títulos utilizam o mesmo tamanho independentemente de sua importância.
- Informações críticas e complementares possuem exatamente o mesmo contraste visual.
- Dados históricos recebem o mesmo destaque que indicadores utilizados para tomada de decisão.

### Forma de verificação

As informações de maior prioridade possuem maior destaque visual que as informações secundárias?

Caso elementos de diferentes níveis de importância apresentem o mesmo peso visual sem justificativa funcional, o princípio não foi atendido.

### Referências

- PE-101
- PE-201
- PE-202
- Design System

---

## PE-204 — Conteúdos logicamente relacionados devem ser visualmente agrupados

### Objetivo

Garantir que informações pertencentes ao mesmo contexto sejam apresentadas como um conjunto coerente, facilitando a compreensão da interface e reduzindo o esforço necessário para localizar e interpretar os dados.

### Problema que resolve

Interfaces que distribuem informações relacionadas em diferentes áreas da tela ou misturam conteúdos de naturezas distintas dificultam a leitura, aumentam a carga cognitiva e obrigam o usuário a alternar constantemente seu foco de atenção.

### Critérios de decisão

Ao organizar uma interface, identifique quais informações pertencem ao mesmo contexto de uso e apresente-as visualmente agrupadas.

O agrupamento pode ser realizado por meio de recursos como:

- proximidade entre elementos;
- seções bem definidas;
- cards;
- painéis;
- abas;
- fieldsets;
- divisores visuais.

Cada grupo deve possuir um propósito claro e reunir apenas informações relacionadas entre si.

Sempre que possível, cada grupo deve poder ser compreendido independentemente dos demais.

Informações pertencentes a contextos diferentes não devem compartilhar o mesmo agrupamento visual apenas por conveniência de layout.

### Quando não aplicar

Este princípio não se aplica quando a interface possui um único conjunto de informações, sem necessidade de subdivisão.

Mesmo nesses casos, a organização da informação deve permanecer clara e consistente.

### Exemplos

**Bom**

- Uma tela de Cadastro de Aluno separa os dados em grupos como "Dados Pessoais", "Contato", "Responsáveis" e "Informações Acadêmicas".
- Um dashboard organiza indicadores financeiros, acadêmicos e administrativos em grupos distintos.
- Uma tela de detalhes apresenta informações gerais, documentos e histórico em seções independentes.

**Ruim**

- Dados financeiros, informações pessoais e configurações aparecem misturados no mesmo bloco.
- Campos relacionados ficam separados por conteúdos sem relação.
- A interface utiliza divisões visuais apenas para preencher espaço, sem representar agrupamentos lógicos.

### Forma de verificação

Cada grupo de informações possui um contexto claramente definido e reúne apenas elementos relacionados entre si?

Caso informações de naturezas distintas estejam agrupadas sem justificativa funcional, ou informações relacionadas estejam dispersas pela interface, o princípio não foi atendido.

### Referências

- PE-101
- PE-201
- PE-202
- PE-203
- Design System

---

## PE-205 — Informações densas ou secundárias devem utilizar divulgação progressiva

### Objetivo

Garantir que a interface apresente inicialmente apenas as informações necessárias para a principal tarefa do usuário, revelando conteúdos secundários ou mais complexos somente quando solicitados.

### Problema que resolve

Interfaces que apresentam todas as informações simultaneamente aumentam a carga cognitiva, dificultam a localização do conteúdo relevante e tornam a experiência mais lenta, principalmente em funcionalidades com grande volume de dados.

### Critérios de decisão

Após definir a prioridade das informações (PE-201), seu posicionamento (PE-202), seu peso visual (PE-203) e seu agrupamento (PE-204), avalie quais conteúdos realmente precisam estar visíveis desde o primeiro contato com a interface.

Informações secundárias, complementares ou utilizadas apenas em situações específicas devem ser apresentadas por meio de mecanismos de divulgação progressiva, como:

- accordions;
- collapsibles;
- abas;
- painéis expansíveis;
- seções "Mostrar mais";
- detalhes sob demanda.

A divulgação progressiva deve reduzir a complexidade inicial da interface sem dificultar o acesso às informações quando elas forem necessárias.

O usuário nunca deve perder informações importantes por estarem ocultas.

### Quando não aplicar

Este princípio não deve ser aplicado quando ocultar informações impedir ou dificultar a execução da principal tarefa da interface.

Informações críticas para tomada de decisão, execução da tarefa principal ou cumprimento de requisitos legais devem permanecer visíveis desde o primeiro momento.

### Exemplos

**Bom**

- Informações avançadas de um aluno ficam disponíveis em um painel expansível.
- Um formulário apresenta inicialmente apenas os campos obrigatórios, revelando opções avançadas sob demanda.
- O histórico completo de alterações permanece recolhido até que o usuário solicite sua visualização.

**Ruim**

- Informações essenciais para concluir uma matrícula ficam escondidas dentro de um accordion fechado.
- O botão principal da interface só aparece após expandir uma seção.
- Todo o conteúdo da página permanece expandido, mesmo quando grande parte dele raramente é utilizada.

### Forma de verificação

As informações ocultadas são realmente secundárias e podem ser acessadas sem dificultar a execução da principal tarefa da interface?

Caso informações essenciais estejam escondidas ou a divulgação progressiva aumente a complexidade da interação, o princípio não foi atendido.

### Referências

- PE-101
- PE-201
- PE-202
- PE-203
- PE-204
- Design System

---

## PE-3xx — Escolha de Layout

Esta categoria define os critérios para selecionar o layout mais adequado de acordo com a principal tarefa do usuário.

Seu objetivo é garantir que cada funcionalidade utilize a estrutura mais apropriada para a atividade que será realizada, reduzindo complexidade, aumentando a previsibilidade da interface e favorecendo a eficiência durante o uso.

Esta categoria não define como um layout deve ser construído.

A composição, os componentes e as regras estruturais de cada layout são definidos exclusivamente pelo Design System.

Caso nenhuma opção existente atenda adequadamente à funcionalidade, a necessidade de um novo layout deve ser registrada na especificação da feature e posteriormente incorporada ao Design System.

### Estrutura da categoria (v1.0)

- PE-301 — O layout deve refletir a principal tarefa do usuário.
- PE-302 — Uma mesma tela não deve combinar múltiplos layouts primários.
- PE-303 — Layouts devem privilegiar a continuidade da tarefa.
- PE-304 — Formulários devem minimizar interrupções durante o preenchimento.
- PE-305 — Wizards devem ser utilizados apenas quando a tarefa exigir etapas dependentes.

---

### Observação

Esta categoria responde à pergunta:

> "Qual tipo de layout deve ser utilizado para esta funcionalidade?"

Ela não responde:

- como o layout deve ser implementado;
- quais componentes utilizar;
- quais espaçamentos aplicar;
- como organizar visualmente seus elementos.

Essas decisões pertencem ao Design System.

---

## PE-301 — Um Dashboard deve ser utilizado quando o objetivo principal for monitorar informações

### Objetivo

Garantir que funcionalidades cujo objetivo principal seja acompanhar indicadores, métricas, alertas, tendências ou o estado atual de um conjunto de informações utilizem um layout de Dashboard.

### Problema que resolve

Utilizar tabelas, formulários ou outros layouts para atividades de monitoramento dificulta a identificação rápida de informações importantes, aumenta a carga cognitiva e reduz a capacidade do usuário de perceber mudanças relevantes.

### Critérios de decisão

Utilize um Dashboard quando a principal tarefa do usuário for:

- acompanhar indicadores;
- monitorar o estado atual de um processo;
- identificar alertas ou exceções;
- comparar métricas;
- acompanhar tendências;
- obter uma visão geral antes de executar outras ações.

O Dashboard deve priorizar a visualização das informações mais relevantes para a tomada de decisão.

Quando a principal atividade passar a ser localizar registros, editar informações ou analisar detalhadamente um item específico, deve-se utilizar outro layout da categoria PE-3xx.

### Quando não aplicar

Não utilize um Dashboard quando o principal objetivo da funcionalidade for:

- localizar registros;
- cadastrar ou editar informações;
- visualizar detalhadamente um único registro;
- executar um fluxo composto por etapas sequenciais.

Nesses casos, consultar os princípios correspondentes desta categoria.

### Exemplos

**Bom**

- Dashboard Escolar com indicadores de alunos, turmas, docentes e frequência.
- Painel Financeiro apresentando receitas, despesas e inadimplência.
- Dashboard da Secretaria com indicadores consolidados da rede de ensino.
- Painel do Aluno apresentando desempenho, frequência, próximos eventos e avisos.

**Ruim**

- Tela composta apenas por uma tabela de registros.
- Tela utilizada apenas para cadastro de informações.
- Tela cujo único conteúdo é um formulário.
- Tela destinada exclusivamente à consulta detalhada de um único registro.

### Forma de verificação

Pergunte:

> O principal objetivo desta funcionalidade é acompanhar o estado atual de um conjunto de informações para apoiar decisões?

Se a resposta for positiva, um Dashboard é o layout adequado.

Caso a principal tarefa seja localizar, editar, visualizar ou executar um processo, este princípio não deve ser aplicado.

### Referências

- Constitution
- Design System
- PE-101
- PE-201
- PE-202
- PE-203

---

## PE-302 — Uma Listagem deve ser utilizada quando o objetivo principal for localizar registros

### Objetivo

Garantir que funcionalidades cujo objetivo principal seja localizar, filtrar, ordenar, pesquisar ou selecionar registros utilizem um layout de Listagem.

### Problema que resolve

Utilizar Dashboards, formulários ou telas de visualização para localizar informações dificulta a navegação, reduz a eficiência da busca e aumenta o tempo necessário para encontrar um registro.

### Critérios de decisão

Utilize uma Listagem quando a principal tarefa do usuário for:

- localizar registros;
- pesquisar informações;
- aplicar filtros;
- ordenar resultados;
- comparar registros;
- selecionar um ou mais itens para ações posteriores.

A interface deve priorizar mecanismos que facilitem a localização rápida das informações, como pesquisa, filtros, ordenação e paginação, quando necessários.

Após localizar um registro, as ações de visualizar, editar ou excluir devem estar facilmente acessíveis.

### Quando não aplicar

Não utilize uma Listagem quando o principal objetivo da funcionalidade for:

- acompanhar indicadores ou métricas;
- visualizar detalhadamente um único registro;
- cadastrar ou editar informações;
- executar um fluxo composto por etapas sequenciais.

Nesses casos, consultar os princípios correspondentes desta categoria.

### Exemplos

**Bom**

- Listagem de Alunos.
- Listagem de Turmas.
- Listagem de Docentes.
- Listagem de Matrículas.
- Listagem de Usuários.
- Pesquisa de Escolas.

**Ruim**

- Tela composta apenas por diversos indicadores numéricos sem permitir localizar registros.
- Tela utilizada exclusivamente para edição de um cadastro.
- Tela que apresenta apenas os detalhes completos de um único registro.
- Tela construída como Dashboard para exibir centenas de registros.

### Forma de verificação

Pergunte:

> O principal objetivo desta funcionalidade é permitir que o usuário encontre, compare ou selecione registros?

Se a resposta for positiva, uma Listagem é o layout adequado.

Caso a principal tarefa seja monitorar indicadores, visualizar detalhes, editar informações ou executar um processo, este princípio não deve ser aplicado.

### Referências

- Constitution
- Design System
- PE-101
- PE-201
- PE-202
- PE-203
- PE-301

---

## PE-303 — Um layout de Visualização deve ser utilizado quando o objetivo principal for compreender um único registro

### Objetivo

Garantir que funcionalidades cujo objetivo principal seja consultar, analisar ou compreender detalhadamente um único registro utilizem um layout de Visualização.

### Problema que resolve

Utilizar Listagens, Dashboards ou Formulários para apresentar informações detalhadas dificulta a compreensão do registro, aumenta a carga cognitiva e prejudica a identificação de relacionamentos entre os dados.

### Critérios de decisão

Utilize um layout de Visualização quando a principal tarefa do usuário for:

- consultar informações detalhadas de um único registro;
- compreender o histórico ou o contexto de um registro;
- analisar relacionamentos entre informações;
- validar dados antes de tomar uma decisão.

A interface deve priorizar a organização lógica das informações, facilitando a leitura e reduzindo a necessidade de navegação entre múltiplas telas.

Sempre que possível, as informações devem ser agrupadas por contexto ou assunto.

Caso existam ações sobre o registro, elas devem permanecer acessíveis, mas não competir visualmente com o conteúdo principal.

### Quando não aplicar

Não utilize um layout de Visualização quando o principal objetivo da funcionalidade for:

- localizar registros;
- cadastrar ou editar informações;
- monitorar indicadores;
- executar um processo composto por etapas sequenciais.

Nesses casos, consultar os princípios correspondentes desta categoria.

### Exemplos

**Bom**

- Perfil completo de um Aluno.
- Visualização de uma Turma.
- Visualização de um Docente.
- Detalhes de uma Matrícula.
- Histórico Escolar de um aluno.

**Ruim**

- Tela utilizada apenas para editar dados.
- Tela composta somente por uma tabela de registros.
- Dashboard utilizado para apresentar os detalhes completos de um único registro.
- Formulário aberto apenas para consulta, sem necessidade de edição.

### Forma de verificação

Pergunte:

> O principal objetivo desta funcionalidade é permitir que o usuário compreenda todas as informações de um único registro?

Se a resposta for positiva, um layout de Visualização é o mais adequado.

Caso a principal tarefa seja localizar registros, editar informações, monitorar indicadores ou executar um fluxo, este princípio não deve ser aplicado.

### Referências

- Constitution
- Design System
- PE-101
- PE-201
- PE-202
- PE-203
- PE-302

---

## PE-304 — Um layout de Cadastro ou Edição deve ser utilizado quando o objetivo principal for criar ou modificar informações

### Objetivo

Garantir que funcionalidades cujo objetivo principal seja criar, editar ou atualizar informações utilizem um layout de Cadastro ou Edição.

### Problema que resolve

Utilizar Dashboards, Listagens ou telas de Visualização para entrada de dados dificulta o preenchimento das informações, aumenta a probabilidade de erros e reduz a eficiência durante a execução da tarefa.

### Critérios de decisão

Utilize um layout de Cadastro ou Edição quando a principal tarefa do usuário for:

- criar um novo registro;
- editar um registro existente;
- atualizar informações;
- revisar dados antes da confirmação;
- validar informações obrigatórias.

A interface deve priorizar a conclusão da tarefa, apresentando apenas os campos necessários e organizando-os de forma lógica.

Campos relacionados devem permanecer agrupados e a ação principal da tela deve conduzir claramente à conclusão do cadastro ou da edição.

Sempre que possível, validações devem ocorrer durante o preenchimento, reduzindo erros antes da submissão do formulário.

### Quando não aplicar

Não utilize um layout de Cadastro ou Edição quando o principal objetivo da funcionalidade for:

- localizar registros;
- consultar informações;
- monitorar indicadores;
- acompanhar processos sem necessidade de alteração dos dados.

Nesses casos, consultar os princípios correspondentes desta categoria.

### Exemplos

**Bom**

- Cadastro de Aluno.
- Cadastro de Turma.
- Cadastro de Docente.
- Edição de Matrícula.
- Configuração de Ano Letivo.

**Ruim**

- Utilizar uma tabela editável para um cadastro complexo.
- Exibir dezenas de campos sem qualquer agrupamento lógico.
- Misturar indicadores, relatórios e formulários na mesma tela.
- Utilizar uma tela de visualização apenas para permitir pequenas alterações.

### Forma de verificação

Pergunte:

> O principal objetivo desta funcionalidade é permitir que o usuário crie ou altere informações?

Se a resposta for positiva, um layout de Cadastro ou Edição é o mais adequado.

Caso a principal tarefa seja localizar registros, visualizar detalhes, monitorar indicadores ou executar um fluxo composto por etapas, este princípio não deve ser aplicado.

### Referências

- Constitution
- Design System
- PE-101
- PE-103
- PE-201
- PE-202
- PE-203
- PE-303

---

## PE-305 — Fluxos compostos devem utilizar Wizard apenas quando as etapas forem dependentes

### Objetivo

Garantir que o layout Wizard seja utilizado apenas quando o usuário precisar concluir uma sequência obrigatória de etapas cuja ordem influencia o resultado final.

### Problema que resolve

Utilizar Wizards para processos simples aumenta a quantidade de cliques, dificulta revisões, reduz a sensação de controle e torna tarefas rápidas mais lentas.

Da mesma forma, concentrar processos longos e dependentes em uma única tela gera excesso de informações, aumenta a carga cognitiva e dificulta a conclusão da tarefa.

### Critérios de decisão

Utilize um Wizard apenas quando todas as condições abaixo forem verdadeiras:

a tarefa possuir múltiplas etapas;
existir dependência entre as etapas;
informações coletadas em uma etapa influenciarem as seguintes;
o usuário não puder executar as etapas em qualquer ordem;
dividir o processo reduzir significativamente a complexidade da interface.

Não utilize Wizard quando:

todas as informações puderem ser apresentadas em um único formulário sem excesso de complexidade;
as seções forem independentes entre si;
o usuário puder editar qualquer informação em qualquer ordem.

Sempre que um Wizard for escolhido, a justificativa da decisão deve ser registrada na Specification da funcionalidade.

### Quando não aplicar

Este princípio não se aplica a formulários simples ou médios que possam ser compreendidos em uma única tela.

Também não se aplica quando a separação em etapas existir apenas por organização visual.

### Exemplos

**Bom**

- Processo de matrícula composto por: dados do aluno, responsáveis, matrícula, contrato, confirmação.
- Configuração inicial da escola em múltiplas etapas dependentes.

**Ruim**

- Cadastro de Aluno dividido em quatro etapas apenas porque o formulário é longo.
- Cadastro de Turma dividido em Wizard sem existir dependência entre as informações.

### Forma de verificação

Verifique se a funcionalidade realmente exige uma sequência obrigatória de etapas.

Caso o usuário possa preencher ou editar todas as informações em qualquer ordem, um Wizard não deve ser utilizado.

Além disso, confirme que a Specification da funcionalidade documenta a justificativa para a escolha do Wizard.

### Referências

- Constitution
- Design System
- PE-101
- PE-205

---

## PE-4xx — Feedback, Erro e Recuperação

Esta categoria reúne os princípios que orientam como o sistema deve responder às ações do usuário durante a interação com a interface.

Seu objetivo é garantir que toda ação realizada produza um retorno claro, previsível e proporcional ao seu impacto, permitindo que o usuário compreenda o resultado de suas ações e saiba como prosseguir em caso de sucesso, erro ou interrupção.

Os princípios desta categoria definem quando utilizar confirmações, mensagens de sucesso, avisos, erros e mecanismos de recuperação.

A aparência, os componentes, as cores, os ícones e os padrões visuais utilizados para apresentar essas informações são definidos pelo Design System.

### Observação

Esta categoria trata do comportamento do sistema após ou durante uma interação do usuário.

A organização das informações na interface é tratada pela categoria PE-2xx — Hierarquia da Informação.

A navegação entre telas e jornadas do usuário é tratada pela categoria PE-7xx — Navegação, Jornadas e Carga Cognitiva.

### Estrutura da categoria (v1.0)

- PE-401 — Ações destrutivas devem exigir confirmação explícita.
- PE-402 — Erros devem explicar o problema e indicar como resolvê-lo.
- PE-403 — Ações concluídas com sucesso devem fornecer feedback imediato.
- PE-404 — Operações em andamento devem comunicar seu estado.
- PE-405 — O usuário deve conseguir recuperar-se de falhas sempre que possível.

---

## PE-401 — Ações destrutivas devem exigir confirmação explícita

### Objetivo

Garantir que ações potencialmente irreversíveis sejam executadas apenas após uma confirmação consciente do usuário, reduzindo perdas acidentais de informações e aumentando a segurança da interação.

### Problema que resolve

Ações destrutivas executadas imediatamente podem causar perda de dados, retrabalho e insegurança no uso do sistema.

Por outro lado, solicitar confirmação para qualquer ação torna a interface lenta e leva o usuário a confirmar mensagens automaticamente, reduzindo sua efetividade.

### Critérios de decisão

Solicite confirmação apenas quando a ação atender a pelo menos um dos critérios abaixo:

remover dados;
cancelar operações que provoquem perda de informações;
substituir informações existentes de forma irreversível;
executar operações cujo efeito não possa ser facilmente desfeito;
realizar ações com impacto significativo para outros usuários ou para o funcionamento do sistema.

A confirmação deve:

descrever claramente a ação que será executada;
informar as consequências da ação, quando necessário;
apresentar opções explícitas para confirmar ou cancelar;
manter "Cancelar" como alternativa segura.

Evite confirmações para ações simples, frequentes ou facilmente reversíveis.

Sempre que existir um mecanismo de desfazer (Undo) seguro e imediato, ele deve ser priorizado em vez de uma confirmação prévia.

### Quando não aplicar

Este princípio não se aplica a ações totalmente reversíveis, rápidas e de baixo impacto, como:

abrir uma tela;
aplicar filtros;
alterar ordenações;
navegar entre páginas;
expandir ou recolher seções;
selecionar registros.

Também não se aplica quando a funcionalidade possuir um mecanismo de recuperação imediato que elimine o risco de perda permanente.

### Exemplos

**Bom**

Excluir um aluno solicita confirmação antes da remoção.
Cancelar uma matrícula informa quais dados serão afetados.
Excluir uma turma apresenta um diálogo explicando que a ação não poderá ser desfeita.
Restaurar as configurações padrão solicita confirmação antes da execução.

**Ruim**

Solicitar confirmação antes de aplicar um filtro.
Exibir confirmação para salvar um formulário.
Confirmar toda navegação entre telas.
Excluir um registro imediatamente após um clique acidental.

### Forma de verificação

Verifique se toda ação destrutiva ou de alto impacto exige confirmação explícita antes da execução.

Confirme também que ações simples, frequentes ou facilmente reversíveis não apresentam confirmações desnecessárias.

Caso exista um mecanismo seguro de desfazer imediatamente após a ação, verifique se ele foi utilizado em substituição à confirmação prévia.

### Referências

- Constitution
- Design System
- PE-103

---

## PE-402 — Erros devem explicar o problema e indicar como resolvê-lo

### Objetivo

Garantir que toda mensagem de erro ajude o usuário a compreender o que aconteceu, por que aconteceu e qual ação pode ser tomada para resolver o problema.

### Problema que resolve

Mensagens genéricas ou excessivamente técnicas geram insegurança, aumentam a carga cognitiva e dificultam a recuperação da operação.

Quando o sistema apenas informa que ocorreu um erro, sem orientar o próximo passo, o usuário fica sem saber como prosseguir.

### Critérios de decisão

Toda mensagem de erro deve informar, sempre que possível:

o que aconteceu;
por que a operação não pôde ser concluída;
como o usuário pode resolver o problema;
quando aplicável, como tentar novamente.

A mensagem deve utilizar linguagem compatível com o perfil do usuário, evitando códigos internos, exceções técnicas, nomes de tabelas, APIs ou detalhes de implementação.

Quando o erro depender de uma ação do usuário, a interface deve indicar claramente qual informação precisa ser corrigida.

Quando o erro for causado por indisponibilidade do sistema, a mensagem deve informar que o problema não depende do usuário e orientar a próxima ação adequada.

### Quando não aplicar

Este princípio não se aplica a validações em tempo real realizadas diretamente nos campos de entrada.

Essas validações pertencem ao comportamento do formulário e devem ser tratadas pelo Design System e pelas regras funcionais da Specification.

### Exemplos

**Bom**

"Não foi possível salvar o cadastro porque o CPF informado já está cadastrado."
"A conexão com o servidor foi interrompida. Tente novamente em alguns instantes."
"Informe uma data de nascimento válida."

**Bom (com ação)**

"Não foi possível excluir a turma porque existem alunos matriculados. Remova as matrículas antes de tentar novamente."

**Ruim**

"Erro inesperado."
"Exception 500."
"SQLSTATE[23505]."
"Falha na operação."

### Forma de verificação

Verifique se toda mensagem de erro responde, sempre que possível, às seguintes perguntas:

O que aconteceu?
Por que aconteceu?
O usuário consegue resolver?
O sistema informa qual é o próximo passo?

Caso a mensagem apenas informe que ocorreu um erro, sem orientar a continuidade da tarefa, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-401

---

## PE-403 — Ações concluídas com sucesso devem fornecer feedback imediato

### Objetivo

Garantir que o usuário receba uma confirmação clara quando uma operação for concluída com sucesso, reduzindo dúvidas sobre o resultado da ação e aumentando a confiança na utilização do sistema.

### Problema que resolve

Quando uma operação é concluída sem qualquer retorno, o usuário pode acreditar que a ação falhou, repetir comandos desnecessariamente ou abandonar o fluxo antes da conclusão.

Por outro lado, feedbacks excessivos para ações triviais tornam a interface poluída e reduzem a percepção de informações realmente importantes.

### Critérios de decisão

Forneça feedback de sucesso sempre que o usuário concluir uma operação cujo resultado não seja imediatamente evidente.

O feedback deve:

confirmar que a operação foi concluída;
utilizar linguagem simples e objetiva;
aparecer imediatamente após a conclusão da ação;
permanecer visível por tempo suficiente para ser percebido.

Quando a própria interface demonstrar claramente o resultado da operação, um feedback adicional pode ser desnecessário.

Evite mensagens de sucesso para ações instantaneamente perceptíveis, como:

expandir uma seção;
alterar uma ordenação;
navegar entre páginas;
abrir ou fechar um diálogo.

### Quando não aplicar

Este princípio não se aplica quando a alteração realizada pelo usuário é imediatamente perceptível na própria interface e não gera dúvidas sobre sua conclusão.

Também não se aplica a interações puramente exploratórias ou de navegação.

### Exemplos

**Bom**

Após salvar um cadastro, exibir "Aluno salvo com sucesso."
Após concluir uma importação, informar a quantidade de registros processados.
Após redefinir uma senha, informar que a operação foi concluída com sucesso.
Após enviar um relatório para processamento, informar que a solicitação foi registrada.

**Ruim**

Não apresentar qualquer confirmação após salvar um cadastro.
Exibir mensagens de sucesso para cada clique em filtros ou ordenações.
Utilizar mensagens genéricas como "Operação realizada."

### Forma de verificação

Verifique se toda operação cujo resultado não seja imediatamente perceptível fornece um feedback de sucesso claro ao usuário.

Confirme também que operações triviais ou cujo resultado seja evidente na própria interface não apresentam mensagens de sucesso desnecessárias.

Caso o usuário precise deduzir que a operação foi concluída apenas pela ausência de erros, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-402

---

## PE-404 — Operações em andamento devem comunicar seu estado

### Objetivo

Garantir que o usuário saiba quando uma operação está em andamento, reduzindo a incerteza, evitando ações repetidas e transmitindo confiança durante a execução de tarefas.

### Problema que resolve

Quando o sistema não comunica que uma operação está sendo processada, o usuário pode acreditar que a interface travou, repetir comandos, fechar a página ou abandonar a tarefa antes de sua conclusão.

Por outro lado, indicadores de carregamento desnecessários para operações instantâneas tornam a interface mais lenta e prejudicam a percepção de desempenho.

### Critérios de decisão

Sempre que uma operação não produzir um resultado praticamente imediato, a interface deve informar que o processamento está em andamento.

O feedback deve:

indicar claramente que a operação foi iniciada;
permanecer visível durante todo o processamento;
desaparecer automaticamente quando a operação for concluída;
impedir ações duplicadas quando necessário.

Sempre que possível, a interface deve informar o progresso da operação.

Quando o progresso não puder ser determinado, deve ao menos comunicar que o processamento continua em execução.

Evite utilizar indicadores de carregamento para operações praticamente instantâneas.

### Quando não aplicar

Este princípio não se aplica a operações cujo resultado seja praticamente imediato e perceptível pelo usuário.

Também não se aplica a interações puramente visuais, como abrir um menu, expandir uma seção ou alterar a ordenação de uma tabela.

### Exemplos

**Bom**

Exibir um indicador de carregamento durante o salvamento de um cadastro.
Desabilitar o botão "Salvar" enquanto a operação estiver em andamento.
Exibir uma barra de progresso durante uma importação de dados.
Informar a quantidade de registros processados durante uma exportação.

**Ruim**

Não apresentar qualquer indicação enquanto um cadastro está sendo salvo.
Permitir múltiplos cliques no botão "Salvar" durante o processamento.
Exibir um spinner para uma operação que termina instantaneamente.
Manter um indicador de carregamento após a conclusão da operação.

### Forma de verificação

Verifique se toda operação cuja conclusão não seja praticamente imediata informa claramente que está sendo processada.

Confirme também que:

o usuário consegue perceber que a operação foi iniciada;
ações duplicadas são evitadas quando necessário;
o indicador desaparece automaticamente ao término da operação.

Caso o usuário precise adivinhar se o sistema ainda está processando a solicitação, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-403

---

## PE-405 — O usuário deve conseguir recuperar-se de falhas sempre que possível

### Objetivo
### Objetivo

Garantir que falhas durante a utilização do sistema não obriguem o usuário a reiniciar sua tarefa, reduzindo retrabalho, frustração e perda de informações.

### Problema que resolve

Interfaces que obrigam o usuário a recomeçar uma atividade após uma falha aumentam a carga cognitiva, reduzem a confiança no sistema e elevam a probabilidade de abandono da tarefa.

Sempre que possível, o sistema deve oferecer mecanismos que permitam ao usuário recuperar-se do problema e continuar sua atividade.

### Critérios de decisão

Quando uma operação falhar, a interface deve avaliar se existe uma forma segura de recuperação antes de exigir que o usuário reinicie todo o processo.

Sempre que tecnicamente viável, o sistema deve:

preservar os dados já informados pelo usuário;
permitir tentar novamente a operação (retry);
permitir desfazer ações recentes quando houver risco de erro do usuário (undo);
orientar claramente como continuar a tarefa;
evitar que o usuário repita etapas já concluídas com sucesso.

Caso não seja possível recuperar a operação, a interface deve explicar claramente o motivo e indicar o próximo passo disponível.

### Quando não aplicar

Este princípio não se aplica quando a recuperação puder comprometer a integridade dos dados, gerar inconsistências ou representar risco operacional.

Nesses casos, a interface deve impedir a recuperação e orientar o usuário sobre como prosseguir de forma segura.

### Exemplos

**Bom**

Após uma falha de conexão durante o cadastro de um aluno, todos os campos preenchidos permanecem preservados e o usuário pode tentar salvar novamente.
Durante a importação de uma planilha, o sistema informa quais registros falharam e permite reprocessar apenas esses registros.
Após excluir um registro acidentalmente, o sistema oferece a opção de desfazer a exclusão quando tecnicamente possível.
Após uma falha temporária de comunicação com o servidor, a interface apresenta um botão "Tentar novamente" sem exigir que o usuário refaça toda a operação.

**Ruim**

Um erro faz todos os dados preenchidos serem perdidos.
O usuário precisa preencher novamente um formulário inteiro após uma falha temporária.
A única alternativa apresentada é fechar a tela e começar todo o processo novamente.

### Forma de verificação

Verifique se, diante de uma falha recuperável, a interface oferece mecanismos para que o usuário continue sua tarefa sem repetir etapas desnecessárias.

O sistema preserva os dados já informados, oferece alternativas de recuperação quando possível e orienta claramente o usuário quando a recuperação não é viável?

Se não, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-402
- PE-403
- PE-404

---

## PE-5xx — Estado Zero e Onboarding

Esta categoria reúne os princípios que orientam a experiência do usuário quando uma funcionalidade ainda não possui dados ou está sendo utilizada pela primeira vez.

Seu objetivo é garantir que a ausência de conteúdo não interrompa a jornada do usuário, fornecendo contexto, orientação e próximos passos sempre que necessário.

Os princípios desta categoria distinguem estados vazios permanentes, resultados vazios de consultas e experiências de primeiro uso, evitando que essas situações sejam interpretadas como erros do sistema.

Esta categoria deve ser consultada sempre que uma funcionalidade puder ser apresentada sem conteúdo inicial ou exigir orientação durante o primeiro acesso.

### Estrutura da categoria (v1.0)

- PE-501 — Estados vazios devem orientar o usuário sobre o próximo passo.
- PE-502 — Resultados vazios de busca ou filtro devem informar que a consulta não encontrou correspondências.
- PE-503 — Onboarding para primeiro uso deve ser não intrusivo e dispensável.

---

## PE-501 — Estados vazios devem orientar o usuário sobre o próximo passo

### Objetivo

Garantir que interfaces sem dados ajudem o usuário a compreender a situação atual e indiquem claramente qual ação pode ser realizada para prosseguir.

### Problema que resolve

Estados vazios que apenas informam a ausência de dados, como "Nenhum registro encontrado", deixam o usuário sem contexto e sem saber qual deve ser o próximo passo.

Isso pode levar à impressão de que ocorreu um erro, que o sistema está incompleto ou que a funcionalidade não está funcionando corretamente.

### Critérios de decisão

Sempre que uma funcionalidade não possuir dados para apresentar, o estado vazio deve comunicar, de forma clara:

* o que está ausente;
* por que a tela está vazia, quando necessário;
* qual é a próxima ação recomendada ao usuário.

Sempre que existir uma ação capaz de resolver o estado vazio, ela deve estar disponível diretamente na interface.

Quando nenhuma ação puder ser realizada pelo usuário, a interface deve informar claramente essa condição, evitando gerar expectativas incorretas.

O estado vazio deve preservar o propósito original da tela definido pelos princípios da categoria PE-1xx.

### Quando não aplicar

Este princípio não se aplica quando a ausência de informações for causada por filtros, buscas ou consultas que não retornaram resultados.

Nesses casos, aplicar o princípio PE-502.

Também não se aplica durante o carregamento inicial da interface, situação tratada pela categoria PE-4xx.

### Exemplos

**Bom**

* "Nenhum aluno cadastrado. Clique em 'Novo Aluno' para realizar o primeiro cadastro."
* "Nenhuma turma criada para este ano letivo. Crie uma nova turma para começar."
* "Ainda não existem planos de ensino cadastrados."

**Ruim**

* "Nenhum registro encontrado."
* Tela completamente vazia.
* Exibir apenas uma tabela sem linhas e sem qualquer explicação.

### Forma de verificação

Sempre que a funcionalidade não possuir dados:

* o motivo da ausência de conteúdo está claramente comunicado?
* existe uma ação que permita ao usuário avançar, quando aplicável?
* a interface evita parecer um erro do sistema?

Se qualquer uma dessas respostas for negativa, o princípio não foi atendido.

### Referências

* Constitution
* Design System
* PE-101
* PE-201
* PE-401

---

## PE-502 — Resultados vazios de busca ou filtro devem informar que a consulta não encontrou correspondências

### Objetivo

Garantir que o usuário compreenda que uma busca, filtro ou consulta foi executada corretamente, mas não retornou resultados para os critérios informados.

### Problema que resolve

Quando uma pesquisa ou filtro não retorna resultados e a interface apenas exibe uma tabela vazia ou uma mensagem genérica, o usuário pode acreditar que ocorreu um erro, que os dados foram perdidos ou que a funcionalidade deixou de funcionar.

### Critérios de decisão

Sempre que uma busca, filtro ou consulta não retornar resultados, a interface deve comunicar claramente:

- que a consulta foi executada com sucesso;
- que nenhum resultado corresponde aos critérios informados;
- quais critérios estão limitando os resultados, quando aplicável;
- qual ação o usuário pode realizar para encontrar informações.

Sempre que possível, a interface deve oferecer ações como:

- limpar filtros;
- alterar os critérios da busca;
- redefinir a consulta.

A ausência de resultados nunca deve ser apresentada como um erro do sistema.

### Quando não aplicar

Este princípio não se aplica quando a funcionalidade ainda não possui qualquer dado cadastrado.

Nesses casos, aplicar o princípio PE-501.

Também não se aplica quando a consulta falhar por erro técnico ou indisponibilidade do sistema, situação tratada pela categoria PE-4xx.

### Exemplos

**Bom**

- "Nenhum aluno encontrado para os filtros selecionados."
- "Nenhuma matrícula corresponde ao período informado. Tente ampliar o intervalo de datas."
- "Sua pesquisa não encontrou resultados. Limpe os filtros ou utilize outros critérios."

**Ruim**

- Exibir apenas uma tabela vazia.
- "Nenhum registro encontrado." sem informar que a busca foi executada corretamente.
- Exibir uma mensagem de erro para uma busca que simplesmente não retornou resultados.

### Forma de verificação

Sempre que uma busca ou filtro não retornar resultados:

- a interface informa que a consulta foi executada corretamente?
- fica claro que não houve correspondências para os critérios utilizados?
- existe uma forma simples de alterar ou limpar os critérios da consulta?

Se qualquer uma dessas respostas for negativa, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-401
- PE-501

---

## PE-503 — Onboarding para primeiro uso deve ser não intrusivo e dispensável

### Objetivo

Garantir que usuários em seu primeiro acesso a uma funcionalidade recebam orientação suficiente para compreender seu funcionamento, sem impedir a utilização normal da interface.

### Problema que resolve

Onboardings que bloqueiam a interface, exigem que o usuário conclua tutoriais obrigatórios ou reaparecem continuamente tornam a experiência frustrante, principalmente para usuários experientes ou recorrentes.

Por outro lado, funcionalidades complexas sem qualquer orientação aumentam a curva de aprendizado e dificultam a adoção do sistema.

### Critérios de decisão

Sempre que uma funcionalidade exigir orientação durante o primeiro uso, o onboarding deve:

- apresentar apenas as informações essenciais para iniciar a utilização da funcionalidade;
- permitir que o usuário ignore ou encerre a orientação a qualquer momento;
- não bloquear a execução das tarefas principais da interface;
- não reaparecer automaticamente após ser dispensado pelo usuário, salvo quando houver alteração significativa na funcionalidade.

O onboarding deve complementar a interface, nunca substituir uma boa experiência de uso.

### Quando não aplicar

Este princípio não se aplica a funcionalidades cuja utilização seja suficientemente intuitiva e não exija orientação adicional.

Também não se aplica a fluxos obrigatórios de configuração inicial, autenticação ou requisitos legais, que fazem parte das regras funcionais do sistema.

### Exemplos

**Bom**

- Exibir um pequeno card explicando os principais recursos do Painel do Aluno no primeiro acesso, permitindo que o usuário o feche definitivamente.
- Destacar, na primeira utilização do Diário de Classe, os principais controles da tela sem impedir sua utilização.
- Oferecer um link para um guia rápido ou documentação complementar.

**Ruim**

- Obrigar o usuário a concluir um tour antes de utilizar a funcionalidade.
- Exibir o mesmo tutorial sempre que a tela for aberta.
- Bloquear toda a interface até que todas as etapas do onboarding sejam concluídas.

### Forma de verificação

Sempre que existir onboarding para primeiro uso:

- o usuário pode ignorar ou encerrar a orientação a qualquer momento?
- a utilização normal da funcionalidade permanece disponível durante o onboarding?
- o onboarding deixa de ser exibido após ser dispensado pelo usuário?
- as informações apresentadas são apenas as necessárias para iniciar o uso da funcionalidade?

Se qualquer uma dessas respostas for negativa, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-101
- PE-102

---

## PE-6xx — Responsividade e Mobile

### Observações

Esta categoria define **quando** e **por que** adaptar uma interface para diferentes dispositivos.

As regras de implementação dos breakpoints, grids, componentes responsivos e tokens de espaçamento pertencem exclusivamente ao Design System.

### Objetivo da categoria

Esta categoria reúne os princípios que orientam a adaptação da experiência do usuário para diferentes dispositivos, tamanhos de tela e métodos de interação.

Seu objetivo é garantir que todas as funcionalidades preservem seu propósito, usabilidade e eficiência, independentemente do dispositivo utilizado.

Os princípios desta categoria definem como adaptar layouts, conteúdos e interações para diferentes breakpoints, sem comprometer a experiência prevista pelas demais categorias de Product Experience.

Esta categoria deve ser consultada sempre que uma funcionalidade precisar ser utilizada em mais de um tamanho de tela ou método de interação.

---

### Critério de pertencimento à PE-6xx

Para pertencer à PE-6xx, um princípio deve atender simultaneamente aos seguintes critérios:

1. É dependente do dispositivo — a decisão existe porque diferentes tamanhos de tela ou métodos de interação exigem adaptações.

2. Preserva a experiência — seu objetivo é manter a mesma experiência, e não criar experiências diferentes para desktop e mobile.

3. É posterior à escolha do layout — primeiro define-se o layout (PE-3xx); depois adapta-se esse layout aos diferentes dispositivos.

4. Não trata de acessibilidade — princípios relacionados à inclusão, contraste, leitores de tela, navegação por teclado ou tecnologias assistivas pertencem à PE-9xx.

---

### Estrutura da categoria (v1.0)

- PE-601 — A mesma tarefa deve permanecer possível em qualquer dispositivo.
- PE-602 — A interface deve adaptar-se ao espaço disponível sem perda de funcionalidade.
- PE-603 — Componentes interativos devem permanecer adequados ao método de interação.
- PE-604 — A prioridade das informações deve ser preservada entre breakpoints.
- PE-605 — A experiência deve permanecer consistente entre dispositivos.

---

### Ordem de aplicação

1. Garantir que a mesma tarefa permaneça possível em qualquer dispositivo (PE-601).
2. Adaptar a interface ao espaço disponível sem perda de funcionalidade (PE-602).
3. Adequar os componentes ao método de interação do dispositivo (PE-603).
4. Preservar a prioridade das informações entre os diferentes breakpoints (PE-604).
5. Manter uma experiência consistente entre dispositivos (PE-605).

---

### Relação com as demais categorias

| Categoria | Relação |
|-----------|---------|
| PE-1xx | O propósito da tela deve permanecer o mesmo em qualquer dispositivo. |
| PE-2xx | A hierarquia da informação deve ser preservada entre os breakpoints. |
| PE-3xx | Define qual layout utilizar; a PE-6xx adapta esse layout aos diferentes dispositivos. |
| PE-4xx | Feedbacks e estados devem permanecer consistentes em todos os dispositivos. |
| PE-5xx | Estados vazios e onboarding também devem ser responsivos. |
| PE-8xx | A escolha da visualização continua válida; apenas sua adaptação muda conforme o dispositivo. |
| PE-9xx | A PE-6xx trata de responsividade; acessibilidade é responsabilidade exclusiva da PE-9xx. |

---

## PE-601 — A mesma tarefa deve permanecer possível em qualquer dispositivo

### Objetivo

Garantir que a mudança de dispositivo não impeça o usuário de realizar a principal tarefa da interface.

### Problema que resolve

Interfaces que removem funcionalidades, alteram significativamente o fluxo de execução ou exigem dispositivos específicos obrigam o usuário a aprender comportamentos diferentes para realizar a mesma tarefa, aumentando a carga cognitiva e reduzindo a previsibilidade da experiência.

### Critérios de decisão

Ao adaptar uma interface para diferentes dispositivos, a tarefa principal da tela deve permanecer executável em todos os breakpoints suportados.

A adaptação da interface pode alterar aspectos como:

- disposição dos elementos;
- quantidade de informações simultaneamente visíveis;
- organização dos componentes;
- padrão de navegação.

Entretanto, essas adaptações não devem impedir ou dificultar significativamente a realização da principal tarefa definida pelo PE-101.

Caso limitações de espaço exijam simplificações, devem ser priorizadas alterações na apresentação da interface, e não na capacidade funcional da tela.

### Quando não aplicar

Este princípio não se aplica quando determinada funcionalidade depender, por natureza, de recursos indisponíveis no dispositivo utilizado.

Nesses casos, a indisponibilidade deve ser comunicada de forma clara ao usuário, indicando, sempre que possível, uma alternativa.

### Exemplos

**Bom**

- A Listagem de Alunos permite localizar, filtrar e acessar um aluno tanto no desktop quanto no celular, ainda que utilize layouts diferentes.
- O Cadastro de Aluno mantém todas as etapas disponíveis em dispositivos móveis, reorganizando apenas a disposição dos campos.
- Um dashboard reorganiza seus indicadores em uma única coluna no celular sem remover informações essenciais.

**Ruim**

- O botão "Nova Turma" existe apenas na versão desktop.
- O usuário consegue editar um cadastro apenas no computador.
- A versão mobile remove funcionalidades essenciais por limitações de layout, sem justificativa técnica.

### Forma de verificação

A principal tarefa da tela pode ser executada em todos os dispositivos suportados, ainda que a interface seja reorganizada?

Se funcionalidades essenciais existirem apenas em determinados dispositivos ou se o fluxo principal deixar de ser possível em algum breakpoint suportado, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-101
- PE-301

---

## PE-602 — A interface deve adaptar-se ao espaço disponível sem perda de funcionalidade

### Objetivo

Garantir que a interface aproveite adequadamente o espaço disponível em cada breakpoint, preservando a funcionalidade e a clareza da experiência.

### Problema que resolve

Interfaces que apenas reduzem sua escala ou ocultam informações para caber em telas menores comprometem a usabilidade, dificultam a leitura e podem impedir a execução eficiente das tarefas do usuário.

### Critérios de decisão

A adaptação entre breakpoints deve priorizar a reorganização da interface em vez da remoção de funcionalidades.

Sempre que necessário, a interface pode:

- reorganizar componentes;
- alterar a quantidade de colunas;
- empilhar elementos verticalmente;
- utilizar componentes apropriados ao espaço disponível;
- redistribuir áreas da tela.

A adaptação não deve depender apenas da redução proporcional de tamanhos, mantendo legibilidade, espaçamento e facilidade de interação.

Quando houver necessidade de reduzir a quantidade de informações visíveis simultaneamente, a prioridade definida pela categoria PE-2xx deve ser preservada.

### Quando não aplicar

Este princípio não possui exceções.

Toda interface deve adaptar-se ao espaço disponível preservando sua funcionalidade.

### Exemplos

**Bom**

- Uma tabela transforma-se em uma lista de cards no celular quando esse formato melhora a leitura.
- Um formulário com duas colunas passa a utilizar uma única coluna em telas menores.
- Um dashboard reorganiza seus indicadores em diferentes linhas conforme o espaço disponível.

**Ruim**

- Toda a interface apenas diminui de tamanho para caber na tela.
- Campos ficam comprimidos a ponto de prejudicar a leitura.
- A interface passa a exigir rolagem horizontal para executar tarefas comuns.
- Informações importantes desaparecem apenas porque o espaço disponível diminuiu.

### Forma de verificação

A interface reorganiza seus elementos de acordo com o espaço disponível, preservando a funcionalidade e evitando perda de legibilidade?

Se a adaptação depender apenas da redução proporcional da interface, exigir rolagem horizontal desnecessária ou ocultar funcionalidades essenciais, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-201
- PE-301
- PE-601

---

## PE-603 — Componentes interativos devem permanecer adequados ao método de interação

### Objetivo

Garantir que todos os componentes interativos permaneçam fáceis de identificar, alcançar e utilizar, independentemente do método de interação utilizado pelo usuário.

### Problema que resolve

Interfaces projetadas para um único método de interação podem dificultar o uso em outros dispositivos, tornando ações simples imprecisas, desconfortáveis ou propensas a erros.

Botões muito pequenos para toque, áreas clicáveis reduzidas ou componentes que dependem exclusivamente de hover comprometem a experiência e reduzem a eficiência da interação.

### Critérios de decisão

Ao adaptar uma interface para diferentes dispositivos, todos os componentes interativos devem permanecer adequados ao método de interação predominante.

A interface deve considerar aspectos como:

- área de interação suficiente;
- espaçamento adequado entre elementos acionáveis;
- facilidade de seleção;
- disponibilidade das ações sem depender exclusivamente de hover;

A adaptação não deve reduzir a precisão nem aumentar o esforço necessário para executar ações frequentes.

### Quando não aplicar

Este princípio não possui exceções.

Toda interface deve considerar o método de interação predominante do dispositivo suportado.

### Exemplos

**Bom**

- Botões mantêm área de toque confortável em dispositivos móveis.
- Ações disponíveis por hover no desktop também podem ser acessadas por toque no celular.
- Menus permanecem totalmente utilizáveis tanto com mouse quanto por teclado.

**Ruim**

- Ícones muito pequenos dificultam o toque.
- Ações importantes aparecem apenas ao passar o mouse sobre um elemento.
- Componentes ficam tão próximos que o usuário toca frequentemente na opção incorreta.
- Um menu pode ser aberto apenas utilizando hover.

### Forma de verificação

Os componentes interativos permanecem fáceis de identificar e utilizar considerando o método de interação do dispositivo?

Se ações dependerem exclusivamente de hover, possuírem áreas de interação insuficientes ou dificultarem a seleção precisa dos elementos, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-601
- PE-602
- PE-901

---

## PE-604 — A prioridade das informações deve ser preservada entre breakpoints

### Objetivo

Garantir que a adaptação da interface para diferentes dispositivos preserve a prioridade das informações, mantendo em destaque aquilo que é mais importante para a tarefa do usuário.

### Problema que resolve

Ao adaptar uma interface para telas menores, é comum reorganizar componentes de forma que informações secundárias passem a receber mais destaque do que informações essenciais.

Isso altera a hierarquia visual definida para a interface, dificulta a execução da tarefa principal e torna a experiência inconsistente entre dispositivos.

### Critérios de decisão

A adaptação entre breakpoints deve preservar a prioridade das informações definida pela categoria PE-2xx.

Mudanças na disposição dos componentes são permitidas, desde que não alterem a importância percebida de cada informação.

Sempre que necessário, a interface pode:

- reorganizar blocos de conteúdo;
- alterar o número de colunas;
- redistribuir componentes verticalmente;
- reduzir a quantidade de informações visíveis simultaneamente.

Entretanto, informações críticas não devem perder destaque apenas em função da redução do espaço disponível.

### Quando não aplicar

Este princípio não possui exceções.

Toda adaptação responsiva deve preservar a hierarquia da informação.

### Exemplos

**Bom**

- No desktop, os indicadores principais aparecem na primeira linha do dashboard; no celular permanecem no início da página, apenas empilhados verticalmente.
- Um formulário reorganiza seus campos em uma única coluna sem alterar a ordem lógica de preenchimento.
- Uma tabela transformada em cards mantém os dados mais importantes no topo de cada card.

**Ruim**

- Informações secundárias aparecem antes dos indicadores principais apenas na versão mobile.
- O usuário precisa percorrer vários blocos pouco relevantes antes de encontrar a informação mais importante.
- A adaptação altera completamente a ordem lógica da interface sem necessidade.

### Forma de verificação

A adaptação entre breakpoints preserva a prioridade das informações e mantém em destaque aquilo que é mais importante para a tarefa do usuário?

Se informações críticas perderem prioridade visual ou passarem a competir com conteúdos secundários apenas em determinados dispositivos, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-201
- PE-202
- PE-203
- PE-602

---

## PE-605 — A experiência deve permanecer consistente entre dispositivos

### Objetivo

Garantir que o usuário reconheça e utilize a mesma funcionalidade em qualquer dispositivo, preservando padrões de interação, terminologia e comportamento da interface.

### Problema que resolve

Interfaces que apresentam comportamentos muito diferentes entre desktop, tablet e celular obrigam o usuário a reaprender como utilizar a mesma funcionalidade em cada dispositivo.

Essa inconsistência aumenta a carga cognitiva, dificulta a aprendizagem do sistema e reduz a previsibilidade da experiência.

### Critérios de decisão

Ao adaptar uma interface para diferentes dispositivos, devem ser preservados:

- a terminologia utilizada;
- o comportamento das funcionalidades;
- a sequência lógica das ações;
- os padrões de navegação;
- a identidade visual da interface.

Diferenças de layout, organização espacial e componentes são aceitáveis quando necessárias para aproveitar melhor o espaço disponível, desde que não alterem a forma como o usuário compreende e utiliza a funcionalidade.

A adaptação deve fazer o usuário sentir que está utilizando a mesma aplicação, e não uma interface diferente.

### Quando não aplicar

Este princípio não se aplica quando limitações técnicas ou características próprias do dispositivo exigirem um comportamento diferente.

Nesses casos, a adaptação deve preservar, sempre que possível, a lógica de funcionamento da funcionalidade.

### Exemplos

**Bom**

- O fluxo para cadastrar um aluno permanece o mesmo no desktop e no celular, mudando apenas a disposição dos campos.
- Os mesmos ícones, nomenclaturas e ações são utilizados em todos os dispositivos.
- O menu principal adapta sua apresentação para telas menores sem alterar sua organização lógica.

**Ruim**

- O cadastro de alunos possui etapas diferentes no celular e no desktop.
- Uma funcionalidade recebe nomes diferentes dependendo do dispositivo.
- Uma ação disponível no desktop aparece em outro local, com outro ícone e outro comportamento no celular, sem necessidade.

### Forma de verificação

A funcionalidade mantém os mesmos conceitos, comportamentos e fluxo de utilização em todos os dispositivos suportados?

Se o usuário precisar aprender uma forma diferente de utilizar a mesma funcionalidade apenas porque mudou de dispositivo, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-101
- PE-301
- PE-601
- PE-602

---

## PE-7xx — Navegação, Jornadas e Carga Cognitiva

### Observação

Esta categoria define princípios para organizar a navegação do usuário entre telas, estruturar jornadas de uso e reduzir a carga cognitiva durante a execução de tarefas.

Ela trata de como uma funcionalidade deve conduzir o usuário desde o início até a conclusão de um objetivo, preservando clareza, previsibilidade e eficiência ao longo do fluxo.

A organização das informações dentro de uma única interface é tratada pela categoria PE-2xx.

A escolha do layout mais adequado para cada tela é tratada pela categoria PE-3xx.

A orientação durante o primeiro uso e os estados vazios são tratados pela categoria PE-5xx.

---

### Objetivo da categoria

Princípios para projetar fluxos de navegação claros, previsíveis e eficientes, reduzindo a carga cognitiva do usuário e facilitando a conclusão de tarefas.

### Estrutura da categoria (v1.0)

- PE-701 — Cada fluxo deve possuir um objetivo claramente definido.
- PE-702 — Fluxos longos devem ser divididos em etapas significativas.
- PE-703 — O usuário deve sempre saber onde está durante um fluxo.
- PE-704 — A navegação deve minimizar a carga cognitiva.
- PE-705 — O usuário deve conseguir interromper e retomar um fluxo sempre que possível.

---

## PE-701 — Cada fluxo deve possuir um objetivo claramente definido

### Objetivo

Garantir que toda jornada do usuário seja construída em torno de um único objetivo principal, conduzindo-o de forma clara até a conclusão da tarefa.

### Problema que resolve

Fluxos que misturam objetivos independentes, oferecem múltiplos caminhos concorrentes ou mudam de propósito durante sua execução aumentam a carga cognitiva, geram confusão e elevam a taxa de abandono.

O usuário deve compreender claramente qual resultado será alcançado ao concluir aquele fluxo.

### Critérios de decisão

Antes de definir um fluxo de navegação, responda à seguinte pergunta:

> Qual é a principal tarefa que o usuário pretende concluir ao percorrer este fluxo?

A resposta deve poder ser descrita em uma única frase objetiva.

Todas as etapas do fluxo devem contribuir diretamente para esse objetivo.

Quando um fluxo passar a atender objetivos independentes, ele deve ser dividido em jornadas distintas ou reorganizado em funcionalidades separadas.

A navegação não deve introduzir etapas que não contribuam para a conclusão da tarefa principal.

### Quando não aplicar

Este princípio não possui exceções.

Todo fluxo de navegação deve possuir um único objetivo claramente definido.

### Exemplos

**Bom**

- Fluxo de Matrícula: matricular um aluno em uma turma.
- Fluxo de Cadastro de Docente: cadastrar um novo docente.
- Fluxo de Recuperação de Senha: permitir que o usuário redefina sua senha.

**Ruim**

Um único fluxo que mistura:

- cadastro de aluno;
- configuração financeira;
- criação da turma;
- geração de contrato;
- emissão de relatório.

sem um objetivo predominante.

### Forma de verificação

O objetivo do fluxo pode ser descrito em uma única frase objetiva?

Todas as etapas contribuem diretamente para alcançar esse objetivo?

Se o fluxo possuir objetivos independentes ou incluir etapas que não contribuam para sua conclusão, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-101
- PE-301

---

## PE-702 — Fluxos longos devem ser divididos em etapas significativas

### Objetivo

Garantir que fluxos extensos ou complexos sejam organizados em etapas lógicas, reduzindo a carga cognitiva e facilitando a conclusão da tarefa pelo usuário.

### Problema que resolve

Fluxos que concentram muitas informações, decisões ou ações em uma única interface tornam-se difíceis de compreender, aumentam a chance de erros e elevam a taxa de abandono.

Dividir um processo em etapas permite que o usuário concentre sua atenção em um conjunto menor de informações por vez, tornando a navegação mais previsível e eficiente.

### Critérios de decisão

Um fluxo deve ser dividido em etapas quando:

- exigir um número elevado de informações ou decisões;
- possuir fases naturalmente distintas;
- depender da conclusão de uma etapa antes da seguinte;
- apresentar complexidade que comprometa a compreensão em uma única interface.

Cada etapa deve possuir um objetivo claro e contribuir diretamente para a conclusão do fluxo definido pelo PE-701.

A divisão não deve criar etapas artificiais apenas para aumentar a quantidade de telas.

Sempre que possível, cada etapa deve representar um agrupamento lógico de informações ou ações relacionadas.

### Quando não aplicar

Este princípio não se aplica a fluxos simples que possam ser concluídos de forma clara e eficiente em uma única interface.

Dividir um processo simples em várias etapas apenas aumenta a navegação desnecessariamente.

### Exemplos

**Bom**

- Matrícula dividida em:
  - Dados do aluno;
  - Responsáveis;
  - Turma;
  - Confirmação.

- Cadastro de Escola dividido em:
  - Informações gerais;
  - Endereço;
  - Configurações;
  - Revisão.

- Configuração inicial do sistema organizada em etapas sequenciais.

**Ruim**

- Um formulário com mais de cinquenta campos apresentado em uma única tela.
- Um wizard composto por várias etapas contendo apenas um ou dois campos cada, sem necessidade.
- Dividir um cadastro simples em diversas telas apenas para aparentar organização.

### Forma de verificação

O fluxo foi dividido em etapas apenas quando sua complexidade justificou essa organização?

Cada etapa representa um agrupamento lógico de informações e contribui diretamente para a conclusão da tarefa?

Se o fluxo permanecer excessivamente complexo em uma única interface ou, ao contrário, for fragmentado sem necessidade, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-701
- PE-204

---

## PE-703 — O usuário deve sempre saber onde está durante um fluxo

### Objetivo

Garantir que o usuário compreenda continuamente sua posição dentro de um fluxo, reduzindo a sensação de desorientação e aumentando a previsibilidade da navegação.

### Problema que resolve

Fluxos compostos por múltiplas etapas ou telas podem fazer com que o usuário perca a noção de progresso, não saiba quanto falta para concluir a tarefa ou tenha dúvidas sobre o que acontecerá a seguir.

Essa falta de orientação aumenta a carga cognitiva, gera insegurança e contribui para o abandono da tarefa.

### Critérios de decisão

Sempre que um fluxo possuir mais de uma etapa, a interface deve comunicar claramente:

- em qual etapa o usuário está;
- quantas etapas compõem o fluxo, quando aplicável;
- quais etapas já foram concluídas, quando pertinente;
- qual será a próxima ação esperada.

A comunicação pode ser realizada por meio de elementos como:

- stepper;
- breadcrumb;
- indicadores de progresso;
- títulos de etapa;
- outras formas equivalentes de orientação.

O mecanismo escolhido deve ser compatível com a complexidade do fluxo.

### Quando não aplicar

Este princípio não se aplica a fluxos compostos por uma única etapa ou a ações concluídas integralmente em uma única interface.

### Exemplos

**Bom**

- Um wizard de matrícula apresenta um stepper indicando "Etapa 2 de 4".
- Um processo de configuração inicial informa claramente quais etapas já foram concluídas.
- Um breadcrumb permite compreender a posição atual em uma sequência de páginas administrativas.

**Ruim**

- O usuário navega por diversas telas sem qualquer indicação de progresso.
- A mudança entre etapas ocorre sem informar onde o usuário está.
- Não há qualquer indicação de quanto ainda falta para concluir a tarefa.

### Forma de verificação

O usuário consegue identificar claramente sua posição dentro do fluxo e compreender seu progresso até a conclusão da tarefa?

Se a interface não comunicar adequadamente a etapa atual ou deixar o usuário desorientado durante a navegação, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-701
- PE-702

---

## PE-704 — A navegação deve minimizar a carga cognitiva

### Objetivo

Garantir que o usuário consiga percorrer um fluxo com o menor esforço mental possível, concentrando sua atenção na tarefa principal em vez de interpretar a interface ou decidir constantemente qual deve ser o próximo passo.

### Problema que resolve

Fluxos que exigem muitas decisões, apresentam caminhos concorrentes ou mudam frequentemente de contexto aumentam a carga cognitiva, tornam a navegação cansativa e elevam a probabilidade de erros e abandono.

A navegação deve conduzir o usuário de forma natural até a conclusão da tarefa.

### Critérios de decisão

Ao projetar um fluxo de navegação:

- cada etapa deve possuir uma única ação principal;
- o próximo passo deve ser evidente;
- decisões desnecessárias devem ser eliminadas;
- caminhos alternativos devem existir apenas quando agregarem valor ao usuário;
- mudanças de contexto devem ser evitadas sempre que possível.

O fluxo deve privilegiar a continuidade da tarefa, evitando obrigar o usuário a interromper sua atividade para navegar por outras funcionalidades.

### Quando não aplicar

Este princípio não impede que funcionalidades complexas ofereçam caminhos alternativos quando necessários.

Nesses casos, a navegação deve continuar previsível e manter o usuário orientado sobre as consequências de cada escolha.

### Exemplos

**Bom**

- Um wizard apresenta apenas a ação "Próximo" como foco principal em cada etapa.
- Um processo de matrícula solicita apenas as informações necessárias em cada momento.
- A navegação conduz naturalmente o usuário até a conclusão da tarefa, sem exigir decisões intermediárias desnecessárias.

**Ruim**

- O usuário encontra diversas ações com o mesmo peso durante cada etapa.
- O fluxo exige navegar por diferentes módulos para concluir uma única tarefa.
- Cada etapa apresenta múltiplos caminhos sem deixar claro qual deve ser seguido.

### Forma de verificação

O fluxo conduz o usuário de maneira contínua, reduzindo decisões desnecessárias e tornando evidente o próximo passo em cada etapa?

Se o usuário precisar interromper constantemente sua linha de raciocínio para decidir como continuar ou para localizar funcionalidades relacionadas, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-103
- PE-701
- PE-702
- PE-703

---

## PE-705 — O usuário deve conseguir interromper e retomar um fluxo sempre que possível

### Objetivo

Garantir que fluxos longos ou complexos permitam ao usuário interromper sua execução e retomá-la posteriormente, reduzindo retrabalho e aumentando a confiança durante a utilização do sistema.

### Problema que resolve

Nem toda tarefa pode ser concluída em uma única sessão.

Interrupções por telefonemas, reuniões, troca de contexto, perda de conexão ou necessidade de consultar outras informações fazem parte do uso cotidiano do sistema.

Quando o fluxo obriga o usuário a reiniciar toda a tarefa após uma interrupção, aumenta a frustração, o retrabalho e a probabilidade de abandono.

### Critérios de decisão

Sempre que tecnicamente viável, fluxos longos ou compostos por múltiplas etapas devem:

- preservar as informações já preenchidas;
- permitir a continuidade da tarefa após uma interrupção;
- evitar perda de trabalho por encerramento acidental da sessão ou navegação involuntária;
- informar claramente quando os dados foram salvos automaticamente ou quando ainda existem alterações pendentes.

Quando não for possível preservar o progresso, a interface deve comunicar essa limitação antes que o usuário abandone o fluxo.

### Quando não aplicar

Este princípio não se aplica a operações instantâneas ou fluxos muito curtos, cuja repetição não represente impacto significativo para o usuário.

Também não se aplica quando houver restrições técnicas, legais ou de segurança que impeçam a preservação parcial dos dados.

### Exemplos

**Bom**

- Um Plano de Ensino salva automaticamente o progresso durante a edição.
- Um cadastro extenso permite continuar posteriormente sem perder os dados já preenchidos.
- O sistema alerta o usuário antes de abandonar uma página com alterações não salvas.

**Ruim**

- Fechar o navegador faz o usuário perder todo o trabalho realizado.
- Navegar para outra tela descarta silenciosamente os dados preenchidos.
- Um fluxo de várias etapas exige reinício completo após qualquer interrupção.

### Forma de verificação

O fluxo preserva o progresso do usuário sempre que tecnicamente possível?

Caso a preservação não seja viável, a interface comunica claramente essa limitação antes que ocorra perda de informações?

Se o usuário perder seu trabalho sem aviso ou precisar reiniciar desnecessariamente um fluxo longo, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-404
- PE-405
- PE-701

---

## PE-8xx — Visualização de Dados

### Observação

Esta categoria define os critérios para selecionar a forma mais adequada de apresentar informações ao usuário, conforme a tarefa que ele precisa realizar.

Ela não define a organização da interface, tratada pela categoria PE-2xx (Hierarquia da Informação), nem a estrutura da página, definida pela categoria PE-3xx (Escolha de Layout).

A implementação visual é responsabilidade do Design System. Esta categoria orienta quando utilizar tabelas, cards, indicadores, gráficos, calendários, timelines e outras formas de visualização.

### Objetivo da categoria

Garantir que cada informação seja apresentada na forma que melhor apoie a compreensão, a tomada de decisão e a execução da tarefa do usuário.

A escolha da visualização deve considerar o objetivo da interface, a natureza dos dados e a ação que o usuário pretende realizar.

### Estrutura da categoria (v1.0)

- PE-801 — A forma de visualização deve refletir a tarefa do usuário
- PE-802 — Informações que exigem atenção imediata devem receber destaque visual
- PE-803 — Informações comparáveis devem utilizar visualizações que facilitem a comparação
- PE-804 — Informações temporais devem evidenciar sua evolução ao longo do tempo
- PE-805 — Grandes volumes de dados devem priorizar exploração e refinamento

---

## PE-801 — A forma de visualização deve refletir a tarefa do usuário

### Objetivo

Garantir que cada informação seja apresentada na forma que melhor apoie a tarefa que o usuário pretende realizar, facilitando a compreensão, a tomada de decisão e a execução de suas atividades.

### Problema que resolve

A mesma informação pode ser apresentada de diversas maneiras.

Quando a forma de visualização é escolhida apenas por preferência estética ou conveniência técnica, o usuário precisa investir mais esforço para interpretar os dados, localizar informações relevantes ou executar suas tarefas.

A visualização deve ser escolhida em função da necessidade do usuário, e não da facilidade de implementação.

### Critérios de decisão

Antes de definir a forma de visualização, responda à seguinte pergunta:

> O que o usuário precisa fazer com esta informação?

A resposta deve orientar a escolha da visualização mais adequada.

Como regra geral:

- localizar ou consultar registros → tabelas;
- acompanhar indicadores → cards ou KPIs;
- comparar valores → gráficos comparativos;
- analisar evolução temporal → gráficos de linha ou séries temporais;
- visualizar eventos no tempo → calendários ou timelines;
- navegar por grandes volumes de informação → tabelas com filtros e ordenação.

A escolha deve priorizar a eficiência da tarefa principal da interface.

### Quando não aplicar

Este princípio não se aplica a conteúdos predominantemente textuais, institucionais ou informativos, cuja apresentação não dependa da interpretação de dados estruturados.

### Exemplos

**Bom**

- A listagem de alunos utiliza uma tabela porque o usuário precisa localizar registros específicos.
- O dashboard apresenta indicadores em cards para facilitar a leitura rápida dos principais números.
- A evolução da frequência escolar é apresentada em um gráfico de linha.

**Ruim**

- Um gráfico é utilizado quando o usuário apenas precisa localizar um registro específico.
- Uma tabela extensa é utilizada para comunicar apenas um indicador principal.
- Informações temporais são apresentadas em uma lista textual difícil de interpretar.

### Forma de verificação

A forma de visualização foi escolhida considerando a principal tarefa que o usuário pretende realizar com aquela informação?

Se outra forma de apresentação permitir executar essa tarefa de maneira significativamente mais eficiente, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-101
- PE-201
- PE-301

---

## PE-802 — Informações que exigem atenção imediata devem receber destaque visual

### Objetivo

Garantir que informações críticas para a tomada de decisão sejam percebidas rapidamente pelo usuário, permitindo identificar situações que exigem atenção ou ação imediata.

### Problema que resolve

Quando todas as informações recebem o mesmo destaque visual, o usuário precisa analisar toda a interface para descobrir o que realmente merece sua atenção.

Isso aumenta o tempo de interpretação, dificulta a priorização das tarefas e pode fazer com que situações importantes passem despercebidas.

### Critérios de decisão

Considere como informação crítica aquela que:

- exige uma ação do usuário;
- representa um risco ou problema;
- indica uma situação fora do comportamento esperado;
- impacta diretamente a execução da tarefa principal.

Essas informações devem possuir maior destaque visual que as demais.

O destaque pode ocorrer por meio de:

- posicionamento estratégico;
- maior contraste visual;
- indicadores visuais previstos pelo Design System;
- diferenciação tipográfica;
- uso adequado de cores semânticas definidas pelo Design System.

O destaque deve representar prioridade, nunca apenas estética.

### Quando não aplicar

Este princípio não se aplica quando todas as informações possuem o mesmo nível de importância ou quando não existe necessidade de priorização visual.

Nesses casos, a interface deve manter uma hierarquia equilibrada.

### Exemplos

**Bom**

- O dashboard destaca imediatamente alunos com frequência abaixo do limite estabelecido.
- Pendências financeiras aparecem em destaque antes das cobranças já quitadas.
- Solicitações aguardando aprovação recebem maior evidência que solicitações concluídas.

**Ruim**

- Informações críticas possuem exatamente o mesmo peso visual que informações meramente informativas.
- O usuário precisa abrir diversas telas para descobrir que existe uma pendência importante.
- Todos os indicadores utilizam o mesmo nível de destaque, independentemente de sua prioridade.

### Forma de verificação

As informações que exigem atenção imediata podem ser identificadas rapidamente pela hierarquia visual da interface?

Se o usuário precisar analisar detalhadamente todas as informações para descobrir o que é prioritário, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-201
- PE-202
- PE-203
- PE-801

---

## PE-803 — Informações comparáveis devem utilizar visualizações que facilitem a comparação

### Objetivo

Garantir que informações destinadas à comparação sejam apresentadas de forma que permita identificar diferenças, semelhanças e tendências com rapidez e precisão.

### Problema que resolve

Quando dados comparáveis são apresentados em formatos inadequados, o usuário precisa realizar comparações mentalmente, aumentando o esforço cognitivo e a probabilidade de interpretações incorretas.

A visualização deve tornar a comparação evidente, e não depender da memória ou de cálculos realizados pelo usuário.

### Critérios de decisão

Sempre que a principal tarefa do usuário for comparar informações, a visualização deve facilitar essa comparação.

Considere, entre outros casos:

- comparação entre períodos;
- comparação entre turmas;
- comparação entre alunos;
- comparação entre indicadores;
- comparação entre unidades escolares;
- comparação entre metas e resultados.

Sempre que possível, as informações comparáveis devem:

- utilizar a mesma escala;
- manter alinhamento visual consistente;
- apresentar os dados lado a lado ou em sequência lógica;
- evitar mudanças de unidade ou formato que dificultem a interpretação.

A visualização escolhida deve reduzir a necessidade de comparação mental.

### Quando não aplicar

Este princípio não se aplica quando o objetivo da interface é apenas consultar um único registro ou visualizar informações isoladas, sem necessidade de comparação.

### Exemplos

**Bom**

- Um gráfico de barras compara a quantidade de matrículas entre escolas.
- Dois indicadores apresentam frequência do mês atual e do mês anterior lado a lado.
- Uma tabela mantém as mesmas colunas para comparar diferentes turmas.

**Ruim**

- Dados que precisam ser comparados aparecem em telas diferentes.
- Valores comparáveis utilizam escalas diferentes sem indicação.
- O usuário precisa alternar continuamente entre páginas para realizar uma comparação simples.

### Forma de verificação

A visualização permite comparar as informações de forma direta, sem exigir que o usuário memorize dados ou realize comparações mentalmente?

Se a comparação depender principalmente da memória do usuário ou exigir navegação constante entre diferentes telas, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-201
- PE-204
- PE-801

---

## PE-804 — Informações temporais devem evidenciar sua evolução ao longo do tempo

### Objetivo

Garantir que informações distribuídas ao longo do tempo sejam apresentadas de forma que facilite a identificação de tendências, padrões, variações e mudanças de comportamento.

### Problema que resolve

Quando informações temporais são apresentadas sem respeitar sua sequência cronológica ou utilizando visualizações inadequadas, o usuário tem dificuldade para compreender a evolução dos dados e identificar mudanças relevantes.

A interface deve tornar a passagem do tempo evidente, permitindo compreender como uma informação evoluiu.

### Critérios de decisão

Sempre que a principal tarefa do usuário for analisar a evolução de informações ao longo do tempo, a visualização deve preservar claramente a ordem cronológica.

Considere, entre outros casos:

- evolução da frequência escolar;
- desempenho por bimestre;
- crescimento das matrículas;
- histórico financeiro;
- evolução de indicadores institucionais.

Sempre que possível, a visualização deve:

- respeitar a sequência temporal;
- facilitar a percepção de tendências;
- permitir identificar aumentos, reduções e estabilidade;
- evitar formatos que ocultem a relação cronológica entre os dados.

A escolha da visualização deve priorizar a compreensão da evolução, e não apenas a apresentação dos valores individuais.

### Quando não aplicar

Este princípio não se aplica quando a informação representa apenas um estado atual, sem necessidade de análise histórica ou comparação entre períodos.

### Exemplos

**Bom**

- Um gráfico de linha apresenta a evolução da frequência escolar durante o ano letivo.
- A evolução das matrículas é apresentada mês a mês em ordem cronológica.
- Um histórico financeiro organiza pagamentos pela data de vencimento.

**Ruim**

- Datas são apresentadas fora de ordem cronológica.
- A evolução de um indicador é exibida em uma tabela sem qualquer organização temporal.
- Informações históricas são misturadas com dados atuais sem distinção.

### Forma de verificação

A visualização permite compreender facilmente como a informação evoluiu ao longo do tempo?

Se o usuário precisar reorganizar mentalmente as datas ou tiver dificuldade para identificar tendências e mudanças, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-801
- PE-803

---

## PE-805 — Grandes volumes de informação devem priorizar exploração e localização, não exposição completa

### Objetivo

Garantir que interfaces com grande quantidade de informações permitam ao usuário localizar rapidamente o que procura, reduzindo a sobrecarga cognitiva e tornando a navegação mais eficiente.

### Problema que resolve

Exibir simultaneamente todos os dados disponíveis dificulta a localização de informações relevantes, aumenta o tempo necessário para executar tarefas e compromete a usabilidade da interface.

Em cenários com grande volume de informações, a prioridade deve ser facilitar a exploração dos dados, e não exibi-los integralmente.

### Critérios de decisão

Sempre que a quantidade de informações puder dificultar a localização de um item específico, a interface deve priorizar mecanismos que auxiliem a exploração dos dados.

Considere, entre outros recursos:

- busca;
- filtros;
- ordenação;
- paginação;
- agrupamentos;
- expansão progressiva de conteúdo.

Esses mecanismos devem reduzir o esforço necessário para encontrar informações relevantes, evitando que o usuário percorra longas listas ou grandes blocos de conteúdo.

A escolha dos mecanismos deve refletir a principal forma de consulta esperada para aquela funcionalidade.

### Quando não aplicar

Este princípio não se aplica quando a quantidade de informações é pequena e pode ser compreendida integralmente sem comprometer a experiência do usuário.

Nesses casos, mecanismos adicionais de exploração podem aumentar desnecessariamente a complexidade da interface.

### Exemplos

**Bom**

- A listagem de alunos oferece busca, filtros por turma e ordenação por nome.
- O histórico financeiro permite filtrar por período e situação do pagamento.
- Um relatório extenso utiliza agrupamentos expansíveis para facilitar a navegação.

**Ruim**

- Todos os registros são exibidos em uma única lista sem qualquer mecanismo de localização.
- O usuário precisa percorrer centenas de registros para encontrar uma informação específica.
- Uma tabela extensa não oferece busca, filtros ou ordenação.

### Forma de verificação

A interface oferece mecanismos que permitam localizar informações de forma eficiente, sem exigir que o usuário percorra manualmente grandes volumes de dados?

Se encontrar uma informação específica depender principalmente da leitura sequencial de toda a interface, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-205
- PE-301
- PE-801

---

## PE-9xx — Acessibilidade

Princípios para garantir que as interfaces possam ser utilizadas pelo maior número possível de pessoas, independentemente de limitações físicas, sensoriais, cognitivas ou do dispositivo utilizado.

A acessibilidade deve ser considerada desde a concepção da funcionalidade, e não apenas como uma etapa de validação após a implementação.

Os princípios desta categoria complementam o Design System, definindo **quando** requisitos de acessibilidade devem orientar decisões de Product Experience. A implementação técnica desses requisitos (atributos ARIA, contraste, foco, componentes acessíveis, entre outros) permanece sob responsabilidade do Design System e da Constitution.

---

### Objetivo da categoria

Garantir que todas as funcionalidades possam ser compreendidas, navegadas e operadas por diferentes perfis de usuários, reduzindo barreiras de uso e promovendo uma experiência consistente e inclusiva.

---

### Estrutura da categoria (v1.0)

- PE-901 — A interface deve permanecer compreensível sem depender exclusivamente de cor.
- PE-902 — Toda funcionalidade deve ser utilizável por teclado.
- PE-903 — A ordem de navegação deve refletir a estrutura visual da interface.
- PE-904 — Componentes interativos devem comunicar claramente seu estado.
- PE-905 — Conteúdos devem utilizar linguagem simples e objetiva.


## PE-901 — A interface não deve depender exclusivamente da cor para comunicar informações

### Objetivo

Garantir que informações importantes permaneçam compreensíveis mesmo para usuários com deficiência na percepção de cores ou em situações nas quais as cores não possam ser distinguidas adequadamente.

### Problema que resolve

Interfaces que utilizam apenas cores para comunicar estados, alertas ou diferenças entre informações criam barreiras de compreensão para parte dos usuários.

A cor deve reforçar uma informação, mas nunca ser o único elemento responsável por comunicá-la.

### Critérios de decisão

Sempre que uma informação depender de diferenciação visual, a interface deve fornecer pelo menos um recurso adicional além da cor.

Considere, entre outros recursos:

- ícones;
- textos;
- rótulos;
- padrões visuais;
- indicadores de estado;
- variações de forma ou estilo.

A combinação desses elementos deve permitir que a informação seja compreendida mesmo sem distinção de cores.

### Quando não aplicar

Este princípio aplica-se a todas as interfaces e não possui exceções.

### Exemplos

**Bom**

- Um status utiliza cor e um ícone para indicar sucesso, aviso ou erro.
- Um campo obrigatório é identificado por um asterisco e uma descrição, além da cor.
- Um gráfico diferencia categorias por cores e rótulos.

**Ruim**

- Um alerta é identificado apenas pela cor vermelha.
- Um gráfico depende exclusivamente de cores para distinguir suas categorias.
- Um campo obrigatório é indicado apenas por uma borda colorida.

### Forma de verificação

As informações continuam compreensíveis quando a diferenciação por cor é removida?

Se estados, categorias ou alertas dependerem exclusivamente da cor para serem compreendidos, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-203

---

## PE-902 — Toda funcionalidade deve ser utilizável por teclado

### Objetivo

Garantir que todas as funcionalidades possam ser utilizadas por usuários que dependam exclusivamente do teclado para navegar e interagir com a interface.

### Problema que resolve

Interfaces que exigem o uso do mouse impedem ou dificultam o acesso de usuários com deficiência motora, usuários de tecnologias assistivas e pessoas que utilizam o teclado como principal forma de navegação.

Toda funcionalidade acessível pelo mouse deve possuir uma alternativa equivalente por teclado.

### Critérios de decisão

Sempre que uma funcionalidade permitir interação do usuário, ela deve poder ser executada utilizando apenas o teclado.

Isso inclui, entre outros:

- navegar entre elementos interativos;
- abrir e fechar diálogos;
- acionar botões;
- selecionar opções;
- preencher formulários;
- utilizar menus e listas;
- confirmar ou cancelar ações.

A navegação por teclado deve permitir concluir a mesma tarefa disponível aos usuários que utilizam mouse ou toque.

### Quando não aplicar

Este princípio aplica-se a todas as interfaces interativas e não possui exceções.

### Exemplos

**Bom**

- Todos os campos de um formulário podem ser acessados utilizando a tecla Tab.
- Um diálogo pode ser fechado utilizando a tecla Esc.
- Um menu pode ser percorrido utilizando as teclas de direção e acionado com Enter.

**Ruim**

- Um menu só pode ser aberto passando o mouse sobre ele.
- Um botão é acionável apenas por clique do mouse.
- Um componente personalizado não recebe foco pelo teclado.

### Forma de verificação

Um usuário consegue concluir a principal tarefa da interface utilizando apenas o teclado?

Se alguma etapa depender exclusivamente do uso do mouse ou de gestos de toque, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-101

---

## PE-903 — A ordem de navegação deve refletir a estrutura visual da interface

### Objetivo

Garantir que a sequência de navegação entre os elementos da interface acompanhe sua organização visual e lógica, tornando a interação previsível e reduzindo a carga cognitiva.

### Problema que resolve

Quando a ordem de navegação difere da organização visual da interface, usuários que utilizam teclado ou tecnologias assistivas encontram dificuldade para compreender o fluxo da página, localizar informações e executar tarefas.

A navegação deve seguir a mesma lógica apresentada visualmente.

### Critérios de decisão

Sempre que uma interface possuir múltiplos elementos interativos, a ordem de navegação deve acompanhar sua estrutura visual e a sequência natural de uso.

Como regra geral, a navegação deve:

- seguir a leitura natural da interface;
- respeitar a hierarquia visual da página;
- acompanhar o fluxo esperado da tarefa;
- evitar saltos inesperados entre regiões da interface.

A sequência de navegação deve permitir que o usuário compreenda naturalmente onde está e qual será o próximo elemento acessado.

### Quando não aplicar

Este princípio aplica-se a todas as interfaces que possuam navegação entre elementos interativos e não possui exceções.

### Exemplos

**Bom**

- Um formulário percorre seus campos na mesma ordem em que são apresentados visualmente.
- O foco passa do título para os filtros, depois para a tabela e, por fim, para as ações da página.
- Um diálogo percorre seus campos antes dos botões de confirmação.

**Ruim**

- O foco salta do primeiro campo diretamente para o rodapé da página.
- A navegação alterna entre regiões sem seguir qualquer ordem lógica.
- O usuário precisa percorrer diversos elementos irrelevantes antes de chegar à ação principal.

### Forma de verificação

A sequência de navegação acompanha a organização visual da interface e o fluxo esperado da tarefa?

Se a navegação apresentar saltos inesperados ou uma ordem diferente daquela percebida visualmente pelo usuário, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-201
- PE-204
- PE-902

---

## PE-904 — Componentes interativos devem comunicar claramente seu estado

### Objetivo

Garantir que o usuário compreenda, a qualquer momento, o estado dos elementos interativos da interface, reduzindo dúvidas sobre sua disponibilidade, comportamento e resposta às ações realizadas.

### Problema que resolve

Quando componentes não comunicam claramente seu estado, o usuário pode interpretar incorretamente o funcionamento da interface, executar ações desnecessárias ou acreditar que o sistema apresentou falhas.

Todo componente interativo deve tornar evidente sua condição atual.

### Critérios de decisão

Sempre que um componente permitir interação, seu estado deve ser facilmente identificável.

Considere, entre outros estados:

- disponível;
- desabilitado;
- selecionado;
- em foco;
- carregando;
- expandido ou recolhido;
- ativo ou inativo.

A comunicação desses estados deve utilizar os recursos definidos pelo Design System, permitindo que o usuário compreenda rapidamente o comportamento esperado do componente.

### Quando não aplicar

Este princípio não se aplica a elementos exclusivamente informativos que não permitam qualquer interação do usuário.

### Exemplos

**Bom**

- Um botão em processamento informa visualmente que a operação está em andamento.
- Um item selecionado permanece claramente identificado.
- Um painel expansível indica se está aberto ou fechado.

**Ruim**

- Um botão desabilitado parece disponível para interação.
- Um menu expansível não informa se está aberto ou fechado.
- O foco de navegação não pode ser identificado visualmente.

### Forma de verificação

O usuário consegue identificar claramente o estado atual de cada componente interativo sem precisar testá-lo?

Se houver componentes cujo estado só possa ser descoberto por tentativa e erro, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-404
- PE-901
- PE-902

---

## PE-905 — A interface deve utilizar linguagem simples, objetiva e adequada ao contexto do usuário

### Objetivo

Garantir que textos, mensagens e instruções sejam facilmente compreendidos pelos usuários da funcionalidade, reduzindo ambiguidades, interpretações incorretas e necessidade de suporte.

### Problema que resolve

Interfaces que utilizam linguagem excessivamente técnica, termos internos do sistema ou textos longos dificultam a compreensão das ações disponíveis e aumentam a carga cognitiva do usuário.

A comunicação da interface deve priorizar clareza e objetividade.

### Critérios de decisão

Sempre que a interface apresentar informações ao usuário, a linguagem utilizada deve:

- utilizar termos conhecidos pelo público-alvo;
- evitar jargões técnicos, siglas ou nomenclaturas internas sem explicação;
- ser objetiva e direta;
- manter consistência de terminologia em todo o sistema;
- orientar claramente a ação esperada quando necessário.

Quando um termo técnico for indispensável, seu significado deve ser facilmente compreensível no contexto da interface.

### Quando não aplicar

Este princípio aplica-se a todas as interfaces e não possui exceções.

### Exemplos

**Bom**

- "Aluno cadastrado com sucesso."
- "Nenhuma turma encontrada para os filtros selecionados."
- "Informe o CPF do responsável."

**Ruim**

- "Operação executada com sucesso."
- "Erro de persistência da entidade."
- "Falha ao sincronizar registros da tabela."

### Forma de verificação

Os textos da interface podem ser compreendidos pelo público-alvo sem exigir conhecimento técnico sobre o funcionamento interno do sistema?

Se mensagens, títulos ou instruções dependerem de termos técnicos desnecessários ou nomenclaturas internas para serem compreendidos, o princípio não foi atendido.

### Referências

- Constitution
- Design System
- PE-102
- PE-402

---

## 8. Governance e Versionamento

### 8.1 Hierarquia de autoridade

Este documento opera abaixo da Constitution e acima do Design System e das Specifications:

```
Constitution > Product Experience > Design System > Product Vision > Specification
```

Em caso de conflito entre este documento e a Constitution, prevalecem sempre as diretrizes estabelecidas pela Constitution.

### 8.2 Versionamento

Este documento segue o versionamento semântico definido pela Constitution:

- **MAJOR** — mudanças incompatíveis com a versão anterior. Remoção ou substituição de um princípio existente, redefinição da relação entre categorias, alteração da estrutura obrigatória dos princípios. Revisões MAJOR exigem verificação de impacto nas Specifications existentes.
- **MINOR** — novos princípios, diretrizes ou categorias, desde que compatíveis com a direção existente. Não invalidam decisões anteriores, mas as complementam.
- **PATCH** — esclarecimentos, correções de redação, ajustes de forma, referências cruzadas. Não alteram o significado de nenhum princípio.

A versão atual deste documento está registrada no cabeçalho. Toda mudança deve atualizar a versão e o status.

### 8.3 Quando atualizar este documento

Este documento deve ser atualizado quando:

- um novo princípio for estabelecido como direção permanente;
- um princípio existente for reformulado, substituído ou removido;
- a estrutura obrigatória dos princípios for alterada;
- a ordem de aplicação ou a relação entre categorias mudar;
- inconsistências forem identificadas entre a direção definida e o produto já implementado.

Não deve ser atualizado para:

- registrar decisões pontuais de uma funcionalidade específica — isso pertence à `spec.md`;
- introduzir variações locais que não se aplicam a todo o sistema;
- corrigir proibições técnicas já cobertas pela Constitution, pelo Design System ou pelo AGENTS.md.

### 8.4 Processo de alteração

toda mudança neste documento deve:

1. Ser proposta com justificativa explícita, indicando o princípio afetado, o motivo e a redação proposta.
2. Ser avaliada à luz dos princípios existentes e da Constitution.
3. Ser registrada no changelog (seção 9).
4. Ter a versão e o status atualizados no cabeçalho.
5. Ser verificada quanto ao impacto sobre as Specifications, o Design System e o AGENTS.md.

---

## 9. Changelog

### [1.0.0] — 2026-07-10

#### Adicionado

- Documento criado com 9 categorias e 33 princípios (PE-101 a PE-905).
- Seções 1 a 7 — Objetivo, Relação com demais documentos, Como utilizar, Ordem de aplicação, Tabela de referência rápida, Estrutura dos princípios, Categorias.
- Seção 8 — Governance e Versionamento.
- Seção 9 — Changelog.

#### Corrigido

- PE-6xx — reconciliada a "Estrutura da categoria (v1.0)" e a "Ordem de aplicação" com os títulos reais dos princípios.
- PE-102 — corrigido typo "ser ser" no título.
- PE-501 e PE-6xx — headings corrigidos de `#` (h1) para `##` (h2).
- PE-6xx e PE-7xx — subseções "Observações", "Objetivo da categoria", "Critério de pertencimento", "Ordem de aplicação" e "Relação com as demais categorias" corrigidas de `##` (h2) para `###` (h3).
- PE-305 — exemplos reformatados com bullets; headings "Forma de verificação" e "Referências" normalizados.
- PE-401, PE-403, PE-404, PE-405 e PE-305 — Referências padronizadas com bullets `-`.
- PE-4xx — "Estrutura da categoria (v1.0)" padronizada com bullets.
- PE-402 — adicionado `### Exemplos` e linha em branco após `### Objetivo`.
- PE-8xx e PE-9xx — adicionados separadores `---` entre princípios.
- Todas as categorias — "Estrutura da categoria (v1.0)" presente em PE-1xx a PE-9xx.
- §2 — adicionada a Product Vision na tabela de documentos.
- §3 — esclarecido que os princípios utilizados devem ser registrados no bloco "Product Experience" da `spec.md`.
- §4 — adicionada justificativa para a ordem de aplicação (PE-7xx antes de PE-2xx).
- PE-202 — definido baseline para "breakpoint predominante" (1366×768 desktop, salvo indicação contrária na Specification).
- PE-603 — removido o item "compatibilidade com navegação por teclado" dos critérios de decisão (pertence à PE-902).