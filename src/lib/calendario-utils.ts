export type DiaCalendario = { date: Date; diaSemana: number }
export type DiaCalendarioLetivo = { date: Date; diaSemana: number; isLetivo: boolean; isRecesso: boolean }

export function gerarDiasCalendario(dataInicio: string, dataTermino: string): DiaCalendario[] {
  const inicio = new Date(dataInicio)
  const termino = new Date(dataTermino)
  const dias: DiaCalendario[] = []

  const current = new Date(inicio)
  while (current <= termino) {
    dias.push({
      date: new Date(current),
      diaSemana: current.getDay(),
    })
    current.setDate(current.getDate() + 1)
  }

  return dias
}

export function getDiasLetivosPorMes(
  dias: DiaCalendario[],
  eventos: { data_inicio: string; data_termino: string; tipo: string }[]
): Record<string, { dias: DiaCalendarioLetivo[]; totalLetivos: number }> {
  const meses: Record<string, { dias: DiaCalendarioLetivo[]; totalLetivos: number }> = {}

  dias.forEach(dia => {
    const mesKey = `${dia.date.getFullYear()}-${String(dia.date.getMonth() + 1).padStart(2, '0')}`

    if (!meses[mesKey]) {
      meses[mesKey] = { dias: [], totalLetivos: 0 }
    }

    const diaNormalizado = `${dia.date.getFullYear()}-${String(dia.date.getMonth() + 1).padStart(2, '0')}-${String(dia.date.getDate()).padStart(2, '0')}`
    const eventosDoDia = eventos.filter(e => {
      const dataInicioNorm = e.data_inicio.split('T')[0]
      const dataTerminoNorm = e.data_termino.split('T')[0]
      return diaNormalizado >= dataInicioNorm && diaNormalizado <= dataTerminoNorm
    })

    let isLetivo: boolean
    let isRecesso: boolean

    if (eventosDoDia.length > 0) {
      const temRecesso = eventosDoDia.some(e => e.tipo === 'recesso')
      const temDiaLetivo = eventosDoDia.some(e => e.tipo === 'dia_letivo')
      const temNaoLetivo = eventosDoDia.some(e => e.tipo === 'nao_letivo')

      if (temRecesso) {
        isLetivo = false; isRecesso = true
      } else if (temDiaLetivo) {
        isLetivo = true; isRecesso = false
      } else if (temNaoLetivo) {
        isLetivo = false; isRecesso = false
      } else {
        isLetivo = dia.diaSemana !== 0 && dia.diaSemana !== 6; isRecesso = false
      }
    } else {
      isLetivo = dia.diaSemana !== 0 && dia.diaSemana !== 6; isRecesso = false
    }

    meses[mesKey].dias.push({
      date: dia.date,
      diaSemana: dia.diaSemana,
      isLetivo,
      isRecesso,
    })

    if (isLetivo) {
      meses[mesKey].totalLetivos++
    }
  })

  return meses
}