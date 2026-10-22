# Data Model: Gestão de Faturamento

**Feature**: `043-gestao-faturamento` | **Date**: 2026-09-29 | **Migration**: `supabase-migrations/faturamento.sql` + `supabase-migrations/patch_recursos_faturamento.sql` (aplicar via SQL Editor, padrão do repo)

## Entidades novas

### `faturamento_configuracoes`

Padrão de cobrança por escola/unidade + ano letivo, com abrangência por etapas (clarificação B1).

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID PK | default `gen_random_uuid()` |
| `school_id` | UUID FK → `schools(id)` CASCADE NOT NULL | escopo multi-tenant |
| `ano_letivo_id` | UUID FK → `academico_anos_letivos(id)` RESTRICT NOT NULL | nunca órfã de ano |
| `titulo` | TEXT NULL (obrigatório na UI) | identificador definido pela escola (ex.: 2026 - Infantil e Anos Iniciais) |
| `etapa_ids` | UUID[] NULL | NULL = configuração geral (fallback); preenchido = aplica-se àquelas etapas |
| `valor_mensalidade` | NUMERIC(10,2) NOT NULL | > 0 (check) |
| `dia_vencimento` | INT NOT NULL | 1–31 (check) |
| `mes_inicial` | INT NOT NULL | 1–12 (check), default 1 |
| `mes_final` | INT NOT NULL | 1–12 (check), `mes_final >= mes_inicial`, default 12 |
| `ativo` | BOOLEAN DEFAULT true | |
| `created_at / updated_at` | TIMESTAMPTZ | trigger como demais tabelas |

Resolução na geração (Assumptions da spec): para cada matrícula usa-se a configuração cuja `etapa_ids` contém a etapa da matrícula; sobreposição → a mais específica (menor `etapa_ids`? desempate: a criada por último não — **regra**: se >1 cobre, a com menor array vence; empate → erro de configuração listado como inconsistência); sem correspondência → configuração geral (`etapa_ids IS NULL`).

### `faturamento_planos`

Plano de Cobrança: 1 por matrícula no contexto letivo.

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID PK | |
| `school_id` | UUID FK → `schools(id)` CASCADE NOT NULL | |
| `matricula_id` | UUID FK → `academico_matriculas(id)` CASCADE NOT NULL UNIQUE | 1 plano por matrícula |
| `ano_letivo_id` | UUID FK RESTRICT NOT NULL | desnormalizado para filtro rápido |
| `responsavel_id` | UUID FK → `people(id)` SET NULL | único por plano (clarificação A3); NULL = pendência "responsável ausente" |
| `valor_mensalidade` | NUMERIC(10,2) NOT NULL | snapshot (não segue config após gerado) |
| `dia_vencimento` | INT NOT NULL | snapshot |
| `mes_inicial / mes_final` | INT NOT NULL | snapshot do período |
| `qtd_mensalidades` | INT NOT NULL | = `mes_final - mes_inicial + 1` |
| `config_origem_id` | UUID FK → `faturamento_configuracoes(id)` SET NULL | NULL = exceção (diverge do padrão — FR-016) |
| `situacao` | TEXT DEFAULT 'ativo' CHECK (`ativo`,`encerrado`) | `encerrado` após saída com cancelamento |
| `asaas_customer_id` | TEXT NULL | reserva integração (§23), nunca exibido |
| `created_at / updated_at` | TIMESTAMPTZ | |

### `faturamento_mensalidades`

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID PK | futuro `externalReference` |
| `plano_id` | UUID FK → `faturamento_planos(id)` CASCADE NOT NULL | |
| `competencia` | DATE NOT NULL | sempre dia 1º do mês; UNIQUE (`plano_id`, `competencia`) — idempotência |
| `numero_parcela` | INT NOT NULL | 1-based na ordem das competências |
| `valor` | NUMERIC(10,2) NOT NULL | snapshot (permite ajuste individual sem tocar o plano) |
| `vencimento` | DATE NOT NULL | `min(dia, último dia do mês)` |
| `situacao` | TEXT DEFAULT 'pendente' CHECK (`pendente`,`pago`,`cancelado`,`isento`) | **sem** `vencida` armazenada |
| `pago_em` | DATE NULL | NOT NULL quando `pago` (check) |
| `forma_baixa` | TEXT NULL | ex.: dinheiro, pix, boleto, transferência; livre + sugestões |
| `observacao` | TEXT NULL | |
| `baixa_por` | UUID FK → `people(id)` SET NULL | quem registrou (auditoria fina) |
| `asaas_payment_id` | TEXT NULL UNIQUE | reserva integração |
| `asaas_status / invoice_url / sincronizado_em` | TEXT / TEXT / TIMESTAMPTZ NULL | reserva integração |
| `created_at / updated_at` | TIMESTAMPTZ | |

## Estados derivados (não colunas)

- **Mensalidade `Vencida`** = `situacao='pendente' AND vencimento < hoje`.
- **Matrícula no faturamento**: `Sem plano` (sem plano ativo) · `Em dia` (zero pendentes vencidas e zero pendentes futuras? **não** — `Em dia` = zero vencidas; futuras pendentes são normais) · `Pendente` (há pendente futura, nenhuma vencida) · `Vencida` (≥1 vencida). Texto explícito sempre (FR-013).
- **Indicadores**: Previsto = Σ valor (não canceladas) no período; Recebido = Σ pagas; Em aberto = Σ pendentes com vencimento ≥ hoje; Vencido = Σ pendentes com vencimento < hoje. Isentas/canceladas fora dos totais.

## Relacionamentos

```text
schools 1──N faturamento_configuracoes (school_id, ano_letivo_id)
academico_matriculas 1──1 faturamento_planos (matricula_id UNIQUE, CASCADE)
faturamento_planos 1──N faturamento_mensalidades (CASCADE)
faturamento_configuracoes 1──N faturamento_planos (config_origem_id, SET NULL)
people 1──N faturamento_planos (responsavel_id, SET NULL)
academico_anos_letivos 1──N configuracoes/planos (RESTRICT)
```

## Regras de ciclo de vida

1. **Geração**: `simularGeracao` (leitura) → revisão → `gerarPlanosEmMassa` (escrita, preserva existentes por padrão; `substituir=true` exige confirmação e deleta mensalidades não-pagas do plano antigo antes de regerar — pagas nunca tocadas).
2. **Entrada tardia**: `mes_inicial` default = mês(`data_matricula`), ajustável; sem competências retroativas.
3. **Saída** (clarificação C2): diálogo de movimentação oferece cancelar futuras não pagas (default marcado) → `situacao='cancelado'`, plano → `encerrado`; pagas/isentas preservadas.
4. **Remanejamento de turma**: plano segue a matrícula (sem alteração financeira).
5. **Novo ano letivo**: sem herança — exige nova geração (matrículas elegíveis sem plano viram pendência).
6. **Exclusão de matrícula**: bloqueada pelo CASCADE reverso? Plano é CASCADE da matrícula (some junto), mas auditoria agregada preserva o histórico da operação; pagamentos já auditados permanecem na tabela `auditoria`.
