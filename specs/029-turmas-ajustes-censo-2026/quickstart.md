# Quickstart: Turmas — Ajustes e Alinhamento Censo 2026 (029)

**Spec**: `spec.md` · **Plan**: `plan.md` · **Data model**: `data-model.md`

Pré-requisitos: migrations M-01/M-02/M-03 aplicadas via SQL Editor; `npx next dev -p 3001`; usuário com permissão `gestao-turmas.turmas`.

## 1. Filtros + tabela (FR-001/002/003)

1. Abrir `/gestao-turmas/turmas` → Card Filtros exibe título **"Tipo"** sobre Todos/AEE/Curricular/Atividade Complementar.
2. Tabela ocupa 100% da largura do card (sem respiro lateral); header com fundo sólido e texto escuro legível.
3. "Nova Turma" → título do modal em destaque (serifada 20px).

## 2. Turma curricular válida + bloqueio (US1)

1. Nova Turma → Card Identificação: pills sob **"Turma de:"** ("Bilíngue de Surdos", "Formação por Alternância", **"Educação Especial"**).
2. Tipo **Curricular**, mediação Presencial → Etapa Agregada lista só agregadas com etapa ativa; Etapa só habilitadas (ex.: 302 → 14–21,41).
3. Card Configurações: pill Multietapa alinhada ao campo vizinho.
4. Formas de Organização em 4 colunas; "Grupos Não Seriados" sem "(art. 23 da LDB)".
5. Disciplinas em 4 colunas → **"Selecionar Todas"** marca tudo; salvar com etapa incompatível (ex.: trocar para etapa 35 com mediação Presencial fora de tipo 9) → `toast.error` e bloqueio.
6. Tipo **AEE** → Etapa Agregada desabilitada e nula; salvamento OK sem etapa.

## 3. Atividade Complementar (US2)

1. Tipo **Atividade Complementar** → card "Atividades Complementares" visível; select agrupado por Área/Subárea (só nomes) + **Adicionar**.
2. Adicionar 3 (ex.: Canto coral, Futebol, Teatro) → lista com remover; repetir uma → recusa; 7ª → recusa.
3. Adicionar Profissional → campo **"Atividades Complementares do Profissional"** (sem Disciplinas) + "Selecionar Todas".
4. Gerar Registro 20 → `atividade_complementar_1..3` = códigos (11002, …) em ordem; `_4..6` vazios.

## 4. Vínculo com histórico (US3)

1. Data de Início abre **Calendar** do sistema (não input nativo).
2. Inativar vínculo informando Data de Término → badge **Inativo**; diário/notas do profissional seguem consultáveis.
3. Lixeira → **ConfirmDialog** oficial (nunca modal nativo).

## 5. Etapas oficiais (US4)

1. Gestão Acadêmica → Estrutura → Etapas → 7 grupos oficiais; conferir INEP 69 (iniciais), 70 (finais), 64 em Técnico e Qualificação Profissional.

## 6. Modalidade removida (FR-009)

1. Modal sem campo Modalidade; tabela sem coluna Modalidade; dashboard sem gráfico de modalidade.
2. `grep -ri "modalidade" src` → só docs históricos de specs antigas (003/006), nenhum código.
