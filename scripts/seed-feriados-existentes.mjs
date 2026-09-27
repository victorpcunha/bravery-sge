// Backfill one-off (US4 — spec 042-feriados-nacionais): semeia feriados nacionais
// em calendários legados (sem nenhum evento 'Feriado Nacional –').
// Idempotente: 2ª execução insere 0 linhas. Fora do bundle Next.
//
// Uso:
//   node scripts/seed-feriados-existentes.mjs [--dry-run]
// Env (mesmas do .env.local):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

const PREFIXO = 'Feriado Nacional –'
const TIPOS_BLOQUEADORES = ['recesso', 'nao_letivo', 'dia_letivo']
const DRY_RUN = process.argv.includes('--dry-run')

const dia = v => String(v).split('T')[0]
const sobrepoe = (aIni, aFim, b) => dia(aIni) <= b && b <= dia(aFim)

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const headers = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
}

async function sb(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers, ...options })
  if (!res.ok) throw new Error(`Supabase ${res.status} em ${path}: ${await res.text()}`)
  if (res.status === 204 || options.method === 'HEAD') return null
  return res.json()
}

async function buscarFeriados(ano) {
  const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`, {
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`BrasilAPI HTTP ${res.status} (ano ${ano})`)
  const dados = await res.json()
  if (!Array.isArray(dados)) throw new Error(`Payload inválido (ano ${ano})`)
  return dados.map(f => {
    if (typeof f?.date !== 'string' || typeof f?.name !== 'string') throw new Error(`Item inválido (ano ${ano})`)
    return { date: f.date, name: f.name }
  })
}

function anosDoIntervalo(inicio, fim) {
  const a = Number(dia(inicio).split('-')[0])
  const b = Number(dia(fim).split('-')[0])
  const anos = []
  for (let ano = Math.min(a, b); ano <= Math.max(a, b); ano++) anos.push(ano)
  return anos
}

const calendarios = await sb(
  'academico_calendarios?select=id,descricao,data_inicio,data_termino,ano:academico_anos_letivos!inner(school_id)&order=data_inicio'
)
console.log(`Calendários totais: ${calendarios.length}${DRY_RUN ? ' (dry-run)' : ''}`)

let totalInseridos = 0
for (const cal of calendarios) {
  const semeados = await sb(
    `academico_calendario_eventos?calendario_id=eq.${cal.id}&descricao=like.${encodeURIComponent(PREFIXO)}*&select=id`
  )
  if (semeados.length > 0) continue

  const inicio = dia(cal.data_inicio)
  const fim = dia(cal.data_termino)
  const todos = (
    await Promise.all(anosDoIntervalo(inicio, fim).map(buscarFeriados))
  ).flat().filter(f => f.date >= inicio && f.date <= fim)

  const existentes = await sb(
    `academico_calendario_eventos?calendario_id=eq.${cal.id}&select=tipo,data_inicio,data_termino`
  )

  let inseridos = 0
  let ignorados = 0
  for (const f of todos) {
    const bloqueado = existentes.some(
      e => TIPOS_BLOQUEADORES.includes(e.tipo) && sobrepoe(e.data_inicio, e.data_termino, f.date)
    )
    if (bloqueado) { ignorados++; continue }
    const descricao = `${PREFIXO} ${f.name}`
    if (!DRY_RUN) {
      const [criado] = await sb('academico_calendario_eventos', {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=representation' },
        body: JSON.stringify({
          calendario_id: cal.id, descricao, tipo: 'recesso',
          data_inicio: f.date, data_termino: f.date,
          etapas: [], recorrencia_tipo: 'nao_repete', recorrencia_dias: [],
        }),
      })
      await sb('auditoria', {
        method: 'POST',
        body: JSON.stringify({
          school_id: cal.ano.school_id, pessoa_id: null,
          modulo: 'Estrutura Acadêmica — Calendários', entidade: 'academico_calendario_eventos',
          entidade_id: criado.id, registro_nome: descricao, acao: 'criar',
          dados_anteriores: null,
          dados_novos: { calendario_id: cal.id, descricao, tipo: 'recesso', data_inicio: f.date, data_termino: f.date },
          alteracoes: null, resumo: null,
        }),
      })
    }
    inseridos++
  }
  totalInseridos += inseridos
  console.log(`- ${cal.descricao} [${inicio}..${fim}]: inseridos=${inseridos} ignorados=${ignorados}`)
}
console.log(`Total inseridos: ${DRY_RUN ? 0 : totalInseridos}`)
