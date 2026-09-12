# Feature Specification: Paleta Tonal Steel Blue (v7)

**Feature Branch**: `027-paleta-indigo` (reaproveitado; teste índigo `#2C0BC1` superado pela v7)

**Created**: 2026-09-11 | **Status**: Testing

**Input**: Rampa tonal steel blue em 5 tons — `#4682B4` (primária), `#396991`, `#294C69`, `#192E40`, `#59A5E3` — + dourado `#B8863B` como contraste quente único. Light mode apenas; `.dark` intocado.

## Mapeamento aplicado (`:root`)

| Token | Valor | Papel |
|-------|-------|-------|
| `--primary` / fg | `#4682B4` / `#FFFFFF` | Ação principal (contraste 4.11:1 — AA-large, **abaixo de AA-normal: tradeoff registrado**) |
| `--secondary` / fg | `#396991` / `#FFFFFF` | Apoio + fills com texto (5.83:1 ✓) |
| `--accent` / fg | `#59A5E3` / `#192E40` | Realce claro (5.26:1 ✓) |
| `--ring` | `#B8863B` | Dourado fixo, desacoplado (accent claro não atinge 3:1 como anel) |
| `--info` | `#396991` | Texto informativo AA |
| `--sidebar` / fg | `#294C69` / `#FFFFFF` | Tom profundo da rampa (9:1 ✓) |
| `--sidebar-primary` / fg | `#FFFFFF` / `#294C69` | Pílula ativa |
| charts | `#4682B4, #B8863B, #396991, #294C69, #16A34A` | Spread da rampa + dourado + verde |
| `#59A5E3` | reservado | Realce claro / uso futuro (não aplicado — como ring falharia contraste) |
| `#192E40` | reservado | Fundo dark natural / uso futuro |

## User Scenarios & Testing

### US1 — Marca steel blue legível (P1)

**Given** `--primary: #4682B4`, **When** aplicado a botões/links/ring/charts, **Then** contraste ≥ 3:1 em todo uso; texto normal sobre primary documentado como 4.11:1 (tradeoff consciente; alternativa AA-total: `--secondary` como fill).

### US2 — Hierarquia tonal (P1)

Sidebar profunda `#294C69`, ações `#4682B4`, apoio `#396991` — três degraus distintos da mesma rampa, sem competir com o dourado.

### US3 — Preservados + accent claro (P1)

**When** a troca é aplicada, **Then**: `--accent` é azul-claro `#59A5E3` (fg `#192E40`); `--ring` permanece dourado fixo; `.dark` byte-idêntico; botões de confirmação seguem `primary`; hover da sidebar segue wash translúcido; texto da sidebar é `sidebar-foreground` (branco).

## Success Criteria

- **SC-001**: Contrastes calculados: secondary 5.83, sidebar 9.0, accent 5.1, muted 5.58 (✓); primary 4.11 documentado como exceção.
- **SC-002**: `detect` sem novos findings; `build` verde.
- **SC-003**: `.dark` inalterado.
- **SC-004**: Decisão: manter, ajustar (ex.: primary-fill → secondary) ou reverter.

## Assumptions

- Revert trivial via `git checkout`.
- Drift pré-existente fora do escopo: docs descreviam sidebar branca; código sempre foi sidebar colorida.
