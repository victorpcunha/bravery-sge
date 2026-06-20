# Quickstart: Censo Escolar – Matrícula Inicial 2026

**Feature**: 001-censo-escolar
**Date**: 2026-06-09

## Prerequisites

1. Migration de campos INEP aplicada nas tabelas operacionais
2. Dados de referência em `src/data/censo/` (matrizes dos Anexos 3-6)
3. Usuário autenticado com permissão `censo-escolar` e vínculo a uma escola
4. Escola com dados cadastrais, turmas, pessoas, quadro de aulas e matrículas já existentes

## Validation Scenarios

### Scenario 1: Escola com dados incompletos

1. Acessar `/censo-escolar` → selecionar Ano Letivo "2026", Etapa "Matrícula Inicial"
2. Clicar "Validar"
3. Aba "Registro 00 — Dados da Escola" mostra erros: CEP não informado, município não informado, etc.
4. Clicar no erro "CEP não informado" → redireciona para `/escolas/[id]?tab=endereco&field=cep`
5. Preencher CEP e salvar
6. Voltar ao Censo → clicar "Validar" novamente
7. Erro do CEP desapareceu

**Expected**: Cada erro é um link que leva ao local exato de correção. Após corrigir e revalidar, o erro some.

### Scenario 2: Turma com horário inválido

1. No Censo, aba "Registro 20 — Turmas" mostra: "Horário de segunda-feira: minutos devem ser múltiplos de 5"
2. Clicar → redireciona para `/gestao-turmas/turmas/[id]`
3. Corrigir horário de "09:03-10:00" para "09:00-10:00"
4. Voltar e revalidar

**Expected**: Validação de formato de horário (24h, minutos múltiplos de 5) funciona.

### Scenario 3: Pessoa com deficiências conflitantes

1. Aba "Registro 30 — Pessoas" mostra: "Surdocegueira não pode coexistir com Cegueira — [Nome da pessoa]"
2. Clicar → `/gestao-usuarios/usuarios/[id]?tab=deficiencias`
3. Desmarcar uma das deficiências conflitantes
4. Voltar e revalidar

**Expected**: 10 regras de incompatibilidade entre deficiências são validadas.

### Scenario 4: Profissional com função incompatível

1. Aba "Registro 50 — Profissionais" mostra: "Função 'Auxiliar' não permitida em turma EAD — Turma [nome]"
2. Clicar → `/gestao-turmas/quadro-aulas/?turma=[id]`
3. Alterar função do profissional ou tipo de mediação da turma
4. Voltar e revalidar

**Expected**: 7 regras de compatibilidade função × tipo de mediação/turma validadas.

### Scenario 5: Aluno com idade fora da faixa

1. Aba "Registro 60 — Matrículas" mostra: "Idade do aluno: 8 anos. Idade permitida: 15 a 93 anos para EJA - Ensino Médio"
2. Clicar → `/gestao-academica/matriculas/?turma=[id]`
3. Corrigir matrícula do aluno (transferir para turma compatível)
4. Voltar e revalidar

**Expected**: 35+ combinações de idade × etapa validadas.

### Scenario 6: Exportação

1. Corrigir todos os erros até o resumo mostrar "0 inconsistências encontradas"
2. Botão "Exportar" é liberado
3. Clicar "Exportar" → download do arquivo .txt
4. Abrir arquivo: verificar ISO-8859-1, maiúsculas, sem acentos, pipe-delimitado, terminador 99|

**Expected**: Arquivo gerado com estrutura correta. Se ainda houver erros, botão continua desabilitado.

## Edge Cases

- Escola sem código INEP: alerta na validação, exportação bloqueada
- Pessoa que é profissional E aluno: validar ambos os vínculos, sem duplicar Registro 30
- Escola paralisada/extinta: exporta apenas 00, 30, 40
- 0 erros na primeira validação: botão Exportar liberado imediatamente
