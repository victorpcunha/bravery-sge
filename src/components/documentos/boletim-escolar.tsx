'use client'

import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DadosBoletim, LinhaBoletim } from '@/lib/actions/boletim'
import { formatarData, nomeTitulo, enderecoCompleto } from '@/lib/documentos-pdf'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 48,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1E293B',
  },
  topo: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F88EB',
    paddingBottom: 12,
    marginBottom: 14,
  },
  header: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 56, height: 56, objectFit: 'contain', marginRight: 14 },
  headerTexts: { flex: 1 },
  nomeDestaque: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#1F88EB' },
  cabecalho: { fontSize: 9, color: '#475569', marginTop: 6, lineHeight: 1.5 },
  conteudo: { flexGrow: 1 },
  title: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#1F88EB',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingBottom: 3,
    marginBottom: 8,
  },
  campoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  campo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  campoLabel: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    marginRight: 4,
    lineHeight: 1.4,
  },
  campoValue: {
    flex: 1,
    fontSize: 10.5,
    color: '#1E293B',
    lineHeight: 1.4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  zebra: { backgroundColor: '#F8FAFC' },
  thDisciplina: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
  },
  colNota: { width: 62, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'center' },
  colFreq: { width: 64, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'center' },
  colFaltas: { width: 56, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'center' },
  thText: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#475569' },
  tdDisciplina: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
  },
  tdText: { fontSize: 10, color: '#1E293B' },
  semInformacao: { fontSize: 10, color: '#64748B', fontStyle: 'italic', marginTop: 2 },
  resultadoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  resultadoLabel: {
    width: 180,
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    lineHeight: 1.4,
  },
  resultadoValue: {
    flex: 1,
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    lineHeight: 1.4,
  },
  assinaturaBloco: { marginTop: 36, flexDirection: 'column' },
  localData: { fontSize: 10, marginBottom: 14 },
  assinatura: { alignItems: 'center' },
  assinaturaNome: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  assinaturaCargo: { fontSize: 9, color: '#475569', marginTop: 2 },
  base: {
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingTop: 8,
    marginTop: 14,
  },
  rodapeDados: {
    fontSize: 7.5,
    color: '#64748B',
    lineHeight: 1.4,
    textAlign: 'center',
  },
  rodape: { fontSize: 8, color: '#64748B', lineHeight: 1.4, marginTop: 3, textAlign: 'center' },
})

function formatarNota(valor: number | null): string {
  if (valor === null) return '—'
  const arredondado = Math.round(valor * 100) / 100
  if (Number.isInteger(arredondado)) return String(arredondado)
  return arredondado.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

function formatarPct(valor: number | null): string {
  return valor === null ? '—' : `${valor}%`
}

function formatarFaltas(valor: number | null): string {
  return valor === null ? '—' : String(valor)
}

type CampoDados = {
  label: string
  value: string
  flex?: number
}

function LinhaCampos({ campos }: { campos: CampoDados[] }) {
  return (
    <View style={styles.campoRow}>
      {campos.map((c, i) => (
        <View key={i} style={c.flex ? { ...styles.campo, flex: c.flex } : styles.campo}>
          <Text style={styles.campoLabel}>{c.label}:</Text>
          <Text style={styles.campoValue}>{c.value}</Text>
        </View>
      ))}
    </View>
  )
}

function TabelaDisciplinas({
  disciplinas,
  criterio,
}: {
  disciplinas: LinhaBoletim[]
  criterio: 'por_dia' | 'por_aula'
}) {
  const mostraFrequencia = criterio === 'por_aula'
  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={styles.thDisciplina}>Disciplina</Text>
        <Text style={[styles.colNota, styles.thText]}>Nota</Text>
        {mostraFrequencia && <Text style={[styles.colFreq, styles.thText]}>Freq.</Text>}
        {mostraFrequencia && <Text style={[styles.colFaltas, styles.thText]}>Faltas</Text>}
      </View>
      {disciplinas.map((d, i) => (
        <View
          key={d.matriz_disciplina_id}
          style={i % 2 === 1 ? [styles.tableRow, styles.zebra] : styles.tableRow}
        >
          <Text style={styles.tdDisciplina}>{d.disciplina_nome}</Text>
          <Text style={[styles.colNota, styles.tdText]}>{formatarNota(d.nota_periodo)}</Text>
          {mostraFrequencia && (
            <Text style={[styles.colFreq, styles.tdText]}>{formatarPct(d.frequencia_percentual)}</Text>
          )}
          {mostraFrequencia && (
            <Text style={[styles.colFaltas, styles.tdText]}>{formatarFaltas(d.total_faltas)}</Text>
          )}
        </View>
      ))}
    </View>
  )
}

