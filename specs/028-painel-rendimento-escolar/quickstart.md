# Quickstart: Painel de Rendimento Escolar (028)

Validação funcional de ponta a ponta (sem código de implementação aqui — detalhes em `contracts/` e `data-model.md`).

## Pré-requisitos
1. Migrations aplicadas no SQL Editor: `patch_rendimento_recurso.sql`, `patch_metodo_faixa_atencao.sql`.
2. Escola com: ano letivo + calendário com eventos `periodo_avaliativo`; matriz com método numérico (`tipos_avaliacao.numerico=true`, `media_minima`, `frecuencia_minima`); ≥1 turma com disciplinas, matrículas ativas, notas e frequências lançadas em ≥2 períodos; ≥1 turma fechada (`fechada=true`) para Situação Final.
3. Usuário com `gestao-pedagogica.rendimento/visualizar` (e um sem, para o teste de negação).

## Cenários
1. **Resumo/KPIs**: abrir `/gestao-pedagogica/rendimento`, selecionar Ano → KPIs conferem com Diário/Fechamento da mesma turma/período (SC-002). Superadmin: seletor de Unidade Escolar obrigatório antes dos dados.
2. **Aba Geral**: Período exibe evolução em linha + distribuição somando 100%; Etapa exibe evolução vs. anterior; Turma lista sem carregar disciplinas (rede: 1 action de panorama).
3. **Drill-down**: clicar numa turma carrega os 5 blocos sob demanda; turma sem notas → estado vazio.
4. **Situação**: aluno com média < mínima está em Risco ("Média abaixo do esperado"); aluno a ≤0,5 da mínima está em Atenção; queda ≥1,0 ponto → "Em queda" + motivo; detalhe do aluno (Sheet) lista por disciplina + pontos de atenção.
5. **Faixa configurável**: alterar `faixa_atencao_pp` na tela de Métodos reclassifica Atenção sem deploy.
6. **Situação Final**: ano sem fechamento → estado informativo; ano misto → só fechadas nos blocos + aviso das abertas; colunas dinâmicas rotuladas (sem "Outros"); cruzamento exibe evolução dos reprovados.
7. **Negação**: usuário sem permissão vê `EmptyState ShieldAlert` "Sem permissão".
8. **Escopo**: turmas não-numéricas excluídas; não-avaliados fora dos percentuais; frequência respeita critério da turma e período ativo.

## Comandos
- `npx tsc --noEmit` (tipos limpos) · `npx next build` (41+ rotas, verde) · `npx next dev -p 3001` (manual).
