# Quickstart: Estrutura Acadêmica — Matrizes: Ajustes (032)

**Spec**: `spec.md` · **Plan**: `plan.md` · **Data model**: `data-model.md`

Pré-requisitos: `npx next dev -p 3001`; usuário com permissão `gestao-academica.estrutura-academica.matrizes`; escola com ano ativo + etapas + disciplinas ativas (Base Comum e Diversificada). Aplicar `patch_matriz_nao_reprova_pills.sql` via SQL Editor antes do §5/§6.

## 1. Filtros (US1 — FR-001/002)

1. Abrir `/gestao-academica/estrutura-academica` → aba Matrizes → filtros dentro de Card "Filtros" (busca + selects), igual às demais listagens.
2. Abrir o filtro Etapa → grupos por tipo com cabeçalhos; passar o mouse nas opções não desloca a lista; sem spinners.
3. Trocar escola/ano/etapa → lista recarrega como antes.

## 2. Subcards (US2 — FR-003/004/005)

1. Card "Matrizes Curriculares (N)" com título em destaque; cada subcard exibe ícone + descrição + ano + início/término `pt-BR` + etapa + turnos + tipo de turma + qtd disciplinas.
2. Expandir 2 matrizes → cada uma lista só as próprias disciplinas, agrupadas por período; sem itens cruzados.
3. Subcard sem `Switch`; ano encerrado mantém só Excluir; Editar/Excluir funcionam como antes.

## 3. Página de matriz (US3 — FR-006/007/008)

1. "Nova Matriz" → abre página própria (aba preservada, listagem mantém estado ao voltar); sem modal.
2. Identificação em 3 linhas (Ano|Etapa|Subetapa; Método|Início|Término; Turnos|Tipo); Carga Horária condicional ao Tipo.
3. Preencher + salvar → permanece na página como edição e o Card Períodos aparece na sequência (sem sair/reabrir).
4. Edição → `Switch` Ativa/Inativa só no Card Identificação.

## 4. Períodos e replicação (US4 — FR-009/010/011)

1. Períodos agrupados pelo Método vinculado, como antes.
2. Período expandido → "Adicionar Disciplina" no topo à direita, botão pequeno (não 100%).
3. 1º período → botão "Replicar para os demais períodos" → confirmação cita disciplinas + desconsiderar + carga + habilidades → confirmar replica tudo (conferir nos demais períodos).

## 5. Modal de disciplina (US5 — FR-012/013/014)

1. Título em destaque; select lista só ativas da escola compatíveis com a etapa (inativas/de outra escola fora).
2. Selecionar disciplina → Tipo trava sozinho (Base/Diversificada conforme o cadastro); sem edição manual.
3. Marcar as 2 pills + cargas + BNCC (grupos recolhidos; expandir UT → OC → marcar) + "Limpar" vermelho limpa, "Selecionar Todos" marca; checkbox desmarcado sempre visível.
4. "Adicionar" → disciplina aparece no período; reabrir em edição → tudo preenchido (cobre US7).

## 6. Pills no Diário (US6 — FR-016)

1. Matrícula de teste: aluno com média abaixo do mínimo **só** em disciplina "Não reprova por nota" → situação ignora essa disciplina (não reprova por ela).
2. Aluno com faltas acima do limite **só** em disciplina "Não reprova por frequência" → frequência ignora essa disciplina.
3. Disciplinas sem pills reprovam normalmente; Boletim/Fechamento/Conselho/Rendimento consistentes entre si.

## 7. Persistência (US7 — FR-015)

1. Salvar disciplina completa (cargas + pills + BNCC + manual), sair da página, voltar e reabrir → todos os campos preenchidos.
2. Salvar disciplina sem BNCC → sem erro; manuais persistem; linha do período exibe as cargas corretas.
