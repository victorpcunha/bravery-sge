# Quickstart: Feriados Nacionais Automáticos no Calendário

**Feature**: `042-feriados-nacionais` · **Date**: 2026-09-27

Pré-requisitos: `npx next dev -p 3001`; usuário com permissão `gestao-academica.estrutura-academica.calendarios`; internet liberada para `brasilapi.com.br` (§5 testa o caso contrário).

## §1 — Calendário anual nasce com os feriados (US1)

1. Abrir `/gestao-academica/estrutura-academica` → aba Calendários → criar Ano Letivo 2026 (se ainda não existe).
2. Criar calendário com intervalo jan–dez/2026 (marcar ≥1 etapa, obrigatório desde a spec 031).
3. Esperado: toast `Calendário criado com N feriado(s) nacional(is)` (N≈12); na Visualização, eventos `Feriado Nacional – …` em vermelho no grid (ex.: 01/01, 21/04, 01/05, 07/09, 12/10, 02/11, 15/11, 25/12 + móveis); KPI de dias letivos os exclui.
4. Clicar num dia de feriado → modal do dia lista o evento com badge de recesso + editar/excluir.

## §2 — Semestral importa só o subconjunto (US1)

1. Criar calendário fev–jun/2026.
2. Esperado: toast com N menor (só feriados do intervalo); nenhum evento fora de fev–jun criado.

## §3 — Expansão sem ressuscitar (US2)

1. No calendário do §2, excluir manualmente um feriado (ex.: Tiradentes) pelo modal do dia.
2. Editar o calendário ampliando o término para dez/2026 e salvar.
3. Esperado: toast `N feriado(s) nacional(is) adicionado(s)` (só faixa nova); Tiradentes continua excluído; sem duplicados (conferir 07/09 e 25/12 aparecendo 1× cada).
4. Editar e salvar novamente sem mudar datas → toast normal de atualização, nada muda nos eventos.

## §4 — Retry após falha (US2-3 + US3-1)

1. Bloquear `brasilapi.com.br` (ex.: regra de firewall local ou DNS inválido temporário) e criar um calendário anual.
2. Esperado: calendário criado + `toast.warning('Calendário salvo, mas os feriados nacionais não puderam ser carregados. Salve novamente para tentar.')`; zero eventos `Feriado Nacional –`.
3. Desbloquear, editar o calendário (qualquer campo) e salvar.
4. Esperado: intervalo inteiro semeado (regra de retry); toast de sucesso com N.

## §5 — Leitura imune à API (US3-2/3)

1. Com a fonte ainda bloqueada, abrir calendários criados antes (§1–§3).
2. Esperado: grid, KPIs, modal do dia e contagem exibem todos os feriados normalmente; nenhuma chamada a `brasilapi.com.br` no Network do navegador.

## §6 — Backfill legados (US4, P2)

1. `node scripts/seed-feriados-existentes.mjs --dry-run` → imprime o que faria, sem escrever.
2. Sem flag → insere; rodar de novo → `0 inseridos` (idempotente).
3. Conferir na UI que calendários antigos ganharam os feriados e manuais foram preservados.

## §7 — Gates técnicos

1. `npx tsc --noEmit` limpo; `npx next build` verde.
2. `rg 'Feriado Nacional' src/lib/feriados-api.ts src/lib/actions/calendarios.ts` — prefixo consistente nos dois arquivos.
3. Auditoria (`/auditoria`, superadmin): criações aparecem como `Estrutura Acadêmica — Calendários / criar / academico_calendario_eventos`.