export function BoletimEscolar({
  documento,
  responsavelNome,
  responsavelCargo,
}: {
  documento: DadosBoletim
  responsavelNome?: string | null
  responsavelCargo?: string | null
}) {
  const { escola, aluno, matricula, periodo, criterio_frequencia, disciplinas, resultado_geral } =
    documento
  const hoje = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  const agora = new Date()
  const emissao = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(
    2,
    '0'
  )}/${agora.getFullYear()}`

  const nomeDestaque = escola.nome_fantasia || escola.nome_escola
  const endereco = enderecoCompleto(escola)
  const contato = [escola.telefone, escola.email, escola.site].filter(Boolean).join(' · ')
  const linhaDadosRodape = [endereco, contato].filter(Boolean).join(' · ')

  const turnos = matricula.turnos.length > 0 ? matricula.turnos.join(', ') : ''
  const periodoLabel = periodo.data_inicio
    ? `${periodo.nome} (${formatarData(periodo.data_inicio)} a ${formatarData(periodo.data_termino)})`
    : periodo.nome

  const assinaturaNome = (responsavelNome ?? escola.responsavel_nome ?? '').trim()
  const assinaturaCargo = (responsavelCargo ?? escola.responsavel_cargo ?? '').trim()

  return (
    <Document
      title={`Boletim Escolar — ${nomeTitulo(aluno.nome_completo)}`}
      author={escola.nome_escola}
      subject="Boletim Escolar"
    >
      <Page size="A4" style={styles.page}>
        {/* Papel timbrado — topo fixo, repetido em todas as páginas */}
        <View fixed style={styles.topo}>
          <View style={styles.header}>
            {escola.logo && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={escola.logo} style={styles.logo} />
            )}
            <View style={styles.headerTexts}>
              <Text style={styles.nomeDestaque}>{nomeDestaque}</Text>
              {escola.cabecalho && <Text style={styles.cabecalho}>{escola.cabecalho}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.conteudo}>
          <Text style={styles.title}>Boletim Escolar</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Identificação Acadêmica</Text>
            <LinhaCampos campos={[{ label: 'Nome Completo', value: nomeTitulo(aluno.nome_completo) }]} />
            <LinhaCampos
              campos={[
                { label: 'Ano Letivo', value: matricula.ano_letivo_descricao || '—' },
                { label: 'Período de Avaliação', value: periodoLabel, flex: 1.6 },
              ]}
            />
            <LinhaCampos
              campos={[
                { label: 'Etapa de Ensino', value: matricula.etapa_nome || '—', flex: 1.4 },
                { label: 'Turma', value: matricula.turma_nome },
                ...(turnos ? [{ label: 'Turno', value: turnos }] : []),
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Resultado por Disciplina</Text>
            {disciplinas.length === 0 ? (
              <Text style={styles.semInformacao}>
                Nenhuma disciplina registrada para esta turma no período selecionado.
              </Text>
            ) : (
              <TabelaDisciplinas disciplinas={disciplinas} criterio={criterio_frequencia} />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Resultado Geral do Período</Text>
            <View style={styles.resultadoRow}>
              <Text style={styles.resultadoLabel}>Média do Período</Text>
              <Text style={styles.resultadoValue}>{formatarNota(resultado_geral.media_periodo)}</Text>
            </View>
            <View style={styles.resultadoRow}>
              <Text style={styles.resultadoLabel}>Total de faltas</Text>
              <Text style={styles.resultadoValue}>
                {formatarFaltas(resultado_geral.total_faltas)}
              </Text>
            </View>
          </View>

          <View style={styles.assinaturaBloco}>
            <Text style={styles.localData}>Data de emissão: {emissao}</Text>
            <Text style={[styles.localData, { marginBottom: 14 }]}>
              {escola.municipio ? `${escola.municipio}, ${hoje}.` : hoje}
            </Text>
            <View style={styles.assinatura}>
              <Text style={styles.assinaturaNome}>
                {assinaturaNome ? nomeTitulo(assinaturaNome) : '____________________'}
              </Text>
              <Text style={styles.assinaturaCargo}>
                {assinaturaCargo || 'Responsável pela Unidade Escolar'}
              </Text>
            </View>
          </View>
        </View>

        {/* Papel timbrado — base fixa no rodapé da folha, repetida em todas as páginas */}
        {(linhaDadosRodape || escola.rodape) && (
          <View fixed style={styles.base}>
            {linhaDadosRodape && <Text style={styles.rodapeDados}>{linhaDadosRodape}</Text>}
            {escola.rodape && <Text style={styles.rodape}>{escola.rodape}</Text>}
          </View>
        )}
      </Page>
    </Document>
  )
}