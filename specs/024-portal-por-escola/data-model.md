# Data Model: Portal por Escola

**Feature**: `024-portal-por-escola` | **Date**: 2026-09-08

## Alterações (2 migrations)

### `schools` — habilitação + slug (+2 colunas)

Migration `patch_portal_escolas.sql`. Fora do payload do Censo (Registro 00 lê colunas explícitas).

| Campo | Tipo | Regras |
|---|---|---|
| `portal_habilitado` | BOOLEAN NOT NULL DEFAULT FALSE | Pill Sim/Não; gate do slug (FR-001/FR-006) |
| `portal_slug` | VARCHAR(60) UNIQUE NULL | Sugerido do nome, editável, normalizado, único, não-reservado (FR-002/FR-004); NULL = sem link |

### `documentos_config` — identidade do login (+2 colunas, grupo `portal`)

Migration `patch_portal_login_brand.sql`. Auditoria com máscara base64 (estende `semLogo`).

| Campo | Tipo | Regras |
|---|---|---|
| `portal_imagem_fundo` | TEXT NULL | base64 `data:image/*` ≤2 MB (mesmo padrão do logo); inválido/ausente → fallback |
| `portal_texto_login` | TEXT NULL | Texto informativo da escola no login (FR-008) |

Reuso (sem alteração): `nome_fantasia`, `logo`.

## Entidades lógicas (sem tabela)

- **Contexto de escola do portal**: `slug` (URL, normalizado) → `{ schoolId, habilitado, branding }`; `schoolId` governa seleção, actions e gates (R4).
- **Slug reservado**: `login, logout, termo, aluno, selecionar-aluno, documentos, api, portal, _next, favicon.ico` — nunca atribuível; cai em orientação.
- **Página de orientação/indisponível**: mesma view, duas variantes (slug desconhecido/reservado → orientação; escola desabilitada → indisponível; texto único, sem revelar o caso).

## Validações e transições

- Normalizar: minúsculas → NFD sem acentos → espaços `_`→`-` → remove `[^a-z0-9-]` → colapsa hífens → trim `-` → slice 60. Vazio após normalizar = inválido.
- Unicidade server-side (`portal_slug`), case-insensitive na prática (tudo minúsculo); conflito → "este link já está em uso".
- Habilitar exige slug válido; desabilitar mantém o slug (re-habilitar reativa o mesmo link); trocar slug invalida o antigo (alerta no cadastro).
- Desabilitar com sessões ativas: próximo guard/action daquela escola nega (stateless por chamada).
