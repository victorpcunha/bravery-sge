# Research: Tela de Rematrículas

**Feature**: `035-rematriculas` | **Date**: 2026-09-16

Phase 0 — todas as decisões abaixo foram resolvidas por leitura direta do código. Não restam NEEDS CLARIFICATION.

## R-01 — Criação em lote reutiliza `createMatricula` por aluno

- **Decision**: A nova action `rematricularLote` itera sobre os alunos selecionados chamando `createMatricula(data, pessoaId)` existente (`src/lib/actions/matriculas.ts:238-321`), capturando erros por aluno para retorno parcial. Nenhuma regra de matrícula é duplicada.
- **Rationale**: O próprio comentário da Regra Geral (`matriculas.ts:139-145`) declara que ela "vale para TODA criação (Nova Matrícula, Rematrículas e qualquer fluxo futuro)". Reutilizar garante `codigo_matricula` sequencial por escola, auditoria (`registrarMatricula`, módulo 'Alunos Matriculados') e validação de duplicidade Curricular + conflito turno/dias sem divergência futura.
- **Alternatives considered**: Replicar a validação no batch (rejeitado — divergência garantida); insert direto em `academico_matriculas` (rejeitado — perderia código sequencial e auditoria).

## R-02 — Recurso de permissão dedicado `gestao-academica.rematriculas`

- **Decision**: Novo recurso `gestao-academica.rematriculas` (módulo Gestão Acadêmica), seed via migration `patch_recursos_rematriculas.sql` (precedentes: `patch_recursos_documentos.sql`, `patch_recurso_painel_aluno.sql`). Tela exige `visualizar`; salvamento exige `criar` validado server-side via `validarPermissaoServer` dentro de `rematricularLote`.
- **Rationale**: `createMatricula`/`updateMatricula` não validam permissão server-side (só `deleteMatricula` e `salvarMovimentacoes` validam) — a permissão é aplicada na página + deve ser aplicada no batch. Recurso dedicado segue o padrão granular (`.movimentacoes`, `rendimento`, `portal.comunicados`) em vez de sobrecarregar `gestao-academica.matriculas`.
- **Alternatives considered**: Reutilizar `gestao-academica.matriculas/criar` (rejeitado — gestores que podem matricular individualmente nem sempre devem executar lotes entre anos).

## R-03 — Fonte da Situação e filtro Aprovado/Reprovado

- **Decision**: Situação = coluna `situacao` de `academico_matriculas` no ano de origem. Filtro oferece os 5 valores de resultado final (`src/lib/situacoes-matricula.ts`, família de `SITUACOES_RESULTADO_FINAL:50-57`): `Aprovado`, `Aprovado por conselho de classe`, `Aprovado concluinte`, `Reprovado`, `Reprovado por frequência`. `Sem movimentação`, `Transferido`, `Desistente`, `Óbito` ficam de fora.
- **Rationale**: Catálogo canônico já existe com helpers (`isSituacaoFinal`); semântica idêntica à Situação Final do Censo (spec 015).
- **Alternatives considered**: Derivar situação de notas/fechamento em tempo real (rejeitado — rematrícula opera sobre o resultado oficial já registrado).

## R-04 — Resolução dos anos de origem e destino

- **Decision**: `getAnosLetivos(schoolId)` (`calendarios.ts:89-100`) + filtro client-side por `status` (`AnoLetivo.status: 'ativo' | 'planejamento' | 'encerrado'`, `calendarios.ts:8-17`). Origem = encerrado mais recente; destino = `status === 'ativo'` (mais recente se múltiplos). Sem ano válido → fluxo bloqueado com EmptyState orientativo.
- **Rationale**: Não existe action "último encerrado"; compor sobre a listagem existente evita nova query especializada. `getAnosLetivosAtivos` (`quadro-aulas.ts:801-812`) não filtra status apesar do nome — não usar.
- **Alternatives considered**: Nova RPC SQL (rejeitado — volume pequeno, filtro client-side é suficiente).

## R-05 — Etapas e turmas usam actions existentes

- **Decision**: Etapas via `getEtapasEnsino(schoolId, anoLetivoId)` (`etapas-ensino.ts:50-75`, já filtra `ativa=true`); turmas via `getTurmasAtivas(schoolId, anoLetivoId)` (`matriculas.ts:568-581`, variante do fluxo de matrícula) com filtro client por etapa; etapa de cada turma resolvida via `getEtapasDaTurma` quando necessário.
- **Rationale**: São exatamente as actions do fluxo de Nova Matrícula — mesma semântica, zero código novo de leitura.
- **Alternatives considered**: `getTurmas` genérico de admin (rejeitado — traz inativas e colunas desnecessárias).

