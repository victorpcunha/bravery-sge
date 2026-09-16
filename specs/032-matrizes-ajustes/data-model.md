# Data Model: Estrutura Acadêmica — Matrizes: Ajustes (032)

**Spec**: `spec.md` · **Plan**: `plan.md`

## 0. DDL (1 migration)

**Arquivo**: `supabase-migrations/patch_matriz_nao_reprova_pills.sql` (aplicar via SQL Editor — sem CLI Supabase):

```sql
-- Pills "Não reprova por nota / frequência" por disciplina da matriz
ALTER TABLE academico_matriz_disciplinas
  ADD COLUMN IF NOT EXISTS nao_reprova_nota BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nao_reprova_frequencia BOOLEAN NOT NULL DEFAULT false;

-- Backfill do legado: desconsidera=true equivalia a "não reprova por nada"
UPDATE academico_matriz_disciplinas
SET nao_reprova_nota = true,
    nao_reprova_frequencia = true
WHERE desconsidera_reprovacao = true;

COMMENT ON COLUMN academico_matriz_disciplinas.nao_reprova_nota IS 'Exclui a disciplina do cômputo de média mínima (Diário/Fechamento/Conselho/Boletim/Rendimento)';
COMMENT ON COLUMN academico_matriz_disciplinas.nao_reprova_frequencia IS 'Exclui a disciplina do cômputo de frequência mínima (Diário/Fechamento/Boletim/Rendimento)';
```

Sem índices novos (filtragem sempre por `periodo_id`, já indexado). Sem RLS nova (tabela já coberta por `rls_policies_matrizes_curriculares.sql`).

## 1. Semântica das pills

- **Conteúdo**: dois `BOOLEAN NOT NULL DEFAULT false`, independentes (ambas marcáveis juntas).
- **Compatibilidade**: `desconsidera_reprovacao` é mantida e escrita de forma espelhada pelas actions (`desconsidera = nota OR frequencia`). Motivo: a coluna existe no banco e a tabela é lida por 6+ módulos indiretos (frequências, notas, conselho, turmas, plano de ensino, quadro de aulas); nenhum deles lê o flag hoje, então o espelho é só segurança de leitura futura/relatórios.
- **Leitura canônica nova**: consumidores de situação passam a ler `nao_reprova_nota` / `nao_reprova_frequencia` (FR-016).
- **Vazio (ambas false)**: comportamento idêntico ao atual (disciplina conta para tudo).

## 2. Leitura estendida (sem DDL — corrige US7)

`getDisciplinasPorPeriodo(periodoId)` passa a selecionar:

```
academico_matriz_disciplinas(*,
  academico_disciplinas(nome, nome_abreviado, componente),
  academico_matriz_habilidades_bncc(habilidade_codigo),
  academico_matriz_habilidades_manuais(codigo, descricao))
```

Aliases de saída `bncc_habilidades` / `habilidades_manuais` — exatamente o que `openDiscModal` (`MatrizForm.tsx:280-281`) já consome; nenhum ajuste no form além de receber os dados. Display de cargas passa a ler `carga_horaria_regular_minutos` / `carga_horaria_integral_minutos` (colunas reais; hoje o JSX lê nomes inexistentes).

`substituirHabilidades`: `delete` ambos os vínculos sempre; `insert` BNCC **só se array não-vazio**; `insert` manuais **só se array não-vazio** (fim do `insert([])` que falha no Supabase).

## 3. Filtro do select de disciplinas (leitura, sem DDL)

```
academico_disciplinas
  WHERE school_id = :escola
    AND ativo = true
    AND (tipo_ensino = :tipoDaEtapa OR tipo_ensino = 'todos')
  ORDER BY nome
```

- `:tipoDaEtapa` deriva da etapa da matriz (mesmo `or(...)` já usado em `getDisciplinas`, `matrizes.ts`).
- Sem `ano_letivo_id`: a tabela não possui a coluna (decisão registrada — não criar vínculo novo).
- Tipo travado: `diretriz_curricular` (`bncc`→`base_comum`, `parte_diversificada`→`parte_diversificada`, `nenhuma`/NULL→`base_comum`).

## 4. Replicação (sem DDL)

`replicarDisciplinas` já apaga destino (disciplinas + habilidades) e copia disciplinas + BNCC + manuais; acrescenta cópia de `nao_reprova_nota/frequencia` (já copia `desconsidera_reprovacao`, cargas e tipo). Auditoria agregada existente mantida.

## 5. Subcard rico (derivações, sem escrita)

- **Ano letivo**: `matrizes.ano_letivo_id → academico_anos_letivos.descricao` (estender o select de `getMatrizes` ou batch; não N+1).
- **Etapa/turnos/tipo/datas**: colunas já retornadas por `getMatrizes`.
- **Qtd disciplinas**: soma de `getDisciplinasPorPeriodo` dos períodos da matriz (batch com `Promise.all`, não `await` em loop).
- **Expansão**: filtrar o mapa pelos `periodo_id`s da matriz (`getPeriodos(matrizId)`), agrupar por `periodo_nome`.

## 6. Sem mudanças em

- `academico_matrizes_curriculares`, `academico_matriz_periodos`, habilidades (DDL), `academico_disciplinas` (DDL), `academico_anos_letivos/etapas/subetapas/métodos`, BNCC do sistema, permissões (`...matrizes`), auditoria (pills entram no diff automaticamente), grade de períodos (só reposicionamento de botão).
