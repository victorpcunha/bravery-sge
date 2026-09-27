# Data Model: Documentos no Portal do Responsável

**Feature**: specs/041-documentos-portal/spec.md
**Created**: 2026-09-27

## Entidades

### escola_portal_documentos (nova tabela)

Representa a disponibilidade de cada documento no portal, por escola (FR-001/FR-002).

| Campo | Tipo | Regras |
|-------|------|--------|
| `school_id` | UUID, FK → `schools.id` (ON DELETE CASCADE) | Parte da PK; isolamento multi-tenant por construção |
| `documento_id` | TEXT | Parte da PK; deve existir no catálogo `DOCUMENTOS_PORTAL` (`src/lib/portal-documentos.ts`); validação server-side rejeita ids desconhecidos |
| `liberado` | BOOLEAN NOT NULL DEFAULT TRUE | `false` = oculto e bloqueado no portal |

**Semântica de ausência (decisão R1)**: se não há linha `(school_id, documento_id)`, o documento é considerado **liberado**. Consequências:
- Escolas existentes mantêm tudo visível sem backfill (opt-out; SC da spec).
- Documentos futuros nascem liberados (FR-009) sem alteração de estrutura.
- `salvarDocumentosPortal` grava linhas apenas para o estado divergente do padrão? **Não** — grava o estado completo (uma linha por documento do catálogo), para que a auditoria e a leitura sejam explícitas; a normalização de leitura trata ausência como liberado por defesa (migration não aplicada).

**Relacionamentos**: N:1 com `schools`. Sem FK com documentos (catálogo é código, não tabela — decisão R2).

**Validação**:
- `school_id` obrigatório; escola precisa existir e ter portal habilitado para a config ter efeito (efeito é filtrado pelo módulo `documentos`, spec 040).
- `documento_id` restrito aos ids do catálogo no momento do save (desconhecidos são ignorados com erro, nunca persistidos).
- Escrita exige `escolas/editar` via `validarPermissaoEstrita` (FR-011).

### Documento do catálogo (código, não tabela)

`DOCUMENTOS_PORTAL` em `src/lib/portal-documentos.ts`:

| id | titulo | categoria |
|----|--------|-----------|
| `declaracao` | Declaração de Matrícula | oficial |
| `ficha` | Ficha Individual do Aluno | oficial |
| `boletim` | Boletim Escolar | oficial |
| `historico` | Histórico Escolar | oficial |

Categoria `manual` prevista no tipo; sem entradas até os modelos existirem (decisão R7).

### Aluno em visualização (contexto, sem tabela nova)

Composto pelo `PortalCtx` de `validarVinculoPortal` (`schoolId`, `matriculaId`, `turmaId`, `anoLetivoId`) + `AlunoVinculado` do `PortalProvider`. Todo wrapper de geração recebe `(responsavelId, alunoId, schoolId?)` e resolve o contexto server-side — o cliente nunca informa turma/ano (FR-004/FR-006).

## Fluxos de estado

- **Configuração**: `todos liberados (ausência)` → gestora desmarca ids → linhas `liberado=false` → portal oculta + bloqueia; remarcar remove o bloqueio (linha `liberado=true` ou remoção — implementação define, leitura normaliza igual).
- **Geração**: responsável abre Documentos → `listarDocumentosDisponiveisPortal` retorna interseção (módulo visível ∩ catálogo ∩ linhas) → gera via wrapper do documento → PDF com dados do `PortalCtx` no momento da chamada (turma atual sempre, edge case de troca de turma).
- **Auditoria**: cada `salvarDocumentosPortal` → 1 registro `editar` em `auditoria` (módulo `Portal — Documentos`) com diff anterior→novo; best-effort.

## Fora do escopo de dados

- Nenhuma alteração em `schools` (zero colunas novas), `documentos_config`, `academico_matriculas`, `people` ou tabelas do Diário.
- Nenhuma tabela de log de downloads (geração é leitura; spec 017 não audita leituras).
- Relatórios gerenciais fora do escopo (assunção da spec).
