# Implementation Plan: Importação Inicial de Usuários

**Branch**: `039-importacao-inicial-usuarios` | **Date**: 2026-09-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/039-importacao-inicial-usuarios/spec.md`

## Summary

Criar o módulo de navegação "Importação e Exportação" (reagrupando a tela existente de Censo Escolar, sem mudança funcional) com a nova tela de Importação Inicial: seleção de unidade → tipo (Alunos/Profissionais) → download do modelo CSV → upload → validação com relatório por linha → confirmação que persiste só as linhas válidas. Abordagem: parse CSV no cliente com `xlsx` (dependência já instalada), validação/persistência 100% server-side em `src/lib/actions/importacao.ts` reutilizando `createPerson` (profissional importa só a pessoa; vínculo depois na tela de Usuários), lote efêmero (0 migrations), auditoria agregada (1 registro/lote) e recurso de permissão próprio. Ver decisões em [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript + Next.js App Router (versão do repo) + React

**Primary Dependencies**: Server Actions (`'use server'` + `getSupabaseAdmin()`); `xlsx` (já instalado — parse CSV/XLSX via import dinâmico, mesmo padrão dos relatórios); regex de e-mail (mesmo da tela de Usuários); `sonner` (feedback); shadcn/ui + componentes oficiais (PageContainer/Header/Section, StatusBadge, EmptyState, Pagination)

**Storage**: Supabase Postgres — reutiliza `people`, `recursos`, `auditoria` (profissional importa só a pessoa; vínculo completado na tela de Usuários). **0 migrations de tabelas** (lote efêmero, sem persistência temporária); 1 migration seed de recurso (`patch_recursos_importacao.sql`, padrão `INSERT ... ON CONFLICT DO NOTHING`)

**Testing**: Validação via `quickstart.md` (cenários manuais ponta a ponta) + gates do repo: `npx tsc --noEmit` limpo e `npx next build` verde (padrão das specs anteriores). Sem suite de testes automatizados no repo (nenhuma convenção de testes existe na Constituição).

**Target Platform**: Web responsivo (desktop predominante — tela operacional de secretaria; cards `<md` conforme padrão das specs 007/008)

**Project Type**: Web application (Next.js, feature-based: actions + components + pages)

**Performance Goals**: Lote de até 1.000 linhas processado sem travar a UI (parse no cliente, inserts sequenciais/em chunks no servidor, botão desabilitado durante processamento); relatório de erros paginado 10/pág com `<Pagination>` oficial

**Constraints**: Sem novas dependências npm (Constituição X — `xlsx` já aprovado em uso); sem criar `auth.users`/`user_schools` em lote (login continua opt-in); validação server-side autoritativa; `;` prioritário com fallback `,`; datas `DD/MM/AAAA` + ISO; 2 etapas validar→confirmar com revalidação no confirmar

**Scale/Scope**: 1 unidade por lote; 2 tipos (Aluno 7 colunas / Profissional 5 colunas, só pessoais); 2 actions novas + 1 migration seed + 1 página + ~4 componentes; sem alteração em Censo, Usuários ou Diário

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — Toda leitura/escrita via `src/lib/actions/importacao.ts` (`'use server'`); validação server-side autoritativa; parse no cliente é só estruturação de texto, não regra de negócio. ✅
- **II. Security First** — `validarPermissaoEstrita(pessoaId, 'importacao-exportacao.importacao-inicial', 'criar'/'visualizar')` em cada action; escopo `school_id` forçado server-side (usuário comum fixo na própria escola; superadmin escolhe). Nada de permissão vinda do frontend. ✅
- **III. Multi-Tenant by Design** — `school_id` em todos os inserts/lookups (pessoas, duplicidade de CPF por escola). ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn/ui** — Só componentes oficiais e tokens (`bg-card`, `text-muted-foreground`, `border-border` etc.); zero hex; `StatusBadge` para estados do relatório; `EmptyState` para vazio/erro. ✅
- **VII. Database Through Migrations** — 0 migrations de tabela; 1 seed de recurso (mesmo padrão dos demais recursos). Colunas usadas já existem e são nullable fora do modelo. ✅
- **VIII. Auditability First** — 1 `registrarAuditoriaAgregada` por lote confirmado (ator, escola, tipo, quantidades). Best-effort. ✅
- **IX. Feature-Based Architecture** — `actions/importacao.ts`, `components/importacao/*`, `app/(app)/(auth)/importacao-inicial/page.tsx`, migration em `supabase-migrations/`. ✅
- **X. No New Patterns** — `xlsx` já é dependência em uso (relatórios); download do modelo via `Blob` puro; sem nova lib de estado/UI/auth. ✅
- **XI. Design System First** — Layout de Cadastro (PE-304) com `PageContainer > PageHeader + FormCards por grupo`; relatório com `Table` shadcn + paginação oficial; sem componente local quando houver oficial equivalente. ✅

Sem violações — **Complexity Tracking: N/A**.

### Product Experience

- **PE-101** → Tela com objetivo único ("importar um lote de usuários para uma unidade"); download/validar/confirmar são passos do mesmo fluxo, não telas separadas.
- **PE-103** → Ação principal "Importar/Confirmar" em destaque único; "Baixar modelo", trocar tipo e voltar como secundárias.
- **PE-204** → Grupos visuais: Unidade → Tipo de envio → Arquivo/Modelo → Resultado (cards separados).
- **PE-205** → Upload/instruções aparecem após escolher o tipo; relatório de erros aparece após validar; modelo baixado corresponde ao tipo.
- **PE-304** → Fluxo validar (preview) → revisar → confirmar, com validações por linha antes da persistência.
- **PE-402** → Erro por linha: `{linha, campo, mensagem, orientacao}` — ex. "Linha 12 · CPF: ausente e sem matrícula da certidão — informe ao menos um dos dois".
- **PE-403** → Resumo imediato: recebidas/criadas/rejeitadas via toast + card de resultado.
- **PE-404** → Estados `lendo`/`validando`/`importando` com spinner oficial + botões desabilitados (sem duplo envio).

*Re-check pós-Phase 1*: nenhum artefato de design contraria os princípios acima; trade-off documentado — registros nascem parciais (campos fora do modelo = NULL, complementação na tela de Usuários), cf. R-07.

## Project Structure

### Documentation (this feature)

```text
specs/039-importacao-inicial-usuarios/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── server-actions.md  # Assinaturas e comportamentos das actions
│   └── csv-modelos.md     # Colunas oficiais + tabelas de normalização
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── lib/actions/
│   └── importacao.ts              # validarLoteImportacao + confirmarLoteImportacao (+ normalizadores)
├── components/importacao/
│   ├── importacao-form.tsx        # Orquestra: unidade → tipo → upload → resultado
│   ├── modelo-download.tsx        # Botão + geração do CSV modelo (Blob)
│   ├── arquivo-upload.tsx         # Input de arquivo + parse via xlsx + estados PE-404
│   └── resultado-lote.tsx         # Resumo + tabela de erros paginada
├── app/(app)/(auth)/
│   └── importacao-inicial/
│       └── page.tsx               # PageContainer + PageHeader + ImportacaoForm
├── components/layout/
│   └── sidebar.tsx                # 'Censo Escolar' → módulo 'Importação e Exportação' + submenu
└── lib/
    └── tab-routes.tsx             # Módulo de aba agrupando /censo-escolar + /importacao-inicial

supabase-migrations/
└── patch_recursos_importacao.sql  # Seed: ('importacao-exportacao.importacao-inicial', ...)

# Arquivos tocados sem mudança funcional:
# - src/app/(app)/(auth)/censo-escolar/page.tsx (só se necessário p/ aba; comportamento intacto)
# - src/lib/actions/censo-regras.ts (extrair validarCPF p/ helper compartilhado)
```

**Structure Decision**: Feature-based (Constituição IX) — nova pasta `components/importacao/` + action dedicada; rota nova sob `(auth)` ao lado de `censo-escolar`; sidebar agrupa sem mover arquivos; 1 seed de recurso.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Nenhuma violação — seção N/A.
