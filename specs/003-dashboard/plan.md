# Implementation Plan: Dashboard — Visão Gerencial da Escola

**Branch**: `003-dashboard` | **Date**: 2026-06-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-dashboard/spec.md`

## Summary

Redesenho completo do Dashboard principal do Bravery SGE. Substitui os 4 StatCards genéricos por indicadores reais calculados do banco (Docentes distintos, Turmas ativas, Alunos distintos, Matrículas totais, Ano Letivo vigente). Adiciona 8 novos gráficos Recharts, calendário escolar, alertas de turmas sem professor, aniversariantes do mês, taxa de ocupação e frequência média. Remove a seção "Próximos Passos". Toda a lógica de dados é consolidada em uma única server action `getDashboardData`.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)

**Primary Dependencies**: Recharts (já instalado), shadcn/ui, Tailwind CSS v4, lucide-react, sonner (toast)

**Storage**: PostgreSQL via Supabase — apenas queries de leitura, zero migrations novas

**Testing**: Validação visual manual + build (`npx next build`). Sem framework de teste automatizado.

**Target Platform**: Web (Next.js App Router, Server Component + Client Component)

**Project Type**: Web application — frontend redesign + nova server action (sem novas tabelas)

**Performance Goals**: Dashboard carrega em <3s com até 500 alunos. Server action executa todas as queries em paralelo via `Promise.all`.

**Constraints**: Zero novas dependências npm. Zero migrations. Seguir princípios constitucionais (Design Tokens, shadcn/ui, Dark Mode, Server Actions, Feature-Based Architecture, Design System First).

**Scale/Scope**: 1 página (dashboard raiz), 1 nova server action, ~8 novos componentes de gráfico/card, remoção de seção obsoleta.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Server Actions First | ✅ PASS | Toda lógica em `src/lib/actions/dashboard.ts` com `'use server'` |
| II. Security First | ✅ PASS | Action valida `schoolId` via `getSupabaseAdmin()` (service_role, bypass RLS) |
| III. Multi-Tenant by Design | ✅ PASS | Dashboard filtra por `school_id`; super admin vê dados da escola selecionada |
| IV. Design Tokens over Hardcoded Styles | ✅ PASS | Todos os componentes usam tokens Tailwind oficiais |
| V. Dark Mode Compatibility | ✅ PASS | Componentes usam tokens CSS com variantes `.dark` definidas |
| VI. shadcn/ui as UI Standard | ✅ PASS | Cards, tabelas, badges usam shadcn; gráficos usam Recharts (oficial) |
| VII. Database Through Migrations | ✅ PASS | Zero migrations — apenas queries de leitura em tabelas existentes |
| VIII. Auditability First | ✅ PASS | N/A — dashboard é somente leitura |
| IX. Feature-Based Architecture | ✅ PASS | Action em `src/lib/actions/dashboard.ts`, componentes em `src/components/dashboard/` |
| X. No New Patterns Without Approval | ✅ PASS | Nenhum novo padrão — reutiliza Recharts + shadcn existentes |
| XI. Design System First | ✅ PASS | Usa PageContainer, PageHeader, PageSection, StatCard, StatusBadge oficiais |

**Gate: PASS** — Nenhuma violação.

## Project Structure

### Documentation (this feature)

```text
specs/003-dashboard/
├── plan.md              # This file
├── spec.md              # Feature specification
├── tasks.md             # /speckit.tasks output (NOT created by plan)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── app/(app)/(auth)/
│   └── page.tsx                        # MODIFIED: Dashboard redesenhado
├── components/
│   └── dashboard/                      # NEW: Componentes do dashboard
│       ├── calendario-card.tsx          # Mini calendário do mês
│       ├── aniversariantes-list.tsx     # Lista de aniversariantes
│       ├── alunos-por-etapa-chart.tsx   # BarChart horizontal
│       ├── alunos-por-tipo-chart.tsx    # PieChart
│       ├── alunos-por-deficiencia-chart.tsx  # BarChart horizontal
│       ├── alunos-por-transtorno-chart.tsx   # BarChart horizontal
│       ├── alunos-por-modalidade-chart.tsx   # PieChart
│       ├── alunos-por-turno-chart.tsx   # PieChart
│       ├── ocupacao-card.tsx            # Barra de progresso
│       ├── frequencia-media-card.tsx    # Donut chart
│       ├── risco-evasao-table.tsx       # Tabela de risco
│       └── turmas-sem-professor-list.tsx # Alertas
├── lib/
│   └── actions/
│       └── dashboard.ts                # NEW: Server action getDashboardData
└── components/
    └── layout/                         # EXISTING: PageContainer, PageHeader, etc.
