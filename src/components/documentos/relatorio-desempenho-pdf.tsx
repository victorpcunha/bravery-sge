'use client'

import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DadosRelatorioDesempenho } from '@/lib/actions/relatorio-desempenho'
import { nomeTitulo, enderecoCompleto } from '@/lib/documentos-pdf'
import { PDF_PALETTE as PDF } from '@/lib/pdf-palette'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 48,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: PDF.ink,
  },
  topo: {
    borderBottomWidth: 2,
    borderBottomColor: PDF.accent,
    paddingBottom: 12,
    marginBottom: 14,
  },
  header: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 56, height: 56, objectFit: 'contain', marginRight: 14 },
  headerTexts: { flex: 1 },
  nomeDestaque: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: PDF.accent },
  cabecalho: { fontSize: 9, color: PDF.muted, marginTop: 6, lineHeight: 1.5 },
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
    color: PDF.accent,
    borderBottomWidth: 1,
    borderBottomColor: PDF.border,
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
    color: PDF.muted,
    marginRight: 4,
    lineHeight: 1.4,
  },
  campoValue: {
    flex: 1,
    fontSize: 10.5,
    color: PDF.ink,
    lineHeight: 1.4,
  },
  resumoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  resumoLabel: {
    width: 220,
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: PDF.muted,
    lineHeight: 1.4,
  },
  resumoValue: {
    flex: 1,
    fontSize: 10.5,
    color: PDF.ink,
    lineHeight: 1.4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: PDF.mutedFill,
    borderBottomWidth: 1,
    borderBottomColor: PDF.border,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: PDF.border,
  },
  zebra: { backgroundColor: PDF.surface },
  atencao: { backgroundColor: PDF.destructiveLight },
  alunoHeader: {
    flexDirection: 'row',
    backgroundColor: PDF.infoLight,
    borderBottomWidth: 1,
    borderBottomColor: PDF.border,
  },
  thAluno: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: PDF.muted,
  },
  tdAlunoHeader: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: PDF.ink,
  },
  colDisciplina: { width: 150, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'left' },
  colMedia: { width: 60, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'center' },
  colSituacao: { width: 150, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'left' },
  thText: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: PDF.muted },
  tdAluno: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 10,
    color: PDF.ink,
  },
  tdText: { fontSize: 10, color: PDF.ink },
  tdMedia: { fontSize: 10, color: PDF.ink, fontFamily: 'Helvetica-Bold' },
  semResultado: { fontSize: 10, color: PDF.muted, fontStyle: 'italic', marginTop: 2 },
  emissao: { fontSize: 10, marginBottom: 14 },
  base: {
    borderTopWidth: 1,
    borderTopColor: PDF.border,
    paddingTop: 8,
    marginTop: 14,
  },
  rodapeDados: {
    fontSize: 7.5,
    color: PDF.muted,
    lineHeight: 1.4,
    textAlign: 'center',
  },
  rodape: { fontSize: 8, color: PDF.muted, lineHeight: 1.4, marginTop: 3, textAlign: 'center' },
})

function textoSituacao(situacao: 'acima' | 'abaixo'): string {
  return situacao === 'acima' ? 'Acima da Média Mínima' : 'Abaixo da Média Mínima'
}

export function RelatorioDesempenhoPdf({ documento }: { documento: DadosRelatorioDesempenho }) {
  const { escola, alunos, totalAlunos, mediaGeral, abaixoMinima, porSituacao, filtrosAplicados } = documento
  const hoje = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  const agora = new Date()
  const emissao = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()}`

  const nomeDestaque = escola.nome_fantasia || escola.nome_escola
  const endereco = enderecoCompleto(escola)
  const contato = [escola.telefone, escola.email, escola.site].filter(Boolean).join(' · ')
  const linhaDadosRodape = [endereco, contato].filter(Boolean).join(' · ')

  const acima = porSituacao.find(s => s.situacao === 'acima')?.quantidade ?? 0

  return (
    <Document title="Relatório de Desempenho" author={escola.nome_escola} subject="Relatório de Desempenho">
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
          <Text style={styles.title}>Relatório de Desempenho</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filtros Aplicados</Text>
            <View style={styles.campoRow}>
              <View style={styles.campo}>
                <Text style={styles.campoLabel}>Ano Letivo:</Text>
                <Text style={styles.campoValue}>{filtrosAplicados.anoLetivoDescricao || '—'}</Text>
              </View>
              <View style={styles.campo}>
                <Text style={styles.campoLabel}>Turma:</Text>
                <Text style={styles.campoValue}>{filtrosAplicados.turmaNome || '—'}</Text>
              </View>
            </View>
            <View style={styles.campoRow}>
              <View style={styles.campo}>
                <Text style={styles.campoLabel}>Disciplina:</Text>
                <Text style={styles.campoValue}>{filtrosAplicados.disciplinaNome || 'Todas as disciplinas'}</Text>
              </View>
              <View style={styles.campo}>
                <Text style={styles.campoLabel}>Período:</Text>
                <Text style={styles.campoValue}>{filtrosAplicados.periodoNome}</Text>
              </View>
            </View>
            <View style={styles.campoRow}>
              <View style={styles.campo}>
                <Text style={styles.campoLabel}>Média Mínima:</Text>
                <Text style={styles.campoValue}>{filtrosAplicados.mediaMinima}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo</Text>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Total de alunos avaliados</Text>
              <Text style={styles.resumoValue}>{totalAlunos}</Text>
            </View>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Média geral dos resultados</Text>
              <Text style={styles.resumoValue}>{mediaGeral !== null ? mediaGeral : '—'}</Text>
            </View>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Alunos abaixo da média mínima</Text>
              <Text style={styles.resumoValue}>{abaixoMinima}</Text>
            </View>
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Alunos acima da média mínima</Text>
              <Text style={styles.resumoValue}>{acima}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resultado</Text>
            {alunos.length === 0 ? (
              <Text style={styles.semResultado}>
                Nenhum resultado foi encontrado para os critérios informados.
              </Text>
            ) : (
              <View>
                <View fixed style={styles.tableHeader}>
                  <Text style={styles.thAluno}>Aluno / Disciplina</Text>
                  <Text style={[styles.colMedia, styles.thText]}>Média</Text>
                  <Text style={[styles.colSituacao, styles.thText]}>Situação</Text>
                </View>
                {alunos.map(a => (
                  <View key={a.alunoId} wrap={false}>
                    <View style={styles.alunoHeader}>
                      <Text style={styles.tdAlunoHeader}>{nomeTitulo(a.alunoNome)}</Text>
                      <Text style={[styles.colMedia, styles.tdMedia]}>{a.mediaGeral}</Text>
                      <Text style={[styles.colSituacao, styles.tdText]}>
                        {textoSituacao(a.abaixoMinima ? 'abaixo' : 'acima')}
                      </Text>
                    </View>
                    {a.disciplinas.map((d, i) => {
                      const abaixo = d.situacao === 'abaixo'
                      const rowStyle = abaixo
                        ? [styles.tableRow, styles.atencao]
                        : i % 2 === 1
                          ? [styles.tableRow, styles.zebra]
                          : styles.tableRow
                      return (
                        <View key={`${a.alunoId}-${d.disciplinaNome}-${i}`} style={rowStyle}>
                          <Text style={[styles.tdAluno, { paddingLeft: 18 }]}>{d.disciplinaNome}</Text>
                          <Text style={[styles.colMedia, styles.tdText]}>{d.media}</Text>
                          <Text style={[styles.colSituacao, styles.tdText]}>{textoSituacao(d.situacao)}</Text>
                        </View>
                      )
                    })}
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
