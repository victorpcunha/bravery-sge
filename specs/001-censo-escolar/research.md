# Research: Censo Escolar – Matrícula Inicial 2026

**Feature**: 001-censo-escolar
**Date**: 2026-06-09

## Decision 1: O módulo é validação, não cadastro

**Decision**: O módulo Censo Escolar lê dados das tabelas operacionais existentes, valida contra regras INEP, e redireciona para correção. Não cria telas de cadastro duplicadas.

**Rationale**: O sistema já possui telas completas para gerenciar escolas (`/escolas`), turmas (`/gestao-turmas/turmas`), pessoas (`/gestao-usuarios/usuarios`), quadro de aulas (`/gestao-turmas/quadro-aulas`), e matrículas (`/gestao-academica/matriculas`). Duplicar essas funcionalidades geraria retrabalho de cadastro e inconsistência de dados. O Censo é uma "fotografia" na data de referência — os dados operacionais são a fonte de verdade.

**Alternatives considered**:
- Telas de cadastro duplicadas: rejeitada — viola princípio de fonte única de verdade e dobra o esforço de manutenção.

## Decision 2: Campos INEP nas tabelas operacionais existentes

**Decision**: Adicionar os campos exigidos pelo INEP diretamente nas tabelas operacionais (`schools`, `people`, `turmas`, `academico_matriculas`), não em tabelas `censo_*` separadas.

**Rationale**: Como a correção de erros acontece nas telas de gestão existentes, os campos precisam estar disponíveis nessas telas. Adicionar às tabelas operacionais evita sincronização entre dois conjuntos de tabelas e mantém uma única fonte de verdade.

**Alternatives considered**:
- Tabelas `censo_*` separadas: rejeitada — exigiria sincronização bidirecional e o profissional teria que preencher dados em dois lugares diferentes.

## Decision 3: Validação em server action única

**Decision**: Uma única server action `validarCenso(schoolId, anoLetivoId)` que executa todas as validações de todos os registros e retorna uma lista estruturada de erros, agrupados por registro e campo.

**Rationale**: A validação é puramente server-side (lê dados, aplica regras, retorna erros). Uma action única evita múltiplos round-trips. O retorno estruturado permite que o frontend monte as abas dinamicamente.

**Alternatives considered**:
- Múltiplas actions por registro: rejeitada — a validação cross-registro (ex: idade do aluno × etapa da turma) exige dados de múltiplas tabelas, então uma action única é mais eficiente.

## Decision 4: Geração do arquivo como ação separada

**Decision**: Server action `exportarCenso(schoolId, anoLetivoId)` que revalida e gera o arquivo .txt. A revalidação é necessária para garantir que nenhum dado foi alterado entre a última validação e a exportação.

**Rationale**: A exportação só é permitida com 0 erros. Revalidar no momento da exportação garante integridade.

## Decision 5: Redirecionamento com parâmetros de URL

**Decision**: Cada erro de validação inclui uma URL de destino com parâmetros para posicionar na seção/aba correta. Ex: `/escolas/[id]?tab=endereco&field=cep`. As telas de destino devem interpretar esses parâmetros para focar no campo correto.

**Rationale**: A experiência do profissional é: ver erro → clicar → ser levado ao local exato → corrigir → voltar. Sem os parâmetros, ele teria que navegar manualmente até o campo.

**Alternatives considered**:
- Apenas link para a página sem parâmetros: rejeitada — adiciona atrito desnecessário.

## Decision 6: Matrizes INEP como dados estáticos

**Decision**: As matrizes de validação (Anexos 3-6) são armazenadas como TypeScript/JSON em `src/data/censo/`, carregadas no servidor durante a validação.

**Rationale**: São dados pequenos (30-126 combinações) que mudam apenas anualmente. JSON estático evita queries desnecessárias e é facilmente versionado.
