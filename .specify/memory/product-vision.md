# Product Vision

Version: 2.0.0

Status: Frozen

---

## 1. Objetivo

Este documento define a identidade, a personalidade, a direção visual, a linguagem, a experiência desejada e o processo de decisão de design do Bravery SGE.

Seu objetivo é orientar decisões relacionadas à aparência, à personalidade, à percepção, à linguagem e à experiência do produto, garantindo que novas funcionalidades, telas e componentes mantenham uma direção consistente ao longo da evolução do sistema.

Enquanto a Constitution estabelece princípios arquiteturais, o Product Experience define princípios de experiência do usuário, o Design System especifica componentes e padrões de implementação e a Specification define requisitos funcionais de cada feature, este documento responde à pergunta:

> Como o Bravery SGE deve ser percebido pelos seus usuários?

O Product Vision não descreve componentes, tecnologias ou regras de implementação. Seu papel é estabelecer a direção do produto — visual, textual e experiencial — para que diferentes decisões de design caminhem sempre na mesma direção.

---

## 2. Relação com os demais documentos

O Product Vision complementa os demais documentos de governança do Bravery SGE, definindo a identidade, a personalidade e a direção do produto.

Cada documento possui uma responsabilidade específica:

- **Constitution** estabelece os princípios arquiteturais e técnicos do projeto.
- **Product Experience** orienta decisões relacionadas à experiência do usuário.
- **Design System** define componentes, padrões visuais e regras de implementação.
- **Product Vision** estabelece a personalidade, a percepção e a identidade do produto.
- **Specification** define os requisitos funcionais de cada funcionalidade.

Este documento não substitui nem altera as responsabilidades dos demais. Seu papel é orientar decisões de design que influenciam a forma como o Bravery SGE é percebido por seus usuários.

A hierarquia de autoridade entre os documentos é detalhada na seção 9.4. Em síntese:

```
Constitution > Product Experience > Design System > Product Vision > Specification
```

Em caso de conflito entre este documento e qualquer documento de autoridade superior, prevalecem sempre as diretrizes estabelecidas por aquele documento.

---

## 3. Visão do Produto

O Bravery SGE deve ser percebido como uma plataforma de gestão educacional moderna — um SaaS profissional, claro e confiável, projetado para apoiar o trabalho diário de gestores, coordenadores, professores e equipes administrativas.

A experiência do produto deve transmitir organização, simplicidade e controle, reduzindo a sensação de burocracia frequentemente associada aos sistemas de gestão escolar. A interface deve parecer um produto SaaS contemporâneo — não um sistema administrativo antigo.

O objetivo do Bravery SGE não é impressionar pelo excesso de elementos visuais, mas permitir que o usuário execute suas tarefas com confiança, rapidez e previsibilidade.

Cada tela deve contribuir para que o usuário compreenda facilmente sua situação atual, identifique o que exige atenção e saiba qual ação realizar em seguida.

O produto deve privilegiar a clareza das informações, a eficiência das tarefas e a consistência da experiência acima de tendências visuais passageiras.

Ao utilizar o Bravery SGE, o usuário deve sentir que:

- o sistema está organizado;
- as informações importantes são fáceis de encontrar;
- o sistema auxilia seu trabalho em vez de dificultá-lo;
- cada tela possui um propósito claro;
- existe consistência entre os diferentes módulos;
- o produto foi pensado para a rotina escolar, e não adaptado de um sistema administrativo genérico.

O Bravery SGE deve evoluir continuamente, preservando sua identidade visual e sua experiência de uso, independentemente da incorporação de novas funcionalidades.

---

## 4. Personalidade do Produto

A personalidade do Bravery SGE representa os atributos que devem estar presentes em toda decisão de design, independentemente da funcionalidade ou módulo desenvolvido.

Ela serve como referência para avaliar propostas de interface, novas funcionalidades e evoluções do produto.

### 4.1 O Bravery SGE deve transmitir

- **Clareza** — as informações devem ser organizadas de forma que o usuário compreenda rapidamente sua situação e os próximos passos.

- **Confiança** — a interface deve transmitir estabilidade, previsibilidade e segurança, evitando comportamentos inesperados.

- **Organização** — cada tela deve apresentar apenas o que é necessário para a tarefa atual, mantendo uma estrutura consistente entre os módulos.

- **Eficiência** — o sistema deve reduzir a quantidade de etapas necessárias para executar tarefas frequentes.

- **Leveza** — a interface deve evitar excesso de elementos visuais, permitindo que o conteúdo seja o principal protagonista.

- **Proximidade** — o produto deve utilizar uma linguagem acessível e acolhedora, sem perder o profissionalismo esperado em um sistema de gestão.

- **Inteligência** — o sistema deve auxiliar o usuário por meio de contexto, organização e sugestões, reduzindo esforço cognitivo sempre que possível.

### 4.2 O Bravery SGE não deve transmitir

O produto não deve ser percebido como:

- um ERP corporativo genérico;
- um sistema governamental burocrático;
- um sistema administrativo com visual institucional antiquado;
- uma coleção de formulários administrativos;
- uma aplicação visualmente poluída;
- um produto excessivamente tecnológico ou futurista;
- uma interface que prioriza efeitos visuais em detrimento da usabilidade.

### 4.3 Critério de decisão

Sempre que houver mais de uma solução de design possível, deve-se optar pela alternativa que melhor represente a personalidade definida nesta seção, ainda que ela seja visualmente mais simples.

Quando múltiplas alternativas atenderem igualmente à personalidade do produto, o desempate deve seguir os critérios detalhados na seção 9.3 (aderência à personalidade → sobriedade → consistência → eficiência da tarefa).

---

## 5. Princípios Visuais

Os princípios visuais traduzem a personalidade do Bravery SGE em critérios concretos de decisão visual. Eles não definem componentes, escalas ou tokens — isso é responsabilidade do Design System — mas estabelecem a direção que toda decisão visual deve seguir.

