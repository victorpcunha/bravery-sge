# Quickstart: Quadro de Aulas — Ajustes + Aulas Extras (030)

**Spec**: `spec.md` · **Plan**: `plan.md` · **Data model**: `data-model.md`

Pré-requisitos: migration M-01 aplicada via SQL Editor (só p/ §4); `npx next dev -p 3001`; usuário com permissão `gestao-turmas.quadro-aulas`.

## 1. Listagem (US1 — FR-001/002/003)

1. Abrir `/gestao-turmas/quadro-aulas` → tabela ocupa 100% da largura do card (sem respiro lateral); header com fundo sólido e títulos escuros legíveis.
2. Quadro com vigência 09/02/2026–11/12/2026 → status **Ativo** (era o bug: exibia Futuro).
3. Quadro com `data_final` passada → **Encerrado**; com início futuro → **Futuro**; inativado manualmente → **Inativo**.
4. Coluna Ações → editar com ícone de **lápis**; lixeira inalterada.

## 2. Edição (US2 — FR-004/008/009/010)

1. Abrir `cadastro?id=…` → topo com **Excluir** à direita de **Voltar**; Excluir abre `ConfirmDialog` e volta à listagem.
2. Card Identificação sem "Grupo 1/2/3"; 5 colunas em desktop (Tempo de Aula na mesma linha), empilhando em telas menores.
3. Datas de vigência no **Calendar** padrão (não input nativo), limitadas ao ano letivo.
4. Subcard **"Intervalos"** (sem número); sem intervalos → botão "Adicionar Intervalo" **acima** de "Nenhum intervalo cadastrado".
5. Grade: dias em destaque com separação visível entre colunas; forçar um conflito professor → mensagem `das 09:10 às 10:00` (sem segundos) com quebra de linha, sem estourar a célula.

## 3. Conflito por sobreposição (US3 — FR-011)

1. Quadro A vigente até 30/06 + novo quadro B a partir de 01/07, mesmo professor/dia/horário → **salva sem conflito**.
2. Novo quadro B a partir de 15/06 (sobrepõe A), mesmo professor/dia/horário → **conflito exibido + salvamento bloqueado**.

## 4. Aulas Extras (US4 — FR-012/015)

1. Marcar sábado letivo no Calendário da Etapa (Gestão Acadêmica → Estrutura → Calendários, evento `Dia Letivo`) → reabrir o quadro → card **"Aulas Extras"** lista o sábado após o Card "Quadro de Aulas".
2. "Adicionar Aula" → início/fim + disciplina da turma + professor vinculado; adicionar 2ª aula na mesma data + intervalo; excluir uma aula pela lixeira (só ela sai).
3. Criar novo sábado letivo no Calendário → reabrir → aparece sozinho no card.
4. Remover sábado do Calendário **sem** frequência → `ConfirmDialog` remove bloco + aulas.
5. Lançar frequência da aula extra no Diário → remover o sábado do Calendário → **bloqueio com alerta** (orienta excluir a frequência no Diário primeiro); excluir a frequência → remoção libera.
6. Diário da turma (`por_aula`) → aulas extras aparecem para lançamento como as regulares.
