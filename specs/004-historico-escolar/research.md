# Research: Histórico Escolar — Painel do Aluno

**Feature**: `004-historico-escolar`
**Date**: 2026-06-29

## Decisions

### 1. Accordion: Single-Expand via Collapsible + State

**Decision**: Usar shadcn `Collapsible` com estado controlado que permite apenas uma linha expandida por vez (definido no `/speckit.clarify`).

**Rationale**: O Collapsible é o primitivo shadcn para conteúdo expansível. Um estado `expandedId: string | null` no componente pai controla qual linha está aberta; clicar em outra linha fecha a anterior automaticamente.

**Alternatives considered**:
- `Accordion` shadcn — mais complexo que o necessário para este caso (o Accordion é para seções com triggers visuais; aqui as linhas da tabela já são os triggers).
- Múltiplas linhas expandidas — rejeitado pelo usuário no clarify.

### 2. Data Fetching: Lazy Load on Expand

**Decision**: Carregar dados de avaliação (notas, indicadores) apenas quando a linha é expandida, não no carregamento inicial do card.

**Rationale**: Um aluno pode ter múltiplas matrículas, cada uma potencialmente com dezenas de disciplinas × períodos. Carregar tudo eager seria desperdício de queries e tempo de resposta. Lazy load mantém o card rápido (SC-001: <2s).

**Alternatives considered**:
- Eager loading de todos os dados — mais simples de implementar mas penaliza performance com dados que o usuário pode nunca visualizar.
- Prefetch ao hover — complexidade adicional desnecessária; o clique é suficiente.

### 3. Modal: Client-Side State para Disciplinas

**Decision**: Gerenciar a lista de disciplinas adicionadas no modal com estado React local (`useState`), calculando o sumário de cargas horárias em tempo real via `useMemo`.

**Rationale**: As disciplinas só são persistidas no submit final. Não há necessidade de server round-trips para adicionar/remover itens da lista. O cálculo de cargas horárias é aritmética simples (O(n)) e responde em <100ms (SC-003).

**Alternatives considered**:
- Server actions para cada adição/remoção — latência desnecessária para operações que só precisam ser persistidas no submit.
- IndexedDB / localStorage — overkill para dados temporários que cabem em memória.

### 4. Migration: nova tabela `historico_manual_disciplinas`

**Decision**: Criar tabela separada `historico_manual_disciplinas` com FK para `historico_manual` e `ON DELETE CASCADE`, em vez de coluna JSONB na tabela principal.

**Rationale**: Normalização permite queries eficientes para listar disciplinas por histórico, validação de FK para `disciplina_id`, e integridade referencial. Segue o padrão existente do projeto (tabelas normalizadas, sem JSONB para dados relacionais).

**Alternatives considered**:
- JSONB `disciplinas` em `historico_manual` — mais simples de implementar (1 tabela só), mas perde validação de FK, dificulta queries agregadas e foge do padrão do codebase.
- Tabela `historico_manual_disciplinas` sem CASCADE — exigiria lógica manual de deleção, mais frágil.

### 5. Permissão: Remover dependência de `permite_historico_manual`

**Decision**: O botão "Adicionar Histórico" será controlado exclusivamente pela permissão `gestao-usuarios.painel-aluno` com ação `editar` (FR-008). A flag `permite_historico_manual` na tabela `schools` será mantida mas não mais utilizada pelo card.

**Rationale**: Simplifica o controle de acesso — um único ponto de verificação (perfil) em vez de perfil + configuração de escola. A flag pode ser removida em cleanup futuro.

**Alternatives considered**:
- Manter a flag + permissão — complexidade adicional sem ganho de segurança (a permissão do perfil já é suficiente).