Sempre que houver mais de uma solução visual possível, estes princípios devem orientar a escolha. Eles não competem com a Constitution nem substituem o Design System: passam a operar abaixo deles e acima de qualquer preferência individual.

Cada princípio está vinculado a atributos da personalidade definida na seção 4.

### 5.1 Conteúdo acima de decoração

*(Clareza, Leveza)*

A interface existe para apresentar informação, não para sustentar a própria aparência. Elementos visuais — fundos, bordas, ícones, sombras, gradientes — existem para hierarquizar ou orientar; quando passam a competir com o conteúdo, foram mal aplicados.

O dado, o rótulo e a ação devem ser sempre o elemento de maior atenção na tela. Decoração que não serve à clareza deve ser removida, ainda que esteticamente agradável.

### 5.2 Estrutura antes de estilo

*(Clareza, Organização)*

Antes de definir cor, tipografia ou sombra, defina a organização espacial e a hierarquia da informação. Decisões estruturais — ordem, agrupamento, proporção, respiro, alinhamento — carregam mais significado que o detalhe estético.

Quando a estrutura está correta, o estilo decorre naturalmente. Quando a estrutura está errada, nenhum detalhe visual a recupera.

### 5.3 Cor com propósito

*(Confiança, Clareza)*

No Bravery SGE, cor é semântica, não decoração. Cada cor tem papel definido pelo Design System: sinalizar estado, distinguir categoria, evidenciar prioridade.

Usar cor fora do seu papel — para embelezar, preencher ou variar — introduz ambiguidade e enfraquece o significado das cores corretas. A paleta deve permanecer limitada e disciplinada: restrição amplifica o significado; variedade o dilui.

### 5.4 Hierarquia pela tipografia

*(Clareza, Eficiência)*

Tamanho, peso e contraste tipográfico são o instrumento primário de hierarquia da interface. Reduzir o tamanho ou elevar o peso deve mapear, com consistência, a importância da informação.

Variações tipográficas excessivas — muitas famílias, muitos pesos, estilos decorativos — enfraquecem a leitura e a percepção de hierarquia. A tipografia deve permanecer restrita à escala e aos pesos oficiais do Design System.

### 5.5 Espaçamento como organização

*(Organização, Leveza)*

Respiro não é estética: é estrutura. Proximidade comunica relação; distanciamento comunica separação. Espaçamento consistente produz ordem; espaçamento arbitrário produz ruído.

A escala de espaçamento deve ser derivada exclusivamente do Design System e aplicada de forma previsível em todo o sistema. Espaçamentos não oficiais, ajustados caso a caso, comprometem a percepção de unidade do produto.

### 5.6 Movimento com intenção

*(Leveza, Eficiência)*

Animações e transições existem para orientar a percepção de continuidade, mudança de contexto e causalidade. Elas auxiliam o usuário a compreender o que aconteceu e o que vai acontecer em seguida.

Movimento decorativo, automático, repetitivo ou excessivo desvia a atenção da tarefa. Animações sutis, curtas e reversíveis são preferíveis a efeitos elaborados. O usuário deve perceber o resultado da interação, não a animação em si.

### 5.7 Densidade informacional controlada

*(Eficiência, Clareza)*

O Bravery SGE lida com tabelas extensas, grades, dashboards e relatórios. Densidade alta não é sinônimo de bagunça: alta densidade exige ainda mais hierarquia, respiro e contraste controlado.

Interfaces densas devem permanecer legíveis sem exigir varredura visual exaustiva. Linhas, colunas e indicadores precisam ser discrimináveis; quando a quantidade de dados aumenta, a clareza — nunca a compressão — deve guiar a organização.

### 5.8 Consistência como identidade

*(Confiança, Inteligência)*

A percepção de produto constrói-se pela repetição. Componentes, espaçamentos, ícones, terminologia, padrões de interação e estados visuais devem aparecer da mesma forma em qualquer módulo.

Inconsistências, mesmo pequenas, erodem a confiança e a sensação de profissionalismo. A coerência entre telas é o principal sinal visual de que o Bravery SGE é um produto único, e não uma coleção de telas soltas.

### 5.9 Previsibilidade visual

*(Confiança)*

Elementos não mudam de aparência sem razão. Estados — hover, foco, selecionado, desabilitado, carregando, erro — devem seguir padrão estável e reconhecível em todo o sistema.

Variações visuais imprevisíveis forçam o usuário a aprender novamente cada tela e enfraquecem a confiança no funcionamento do produto. Toda mudança visual na interface deve poder ser explicada por uma regra, e nunca por preferência pontual.

### 5.10 Limitação intencional

*(Clareza, Leveza)*

Mais cores, mais pesos tipográficos, mais estilos de borda, mais variações de espaçamento reduzem legibilidade e identidade. O Bravery SGE deve operar dentro de um conjunto limitado e bem justificado de recursos visuais.

Restrição intencional é uma forma de controle: ela garante que cada decisão visual tenha peso e significado. Antes de introduzir uma nova variação, deve-se avaliar se uma opção já existente atende à necessidade.

### Critério de aplicação

Sempre que uma decisão visual precisar ser tomada, percorra os princípios acima em ordem. A alternativa que melhor atender ao maior número de princípios — ainda que visualmente mais simples — deve ser a escolhida.

Quando dois princípios aparentemente conflitarem, prevalece aquele vinculado aos atributos de personalidade mais relevantes para a tarefa em questão. Em caso de dúvida, opte pela solução mais sóbria: o Bravery SGE privilegia clareza, confiança e previsibilidade em detrimento de impacto visual.

Em caso de conflito entre qualquer princípio visual e a Constitution, o Design System ou o Product Experience, prevalecem estes últimos. Este documento orienta a direção, não substitui as regras executáveis.

