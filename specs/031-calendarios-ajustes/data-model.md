# Data Model: Estrutura Acadêmica — Calendários: Ajustes (031)

**Spec**: `spec.md` · **Plan**: `plan.md`

## 0. DDL

Nenhuma migration. Coluna `academico_calendarios.etapas TEXT[]` ("Array de etapas atendidas", `academico_calendarios_escolares.sql:34`) já existe e `create/updateCalendario` já a persistem; o que falta é só a UI. Idem `academico_calendario_eventos.etapas TEXT[]` — fora do escopo (eventos continuam com `etapas: []`).

## 1. Semântica de `calendarios.etapas`

- **Conteúdo**: códigos INEP das etapas como string (`String(etapa_codigo)` — ex. `['1','2','14','15']`).
- **Por que código, não UUID**: `academico_etapas_ensino.id` varia por `(school_id, ano_letivo_id)`; o código INEP é estável entre anos e legível no diff da auditoria.
- **Vazio (`[]` ou NULL)**: legado (todo o banco atual, sem UI até hoje) = "vale para todas as etapas" — mesma convenção já usada pelos consumidores (`boletim.ts:147-154`: `!etapas.length` = todas). Calendários novos sempre terão ≥1 (FR-006); a edição de legados exige marcar ≥1 antes de salvar.
- **Preservação**: valores fora do catálogo atual (ex. etapa desativada depois) não são exibidos, mas são mantidos no save (merge: `etapas` do form + valores desconhecidos do registro).

## 2. Mapa dos 7 grupos (constante local em `TabCalendarios.tsx`)

Agrupamento por **código INEP explícito** (não por `etapa_tipo`, pois Médio e Normal/Magistério compartilham `tipo='medio'`):

| Grupo (título exato) | Códigos INEP |
|---|---|
| Infantil | 1, 2, 3 |
| Anos Iniciais | 14, 15, 16, 17, 18 |
| Anos Finais | 19, 20, 21, 41 **+ 22, 23, 56** (Multi/Correção — decisão registrada) |
| Ensino Médio | 25, 26, 27, 28, 29 |
| Ensino Médio Normal/Magistério | 35, 36, 37, 38 |
| EJA | 69, 70, 72, 71, 74, 73, 67 |
| Curso Técnico e Qualificação Profissional | 39, 40, 64, 68, 75 |

Nomes de exibição das pills: `etapa_nome` do registro `academico_etapas_ensino` (dado real da escola+ano), não o nome do catálogo.

## 3. Fluxo de leitura (modal)

```
openCalendarioCreate/Edit
  → getEtapasEnsino(effectiveSchoolId, selectedAno.id)   # só ativa=true (action existente)
  → filtra por códigos do mapa (§2)                      # ignora códigos fora do catálogo
  → agrupa nos 7 grupos; oculta grupos vazios
  → create: etapas=[] · edit: etapas=cal.etapas (merge preserva desconhecidos no save)
```

- Dependência: `effectiveSchoolId && selectedAno` (superadmin sem escola → seção não carrega).
- Zero etapas ativas na escola+ano → mensagem orientando ativar na aba Etapas (não lista grupos).
- Sem escrita nova: 1 leitura por abertura do modal (dezenas de linhas).

## 4. Derivações KPI (leitura, sem escrita)

- **Geral**: `total = Σ getDiasLetivosPorMes(gerarDiasCalendario(inicio, fim), eventos).totalLetivos` — cálculo já feito hoje no header (`TabCalendarios.tsx:861-867`), só muda o recipiente (`StatCard`).
- **Por período**: para cada evento `tipo='periodo_avaliativo'` (ordenado por `data_inicio`): `contarDiasLetivosNoIntervalo(inicio, termino, eventos)` — mesma função atual (`:56-78`), só reposicionada para o topo.
- Sem períodos → só o geral (sem seção vazia). Editar/excluir por período reaproveitam `openEditPeriodo`/`deletePeriodo` atuais.

## 5. Sem mudanças em

- `academico_anos_letivos`, `academico_calendario_eventos`, ações `calendarios.ts` (assinaturas intactas), permissões, auditoria, grade mensal (`renderCalendarGrid`), modal do dia, ConfirmDialogs.
