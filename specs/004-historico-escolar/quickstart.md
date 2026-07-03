# Quickstart: Histórico Escolar — Painel do Aluno

**Prerequisites**: Migration `004_historico_escolar.sql` aplicada no Supabase. Aluno com matrículas e avaliações cadastradas.

## Validation Scenarios

### 1. Listagem de todas as matrículas

1. Acesse **Painel do Aluno** (`/gestao-usuarios/painel-aluno`)
2. Busque um aluno com múltiplas matrículas (diferentes anos/situações)
3. Selecione uma turma
4. **Verifique**: Card "Histórico Escolar" lista todas as matrículas com ano, turma, etapa, situação
5. **Verifique**: Matrículas "Ativo", "Transferido", "Desistente" aparecem com suas situações

### 2. Expansão — Avaliação Numérica

1. Clique em uma linha de matrícula que possui notas cadastradas
2. **Verifique**: A linha expande (accordion); clicar em outra linha recolhe a anterior
3. **Verifique**: Subgrupo "Avaliação Numérica" exibe tabela com:
   - Cabeçalho: Disciplina | Período 1 | Período 2 | ... | Média Final | Total Faltas | Freq. %
   - Linhas: uma por disciplina com notas e faltas
4. **Verifique**: Se houver recuperação, a nota de recuperação substitui a original no cálculo da média

### 3. Expansão — Avaliação por Indicadores

1. Na mesma linha expandida, localize "Avaliação por Indicadores"
2. Selecione uma disciplina no dropdown
3. **Verifique**: Tabela exibe indicadores (linhas) × períodos (colunas) com o nível registrado (sigla/descrição)
4. **Verifique**: Disciplinas sem indicadores não aparecem no dropdown

### 4. Modal — Adicionar Histórico

1. Clique em **"Adicionar Histórico"** (visível se perfil tem permissão `editar`)
2. Preencha **Dados Gerais**:
   - Ano Letivo* — selecione um ano
   - Estado* — selecione uma UF
   - Município* — digite um nome de cidade
   - Unidade Escolar* — digite o nome da escola
   - Etapa de Ensino* — selecione uma etapa
   - Situação* — selecione (Aprovado, Reprovado, etc.)
   - Preencha opcionais: Carga Horária, Dias Letivos, Observações
3. Em **Registros Escolares**:
   - Selecione uma Disciplina*
   - Informe Média Final* (ex: 8.5)
   - Informe Carga Horária anual (ex: 800)
   - Marque/desmarque "Parte Diversificada"
   - Clique **Adicionar Disciplina**
4. **Verifique**: Disciplina aparece na lista; sumário atualiza (BNCC / Diversificada / Total)
5. Adicione mais 2 disciplinas; remova 1
6. **Verifique**: Sumário recalcula corretamente a cada adição/remoção
7. Clique **Salvar**
8. **Verifique**: Toast "Histórico registrado com sucesso"; modal fecha; novo registro na listagem

### 5. Visualização do Histórico Manual

1. Expanda o registro manual recém-criado na listagem
2. **Verifique**: Exibe disciplinas com nome, Média Final, Carga Horária e badge "BNCC" ou "Parte Diversificada"

### 6. Edge Cases

- Aluno sem matrículas → "Nenhum registro de histórico escolar."
- Expandir matrícula sem notas → "Nenhuma avaliação numérica registrada."
- Expandir matrícula sem indicadores → "Nenhum indicador avaliado."
- Modal com campos obrigatórios vazios → Botão Salvar desabilitado
- Remover última disciplina do modal → Sumário mostra 0h; Salvar ainda permitido

### 7. Build Check

```bash
npx next build
```

Deve compilar sem erros TypeScript.
