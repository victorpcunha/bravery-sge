# Contracts: Rematrículas — Server Actions

**Feature**: `035-rematriculas` | **Date**: 2026-09-16

Contratos das duas novas actions em `src/lib/actions/rematriculas.ts`. Leituras de anos/etapas/turmas reutilizam actions existentes (`getAnosLetivos`, `getEtapasEnsino`, `getTurmasAtivas`) — sem contrato novo.

## `listarAlunosElegiveis`

Lista os alunos rematriculáveis para um par origem + situação.

```ts
type ListarElegiveisInput = {
  schoolId: string
  turmaOrigemId: string
  situacoes: (
    | 'Aprovado'
    | 'Aprovado por conselho de classe'
    | 'Aprovado concluinte'
    | 'Reprovado'
    | 'Reprovado por frequência'
  )[]
  anoDestinoId: string
  pessoaId?: string | null
}

type AlunoElegivel = {
  matriculaOrigemId: string
  alunoId: string
  nome: string
  cpf: string
  situacao: string
}

type ListarElegiveisResult = {
  alunos: AlunoElegivel[]
  jaMatriculados: number  // excluídos da lista por já terem matrícula ativa no destino
}

listarAlunosElegiveis(input: ListarElegiveisInput): Promise<ListarElegiveisResult>
```

Regras: retorna só matrículas `ativo = true` da turma de origem cuja `situacao` ∈ filtro; exclui alunos com matrícula ativa no `anoDestinoId`; ordena por nome.

## `rematricularLote`

Cria as matrículas no ano de destino, uma por aluno, com resultado parcial por aluno.

```ts
type ItemLote = {
  alunoId: string
  turmaDestinoId: string
  etapaDestinoId: string
}

type RematricularLoteInput = {
  schoolId: string
  anoDestinoId: string
  turmaOrigemId: string
  familiaSituacao: 'aprovado' | 'reprovado'  // família selecionada na origem
  etapaOrigemId: string
  dataMatricula: string  // YYYY-MM-DD, ≤ hoje
  itens: ItemLote[]
  pessoaId?: string | null
}

type FalhaItem = {
  alunoId: string
  nome: string
  motivo: string        // ex. "já possui matrícula ativa em turma Curricular (…)"
  proximoPasso: string  // orientação em linguagem do usuário
}

type RematricularLoteResult = {
  criados: { alunoId: string; nome: string; matriculaId: string }[]
  falhas: FalhaItem[]
  jaMatriculados: number
}

rematricularLote(input: RematricularLoteInput): Promise<RematricularLoteResult>
```

Validações server-side (autoritativas, nesta ordem): autenticado + `validarPermissaoServer(pessoaId, 'gestao-academica.rematriculas', 'criar')` + escopo da escola → `dataMatricula` ≤ hoje → consistência Situação × Etapa por item (tabela em `data-model.md`) → turma destino pertence à etapa de destino e ao ano de destino → criação via `createMatricula` por item com erro capturado por item (Regra Geral, duplicidade e corrida viram `falhas`, nunca abortam o lote).

Pós-condições: `criados.length + falhas.length ≤ itens.length` (itens já matriculados contam em `jaMatriculados`); cada criado possui auditoria individual (via `createMatricula`); nenhum item da família Aprovado persiste com etapa igual à origem e vice-versa.
