'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

export type DashboardData = {
  docentes: number
  turmas: number
  alunos: number
  matriculas: number
  anoLetivo: { descricao: string; status: string } | null

  alunosPorEtapa: { etapa: string; quantidade: number }[]
  alunosPorTipoTurma: { tipo: string; quantidade: number }[]
  alunosPorDeficiencia: { nome: string; quantidade: number }[]
  alunosPorTranstorno: { nome: string; quantidade: number }[]
  alunosPorModalidade: { modalidade: string; quantidade: number }[]
  alunosPorTurno: { turno: string; quantidade: number }[]

  ocupacao: { capacidadeTotal: number; matriculasAtivas: number }
  frequenciaMedia: { presencas: number; total: number } | null
  riscoEvasao: { turma: string; totalAlunos: number; alunosBaixaFrequencia: number; percentualMedioFaltas: number }[]

  aniversariantes: { nome: string; data: string; turma: string }[]
  turmasSemProfessor: { turma: string; disciplinas: string[] }[]

  ocupacaoPorTurma: { turma: string; capacidade: number; matriculas: number }[]
  frequenciaPorTurma: { turma: string; presencas: number; total: number }[]
}

export async function getDashboardData(schoolId: string | null): Promise<DashboardData> {

  const [
    docentesRes,
    turmasRes,
    alunosRes,
    matriculasRes,
    anoLetivoRes,
    alunosPorEtapaRes,
    alunosPorTipoRes,
    alunosPorDeficienciaRes,
    alunosPorTranstornoRes,
    alunosPorModalidadeRes,
    alunosPorTurnoRes,
    ocupacaoRes,
    frequenciaRes,
    riscoEvasaoRes,
    aniversariantesRes,
    ocupacaoPorTurmaRes,
    frequenciaPorTurmaRes,
    turmasSemProfRes,
  ] = await Promise.all([
    // 1. Docentes — DISTINCT profissionais com vínculo ativo em turma
    (async () => {
      let query = supabase.from('turmas_profissionais')
        .select('person_id, turmas!inner(school_id)', { count: 'exact', head: true })
        .eq('ativo', true)
      if (schoolId) query = query.eq('turmas.school_id', schoolId)
      return query
    })(),

    // 2. Turmas ativas
    (async () => {
      let query = supabase.from('turmas').select('id', { count: 'exact', head: true }).eq('ativo', true)
      if (schoolId) query = query.eq('school_id', schoolId)
      return query
    })(),

    // 3. Alunos — DISTINCT pessoas com matrícula ativa
    (async () => {
      let query = supabase.from('academico_matriculas')
        .select('aluno_id', { count: 'exact', head: true })
        .eq('ativo', true)
        .eq('situacao', 'Ativo')
      if (schoolId) query = query.eq('school_id', schoolId)
      return query
    })(),

    // 4. Matrículas — total de registros ativos
    (async () => {
      let query = supabase.from('academico_matriculas')
        .select('id', { count: 'exact', head: true })
        .eq('ativo', true)
        .eq('situacao', 'Ativo')
      if (schoolId) query = query.eq('school_id', schoolId)
      return query
    })(),

    // 5. Ano letivo ativo
    (async () => {
      let query = supabase.from('academico_anos_letivos')
        .select('descricao, status')
        .eq('status', 'ativo')
        .limit(1)
      if (schoolId) query = query.eq('school_id', schoolId)
      return query
    })(),

    // 6. Alunos por Etapa
    (async () => {
      let query = supabase.from('academico_matriculas')
        .select('etapa_ensino_id, academico_etapas_ensino!inner(etapa_nome)')
        .eq('ativo', true)
        .eq('situacao', 'Ativo')
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data } = await query

      if (!data) return [] as { etapa: string; quantidade: number }[]

      const map = new Map<string, Set<string>>()
      for (const row of data) {
        const nome = (row as any).academico_etapas_ensino?.etapa_nome || 'Sem etapa'
        const alunoId = (row as any).aluno_id
        if (!map.has(nome)) map.set(nome, new Set())
        map.get(nome)!.add(alunoId)
      }

      return Array.from(map.entries())
        .map(([etapa, alunos]) => ({ etapa, quantidade: alunos.size }))
        .sort((a, b) => b.quantidade - a.quantidade)
    })(),

    // 8. Alunos por Tipo de Turma
    (async () => {
      let query = supabase.from('academico_matriculas')
        .select('aluno_id, turma_id, turmas!inner(tipos_turma)')
        .eq('ativo', true)
        .eq('situacao', 'Ativo')
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data } = await query

      if (!data) return [] as { tipo: string; quantidade: number }[]

      const map = new Map<string, Set<string>>()
      for (const row of data) {
        const tiposTurma = (row as any).turmas?.tipos_turma
        const alunoId = (row as any).aluno_id
        const tipos: string[] = Array.isArray(tiposTurma) ? tiposTurma : []
        for (const tipo of tipos) {
          if (!map.has(tipo)) map.set(tipo, new Set())
          map.get(tipo)!.add(alunoId)
        }
        if (tipos.length === 0) {
          const semTipo = 'Não definido'
          if (!map.has(semTipo)) map.set(semTipo, new Set())
          map.get(semTipo)!.add(alunoId)
        }
      }

      return Array.from(map.entries())
        .map(([tipo, alunos]) => ({ tipo, quantidade: alunos.size }))
        .sort((a, b) => b.quantidade - a.quantidade)
    })(),

    // 9. Alunos por Deficiência
    (async () => {
      let query = supabase.from('academico_matriculas')
        .select('aluno_id, people!inner(cegueira, baixa_visao, visao_monocular, surdez, deficiencia_auditiva, surdocegueira, deficiencia_fisica, deficiencia_intelectual, deficiencia_multipla, tea, altas_habilidades)')
        .eq('ativo', true)
        .eq('situacao', 'Ativo')
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data } = await query

      if (!data) return [] as { nome: string; quantidade: number }[]

      const deficiencias = [
        { col: 'cegueira', nome: 'Cegueira' },
        { col: 'baixa_visao', nome: 'Baixa Visão' },
        { col: 'visao_monocular', nome: 'Visão Monocular' },
        { col: 'surdez', nome: 'Surdez' },
        { col: 'deficiencia_auditiva', nome: 'Deficiência Auditiva' },
        { col: 'surdocegueira', nome: 'Surdocegueira' },
        { col: 'deficiencia_fisica', nome: 'Deficiência Física' },
        { col: 'deficiencia_intelectual', nome: 'Deficiência Intelectual' },
        { col: 'deficiencia_multipla', nome: 'Deficiência Múltipla' },
        { col: 'tea', nome: 'TEA (Autismo)' },
        { col: 'altas_habilidades', nome: 'Altas Habilidades' },
      ]

      const result = deficiencias.map(d => {
        const alunos = new Set(
          data
            .filter((row: any) => row.people?.[d.col] === true)
            .map((row: any) => row.aluno_id)
        )
        return { nome: d.nome, quantidade: alunos.size }
      })

      return result.filter(r => r.quantidade > 0).sort((a, b) => b.quantidade - a.quantidade)
    })(),

    // 10. Alunos por Transtorno
    (async () => {
      let query = supabase.from('academico_matriculas')
        .select('aluno_id, people!inner(transtorno_aprendizagem, dislexia, tdah, discalculia, disgrafia, dislalia, tpac)')
        .eq('ativo', true)
        .eq('situacao', 'Ativo')
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data } = await query

      if (!data) return [] as { nome: string; quantidade: number }[]

      const transtornos = [
        { col: 'transtorno_aprendizagem', nome: 'Transtorno de Aprendizagem' },
        { col: 'dislexia', nome: 'Dislexia' },
        { col: 'tdah', nome: 'TDAH' },
        { col: 'discalculia', nome: 'Discalculia' },
        { col: 'disgrafia', nome: 'Disgrafia' },
        { col: 'dislalia', nome: 'Dislalia' },
        { col: 'tpac', nome: 'TPAC' },
      ]

      const result = transtornos.map(t => {
        const alunos = new Set(
          data
            .filter((row: any) => row.people?.[t.col] === true)
            .map((row: any) => row.aluno_id)
        )
        return { nome: t.nome, quantidade: alunos.size }
      })

      return result.filter(r => r.quantidade > 0).sort((a, b) => b.quantidade - a.quantidade)
    })(),

    // 11. Alunos por Modalidade
    (async () => {
      let query = supabase.from('academico_matriculas')
        .select('aluno_id, turmas!inner(modalidade)')
        .eq('ativo', true)
        .eq('situacao', 'Ativo')
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data } = await query

      if (!data) return [] as { modalidade: string; quantidade: number }[]

      const map = new Map<string, Set<string>>()
      for (const row of data) {
        const modalidade = (row as any).turmas?.modalidade || 'Não definida'
        const alunoId = (row as any).aluno_id
        if (!map.has(modalidade)) map.set(modalidade, new Set())
        map.get(modalidade)!.add(alunoId)
      }

      return Array.from(map.entries())
        .map(([modalidade, alunos]) => ({ modalidade, quantidade: alunos.size }))
        .sort((a, b) => b.quantidade - a.quantidade)
    })(),

    // 12. Alunos por Turno
    (async () => {
      let query = supabase.from('academico_matriculas')
        .select('aluno_id, turmas!inner(turnos)')
        .eq('ativo', true)
        .eq('situacao', 'Ativo')
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data } = await query

      if (!data) return [] as { turno: string; quantidade: number }[]

      const map = new Map<string, Set<string>>()
      for (const row of data) {
        const turnos = (row as any).turmas?.turnos
        const alunoId = (row as any).aluno_id
        const turnosArr: { turno: string }[] = Array.isArray(turnos) ? turnos : []
        for (const t of turnosArr) {
          const turnoNome = t.turno || 'Não definido'
          if (!map.has(turnoNome)) map.set(turnoNome, new Set())
          map.get(turnoNome)!.add(alunoId)
        }
        if (turnosArr.length === 0) {
          const semTurno = 'Não definido'
          if (!map.has(semTurno)) map.set(semTurno, new Set())
          map.get(semTurno)!.add(alunoId)
        }
      }

      return Array.from(map.entries())
        .map(([turno, alunos]) => ({ turno, quantidade: alunos.size }))
        .sort((a, b) => b.quantidade - a.quantidade)
    })(),

    // 13. Ocupação
    (async () => {
      let query = supabase.from('turmas')
        .select('id, capacidade_alunos')
        .eq('ativo', true)
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data: turmas } = await query
      if (!turmas || turmas.length === 0) return { capacidadeTotal: 0, matriculasAtivas: 0 }

      const capacidadeTotal = turmas.reduce((sum: number, t: any) => sum + (t.capacidade_alunos || 0), 0)
      const turmaIds = turmas.map((t: any) => t.id)

      const { count: matriculasAtivas } = await supabase
        .from('academico_matriculas')
        .select('id', { count: 'exact', head: true })
        .in('turma_id', turmaIds)
        .eq('ativo', true)
        .eq('situacao', 'Ativo')

      return { capacidadeTotal, matriculasAtivas: matriculasAtivas || 0 }
    })(),

    // 14. Frequência Média
    (async () => {
      let anoQuery = supabase.from('academico_anos_letivos')
        .select('data_inicio')
        .eq('status', 'ativo')
        .limit(1)
      if (schoolId) anoQuery = anoQuery.eq('school_id', schoolId)
      const { data: anoAtivoData } = await anoQuery

      if (!anoAtivoData || anoAtivoData.length === 0) return null
      const dataInicio = anoAtivoData[0].data_inicio

      let query = supabase.from('academico_frequencias_dia')
        .select('status', { count: 'exact' })
        .gte('dia_letivo', dataInicio)
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data: freqData, count } = await query

      if (!freqData || freqData.length === 0) return null

      const presencas = freqData.filter((f: any) => f.status === 'P').length
      return { presencas, total: count || 0 }
    })(),

    // 15. Risco de Evasão
    (async () => {
      let query = supabase.from('turmas')
        .select('id, nome')
        .eq('ativo', true)
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data: turmasData } = await query
      if (!turmasData || turmasData.length === 0) return []

      const resultado: DashboardData['riscoEvasao'] = []

      for (const turma of turmasData) {
        const { data: matriculas } = await supabase
          .from('academico_matriculas')
          .select('aluno_id')
          .eq('turma_id', turma.id)
          .eq('ativo', true)
          .eq('situacao', 'Ativo')

        if (!matriculas || matriculas.length === 0) continue

        let alunosBaixaFrequencia = 0
        let somaFaltas = 0
        let totalComFreq = 0

        for (const mat of matriculas) {
          const { data: freqs } = await supabase
            .from('academico_frequencias_dia')
            .select('status')
            .eq('turma_id', turma.id)
            .eq('aluno_id', mat.aluno_id)

          if (!freqs || freqs.length === 0) continue

          const faltas = freqs.filter(f => f.status === 'F' || f.status === 'FJ').length
          const totalDias = freqs.length
          const taxaFalta = totalDias > 0 ? faltas / totalDias : 0

          if (taxaFalta > 0.25) alunosBaixaFrequencia++
          somaFaltas += taxaFalta
          totalComFreq++
        }

        if (alunosBaixaFrequencia > 0) {
          resultado.push({
            turma: turma.nome,
            totalAlunos: matriculas.length,
            alunosBaixaFrequencia,
            percentualMedioFaltas: totalComFreq > 0 ? Math.round((somaFaltas / totalComFreq) * 100) : 0,
          })
        }
      }

      return resultado.sort((a, b) => b.alunosBaixaFrequencia - a.alunosBaixaFrequencia).slice(0, 10)
    })(),

    // 16. Aniversariantes do mês
    (async () => {
      const mesAtual = new Date().getMonth() + 1
      let query = supabase.from('academico_matriculas')
        .select('aluno_id, people!inner(nome_completo, data_nascimento), turmas!inner(nome)')
        .eq('ativo', true)
        .eq('situacao', 'Ativo')
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data } = await query

      if (!data) return []

      const aniversariantes = data
        .filter((row: any) => {
          const nasc = row.people?.data_nascimento
          if (!nasc) return false
          return new Date(nasc).getMonth() + 1 === mesAtual
        })
        .map((row: any) => ({
          nome: row.people?.nome_completo || '',
          data: row.people?.data_nascimento || '',
          turma: row.turmas?.nome || '',
        }))
        .sort((a: any, b: any) => new Date(a.data).getDate() - new Date(b.data).getDate())
        .slice(0, 20)

      return aniversariantes
    })(),

    // 18. Ocupação por Turma
    (async () => {
      let query = supabase.from('turmas')
        .select('id, nome, capacidade_alunos')
        .eq('ativo', true)
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data: turmas } = await query
      if (!turmas || turmas.length === 0) return []

      const resultado = await Promise.all(turmas.map(async (t) => {
        const { count } = await supabase
          .from('academico_matriculas')
          .select('id', { count: 'exact', head: true })
          .eq('turma_id', t.id)
          .eq('ativo', true)
          .eq('situacao', 'Ativo')
        return { turma: t.nome, capacidade: t.capacidade_alunos || 0, matriculas: count || 0 }
      }))

      return resultado.sort((a, b) => {
        const rateA = a.capacidade > 0 ? a.matriculas / a.capacidade : 0
        const rateB = b.capacidade > 0 ? b.matriculas / b.capacidade : 0
        return rateB - rateA
      })
    })(),

    // 19. Frequência por Turma
    (async () => {
      let anoQuery = supabase.from('academico_anos_letivos')
        .select('data_inicio')
        .eq('status', 'ativo')
        .limit(1)
      if (schoolId) anoQuery = anoQuery.eq('school_id', schoolId)
      const { data: anoAtivoData } = await anoQuery

      if (!anoAtivoData || anoAtivoData.length === 0) return []
      const dataInicio = anoAtivoData[0].data_inicio

      let query = supabase.from('turmas')
        .select('id, nome')
        .eq('ativo', true)
      if (schoolId) query = query.eq('school_id', schoolId)
      const { data: turmas } = await query
      if (!turmas || turmas.length === 0) return []

      const resultado = await Promise.all(turmas.map(async (t) => {
        const { data: freqData } = await supabase
          .from('academico_frequencias_dia')
          .select('status')
          .eq('turma_id', t.id)
          .gte('dia_letivo', dataInicio)
        if (!freqData || freqData.length === 0) return { turma: t.nome, presencas: 0, total: 0 }
        const presencas = freqData.filter(f => f.status === 'P').length
        return { turma: t.nome, presencas, total: freqData.length }
      }))

      return resultado.sort((a, b) => {
        const rateA = a.total > 0 ? a.presencas / a.total : 1
        const rateB = b.total > 0 ? b.presencas / b.total : 1
        return rateA - rateB
      })
    })(),

    // 17. Turmas sem Professor
    (async () => {
      let query = supabase.from('turmas_disciplinas')
        .select('turma_id, matriz_disciplina_id, turmas!inner(nome), academico_matriz_disciplinas!inner(disciplina_id, academico_disciplinas!inner(nome))')
      if (schoolId) query = query.eq('turmas.school_id', schoolId)
      query = query.eq('turmas.ativo', true)
      const { data: disciplinasData } = await query

      if (!disciplinasData || disciplinasData.length === 0) return []

      const turmaIds = [...new Set(disciplinasData.map((d: any) => d.turma_id))]
      const { data: profissionaisData } = await supabase
        .from('turmas_profissionais')
        .select('turma_id, disciplinas_ids')
        .in('turma_id', turmaIds)
        .eq('ativo', true)

      const profPorTurma = new Map<string, Set<string>>()
      for (const p of (profissionaisData || [])) {
        if (!profPorTurma.has(p.turma_id)) profPorTurma.set(p.turma_id, new Set())
        for (const discId of (p.disciplinas_ids || [])) {
          profPorTurma.get(p.turma_id)!.add(discId)
        }
      }

      const map = new Map<string, string[]>()
      for (const d of disciplinasData) {
        const turmaNome = (d as any).turmas?.nome || 'Turma desconhecida'
        const disciplinaNome = (d as any).academico_matriz_disciplinas?.academico_disciplinas?.nome || 'Disciplina desconhecida'
        const matrizDiscId = d.matriz_disciplina_id

        const temProf = profPorTurma.get(d.turma_id)?.has(matrizDiscId)
        if (!temProf) {
          if (!map.has(turmaNome)) map.set(turmaNome, [])
          map.get(turmaNome)!.push(disciplinaNome)
        }
      }

      return Array.from(map.entries())
        .map(([turma, disciplinas]) => ({ turma, disciplinas }))
        .sort((a, b) => a.turma.localeCompare(b.turma))
    })(),
  ])

  return {
    docentes: docentesRes.count || 0,
    turmas: turmasRes.count || 0,
    alunos: alunosRes.count || 0,
    matriculas: matriculasRes.count || 0,
    anoLetivo: (anoLetivoRes.data && anoLetivoRes.data.length > 0)
      ? anoLetivoRes.data[0] as { descricao: string; status: string }
      : null,
    alunosPorEtapa: alunosPorEtapaRes as DashboardData['alunosPorEtapa'],
    alunosPorTipoTurma: alunosPorTipoRes as DashboardData['alunosPorTipoTurma'],
    alunosPorDeficiencia: alunosPorDeficienciaRes as DashboardData['alunosPorDeficiencia'],
    alunosPorTranstorno: alunosPorTranstornoRes as DashboardData['alunosPorTranstorno'],
    alunosPorModalidade: alunosPorModalidadeRes as DashboardData['alunosPorModalidade'],
    alunosPorTurno: alunosPorTurnoRes as DashboardData['alunosPorTurno'],
    ocupacao: ocupacaoRes as DashboardData['ocupacao'],
    frequenciaMedia: frequenciaRes as DashboardData['frequenciaMedia'],
    riscoEvasao: riscoEvasaoRes as DashboardData['riscoEvasao'],
    aniversariantes: aniversariantesRes as DashboardData['aniversariantes'],
    turmasSemProfessor: turmasSemProfRes as DashboardData['turmasSemProfessor'],
    ocupacaoPorTurma: ocupacaoPorTurmaRes as DashboardData['ocupacaoPorTurma'],
    frequenciaPorTurma: frequenciaPorTurmaRes as DashboardData['frequenciaPorTurma'],
  }
}