```

## Data Flow

```
┌──────────────────────────────────────────────────────┐
│ page.tsx                                             │
│ ┌──────────────────────────────────────────────────┐ │
│ │ 'use client'                                     │ │
│ │ useState<DashboardData | null>(null)              │ │
│ │ useEffect → getDashboardData(schoolId)           │ │
│ └──────────────────────┬───────────────────────────┘ │
└────────────────────────┼─────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│ src/lib/actions/dashboard.ts ('use server')          │
│ ┌──────────────────────────────────────────────────┐ │
│ │ export async function getDashboardData(           │ │
│ │   schoolId: string | null                         │ │
│ │ ): Promise<DashboardData>                         │ │
│ │                                                   │ │
│ │ Promise.all([                                     │ │
│ │   getDocentes(schoolId),       // 1 query         │ │
│ │   getTurmas(schoolId),         // 1 query         │ │
│ │   getAlunosMatriculados(schoolId), // 1 query     │ │
│ │   getAnoLetivo(schoolId),      // 1 query         │ │
│ │   getCalendario(schoolId),     // 4 queries       │ │
│ │   getAlunosPorEtapa(schoolId), // 1 query         │ │
│ │   getAlunosPorTipo(schoolId),  // 1 query         │ │
│ │   getAlunosPorDeficiencia(schoolId), // 1 query   │ │
│ │   getAlunosPorTranstorno(schoolId), // 1 query    │ │
│ │   getOcupacao(schoolId),       // 1 query         │ │
│ │   getFrequenciaMedia(schoolId), // 1 query        │ │
│ │   getRiscoEvasao(schoolId),    // 1 query         │ │
│ │   getAniversariantes(schoolId), // 1 query        │ │
│ │   getTurmasSemProfessor(schoolId), // 1 query     │ │
│ │ ])                                                │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## SQL Queries (por indicador)

### Docentes (DISTINCT de person_id com vínculo ativo em turma)

```sql
SELECT COUNT(DISTINCT tp.person_id)::int as total
FROM turmas_profissionais tp
JOIN turmas t ON t.id = tp.turma_id
WHERE t.school_id = $1 AND tp.ativo = true AND t.ativo = true
```

### Turmas Ativas

```sql
SELECT COUNT(*)::int as total
FROM turmas
WHERE school_id = $1 AND ativo = true
```

### Alunos (DISTINCT pessoas com matrícula ativa)

```sql
SELECT COUNT(DISTINCT m.aluno_id)::int as total
FROM academico_matriculas m
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo'
```

### Matrículas Ativas

```sql
SELECT COUNT(*)::int as total
FROM academico_matriculas
WHERE school_id = $1 AND ativo = true AND situacao = 'Ativo'
```

### Ano Letivo Ativo

```sql
SELECT descricao, status, data_inicio, data_termino
FROM academico_anos_letivos
WHERE school_id = $1 AND status = 'ativo'
LIMIT 1
```

### Calendário Escolar (eventos do mês atual)

```sql
-- 1. Buscar calendários do ano ativo
SELECT id FROM academico_calendarios
WHERE ano_letivo_id = (SELECT id FROM academico_anos_letivos WHERE school_id = $1 AND status = 'ativo' LIMIT 1)

-- 2. Eventos do mês atual
SELECT descricao, tipo, data_inicio, data_termino
FROM academico_calendario_eventos
WHERE calendario_id IN (...) 
  AND data_inicio <= CURRENT_DATE + INTERVAL '30 days'
  AND data_termino >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY data_inicio
```

### Dias Letivos Cumpridos

