'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, CalendarRange, Download, FileText, Loader2, PenLine, Search, ShieldAlert, User, X, AlertTriangle, type LucideIcon } from 'lucide-react'
import { buscarAlunosPorAnoLetivo, type AlunoResumidoDocumento } from '@/lib/actions/documentos'
import { getAnosLetivos, type AnoLetivo } from '@/lib/actions/calendarios'
import { type PeriodoBoletim } from '@/lib/actions/boletim'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { PageSection } from '@/components/layout/page-section'

export type DocumentoPdfProps = {
  documento: unknown
  responsavelNome?: string | null
  responsavelCargo?: string | null
}

export type DocumentoConfig = {
  id: string
  titulo: string
  descricao: string
  icone: LucideIcon
  carregarPdf: () => Promise<{ Componente: React.ComponentType<DocumentoPdfProps> }>
  buscarPeriodos?: (
    alunoId: string,
    anoLetivoId: string,
    schoolId: string,
    pessoaId: string | null
  ) => Promise<{ periodos: PeriodoBoletim[]; bloqueado: boolean; motivo: string | null }>
  buscarDados: (
    alunoId: string,
    anoLetivoId: string,
    schoolId: string,
    pessoaId: string | null,
    periodo?: number
  ) => Promise<unknown>
  nomeArquivo: (dados: unknown) => string
  altPreview: string
}

function formatarCpf(cpf: string | null | undefined): string {
  if (!cpf) return ''
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11) return cpf
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  const primeira = partes[0][0] || ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

async function rasterizarPdf(blob: Blob): Promise<string[]> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()

  const data = await blob.arrayBuffer()
  const doc = await pdfjs.getDocument({ data }).promise

  const imagens: string[] = []
  const escala = 1.4

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const viewport = page.getViewport({ scale: escala })
    const canvas = document.createElement('canvas')
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    const ctx = canvas.getContext('2d')
    if (!ctx) continue
    await page.render({ canvas, viewport }).promise
    imagens.push(canvas.toDataURL('image/png'))
  }

  return imagens
}

