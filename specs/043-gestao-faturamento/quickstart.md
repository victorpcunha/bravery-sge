# Quickstart: Gestão de Faturamento

**Feature**: `043-gestao-faturamento` | **Date**: 2026-09-29

Guia de validação fim-a-fim (sem código de implementação). Pré-requisitos: ambiente dev (`npx next dev -p 3001`), seed de recursos aplicado via SQL Editor (`supabase-migrations/patch_recursos_faturamento.sql` + `supabase-migrations/faturamento.sql`), usuário com perfil que visualiza `gestao-academica.matriculas` (auto-grant do faturamento), ano letivo ativo com turmas e matrículas ativas.

## §1 — Início de ano: configurar → gerar em massa (§§6–8, 16 da spec)

1. Abrir **Faturamento → Configuração**, selecionar ano letivo e salvar padrão (valor R$ 450, vencimento dia 10, jan–dez).
2. Confirmar que nenhuma matrícula foi alterada (Cobranças continua vazia; Visão Geral mostra pendência "N matrículas sem plano").
3. Abrir **geração em massa** com abrangência "todas as elegíveis".
4. **Esperado na revisão**: total = Nº de matrículas ativas; `seguir�oPadrao` = total; `jaConfiguradas` = 0; `mensalidadesEstimadas` = total × 12; valor total = total × 12 × 450.
5. Confirmar. **Esperado**: toast "N planos criados"; cada matrícula com 12 mensalidades jan–dez, vencimento dia 10 (fev = dia 10, sem ajuste necessário); auditoria com 1 registro agregado.

## §2 — Proteção contra sobrescrita (§8)

1. Alterar manualmente o valor de 1 plano (exceção, `config_origem_id` NULL + indicador textual).
2. Rodar a geração em massa novamente com o padrão.
3. **Esperado**: revisão informa "1 matrícula já possui configuração"; após confirmar com "manter", o plano alterado permanece; auditoria registra `preservados: 1`.

## §3 — Entrada tardia + exceção (§§17, 19)

1. Criar matrícula com `data_matricula` em agosto; gerar plano individual com mês inicial = agosto (default sugerido).
2. **Esperado**: 5 mensalidades (ago–dez), sem jan–jul.
3. Alterar o vencimento desse plano para dia 20.
4. **Esperado**: indicador textual de divergência do padrão.

## §4 — Cobranças + baixa manual em lote (§§13, 15)

1. Em **Cobranças**, filtrar turma + situação "Em aberto"; selecionar 3 parcelas e "Registrar pagamento" (data, forma, observação).
2. **Esperado**: 3 viram "Pago" com os dados; resumo "3 mensalidades baixadas"; Visão Geral → Recebido aumenta no valor correspondente.
3. Tentar baixar novamente uma parcela paga junto com uma pendente.
4. **Esperado**: paga é ignorada com aviso; pendente é baixada.

## §5 — Saída do aluno (§18)

1. Registrar movimentação de saída (Transferência) para matrícula com futuras não pagas e 1 paga.
2. **Esperado**: diálogo oferece "cancelar futuras não pagas" (marcado); ao confirmar, futuras → `cancelado`, plano → `encerrado`, a paga intacta; Visão Geral não soma canceladas em Previsto.

## §6 — Permissões e auditoria (§22)

1. Acessar como perfil sem `faturamento.configuracao`: **esperado** `EmptyState ShieldAlert` "Sem permissão".
2. Em **/auditoria**, filtrar módulo `Faturamento`: **esperado** registros de criação, geração em massa (agregada com quantidades), baixas e alterações com usuário/escola/data-hora.

## §7 — Build e tipos

- `npx tsc --noEmit` limpo; `npx next build` verde; `text-[15px]` em descrições, zero hex (tokens), tabelas com sticky primeira coluna, minicards em `<md`.