---

## 6. Linguagem da Interface

A linguagem da interface é a forma como o Bravery SGE se dirige ao usuário por meio de textos, rótulos, mensagens, confirmações, erros, orientações e instruções. Ela é parte essencial da identidade do produto: o usuário não separa "o que a tela diz" de "como a tela se sente".

Esta seção não define terminologia específica, nomes de botões ou mensagens prontas — isso é responsabilidade do Design System e das Specification de cada funcionalidade. Ela estabelece a direção que toda comunicação textual do produto deve seguir.

A linguagem da interface deve refletir a personalidade definida na seção 4 e subordinar-se às regras de Product Experience (em especial o princípio PE-905, sobre linguagem simples e objetiva).

Quando houver mais de uma forma possível de comunicar algo, prevalece aquela que melhor representa os critérios abaixo — ainda que seja a mais curta.

### 6.1 O sistema fala com o usuário, nunca consigo mesmo

*(Proximidade, Confiança)*

O texto da interface é direcionado a uma pessoa. Rótulos, mensagens e instruções devem ler-se como comunicação direta, não como documentação interna, log de sistema ou descrição técnica automatizada.

Evite redação passiva impessoal ("o cadastro foi efetuado") quando o sujeito da ação é o próprio sistema ou o próprio usuário. Prefira formas claras e explícitas ("Aluno cadastrado com sucesso", "Informe o CPF do responsável").

A interface nunca deve parecer falar para outra máquina, para um auditor ou para um log. Ela fala para a pessoa que precisa concluir uma tarefa.

### 6.2 Linguagem do domínio escolar, não do sistema

*(Proximidade, Inteligência)*

O Bravery SGE é feito para a rotina escolar. A terminologia deve refletir o vocabulário das escolas — turmas, matrículas, ano letivo, docentes, responsáveis, indicadores — e não o vocabulário interno de desenvolvimento ou de outras indústrias.

Termos genéricos de software ("entidades", "registros", "instâncias", "objetos") devem ser evitados quando existir um termo reconhecido no contexto escolar. Quando um termo técnico for indispensável, ele deve ser explicado pelo contexto da própria interface.

### 6.3 Objetividade sobre explicação

*(Clareza, Eficiência)*

O texto da interface deve informar e orientar, não descrever a si mesmo. Frases mais curtas são preferíveis, desde que não sacrifiquem o significado.

Evite rodeios, qualificações desnecessárias e construções verbais que não adicionem informação. Antes de escrever uma explicação, verifique se a organização da tela ou o rótulo do elemento não a torna desnecessária.

Quando for possível reduzir visibilidade do texto reformulando o rótulo ou a estrutura da tela, essa redução é preferível a manter o texto explicativo.

### 6.4 Clareza sobre brevidade

*(Clareza, Confiança)*

A objetividade não atinge a obscuridade. Reduzir palavras a ponto de tornar a frase ambígua, técnica ou incompleta viola a clareza — que é o objetivo primeiro.

Quando houver conflito entre curto e claro, escolha claro. A brevidade serve à clareza; nunca o contrário. Acrônimos, abreviações e elipses só devem ser usados quando o significado for imediatamente reconhecível para o público-alvo.

### 6.5 Ação antes de consequência

*(Clareza, Eficiência)*

Quando o texto orientar uma ação, diga primeiro o que o usuário deve fazer, depois — se necessário — por que ou o que acontecerá. O verbo de ação deve aparecer antes da justificativa.

**Bom**: "Clique em Salvar para registrar o cadastro."
**Ruim**: "Para que o cadastro seja registrado, é necessário que você clique em Salvar."

Nas confirmações destrutivas, inverta: diga primeiro o que será afetado e depois o que o usuário deve confirmar. O alerta vem antes do botão.

### 6.6 Estados comunicados, não interpretados

*(Confiança, Previsibilidade)*

Mensagens de estado — sucesso, erro, advertência, confirmação, carga — devem descrever explicitamente a situação. Nunca deixem o usuário adivinhar o que aconteceu a partir de pistas visuais ambíguas.

Um erro deve dizer que houve erro. Um sucesso deve dizer que houve sucesso. Um processamento em andamento deve dizer que está em andamento. A combinação de cor, ícone e texto deve reforçar — não substituir — a comunicação textual do estado.

Esta direção está alinhada aos princípios PE-402, PE-403 e PE-404.

### 6.7 Erros explicam, não culpam

*(Proximidade, Confiança)*

Mensagens de erro devem assumir que o problema é do sistema ou do fluxo, não do usuário. Frases como "Você não preencheu corretamente" devem ser substituídas por "Informe um CPF válido".

O texto deve ajudar o usuário a recuperar-se, não apontar falhas. Quando o erro decorrer de uma ação do usuário, a redação deve orientar a correção, não julgar a tentativa.

Esta direção está alinhada ao princípio PE-402.

### 6.8 Consistência terminológica

*(Confiança, Inteligência)*

Um mesmo conceito deve receber um mesmo nome em todo o sistema. "Turma" não vira "classe" em outra tela; "matrícula" não vira "inscrição" em outro módulo.

A consistência terminológica reduz a carga cognitiva e fortalece a percepção de produto único. Introduzir sinônimos por variedade ou estilo viola este critério.

A terminologia oficial do sistema é definida e governada pelo Design System, e subsidiariamente pela Specification de cada funcionalidade.

### 6.9 Verbos nos rótulos de ação

*(Clareza, Eficiência)*

Botões e ações nomeiam o que será feito quando acionados. Use verbos no infinitivo ou no imperativo, conforme o padrão oficial: "Salvar", "Cancelar", "Excluir", "Nova Turma", "Filtrar".

Rótulos vagos como "OK", "Confirmar" (sem objeto) ou "Prosseguir" devem ser evitados quando a ação puder ser mais explícita. O usuário deve saber exatamente o que o botão fará antes de clicar.

