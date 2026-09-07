'use client'

import { useState } from 'react'
import { BarChart3, FilePlus2, Users, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { PageSection } from '@/components/layout/page-section'
import RelatorioMatriculas from './relatorio-matriculas'
import RelatorioDesempenho from './relatorio-desempenho'

type Props = {
  schoolId: string | null
  pessoaId: string | null
}

type RelatorioId = 'matriculas' | 'desempenho'

type RelatorioConfig = {
  id: RelatorioId
  titulo: string
  descricao: string
  icone: LucideIcon
}

const RELATORIOS: RelatorioConfig[] = [
  {
    id: 'matriculas',
    titulo: 'Relatório de Matrículas',
    descricao:
      'Alunos matriculados por ano letivo, turma e situação da matrícula, com resumo quantitativo e exportação em PDF e Excel.',
    icone: Users,
  },
  {
    id: 'desempenho',
    titulo: 'Relatório de Desempenho',
    descricao:
      'Médias por aluno e disciplina no período de avaliação, com indicador de desempenho em relação à média mínima do método numérico.',
    icone: BarChart3,
  },
]

function Minicard({ config, onGerar }: { config: RelatorioConfig; onGerar: () => void }) {
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
          Gerar Relatório
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function RelatoriosTab({ schoolId, pessoaId }: Props) {
  const [relatorio, setRelatorio] = useState<RelatorioId | null>(null)

  if (relatorio === 'matriculas') {
    return (
      <RelatorioMatriculas
        schoolId={schoolId}
        pessoaId={pessoaId}
        onVoltar={() => setRelatorio(null)}
      />
    )
  }

  if (relatorio === 'desempenho') {
    return (
      <RelatorioDesempenho
        schoolId={schoolId}
        pessoaId={pessoaId}
        onVoltar={() => setRelatorio(null)}
      />
    )
  }

  return (
    <PageSection
      title="Relatórios"
      description="Selecione um relatório para gerar a partir dos dados cadastrados no Bravery."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RELATORIOS.map(config => (
          <Minicard key={config.id} config={config} onGerar={() => setRelatorio(config.id)} />
        ))}
      </div>
    </PageSection>
  )
}
