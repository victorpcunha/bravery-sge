'use client'

import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DadosFichaIndividual, SaudeFicha } from '@/lib/actions/documentos'
import { getMunicipioByCodigo } from '@/data/municipios'
import { VALOR_DESCRICOES } from '@/data/censo/rotulos-campos'
import { formatarCpf, formatarCep, formatarData, nomeTitulo, enderecoCompleto } from '@/lib/documentos-pdf'

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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
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
  healthAnswer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  healthLabel: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    lineHeight: 1.4,
  },
  healthValue: {
    width: 34,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
  },
  bullet: {
    flexDirection: 'row',
    marginLeft: 4,
    marginBottom: 1.5,
  },
  bulletMarker: { width: 10, fontSize: 9.5, color: '#64748B' },
  bulletText: { flex: 1, fontSize: 10, color: '#1E293B', lineHeight: 1.4 },
  semInformacao: { fontSize: 10, color: '#64748B', fontStyle: 'italic', marginTop: 2 },
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

const DEFICIENCIAS_TEA: Record<string, string> = {
  cegueira: 'Cegueira',
  baixa_visao: 'Baixa Visão',
  visao_monocular: 'Visão Monocular',
  surdez: 'Surdez',
  deficiencia_auditiva: 'Deficiência Auditiva',
  surdocegueira: 'Surdocegueira',
  deficiencia_fisica: 'Deficiência Física',
  deficiencia_intelectual: 'Deficiência Intelectual',
  deficiencia_multipla: 'Deficiência Múltipla',
  tea: 'TEA (Transtorno do Espectro Autista)',
  altas_habilidades: 'Altas Habilidades / Superdotação',
}

const TRANSTORNOS: Record<string, string> = {
  transtorno_aprendizagem: 'Transtorno de Aprendizagem',
  discalculia: 'Discalculia',
  disgrafia: 'Disgrafia',
  dislalia: 'Dislalia',
  dislexia: 'Dislexia',
  tdah: 'TDAH',
  tpac: 'TPAC',
}

const RECURSOS_ACESSIBILIDADE: Record<string, string> = {
  auxilio_ledor: 'Auxílio Ledor',
  auxilio_transcricao: 'Auxílio Transcrição',
  guia_interprete: 'Guia Intérprete',
  tradutor_libras: 'Tradutor de Libras',
  leitura_labial: 'Leitura Labial',
  prova_ampliada: 'Prova Ampliada',
  prova_superampliada: 'Prova Superampliada',
  cd_audio: 'CD Áudio',
  prova_libras: 'Prova em Libras',
  prova_video_libras: 'Prova em Vídeo Libras',
  material_braille: 'Material em Braille',
  prova_braille: 'Prova em Braille',
  tempo_adicional: 'Tempo Adicional',
}

function nomeMunicipio(codigo: string | null | undefined): string {
  if (!codigo) return '—'
  const m = getMunicipioByCodigo(codigo)
  return m ? `${m.nome} - ${m.nomeUF}` : codigo
}

function rotulo(map: Record<string, string>, valor: string | null | undefined): string {
  if (!valor) return '—'
  return map[valor] || valor
}

