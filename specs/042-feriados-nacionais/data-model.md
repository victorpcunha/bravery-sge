# Data Model: Feriados Nacionais Automáticos no Calendário

**Feature**: `042-feriados-nacionais` · **Date**: 2026-09-27

> Sem DDL. Todo o estado novo vive em linhas de `academico_calendario_eventos` (tabela existente). Este documento define a semântica dessas linhas e o shape transitório da fonte externa.

## 1. Evento — feriado nacional (linha em `academico_calendario_eventos`)

| Campo | Valor para feriado automático |
|---|---|
| `calendario_id` | UUID do calendário recém-criado/editado |
| `descricao` | `Feriado Nacional – {nome oficial}` (prefixo fixo = marcador de semeadura; en-dash `–`) |
| `tipo` | `'recesso'` (CHECK existente já permite) |
| `data_inicio` / `data_termino` | `YYYY-MM-DD` do feriado (dia único; comparação sempre por string, sem `Date`) |
| `etapas` | `[]` (vale para todas as etapas, igual aos eventos manuais de dia) |
| `recorrencia_tipo` | `'nao_repete'` |
| `recorrencia_dias` | `[]` |

**Leituras afetadas (sem mudança de código)**: `getDiasLetivosPorMes` (grid vermelho + fora da contagem), `contarDiasLetivosNoIntervalo` (KPIs), `getEventosDoDia` (lista no modal do dia — `recesso` já é incluído), Boletim/Rendimento (consomem dias letivos derivados).

## 2. Marcador de semeadura (sem coluna nova)

- Calendário **semeado** = existe ≥1 evento com `descricao LIKE 'Feriado Nacional –%'` naquele `calendario_id`.
- Calendário **não semeado** = zero eventos com o prefixo → próximo save tenta o intervalo inteiro (retry FR-005).
- Exclusão manual de um feriado remove só aquela linha; as demais mantêm o calendário como "semeado", logo re-saves sem ampliação não recriam nada (US2-2).

## 3. Faixas de data no update (sem estado novo)

- `updateCalendario` já carrega `anterior` (para auditoria). Semeadura cobre só feriados com data **fora** de `[anterior.data_inicio, anterior.data_termino]` (comparação string `YYYY-MM-DD`) e **dentro** do novo intervalo.
- Redução de intervalo não apaga nada (eventos fora da nova vigência seguem editáveis/excluíveis manualmente — comportamento atual inalterado).

## 4. Fonte externa (transitória, não persistida)

`GET https://brasilapi.com.br/api/feriados/v1/{ano}` → array de:

| Campo | Tipo | Exemplo |
|---|---|---|
| `date` | `string YYYY-MM-DD` | `"2026-01-01"` |
| `name` | `string` | `"Confraternização Universal"` |
| `type` | `string` | `"national"` (ignorado — importa tudo que a fonte devolver) |

Anos consultados = anos civis distintos cobertos por `[calendario.data_inicio, calendario.data_termino]` (regra `anosDoIntervalo`; caso comum: 1 ano).

## 5. Resultado da semeadura (retorno das actions, não persistido)

```text
{ calendario: Calendario, feriados: { inseridos: number, ignorados: number, erro?: string } }
```

- `inseridos` = eventos criados (com auditoria individual cada).
- `ignorados` = feriados fora do intervalo + datas com sobreposição bloqueadora (R4).
- `erro` presente = fonte falhou (timeout/HTTP/rede); calendário persistido normalmente.

## 6. Auditoria (existente, sem mudança)

Cada evento inserido gera `registrarAuditoria({ modulo: 'Estrutura Acadêmica — Calendários', entidade: 'academico_calendario_eventos', acao: 'criar', pessoa_id, school_id })` via path de `createEvento`. Volume ~9–12 por calendário/ano — registro individual (não agregado).
