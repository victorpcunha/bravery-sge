# Research: Portal por Escola

**Feature**: `024-portal-por-escola` | **Date**: 2026-09-08

## R1 — Roteamento: segmento dinâmico `[slug]`, genéricas viram orientação

- **Decision**: Mover `src/app/portal/*` → `src/app/portal/[slug]/*` (novo `layout.tsx` no nível `[slug]`); apagar as páginas genéricas. Qualquer acesso sem slug válido (`/portal/login` antigo, `/portal/aluno`, slug desconhecido ou reservado) cai no `[slug]` com slug não-escola → página neutra de orientação (sem formulário, sem dados). Slug de escola desabilitada → página "portal indisponível" (mesmo componente, variante sem revelar o motivo — LGPD).
- **Rationale**: Grupo `(portal)` já foi descartado na 023 (colisão `/login`); segmento real `[slug]` dá URLs `/portal/bravery/login` com um único codebase. Slugs reservados (`login`, `termo`, `aluno`, `selecionar-aluno`, `documentos`, `api`) nunca podem ser slug de escola (FR-004), então nunca há ambiguidade entre rota e slug.
- **Alternatives considered**: (a) Catch-all `[...resto]` + `[slug]` irmãos — rejeitado: segmentos dinâmicos distintos no mesmo nível conflitam no Next. (b) Manter `/portal/*` genérico funcional — rejeitado pelo usuário (decisão: só slug funciona; genérica não tem como definir escola/branding/escopo).

## R2 — Resolução da escola: action pública mínima + gate

- **Decision**: Nova action `getEscolaPortal(slug: string)` em `src/lib/actions/portal-escola.ts`: normaliza (minúsculas/trim) → `schools.select(id, nome_escola, portal_habilitado, portal_slug).eq(portal_slug)` + `documentos_config` (nome_fantasia, logo, portal_imagem_fundo, portal_texto_login). Retorna `{ ok, schoolId?, branding? }`; nunca vaza dados além do branding. `[slug]/layout.tsx` (server) resolve antes do provider: escola inexistente/desabilitada → variante indisponível/orientação sem montar sessão.
- **Rationale**: Branding do login precisa ser público (pré-auth); todo o resto continua atrás da sessão + vínculo (spec 023).
- **Alternatives considered**: Middleware de slug — rejeitado (projeto não usa middleware; guards client-side são o padrão).

## R3 — Config no cadastro: molde spec 018 + split de persistência

- **Decision**: Card "Portal do Responsável" na aba Identificação do `EscolaForm` (`src/components/censo/escola-form.tsx`, mesmo ponto do card de Documentos ~L2095): `PillToggleGroup` Sim/Não (`portal_habilitado`) + Input slug (só visível com Sim) + preview da URL + alerta de troca de slug. Persistência em dois alvos no submit (`escolas/[id]/page.tsx:106-109`, padrão vigente `const { documentos, ...censo } = data`): `portal_habilitado`/`portal_slug` são colunas de `schools` → viajam no `updateSchool` (adicionar ao tipo `School` em `schools.ts:8`); imagem/texto vão no grupo `documentos` → `salvarConfigDocumentos` (estender payload + tipo `ConfigDocumentos`). Registro 00 do Censo lê colunas explícitas — novas colunas são ignoradas por construção (verificar na implementação).
- **Rationale**: Reuso total do fluxo existente (fieldset `readOnly`, auditoria módulo `Unidade Escolar`, permissão `escolas.editar` via `validarPermissaoEstrita`).
- **Alternatives considered**: Tabela `portal_config` separada — rejeitado (flag/slug são atributos 1:1 da escola; join extra sem benefício; documentos_config já é o lugar da identidade visual).

## R4 — Escopo por escola nas actions (defesa em profundidade)

- **Decision**: `validarVinculoPortal(responsavelId, alunoId, schoolId?)` passa a exigir `matricula.school_id === schoolId` quando informado; `getSessaoPortal(responsavelId, schoolId?)` filtra vínculos pela escola (matrícula vigente de cada aluno). `PortalProvider` recebe a escola do `[slug]/layout` e repassa `schoolId` em todas as chamadas; páginas/actions nunca aceitam `schoolId` do cliente fora do contexto do slug.
- **Rationale**: Slug sozinho governa branding; vínculo + escola governam dados (Constituição III; SC-003).
- **Alternatives considered**: Confiar só no filtro client da seleção — rejeitado (Constituição II; URL direta/action direta vazariam).

## R5 — Slug: normalização, unicidade, reservados

- **Decision**: Normalização `nome → slug`: minúsculas, sem acentos (NFD), espaços→hífen, remove inválidos, colapsa hífens, limite 60 chars; sugestão só preenche se o campo estiver vazio (não sobrescreve edição manual). Unicidade: `UNIQUE` no banco + checagem server-side com mensagem "este link já está em uso". Reservados: `login`, `logout`, `termo`, `aluno`, `selecionar-aluno`, `documentos`, `api`, `portal`, `_next`, `favicon.ico`.
- **Alternatives considered**: Slug travado após criação — rejeitado pelo usuário (auto + editável, com alerta de invalidação do link antigo).

## R6 — Branding do login: fallback total, peso limitado

- **Decision**: Login lê branding via R2; cada item ausente/inválido cai no padrão atual (imagem quebrada nunca quebra o layout — fundo com `onError` oculto / CSS condicional). `portal_imagem_fundo` base64 TEXT ≤2 MB (mesmo teto do logo, `FileReader`, padrão 018) + máscara na auditoria (estender `semLogo` em `documentos-config.ts:55`). Render: `<img>`/CSS `background-image` com data URI (padrão web; react-pdf `<Image>` não se aplica aqui).
- **Alternatives considered**: Upload para Storage — rejeitado (projeto não usa Storage; base64 no banco é o padrão vigente do logo).
