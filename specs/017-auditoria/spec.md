# Spec: Auditoria — Captura automática + Tela de Consulta (Superadmin)

**Data**: 2026-09-04 | **Status**: Implementada

## Objetivo

Registrar automaticamente todas as alterações (criação, edição e exclusão) realizadas em
qualquer tela do sistema — em todas as escolas — e disponibilizar uma tela de consulta
**exclusiva do perfil Superadmin** (`/auditoria`).

## 1. Modelo de cobertura

### 1.1 Cobertura completa (Master-Data)

Registro **individual** por operação, com diff campo a campo
(`valor anterior`/`valor novo`) em telas de cadastro/estrutura:

| Módulo/Tela | Ações |
|---|---|
| Usuários | criar/editar/excluir pessoa, situação (inativar/reativar), responsáveis, saúde, auth user |
| Turmas | criar/editar/excluir/ativar turma, profissionais da turma |
| Unidade Escolar | criar/editar/excluir escola |
| Alunos Matriculados | criar/editar matrícula, dispensas |
| Movimentações de Alunos | criar/editar/excluir movimentação |
| Quadro de Aulas | criar/editar/excluir/ativar quadro |
| Indicadores de Avaliação | CRUD indicador, níveis, importação da matriz (1 registro agregado) |
| Disciplinas | criar/editar/ativar/excluir |
| Métodos de Avaliação | criar/editar/excluir método |
| Matrizes Curriculares | CRUD matriz, períodos, disciplinas, habilidades, replicação |
| Estrutura Acadêmica (Calendários) | anos letivos, calendários, eventos |
| Estrutura Acadêmica (Etapas) | etapas e subetapas |
| Funções | criar/editar/excluir + funções padrão (1 agregado) |
| Plano de Ensino | planos de ensino, planos de aula, aplicação no diário |
| Perfis e Permissões | perfis e permissões (já auditados → migrados) |
| Vínculos Profissionais | criar/editar/excluir vínculo |
| Agenda | criar/excluir compromisso |
| Histórico Escolar | histórico manual do aluno |

### 1.2 Cobertura por resumo agregado (alto volume)

**Um único registro por salvamento** (sem diff campo a campo), contendo profissional,
data/hora, módulo/tela, turma, disciplina, período e **quantidade de alunos afetados**:

| Módulo/Tela | Ações |
|---|---|
| Diário de Classe — Frequência | frequência por dia/aula, gerar número de chamada |
| Diário de Classe — Notas | salvar nota, recuperação, limpar notas |
| Diário de Classe — Avaliações por Indicadores | avaliar indicador |
| Diário de Classe — Parecer | salvar parecer |
| Conselho de Classe | salvar nota do conselho, alternar aprovação |
| Fechamento de Turma | fechar/desfazer fechamento (mantém snapshot dos resultados) |

> Nota de granularidade: as ações de alto volume são invocadas pelo cliente aluno a aluno;
> cada chamada emite um registro agregado com código-fonte (`resumo.quantidade` reflete
> o nº de registros afetados na chamada; 1 nas chamadas unitárias).

## 2. Tabela de dados

Nova tabela `auditoria` (ver `data-model.md`), com `modulo`, `entidade`, `entidade_id`,
`registro_nome`, `acao`, `dados_anteriores/nos/alteracoes/resumo` JSONB, `pessoa_id`,
`school_id`, `created_at`. Índices: escola, pessoa, módulo, ação, `created_at DESC` e
trigram de `registro_nome` (busca livre).

Os registros existentes de `perfis_auditoria` são **migrados** (backfill) para a nova
tabela; o código novo grava apenas em `auditoria`.

## 3. Tela de consulta (`/auditoria`)

- Exclusiva Superadmin (guard no cliente + `validarSuperAdmin` server-side).
- **Card de filtros**: Busca em destaque (nome/identificação do registro + conteúdo JSONB),
  Escola ("Todas as Escolas"/lista), Usuário (profissionais da escola selecionada),
  Módulo/Tela, Tipo de Ação (Criação/Edição/Exclusão/Todas), Data inicial/final.
- **Tabela**: Data/Hora, Usuário, Escola, Módulo/Tela, Registro afetado, Tipo de Ação
  (badge colorido). Linha expansível com detalhes:
  - **Edição**: tabela Campo | Valor anterior | Valor novo (diffs);
  - **Criação/Exclusão**: conteúdo completo do registro;
  - **Agregadas**: painel Turma/Disciplina/Período/Quantidade.
- **Paginação** server-side (10/pág) + filtros combináveis (ex.: busca "Marcos" + Exclusão).

## 4. Framework reutilizável

`src/lib/auditoria.ts` expõe:
- `registrarAuditoria(...)` — registro completo (calcula `alteracoes` automaticamente);
- `registrarAuditoriaAgregada(...)` — resumo por salvamento;
- `computarAlteracoes(anteriores, novos)` — diff campo a campo;
- `nomearRegistro(entidade, row)` — rótulo humano por entidade.

Nova tela de Master-Data deve apenas chamar o helper nas mutações — sem lógica específica.
As capturas são **best-effort** (falhas não bloqueiam a operação principal).

## 5. Ator (quem executou)

`pessoaId` foi adicionado ao contexto de auth (`useAuth().pessoaId`), inclusive para o
Superadmin (antes era `null`). As mutações que não recebiam ator passaram a receber
`pessoaId` como parâmetro opcional e os call-sites foram atualizados.

## 6. Conversões necessárias

`calendarios.ts`, `matrizes.ts` (camada de dados do cliente) e o CRUD de **Disciplinas**
(foram refatorados para **server actions** com `getSupabaseAdmin()` + auditoria).
Utilitários puros de calendário extraídos para `src/lib/calendario-utils.ts`.