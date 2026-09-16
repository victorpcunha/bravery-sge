'use client'

import Link from 'next/link'
import { EB_Garamond, Public_Sans } from 'next/font/google'

// Regra de forma do preview: cards 14px, acoes 10px, status pill full. Um acento so: #14532D.
const display = EB_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'] })
const body = Public_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

const INK = '#13291D'
const MUTED = '#4C6353'
const PAPER = '#F0F3F0'
const CARD = '#FFFFFF'
const LINE = '#D8E0D8'
const ACCENT = '#14532D'
const TINT = '#E7F1EA'
const TINT_BORDER = '#CBE0D2'
const DANGER = '#B3261E'

const MOCK_LEDGER = [
  { rotulo: 'Alunos', valor: '482', nota: 'matrículas vinculadas', destaque: false },
  { rotulo: 'Matrículas ativas', valor: '461', nota: '12 novas este mês', destaque: true },
  { rotulo: 'Docentes', valor: '38', nota: '3 sem turma', destaque: false },
  { rotulo: 'Turmas ativas', valor: '16', nota: 'ano letivo 2026', destaque: false },
  { rotulo: 'Frequência média', valor: '93,1%', nota: 'detalhe por turma abaixo', destaque: false },
]

const MOCK_FALTAS = [
  { turma: '1 ANO AB', pct: 88.2, faltas: 41, estado: 'Atenção' },
  { turma: '2 ANO AB', pct: 91.5, faltas: 27, estado: 'Estável' },
  { turma: '3 ANO AB', pct: 94.8, faltas: 12, estado: 'Estável' },
]

const MOCK_USUARIOS = [
  { nome: 'Helena Vasconcellos Ribeiro', cpf: '382.114.209-55', perfil: 'Gestora', estado: 'Ativo' },
  { nome: 'Otávio Nogueira Prado', cpf: '511.872.340-18', perfil: 'Profissional', estado: 'Ativo' },
  { nome: 'Cecília Duarte Fontoura', cpf: '093.445.718-22', perfil: 'Aluna', estado: 'Ativo' },
  { nome: 'Rafael Teixeira Sampaio', cpf: '277.903.451-90', perfil: 'Profissional', estado: 'Inativo' },
  { nome: 'Marina Lacerda Queirós', cpf: '640.218.973-44', perfil: 'Responsável', estado: 'Ativo' },
  { nome: 'Davi Albuquerque Melo', cpf: '815.302.664-07', perfil: 'Aluno', estado: 'Ativo' },
]