### 6.10 Sem redundância entre texto e contexto

*(Leveza, Clareza)*

Não repita no texto o que já é evidente pela estrutura, pelo rótulo ou pela posição do elemento. Uma coluna chamada "Nome" não precisa repetir o cabeçalho "Nome do Aluno" se cada célula já exibe o nome do aluno.

A redundância textual compete com a densidade informacional (princípio visual 5.7) e enfraquece a hierarquia. Antes de acrescentar texto, verifique se ele está duplicando significado que já existe no contexto.

### Critério de aplicação

Sempre que redigir texto de interface, percorra os critérios acima nesta ordem. A redação que melhor atender ao maior número de critérios — ainda que seja a mais curta — deve ser a escolhida.

Em caso de conflito entre brevidade e clareza, prevalece clareza. Em caso de conflito entre rigor terminológico e proximidade, prevalece proximidade — desde que não comprometa a consistência do sistema.

Em caso de conflito entre qualquer diretriz de linguagem e a Constitution, o Design System, o Product Experience ou a Specification da funcionalidade, prevalecem estes últimos. Este documento orienta a direção da voz do produto, não substitui as regras executáveis.

---

## 7. Experiência desejada

A experiência desejada descreve como o Bravery SGE deve ser sentido pelo usuário ao longo do tempo — desde o primeiro contato até o uso contínuo e aprofundado.

Esta seção não define fluxos, jornadas ou regras de navegação. Isso é responsabilidade do Product Experience (em especial as categorias PE-7xx e PE-5xx). Ela descreve a percepção que deve acompanhar o usuário em cada momento significativo de uso, traduzindo a personalidade do produto (seção 4) em expectativas concretas de experiência.

Cada critério abaixo corresponde a um momento ou estado recorrente da relação entre o usuário e o sistema. Quando um momento não estiver explicitamente nomeado aqui, deve ser avaliado pela personalidade do produto e pelos princípios visuais e de linguagem definidos anteriormente.

### 7.1 No primeiro contato: orientação imediata

*(Clareza, Organização)*

Ao abrir qualquer funcionalidade pela primeira vez, o usuário deve compreender imediatamente o que a tela faz, qual informação está disponível e qual ação é esperada dele.

A primeira impressão não deve exigir exploração, tutoriais longos nem conhecimento prévio. O sistema entrega contexto suficiente para iniciar a tarefa; o resto é revelado conforme a necessidade.

### 7.2 No uso diário: ausência de atrito

*(Eficiência, Confiança)*

Após poucos dias de uso, o usuário deve executar suas tarefas frequentes sem precisar pensar na interface. As decisões comuns — localizar um aluno, registrar uma frequência, emitir um relatório — devem ser caminhos curtos, previsíveis e estáveis.

O sistema nunca deve inserir desvios, confirmações redundantes ou etapas desnecessárias que transformem uma tarefa rotineira em uma sequência longa de decisões.

### 7.3 Na densidade de informação: sob controle

*(Eficiência, Clareza)*

Ao lidar com turmas cheias, históricos longos, grades horárias ou relatórios extensos, o usuário deve sentir que o sistema domina a complexidade — não que a complexidade domina a tela.

Mesmo sob alta densidade informacional (princípio visual 5.7), a interface deve permanecer legível, navegável e organizada. O usuário não deve sentir que está diante de uma pilha de dados, mas sim diante de uma estrutura.

### 7.4 Na tomada de decisão: contexto à mão

*(Inteligência, Confiança)*

Sempre que o usuário precisar decidir — aprovar uma matrícula, alterar uma situação, responder a um aluno —, as informações relevantes para essa decisão devem estar próximas, organizadas e prontas para comparação.

O sistema não deve obrigar o usuário a alternar entre telas, montar mentalmente o quadro ou recordar dados dispersos. O contexto da decisão é parte da decisão e deve estar à mão.

### 7.5 No erro: caminho de volta visível

*(Proximidade, Confiança)*

Quando algo der errado, o sistema deve comunicar o que houve, por que houve e como o usuário pode prosseguir. O erro não deve ser um beco sem saída nem uma frase opaca.

A percepção durante uma falha é um dos momentos mais sensíveis da experiência: o sistema pode demonstrar profissionalismo cuidando do usuário ou pode perder sua confiança em segundos. O Bravery SGE deve sempre oferecer um caminho de volta visível.

### 7.6 No sucesso: confirmação discreta

*(Leveza, Confiança)*

Quando uma tarefa for concluída com sucesso, o sistema confirma — de forma breve, objetiva e visual — que o resultado foi alcançado. Não celebra em excesso nem interrompe o ritmo.

A confirmação de sucesso é parte do contrato de confiança com o usuário: ele precisa saber que o sistema registrou sua ação. Mas o sucesso não é um evento espetacular; é o que se espera que aconteça sempre.

### 7.7 Na exploração: segurança para experimentar

*(Inteligência, Proximidade)*

O usuário deve sentir que pode explorar funcionalidades — abrir filtros, alterar visualizações, navegar entre módulos — sem receio de causar danos. Ações destrutivas estão claramente identificadas; ações reversíveis não exigem hesitação.

Sentir-se seguro para experimentar é o que distingue um sistema que o usuário usa com medo daquele que o usuário usa com fluência. O Bravery SGE deve pertencer ao segundo grupo.

### 7.8 Na interrupção: continuidade

*(Confiança, Eficiência)*

Quando o usuário precisar interromper uma tarefa — para atender o telefone, sair para uma reunião, mudar de contexto —, o sistema deve preservar o que já foi feito e permitir retomar o trabalho no ponto em que parou.

A continuidade é parte essencial da percepção de que o sistema respeita o tempo do usuário. Forçar a recompor todo o trabalho após cada interrupção transforma o produto em uma carga, não em um apoio.

