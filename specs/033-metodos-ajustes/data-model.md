# Data Model: Métodos de Avaliação — Ajustes

**Spec**: [spec.md](./spec.md) | **Nenhuma migration** — todas as entidades abaixo já existem; mudanças são 100% de apresentação (com 1 remoção de UI).

## Entidades (leitura/escrita inalteradas)

| Entidade | Tabela | Uso no cadastro |
|---|---|---|
| Método (principal) | `academico_metodos_avaliacao` | `nome`, `ativo`, `criterio_frequencia`, `frecuencia_minima`, `faixa_atencao_pp`, `tipos_avaliacao{jsonb}`, `quantidade_periodos_*` |
| Numérico | `academico_metodos_avaliacao_numerico` | `forma_registro`, `permite_recuperacao` (csv), `tipo_media_periodo`, `tipo_resultado_final`, `media_maxima_periodo`, flags de opções, `limitar_avaliacoes`, `avaliacoes_list` |
| Aprovação | `academico_metodos_avaliacao_aprovacao` | `aprovacao_automatica`, `media_minima`, `pesos_periodos[]`, `permite_recuperacao_final` (derivado de `permite_recuperacao includes 'final'`), `media_minima_recuperacao`, `usa_media_ponderada_recuperacao`, `peso_media_anual`, `peso_recuperacao_final` |
| Arredondamento | `academico_metodos_avaliacao_arredondamento` | `tipo_arredondamento` (null = nenhum), `intervalo_inicial/final`, `margem_decimal`, `aplica_media_periodo/anual/final` |
| Parecer | `academico_metodos_parecer` | `registro_geral` |
| Conceitos | `academico_metodos_conceitos` | `descricao`, `sigla`, `eh_conceito_final`, `ordem` (+ `cor_fundo/cor_letra` preservadas no banco, fora da UI) |
| Níveis | `academico_metodos_niveis` | `descricao`, `sigla`, `ordem` (+ `cor_fundo/cor_letra` preservadas no banco, fora da UI) |

## Mapa de Pills (campo → componente → cardinalidade)

| Campo(s) | Antes | Depois | Cardinalidade |
|---|---|---|---|
| `ativo` | `Checkbox` | 1 `ClickablePill` (Ativo) | toggle boolean |
| `tipos_avaliacao.{numerico,parecer,conceito,nivel}` | 4 `Checkbox` | 4 `ClickablePill` | multi (4 booleans) |
| `forma_registro` | `Select` | 2 Pills (Inteiro/Decimal) | single |
| `permite_recuperacao` (csv) | 3 `Checkbox` | 3 Pills (Por Avaliação/Por Período/Final) | multi (array, join `,`) |
| `tipo_media_periodo` | `Select` | 2 Pills (Ponderada/Somatória) | single |
| `tipo_resultado_final` | `Select` | 2 Pills (Média dos Períodos/Somatória dos Períodos) | single |
| Opções (`permite_conselho_*`, `usa_media_5_*`, `recuperacao_*_substitutiva`, `reclassificacao`, `limitar_avaliacoes`) | coluna única | mesma `Checkbox`/`CheckboxWithTooltip` em `grid sm:2 lg:3` | inalterada |
| `aprovacao_automatica` | `Checkbox` | 1 `ClickablePill` | toggle boolean |
| `usa_media_ponderada_recuperacao` | `Checkbox` (+ "(Se desmarcado…)") | 2 Pills (Aritmética=false / Ponderada=true) + tooltips literais | single |
| `tipo_arredondamento` (null = nenhum) | `Select` ×3 blocos | 3 Pills (Nenhum/Meio Ponto/Decimal) + tooltips literais | single |
| `aplica_media_periodo/anual/final` | 3 `Checkbox` | 3 Pills | multi (3 booleans) |
| `registro_geral` | `Checkbox` | 1 `ClickablePill` | toggle boolean |
| Conceito Final (derivado de `conceitos.some(eh_conceito_final)`) | `Checkbox` | 1 `ClickablePill` | toggle (add/remove item final) |
| Itens de conceito/nível | grupo `bg-muted` + cores + lixeira direta | grupo só `border`, sem cores, lixeira com `ConfirmDialog` | remoção de UI + confirmação |

## Regras de persistência (inalteradas, só referência)

- `payload.numerico/aprovacao/arredondamento` só enviados se `tipos_avaliacao.numerico`; `parecer` só se `.parecer`; `conceitos`/`niveis` esvaziados se o tipo desligado (`saveMetodo` atual).
- `permite_recuperacao_final = permite_recuperacao.includes('final')` (derivado no save, não editável direto).
- `tipo_arredondamento === 'nenhum'` → `null` + intervalos/margem `null` (condicionais por tipo mantidas).
- Conceitos/níveis reescritos por delete+insert com `ordem` sequencial; defaults `cor_fundo/cor_letra` mantidos no insert (UI não edita mais).
