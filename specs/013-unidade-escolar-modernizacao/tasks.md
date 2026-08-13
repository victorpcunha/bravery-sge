# Tasks — Unidade Escolar (acesso por perfil + proteção + modernização)

> Executado em sessão única (2026-08-12). Fases concluídas após `npx next build` verde.

## Phase 1 — Server actions
- [x] `validarPermissaoEstrita(pessoaId, recurso, acao)` em `src/lib/actions/perfis.ts`
- [x] `getSchoolsEscopadas(ids: string[] | null)` em `schools.ts` (removida `getSchools`)
- [x] `getSchool(id, opts?: { pessoaId, escolaDoUsuario })` — própria unidade sem exige permissão
- [x] `createSchool(school, pessoaId?)`, `updateSchool(id, school, pessoaId?)`, `deleteSchool(id, pessoaId?)` com `validarPermissaoEstrita` ('criar'/'editar'/'excluir')

## Phase 2 — Sidebar
- [x] Link direto da escola rotulado "Unidade Escolar" (antes "Escola")

## Phase 3 — Listagem `/escolas`
- [x] Convertido para client component (`useAuth` + `usePermissoes`)
- [x] Escopo: `getSchoolsEscopadas(null)` p/ superadmin; `.in(ids)` p/ usuário vinculado
- [x] `PageSection compact "Filtros"` + `FilterBar`: busca nome/INEP + Selects situação/dependência/localização
- [x] Cards ricos (nome, StatusBadge situação, INEP, tipo, local, telefone, e-mail) + `<Pagination>` 10/pág
- [x] Empty states contextuais (filtros vs sem cadastros; CTA "Cadastrar Primeira Escola" condicional a `podeCriar`)
- [x] Estado "Nenhuma escola vinculada" p/ não-superadmin sem vínculo
- [x] "Nova Escola" no PageHeader condicional a `pode.criar('escolas')`

## Phase 4 — Tela da unidade `/escolas/[id]`
- [x] `foraDeEscopo` (escola de outro vínculo) → `EmptyState` ShieldAlert
- [x] `podeEditar = !foraDeEscopo && !isSetup && pode.editar('escolas')`; `podeExcluir` análogo
- [x] Banner warning "Visualização somente" quando sem `podeEditar`
- [x] `<EscolaForm readOnly>` + `title=""`
- [x] Breadcrumbs só para superadmin; título = nome da escola
- [x] Excluir com `ConfirmDialog` (só com `podeExcluir`); loading spinner oficial

## Phase 5 — Criação `/escolas/novo`
- [x] Guard `podeCriar = !isSetup && pode.criar('escolas')`; negado → ShieldAlert
- [x] `createSchool({ ...tipo_registro: '00' }, pessoaId)`

## Phase 6 — Form `escola-form.tsx`
- [x] Prop `readOnly` (default false)
- [x] `<fieldset disabled className="contents">` envolvendo os `TabsContent` (tabs continuam clicáveis)
- [x] Footer sticky bottom (`border-t`, `bg-background/95 backdrop-blur`): `h-11`; read-only mostra "Voltar" e esconde Salvar
- [x] Tabs modernizadas: `TabsList` `bg-card border shadow-xs`, `TabsTrigger` `h-10` inativa `text-foreground/80`, ativa `bg-primary text-primary-foreground`

## Phase 7 — Verificação
- [x] `npx next build` verde (compile ~10s, TS ~17.5s)
- [ ] Validação visual manual: lista (filtros/paginação), unidade em edição, unidade em read-only, criação negada