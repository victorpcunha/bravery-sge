# Implementation Plan: Ocorrências da Gestão Acadêmica

**Branch**: `026-ocorrencias-gestao-academica` | **Date**: 2026-09-09 | **Spec**: `specs/026-ocorrencias-gestao-academica/spec.md`

**Input**: Feature specification from `/specs/026-ocorrencias-gestao-academica/spec.md`

## Summary

Tela de Ocorrências da Gestão Acadêmica (lado staff; Portal em spec futura): listagem com card de filtros + minicards e cadastro/edição em tela própria. Abordagem técnica: espelhar a feature irmã Comunicados (025) — Server Actions em `src/lib/actions/ocorrencias.ts`, rotas `/ocorrencias`, `/novo`, `/[id]`, componentes em `src/components/ocorrencias/` — sobre o schema canônico de produção (ver `research.md` R1–R2), com migration convergente + seed do recurso `gestao-academica.ocorrencias`, registro no sidebar e nas abas internas. Único componente novo é um multi-select com chips feature-local sobre primitivas shadcn existentes (R5); zero novas dependências npm.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (`'use server'` Server Actions, `getSupabaseAdmin()`)

**Primary Dependencies**: shadcn/ui (Popover, Command, Badge, Calendar, Button, Input, Textarea, Select), react-hook-form + zod v4, `date-fns` + `ptBR`, sonner, lucide-react — todas já instaladas, **0 novas deps**

**Storage**: PostgreSQL via Supabase (`getSupabaseAdmin()`, service_role com checks server-side); migrations aplicadas via SQL Editor

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro manual `quickstart.md` (projeto sem runner de testes; padrão das specs anteriores)

**Target Platform**: Web responsiva (mobile-first nos minicards/filtros/form, padrão specs 007/008/025)

**Project Type**: Web application (Next.js monolito: `src/app/(app)/` + `src/lib/actions/` + `src/components/`)

**Performance Goals**: Filtro aplicado retorna em tempo interativo (< 2s para centenas de ocorrências/escola); busca de alunos com debounce 300ms + `limit 30`; leituras em batch sem N+1 (R8); usuário localiza ocorrência em < 1 min (SC-001)

**Constraints**: RLS bypassada via service_role → permissão (`validarPermissaoEstrita`) + escopo `school_id` obrigatórios em toda action; migrations nunca reescritas (convergência via `IF NOT EXISTS`); descrição ≤ 500 chars; exclusão sempre com confirmação

**Scale/Scope**: Centenas de ocorrências por escola; paginação client-side 10/pág; 3 rotas + 1 action + 6 componentes + 2 migrations

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — toda leitura/escrita em `src/lib/actions/ocorrencias.ts`; validação client (zod) complementar, server-side autoritativa. ✅
- **II. Security First** — `validarPermissaoEstrita` por operação + escopo `school_id` + guard client (`usePermissoes` + `ShieldAlert`); superadmin opera com escola explícita; alunos/profissionais validados como da escola. ✅
- **III. Multi-Tenant** — `school_id` em todas as queries; transferência de escola não vaza histórico (ocorrências ficam na origem). ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn** — só tokens Tailwind, só componentes oficiais/primitivas existentes; multi-select usa `Popover+Command+Badge` existentes (sem nova lib — **sem exceção ao princípio X**). ✅
- **VII. Migrations** — `ocorrencias_gestao.sql` + `patch_recursos_ocorrencias.sql` em `supabase-migrations/`; colunas `titulo/tipo/detalhes/apresentar_portal` (sem `name`, sem `ativo`). ✅
- **VIII. Auditability** — `registrarAuditoria` (best-effort) em criar/editar (com diff)/excluir, módulo `Gestão Acadêmica — Ocorrências`. ✅
- **IX. Feature-Based** — actions, componentes e rotas nos diretórios canônicos; reuso de `buscarPessoasMatriculadas` sem duplicar. ✅
- **X. No New Patterns** — nenhuma lib/estrutura nova; multi-select é composição de primitivas existentes, justificado em R5. ✅
- **XI. Design System First** — PageContainer/Header/Section, FilterBar/SearchInput quando aplicável, EmptyState, Pagination, ConfirmDialog, StatusBadge, ClickablePill, Calendar; componente novo é feature-local (promoção a oficial avaliável futuramente). ✅

