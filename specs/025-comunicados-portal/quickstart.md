# Quickstart: Comunicados do Portal (025)

**Feature**: `specs/025-comunicados-portal/spec.md` | **Date**: 2026-09-08

Guia de validação end-to-end (sem código de implementação). Pré-requisitos: `npx next dev -p 3001`, escola com ano ativo + etapas ativas + turmas, usuário com `portal.comunicados` (visualizar/criar/editar/excluir); migrations aplicadas via SQL Editor (`patch_comunicados_periodo_visibilidade.sql`, `patch_recursos_portal.sql`).

## 1. Listagem e filtros

1. Abrir `/comunicados` → filtro Ano Letivo pré-selecionado com o ativo; card "Comunicados Registrados" com "Novo Comunicado" no topo direito.
2. Sem dados → empty state com ação "Novo Comunicado". Com filtros sem resultado → empty state "ajustar filtros".
3. Criar 2 comunicados (via §2) em turmas distintas → minicards exibem envio/fim, título, descrição truncada em 100 chars, Editar/Excluir.
4. Filtrar por Etapa/Turma e por intervalo de datas → só os comunicados correspondentes permanecem.

## 2. Criação

1. "Novo Comunicado" → tela sem breadcrumbs, com "Voltar"; Ano Letivo exibe o ativo (não editável).
2. Selecionar etapas → seletor de Turmas lista só turmas daquelas etapas, todas marcadas; desmarcar 1 e salvar.
3. Período: range no Calendar (com seletores mês/ano) + horários início/fim; salvar fora de ordem ou sem turma → bloqueio com mensagem orientadora.
4. Salvar válido → toast de sucesso + retorno à listagem com o minicard.

## 3. Edição e exclusão

1. Editar via minicard → form preenchido, com "Voltar" e "Excluir".
2. Antecipar o fim para o passado → sai do Portal (§4), permanece na listagem como expirado.
3. Excluir (minicard e edição) → ConfirmDialog → toast; some da listagem e do Portal.

## 4. Portal do Responsável

1. Comunicado vigente p/ Turma A → responsável da Turma A vê; da Turma B não vê.
2. Após o fim do período → some do Portal (admin mantém).
3. Início futuro → ainda não aparece.
4. Abrir comunicado marca como lido (badge some); excluir comunicado remove do Portal.

## 5. Segurança e regressão

1. Usuário sem `portal.comunicados` → `EmptyState ShieldAlert "Sem permissão"`; chamada direta da action → "Acesso negado".
2. Escola B não lista comunicados da escola A (filtros de etapa/turma e leitura).
3. Comunicados legados (carga SQL pré-migration) continuam visíveis no Portal.
4. Auditoria (`/auditoria`, módulo "Portal — Comunicados") registra criar/editar/excluir com usuário, escola e data/hora.
5. `npx tsc --noEmit` e `npx next build` verdes.

**Esperado**: SC-001 a SC-005 da spec atendidos.
