'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FilePlus2, FileText, FolderOpen, GraduationCap, Loader2, ScrollText, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { PageSection } from '@/components/layout/page-section'
import { usePortal } from '@/components/portal/portal-provider'
import DocumentoGerador, { type DocumentoConfig, type DocumentoPdfProps } from '@/components/documentos/documento-gerador'
import {
  getDadosBoletimPortal,
  getDadosDeclaracaoPortal,
  getDadosFichaPortal,
  getDadosHistoricoPortal,
  getPeriodosBoletimPortal,
  listarDocumentosDisponiveisPortal,
  type DocumentoDisponivelPortal,
} from '@/lib/actions/portal'
import type { DadosBoletim } from '@/lib/actions/boletim'
import type { DadosDeclaracaoMatricula, DadosFichaIndividual } from '@/lib/actions/documentos'
import type { DadosHistoricoEscolar } from '@/lib/actions/historico-escolar'

const ICONES: Record<string, typeof FileText> = {
  declaracao: FileText,
  ficha: UserRound,
  boletim: GraduationCap,
  historico: ScrollText,
}

const DESCRICOES: Record<string, string> = {
  declaracao:
    'Documento oficial que comprova a matrícula do aluno nesta unidade escolar, informando ano letivo, turma, etapa e turno.',
  ficha:
    'Ficha cadastral e acadêmica consolidada do aluno: identificação, filiação, endereço, condições de saúde e dados de matrícula.',
  boletim:
    'Resultado por disciplina e frequência do aluno no período de avaliação selecionado, com base nos registros de notas do Diário de Classe.',
  historico:
    'Trajetória acadêmica do aluno nos anos letivos registrados no Bravery: disciplinas cursadas, notas finais numéricas e resultado final por ano, incluindo histórico anterior quando cadastrado.',
}

