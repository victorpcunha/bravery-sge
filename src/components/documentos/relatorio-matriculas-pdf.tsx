'use client'

import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DadosRelatorioMatriculas } from '@/lib/actions/relatorio-matriculas'
import { formatarData, nomeTitulo, enderecoCompleto } from '@/lib/documentos-pdf'
import { labelSituacaoMatricula } from '@/lib/situacoes-matricula'

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
  resumoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  resumoLabel: {
    width: 200,
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    lineHeight: 1.4,
  },
  resumoValue: {
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
  thAluno: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
  },
  colTurma: { width: 120, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'left' },
  colAno: { width: 80, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'center' },
  colData: { width: 80, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'center' },
  colSituacao: { width: 130, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'left' },
  thText: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#475569' },
  tdAluno: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 10,
    color: '#1E293B',
  },
  tdText: { fontSize: 10, color: '#1E293B' },
  semResultado: { fontSize: 10, color: '#64748B', fontStyle: 'italic', marginTop: 2 },
  emissao: { fontSize: 10, marginBottom: 14 },
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

export function RelatorioMatriculasPdf({ documento }: { documento: DadosRelatorioMatriculas }) {
  const { escola, linhas, total, porTurma, porSituacao, filtrosAplicados } = documento
  const hoje = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  const agora = new Date()
  const emissao = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()}`

  const nomeDestaque = escola.nome_fantasia || escola.nome_escola
  const endereco = enderecoCompleto(escola)
  const contato = [escola.telefone, escola.email, escola.site].filter(Boolean).join(' · ')
  const linhaDadosRodape = [endereco, contato].filter(Boolean).join(' · ')

  const turmaFiltro = filtrosAplicados.turmaNome || 'Todas as turmas'
  const situacoesFiltro =
    filtrosAplicados.situacoes.length > 0
      ? filtrosAplicados.situacoes.map(s => labelSituacaoMatricula(s)).join(', ')
      : 'Todas as situações'
  const mostraPorTurma = !filtrosAplicados.turmaNome && porTurma.length > 0

  return (
    <Document title="Relatório de Matrículas" author={escola.nome_escola} subject="Relatório de Matrículas">
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
          <Text style={styles.title}>Relatório de Matrículas</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filtros Aplicados</Text>
            <View style={styles.campoRow}>
              <View style={styles.campo}>
                <Text style={styles.campoLabel}>Ano Letivo:</Text>
                <Text style={styles.campoValue}>{filtrosAplicados.anoLetivoDescricao || '—'}</Text>
              </View>
              <View style={styles.campo}>
                <Text style={styles.campoLabel}>Turma:</Text>
                <Text style={styles.campoValue}>{turmaFiltro}</Text>
              </View>
            </View>
            <View style={styles.campoRow}>
              <View style={styles.campo}>
                <Text style={styles.campoLabel}>Situação:</Text>
                <Text style={styles.campoValue}>{situacoesFiltro}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo</Text>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Total de alunos matriculados</Text>
              <Text style={styles.resumoValue}>{total}</Text>
            </View>
            {mostraPorTurma &&
              porTurma.map(t => (
                <View key={t.turmaNome} style={styles.resumoRow}>
                  <Text style={styles.resumoLabel}>{t.turmaNome}</Text>
                  <Text style={styles.resumoValue}>{t.quantidade}</Text>
                </View>
              ))}
            {porSituacao.map(s => (
              <View key={s.situacao} style={styles.resumoRow}>
                <Text style={styles.resumoLabel}>{labelSituacaoMatricula(s.situacao)}</Text>
                <Text style={styles.resumoValue}>{s.quantidade}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resultado</Text>
            {linhas.length === 0 ? (
              <Text style={styles.semResultado}>
                Nenhuma matrícula foi encontrada para os critérios informados.
              </Text>
            ) : (
              <View>
                <View fixed style={styles.tableHeader}>
                  <Text style={styles.thAluno}>Aluno</Text>
                  <Text style={[styles.colTurma, styles.thText]}>Turma</Text>
                  <Text style={[styles.colAno, styles.thText]}>Ano Letivo</Text>
                  <Text style={[styles.colData, styles.thText]}>Data Matrícula</Text>
                  <Text style={[styles.colSituacao, styles.thText]}>Situação</Text>
                </View>
                {linhas.map((l, i) => (
                  <View
                    key={`${l.alunoNome}-${l.turmaNome}-${i}`}
                    style={i % 2 === 1 ? [styles.tableRow, styles.zebra] : styles.tableRow}
                  >
                    <Text style={styles.tdAluno}>{nomeTitulo(l.alunoNome)}</Text>
                    <Text style={[styles.colTurma, styles.tdText]}>{l.turmaNome}</Text>
                    <Text style={[styles.colAno, styles.tdText]}>{l.anoLetivoDescricao}</Text>
                    <Text style={[styles.colData, styles.tdText]}>{formatarData(l.dataMatricula)}</Text>
                    <Text style={[styles.colSituacao, styles.tdText]}>
                      {labelSituacaoMatricula(l.situacao)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.emissao}>Data de emissão: {emissao}</Text>
          <Text style={styles.emissao}>
            {escola.municipio ? `${escola.municipio}, ${hoje}.` : hoje}
          </Text>
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
