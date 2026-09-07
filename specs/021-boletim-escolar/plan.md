# Plan: Boletim Escolar

**Feature**: `021-boletim-escolar`
**Branch**: `021-boletim-escolar`
**Data**: 2026-09-05

## Contexto técnico

- TS/React 19/Next 16 App Router; componentes `'use client'`.
- Supabase via `getSupabaseAdmin()` (service_role, bypass RLS) nas server actions.
- PDF via `@react-pdf/renderer` 4.x; preview como imagens via `pdfjs-dist` (worker embutido).
- Motor de avaliação reutilizado: `calcularDesempenhoAluno` (`src/lib/actions/avaliacoes-numericas.ts`).
- Períodos Avaliativos: eventos `academico_calendario_eventos` com `tipo='periodo_avaliativo'`
  (descricao + data_inicio/data_termino), ligados ao ano letivo via `academico_calendarios`.
- **0 migrations** (reusa o recurso `documentos.oficiais`), **0 novas deps npm**.

## Estrutura do projeto

```
src/lib/actions/documentos.ts                    (editar)  exporta helpers de reuso
src/lib/actions/boletim.ts                       (novo)    server actions do Boletim
src/components/documentos/documento-gerador.tsx  (editar)  buscarPeriodos opcional + Select Período
src/components/documentos/boletim-escolar.tsx    (novo)    componente PDF do Boletim
src/components/documentos/oficiais-tab.tsx       (editar)  boletimConfig + minicard
specs/021-boletim-escolar/{spec,plan,data-model,quickstart}.md (novo)
```

## Tasks

1. **Spec**: arquivos em `specs/021-boletim-escolar/`.
2. **Reuso**: exportar `validarPermissaoDocumentos`, `montarEscola` e `IdentidadeEscola` de
   `documentos.ts` (hoje privados).
3. **`getPeriodosBoletim(alunoId, anoLetivoId, schoolId, pessoaId?)`** → `{ periodos, bloqueado, motivo }`:
   - valida `documentos.oficiais` visualizar; matrícula (prefere `ativo`) → turma → matriz → método.
   - sem método → `bloqueado` "Não há Método de Avaliação configurado para a turma do aluno no ano
     letivo selecionado."
   - `tipos_avaliacao.numerico !== true` → `bloqueado` com a mensagem padrão (trecho derivado das
     flags `conceito`/`parecer` ou do `nome` do método).
   - Períodos Avaliativos do calendário do ano letivo (filtro `etapas` quando preenchido), ordenados
     por `data_inicio`; ordem 1-based = `periodo` INT do motor; corta em `quantidade_periodos_numerico`.
   - fallback sem eventos → `periodos` 1..N sem datas.
4. **`getDadosBoletim(alunoId, anoLetivoId, schoolId, periodoOrdem, pessoaId?)`** → `DadosBoletim`:
   - pessoa + matrícula (turma/turnos/etapa/ano) + `montarEscola`; revalida método numérico.
   - disciplinas: `turmas_disciplinas` → `academico_matriz_disciplinas(disciplina_id →
     academico_disciplinas(nome))`, distinct por `matriz_disciplina_id`, order by nome.
   - nota por disciplina = `calcularDesempenhoAluno(...).medias_periodo[periodoOrdem-1]`.
   - frequência do período: tabela pelo `criterio_frequencia`; faixa de datas do Período Avaliativo
     (quando houver) interseccionada com `data_matricula`/`data_saida`; `por_aula` agrupada por
     `disciplina_id`; `FJ` = presença (%) + falta (total).
   - Resultado Geral: média do período entre disciplinas + frequência geral/faltas (`por_dia`).
5. **`documento-gerador.tsx`**: `DocumentoConfig` ganha `buscarPeriodos?` opcional e `buscarDados`
   passa a aceitar `periodo?` (5º param). Novo estado `periodos/periodo/bloqueado/motivo`; grid
   `lg:grid-cols-3` quando houver `buscarPeriodos`; bloco de bloqueio e Select de Período; resets ao
   trocar ano/período; estado "Selecione o período de avaliação".
6. **`boletim-escolar.tsx`**: PDF com papel timbrado (padrão Ficha). Seções: Identificação Acadêmica;
   Resultado por Disciplina (tabela condicional `por_aula`/`por_dia`); Resultado Geral do Período;
   Data de Emissão + assinatura editável.
7. **`oficiais-tab.tsx`**: `boletimConfig` (`GraduationCap`, `buscarPeriodos: getPeriodosBoletim`),
   `nomeArquivo: boletim-escolar-{nome}-{periodo}.pdf`, minicard.
8. **Verificação**: `npx tsc --noEmit` + `npx next build` verdes (43 rotas).

## Notas

- Reuso integral do gerador/fluxo e do papel timbrado (mesmo padrão Declaração/Ficha).
- A faixa de datas do período filtra a frequência; as notas usam a coluna `periodo` do motor (sem
  filtro de data), como o Diário.
- O formato do campo `etapas` dos eventos será confirmado na implementação (provável `etapa_codigo`
  como string); se vazio, o período aplica-se a todas as etapas.