### 7.9 No aprofundamento: descoberta progressiva

*(Inteligência, Organização)*

À medida que o domínio do usuário aumenta, funcionalidades mais sofisticadas devem tornar-se acessíveis sem terem sido empurradas na primeira utilização. O sistema revela complexidade quando o usuário demonstra estar pronto para ela, não de uma vez.

O usuário iniciante encontra simplicidade; o usuário experiente encontra atalhos, filtros avançados e detalhes sob demanda. A complexidade não é ocultada por capricho nem exibida por orgulho — ela aparece quando agrega valor.

### 7.10 Ao longo do tempo: estabilidade reconhecível

*(Confiança, Leveza)*

Mesmo com a evolução do produto — novas funcionalidades, melhorias, correções —, o usuário deve reconhecer o Bravery SGE como o mesmo sistema. Padrões, terminologia, layout e fluxos principais permanecem identificáveis.

A percepção de estabilidade ao longo do tempo é o que transforma um conjunto de telas em um produto. Mudanças que reorganizam esses alicerces sem necessidade — por moda, por ferramenta nova, por reformulação estética — corroem a confiança acumulada.

### Critério de aplicação

Sempre que avaliar uma proposta de experiência, identifique quais dos momentos acima ela afeta e verifique se a percepção resultante caminha na direção desejada.

Quando uma decisão impactar mais de um momento, prevalece aquele mais central para a tarefa em pauta. Quando dois momentos aparentemente conflitarem, prevalece a solução que fortalece a confiança e a continuidade do usuário.

Esta seção descreve a experiência desejada; não substitui as regras executáveis do Product Experience. Em caso de conflito entre qualquer diretriz de experiência e a Constitution, o Design System, o Product Experience ou a Specification, prevalecem estes últimos.

---

## 8. O que evitar

A seção 4 definiu, em termos positivos, o que o Bravery SGE deve transmitir. Esta seção descreve, em termos concretos, os caminhos visuais, comportamentais e linguísticos que o produto deve recusar — independentemente de moda, solicitação pontual ou preferência individual.

Os itens abaixo não são proibições técnicas. Proibições executáveis — hexadecimais hardcoded, componentes nativos, escalas fora do Design System — já estão consolidadas na Constitution, no Design System e no AGENTS.md.

Esta seção trata de direções de percepção que, embora não sejam tecnicamente ilícitas, comprometem a identidade visual do produto. Sempre que qualquer decisão caminhar em alguma destas direções, ela deve ser reavaliada.

As direções indesejadas estão agrupadas por natureza, não por prioridade. Todas devem ser evitadas.

### 8.1 Decoração sem função

*(viola Conteúdo acima de decoração, 5.1)*

Evitar:

- sombras, gradientes ou texturas usados exclusivamente como acabamento visual,
- bordas e divisores que não separam conteúdos distintos,
- ícones puramente decorativos,
- componentes desenvolvidos inteiramente para variar visualmente uma área que já está hierarquizada,
- backgrounds coloridos que não sinalizam estado nem categoria.

O Bravery SGE é um produto de trabalho: cada elemento visual deve responder pelo que comunica, não pelo que decora.

### 8.2 Movimento como espetáculo

*(viola Movimento com intenção, 5.6)*

Evitar:

- animações automáticas em loop que não comunicam estado,
- abertura de telas em "fade", slide ou zoom quando o conteúdo é imediatamente estático,
- microinterações decorativas que prolongam a percepção da interface,
- loaders prolongados artificialmente para sugerir processamento robusto,
- transições que trocam dados sem necessidade.

O usuário deve perceber o resultado da interação, não o esforço visual do sistema.

### 8.3 Densidade mal hierarquizada

*(viola Densidade informacional controlada, 5.7)*

Evitar:

- tabelas, cards e grades que empurram grande volume de dados sem hierarquia visual,
- telas que iniciam com mais conteúdo do que o usuário pode absorver no primeiro contato,
- linhas ou colunas com o mesmo peso visual para indicadores de importâncias distintas,
- relatórios extensos que apresentam pouca diferença visual entre seção, título, nota e conteúdo.

Alta densidade só é aceitável quando a hierarquia permanece legível. Caso contrário, é bagunça disfarçada de utilidade.

### 8.4 Cor como estética

*(viola Cor com propósito, 5.3)*

Evitar:

- cores adicionais apenas para trazer variedade visual a uma seção,
- variação de paleta entre módulos sem motivo funcional,
- uso de cor fora do uso semântico definido pelo Design System,
- aplicação de cor como identificador visual de funcionalidade quando não faz parte do vocabulário oficial do sistema,
- uso de cor apenas para "animar" a interface.

Cada cor que aparece no sistema deve poder ser justificada por uma regra: se não há regra, ela não deve estar ali.

### 8.5 Estilo acima de estrutura

*(viola Estrutura antes de estilo, 5.2)*

Evitar:

- decisões de cor, tipografia ou estilo antes da organização espacial estar definida,
- reformulações visuais pontuais que não tratam da organização subjacente,
- avaliação de uma tela pela sua aparência isolada, sem considerar sua estrutura informacional,
- cuidado estético com telas cuja organização ainda não foi resolvida.

Quando a estrutura está certa, o estilo acompanha. Quando a estrutura está errada, nenhum acabamento resolve.

### 8.6 Variação por variedade

*(viola Limitação intencional, 5.10)*

Evitar:

- pesos tipográficos extras além dos necessários,
- variações de espaçamento dentro da mesma escala sem justificativa,
- múltiplas formas de apresentar o mesmo padrão em telas distintas,
- criação de variação local para diferenciar um módulo dos demais,
- introdução de novos componentes apenas porque a implementação é diferente.

A consistência visual é o sinal mais forte de que o Bravery SGE é um produto único. Variação sem motivo a fragmenta.

### 8.7 Surpresas visuais