```sql
-- Total de dias letivos no ano (com base nos eventos)
SELECT COUNT(*)::int as total_dias_letivos
FROM academico_calendario_eventos
WHERE calendario_id = $1 AND tipo = 'dia_letivo'

-- Dias cumpridos (até hoje)
SELECT COUNT(*)::int as dias_cumpridos  
FROM academico_calendario_eventos
WHERE calendario_id = $1 AND tipo = 'dia_letivo' AND data_termino < CURRENT_DATE
```

### Alunos por Etapa de Ensino

```sql
SELECT ee.etapa_nome as etapa, COUNT(DISTINCT m.aluno_id)::int as quantidade
FROM academico_matriculas m
JOIN academico_etapas_ensino ee ON ee.id = m.etapa_ensino_id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo'
GROUP BY ee.etapa_nome
ORDER BY quantidade DESC
```

### Alunos por Tipo de Turma (JSONB unpivot)

```sql
SELECT tt.tipo, COUNT(DISTINCT m.aluno_id)::int as quantidade
FROM academico_matriculas m
JOIN turmas t ON t.id = m.turma_id
CROSS JOIN LATERAL jsonb_array_elements_text(
  CASE WHEN jsonb_typeof(t.tipos_turma) = 'array' THEN t.tipos_turma ELSE '[]'::jsonb END
) as tt(tipo)
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo'
GROUP BY tt.tipo
ORDER BY quantidade DESC
```

### Alunos por Deficiência (unpivot de colunas booleanas em people)

```sql
SELECT 'Cegueira' as nome, COUNT(DISTINCT p.id)::int as quantidade
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.cegueira = true
UNION ALL
SELECT 'Baixa Visão', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.baixa_visao = true
UNION ALL
SELECT 'Surdez', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.surdez = true
UNION ALL
SELECT 'Deficiência Auditiva', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.deficiencia_auditiva = true
UNION ALL
SELECT 'Surdocegueira', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.surdocegueira = true
UNION ALL
SELECT 'Deficiência Física', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.deficiencia_fisica = true
UNION ALL
SELECT 'Deficiência Intelectual', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.deficiencia_intelectual = true
UNION ALL
SELECT 'Deficiência Múltipla', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.deficiencia_multipla = true
UNION ALL
SELECT 'TEA (Autismo)', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.tea = true
UNION ALL
SELECT 'Altas Habilidades', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.altas_habilidades = true
UNION ALL
SELECT 'Visão Monocular', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.visao_monocular = true
ORDER BY quantidade DESC
```

*Nota: Filtrar resultados com quantidade > 0 no TypeScript após a query.*

### Alunos por Transtorno (unpivot similar)

```sql
SELECT 'Transtorno de Aprendizagem' as nome, COUNT(DISTINCT p.id)::int as quantidade
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.transtorno_aprendizagem = true
UNION ALL
SELECT 'Dislexia', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.dislexia = true
UNION ALL
SELECT 'TDAH', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.tdah = true
UNION ALL
SELECT 'Discalculia', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.discalculia = true
UNION ALL
SELECT 'Disgrafia', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.disgrafia = true
UNION ALL
SELECT 'Dislalia', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.dislalia = true
UNION ALL
SELECT 'TPAC', COUNT(DISTINCT p.id)
FROM people p JOIN academico_matriculas m ON m.aluno_id = p.id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo' AND p.tpac = true
ORDER BY quantidade DESC
```

### Alunos por Modalidade

```sql
SELECT t.modalidade, COUNT(DISTINCT m.aluno_id)::int as quantidade
FROM academico_matriculas m
JOIN turmas t ON t.id = m.turma_id
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo'
GROUP BY t.modalidade
ORDER BY quantidade DESC
```

### Alunos por Turno (JSONB unpivot)

```sql
SELECT tu.turno, COUNT(DISTINCT m.aluno_id)::int as quantidade
FROM academico_matriculas m
JOIN turmas t ON t.id = m.turma_id
CROSS JOIN LATERAL jsonb_array_elements(t.turnos) as tu_data
CROSS JOIN LATERAL (SELECT tu_data->>'turno' as turno) as tu
WHERE m.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo'
GROUP BY tu.turno
ORDER BY quantidade DESC
```

### Ocupação das Turmas

