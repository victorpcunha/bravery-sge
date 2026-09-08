# Contracts: Portal por Escola (`src/lib/actions/portal-escola.ts` + escopo em `portal.ts`)

**Feature**: `024-portal-por-escola` | **Date**: 2026-09-08

## Novas (`portal-escola.ts` + `portal-slug.ts`)

Helpers puros de slug vivem em `src/lib/portal-slug.ts` (client-safe: `normalizarSlug`, `sugerirSlug`, `SLUGS_RESERVADOS`, `SLUG_MAX_LENGTH`) — `'use server'` não pode ser importado pelo EscolaForm. Server actions em `src/lib/actions/portal-escola.ts`:

```ts
// 'use server' + getSupabaseAdmin()

```ts
type EscolaPortalBranding = {
  nome: string            // nome_fantasia || nome_escola
  logo: string | null
  imagemFundo: string | null
  textoLogin: string | null
}
type EscolaPortal =
  | { ok: true; schoolId: string; slug: string; branding: EscolaPortalBranding }
  | { ok: false; motivo: 'desconhecida' | 'desabilitada' }

// Pública (pré-auth, só branding — nunca dados)
getEscolaPortal(slug: string): Promise<EscolaPortal>

// Internas (cadastro; exigem `escolas.editar` via updateSchool/salvarConfigDocumentos)
normalizarSlug(nome: string): string
sugerirSlug(nomeEscola: string): string        // vazio se campo já preenchido (não sobrescreve)
validarSlugUnico(slug: string, schoolId?: string): Promise<{ ok: true } | { ok: false; erro: string }>
SLUGS_RESERVADOS: string[]
```

## Alteradas (`portal.ts` — schoolId opcional, retrocompatível)

```ts
validarVinculoPortal(responsavelId, alunoId, schoolId?: string): Promise<PortalCtx>
// + exige matricula.school_id === schoolId quando informado, senão 'Acesso negado'
getSessaoPortal(responsavelId: string, schoolId?: string): Promise<SessaoPortal>
// + filtra alunos pela escola da matrícula vigente quando informado
```

Todas as demais actions do portal passam a receber `schoolId` do contexto do slug (via `PortalProvider`) e repassam a `validarVinculoPortal`.

## Regras transversais

- `schoolId` nunca vem do cliente fora do slug resolvido server-side no `[slug]/layout`.
- Branding ausente/inválido → fallback silencioso (nunca throw no login).
- Auditoria: flag/slug em `Unidade Escolar/schools`; imagem/texto em `Unidade Escolar/documentos_config` com máscara base64.
