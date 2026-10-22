# Contracts: Gestão de Faturamento

**Feature**: `043-gestao-faturamento` | **Date**: 2026-09-29

Contratos das Server Actions (`src/lib/actions/faturamento.ts`, `'use server'` + `getSupabaseAdmin()`). Toda mutação recebe `pessoaId?: string | null` como último parâmetro, valida com `validarPermissaoEstrita` no recurso correspondente e registra auditoria (módulo `Faturamento`). Convenção de erro: `throw new Error('mensagem amigável')` (sem vazar SQL — PE-402).

## Tipos compartilhados (`src/lib/faturamento-tipos.ts`, neutro)

```ts
type SituacaoMensalidade = 'pendente' | 'pago' | 'cancelado' | 'isento';
type SituacaoDerivada = SituacaoMensalidade | 'vencida';       // exibição
type SituacaoMatriculaFat = 'em_dia' | 'pendente' | 'vencida' | 'sem_plano';
type FiltroSituacaoCobranca = 'todas' | 'pagas' | 'em_aberto' | 'vencidas' | 'canceladas' | 'isentas';

interface ResumoGeracao {
  totalMatriculas: number; seguirãoPadrao: number; jaConfiguradas: number;
  inconsistentes: { matriculaId: string; alunoNome: string; motivo: string; proximoPasso: string }[];
  naoAfetadas: number; mensalidadesEstimadas: number; valorTotalPrevisto: number | null;
}
interface ResultadoLote { criados: string[]; falhas: { id: string; nome: string; motivo: string; proximoPasso: string }[]; preservados: number; }
```

## Actions (assinaturas)

```ts
// Visão geral — recurso faturamento.visao-geral (leitura)
getVisaoGeral(schoolId: string | null, filtros: { anoLetivoId: string; turmaId?: string; de?: string; ate?: string })
  : Promise<{ previsto: number; recebido: number; emAberto: number; vencido: number;
      pendencias: { tipo: 'sem_plano' | 'vencidas' | 'sem_responsavel' | 'config_incompleta';
                    quantidade: number; acao: string }[] }>

// Cobranças — recurso faturamento.cobrancas (leitura)
listarCobrancas(schoolId: string | null, filtros: { anoLetivoId: string; turmaId?; alunoId?; responsavelId?;
  situacao: FiltroSituacaoCobranca; competenciaDe?; competenciaAte?; page: number })
  : Promise<{ total: number; itens: MensalidadeComContexto[] }>   // 10/pág, server-side

// Configuração — recurso faturamento.configuracao
getConfiguracoes(schoolId: string, anoLetivoId: string): Promise<Configuracao[]>
salvarConfiguracao(input: ConfigInput, pessoaId?): Promise<Configuracao>   // nunca toca planos (FR-006)

// Geração em massa — recurso faturamento.cobrancas (criar)
simularGeracao(schoolId: string, abrangencia: { anoLetivoId: string; turmaId?; etapaId?; matriculaIds? },
  overrides?: Partial<ConfigInput>): Promise<ResumoGeracao>               // só leitura
gerarPlanosEmMassa(schoolId: string, abrangencia: {...}, opts: { substituir?: boolean; configId?: string },
  pessoaId?): Promise<ResultadoLote>                                       // substituir exige confirmação no client; auditoria agregada

// Plano individual — recurso faturamento.cobrancas
getPlanoPorMatricula(matriculaId: string): Promise<PlanoDetalhado | null>
criarPlanoIndividual(input: PlanoInput, pessoaId?): Promise<PlanoDetalhado>
atualizarPlano(planoId: string, patch: Partial<PlanoInput>, pessoaId?): Promise<PlanoDetalhado>
tratarSaidaMatricula(matriculaId: string, cancelarFuturas: boolean, pessoaId?): Promise<{ canceladas: number }>

// Baixa — recurso faturamento.cobrancas (editar)
baixarMensalidades(ids: string[], baixa: { pagoEm: string; forma: string; observacao?: string }, pessoaId?)
  : Promise<{ baixadas: number; ignoradas: { id: string; motivo: string }[] }>  // auditoria agregada
isentarMensalidades(ids: string[], motivo: string, pessoaId?): Promise<{ isentas: number }>
cancelarMensalidades(ids: string[], motivo: string, pessoaId?): Promise<{ canceladas: number }>

// Visão da matrícula — reutiliza getPlanoPorMatricula (mesmo domínio, FR-017)
```

## Regras contratuais

1. `simularGeracao` NUNCA escreve; `gerarPlanosEmMassa` sem `substituir` NUNCA altera plano existente (retorna em `preservados`).
2. `baixarMensalidades` ignora (não falha) mensalidades não-pendentes, relatando em `ignoradas`.
3. Competência sempre dia 1º; vencimento = `min(dia, último dia do mês)` — cálculo em `src/lib/faturamento-calculo.ts` (neutro, puro, testável).
4. Auditoria: individual → `registrarAuditoria` (entidade `faturamento_planos`/`faturamento_mensalidades`); massa → `registrarAuditoriaAgregada` (`resumo: {quantidade, valorTotal?, turmas?}`).
