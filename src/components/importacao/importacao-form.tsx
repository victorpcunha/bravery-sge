'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { PageSection } from '@/components/layout/page-section'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { ArrowRight, Check, GraduationCap, Briefcase, Loader2, RotateCcw, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  confirmarLoteImportacao,
  validarLoteImportacao,
} from '@/lib/actions/importacao'
import {
  RECURSO_IMPORTACAO,
  rotuloTipo,
  type LinhaArquivo,
  type ResultadoLote,
  type TipoImportacao,
} from '@/lib/importacao-modelos'
import { ArquivoUpload } from './arquivo-upload'
import { ModeloDownload } from './modelo-download'
import { ResultadoLote as ResultadoLoteView } from './resultado-lote'

type Fase = 'edicao' | 'validando' | 'revisao' | 'confirmando' | 'concluido'

const TIPOS: { valor: TipoImportacao; titulo: string; descricao: string; icone: typeof GraduationCap }[] = [
  {
    valor: 'aluno',
    titulo: 'Alunos',
    descricao: '5 colunas: nome, CPF, nascimento, sexo e matrícula da certidão (obrigatória só sem CPF).',
    icone: GraduationCap,
  },
  {
    valor: 'profissional',
    titulo: 'Profissionais',
    descricao: '5 colunas: nome, CPF, nascimento, sexo e e-mail. O vínculo é completado depois na tela de Usuários.',
    icone: Briefcase,
  },
]

