# Research: Visibilidade dos Módulos do Portal do Responsável

**Feature**: specs/040-configurar-visibilidade-portal/spec.md
**Date**: 2026-09-27

## R1 — Onde persistir a visibilidade por módulo

- **Decision**: 6 colunas `BOOLEAN NOT NULL DEFAULT TRUE` em `schools` (`portal_vis_boletim`, `portal_vis_frequencia`, `portal_vis_horarios`, `portal_vis_ocorrencias`, `portal_vis_comunicados`, `portal_vis_documentos`), via migration `supabase-migrations/patch_portal_modulos_visiveis.sql` (aplicada via SQL Editor, sem CLI Supabase — padrão do repo).
- **Rationale**: Segue o precedente da spec 024 (`portal_habilitado`/`portal_slug` como colunas de `schools`); `UPDATE`/`SELECT *` existentes passam a trafegar os campos sem join extra; `DEFAULT TRUE` preserva o comportamento atual para todas as escolas (FR-007, zero regressão); diff campo a campo da auditoria do `updateSchool` passa a incluir as mudanças automaticamente (FR-009).
- **Alternatives considered**:
  - Coluna única JSONB (`portal_modulos JSONB`): rejeitada — exige lógica de merge leitura/escrita, perde tipagem e dificulta o diff da auditoria.
  - Tabela `portal_config` 1:1: rejeitada — join extra sem benefício (mesmo motivo registrado na research da spec 024 para flag/slug).
  - `documentos_config`: rejeitada — guarda identidade visual; visibilidade é atributo operacional da escola como o habilitar/slug.

## R2 — Ponto central de enforcement server-side

- **Decision**: Novo helper `exigirModuloVisivel(schoolId, modulo)` em `src/lib/actions/portal-escola.ts` (lê `schools`, lança `Error('Módulo indisponível no portal desta escola')` quando oculto), chamado em cada action de módulo do portal **após** `validarVinculoPortal`: `getBoletimPortal`, `getFrequenciaPortal`, `getHorariosPortal`, `getOcorrenciasPortal`, `getComunicadosPortal`, `marcarComunicadoLido`, `marcarOcorrenciaLida`, `getMediasInicio` (notas). `getInicioPortal` recebe o mapa e **pula** as consultas dos módulos ocultos (sem vazar nem computar dados). A página Documentos do portal é placeholder "Em breve" sem action — recebe só o guard client-side, com nota de contrato para as futuras actions de emissão chamarem o helper.
- **Rationale**: Todas as actions de leitura do portal já afunilam em `validarVinculoPortal` (`portal.ts:53`), que não conhece o módulo acessado; um helper separado mantém a autorização de vínculo intacta e adiciona a checagem de visibilidade no mesmo padrão (Constituição II — validação server-side autoritativa, sem confiar no frontend). Mensagem distinta de "Acesso negado" permite à UI exibir orientação adequada (PE-402) em vez de estado de erro genérico.
- **Alternatives considered**:
  - Parâmetro `modulo` dentro de `validarVinculoPortal`: rejeitado — poluiria a autorização de vínculo (usada também por termo/sessão) com conceito de apresentação.
  - Só ocultar no menu (sem bloqueio server-side): rejeitado — link direto/favorito continuaria expondo os dados (viola FR-005 e a motivação da feature).

## R3 — Como o portal conhece a visibilidade (client)

- **Decision**: `getEscolaPortal` passa a selecionar as 6 colunas e retornar `modulosVisiveis: Record<ModuloPortal, boolean>`; `EscolaPortalCtx` (portal-provider) ganha o mesmo campo; `[slug]/layout.tsx` repassa ao `PortalProvider`. Sidebar filtra `ITENS` (Início sempre), página Início filtra acesso rápido, páginas de módulo renderizam `EmptyState` (ShieldAlert) quando oculto.
- **Rationale**: O layout por slug já resolve a escola server-side a cada navegação (`[slug]/layout.tsx`), então a visibilidade chega ao client sem nova rodada de fetch e sem expor dados além de 6 flags por escola (mesmo nível de exposição do branding público).
- **Alternatives considered**: Fetch client-side separado de visibilidade — rejeitado (latência + flash de menu antes do filtro).

## R4 — UI de configuração na Unidade Escolar

- **Decision**: 6 `ClickablePill` (componente oficial `src/components/ui/clickable-pill.tsx`, mesmo usado nos filtros de período do Plano de Ensino) em grupo rotulado "Módulos visíveis no portal", visível somente com portal ativo (`portalAtivo`), dentro do card "Portal do Responsável". Campos zod `z.string().optional()` com convenção `'1'`/`'0'` do Censo (Postgres converte `'1'`/`'0'` para boolean, mesmo mecanismo já usado por `portal_habilitado`); default `'1'` para escolas sem valor. Viajam no payload `censo` para `updateSchool` (split `{ documentos, ...censo }` já existente) — zero mudança no submit da página.
- **Rationale**: Reuso integral (Constituição XI, PE-204 — agrupado no card existente, sem tela nova); `updateSchool` já valida `escolas/editar` (FR-008) e já audita diff completo (FR-009); Registro 00 do Censo lê colunas explícitas, novas colunas ignoradas por construção (verificar na implementação, como na spec 024).
- **Alternatives considered**: 6 `PillToggleGroup` Sim/Não — rejeitado (6 grupos empilhados poluem o card; pills multi-select comunicam "quais estão ligados" de relance).

## R5 — Mapa canônico de módulos (chaves estáveis)

- **Decision**: Módulo neutro `src/lib/portal-modulos.ts` (sem `'use server'`, pois Turbopack exige que `'use server'` exporte só async): `MODULOS_PORTAL` (chave, rótulo, ícone), `type ModuloPortal = 'boletim' | 'frequencia' | 'horarios' | 'ocorrencias' | 'comunicados' | 'documentos'`, coluna correspondente por chave, `todosVisiveis()` default. Importado por form, provider, sidebar, actions e migration de seed (nomes de coluna espelhados, sem importar TS no SQL).
- **Rationale**: Uma única fonte para chaves/colunas/rótulos evita divergência entre form, enforcement e UI (precedente: `src/lib/importacao-modelos.ts` na spec 039).

## R6 — Validação e testes disponíveis

- **Decision**: `npx tsc --noEmit` + `npx next build` (verdes) + roteiro manual em `quickstart.md`. O repo não possui runner de testes (`package.json`: só `dev/build/start/lint`).
- **Rationale**: Padrão de verificação adotado nas specs recentes (023/024/039); enforcement é verificável end-to-end via quickstart (menu, acesso rápido, URL direta, isolamento entre escolas).
