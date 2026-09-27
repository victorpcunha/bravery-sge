# Contract: Visibilidade dos Módulos do Portal

**Feature**: specs/040-configurar-visibilidade-portal/spec.md
**Date**: 2026-09-27

## Chaves de módulo (estáveis, espelham `src/lib/portal-modulos.ts`)

`boletim | frequencia | horarios | ocorrencias | comunicados | documentos`

Rotas governadas: `/portal/[slug]/aluno/{boletim,frequencia,horarios,ocorrencias,comunicados,documentos}`. `Início` (`/portal/[slug]/aluno`) nunca é oculto.

## Server

### `exigirModuloVisivel(schoolId: string, modulo: ModuloPortal): Promise<void>`

- Local: `src/lib/actions/portal-escola.ts`.
- Comportamento: lê as 6 flags de `schools`; se a flag do módulo for `false`, lança `Error('Módulo indisponível no portal desta escola')`; caso contrário resolve.
- Chamadores obrigatórios (após `validarVinculoPortal`): `getBoletimPortal`, `getFrequenciaPortal`, `getHorariosPortal`, `getOcorrenciasPortal`, `getComunicadosPortal`, `marcarComunicadoLido`, `marcarOcorrenciaLida`, `getMediasInicio`.
- `getInicioPortal`: em vez de lançar, recebe o mapa e **omite** seções de módulos ocultos (consultas puladas; arrays vazios/zeros no retorno, shape inalterado).
- **Futuro**: qualquer nova action de emissão de documentos no portal (`documentos.ts`) MUST chamar `exigirModuloVisivel(schoolId, 'documentos')` antes de ler dados (a página atual é placeholder sem action).

### `getEscolaPortal(slug)` (estendido)

- Retorno ganha `modulosVisiveis: Record<ModuloPortal, boolean>` (default tudo `true` quando coluna ausente, defesa contra migration não aplicada).

## Client (`EscolaPortalCtx`)

- Campo novo: `modulosVisiveis: Record<ModuloPortal, boolean>` (repasse em `[slug]/layout.tsx`).
- Sidebar: renderiza `Início` + itens com flag `true`.
- Início: acesso rápido filtrado; `InicioCards` recebe o mapa e omite blocos/`Ver Todos` de módulos ocultos.
- Páginas de módulo: quando oculto, renderizam `EmptyState` (`ShieldAlert`, título "Módulo indisponível", descrição "A escola optou por não exibir {rótulo} no portal. Procure a secretaria.") em vez de chamar a action.

## Configuração (Unidade Escolar)

- Card "Portal do Responsável": grupo "Módulos visíveis no portal" com 6 `ClickablePill` (visível só com portal ativo); valores `'1'`/`'0'` no form → boolean via Postgres no `updateSchool`.
- Permissão: edição exige `escolas/editar` (via `updateSchool`); leitura segue regra do card. Auditoria automática (módulo `Unidade Escolar`).