*(viola Previsibilidade visual, 5.9)*

Evitar:

- estados de interação (hover, foco, selecionado, desabilitado) que diferem entre componentes sem razão,
- mudanças de paleta entre módulos,
- alterações de layout sem relação com uma nova necessidade funcional,
- ícones com significado diferente daquele que o mesmo ícone já carrega em outra parte do sistema,
- cores, sombras e bordas que aparecem em um componente e não nos seus equivalentes.

O usuário reconhece o sistema pela repetição. Toda diferença que não se apoia em uma regra deve ser removida.

### 8.8 Linguagem distante do domínio

*(viola 6.2 Linguagem do domínio escolar, não do sistema)*

Evitar:

- termos de software genérico ("entidades", "registros", "instâncias") quando existe termo escolar reconhecido,
- rótulos técnicos ("persistir", "sincronizar", "validar entidade") expostos ao usuário final,
- nomenclaturas internas da equipe que vazam para a interface,
- siglas e códigos administrativos usados como se fossem linguagem do produto.

A linguagem da interface é a linguagem da escola. O vocabulário interno do desenvolvimento permanece interno.

### 8.9 Excesso visual como compensação

*(viola Leveza, seção 4)*

Evitar:

- preencher áreas com elementos visuais para evitar sensação de espaço vazio,
- adicionar ícones, emblemas ou luzes a uma interface porque ela parecia simples demais,
- cobrir densidade informacional insuficiente com elementos decorativos,
- usar bordas, sombras e gradientes para dar "presença" a uma seção cuja presença não foi justificada pelo conteúdo.

O espaço vazio é parte da interface. Ele não precisa ser preenchido: precisa ser respeitado.

### 8.10 Falta de critério como estilo

*(viola todas as seções anteriores)*

Evitar:

- decisões visuais justificadas apenas em "eu prefiro" ou "achamos bonito",
- adoção de padrões de outras aplicações por identificação visual, sem avaliar coerência com o Bravery SGE,
- propostas visuais sem referência a uma seção deste documento ou à personalidade definida na seção 4,
- mudanças de estilo que não podem ser justificadas por um princípio anterior a si mesmas.

Toda decisão visual no Bravery SGE deve poder ser referida a um critério deste documento. Quando não pode, ela não é uma decisão: é uma preferência.

### Critério de aplicação

Sempre que se deparar com uma decisão visual que caminhe em qualquer uma das direções acima, rejeitá-la — independentemente de quem a propôs.

Esta seção não substitui proibições técnicas da Constitution, do Design System ou do AGENTS.md. Ela as complementa ao tratar de direções de percepção que comprometem a identidade do produto.

Quando uma proposta respeitar tecnicamente todas as proibições formais e ainda assim caminhar em direção a um dos itens desta seção, ela deve ser reavaliada à luz da personalidade do produto (seção 4) e dos princípios visuais da seção 5.

Em caso de conflito entre qualquer diretriz desta seção e a Constitution, o Design System, o Product Experience ou a Specification, prevalecem estes últimos.

---

## 9. Processo de decisão

Este documento define princípios, personalidade, linguagem, experiência desejada e direções a evitar. Para que tudo isso opere de forma consistente, é necessário definir como as decisões de design devem ser tomadas na prática — quem decide, em que ordem, com base em quê e como se resolvem divergências.

O processo de decisão descrito abaixo é obrigatório para toda decisão visual, textual ou experiencial que afete a interface do Bravery SGE. Ele não substitui o fluxo Spec-Driven Development definido pela Constitution (`specify → clarify → plan → tasks → implement → analyze`); ele se aplica dentro dele, orientando as decisões de design que acompanham cada etapa.

### 9.1 Toda decisão de design deve ser referida a um critério

Nenhuma decisão visual, textual ou experiencial deve ser tomada por preferência individual. Toda escolha deve poder ser referida a:

- um princípio visual da seção 5;
- uma diretriz de linguagem da seção 6;
- uma expectativa de experiência da seção 7;
- uma direção evitada da seção 8;
- um atributo da personalidade do produto da seção 4.

Quando uma decisão não puder ser referida a nenhum destes critérios, ela não é uma decisão de design: é uma preferência. Preferências individuais não orientam o produto.

### 9.2 Ordem de consulta

Antes de tomar uma decisão de design, consultar os documentos na seguinte ordem:

1. **Constitution** — verificar se há princípios arquiteturais ou técnicos que delimitam a decisão.
2. **Product Experience** — identificar quais princípios de experiência do usuário se aplicam à situação.
3. **Product Vision (este documento)** — consultar a personalidade, os princípios visuais, a linguagem, a experiência desejada e o que evitar.
4. **Design System** — verificar componentes, tokens, layouts e padrões visuais disponíveis.
5. **Specification da funcionalidade** — verificar requisitos funcionais que possam restringir a decisão.

A consulta deve seguir esta ordem porque cada documento tem autoridade sobre os documentos subsequentes. Uma decisão que contradiga a Constitution não pode ser tomada; uma que contradiga o Product Vision pode ser tomada se houver justificativa técnica na Constitution, no Product Experience ou no Design System.

### 9.3 Quando há mais de uma solução válida

Quando múltiplas alternativas satisfizerem tecnicamente todos os documentos anteriores, a decisão final deve seguir estes critérios, em ordem:

1. **Aderência à personalidade do produto** (seção 4) — a alternativa que melhor representar a personalidade definida deve ser preferida.
2. **Sobriedade** — em caso de empate no critério anterior, preferir a alternativa visualmente mais simples e restrita.
3. **Consistência com o restante do sistema** — em caso de novo empate, preferir a alternativa que mantém maior coerência com padrões já estabelecidos em outros módulos.
4. **Eficiência da tarefa** — em caso de persistência do empate, preferir a alternativa que reduz o esforço do usuário para concluir a tarefa principal.

