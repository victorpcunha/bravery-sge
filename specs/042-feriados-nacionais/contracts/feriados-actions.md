# Contracts: Ações de Semeadura de Feriados Nacionais

**Feature**: `042-feriados-nacionais` · **Date**: 2026-09-27

> Não há API pública nova nem endpoints. Os contratos abaixo cobrem (a) o retorno alterado das actions existentes e (b) o módulo neutro novo. Formato: assinaturas TypeScript + comportamento.

## 1. `src/lib/feriados-api.ts` (NOVO, neutro — sem `'use server'`)

```ts
export type FeriadoNacional = { date: string; name: string } // YYYY-MM-DD

export function anosDoIntervalo(dataInicio: string, dataTermino: string): number[]
// Anos civis distintos cobertos pelo intervalo (datas YYYY-MM-DD).
// Ex.: ('2026-02-01','2026-12-20') → [2026]; ('2025-12-01','2026-02-01') → [2025, 2026].

export function filtrarPorIntervalo(feriados: FeriadoNacional[], inicio: string, fim: string): FeriadoNacional[]
// Só feriados com inicio <= date <= fim (comparação string).

export function mapearParaEvento(feriado: FeriadoNacional, calendarioId: string): {
  calendario_id: string; descricao: string; tipo: 'recesso';
  data_inicio: string; data_termino: string; etapas: string[];
  recorrencia_tipo: 'nao_repete'; recorrencia_dias: string[];
}
// descricao = `Feriado Nacional – ${feriado.name}`; datas = feriado.date; etapas = [].

export async function buscarFeriadosNacionais(ano: number): Promise<FeriadoNacional[]>
// GET https://brasilapi.com.br/api/feriados/v1/{ano} com AbortSignal.timeout(8000).
// Resolve [{ date, name }] (só campos usados; `type` ignorado).
// Rejeita em: timeout, HTTP != 2xx, rede, payload inválido. Sem retry interno, sem cache.
```

## 2. `src/lib/actions/calendarios.ts` (MOD)

```ts
export type ResultadoSemeadura = { inseridos: number; ignorados: number; erro?: string }

export async function createCalendario(
  calendario: Partial<Calendario>, pessoaId?: string | null
): Promise<{ calendario: Calendario; feriados: ResultadoSemeadura }>
// 1. Insert do calendário (inalterado, com auditoria existente).
// 2. Semeia intervalo inteiro [data_inicio, data_termino]:
//    anos = anosDoIntervalo(...) → buscarFeriadosNacionais por ano (falha em qualquer ano
//    → { inseridos: 0, ignorados: 0, erro }) → filtrarPorIntervalo → dedupe por sobreposição
//    (qualquer evento existente com tipo recesso|nao_letivo|dia_letivo cobrindo a data; periodo_avaliativo não bloqueia)
//    → createEvento por restante (auditoria individual).
// 3. Nunca lança por causa da fonte; erro vai em feriados.erro.

export async function updateCalendario(
  id: string, calendario: Partial<Calendario>, pessoaId?: string | null
): Promise<{ calendario: Calendario; feriados: ResultadoSemeadura }>
// 1. Update do calendário (inalterado, com auditoria existente; `anterior` já carregado).
// 2. Se calendário tem ≥1 evento 'Feriado Nacional –%': semeia só feriados com data fora de
//    [anterior.data_inicio, anterior.data_termino] e dentro do novo intervalo (mesmo pipeline/dedupe).
//    Se tem zero: semeia o intervalo inteiro (retry FR-005).
// 3. Mesma política de erro de createCalendario.
```

**Consumidor único**: `TabCalendarios.tsx` (`handleCreateCalendario`, `handleUpdateCalendario`) — ajusta desestruturação + toasts:
- sem erro: `toast.success(`Calendário criado com ${N} feriado(s) nacional(is)`)` (N=0 → `... (nenhum feriado nacional no período)`); no update, só toasta quando `inseridos > 0` (`${N} feriado(s) nacional(is) adicionado(s)`), senão mantém o toast atual.
- com erro: `toast.warning('Calendário salvo, mas os feriados nacionais não puderam ser carregados. Salve novamente para tentar.')`.

## 3. `scripts/seed-feriados-existentes.mjs` (NOVO, P2 — fora do bundle)

```text
Entrada: env SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
Uso:     node scripts/seed-feriados-existentes.mjs [--dry-run]
Comportamento:
  - Lista calendários com zero eventos 'Feriado Nacional –%' (pula os já semeados).
  - Para cada um: mesmo pipeline (anos → busca → filtra → dedupe R4 → insert + auditoria).
  - [--dry-run] só imprime o que faria, sem escrever.
  - Idempotente: 2ª execução sem --dry-run insere 0 linhas.
```

## 4. O que NÃO muda (contratos preservados)

- `getAnosLetivos/getAnoLetivo/createAnoLetivo/updateAnoLetivo/deleteAnoLetivo/encerrarAnoLetivo`, `getCalendarios/deleteCalendario`, `getEventos/createEvento/updateEvento/deleteEvento` — assinaturas e comportamento intactos.
- Nenhum caminho de leitura chama a fonte externa.
- Permissão `gestao-academica.estrutura-academica.calendarios` inalterada.
