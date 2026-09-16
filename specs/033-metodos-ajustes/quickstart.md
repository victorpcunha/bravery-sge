# Quickstart: Métodos de Avaliação — Ajustes

**Spec**: [spec.md](./spec.md) | **Gates**: `npx tsc --noEmit` + `npx next build` verdes.

## §1 — Lista: filtros e tabela (US1)

1. Abrir Métodos de Avaliação (aba `metodos`).
2. Conferir: "Buscar por nome" ≈ 33% da linha; Status (Ativos/Inativos) ao lado; superadmin vê seletor de escola.
3. Conferir: cabeçalho da tabela sem margens laterais (fundo encosta nas bordas do card), títulos em destaque (`bg-muted`, uppercase).
4. Filtrar por nome + alternar Ativos/Inativos (sem regressão).

## §2 — Páginas novo/editar + excluir (US2)

1. "Novo Método" → URL `.../metodos/novo` (sem modal); preencher Descrição, salvar → toast + volta à lista.
2. Lápis → URL `.../metodos/[id]` com Voltar; F5 segue o padrão das abas internas.
3. Na edição: Excluir (header) → `ConfirmDialog` → volta à lista; na lista: lixeira com confirmação (inalterada).
4. Superadmin sem escola: lista com EmptyState; novo/editar sem `?escola=` com EmptyState orientando a voltar.
5. Sem permissão: `EmptyState ShieldAlert` nas ações bloqueadas.

## §3 — Identificação e tipos (US3)

1. Novo método: Pill Ativo alterna Ativo/Inativo.
2. Marcar Numérico/Parecer/Conceito/Nível (multi) → cards condicionais abrem/fecham.
3. Períodos 1–4 por tipo ativo funcionam como antes; salvar e reabrir persiste tudo.

## §4 — Numéricas (US4)

1. Forma de Registro: 2 Pills (Inteiro/Decimal) em campo estreito.
2. Permite Recuperação: 3 Pills multi; condicionais (só-final, substitutivas) aparecem nas mesmas regras.
3. Média do Período + Resultado Final: Pills únicas; Média Máxima inalterada.
4. Opções em grade 2–3 colunas; salvar e reabrir confere cada flag.

## §5 — Aprovações (US5)

1. Aprovação Automática em Pill; ativa esmaece Média Mínima/pesos (como antes).
2. Com "Final" marcado: 2 Pills Aritmética/Ponderada; hover no `Info` mostra os textos literais com exemplo (6,5 vs 6,0).
3. Ponderada → pesos visíveis; Aritmética → ocultos; salvar cada modo e reabrir.

## §6 — Arredondamento (US6)

1. 3 Pills (Nenhum/Meio Ponto/Decimal); hover mostra os 3 tooltips literais com exemplo.
2. Meio Ponto → Intervalos; Decimal → Margem; Nenhum → nenhum campo (como hoje).
3. Aplicar em 3 Pills multi; salvar e reabrir confere tipo + aplicações + valores.

## §7 — Parecer, Conceitos e Níveis (US7)

1. Registro de Parecer Geral em Pill (tooltip/texto inalterados).
2. Conceitos/Níveis: só Descrição + Sigla + lixeira; nenhum seletor de cor; grupo sem fundo.
3. Lixeira centralizada/maior → `ConfirmDialog` (cancelar preserva; confirmar remove).
4. Utiliza Conceito Final em Pill; lista de finais aparece como hoje; salvar e reabrir.
