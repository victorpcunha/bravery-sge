'use client'

import type { LinhaAuditoria } from '@/lib/actions/auditoria'
import { StatusBadge } from '@/components/feedback/status-badge'

const LABELS: Record<string, string> = {
  nome: 'Nome',
  nome_completo: 'Nome Completo',
  nome_escola: 'Nome da Escola',
  descricao: 'Descrição',
  sigla: 'Sigla',
  cpf: 'CPF',
  cnpj: 'CNPJ',
  email: 'E-mail',
  status: 'Status',
  ativo: 'Ativo',
  ativa: 'Ativa',
  situacao: 'Situação',
  turma_id: 'Turma',
  disciplina: 'Disciplina',
  periodo: 'Período',
  quantidade: 'Quantidade',
  school_id: 'Escola',
  ano_letivo_id: 'Ano Letivo',
  data_matricula: 'Data da Matrícula',
  data_movimentacao: 'Data da Movimentação',
  data_inicio: 'Data de Início',
  data_termino: 'Data de Término',
  data_inicial: 'Data Inicial',
  data_final: 'Data Final',
  forma_ingresso: 'Forma de Ingresso',
  escolarizacao_externa: 'Escolarização Externa',
  codigo: 'Código',
  codigo_inep: 'Código INEP',
  turnos: 'Turnos',
  periodo_nome: 'Período',
  etapa_nome: 'Etapa',
  tipo_turma: 'Tipo de Turma',
  carga_horaria: 'Carga Horária',
  matricula_id: 'Matrícula',
  aluno_id: 'Aluno',
  tipo: 'Tipo',
  motivo: 'Motivo',
  observacoes: 'Observações',
  detalhes: 'Detalhes',
  titulo: 'Título',
  tema: 'Tema',
  conteudo: 'Conteúdo',
  periodo_nome_list: 'Períodos',
}

function formatarCampo(campo: string): string {
  if (LABELS[campo]) return LABELS[campo]
  return campo
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function formatarValor(valor: unknown): string {
  if (valor === null || valor === undefined || valor === '') return '—'
  if (typeof valor === 'boolean') return valor ? 'Sim' : 'Não'
  if (typeof valor === 'object') {
    try {
      const json = JSON.stringify(valor)
      return json && json !== '{}' && json !== '[]' ? json : '—'
    } catch {
      return String(valor)
    }
  }
  return String(valor)
}

function CamposLista({ dados }: { dados: Record<string, unknown> }) {
  const chaves = Object.entries(dados).filter(([k]) => !['id', 'created_at', 'updated_at', 'updated_by', 'created_by'].includes(k))
  if (chaves.length === 0) {
    return <p className="text-[13px] text-muted-foreground">Nenhum conteúdo capturado.</p>
  }
  return (
    <dl className="grid gap-x-6 gap-y-2 grid-cols-1 sm:grid-cols-2">
      {chaves.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-0.5 min-w-0">
          <dt className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            {formatarCampo(k)}
          </dt>
          <dd className="text-[13px] text-foreground break-words">
            {formatarValor(v)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function ResumoPanel({ resumo }: { resumo: Record<string, unknown> }) {
  const campos = Object.entries(resumo).filter(([k]) => k !== 'turma_id')
  return (
    <div className="rounded-md border border-border bg-muted/40 p-4 space-y-1.5">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Resumo do salvamento</p>
      {campos.map(([k, v]) => (
        <p key={k} className="text-[14px] text-foreground">
          <span className="font-medium">{formatarCampo(k)}:</span>{' '}
          <span className="text-muted-foreground">{formatarValor(v)}</span>
        </p>
      ))}
    </div>
  )
}

export function badgeTipoAcao(acao: LinhaAuditoria['acao']) {
  if (acao === 'criar') return <StatusBadge status="success">Criação</StatusBadge>
  if (acao === 'editar') return <StatusBadge status="info">Edição</StatusBadge>
  return <StatusBadge status="destructive">Exclusão</StatusBadge>
}

export function DetalhesAuditoria({ registro }: { registro: LinhaAuditoria }) {
  const ehAgregada = !!registro.resumo && Object.keys(registro.resumo).length > 0

  return (
    <div className="space-y-4 py-2">
      {ehAgregada && <ResumoPanel resumo={registro.resumo || {}} />}

      {registro.acao === 'editar' && Array.isArray(registro.alteracoes) && registro.alteracoes.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {ehAgregada ? 'Detalhes' : 'Campos alterados'}
          </p>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-muted text-left text-[12px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Campo</th>
                  <th className="px-3 py-2 font-medium">Valor anterior</th>
                  <th className="px-3 py-2 font-medium">Valor novo</th>
                </tr>
              </thead>
              <tbody>
                {registro.alteracoes.map((a, i) => (
                  <tr key={i} className="border-t border-border align-top">
                    <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">
                      {formatarCampo(a.campo)}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground break-words max-w-[280px]">
                      {formatarValor(a.anterior)}
                    </td>
                    <td className="px-3 py-2 text-foreground break-words max-w-[280px]">
                      {formatarValor(a.novo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {registro.acao !== 'editar' && (
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {registro.acao === 'criar' ? 'Conteúdo criado' : 'Conteúdo no momento da exclusão'}
          </p>
          <CamposLista dados={registro.acao === 'criar'
            ? (registro.dados_novos || {})
            : (registro.dados_anteriores || {})} />
        </div>
      )}

      {registro.acao === 'editar' && (!Array.isArray(registro.alteracoes) || registro.alteracoes.length === 0) && !ehAgregada && (
        <p className="text-[13px] text-muted-foreground">Nenhuma alteração de campo detectada (apenas metadados).</p>
      )}
    </div>
  )
}