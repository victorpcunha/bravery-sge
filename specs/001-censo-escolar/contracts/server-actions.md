# Contracts: Censo Escolar – Matrícula Inicial 2026

## Server Actions

### `censo.ts` — Ação principal de validação e exportação

```typescript
// Executa todas as validações INEP sobre os dados existentes
validarCenso(schoolId: string, anoLetivoId: string): Promise<ResultadoValidacao>

// Gera o arquivo .txt (revalida antes de gerar)
exportarCenso(schoolId: string, anoLetivoId: string): Promise<ResultadoExportacao>
```

### `censo-regras.ts` — Funções internas de validação por registro

```typescript
// Cada função valida um registro e retorna lista de erros
validarRegistro00(schoolId: string): Promise<ErroValidacao[]>
validarRegistro10(schoolId: string): Promise<ErroValidacao[]>
validarRegistro20(schoolId: string): Promise<ErroValidacao[]>
validarRegistro30(schoolId: string): Promise<ErroValidacao[]>
validarRegistro40(schoolId: string): Promise<ErroValidacao[]>
validarRegistro50(schoolId: string): Promise<ErroValidacao[]>
validarRegistro60(schoolId: string): Promise<ErroValidacao[]>

// Validações cross-registro
validarVinculosAluno(schoolId: string): Promise<ErroValidacao[]>
validarDescaracterizacao(schoolId: string): Promise<ErroValidacao[]>
validarHorariosCoincidentes(schoolId: string): Promise<ErroValidacao[]>
```

## Response Contracts

```typescript
interface ResultadoValidacao {
  valido: boolean
  total_erros: number
  erros_por_registro: {
    registro00: ErroValidacao[]   // Dados da Escola
    registro10: ErroValidacao[]   // Infraestrutura
    registro20: ErroValidacao[]   // Turmas
    registro30: ErroValidacao[]   // Pessoas
    registro40: ErroValidacao[]   // Gestores
    registro50: ErroValidacao[]   // Profissionais × Turma
    registro60: ErroValidacao[]   // Matrículas
  }
  erros_vinculos: ErroValidacao[] // Validações cross-registro
}

interface ErroValidacao {
  registro: string             // "00" a "60"
  campo_inep: string           // Nome oficial do campo no INEP (ex: "Nome da escola")
  numero_campo: number         // Número do campo na estrutura INEP
  regra: string               // Descrição da regra violada (texto oficial INEP)
  mensagem: string            // Mensagem de erro formatada
  valor_atual: string | null  // Valor que causou o erro (para exibição)
  entidade_id: string         // ID da entidade (escola, turma, pessoa) para redirecionamento
  entidade_nome: string       // Nome da entidade (para exibição no erro)
  url_correcao: string        // URL para a tela de correção com parâmetros
  secao: string | null        // Seção/aba específica na tela de destino
  campo_destino: string | null // Campo específico para foco na tela de destino
}

interface ResultadoExportacao {
  sucesso: boolean
  erros?: ErroValidacao[]     // Se houver erros, exportação bloqueada
  arquivo?: {
    conteudo: string          // Conteúdo do arquivo .txt
    nome: string              // Nome do arquivo para download
    encoding: string          // "ISO-8859-1"
    tamanho_bytes: number
    total_linhas: number
    registros: {
      escola: number          // 1
      registro00: number      // 1
      registro10: number      // 1
      registro20: number      // N turmas
      registro30: number      // M pessoas
      registro40: number      // 1-3 gestores
      registro50: number      // N vínculos
      registro60: number      // N matrículas
    }
  }
}
```

## Reference Data (Static JSON/TypeScript)

```typescript
// Anexo 3 — Idades Permitidas
interface FaixaEtaria {
  etapa_codigo?: number
  idade_min: number
  idade_max: number
  tipo: 'gestor' | 'profissional' | 'aluno' | 'caracteristica'
  caracteristica?: string
}

// Anexo 4 — Recursos × Deficiências
interface CompatibilidadeRecurso {
  recurso_campo: number       // 36-48
  recurso_nome: string
  deficiencia: string         // nome da deficiência
  compatibilidade: 'X' | 'N' | null  // X=permitido, N=proibido, null=incompatível
}

// Anexo 5 — Contratação × Dependência
interface ContratacaoPermitida {
  forma: string               // nome da forma de contratação
  campo_estadual: number      // campo INEP (35-40)
  campo_municipal: number     // campo INEP (41-46)
  dependencias: string[]      // ['Federal', 'Estadual', 'Municipal', 'Privada(Particular)', 'Privada(não Particular)']
}

// Anexo 6 — Etapas × Forma de Organização
interface FormaOrganizacaoCompativel {
  etapa_codigo: number
  formas: number[]            // [1, 3, 4, 5] — códigos de formas compatíveis
}
```

## URL de Redirecionamento por Registro

| Registro | URL Base | Parâmetros |
|---|---|---|
| 00 (escola) | `/escolas/[id]` | `?tab=identificacao`, `?tab=endereco`, `?tab=administrativo`, `?tab=parcerias` |
| 10 (infraestrutura) | `/escolas/[id]` | `?tab=infraestrutura` |
| 20 (turma) | `/gestao-turmas/turmas/[id]` | — |
| 20 (sem profissional) | `/gestao-turmas/quadro-aulas/` | `?turma=[id]` |
| 30 (pessoa) | `/gestao-usuarios/usuarios/[id]` | `?tab=deficiencias`, `?tab=formacao` |
| 40 (gestor) | `/escolas/[id]` | `?tab=gestores` |
| 50 (profissional) | `/gestao-turmas/quadro-aulas/` | `?turma=[id]` |
| 60 (matrícula) | `/gestao-academica/matriculas/` | `?turma=[id]` |