export function ImportacaoForm() {
  const { schoolId, allSchools, isSuperAdmin, pessoaId } = useAuth()
  const [escola, setEscola] = useState<string>('')
  const [tipo, setTipo] = useState<TipoImportacao | null>(null)
  const [arquivoNome, setArquivoNome] = useState<string | null>(null)
  const [linhas, setLinhas] = useState<LinhaArquivo[]>([])
  const [cabecalho, setCabecalho] = useState<string[]>([])
  const [resultado, setResultado] = useState<ResultadoLote | null>(null)
  const [fase, setFase] = useState<Fase>('edicao')
  const [erroGeral, setErroGeral] = useState<string | null>(null)

  const { loaded: permLoaded, pode, isSetup } = usePermissoes(escola || schoolId)

  useEffect(() => {
    if (schoolId) {
      setEscola(schoolId)
    } else if (isSuperAdmin && allSchools.length === 1) {
      setEscola(allSchools[0].id)
    }
  }, [schoolId, isSuperAdmin, allSchools])

  const ocupado = fase === 'validando' || fase === 'confirmando'
  const escolaEfetiva = schoolId || escola
  const mostraForm = !permLoaded || isSuperAdmin || isSetup || pode.visualizar(RECURSO_IMPORTACAO)
  const podeConfirmar = permLoaded && (isSuperAdmin || isSetup || pode.criar(RECURSO_IMPORTACAO))

  function resetarLote() {
    setArquivoNome(null)
    setLinhas([])
    setCabecalho([])
    setResultado(null)
    setErroGeral(null)
    setFase('edicao')
  }

  function trocarTipo(novo: TipoImportacao) {
    setTipo(novo)
    resetarLote()
  }

  function trocarEscola(nova: string) {
    setEscola(nova)
    resetarLote()
  }

  async function handleValidar() {
    if (!escolaEfetiva || !tipo || linhas.length === 0) return
    setFase('validando')
    setErroGeral(null)
    try {
      const res = await validarLoteImportacao(escolaEfetiva, tipo, linhas, pessoaId, cabecalho)
      setResultado(res)
      setFase('revisao')
      if (res.erros.length === 0) {
        toast.success(`Arquivo válido: ${res.totalRecebidas} ${res.totalRecebidas === 1 ? 'linha pronta' : 'linhas prontas'} para importar.`)
      } else {
        toast.warning(`Validação concluída: ${res.erros.length} ${res.erros.length === 1 ? 'erro encontrado' : 'erros encontrados'}.`)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Não foi possível validar o arquivo.'
      setErroGeral(msg)
      setFase('edicao')
      toast.error(msg)
    }
  }

  async function handleConfirmar() {
    if (!escolaEfetiva || !tipo || linhas.length === 0) return
    setFase('confirmando')
    setErroGeral(null)
    try {
      const res = await confirmarLoteImportacao(escolaEfetiva, tipo, linhas, pessoaId, cabecalho)
      setResultado(res)
      setFase('concluido')
      toast.success(`Importação concluída: ${res.totalCriadas} ${res.totalCriadas === 1 ? 'registro criado' : 'registros criados'}.`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Não foi possível concluir a importação.'
      setErroGeral(msg)
      setFase('revisao')
      toast.error(msg)
    }
  }

  if (!mostraForm) {
    return (
      <Card>
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem acesso à Importação Inicial. Fale com o gestor da unidade."
        />
      </Card>
    )
  }

  const validas = resultado ? resultado.totalRecebidas - resultado.erros.length : 0

  return (
    <div className="space-y-6">
      <PageSection title="1. Unidade escolar" description="Os usuários importados pertencerão a esta unidade.">
        {schoolId ? (
          <p className="text-[15px] font-medium text-foreground">
            {allSchools.find((e) => e.id === schoolId)?.nome_escola || 'Sua unidade escolar'}
          </p>
        ) : (
          <Select value={escola} onValueChange={trocarEscola} disabled={ocupado}>
            <SelectTrigger className="w-full sm:max-w-md" aria-label="Unidade escolar">
              <SelectValue placeholder="Selecione a unidade escolar" />
            </SelectTrigger>
            <SelectContent>
              {allSchools.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.nome_escola}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </PageSection>

      <PageSection title="2. Tipo de envio" description="Cada tipo tem seu próprio modelo de arquivo.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPOS.map((t) => {
            const Icone = t.icone
            const ativo = tipo === t.valor
            return (
              <button
                key={t.valor}
                type="button"
                aria-pressed={ativo}
                disabled={ocupado}
                onClick={() => trocarTipo(t.valor)}
                className={cn(
                  'relative rounded-lg border p-4 text-left transition-colors min-h-[44px]',
                  ativo
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50',
                )}
              >
                {ativo && (
                  <span className="absolute right-3 top-3 rounded-full bg-primary p-1" aria-hidden="true">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Icone className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-[16px] font-semibold text-foreground">{t.titulo}</span>
                </span>
                <span className="mt-1 block text-[13px] text-muted-foreground">{t.descricao}</span>
              </button>
            )
          })}
        </div>
      </PageSection>

      {tipo && (
        <PageSection
          title={`3. Arquivo de ${rotuloTipo(tipo).toLowerCase()}`}
          description="Baixe o modelo, preencha e envie o CSV."
          actions={<ModeloDownload tipo={tipo} />}
        >
          <ArquivoUpload
            tipo={tipo}
            disabled={ocupado || !escolaEfetiva}
            arquivoAtual={arquivoNome}
            onArquivoLido={(nome, lidas, cab) => {
              setArquivoNome(nome)
              setLinhas(lidas)
              setCabecalho(cab)
              setResultado(null)
              setErroGeral(null)
              setFase('edicao')
            }}
            onErroLeitura={(msg) => {
              setErroGeral(msg)
              toast.error(msg)
            }}
            onLimpar={resetarLote}
          />
          {!escolaEfetiva && (
            <p className="text-[13px] text-muted-foreground mt-2" role="alert">
              Selecione a unidade escolar antes de enviar o arquivo.
            </p>
          )}
          {erroGeral && fase === 'edicao' && (
            <p className="text-[14px] font-medium text-destructive mt-2" role="alert">
              {erroGeral}
            </p>
          )}
          {linhas.length > 0 && fase === 'edicao' && (
            <div className="mt-4 flex justify-end">
              <Button type="button" className="min-h-[44px]" onClick={() => void handleValidar()}>
                Validar arquivo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </PageSection>
      )}

      {(fase === 'validando' || fase === 'revisao' || fase === 'confirmando' || fase === 'concluido') && resultado && (
        <PageSection
          title={fase === 'concluido' ? '4. Resultado da importação' : '4. Revisão da validação'}
          description={
            fase === 'concluido'
              ? 'Registros criados na unidade. As linhas rejeitadas podem ser corrigidas e reenviadas.'
              : 'Confira o resultado antes de confirmar. Só as linhas válidas serão criadas.'
          }
        >
          {(fase === 'validando' || fase === 'confirmando') && (
            <div className="flex items-center gap-2 text-[14px] text-muted-foreground mb-4" role="status">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {fase === 'validando' ? 'Validando linhas…' : 'Criando registros…'}
            </div>
          )}
          <ResultadoLoteView resultado={resultado} modo={fase === 'concluido' ? 'conclusao' : 'validacao'} />
          {erroGeral && (
            <p className="text-[14px] font-medium text-destructive mt-3" role="alert">
              {erroGeral}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2 flex-wrap">
            {fase === 'concluido' ? (
              <Button type="button" variant="outline" className="min-h-[44px]" onClick={resetarLote}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Nova importação
              </Button>
            ) : (
              <Button
                type="button"
                className="min-h-[44px]"
                disabled={ocupado || validas === 0 || !podeConfirmar}
                onClick={() => void handleConfirmar()}
                title={!podeConfirmar ? 'Você não tem permissão para confirmar importações' : undefined}
              >
                {fase === 'confirmando' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                Confirmar importação ({validas})
              </Button>
            )}
          </div>
        </PageSection>
      )}
    </div>
  )
}
