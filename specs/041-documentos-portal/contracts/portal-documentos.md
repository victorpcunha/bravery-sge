# Contracts: Documentos no Portal do Responsável

**Feature**: specs/041-documentos-portal/spec.md
**Created**: 2026-09-27

> Todas as actions usam `'use server'` + `getSupabaseAdmin()`, validação server-side
> autoritativa e nunca confiam em dados do cliente (Constituição I/II). Helpers puros
> vivem em módulos neutros (`src/lib/portal-documentos.ts`); só async em módulos
> `'use server'` (exigência do Turbopack).

## 1. Catálogo neutro — `src/lib/portal-documentos.ts`

```ts
type CategoriaDocumentoPortal = 'oficial' | 'manual'
type DocumentoPortalInfo = { id: string; titulo: string; categoria: CategoriaDocumentoPortal }

DOCUMENTOS_PORTAL: readonly DocumentoPortalInfo[]  // 4 oficiais; manual vazio (R7)
todosLiberados(): Record<string, boolean>           // { declaracao: true, ficha: true, ... }
normalizarDocumentosLiberados(linhas: Array<{ documento_id: string; liberado: boolean }> | null): Record<string, boolean>
  // Ausência de linha ou lista nula (migration não aplicada) = liberado (opt-out)
```

## 2. Config por escola — `src/lib/actions/portal-documentos.ts`

```ts
getDocumentosLiberados(schoolId: string): Promise<Record<string, boolean>>
  // Leitura normalizada (para o form da escola e para a galeria do portal).
  // Requer escopo de escola válido; sem schoolId retorna todos liberados.

salvarDocumentosPortal(
  schoolId: string,
  liberados: Record<string, boolean>,   // mapa completo id → liberado
  pessoaId?: string | null
): Promise<{ ok: true }>
  // - validarPermissaoEstrita(pessoaId, 'escolas', 'editar') (FR-011)
  // - Rejeita ids fora do catálogo (FR-009: só o que existe no catálogo persiste)
  // - Upsert das linhas (school_id, documento_id, liberado)
  // - registrarAuditoria: módulo 'Portal — Documentos', entidade
  //   'escola_portal_documentos', acao 'editar', anterior → novo (FR-010)
```

## 3. Enforcement — `src/lib/actions/portal-escola.ts` (acréscimo)

```ts
exigirDocumentoLiberado(schoolId: string, documentoId: string): Promise<void>
  // Chamado APÓS validarVinculoPortal + exigirModuloVisivel('documentos').
  // Lança Error('Documento indisponível no portal desta escola') se liberado === false.
  // Ausência de linha = liberado. Erro distinto de 'Acesso negado' (PE-402).
```

`getEscolaPortal` passa a retornar também `documentosLiberados: Record<string, boolean>`,
repassado ao `EscolaPortalCtx` (sidebar/Início/página consomem sem nova query).

## 4. Geração no portal — `src/lib/actions/portal.ts` (acréscimos)

```ts
listarDocumentosDisponiveisPortal(
  responsavelId: string, alunoId: string, schoolId?: string
): Promise<Array<{ id: string; titulo: string; categoria: 'oficial' | 'manual' }>>
  // validarVinculoPortal + exigirModuloVisivel('documentos') + interseção
  // catálogo × liberação. Manual só aparece se houver modelos (R7: hoje, nunca).

getDadosDeclaracaoPortal(responsavelId, alunoId, schoolId?): Promise<DadosDeclaracaoMatricula>
getDadosFichaPortal(responsavelId, alunoId, schoolId?): Promise<DadosFichaIndividual>
getDadosBoletimPortal(responsavelId, alunoId, periodoOrdem?, schoolId?): Promise<DadosBoletim>
getPeriodosBoletimPortal(responsavelId, alunoId, schoolId?): Promise<{ periodos; bloqueado; motivo }>
getDadosHistoricoPortal(responsavelId, alunoId, schoolId?): Promise<DadosHistoricoEscolar>
  // Todos: ctx = validarVinculoPortal(...) → exigirModuloVisivel(ctx.schoolId, 'documentos')
  // → exigirDocumentoLiberado(ctx.schoolId, '<id>') → delegam ao motor com
  // (alunoId, ctx.anoLetivoId, ctx.schoolId, undefined, periodo?) — pessoaId undefined
  // pula a permissão interna (padrão portal.ts). schoolId do slug é confrontado
  // com ctx.schoolId (cross-escola nega). Regras de aplicabilidade (ex.: bloqueio
  // do Boletim) e mensagens vêm do motor, adaptadas ao responsável (FR-008).
```

## 5. UI — `DocumentoGerador` (extensão compatível)

```ts
// Props novas, todas opcionais (retrocompatível com o módulo interno):
alunoFixo?: { id: string; nome_completo: string; turma_nome?: string | null } | null
anoLetivoFixo?: string | null
geracaoDireta?: boolean
// Quando presentes: ocultam selects de ano/aluno e a busca; buscarDados usa os
// ids fixos; troca de aluno no PortalProvider recria o fluxo (FR-005).
// Com geracaoDireta: sem pré-visualização e sem edição de assinatura (vale a
// padrão da escola); ao carregar os dados, gera o PDF e dispara o download
// automaticamente, exibindo confirmação + "Baixar PDF" para repetir.
```

Página `portal/[slug]/aluno/documentos/page.tsx`: mantém o gate do módulo (`ModuloBloqueado`);
sem documentos disponíveis → `EmptyState` orientativo + "procure a secretaria" (FR-007);
com disponíveis → galeria (padrão Minicard de `oficiais-tab.tsx`) + geração (FR-003/FR-004).
