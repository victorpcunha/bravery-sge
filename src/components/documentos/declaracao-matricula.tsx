'use client'

import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DadosDeclaracaoMatricula } from '@/lib/actions/documentos'
import { dataNascimentoExtenso, formatarCpf, nomeTitulo, enderecoCompleto } from '@/lib/documentos-pdf'

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
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    objectFit: 'contain',
    marginRight: 14,
  },
  headerTexts: { flex: 1 },
  nomeDestaque: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#1F88EB',
  },
  endereco: { fontSize: 9, color: '#475569', marginTop: 5, lineHeight: 1.45 },
  contato: { fontSize: 9, color: '#475569', marginTop: 2, lineHeight: 1.45 },
  cabecalho: {
    fontSize: 9,
    color: '#475569',
    marginTop: 10,
    lineHeight: 1.5,
  },
  conteudo: {
    flexGrow: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  body: { fontSize: 11, lineHeight: 1.7, textAlign: 'justify' },
  destaque: { fontFamily: 'Helvetica-Bold' },
  encerramento: { fontSize: 11, lineHeight: 1.7, textAlign: 'justify', marginTop: 22 },
  assinaturaBloco: {
    marginTop: 44,
    flexDirection: 'column',
  },
  localData: { fontSize: 10, marginBottom: 18 },
  assinatura: { alignItems: 'center' },
  assinaturaNome: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  assinaturaCargo: { fontSize: 9, color: '#475569', marginTop: 2 },
  base: {
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingTop: 8,
    marginTop: 18,
  },
  rodapeDados: {
    fontSize: 7.5,
    color: '#64748B',
    lineHeight: 1.4,
    textAlign: 'center',
  },
  rodape: { fontSize: 8, color: '#64748B', lineHeight: 1.4, marginTop: 3, textAlign: 'center' },
})

export function DeclaracaoMatricula({
  documento,
  responsavelNome,
  responsavelCargo,
}: {
  documento: DadosDeclaracaoMatricula
  responsavelNome?: string | null
  responsavelCargo?: string | null
}) {
  const { escola, aluno, matricula } = documento
  const hoje = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  const nomeDestaque = escola.nome_fantasia || escola.nome_escola
  const endereco = enderecoCompleto(escola)
  const contato = [escola.telefone, escola.email, escola.site].filter(Boolean).join(' · ')
  const linhaDadosRodape = [endereco, contato].filter(Boolean).join(' · ')

  const filiacao = [aluno.filiacao_1, aluno.filiacao_2]
    .map(f => nomeTitulo(f || ''))
    .filter(Boolean)
    .join(' e ')

  const turnos = matricula.turnos.length > 0 ? matricula.turnos.join(', ') : '—'

  const assinaturaNome = (responsavelNome ?? escola.responsavel_nome ?? '').trim()
  const assinaturaCargo = (responsavelCargo ?? escola.responsavel_cargo ?? '').trim()

  return (
    <Document
      title={`Declaração de Matrícula — ${nomeTitulo(aluno.nome_completo)}`}
      author={escola.nome_escola}
      subject="Declaração de Matrícula"
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
          <Text style={styles.title}>Declaração de Matrícula</Text>

          <Text style={styles.body}>
            Declaramos, para os devidos fins e efeitos legais, que o(a) aluno(a){' '}
            <Text style={styles.destaque}>{nomeTitulo(aluno.nome_completo)}</Text>, nascido(a) em{' '}
            <Text style={styles.destaque}>{dataNascimentoExtenso(aluno.data_nascimento)}</Text>
            {aluno.cpf ? (
              <>
                , portador(a) do CPF <Text style={styles.destaque}>{formatarCpf(aluno.cpf)}</Text>
              </>
            ) : null}
            {filiacao ? (
              <>
                , filho(a) de <Text style={styles.destaque}>{filiacao}</Text>
              </>
            ) : null}
            , encontra-se devidamente matriculado(a) nesta unidade escolar no{' '}
            <Text style={styles.destaque}>ano letivo {matricula.ano_letivo_descricao || '—'}</Text>, na turma{' '}
            <Text style={styles.destaque}>{matricula.turma_nome}</Text>
            {matricula.etapa_nome ? (
              <>
                {' '}(<Text style={styles.destaque}>{matricula.etapa_nome}</Text>)
              </>
            ) : null}
            , turno <Text style={styles.destaque}>{turnos}</Text>, na situação de matrícula{' '}
            <Text style={styles.destaque}>{matricula.situacao}</Text>.
          </Text>

          <Text style={styles.encerramento}>
            Por ser verdade, firmamos a presente declaração, datada e assinada abaixo, para os fins que se
            fizerem necessários.
          </Text>

          <View style={styles.assinaturaBloco}>
            <Text style={styles.localData}>
              {escola.municipio ? `${escola.municipio}, ${hoje}.` : hoje}
            </Text>
            <View style={styles.assinatura}>
              <Text style={styles.assinaturaNome}>{assinaturaNome ? nomeTitulo(assinaturaNome) : '____________________'}</Text>
              <Text style={styles.assinaturaCargo}>{assinaturaCargo || 'Responsável pela Unidade Escolar'}</Text>
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