function tiposAtivos(saude: SaudeFicha, mapa: Record<string, string>): string[] {
  return Object.entries(mapa)
    .filter(([key]) => Boolean((saude as Record<string, unknown>)[key]))
    .map(([, label]) => label)
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

function BulletList({ itens }: { itens: string[] }) {
  return (
    <View>
      {itens.map(item => (
        <View key={item} style={styles.bullet}>
          <Text style={styles.bulletMarker}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

export function FichaIndividualAluno({
  documento,
  responsavelNome,
  responsavelCargo,
}: {
  documento: DadosFichaIndividual
  responsavelNome?: string | null
  responsavelCargo?: string | null
}) {
  const { escola, aluno, saude, matricula } = documento
  const hoje = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  const nomeDestaque = escola.nome_fantasia || escola.nome_escola
  const endereco = enderecoCompleto(escola)
  const contato = [escola.telefone, escola.email, escola.site].filter(Boolean).join(' · ')
  const linhaDadosRodape = [endereco, contato].filter(Boolean).join(' · ')

  const deficienciasTea = tiposAtivos(saude, DEFICIENCIAS_TEA)
  const transtornos = tiposAtivos(saude, TRANSTORNOS)
  const recursos = tiposAtivos(saude, RECURSOS_ACESSIBILIDADE)
  const temSaude = deficienciasTea.length > 0 || transtornos.length > 0 || recursos.length > 0

  const turnos = matricula.turnos.length > 0 ? matricula.turnos.join(', ') : '—'
  const assinaturaNome = (responsavelNome ?? escola.responsavel_nome ?? '').trim()
  const assinaturaCargo = (responsavelCargo ?? escola.responsavel_cargo ?? '').trim()

  return (
    <Document
      title={`Ficha Individual do Aluno — ${nomeTitulo(aluno.nome_completo)}`}
      author={escola.nome_escola}
      subject="Ficha Individual do Aluno"
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
          <Text style={styles.title}>Ficha Individual do Aluno</Text>
          <Text style={styles.subtitle}>Dados cadastrais e acadêmicos consolidados</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Identificação</Text>
            <LinhaCampos campos={[{ label: 'Nome Completo', value: nomeTitulo(aluno.nome_completo) }]} />
            <LinhaCampos
              campos={[
                { label: 'Data de Nascimento', value: formatarData(aluno.data_nascimento), flex: 1.6 },
                { label: 'Sexo', value: rotulo(VALOR_DESCRICOES.sexo, aluno.sexo) },
                { label: 'Cor/Raça', value: rotulo(VALOR_DESCRICOES.cor_raca, aluno.cor_raca), flex: 1.1 },
              ]}
            />
            <LinhaCampos
              campos={[
                { label: 'CPF', value: formatarCpf(aluno.cpf) },
                { label: 'Nacionalidade', value: rotulo(VALOR_DESCRICOES.nacionalidade, aluno.nacionalidade), flex: 1.2 },
                { label: 'Naturalidade', value: nomeMunicipio(aluno.municipio_nascimento), flex: 1.4 },
              ]}
            />
            <LinhaCampos campos={[{ label: 'Identificação INEP', value: aluno.inep_id || '—' }]} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Filiação</Text>
            <LinhaCampos campos={[{ label: 'Filiação 1', value: nomeTitulo(aluno.filiacao_1) || '—' }]} />
            <LinhaCampos campos={[{ label: 'Filiação 2', value: nomeTitulo(aluno.filiacao_2) || '—' }]} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Endereço</Text>
            <LinhaCampos
              campos={[
                { label: 'CEP', value: formatarCep(aluno.cep) },
                { label: 'Município', value: nomeMunicipio(aluno.municipio_residencia) },
              ]}
            />
            <LinhaCampos
              campos={[
                { label: 'Logradouro', value: aluno.logradouro || '—', flex: 1.6 },
                { label: 'Número', value: aluno.numero || '—' },
              ]}
            />
            <LinhaCampos
              campos={[
                { label: 'Bairro', value: aluno.bairro || '—' },
                { label: 'Complemento', value: aluno.complemento || '—' },
              ]}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Condições de Saúde</Text>
            {!temSaude ? (
              <Text style={styles.semInformacao}>Não há informações de saúde cadastradas.</Text>
            ) : (
              <>
                <View style={styles.healthAnswer}>
                  <Text style={styles.healthLabel}>Possui Deficiência, TEA ou Altas Habilidades</Text>
                  <Text style={styles.healthValue}>{deficienciasTea.length > 0 ? 'Sim' : 'Não'}</Text>
                </View>
                {deficienciasTea.length > 0 && <BulletList itens={deficienciasTea} />}

                <View style={[styles.healthAnswer, { marginTop: 4 }]}>
                  <Text style={styles.healthLabel}>Possui transtornos que impactam a aprendizagem</Text>
                  <Text style={styles.healthValue}>{transtornos.length > 0 ? 'Sim' : 'Não'}</Text>
                </View>
                {transtornos.length > 0 && <BulletList itens={transtornos} />}

                {recursos.length > 0 && (
                  <>
                    <View style={[styles.healthAnswer, { marginTop: 4 }]}>
                      <Text style={styles.healthLabel}>Recursos de Acessibilidade</Text>
                      <Text style={styles.healthValue}>Sim</Text>
                    </View>
                    <BulletList itens={recursos} />
                  </>
                )}
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Dados de Matrícula</Text>
            <LinhaCampos
              campos={[
                { label: 'Ano Letivo', value: matricula.ano_letivo_descricao || '—' },
                { label: 'Data de Matrícula', value: formatarData(matricula.data_matricula), flex: 2 },
              ]}
            />
            <LinhaCampos campos={[{ label: 'Etapa de Ensino', value: matricula.etapa_nome || '—' }]} />
            <LinhaCampos
              campos={[
                { label: 'Turma', value: matricula.turma_nome },
                { label: 'Turno', value: turnos },
              ]}
            />
          </View>

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