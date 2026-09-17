# Quickstart: Tela de Rematrículas — Validação

**Feature**: `035-rematriculas` | **Date**: 2026-09-16

Roteiro de validação end-to-end (sem código de implementação, sem suites de teste — ver [contracts](./contracts/rematriculas-actions.md) e [data-model](./data-model.md) para detalhes).

## Pré-requisitos

1. Migration `patch_recursos_rematriculas.sql` aplicada via SQL Editor; perfil do testador com `gestao-academica.rematriculas` (`visualizar` + `criar`).
2. Uma escola com: Ano Letivo encerrado (ex. 2025) com turma e alunos com Situação final (`Aprovado`, `Reprovado`, `Transferido`); Ano Letivo ativo (ex. 2026) com turmas criadas na etapa seguinte e na mesma etapa.
3. `npx tsc --noEmit` e `npx next build` verdes.

## Cenários

### 1. Fluxo feliz — Aprovado avança de etapa (< 5 min, SC-001)

1. Abra Gestão Acadêmica → Rematrículas; confira Origem = 2025 (travado) e Destino = 2026 (travado).
2. Origem: etapa + turma 2025, Situação = Aprovado → Destino habilita.
3. Tente Etapa de Destino = mesma da origem → **bloqueado com explicação** (SC-003 parcial).
4. Destino: etapa seguinte + turma + data de hoje → lista exibe só aprovados (nome + CPF), sem transferidos.
5. "Selecionar Todos", altere 1 aluno para outra turma da mesma etapa, remova 1 pela lixeira → Salvar.
6. **Esperado**: toast com contagem de criados; Alunos Matriculados exibe os novos vínculos em 2026 com data/etapa/turma corretas (SC-002).

### 2. Reprovado permanece + data futura

1. Situação = Reprovado → Etapa de Destino trava na etapa de origem; tentar outra → **bloqueado com explicação**.
2. Data de Matrícula = amanhã → **recusada**; volte para hoje e salve.
3. **Esperado**: rematrículas criadas na mesma etapa (SC-003).

### 3. Regra Geral e falhas parciais (SC-004/SC-005)

1. Deixe 1 aluno da lista já matriculado em turma Curricular 2026 conflitante (ou re-execute o lote — missão: violação/duplicidade).
2. Salve.
3. **Esperado**: demais alunos criados; o conflitado aparece em `falhas` com motivo + próximo passo; nada é criado em duplicidade.

### 4. Superadmin + mobile (SC-006)

1. Como Superadmin: troque a Unidade Escolar → origem/destino/lista recarregam; seleção anterior incompatível é limpa.
2. Em viewport 360px: subcards empilhados, lista em cards, sem rolagem horizontal; seleção + salvamento funcionais.

### 5. Estados vazios

1. Turma de origem sem alunos na situação → `EmptyState` orientando revisar filtros.
2. Etapa de destino sem turmas criadas → aviso de que é preciso criar turmas.
3. Salvar sem seleção → recusa orientando selecionar ao menos um aluno.
