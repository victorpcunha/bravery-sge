'use client'

import { useState, useEffect } from 'react'
import { getResumoAluno, type ResumoAluno } from '@/lib/actions/painel-pessoa'
import { StatCard } from '@/components/ui/stat-card'
import { Loader2, TrendingUp, ClipboardCheck, BookOpen, AlertTriangle } from 'lucide-react'

type Props = {
  pessoaId: string
  turmaId: string
  schoolId: string | null
  pessoaLogadaId: string | null
}

export default function CardKpis({ pessoaId, turmaId, schoolId, pessoaLogadaId }: Props) {
  const [resumo, setResumo] = useState<ResumoAluno | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getResumoAluno(pessoaId, turmaId, schoolId, pessoaLogadaId)
      .then(setResumo)
      .catch(() => setResumo(null))
      .finally(() => setLoading(false))
  }, [pessoaId, turmaId, schoolId, pessoaLogadaId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-[120px] animate-pulse bg-muted rounded-xl" />
        ))}
      </div>
    )
  }

  if (!resumo) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-[120px] rounded-xl border border-border bg-card flex items-center justify-center">
            <Loader2 className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    )
  }

  const freqInfo = resumo.frequencia_presencas != null && resumo.frequencia_total != null
    ? `Presenças: ${resumo.frequencia_presencas}/${resumo.frequencia_total}`
    : 'Sem registros de frequência'

  const desempenhoInfo = resumo.desempenho_percentual != null
    ? `Média da turma: ${resumo.desempenho_turma ?? '—'}`
    : 'Sem notas registradas'

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        icon={ClipboardCheck}
        value={resumo.frequencia_percentual != null ? `${resumo.frequencia_percentual}%` : '—'}
        label={freqInfo}
        variant={resumo.frequencia_percentual != null && resumo.frequencia_percentual >= 75 ? 'success' : resumo.frequencia_percentual != null ? 'warning' : 'default'}
      />
      <StatCard
        icon={TrendingUp}
        value={resumo.desempenho_percentual != null ? resumo.desempenho_percentual.toFixed(1) : '—'}
        label={desempenhoInfo}
        variant={resumo.desempenho_percentual != null && resumo.desempenho_percentual >= 7 ? 'success' : resumo.desempenho_percentual != null ? 'warning' : 'default'}
      />
      <StatCard
        icon={BookOpen}
        value={resumo.total_disciplinas}
        label="Disciplinas na turma"
        variant="default"
      />
      <StatCard
        icon={AlertTriangle}
        value={resumo.total_ocorrencias}
        label="Ocorrências registradas"
        variant={resumo.total_ocorrencias > 0 ? 'warning' : 'default'}
      />
    </div>
  )
}