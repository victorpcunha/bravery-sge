# Implementation Plan: Auditoria Censo × v4 (038)

## Estratégia

Batches por risco, cada um com `tsc` + `checar-layout` + revalidação em dados reais. Só código de validação/exportação + tabelas em `src/data/censo/` (+ tabelas auxiliares novas quando a regra exigir pertinência). 0 migrations previstas (se alguma regra exigir coluna inexistente — ex. 20.c21 — documenta-se e emite-se em branco).

## Batches

- **B1 — Alta (H1–H9)**: responsavel 1/2; filtro com join em profissional×aluno; `TURMA_MULTI_PERMITIDOS` pela v4 (56/72/64, remover EM/EJA extras); etapa na função 9; r8 da função 4; docente 1/5; leciona só sem Código 1; tetos 33–35; re-verificação posicional 20/30/50/60.
- **B2 — R20**: forma/FGB/itinerário/tipo-curso/cód-curso nulos e obrigatoriedades; etapa×agregada; EM; eixo/curso/carga por etapa (nova `cursos-ep.ts` se preciso); áreas EI-nulas + área×etapa (`regras-areas.ts`); atividades na tabela; horas ≤23; regra 25.
- **B3 — R30**: unicidades; nome/data/filiação/demográficos; flags e grupos 17–49 + nulos; certidão; residência; tipo médio; áreas 67–69; pós 70–88; formação 89–109; combinações c/j (+ D1/D2 conforme decisão).
- **B4 — R10/R00/R50/R60**: grupos e condicionais listados nos achados médios.
- **B5 — Dados**: diffs e novas tabelas (Anexo 3, 5, 6, 7, etapa×agregada, DDD, Povos, Países, Cursos EP, Áreas, Pós) + přepojas nos consumidores.

## Verification (por batch)

1. `npx tsc --noEmit` limpo.
2. `node scripts/checar-layout.mjs` 7/7.
3. Revalidação da escola real: novos erros precisam ser verdadeiros (amostra conferida na v4); nenhum erro antigo some sem motivo.
