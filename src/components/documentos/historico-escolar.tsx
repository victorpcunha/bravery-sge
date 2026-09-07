'use client'

import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DadosHistoricoEscolar, AnoHistorico } from '@/lib/actions/historico-escolar'
import { formatarCpf, formatarData, nomeTitulo, enderecoCompleto } from '@/lib/documentos-pdf'

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
  anoBloco: { marginBottom: 12 },
  anoTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 6,
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
  colNota: { width: 80, paddingVertical: 5, paddingHorizontal: 6, textAlign: 'center' },
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
  resultadoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, marginTop: 6 },
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

function BlocoAno({ ano }: { ano: AnoHistorico }) {
  const titulo =
    ano.origem === 'manual'
      ? `Ano Letivo ${ano.anoRotulo} — Histórico Anterior (Registro Manual)`
      : `Ano Letivo ${ano.anoRotulo}`

  return (
    <View style={styles.anoBloco}>
      <Text style={styles.anoTitle}>{titulo}</Text>
      <LinhaCampos
        campos={[
          { label: 'Unidade Escolar', value: ano.unidadeEscolar || '—', flex: 1.6 },
          ...(ano.localidade ? [{ label: 'Município/UF', value: ano.localidade }] : []),
        ]}
      />
      <LinhaCampos
        campos={[
          { label: 'Etapa de Ensino', value: ano.etapa || '—', flex: 1.4 },
          ...(ano.turma ? [{ label: 'Turma', value: ano.turma }] : []),
        ]}
      />

      {ano.emAndamento ? (
        <Text style={styles.semInformacao}>
          Ano letivo em andamento. O resultado final ainda não foi definido pelo Fechamento de
          Turma.
        </Text>
      ) : ano.numerico ? (
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.thDisciplina}>Disciplina</Text>
            <Text style={[styles.colNota, styles.thText]}>Nota Final</Text>
          </View>
          {ano.disciplinas.map((d, i) => (
            <View key={`${d.nome}-${i}`} style={i % 2 === 1 ? [styles.tableRow, styles.zebra] : styles.tableRow}>
              <Text style={styles.tdDisciplina}>{d.nome}</Text>
              <Text style={[styles.colNota, styles.tdText]}>{formatarNota(d.nota)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.semInformacao}>
          Turma com avaliação não numérica. Os resultados por disciplina não são contemplados
          neste documento.
        </Text>
      )}

      {!ano.emAndamento && (
        <View style={styles.resultadoRow}>
          <Text style={styles.resultadoLabel}>Resultado Final</Text>
          <Text style={styles.resultadoValue}>{ano.situacao || '—'}</Text>
        </View>
      )}
    </View>
  )
}

export function HistoricoEscolar({
  documento,
  responsavelNome,
  responsavelCargo,
}: {
  documento: DadosHistoricoEscolar
  responsavelNome?: string | null
  responsavelCargo?: string | null
}) {
  const { escola, aluno, anos } = documento
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

  const assinaturaNome = (responsavelNome ?? escola.responsavel_nome ?? '').trim()
  const assinaturaCargo = (responsavelCargo ?? escola.responsavel_cargo ?? '').trim()

  return (
    <Document
      title={`Histórico Escolar — ${nomeTitulo(aluno.nome_completo)}`}
      author={escola.nome_escola}
      subject="Histórico Escolar"
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
          <Text style={styles.title}>Histórico Escolar</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Identificação do Aluno</Text>
            <LinhaCampos campos={[{ label: 'Nome Completo', value: nomeTitulo(aluno.nome_completo) }]} />
            <LinhaCampos
              campos={[
                ...(aluno.data_nascimento
                  ? [{ label: 'Data de Nascimento', value: formatarData(aluno.data_nascimento) }]
                  : []),
                ...(aluno.cpf ? [{ label: 'CPF', value: formatarCpf(aluno.cpf) }] : []),
                ...(aluno.inep_id
                  ? [{ label: 'Identificação (INEP)', value: aluno.inep_id }]
                  : []),
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Trajetória Acadêmica</Text>
            {anos.map(ano => (
              <BlocoAno key={ano.key} ano={ano} />
            ))}
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