export default function DocumentoGerador({
  config,
  schoolId,
  pessoaId,
  onVoltar,
}: {
  config: DocumentoConfig
  schoolId: string
  pessoaId: string | null
  onVoltar: () => void
}) {
  const [anos, setAnos] = useState<AnoLetivo[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [buscandoAluno, setBuscandoAluno] = useState<AlunoResumidoDocumento | null>(null)

  const [openBusca, setOpenBusca] = useState(false)
  const [termo, setTermo] = useState('')
  const [resultados, setResultados] = useState<AlunoResumidoDocumento[]>([])
  const [loadingBusca, setLoadingBusca] = useState(false)
  const [erroBusca, setErroBusca] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [dados, setDados] = useState<unknown>(null)
  const [loadingDados, setLoadingDados] = useState(false)
  const [responsavelNome, setResponsavelNome] = useState('')
  const [responsavelCargo, setResponsavelCargo] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewImagens, setPreviewImagens] = useState<string[] | null>(null)
  const [previewErro, setPreviewErro] = useState<string | null>(null)
  const [baixando, setBaixando] = useState(false)

  const [periodos, setPeriodos] = useState<PeriodoBoletim[]>([])
  const [periodo, setPeriodo] = useState<number | null>(null)
  const [loadingPeriodos, setLoadingPeriodos] = useState(false)
  const [bloqueado, setBloqueado] = useState(false)
  const [motivoBloqueio, setMotivoBloqueio] = useState<string | null>(null)

  const gerando = !!dados && !previewUrl && !previewErro
  const rasterizando = !!dados && !!previewUrl && previewImagens === null && !previewErro

  useEffect(() => {
    if (!dados) return

    let cancelado = false
    const timer = setTimeout(async () => {
      try {
        const [{ pdf }, modulo] = await Promise.all([
          import('@react-pdf/renderer'),
          config.carregarPdf(),
        ])
        const Componente = modulo.Componente
        const blob = await pdf(
          <Componente
            documento={dados}
            responsavelNome={responsavelNome}
            responsavelCargo={responsavelCargo}
          />
        ).toBlob()
        if (cancelado) return
        setPreviewUrl(URL.createObjectURL(blob))
        setPreviewErro(null)

        try {
          const imagens = await rasterizarPdf(blob)
          if (cancelado) return
          setPreviewImagens(imagens)
        } catch {
          if (cancelado) return
          setPreviewImagens([])
          setPreviewErro('Não foi possível gerar a visualização do PDF. Use o botão "Baixar PDF".')
        }
      } catch (err) {
        if (cancelado) return
        setPreviewErro(err instanceof Error ? err.message : 'Erro ao gerar o PDF')
      }
    }, 400)

    return () => {
      cancelado = true
      clearTimeout(timer)
    }
  }, [dados, responsavelNome, responsavelCargo, config])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    getAnosLetivos(schoolId)
      .then(setAnos)
      .catch(err => toast.error(err?.message || 'Erro ao carregar anos letivos'))
  }, [schoolId])

  useEffect(() => {
    const buscarPeriodos = config.buscarPeriodos
    if (!buscarPeriodos || !buscandoAluno || !anoLetivoId) return

    let cancelado = false
    const timer = setTimeout(() => {
      if (cancelado) return
      setLoadingPeriodos(true)
      setBloqueado(false)
      setMotivoBloqueio(null)
      setPeriodos([])
      setPeriodo(null)

      buscarPeriodos(buscandoAluno.id, anoLetivoId, schoolId, pessoaId)
        .then(res => {
          if (cancelado) return
          setPeriodos(res.periodos)
          setBloqueado(res.bloqueado)
          setMotivoBloqueio(res.motivo)
        })
        .catch(err => {
          if (cancelado) return
          setBloqueado(true)
          setMotivoBloqueio(
            err instanceof Error ? err.message : 'Erro ao carregar os períodos de avaliação'
          )
        })
        .finally(() => {
          if (!cancelado) setLoadingPeriodos(false)
        })
    }, 0)

    return () => {
      cancelado = true
      clearTimeout(timer)
    }
  }, [config, buscandoAluno, anoLetivoId, schoolId, pessoaId])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (termo.trim().length < 3 || !anoLetivoId) {
        setResultados([])
        setErroBusca(null)
        return
      }
      setLoadingBusca(true)
      setErroBusca(null)
      try {
        const data = await buscarAlunosPorAnoLetivo(termo, anoLetivoId, schoolId, pessoaId)
        setResultados(data)
      } catch (err) {
        setResultados([])
        setErroBusca(err instanceof Error ? err.message : 'Erro ao buscar alunos')
      } finally {
        setLoadingBusca(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [termo, anoLetivoId, schoolId, pessoaId])

  useEffect(() => {
    if (!buscandoAluno || !anoLetivoId) return
    if (config.buscarPeriodos && periodo == null) return

    let cancelado = false
    const timer = setTimeout(() => {
      if (cancelado) return
      setLoadingDados(true)
      config
        .buscarDados(buscandoAluno.id, anoLetivoId, schoolId, pessoaId, periodo ?? undefined)
        .then(dados => {
          if (cancelado) return
          setDados(dados)
          const responsavel = (dados as {
            escola?: { responsavel_nome?: string; responsavel_cargo?: string }
          }).escola
          setResponsavelNome(responsavel?.responsavel_nome || '')
          setResponsavelCargo(responsavel?.responsavel_cargo || '')
        })
        .catch(err => {
          if (cancelado) return
          setDados(null)
          toast.error(err instanceof Error ? err.message : 'Erro ao carregar dados do documento')
        })
        .finally(() => {
          if (!cancelado) setLoadingDados(false)
        })
    }, 0)

    return () => {
      cancelado = true
      clearTimeout(timer)
    }
  }, [buscandoAluno, anoLetivoId, schoolId, pessoaId, config, periodo])

  const limparSelecao = () => {
    setBuscandoAluno(null)
    setDados(null)
    setResponsavelNome('')
    setResponsavelCargo('')
    setPreviewUrl(null)
    setPreviewImagens(null)
    setPreviewErro(null)
    setPeriodo(null)
    setPeriodos([])
    setBloqueado(false)
    setMotivoBloqueio(null)
  }

  const handleSelecionarAno = (value: string) => {
    setAnoLetivoId(value)
    limparSelecao()
    setResultados([])
    setTermo('')
  }

  const handleSelecionarPeriodo = (value: string) => {
    const ordem = Number(value)
    if (!ordem) return
    setPeriodo(ordem)
    setDados(null)
    setResponsavelNome('')
    setResponsavelCargo('')
    setPreviewUrl(null)
    setPreviewImagens(null)
    setPreviewErro(null)
  }

  const handleDownload = async () => {
    if (!dados) return
    setBaixando(true)
    try {
      let url = previewUrl
      if (!url) {
        const [{ pdf }, modulo] = await Promise.all([
          import('@react-pdf/renderer'),
          config.carregarPdf(),
        ])
        const Componente = modulo.Componente
        const blob = await pdf(
          <Componente
            documento={dados}
            responsavelNome={responsavelNome}
            responsavelCargo={responsavelCargo}
          />
        ).toBlob()
        url = URL.createObjectURL(blob)
      }
      const a = document.createElement('a')
      a.href = url
      a.download = config.nomeArquivo(dados)
      document.body.appendChild(a)
      a.click()
      a.remove()
      if (url !== previewUrl) URL.revokeObjectURL(url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar o PDF')
    } finally {
      setBaixando(false)
    }
  }

  return (
    <PageSection
      title={config.titulo}
      description={config.descricao}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onVoltar} className="gap-2 min-h-[40px]">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          {previewUrl && (
            <Button onClick={handleDownload} disabled={baixando} className="gap-2 min-h-[40px]">
              {baixando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Baixar PDF
            </Button>
          )}
        </div>
      }
    >
      <div
        className={`grid grid-cols-1 gap-4 mb-6 ${
          config.buscarPeriodos ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
        }`}
      >
        <div>
          <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
            Ano Letivo <span className="text-destructive">*</span>
          </Label>
          <Select value={anoLetivoId} onValueChange={handleSelecionarAno}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano letivo" />
            </SelectTrigger>
            <SelectContent>
              {anos.map(a => (
                <SelectItem key={a.id} value={a.id}>
                  {a.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
            Aluno <span className="text-destructive">*</span>
          </Label>
          <Popover open={openBusca} onOpenChange={setOpenBusca}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openBusca}
                aria-label="Buscar aluno por nome ou CPF"
                disabled={!anoLetivoId}
                className="relative w-full h-9 justify-start rounded-md border-border bg-card pl-10 pr-3 text-[14px] font-normal shadow-xs hover:bg-card"
              >
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                {buscandoAluno ? (
                  <>
                    <span className="truncate text-foreground">
                      {buscandoAluno.nome_completo}
                      {buscandoAluno.turma_nome ? ` — ${buscandoAluno.turma_nome}` : ''}
                    </span>
                    {!loadingDados && (
                      <X
                        onClick={e => {
                          e.stopPropagation()
                          limparSelecao()
                        }}
                        className="absolute right-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                        aria-label="Limpar seleção"
                      />
                    )}
                  </>
                ) : (
                  <span className="truncate text-muted-foreground">
                    {anoLetivoId ? 'Buscar por nome ou CPF...' : 'Selecione o ano letivo primeiro'}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command shouldFilter={false} loop>
                <div className="flex items-center border-b border-border px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <CommandInput
                    ref={inputRef}
                    value={termo}
                    onValueChange={setTermo}
                    placeholder="Digite pelo menos 3 caracteres..."
                    className="h-9 border-0 focus:ring-0 text-[14px]"
                    autoFocus
                  />
                  {loadingBusca && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
                <CommandList className="max-h-72">
                  {termo.length < 3 ? (
                    <div className="py-6 text-center text-[14px] text-muted-foreground">
                      Digite pelo menos 3 caracteres para buscar.
                    </div>
                  ) : erroBusca ? (
                    <div role="alert" className="py-4 px-3 text-center text-[14px] text-destructive">
                      {erroBusca}
                    </div>
                  ) : loadingBusca ? (
                    <div className="py-6 text-center text-[14px] text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" aria-hidden="true" />
                      Buscando...
                    </div>
                  ) : resultados.length === 0 ? (
                    <CommandEmpty>
                      <EmptyState
                        icon={User}
                        title="Nenhum aluno encontrado"
                        description="Não há alunos matriculados neste ano letivo para o termo informado."
                      />
                    </CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {resultados.map(p => (
                        <CommandItem
                          key={p.id}
                          value={p.nome_completo}
                          onSelect={() => {
                            limparSelecao()
                            setBuscandoAluno(p)
                            setOpenBusca(false)
                            setTermo('')
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-bold text-primary">
                              {iniciais(p.nome_completo)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[15px] font-semibold text-foreground">
                                {p.nome_completo}
                              </p>
                              <p className="text-[13px] text-muted-foreground">
                                {p.turma_nome || 'Sem turma'}
                                {p.situacao ? ` · ${p.situacao}` : ''}
                                {p.cpf ? ` · CPF ${formatarCpf(p.cpf)}` : ''}
                              </p>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {config.buscarPeriodos && (
          <div>
            <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
              Período de Avaliação <span className="text-destructive">*</span>
            </Label>
            <Select
              value={periodo ? String(periodo) : ''}
              onValueChange={handleSelecionarPeriodo}
              disabled={!buscandoAluno || loadingPeriodos || bloqueado}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingPeriodos
                      ? 'Carregando períodos...'
                      : bloqueado
                      ? 'Indisponível'
                      : 'Selecione o período'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {periodos.map(p => (
                  <SelectItem key={p.ordem} value={String(p.ordem)}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {loadingDados && (
        <div className="flex h-[560px] items-center justify-center rounded-md border border-border bg-card">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-[14px]">Carregando dados do aluno...</span>
          </div>
        </div>
      )}

      {!loadingDados && dados != null && (
        <>
          <div className="mb-5 rounded-md border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-1">
              <PenLine className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <p className="text-[14px] font-semibold text-foreground">Assinatura</p>
            </div>
            <p className="text-[13px] text-muted-foreground mb-4">
              Pré-preenchido com o padrão das Configurações de Documentos. Edite somente para esta emissão.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
                  Nome do responsável
                </Label>
                <Input
                  value={responsavelNome}
                  onChange={e => setResponsavelNome(e.target.value)}
                  placeholder="Nome de quem assina este documento"
                  className="h-9"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-[14px] font-medium text-foreground">Cargo</Label>
                <Input
                  value={responsavelCargo}
                  onChange={e => setResponsavelCargo(e.target.value)}
                  placeholder="Cargo de quem assina este documento"
                  className="h-9"
                />
              </div>
            </div>
          </div>

          {gerando && (
            <div className="flex h-[560px] items-center justify-center rounded-md border border-border bg-muted/20">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-[14px]">Gerando PDF...</span>
              </div>
            </div>
          )}

          {rasterizando && (
            <div className="flex h-[560px] items-center justify-center rounded-md border border-border bg-muted/20">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-[14px]">Preparando visualização...</span>
              </div>
            </div>
          )}

          {!gerando && !rasterizando && previewErro && (
            <EmptyState icon={AlertTriangle} title="Erro ao gerar o PDF" description={previewErro} />
          )}

          {!gerando && !rasterizando && !previewErro && previewImagens && previewImagens.length > 0 && (
            <div className="max-h-[560px] overflow-y-auto space-y-4 rounded-md border border-border bg-card p-4">
              {previewImagens.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`Página ${i + 1} de ${config.altPreview}`}
                  className="w-full rounded-sm border border-border bg-card"
                />
              ))}
            </div>
          )}
        </>
      )}

      {!loadingDados && !dados && anoLetivoId && !buscandoAluno && (
        <EmptyState
          icon={FileText}
          title="Selecione um aluno"
          description="Busque e selecione o aluno para gerar o documento."
        />
      )}

      {config.buscarPeriodos && buscandoAluno && !loadingPeriodos && bloqueado && (
        <EmptyState
          icon={ShieldAlert}
          title="Boletim Numérico indisponível"
          description={motivoBloqueio || 'O Boletim Numérico não está disponível para esta turma.'}
        />
      )}

      {config.buscarPeriodos &&
        buscandoAluno &&
        !loadingPeriodos &&
        !bloqueado &&
        periodo == null && (
          <EmptyState
            icon={CalendarRange}
            title="Selecione o período de avaliação"
            description="Escolha o período para gerar o Boletim Escolar."
          />
        )}
    </PageSection>
  )
}