Após aplicar todos os critérios, se ainda houver empate, a decisão pode ser tomada por preferência individual — mas a equivalência deve estar documentada, indicando que as alternativas eram indistinguíveis pelos critérios acima.

### 9.4 Quando há conflito entre documentos

Em caso de conflito entre documentos, prevalece sempre o documento de maior autoridade:

```
Constitution > Product Experience > Design System > Product Vision > Specification
```

A Constitution tem autoridade máxima. O Product Experience define regras executáveis de experiência do usuário que o Product Vision não pode contrariar. O Design System define regras visuais executáveis que o Product Vision orienta, mas não substitui. A Specification define requisitos funcionais que restringem a decisão, mas não a determinam sozinha.

Um conflito não significa que o documento de menor autoridade esteja errado: significa que ele não pode prevalecer naquele caso específico. Quando o Product Vision for sobreposto por outro documento, isso deve ser registrado para orientar futuras revisões.

### 9.5 Quando uma decisão não existe nos documentos

Quando uma decisão de design não estiver coberta por nenhum documento existente, ela deve ser tomada com base na personalidade do produto (seção 4) e registrada para revisão futura.

Nesses casos, a decisão deve ser:

- **documentada** na Specification da funcionalidade, explicando o critério utilizado;
- **referida** a um ou mais atributos da personalidade do produto;
- **marcada como pendente de incorporação** ao Design System ou ao Product Vision, conforme sua natureza.

Uma decisão não coberta pelos documentos não é livre: é temporária. O registro garante que ela seja revisada e, se necessário, promovida a regra oficial em versões futuras.

### 9.6 Quando uma decisão exige novo componente ou padrão

Quando nenhuma solução existente no Design System atender adequadamente à necessidade, a nova solução deve ser registrada na Specification da funcionalidade e posteriormente avaliada para incorporação ao Design System, conforme definido pela Constitution (Princípio XI — Design System First).

A decisão de criar um novo componente ou padrão não é uma decisão de design isolada: é uma decisão arquitetural que exige aprovação e documentação, conforme a Constitution (Princípio X — No New Patterns Without Approval).

### 9.7 Registro da decisão

Toda decisão de design significativa deve ser registrada no artefato apropriado do fluxo SDD:

- **decisões de layout, hierarquia e organização** → Specification da funcionalidade, bloco de Product Experience;
- **decisões de componente novo ou padrão visual novo** → Specification + Design System (para incorporação futura);
- **decisões de terminologia ou linguagem** → Specification da funcionalidade, com referência à terminologia oficial;
- **decisões que contrariam ou extrapolam o Product Vision** → Specification da funcionalidade, com justificativa explícita.

O registro não é burocracia: é o mecanismo que permite que decisões pontuais se tornem padrões auditáveis e, eventualmente, regras oficiais.

### 9.8 Revisão de decisões

Decisões de design não são definitivas. À medida que o produto evolui, decisões anteriores podem ser revisitadas quando:

- novos padrões forem incorporados ao Design System;
- o Product Vision for atualizado;
- a funcionalidade for significativamente revisada;
- inconsistências forem identificadas entre módulos.

A revisão não invalida a decisão original: ela garante que o sistema permaneça coerente ao longo do tempo. A estabilidade reconhecível (seção 7.10) exige que mudanças sejam avaliadas com critério, não que sejam proibidas.

### Critério de aplicação

O processo acima deve ser seguido em toda decisão de design que afete a interface do Bravery SGE. Decisões triviais — escolher entre dois componentes oficiais equivalentes, aplicar um padrão já estabelecido — não exigem registro formal, mas devem ainda assim respeitar a ordem de consulta (9.2).

Decisões que introduzam variação, novo padrão, nova terminologia ou desvio de um princípio deste documento exigem registro e justificativa.

Em caso de dúvida sobre se uma decisão é significativa, registre-a. O custo de documentar uma decisão simples é sempre menor do que o custo de uma inconsistência não rastreada.

---

## 10. Evolução

O Product Vision não é estático. À medida que o Bravery SGE amadurece, incorpora funcionalidades e atende novos perfis de usuário, este documento deve evoluir para continuar refletindo a identidade e a direção do produto.

A evolução deste documento segue a mesma governança definida pela Constitution: mudanças são justificadas, aprovadas e versionadas. Esta seção define como isso deve ocorrer.

### 10.1 O que pertence a este documento

Pertence ao Product Vision tudo o que orienta a percepção, a personalidade, a direção visual, a linguagem e a experiência desejada do Bravery SGE.

Não pertence a este documento:

- regras executáveis de implementação — Design System;
- princípios arquiteturais ou técnicos — Constitution;
- regras de experiência do usuário — Product Experience;
- requisitos funcionais — Specification da funcionalidade;
- decisões pontuais de design — Specification da funcionalidade (bloco de Product Vision).

Quando uma regra deste documento se tornar executável — com verificações objetivas, critérios mensuráveis e aplicação auditável — ela deve ser promovida ao Design System ou ao Product Experience, conforme sua natureza. O Product Vision orienta; os outros documentos executam.

### 10.2 Quando atualizar este documento

Este documento deve ser atualizado quando:

- a identidade visual do produto for revisada deliberadamente;
- um novo atributo de personalidade for incorporado ou um existente for reformulado;
- um novo princípio visual, de linguagem ou de experiência for estabelecido como direção permanente;
- uma direção indesejada (seção 8) for incorporada ou removida;
- o processo de decisão for alterado;
- a relação entre o Product Vision e os demais documentos mudar;
- inconsistências forem identificadas entre a direção definida e o produto já implementado.

Não deve ser atualizado para:

- registrar decisões pontuais de uma funcionalidade específica (instrução para a Specification);
- introduzir variações locais que não se aplicam a todo o produto;
- corrigir proibições técnicas já cobertas pela Constitution, pelo Design System ou pelo AGENTS.md;
- acompanhar modismos visuais passageiros.

