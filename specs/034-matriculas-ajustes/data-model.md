# Data Model: Alunos Matriculados — Ajustes

**Spec**: [spec.md](./spec.md) | **2 migrations** (`codigo_matricula` + remoção de dispensas); resto sem DDL.

## DDL nova — `patch_codigo_matricula.sql`

```sql
ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS codigo_matricula INTEGER;

-- Backfill: sequencial por escola, ordenado por data_matricula + created_at
WITH numeradas AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY school_id ORDER BY data_matricula, created_at
  ) AS seq
  FROM academico_matriculas
)
UPDATE academico_matriculas m
SET codigo_matricula = n.seq
FROM numeradas n WHERE n.id = m.id;

ALTER TABLE academico_matriculas ALTER COLUMN codigo_matricula SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_matriculas_codigo
  ON academico_matriculas(school_id, codigo_matricula);
```

Geração no app (`createMatricula`): `SELECT max(codigo_matricula) ... WHERE school_id` + 1 (padrão `people.ts:246-251` do `codigo_pessoa`). UNIQUE protege concorrência (erro → `toast.error` + retry manual).

## Entidades lidas/escritas (sem DDL)

| Entidade | Tabela | Uso no ajuste |
|---|---|---|
| Matrícula | `academico_matriculas` | `+codigo_matricula` no select/create; hard delete (`deleteMatricula`); `transporte_responsavel` + veículos (fonte confirmada na Fase 0) |
| Movimentação | `academico_matriculas_movimentacoes` | leitura p/ histórico rico (`tipo`, `data_movimentacao`, `data_registro`, `observacoes`, `dados_complementares`, join `profissional`) |
| ~~Dispensa~~ (removida) | ~~`academico_matriculas_dispensas`~~ dropada via `patch_remove_dispensas.sql` | — |
| Etapa/Turma destino | `academico_etapas_ensino`, `turmas` | batch p/ resolver `nova_etapa_id`, `nova_turma_id`, `turma_destino_id` em nomes |

## Mapa de exibição por tipo de movimentação (US5)

| Tipo (`tipo`) | Badge (`StatusBadge`) | Datas | Campos exibidos (além das datas) |
|---|---|---|---|
| `Transferencia` | Transferido → `warning` | Registrada em (`data_registro`) + Data efetiva (`data_movimentacao`) | Observações |
| `Reclassificacao` | Reclassificado → `info` | idem | Nova Etapa (nome via `dados_complementares.nova_etapa_id`) + Nova Turma (nome via `nova_turma_id`) + Observações |
| `Remanejamento` | Remanejado → `warning` | idem | Turma de Destino (nome via `turma_destino_id`) + Observações |
| `Desistencia` | Desistente → `destructive` | idem | Motivo (`dados_complementares.motivo_desistencia`) + Observações |
| `Obito` (legado) | Óbito → `destructive` | idem | Observações (sem mudança de regra) |

Mapa de variants em `lib/situacoes-matricula.ts` (estender `variantSituacaoMatricula` ou helper dedicado `variantTipoMovimentacao`).

## Mapa Transporte → Pills (US3)

| Pill (label) | Valor persistido | Subcard Veículos |
|---|---|---|
| Nenhum | `'Não utiliza'` (confirmar Fase 0) | oculto; veículos limpos no save |
| Estadual | `'Estadual'` | visível |
| Municipal | `'Municipal'` | visível |

Veículos: 2 grupos multi — Rodoviários (Bicicleta, Micro-ônibus, Ônibus, Tração Animal, Vans/Kombis, Outro Rodoviário) e Aquaviários (Até 5 alunos, 5 a 15 alunos, 15 a 35 alunos, Acima de 35 alunos). Persistência na fonte confirmada na Fase 0 (booleanas `veiculo_*` vs `transporte_veiculos JSONB`).

## Regras de persistência (inalteradas, só referência)

- `salvarMovimentacoes`: 1 movimentação por matrícula (`movSalvas`); atualiza `situacao`/`data_saida` pelo último item.
- Auditoria: `deleteMatricula` registra `acao:'excluir'` (módulo `Alunos Matriculados`); código entra no snapshot de criação. (Registros antigos de `academico_matriculas_dispensas` permanecem só na tabela `auditoria` como histórico.)
