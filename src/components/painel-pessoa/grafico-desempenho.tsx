'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { type DesempenhoComparativo } from '@/lib/actions/painel-pessoa'

type Props = {
  data: DesempenhoComparativo | null
  loading?: boolean
}

export default function GraficoDesempenho({ data, loading }: Props) {
  if (loading) {
    return <div className="h-48 animate-pulse bg-slate-100 rounded-lg" />
  }

  if (!data) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Nenhum dado de desempenho disponível para este período.
      </p>
    )
  }

  const chartData = data.disciplinas.map(d => ({
    name: d.disciplina_nome.length > 12 ? d.disciplina_nome.slice(0, 12) + '…' : d.disciplina_nome,
    Aluno: d.aluno_nota ?? 0,
    'Média da Turma': d.turma_media,
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 'auto']} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
            formatter={(value: unknown) => {
              const v = Number(value)
              return [Number.isNaN(v) ? '0.00' : v.toFixed(2), 'Nota']
            }}
          />
          <Legend fontSize={12} />
          <Bar dataKey="Aluno" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="Média da Turma" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