```sql
SELECT 
  COALESCE(SUM(t.capacidade_alunos), 0)::int as capacidade_total,
  COUNT(m.id)::int as matriculas_ativas
FROM turmas t
LEFT JOIN academico_matriculas m ON m.turma_id = t.id 
  AND m.ativo = true AND m.situacao = 'Ativo'
WHERE t.school_id = $1 AND t.ativo = true
```

### Frequência Média

```sql
SELECT 
  COUNT(*) FILTER (WHERE f.status = 'P')::int as presencas,
  COUNT(*)::int as total
FROM academico_frequencias_dia f
JOIN academico_matriculas m ON m.aluno_id = f.aluno_id AND m.turma_id = f.turma_id
WHERE f.school_id = $1 AND m.ativo = true AND m.situacao = 'Ativo'
  AND f.dia_letivo >= (SELECT data_inicio FROM academico_anos_letivos WHERE school_id = $1 AND status = 'ativo' LIMIT 1)
```

### Risco de Evasão (turmas com alunos >25% faltas)

```sql
SELECT 
  t.nome as turma,
  COUNT(DISTINCT f.aluno_id) as total_alunos,
  COUNT(DISTINCT f.aluno_id) FILTER (WHERE sub.taxa_falta > 0.25) as alunos_baixa_frequencia,
  ROUND(AVG(sub.taxa_falta) * 100)::int as percentual_medio_faltas
FROM turmas t
JOIN academico_matriculas m ON m.turma_id = t.id AND m.ativo = true AND m.situacao = 'Ativo'
JOIN academico_frequencias_dia f ON f.aluno_id = m.aluno_id AND f.turma_id = t.id
JOIN LATERAL (
  SELECT 
    COUNT(*) FILTER (WHERE f2.status IN ('F', 'FJ'))::float / NULLIF(COUNT(*), 0) as taxa_falta
  FROM academico_frequencias_dia f2
  WHERE f2.aluno_id = f.aluno_id AND f2.turma_id = t.id
) sub ON true
WHERE t.school_id = $1 AND t.ativo = true
GROUP BY t.id, t.nome
HAVING COUNT(DISTINCT f.aluno_id) FILTER (WHERE sub.taxa_falta > 0.25) > 0
ORDER BY alunos_baixa_frequencia DESC
LIMIT 10
```

### Aniversariantes do Mês

```sql
SELECT p.nome_completo, p.data_nascimento, t.nome as turma_nome
FROM people p
JOIN academico_matriculas m ON m.aluno_id = p.id AND m.ativo = true AND m.situacao = 'Ativo'
JOIN turmas t ON t.id = m.turma_id
WHERE m.school_id = $1
  AND EXTRACT(MONTH FROM p.data_nascimento) = EXTRACT(MONTH FROM CURRENT_DATE)
ORDER BY EXTRACT(DAY FROM p.data_nascimento)
LIMIT 20
```

### Turmas sem Professor em Disciplinas

```sql
SELECT t.nome as turma_nome, d.nome as disciplina_nome
FROM turmas_disciplinas td
JOIN turmas t ON t.id = td.turma_id
JOIN academico_matriz_disciplinas md ON md.id = td.matriz_disciplina_id
JOIN academico_disciplinas d ON d.id = md.disciplina_id
LEFT JOIN turmas_profissionais tp ON tp.turma_id = t.id 
  AND md.id = ANY(tp.disciplinas_ids) 
  AND tp.ativo = true
WHERE t.school_id = $1 AND t.ativo = true AND tp.id IS NULL
ORDER BY t.nome, d.nome
```

## Component Architecture

### DashboardData (TypeScript type)

```typescript
type DashboardData = {
  docentes: number
  turmas: number
  alunos: number
  matriculas: number
  anoLetivo: { descricao: string; status: string } | null
  
  calendario: {
    eventos: { data: string; tipo: string; descricao: string }[]
    diasLetivosTotal: number
    diasLetivosCumpridos: number
    anoLetivoStatus: string
  }
  
  alunosPorEtapa: { etapa: string; quantidade: number }[]
  alunosPorTipoTurma: { tipo: string; quantidade: number }[]
  alunosPorDeficiencia: { nome: string; quantidade: number }[]
  alunosPorTranstorno: { nome: string; quantidade: number }[]
  alunosPorModalidade: { modalidade: string; quantidade: number }[]
  alunosPorTurno: { turno: string; quantidade: number }[]
  
  ocupacao: { capacidadeTotal: number; matriculasAtivas: number }
  frequenciaMedia: { presencas: number; total: number }
  riscoEvasao: { turma: string; totalAlunos: number; alunosBaixaFrequencia: number; percentualMedioFaltas: number }[]
  
  aniversariantes: { nome: string; data: string; turma: string }[]
  turmasSemProfessor: { turma: string; disciplinas: string[] }[]
}
```