## R-06 — Consistência Situação × Etapa: filtrar no client, revalidar no server

- **Decision**: Client impede a combinação inválida filtrando opções (Aprovado → exclui etapa de origem da lista de destino; Reprovado → trava destino na etapa de origem) com mensagem explicativa. `rematricularLote` revalida a mesma regra server-side por aluno e rejeita o item com motivo (Constitution: validação server-side é autoritativa).
- **Rationale**: UX preventiva + segurança autoritativa; nenhuma lógica nova de domínio, só aplicação da regra da spec.
- **Alternatives considered**: Validar só no server (rejeitado — erro operacional só seria descoberto após selecionar dezenas de alunos).

## R-07 — Estrutura de tela: padrão Rendimento (page fina + client component)

- **Decision**: `src/app/(app)/gestao-academica/rematriculas/page.tsx` fina (15 linhas, padrão `rendimento/page.tsx:7-14`) + `src/components/rematriculas/rematriculas-client.tsx` com toda a lógica. Registro no tab-system nos 4 pontos (`TAB_MODULES`, `MODULES`, `ROUTES` com `exact()`, import) seguindo o entry single-page do rendimento (`tab-routes.tsx:310-314`); item de submenu em `sidebar.tsx:106-117` com `recurso: 'gestao-academica.rematriculas'`.
- **Rationale**: Tela de trabalho única, sem sub-rotas de cadastro/edição — o padrão `matriculas/cadastro/content.tsx` (split server/client para SearchParams) é desnecessário.
- **Alternatives considered**: Layout lista + cadastro separado (rejeitado — não há entidade "rematrícula" persistida para editar).

## R-08 — Alunos já matriculados no destino

- **Decision**: A action de listagem (`listarAlunosElegiveis`) cruza com matrículas ativas do ano de destino e exclui os já matriculados, retornando a contagem para aviso ("N já possuem matrícula no novo ano"). `rematricularLote` re-checa por aluno (condição de corrida / duplo clique).
- **Rationale**: Evita duplicidade antes mesmo da Regra Geral; contagem visível explica "alunos sumidos" da lista.
- **Alternatives considered**: Mostrar desabilitados com badge (rejeitado — polui a lista; o aviso com contagem comunica o mesmo com menos complexidade).

## R-09 — Auditoria via `createMatricula` (sem auditoria própria de lote)

- **Decision**: Cada matrícula criada gera seu registro individual (`registrarMatricula`, módulo 'Alunos Matriculados', `matriculas.ts:314-319`) com `pessoaId` repassado pelo batch. Nenhum registro agregado adicional.
- **Rationale**: Rastreabilidade por aluno (responsável, escola, data/hora, vínculo de origem via `observacoes` ou payload) já atende Constitution VIII; registro agregado duplicaria informação.
- **Alternatives considered**: Registro `resumo` de lote estilo Diário (rejeitado — volume baixo, ~40/lote, e o individual já existe de graça).

## R-10 — Responsivo: tabela em `md+`, cards em `<md`

- **Decision**: Mesmo padrão de `matriculas/page.tsx:191-235` (`<ul>` cards `block md:hidden` + `<Table>` `hidden md:block`), checkbox com área de toque ≥ 44px, subcards Origem/Destino empilhados em mobile.
- **Rationale**: Padrão consagrado nas specs 007/008; atende PE-601/PE-602 e SC-006 (360px sem rolagem horizontal).
- **Alternatives considered**: Tabela com scroll horizontal em mobile (rejeitado — viola SC-006 e Regra #5 do projeto).

## R-11 — Superadmin: fórmula `escolaOperacional`

- **Decision**: Reutilizar verbatim `const escolaOperacional = isSuperAdmin ? (escolaId || null) : schoolId` + auto-seleção quando `allSchools.length === 1` (padrão `rendimento-page-client.tsx:35-53`, variante Documentos com `PageSection(compact, title="Unidade Escolar")`).
- **Rationale**: Três precedentes idênticos; `useAuth()` já fornece `schoolId, isSuperAdmin, allSchools, pessoaId, loading`.
- **Alternatives considered**: Nenhuma — padrão estabelecido.
