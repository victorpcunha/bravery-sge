# Data Model: Visibilidade dos Módulos do Portal do Responsável

**Feature**: specs/040-configurar-visibilidade-portal/spec.md
**Date**: 2026-09-27

## Entidades

### schools (estendida — 6 colunas)

| Coluna | Tipo | Default | Regra |
|--------|------|---------|-------|
| `portal_vis_boletim` | BOOLEAN NOT NULL | TRUE | Visível no portal quando TRUE |
| `portal_vis_frequencia` | BOOLEAN NOT NULL | TRUE | Visível no portal quando TRUE |
| `portal_vis_horarios` | BOOLEAN NOT NULL | TRUE | Visível no portal quando TRUE |
| `portal_vis_ocorrencias` | BOOLEAN NOT NULL | TRUE | Visível no portal quando TRUE |
| `portal_vis_comunicados` | BOOLEAN NOT NULL | TRUE | Visível no portal quando TRUE |
| `portal_vis_documentos` | BOOLEAN NOT NULL | TRUE | Visível no portal quando TRUE |

- Migration: `supabase-migrations/patch_portal_modulos_visiveis.sql` (aditiva; `DEFAULT TRUE` = backfill implícito, comportamento atual preservado).
- Fora do payload do Censo: Registro 00 lê colunas explícitas — verificar na implementação que as novas colunas são ignoradas (mesma garantia das specs 018/024).
- Auditoria: `updateSchool` persiste `dados_anteriores`/`dados_novos` completos (módulo `Unidade Escolar`, entidade `schools`) — as 6 flags entram no diff sem código novo.

### ModuloPortal (conceito, não tabela)

- Chaves estáveis: `boletim | frequencia | horarios | ocorrencias | comunicados | documentos`.
- Mapeamento chave→coluna em `src/lib/portal-modulos.ts` (fonte canônica).
- `ModulosVisiveis = Record<ModuloPortal, boolean>` — trafega em `getEscolaPortal` → `EscolaPortalCtx` → sidebar/Início/páginas.

## Relacionamentos

- Uma `schools` possui um conjunto de visibilidade (6 flags, 1:1 por colunas).
- `ModulosVisiveis` filtra leitura: menu, acesso rápido, blocos do Início e actions de módulo — sempre no escopo `school_id` da escola do slug (isolamento multi-tenant).
- Gestão interna inalterada: nenhuma action do app interno consulta as flags; a visibilidade governa **somente** o Portal do Responsável.

## Estados e transições

- Flag por módulo: `TRUE` (visível, default) ↔ `FALSE` (oculto). Transição via card da Unidade Escolar, reversível, efeito imediato no próximo carregamento do portal (sem ação do responsável).
- Caso limite: 6 módulos `FALSE` → portal exibe só Início (identificação + orientação), sem menu vazio quebrado.

## Validações

- Server-side: `exigirModuloVisivel(schoolId, modulo)` após `validarVinculoPortal` em cada action de módulo; erro `Módulo indisponível no portal desta escola` (distinto de `Acesso negado`).
- Client-side (complementar): sidebar, acesso rápido, blocos do Início e páginas de módulo consultam `modulosVisiveis` do contexto.
- Form: pills `'1'`/`'0'` (convenção Censo); Postgres converte para boolean no `updateSchool`.
