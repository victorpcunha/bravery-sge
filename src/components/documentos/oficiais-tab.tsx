'use client'

import { useState } from 'react'
import { FilePlus2, FileText, GraduationCap, UserRound } from 'lucide-react'
import {
  getDadosDeclaracaoMatricula,
  getDadosFichaIndividual,
  type DadosDeclaracaoMatricula,
  type DadosFichaIndividual,
} from '@/lib/actions/documentos'
import { getDadosBoletim, getPeriodosBoletim, type DadosBoletim } from '@/lib/actions/boletim'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { PageSection } from '@/components/layout/page-section'
import DocumentoGerador, { type DocumentoConfig, type DocumentoPdfProps } from './documento-gerador'

type Props = {
  schoolId: string
  pessoaId: string | null
}

const declaracaoConfig: DocumentoConfig = {
  id: 'declaracao',
  titulo: 'Declaração de Matrícula',
  descricao:
    'Documento oficial que comprova a matrícula do aluno nesta unidade escolar, informando ano letivo, turma, etapa e turno.',
  icone: FileText,
  carregarPdf: async () => ({
    Componente: (await import('./declaracao-matricula'))
      .DeclaracaoMatricula as unknown as React.ComponentType<DocumentoPdfProps>,
  }),
  buscarDados: getDadosDeclaracaoMatricula,
  nomeArquivo: dados =>
    `declaracao-matricula-${(dados as DadosDeclaracaoMatricula).aluno.nome_completo
      .replace(/\s+/g, '-')
      .toLowerCase()}.pdf`,
  altPreview: 'Declaração de Matrícula',
}

const fichaConfig: DocumentoConfig = {
  id: 'ficha',
  titulo: 'Ficha Individual do Aluno',
  descricao:
    'Ficha cadastral e acadêmica consolidada do aluno: identificação, filiação, endereço, condições de saúde e dados de matrícula.',
  icone: UserRound,
  carregarPdf: async () => ({
    Componente: (await import('./ficha-individual-aluno'))
      .FichaIndividualAluno as unknown as React.ComponentType<DocumentoPdfProps>,
  }),
  buscarDados: getDadosFichaIndividual,
  nomeArquivo: dados =>
    `ficha-individual-${(dados as DadosFichaIndividual).aluno.nome_completo
      .replace(/\s+/g, '-')
      .toLowerCase()}.pdf`,
  altPreview: 'Ficha Individual do Aluno',
}

const boletimConfig: DocumentoConfig = {
  id: 'boletim',
  titulo: 'Boletim Escolar',
  descricao:
    'Resultado por disciplina e frequência do aluno no período de avaliação selecionado, com base nos registros de notas do Diário de Classe.',
  icone: GraduationCap,
  carregarPdf: async () => ({
    Componente: (await import('./boletim-escolar'))
      .BoletimEscolar as unknown as React.ComponentType<DocumentoPdfProps>,
  }),
  buscarPeriodos: getPeriodosBoletim,
  buscarDados: getDadosBoletim,
  nomeArquivo: dados =>
    `boletim-escolar-${(dados as DadosBoletim).aluno.nome_completo
      .replace(/\s+/g, '-')
      .toLowerCase()}-periodo-${(dados as DadosBoletim).periodo.ordem}.pdf`,
  altPreview: 'Boletim Escolar',
}

function Minicard({ config, onGerar }: { config: DocumentoConfig; onGerar: () => void }) {
  const Icone = config.icone
  return (
    <Card size="sm" className="flex flex-col">
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icone className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-foreground leading-snug">{config.titulo}</h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed mt-1.5">{config.descricao}</p>
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

export default function OficiaisTab({ schoolId, pessoaId }: Props) {
  const [documento, setDocumento] = useState<'declaracao' | 'ficha' | 'boletim' | null>(null)

  const config =
    documento === 'declaracao'
      ? declaracaoConfig
      : documento === 'ficha'
      ? fichaConfig
      : documento === 'boletim'
      ? boletimConfig
      : null

  if (config) {
    return (
      <DocumentoGerador
        config={config}
        schoolId={schoolId}
        pessoaId={pessoaId}
        onVoltar={() => setDocumento(null)}
      />
    )
  }

  return (
    <PageSection
      title="Documentos Oficiais"
      description="Selecione um documento para gerar a partir dos dados cadastrados no Bravery."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Minicard config={declaracaoConfig} onGerar={() => setDocumento('declaracao')} />
        <Minicard config={fichaConfig} onGerar={() => setDocumento('ficha')} />
        <Minicard config={boletimConfig} onGerar={() => setDocumento('boletim')} />
      </div>
    </PageSection>
  )
}