### Chart Color Palette (tokens-based)

```typescript
const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(var(--info))',
  // ... extensões com opacidade
]
```

Usar `hsl(var(--token))` para compatibilidade com Dark Mode (Recharts não processa Tailwind CSS variables diretamente, mas `hsl()` com CSS vars funciona).

### Layout Grid

```
┌──────────────────────────────────────────────────────────┐
│ PageHeader: "Dashboard — Ano Letivo 2026"                │
├──────────────────────────────────────────────────────────┤
│ grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│ │Docentes │ │ Turmas  │ │ Alunos  │ │Matrículas│        │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
├──────────────────────────┬───────────────────────────────┤
│ Calendário Escolar        │ Aniversariantes do Mês        │
│ (grid-cols-1 lg:grid-cols-2 gap-6)                       │
├──────────────────────────┼───────────────────────────────┤
│ Alunos por Etapa          │ Alunos por Tipo de Turma      │
│ (grid-cols-1 lg:grid-cols-2 gap-6)                       │
├──────────────────────────┼───────────────────────────────┤
│ Alunos por Deficiência    │ Alunos por Transtorno         │
├──────────────────────────┼───────────────────────────────┤
│ Ocupação das Turmas       │ Frequência Média              │
├──────────────────────────┼───────────────────────────────┤
│ Alunos por Modalidade     │ Alunos por Turno              │
├──────────────────────────┴───────────────────────────────┤
│ Risco de Evasão (full width)                              │
├──────────────────────────────────────────────────────────┤
│ Turmas sem Professor (full width)                         │
└──────────────────────────────────────────────────────────┘
```

## Implementation Order

### Fase 1: Server Action + Tipos
1. Criar `src/lib/actions/dashboard.ts` com todas as 14 sub-queries em `Promise.all`
2. Definir `DashboardData` type
3. Testar action isoladamente (build check)

### Fase 2: Componentes de Gráfico
4. Criar `AlunosPorEtapaChart` (`src/components/dashboard/alunos-por-etapa-chart.tsx`)
5. Criar `AlunosPorTipoTurmaChart` (pie)
6. Criar `AlunosPorDeficienciaChart` (bar)
7. Criar `AlunosPorTranstornoChart` (bar)
8. Criar `AlunosPorModalidadeChart` (pie)
9. Criar `AlunosPorTurnoChart` (pie)
10. Criar `OcupacaoCard` (progress bar)
11. Criar `FrequenciaMediaCard` (radial/donut)
12. Criar `RiscoEvasaoTable` (table)
13. Criar `CalendarioCard` (grid)
14. Criar `AniversariantesList` (list)
15. Criar `TurmasSemProfessorList` (alerts)

### Fase 3: Página
16. Reescrever `src/app/(app)/(auth)/page.tsx` com novo layout
17. Integrar server action com useEffect
18. Remover "Próximos Passos"

### Fase 4: Build & Verificação
19. `npx next build` — verificar zero erros
20. Navegação manual — verificar Light/Dark Mode

## Complexity Tracking

> Nenhuma violação constitucional. Complexidade padrão de feature.

| Aspect | Justificativa |
|--------|---------------|
| 14 queries em paralelo | Necessário para evitar N+1 e manter dashboard <3s. `Promise.all` do Supabase é eficiente. |
| UNION ALL para deficiências/transtornos | Colunas são booleanas na tabela people (modelo Censo INEP). Unpivot via UNION ALL é mais performático que 11 queries separadas. |
| JSONB unpivot via LATERAL | `tipos_turma` e `turnos` são JSONB arrays. `jsonb_array_elements_text` + `CROSS JOIN LATERAL` é a abordagem padrão PostgreSQL. |
