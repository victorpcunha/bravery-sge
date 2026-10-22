# Research: Gestão de Faturamento

**Feature**: `043-gestao-faturamento` | **Date**: 2026-09-29

Todas as decisões abaixo foram verificadas contra o código existente (paths com linha).

## R1 — Onde mora o novo módulo (rota, sidebar, abas)

- **Decision**: Módulo top-level próprio `Faturamento` com 3 sub-rotas (`/faturamento`, `/faturamento/cobrancas`, `/faturamento/configuracao`), 1 entrada em `TAB_MODULES` (`faturamento`), 3 entradas em `ROUTES` com o mesmo `module`.
- **Rationale**: A spec exige navegação própria separada de Escolas. O padrão do repo para módulo multi-rota é N entradas em `ROUTES` com o mesmo `module` (ex. `escolas`: `/escolas`, `/escolas/novo`, `/escolas/:id` em `src/lib/tab-routes.tsx:205-214`; `matriculas` em `:268-273`). Sidebar suporta módulo com submenu (`src/components/layout/sidebar.tsx:53-59`), como Gestão Acadêmica com 6 itens (`:107-119`). Estáticas sempre antes das dinâmicas (`tab-routes.tsx:204`).
- **Alternatives considered**: Submenu de Escolas (rejeitado — a spec §3 veda subordinação); 3 módulos de aba separados (rejeitado — viola a regra "1 aba por módulo", máx. 6 abas em `tab-routes.tsx:132-133`).

## R2 — Recursos de permissão e auto-grant

- **Decision**: 3 recursos novos — `faturamento.visao-geral`, `faturamento.cobrancas`, `faturamento.configuracao` — seed em `patch_recursos_faturamento.sql` com auto-grant a partir de `gestao-academica.matriculas` (quem opera matrícula opera faturamento).
- **Rationale**: Convenção `modulo.recurso` (constitution). Padrão de seed + auto-grant verificado em `supabase-migrations/patch_recursos_matriculas_sub.sql:1-14` (INSERT com `ON CONFLICT DO NOTHING` + cópia de flags do recurso-base via `CROSS JOIN`, já reutilizado em ~9 patches). Visibilidade no sidebar via `recurso` por subitem (`sidebar.tsx:200-204,230-237`); módulo some se todos os subitens forem filtrados (`:261`).
- **Alternatives considered**: Recurso único `faturamento` (rejeitado — configuração merece gate próprio, como `fechamento.fechar/desfazer`); sem auto-grant (rejeitado — travaria todos os perfis existentes até reconfiguração manual).

## R3 — Padrão de operação em massa (revisão → confirmação → resumo)

- **Decision**: Reutilizar o padrão de `rematricularLote` (`src/lib/actions/rematriculas.ts:113-257`): input com `itens[]`, pré-carregamento de mapas, loop com `continue` para já-configurados, coleta de `falhas[]` com `{motivo, proximoPasso}`, retorno `{criados, falhas, jaConfigurados}`. A geração de planos roda em duas actions: `simularGeracao` (só leitura, alimenta a tela de revisão) e `gerarPlanosEmMassa` (escrita).
- **Rationale**: É o único precedente de lote no domínio acadêmico; já resolve idempotência (reenvio/duplo clique) e relatório de exceções exigidos pela spec (§§7–8).
- **Alternatives considered**: Geração direta sem simulação (rejeitado — spec §7 exige revisão prévia com contagens e valor total).

## R4 — Auditoria de operações financeiras

- **Decision**: Planos individuais via `registrarAuditoria` (entidade `faturamento_planos`, módulo `Faturamento`, ações criar/editar); geração/baixa em massa via `registrarAuditoriaAgregada` com `resumo` estendido (quantidades + valor total).
- **Rationale**: Assinaturas verificadas em `src/lib/auditoria.ts:166,197`; `DadosAuditoriaAgregada` aceita chaves extras em `resumo` (`ResumoAuditoria{..., [key]:unknown}` em `:19-26`); agregada para alto volume é o padrão do repo (Frequência/Notas). Constitution VIII lista "alterações financeiras" como auditáveis.
- **Alternatives considered**: Um registro por mensalidade (rejeitado — 387 matrículas × 12 parcelas = ~4,6k linhas por operação).

## R5 — Vínculo do responsável financeiro

- **Decision**: `faturamento_planos.responsavel_id → people.id` (SET NULL), resolvido a partir de `responsavel_alunos` (colunas verificadas em `supabase-migrations/usuarios_completo.sql:26-38`, com `UNIQUE(responsavel_id,aluno_id)` e flag `principal`). Um único responsável por plano (clarificação A3); default = vínculo `principal=true`, sobrescrevível.
- **Rationale**: Reutiliza relacionamento existente (spec §21, FR-018); sem nova entidade de pessoa.
- **Alternatives considered**: Nova tabela de pagadores (rejeitado pela spec); múltiplos responsáveis com rateio (rejeitado na clarificação — fora do MVP).

## R6 — Integração com a saída do aluno (movimentações)

- **Decision**: Não alterar `salvarMovimentacoes` (`src/lib/actions/matriculas.ts`); a action `tratarSaidaMatricula` do faturamento é chamada pelo diálogo de movimentações (checkbox "cancelar futuras não pagas", marcado por padrão — clarificação C2). Mensalidades futuras não pagas → `cancelado`; pagas/isentas intocadas.
- **Rationale**: Preserva a regra acadêmica existente; o financeiro reage ao evento sem acoplamento reverso. `data_saida` já é mantida por `salvarMovimentacoes`.
- **Alternatives considered**: Trigger no banco (rejeitado — regra com confirmação do usuário não pertence a trigger); cancelamento automático silencioso (rejeitado na clarificação).

## R7 — Ano letivo e competência

- **Decision**: `academico_anos_letivos` tem `data_inicio/data_termino/status` (`academico_calendarios_escolares.sql:10-22`); competência = 1º dia do mês (DATE), vencimento = `min(dia_vencimento, último dia do mês)` calculado em módulo neutro puro (`src/lib/faturamento-calculo.ts`, sem `'use server'` — Turbopack exige só async em actions, cf. AGENTS.md spec 039).
- **Rationale**: "Vencida" derivada (pendente + vencimento < hoje) evita coluna redundante (spec §11); mês final default = mês de `data_termino`; mês inicial default = mês de `data_matricula`.
- **Alternatives considered**: Coluna `vencida` armazenada + job de atualização (rejeitado — risco de inconsistência apontado na spec).

## R8 — Reserva para integração externa

- **Decision**: Colunas `asaas_customer_id` (planos) e `asaas_payment_id UNIQUE / asaas_status / invoice_url / sincronizado_em` (mensalidades), todas NULL no MVP, nunca exibidas (FR-024).
- **Rationale**: Spec §23 exige campos separados sem expor provedor; `externalReference` futuro = `faturamento_mensalidades.id`.
