# Quickstart: Estrutura Acadêmica — Calendários: Ajustes (031)

**Spec**: `spec.md` · **Plan**: `plan.md` · **Data model**: `data-model.md`

Pré-requisitos: `npx next dev -p 3001`; usuário com permissão `gestao-academica.estrutura-academica.calendarios`; escola com etapas ativas na aba Etapas. Resolução 1366×768 para o §4.

## 1. Abas (US1 — FR-001)

1. Abrir `/gestao-academica/estrutura-academica` → abas Calendários/Etapas/Matrizes com container claro + borda, aba ativa sólida, hover sutil — iguais às da Dashboard (Visão Geral/Alertas).
2. Alternar as 3 abas → conteúdos carregam como antes (anos, etapas, matrizes).

## 2. Subcard do Ano (US2 — FR-002/003)

1. Selecionar um ano ativo → subcard exibe `Ano Letivo: 2026`, `Início: 09/02/2026`, `Término: 11/12/2026` com rótulos.
2. Botões `Encerrar` e `Excluir` lado a lado, mesma largura (50/50), Excluir vermelho com ícone + label (sem lixeira isolada).
3. Ano em planejamento → 3 botões iguais (Ativar/Encerrar/Excluir); Encerrar e Excluir pedem confirmação como antes.

## 3. Vínculo de Etapas (US3 — FR-004/005/006)

1. Com ano selecionado, "Novo Calendário" → seção "Etapas de Ensino *" lista só etapas ativas da escola+ano, nos 7 grupos (vazios ocultos).
2. "Selecionar Todas" de um grupo → marca só aquele grupo; clicar de novo → desmarca.
3. Tentar salvar sem etapas → `toast.error` e modal permanece aberto.
4. Salvar com etapas de 2 grupos → reabrir em edição → mesmas etapas marcadas.
5. (Se houver etapa 22/23/56 ativa) → aparece em Anos Finais.
6. (Se escola sem etapas ativas) → mensagem orientando ativar na aba Etapas.

## 4. Responsividade (US4 — FR-007/008)

1. Em 1366×768: abrir modais Ano/Calendário/Evento → tudo alcançável via scroll interno, sem corte.
2. Abrir cada `DatePicker` → grid sem linhas vazias abaixo dos dias (altura varia por mês); popover dentro da viewport.
3. Em mobile (<640px): Início/Término empilham; pills de etapa quebram em linhas.

## 5. KPIs no topo (US5 — FR-009/010)

1. Selecionar calendário com períodos avaliativos → topo do card: KPI geral em destaque + 1 KPI por período (nome, dias, datas, editar/excluir).
2. Grade mensal abaixo funciona como antes (clicar dia, legenda, cores).
3. Calendário sem períodos → só o KPI geral, sem seção vazia.

## 6. Tipo em Pills (US6 — FR-011)

1. "Novo Evento" → Tipo são 3 pills (Recesso, Dia Letivo, Período Avaliativo); clicar alterna com seleção única.
2. Salvar como Período Avaliativo → novo KPI aparece no topo (§5); reabrir o evento → pill correta ativa.
