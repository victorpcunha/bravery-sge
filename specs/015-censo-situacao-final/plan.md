# Implementation Plan: Censo Escolar — Situação Final

**Branch**: `015-censo-situacao-final` | **Spec**: [spec.md](./spec.md)

## Resumo

Criar a etapa de **Situação do Aluno (Situação Final)** do Censo Escolar: validar e exportar os registros 89 (escola+gestor), 90 (situação do aluno) e 91 (admitido após), segundo o layout INEP 2025 v3, reaproveitando a arquitetura da Matrícula Inicial (validação + exportação pipe-delimited).

## Etapas

### FASE 0 — Referência e constantes
1. [ ] Criar `src/data/censo/referencias.ts` — `DATA_REFERENCIA_CENSO = 2026-05-27`.
2. [ ] Criar `src/data/censo/situacao-final.ts` — `SITUACAO_FINAL_INEP`, `ETAPAS_EI`, `ETAPAS_FINAIS`, `ETAPAS_EM`, `ETAPAS_TURMA_ADMISSAO`, `FUNCAO_GESTOR_REGEX`.

### FASE 1 — Reuso do motor de validação
3. [ ] Exportar de `censo-regras.ts`: `criarErro`, `getCorrectionUrl`, `tipoMediacaoCodigo`, `turmaHasTipo`, `calcularIdade`, `ehEtapaEM`, `turmaIsCurricular`.
4. [ ] Estender `getCorrectionUrl` com casos `89`, `90`, `91` (URLs para escola/gestores, matrícula, turma, usuário).

### FASE 2 — Tipos
5. [ ] Criar `src/lib/actions/censo-situacao-final-types.ts` — `ResultadoValidacaoSituacaoFinal`, `RegistroCountSituacaoFinal`, `ResultadoExportacaoSituacaoFinal`.

### FASE 3 — Validação
6. [ ] Criar `src/lib/actions/censo-situacao-final-regras.ts`:
   - `validarRegistro89(schoolId)` — escola + gestor.
   - `validarRegistro90(schoolId, anoLetivoId)` — situação do aluno.
   - `validarRegistro91(schoolId, anoLetivoId)` — admitido após.
   - `validarSituacaoFinal(schoolId, anoLetivoId)` — orquestra `Promise.all`, combina em `erros_por_registro`.

### FASE 4 — Exportação
7. [ ] Criar `src/lib/actions/censo-situacao-final.ts`:
   - `exportarSituacaoFinal(schoolId, anoLetivoId)` — chama validação; se válido, monta `89` → `90`*N → `91`*M → `99|`.
   - Builders `buildRegistro89`, `buildRegistro90`, `buildRegistro91` (pipe-delimited, uppercase, CRLF).

### FASE 5 — UI
8. [ ] Criar `src/components/censo/situacao-final-painel.tsx` — filtros (escola/ano), Validar/Exportar, resumo, tabs 89/90/91.
9. [ ] Integrar na página `/censo-escolar` substituindo o placeholder da aba "Situação Final".

### FASE 6 — Verificação
10. [ ] `npx next build` verde.

## Arquivos

**Novos**:
```
specs/015-censo-situacao-final/{spec,plan,tasks,data-model}.md
src/data/censo/referencias.ts
src/data/censo/situacao-final.ts
src/lib/actions/censo-situacao-final-types.ts
src/lib/actions/censo-situacao-final-regras.ts
src/lib/actions/censo-situacao-final.ts
src/components/censo/situacao-final-painel.tsx
```

**Alterados**:
```
src/lib/actions/censo-regras.ts          (export helpers + getCorrectionUrl 89/90/91)
src/app/(app)/(auth)/censo-escolar/page.tsx (usar painel na aba Situação Final)
```

## Regras de validação

Ver `spec.md` (arquivo, 89, 90, 91).

## Pontos em aberto

- Registro 91: vínculo declarado = matrícula/turma atual do aluno admitido após.
- Critério de múltiplos vínculos de escolarização (Regras Gerais a–h): helper que prioriza matrícula de escolarização não-saída; empate → primeira não Aprovado/Reprovado/Concluinte, senão aleatória.
- Aluno admitido após sem vínculo na Matrícula Inicial (E12): erro apontando ao cadastro (sem arquivo de identificação).