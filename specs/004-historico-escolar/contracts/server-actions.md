# Server Action Contracts: Histórico Escolar

## getNotasDetalhadas

Expanded matrícula — Avaliação Numérica.

```
getNotasDetalhadas(alunoId: string, turmaId: string, pessoaLogadaId?: string | null): Promise<NotasDetalhadas>
```

**Returns**:
```typescript
type NotasDetalhadas = {
  disciplinas: {
    disciplina_id: string
    disciplina_nome: string
    periodos: {
      periodo: number           // 1, 2, 3...
      nota: number | null       // Nota no período (pós-recuperação)
      nota_original: number | null  // Nota original antes da recuperação
      faltas: number            // Total de faltas no período
      tem_recuperacao: boolean  // Se houve recuperação neste período
      nota_recuperacao: number | null  // Valor da recuperação (se houver)
    }[]
    media_final: number | null  // Média entre períodos
    total_faltas: number        // Soma de faltas em todos os períodos
    frequencia_percentual: number | null  // Presenças / total de dias * 100
  }[]
  total_dias_letivos: number | null  // Dias letivos da turma no ano
}
```

## getIndicadoresAvaliados

Expanded matrícula — Avaliação por Indicadores.

```
getIndicadoresAvaliados(alunoId: string, turmaId: string, pessoaLogadaId?: string | null): Promise<IndicadoresAvaliados>
```

**Returns**:
```typescript
type IndicadoresAvaliados = {
  disciplinas: {
    disciplina_id: string
    disciplina_nome: string
    indicadores: {
      indicador_id: string
      descricao: string
      periodos: {
        periodo: number
        nivel_id: string | null
        nivel_descricao: string | null
        nivel_sigla: string | null
        observacao: string | null
      }[]
    }[]
  }[]
}
```

## adicionarHistoricoManual (EXPANDED)

Modal "Adicionar Histórico" — submit.

```
adicionarHistoricoManual(data: HistoricoManualInput, pessoaLogadaId?: string | null): Promise<HistoricoManualRecord>
```

**Input**:
```typescript
type HistoricoManualInput = {
  person_id: string
  school_id: string
  ano: number                       // NEW: integer year (ex: 2025)
  carga_horaria?: number | null
  dias_letivos?: number | null
  estado?: string | null            // NEW: UF (2 chars)
  municipio?: string | null
  unidade_escolar?: string | null
  etapa_ensino_id?: string | null
  situacao?: string | null
  observacoes?: string | null
  disciplinas: {
    disciplina_id?: string | null   // NULL when parte_diversificada
    disciplina_nome?: string | null // Text name when parte_diversificada
    media_final: number
    carga_horaria_anual?: number | null
    parte_diversificada?: boolean
  }[]
}
```

## listarHistoricoManual

Card Histórico Escolar — listagem de registros manuais.

```
listarHistoricoManual(alunoId: string, pessoaLogadaId?: string | null): Promise<HistoricoManualRecord[]>
```

**Returns**:
```typescript
type HistoricoManualRecord = {
  id: string
  person_id: string
  school_id: string
  ano_letivo_id: string
  ano: number
  carga_horaria: number | null
  dias_letivos: number | null
  estado: string | null
  municipio: string | null
  unidade_escolar: string | null
  etapa_ensino_id: string | null
  etapa_nome: string | null
  situacao: string | null
  observacoes: string | null
  disciplinas: {
    id: string
    disciplina_id: string
    disciplina_nome: string
    media_final: number
    carga_horaria_anual: number | null
    parte_diversificada: boolean
  }[]
}
```

## removerHistoricoManual

```
removerHistoricoManual(id: string, pessoaLogadaId?: string | null): Promise<void>
```