Sem violações → **Complexity Tracking vazio**. Re-check pós-Phase 1: nenhuma decisão de design introduziu violação.

### Product Experience

Cada princípio da spec refletido em decisão de implementação:

- **PE-101/102/302/304** — duas rotas separadas (listagem × cadastro/edição), títulos + descrições explícitas, layout Listagem oficial.
- **PE-103** — "Nova Ocorrência" (variante default) no `actions` do card; "Salvar" default vs "Cancelar" outline no footer sticky.
- **PE-201/203** — minicard: título `text-[16px] font-semibold` + ícone/badge no topo; descrição e listas em `text-muted-foreground`.
- **PE-204** — form em 3 `FormCard`s: Identificação (título, tipo, data, Portal) · Envolvidos (profissionais, alunos) · Relato (descrição).
- **PE-401** — `ConfirmDialog variant="destructive"` nas duas exclusões.
- **PE-402** — zod + mensagens por campo ("Informe o título", "Selecione ao menos um aluno…", "Descrição limitada a 500 caracteres", "Data inicial posterior à final").
- **PE-403/404** — `toast.success/erro` + `Skeleton`/botão `loading` anti-duplo-submit.
- **PE-5xx** — EmptyStates: sem permissão / selecione escola / sem registros / filtros sem resultado (com "Limpar filtros").
- **PE-6xx** — grid minicards 1/2/3 colunas; filtros e form `grid-cols-1 sm:…`; toques ≥ 40px.

## Project Structure

### Documentation (this feature)

```text
specs/026-ocorrencias-gestao-academica/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── ocorrencias-actions.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
supabase-migrations/
├── ocorrencias_gestao.sql          # tabela canônica + junctions + índices (convergente)
└── patch_recursos_ocorrencias.sql  # seed gestao-academica.ocorrencias

src/lib/actions/
└── ocorrencias.ts                  # listar/get/criar/atualizar/excluir + listarProfissionaisSelecionaveis

src/app/(app)/ocorrencias/
├── page.tsx                        # listagem (filtros + minicards + paginação + ConfirmDialog)
├── novo/page.tsx                   # cadastro (?escola= p/ superadmin)
└── [id]/page.tsx                   # edição + Excluir

src/components/ocorrencias/
├── ocorrencia-filtros.tsx          # escola (superadmin) + datas + profissionais + aluno + tipo
├── ocorrencia-minicard.tsx         # ícone+badge, título, data, Portal, envolvidos, 100 chars, ações
├── ocorrencia-form.tsx             # pills + datas + selects + textarea + footer sticky
├── multi-select-field.tsx          # base Popover+Command+Badge (chips c/ X + limpar-tudo)
├── profissionais-select-field.tsx  # wrapper síncrono (multiple)
└── alunos-select-field.tsx         # wrapper async ≥3 letras/debounce (multiple | single no filtro)

src/components/layout/sidebar.tsx   # item Ocorrências no submenu Gestão Acadêmica
src/lib/tab-routes.tsx              # módulo ocorrencias + 3 rotas
```

**Structure Decision**: Monolito Next.js existente (Option 2 simplificada — só frontend+actions, sem backend separado); estrutura espelha Comunicados (025), sem diretórios novos além de `src/components/ocorrencias/`.

## Complexity Tracking

> Sem violações à Constituição — tabela vazia intencionalmente.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
| | | |

## Fases de implementação (referência p/ `/speckit.tasks`)

1. **Migrations + recurso** (`ocorrencias_gestao.sql`, `patch_recursos_ocorrencias.sql`; aplicar via SQL Editor).
2. **Actions** (`ocorrencias.ts`: 6 funções + zod server-side + auditoria).
3. **Multi-selects** (base + 2 wrappers).
4. **Listagem** (filtros + minicard + page + sidebar + tab-routes).
5. **Cadastro/edição** (form + 2 pages).
6. **Validação** (`tsc` + `next build` + `quickstart.md`).

## Follow-ups explícitos (fora de escopo)

- Exibição das ocorrências `apresentar_portal=true` no Portal do Responsável (spec futura).
- Alinhar `painel-pessoa.getOcorrencias` + `card-ocorrencias.tsx` ao schema canônico (hoje leem `person_id/descricao` legado).
