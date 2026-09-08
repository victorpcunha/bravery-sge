# Contracts: Server Actions do Portal (`src/lib/actions/portal.ts`)

**Feature**: `023-portal-responsavel` | **Date**: 2026-09-08

Todas `'use server'` + `getSupabaseAdmin()`. Toda função de leitura de aluno exige `(responsavelId, alunoId)` e chama primeiro `validarVinculoPortal` — que retorna `{ ok: true, ctx }` ou lança `Error('Acesso negado')` (componentes traduzem para estado vazio/redirect, nunca expõem detalhe). `ctx` = `{ schoolId, matriculaId, turmaId, anoLetivoId }` da matrícula vigente.

Tipos base (espelham retornos do motor; ver `boletim.ts`, `painel-pessoa.ts`):

```ts
type PortalCtx = { schoolId: string; matriculaId: string; turmaId: string; anoLetivoId: string }
type AlunoVinculado = { alunoId: string; nome: string; turmaNome: string | null; principal: boolean }
```

## Sessão / LGPD

- `getSessaoPortal(responsavelId): Promise<{ responsavel: { id, nome, email }; termoPendente: boolean; alunos: AlunoVinculado[] }>`
  Vínculos via `responsavel_alunos` + matrícula vigente + turma; `termoPendente = !aceite(termo ativo)`.
- `getTermoVigente(): Promise<{ versao: number; conteudo: string } | null>`
- `aceitarTermo(responsavelId): Promise<{ ok: true }>`
  Insere `portal_aceites(responsavel, termo ativo)` (idempotente) + `registrarAuditoria({ modulo: 'Portal do Responsável', entidade: 'portal_termo', acao: 'criar', ... })` com `versao` (sem conteúdo/senha).

## Início (US3)

- `getInicioPortal(responsavelId, alunoId): Promise<{ presencaGeral: number | null; totalFaltas: number; mediaGeral: { periodo: string; valor: number | null }; totalOcorrencias: number; comunicadosRecentes: ComunicadoResumo[]; mediasDisciplina: { disciplina: string; media: number | null }[]; ocorrenciasRecentes: OcorrenciaResumo[] }>`
  Fachada única (1 round-trip): delega a `getFrequenciaGeral`, `getDadosBoletim`, contagem de ocorrências (portal) e top-3 comunicados/ocorrências. `null` = sem lançamentos (estado vazio, nunca zero enganoso).

## Páginas (US4–US6)

- `getBoletimPortal(responsavelId, alunoId, periodoOrdem?): Promise<BoletimPortal>` — monta via `resolverMetodoBoletim` + `calcularMediasPeriodoTurma` (lote) + células por avaliação; `linhas[].temRecuperacao` sinaliza média com recuperação/conselho; inclui `{ bloqueado, motivo }`.
- `getMediasInicio(responsavelId, alunoId, periodoOrdem): Promise<{ periodoNome, mediaGeral, mediasDisciplina }>` — troca leve de período no Início via `calcularMediasPeriodoTurma` (lote, mesma regra do engine), sem refetch de frequência/ocorrências/comunicados.
- `getFrequenciaPortal(responsavelId, alunoId, periodoOrdem?): Promise<{ geral: { percentual, aulas, faltas, limiteFaltas, frequenciaMinima }; porDisciplina: { disciplina, aulas, faltas, percentual }[] }>` — usa `calcularFrequenciaBoletim` (a exportar, R4); `limiteFaltas = (100 − frequenciaMinima)% × aulas`.
- `getHorariosPortal(responsavelId, alunoId): Promise<QuadroAulaItem[]>` — `getQuadroAulas` + `professor_nome` via `people`.
- `getOcorrenciasPortal(responsavelId, alunoId, filtro: 'todas'|'positiva'|'negativa'): Promise<OcorrenciaResumo[]>` onde `OcorrenciaResumo = { id, titulo, natureza, data, descricao }` — JOIN `ocorrencias_alunos` (schema real de produção), só `apresentar_portal=true`, `natureza` = coluna `tipo`, `descricao` = coluna `detalhes`, ORDER `data_ocorrencia DESC`.
- `getComunicadosPortal(responsavelId, alunoId): Promise<ComunicadoResumo[]>` onde `ComunicadoResumo = { id, titulo, data, descricao, lido: boolean }` — escopo ∩ turma + `receber_comunicados`, com `lido` via LEFT JOIN `comunicados_leituras`.
- `marcarComunicadoLido(responsavelId, comunicadoId): Promise<{ ok: true }>` — insert idempotente em `comunicados_leituras` (valida que o comunicado é visível ao responsável antes de inserir).

## Regras transversais

- Erros de gate/vínculo: `Error('Acesso negado')` (genérico; UI mostra EmptyState ou redirect `/portal/login`).
- Nenhuma action recebe `schoolId` do cliente — sempre derivado server-side (III).
- Nenhuma action persiste senha, e-mail de login ou conteúdo do termo em auditoria (VIII/LGPD).