### 10.3 Quem propõe mudanças

Toda mudança neste documento deve ser proposta com justificativa explícita, indicando:

- a seção afetada;
- o motivo da mudança;
- o problema identificado na versão atual;
- a redação proposta;
- o impacto esperado sobre as decisões de design futuras.

A proposta deve ser avaliada à luz da personalidade do produto (seção 4) e dos princípios visuais, de linguagem e de experiência já estabelecidos. Uma mudança que contradiga a direção existente sem justificativa acarretando um avanço real do produto deve ser rejeitada.

### 10.4 Como incorporar mudanças

A incorporação de uma mudança aprovada deve seguir estes passos:

1. **Registrar** a mudança no changelog (seção 10.6).
2. **Atualizar** a redação da seção afetada.
3. **Revisar** as seções que referenciam aquela alterada, ajustando referências cruzadas.
4. **Verificar** a consistência entre a nova redação e a personalidade, os princípios e as direções a evitar.
5. **Avaliar** o impacto sobre o Design System, o Product Experience e o AGENTS.md, indicando se há documentos correlatos que precisam ser atualizados.
6. **Promover** a nova versão com o bump de versionamento apropriado.

Uma mudança aprovada não pode ser incorporada parcialmente. Se a redação afeta múltiplas seções, todas devem ser atualizadas na mesma versão.

### 10.5 Versionamento

Este documento segue o versionamento semântico definido pela Constitution:

- **MAJOR** — mudanças incompatíveis com a direção anterior. Reformulação da personalidade do produto, substituição de um atributo central, redefinição da relação com os demais documentos. Revisões MAJOR exigem atualização simultânea da Constitution, do Design System e do Product Experience, conforme o impacto.
- **MINOR** — novos princípios, atributos, direções evitadas ou momentos de experiência, desde que compatíveis com a direção existente. Não invalidam decisões anteriores, mas as complementam.
- **PATCH** — esclarecimentos, correções de redação, ajustes de forma, referências cruzadas. Não alteram o significado de nenhum princípio.

A versão atual deste documento está registrada no cabeçalho. Toda mudança deve atualizar a versão e o status.

### 10.6 Changelog

Toda mudança incorporada deve ser registrada no changelog, no formato:

```
## [VERSÃO] — DATA

### Tipo (Adicionado / Alterado / Removido / Corrigido)

- Descrição objetiva da mudança.
- Seção afetada.
- Justificativa resumida.
```

O changelog deve ser mantido ao final deste documento, em ordem cronológica inversa (mais recente primeiro).

### 10.7 Estabilidade como princípio

A evolução deste documento deve respeitar o princípio da estabilidade reconhecível (seção 7.10): mudanças que reorganizem os alicerces da identidade do produto sem acréscimo real de clareza, confiança ou eficiência devem ser evitadas.

O Product Vision existe para que o Bravery SGE mantenha uma direção coerente ao longo do tempo. Ele não existe para ser reescito frequentemente, mas sim para ser consultado frequentemente.

A frequência ideal de atualização é baixa. A utilidade do documento é alta.

### 10.8 Revisão periódica

Este documento deve ser revisado de forma deliberada:

- **a cada nova feature significativa** — verificar se a direção permanece válida;
- **a cada mudança MAJOR da Constitution** — verificar compatibilidade;
- **a cada incorporação significativa no Design System** — verificar se há direção a ser promovida;
- **pelo menos uma vez ao ano** — verificação geral de coerência entre a direção definida e o produto implementado.

A revisão periódica não introduz mudanças automaticamente: ela apenas as identifica e propõe, conforme o processo de 10.3.

### Critério de aplicação

A evolução deste documento é parte da governança do produto. Ignorar o processo descrito acima — atualizar a redação sem justificativa, sem changelog, sem verificação de impacto — compromete a autoridade do documento e a consistência da identidade visual do Bravery SGE.

Quando houver dúvida sobre se uma mudança deve ser incorporada ao Product Vision ou registrada apenas na Specification de uma funcionalidade, aplique o critério 10.1: se a mudança orienta decisões de design em todo o produto, pertence aqui. Se orienta apenas uma funcionalidade, pertence à Specification.

Em caso de conflito entre qualquer diretriz de evolução e a Constitution, prevalece a Constitution.

---

## Changelog

### [2.0.0] — 2026-07-11

#### Alterado — Reposicionamento de identidade

- **§3 Visão do Produto**: "plataforma de gestão educacional moderna" → "SaaS profissional" — reposicionamento de identidade visual de institucional para SaaS contemporâneo.
- **§4.2**: Adicionado anti-padrão "um sistema administrativo com visual institucional antiquado".
- Personalidade (§4.1) preservada: Clareza, Confiança, Organização, Eficiência, Leveza, Proximidade e Inteligência continuam válidos para o SaaS blue.

### [1.0.0] — 2026-07-10

### Adicionado

- Seção 1 — Objetivo do documento (identidade, personalidade, direção visual, linguagem, experiência e processo de decisão).
- Seção 2 — Relação com os demais documentos de governança (inclui Specification e hierarquia de autoridade).
- Seção 3 — Visão do produto.
- Seção 4 — Personalidade do produto com atributos positivos (4.1), negativos (4.2) e critério de decisão (4.3).
- Seção 5 — Princípios visuais (10 princípios vinculados à personalidade).
- Seção 6 — Linguagem da interface (10 critérios de redação).
- Seção 7 — Experiência desejada (10 momentos significativos de uso).
- Seção 8 — O que evitar (10 direções indesejadas com referência ao princípio violado).
- Seção 9 — Processo de decisão (ordem de consulta, desempate, conflito entre documentos, registro).
- Seção 10 — Evolução (pertencimento, versionamento, changelog, revisão periódica).
- Changelog inicial.