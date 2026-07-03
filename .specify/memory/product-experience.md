# Product Experience

Version: 0.1.0 (MVP)
Status: Draft

---

# 1. Objetivo

Este documento define os princípios de experiência do produto que devem orientar todas as funcionalidades do sistema.

Seu objetivo é garantir que diferentes agentes produzam interfaces consistentes, previsíveis e centradas na tarefa do usuário, independentemente da funcionalidade implementada.

Este documento não substitui a Constitution, o Design System ou os contratos de componentes.

Sua responsabilidade é responder:

> Como decidir a melhor experiência antes da implementação?

---

# 2. Relação com outros documentos

Este documento complementa os demais artefatos do projeto.

| Documento | Responsabilidade |
|------------|------------------|
| constitution.md | Regras arquiteturais obrigatórias |
| AGENTS.md | Regras operacionais para implementação |
| Design System | Componentes, tokens, layouts e padrões visuais |
| Specs | Requisitos da funcionalidade |
| Product Experience | Critérios de decisão da experiência |

Quando existir conflito entre documentos, a ordem de prioridade permanece:

Constitution → Product Experience → Spec → Plan → Tasks.

---

# 3. Como utilizar este documento

Este documento deve ser consultado durante a fase de especificação da funcionalidade.

Antes de qualquer decisão de layout, componentes ou implementação, o agente deve identificar quais princípios deste documento são aplicáveis.

A implementação deve justificar apenas os princípios relevantes para aquela funcionalidade.

Não é esperado que todos os princípios sejam utilizados simultaneamente.

---

# 4. Integração com o Spec Driven Development

Durante a elaboração de uma nova feature:

1. Ler a Constitution.

2. Ler este documento.

3. Identificar quais princípios se aplicam.

4. Registrar os princípios utilizados na especificação da feature.

5. Planejar a implementação.

6. Validar que a solução respeita os princípios selecionados.

Este documento orienta decisões de experiência.

Os demais documentos continuam responsáveis pela implementação técnica.

---

# 5. Estrutura dos Princípios

Todos os princípios seguem o mesmo formato.

## Identificador

Cada princípio recebe um identificador único.

Exemplo:

PE-001

PE-002

PE-003

---

Cada princípio possui obrigatoriamente:

• Objetivo

• Problema que resolve

• Critérios de decisão

• Quando NÃO aplicar

• Exemplos

• Forma de verificação

• Referências

---

# PE-001 — Filosofia do Produto

## Objetivo

Garantir que todas as funcionalidades transmitam a mesma identidade de produto.

## Problema que resolve

Interfaces desenvolvidas isoladamente tendem a apresentar comportamentos inconsistentes e diferentes modelos mentais para tarefas semelhantes.

## Critérios de decisão

Antes de projetar qualquer tela, responder:

- Qual é a principal tarefa do usuário?

- Qual informação ele precisa visualizar imediatamente?

- Qual ação deve conseguir executar com o menor esforço possível?

Sempre priorizar:

Clareza → Consistência → Eficiência.

Nunca o contrário.

## Quando NÃO aplicar

Este princípio é universal.

Não possui exceções.

## Exemplos

Bom:

O usuário abre o Painel do Aluno e identifica imediatamente:

- frequência
- média
- ocorrências
- próximas atividades

Ruim:

O usuário precisa procurar essas informações entre diversos cards sem prioridade visual.

## Forma de verificação

Uma pessoa que nunca utilizou a tela consegue identificar a principal ação em poucos segundos?

Se não, o princípio não foi aplicado corretamente.

## Referências

Constitution

Design System

---

# PE-002 — Hierarquia da Informação

## Objetivo

Garantir que as informações mais importantes recebam maior destaque visual.

## Problema que resolve

Sem hierarquia, todas as informações competem pela atenção do usuário.

## Critérios de decisão

Perguntar:

A informação influencia uma decisão imediata?

Se SIM:

→ posicionar acima da dobra.

↓

Possui atualização frequente?

↓

Destacar visualmente.

↓

É apenas informativa?

↓

Reduzir prioridade.

## Quando NÃO aplicar

Relatórios impressos.

Documentos legais.

Exportações.

## Exemplos

Painel do aluno:

1. Indicadores

2. Próximas aulas

3. Evolução

4. Histórico

Nunca iniciar a página pelo histórico completo.

## Forma de verificação

O primeiro olhar do usuário identifica naturalmente os elementos mais importantes?

## Referências

Design System

Layout Catalog

---

# PE-003 — Critérios para Escolha de Layout

## Objetivo

Selecionar o layout mais adequado para a tarefa do usuário.

## Problema que resolve

Escolher layouts apenas pela facilidade de implementação gera interfaces pouco eficientes.

## Critérios de decisão

O usuário precisa localizar registros?

↓

Listagem.

---

Precisa acompanhar indicadores?

↓

Dashboard.

---

Precisa editar informações?

↓

Formulário.

---

Precisa compreender detalhes de um único registro?

↓

Visualização.

---

Precisa concluir uma tarefa composta por várias etapas dependentes?

↓

Wizard.

## Quando NÃO aplicar

Quando a Constitution ou a Spec determinarem explicitamente outro fluxo.

## Exemplos

Cadastro de Alunos

→ Formulário.

---

Painel do Diretor

→ Dashboard.

---

Consulta de Matrículas

→ Listagem.

## Forma de verificação

O layout escolhido reduz a quantidade de passos necessários para concluir a principal tarefa?

## Referências

Design System

Layout Catalog