export default function PreviewAtlasPage() {
  return (
    <div className={`min-h-screen ${body.className}`} style={{ background: PAPER, color: INK }}>
      <style>{`::selection{background:${TINT_BORDER}}.atlas-focus:focus-visible{outline:2px solid ${ACCENT};outline-offset:2px}@media (prefers-reduced-motion: reduce){.atlas-anim{transition:none!important;transform:none!important}}`}</style>

      <div className="flex flex-wrap items-center gap-3 px-6 py-3 text-[13px]" style={{ background: INK, color: '#F2F5F1' }}>
        <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ background: CARD, color: INK }}>
          Preview descartável
        </span>
        <span className="opacity-80">Atlas Escolar, Dashboard e Usuários. Dados de exemplo. Nada do sistema mudou.</span>
        <Link href="/login" className="atlas-focus ml-auto inline-flex min-h-[44px] items-center underline underline-offset-4 opacity-90">
          voltar ao sistema
        </Link>
      </div>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <section>
          <div className="p-7 sm:p-9" style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 14 }}>
            <h1 className={`${display.className} text-[32px] leading-[1.1] sm:text-[40px]`} style={{ fontWeight: 600 }}>
              Bom dia, Diretora Helena
            </h1>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed" style={{ color: MUTED }}>
              EMEF Monte Alegre, ano letivo 2026. Terça, 15 de setembro de 2026. Dados de exemplo para avaliar a direção.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="atlas-focus atlas-anim inline-flex min-h-[44px] items-center px-5 py-3 text-[14px] font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ background: ACCENT, color: '#FFFFFF', borderRadius: 10 }}
              >
                Nova matrícula
              </Link>
              <Link
                href="/login"
                className="atlas-focus atlas-anim inline-flex min-h-[44px] items-center px-5 py-3 text-[14px] font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ background: TINT, color: ACCENT, border: `1px solid ${TINT_BORDER}`, borderRadius: 10 }}
              >
                Abrir diário
              </Link>
              <Link href="/login" className="atlas-focus inline-flex min-h-[44px] items-center text-[14px] font-medium underline underline-offset-4 sm:ml-2" style={{ color: ACCENT }}>
                Ver plano e painel
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-5" style={{ background: LINE, border: `1px solid ${LINE}`, borderRadius: 14 }}>
            {MOCK_LEDGER.map((s) => (
              <div key={s.rotulo} className="p-5" style={{ background: s.destaque ? TINT : CARD }}>
                <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: s.destaque ? ACCENT : MUTED }}>
                  {s.rotulo}
                </p>
                <p className={`${display.className} mt-1 tabular-nums text-[34px] leading-none sm:text-[40px]`} style={{ fontWeight: 700 }}>
                  {s.valor}
                </p>
                <p className="mt-1 text-[13px]" style={{ color: s.destaque ? ACCENT : MUTED }}>{s.nota}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="p-5 lg:col-span-2" style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 14 }}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className={display.className} style={{ fontSize: 24, fontWeight: 600 }}>Frequência por turma</h2>
                <span className="rounded-full border px-3 py-1 text-[12px] font-semibold" style={{ borderColor: LINE, color: MUTED }}>
                  Dados de exemplo
                </span>
              </div>
              <ul className="mt-4 space-y-5">
                {MOCK_FALTAS.map((f) => (
                  <li key={f.turma}>
                    <div className="flex flex-wrap justify-between gap-2 text-[13px] font-medium">
                      <span>{f.turma}</span>
                      <span className="tabular-nums" style={{ color: MUTED }}>
                        {f.pct.toFixed(1).replace('.', ',')}%, {f.faltas} faltas ({f.estado})
                      </span>
                    </div>
                    <div className="mt-2 h-[6px]" style={{ borderBottom: `1px solid ${LINE}` }}>
                      <div
                        className="h-[5px] translate-y-[1px]"
                        style={{
                          width: `${f.pct}%`,
                          background: f.pct < 90 ? DANGER : ACCENT,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5" style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 14 }}>
              <h2 className={display.className} style={{ fontSize: 24, fontWeight: 600 }}>Alertas</h2>
              <ul className="mt-3 divide-y text-[14px]" style={{ borderColor: LINE }}>
                <li className="py-3">
                  <p className="font-semibold" style={{ color: DANGER }}>6 alunos em risco de evasão</p>
                  <p style={{ color: MUTED }}>ver lista na aba Alertas</p>
                </li>
                <li className="py-3">
                  <p className="font-semibold">3 turmas sem professor</p>
                  <p style={{ color: MUTED }}>vincular no quadro de aulas</p>
                </li>
                <li className="py-3">
                  <p className="font-semibold">9 aniversariantes na semana</p>
                  <p style={{ color: MUTED }}>lista no painel geral</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="overflow-hidden" style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 14 }}>
            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-end" style={{ borderBottom: `1px solid ${LINE}` }}>
              <div>
                <h2 className={display.className} style={{ fontSize: 28, fontWeight: 600 }}>Usuários</h2>
                <p className="text-[14px]" style={{ color: MUTED }}>6 registros de exemplo, ordenados por nome</p>
              </div>
              <form className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-end" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="atlas-busca" className="text-[13px] font-semibold" style={{ color: MUTED }}>
                    Buscar
                  </label>
                  <input
                    id="atlas-busca"
                    type="search"
                    placeholder="Nome ou CPF"
                    className="atlas-focus min-h-[44px] w-full px-4 py-2 text-[14px] sm:w-64"
                    style={{ background: PAPER, border: `1px solid ${LINE}`, borderRadius: 10, color: INK }}
                  />
                </div>
                <button
                  type="button"
                  className="atlas-focus atlas-anim min-h-[44px] px-5 py-2 text-[14px] font-semibold"
                  style={{ background: ACCENT, color: '#FFFFFF', borderRadius: 10 }}
                >
                  Novo usuário
                </button>
              </form>
            </div>
            <ul className="divide-y md:hidden" style={{ borderColor: LINE }}>
              {MOCK_USUARIOS.map((u) => {
                const inativo = u.estado === 'Inativo'
                return (
                  <li key={u.cpf} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className={`font-semibold ${display.className}`} style={{ fontSize: 17 }}>
                        {u.nome}
                      </p>
                      <span
                        className="mt-1 shrink-0 rounded-full px-3 py-1 text-[12px] font-bold"
                        style={
                          inativo
                            ? { background: PAPER, color: MUTED, border: `1px solid ${LINE}` }
                            : { background: TINT, color: ACCENT, border: `1px solid ${TINT_BORDER}` }
                        }
                      >
                        {u.perfil}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] tabular-nums" style={{ color: MUTED }}>
                      {u.cpf} ({u.estado})
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="atlas-focus inline-flex min-h-[44px] items-center justify-center text-[14px] font-semibold"
                        style={{ background: PAPER, color: INK, border: `1px solid ${LINE}`, borderRadius: 10 }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="atlas-focus inline-flex min-h-[44px] items-center justify-center text-[14px] font-semibold"
                        style={{ background: CARD, color: DANGER, border: `1px solid ${LINE}`, borderRadius: 10 }}
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-[14px]">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                    <th className="px-6 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold">CPF</th>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: LINE }}>
                  {MOCK_USUARIOS.map((u) => {
                    const inativo = u.estado === 'Inativo'
                    return (
                      <tr key={u.cpf}>
                        <td className={`px-6 py-3 font-semibold ${display.className}`} style={{ fontSize: 16 }}>
                          {u.nome}
                        </td>
                        <td className="px-4 py-3 tabular-nums" style={{ color: MUTED }}>{u.cpf}</td>
                        <td className="px-4 py-3">
                          <span
                            className="rounded-full px-3 py-1 text-[12px] font-bold"
                            style={
                              inativo
                                ? { background: PAPER, color: MUTED, border: `1px solid ${LINE}` }
                                : { background: TINT, color: ACCENT, border: `1px solid ${TINT_BORDER}` }
                            }
                          >
                            {u.perfil}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px]" style={{ color: MUTED }}>{u.estado}</td>
                        <td className="px-4 py-3 text-right">
                          <button type="button" className="atlas-focus mr-3 underline underline-offset-4">Editar</button>
                          <button type="button" className="atlas-focus underline underline-offset-4" style={{ color: DANGER }}>Excluir</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 text-[13px]" style={{ borderTop: `1px solid ${LINE}`, color: MUTED }}>
              <span className="tabular-nums">Mostrando 1 a 6 de 6</span>
              <span className="tabular-nums">Página 1 de 1</span>
            </div>
          </div>

          <div className="mt-4 p-5 text-[14px] leading-relaxed" style={{ border: `1px solid ${LINE}`, borderRadius: 14, background: CARD }}>
            <strong>O que mudou nesta revisão:</strong> sem etiqueta acima do título, sem textura de grade,
            4 fichas viraram uma faixa única com divisórias (destaque tonal em Matrículas ativas),
            frequência média integrada à faixa em vez de cartão isolado, português com acentos restaurado,
            foco visível de teclado e seleção na paleta, ações da tabela como botões.
          </div>
        </section>
      </main>
    </div>
  )
}