function Minicard({ doc, onGerar }: { doc: DocumentoDisponivelPortal; onGerar: () => void }) {
  const Icone = ICONES[doc.id] || FileText
  return (
    <Card size="sm" className="flex flex-col">
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icone className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-foreground leading-snug">{doc.titulo}</h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed mt-1.5">
            {DESCRICOES[doc.id] || 'Documento disponibilizado pela unidade escolar.'}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onGerar} className="w-full gap-2 min-h-[40px]">
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          Gerar Documento
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function DocumentosPortal() {
  const { aluno, escola, sessao } = usePortal()

  const responsavelId = sessao?.responsavel.id || ''
  const alunoId = aluno?.alunoId || ''
  const schoolId = escola?.schoolId || ''

  if (!aluno || !escola || !responsavelId) return null

  // Remount a cada troca de aluno/escola: zera galeria, seleção e erros sem setState em efeito.
  return (
    <ConteudoDocumentos
      key={`${responsavelId}|${alunoId}|${schoolId}`}
      responsavelId={responsavelId}
      alunoId={alunoId}
      schoolId={schoolId}
      alunoNome={aluno.nome}
      alunoTurma={aluno.turmaNome}
      anoLetivoId={aluno.anoLetivoId}
    />
  )
}

function ConteudoDocumentos({
  responsavelId,
  alunoId,
  schoolId,
  alunoNome,
  alunoTurma,
  anoLetivoId,
}: {
  responsavelId: string
  alunoId: string
  schoolId: string
  alunoNome: string
  alunoTurma: string | null
  anoLetivoId: string
}) {
  const [docs, setDocs] = useState<DocumentoDisponivelPortal[] | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [selecionado, setSelecionado] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    listarDocumentosDisponiveisPortal(responsavelId, alunoId, schoolId)
      .then(d => {
        if (!cancelado) setDocs(d)
      })
      .catch(err => {
        if (!cancelado) setErro(err instanceof Error ? err.message : 'Erro ao carregar documentos')
      })
    return () => {
      cancelado = true
    }
  }, [responsavelId, alunoId, schoolId])

  // useCallback/useMemo antes de qualquer early return (regras dos Hooks):
  // referência estável entre renders (props fixas por montagem) para não
  // reacender os efeitos do DocumentoGerador a cada render.
  const montarConfig = useCallback(
  (id: string): DocumentoConfig | null => {
    const doc = docs?.find(d => d.id === id)
    const altPreview = doc?.titulo || 'Documento'
    if (id === 'declaracao') {
      return {
        id,
        titulo: 'Declaração de Matrícula',
        descricao: DESCRICOES.declaracao,
        icone: FileText,
        altPreview,
        carregarPdf: async () => ({
          Componente: (await import('@/components/documentos/declaracao-matricula'))
            .DeclaracaoMatricula as unknown as React.ComponentType<DocumentoPdfProps>,
        }),
        buscarDados: (_a, _ano, sch) => getDadosDeclaracaoPortal(responsavelId, alunoId, sch || schoolId),
        nomeArquivo: dados =>
          `declaracao-matricula-${(dados as DadosDeclaracaoMatricula).aluno.nome_completo
            .replace(/\s+/g, '-')
            .toLowerCase()}.pdf`,
      }
    }
    if (id === 'ficha') {
      return {
        id,
        titulo: 'Ficha Individual do Aluno',
        descricao: DESCRICOES.ficha,
        icone: UserRound,
        altPreview,
        carregarPdf: async () => ({
          Componente: (await import('@/components/documentos/ficha-individual-aluno'))
            .FichaIndividualAluno as unknown as React.ComponentType<DocumentoPdfProps>,
        }),
        buscarDados: (_a, _ano, sch) => getDadosFichaPortal(responsavelId, alunoId, sch || schoolId),
        nomeArquivo: dados =>
          `ficha-individual-${(dados as DadosFichaIndividual).aluno.nome_completo
            .replace(/\s+/g, '-')
            .toLowerCase()}.pdf`,
      }
    }
    if (id === 'boletim') {
      return {
        id,
        titulo: 'Boletim Escolar',
        descricao: DESCRICOES.boletim,
        icone: GraduationCap,
        altPreview,
        carregarPdf: async () => ({
          Componente: (await import('@/components/documentos/boletim-escolar'))
            .BoletimEscolar as unknown as React.ComponentType<DocumentoPdfProps>,
        }),
        buscarPeriodos: (_a, _ano, sch) =>
          getPeriodosBoletimPortal(responsavelId, alunoId, sch || schoolId).then(res => ({
            ...res,
            // Adapta o motivo do motor para linguagem do responsável (FR-008/PE-402)
            motivo:
              res.motivo && !res.motivo.includes('secretaria')
                ? `${res.motivo} Procure a secretaria da escola para mais informações.`
                : res.motivo,
          })),
        buscarDados: (_a, _ano, sch, _p, periodo) =>
          getDadosBoletimPortal(responsavelId, alunoId, periodo, sch || schoolId),
        nomeArquivo: dados =>
          `boletim-escolar-${(dados as DadosBoletim).aluno.nome_completo
            .replace(/\s+/g, '-')
            .toLowerCase()}-periodo-${(dados as DadosBoletim).periodo.ordem}.pdf`,
      }
    }
    if (id === 'historico') {
      return {
        id,
        titulo: 'Histórico Escolar',
        descricao: DESCRICOES.historico,
        icone: ScrollText,
        altPreview,
        carregarPdf: async () => ({
          Componente: (await import('@/components/documentos/historico-escolar'))
            .HistoricoEscolar as unknown as React.ComponentType<DocumentoPdfProps>,
        }),
        semAnoLetivo: true,
        buscarDados: (_a, _ano, sch) => getDadosHistoricoPortal(responsavelId, alunoId, sch || schoolId),
        nomeArquivo: dados =>
          `historico-escolar-${(dados as DadosHistoricoEscolar).aluno.nome_completo
            .replace(/\s+/g, '-')
            .toLowerCase()}.pdf`,
      }
    }
    return null
  },
  [responsavelId, alunoId, schoolId, docs]
  )

  const configSelecionada = useMemo(
    () => (selecionado ? montarConfig(selecionado) : null),
    [selecionado, montarConfig]
  )

  const alunoFixo = {
    id: alunoId,
    nome_completo: alunoNome,
    turma_nome: alunoTurma,
    situacao: null,
    cpf: null,
  }
  const anoLetivoFixo = { id: anoLetivoId, descricao: '' }

  if (erro) {
    return (
      <PageSection title="Documentos" description={`${alunoNome} · ${alunoTurma}`}>
        <EmptyState icon={FolderOpen} title="Não foi possível carregar" description={erro} />
      </PageSection>
    )
  }

  if (!docs) {
    return (
      <PageSection title="Documentos" description={`${alunoNome} · ${alunoTurma}`}>
        <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <span className="text-[14px]">Carregando documentos...</span>
        </div>
      </PageSection>
    )
  }

  if (configSelecionada) {
    return (
      <DocumentoGerador
        key={alunoId}
        config={configSelecionada}
        schoolId={schoolId}
        pessoaId={null}
        alunoFixo={alunoFixo}
        anoLetivoFixo={anoLetivoFixo}
        geracaoDireta
        onVoltar={() => setSelecionado(null)}
      />
    )
  }

  if (docs.length === 0) {
    return (
      <PageSection title="Documentos" description={`${alunoNome} · ${alunoTurma}`}>
        <EmptyState
          icon={FolderOpen}
          title="Nenhum documento disponível"
          description="A unidade escolar ainda não liberou documentos para geração pelo portal. Procure a secretaria da escola para solicitar documentos."
        />
      </PageSection>
    )
  }

  return (
    <PageSection
      title="Documentos"
      description={`Documentos de ${alunoNome} · ${alunoTurma} disponíveis para geração.`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map(d => (
          <Minicard key={d.id} doc={d} onGerar={() => setSelecionado(d.id)} />
        ))}
      </div>
    </PageSection>
  )
}
